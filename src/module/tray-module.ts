import { BrowserWindow, Menu, MenuItem, Tray } from "electron";
import { findIcon, hasAlert } from "../util";
import Alovoa from "../alovoa";
import Module from "./module";
import Settings from "../settings";

const ICON = findIcon("com.alovoa.AlovoaDesktop.png");
const ICON_UNREAD = findIcon("com.alovoa.AlovoaDesktop-unread.png");
const settings = new Settings("tray");

export default class TrayModule extends Module {

    private readonly tray: Tray;

    constructor(
        private readonly alovoa: Alovoa,
        private readonly window: BrowserWindow
    ) {
        super();
        this.tray = new Tray(ICON);
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
                type : "checkbox",
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

            this.tray.setImage(showDot ? ICON_UNREAD : ICON);
        });
    }
};
