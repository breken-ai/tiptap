---
'@tiptap/markdown': patch
---

Plain-text URLs and email addresses are no longer backslash-escaped when serializing to Markdown. GFM turns them into links, and the backslashes became part of the link, so `https://example.com/my_page` came back as `https://example.com/my\_page` and `first_last@example.com` lost its first part.
