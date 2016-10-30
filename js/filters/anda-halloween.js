(function(){

    var dist = 10, increment = 1;
    setInterval(function(){
        dist = dist + increment;
        if (dist >= 20 || dist <= 10) {
            increment = increment * (-1);
        }
    }, 30);

    window.filters.push({
        name : 'contrast',
        author : 'anda',
        draw : function (canvas, context) {
            // get the raw image data
            var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            var data = imageData.data;

            // ---------- Apply filter --------- //

            function copyPixel(x1, y1, x2, y2){
                var i1= (y1 * 4 * canvas.width) + (x1 * 4);
                var i2= (y2 * 4 * canvas.width) + (x2 * 4);
                if (i2>=0 && i2+2<data.length) {
                    data[i1] = data[i2];
                    data[i1 + 1] = data[i2 + 1];
                    data[i1 + 2] = data[i2 + 2];
                }
            }

            for (var x=0; x<canvas.width; x++)  {
                for (var y=0; y<canvas.height; y++) {
                    var col = x%20;
                    if (col < 10) {
                        copyPixel(x,y, x, y+(0 + dist));
                    } else {
                        copyPixel(x,y, x, y+(20 - dist));
                    }
                }
            }




            // paint the new data
            imageData.data = data;
            context.putImageData(imageData, 0, 0);

        }
    });


}());
