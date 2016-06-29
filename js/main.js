var scene,
  camera,
  renderer,
  element,
  container,
  effect,
  video,
  canvas,
  context,
  themes = ['blackandwhite', 'sepia', 'arcade', 'inverse'],
  currentTheme = 0,
  lookingAtGround = false;

init();

function init() {
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.001, 700);
camera.position.set(0, 15, 0);
scene.add(camera);

renderer = new THREE.WebGLRenderer();
element = renderer.domElement;
container = document.getElementById('webglviewer');
//container.appendChild(element);

effect = new THREE.StereoEffect(renderer);

element.addEventListener('click', fullscreen, false);

if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', function(evt) {
    if (evt.gamma > -1 && evt.gamma < 1 && !lookingAtGround) {
      lookingAtGround = true;
      currentTheme = (themes.length > currentTheme+1) ? currentTheme+1 : 0;

      setTimeout(function() {
        lookingAtGround = false;
      }, 4000);
    }
  }.bind(this));
}

setInterval(function(){
    currentTheme = (themes.length > currentTheme+1) ? currentTheme+1 : 0;
}, 6000);
document.addEventListener('click', function(){
    currentTheme = (themes.length > currentTheme+1) ? currentTheme+1 : 0;
})

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
  alert('This browser doesn\'t support this demo :(');
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
  document.body.appendChild(video);
  video.src = URL.createObjectURL(stream);
  video.style.width = '100%';
  video.style.height = '100%';
  video.play();

  canvas = document.createElement('canvas');
  canvas.width = video.clientWidth;
  canvas.height = video.clientHeight;
  //canvas.width = nextPowerOf2(canvas.width);
  //canvas.height = nextPowerOf2(canvas.height);
  container.appendChild(canvas);

  function nextPowerOf2(x) {
      return Math.pow(2, Math.ceil(Math.log(x) / Math.log(2)));
  }

  context = canvas.getContext('2d');
  texture = new THREE.Texture(canvas);
  texture.context = context;

  // If you do not use powersOf2, or you want to adjust things more, you could use these:
  //texture.minFilter = THREE.LinearMipMapLinearFilter;
  //texture.magFilter = THREE.NearestFilter;

  var cameraPlane = new THREE.PlaneGeometry(1920, 1280);

  cameraMesh = new THREE.Mesh(cameraPlane, new THREE.MeshBasicMaterial({
    color: 0xffffff, opacity: 1, map: texture
  }));
  cameraMesh.position.z = -600;

  scene.add(cameraMesh);
}

function streamError(error) {
  console.log('Stream error: ', error);
}

animate();
}


function animate() {
if (context) {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  if (themes[currentTheme] == 'blackandwhite') {
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;

    for (var i = 0; i < data.length; i+=4) {
      var red = data[i],
          green = data[i+1],
          blue = data[i+2],
          luminance = ((red * 299) + (green * 587) + (blue * 114)) / 1000; // Gives a value from 0 - 255
      if (luminance > 175) {
        red = 255;
        green = 255;
        blue = 255;
      } else if (luminance >= 100 && luminance <= 175) {
        red = 190;
        green = 190;
        blue = 190;
      } else if (luminance < 100) {
        red = 0;
        green = 0;
        blue = 0;
      }

      data[i] = red;
      data[i+1] = green;
      data[i+2] = blue;
    }

    imageData.data = data;

    context.putImageData(imageData, 0, 0);
  } else if (themes[currentTheme] == 'inverse') {
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;

    for (var i = 0; i < data.length; i+=4) {
      var red = 255 - data[i],
          green = 255 - data[i+1],
          blue = 255 - data[i+2];

      data[i] = red;
      data[i+1] = green;
      data[i+2] = blue;
    }

    imageData.data = data;

    context.putImageData(imageData, 0, 0);
  } else if (themes[currentTheme] == 'sepia') {
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;

    for (var i = 0; i < data.length; i+=4) {
      var red = data[i],
          green = data[i+1],
          blue = data[i+2];

      var sepiaRed = (red * 0.393) + (green * 0.769) + (blue * 0.189);
      var sepiaGreen = (red * 0.349) + (green * 0.686) + (blue * 0.168);
      var sepiaBlue = (red * 0.272) + (green * 0.534) + (blue * 0.131);

      var randomNoise = Math.random() * 50;

      sepiaRed += randomNoise;
      sepiaGreen += randomNoise;
      sepiaBlue += randomNoise;

      sepiaRed = sepiaRed > 255 ? 255 : sepiaRed;
      sepiaGreen = sepiaGreen > 255 ? 255 : sepiaGreen;
      sepiaBlue = sepiaBlue > 255 ? 255 : sepiaBlue;

      data[i] = sepiaRed;
      data[i+1] = sepiaGreen;
      data[i+2] = sepiaBlue;
    }

    imageData.data = data;

    context.putImageData(imageData, 0, 0);
  } else if (themes[currentTheme] == 'arcade') {
    ClosePixelation(canvas, context, [
      {
        resolution: 6
      }
    ]);
  }

  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    texture.needsUpdate = true;
  }
}

requestAnimationFrame(animate);

update();
render();
}

function resize() {
var width = container.offsetWidth;
var height = container.offsetHeight;

camera.aspect = width / height;
camera.updateProjectionMatrix();

renderer.setSize(width, height);
effect.setSize(width, height);
}

function update(dt) {
resize();

camera.updateProjectionMatrix();
}

function render(dt) {
effect.render(scene, camera);
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