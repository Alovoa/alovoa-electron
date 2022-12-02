import { ipcMain } from "electron";
import Alovoa from "../alovoa";
import Fix from "./fix";

export default class ChromeVersionFix extends Fix {

    constructor(private readonly alovoa: Alovoa) {
        super();
    }

    public override onLoad() {
        this.alovoa.reload();

        ipcMain.on("chrome-version-bug", () => {
            console.info("Detected chrome version bug. Reloading...");
            this.alovoa.reload();
        });
    }
}
