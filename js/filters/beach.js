(function(){

container = document.getElementById('webglviewer');
var video = document.createElement('video');
video.style.width = 'auto';
video.style.height = 'auto';
video.class = 'video';
video.src = top.location.pathname + 'videos/beach3.mp4'
video.loop = 'loop';
video.play();


var c2 = null;
var c2ctx = null;
/*var video = document.createElement('iframe');
video.src = 'https://youtube.com/embed/qREKP9oijWI?autoplay=1&controls=0&showinfo=0&autohide=1'
video.style.width = '700px';
video.style.height = '500px';
*/
container.appendChild(video);
var oldFrame;
var pointsOfInterest;
var frame;

BLUR = [  ];


for (i=0;i<16;i++)
BLUR.push(1/16);

function fillPixel(i, dx, dy, width, data, data2) {
	var j = i + (dx + dy * width)*4;
				 if (j>=0 && j+3 < data.length){
				 data[i+3] = 1;
				 data2[i+3] = 1;
	//                    pinkData[j] = red;
	//                    pinkData[j+1] = green;
	//                    pinkData[j+2] = blue;
				//  pinkData[j+3] = 150;
				 }


}

window.filters.push({
	name : 'beach',
	author : 'rares',
	draw : function (canvas, context, bigCanvas, bigContext) {
      // get the raw image data
		var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
		var data = imageData.data;
    var tmp = data.slice(0);



    if(oldFrame == null) {
      console.log('init frames');
			frame=0;
			c2 = document.createElement('canvas');
			c2.width = canvas.width;
			c2.height=canvas.height;
			c2ctx = c2.getContext('2d');

      oldFrame = tmp;
      pointsOfInterest = tmp.slice(0);
      for (var i = 0; i < data.length; i += 4) {
        pointsOfInterest[i+3]=255;
      }
    } else {
      // ---------- Apply filter --------- //
			temp = {
				width: canvas.width,
				height:canvas.height,
				data: pointsOfInterest
			};
			temp = Filters.gaussianBlur(temp,4);
pointsOfInterest = temp.data;

		    for (var i = 0; i < data.length; i += 4) {
          var x = (i /4) % canvas.width;
          var y = Math.floor((i / 4) / canvas.width);
					var oldGray = 0.2989*oldFrame[i] + 0.5870*oldFrame[i+1] + 0.1140*oldFrame[i+2]; //weights from CCIR 601 spec
					var newGray = 0.2989*data[i] + 0.5870*data[i+1] + 0.1140*data[i+2]; //weights from CCIR 601 spec

          if(Math.abs(oldGray - newGray) > 20) {
            pointsOfInterest[i+3] = 2;
						data[i+3] = 2;

						//for (dx=-10;dx<10;dx++)
						//for (dy=-10;dy<10;dy++)
						//fillPixel(i, dx, dy, canvas.width, data, pointsOfInterest);

          }else {
						pointsOfInterest[i+3] = Math.min(255,Math.ceil(pointsOfInterest[i+3] * 1.15));
						data[i+3] = pointsOfInterest[i+3];
					}
      }
    }
    //console.log(pointsOfInterest[3]);
        // paint the new data
		imageData.data = data;
		context.drawImage(video, 0 , 0);

		c2ctx.putImageData(imageData, 0, 0);
		context.drawImage(c2, 0 , 0);
		//putImageData(imageData, 0, 0);
		oldFrame = tmp;
		frame++;
		//return false;
	}
});



}());
