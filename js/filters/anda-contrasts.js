(function(){

window.filters.push({
	name : 'contrast',
	author : 'anda',
	draw : function (canvas, context) {
	    // get the raw image data
		var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
		var data = imageData.data;
		var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        // ---------- Apply filter --------- //
		for (var i = 0; i < data.length; i += 4) {
			data[i] = factor * (data[i] - 128) + 128;
			data[i+1] = factor * (data[i+1] - 128) + 128;
			data[i+2] = factor * (data[i+2] - 128) + 128;
		}

        // paint the new data
		imageData.data = data;
		context.putImageData(imageData, 0, 0);
	}
});


}());