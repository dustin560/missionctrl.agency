# MissionCTRL — Netlify Build Handoff

> **Use this document as the single source of truth when building the MissionCTRL website.** It contains the complete design system, all page content, structural guidance, and brand rules.

---

## 1. Brand Overview

**MissionCTRL** is a trust-driven brand impact advisory that works with leadership teams to turn brand integrity into collective impact — transforming organisations from brands that communicate into movements that mobilise.

**TrustOS** is MissionCTRL's measurement intelligence product. It makes trust visible — showing leaders where belief is leaking, where trust is building, and what to do next. TrustOS is always positioned as a product *within* MissionCTRL, never as a separate business.

### Brand Platform: The Brand Effect

| Element | Copy |
|---------|------|
| **Platform** | The Brand Effect |
| **Tagline** | Don't build a brand. Create a movement. |
| **Rally cry** | Lead as One. Move the Many. |
| **Tone marker** | Brand. Made to move. |
| **Connecting phrase** | Integrity at Scale *(shared between MC and TrustOS)* |

### Brand Personality
Energising, provocative, purposeful. "The consultant who thinks like an activist." The ambition of Patagonia, the precision of McKinsey. Every word earns its place — energy comes from conviction, not volume.

---

## 2. Design Tokens

### 2.1 Colour Palette — MissionCTRL ("Solar Flare")

```css
:root {
  /* Primary */
  --blaze:      #ff6b2b;   /* Lead brand colour — the colour of momentum */
  --amber:      #ffad3b;   /* Gradient partner to Blaze */
  --coral:      #ff4d6a;   /* Accent/highlight */

  /* Foundation */
  --midnight:   #162252;   /* Deep authority blue */
  --electric:   #3d7cc9;   /* Active/link blue */
  --ice:        #f0f0f4;   /* Light surface */

  /* Backgrounds */
  --deep:       #0a0f1a;   /* Primary dark background */
  --charcoal:   #111827;   /* Secondary dark background */
  --white:      #ffffff;

  /* Gradient: Blaze → Amber (the signature brand gradient) */
  /* Usage: M mark fill, hero text highlights, key accent moments */
  /* CSS: linear-gradient(90deg, var(--blaze), var(--amber)) */
}
```

### 2.2 Colour Palette — TrustOS

```css
:root {
  --trust-slate: #2d3a4a;  /* Primary text/bg — cool, structured */
  --trust-cool:  #5b9ec9;  /* Accent — "OS" in wordmark, data highlights */
  --system-grey:  #f4f4f6; /* Light background surface */
}
```

**Critical rule:** Orange/warm colours belong exclusively to MissionCTRL. TrustOS sections use only slate, cool blue, and grey.

### 2.3 Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| **Primary** | [Sora](https://fonts.google.com/specimen/Sora) | 300–800 | All headings, body, UI elements |
| Display headlines | Sora | 800 (ExtraBold) | letter-spacing: -0.04em, line-height: 1.06 |
| Section titles | Sora | 800 | letter-spacing: -0.03em, line-height: 1.12 |
| Body copy | Sora | 400 | line-height: 1.85 |
| Labels/overlines | Sora | 700 | letter-spacing: 0.2em, uppercase, font-size: 0.6–0.65rem |
| Nav links | Sora | 500 | font-size: 0.82rem |
| Buttons | Sora | 600 | font-size: 0.88rem |

```html
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
```

### 2.4 Spacing & Layout

| Token | Value | Usage |
|-------|-------|-------|
| Container max-width | 1200px | Content container |
| Container padding | 0 5% | Horizontal padding |
| Section padding (vertical) | 100px | Major sections |
| Nav padding | 18px 5% | Fixed navigation |
| Button padding | 14px 28px | Primary/secondary CTAs |
| Button border-radius | 8px | All buttons |
| Border subtle | 1px solid rgba(255,255,255,0.04) | Dividers on dark bg |

### 2.5 Effects

| Effect | CSS |
|--------|-----|
| Glass nav | `background: rgba(10,15,26,0.92); backdrop-filter: blur(20px);` |
| Gradient text | `background: linear-gradient(90deg, #ff6b2b, #ffad3b); -webkit-background-clip: text; -webkit-text-fill-color: transparent;` |
| Muted body text (dark bg) | `color: rgba(255,255,255,0.45)` |
| Muted body text (light bg) | `color: var(--trust-slate); opacity: 0.7` |
| Subtle labels | `color: rgba(255,255,255,0.5)` on dark; `color: var(--trust-cool)` on light |

---

## 3. Logo & Brand Marks

### 3.1 The M Mark ("Momentum Peaks")
The M is a geometric container — a pair of converging peaks expressing momentum and alignment. Its geometry is fixed; its fill changes with context.

**SVG path (the canonical M shape):**
```svg
<svg viewBox="0 0 120 148" fill="none">
  <defs>
    <linearGradient id="m-grad" x1="0" y1="148" x2="120" y2="0">
      <stop offset="0%" stop-color="#ff6b2b"/>
      <stop offset="100%" stop-color="#ffad3b"/>
    </linearGradient>
    <clipPath id="m-clip">
      <path d="M4,140 L30,12 L60,88 L90,12 L116,140 Z"/>
    </clipPath>
  </defs>
  <rect width="120" height="148" fill="url(#m-grad)" clip-path="url(#m-clip)"/>
</svg>
```

### 3.2 The MC Monogram
M mark stacked above a Sora "C" rotated -90° (opening faces upward toward the M). Used as avatar, favicon, and compact brand mark.

**C-Switch Animation** (the C rotates counter-clockwise from 0° to -90°):
```css
@keyframes c-switch-ccw {
  0%   { transform: rotate(0deg); }
  30%  { transform: rotate(0deg); }
  70%  { transform: rotate(-90deg); }
  100% { transform: rotate(-90deg); }
}
```

### 3.3 The Stacked Logotype
The full wordmark reads as: **M** (as the Momentum Peaks mark) spans two lines of text. "ission" sits on line 1 (white), "CTRL" sits on line 2 (C in blaze orange, TRL in white). No gap between lines.

```html
<div style="display: inline-flex; align-items: flex-start; gap: 4px;">
  <!-- M mark SVG (see 3.1) at small scale -->
  <div style="display: flex; flex-direction: column;">
    <span style="font-weight: 700; color: white; letter-spacing: -0.04em; line-height: 0.85;">ission</span>
    <div style="line-height: 0.85;">
      <span style="font-weight: 800; color: #ff6b2b; letter-spacing: 0.06em;">C</span>
      <span style="font-weight: 800; color: white; letter-spacing: 0.06em;">TRL</span>
    </div>
  </div>
</div>
```

### 3.4 TrustOS Wordmark
```html
<span style="font-weight: 700; letter-spacing: -0.02em;">
  <span style="color: #2d3a4a;">Trust</span><span style="color: #5b9ec9;">OS</span>
</span>
```

---

## 4. Asset Files (included in handoff)

| File | Dimensions | Usage |
|------|-----------|-------|
| `MC-Avatar-800x800.png` | 800×800 | High-res monogram (MC) |
| `MC-Avatar-400x400.png` | 400×400 | Social/avatar use |
| `MC-Favicon-64x64.png` | 64×64 | Browser tab favicon |
| `MC-Monogram-Transparent.png` | 600×600 | Transparent background monogram |
| `M-Mark-Gradient.png` | 600×600 | Standalone M mark (blaze→amber gradient) |
| `M-Mark-White.png` | 600×600 | Standalone M mark (white, for dark backgrounds) |

**Favicon setup:**
```html
<link rel="icon" type="image/png" sizes="64x64" href="/MC-Favicon-64x64.png">
<link rel="apple-touch-icon" href="/MC-Avatar-400x400.png">
```

---

## 5. Page Structure & Content

### 5.0 Sticky Navigation

**Layout:** Fixed top bar, glass effect (frosted dark), logo left, links + CTA right.

| Element | Content |
|---------|---------|
| Logo | Stacked logotype (M mark + ission / CTRL) |
| Links | The Brand Effect · TrustOS · Work · About |
| CTA button | Let's Talk *(blaze background, dark text)* |

**Responsive:** On mobile (≤900px), hide text links, keep logo + CTA only.

---

### 5.1 Hero Section

**Background:** Dark gradient (`linear-gradient(170deg, #0a0f1a 0%, #162252 40%, #0d1633 100%)`)

**Background elements:**
- Large faded M mark (right side, ~55% width, opacity 0.025, white)
- Concentric "ripple rings" (right side, 4 rings with subtle orange borders, increasing opacity toward centre)

| Element | Content |
|---------|---------|
| Overline label | THE BRAND EFFECT *(blaze, uppercase, tracked)* |
| H1 headline | Don't build / a brand. / **Create a movement.** *(last line in gradient text)* |
| Body copy | We work with leadership teams to turn brand integrity into collective impact — transforming organisations from brands that communicate into movements that mobilise. |
| Primary CTA | Start the conversation *(blaze bg button)* |
| Secondary CTA | See the proof *(ghost/outline button, links to TrustOS section)* |

**Animation:** Staggered fade-up on load (each child element delayed 0.1s).

---

### 5.2 Four Pillars Strip

**Layout:** 4-column grid (2-col on tablet, 1-col on mobile), separated by subtle borders.
**Background:** `--deep`

| # | Title | Description |
|---|-------|-------------|
| 01 | Conviction | The Effect starts with belief. Most organisations have a purpose statement. Very few have conviction. |
| 02 | Coherence | One brand, every stakeholder. The gap between what you intend and what they experience is where trust is lost. |
| 03 | Proof | The Effect is measurable. TrustOS makes trust visible — showing where belief is leaking and what to do next. |
| 04 | Movement | When your brand shapes how the category thinks, not just how it's perceived. That's The Brand Effect at scale. |

**Styling:** Pillar numbers in blaze, titles in white (bold), descriptions in muted white (0.3 opacity).

---

### 5.3 TrustOS Section

**Background:** `--ice` (#f0f0f4) — this is a light section.
**Layout:** Two-column (content left, visual right). Stacks on mobile.

| Element | Content |
|---------|---------|
| Overline label | THE INTELLIGENCE ENGINE *(trust-cool, uppercase, tracked)* |
| H2 headline | See the gap. / Close it. *(midnight colour)* |
| Body copy | TrustOS is MissionCTRL's measurement intelligence product. It makes trust visible — showing leaders where belief is leaking, where trust is building, and what to do next. |
| Wordmark | Trust**OS** *(Trust in slate, OS in cool blue)* |

**Visual (right column):** The M mark rendered in TrustOS colours (slate→cool blue gradient) with a data line chart overlaid inside the clip path — polyline with data points and faint grid lines. This visualises "data inside the M."

```svg
<!-- TrustOS M with data visualisation -->
<svg width="260" height="320" viewBox="0 0 120 148" fill="none">
  <defs>
    <linearGradient id="trust-m" x1="0" y1="148" x2="120" y2="0">
      <stop offset="0%" stop-color="#2d3a4a"/>
      <stop offset="50%" stop-color="#5b9ec9"/>
      <stop offset="100%" stop-color="#2d3a4a"/>
    </linearGradient>
    <clipPath id="trust-mc">
      <path d="M4,140 L30,12 L60,88 L90,12 L116,140 Z"/>
    </clipPath>
  </defs>
  <rect width="120" height="148" fill="url(#trust-m)" clip-path="url(#trust-mc)"/>
  <g clip-path="url(#trust-mc)" opacity="0.5">
    <polyline points="10,120 25,100 40,108 55,80 70,88 85,60 100,68 115,40"
              stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="55" cy="80" r="2.5" fill="white"/>
    <circle cx="85" cy="60" r="2.5" fill="white"/>
    <circle cx="115" cy="40" r="2.5" fill="white"/>
    <line x1="10" y1="50" x2="115" y2="50" stroke="white" stroke-width="0.3" opacity="0.2"/>
    <line x1="10" y1="80" x2="115" y2="80" stroke="white" stroke-width="0.3" opacity="0.2"/>
    <line x1="10" y1="110" x2="115" y2="110" stroke="white" stroke-width="0.3" opacity="0.2"/>
  </g>
</svg>
```

---

### 5.4 Rally / CTA Section

**Background:** Blaze gradient (`linear-gradient(160deg, #ff6b2b 0%, #e85a1f 100%)`)
**Layout:** Centred text, with large faded white M marks as background decoration (low opacity ~0.08).

| Element | Content |
|---------|---------|
| H2 headline | Lead as One. Move the Many. |
| Body copy | The difference between a company and a movement is integrity at scale. |
| CTA button | Create your Brand Effect *(white bg, blaze text)* |

---

### 5.5 Footer

**Background:** `--deep`
**Layout:** Three-column footer content above a bottom bar.

**Brand column (left):**
- Stacked logotype (small)
- Tagline: "Brand. Made to move."

**Link columns:**

| Practice | Product | Connect |
|----------|---------|---------|
| The Brand Effect | TrustOS | LinkedIn |
| Work | Trust Snapshot | Substack |
| About | For Leaders | Email (dustin@missionctrl.co) |
| Contact | Documentation | |

**Bottom bar:**
- Left: © 2026 MissionCTRL. All rights reserved.
- Right: "Integrity at Scale" *(very subtle, tracked uppercase)*

---

## 6. Expanded Content (for additional pages/sections)

The following content is available from the brand brief for expanding the site beyond the home page. Use as needed for inner pages or additional sections.

### The Problem Framing
**Section title:** The problem isn't awareness. It's alignment.

Businesses are operating in permanent volatility: stakeholder expectations move faster than strategy cycles, culture drifts across teams, and proof is demanded in real time. When belief, expression, and behaviour fall out of sync, trust erodes quietly — until performance drops suddenly.

**Punchline:** Trust is the leading indicator of brand performance. TrustOS makes it visible — so leaders can act before impact is lost.

### What MissionCTRL Is (core proposition)
MissionCTRL turns brand into an impact operating system: measure trust, locate friction, and coordinate decisions across the stakeholder ecosystem — inside and out.

**Micro-definition:** Brand Impact happens when the brand becomes the bridge from shared mission to stakeholder action — inside and out.

**Three tiles:**
1. **TrustOS Dashboard** — clarity on what's working, what's not, and what to fix
2. **MissionCTRL Solutions** — targeted interventions to strengthen trust
3. **A repeatable rhythm** — measure → prioritise → improve → prove

### TrustOS Trust Model (4-part)
TrustOS measures trust through three drivers — on a foundation of integrity:

- **Integrity (foundation):** Alignment of belief, expression and behaviour. Without it, trust metrics become theatre.
- **Clarity** *(Promises made — intent + messaging):* Are our promises understandable, consistent, and decision-ready?
- **Connection** *(Experience delivered — stakeholder reality):* Do people experience us as coherent, reliable, and aligned across teams/channels?
- **Confidence** *(Proof + follow-through — credibility + evidence):* Can stakeholders verify our claims, see progress, and trust what happens next?

### Solutions (8 interventions)

**Clarity — Tell your strategic story with strength:**
1. **Prioritise** — Make trade-offs explicit, align decision principles, reduce mixed messages
2. **Design for Good** — Build shared value into the offer so "doing right" is delivered by default

**Connection — Make the experience feel coherent everywhere:**
3. **Energise** — Translate mission into lived behaviours, rituals, and leadership talk-tracks
4. **Align** — Create one operating language across teams so the experience feels consistent
5. **Retain** — Systemise loyalty with time-to-value moments, closed feedback loops, and visible progress
6. **Mobilise** — Coordinate partners around shared principles, commitments, and shared measurement

**Confidence — Prove progress with evidence, not slogans:**
7. **Adapt** — Build response loops and recovery rituals; publish what changed and why
8. **Prove** — Make outcomes measurable, publish evidence, invite scrutiny

### Engagement Rhythm
1. **Sense (TrustOS)** — Baseline trust across stakeholders + identify the biggest leaks in Clarity, Connection, Confidence.
2. **Act (MissionCTRL)** — Select 1–3 solutions with clear owners, actions, and measurable outcomes.
3. **Adapt (TrustOS)** — Track movement, publish proof internally (and externally where appropriate), repeat quarterly.

### Who It's For
Built for leadership teams who can't afford trust drift:
- CEOs & Exec teams navigating volatility
- Brand / Comms / Experience / People leaders needing one shared view
- Organisations with complex stakeholder ecosystems (B2B, infra, public service, industrial, regulated)

### Final CTA
**Headline:** Make trust measurable. Make integrity operational. Make the brand perform.
**CTAs:** Book a demo · Get the one-page overview (PDF)

---

## 7. Responsive Breakpoints

| Breakpoint | Changes |
|------------|---------|
| ≤ 900px | Pillars → 2-column grid. TrustOS section stacks vertically. Nav hides text links (keep logo + CTA). Footer columns wrap. |
| ≤ 600px | Pillars → 1-column. Hero title shrinks to 2rem. Footer stacks fully. |

---

## 8. Design Principles & Rules

1. **Orange is MissionCTRL's.** Never use warm colours (blaze, amber, coral) in TrustOS sections. TrustOS uses slate, cool blue, and grey only.
2. **The M mark is a container.** Its geometry is always `M4,140 L30,12 L60,88 L90,12 L116,140 Z`. Its fill changes with context — gradient for hero, white for dark backgrounds, TrustOS colours for product sections, imagery for campaigns.
3. **Gradient text is reserved** for the most important headline moment on each page (typically the hero H1 payoff line).
4. **Glass nav** stays fixed and frosted on scroll.
5. **Animations should be subtle.** Fade-up on load, hover transitions on interactive elements. No bouncing, no parallax, no scroll-jacking.
6. **Body copy stays muted.** On dark backgrounds: rgba(255,255,255,0.45). On light backgrounds: trust-slate at 0.7 opacity. Headlines are full colour.
7. **Sora is the only typeface.** Weight range 300–800 covers all needs.
8. **"Integrity at Scale"** appears in the footer as the connecting thread between both brands.

---

## 9. Reference Implementation

A complete working HTML file (`MissionCTRL-Website-Home.html`) is included alongside this document. It contains the full home page with all CSS inline — use it as the pixel-perfect reference for how the design system comes together. The Netlify agent can use this as a starting point and adapt it into a proper site structure.

---

## 10. SEO & Meta

```html
<title>MissionCTRL — Don't Build a Brand. Create a Movement.</title>
<meta name="description" content="MissionCTRL works with leadership teams to turn brand integrity into collective impact. The Brand Effect.">
<link rel="icon" type="image/png" sizes="64x64" href="/MC-Favicon-64x64.png">
<link rel="apple-touch-icon" href="/MC-Avatar-400x400.png">
```
