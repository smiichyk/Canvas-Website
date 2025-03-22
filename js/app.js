
// Variables for working with the canvas
let canvas = null // HTML <canvas> element
let ctx = null // 2D drawing context
let filters = {} // Object to store active filters

// Variables for slider div elements
let brightnessDiv
let grayscaleDiv
let sepiaDiv
let invertDiv

// Variables to store filter values (default settings)
let brightnessPercent = 100
let grayscalePercent = 0
let sepiaPercent = 0
let invertPercent = 0

// Create an image object and load the picture
let img = new Image()
img.src = "img/kitten.jpg"

// Run the onAllAssetsLoaded function after the page loads
window.onload = onAllAssetsLoaded

function onAllAssetsLoaded() {
  // Get the <canvas> element
  canvas = document.getElementById('ns_canvas')

  // Assign the drawing context (2D) to the canvas
  ctx = canvas.getContext('2d')

  // Set the canvas width and height to match the element's dimensions
  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientHeight

  // Initialize slider div references
  initializeSlidersDiv()

  // Render the initial image on the canvas
  renderCanvas()
}

function renderCanvas() {
  displayImage()
}

function brightness(percentage=brightnessPercent) {
  // Update brightness value
  brightnessPercent = percentage

  // Hide all sliders and show brightness slider
  slidersDisplayNone()
  brightnessDiv.style.display = 'flex'

  // Update the brightness slider UI
  document.getElementById("ns_brightness_slider").innerHTML = `
    <input type="range" min="10" max="250" value="${brightnessPercent}" onclick="brightness(this.value)">
    <p>${brightnessPercent}</p>`
  ctx.filter = `brightness(${brightnessPercent}%)`

  // Apply filter and update the canvas
  setFilter('brightness', brightnessPercent, '%')
}

function grayscale(percentage=grayscalePercent) {
  // Update grayscale value
  grayscalePercent = percentage

  // Hide all sliders and show grayscale slider
  slidersDisplayNone()
  grayscaleDiv.style.display = 'flex'

  // Update the grayscale slider UI
  document.getElementById("ns_grayscale_slider").innerHTML = `
    <input type="range" min="0" max="100" value="${grayscalePercent}" onclick="grayscale(this.value)">
    <p>${grayscalePercent}</p>`
  ctx.filter = `grayscale(${grayscalePercent}%)`

  // Apply filter and update the canvas
  setFilter('grayscale', grayscalePercent, '%')
}

function sepia(percentage=sepiaPercent) {
  // Update sepia value
  sepiaPercent = percentage

  // Hide all sliders and show sepia slider
  slidersDisplayNone()
  sepiaDiv.style.display = 'flex'

  // Update the sepia slider UI
  document.getElementById("ns_sepia_slider").innerHTML = `
    <input type="range" min="0" max="100" value="${sepiaPercent}" onclick="sepia(this.value)">
    <p>${sepiaPercent}</p>`
  ctx.filter = `sepia(${sepiaPercent}%)`

  // Apply filter and update the canvas
  setFilter('sepia', sepiaPercent, '%');
}

function invert(percentage=invertPercent) {
  // Update invert value
  invertPercent = percentage

  // Hide all sliders and show invert slider
  slidersDisplayNone()
  invertDiv.style.display = 'flex'

  // Update the invert slider UI
  document.getElementById("ns_invert_slider").innerHTML = `
    <input type="range" min="0" max="100" value="${invertPercent}" onclick="invert(this.value)">
    <p>${invertPercent}</p>`
  ctx.filter = `invert(${invertPercent}%)`

  // Apply filter and update the canvas
  setFilter('invert', invertPercent, '%');
}

function posterise() {

}

function threshold() {

}

function setFilter(type, value, unit) {
  // Store the filter in the object
  filters[type] = `${type}(${value}${unit})`

  // Apply all active filters
  updateFilters()
}

function updateFilters() {
  // Combine all filters
  ctx.filter = Object.values(filters).join(' ')

  // Redraw the image with filters
  displayImage()
}

function displayImage() {
  return ctx.drawImage(img, 100, 150)
}

function slidersDisplayNone() {
  brightnessDiv.style.display = "none"
  grayscaleDiv.style.display = "none"
  sepiaDiv.style.display = "none"
  invertDiv.style.display = "none"
}

function initializeSlidersDiv() {
  brightnessDiv = document.getElementById("ns_brightness_slider")
  grayscaleDiv = document.getElementById("ns_grayscale_slider")
  sepiaDiv = document.getElementById("ns_sepia_slider")
  invertDiv = document.getElementById("ns_invert_slider")
}
