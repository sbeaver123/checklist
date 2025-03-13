
import CheckListDialog from "./apps/ChecklistDialog.js";
import SocketHandler from "./apps/SocketHandler.js";

export class CheckList {

    static async Init(controls, html) {

        const checkListBtn = $(`<li class="scene-control" title="Check List">
                <i class="fa-solid fa-bars-progress"></i>
            </li>
             `);

        // Append the main button to the main controls
        html.find('.main-controls').append(checkListBtn);

        checkListBtn.on("click", (e) => {
            const dialog = new CheckListDialog();
            dialog.render(true);
        });
    }
}

Hooks.once("init", () => {

    game.settings.register("checklist", "title", {
        name: "Check List Title",
        hint: "The title of the list.",
        scope: "world",
        type: String,
        default: "Default Checklist",
        config: true
    });

    game.settings.register("checklist", "data", {
        name: "data",
        scope: "world",
        type: Array,
        default: [],
        config: false
    });

    SocketHandler.registerListener();
});

Hooks.on("renderSceneControls", (controls, html) => {
    CheckList.Init(controls, html);
});

Handlebars.registerHelper("boxes", (numboxes, numchecked, block) => {

    var fullblock = "";
    for (var i = 1; i <= numboxes; i++) {
        block.data.name = i;
        if (i <= (numchecked)) {
            block.data.checked = true;
        } else {
            block.data.checked = false;
        }
        fullblock += block.fn(this);
    }
    return fullblock;
});
