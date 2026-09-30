# nta-portfolio

### Reusable link previews

`src/component/LinkPreview.tsx` wraps a semantic anchor with a static screenshot
that floats beside the pointer. The preview is a white frame around a 16:10 image
and is hidden from screen readers.

```tsx
import { LinkPreview } from "./src/component/LinkPreview";

<LinkPreview
  href="https://unbrah.ac.id/"
  preview="/previews/baiturrahmah.webp"
>
  Baiturrahmah
</LinkPreview>
```

Add real screenshots to `public/previews/` (see its README). The initial paths are
`baiturrahmah.webp` and `rsgmp.webp`; assets have not yet been supplied. Omitted or
failed screenshots display a neutral image area. Reload after adding or replacing
an asset.

HTTP(S) links open in a new tab by default. Standard anchor props (`target`, `rel`,
`className`) are supported. Fine-pointer hover opens the card immediately and its
position follows the cursor through `requestAnimationFrame`; keyboard focus uses
the link edge as its position. The card flips or clamps at viewport edges. Touch
navigation stays native. Images use `next/image`, mount on demand, and are fetched
from the local app. Animations honor reduced motion.

Profile mentions use this component through `RichMention`. To add one, create an
entity in `src/content/entities`, register it in `src/data/entities.ts`, and
reference its slug in a `mention` segment. Set `preview` to the local screenshot
path. `logo` is used only for the existing inline mention icon.

A future standalone capture script can write to `public/previews/` without
changing the component. No Playwright or other screenshot dependency is added.
