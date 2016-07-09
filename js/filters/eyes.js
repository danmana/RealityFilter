(function(){

var smoother = new Smoother([0.995, 0.995, 0.995, 0.995], [0, 0, 0, 0]);
var detector = null;

var c2 = document.createElement('canvas');
var c2ctx;

window.filters.push({
	name : 'eyes',
	author : 'danmana',
	draw : function (canvas, context) {
	    if (!detector) {
            var width = ~~(60 * canvas.width / canvas.height);
            var height  = 60;
            detector = new objectdetect.detector(width, height, 1.1, objectdetect.frontalface_alt);
        }

        if (!c2ctx || c2.width != canvas.width) {
            c2.width = canvas.width;
            c2.height = canvas.height;
            c2ctx = c2.getContext('2d');
        }

        var c2imageData = c2ctx.getImageData(0, 0, canvas.width, canvas.height);
        var c2data = c2imageData.data;
        var data = context.getImageData(0, 0, canvas.width, canvas.height).data;

        var coords = detector.detect(canvas, 1);
        var coord = coords[0];
        if (coord){
            coord = smoother.smooth(coord);
            // Rescale coordinates from detector to video coordinate space:
            coord[0] *= canvas.width / detector.canvas.width;
            coord[1] *= canvas.height / detector.canvas.height;
            coord[2] *= canvas.width / detector.canvas.width;
            coord[3] *= canvas.height / detector.canvas.height;
            // Display glasses overlay:
            var rect = {};
            rect.x    = ~~(coord[0] + coord[2] * 1.0/8 ) ;
            rect.y     = ~~(coord[1] + coord[3] * 2.1/8 ) ;
            rect.width   = ~~(coord[2] * 6/8);
            rect.height  = ~~(coord[3] * 1.6/8);

            for (x=0;x<=rect.width;x++) {
                for (y=0;y<=rect.height;y++) {
                    i = Math.min(c2data.length, ((rect.y + y)*canvas.width + (rect.x + x))*4);
                    var red = data[i];
                    var green = data[i+1];
                    var blue = data[i+2];

                    if (isWhite(red,green,blue)){
                        c2data[i] = 255;
                        c2data[i+1] = 30;
                        c2data[i+2] = 70;
                        c2data[i+3] = 255;
                    } else {
                        c2data[i+3] = Math.floor(c2data[i+3] * 0.95);
                    }
                }
            }

            c2imageData = Filters.gaussianBlur(c2imageData,5);



        }

        c2ctx.putImageData(c2imageData, 0, 0);
        context.drawImage(c2, 0, 0);


	}
});



}());