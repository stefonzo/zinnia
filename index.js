'using strict';

let currentCharacter;
let score = 100;
let totalGuesses = 0;
let totalCorrect = 0;
let level = 1;
let hintLevel = 0;
let previousCharacters = [];
let completed = false;
let mode = "newchars";
let totalChars = 100;

function randomCharacter()
{
    let minVal = level * 100 - totalChars;
    let maxVal = level * 100;
    let index = Math.floor(Math.random() * (maxVal-minVal)) + minVal;
    return characters[index];
}

function reset()
{
    completed = false;
    level = Number($('#level-select').val());
    mode = $('#mode-select').val();
    $('#level').text(`Level ${level}`);
    totalGuesses = 0;
    totalCorrect = 0;
    previousCharacters = [];
    updateCharacter();
    updateScore();
    
    if (mode === 'allchars')
        totalChars = level * 100;
    else
        totalChars = 100;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

$(document).ready(() => {
    $('#level-select').val('1');
    $('#level-select').change(reset);
    $('#mode-select').change(reset);
    $('#pinyin-input').change(submitGuess);
    $('#hint-button').click(updateHint);
    $('#reset-button').click(reset);
    reset();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~!

function submitGuess()
{
    totalGuesses += 1;
    let guess = $('#pinyin-input').val();
    if (guess === currentCharacter[1]) {
        totalCorrect += 1;
        updateCharacter();
    }
    updateScore();
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function updateCharacter()
{
    if (completed || previousCharacters.length === totalChars) {
        completed = true;
        $('#level').text("Completed!");
        return;
    }
    currentCharacter = randomCharacter();
    while (previousCharacters.includes(currentCharacter[0]))
        currentCharacter = randomCharacter();
    previousCharacters.push(currentCharacter[0]);
    $('#level').text(`Level ${level} (${previousCharacters.length-1}/${totalChars})`);
    $('#current-character').text(currentCharacter[0]);
    $('#pinyin-input').val('');
    $('#pinyin-input').focus();
    $('#hint').text('?');
    hintLevel = 0;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function updateScore()
{
    if (totalGuesses === 0)
        score = 100;
    else
        score = 100 * totalCorrect/totalGuesses;
    $('#score').text(`${score.toFixed(2)}%`);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function updateHint()
{
    if (hintLevel === 3)
        return;

    totalGuesses += 1;
    updateScore();
    
    hintLevel += 1;
    let pinyin = currentCharacter[1];
    if (hintLevel === 3) {
        $('#hint').text(pinyin);
        return;
    }

    hintString = '';
    for (let i=0; i<pinyin.length; i++) {
        if (i < hintLevel)
            hintString += pinyin[i];
        else
            hintString += "*";
    }

    $('#hint').text(hintString);
    $('#pinyin-input').focus();
}
