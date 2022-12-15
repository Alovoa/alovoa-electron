import { BrowserWindow, Menu, MenuItem, Tray, Notification } from "electron";
import { findIcon, hasAlert } from "../util";
import Alovoa from "../alovoa";
import Module from "./module";
import Settings from "../settings";

const settings = new Settings("tray");

export default class TrayModule extends Module {
 
    private readonly tray: Tray;
    private hasNotification = false;

    private ICON = findIcon("tray.png");
    private ICON_UNREAD = findIcon("tray-unread.png");

    constructor(
        private readonly alovoa: Alovoa,
        private readonly window: BrowserWindow
    ) {
        super();
        this.tray = new Tray(this.ICON);
    }

    public override onLoad() {
        this.updateMenu();
        this.registerListeners();
    }

    private updateMenu() {
        const startMinimized = settings.get('start-minimized');
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

    private readonly NOTIFICATION_TITLE = 'Alovoa';
    private readonly NOTIFICATION_BODY = 'New like or message'; //TODO Translation

    private showNotification() {
        if (Notification.isSupported()) {
            new Notification({ title: this.NOTIFICATION_TITLE, body: this.NOTIFICATION_BODY }).show();
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
            console.log("page-title-updated");
            if (!explicitSet) return;


            let showDot: boolean = hasAlert(title);
            this.tray.setImage(showDot ? this.ICON_UNREAD : this.ICON);

            if (showDot && !this.hasNotification) {
                this.showNotification();
            }
            this.hasNotification = showDot;
        });
    }
};
