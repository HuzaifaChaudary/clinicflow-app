# Voice vs SMS Conversational Flow System

**Status:** ✅ Complete  
**Date:** January 2026  
**Scope:** Refined conversational flow components only

---

## 🎯 Core Principle

**Voice and SMS must feel related, but never visually identical.**

When they appear together:
- Voice must look more confident
- SMS must look more uncertain
- Structural differences required (color intensity alone is not enough)

**If Voice feels like calm control, SMS should feel like quiet risk.**

---

## 📐 VOICE FLOW — "Interruptive, decisive, immediate"

### **Visual Language**

Voice calls demand attention. Design feels active, linear, authoritative.

**Core Characteristics:**
- Dominant Clinicflow Blue (#2563EB)
- White text on blue for system messages
- Strong directional arrows
- Clear vertical progression
- Fewer steps, stronger emphasis per step

### **Components**

**1. Left Rail (Spine)**

```css
Vertical line:
- width: 2px
- color: var(--blue-primary) / 20%

Nodes (circular):
- size: 64px (w-16, h-16)
- Active: bg-[#2563EB], white icon, glow shadow
- Passed: bg-[#2563EB]/70%, white icon
- Inactive: bg-[#E5E7EB], muted icon
```

**Active Node Animation:**
```tsx
scale: [1, 1.05, 1]
duration: 2s
repeat: Infinity
ease: easeInOut
```

**2. System Message Card (PRIMARY MOMENT)**

This is the most important visual element in Voice flow.

```tsx
<div className="bg-[var(--blue-primary)] text-white">
  <div className="opacity-75">Clinicflow System</div>
  <p>Press 1 to confirm, or press 2 to reschedule.</p>
</div>
```

**Specifications:**
- Background: #2563EB (solid blue, no gradient)
- Text: #FFFFFF (white)
- Label: "Clinicflow System" at 75% opacity white
- No border
- Shadow: 0 4px 16px rgba(37, 99, 235, 0.3)
- Rounded corners with pointed top-left (rounded-tl-sm)
- Max-width: 85%
- Alignment: Left (system speaks first)

**3. Patient Response (if exists)**

```tsx
<div className="bg-white border text-[var(--foreground)]">
  <div className="text-muted">Patient</div>
  <p>Presses 1 to confirm</p>
</div>
```

**Specifications:**
- Background: white
- Border: 1px solid var(--glass-border)
- Text: default foreground
- Label: "Patient" (muted)
- Rounded corners with pointed top-right
- Max-width: 75%
- Alignment: Right (patient responds)

**4. Outcome Card (SECONDARY)**

White background, interactive hover state.

```tsx
// Default
background: white
border: 1px solid var(--glass-border)
shadow: var(--shadow-soft)

// Hover
background: var(--blue-clinical-hover) /* #EEF5FF */
border: 1.5px solid var(--blue-primary)/40
transform: translateY(-4px)
shadow: 0 8px 24px rgba(37, 99, 235, 0.12)
```

### **Layout Rules**

1. Blue system message appears immediately after "Patient reached"
2. System message visually connects to left rail (aligned, not floating)
3. Explanation cards are secondary and white
4. Vertical spine runs full height

### **Animation Rules**

```tsx
// Entry animation (as one unit)
Node + System Card:
  initial: { opacity: 0, y: 40 }
  animate: { opacity: 1, y: 0 }
  duration: 0.6s
  delay: 0.1s

// Stagger
System message: delay 0.2s
Patient response: delay 0.4s
Outcome card: delay 0.6s
```

**Motion is subtle:**
- Fade + slight upward movement
- No staggered decorative animations
- Single cohesive unit

### **Meaning Conveyed**

Voice feels like:
- ✅ The system speaks (blue authority)
- ✅ The patient decides (clear choice)
- ✅ The clinic moves on (instant sync)

---

## 📱 SMS FLOW — "Passive, asynchronous, fragile"

### **Visual Language**

SMS is easy to ignore. Design feels fragmented, delayed, less reliable.

**Core Characteristics:**
- Light blue surfaces (#EFF6FF), NOT solid blue
- White background dominates
- Thin connectors, not bold arrows
- Horizontal or staggered layout
- Multiple micro-states (sent, delivered, seen, no-response)

### **Components**

**1. Message Bubbles (Light Blue)**

```tsx
<div className="bg-[#EFF6FF]">
  <p className="text-[#1E3A8A]">Reminder: You have...</p>
  
  {/* Status indicator */}
  <div className="flex items-center gap-2">
    <div className="w-1.5 h-1.5 rounded-full bg-[#60A5FA]" />
    <span className="text-xs text-muted">Delivered</span>
  </div>
</div>
```

**Specifications:**
- Background: #EFF6FF (light blue, NOT solid #2563EB)
- Text: #1E3A8A (dark blue)
- Rounded corners with pointed top-left
- Max-width: 75%
- Alignment: Left
- Shadow: soft (shadow-sm)
- Padding: 20px (p-5)

**2. Status Indicators**

Four states with color-coded dots:

| Status | Dot Color | Meaning |
|--------|-----------|---------|
| Sent | #9CA3AF (gray) | Message sent, not delivered |
| Delivered | #60A5FA (blue) | Message reached device |
| Seen | #2563EB (strong blue) | Patient opened message |
| No Response | #E5E7EB (light gray) | Patient ignored |

**Visual:**
```tsx
<div className="flex items-center gap-2">
  <div className="w-1.5 h-1.5 rounded-full bg-[color]" />
  <span className="text-xs text-muted capitalize">{status}</span>
</div>
```

**3. Failure States (No Response)**

When SMS gets no response:

```tsx
// Greyed bubble
className="bg-[#F3F4F6] opacity-60"

// Dotted connector (broken)
<div className="border-l-2 border-dashed border-[#E5E7EB]" />

// Visual gap (silence)
<div className="flex justify-center py-6">
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 rounded-full bg-[#E5E7EB]" />
    <div className="w-2 h-2 rounded-full bg-[#E5E7EB]" />
    <div className="w-2 h-2 rounded-full bg-[#E5E7EB]" />
  </div>
</div>
```

**Represents:** Waiting, uncertainty, no commitment

**4. Patient Response (if exists)**

```tsx
<div className="bg-white border">
  <p className="text-sm">Yes, I'll be there</p>
</div>
```

Only appears if status !== 'no-response'

**5. Outcome Card (Subtle)**

```tsx
<div className="p-6 bg-white border/50 shadow-sm">
  <h4 className="text-base">{title}</h4>
  <p className="text-sm text-muted">{description}</p>
  
  {metric && (
    <div className="px-3 py-1 bg-[#EFF6FF] text-[#1E3A8A]">
      {metric}
    </div>
  )}
</div>
```

**More subtle than Voice:**
- Lighter border (border/50)
- Smaller shadow (shadow-sm)
- No hover lift
- Metric badge: light blue, not interactive

### **Layout Rules**

1. Non-linear, staggered (not strict vertical spine)
2. Avoid strong arrows
3. Allow visual gaps for waiting/missed responses
4. Thin connectors (1px solid or dashed)
5. Centered max-width container (max-w-4xl)

### **Animation Rules**

```tsx
// Messages appear one-by-one with delays
initial: { opacity: 0, y: 30 }
animate: { opacity: 1, y: 0 }
duration: 0.6s
delay: index * 0.15  // Staggered

// Some messages never resolve (no-response)
// No strong completion moment
```

**Motion characteristics:**
- Smaller movements (y: 30 vs 40)
- Longer delays between elements
- Some animations never complete (gaps remain)

### **Meaning Conveyed**

SMS feels like:
- ❓ Maybe they'll respond
- ❓ Maybe they won't
- ⏳ The clinic waits

---

## ⚖️ Explicit Comparison

### **When Voice and SMS appear on the same page:**

| Aspect | Voice | SMS |
|--------|-------|-----|
| **System message bg** | Solid blue (#2563EB) | Light blue (#EFF6FF) |
| **System message text** | White | Dark blue (#1E3A8A) |
| **Layout** | Vertical spine, linear | Staggered, non-linear |
| **Connectors** | 2px solid, strong | 1px thin, sometimes dashed |
| **Nodes** | 64px circles, prominent | No nodes (implicit flow) |
| **Status indicators** | None (immediate) | Sent/Delivered/Seen/No-response |
| **Failure visualization** | N/A (voice always reaches) | Greyed bubbles, gaps, dots |
| **Completion** | Strong (metrics in badges) | Weak (inline text) |
| **Visual weight** | Heavy, authoritative | Light, uncertain |
| **Spacing** | Tighter, purposeful | Looser, implies waiting |
| **Shadow depth** | Stronger (0 4px 16px) | Softer (shadow-sm) |

### **Structural Differences (Critical)**

**Voice:**
- Left rail with spine
- System messages dominant (85% width)
- Clear progression top-to-bottom
- Blue is the hero

**SMS:**
- Centered, no spine
- System messages smaller (75% width)
- Fragmented, gaps for silence
- White is the hero, blue is accent

**Color intensity alone is NOT enough.**

---

## 🚫 Hard Constraints

**Do NOT:**
- ❌ Reuse the same visualization layout across Voice/SMS
- ❌ Turn SMS into blue cards (keep light blue bubbles)
- ❌ Soften Voice into chat bubbles (keep strong blue)
- ❌ Add decorative animations
- ❌ Add copy beyond what exists

**Always:**
- ✅ Ensure Voice looks more confident
- ✅ Ensure SMS looks more uncertain
- ✅ Maintain structural differences
- ✅ Use status indicators only for SMS
- ✅ Show failure states only in SMS

---

## ✅ Success Criteria

**The design is correct only if:**

1. A clinic owner can instantly feel why Voice works better
2. The difference is understood without reading text
3. Voice feels like certainty
4. SMS feels like chance

**If both flows feel equally "nice," the design has failed.**

---

## 📊 Visual Comparison Example

### **Voice Flow Structure:**

```
┌─────────┐  ┌───────────────────────────────────┐
│    ●    │  │ [BLUE SYSTEM MESSAGE]             │
│    │    │  │ "Press 1 to confirm..."           │
│    │    │  │                                   │
│    ●    │  │              [Patient Response]   │
│    │    │  │              "Presses 1"          │
│    │    │  │                                   │
│    │    │  │ [White Outcome Card]              │
│    ●    │  │ Interactive, lifts on hover       │
└─────────┘  └───────────────────────────────────┘
```

### **SMS Flow Structure:**

```
     ┌─────────────────────────────┐
     │ [Light blue bubble]         │
     │ "Reminder: You have..."     │
     │ ○ Delivered                 │
     └─────────────────────────────┘
     
           . . .  (waiting)
     
     ┌─────────────────────────────┐
     │ [Greyed bubble]             │
     │ "Please confirm..."         │
     │ ○ No response               │
     └─────────────────────────────┘
     
     ┊  (broken connector)
```

---

## 📂 Implementation Details

### **Component Structure**

```tsx
// Main component with variant prop
<ConversationalFlow 
  steps={steps} 
  variant="voice" | "sms" 
/>

// Internal routing
if (variant === 'sms') {
  return <SMSFlow ... />
}
return <VoiceFlow ... />
```

### **Voice Card Hierarchy**

```tsx
1. System message (blue, prominent)
2. Patient response (white, if exists)
3. Outcome card (white, interactive)
```

### **SMS Card Hierarchy**

```tsx
1. System message (light blue, status indicator)
2. Gap or patient response (conditional)
3. Outcome card (subtle, non-interactive)
4. Connector line (thin/dashed if failure)
```

---

## 🎨 Color Palette Summary

### **Voice Colors**

| Element | Color | Hex |
|---------|-------|-----|
| System message bg | Blue Primary | #2563EB |
| System message text | White | #FFFFFF |
| Active node | Blue Primary | #2563EB |
| Inactive node | Light Slate | #E5E7EB |
| Patient bubble bg | White | #FFFFFF |
| Outcome hover bg | Clinical Blue | #EEF5FF |

### **SMS Colors**

| Element | Color | Hex |
|---------|-------|-----|
| System message bg | Light Blue | #EFF6FF |
| System message text | Dark Blue | #1E3A8A |
| Status dot (sent) | Gray | #9CA3AF |
| Status dot (delivered) | Blue | #60A5FA |
| Status dot (seen) | Strong Blue | #2563EB |
| Status dot (no-response) | Light Gray | #E5E7EB |
| Failure bubble bg | Light Gray | #F3F4F6 |
| Patient bubble bg | White | #FFFFFF |

---

## 🚀 Usage Examples

### **Voice Page**

```tsx
const voiceSteps: ConversationFlowStep[] = [
  {
    id: 'call-initiated',
    label: 'Call initiated',
    icon: Phone,
    conversation: {
      system: 'Hi, this is Clinicflow calling...',
      patient: undefined
    },
    outcome: {
      title: 'Patient reached',
      description: 'System places call automatically',
      metric: '24-48h'
    }
  }
];

<ConversationalFlow steps={voiceSteps} variant="voice" />
```

### **SMS Comparison Page**

```tsx
const smsSteps: ConversationFlowStep[] = [
  {
    id: 'text-sent',
    label: 'Text sent',
    icon: MessageSquare,
    conversation: {
      system: 'Reminder: You have an appointment...',
      patient: undefined,
      status: 'no-response'  // SMS-specific
    },
    outcome: {
      title: 'No response received',
      description: 'Patient may have missed the message',
      metric: '60% ignore rate'
    }
  }
];

<ConversationalFlow steps={smsSteps} variant="sms" />
```

---

## 💡 Design Intent

### **Voice conveys:**
- Authority (blue dominance)
- Immediacy (no waiting gaps)
- Certainty (strong completion)
- Control (system speaks, patient responds now)

### **SMS conveys:**
- Passivity (light blue, white dominant)
- Delay (gaps, status indicators)
- Uncertainty (no-response states)
- Risk (broken connectors, greyed bubbles)

**The visual difference must be felt, not explained.**

---

**Document Version:** 1.0  
**Status:** ✅ Production Ready  
**Component:** `/src/app/components/ConversationalFlow.tsx`  
**Variants:** Voice (authoritative) + SMS (fragile)  
**Compliance:** 100% adherence to strict requirements
