(function(){

var tempCanvas = document.createElement('canvas');
tempCanvas.width=1000;
tempCanvas.height=1000;
var tempContext = tempCanvas.getContext('2d');

window.filters.push({
	name : 'blending',
	author : 'vidi',
	draw : function (canvas, context) {
	    // get the raw image data
		var imageData = Filters.getPixels(canvas);
		var data = imageData.data, width = data.length / imageData.height;

		var	otherImageData = imageData;
		var tempData = tempContext.getImageData(0,0,imageData.width, imageData.height);


		tempData = Filters.brightnessContrast(tempData, -0.1, 1);
		tempData = Filters.gaussianBlur(tempData, 10);
		tempData = Filters.screenBlend(tempData, otherImageData);

		tempContext.putImageData(tempData, 0, 0);
		// imageData = Filters.gaussianBlur(imageData, 10);
		// imageData = Filters.sobel(imageData);
		imageData = Filters.multiplyBlend(imageData, tempData);

        // paint the new data
		imageData.data = data;
		context.putImageData(imageData, 0, 0);
	}
});

}());
