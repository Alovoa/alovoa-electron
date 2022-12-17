import { BrowserWindow, Menu, Tray, Notification, nativeTheme } from "electron";
import { findIcon, hasAlert } from "../util";
import Alovoa from "../alovoa";
import Module from "./module";
import Settings from "../settings";

const settings = new Settings("tray");

export default class TrayModule extends Module {

    private readonly NOTIFICATION_TITLE = 'Alovoa';
    private readonly NOTIFICATION_BODY = 'New like or message'; //TODO Translation
 
    private readonly tray: Tray;
    private hasNotification = false;
    private darkTheme = false;
    private forceDarkTheme = false;

    private ICON = findIcon("com.alovoa.alovoa-electron-tray.png");
    private ICON_UNREAD = findIcon("com.alovoa.alovoa-electron-tray-unread.png");
    private ICON_LIGHT = findIcon("com.alovoa.alovoa-electron-tray-light.png");
    private ICON_UNREAD_LIGHT = findIcon("com.alovoa.alovoa-electron-tray-unread-light.png");
    

    constructor(
        private readonly alovoa: Alovoa,
        private readonly window: BrowserWindow
    ) {
        super();
        this.darkTheme = nativeTheme.shouldUseDarkColors;
        this.tray = new Tray(this.ICON);
    }

    public override onLoad() {
        this.updateMenu();
        this.registerListeners();
    }

    private updateMenu() {
        const startMinimized = settings.get('start-minimized');
        const forceDarkTheme = settings.get('force-dark-theme');
        const menu = Menu.buildFromTemplate([
            {
                //TODO Translation
                label: 'Start minimized',
                type: "checkbox",
                click: () => {
                    settings.set('start-minimized', !startMinimized);
                    this.updateMenu();
                },
                checked: startMinimized
            },
            {
                //TODO Translation
                label: 'Force dark theme',
                type: "checkbox",
                click: () => {
                    settings.set('force-dark-theme', !forceDarkTheme);
                    this.forceDarkTheme = !forceDarkTheme;
                    this.updateMenu();
                    this.alovoa.updateTheme();
                },
                checked: forceDarkTheme
            },
            {
                //TODO Translation
                label: "Quit",
                click: () => this.alovoa.quit()
            }
        ]);

        //TODO variable
        let tooltip = "Alovoa";

        this.tray.setContextMenu(menu);
        this.tray.setToolTip(tooltip);
    }

    private onClickFirstItem() {
        if (this.window.isVisible()) {
            this.window.hide();
        } else {
            this.window.show();
            this.window.focus();
        }

        this.updateMenu();
    }

    private showNotification() {
        if (Notification.isSupported()) {
            new Notification({ title: this.NOTIFICATION_TITLE, body: this.NOTIFICATION_BODY }).show();
        }
    }

    private updateTrayIcon() {
        var isDark = this.forceDarkTheme = nativeTheme.shouldUseDarkColors;
        if(this.darkTheme && this.hasNotification) {
            this.tray.setImage(this.ICON_UNREAD_LIGHT);
        } else if (!isDark && this.hasNotification) {
            this.tray.setImage(this.ICON_UNREAD);
        } else if (isDark && !this.hasNotification) {
            this.tray.setImage(this.ICON_LIGHT);
        } else {
            this.tray.setImage(this.ICON);
        }
    }

    private registerListeners() {

        this.window.on("close", event => {
            if (this.alovoa.quitting) return;

            event.preventDefault();
            this.window.hide();
        });

        this.tray.on("click", event => {
            this.onClickFirstItem();
        });

        this.window.webContents.on("page-title-updated", (_event, title, explicitSet) => {
            if (!explicitSet) return;
            let showDot: boolean = hasAlert(title);
            if (showDot && !this.hasNotification) {
                this.showNotification();
            }
            this.hasNotification = showDot;
            this.updateTrayIcon();
        });

        nativeTheme.on('updated', event => {
            this.updateTrayIcon();
            this.alovoa.updateTheme();
        }) 
    }
};
