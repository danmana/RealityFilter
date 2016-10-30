/**
 * Created by Anda.Plotuna on 10/30/2016.
 */
(function(){

    window.filters.push({
        name : 'switch',
        author : 'anda',
        draw : function (canvas, context) {
            // get the raw image data
            var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            var data = imageData.data;

            // ---------- Apply filter --------- //
            for (var i = 0; i < data.length; i += 4) {
                var r = data[i];
                data[i] = data[i+1];
                data[i+1] = r;
            }


            // paint the new data
            imageData.data = data;
            context.putImageData(imageData, 0, 0);

        }
    });


}());
