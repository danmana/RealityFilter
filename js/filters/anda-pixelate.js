(function(){

    function isMagenta(r,g,b) {
        var threshold = 20,
            dx = r - 255,
            dy = g - 0,
            dz = b - 255;

        if ((r - g) >= threshold && (b - g) >= threshold) {
            return true;
        }
        return dx * dx + dy * dy + dz * dz < 19600;
    }

    window.filters.push({
        name : 'pixelate',
        author : 'anda',
        draw : function (canvas, context) {
            // get the raw image data


            // ---------- Apply filter --------- //

            var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            var data = imageData.data;

            for (var i = 0; i < data.length; i += 4) {
                var red = data[i],
                    green = data[i + 1],
                    blue = data[i + 2];

                // pink like
                if (isMagenta(red,green,blue)){
                    data[i] = 255;
                }
            }

            // paint the new data
		imageData.data = data;
		context.putImageData(imageData, 0, 0);

            ClosePixelation(canvas, context, [{
                resolution: 15
            }]);
        }
    });

}());
