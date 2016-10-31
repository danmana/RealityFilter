/**
 * Created by Anda.Plotuna on 10/30/2016.
 */
(function(){
    var flakes = [],
        flakeCount = 300,
        initedWidth = 0;

    function init(canvas, rate) {
        for (var i = 0; i < flakeCount; i++) {
            initFlake(canvas, i, rate);
        }
    };

    function initFlake(canvas, index, rate){
        var x = Math.floor(Math.random() * canvas.width),
            y = Math.floor(Math.random() * rate),
            size = (Math.random() * 3) + 2,
            speed = (Math.random() * 1) + 0.5,
            opacity = (Math.random() * 0.5) + 0.3;

        flakes[index] = {
            speed: speed,
            velY: speed,
            velX: 0,
            x: x,
            y: y,
            size: size,
            stepSize: (Math.random()) / 30,
            step: 0,
            angle: 180,
            opacity: opacity
        };
    }

    function snow(canvas, ctx) {
        for (var i = 0; i < flakeCount; i++) {
            var flake = flakes[i];
            ctx.fillStyle = "rgba(255,255,255," + flake.opacity + ")";
            if (flake.y > canvas.height || flake.x > canvas.width) {
                initFlake(canvas, i, canvas.height/6);
            }

            if (i % 5 == 0) {
                flake.x = flake.x + 1;
            }

            if (i % 3 == 0) {
                flake.x = flake.x - 1;
            }

            flake.y = flake.y + 2;

            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    window.filters.push({
        name : 'snow',
        author : 'anda',
        draw : function (canvas, context) {
            // get the raw image data
            if (initedWidth != canvas.width) {
                flakes = [];
                init(canvas, canvas.height);
                initedWidth = canvas.width;
            }

            snow(canvas, canvas.getContext("2d"));
/*            var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            var data = imageData.data;

            // paint the new data
            imageData.data = data;
            context.putImageData(imageData, 0, 0);*/

        }
    });


}());

