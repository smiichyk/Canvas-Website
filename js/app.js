
// Variables for working with the canvas
let canvas = null   // HTML <canvas> element
let ctx = null      // 2D drawing context
let filters = {}     // Object to store active filters

// Variables for slider div elements
let brightnessDiv, grayscaleDiv, sepiaDiv, invertDiv

// Create an image object and load the picture
let img = new Image()

// Run the onAllAssetsLoaded function after the page loads
window.onload = onAllAssetsLoaded

function onAllAssetsLoaded() {
  // Get the <canvas> element and assign the drawing context (2D)
  canvas = document.getElementById('ns_canvas')
  ctx = canvas.getContext('2d')

  // Set the canvas width and height to match the element's dimensions
  setCanvasWidthAndHeight()

  // Initialize slider div references
  initializeSlidersDiv()

  // Handle image loading
  img.onload = () => {
    setImagePosition()
    drawImage()
  }

  // Set image source
  img.src = "img/kitten.jpg";

  // Add event listeners for dragging
  addEventListeners()
}

function drawImage() {
  // Clear the canvas before redrawing and save the current canvas state
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.save()

  // Apply transformations
  ctx.setTransform(1, 0, 0, 1, imgPositionX, imgPositionY)

  // Apply active filters
  ctx.filter = Object.values(filters).join(' ')

  // Draw the image at its current position
  ctx.drawImage(img, 0, 0)

  // Restore the previous canvas state
  ctx.restore()
}

function setFilter(type, value, unit) {
  // Store the filter in the object
  filters[type] = `${type}(${value}${unit})`

  // Draw image with all active filters
  drawImage()
}

function allSlidersToDefault() {
  brightness(100)
  grayscale(0)
  sepia(0)
  invert(0)
}

function slidersDisplayNone(divName) {
  if (divName==="brightnessDiv") {
    brightnessDiv.style.display = "none"
  } else if (divName==="grayscaleDiv") {
    grayscaleDiv.style.display = "none"
  } else if (divName==="sepiaDiv") {
    sepiaDiv.style.display = "none"
  } else if (divName==="invertDiv") {
    invertDiv.style.display = "none"
  } else {
    brightnessDiv.style.display = "none"
    grayscaleDiv.style.display = "none"
    sepiaDiv.style.display = "none"
    invertDiv.style.display = "none"
  }
}

function initializeSlidersDiv() {
  brightnessDiv = document.getElementById("ns_brightnessSlider")
  grayscaleDiv = document.getElementById("ns_grayscaleSlider")
  sepiaDiv = document.getElementById("ns_sepiaSlider")
  invertDiv = document.getElementById("ns_invertSlider")
}

function setCanvasWidthAndHeight() {
  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientHeight
}
