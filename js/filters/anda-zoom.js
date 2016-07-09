(function(){
var map = document.createElement('canvas');
	map.width = 400;
	map.height = 400;
	var imageMap = document.getElementById("img-map");
	var mapcontext = map.getContext("2d");
	mapcontext.drawImage(imageMap, 0, 0);

	var filter = null;
	var filter2 = null;

window.filters.push({
	name : 'zoom',
	author : 'anda',
	draw : function (canvas, context) {

		if (filter==null) {
			filter = new DisplacementFilters.DisplacementMap(canvas, map, canvas, new DisplacementFilters.Point(), 15, 15,
				DisplacementFilters.ColorChannel.RED, DisplacementFilters.ColorChannel.GREEN);
		}

		if (filter2==null) {
			filter2 = new DisplacementFilters.DisplacementMap(canvas, map, canvas, new DisplacementFilters.Point(), 15, 15,
				DisplacementFilters.ColorChannel.RED, DisplacementFilters.ColorChannel.GREEN);
		}

		filter.point.x += 10;
		filter.point.y += 10;

		filter2.point.x -= 30;
		filter2.point.y -= 30;
		
		if (filter.point.x > canvas.width) {
			filter.point.x = 0;
		}

		if (filter.point.y > canvas.height) {
			filter.point.y = 0;
		}

		if (filter2.point.x < 0 ) {
			filter2.point.x = canvas.width;
		}
		if (filter2.point.y < 0) {
			filter2.point.y = canvas.height;
		}

		filter.scaleX = 80;
		filter.scaleY = 80;
		filter.draw();

		filter2.scaleX = 80;
		filter2.scaleY = 80;
		filter2.draw();

	}
});


}());