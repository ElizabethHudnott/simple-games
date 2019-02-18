var wordLetters = $('#word');
var wordEntryBox = $('#word-entry-box');
var wordEntryButton = $('#word-entry-btn');

var wordToGuess;
var wordLength;

function enterWord(event) {
	var wordEntered = wordEntryBox.val();
	var i, newLetter;

	if (wordEntered !== '') {
		if (wordToGuess === undefined) {
			wordToGuess = wordEntered.toUpperCase();
			wordLength = wordToGuess.length;
			wordEntryBox.val('');
			wordEntryButton.html('Solve It!');

			wordLetters.html('');
			i = 0;
			while (i < wordToGuess.length) {
				if (wordToGuess[i] === ' ') {
					newLetter = $(`
						<td class="px-1 pt-3">
							<div class="h1 shadow m-0 p-2 letter">&nbsp;</div>
						</td>
					`);
				} else {
					newLetter = $(`
						<td class="px-1 pt-3">
							<div class="h1 shadow m-0 p-2 bg-white letter">&nbsp;</div>
						</td>
					`);
				}
				wordLetters.append(newLetter);
				i = i + 1;
			}
		} else {

		}
	}
}

wordEntryButton.on('click', enterWord);

wordEntryBox.on('keydown', function (event) {
	if (event.key === 'Enter') {
		enterWord(event);
	}
});

function guessLetter(event) {
	if (wordToGuess === undefined) {
		return;
	}

	var guessedLetter = $(event.target).html();
	var containsLetter = false;
	var guessedAllLetters = true;
	var wordLetterDiv;
	var i = 0;
	while (i < wordLength) {
		wordLetterDiv = wordLetters.children().eq(i).children().eq(0);
		if (guessedLetter === wordToGuess[i]) {
			containsLetter = true;
			wordLetterDiv.html(guessedLetter);
		} else if (wordLetterDiv.html() === '&nbsp;') {
			guessedAllLetters = false;
		}
		i = i + 1;
	}

	if (!containsLetter) {

	}
	if (guessedAllLetters) {

	}
}

$('.letter-btn').on('click', guessLetter);
