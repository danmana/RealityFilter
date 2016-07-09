(function(){

	if (!contrast) {
<<<<<<< HEAD
	  contrast = 0;
		var multiplier = 12;
  	setInterval(function(){
	  	contrast = contrast + multiplier;
	  	if (contrast > 242 || contrast <0) {
	  		multiplier = (-1) * multiplier;
	  	}
  	}, 30);
  }

=======
		contrast = 0;
		var multiplier = 12;
		setInterval(function(){
			contrast = contrast + multiplier;
			if (contrast > 242 || contrast <0) {
				multiplier = (-1) * multiplier;
			}
		}, 30);
	}
>>>>>>> 07c4e83b06df98d84768cb9a95358110d0402eef

window.filters.push({
	name : 'contrast',
	author : 'anda',
	draw : function (canvas, context) {
	    // get the raw image data
		var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
		var data = imageData.data;
		var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        // ---------- Apply filter --------- //
<<<<<<< HEAD
=======

>>>>>>> 07c4e83b06df98d84768cb9a95358110d0402eef
		for (var i = 0; i < data.length; i += 4) {
			data[i] = factor * (data[i] - 128) + 128;
			data[i+1] = factor * (data[i+1] - 128) + 128;
			data[i+2] = factor * (data[i+2] - 128) + 128;
		}

<<<<<<< HEAD
        // paint the new data
		imageData.data = data;
		context.putImageData(imageData, 0, 0);
=======

        // paint the new data
		imageData.data = data;
		context.putImageData(imageData, 0, 0);

>>>>>>> 07c4e83b06df98d84768cb9a95358110d0402eef
	}
});


<<<<<<< HEAD
}());
=======
}());
>>>>>>> 07c4e83b06df98d84768cb9a95358110d0402eef
