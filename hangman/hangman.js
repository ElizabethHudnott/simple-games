'use strict';

var advancedAnimations = false;
const maxWrongGuesses = 10;
const alertDisplayTime = 3500;

var sounds = Object.create(null);
sounds.correct = $('#sfx-correct').get(0);
sounds.incorrect = $('#sfx-incorrect').get(0);

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
	messageBox.fadeOut(200, function () {
		messageBox.removeClass('alert-success alert-danger alert-warning');
		messageBox.addClass('alert-' + style);
		messageBox.html(message);
		messageBox.show();
		messageBox.fadeIn();
	});
}

function removeAlert() {
	messageBox.fadeOut(200, function () {
		messageBox.hide();
	});
}

function requestWord() {
	if (wordToGuess === undefined) {
		wordLetters.html('');
		alert(`<strong>Player ${playerToPlay}:</strong> Enter a word.`, 'success');
	}
}

requestWord();

function enableNewWordEntry() {
	wordToGuess = undefined;
	if (playerToPlay === 1) {
		wordEntryBox.attr('placeholder', 'Enter a word for Player 2 to guess');
	} else {
		wordEntryBox.attr('placeholder', 'Enter a word for Player 1 to guess');
	}
	wordEntryBox.val('');
	wordEntryButton.html('Play');
	setTimeout(requestWord, alertDisplayTime);
}

function win() {
	alert(`<strong>Player ${playerToPlay}</strong> narrowly escapes the gallows on this occassion.`, 'success');
	if (playerToPlay === 1) {
		player1Score = player1Score + 1;
		player1ScoreBox.html(player1Score);
	} else {
		player2Score = player2Score + 1;
		player2ScoreBox.html(player2Score);
	}
	enableNewWordEntry();
}

function incorrectGuess() {
	sounds.incorrect.play();
	console.log(numWrongGuesses);
	if (numWrongGuesses === maxWrongGuesses) {
		alert(`Player ${playerToPlay}: You have been sentenced to death for the crime of failing to guess a word. May God have mercy on your soul!`, 'danger');
		enableNewWordEntry();
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
						<div class="letter-cell">
							<div class="h1 no-letter">&nbsp;</div>
						</div>
					`);
				} else {
					newLetterCell = $(`
						<div class="letter-cell">
							<div class="h1 shadow letter-tile">
								<div class="letter-text">
									${wordToGuess[letterPosition]}
								</div>
							</div>
						</div>
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
			if (advancedAnimations === false) {
				$('.letter-text').hide();
			}
			wordEntryBox.attr('placeholder', 'Enter a word to solve the puzzle');
			alert(`<strong>Player ${playerToPlay}:</strong> Guess a letter or solve the puzzle.`, 'success');
		} else {
			if (wordEntered.toUpperCase() === wordToGuess) {
				win();
			} else {
				wordEntryBox.val('');
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
	var buttonClicked = $(event.target);
	var guessedLetter = buttonClicked.html();

	if (wordToGuess === undefined) {
		wordEntryButton.focus();
		var partialWord = wordEntryBox.val() + guessedLetter.toLowerCase();
		wordEntryBox.val(partialWord);
		return;
	}

	buttonClicked.blur();
	var wordLetterDiv;
	var numOccurences = 0;
	var letterPosition = 0;

	while (letterPosition < wordLength) {
		if (guessedLetter === wordToGuess[letterPosition]) {
			numOccurences = numOccurences + 1;
			wordLetterDiv = wordLetters.children().eq(letterPosition).find('.letter-tile');

			if (wordLetterDiv.hasClass('revealed') == false) {
				sounds.correct.play();
				wordLetterDiv.addClass('revealed');
				if (advancedAnimations === false) {
					wordLetterDiv.children().fadeIn();
				}
				numLettersUncovered = numLettersUncovered + 1;
			}

		}
		letterPosition = letterPosition + 1;
	}

	if (numOccurences === 0) {
		numWrongGuesses = numWrongGuesses + 1;
		if (numWrongGuesses <= maxWrongGuesses) {
			alert(`There is no ${guessedLetter}. Be careful or you might get hanged!`, 'warning');
			setTimeout(removeAlert, alertDisplayTime);
		}
		incorrectGuess();
	} else {
		if (numLettersUncovered === wordLength) {
			win();
		} else if (numOccurences === 1) {
			alert(`There is one ${guessedLetter}.`, 'success');
			setTimeout(removeAlert, alertDisplayTime);
		} else {
			alert(`There are ${numLettersUncovered} ${guessedLetter}s.`, 'success');
			setTimeout(removeAlert, alertDisplayTime);
		}
	}

}

$('.letter-btn').on('click', enterLetter);
