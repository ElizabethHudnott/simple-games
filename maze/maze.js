'use strict';

const canvas = document.getElementById('canvas');
const gContext = canvas.getContext('2d');

canvas.style.backgroundImage = 'url("backgrounds/circuit-board.png")';

let tiles = [];
let map;
let character, xLocation, yLocation;

let brickCorridor, transparentCorridor;

chooseMap();

{
	let numTilesLoaded = 0;

	function imageResolved() {
		numTilesLoaded++;

		if (numTilesLoaded === 5) {
			drawMap();
			drawCharacter();
		}
	}

	function getImage(url) {
		let image = new Image();
		image.onload = imageResolved;
		image.src = url;
		return image;
	}

	transparentCorridor = getImage('tiles/corridor-2.png');
	brickCorridor = getImage('tiles/corridor.png');
	tiles[0] = transparentCorridor;
	tiles[1] = getImage('tiles/wall.png');
	tiles[2] = getImage('tiles/exit.png');
	character = getImage('sprites/lion.png');
}

function drawCharacter() {
	let xPosition = 32 * xLocation;
	let yPosition = 32 * yLocation;
	gContext.drawImage(character, xPosition, yPosition);
}

function drawTile(x, y) {
	let row = map[y];
	let tileNumber = row.charCodeAt(x) - 48;
	let tile = tiles[tileNumber];
	let xPosition = 32 * x;
	let yPosition = 32 * y;
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
	xLocation = 10;
	yLocation = 2;
}
