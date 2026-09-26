---
'@tiptap/static-renderer': patch
---

`renderToMarkdown` now numbers an ordered list from its `start` attribute, so a list that starts at 3 is written as `3.`, `4.` instead of `1.`, `2.`.
