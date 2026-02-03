"""
Date and time formatting utilities using clinic settings
"""
from datetime import datetime, date, time
from typing import Optional
import pytz


def format_date(
    date_obj: date,
    date_format: str = "MM/DD/YYYY",
    timezone: str = "America/New_York"
) -> str:
    """Format a date according to clinic settings"""
    if date_format == "DD/MM/YYYY":
        return date_obj.strftime("%d/%m/%Y")
    elif date_format == "YYYY-MM-DD":
        return date_obj.strftime("%Y-%m-%d")
    else:  # MM/DD/YYYY (default)
        return date_obj.strftime("%m/%d/%Y")


def format_time(
    time_obj: time,
    time_format: str = "12h"
) -> str:
    """Format a time according to clinic settings"""
    if time_format == "24h":
        return time_obj.strftime("%H:%M")
    else:  # 12h (default)
        return time_obj.strftime("%I:%M %p")


def format_datetime(
    datetime_obj: datetime,
    date_format: str = "MM/DD/YYYY",
    time_format: str = "12h",
    timezone: str = "America/New_York"
) -> str:
    """Format a datetime according to clinic settings"""
    # Convert to clinic timezone if datetime is timezone-aware
    if datetime_obj.tzinfo is not None:
        try:
            tz = pytz.timezone(timezone)
            datetime_obj = datetime_obj.astimezone(tz)
        except Exception:
            pass  # If timezone conversion fails, use as-is
    
    date_str = format_date(datetime_obj.date(), date_format, timezone)
    time_str = format_time(datetime_obj.time(), time_format)
    
    return f"{date_str} {time_str}"


def format_date_long(
    date_obj: date,
    timezone: str = "America/New_York"
) -> str:
    """Format a date for long display (e.g., "Monday, January 15, 2026")"""
    return date_obj.strftime("%A, %B %d, %Y")


def format_date_short(
    date_obj: date,
    date_format: str = "MM/DD/YYYY"
) -> str:
    """Format a date for short display (e.g., "Jan 15" or "15 Jan")"""
    if date_format == "DD/MM/YYYY":
        return date_obj.strftime("%d %b")
    else:  # MM/DD/YYYY or YYYY-MM-DD
        return date_obj.strftime("%b %d")

