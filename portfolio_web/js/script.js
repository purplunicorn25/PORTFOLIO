"use strict";

/********************************************************************

Portfolio: Home Page
Anne Boutet
(✿◠‿◠)

The Home page of my Portfolio.

This program tracks the mouse movement and animates a serie of images as
a frame-by-frame video. The images represent an eclipse and the titles
of the projects are displayed on hover, meaning and the eclipse is total.

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
let romanDigits = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
let mountainLeftColors = ['#9c2a12', '#9c2a12', '#94291f', '#8b2733', '#852540', '#7e234c', '#7f2354', '#7a2358', '#76225e', '#742262', '#712166', '#71206c', '#6f2071', '#6e2171', '#6a1f72', '#6a2079', '#6a2079', '#6a2079', '#691f7e', '#662080', '#662083'];
let mountainRightColors = ['#450a06', '#440a19', '#410a27', '#420a2f', '#420936', '#3e0a3b', '#400a44', '#3e0a48', '#3e0a48', '#3e0a4c', '#3d0951', '#3e0b56', '#3d095b', '#3d095b', '#3e0a5d', '#3b0a63', '#3b0a66', '#3b0a63', '#3c0a6d', '#3a0a70', '#3a0a78'];

// When the document is loaded call setup
$(document).ready(preload);

// Variables
let projects = [];
let jsonLoaded = false;
let animationFramesLoaded = false;

let canvas;
let animationFrames = [];

let numCenter = [];
let hypotenus = [];
let mouseHypo = [];
let closest;
let threshold;
let currentFrame;

// preload
//
// DGet JSON; Download the images before calling setup
function preload() {
  loadJSON();
  // Store frames in an Arrays
  framesLoad();
  // Check if they are loaded
  let loading = setInterval(() => {
    if (animationFramesLoaded === true && jsonLoaded === true) {
      // Call setup
      setup();
      // Clear the interval
      clearInterval(loading);
    }
  }, CHECK_INTERVAL)
}

// loadJSON
//
// Get data from JSON file, show error if fail, store data in global array if done
function loadJSON() {
  // Get the data from the JSON file
  $.getJSON("data/projects_data.json")
    .fail((request, textStatus, error) => {
      // Display the error in the console
      console.error(error);
    })
    .done((data) => {
      // Store the projects in an array
      projects = data.projects;
      // update boolean
      jsonLoaded = true;
    });
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

  // Display the page's title once the canvas is made
  pageTitle();
}

// pageTitle
//
// Append titles and change their colors according to the bottom mountains
function pageTitle() {
  // get the location of the canvas
  let canvasRect = getRect('canvas');
  // create the titles and place beside canvas
  // portfolio
  $('body').append("<h1 id='portfolio'>PORTFOLIO</h1>");
  let portfolioRect = getRect('portfolio');
  $('#portfolio').css({
    'left': `${canvasRect.r - 3.5}px`,
    'bottom': `-${portfolioRect.h / 4.5}px`,
    'color': `${mountainRightColors[0]}`
  });
  // name
  $('body').append("<h1 id='name'>A.BOUTET</h1>");
  let nameRect = getRect('name');
  $('#name').css({
    'left': `${canvasRect.l - nameRect.w}px`,
    'bottom': `-${nameRect.h /4.5}px`,
    'color': `${mountainLeftColors[0]}`
  });
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
  // Measure the hypotenus between the center of each number and the frames
  for (let i = 0; i < NUMBER_PAGES; i++) {
    // Center
    let number = getCenter(`number${i}`);
    numCenter.push(number);
    // Hypotenus
    let canvas = getCenter('canvas');
    let hypo = Math.hypot(canvas.x - numCenter[i].x, canvas.y - numCenter[i].y);
    hypotenus.push(hypo);
  }
  // Append the project title according to the numbersRect
  createProjects();
}

// createProjects
//
// Append the titles of the projects according to the numbers rect
function createProjects() {
  let indent = 10;
  // for numbers on the right
  for (let i = 0; i < NUMBER_PAGES / 2; i++) {
    let numberRect = getRect(`number${i}`);
    let numberCenter = getCenter(`number${i}`);
    // console.log(numberRect.r);
    $('body').append(`<h2 id='project${i}'><span class='type'>${projects[i].type}</span><br>${projects[i].name}</h2>`);
    let projectNameRect = getRect(`project${i}`);
    $(`#project${i}`).css({
      'left': `${numberRect.r + indent}px`,
      'top': `${numberCenter.y - (projectNameRect.h /2)}px`,
      'color': 'blue'
    });
  }
  // for numbers on the left
  for (let i = NUMBER_PAGES / 2; i < NUMBER_PAGES; i++) {
    let numberRect = getRect(`number${i}`);
    let numberCenter = getCenter(`number${i}`);
    $('body').append(`<h2 id='project${i}'><span class='type'>${projects[i].type}</span><br>${projects[i].name}</h2>`);
    let projectNameRect = getRect(`project${i}`);
    console.log(numberRect.r + indent);
    $(`#project${i}`).css({
      'left': `${numberRect.l - projectNameRect.w - (indent * 2)}px`,
      'top': `${numberCenter.y - (projectNameRect.h /2)}px`,
      'color': 'blue',
      'text-align': 'right'
    });
  }
}

//
//
//
function displayProject(active) {

}

// framesDisplay
//
// Display the image from the animationFrames array from bottom to top
function framesDisplay() {
  for (let i = animationFrames.length; i > -1; i--) {
    $('#canvas').append(animationFrames[i]);
  }
  $('#frame0').css('visibility', 'visible');
}

// titleColor
//
// Change the color of the title based on the current frame
function titleColor(activeFrame) {
  $('#name').css('color', `${mountainLeftColors[activeFrame]}`);
  $('#portfolio').css('color', `${mountainRightColors[activeFrame]}`);
}

// titleFade
//
// Deal with the class change for fadeIn
function titleFade(z) {
  if (z === 'In') {
    $('#name').removeClass('m-fadeOut');
    $('#portfolio').removeClass('m-fadeOut');
    $('#name').addClass('m-fadeIn');
    $('#portfolio').addClass('m-fadeIn');
  }
  if (z === 'Out') {
    $('#name').removeClass('m-fadeIn');
    $('#portfolio').removeClass('m-fadeIn');
    $('#name').addClass('m-fadeOut');
    $('#portfolio').addClass('m-fadeOut');
  }
}

// distance
//
// Measure the distance between the mouse and numbers at every movement, store in arrays
function distance() {
  // Store the live distance of each number with the mouse position in an array
  for (let i = 0; i < NUMBER_PAGES; i++) {
    let d = Math.hypot(event.clientX - numCenter[i].x, event.clientY - numCenter[i].y);
    mouseHypo.push(d);
  }
  // Calculate the smallest value at every movement and display the according frame
  let smallestValue = Math.min.apply(Math, mouseHypo);
  closest = mouseHypo.indexOf(smallestValue);
  animate();
  // Change the background accordingly too
  numHover();
  // Empty every time the mouse moves again to get the updated value at the right index
  mouseHypo = [];
}

// animate
//
// Display a frame according to its distance with an element
function animate() {
  // Define the radius of the closest number
  let radius = hypotenus[closest] / DISTANCE_PROPORTION;
  // Define the steps
  threshold = radius / NUM_FRAMES;
  // Check the distance according to the thresholds
  for (let i = 0; i < NUM_FRAMES; i++) {
    if (mouseHypo[closest] < threshold * (i + 1)) {
      // Hide all frames and display only the active one
      $('.frames').css('visibility', 'hidden');
      $(`#frame${NUM_FRAMES - 1 - i}`).css('visibility', 'visible');
      // Change the color of the title based on the current frame (i)
      currentFrame = NUM_FRAMES - i;
      titleColor(currentFrame);
      // Break, so the loop work only for the smallest possible threshold
      break;
    } else if (mouseHypo[closest] > threshold * NUM_FRAMES) {
      // Display the first frame if no threshold
      $('#frame0').css('visibility', 'visible');
    }
  }
}

// numHover
//
// Deal with interaction of mouse with numbers to update colors and visibility of elements
function numHover() {
  $('.number').on('mouseenter', () => {
    // Turn all the background and numbers black (use colors not visibility cuz hover on others still ok)
    $('body').css('backgroundColor', 'black');
    $('.number').css('color', 'black');
    // Keep the overed element visible and display its related title
    $(event.currentTarget).css('color', '#d2e000');
    // displayTitle(event.currentTarget);
    // Hide the titles
    titleFade('Out');
  });
  $('.number').on('mouseleave', () => {
    // Restaure the original color
    $('body').css('backgroundColor', 'white');
    $('.number').css('color', '#dbb742');
    // Show the titles
    titleFade('In');
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

// getRect
//
// Get the width and height of an element
function getRect(elementId) {
  let element = document.getElementById(elementId);
  let elementRect = element.getBoundingClientRect();
  // console.log(elementRect);
  return {
    w: elementRect.width,
    h: elementRect.height,
    l: elementRect.left,
    r: elementRect.right,
    b: elementRect.bottom,
    t: elementRect.top
  }
}