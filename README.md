# Darkio Fonty Fun — Revenge Classic (v0.3.0)

A Revenge **Classic** plugin starter for local display-name styling. This package is structured as a Classic Bunny plugin repository (`repo.json` and `builds/<plugin-id>/...`), rather than the newer Revenge Next plugin template.

## Features added

- Animated text-color effects: Prism/Rainbow, Ocean, Sunset, Aurora, Neon Pulse, and Gummy.
- Adjustable speed: Slow, Normal, and Fast.
- 21 font presets: the 12 named Discord Display Name Styles as *visual inspirations* (gg sans, Tempo, Sakura, Jellybean, Modern, Medieval, 8Bit, Vampyre, Monkey Bars, Mainframe, Headbang, and Journal), plus Unicode options such as Double-Struck, Small Caps, Fullwidth, Bold Serif, Bold Italic, Bold Fraktur, Sans Italic, and Bubble Letters.
- Custom hex color, live preview, saved settings, enable toggle, and reset button.
- Lifecycle cleanup stops color animation and unpatches render hooks when the plugin stops.

## Important distinction about Discord fonts

The official Discord Display Name Styles are a Nitro feature. This plugin does **not** unlock Nitro, bundle Discord's proprietary font files, or change your account/profile name. The named options are Unicode look-alike approximations; the rendered appearance depends on the Android font and the Discord view. The color animation affects local rendering only when the patched text component is reached.

## Package layout

- `repo.json` — Revenge Classic repository index.
- `builds/dev.darkio.fonty-fun/manifest.json` — Bunny plugin manifest (`spec: 3`).
- `builds/dev.darkio.fonty-fun/index.js` — self-contained plugin script served by the repository.
- `source/font-data.js` — font option and character-map data for editing.

## Using it with Revenge Classic

Classic's external-plugin loader fetches `repo.json`, `builds/dev.darkio.fonty-fun/manifest.json`, and `builds/dev.darkio.fonty-fun/index.js` from a hosted repository. This ZIP is **not a direct one-tap install ZIP**. To install through the repository flow, publish the contents of this folder to a static HTTPS host (for example, a GitHub Pages site) so `repo.json` is available at the hosted root, then add that root URL in Revenge Classic's plugin-repository settings and install/enable **Darkio Fonty Fun**. Keep the folder structure intact.

## Test status and limitations

- The JavaScript bundle passes `node --check` and a mocked lifecycle/patch test.
- It has **not** been live-tested inside your particular Revenge Classic / Discord build. The plugin defensively attempts to patch React `createElement` and, where discoverable, the `jsx`/`jsxs` helpers. Different Discord builds may render some names through other component paths, so matching may be incomplete.
- The matcher uses exact text equality. If the same text occurs elsewhere, that occurrence may also be styled.
- Some Unicode glyphs may be unsupported or appear differently on different devices.
- Client modifications may violate Discord's Terms of Service. Only use plugins you trust; this code contains no network calls and does not read authentication tokens.

## Upstream format references

- Revenge Classic plugin runtime and manifest types: https://github.com/revenge-mod/revenge-bundle
- Discord Display Name Styles FAQ: https://support.discord.com/hc/en-us/articles/33833879643927-Discord-Display-Name-Styles-FAQ
