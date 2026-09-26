---
'@tiptap/static-renderer': patch
---

`renderToReactElement` now keeps `allowfullscreen`, `autoplay` and `disableremoteplayback`. React drops these attributes when they are spelled in lowercase, so YouTube and Twitch embeds rendered with React could not go fullscreen, and audio lost its autoplay and remote-playback settings.
