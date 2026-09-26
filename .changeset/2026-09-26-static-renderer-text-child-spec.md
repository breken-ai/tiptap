---
'@tiptap/static-renderer': patch
---

`renderToHTMLString` and `renderToReactElement` no longer throw on a `renderHTML` result like `['div', 'text']`, where the second item is a text child rather than attributes. For example, a Twitch node with an unsupported URL now renders `<div>Invalid Twitch URL</div>`, as it does in the editor, instead of failing the whole render.
