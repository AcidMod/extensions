// Name: Super Variables
// ID: acidSuperVars
// Description: Super Variables, advanced variable creation and clearing on a separate temporary spectrum
// By: AcidMod <https://github.com/AcidMod>
// License: MPL-2.0

(async function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = {};


    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }

    class Extension {
        getInfo() {
            return {
                "id": "acidSuperVars",
                "name": "Super Variables",
                "color1": "#ff7b00",
                "color2": "#ff9500",
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    blocks.push({
        opcode: "literalNum",
        blockType: Scratch.BlockType.REPORTER,
        text: "([num])",
        arguments: {
            "num": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["literalNum"] = async (args, util) => {
        return args["num"]
    };

    blocks.push({
        opcode: "literalString",
        blockType: Scratch.BlockType.REPORTER,
        text: "\'[str]\'",
        arguments: {
            "str": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'string',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["literalString"] = async (args, util) => {
        return args["str"]
    };

    blocks.push({
        opcode: "clearvars",
        blockType: Scratch.BlockType.COMMAND,
        text: "clear [var]",
        arguments: {
            "var": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 'cool variable',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["clearvars"] = async (args, util) => {
        variables['cool variable'] = ""
    };

    blocks.push({
        opcode: "setvars",
        blockType: Scratch.BlockType.COMMAND,
        text: "set [var] to [val]",
        arguments: {
            "var": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cool variable',
            },
            "val": {
                type: Scratch.ArgumentType.empty,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["setvars"] = async (args, util) => {
        variables[args["var"]] = args["val"]
    };

    blocks.push({
        opcode: "clonevars",
        blockType: Scratch.BlockType.COMMAND,
        text: "clone [var] to [varclone]",
        arguments: {
            "var": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cool variable',
            },
            "varclone": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cool cloned variable',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["clonevars"] = async (args, util) => {
        variables[args["varclone"]] = variables[args["var"]]
    };

    blocks.push({
        opcode: "getvars",
        blockType: Scratch.BlockType.REPORTER,
        text: "get [var]",
        arguments: {
            "var": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cool variable',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["getvars"] = async (args, util) => {
        return variables[args["var"]]
    };

    Scratch.extensions.register(new Extension());
})(Scratch);