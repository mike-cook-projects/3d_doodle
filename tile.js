export default class Tile {
    constructor({ position, type, onTileClick, onTileOver, onTileOut }) {
        this.position = position;
        this.type = type;

        this.onTileClick = onTileClick.bind(this);
        this.onTileOver = onTileOver.bind(this);
        this.onTileOut = onTileOut.bind(this);

        this.faces = {
			left: this.createFace('left'),
			right: this.createFace('right'),
			top: this.createFace('top')
		}

		this.tileElement = this.createTileElement(this.faces);

		for (let face in this.faces) {
			this.faces[face].addEventListener('click', (event) => this.onTileClick(this, event));
			this.faces[face].addEventListener('mouseover', (event) => this.onTileOver(this, event));
			this.faces[face].addEventListener('mouseout', (event) => this.onTileOut(this, event));
		}

		if (type === 'guide') {
			tileElement.style.pointerEvents = 'none';
		}
    }

    createFace(type) {
		let className;
		switch(type) {
			case "left":
				className = 'thin_face left';
				break;
			case "right":
				className = 'thin_face right';
				break;
			case "top":
				className = 'top';
		}

		const faceElement = document.createElement('div');
		faceElement.className = 'face ' + className;

		return faceElement;
	}

	createTileElement(faces) {
		// Create the tile container
	    const tileElement = document.createElement("div");

	    // Set the ID and class
	    tileElement.id = "cell_" + y + "_" + x + "_" + z;
	    tileElement.className = "tile " + type;

		for (let face in faces) {
			tileElement.appendChild(face);
		}

		return tileElement;
	}

    render() {
        const { x, y, z } = this;
		const { type } = this;
		const { tileElement, faces } = this;

		// Get my offsets
		const leftOffset = y * 45;
		const topOffset = y * 26;

	    // Get the level offset
		const levelOffset = z * 22;

		// Each row on top of the last, each tile in a row below the last
		tileElement.style.cssText = `
			z-index: ${(z + 1) + (y + 1) - x};
			left: ${(45 * x + leftOffset)}px;
			top: ${(26 * x * -1 + topOffset - levelOffset)}px;
		`;
    }
}
