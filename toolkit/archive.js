function Archive() {
	this.data = new ArrayBuffer(0);
}

Archive.prototype.add = function (filename, data) {
	const dataLength = data.byteLength;

	if (dataLength > 16777216) {
		throw new Error(`Archive: Cannot add ${filename}. Maximum permitted file size of 16,777,216 bytes exceeded.`);
	}

	const filenameLength = filename.length;
	var offset = this.data.byteLength;

	this.data = ArrayBuffer.transfer(
		this.data,
		offset + Math.ceil((filenameLength + 4) / 8) * 8 + dataLength
	);
	var destArray = new Uint8Array(this.data);

	for (let i = 0; i < filenameLength; i++) {
		let charCode = filename.charCodeAt(i);
		if (charCode > 255) {
			throw new Error(`Archive: Cannot add ${filename}. Filename contains characters not in ISO 8859-1.`);
		}
		destArray[offset] = charCode;
		offset++;
	}

	//Add NUL termination to the filename string.
	offset++;

	//Write length marker.
	destArray[offset] = dataLength % 256;
	offset++;
	destArray[offset] = (dataLength >>> 8) % 256;
	offset++;
	destArray[offset] = (dataLength >>> 16) % 256;
	offset++;

	//Align the beginning of the file to an 8 byte boundary.
	offset = offset % 8 === 0 ? offset : offset + (8 - offset % 8);
	copyBuffer(data, 0, data.byteLength, this.data, offset);
}

if (!ArrayBuffer.transfer) {
	ArrayBuffer.transfer = function(oldBuffer, newByteLength) {
		var destBuffer = new ArrayBuffer(newByteLength);
		var copyLength = Math.min(oldBuffer.byteLength, newByteLength);

		/* Copy 8 bytes at a time. */
		var length = Math.trunc(copyLength / 8);
		(new Float64Array(destBuffer, 0, length))
		.set(new Float64Array(oldBuffer, 0, length));

		/* Copy the remaining 0 to 7 bytes, 1 byte at a time. */
		var offset = length * 8;
		length = copyLength - offset;
		(new Uint8Array(destBuffer, offset, length))
		.set(new Uint8Array(oldBuffer, offset, length));

		return destBuffer;
	};
}

/*
	srcOffset must by divisible by 8.
*/
function copyBuffer(srcBuffer, srcOffset, copyLength, destBuffer, destOffset) {
	if (destOffset === undefined) {
		destOffset = 0;
	}

	/* Copy 8 bytes at a time. */
	var length = Math.trunc(copyLength / 8);
	(new Float64Array(destBuffer, destOffset, length))
	.set(new Float64Array(srcBuffer, srcOffset, length));

	/* Copy the remaining 0 to 7 bytes, 1 byte at a time. */
	var offset = length * 8;
	length = copyLength - offset;
	(new Uint8Array(destBuffer, destOffset + offset, length))
	.set(new Uint8Array(srcBuffer, srcOffset + offset, length));
}

/*
	a = new Archiver();
	b = new ArrayBuffer(16);
	c = new Uint8Array(b);
	for (var i = 0; i < 16; i++) c[i] = 65 + i;
	a.add("alphabet", b);
*/
