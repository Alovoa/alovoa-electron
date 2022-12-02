# Alovoa Desktop for Linux (unofficial)
Alovoa Linux client built with Electron. As Alovoa doesn't compile the official app for Linux, here is an unofficial build. 

## 📜 Disclaimer
This just loads https://web.alovoa.com/ with some extra features, but never changing the content of the official webpage (html, css nor javascript). Linux users just can't install any official app, and alovoa-deskop-linux is running the official web client.

This wrapper is not verified by, affiliated with, or supported by Alovoa Inc.

## 💾 Installation
### 🖱️✔️ Recommended: Flathub
The official Flatpak build is updated instantly after every update.

<a href="https://flathub.org/apps/details/io.github.mimbrero.AlovoaDesktop"><img src="https://flathub.org/assets/badges/flathub-badge-en.png" width="250"></a>

### 🖱️ AppImage
The AppImage build is attached to every release. Check the [releases page](https://github.com/mimbrero/alovoa-desktop-linux/releases).
Download the .AppImage file, mark it as executable and double click it. [Check this video tutorial](https://www.youtube.com/watch?v=nzZ6Ikc7juw).

## :hammer: CLI arguments
- `--start-hidden`: starts Alovoa hidden in tray.

## :construction: Development
PR and forks are welcome!

1. Clone the repo
```bash
git clone https://github.com/Alovoa/alovoa-electron.git
cd alovoa-electron
```

2. Install dependencies
```bash
npm install
```

3. Run or build
```bash
npm start # compile and run
npm run build # compile and build
```
