var
  container,
  video,
  canvasBuffer,
  canvas,
  context,
  contextBuffer,
  filters = [],
  currentFilter = 0,
  MOCK_VIDEO = '/videos/Shopping Mall - 1887.mp4';

var leapController =  Leap.loop({enableGestures: true}, function(frame){
});

init();

function init() {
container = document.getElementById('webglviewer');

    leapController.on("gesture", function(gesture) {
        console.log(gesture);
        if (gesture.type == "swipe") {
            currentFilter = (filters.length > currentFilter+1) ? currentFilter+1 : 0;
        }
    });
    
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