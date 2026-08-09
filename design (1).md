# MedLink India — Design System & Frontend Direction

## 0. Why This Doc Exists

The current build works functionally but reads as a generic AI-generated admin panel: dark glassmorphism, glowing neon cyan/teal, no landing page, and a single 900-line CSS file with zero component modularity. For a system that touches patients, doctors, hospitals, and emergency dispatch, "generic SaaS dashboard" is the wrong register — this needs to read as **calm, trustworthy, and clinical-grade**, not like a crypto dashboard.

This doc replaces the current dark-glow theme with a natural, restrained palette, defines a real component system, adds motion guidelines, and specifies the missing landing page.

---

## 1. Design Philosophy

- **Calm over flashy.** Healthcare software is used under stress (a doctor mid-consult, a family member during an emergency). Nothing should compete for attention unless it's meant to — vitals, alerts, SOS status.
- **Light-first, not dark-glass.** Move away from the `#0a0e1a` dark glassmorphism default. A light, airy base with a dark-mode variant reads more clinical and more trustworthy across all 12 roles, from a 60-year-old patient to a hospital admin.
- **Natural, desaturated color** — no neon glow, no pure saturated cyan. Colors should look like they belong in a hospital or a well-designed health app, not a gaming dashboard.
- **Role differentiation through restrained accent shifts**, not through wildly different themes per dashboard — the system must still feel like one product across 12 panels.
- **Motion with purpose.** Transitions should orient the user (what changed, where did it come from) — never decorative bounce for its own sake.

---

## 2. Color System

Drop the neon cyan/emerald glow entirely. Replace with a natural, muted clinical palette — think sage, stone, clay, and deep ink rather than glowing jewel tones.

### 2.1 Base / Neutral (Light mode — primary)
| Token | Hex | Use |
|---|---|---|
| `--bg-base` | `#F7F5F0` | App background — warm off-white, not stark white |
| `--bg-surface` | `#FFFFFF` | Cards, panels |
| `--bg-subtle` | `#EFEBE3` | Secondary panels, hover states |
| `--border` | `#E2DDD1` | Dividers, card borders |
| `--text-primary` | `#1F2420` | Body text — soft near-black, not pure #000 |
| `--text-secondary` | `#5B6058` | Muted labels, metadata |
| `--text-tertiary` | `#8B9088` | Disabled, placeholder |

### 2.2 Base / Neutral (Dark mode — optional, for clinical night-shift use)
| Token | Hex | Use |
|---|---|---|
| `--bg-base-dark` | `#141815` | Deep warm charcoal, not blue-black |
| `--bg-surface-dark` | `#1D231E` | Cards |
| `--border-dark` | `#2E362F` | Dividers |
| `--text-primary-dark` | `#EDEFE9` | Body text |

### 2.3 Primary — Sage/Teal (natural, desaturated)
| Token | Hex | Use |
|---|---|---|
| `--primary` | `#3E6B5E` | Primary actions, active nav, links |
| `--primary-hover` | `#345A4F` | Hover/pressed |
| `--primary-light` | `#DCE8E2` | Primary tint backgrounds |
| `--primary-subtle` | `#EEF3F0` | Selected row/card backgrounds |

This replaces the glowing `#06b6d4` cyan with a muted forest-sage that still reads "medical" without looking synthetic.

### 2.4 Secondary — Clay/Terracotta (warmth, human touch)
| Token | Hex | Use |
|---|---|---|
| `--secondary` | `#B5654A` | Secondary CTAs, warm accents, illustrations |
| `--secondary-light` | `#F0DDD4` | Tint backgrounds |

### 2.5 Status Colors (natural, not saturated)
| Token | Hex | Meaning |
|---|---|---|
| `--status-success` | `#4F7D5C` | Completed, low risk, bed available |
| `--status-warning` | `#B8863F` | In queue, medium risk |
| `--status-alert` | `#BF6A3D` | High priority |
| `--status-critical` | `#A6473B` | Critical / SOS active |

Critical/SOS states can use a subtle pulse (see §6.5) instead of raw neon red to draw attention without looking alarmist or gamified.

### 2.6 What to remove
- All `rgba(17,24,39,0.45)` glass-panel blur effects
- `#06b6d4` / `#22d3ee` / `#67e8f9` cyan glow family
- Any box-shadow with a saturated color glow (e.g., `box-shadow: 0 0 20px #06b6d4`)

---

## 3. Typography

Keep **Inter** for UI — it's already a solid, neutral choice. Keep **JetBrains Mono** for tokens/IDs (ABHA ID, appointment codes, lab result codes) — that's a nice detail worth preserving.

Add a **serif display font** for the landing page and major dashboard headers to break the "generic SaaS" feel — something like **Fraunces** or **Source Serif 4** for headlines only, paired with Inter for everything else. Serif + sans pairing signals a more considered, human brand than all-Inter-everything.

| Level | Font | Size | Weight |
|---|---|---|---|
| Landing hero H1 | Fraunces | 56–72px | 500 |
| Dashboard page title | Inter | 28px | 600 |
| Section heading | Inter | 20px | 600 |
| Body | Inter | 15px | 400 |
| Caption / metadata | Inter | 13px | 400 |
| Token / ID / code | JetBrains Mono | 13px | 400 |

---

## 4. Spacing, Radius, Elevation

Keep the existing scale (8/12/16/20px + full) — it's reasonable. Adjust elevation to feel physical rather than glowing:

- Replace glow-shadows with soft natural shadows: `box-shadow: 0 1px 2px rgba(31,36,32,0.04), 0 4px 12px rgba(31,36,32,0.06)`
- Cards get a 1px `--border` outline plus the soft shadow above — no backdrop-blur glass effect
- Radius stays 12px for cards, 8px for inputs/buttons, full for pills/avatars

---

## 5. Component System (fixing the modularity gap)

The biggest structural problem isn't visual — it's that there's no `src/components/ui/` folder. Before restyling, extract a real primitive layer:

```
src/components/ui/
├── Button.tsx        (variants: primary, secondary, ghost, destructive)
├── Card.tsx
├── Input.tsx / Select.tsx / Textarea.tsx
├── Badge.tsx          (for status: success/warning/alert/critical)
├── Modal.tsx
├── Tabs.tsx
├── Table.tsx
├── Avatar.tsx
├── Toast.tsx
└── Skeleton.tsx        (loading states — currently likely missing)
```

Every one of the 12 dashboards should compose from this layer instead of hand-rolled CSS classes. This alone fixes most of the "inconsistent padding/margin" issue and is what makes future design changes cheap instead of painful.

**Recommendation:** migrate `index.css` tokens into CSS variables consumed by these components (keep plain CSS/CSS Modules per-component rather than introducing Tailwind mid-project — less churn).

---

## 6. Motion & Animation

Currently zero animation library is installed. Add **Framer Motion** — lightweight enough, and its layout animations are ideal for a dashboard that switches between 12 role views.

### 6.1 Principles
- Duration: 150–250ms for micro-interactions (hover, press), 300–400ms for page/panel transitions
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (natural ease-out) — avoid bouncy/spring effects for clinical UI, except for the SOS trigger (§6.5)
- Motion should always communicate state change, not decorate

### 6.2 Page-level transitions
- Role dashboard switch: cross-fade + 8px vertical slide (200ms), not a hard cut
- Route change: fade the outgoing view out (150ms) before fading the new one in (200ms) — avoid simultaneous cross-fade flicker

### 6.3 Micro-interactions
- Buttons: scale to 0.98 on press, background color transition 150ms
- Cards: on hover, lift shadow slightly (elevation increase, 150ms) — no scale-up, keeps layout stable
- Form fields: border color transition on focus (150ms), label float animation if using floating labels

### 6.4 Data/status transitions
- Live bed count / queue number changes: animate the number with a brief count-up/down (Framer Motion's `useSpring` or a simple tween), not an instant swap — reinforces "real-time" without being distracting
- Status badge changes (e.g., queue → in-progress → completed): color cross-fade, not instant swap

### 6.5 SOS / Emergency state (the one place to break the calm rule)
- SOS button: on trigger, a soft outward ripple pulse (like a heartbeat, 1.2s loop, low-opacity ring in `--status-critical`) — this is the one intentional "alive" animation in the system, reserved for genuine urgency so it doesn't get diluted
- Ambulance dispatch card arriving on the Hospital ER dashboard: slide in from top with a brief highlight-flash on the card border, auto-scroll into view

### 6.6 What to avoid
- No parallax scroll effects on dashboards (fine for landing page only)
- No skeleton shimmer that's overly bright/animated — keep loading states subtle (a slow 1.5s opacity pulse, `--bg-subtle` to `--border`)

---

## 7. Landing Page (currently missing entirely)

Right now the app routes straight to `/login`. For a platform serving 12 different stakeholder types, a landing page is essential — it's the only place to explain *what this is* before asking someone to create an account.

### 7.1 Structure

**1. Navigation**
Logo, minimal links (Product, For Hospitals, For Patients, About), Login + "Get Started" CTA button.

**2. Hero**
- Serif headline (Fraunces), e.g., framing the core promise: one connected system replacing fragmented paper records and delayed emergency response
- Subheadline in Inter, one sentence, plain language
- Two CTAs: primary "Get Started" (sage), secondary "See how it works" (ghost/outline)
- Visual: not a generic 3D illustration — consider a simplified live-data mockup (a stylized bed-availability map or a queue-status card) that hints at the real product, animated subtly on load (staggered fade-up, 400ms, 80ms stagger between elements)

**3. Role selector strip**
Given there are 12 distinct audiences, a horizontal scrollable/tab strip — "I am a..." Patient / Doctor / Hospital / Lab / Pharmacy / Ambulance / Insurance / Govt — each tab reveals a tailored 2-line value prop and a relevant screenshot. This solves the "12 audiences, one landing page" problem without needing 12 separate pages initially.

**4. Core capabilities section**
3–4 feature blocks with real specificity, not generic SaaS bullets: real-time bed availability sync, one-tap SOS with GPS dispatch, centralized health vault with ABHA integration, automated insurance claims. Each with a small supporting visual, alternating left/right layout, scroll-triggered fade-up.

**5. How it connects (system diagram)**
A simple visual showing the loop: Patient triggers SOS → Ambulance dispatched → Hospital notified → Bed reserved. This is the single most compelling thing about the product — show it, don't just describe it.

**6. Trust / credibility section**
Government/NGO partnership mentions, data security note (health data is sensitive — a line on encryption/ABHA compliance builds real trust here), not fake testimonials.

**7. Final CTA**
Simple, repeat the primary action, maybe split by "I'm a patient" vs "I'm a healthcare provider" since the two audiences want different onboarding.

**8. Footer**
Standard — product links, role-specific login shortcuts, contact, compliance/privacy links.

### 7.2 Landing page motion
- Hero elements: staggered fade-up on load
- Sections below the fold: fade-up on scroll into view (intersection observer + Framer Motion `whileInView`), triggered once
- Role selector tabs: smooth underline slide between tabs (250ms), content cross-fade (200ms)

---

## 8. Per-Role Dashboard Notes (brief)

Keep one shared shell (`Layout.tsx`) and vary only the accent usage per role, not the whole theme:

- **Patient / Doctor**: primary sage dominant, calm data density
- **Hospital / Ambulance / Blood Bank**: slightly higher information density, status badges more prominent (bed counts, dispatch status) — same palette, tighter spacing
- **Insurance / Govt / Admin**: table-heavy, lean into the neutral/stone palette with sage only for primary actions — these are the least "emotional" screens and should look the most utilitarian

Avoid giving each of the 12 dashboards its own accent color — that's how systems drift into looking like 12 unrelated products. One primary, one secondary, consistent status colors, everywhere.

---

## 9. Accessibility Notes

- All text/background pairs above must meet WCAG AA (4.5:1) — verify `--text-secondary` (`#5B6058`) on `--bg-base` (`#F7F5F0`) specifically, as muted-on-warm-off-white combinations often fall short
- Status must never be color-only — pair every status badge with a label/icon, since color blindness affects red/green distinction critically here (critical vs. success states)
- Reduce-motion: respect `prefers-reduced-motion` — disable the SOS pulse ripple and count-up animations, fall back to instant state changes

---

## 10. Implementation Priority

1. Swap CSS variables in `index.css` to the new palette (§2) — lowest effort, immediate visual shift away from generic neon-glass
2. Extract the `ui/` primitive component layer (§5) — unblocks everything else
3. Add Framer Motion, apply micro-interactions to buttons/cards/status badges (§6)
4. Build the landing page (§7) — new route, no auth required
5. Apply role-specific density/spacing tweaks (§8) last, once the shared system is stable
