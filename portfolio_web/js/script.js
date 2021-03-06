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
  console.log(animationFrames);
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
    let frame = (`assets/images/video_frames/Alpha_Eclipse_0${i}`);
    animationFrames.push(frame);
    // Since there is a delay with this library, check when its loaded
    if (animationFrames.length === NUM_FRAMES) {
      animationFramesLoaded = true;
    }
  }
}

// setup
//
// Display the images and numbers and animate everything
function setup() {
  // Display the result of the video-to-frame
  // animationDisplay();
  // Create the number elements
  createNumbers();
  // Animate for all the number elements
  for (let i = 0; i < NUMBER_PAGES; i++) {
    animate(`number${i}`);
  }
}

// animationDisplay
//
// Display the image from the animationFrames array from bottom to top
function animationDisplay() {
  // Define the width according to the first frame (same size for all)
  // let animationWidth = animationFrames[0].width;
  // let animationHeight = animationFrames[0].height;
  // for (let i = 0; i < frames.length; i++) {
  //   frames[i].height = 200;
  let animationWidth = $(window).width();
  let animationHeight = animationFrames[0].height;
  // Create canvases to append the images to the animation div
  // for (let i = animationFrames.length - 1; i >= 0; i--)
  for (let i = 0; i < animationFrames.length; i++) {
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

// animate
//
// Display a frame according to its distance with an element
function animate(id) {
  // Get the center of the element and the animation
  let number = getCenter(id);
  let animation = getCenter('animation');
  // Define the distance between the two centers
  let distance = Math.hypot(animation.x - number.x, animation.y - number.y);
  // Define the radius of the selectable
  let radius = distance / DISTANCE_PROPORTION;
  // Define the steps
  let threshold = radius / NUM_FRAMES;

  // Get the distance between the mouse and the element
  let d;
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