import { app } from 'electron';
import Alovoa from './alovoa';

if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit();
}

app.whenReady().then(() => new Alovoa().init());
