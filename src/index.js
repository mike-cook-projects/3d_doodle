import Doodle from 'doodle';

// OnReady function
$(document).ready(function() {
	// Solve the doodle and display the result
	Doodle.init();

	$("#map").append(Doodle.createPerson(4, 4, 1));

	$("#base_type").change(function() {
		Doodle.buildMap($("#base_type").val());
	});
});



export default class Tile {
    constructor(x, y, z, type) {
        this.x = x;
        this.y = y;
        this.type = type;

        this.faces = {
            left: document.createElement('div'),
            right: document.createElement('div'),
            top: document.createElement('div')
        };
    }



    render() {
        
    }
}

export default class Doodle {
    constructor(element, nodes, baseTileType) {
        this.element = element;
        this.nodes = nodes;
        this.baseTileType = baseTileType;
    }

    render() {
        const { nodes, element, baseTileType } = this;

		const fragment = document.createDocumentFragment();

		// Remove any existing table
		$map.children().remove();

		// Loop through the Doodle columns
		for (let row = 0; row < Doodle.DOODLE_HEIGHT; row++) {
		    // Loop through the Doodle rows
		    for (let col = 0; col < Doodle.DOODLE_WIDTH; col++) {
						fragment.appendChild(Doodle.createTile(col, row, 0, tileType));
		    }
		}

		$map.append(fragment);
    }
}
