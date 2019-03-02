const canvas = document.getElementById('canvas');
const gContext = canvas.getContext('2d');

canvas.style.backgroundImage = 'url("backgrounds/circuit-board.png")';

let tiles = [];
let map;

chooseMap();

{
	let numTilesLoaded = 0;

	function imageResolved() {
		numTilesLoaded++;

		if (numTilesLoaded === 3) {
			drawMap();
		}
	}

	let image;
	image = new Image();
	image.onload = imageResolved;
	image.src = 'tiles/corridor.png';
	tiles[0] = image;

	image = new Image();
	image.onload = imageResolved;
	image.src = 'tiles/wall.png';
	tiles[1] = image;

	image = new Image();
	image.onload = imageResolved;
	image.src = 'tiles/exit.png';
	tiles[2] = image;
}

function drawMap() {
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

function chooseMap() {
	map = [];
	map.push('0000000000010000010000000000000001');
	map.push('0111111111010111010111111111111101');
	map.push('0100010001010001000000010000010001');
	map.push('0101010101110111111111011101010111');
}
