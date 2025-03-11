
import { ListData } from "./ListData.js";

export default class ItemDialog extends FormApplication {

    constructor(...args) {
        super(...args);

        console.log(args);
        this.itemId = args[0];
        this.item = args[1];
        this.parent = args[2];
    }

    //Set up the default options for instances of this class
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/checklist/templates/item-dialog.hbs"; 
        options.width = "480";
        options.height = "640";
        options.title = game.i18n.localize("CHK.itemeditor");
        options.closeOnSubmit = true;
        options.resizable = true;
        return options;
    }

    async getData() {
        return this.item;
    }

    activateListeners(html) {
        html.find("input").change(this.onChange.bind(this));
    }

    onChange(event) {
        if (event.target.name === "name") {
            this.item.name = event.target.value;
        } else if (event.target.name === "description") {
            this.item.description = event.target.value;
        } else if (event.target.name === "checkboxes") {
            this.item.checkboxes = event.target.value;
        } else {
            console.log(`Invalid Event: name: ${event.target.name}, value: ${event.target.value}`);
        }
    }

    _updateObject() {
        ListData.editItem(this.itemId, this.item);
        this.parent.updateData();
        this.parent.render(false);
    }
}
