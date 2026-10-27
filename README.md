# Darkio Fonty Fun — Revenge Classic (v0.3.1)

A local-display styling prototype for Revenge Classic. It includes 21 Unicode look-alike lettering presets, animated color modes (Rainbow, Ocean, Sunset, Aurora, Neon Pulse, and Gummy), three animation speeds, exact-name matching, settings storage, and cleanup when disabled.

## Install on Revenge Classic (GitHub-hosted method)

This project uses the classic plugin layout and also includes `repo.json` for clients with the older repository browser. The ZIP itself is a source package, not a guaranteed one-tap install archive.

1. Download and extract this ZIP.
2. Create a **public** repository on GitHub. Keep its default branch as `main`.
3. Upload the *contents* of the `darkio-fonty-fun-classic` folder to the repository root (the root should directly contain `manifest.json`, `repo.json`, `README.md`, and `builds/`). Do not upload only the outer folder.
4. On GitHub, make sure `manifest.json` is visible at the root and the built script exists at `builds/dev.darkio.fonty-fun/index.js`.
5. In Revenge Classic, open **Settings → Revenge → Plugins**. Use the **+ / Install a plugin / Import from clipboard** option shown by your build.
6. Paste the raw GitHub **base URL**, ending with a slash. Format: `https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/`. Replace both capitalized placeholders with your GitHub username and repository name. Do not append `manifest.json` or `repo.json` in the direct plugin installer.
7. Install **Darkio Fonty Fun**, enable it, open its settings, type your exact display name, then enable local styling. Choose a font and color mode.

If your build has a separate repository-manager screen, the optional repository URL is `https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/repo.json`. Use that only in the repository manager, not the normal direct-install field.

## Features and limitations

- 21 lettering presets. Discord's named Display Name Styles are approximated with Unicode; this does not unlock Nitro or ship Discord's proprietary fonts.
- Color FX: Solid, Prism/Rainbow, Ocean, Sunset, Aurora, Neon Pulse, Gummy; Slow, Normal, and Fast animation speeds.
- Local-only render transformation. Does not edit your account's profile or public display name.
- Exact text matching can also affect another identical text occurrence. Some Discord screens may not use the React element path patched by the plugin.
- Unicode glyph appearance varies by device, Android font, and app version.
- This bundle passes a JavaScript syntax check, but has not been live-tested inside your exact Revenge Classic build. If it fails or the app starts crashing, disable/uninstall it from Plugins or use the client's recovery/safe mode.
- Plugins run inside the Discord client with broad access. This plugin contains no network-request or token-reading logic; still review and only install code you trust. Client modifications may violate Discord's Terms of Service.
