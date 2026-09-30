# Landing-page screenshots

Add real static screenshots here:

- `baiturrahmah.webp` — https://unbrah.ac.id/
- `rsgmp.webp` — https://rsgm.unbrah.ac.id/

No screenshots have been supplied yet. These paths are already configured in
`src/content/entities`; missing or failed images show a neutral preview instead.
Once the files are added, reload the page (and redeploy in production).

Recommended: capture the top of the landing page at 1280 × 800, export to WebP,
and keep each file reasonably small (ideally below 200 KB). The card displays a
16:10 viewport with top-aligned object-cover cropping. Do not put logos or mock
screenshots here. Images are served locally through Next.js image optimization;
there are no requests to destination websites and no iframe.

Future screenshot generation can be a separate script that writes these same
files. The hover component does not need to know how screenshots were captured.
