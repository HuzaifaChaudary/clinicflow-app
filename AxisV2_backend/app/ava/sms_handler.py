"""
SMS Handler — Twilio SMS Webhook + OpenAI Chat Completions
Handles inbound SMS messages via Twilio webhook, uses OpenAI gpt-5.1 (reasoning) for responses.
Supports function calling to submit intake data to the waitlist API.

Flow:
1. Patient texts the Twilio number
2. Twilio hits /api/sms webhook with the message
3. We look up conversation history (in-memory)
4. Send to OpenAI gpt-5.1 with system prompt + history + tools
5. If OpenAI calls submit_waitlist, we post to the waitlist API and feed result back
6. Return TwiML MessagingResponse with Ava's reply
"""

import os
import json
import asyncio
import logging
from datetime import datetime, timedelta
from collections import defaultdict
from openai import OpenAI
from twilio.twiml.messaging_response import MessagingResponse

from app.ava.prompts import SMS_SYSTEM_PROMPT, SMS_GREETING_TEMPLATE, SUBMIT_WAITLIST_TOOL_CHAT
from app.ava.waitlist_submit import submit_to_waitlist

logger = logging.getLogger("ava.sms")

# In-memory conversation store: {phone_number: {"messages": [...], "last_active": datetime}}
# Conversations expire after 24 hours of inactivity
_conversations: dict[str, dict] = defaultdict(lambda: {
    "messages": [],
    "last_active": datetime.now(),
})

# Max conversation history to send to OpenAI (keeps context window small & fast)
MAX_HISTORY_MESSAGES = 30

# Conversation expiry
CONVERSATION_EXPIRY_HOURS = 24


def _get_openai_client() -> OpenAI:
    """Get OpenAI client instance."""
    return OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))


def _cleanup_expired():
    """Remove conversations older than CONVERSATION_EXPIRY_HOURS."""
    cutoff = datetime.now() - timedelta(hours=CONVERSATION_EXPIRY_HOURS)
    expired = [phone for phone, conv in _conversations.items() if conv["last_active"] < cutoff]
    for phone in expired:
        del _conversations[phone]


def _get_conversation(phone: str) -> list[dict]:
    """Get conversation history for a phone number."""
    _cleanup_expired()
    conv = _conversations[phone]
    conv["last_active"] = datetime.now()
    return conv["messages"]


def _add_message(phone: str, role: str, content: str):
    """Add a message to conversation history."""
    conv = _conversations[phone]
    conv["messages"].append({"role": role, "content": content})
    conv["last_active"] = datetime.now()
    # Trim to max history
    if len(conv["messages"]) > MAX_HISTORY_MESSAGES:
        conv["messages"] = conv["messages"][-MAX_HISTORY_MESSAGES:]


def _add_tool_call(phone: str, tool_call_id: str, fn_name: str, fn_args: str):
    """Add a tool call assistant message to conversation history."""
    conv = _conversations[phone]
    conv["messages"].append({
        "role": "assistant",
        "content": None,
        "tool_calls": [{
            "id": tool_call_id,
            "type": "function",
            "function": {"name": fn_name, "arguments": fn_args},
        }],
    })
    conv["last_active"] = datetime.now()


def _add_tool_result(phone: str, tool_call_id: str, result: str):
    """Add a tool result message to conversation history."""
    conv = _conversations[phone]
    conv["messages"].append({
        "role": "tool",
        "tool_call_id": tool_call_id,
        "content": result,
    })
    conv["last_active"] = datetime.now()


async def handle_incoming_sms(from_number: str, body: str) -> str:
    """
    Process an incoming SMS and return Ava's response text.

    Args:
        from_number: The sender's phone number (E.164 format)
        body: The SMS message body

    Returns:
        Ava's response text string
    """
    logger.info(f"SMS from {from_number}: {body}")

    # Get conversation history
    history = _get_conversation(from_number)

    # Check if this is a brand new conversation
    is_new = len(history) == 0

    # Add the incoming message to history
    _add_message(from_number, "user", body)

    # Build messages for OpenAI
    messages = [
        {"role": "system", "content": SMS_SYSTEM_PROMPT},
    ]

    # If new conversation, add context
    if is_new:
        messages.append({
            "role": "system",
            "content": "This is the start of a new conversation. Greet them warmly and start with Question 1 (full name).",
        })

    # Add conversation history (includes the current message)
    messages.extend(_get_conversation(from_number))

    try:
        client = _get_openai_client()

        # Use gpt-5.1 for reasoning, with function calling
        response = client.chat.completions.create(
            model="gpt-5.1",
            reasoning_effort="high",
            messages=messages,
            max_tokens=256,
            temperature=0.7,
            tools=[SUBMIT_WAITLIST_TOOL_CHAT],
            tool_choice="auto",
        )

        choice = response.choices[0]

        # Check if the model wants to call a function
        if choice.finish_reason == "tool_calls" and choice.message.tool_calls:
            tool_call = choice.message.tool_calls[0]
            fn_name = tool_call.function.name
            fn_args = tool_call.function.arguments

            logger.info(f"SMS function call: {fn_name} for {from_number}")

            if fn_name == "submit_waitlist":
                # Record the tool call in history
                _add_tool_call(from_number, tool_call.id, fn_name, fn_args)

                # Submit to waitlist API
                args = json.loads(fn_args)
                success = await submit_to_waitlist(args, phone=from_number)

                if success:
                    result = json.dumps({"success": True, "message": "Submitted successfully. Tell the user they're all set and someone will follow up soon."})
                else:
                    result = json.dumps({"success": False, "message": "Had an issue but we captured the info. Reassure the user."})

                # Record the tool result
                _add_tool_result(from_number, tool_call.id, result)

                # Call OpenAI again to get Ava's final text response
                followup_messages = [
                    {"role": "system", "content": SMS_SYSTEM_PROMPT},
                ] + _get_conversation(from_number)

                followup = client.chat.completions.create(
                    model="gpt-5.1",
                    reasoning_effort="high",
                    messages=followup_messages,
                    max_tokens=256,
                    temperature=0.7,
                )

                ava_reply = followup.choices[0].message.content.strip()
            else:
                ava_reply = "I'm here to help with your clinic intake. Let's continue!"
        else:
            # Normal text response
            ava_reply = choice.message.content.strip()

        # Add Ava's reply to history
        _add_message(from_number, "assistant", ava_reply)

        logger.info(f"Ava reply to {from_number}: {ava_reply}")
        return ava_reply

    except Exception as e:
        logger.error(f"OpenAI error for SMS: {e}", exc_info=True)
        return "I'm having a little trouble right now. Please try again in a moment, or call us directly."


def build_twiml_response(ava_text: str) -> str:
    """
    Build a TwiML MessagingResponse XML string.

    Args:
        ava_text: The text Ava wants to send back

    Returns:
        TwiML XML string
    """
    resp = MessagingResponse()
    resp.message(ava_text)
    return str(resp)
