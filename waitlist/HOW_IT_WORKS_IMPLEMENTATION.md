# "How It Works" Page — Process-Specific Visual Storytelling

**Status:** ✅ Complete  
**Date:** January 2026  
**Visual Metaphor:** Process unfolding  
**Design Language:** Arrows, step transitions, progressive disclosure

---

## 🎯 Mission

Answer the question: **"How does this actually work day to day?"**

This is not marketing fluff. This is a confidence page that shows process, flow, and cause → effect with unique visualizations.

**Rule:** If any section looks reusable on another page, it was redesigned.

---

## ✅ What Was Implemented

### **SECTION 1: Hero — Horizontal Process Flow**

**Goal:** Immediately show AXIS is process-driven, not feature-driven.

**Layout:**
- Left: Headline + explainer
- Right: Horizontal flow diagram (custom for this page)

**Visualization:**
```
Admin setup → Booking → Confirmation → Visit → Follow-up
```

**Visual Language:**
- Circular nodes (64px on desktop, 48px on mobile)
- Connected by thin blue vector lines (2px)
- Active node: blue fill with glow
- Inactive nodes: light blue background
- Left → right arrow direction

**Implementation:**
```tsx
<HorizontalProcessFlow steps={[
  { label: 'Admin setup', icon: Settings },
  { label: 'Booking', icon: Calendar },
  { label: 'Confirmation', icon: Phone },
  { label: 'Visit', icon: User },
  { label: 'Follow-up', icon: FileText }
]} />
```

**Unique to this page:** ✅ Not reused anywhere else

---

### **SECTION 2: Initial Setup — Setup Stack**

**Goal:** Show setup is one-time, fast, and structured.

**Visualization:** Vertical "Setup Stack" diagram

**Layout:**
- **Left column:** Numbered steps (01, 02, 03) with vertical timeline
- **Right column:** Contextual system panel that updates per active step

**Steps:**
1. Clinic info & hours
2. Scheduling rules
3. Communication preferences

**Visual Treatment:**
- Active step: light blue background, blue border, scale 1.02
- Inactive steps: white background, gray border
- Vertical connector line (1.5px, blue/20% opacity)
- Timeline feel

**Interaction:**
- Hover or click → activates step
- Right panel updates with contextual content
- Smooth 200ms transition

**Implementation:**
```tsx
<SetupStack steps={[
  {
    number: '01',
    label: 'Clinic info & hours',
    description: '...',
    panelContent: {
      title: 'Basic Configuration',
      items: [...]
    }
  },
  // ... more steps
]} />
```

**Unique to this page:** ✅ Not reused anywhere else

---

### **SECTION 3: Daily Operations — Conveyor Flow**

**Goal:** Explain automation without sounding magical.

**Visualization:** Left-to-right conveyor flow

**Design:**
- Each stage is a distinct visual block (card)
- Blocks connected with arrow icons
- Background alternates: transparent → light blue bands
- Subtle scroll-in animation (one-time entrance)

**Steps:**
1. Patient books → System checks availability
2. Rules applied → Buffer times enforced
3. Reminder sent → Voice call placed
4. Forms delivered → Intake paperwork sent

**Visual Requirements:**
- No stacked cards
- No grids
- Horizontal rhythm (desktop)
- Vertical stack (mobile)

**Hover States:**
- Background: white → clinical blue (#EEF5FF)
- Border: gray → blue/40%
- Scale: 1.0 → 1.03
- TranslateY: +4px
- Duration: 200ms

**Implementation:**
```tsx
<ConveyorFlow steps={[
  {
    icon: Calendar,
    label: 'Patient books',
    description: 'System checks availability and creates appointment'
  },
  // ... more steps
]} />
```

**Unique to this page:** ✅ Not reused anywhere else

---

### **SECTION 4: Exceptions & Edge Cases — Decision Nodes**

**Goal:** Build trust by showing control.

**Visualization:** Decision nodes with branching paths

**Design:**
- Trigger box at top (soft blue background)
- Vertical line down to decision node (blue circle)
- Three branches split from center:
  - **Confirms** → Appointment locked
  - **Reschedules** → Slot reopened
  - **No answer** → Admin notified

**Visual Style:**
- Thin blue decision lines (1.5px)
- Soft rounded decision boxes
- No heavy borders
- Feels different from all other sections

**Mobile:** Linear stack (trigger → outcomes list)

**Implementation:**
```tsx
<DecisionNode
  trigger="Patient receives voice confirmation call"
  branches={[
    { condition: 'Confirms', outcome: 'Appointment locked in system' },
    { condition: 'Reschedules', outcome: 'Slot reopened, calendar updated' },
    { condition: 'No answer', outcome: 'Admin notified for follow-up' }
  ]}
/>
```

**Unique to this page:** ✅ Not reused anywhere else

---

### **SECTION 5: Clinic Ready State — Final Status Panel**

**Goal:** End with certainty, not celebration.

**Visualization:** Single status panel (NOT a button)

**Design:**
- Large soft blue panel (max-width 800px)
- White checkmark icon (80px circle, blue check inside)
- Text: "Clinic ready to operate"
- Subtitle: "System configured. Rules active. Automation running."

**NO:**
- ❌ Orange color
- ❌ CTA button styling
- ❌ Success badge feel

**YES:**
- ✅ Calm blue only
- ✅ System state indication
- ✅ Confident finality

**Implementation:**
```tsx
<ClinicReadyState />
```

**Unique to this page:** ✅ Not reused anywhere else

---

## 📐 Visual Design Specifications

### **Color System (Strict Compliance)**

| Element | Color | Usage |
|---------|-------|-------|
| Primary | `#2563EB` (Blue) | Nodes, connectors, active states |
| Clinical Hover | `#EEF5FF` (Ice Blue) | Card hover backgrounds |
| Soft Blue | `#DBEAFE` | Backgrounds, inactive nodes |
| Muted Gray | `#9CA3AF` | Inactive borders, timeline |
| White | `#FFFFFF` | Card backgrounds |
| **NO Orange** | ❌ | Completely removed |
| **NO Green** | ❌ | Completely removed |

### **Card Behavior (Mandatory)**

**Default State:**
```css
background: white
border: 1px solid var(--glass-border)
box-shadow: var(--shadow-soft)
```

**Hover State:**
```css
background: var(--blue-clinical-hover) /* #EEF5FF */
border: 1.5px solid var(--blue-primary)/40
box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1)
transform: scale(1.03) translateY(4px)
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
```

**Mobile:**
- Hover replaced with tap focus state
- No loss of clarity
- Maintains visual feedback

### **Motion Rules**

**Entrance Animations:**
```tsx
initial={{ opacity: 0, y: 30 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: "-50px" }}
transition={{ duration: 0.5, delay: index * 0.1 }}
```

**Stagger Timing:**
- 0.1s per element
- Staggered by index

**Directional Flow:**
- Arrows point direction of process
- Progressive highlights show sequence
- Step activation on scroll

**Respect:**
- Reduced motion preferences (automatic via Framer Motion)

---

## 📱 Responsive Behavior

### **Desktop (lg+)**
- Horizontal flows maintained
- Multi-step visuals displayed
- Full timeline with contextual panels
- Hover states active

### **Tablet (md)**
- Compressed flows with preserved direction
- 2-column grids become single column
- Arrows rotate if needed

### **Mobile (< md)**
- All flows stack vertically
- Arrows rotate downward
- Cards become full-width
- Tap highlights replace hover
- No loss of meaning

---

## 🚫 What Was Avoided (Absolute)

❌ **Reusing Product page visuals** - Every visualization is custom
❌ **Generic rounded cards with text** - Each card has specific purpose
❌ **White cards on white backgrounds** - Clinical blue backgrounds
❌ **Decorative icons with no function** - Every icon explains something
❌ **Orange or green accents** - Removed completely
❌ **"Startup-y" gradients** - Flat, clinical colors only
❌ **Any visual that does not explain process** - Pure utility

---

## 📂 Files Created/Modified

### **Created:**

1. `/src/app/components/ProcessVisuals.tsx` (520 lines)
   - `HorizontalProcessFlow` - Hero flow diagram
   - `SetupStack` - Vertical timeline with panel
   - `ConveyorFlow` - Horizontal process blocks
   - `DecisionNode` - Branching paths
   - `ClinicReadyState` - Final status panel

### **Modified:**

2. `/src/app/pages/HowItWorks.tsx` (completely rewritten)
   - Removed `OperationalFlowRail` dependency
   - Implemented all 5 custom visualizations
   - Added intake/forms section
   - Added "What this means" section
   - Responsive breakpoints

---

## ✅ Validation Checklist

**Before finalizing, validated:**

- [x] Can each section be understood without reading text?
- [x] Does each visualization feel designed for this page only?
- [x] Does everything feel calm, structured, and inevitable?
- [x] Are all cards interactive (hover states)?
- [x] Is motion explaining sequence, not decoration?
- [x] No orange or green colors?
- [x] No white cards on white backgrounds?
- [x] Responsive on all breakpoints?

**Result:** ✅ All checks passed

---

## 🎨 Design Principles Applied

### **1. Process-Driven, Not Feature-Driven**

Every section shows **how** things happen, not just **what** features exist.

### **2. Visual Storytelling**

- Setup Stack: Shows configuration as a sequence
- Conveyor Flow: Shows automation as a pipeline
- Decision Nodes: Shows logic branching
- Ready State: Shows completion as a system state

### **3. Calm, Structured, Inevitable**

- Gentle 200ms transitions
- Blue color system (no orange/green)
- Clear arrows showing causality
- No playful animations

### **4. Context-Specific Design**

No component is reused from other pages. Each visualization is designed specifically for "How It Works."

---

## 📊 Comparison: Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| Hero visualization | Text only | Horizontal process flow |
| Setup section | Generic flow rail | Interactive Setup Stack |
| Daily operations | Generic flow rail | Conveyor flow with rhythm |
| Exception handling | Text explanation | Visual decision nodes |
| Final state | Text or button | System status panel |
| Orange ticks | ✓ (present) | ❌ (removed) |
| Reused components | OperationalFlowRail | Zero reused components |
| Card hover states | Minimal | Full interactive states |
| Responsive design | Basic | Complete mobile adaptation |

---

## 💡 Key Innovations

### **1. Setup Stack Interaction**

Hover or click on any step → contextual panel updates automatically. Creates a sense of system configuration without overwhelming the user.

### **2. Conveyor Flow Rhythm**

Alternating background bands (white/blue) create visual rhythm without heavy borders. Each block feels like a stage in a manufacturing process.

### **3. Decision Node Branching**

Shows **control** and **transparency** by visualizing every possible outcome. Builds trust by not hiding edge cases.

### **4. Clinic Ready State**

Feels like a **system state indicator**, not a celebration. Calm, confident, final. Blue checkmark (not orange) reinforces brand consistency.

---

## 🚀 Next Steps

### **For other pages:**

**Product Page:**
- Visual metaphor: System reliability
- Use timelines, check states, structured cards
- No conversational UI

**Voice Page:**
- Visual metaphor: Conversation
- Use call bubbles, audio waves, phone states
- More organic spacing

**Pricing Page:**
- Visual metaphor: Stability & reduction
- Use before/after blocks, metric tiles
- No timelines

**Each page must have unique visual logic while respecting the shared design grammar.**

---

## 📖 Usage Guide

### **Import Components:**

```tsx
import {
  HorizontalProcessFlow,
  SetupStack,
  ConveyorFlow,
  DecisionNode,
  ClinicReadyState
} from '@/components/ProcessVisuals';
```

### **Example: Hero Section**

```tsx
const steps: HorizontalProcessStep[] = [
  { label: 'Step 1', icon: Icon1 },
  { label: 'Step 2', icon: Icon2, isActive: true },
  { label: 'Step 3', icon: Icon3 }
];

<HorizontalProcessFlow steps={steps} />
```

### **Example: Setup Stack**

```tsx
const setupSteps: SetupStackStep[] = [
  {
    number: '01',
    label: 'Configuration',
    description: 'Setup description',
    panelContent: {
      title: 'Panel Title',
      items: ['Item 1', 'Item 2', 'Item 3']
    }
  }
];

<SetupStack steps={setupSteps} />
```

---

## 🎯 Final Check

**Question:** Can someone understand the entire AXIS workflow by looking at the visuals alone?

**Answer:** ✅ Yes

- Hero shows end-to-end flow
- Setup Stack shows configuration process
- Conveyor Flow shows daily automation
- Decision Nodes show exception handling
- Ready State shows completion

**Text supports, but visuals explain.**

---

**Document Version:** 1.0  
**Status:** ✅ Production Ready  
**Component:** `/src/app/components/ProcessVisuals.tsx`  
**Page:** `/how-it-works`  
**Compliance:** 100% adherence to Figma Master Prompt  
**Unique Visualizations:** 5/5 (no reused components)
