(function(){
var map = document.createElement('canvas');
	map.width = 400;
	map.height = 400;
	var imageMap = document.getElementById("img-map");
	var mapcontext = map.getContext("2d");
	mapcontext.drawImage(imageMap, 0, 0);

	var filter = null;
	var filter2 = null;
	var rect = {};



var smoother = new Smoother([0.8, 0.8, 0.8, 0.8], [0, 0, 0, 0]);
var detector = null;


window.filters.push({
	name : 'zoom',
	author : 'anda',
	draw : function (canvas, context) {

	if (!detector) {
                var width = ~~(60 * canvas.width / canvas.height);
                var height  = 60;
                detector = new objectdetect.detector(width, height, 1.1, objectdetect.frontalface_alt);
            }

            var coords = detector.detect(canvas, 1);
            if (coords[0]) {
                var coord = coords[0];
                coord = smoother.smooth(coord);
                // Rescale coordinates from detector to video coordinate space:
                coord[0] *= canvas.width / detector.canvas.width;
                coord[1] *= canvas.height / detector.canvas.height;
                coord[2] *= canvas.width / detector.canvas.width;
                coord[3] *= canvas.height / detector.canvas.height;
                // Display glasses overlay:
                rect.x    = ~~(coord[0] + coord[2] * 1.0/8 ) ;
                rect.y     = ~~(coord[1] + coord[3] * 2.1/8 ) ;
                rect.width   = ~~(coord[2] * 6/8);
                rect.height  = ~~(coord[3] * 1.6/8);

//            context.fillStyle = "rgba(0,255,0,0.4)";
//            context.fillRect(rect.x, rect.y, rect.width, rect.height);

            }




		if (filter==null) {
			filter = new DisplacementFilters.DisplacementMap(canvas, map, canvas, new DisplacementFilters.Point(), 15, 15,
				DisplacementFilters.ColorChannel.RED, DisplacementFilters.ColorChannel.GREEN);
		}

		if (filter2==null) {
			filter2 = new DisplacementFilters.DisplacementMap(canvas, map, canvas, new DisplacementFilters.Point(), 15, 15,
				DisplacementFilters.ColorChannel.RED, DisplacementFilters.ColorChannel.GREEN);
		}

		filter.point.x = Math.min(canvas.width, Math.max(0,rect.x + rect.width*0.33 - 125));
		filter.point.y = Math.min(canvas.height, Math.max(0,rect.y + rect.height/2 - 125));

		filter2.point.x = Math.min(canvas.width, Math.max(0,rect.x + rect.width - 125));
        filter2.point.y = Math.min(canvas.height, Math.max(0,rect.y + rect.height/2 - 125));

		filter.scaleX = 80;
		filter.scaleY = 80;
		filter.draw();

		filter2.scaleX = 80;
		filter2.scaleY = 80;
		filter2.draw();

	}
});


}());