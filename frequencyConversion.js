// From https://newt.phys.unsw.edu.au/music/note/
// © Andrew Botros 2001
var convert = function() {
    document.getElementById("result").innerHTML =
        "<font face=\"Geneva, Arial, Helvetica, sans-serif\">" +
        frequencyToNote() + "</font>";
}

var frequencyToNote = function() {
    var input = Number(document.getElementById("frequency").value);
    if (isNaN(input) || (input == 0))
        return "<font color=\"red\">Enter a numerical value for frequency</font>";
    if ((input < 27.5) || (input > 14080))
        return "<font color=\"red\">Enter a frequency in the range 27.5Hz (A0) and 14080Hz (A9)</font>";

    var A4 = 440.0;
    var A4_INDEX = 57;

    var notes = [
        "C0", "C#0", "D0", "D#0", "E0", "F0", "F#0", "G0", "G#0", "A0", "A#0", "B0",
        "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1",
        "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2",
        "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
        "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
        "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5",
        "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6",
        "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7", "A7", "A#7", "B7",
        "C8", "C#8", "D8", "D#8", "E8", "F8", "F#8", "G8", "G#8", "A8", "A#8", "B8",
        "C9", "C#9", "D9", "D#9", "E9", "F9", "F#9", "G9", "G#9", "A9", "A#9", "B9"
    ];

    var MINUS = 0;
    var PLUS = 1;

    var frequency;
    var r = Math.pow(2.0, 1.0 / 12.0);
    var cent = Math.pow(2.0, 1.0 / 1200.0);
    var r_index = 0;
    var cent_index = 0;
    var side;

    frequency = A4;

    if (input >= frequency) {
        while (input >= r * frequency) {
            frequency = r * frequency;
            r_index++;
        }
        while (input > cent * frequency) {
            frequency = cent * frequency;
            cent_index++;
        }
        if ((cent * frequency - input) < (input - frequency))
            cent_index++;
        if (cent_index > 50) {
            r_index++;
            cent_index = 100 - cent_index;
            if (cent_index != 0)
                side = MINUS;
            else
                side = PLUS;
        } else
            side = PLUS;
    } else {
        while (input <= frequency / r) {
            frequency = frequency / r;
            r_index--;
        }
        while (input < frequency / cent) {
            frequency = frequency / cent;
            cent_index++;
        }
        if ((input - frequency / cent) < (frequency - input))
            cent_index++;
        if (cent_index >= 50) {
            r_index--;
            cent_index = 100 - cent_index;
            side = PLUS;
        } else {
            if (cent_index != 0)
                side = MINUS;
            else
                side = PLUS;
        }
    }

    var result = notes[A4_INDEX + r_index];
    if (side == PLUS)
        result = result + " plus ";
    else
        result = result + " minus ";
    result = result + cent_index + " cents";
    return result;
}
