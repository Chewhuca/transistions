/**
 * Arten der Bildschirm-Überblendung
 */
enum TransitionEffect {
    //% block="Spirale"
    Spiral,
    //% block="Zeilen (oben nach unten)"
    WipeDown,
    //% block="Spalten (links nach rechts)"
    WipeRight,
    //% block="Vorhang (horizontal)"
    CurtainH,
    //% block="Diagonal"
    Diagonal,
    //% block="Schachbrett"
    Checkerboard
}

/**
 * Benutzerdefinierte visuelle Übergänge für das micro:bit LED-Display
 */
//% color="#E63946" weight=100 icon="\uf021" block="Transitions"
namespace Überblendungen {

    /**
     * Erzeugt den Koordinatenpfad basierend auf dem gewählten Effekt.
     */
    function getTransitionPath(effect: TransitionEffect): number[][] {
        let path: number[][] = [];

        switch (effect) {
            case TransitionEffect.Spiral:
                path = [
                    [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
                    [4, 1], [4, 2], [4, 3], [4, 4],
                    [3, 4], [2, 4], [1, 4], [0, 4],
                    [0, 3], [0, 2], [0, 1],
                    [1, 1], [2, 1], [3, 1],
                    [3, 2], [3, 3],
                    [2, 3], [1, 3],
                    [1, 2],
                    [2, 2]
                ];
                break;

            case TransitionEffect.WipeDown:
                for (let y = 0; y < 5; y++) {
                    for (let x = 0; x < 5; x++) {
                        path.push([x, y]);
                    }
                }
                break;

            case TransitionEffect.WipeRight:
                for (let x = 0; x < 5; x++) {
                    for (let y = 0; y < 5; y++) {
                        path.push([x, y]);
                    }
                }
                break;

            case TransitionEffect.CurtainH:
                let colPairs = [[0, 4], [1, 3], [2, 2]];
                for (let pair of colPairs) {
                    let cols = pair[0] == pair[1] ? [pair[0]] : [pair[0], pair[1]];
                    for (let c of cols) {
                        for (let r = 0; r < 5; r++) {
                            path.push([c, r]);
                        }
                    }
                }
                break;

            case TransitionEffect.Diagonal:
                for (let s = 0; s < 9; s++) {
                    for (let x = 0; x < 5; x++) {
                        let y = s - x;
                        if (y >= 0 && y < 5) {
                            path.push([x, y]);
                        }
                    }
                }
                break;

            case TransitionEffect.Checkerboard:
                let evens: number[][] = [];
                let odds: number[][] = [];
                for (let y = 0; y < 5; y++) {
                    for (let x = 0; x < 5; x++) {
                        if ((x + y) % 2 === 0) {
                            evens.push([x, y]);
                        } else {
                            odds.push([x, y]);
                        }
                    }
                }
                path = evens.concat(odds);
                break;
        }

        return path;
    }

    /**
     * Füllt den Bildschirm im gewählten Muster und gibt ihn rückwärts frei,
     * sodass am Ende nur das übergebene Bild sichtbar bleibt.
     * @param targetImage Das Bild, das am Ende dargestellt werden soll
     * @param effect Das Animationsmuster für den Übergang
     * @param delayMs Verzögerungszeit pro Schritt in Millisekunden (z.B. 35)
     */
    //% block="überblende zu %targetImage mit %effect Verzögerung %delayMs ms"
    //% delayMs.defl=35
    //% delayMs.min=5 delayMs.max=200
    //% weight=90
    export function showTransition(targetImage: Image, effect: TransitionEffect, delayMs: number = 35): void {
        let path = getTransitionPath(effect);

        // Phase 1: Vollständig nach Pfad füllen
        for (let pt of path) {
            led.plot(pt[0], pt[1]);
            basic.pause(delayMs);
        }

        basic.pause(delayMs * 2);

        // Phase 2: In umgekehrter Reihenfolge leeren und Ziel-Pixel behalten
        for (let i = path.length - 1; i >= 0; i--) {
            let x = path[i][0];
            let y = path[i][1];
            let brightness = targetImage.pixelBrightness(x, y);

            if (brightness === 0) {
                led.unplot(x, y);
            } else {
                led.plotBrightness(x, y, brightness);
            }

            basic.pause(delayMs);
        }
    }
}