import { ListData } from "./ListData.js";
import ItemDialog from "./ItemDialog.js";
import SocketHandler from "./SocketHandler.js";

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

        if (game.settings.get("checklist", "data")) {
            const varData = game.settings.get("checklist", "data");
            ListData.data = varData;
        }

        game.socket?.on(SocketHandler.identifier, (data) => {
            console.log("Received update via dialog");
            console.log(data);
            ListData.setData(data);
            this.refresh();
        });
    }

    async getData() {
        const items = ListData.getData();
        console.log("GetData");
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
        const itemId = $(event.currentTarget).data("itemId");
        if (event.currentTarget.checked) {
            ListData.data[itemId].checked++;
        } else {
            ListData.data[itemId].checked--;
        }
        this.updateData();
    }

    refresh() {
        console.log("Refreshing dialog");
        this.render(false);
    }

    setData(newData) {
        ListData.data = newData;
        this.render(false);
    }

    updateData() {
        SocketHandler.sendUpdate();
    }

    _updateObject() {

    }
}
