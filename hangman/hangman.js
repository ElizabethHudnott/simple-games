'use strict';

const GameKit = window.GameKit;
GameKit.SFX.load('correct', 'sfx/ding.wav');
GameKit.SFX.load('incorrect', 'sfx/family-fortunes-wrong-buzzer.mp3')

const maxWrongGuesses = 10;

var player1ScoreBox = $('#player1-score');
var player2ScoreBox = $('#player2-score');
var messageBox = $('#message-box');
var wordLetters = $('#word');
var wordEntryBox = $('#word-entry-box');
var wordEntryButton = $('#word-entry-btn');

var wordToGuess, wordLength, numLettersUncovered, numWrongGuesses;
var player1Score = 0, player2Score = 0;
var playerToPlay = 1;

function alert(message, style) {
	messageBox.removeClass('alert-success alert-danger alert-warning');
	messageBox.addClass('alert-' + style);
	messageBox.html(message);
}

function requestWord() {
	wordToGuess = undefined;
	alert(`<strong>Player ${playerToPlay}:</strong> Enter a word.`, 'success');
}

requestWord();

function win() {
	alert(`<strong>Player ${playerToPlay}</strong> narrowly escapes the gallows on this occassion.`, 'success');
	if (playerToPlay === 1) {
		player1Score = player1Score + 1;
		player1ScoreBox.html(player1Score);
	} else {
		player2Score = player2Score + 1;
		player2ScoreBox.html(player2Score);
	}
}

function incorrectGuess() {
	if (numWrongGuesses === maxWrongGuesses) {
		alert(`Player ${playerToPlay}: You have been sentenced to death for the crime of failing to guess a word correctly. May God have mercy on your soul!`, 'danger');
	}
}

function countSpaces() {
	numLettersUncovered = 0;
	var spacePosition = wordToGuess.indexOf(' ');
	while (spacePosition !== -1) {
		numLettersUncovered = numLettersUncovered + 1;
		spacePosition = wordToGuess.indexOf(' ', spacePosition + 1);
	}
}

function enterWord(event) {
	var wordEntered = wordEntryBox.val();
	var letterPosition, newLetterCell;

	if (wordEntered !== '') {
		if (wordToGuess === undefined) {
			wordToGuess = wordEntered.toUpperCase();
			wordLength = wordToGuess.length;
			countSpaces();
			numWrongGuesses = 0;
			wordEntryBox.val('');
			wordEntryButton.html('Solve It!');

			wordLetters.html('');
			letterPosition = 0;
			while (letterPosition < wordLength) {
				if (wordToGuess[letterPosition] === ' ') {
					newLetterCell = $(`
						<td class="letter-cell">
							<div class="h1 no-letter">&nbsp;</div>
						</td>
					`);
				} else {
					newLetterCell = $(`
						<td class="letter-cell">
							<div class="h1 shadow letter-tile">
								<div class="letter-text">
									${wordToGuess[letterPosition]}
								</div>
							</div>
						</td>
					`);
				}
				wordLetters.append(newLetterCell);
				letterPosition = letterPosition + 1;
			}
			if (playerToPlay === 1) {
				playerToPlay = 2;
			} else {
				playerToPlay = 1;
			}
			alert(`<strong>Player ${playerToPlay}:</strong> Guess a letter or solve the puzzle.`, 'success');
		} else {
			if (wordEntered.toUpperCase() === wordToGuess) {
				win();
			} else {
				numWrongGuesses = numWrongGuesses + 1;
				if (numWrongGuesses <= maxWrongGuesses) {
					alert(`No, the word is not <strong>${wordEntered}</strong>. Be careful or you might get hanged!`, 'warning');
				}
				incorrectGuess();
			}
		}
	}
}

wordEntryButton.on('click', enterWord);

wordEntryBox.on('keydown', function (event) {
	if (event.key === 'Enter') {
		enterWord(event);
	}
});

function enterLetter(event) {
	var guessedLetter = $(event.target).html();

	if (wordToGuess === undefined) {
		var partialWord = wordEntryBox.val() + guessedLetter.toLowerCase();
		wordEntryBox.val(partialWord);
		return;
	}

	var wordLetterDiv;
	var containsLetter = false;
	var letterPosition = 0;

	while (letterPosition < wordLength) {
		if (guessedLetter === wordToGuess[letterPosition]) {
			wordLetterDiv = wordLetters.children().eq(letterPosition).find('.letter-tile');
			containsLetter = true;
			if (wordLetterDiv.hasClass('revealed')) {
				break;
			}
			GameKit.SFX.play('correct');
			wordLetterDiv.addClass('revealed');
			numLettersUncovered = numLettersUncovered + 1;
		}
		letterPosition = letterPosition + 1;
	}

	if (containsLetter) {

	} else {
		numWrongGuesses = numWrongGuesses + 1;
		if (numWrongGuesses <= maxWrongGuesses) {
			alert(`There is no ${guessedLetter}. Be careful or you might get hanged!`, 'warning');
		}
		incorrectGuess();
	}

	if (numLettersUncovered === wordLength) {
		win();
	}
}

$('.letter-btn').on('click', enterLetter);
