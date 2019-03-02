'use strict';

const canvas = document.getElementById('canvas');
const gContext = canvas.getContext('2d');

canvas.style.backgroundImage = 'url("backgrounds/circuit-board.png")';

let tiles = [];
let map;

var brickCorridor, transparentCorridor;

chooseMap();

{
	let numTilesLoaded = 0;

	function imageResolved() {
		numTilesLoaded++;

		if (numTilesLoaded === 4) {
			drawMap();
		}
	}

	let image;
	image = new Image();
	image.onload = imageResolved;
	image.src = 'tiles/corridor-2.png';
	transparentCorridor = image;
	tiles[0] = image;

	image = new Image();
	image.onload = imageResolved;
	image.src = 'tiles/wall.png';
	tiles[1] = image;

	image = new Image();
	image.onload = imageResolved;
	image.src = 'tiles/exit.png';
	tiles[2] = image;

	brickCorridor = new Image();
	brickCorridor.onload = imageResolved;
	brickCorridor.src = 'tiles/corridor.png';
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

document.getElementById('corridor-toggle').addEventListener('input', function (event) {
	if (tiles[0] === brickCorridor) {
		tiles[0] = transparentCorridor;
	} else {
		tiles[0] = brickCorridor;
	}
	drawMap();
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
	map.push('1101011111111111010101110101111101');
	map.push('0001010000000001010100010100010001');
	map.push('0111011101111101011111111111011101');
	map.push('0001000001010001000000000001000101');
	map.push('1101111111010111110111011101110101');
	map.push('0100000100010000010001010000000101');
	map.push('0111110101011111011101011111111101');
	map.push('0000010101000001000101000001000001');
	map.push('0111110101111101110101111101110111');
	map.push('0001000101000001000101000100010001');
	map.push('1101011111011111011101010111011101');
}
