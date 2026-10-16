---
name: Md. Saif Ali
description: A full-stack and AI engineer specified like a component, printed as a two-ink datasheet.
colors:
  datasheet-paper: "#f2f4f5"
  paper-tone: "#e3e7ea"
  table-rule: "#c3c9c1"
  datasheet-ink: "#12161c"
  ink-muted: "#434b55"
  spot-blue: "#1747c9"
  spot-blue-ink: "#ffffff"
  spot-blue-wash: "rgb(23 71 201 / 0.09)"
  warn-red: "#b42318"
  field-ink-text: "#f2f4f5"
  field-muted: "#b4bcc6"
  field-tone: "#1f262f"
  field-spot: "#93b3ff"
  code-ground: "#ffffff"
  night-ground: "#0c1015"
  night-tone: "#1b222b"
  night-rule: "#323b46"
  night-ink: "#eceee9"
  night-muted: "#a9b1bb"
  night-spot: "#93b3ff"
  night-spot-ink: "#0c1015"
  night-spot-wash: "rgb(147 179 255 / 0.12)"
  night-warn: "#ff8a7a"
  graphite-field: "#2a333e"
  graphite-muted: "#b6bec8"
  graphite-tone: "#343e4a"
  night-sheet: "#181e26"
  night-sheet-tone: "#222a34"
  night-code-ground: "#0a0d11"
typography:
  part-title-xl:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(4.5rem, 2rem + 8vw, 8.5rem)"
    fontWeight: 800
    lineHeight: 0.8
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 70"
  part-title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 1.2rem + 6.4vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 70"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.4rem + 3.4vw, 4rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "'tnum' 1"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 1.1rem + 0.9vw, 2rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  body-article:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.55
  code:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  none: "0px"
spacing:
  gutter-phone: "20px"
  gutter-tablet: "32px"
  gutter-desktop: "48px"
  grid-gap: "24px"
  sheet-pad: "32px"
  sheet-pad-wide: "60px"
  heading-to-body: "20px"
  block-gap: "64px"
  section: "112px"
  section-wide: "144px"
components:
  button-primary:
    backgroundColor: "{colors.spot-blue}"
    textColor: "{colors.spot-blue-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "48px"
  button-ink:
    backgroundColor: "{colors.datasheet-ink}"
    textColor: "{colors.datasheet-paper}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "48px"
  ask-field:
    backgroundColor: "{colors.paper-tone}"
    textColor: "{colors.datasheet-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "14px 16px"
  input-field:
    backgroundColor: "{colors.paper-tone}"
    textColor: "{colors.datasheet-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
  sheet:
    backgroundColor: "{colors.datasheet-paper}"
    textColor: "{colors.datasheet-ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.sheet-pad}"
  ink-field:
    backgroundColor: "{colors.datasheet-ink}"
    textColor: "{colors.field-ink-text}"
    padding: "{spacing.section} {spacing.gutter-phone}"
  folder-tab:
    backgroundColor: "{colors.paper-tone}"
    textColor: "{colors.datasheet-ink}"
    typography: "{typography.title}"
    padding: "10px 24px 4px"
  log-bar:
    backgroundColor: "{colors.paper-tone}"
    textColor: "{colors.datasheet-ink}"
    rounded: "{rounded.none}"
    padding: "12px 18px"
    height: "56px"
  stub:
    backgroundColor: "{colors.datasheet-ink}"
    textColor: "{colors.field-ink-text}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: "44px"
  stub-mark:
    backgroundColor: "{colors.field-spot}"
    textColor: "{colors.datasheet-ink}"
    rounded: "{rounded.none}"
    padding: "0 12px"
  table-head:
    backgroundColor: "{colors.datasheet-ink}"
    textColor: "{colors.datasheet-paper}"
    typography: "{typography.body}"
    padding: "12px 16px"
---

# Design System: Md. Saif Ali

## Overview

**Creative North Star: "The Datasheet"**

The site specifies a person the way a manufacturer specifies a part. Every claim is set as a feature, a rating or a measured figure; the work is filed in folders; the history is a stack of bars that open in place; the characteristics are a real ruled table; and the assistant is the application note you can run from the first screen. The page is printed in two inks on cool paper: datasheet paper and datasheet ink alternate as whole fields, the way a two-ink print job switches ground, and a single spot blue is held back for the things you can act on and the marks that carry live data.

Density is that of a printed spec sheet rather than a marketing page: large condensed part titles, generous section space (112 to 160px), then tightly set facts, tables and slips. One grotesque family, Archivo, does everything, pulled to 70% width and heavy capitals for part titles and left at normal width for text. Material comes from paper itself: filled sheets laid over dim archival photographs of Durgapur, zigzag and scalloped tear edges, a perforated tear-off strip, dotted leaders on tally slips, a postage stamp. Corners are square everywhere; buttons are solid rectangles; nothing floats at rest except the stub and real dialogs.

The world rejects the dark two-column developer portfolio with tag pills and project cards, and it must stay visibly distinct from a green terminal-style portfolio. It also rejects the house devices of templated sites: eyebrows above headings, index numbering, gradients, monospace outside code, and resting card shadows.

**Key Characteristics:**
- Two inks plus one spot colour; whole sections switch between paper field and ink field.
- One family (Archivo) in two widths; six type steps, two fixed and four fluid.
- Real tables with ruled rows, real plots computed from real numbers, tally slips with dotted leaders.
- Filled paper sheets with zigzag, scalloped and perforated edges; square corners otherwise.
- Solid rectangular buttons; links are ink with a 2px spot-blue underline.
- Flat at rest; only the floating stub and modal dialogs cast shadows.
- Motion on Emil Kowalski's curves: quick press feedback, staggered entrances, one drifting photograph, a hero sheet that shrinks away on desktop scroll.

## Colors

A cool, nearly colourless two-ink print (paper and blue-black ink) with one saturated spot blue; the dark theme keeps the same structure on a night ground with graphite fields.

### Primary
- **Spot Blue** (light `spot-blue`, dark `night-spot`; on ink fields `field-spot`): the action colour. Fills primary buttons (Ask my AI, Email Saif, Send message), the active plot bars in the production timeline, the plotted points on the visitor map, link underlines, the focus ring, the text caret and the selection. 6.9:1 on paper. Its soft wash (`spot-blue-wash` / `night-spot-wash`) is used only behind the visitor's own messages in the assistant.

### Neutral
- **Datasheet Paper** (`datasheet-paper`; dark `night-ground`): the page ground and, in light mode, the sheet laid over photographs and ink fields.
- **Paper Tone** (`paper-tone`; dark `night-tone`): one tone step down. Table bodies, folder bands, experience bars, the ask field and form fields.
- **Datasheet Ink** (`datasheet-ink`; dark `night-ink`): all text on paper, and in light mode the ground of every ink field.
- **Ink Muted** (`ink-muted`; dark `night-muted`): meta lines, captions, tool lists, credits, placeholders.
- **Table Rule** (`table-rule`; dark `night-rule`): 1px row rules in real tables and form-field strokes; nothing else.
- **Ink Field set** (`field-ink-text`, `field-muted`, `field-tone`, `field-spot`; dark `graphite-field`, `graphite-muted`, `graphite-tone`, `night-spot`): the remapped inks inside a section printed solid. In dark mode the field is a lighter graphite than the ground, so fields still alternate.
- **Sheet** (light = paper, dark `night-sheet` / `night-sheet-tone`): paper sheets laid on photographs or fields (hero sheet, letter, tally slip, postcard footer, diagram plates).
- **Code Ground** (`code-ground`; dark `night-code-ground`): code blocks in case studies, tuned to the Shiki themes.

### Tertiary
- **Warn Red** (`warn-red`; dark `night-warn`): form errors, draft markers, the draft banner on case studies. Never decorative.

### Named Rules
**The Two-Ink Rule.** A section is either paper or ink, edge to edge. Alternate whole fields (hero photo, paper, folders alternating paper-tone and ink, paper, ink record, paper tone telemetry, ink letter, photo contact, ink footer) instead of placing tinted cards on a band.

**The Spot-Blue Rule.** Spot blue marks what you can press and what carries live data: buttons, link underlines, focus, plot bars and map points. If removing the blue would not cost the visitor an action or a data reading, it should not be blue.

**The Remap Rule.** Components read only the semantic tokens (`--bg`, `--surface`, `--text`, `--muted`, `--accent`, `--accent-ink`); the `.ink-field` class remaps them for a solid section. A drawing or slip sitting on its own sheet inside an ink field uses the `--page-*` inks, which fields never remap.

## Typography

**Display Font:** Archivo at 70% width, weight 800, uppercase (with ui-sans-serif, system-ui)
**Body Font:** Archivo at normal width (with ui-sans-serif, system-ui)
**Label/Mono Font:** Geist Mono, case-study code blocks only (with ui-monospace, SFMono-Regular, Menlo, Consolas)

**Character:** One family in two widths reads like a technical document set in a single grotesque: the condensed heavy capitals are part titles stamped across the sheet, and the normal width carries plain first-person sentences and figures.

### Hierarchy
- **Part title XL** (800, step 5 `clamp(4.5rem, 2rem + 8vw, 8.5rem)`, line-height 0.8, condensed caps): one giant word filling a reading column (Experience, fitted with `min(21.5cqw, step 5)`), and the 404 numeral.
- **Part title** (800, step 4 `clamp(3rem, 1.2rem + 6.4vw, 6rem)`, line-height 0.9, -0.01em, condensed caps): every home-page section title and the name across the hero sheet.
- **Headline** (700, step 3 `clamp(2.25rem, 1.4rem + 3.4vw, 4rem)`, line-height 1, -0.03em, tabular): feature figures in the measured-results table, the 404 heading; condensed at this size for the signature under the letter.
- **Title** (600 to 700, step 2 `clamp(1.375rem, 1.1rem + 0.9vw, 2rem)`, line-height 1.08 to 1.2, -0.015em): hero fact lines and statement, folder tab titles, large lead sentences that stand in for a missing picture, footer and contact openers, article h2.
- **Body** (400, 1rem, line-height 1.55): running text, measured to 34 to 60ch. Long-form articles run at 1.0625rem / 1.65 within 68ch.
- **Label** (400 or 600, step 0 0.875rem): meta lines (category, dates, tool lists), photo credits, captions, stub items. Sentence case, never tracked out.

### Named Rules
**The One-Family Rule.** Archivo does every job. Condensed caps are reserved for part titles, the name and the MSA mark; everything else is normal width in sentence case. Monospace appears only inside case-study code.

**The Six-Step Rule.** Sizes come from `--text-step-0` to `--text-step-5` (0.875rem, 1rem, then four fluid clamps). Hierarchy beyond that comes from weight and width, not new sizes.

**The Opt-In Figures Rule.** Body figures are proportional (`tnum` off); the `.num` class turns on tabular figures wherever numbers must align: features, dates, the timeline, tally slips, counters, tables.

## Layout

The home page is a vertical run of full-bleed fields. Content sits in a 90rem (1440px) container with gutters of 20px on phones, 32px from 640px and 48px from 1024px. From 1024px a 12-column grid with a 24px gap places a section title across 6 to 7 columns and its short explanatory paragraph at the far right (columns 8 or 10 onward), bottom-aligned with the title. Folders put the picture in 7 columns and the text in 4, starting at column 9.

Reading columns are narrower: the experience stack, the letter and the 404 run in a 40rem column, the hero sheet is capped at 64rem, the contact card is 24rem, articles cap at 68ch with a 15rem table of contents from 1280px.

Vertical rhythm is generous between sections (112px top and bottom on phones, 144 to 160px from 1024px) and tight inside them: 20px from part title to paragraph, 40 to 64px to the first table or plot, 6px between experience bars. Section headings are left-aligned so the bottom-right stub never covers them.

Breakpoints are Tailwind's defaults (640, 768, 1024, 1280px). On phones the features table, characteristics table and folders collapse to a single column; the characteristics table drops its header row and stacks each row as a block; the contact photograph becomes its own band with the card overlapping it by 48px.

## Elevation & Depth

The system is flat. Depth comes from the two-ink alternation, one tone step (`--surface`) and paper sheets laid over photographs, never from shadows on content. Photographs sit under a flat 50% black scrim, not a filter or gradient.

### Shadow Vocabulary
- **Floating stub** (`box-shadow: 0 12px 32px rgb(0 0 0 / 0.28)`): the fixed bottom-right navigation tab, the only element above the page at rest.
- **Drawer** (`box-shadow: -24px 0 64px rgb(0 0 0 / 0.25)`): the assistant slide-over, with a 50% black backdrop.
- **Palette** (`box-shadow: 0 24px 64px rgb(0 0 0 / 0.35)`): the centred command palette, with a 50% black backdrop.

### Named Rules
**The Float-Only Rule.** A shadow means the thing is physically above the page: the stub and modal dialogs. Sheets, tables, folders and cards never cast one.

## Shapes

Square corners throughout (`rounded.none`): buttons, fields, sheets, bars, tables, dialogs, the stub. Form comes from paper instead: a 10px zigzag tear under the tally slip, a 12px scallop under the letter's tear-off strip, a 24px scallop rising into the footer postcard, a 5px dotted perforation line, 4px dotted leaders on slips, and shouldered folder tabs cut with a trapezoid clip-path (12px shoulders). The edges are SVG masks filled with the sheet's own colour, so they work in both themes.

**The Square-Corner Rule.** No border radius on any control or container. Curves appear only as paper devices (scallops, perforation dots) and as plotted data points.

**The Rule-Only-Where-Ruled Rule.** Borders exist for real table rows (1px `--border`) and form-field strokes. Containers are separated by tone and field, not outlines.

## Components

### Buttons
Solid, rectangular and decisive.
- **Shape:** square corners (0px), 48px minimum height (52 to 56px for the full-width contact action on touch).
- **Primary:** spot blue fill with white text, semibold, 20 to 24px horizontal padding, optional 16px icon after or before the label.
- **Ink:** datasheet ink fill with paper text (Download the résumé, Ask my AI first).
- **Hover / Focus:** hover drops opacity to 90% on fine pointers; focus is a 2px spot-blue outline offset 3px; press scales to 0.97 over 160ms on `--ease-out` (`.pressable`). Disabled is 60% opacity.
- **Text link:** ink text with a 2px spot-blue underline offset 4px; hover turns the text spot blue. Used for résumé, case-study and external links.

### Inputs / Fields
- **Style:** paper-tone fill, no box, square, 16px text, a 2px bottom stroke that is transparent at rest.
- **Focus:** the bottom stroke turns spot blue; the hero ask field instead draws a 2px spot-blue outline around the whole field and button.
- **Error / Disabled:** the bottom stroke and the message below turn warn red; errors are semibold step 0.
- **Ask field (signature):** the hero's live question field: paper-tone input with the spot-blue "Ask my AI" button joined to it, and two example questions set as underlined links beneath. It opens the assistant drawer with the question.

### Navigation (the stub)
What remains of the hero sheet once you scroll: an ink tab fixed 12 to 20px from the bottom-right corner (respecting the safe-area inset), carrying the MSA mark (condensed caps on field spot blue), the primary section links from 1024px, Ask in field spot blue, the index (command palette, Ctrl K) and the theme toggle. Items are step 0, hover to field tone; the section in view is marked with field tone and field spot text. On phones it shows only the mark, Ask, a menu icon and the theme.

### Folders (work)
Each project or platform is a full-width band led by a shouldered tab carrying its title (step 2, bold). Bands alternate paper tone and ink field. The category sits as a muted step-0 line on the right; a screenshot or diagram plate takes seven columns; with no picture, the summary is set large in its place.

### Experience bars
A stack of paper-tone bars 56px tall, 6px apart. Each is a native disclosure: company, dates, and a plus that rotates 45 degrees to a cross when open. The panel fades in and settles 4px over 220ms; the current role starts open.

### Tables
Real tables keep their rules. The features table is paper tone with 1px rules, the figure at step 3 and the description at step 2. The characteristics table has an ink header row (paper text, bold) and 1px rules between rows.

### Sheets and slips
Paper sheets laid over photographs or ink fields: the hero sheet, the letter with a tear-off email strip, the zigzag-edged tally slip with dotted leaders and an ink total bar, the postcard footer with a stamp photograph outlined 2px in ink.

### Motion grammar
- **Curves:** `--ease-out` cubic-bezier(0.23, 1, 0.32, 1) is the default for every transition; `--ease-in-out` cubic-bezier(0.77, 0, 0.175, 1) for on-screen movement; `--ease-drawer` cubic-bezier(0.32, 0.72, 0, 1) for the assistant opening.
- **Press:** 0.97 scale, 160ms.
- **Entrances:** children of each revealed block rise 24px and fade in once (600ms opacity, 700ms translate), staggered 70ms up to 350ms. Content stays visible without JavaScript.
- **Hero:** the photograph drifts to 1.08 scale over 24s, alternating; from 1024px the sheet shrinks to 0.42 and fades toward the bottom-right as it scrolls out (scroll-driven).
- **Assistant drawer:** slides in over 300ms on the drawer curve, out in 180ms; the working state breathes (opacity to 45%, 1.6s) instead of bouncing dots.
- **Command palette:** never animates; it is a repeated keyboard action.
- **Icon swaps** (copy to check, sun to moon): 150ms blur-and-scale in.
- **Reduced motion:** entrances, drift, sheet shrink, drawer slide and breathing are all removed; disclosures fall back to a plain fade.

## Do's and Don'ts

### Do:
- **Do** switch whole sections between paper and ink fields with `.ink-field`, and let components read only the semantic tokens.
- **Do** reserve spot blue (#1747c9 light, #93b3ff dark) for buttons, link underlines, focus and live data marks.
- **Do** set section titles in condensed caps at step 4, left-aligned, with the explanatory paragraph at the far right of the 12-column grid.
- **Do** put measured figures in real tables or slips with tabular figures (`.num`) and 1px rules.
- **Do** use solid rectangular buttons, 48px tall, with square corners and the 0.97 press scale.
- **Do** lay paper sheets over photographs and fields, finished with zigzag, scalloped or perforated edges.
- **Do** keep every text and background pair at 4.5:1 or better in both themes.

### Don't:
- **Don't** add eyebrows or kickers above headings, or index numbers before sections.
- **Don't** use monospace outside case-study code blocks.
- **Don't** use gradients, including on photo scrims; use a flat 50% black.
- **Don't** put shadows on content at rest; only the stub and modal dialogs float.
- **Don't** round corners or use pill shapes for tags, buttons or chips; list tools as a plain comma-separated line.
- **Don't** outline containers; borders belong to real table rows and form fields.
- **Don't** animate the command palette, or animate height when a disclosure opens.
- **Don't** introduce type sizes outside the six steps, or a second type family for display.
