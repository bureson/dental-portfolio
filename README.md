# MUDr. Irena Burešová — portfolio

Personal site for a dentist. Next.js (App Router) + Tailwind CSS v4, exported
as static pages and hosted on Firebase Hosting.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build    # static export into out/
```

## Structure

```
src/
  app/
    layout.tsx           root layout, Cormorant Garamond + Outfit fonts, JSON-LD
    page.tsx             home page (assembles the sections)
    globals.css          colour palette and typography as CSS variables
    login/               login page (Firebase Auth)
    vocabulary/          private page — its own palette and Lora + Manrope
  components/
    site/                portfolio sections (Hero, About, Education, Services, Contact…)
    vocabulary/          word list, flashcards, quiz
    ParallaxLayers.tsx   moves every element carrying a data-plx attribute
  lib/
    content.ts           all portfolio copy and data
    firebase.ts          Firebase initialisation in the browser
    auth.tsx             sign-in state (onAuthStateChanged, login, logout)
    vocabulary.ts        words in the Realtime Database
```

### Editing the copy

All text, contact details, opening hours, services and the education timeline
live in `src/lib/content.ts`. Changing the wording never means touching JSX.

### Photographs

Drop the files into `public/` and fill in the paths in `src/lib/content.ts`:

```ts
export const photos = {
  portrait: "/profilepic.jpg",
  office: "/ordi.jpg",
};
```

While a path is `null`, a labelled placeholder is rendered in its place.

## Signing in

The ✳ in the footer leads to `/login` — a login page offering two ways in
through Firebase Authentication:

- a Google account (`signInWithPopup` + `GoogleAuthProvider`),
- email and password (`signInWithEmailAndPassword`).

After signing in, the visitor continues to `/vocabulary`.

### Setup

1. In the Firebase console enable both **Email/Password** and **Google** under
   **Authentication → Sign-in method**, and create the database under
   **Build → Realtime Database**.
2. Under **Users**, create an account for password sign-in — the site offers no
   registration. Google, by contrast, creates an account on first sign-in, so
   restrict who is allowed in (via authorized domains, or by deleting unwanted
   accounts).
3. Copy `.env.example` to `.env.local` and fill in the values from
   **Project settings → General → Your apps**:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Without these variables the site still renders normally, there is just no way
to sign in (the form says so). They are read at build time, so changing them
means running `npm run build` again.

The same values are committed in `.env.production`, which is what CI builds
from — a clean checkout has no `.env.local`, and without a config the deployed
bundle would ship with sign-in and vocabulary dead. Committing them is safe:
they are a public project identifier, already visible in the bundle every
visitor downloads. The protection is Authentication plus
`database.rules.json`, not the secrecy of these strings. Keep the two files in
step when anything changes.

After deploying, add the domain under **Authentication → Settings → Authorized
domains**, otherwise Google sign-in fails with `auth/unauthorized-domain`.

## Vocabulary

`/vocabulary` is a hidden page holding a card file of vocabulary (list,
flashcards, quiz) — "Slovníček" in the site's own navigation. Its link appears
only once signed in.

The words live in the Realtime Database under `vocabulary` — **one list shared
by everyone who can sign in**, not one per account. The page subscribes to that
node, so every visitor, device and open tab sees the same list and edits appear
without a reload.

```
vocabulary/
  w<id>/ { front, back }       # id doubles as the sort key, newest first
```

The `w` prefix is load-bearing. Realtime Database converts a map whose keys are
small sequential integers into a JSON array, so `{1: …, 2: …}` would read back
as `[null, …, …]` and the leading null would be parsed as a word. A non-numeric
prefix keeps it an object.

An emptied list simply removes the node, and reads back as no words — which is
what it means. Nothing is auto-seeded.

### Security rules

`database.rules.json` restricts each node to its owner and is deployed with:

```bash
firebase deploy --only database
```

The rules deny everything by default, allow `vocabulary` to any signed-in
visitor, and validate the shape of what gets written. Without them the database
would be readable by anyone at all.

Because the list is shared, **anyone able to sign in can edit or delete every
word.** With Google enabled as a provider that means any Google account, since
Google creates the account on first sign-in. To keep it to a known set of
people, either turn Google off and hand out password accounts, or pin the rules
to specific uids:

```json
".write": "auth != null && (auth.uid === 'uid-one' || auth.uid === 'uid-two')"
```

> **Careful:** the `/vocabulary` page itself is part of the static bundle, so
> the page is hidden rather than protected — but the words behind it are now
> genuinely guarded by the rules above.

## Deploying to Firebase Hosting

One-off:

```bash
npm install -g firebase-tools
firebase login
```

The project is configured in `.firebaserc`. To deploy:

```bash
npm run build
firebase deploy --only hosting,database
```

> Avoid `firebase init` — the database step of the CLI wizard crashes with
> `TypeError: Body is unusable`, a bug in firebase-tools, not in this project.
> Everything it would set up is already committed.

### CI

`.github/workflows/` deploys hosting on every push to `main` and publishes a
preview channel for pull requests. Both need the repository secret
`FIREBASE_SERVICE_ACCOUNT_DENTIST_PORTFOLIO_9EA33`.

CI deploys **hosting only** — `database.rules.json` is not published by the
workflow, so after changing the rules run `firebase deploy --only database`
by hand.

`firebase.json` serves the `out/` directory, turns on `cleanUrls` (so
`/vocabulary` works without `.html`) and sets a long cache for
`/_next/static/**`.

To preview a production build locally:

```bash
npm run build
firebase emulators:start --only hosting
```
