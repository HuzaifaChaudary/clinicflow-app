# Universal Vector Flow Blueprint — Implementation Guide

**Design once. Reuse everywhere.**

This is the visual sentence structure for all Clinicflow process flows.

---

## 🎯 The Core Pattern (Never Change This)

Every flow uses exactly **5 elements**, always in this order:

```
Node → Connector → Action → Connector → Outcome
```

**Visually:**
```
● ───▶ ◻ ───▶ ✓
```

That's it. Everything else is styling.

---

## 📐 Element Definitions

### **A. Node (the dot)**

**Represents:** A moment in time

**Design:**
- Shape: Circle
- Size: 10-14px (specifically 12px in implementation)
- Default color: Muted blue-gray (`var(--foreground-muted)/30`)
- Active color: Orange (`var(--orange-signal)`)

**Use for:**
- Patient books
- Call initiated
- Reminder sent
- Patient responds

**Rule:** Never use text-only bullets again. Every step starts with a dot.

**Implementation:**
```tsx
<div className={`w-3 h-3 rounded-full ${
  active 
    ? 'bg-[var(--orange-signal)] shadow-[0_0_8px_rgba(249,115,22,0.6)]' 
    : 'bg-[var(--foreground-muted)]/30 border border-[var(--foreground-muted)]/40'
}`} />
```

---

### **B. Connector (the line)**

**Represents:** Movement or automation

**Design:**
- Stroke: 2px
- Color: Blue (`var(--blue-primary)`)
- Direction: Always left → right or top → bottom
- Style:
  - **Dashed** = manual
  - **Solid** = automated

**Optional:**
- Slight curve for friendliness
- Straight for precision

**Rule:** No connector = no understanding.

**Implementation (Horizontal):**
```tsx
<div className="h-[2px] bg-[var(--blue-primary)] relative">
  {/* Arrow pointing right */}
  <svg width="6" height="8" viewBox="0 0 6 8">
    <path d="M6 4 L0 0 L0 8 Z" fill="var(--blue-primary)" />
  </svg>
</div>
```

**Implementation (Vertical):**
```tsx
<div className="w-[2px] h-12 bg-[var(--blue-primary)] relative">
  {/* Arrow pointing down */}
  <svg width="8" height="6" viewBox="0 0 8 6">
    <path d="M4 6 L0 0 L8 0 Z" fill="var(--blue-primary)" />
  </svg>
</div>
```

---

### **C. Action Card (the system step)**

**Represents:** Where Clinicflow does something

**Design:**
- Shape: Rounded rectangle
- Background: Light blue tint (`var(--blue-soft)`)
- Text: Dark (`var(--foreground)`)
- Icon: White or dark blue (`var(--blue-vivid)`)

**Rules:**
- Never white
- Never border-only
- Must feel like a system module

**This is where you visually say:** "Software is working here."

**Implementation:**
```tsx
<div className={`px-6 py-4 rounded-xl transition-all duration-300 ${
  isHovered
    ? 'bg-[var(--blue-primary)] text-white'
    : 'bg-[var(--blue-soft)] border border-[var(--blue-primary)]/20'
}`}>
  <div className="flex items-center gap-3">
    <div className={`w-10 h-10 rounded-lg ${
      isHovered ? 'bg-white/20' : 'bg-white'
    }`}>
      <Icon className={isHovered ? 'text-white' : 'text-[var(--blue-vivid)]'} />
    </div>
    <div>{label}</div>
  </div>
</div>
```

---

### **D. Outcome (the check / result)**

**Represents:** Resolution

**Design:**
- Icon: Checkmark or confirmation symbol
- Color: Orange (`var(--orange-signal)`)
- Label below: Short, confident (max 3 words)

**Examples:**
- Schedule filled
- Response logged
- Appointment confirmed

**Rule:** Orange only appears here.

**Implementation:**
```tsx
<div className="flex flex-col items-center gap-2">
  <div className="w-10 h-10 rounded-full bg-[var(--orange-signal)] 
       flex items-center justify-center 
       shadow-[0_0_12px_rgba(249,115,22,0.5)]">
    <CheckCircle className="w-5 h-5 text-white" />
  </div>
  <div className="text-xs text-center">{label}</div>
</div>
```

---

## 📊 The Canonical Layouts

### **1. Horizontal Version (Best for hero sections)**

**Visual:**
```
● Patient books
   ───▶
     ◻ Auto scheduling
       ───▶
         ✓ Schedule filled
```

**Use when:**
- Hero sections
- Single-flow explanations
- Need to show complete flow in one line

**Implementation:**
```tsx
import { HorizontalFlow } from '@/components/FlowPattern';

const step = {
  nodeLabel: 'Patient books',
  actionIcon: Calendar,
  actionLabel: 'Auto scheduling',
  actionDescription: 'Online booking system',
  outcomeLabel: 'Schedule filled',
  outcomeIcon: CheckCircle,
  connectorType: 'automated'
};

<HorizontalFlow step={step} index={0} />
```

---

### **2. Vertical Version (Best for long pages)**

**Visual:**
```
● Call initiated
   │
   │
   ▼
◻ Voice call placed
   │
   ▼
✓ Response logged
```

**Use when:**
- Long-form pages
- Sequential multi-step processes
- Need to show progression over time

**Implementation:**
```tsx
import { VerticalFlow } from '@/components/FlowPattern';

const steps = [
  {
    nodeLabel: 'Call initiated',
    actionIcon: Phone,
    actionLabel: 'Voice call placed',
    actionDescription: '24-48 hours before',
    outcomeLabel: 'Response logged',
    connectorType: 'automated'
  },
  // ... more steps
];

<VerticalFlow steps={steps} />
```

---

### **3. Grid Version (Best for "What clinics notice first")**

**Visual:**
```
    ┌────────────────────┐
    │ 1. Phone calls drop│
    └────────────────────┘
         │ (blue line)
         ●
         │
    ┌────────────────────┐
    │ 2. No shows reduce │
    └────────────────────┘
```

**Use when:**
- "What clinics notice first" sections
- Numbered progression (1, 2, 3, 4)
- Step-based explanations

**Implementation:**
```tsx
import { GridFlow } from '@/components/FlowPattern';

const steps = [
  {
    step: 1,
    label: 'Phone calls drop',
    description: 'Patients book online instead of calling. Reception desk quieter within days.'
  },
  // ... more steps
];

<GridFlow steps={steps} />
```

---

## 🎨 Color System (Locked)

Use this exact logic, everywhere:

| Element | Color | Variable | Usage |
|---------|-------|----------|-------|
| Background | Light neutral | `var(--background)` | Page base |
| Connectors | Blue | `var(--blue-primary)` | All lines, arrows |
| Action cards | Blue-tinted | `var(--blue-soft)` | Background fill |
| Active node or final node | Orange | `var(--orange-signal)` | Completion states |
| Text | Dark charcoal | `var(--foreground)` | Default text |

**If you break this, the system loses meaning.**

---

## 🖱️ Hover / Interaction States

### **On hover over an Action Card:**

1. Background shifts to deeper blue (`var(--blue-primary)`)
2. Text turns white
3. Connector leading into it brightens
4. Node before it glows subtly

**This makes the system feel alive, not decorative.**

### **Timing:**
- Transition: 300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Stagger: 0.1s per element
- Scale: 1.02x on hover

### **Implementation:**
```tsx
const [hoveredAction, setHoveredAction] = useState(false);

<ActionCard
  isHovered={hoveredAction}
  onHover={setHoveredAction}
/>

<Connector active={hoveredAction} />
```

---

## 📍 Where This Blueprint MUST Be Used

### **Mandatory Sections:**

✅ **MUST use this pattern:**
- How the day runs
- What clinics notice first
- Voice confirmations
- Scheduling flow
- Intake → Visit → Follow-up
- Admin automation

### **Recommended (but optional):**
- Metrics explanation
- Pricing logic
- Onboarding steps
- Support workflows
- Integration guides

**Rule:** If a section explains process without this blueprint → it's incomplete.

---

## 🚫 What NOT to Do (Seriously)

### **Never:**

❌ No floating icons  
❌ No standalone cards  
❌ No text-only explanations  
❌ No decorative arrows with no meaning  
❌ No random colors  

### **Every visual must answer:**

> "What happened, and what happened next?"

---

## 💭 The Mindset Shift (This Matters)

**You are not designing a website.**

You are designing:
> A calm, visible operating system for clinics

This blueprint is how you show:
- **Order** (things happen in sequence)
- **Inevitability** (the system works)
- **Control** (staff can see what's happening)
- **Relief** (automation reduces chaos)

---

## 📋 Implementation Checklist

Before shipping any process section, verify:

- [ ] Uses 5-element pattern (Node → Connector → Action → Connector → Outcome)
- [ ] Nodes are 10-14px circles (blue-gray or orange)
- [ ] Connectors are 2px blue lines with arrows
- [ ] Action cards have blue-tinted backgrounds (never white)
- [ ] Outcomes use orange checkmarks
- [ ] Hover states work (blue background, white text)
- [ ] Connectors brighten on hover
- [ ] No text-only explanations
- [ ] No decorative elements without meaning
- [ ] Follows one of three canonical layouts

---

## 🔧 Technical Reference

### **File Structure:**

```
/src/app/components/FlowPattern.tsx
  ├── FlowNode (Node element)
  ├── Connector (Line element)
  ├── ActionCard (System step element)
  ├── Outcome (Result element)
  ├── HorizontalFlow (Layout 1)
  ├── VerticalFlow (Layout 2)
  └── GridFlow (Layout 3)
```

### **Import Pattern:**

```tsx
import { 
  HorizontalFlow, 
  VerticalFlow, 
  GridFlow,
  type HorizontalFlowStep,
  type VerticalFlowStep,
  type GridFlowStep
} from '@/components/FlowPattern';
```

### **TypeScript Types:**

```tsx
interface HorizontalFlowStep {
  nodeLabel: string;
  actionIcon: LucideIcon;
  actionLabel: string;
  actionDescription?: string;
  outcomeLabel: string;
  outcomeIcon?: LucideIcon;
  connectorType?: 'automated' | 'manual';
}

interface VerticalFlowStep {
  nodeLabel: string;
  actionIcon: LucideIcon;
  actionLabel: string;
  actionDescription?: string;
  outcomeLabel: string;
  outcomeIcon?: LucideIcon;
  connectorType?: 'automated' | 'manual';
}

interface GridFlowStep {
  step: number;
  label: string;
  description: string;
}
```

---

## 🎓 Live Examples

Visit `/flow-blueprint` to see all three layouts in action:
- Horizontal flows (3 examples)
- Vertical flows (3-step sequence)
- Grid flows (4-step progression)
- Color system demonstration
- Hover state examples

---

## 📝 Final Instruction (Pin This)

**If a section does not show cause → action → outcome visually, it is not finished.**

This blueprint is not a suggestion.  
It is the design system for all Clinicflow process explanations.

Use it consistently.  
Don't invent new patterns.  
Trust builds through repetition.

---

**Document Version:** 1.0  
**Date:** January 2026  
**Status:** ✅ Production Ready  
**Component:** `/src/app/components/FlowPattern.tsx`  
**Demo Page:** `/flow-blueprint`  
**Adoption:** Mandatory for all process flows
