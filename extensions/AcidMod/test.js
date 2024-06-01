// Name: AcidMod Test
// ID: acidTest
// Description: Blocks used for testing stuff in AcidMod.
// By: AcidMod <https://github.com/>
// Original: AcidMod
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
                "id": "acidTest",
                "name": "AcidMod Test",
                "color1": "#00a30b",
                "color2": "#0f8500",
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    blocks.push({
        opcode: "everysec",
        blockType: Scratch.BlockType.EVENT,
        text: "do every [secs] seconds",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["everysec"] = async (args, util) => {};

    blocks.push({
        opcode: "threeequals",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "[str1] === [str2]",
        arguments: {
            "str1": {
                type: Scratch.ArgumentType.STRING,
            },
            "str2": {
                type: Scratch.ArgumentType.STRING,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["threeequals"] = async (args, util) => {
        return (args["str1"] === args["str2"])
    };

    setInterval(async () => {
        Scratch.vm.runtime.startHats(`${Extension.prototype.getInfo().id}_everysec`)
    }, (1 * 1000));

    blocks.push({
        opcode: "warpexemptloop",
        blockType: Scratch.BlockType.EVENT,
        text: "forever (exempt from Warp Timer)",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["warpexemptloop"] = async (args, util) => {};

    setInterval(async () => {
        Scratch.vm.runtime.startHats(`${Extension.prototype.getInfo().id}_warpexemptloop`)
    }, (0.00001 * 1000));

    Scratch.extensions.register(new Extension());
})(Scratch);
