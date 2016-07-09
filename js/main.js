var
  container,
  video,
  canvasBuffer,
  canvas,
  context,
  contextBuffer,
  filters = [],
  currentFilter = 0,
  contrast,
  gest,
  MOCK_VIDEO = '/videos/Shopping Mall - 1887.mp4',
    contrast;

var leapController =  Leap.loop({enableGestures: true}, function(frame){
        frame.hands.forEach(function(hand){
            contrast = hand.palmPosition[1];
        });
});

init();

function init() {
container = document.getElementById('webglviewer');


setInterval(function(){
     nextFilter();
}, 6000);

leapController.on("gesture", function(gesture) {
    // change filters by swiping
    if (gesture.type == "swipe") {
        nextFilter();
    }
});

function nextFilter() {
  if (currentFilter.pause) {
    currentFilter.pause();
  }

  currentFilter = (filters.length > currentFilter+1) ? currentFilter+1 : 0;
} function prevFilter() {
  if (currentFilter.pause) {
    currentFilter.pause();
  }

  currentFilter = (filters.length > currentFilter+1) ? currentFilter+1 : 0;
}

document.onkeydown = function(e) {
    switch(e.which) {
        case 37: // left
          prevFilter();
					console.log("Change effect previous");
        break;

        case 39: // right
          nextFilter();
					console.log("Change effect next");
        break;
        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
};


document.addEventListener('click', fullscreen, false);
window.addEventListener('resize', resize, false);

video = document.createElement('video');
video.setAttribute('autoplay', true);

var options = {
  video: {
    optional: [{facingMode: "environment"}]
  }
};

navigator.getUserMedia = navigator.getUserMedia ||
navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

if (typeof MediaStreamTrack === 'undefined' && navigator.getUserMedia) {
  console.error('This browser doesn\'t support this demo :(');
  initVideo(MOCK_VIDEO);
} else {
  MediaStreamTrack.getSources(function(sources) {
    for (var i = 0; i !== sources.length; ++i) {
      var source = sources[i];
      if (source.kind === 'video') {
        if (source.facing && source.facing == "environment") {
          options.video.optional.push({'sourceId': source.id});
        }
      }
    }

    navigator.getUserMedia(options, streamFound, streamError);
  });
}

function streamFound(stream) {
    initVideo(URL.createObjectURL(stream));
}

function initVideo(src) {
  document.body.appendChild(video);
  video.src = src;
  video.style.width = 'auto';
  video.style.height = 'auto';

  video.addEventListener( "loadedmetadata", function (e) {
      canvasBuffer.width = this.videoWidth,
      canvasBuffer.height = this.videoHeight;
  }, false );


  video.play();

  canvas = document.createElement('canvas');
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
  container.appendChild(canvas);

  context = canvas.getContext('2d');


  canvasBuffer = document.createElement('canvas');
  canvasBuffer.width = video.clientWidth;
  canvasBuffer.height = video.clientHeight;
  // do not add this in the dom, it is just an in memory buffer
  contextBuffer = canvasBuffer.getContext('2d');
}


function streamError(error) {
  console.log('Stream error: ', error);
  console.log('Using default video as source');
  initVideo(MOCK_VIDEO);
  video.loop = true;
}

animate();

}

function animate() {
    if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
        try {
            contextBuffer.drawImage(video, 0, 0, canvasBuffer.width, canvasBuffer.height);

            if (filters.length && filters[currentFilter]){
                var filter = filters[currentFilter];
                var copyBufferToCanvas = filter.draw(canvasBuffer, contextBuffer, canvas, context);
                if (copyBufferToCanvas !== false) {
                    context.drawImage(canvasBuffer,0,0,canvas.width,canvas.height);
                }
            }
        } catch(e){
            console.error(e);
        }

    }

    requestAnimationFrame(animate);
}

function resize() {
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
  canvasBuffer.width = video.clientWidth;
  canvasBuffer.height = video.clientHeight;
}



function fullscreen() {
if (container.requestFullscreen) {
  container.requestFullscreen();
} else if (container.msRequestFullscreen) {
  container.msRequestFullscreen();
} else if (container.mozRequestFullScreen) {
  container.mozRequestFullScreen();
} else if (container.webkitRequestFullscreen) {
  container.webkitRequestFullscreen();
}

}

gest.start();
