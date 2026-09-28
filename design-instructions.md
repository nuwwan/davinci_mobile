# DaVinci Mobile — UI Design Instructions
# For AI Design Agent / Figma / Mockup Tool
# Version 1.0

---

## HOW TO USE THIS FILE

This document contains screen-by-screen instructions for every page, state, and
transition in the DaVinci mobile app. Each screen section includes:
  - Layout and component descriptions
  - All text strings (headings, labels, placeholders, toasts, empty states)
  - All visual states (loading, error, empty, success)
  - Navigation and redirect behaviour
  - Color usage notes with placeholders [COLOR:NAME] for the palette you will supply

Replace all [COLOR:NAME] tokens with your chosen hex values before handing to the
design agent. Suggested semantic names are listed in the DESIGN TOKENS section.

---

## 1. DESIGN TOKENS (PLACEHOLDERS)
#007A8C
#336749
#6C757D
use these colors for the following color theme appropriately


### Brand Colors
  [COLOR:PRIMARY]          — main brand, buttons, active states, icons
  [COLOR:PRIMARY_HOVER]    — button pressed/hover state
  [COLOR:PRIMARY_LIGHT]    — selected option background, tinted surfaces
  [COLOR:PRIMARY_MUTED]    — borders on selected items, avatar border

### Accent / Streak Color
  [COLOR:ACCENT]           — streak count, gold/premium highlights
  [COLOR:ACCENT_LIGHT]     — streak badge background

### Surface Colors
  [COLOR:SURFACE]          — card background, modal background, input background
  [COLOR:SURFACE_2]        — subtle section dividers, chip backgrounds
  [COLOR:SURFACE_3]        — page/screen background

### Border Colors
  [COLOR:BORDER]           — default borders on inputs, cards
  [COLOR:BORDER_STRONG]    — focused input borders, dividers

### Text Colors
  [COLOR:TEXT_PRIMARY]     — headings, body text
  [COLOR:TEXT_SECONDARY]   — labels, subtitles, secondary text
  [COLOR:TEXT_TERTIARY]    — placeholders, hints, disabled text
  [COLOR:TEXT_INVERSE]     — text on primary-colored backgrounds

### Feedback Colors
  [COLOR:SUCCESS]          — correct answer, success states
  [COLOR:SUCCESS_BG]       — correct answer option background
  [COLOR:SUCCESS_BORDER]   — correct answer option border
  [COLOR:ERROR]            — wrong answer, error states, destructive actions
  [COLOR:ERROR_BG]         — error / wrong answer background
  [COLOR:ERROR_BORDER]     — error border

### Dark Mode overrides (same token names, different values)
  Supply a full second palette for dark mode. Component descriptions note
  which tokens flip — all surfaces invert, borders lighten, text inverts.

---

## 2. TYPOGRAPHY

Font families:
  Display  — Plus Jakarta Sans (weights: SemiBold 600, Bold 700)
  Body/UI  — Inter (weights: Regular 400, Medium 500, SemiBold 600, Bold 700)

Scale:
  page-title    32px / line-height 38px  — Plus Jakarta Sans Bold
  section       24px / 31px              — Plus Jakarta Sans SemiBold
  card-heading  18px / 25px              — Inter SemiBold
  question      15px / 23px              — Inter Regular
  body          14px / 21px              — Inter Regular
  metadata      13px / 19px             — Inter Medium
  hint          12px / 17px             — Inter Regular

---

## 3. COMPONENT LIBRARY REFERENCE

### Primary Button
  Background: [COLOR:PRIMARY]   Text: [COLOR:TEXT_INVERSE]
  Height: 52px   Border-radius: 16px   Full-width on forms
  Pressed: [COLOR:PRIMARY_HOVER] + scale 0.98
  Disabled: 40% opacity   Loading: shows spinner, text hidden

### Outline Button
  Border: 1.5px [COLOR:PRIMARY]   Text: [COLOR:PRIMARY]
  Background: transparent

### Destructive Outline Button
  Border: 1.5px [COLOR:ERROR]   Text: [COLOR:ERROR]
  Background: transparent
  Used for: Sign Out, Delete actions

### Input Field
  Height: 48px   Border-radius: 8px
  Background: [COLOR:SURFACE]
  Border default: 1.5px [COLOR:BORDER]
  Border focused: 1.5px [COLOR:PRIMARY]
  Border error:   1.5px [COLOR:ERROR]
  Label: 13px Inter Medium, [COLOR:TEXT_SECONDARY], sits above field, 8px gap
  Placeholder: [COLOR:TEXT_TERTIARY]
  Error text: 13px Inter, [COLOR:ERROR], sits below field, 8px gap
  Password field: eye toggle icon right-aligned, 24px, [COLOR:TEXT_TERTIARY]

### MCQ Option Button
  Min-height: 52px   Border-radius: 12px   Full-width
  Layout: [Letter badge 28×28px, rounded 8px] + [Option text, flex-1]
  States — Default:   border [COLOR:BORDER], bg [COLOR:SURFACE],       badge bg [COLOR:SURFACE_2]
  States — Selected:  border 1.5px [COLOR:PRIMARY], bg [COLOR:PRIMARY_LIGHT], badge bg [COLOR:PRIMARY], badge text [COLOR:TEXT_INVERSE]
  States — Correct:   border [COLOR:SUCCESS_BORDER], bg [COLOR:SUCCESS_BG],   badge bg [COLOR:SUCCESS], badge text [COLOR:TEXT_INVERSE]
  States — Wrong:     border [COLOR:ERROR_BORDER], bg [COLOR:ERROR_BG],       badge bg [COLOR:ERROR],   badge text [COLOR:TEXT_INVERSE]
  States — Dimmed:    border [COLOR:BORDER], bg [COLOR:SURFACE],              badge bg [COLOR:SURFACE_2], all text [COLOR:TEXT_TERTIARY]

### Badge / Pill
  Rounded-full, px 8px, py 2px
  Variants: primary (brand), success (correct/active), error (wrong/critical), streak (accent), default (neutral)
  Text: 12px Inter Medium

### Avatar
  Circle, sizes: 40px (list), 64px (header), 84px (profile)
  Border: 1.5px [COLOR:PRIMARY_MUTED]   Background: [COLOR:PRIMARY_LIGHT]
  Shows initials (max 2 chars) in [COLOR:PRIMARY] if no image
  Shows image if avatar_url present

### Card
  Border-radius: 16px   Background: [COLOR:SURFACE]
  Border: 1px [COLOR:BORDER]
  Shadow: 0 1px 3px rgba(0,0,0,0.08)

### Progress Bar
  Height: 8px   Border-radius: 9999px   Full-width
  Track: [COLOR:SURFACE_2]   Fill: [COLOR:PRIMARY]

### Toast Notification
  Position: top, 8px below status bar, left-right 16px margin
  Border-radius: 12px   Border: 1px   px 16px py 12px
  Success: bg [COLOR:SUCCESS_BG], border [COLOR:SUCCESS_BORDER], text [COLOR:SUCCESS]
  Error:   bg [COLOR:ERROR_BG],   border [COLOR:ERROR_BORDER],   text [COLOR:ERROR]
  Info:    bg [COLOR:PRIMARY_LIGHT], border [COLOR:PRIMARY_MUTED], text [COLOR:PRIMARY]

### Tab Bar
  Background: [COLOR:SURFACE]
  Height: 83px (includes 34px iOS safe area)
  Active item: icon + label in [COLOR:PRIMARY]
  Inactive item: icon + label in [COLOR:TEXT_TERTIARY]
  Icon size: 28px   Label: 11px Inter Medium
  Tabs (left to right): Home, Questions, Stats, Profile

### Section Separator Row
  Label left: 13px Inter Medium, [COLOR:TEXT_TERTIARY], ALL CAPS
  Optional value right: 14px Inter, [COLOR:TEXT_PRIMARY]
  Padding: 12px vertical, bordered bottom 1px [COLOR:BORDER]

---

## 4. GLOBAL LAYOUT RULES

  Status bar: dark icons on light screens, light icons on dark screens.
  Screen background: always [COLOR:SURFACE_3]
  Safe area: content never overlaps iOS home indicator (34px) or status bar (44–54px)
  Horizontal screen padding: 16px
  Scroll views: always scroll, no horizontal overflow
  Keyboard: screens with forms use KeyboardAvoidingView + ScrollView so keyboard never covers active input

---

## 5. SCREENS

---
### SCREEN A: SPLASH / BOOTSTRAP
---

Triggered: On every cold-start, before auth state is resolved.
Duration: Until fonts loaded + auth token verified (typically < 1 second).

Layout:
  Full-screen [COLOR:SURFACE_3] background.
  Centred vertically and horizontally:
    App logo or wordmark "DaVinci" — page-title size, [COLOR:PRIMARY]
    Tagline "The smarter way to learn" — body size, [COLOR:TEXT_SECONDARY]
  No buttons. No input. No tab bar.

Transitions:
  → Authenticated user with valid token → fade to HOME TAB
  → No token / expired token           → fade to LOGIN SCREEN

---
### SCREEN B: SIGN UP
---

Route: /(auth)/signup
Background: [COLOR:SURFACE_3]

Header area (centred, padding-top 48px):
  Text: "DaVinci"             — page-title, [COLOR:PRIMARY]
  Text: "Create your account" — body, [COLOR:TEXT_SECONDARY]

Form card (margin 16px horizontal, padding 24px, border-radius 28px, [COLOR:SURFACE], shadow):
  Heading: "Sign up" — section, [COLOR:TEXT_PRIMARY]

  Row of 2 inputs (gap 12px):
    Input: label "First name" / placeholder "e.g. Nuwan" / keyboard default / required
    Input: label "Last name"  / placeholder "e.g. Silva"  / keyboard default / optional

  Input: label "Email"            / placeholder "you@example.com" / keyboard email-address / autocomplete email / required
  Input: label "Password"         / placeholder "Min. 8 characters" / secure / autocomplete new-password / required
  Input: label "Confirm password" / placeholder "Repeat your password" / secure / required

  Primary button: "Create account" (full-width)

Footer (centred, padding-top 24px):
  Text: "Already have an account?" [COLOR:TEXT_SECONDARY]
  Tappable text: "Sign in" [COLOR:PRIMARY]

Validation — inline errors appear below each field:
  First name empty     → "First name is required"
  Email empty          → "Email is required"
  Email invalid format → "Enter a valid email address"
  Password empty       → "Password is required"
  Password too short   → "Password must be at least 8 characters"
  Confirm mismatch     → "Passwords do not match"

Loading state:
  "Create account" button shows spinner, all fields disabled, opacity 100% on button.

Success state (API returns 201):
  Toast: SUCCESS — "Account created! Check your email to verify your account before signing in."
  → Redirect immediately to LOGIN SCREEN

Error states:
  409 Email already registered → error text under email field: "This email is already registered"
  Other server errors          → Toast ERROR — "Registration failed. Please try again."

Redirection map:
  "Sign in" link              → LOGIN SCREEN
  Successful registration     → LOGIN SCREEN (with success toast visible)

---
### SCREEN C: SIGN IN (LOGIN)
---

Route: /(auth)/login
Background: [COLOR:SURFACE_3]

Header area (centred, padding-top 48px):
  Text: "DaVinci"                   — page-title, [COLOR:PRIMARY]
  Text: "The smarter way to learn"  — body, [COLOR:TEXT_SECONDARY]

Form card (same card style):
  Heading: "Sign in" — section, [COLOR:TEXT_PRIMARY]

  Input: label "Email"    / placeholder "you@example.com" / keyboard email-address
  Input: label "Password" / placeholder "••••••••" / secure / eye-toggle to show/hide

  Primary button: "Sign in" (full-width)

Footer (centred):
  Text: "Don't have an account?" [COLOR:TEXT_SECONDARY]
  Tappable text: "Sign up" [COLOR:PRIMARY]

Validation:
  Email empty          → "Email is required"
  Email invalid format → "Enter a valid email address"
  Password empty       → "Password is required"

Loading state: Button shows spinner, fields disabled.

Success state (API returns 200 + token):
  Toast INFO — "Welcome back!" (brief, 2 seconds)
  → Redirect to HOME TAB

Error states:
  400 Invalid credentials → Toast ERROR — "Invalid email or password."
  403 Account inactive    → Toast ERROR — "Your account is not active yet. Check your email for a verification link."
  Other                   → Toast ERROR — "Something went wrong. Try again."

Redirection map:
  "Sign up" link      → SIGN UP SCREEN
  Successful login    → HOME TAB
  Already logged in   → HOME TAB (AuthGate redirect, no login screen shown)

---
### SCREEN D: EMAIL VERIFICATION (Informational)
---

Shown: After registration success, before the user verifies their email.
This is an interstitial/info screen, not a blocking wall (user is redirected to login).

The toast on the LOGIN SCREEN after signup serves this purpose:
  Toast SUCCESS: "Account created! Check your email to verify your account before signing in."

If the user tries to log in with an unverified account:
  Toast ERROR: "Your account is not active yet. Check your email for a verification link."

Resend Verification Email button (optional, on login screen if 403 received):
  Outline button: "Resend verification email"
  On press → calls POST /auth/activate with email
  Loading state: spinner on button
  Success: Toast INFO — "Verification email sent. Please check your inbox."
  Error: Toast ERROR — "Couldn't send email. Please try again."

---
### SCREEN E: HOME TAB — DAILY QUESTION
---

Route: /(tabs)/index
Tab icon: house (filled)
Tab label: "Home"
Background: [COLOR:SURFACE_3]

--- SUB-STATE E1: LOADING ---

Layout:
  Greeting header visible (see below)
  Centred in remaining space:
    Large spinner (32px), [COLOR:PRIMARY]
  No tab bar animations during load.

--- SUB-STATE E2: AUTHENTICATED, QUESTION LOADED ---

Layout (scroll view, gap 20px, padding 16px):

  Greeting block:
    Text: "Hi, {first_name} 👋" — page-title, [COLOR:TEXT_PRIMARY]
    Text: "Here's your daily question" — body, [COLOR:TEXT_SECONDARY]

  Question card (border-radius 28px, [COLOR:SURFACE], border [COLOR:BORDER], shadow-sm, padding 16px):

    Header row (flex-row, space-between, gap 8px):
      Question title — card-heading, [COLOR:TEXT_PRIMARY], flex-1, max 2 lines
        Example: "Which of the following is NOT a programming language?"
      Difficulty badge (right-aligned):
        difficulty_level 1 → badge "Easy"    tone success
        difficulty_level 2 → badge "Medium"  tone streak (accent)
        difficulty_level 3 → badge "Hard"    tone error
        difficulty_level 4 → badge "Expert"  tone error
        difficulty_level 5 → badge "Master"  tone error

    Question body text (optional — shown if content.text exists):
      Text: content.text value — question, [COLOR:TEXT_SECONDARY], 12px top margin
      Example: "Select the correct programming language from the options below."

    Question image (optional — shown if content.image_url exists):
      Full-width image, max-height 200px, border-radius 12px, [COLOR:SURFACE_2] bg while loading

    MCQ options list (gap 8px, margin-top 8px):
      One OptionButton per option (options[0..n])
      Letter badges: A, B, C, D (or more if applicable)
      Label: options[i].text (fallback to options[i].alt_text if text is null)
      Initial state: all "default"
      On tap: tapped option → "selected", others remain "default"
      Only one option selectable at a time

    Submit button (full-width, 52px, [COLOR:PRIMARY]):
      Text: "Submit answer"
      Disabled (40% opacity) until an option is selected
      Loading (shows spinner) while API call in flight

--- SUB-STATE E3: ANSWER SUBMITTED — REVEALED ---

All MCQ options locked (disabled, no tap response).
Option visual states update immediately on API response:
  correct_answer_index  → "correct" state
  selected_option_index (if wrong) → "wrong" state
  all others → "dimmed" state

Submit button hidden and replaced by:

Result banner (border-radius 12px, padding 16px):
  Correct answer:
    Background [COLOR:SUCCESS_BG]   Border [COLOR:SUCCESS_BORDER]
    Text: "🎉 Correct!"      — section, [COLOR:SUCCESS], centred
    Text: "+{score} points"  — metadata, [COLOR:SUCCESS], centred (e.g. "+10 points")
    If score is 0: "No points awarded"
  Wrong answer:
    Background [COLOR:ERROR_BG]   Border [COLOR:ERROR_BORDER]
    Text: "✗ Incorrect"           — section, [COLOR:ERROR], centred
    Text: "0 points"              — metadata, [COLOR:ERROR], centred
    If negative_marks: "−{abs(score)} points"

Explanation panel (shown if explanation.text exists, below result banner):
  Background [COLOR:SUCCESS_BG]   Border [COLOR:SUCCESS_BORDER]  (use neutral surface if user was wrong)
  Heading: "Explanation" — card-heading, [COLOR:SUCCESS]
  Body: explanation.text — body, [COLOR:TEXT_PRIMARY]
  If explanation.image_url exists: show image below text, same image style

--- SUB-STATE E4: ALREADY ANSWERED (is_answered = true) ---

All options shown in locked state:
  correct_answer_index → "correct"
  all others → "dimmed"

Info notice (below options, padding 12px, border-radius 12px, [COLOR:SURFACE_2], border [COLOR:BORDER]):
  Text: "You've already answered today's question." — metadata, [COLOR:TEXT_SECONDARY], centred

If question has explanation: show explanation panel (correct tone).

Submit button hidden.

--- SUB-STATE E5: NO QUESTION TODAY ---

Centred in card area:
  Icon: calendar or checkmark (48px, [COLOR:TEXT_TERTIARY])
  Text: "No question today" — section, [COLOR:TEXT_SECONDARY], centred
  Text: "The admin hasn't published today's question yet. Check back soon!" — body, [COLOR:TEXT_TERTIARY], centred

--- SUB-STATE E6: ERROR ---

Centred:
  Text: "Couldn't load today's question." — body, [COLOR:TEXT_SECONDARY], centred
  DEV ONLY: small error code text — hint, [COLOR:TEXT_TERTIARY]
  Outline button: "Try again"

Redirection: If API returns 401, AuthGate redirects to LOGIN SCREEN.

---
### SCREEN F: QUESTIONS TAB — QUESTION HISTORY / BROWSE
---

Route: /(tabs)/questions  (FUTURE — not yet built)
Tab icon: book or document (filled)
Tab label: "Questions"
Background: [COLOR:SURFACE_3]

--- SUB-STATE F1: LOADING ---
Spinner centred, [COLOR:PRIMARY]

--- SUB-STATE F2: LIST WITH DATA ---

Layout (scroll view, padding 16px):

  Page header:
    Text: "Questions"          — page-title, [COLOR:TEXT_PRIMARY]
    Text: "Browse your topics" — body, [COLOR:TEXT_SECONDARY]

  Search bar (full-width, 48px, border-radius 12px, [COLOR:SURFACE], border [COLOR:BORDER]):
    Left: magnifying glass icon 20px [COLOR:TEXT_TERTIARY]
    Placeholder: "Search questions, subjects..."
    Clear icon (×) appears when text entered

  Filter chips (horizontal scroll row, gap 8px, padding-top 12px):
    "All"        — selected chip: [COLOR:PRIMARY] bg, [COLOR:TEXT_INVERSE] text
    "Easy"       — unselected: [COLOR:SURFACE_2] bg, [COLOR:TEXT_SECONDARY] text
    "Medium"
    "Hard"
    "Answered"
    "Unanswered"
    Chip style: border-radius 9999px, px 12px, py 6px, 13px Inter Medium

  Subject filter row (horizontal scroll, gap 8px, below chips):
    "All subjects" + one chip per subject: name from SubjectResponse.name
    Same chip style as above

  Question list (vertical, gap 12px):
    Each question item card ([COLOR:SURFACE], border [COLOR:BORDER], border-radius 16px, padding 16px):
      Row 1: Question title — 15px Inter SemiBold, [COLOR:TEXT_PRIMARY], max 2 lines
      Row 2 (flex-row, gap 8px, margin-top 8px):
        Difficulty badge (Easy/Medium/Hard per difficulty_level)
        Subject chip (subject name, default badge tone) — if subject_id present
        Sub-area chip (sub-area name, default tone) — if sub_area_id present
        Tags (up to 2 tags shown, each as a default chip)
      Row 3 (flex-row, space-between, margin-top 8px):
        Verified badge (if is_verified): "✓ Verified" — success tone
        Status text right-aligned:
          Answered: "Answered" in [COLOR:SUCCESS]
          Unanswered: "—" in [COLOR:TEXT_TERTIARY]
      Chevron right icon (16px, [COLOR:TEXT_TERTIARY]) top-right corner

    Pagination: "Load more" outline button at bottom when more pages available
    Loading more: spinner in place of button

--- SUB-STATE F3: EMPTY ---

Centred:
  Icon: book outline (48px, [COLOR:TEXT_TERTIARY])
  Text: "No questions yet"               — section, [COLOR:TEXT_SECONDARY], centred
  Text: "Questions will appear here once they're published by your instructor." — body, [COLOR:TEXT_TERTIARY], centred

--- SUB-STATE F4: SEARCH EMPTY ---

Centred:
  Icon: magnifying glass (48px, [COLOR:TEXT_TERTIARY])
  Text: "No results for "{search_term}"" — section, [COLOR:TEXT_SECONDARY], centred
  Text: "Try a different keyword or remove filters." — body, [COLOR:TEXT_TERTIARY], centred
  Outline button: "Clear search"

--- SUB-STATE F5: ERROR ---
Same as E6 pattern.

---
### SCREEN G: QUESTION DETAIL
---

Route: /(tabs)/questions/{id}  (FUTURE)
Shown: When a question card is tapped in the Questions list.
Presentation: Push slide (Stack navigation, back arrow in header).

Layout:
  Back arrow header: "← Questions" — card-heading, [COLOR:TEXT_PRIMARY]
  Scroll view, padding 16px:

  Question card:
    Title — section, [COLOR:TEXT_PRIMARY]
    Difficulty badge + subject chip row
    Body text (content.text if present)
    Image (content.image_url if present)

    Stats row (if QuestionStats available):
      "Total attempts: {total_attempts}"
      "Accuracy: {accuracy}%"
      "Avg. time: {average_time_seconds}s"
      Each as a mini badge-like stat chip

    MCQ options — same OptionButton components
    If user has already attempted: show revealed state (correct/wrong/dimmed)
    If not attempted: show interactive state with Submit button

  Explanation panel (if attempted and explanation exists)

---
### SCREEN H: STATS TAB — LEARNING ANALYTICS
---

Route: /(tabs)/stats  (FUTURE — not yet built)
Tab icon: chart bar (filled)
Tab label: "Stats"
Background: [COLOR:SURFACE_3]

--- SUB-STATE H1: LOADING ---
Skeleton cards (3 placeholder rectangles, [COLOR:SURFACE_2], animated shimmer)

--- SUB-STATE H2: DATA LOADED ---

Layout (scroll view, padding 16px, gap 20px):

  Page header:
    Text: "Stats"                     — page-title, [COLOR:TEXT_PRIMARY]
    Text: "Your learning overview"    — body, [COLOR:TEXT_SECONDARY]

  Summary stat cards row (2 cards side-by-side, gap 12px):
    Card 1 ([COLOR:SURFACE], border-radius 16px, padding 16px, shadow-sm):
      Large number: total answered questions — 32px Plus Jakarta Sans Bold, [COLOR:PRIMARY]
      Label: "Questions answered" — metadata, [COLOR:TEXT_SECONDARY]
    Card 2:
      Large number: current_streak — 32px Plus Jakarta Sans Bold, [COLOR:ACCENT]
      Label: "Day streak 🔥" — metadata, [COLOR:TEXT_SECONDARY]

  Accuracy card (full-width, [COLOR:SURFACE], border-radius 16px, padding 16px):
    Heading: "Accuracy" — card-heading, [COLOR:TEXT_PRIMARY]
    Large %: calculated correct/total — 40px Plus Jakarta Sans Bold, [COLOR:PRIMARY]
    Subtext: "{correct} correct out of {total}" — body, [COLOR:TEXT_SECONDARY]
    Progress bar (full-width, 8px, [COLOR:PRIMARY] fill on [COLOR:SURFACE_2] track)

  Streak card (full-width, same card style):
    Heading: "Streak" — card-heading, [COLOR:TEXT_PRIMARY]
    Current streak: "{current_streak} days" — 32px, [COLOR:ACCENT]
    Best streak: "Best: {best_streak} days" — body, [COLOR:TEXT_TERTIARY]
    7-day history row:
      7 circles (diameter 28px, gap 8px)
        Completed day: filled [COLOR:PRIMARY] circle, white tick icon
        Missed day:    outlined [COLOR:BORDER] circle
        Today:         filled [COLOR:PRIMARY_LIGHT], [COLOR:PRIMARY] border
      Day labels below each circle: "M T W T F S S" — hint, [COLOR:TEXT_TERTIARY]

  Learning time card:
    Heading: "Learning time" — card-heading, [COLOR:TEXT_PRIMARY]
    Value: "{total_learning_minutes} min" — 32px Plus Jakarta Sans Bold, [COLOR:PRIMARY]
    Label: "this month" — body, [COLOR:TEXT_SECONDARY]

  Difficulty breakdown card:
    Heading: "Difficulty preference" — card-heading, [COLOR:TEXT_PRIMARY]
    Current setting shown as active chip:
      Easy → success badge,  Medium → streak badge,  Hard → error badge,  Mixed → primary badge
    Subtext: "You can change this in your profile." — hint, [COLOR:TEXT_TERTIARY]

  Subject performance list (if data available):
    Heading: "By subject" — card-heading, [COLOR:TEXT_PRIMARY]
    Each row: subject name left, accuracy % right, thin progress bar below
    Tap row → navigates to SUBJECT DETAIL (future)

--- SUB-STATE H3: NO DATA (new user) ---

Centred within the scroll content:
  Icon: chart bar outline (64px, [COLOR:TEXT_TERTIARY])
  Text: "No stats yet"  — section, [COLOR:TEXT_SECONDARY], centred
  Text: "Answer your first daily question to start tracking your progress." — body, [COLOR:TEXT_TERTIARY], centred
  Primary button: "Go to today's question" → navigate to HOME TAB

--- SUB-STATE H4: ERROR ---
Same error + retry pattern as other tabs.

---
### SCREEN I: PROFILE TAB — VIEW MODE
---

Route: /(tabs)/profile
Tab icon: person (filled)
Tab label: "Profile"
Background: [COLOR:SURFACE_3]

--- SUB-STATE I1: LOADING (fetching /learner/me) ---

Layout (scroll):
  Avatar area: large circle placeholder [COLOR:SURFACE_2], shimmer animation
  Below: 2 placeholder text lines, shimmer

--- SUB-STATE I2: PROFILE LOADED ---

Layout (scroll view, padding 16px, gap 20px):

  Hero block (centred, padding-top 24px, gap 12px):
    Avatar circle (84px):
      Shows image if avatar_url is set
      Falls back to 2-char initials from first_name + last_name
      Border 1.5px [COLOR:PRIMARY_MUTED], bg [COLOR:PRIMARY_LIGHT]
    Full name: "{first_name} {last_name}" — section, [COLOR:TEXT_PRIMARY], centred
      If no name: "No name set" — [COLOR:TEXT_TERTIARY]
    Email: "{email}" — body, [COLOR:TEXT_SECONDARY], centred
    Role badge:
      LEARNER  → primary tone  "Learner"
      CREATOR  → success tone  "Creator"
      AUTHOR   → streak tone   "Author"
      ADMIN    → error tone    "Admin"

  Personal info card ([COLOR:SURFACE], border-radius 20px, border [COLOR:BORDER], padding 16px):
    Section label: "PERSONAL INFO" — metadata, [COLOR:TEXT_TERTIARY], ALL CAPS, letter-spacing 0.5px
    Info rows (each: label left [COLOR:TEXT_SECONDARY] 13px, value right [COLOR:TEXT_PRIMARY] 14px, separator [COLOR:BORDER]):
      First name       {first_name}
      Last name        {last_name}  — hidden row if null
      Email            {email}
      Bio              {bio}        — hidden row if null
      Location         {location}   — hidden row if null
      Institution      {institution}— hidden row if null
      Phone            {phone}      — hidden row if null
      Social links     {social_links} — hidden row if null
    "Edit profile" outline button (full-width, below last row, margin-top 16px)

  Learning stats card (shown only if learner_profile data exists):
    Section label: "LEARNING STATS"
    Info rows:
      Difficulty       {difficulty_preference} — capitalised (Easy / Medium / Hard / Mixed)
      Current streak   {current_streak} day(s)
      Best streak      {best_streak} day(s)
      Learning time    {total_learning_minutes} min

  Account card:
    Section label: "ACCOUNT"
    Info rows:
      Role             {role}
      Status           Active | Inactive — shown with colored dot (success/error)
      Joined           {created_at formatted as "Jan 2025"}
      User ID          {id} — truncated to first 8 chars + "…"

  "Sign out" destructive outline button (full-width, [COLOR:ERROR] border + text):
    Tap triggers confirmation bottom sheet (see SCREEN I4)

--- SUB-STATE I3: ERROR LOADING PROFILE ---

Hero block with authUser data (from Redux, always available if authenticated)
Error banner below hero:
  Background [COLOR:ERROR_BG]   Border [COLOR:ERROR_BORDER]   border-radius 12px   padding 12px
  Text: "Couldn't load full profile." — body, [COLOR:ERROR]
  Outline button: "Try again" (small)

Personal info card still shows authUser data (first_name, last_name, email from token).

---
### SCREEN J: PROFILE TAB — EDIT MODE
---

Triggered: Tap "Edit profile" button on SCREEN I2.
Same route, inline replace (no push navigation), card animates to edit form.

Layout (within Personal info card, same card, content swaps):
  Section label: "EDIT PROFILE"

  Input row (50/50):
    Input: label "First name" / value pre-filled from first_name
    Input: label "Last name"  / value pre-filled from last_name

  Input: label "Email" / value pre-filled from email / keyboard email-address

  (Future fields — add placeholders now, wire later):
  Input: label "Bio"        / placeholder "Tell us about yourself" / multiline 3 lines
  Input: label "Location"   / placeholder "City, Country"
  Input: label "Institution"/ placeholder "School or organisation"
  Input: label "Phone"      / placeholder "+1 555 000 0000"

  Difficulty preference selector:
    Label: "Difficulty preference"
    4 tappable chips in a row: "Easy" "Medium" "Hard" "Mixed"
    Selected chip: [COLOR:PRIMARY] bg, [COLOR:TEXT_INVERSE] text
    Unselected:    [COLOR:SURFACE_2] bg, [COLOR:TEXT_SECONDARY] text

  Button row (gap 12px, side by side):
    Left 50%: Outline button "Cancel" — [COLOR:TEXT_SECONDARY] border + text
    Right 50%: Primary button "Save"

Validation:
  First name empty     → "First name is required"
  Email invalid format → "Enter a valid email address"

Loading state (Save tapped):
  "Save" button shows spinner, all inputs disabled.

Success state (API returns 200):
  Edit form animates back to view mode.
  Toast SUCCESS — "Profile updated!"

Error state:
  Toast ERROR — "Failed to save. Please try again."
  Form stays open so user doesn't lose their edits.

Cancel:
  Form animates back to view mode, no changes saved.

---
### SCREEN K: SIGN OUT CONFIRMATION
---

Triggered: Tap "Sign out" button on PROFILE screen.
Presentation: Bottom sheet modal slides up from bottom.

Bottom sheet ([COLOR:SURFACE], border-radius 20px top corners, padding 24px):
  Drag handle bar: [COLOR:SURFACE_2], 4×32px, centred, border-radius 2px, margin-bottom 20px
  Icon: door-open or log-out (32px, [COLOR:ERROR])
  Heading: "Sign out?" — section, [COLOR:TEXT_PRIMARY], centred
  Body: "You'll need to sign back in to access your daily questions." — body, [COLOR:TEXT_SECONDARY], centred
  Margin-top 24px:
    Destructive button: "Sign out" (full-width, [COLOR:ERROR] bg or destructive outline)
    Outline button:     "Cancel"   (full-width, margin-top 12px)

  Backdrop: semi-transparent scrim [COLOR:SURFACE] at 45% opacity, tap to dismiss.

On confirm:
  Redux loggedOut() dispatched → all tokens cleared.
  AuthGate detects unauthenticated → redirects to LOGIN SCREEN.
  Toast INFO — "You've been signed out."

On cancel:
  Sheet dismisses, user stays on Profile.

---
### SCREEN L: SUBJECTS / CATALOGUE BROWSE
---

Route: /(tabs)/questions/subjects  (FUTURE)
Shown as a tab within Questions tab, or as a top-level browse section.

Layout (scroll, padding 16px):
  Page header: "Subjects" — page-title, [COLOR:TEXT_PRIMARY]
  Subtitle: "Browse by subject area" — body, [COLOR:TEXT_SECONDARY]

  Search bar (full-width, same style as Questions search)

  Subject grid (2-column, gap 12px):
    Each subject card ([COLOR:SURFACE], border-radius 16px, padding 16px, border [COLOR:BORDER]):
      Subject icon or first letter in large format (40px, [COLOR:PRIMARY])
      Subject name — card-heading, [COLOR:TEXT_PRIMARY]
      Description (if present, max 2 lines) — body, [COLOR:TEXT_SECONDARY]
      Sub-area count — metadata, [COLOR:TEXT_TERTIARY]  "N topics"
      Subscribe status badge:
        Subscribed   → "Subscribed" success badge, right-aligned
        Unsubscribed → no badge

    On tap: opens SUBJECT DETAIL SCREEN

--- SUB-STATE: EMPTY ---
  Text: "No subjects available yet." with informational message.

---
### SCREEN M: SUBJECT DETAIL + SUBSCRIPTION
---

Route: /(tabs)/questions/subjects/{id}  (FUTURE)
Presentation: Push slide.

Header: back arrow + subject name

Layout (scroll):
  Subject hero card:
    Subject name — section, [COLOR:TEXT_PRIMARY]
    Description  — body, [COLOR:TEXT_SECONDARY]
    Subscribe/Unsubscribe button (full-width primary or outline):
      If subscribed:   Outline button "Unsubscribe" → confirmation sheet
      If unsubscribed: Primary button "Subscribe"

  Sub-areas list:
    Heading: "Topics in this subject" — card-heading
    Each sub-area row ([COLOR:SURFACE], border-radius 12px, padding 12px):
      Sub-area name — 14px Inter SemiBold, [COLOR:TEXT_PRIMARY]
      Description (if present, 1 line) — 13px, [COLOR:TEXT_SECONDARY]
      Active/inactive indicator dot
      Subscribe toggle (small outline button "Subscribe" / "Unsubscribe")
      Question count — "N questions" metadata right-aligned

Subscribe action:
  Tap "Subscribe" → Primary button loading state
  Success → Button changes to "Unsubscribe" (outline), Toast INFO — "Subscribed to {subject name}!"
  Error   → Toast ERROR — "Couldn't subscribe. Try again."

Unsubscribe confirmation bottom sheet:
  "Unsubscribe from {subject}?"
  Body: "You will no longer receive questions from this subject."
  Destructive button: "Unsubscribe"
  Cancel button

---
### SCREEN N: SETTINGS (accessible from Profile tab)
---

Route: /(tabs)/profile/settings  (FUTURE)
Presented as a push screen from Profile via a "Settings" row.

Layout (scroll, [COLOR:SURFACE_3] bg):
  Back header: "← Profile"   Heading: "Settings"

  Notifications card:
    Section label: "NOTIFICATIONS"
    Row: "Daily question reminder"  Toggle switch (ON by default)
    Row: "Streak reminders"         Toggle switch
    Row: "Notification time"        Tappable row showing current time → opens time picker
    Row: Notification frequency chip: Daily / Weekly

  Display card:
    Section label: "DISPLAY"
    Row: "Dark mode"     3-way toggle: System / Light / Dark
    Row: "Font size"     3-way toggle: Small / Medium / Large

  Privacy card:
    Section label: "PRIVACY"
    Row: "Public profile"  Toggle (learner_profile.is_public_profile)
      On: others can see your stats and profile
      Off: profile is private

  About card:
    Section label: "ABOUT"
    Row: "App version"    right text: "1.0.0"
    Row: "Terms of Service" → opens web view / browser
    Row: "Privacy Policy"  → opens web view / browser

  Danger zone card ([COLOR:ERROR_BG] bg, [COLOR:ERROR_BORDER] border):
    Section label: "DANGER ZONE"
    Row: "Delete account" — [COLOR:ERROR] text + trash icon
      Tap → confirmation bottom sheet
      "This will permanently delete your account and all your data."
      Destructive button: "Delete my account"

---
### SCREEN O: NOTIFICATIONS / TOAST SYSTEM (Global)
---

All toasts appear at the top of the screen, 8px below the status bar.
Auto-dismiss after 3 seconds.
Max 3 lines of text.

Toast variants and their triggers:
  SUCCESS [COLOR:SUCCESS_BG / SUCCESS_BORDER / SUCCESS]:
    - "Profile updated!"
    - "Account created! Check your email..."
    - "Subscribed to {subject}!"
    - "Unsubscribed from {subject}."

  ERROR [COLOR:ERROR_BG / ERROR_BORDER / ERROR]:
    - "Invalid email or password."
    - "Something went wrong. Try again."
    - "Couldn't load today's question."
    - "Registration failed. Please try again."
    - "Failed to save. Please try again."
    - "Couldn't subscribe. Try again."
    - "This email is already registered."

  INFO [COLOR:PRIMARY_LIGHT / PRIMARY_MUTED / PRIMARY]:
    - "Welcome back!"
    - "Verification email sent. Please check your inbox."
    - "You've been signed out."

---
### SCREEN P: ERROR / OFFLINE STATE (Global)
---

Shown when network is unavailable or server is unreachable.

Inline error state (within each screen's content area):
  Icon: wifi-off or cloud-error (48px, [COLOR:TEXT_TERTIARY])
  Text: "{screen-specific message}" — section, [COLOR:TEXT_SECONDARY], centred
  Text: "Check your internet connection and try again." — body, [COLOR:TEXT_TERTIARY], centred
  Outline button: "Try again"

Global offline banner (appears at very top below status bar when offline):
  Background [COLOR:ERROR_BG]   Border-bottom [COLOR:ERROR_BORDER]   padding 8px 16px
  Text: "No internet connection" — metadata, [COLOR:ERROR], centred
  Dismisses automatically when connection is restored.

---

## 6. NAVIGATION & ROUTING MAP

```
App Start
│
├── [No token / expired]       → SPLASH → LOGIN
├── [Valid token]              → SPLASH → HOME TAB
│
AUTH GROUP  /(auth)/
│   ├── login    ←→  signup
│   └── signup   →   login (after success)
│
TABS GROUP  /(tabs)/
│   ├── index     (Home)
│   ├── questions (Questions)  [FUTURE]
│   │   ├── subjects/{id}      [FUTURE]
│   │   └── {question_id}      [FUTURE]
│   ├── stats     (Stats)      [FUTURE]
│   └── profile   (Profile)
│       └── settings           [FUTURE]
│
MODALS
│   ├── Sign Out Confirmation  (bottom sheet, from Profile)
│   ├── Unsubscribe Confirmation (bottom sheet, from Subject)
│   └── [Any future modals]
│
GLOBAL
    ├── AuthGate: any protected route → LOGIN if not authenticated
    └── Toast system: global overlay, all screens
```

---

## 7. SCREEN SIZES & SAFE AREAS

Design for iPhone 14 / 15 base:
  Canvas: 390 × 844px
  Status bar height: 47px
  Bottom safe area (home indicator): 34px
  Tab bar height (including safe area): 83px
  Usable content height: 844 - 47 - 83 = 714px

Also design at:
  iPhone SE 3rd gen: 375 × 667px (smallest supported)
  iPhone 15 Pro Max: 430 × 932px (largest)
  Ensure no content is clipped on the SE size.

---

## 8. ANIMATION & INTERACTION NOTES

  Tab switching:        instant, no transition animation (standard tab behaviour)
  Stack push (detail): slide from right, duration 300ms ease-out
  Bottom sheets:       slide up, duration 250ms ease-out; dismiss on swipe-down or backdrop tap
  Toast appear:        slide down from top, duration 200ms ease-out; auto-dismiss after 3s
  Form submit:         button scale 0.98 on press, returns on release
  Option select:       option button border/background animates, duration 150ms
  Reveal (post-submit):all options animate state in sequence left-to-right, 50ms stagger
  Loading skeleton:    shimmer sweep animation, [COLOR:SURFACE_2] → [COLOR:BORDER] → [COLOR:SURFACE_2]
  Edit mode toggle:    card content cross-fades between view/edit, duration 200ms

---

## 9. ACCESSIBILITY NOTES

  All interactive elements: minimum 44×44px tap target
  All images: include alt text attribute in design spec
  Color contrast: all text must meet WCAG AA (4.5:1 for body, 3:1 for large text)
  Disabled states: 40% opacity (not solely color-based)
  Focus rings: visible on keyboard navigation (web target)
  Screen reader: all icon-only buttons have accessible labels

---

## 10. FUTURE SCREENS (PLACEHOLDERS TO DESIGN NOW)

These screens are not yet implemented in code but should be designed to complete
the full app prototype. Use the same design system and token set.

  F. Questions List Tab          — see SCREEN F above
  G. Question Detail             — see SCREEN G above
  H. Stats Tab                   — see SCREEN H above
  L. Subjects Catalogue          — see SCREEN L above
  M. Subject Detail              — see SCREEN M above
  N. Settings Screen             — see SCREEN N above
  Q. Onboarding Flow (3 slides)  — value prop intro before first sign-up
  R. Forgot Password             — email input → "Reset link sent" confirmation screen
  S. Reset Password              — new password + confirm (deep link from email)
  T. Change Password             — from Settings, requires current password
  U. Notification Preferences   — detailed notification settings
  V. About / Legal               — app version, terms, privacy policy (web view)

---

## 11. ONBOARDING FLOW (FUTURE — SCREEN Q)

Three full-screen slides before the sign-up call-to-action.

Slide 1:
  Illustration: person answering a question on phone
  Heading: "A question a day"   — page-title, [COLOR:PRIMARY]
  Body: "Get one hand-picked MCQ every day tailored to your subject." — body, [COLOR:TEXT_SECONDARY]

Slide 2:
  Illustration: streak / fire / calendar
  Heading: "Build your streak"  — page-title, [COLOR:TEXT_PRIMARY]
  Body: "Stay consistent. See your streak grow as you answer daily." — body, [COLOR:TEXT_SECONDARY]

Slide 3:
  Illustration: analytics / chart
  Heading: "Track your progress" — page-title, [COLOR:TEXT_PRIMARY]
  Body: "See your accuracy, time spent, and improvement over time." — body, [COLOR:TEXT_SECONDARY]

Progress dots below each slide (3 dots, active = [COLOR:PRIMARY], inactive = [COLOR:SURFACE_2])
"Skip" ghost button top-right on slides 1–2
"Get started" primary button on slide 3 → SIGN UP SCREEN
"Already have an account? Sign in" below button on slide 3

---

END OF DESIGN INSTRUCTIONS FILE
DaVinci Mobile v1.0 — provide your color palette to replace all [COLOR:*] tokens
