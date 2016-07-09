(function(){

var smoother = new Smoother([0.995, 0.995, 0.995, 0.995], [0, 0, 0, 0]);
var detector = null;


window.filters.push({
	name : 'eyes',
	author : 'danmana',
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
console.log(coord);
            // Rescale coordinates from detector to video coordinate space:
            coord[0] *= canvas.width / detector.canvas.width;
            coord[1] *= canvas.height / detector.canvas.height;
            coord[2] *= canvas.width / detector.canvas.width;
            coord[3] *= canvas.height / detector.canvas.height;
//console.log(coord);
            // Display glasses overlay:
            var rect = {};
            rect.x    = ~~(coord[0] + coord[2] * 1.0/8 ) ;
            rect.y     = ~~(coord[1] + coord[3] * 2.1/8 ) ;
            rect.width   = ~~(coord[2] * 6/8);
            rect.height  = ~~(coord[3] * 1.6/8);

        context.fillStyle = "rgba(0,255,0,0.4)";
        context.fillRect(rect.x, rect.y, rect.width, rect.height);

        }




	}
});



}());