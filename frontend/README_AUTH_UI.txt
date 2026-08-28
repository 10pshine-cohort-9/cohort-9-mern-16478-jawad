AUTH UI PATCH

1. Install Motion:
   npm install motion

2. Copy this patch's contents into the frontend folder, preserving paths.

3. Run:
   npm run typecheck
   npm run lint
   npm run build
   npm run dev

Routes:
- /login opens Sign In mode.
- /signup opens Sign Up mode.
- Toggle buttons swap the actual form and welcome panels without navigation.

Desktop:
- Full-screen fixed page.
- Form and welcome panels slide across each other.
- Only the form content scrolls when needed.

Mobile:
- Welcome panel is compact at the top.
- Form area scrolls inside the fixed viewport.
