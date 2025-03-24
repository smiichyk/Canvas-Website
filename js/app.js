
// Variables for working with the canvas
let canvas = null   // HTML <canvas> element
let ctx = null      // 2D drawing context
let filters = {}     // Object to store active filters

// Variables for slider div elements
let brightnessDiv, grayscaleDiv, sepiaDiv, invertDiv

// Variables to store filter values (default settings)
let brightnessPercent = 100
let grayscalePercent = 0
let sepiaPercent = 0
let invertPercent = 0

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

function brightness(percentage=brightnessPercent) {
  // Update brightness value
  brightnessPercent = percentage

  // Show brightness slider
  brightnessDiv.style.display = 'flex'

  // Update the brightness slider UI
  document.getElementById("ns_brightnessSlider").innerHTML = `
    <img onclick="brightness(brightnessPercent-1)" src="img/buttons/add_minus/minus.png" height="5" width="5"/>
    <input type="range" min="10" max="250" value="${brightnessPercent}" onclick="brightness(parseInt(this.value))">
    <p>${brightnessPercent-100}</p>
    <img onclick="brightness(brightnessPercent+1)" src="img/buttons/add_minus/plus.png" height="5" width="5"/>
    <img onclick="brightness(100)" src="img/buttons/add_minus/default.png" height="4" width="4"/>
    <img onclick="event.stopPropagation(); slidersDisplayNone('brightnessDiv')" src="img/buttons/add_minus/hide.png" class="ns_hideButton"/>`
  ctx.filter = `brightness(${brightnessPercent}%)`

  // Apply filter and update the canvas
  setFilter('brightness', brightnessPercent, '%')
}

function grayscale(percentage=grayscalePercent) {
  // Update grayscale value
  grayscalePercent = percentage

  // Show grayscale slider
  grayscaleDiv.style.display = 'flex'

  // Update the grayscale slider UI
  document.getElementById("ns_grayscaleSlider").innerHTML = `
    <img onclick="grayscale(grayscalePercent-1)" src="img/buttons/add_minus/minus.png" height="5" width="5"/>
    <input type="range" min="0" max="100" value="${grayscalePercent}" onclick="grayscale(parseInt(this.value))">
    <p>${grayscalePercent}</p>
    <img onclick="grayscale(grayscalePercent+1)" src="img/buttons/add_minus/plus.png" height="5" width="5"/>
    <img onclick="grayscale(0)" src="img/buttons/add_minus/default.png" height="4" width="4"/>
    <img onclick="event.stopPropagation(); slidersDisplayNone('grayscaleDiv')" src="img/buttons/add_minus/hide.png" class="ns_hideButton"/>`
  ctx.filter = `grayscale(${grayscalePercent}%)`

  // Apply filter and update the canvas
  setFilter('grayscale', grayscalePercent, '%')
}

function sepia(percentage=sepiaPercent) {
  // Update sepia value
  sepiaPercent = percentage

  // Show sepia slider
  sepiaDiv.style.display = 'flex'

  // Update the sepia slider UI
  document.getElementById("ns_sepiaSlider").innerHTML = `
    <img onclick="sepia(sepiaPercent-1)" src="img/buttons/add_minus/minus.png" height="5" width="5"/>
    <input type="range" min="0" max="100" value="${sepiaPercent}" onclick="sepia(parseInt(this.value))">
    <p>${sepiaPercent}</p>
    <img onclick="sepia(sepiaPercent+1)" src="img/buttons/add_minus/plus.png" height="5" width="5"/>
    <img onclick="sepia(0)" src="img/buttons/add_minus/default.png" height="4" width="4"/>
    <img onclick="event.stopPropagation(); slidersDisplayNone('sepiaDiv')" src="img/buttons/add_minus/hide.png" class="ns_hideButton"/>`
  ctx.filter = `sepia(${sepiaPercent}%)`

  // Apply filter and update the canvas
  setFilter('sepia', sepiaPercent, '%');
}

function invert(percentage=invertPercent) {
  // Update invert value
  invertPercent = percentage

  // Show invert slider
  invertDiv.style.display = 'flex'

  // Update the invert slider UI
  document.getElementById("ns_invertSlider").innerHTML = `
    <img onclick="invert(invertPercent-1)" src="img/buttons/add_minus/minus.png" height="5" width="5"/>
    <input type="range" min="0" max="100" value="${invertPercent}" onclick="invert(parseInt(this.value))">
    <p>${invertPercent}</p>
    <img onclick="invert(invertPercent+1)" src="img/buttons/add_minus/plus.png" height="5" width="5"/>
    <img onclick="invert(0)" src="img/buttons/add_minus/default.png" height="4" width="4"/>
    <img onclick="event.stopPropagation(); slidersDisplayNone('invertDiv')" src="img/buttons/add_minus/hide.png" class="ns_hideButton"/>`
  ctx.filter = `invert(${invertPercent}%)`

  // Apply filter and update the canvas
  setFilter('invert', invertPercent, '%');
}

function setFilter(type, value, unit) {
  // Store the filter in the object
  filters[type] = `${type}(${value}${unit})`

  // Draw image with all active filters
  drawImage()
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
