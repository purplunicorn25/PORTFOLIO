"use strict";

/********************************************************************

Portfolio: Home Page
Anne Boutet
(✿◠‿◠)

The Home page of my Portfolio.

*********************************************************************/

// Constants
let CHECK_INTERVAL = 1;
let NUM_FRAMES = 20;
let NUMBER_PAGES = 10;
let DISTANCE_PROPORTION = 2;
let FRAMES_WIDTH = 720;
let FRAMES_LENGTH = 1200;
let FRAMES_RATIO = FRAMES_WIDTH / FRAMES_LENGTH;

// Arrays
let romanDigits = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

// When the document is loaded call setup
$(document).ready(preload);

// Variables
let animationFrames = [];
let canvas;
let animationFramesLoaded = false;

// preload
//
// Downlaod the images before calling setup
function preload() {
  // Store frames in an Arrays
  framesLoad();
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

// framesLoad
//
// Preload the frames
function framesLoad() {
  // Upload the frames from local file
  for (let i = 0; i < NUM_FRAMES; i++) {
    let frame = (`<img class="frames" src="assets/images/video_frames/Alpha_Eclipse_0${i}.jpg">`);
    animationFrames.push(frame);
    // Since there is a delay, check when its loaded
    if (animationFrames.length === NUM_FRAMES) {
      animationFramesLoaded = true;
    }
  }
}

// setup
//
// Display the images and numbers and animate everything
function setup() {
  // Set up the div for the images
  canvasSetup();
  // Display the frames as a pile
  animationDisplay();
  // Create the number elements
  createNumbers();
  // Animate for all the number elements
  // for (let i = 0; i < NUMBER_PAGES; i++) {
  //   animate(`number${i}`);
  // }
}

// canvasSetup
//
// Create the canvas so it is ready to receive the images
function canvasSetup() {
  // Create a div that fills the windows height
  $('body').append(`<div id='canvas'></div>`);
  $('#canvas').css('height', '100%');
  // Determine the width of the div according to the ratio of its content size
  // Get the height
  let canvas = getRect('canvas');
  $('#canvas').css('width', `${canvas.h * FRAMES_RATIO}`);
  // Place in the middle of the window
  // Get the width
  canvas = getRect('canvas');
  $('#canvas').css('left', `${(($(window).width() - canvas.w) / 2)}px`);
}

// animationDisplay
//
// Display the image from the animationFrames array from bottom to top
function animationDisplay() {
  for (let i = animationFrames.length; i > 0; i--) {
    $('#canvas').append(animationFrames[i]);
  }
}

// createNumbers
//
// Create the numbers element to redirect pages
function createNumbers() {
  for (let i = 0; i < NUMBER_PAGES / 2; i++) {
    $('body').append(`<div class='number right' id='number${i}'>${romanDigits[i]}</div>`);
    $(`#number${i}`).css('top', `${100 / (NUMBER_PAGES/ 2 + 2) * (i + 1)}%`);
  }
  for (let i = 0; i < NUMBER_PAGES / 2; i++) {
    $('body').append(`<div class='number left' id='number${i + NUMBER_PAGES /2}'>${romanDigits[i + NUMBER_PAGES/2]}</div>`);
    $(`#number${i + NUMBER_PAGES / 2}`).css('top', `${100 / (NUMBER_PAGES/ 2 + 2) * (i + 1)}%`);
  }
}

// getCenter
//
// Get the center coordinates of an element
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

// getRect
//
// Get the width and height of an element
function getRect(elementId) {
  let element = document.getElementById(elementId);
  let elementRect = element.getBoundingClientRect();
  return {
    w: elementRect.width,
    h: elementRect.height
  }
}