
// Variables for working with the canvas
let canvas = null   // HTML <canvas> element
let ctx = null      // 2D drawing context
let filters = {}     // Object to store active filters

// Variables for slider div elements
let brightnessDiv, grayscaleDiv, sepiaDiv, invertDiv

// Variables for dragging
let imgPositionX = 0, imgPositionY = 0
let isDragging = false
let startX, startY

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

function setImagePosition() {
  // Center the image in the canvas
  imgPositionX= (canvas.width - img.width) / 2
  imgPositionY = (canvas.height - img.height) / 2
}

function limitImagePosition() {
  let margin = 0.4
  let marginX = canvas.width * margin
  let marginY = canvas.height * margin

  let minX = Math.min(-marginX, canvas.width - img.width + marginX)
  let maxX = Math.max(-marginX, canvas.width - img.width + marginX)
  let minY = Math.min(-marginY, canvas.height - img.height + marginY)
  let maxY = Math.max(-marginY, canvas.height - img.height + marginY)

  imgPositionX = Math.max(minX, Math.min(imgPositionX, maxX))
  imgPositionY = Math.max(minY, Math.min(imgPositionY, maxY))
}

function addEventListeners() {
  canvas.addEventListener("mousedown", startDragging)
  canvas.addEventListener("mousemove", dragImage)
  canvas.addEventListener("mouseup", stopDragging)
  canvas.addEventListener("mouseleave", stopDragging)
}

function startDragging(event) {
  isDragging = true
  startX = event.clientX - imgPositionX
  startY = event.clientY - imgPositionY
  canvas.style.cursor = "grabbing"
}

function dragImage(event) {
  // Move the image while dragging
  if (isDragging) {
    imgPositionX = event.clientX - startX
    imgPositionY = event.clientY - startY
    limitImagePosition()
    drawImage()
  }
}

function stopDragging() {
  isDragging = false
  canvas.style.cursor = "grab"
}
