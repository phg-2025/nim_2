/**
 * Das Nim-Spiel (schwierigere Variante) mit OLED-Display
 * 
 * Beim Start:
 * 
 * Taste A: Anzahl der Zeilen (2 bis 5)
 * 
 * Taste B: Wer startet
 * 
 * Taste A+B: Spiel starten
 * 
 * Im Spiel
 * 
 * Taste A: Zeile wählen
 * 
 * Taste B: Anzahl wählen
 * 
 * Taste A+B: Aktion ausführen
 * 
 * Näheres bei Wikipedia oder demnächst bei
 * 
 * https://www.prof-horst-guenther.de/calliope
 * 
 * 27.4.2026
 */
// Das Nim-Spiel (einfache Variante) ohne Zusatz-Display
// 
// Beim Start;
// 
// Taste A: Spieler beginnt
// 
// Taste B: Computter beginnt
// 
// danach:
// 
// Taste A: Zeile auswählen
// 
// Taste B: Anzahl wählen
// 
// Taste A+B: Aktion ausführen
// 
// Näheres bei Wikipedia oder demnächst bei
// 
// https://www.prof-horst-guenther.de/calliope
function writeAt (zl: number, sp: number, Text: string) {
    oledssd1306.setTextXY(zl, sp)
    if (zl == 0) {
        oledssd1306.clearRange(16)
    }
    oledssd1306.writeString(Text)
}
function L (nr: number) {
    return links[nr]
}
function storniere () {
    links[akt_zl] = L(akt_zl) + rechts
    rechts = 0
}
function xor (a: number, b: number) {
    return (a ^ b)
}
function naechsteZeile () {
    writeAt(P2(akt_zl), 0, "   ")
    akt_zl += 1
    akt_zl = akt_zl % zeilenZahl
    while (L(akt_zl) == 0) {
        akt_zl += 1
        akt_zl = akt_zl % zeilenZahl
    }
    nachRechts(akt_zl)
    zeigeZeile(akt_zl)
}
function dbg (Text: string) {
    if (DEBUG) {
        writeAt(7, 0, Text)
        basic.pause(200)
    }
}
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    if (Start == 0) {
        zeilenZahl += 1
        if (zeilenZahl == 6) {
            zeilenZahl = 2
        }
        writeAt(2, 0, "A: " + zeilenZahl + " Zeilen")
        if (zeilenZahl == 2) {
            links = [1, 1]
        } else {
            if (zeilenZahl == 3) {
                links = [3, 4, 5]
            } else {
                if (zeilenZahl == 4) {
                    links = [
                    1,
                    3,
                    5,
                    7
                    ]
                } else {
                    links = [
                    1,
                    2,
                    3,
                    4,
                    5
                    ]
                }
            }
        }
    } else {
        storniere()
        zeigeZeile(akt_zl)
        naechsteZeile()
    }
})
function computerNimmt () {
    summe = 0
    for (let Index42 = 0; Index42 <= prev(zeilenZahl); Index42++) {
        summe = xor(summe, L(Index42))
    }
    if (summe == 0) {
        zufallszug()
    } else {
        for (let i1 = 0; i1 <= prev(zeilenZahl); i1++) {
            if (xor(L(i1), summe) <= L(i1)) {
                verlasse()
                rechts = 0
                akt_zl = i1
                rechts = L(akt_zl) - xor(L(akt_zl), summe)
                break;
            }
        }
    }
    links[akt_zl] = L(akt_zl) - rechts
    writeAt(0, 0, "Calli nimmt " + rechts)
    zeigeZeile(akt_zl)
    entfereneGezogen()
    rechts = 0
    writeAt(P2(akt_zl), 0, "   ")
    basic.pause(2000)
    GameOver(2)
}
function succ (wert: number) {
    return wert + 1
}
input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    if (Start == 0) {
        oledssd1306.clearDisplay()
        if (ComputerStartet) {
            zeigeHoelzer()
            computerNimmt()
            zeigeZeile(akt_zl)
        }
        writeAt(0, 0, "Du bist dran ")
        zeigeHoelzer()
        Start = 1
    } else {
        if (rechts == 0) {
            music.play(music.tonePlayable(131, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
        } else {
            writeAt(P2(akt_zl), 0, "   ")
            writeAt(0, 0, "Du ziehst " + rechts)
            basic.pause(1000)
            entfereneGezogen()
            rechts = 0
            GameOver(1)
            writeAt(0, 0, "Calli denkt")
            basic.pause(1500)
            computerNimmt()
            writeAt(0, 0, "Du bist dran  ")
            dbg("Rechts " + convertToText(rechts))
        }
    }
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    if (Start == 0) {
        ComputerStartet = !(ComputerStartet)
        if (ComputerStartet) {
            writeAt(4, 0, "B: Calli startet")
        } else {
            writeAt(4, 0, "B: Du startest  ")
        }
        rechts = 0
    } else {
        if (rechts == 0) {
            music.play(music.tonePlayable(131, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
        } else {
            nachRechts(akt_zl)
        }
    }
})
function zeigeZeile (zl: number) {
    sp0 = 3
    if (zl == akt_zl) {
        if (rechts != 0) {
            writeAt(P2(akt_zl), 0, "->")
        }
    } else {
        writeAt(P2(akt_zl), 0, "  ")
    }
    for (let Index2 = 0; Index2 <= prev(L(zl)); Index2++) {
        writeAt(P2(zl), sp0, "|")
        sp0 += 1
    }
    if (zl == akt_zl) {
        for (let Index432 = 0; Index432 <= prev(rechts); Index432++) {
            writeAt(P2(zl), sp0, "X")
            sp0 += 1
            basic.pause(300)
        }
    }
}
function zufallszug () {
    dbg("Zufall")
    for (let Index = 0; Index <= prev(zeilenZahl); Index++) {
        if (L(1) != 0) {
            rechts = 1
            akt_zl = Index
            break;
        }
    }
}
function Begrüssung () {
    writeAt(0, 0, "Das NIM-Spiel 2")
    writeAt(2, 0, "A: " + zeilenZahl + " Zeilen")
    if (ComputerStartet) {
        writeAt(4, 0, "B: Calli startet")
    } else {
        writeAt(4, 0, "B: Du startest")
    }
    writeAt(7, 0, "A+B: Starten")
}
function entfereneGezogen () {
    sp0 = 3 + L(akt_zl)
    for (let Index43 = 0; Index43 <= prev(rechts); Index43++) {
        writeAt(P2(akt_zl), sp0, " ")
        sp0 += 1
        basic.pause(700)
    }
}
function zeigeHoelzer () {
    for (let i22 = 0; i22 <= prev(zeilenZahl); i22++) {
        zeigeZeile(i22)
    }
}
function nachRechts (zl: number) {
    if (L(akt_zl) == 0) {
        storniere()
    }
    rechts += 1
    links[zl] = L(zl) - 1
    zeigeZeile(zl)
}
function prev (wert: number) {
    return wert - 1
}
function GameOver (wer: number) {
    Ende = true
    for (let Index3 = 0; Index3 <= prev(zeilenZahl); Index3++) {
        if (L(Index3) != 0) {
            Ende = false
        }
    }
    if (Ende) {
        if (wer == 1) {
            writeAt(0, 0, "Du hast gesiegt")
        } else {
            writeAt(0, 0, "Calli siegt")
        }
        while (true) {
        	
        }
    }
}
function verlasse () {
    sp0 = 3 + L(akt_zl)
    writeAt(P2(akt_zl), 0, "   ")
    for (let Index433 = 0; Index433 <= prev(rechts); Index433++) {
        writeAt(P2(akt_zl), sp0, " ")
        sp0 += 1
        basic.pause(200)
    }
}
function P2 (nr: number) {
    return nr + 2
}
let Ende = false
let sp0 = 0
let summe = 0
let akt_zl = 0
let ComputerStartet = false
let links: number[] = []
let zeilenZahl = 0
let DEBUG = false
let rechts = 0
let Start = 0
let sp = 0
oledssd1306.initDisplay()
oledssd1306.clearDisplay()
Start = 0
rechts = 0
DEBUG = false
zeilenZahl = 3
links = [3, 4, 5]
ComputerStartet = false
Begrüssung()
