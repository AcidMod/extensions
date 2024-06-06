// Name: Console
// ID: acidmodConsole
// Description: Interact with your developer console.
// By: AcidMod <https://github.com/AcidMod>
// License: MPL-2.0
(async function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = [];


    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }

    class Extension {
        getInfo() {
            return {
                "id": "acidmodConsole",
                "name": "Console",
                "color1": "#5c5c5c",
                "color2": "#000000",
                "blocks": blocks
            }
        }
    }
    blocks.push({
        opcode: `logconsole`,
        blockType: Scratch.BlockType.COMMAND,
        text: `log [str]`,
        isEdgeActivated: false,
        arguments: {
            "str": {
                type: Scratch.ArgumentType.STRING,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`logconsole`] = async (args, util) => {
        console.log(args["str"]);
    };

    blocks.push({
        opcode: `whenConsoleErr`,
        blockType: Scratch.BlockType.EVENT,
        text: `When an error is logged`,
        isEdgeActivated: false,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`whenConsoleErr`] = async (args, util) => {};

    blocks.push({
        opcode: `warnconsole`,
        blockType: Scratch.BlockType.COMMAND,
        text: `warn [str]`,
        isEdgeActivated: false,
        arguments: {
            "str": {
                type: Scratch.ArgumentType.STRING,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`warnconsole`] = async (args, util) => {
        console.warn(args["str"]);
    };

    blocks.push({
        opcode: `jsconfirm`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `confirm[str]`,
        isEdgeActivated: false,
        arguments: {
            "str": {
                type: Scratch.ArgumentType.STRING,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`jsconfirm`] = async (args, util) => {
        return confirm(args["str"])
    };

    blocks.push({
        opcode: `jsalert`,
        blockType: Scratch.BlockType.COMMAND,
        text: `alert[str]`,
        isEdgeActivated: false,
        arguments: {
            "str": {
                type: Scratch.ArgumentType.STRING,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`jsalert`] = async (args, util) => {
        alert(args["str"])
    };

    blocks.push({
        opcode: `jsprompt`,
        blockType: Scratch.BlockType.REPORTER,
        text: `prompt[str]`,
        isEdgeActivated: false,
        arguments: {
            "str": {
                type: Scratch.ArgumentType.STRING,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`jsprompt`] = async (args, util) => {
        return prompt(args["str"])
    };

    blocks.push({
        opcode: `errorconsole`,
        blockType: Scratch.BlockType.COMMAND,
        text: `error [str]`,
        isEdgeActivated: false,
        arguments: {
            "str": {
                type: Scratch.ArgumentType.STRING,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`errorconsole`] = async (args, util) => {
        console.error(args["str"]);
        Scratch.vm.runtime.startHats(`${Extension.prototype.getInfo().id}_whenConsoleErr`)
    };

    Scratch.extensions.register(new Extension());
})(Scratch);