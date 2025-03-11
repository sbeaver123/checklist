import { ListData } from "./ListData.js";
import ItemDialog from "./ItemDialog.js";

export default class CheckListDialog extends FormApplication {

    identifier = "module.checklist";

    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/checklist/templates/checklist-dialog.hbs";
        options.resizable = true;
        options.height = 670;
        options.width = 500;
        return options;
    }

    constructor(...args) {
        super(...args);

        game.socket?.on(this.identifier, (data) => {
            this.setData(data);
        });

        if (game.settings.get("checklist", "data")) {
            const varData = game.settings.get("checklist", "data");
            ListData.data = varData;
        }
    }

    async getData() {
        const items = ListData.getData();
        console.log(items);
        return {
            "title": game.settings.get("checklist", "title"),
            "listItems": items
        }
    }

    activateListeners(html) {
        html.find(".chklist-add").click(event => this.addItem(event));
        html.find(".edit").click(event => this.editItem(this.getItemIdFromEvent(event)));
        html.find(".delete").click(event => this.deleteItem(this.getItemIdFromEvent(event)));
        html.find("input").change(this.onChange.bind(this));
    }

    getItemIdFromEvent(event) {
        const parent = $(event.currentTarget).parents(".chklist-item-controls");
        return parent.data("itemId");
    }

    addItem(event) {
        ListData.addItem();
        this.updateData();
        this.render(false);
    }

    deleteItem(itemId) {
        ListData.deleteItem(itemId);
        this.updateData();
        this.render(false);
    }

    editItem(itemId) {
        let dlg = new ItemDialog(itemId, ListData.data[itemId], this);
        dlg.render(true);
    }

    onChange(event) {
        console.log(event);
        const itemId = $(event.currentTarget).data("itemId");
        console.log(itemId);
        if (event.currentTarget.checked) {
            ListData.data[itemId].checked++;
        } else {
            ListData.data[itemId].checked--;
        }
        console.log(ListData.data[itemId]);
        this.updateData();
    }

    setData(newData) {
        ListData.data = newData;
        this.render(false);
    }

    updateData() {
        // If you have permission to update settings, update the checklist setting
        // with the current value of the data array. By default this will mean that
        // only the GM holds the array as a setting.
        if (game.permissions.SETTINGS_MODIFY.includes(game.user.role)) {
            game.settings.set("checklist", "data", ListData.data);
        }
        return game.socket.emit(this.identifier, ListData.data);
    }

    _updateObject() {

    }
}
