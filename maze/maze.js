'use strict';

/**Find the canvas in the document.
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('canvas');

/**Every canvas has a corresponding "context" object in JavaScript. Drawing operations are
 * performed by calling methods belonging to this context object.
 * @type {CanvasRenderingContext2D}
 */
const gContext = canvas.getContext('2d');

/**An array of images. tiles[0] holds the image for tile type "0" (corridors),
 * tiles[1] holds the image for tile type "1" (walls), etc.
 * @type {Image[]}
 */
let tiles = [];

/**The image used to draw corridors when the brick display style is selected. This gets
 * copied into tiles[0] when we want tile type "0" (corridors) to be drawn using this image.
 * @type {Image}
 */
let brickCorridor;

/**The image used to draw corridors when the transparent display style is selected. This gets
 * copied into tiles[0] when we want tile type "0" (corridors) to be drawn using this image.
 * The image file we load for this consists of nothing except for transparent pixels.
 * @type {Image}
 */
let transparentCorridor;

/**The map data, stored as an array of strings. Each element of the array stores the data
 * needed to construct a single row. Each character within that string describes the tile type
 * that needs to appear in one particular column position on that line. The first
 * character of map[0] describes the tile placed in the top-left corner.
 * @type {string[]}
 */
let map;

/**The image of the player's character.
 * @type {Image}
 */
let character;

/**The player's location, in terms of how many columns away from the left-hand side they are.
 * @type {number}
 */
let xLocation;

/**The player's location, in terms of how many rows away from the top edge they are.
 * @type {number}
 */
let yLocation;

/*Fill the map array with data, set the player's starting location, and load a background
 *image (using CSS), which will appear wherever the tiles have transparent pixels.
 */
chooseMap();

/**Records counts how many images have been loaded so far.
 * @type {number}
 */
let numImagesLoaded = 0;

/**When a single image has finished loading, check if the number of images loaded so
 * far is equal to the total number of images used in the game's JavaScript (excluding CSS
 * backgrounds) and if everything's loaded then initialize the game.
 */
function imageResolved() {
	numImagesLoaded++;

	if (numImagesLoaded === 5) {
		drawMap();
		drawCharacter();
	}
}

/**Fetches an image from the server so we can use it to draw tiles or as the player's
 *character.
 * @param {string} url The URL where the image is located.
 * @return {Image} An image holding data about the image.
 */
function getImage(url) {
	//Create a blank Image object.
	let image = new Image();
	/*Set things up so that once we program to load an image from a file then after it's
	 *finished downloading we should take notice of the progress made. The system will
	 *call the imageResolved function for us. (It's an event.)
	 */
	image.onload = imageResolved;
	//Request to load the image contained in the file located at the specified URL into the Image object.
	image.src = url;
	/*Return the Image object. The image won't have finished loading yet. It'll be loaded
	 *simultaneously while other parts of the program run. Nonetheless, we can hold onto
	 *the object while the system modifies parts of it in the background.
	 */
	return image;
}

//Start loading our images.
transparentCorridor = getImage('tiles/corridor-2.png');
brickCorridor = getImage('tiles/corridor.png');
tiles[0] = transparentCorridor;
tiles[1] = getImage('tiles/wall.png');
tiles[2] = getImage('tiles/exit.png');
character = getImage('sprites/lion.png');

/**Draws our game's character on the screen. */
function drawCharacter() {
	let xPosition = 32 * xLocation;
	let yPosition = 32 * yLocation;
	gContext.drawImage(character, xPosition, yPosition);
}

/**Draws a single tile on the screen using one of the images contained in the {@link tiles} array.
 * Which image gets drawn (e.g. the one stored in tiles[0] versus the one stored in
 * tiles[1] versus...) depends on which character appears at the relevant position in the
 * {@link map}.
 * @param {number} x The column number where a tile should be drawn.
 * @param {number} y The row number where a tile should be drawn.
 */
function drawTile(x, y) {
	//Get the map data for the whole of row y. This will be a string.
	let row = map[y];
	/*Get the character code for the x-th character of the string. The character code for
	 *"0" (text) is 48. The character code for "A" is 65.
	 * See: http://www.asciitable.com
	 */
	let tileNumber = row.charCodeAt(x) - 48;
	//Use the tile number to find the appropriate image to draw.
	let tile = tiles[tileNumber];
	//The tile images are each 32 pixels wide and 32 pixels high.
	let xPosition = 32 * x;
	let yPosition = 32 * y;
	//
	gContext.clearRect(xPosition, yPosition, 32, 32);
	gContext.drawImage(tile, xPosition, yPosition);
}

function drawMap() {
	gContext.clearRect(0, 0, canvas.width, canvas.height);
	for (let j = 0; j < map.length; j++) {
		const row = map[j];
		const rowLength = row.length;
		for (let i = 0; i < rowLength; i++) {
			let tileNumber = row.charCodeAt(i) - 48;
			let tile = tiles[tileNumber];
			let xPosition = 32 * i;
			let yPosition = 32 * j;
			gContext.drawImage(tile, xPosition, yPosition);
		}
	}
}

function moveCharacter(x, y) {
	drawTile(xLocation, yLocation);
	xLocation = x;
	yLocation = y;
	drawCharacter();
}

document.body.addEventListener('keydown', function (event) {
	let attemptX = xLocation;
	let attemptY = yLocation;
	let moveAttempted = true;
	switch (event.key) {
	case 'ArrowDown':
		attemptY++;
		break;
	case 'ArrowLeft':
		attemptX--;
		break;
	case 'ArrowRight':
		attemptX++;
		break;
	case 'ArrowUp':
		attemptY--;
		break;
	default:
		moveAttempted = false;
	}

	if (moveAttempted) {
		event.preventDefault();
		let row = map[attemptY];
		if (row !== undefined) {
			let tileCode = row[attemptX];
			if (tileCode === '0') {
				moveCharacter(attemptX, attemptY);
			} else if (tileCode === '2') {
				moveCharacter(attemptX, attemptY);
				document.getElementById('sfx-win').play();
			}
		}
	}
});

document.getElementById('corridor-toggle').addEventListener('input', function (event) {
	if (tiles[0] === brickCorridor) {
		tiles[0] = transparentCorridor;
	} else {
		tiles[0] = brickCorridor;
	}
	drawMap();
	drawCharacter();
});

function chooseMap() {
	map = [];
	map.push('0000000000010000010000000000000001');
	map.push('0111111111010111010111111111111101');
	map.push('0100010001010001000000010000010001');
	map.push('0101010101110111111111011101010111');
	map.push('0001000100000100000001000001010001');
	map.push('0111111111111101111101110111111101');
	map.push('0001000000000001000101000100000001');
	map.push('1101011111111111010101110101111111');
	map.push('0001010000000001010100010100010001');
	map.push('0111011101111101011111111111011101');
	map.push('0001000001010001000000000001000101');
	map.push('1101111101010111110111011101110101');
	map.push('0100000100010000010001010000000101');
	map.push('0111110101011111011101011111111101');
	map.push('0000010101000001000101000001000001');
	map.push('0111110101111101110101111101110111');
	map.push('0001000101000001000101000100010001');
	map.push('1101011111011111011101010111011101');
	map.push('0001000001010000010001010001010001');
	map.push('0111111101010111111111011101110111');
	map.push('0000000000010000000000010000000021');
	map.push('1111111111111111111111111111111111');
	canvas.style.backgroundImage = 'url("backgrounds/circuit-board.png")';
	xLocation = 10;
	yLocation = 2;
}
