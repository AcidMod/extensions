// Name: Cooleans
// ID: acidCoolean
// Description: Cooleans, the definitive way of if condition reporters
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

    function doSound(ab, cd, runtime) {
        const audioEngine = runtime.audioEngine;

        const fetchAsArrayBufferWithTimeout = (url) =>
            new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                let timeout = setTimeout(() => {
                    xhr.abort();
                    reject(new Error("Timed out"));
                }, 5000);
                xhr.onload = () => {
                    clearTimeout(timeout);
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error(`HTTP error ${xhr.status} while fetching ${url}`));
                    }
                };
                xhr.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error(`Failed to request ${url}`));
                };
                xhr.responseType = "arraybuffer";
                xhr.open("GET", url);
                xhr.send();
            });

        const soundPlayerCache = new Map();

        const decodeSoundPlayer = async (url) => {
            const cached = soundPlayerCache.get(url);
            if (cached) {
                if (cached.sound) {
                    return cached.sound;
                }
                throw cached.error;
            }

            try {
                const arrayBuffer = await fetchAsArrayBufferWithTimeout(url);
                const soundPlayer = await audioEngine.decodeSoundPlayer({
                    data: {
                        buffer: arrayBuffer,
                    },
                });
                soundPlayerCache.set(url, {
                    sound: soundPlayer,
                    error: null,
                });
                return soundPlayer;
            } catch (e) {
                soundPlayerCache.set(url, {
                    sound: null,
                    error: e,
                });
                throw e;
            }
        };

        const playWithAudioEngine = async (url, target) => {
            const soundBank = target.sprite.soundBank;

            let soundPlayer;
            try {
                const originalSoundPlayer = await decodeSoundPlayer(url);
                soundPlayer = originalSoundPlayer.take();
            } catch (e) {
                console.warn(
                    "Could not fetch audio; falling back to primitive approach",
                    e
                );
                return false;
            }

            soundBank.addSoundPlayer(soundPlayer);
            await soundBank.playSound(target, soundPlayer.id);

            delete soundBank.soundPlayers[soundPlayer.id];
            soundBank.playerTargets.delete(soundPlayer.id);
            soundBank.soundEffects.delete(soundPlayer.id);

            return true;
        };

        const playWithAudioElement = (url, target) =>
            new Promise((resolve, reject) => {
                const mediaElement = new Audio(url);

                mediaElement.volume = target.volume / 100;

                mediaElement.onended = () => {
                    resolve();
                };
                mediaElement
                    .play()
                    .then(() => {
                        // Wait for onended
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });

        const playSound = async (url, target) => {
            try {
                if (!(await Scratch.canFetch(url))) {
                    throw new Error(`Permission to fetch ${url} denied`);
                }

                const success = await playWithAudioEngine(url, target);
                if (!success) {
                    return await playWithAudioElement(url, target);
                }
            } catch (e) {
                console.warn(`All attempts to play ${url} failed`, e);
            }
        };

        playSound(ab, cd)
    }
    class Extension {
        getInfo() {
            return {
                "id": "acidCoolean",
                "name": "Cooleans",
                "color1": "#2eb877",
                "color2": "#288f6d",
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    blocks.push({
        opcode: "ifthenelserep",
        blockType: Scratch.BlockType.REPORTER,
        text: "if [bool] then [str] else [elsestr]",
        arguments: {
            "bool": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
            "str": {
                type: Scratch.ArgumentType.STRING,
            },
            "elsestr": {
                type: Scratch.ArgumentType.STRING,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["ifthenelserep"] = async (args, util) => {
        if (Boolean(args["bool"])) {
            return args["str"]

        } else {
            return args["elsestr"]

        };
    };

    blocks.push({
        opcode: "ifrep",
        blockType: Scratch.BlockType.REPORTER,
        text: "if [bool] then [str]",
        arguments: {
            "bool": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
            "str": {
                type: Scratch.ArgumentType.STRING,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["ifrep"] = async (args, util) => {
        if (Boolean(args["bool"])) {
            return args["str"]
        };
    };

    blocks.push({
        opcode: "ifbool",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "if [bool] then true",
        arguments: {
            "bool": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["ifbool"] = async (args, util) => {
        if (Boolean(args["bool"])) {
            return true

        } else {
            return false

        };
    };

    blocks.push({
        opcode: "ifthenelsebool",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "if [bool] then true else [bool2]",
        arguments: {
            "bool": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
            "bool2": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["ifthenelsebool"] = async (args, util) => {
        if (Boolean(args["bool"])) {
            return true

        } else {
            if (Boolean(args["bool2"])) {
                return true

            } else {
                return false

            };

        };
    };

    blocks.push({
        opcode: "ifthennull",
        blockType: Scratch.BlockType.REPORTER,
        text: "if [bool] then null",
        arguments: {
            "bool": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["ifthennull"] = async (args, util) => {
        if (Boolean(args["bool"])) {
            return null

        } else {
            return null

        };
    };

    blocks.push({
        opcode: "iffalsebool",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "if [bool] false ",
        arguments: {
            "bool": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["iffalsebool"] = async (args, util) => {
        if (Boolean(args["bool"])) {
            return false

        } else {
            return true

        };
    };

    blocks.push({
        opcode: "ifthenfalse",
        blockType: Scratch.BlockType.REPORTER,
        text: "if [bool] false then [str]",
        arguments: {
            "bool": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
            "str": {
                type: Scratch.ArgumentType.STRING,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["ifthenfalse"] = async (args, util) => {
        if (Boolean(!args["bool"])) {
            return args["str"]

        } else {

        };
    };

    Scratch.extensions.register(new Extension());
})(Scratch);
