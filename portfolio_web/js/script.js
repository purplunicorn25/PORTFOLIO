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
  display();
}

/*****************************/
function display() {
  animationFrames.forEach(function(frame) {
    var canvas = document.createElement('canvas');
    canvas.width = frame.width;
    canvas.height = frame.height;
    canvas.getContext('2d').putImageData(frame, 0, 0);
    document.getElementsByTagName('body')[0].appendChild(canvas);
  });
}