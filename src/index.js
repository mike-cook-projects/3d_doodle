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
