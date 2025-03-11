
export class ListData {

    static data = [];

    static addItem() {
        const item = {
            "name": "New Item",
            "description": "Description",
            "checkboxes": 0,
            "checked": 0
        }
        ListData.data.push(item);
    }

    static deleteItem(itemId) {
        ListData.data.splice(itemId, 1);
    }

    static editItem(itemId, entry) {
        ListData.data[itemId] = entry;
    }

    static getData() {
        return ListData.data;
    }

    static setData(data) {
        ListData.data = data;
    }
}
