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
    let canvas = document.createElement('canvas');
    canvas.width = animationWidth;
    canvas.height = animationHeight;
    canvas.getContext('2d').putImageData(animationFrames[i], 0, 0);
    $('#animation').append(canvas);
  };
  // Add a class to the canvas elements
  $('canvas').addClass('frames');
  // Adjust the size of the animation div
  $('#animation').css({
    width: animationWidth,
    height: animationHeight
  })
}