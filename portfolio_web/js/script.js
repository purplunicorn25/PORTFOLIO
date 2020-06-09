"use strict";

/********************************************************************

Portfolio: Home Page
Anne Boutet
(✿◠‿◠)

The Home page of my Portfolio.

*********************************************************************/

// Constants
let CHECK_INTERVAL = 1;
let NUM_FRAMES = 15;

// When the document is loaded call setup
$(document).ready(preload);

// Variables
// ANIMATION
let animationFrames = [];
let animationFramesLoaded = false;

// preload
//
// Downlaod the images before calling setup
function preload() {
  // Transform video into frames
  videoToFrames();
  // Check if they are loaded
  let loading = setInterval(() => {
    if (animationFramesLoaded === true) {
      // Call setup
      setup();
      // Clear the interval
      clearInterval(loading);
    }
  }, CHECK_INTERVAL)
}

// videoToFrames
//
// Convert a video file into an array of images (frames)
function videoToFrames() {
  // Define the source and the number of frames
  VideoToFrames.getFrames('assets/images/TEST_FILM.mp4', NUM_FRAMES, VideoToFramesMethod.totalFrames).then(function(frames) {
    // Store them in a global array
    for (let i = 0; i < frames.length; i++) {
      animationFrames.push(frames[i]);
      // Since there is a delay with this library, check when its loaded
      if (animationFrames.length === frames.length) {
        animationFramesLoaded = true;
      }
    }
  });
}

// setup
//
//
function setup() {
  console.log("setup");
  animationDisplay();
  animate();
}

// animationDisplay
//
// Display the image from the animationFrames array from bottom to top
function animationDisplay() {
  // Define the width according to the first frame (same size for all)
  let animationWidth = animationFrames[0].width;
  let animationHeight = animationFrames[0].height;
  // Create canvases to append the images to the animation div
  // Do a reverse loop so that the first frame is on top
  for (let i = animationFrames.length - 1; i >= 0; i--) {
    //**The video-to-frames library requires DOM function to transfer imageData into 2D canvases
    // Create a canvas, define its width, height and ID. Append to div.
    let canvas = document.createElement('canvas');
    canvas.width = animationWidth;
    canvas.height = animationHeight;
    canvas.id = 'frame' + i;
    canvas.getContext('2d').putImageData(animationFrames[i], 0, 0);
    $('#animation').append(canvas);
  };
  // Add a class to the canvas elements
  $('canvas').addClass('frames');
  // Adjust the size of the animation div
  $('#animation').css({
    width: animationWidth,
    height: animationHeight
  });
}

// animate
//
//
function animate() {
  // Get the center of the element and the animation
  let one = getCenter('one');
  let animation = getCenter('animation');
  // Define the distance between the two centers
  let distance = Math.hypot(animation.x - one.x, animation.y - one.y);
  // Define the radius of the selectable
  let radius = distance / 2;
  // Define the steps
  let treshold = radius / NUM_FRAMES;

  $('body').append(`<svg height="1000" width="1500"><line id="line" x1='${one.x}' y1='${one.y}' x2='${animation.x}' y2='${animation.y}' style="stroke:rgb(255,0,0);stroke-width:3"/></svg>`);
  // Get the distance between the mouse and the element
  let d;
  // Check the distance whenever the mouse is moved
  window.addEventListener('mousemove', (event) => {
    // Get the distance with the hypotenuse
    d = Math.hypot(event.clientX - one.x, event.clientY - one.y);
    // Check the distance according to the tresholds
    for (let i = 0; i < NUM_FRAMES; i++) {
      if (d < treshold * (i + 1)) {
        console.log('visible' + i);
        break;
      } else if (d > treshold * NUM_FRAMES) {
        console.log('invisible');
      }
    }
  });
}

// getCenter
//
//
function getCenter(elementId) {
  let element = document.getElementById(elementId);
  let elementRect = element.getBoundingClientRect();
  let centerX = (elementRect.right + elementRect.left) / 2;
  let centerY = (elementRect.bottom + elementRect.top) / 2;
  return {
    x: centerX,
    y: centerY
  }
}