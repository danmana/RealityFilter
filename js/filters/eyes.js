(function(){

var smoothers = [new Smoother([0.98, 0.98, 0.98, 0.98], [0, 0, 0, 0]),new Smoother([0.98, 0.98, 0.98, 0.98], [0, 0, 0, 0]),new Smoother([0.98, 0.98, 0.98, 0.98], [0, 0, 0, 0])];
var detector = null;


//var eyeImg = document.createElement('img');
//document.addElement(eyeImg);

function drawEye(coord, smoother, canvas, data, c2data) {
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

        var minX = Math.floor(rect.width*0.1);
        var maxX = Math.floor(rect.width*0.9);
        var minY = Math.floor(rect.height*0.2);
        var maxY = Math.floor(rect.height*0.9);

        for (x=minX;x<=maxX;x++) {
            for (y=minY;y<=maxY;y++) {
                i = Math.min(c2data.length, ((rect.y + y)*canvas.width + (rect.x + x))*4);
                var red = data[i];
                var green = data[i+1];
                var blue = data[i+2];

                if (isEye(red,green,blue)){
                    c2data[i] = 200 + (Math.random()*55);
                    c2data[i+1] = 200 + (Math.random()*55);
                    c2data[i+2] = 10;
                    c2data[i+3] = 255;
                }
            }
        }


    }
}

var c2 = document.createElement('canvas');
var c2ctx;

function isEye(r,g,b){
var gray = 0.2989*r + 0.5870*g + 0.1140*b;
var dx = r - gray;
var dy = g - gray;
var dz = b - gray;

return gray < 100 && dx*dx + dy*dy + dz*dz < 140;// ||gray > 100;


}

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
//        for (i=0;i<Math.min(3,coords.length);i++) {
//            drawEye(coords[i], smoothers[i], canvas, data, c2data);
//        }
if (!coords.length) {
drawEye([canvas.width/2-100,canvas.height/2-100,canvas.width/2+100,canvas.height/2+100], smoothers[0], canvas, data, c2data);
}
        drawEye(coords[0], smoothers[0], canvas, data, c2data);
        drawEye(coords[1], smoothers[1], canvas, data, c2data);
        drawEye(coords[2], smoothers[2], canvas, data, c2data);


        for (i=0;i<c2data.length;i+=4){
            c2data[i+3] = Math.floor(c2data[i+3] * 0.95);
        }
        c2imageData = Filters.gaussianBlur(c2imageData,5);

        c2ctx.putImageData(c2imageData, 0, 0);
        context.drawImage(c2, 0, 0);


	}
});



}());