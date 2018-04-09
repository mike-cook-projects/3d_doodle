function Entity(base) {
	const entity = Object.create(base);

	entity.position = { x: 0, y: 0, z: 0 };
	entity.setPosition = function(newPosition) {
		this.position = newPosition;
	}

	return entity;
}



function Guide(base) {
	const guide = Object.create(base);

	guide.guideElement = Tile(Entity({}));

	return guide;
}

function Map(base) {
	const map = Object.create(base);


}

Doodle(Guide(Map));

function Doodle(Map, Guide, Tile) {
	return function(base) {
		const doodle = Object.create(base);
	}
}

function Doodle(base) {
	const doodle = Object.create(base);

	doodle.mapElement = document.getElementById('map');
	doodle.onTileClick = (tile, event) => {
		const { x, y, z } = tile;
		const { tileElement, type } = tile;

		// Set default for event
        event = event || window.event;

        // Check if shift is being held
        if (event.shiftKey) {
            // Remove the element
            tileElement.unmount();

			// Remove any guides
			this.guideElement.remove();

            // Exit
            return false;
        }

        // Adjust the values
        const newX = tileElement.classList.contains("left") ? x - 1 : x;
        const newY = tileElement.classList.contains("right") ? y + 1 : y;
        const newZ = tileElement.classList.contains("top") ? z + 1 : z;

		const realTile = Tile(Entity({}));
		realTile.mount({
			x: newX, y: newY, z: newZ,
			type,
			onTileClick: doodle.onTileClick,

		})

        // Create a new tile
        this.mapElement.appendChild(Tile(Entity({}));
	},

	//// Event for mouseover on a tile
	// p_event: The mouseover event object
	onTileOver: function(p_event) {
	    // Set default for p_event
        p_event = p_event || window.event;

        // The element (this or the parent)
        var element = $(this).hasClass("tile") ? this : $(this).parent()[0];

        // Get the tile id
        var id = element.id;

        // Split out the id
        var id_split = id.split("_");

        // Get the various attributes
        var col = parseInt(id_split[1]);
        var row = parseInt(id_split[2]);
        var level = parseInt(id_split[3]);

        // Adjust the values
        col = $(this).hasClass("left") ? col - 1 : col;
        row = $(this).hasClass("right") ? row + 1 : row;
        level = $(this).hasClass("top") ? level + 1 : level;

        // Create a new tile
        $("#map").append(Doodle.createTile(col, row, level, "guide"));
	},

	//// The mouseout event for a tile
	// p_event: The mouseout event object
	onTileOut: function(p_event) {
	    // Remove any guide tiles
	    $(".guide").remove();
	}
}

function Tile(base) {
	const tile = Object.create(base);

	tile.mount = function(props) {
		// Call the super (which could call it's super)
		base.mount && base.mount.call(this);

		this.type = props.type;

		this.faces = {
			left: this.createFace('left'),
			right: this.createFace('right'),
			top: this.createFace('top')
		}

		this.tileElement = this.createTileElement(this.faces);

		for (let face in this.faces) {
			this.faces[face].addEventListener('click', (event) => props.onTileClick(this, event));
			this.faces[face].addEventListener('mouseover', (event) => props.onTileOver(this, event));
			this.faces[face].addEventListener('mouseout', (event) => props.onTileOut(this, event));
		}

		if (type === 'guide') {
			tileElement.style.pointerEvents = 'none';
		}
	};

	tile.render = function() {
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
	};

	this.unmount = function() {
		const {tileElement} = this;
		tileElement.parentNode.removeChild(tileElement);
	}

	tile.createFace = function(type) {
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

	tile.createTileElement = function(faces) {
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

	return tile;
}

const tile = (Tile(Entity({})));
