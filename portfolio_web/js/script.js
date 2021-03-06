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
let DISTANCE_PROPORTION = 1.5;
let FRAMES_WIDTH = 720;
let FRAMES_LENGTH = 1200;
let FRAMES_RATIO = FRAMES_WIDTH / FRAMES_LENGTH;

// Arrays
let romanDigits = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

// When the document is loaded call setup
$(document).ready(preload);

// Variables
let animationFrames = [];
let canvas;
let animationFramesLoaded = false;

let numCenter = [];
let dMeasures = [];
let closest;

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
    let frame = (`<img class="frames" id='frame${i}' src="assets/images/video_frames/Alpha_Eclipse_0${i}.jpg">`);
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
  framesDisplay();
  // Create the number elements
  createNumbers();
  // Animate for all the number elements
  window.addEventListener('mousemove', (event) => {
    distance();
    console.log(closest);
  });
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

// framesDisplay
//
// Display the image from the animationFrames array from bottom to top
function framesDisplay() {
  for (let i = animationFrames.length; i > -1; i--) {
    $('#canvas').append(animationFrames[i]);
  }
}

// createNumbers
//
// Create the numbers element to redirect pages
function createNumbers() {
  // Create the first half
  for (let i = 0; i < NUMBER_PAGES / 2; i++) {
    $('body').append(`<div class='number right' id='number${i}'>${romanDigits[i]}</div>`);
    $(`#number${i}`).css('top', `${120 / (NUMBER_PAGES/ 2 + 2) * (i + .3)}%`);
  }
  // Create the second half
  for (let i = 0; i < NUMBER_PAGES / 2; i++) {
    $('body').append(`<div class='number left' id='number${i + NUMBER_PAGES /2}'>${romanDigits[i + NUMBER_PAGES/2]}</div>`);
    $(`#number${i + NUMBER_PAGES / 2}`).css('top', `${120 / (NUMBER_PAGES/ 2 + 2) * (i + .3)}%`);
  }
  // Store all their centers x and y in an array
  for (let i = 0; i < NUMBER_PAGES; i++) {
    let number = getCenter(`number${i}`);
    numCenter.push(number);
  }
}

// animate
//
// Display a frame according to its distance with an element
function animate() {
  // Get the center of the element and the animation
  let number = getCenter(id);
  let animation = getCenter('canvas');
  // Define the distance between the two centers
  let distance = Math.hypot(animation.x - number.x, animation.y - number.y);
  // Define the radius of the selectable
  let radius = distance / DISTANCE_PROPORTION;
  // Define the steps
  let threshold = radius / NUM_FRAMES;

  // Get the distance between the mouse and the element
  let d;
  console.log(number);
  // Check the distance whenever the mouse is moved
  window.addEventListener('mousemove', (event) => {
    // Get the distance with the hypotenuse
    d = Math.hypot(event.clientX - number.x, event.clientY - number.y);
    // Check the distance according to the thresholds
    for (let i = 0; i < NUM_FRAMES; i++) {
      if (d < threshold * (i + 1)) {
        // Hide all frames and display only the active one
        $('.frames').css('visibility', 'hidden');
        $(`#frame${NUM_FRAMES - 1 - i}`).css('visibility', 'visible');
        // Break, so the loop work only for the smallest possible threshold
        console.log('inzone');
        break;
      } else if (d > threshold * NUM_FRAMES) {
        // Display the first frame if no threshold
        $('#frame0').css('visibility', 'visible');
        console.log('out of zone');
      }
    }
  });
}

//
//
//
function distance() {
  for (let i = 0; i < NUMBER_PAGES; i++) {
    let d = Math.hypot(event.clientX - numCenter[i].x, event.clientY - numCenter[i].y);
    dMeasures.push(d);
  }
  let smallestValue = Math.min.apply(Math, dMeasures);
  closest = dMeasures.indexOf(smallestValue);
  dMeasures = [];
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
    h: elementRect.height,
  }
}