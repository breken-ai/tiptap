---
'@tiptap/static-renderer': patch
---

`renderToMarkdown` no longer writes the word `null` for a code block without a language (` ```null `) or an image without alt text (`![null](…)`).
