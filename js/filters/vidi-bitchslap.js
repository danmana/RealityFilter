(function(){


var horizontal, vertical = false;

var audio = new Audio('audio/slap.wav');

	gest.options.subscribeWithCallback(function(gesture) {
	    //handle gesture .direction .up .down .left .right .error
			if (gesture.left || gesture.right) {
				// horizontal = true;
				vertical = !vertical;
				console.log("VERTICAL");
				audio.play();
			}
	});

window.filters.push({
	name : 'bitchslap',
	author : 'vidi',
	draw : function (canvas, context) {
	    // get the raw image data
		var imageData = Filters.getPixels(canvas);
		var data = imageData.data, width = data.length / imageData.height;
        // paint the new data

				if(vertical) {
					imageData = Filters.horizontalFlip(imageData);
				// } else if (horizontal) {
				// 	imageData = Filters.horizontalFlip(imageData);
				}

		imageData.data = data;
		context.putImageData(imageData, 0, 0);
	}
});

}());
