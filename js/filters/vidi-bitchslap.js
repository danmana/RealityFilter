(function(){


var horizontal = false, vertical = false;

var audioSlap = new Audio('audio/slap.wav');
var audioPunch = new Audio('audio/punch.wav');
var finishHim = new Audio('audio/finish-him.mp3')

var hurt = 0;

var paused = true;

	gest.options.subscribeWithCallback(function(gesture) {
	    //handle gesture .direction .up .down .left .right .error

			if (paused) {
				return;
			}

			if (gesture.left || gesture.right) {
				// horizontal = true;
				horizontal = !horizontal;
				console.log("HORIZONTAL");
				audioSlap.play();
				hurt += 50;
			}
			if (gesture.up || gesture.down) {
				// horizontal = true;
				vertical = !vertical;
				console.log("VERTICAL");
				audioPunch.play();
				hurt += 200;
			}

			if (hurt > 1000) {
				finishHim.play();
			}

			console.log("hurt " + hurt);
	});

	var lut = {
	          r: Filters.identityLUT(),
	          g: Filters.createLUTFromCurve([[0,0], [10,0], [128,58], [200,222], [225,255]]),
	          b: Filters.identityLUT(),
	          a: Filters.identityLUT()
	        };

window.filters.push({
	name : 'bitchslap',
	author : 'vidi',
	pause: function(){
		paused = true;
	},
	draw : function (canvas, context) {
			paused = false;
	    // get the raw image data
		var imageData = Filters.getPixels(canvas);
		var data = imageData.data, width = data.length / imageData.height;
        // paint the new data

				if(horizontal) {
					imageData = Filters.horizontalFlip(imageData);
				// } else if (horizontal) {
				// 	imageData = Filters.horizontalFlip(imageData);
				}
				if (vertical) {
					imageData = Filters.verticalFlip(imageData);
				}

				data = imageData.data;

				if (hurt > 0) {
					for (var i = 0; i < data.length; i += 4) {
						var red = data[i],
			          green = data[i + 1],
			          blue = data[i + 2];

								data[i] += red + hurt;

								if (red == 255) {
									data[i+1] = 0;
									data[i+1+2] = 0;
								}


					}

					hurt--;
					// imageData = Filters.gaussianBlur(imageData, data[i] / red);
				}


		imageData.data = data;
		context.putImageData(imageData, 0, 0);
	}
});

}());
