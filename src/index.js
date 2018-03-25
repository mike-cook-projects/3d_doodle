//////////////////////////////////////////////////////////////////////////////////////////
// 3D Doodle  										//
// Author: Mike Cook								     	//
// Date: 10/03/12									//
// Description: Controller for drawing and manipulating tiles on the screen		//
//////////////////////////////////////////////////////////////////////////////////////////
var Doodle = {
	// "Constants"
	DOODLE_WIDTH: 10, // The number of cells on the x-axis
	DOODLE_HEIGHT: 10, // The number of cells on the y-axis
	DEFAULT_TILE_TYPE: 'grass',

	// The state of the mouse click
	leftDown: false,

	// The level currently locked
	lockedLevel: -1,

	//// Initialization
	init: function() {
		// Set up the map
		Doodle.setupMap();

		// The current step
		var current_step = 0;

		// Create the doodle table
		Doodle.buildMap();
	},

	//// Set up the map
	setupMap: function() {
		// Bind the mouse down event
		$("#map").mousedown(function() {
			// Set the flag
			Doodle.leftDown = true;
		});

		// Bind the mouse up event
		$("#map").mouseup(function() {
			// Set the flag
			Doodle.leftDown = false;

			// Reset the locked level
			Doodle.lockedLevel = -1;
		});

		// Bind the mouse out event
		$("#map").mouseout(function() {
			// Set the flag
			Doodle.leftDown = false;

			// Reset the locked level
			Doodle.lockedLevel = -1;
		});
	},

	//// Creates a map grid and appends it to the map node
	// p_type: The type of tile to use for the base layer
	buildMap: function(p_type) {
		const $map = $('#map');
		const fragment = document.createDocumentFragment();
		const tileType = p_type || Doodle.DEFAULT_TILE_TYPE;

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
	},

	createPerson: function(p_position, p_row, p_level) {
	    // Create the tile container
	    var person = document.createElement("div");

	    // Set the ID and class
	    person.id = "person_" + p_position + "_" + p_row + "_" + p_level;
	    person.className = "person";

	    // Get the row offset
	    var row_left_offset = p_row * 45;
	    var row_top_offset = p_row * 26;

	    // Get the level offset
	    var level_offset_top = p_level * 22;

	    // Set the tile's position and z-index information
	    $(person).css({
	        // Each row on top of the last, each tile in a row below the last
	        zIndex: (p_level * 2000) + (p_row * 100) - p_position,
	        // Left value
	        left: (45 * p_position + row_left_offset + 35) + 'px',
	        // Top value
	        top: (26 * p_position * -1 + row_top_offset - level_offset_top + 15) + 'px'
	    });

	    // Send the tile back
	    return person;
	},

	//// Create a tile on the map
	// p_position: The position in the row (x-axis)
	// p_row: The row to place the tile in (y-axis)
	// p_level: The level to place the tile on (z-axis)
	// p_type: The type of tile to place
	createTile: function(p_position, p_row, p_level, p_type) {
	    // Set default for p_type
	    p_type = typeof p_type === "undefined" ? "" : " " + p_type;

	    // Create the tile container
	    var tile = document.createElement("div");

	    // Set the ID and class
	    tile.id = "cell_" + p_position + "_" + p_row + "_" + p_level;
	    tile.className = "tile" + p_type;

	    // Create the left face and set the class
	    var left_face = document.createElement("div");
	    left_face.className = "face left thin_face";

	    // Create the right face and set the class
	    var right_face = document.createElement("div");
	    right_face.className = "face right thin_face";

	    // Create the top face
	    var top_face = document.createElement("div");
	    top_face.className = "face top";

	    // Add the faces to the tile
	    tile.appendChild(left_face);
	    tile.appendChild(right_face);
	    tile.appendChild(top_face);

	    // Get the row offset
	    var row_left_offset = p_row * 45;
	    var row_top_offset = p_row * 26;

	    // Get the level offset
	    var level_offset_top = p_level * 22;

	    // Set the tile's position and z-index information
	    $(tile).css({
	        // Each row on top of the last, each tile in a row below the last
	        zIndex: (p_level + 1) + (p_row + 1) - p_position,
	        // Left value
	        left: (45 * p_position + row_left_offset) + 'px',
	        // Top value
	        top: (26 * p_position * -1 + row_top_offset - level_offset_top) + 'px'
	    });

	    // Check if this is a ghost block (you click through it)
	    if (p_type === " guide") {
	        // Ignore clicks
	        $(tile).css("pointer-events", "none");
	    }

	    // Set the onClick function
	    $(tile).children(".top, .left, .right").click(Doodle.onTileClick);

	    // Set the over / out functions
	    $(tile).children(".top, .left, .right").mouseover(Doodle.onTileOver);
	    $(tile).children(".top, .left, .right").mouseout(Doodle.onTileOut);

	    // Send the tile back
	    return tile;
	},

	//// Event for clicking a tile
	// p_event: The event object for the click event
	onTileClick: function(p_event) {
		// Set default for p_event
        p_event = p_event || window.event;

        // The element (this or the parent)
		// TODO: When are we ever clicking on the tile itself?  We always seem to select the parent.
        var element = $(this).hasClass("tile") ? this : $(this).parent()[0];

        // Check if shift is being held
        if (p_event.shiftKey) {
            // Remove the element
            $(element).remove();

			// Remove any guides
			$(".guide").remove();

            // Exit
            return false;
        }

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


        // Get the type
        var type = $("#tile_type").val();

        // Create a new tile
        $("#map").append(Doodle.createTile(col, row, level, ''));
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
};

// OnReady function
$(document).ready(function() {
	// Solve the doodle and display the result
	Doodle.init();

	$("#map").append(Doodle.createPerson(4, 4, 1));

	$("#base_type").change(function() {
		Doodle.buildMap($("#base_type").val());
	});
});
