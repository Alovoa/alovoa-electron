import { app, BrowserWindow, ipcMain, shell, nativeTheme } from "electron";
import path from "path";
import { findIcon } from "./util";
import ChromeVersionFix from "./fix/chrome-version-fix";
import Electron21Fix from "./fix/electron-21-fix";
import HotkeyModule from "./module/hotkey-module";
import ModuleManager from "./module/module-manager";
import TrayModule from "./module/tray-module";
import WindowSettingsModule from "./module/window-settings-module";
import Settings from "./settings";

const USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.9999.0 Safari/537.36";
const traySettings = new Settings("tray");

export default class Alovoa {

    private readonly window: BrowserWindow;
    private readonly moduleManager: ModuleManager;
    private readonly WEB_URL: string = 'https://alovoa.com/';
    //private readonly WEB_URL: string = 'http://localhost:8080/';
    
    public quitting = false;

    constructor() {
        this.window = new BrowserWindow({
            title: "Alovoa",
            width: 1100,
            height: 700,
            minWidth: 310,
            minHeight: 600,
            icon: findIcon("com.alovoa.alovoa-electron.png"),
            show: !process.argv.includes("--start-hidden") && !traySettings.get('start-minimized'),
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: false // native Notification override in preload :(
            }
        });

        this.updateTheme();

        this.moduleManager = new ModuleManager([
            new Electron21Fix(),
            new HotkeyModule(this, this.window),
            new TrayModule(this, this.window),
            new WindowSettingsModule(this, this.window),
            new ChromeVersionFix(this)
        ]);
    }

    public init() {
        this.registerListeners();

        this.moduleManager.beforeLoad();

        this.window.setMenu(null);
        this.window.loadURL(this.WEB_URL, { userAgent: USER_AGENT });

        this.moduleManager.onLoad();
    }

    public reload() {
        this.window.webContents.reloadIgnoringCache();
    }

    public quit() {
        this.quitting = true;
        this.moduleManager.onQuit();
        app.quit();
    }

    private registerListeners() {
        app.on('second-instance', () => {
            this.window.show();
            this.window.focus();
        });

        ipcMain.on('notification-click', () => this.window.show());
    }

    public updateTheme() {
        if (traySettings.get('force-dark-theme')) {
            nativeTheme.themeSource = 'dark'
        } else {
            nativeTheme.themeSource = 'system'
        }  
    }
};
