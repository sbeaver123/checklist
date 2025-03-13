
import { ListData } from "./ListData.js";

export default class SocketHandler {

    static identifier = "module.checklist";

    static registerListener() {
        game.socket?.on(SocketHandler.identifier, (data) => {
            console.log("Received update via handler.");
            ListData.setData(data);
            if (game.permissions.SETTINGS_MODIFY.includes(game.user.role)) {
                game.settings.set("checklist", "data", ListData.data);
            }
        });
    }

    static sendUpdate() {
        // If you have permission to update settings, update the checklist setting
        // with the current value of the data array. By default this will mean that
        // only the GM holds the array as a setting.
        if (game.permissions.SETTINGS_MODIFY.includes(game.user.role)) {
            game.settings.set("checklist", "data", ListData.data);
        }
        return game.socket.emit(SocketHandler.identifier, ListData.data);
    }
}