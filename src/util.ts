import { app, nativeImage } from "electron";
import fs from "fs";
import path from "path";

export function findIcon(name: string) {
    let iconPath = fromDataDirs("icons/" + name);

    if (iconPath === null)
        iconPath = path.join("./data/icons/", name);

    return nativeImage.createFromPath(iconPath);
}

export function hasAlert(title: string) {
    return title.includes("(!)");
}

function fromDataDirs(iconPath: string) {
    for (let dataDir of process.env.XDG_DATA_DIRS.split(":")) {
        let fullPath = path.join(dataDir, iconPath);
        if (fs.existsSync(fullPath))
            return fullPath;
    }
    return null;
}
