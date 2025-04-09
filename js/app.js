
// Variables for slider div elements
let addImageDiv, rotationDiv, brightnessDiv, grayscaleDiv, sepiaDiv, invertDiv, textDiv

// Canvas and drawing contexts
let canvas = null
let ctx = null
let offscreenCanvas = null
let offscreenCanvasCtx = null

// Image effect values
let rotation_value = 0
let greyscale_value = false
let brightness_value = 0

// Load images to be displayed on the canvas
let img1 = new Image(); img1.src = "img/kitten.jpg"
let img2 = new Image(); img2.src = "img/kitten1.jpg"
let img3 = new Image(); img3.src = "img/kitten2.jpg"

// Array to hold image objects with their properties
let images = [
  {src: img1, x: 100, y: 100, width: img1.naturalWidth, height: img1.naturalHeight,
    rotation: rotation_value, greyscale: greyscale_value, brightness: brightness_value},
  {src: img2, x: 100, y: 100, width: img2.naturalWidth, height: img2.naturalHeight,
    rotation: rotation_value, greyscale: greyscale_value, brightness: brightness_value},
  {src: img3, x: 100, y: 100, width: img2.naturalWidth, height: img3.naturalHeight,
    rotation: rotation_value, greyscale: greyscale_value, brightness: brightness_value}]

// Index of the currently selected image for manipulation
let currentImageIndex = 0

// Variables to track drag offset
let offsetX = 0
let offsetY = 0

// Call main function when all assets have loaded
window.onload = onAllAssetsLoaded

// Display a loading message while the page is loading
document.write("<div id='ns_loadingMessage'>Loading...</div>")

function onAllAssetsLoaded() {

  // Hide the webpage loading message after everything is loaded
  document.getElementById('ns_loadingMessage').style.visibility = "hidden"

  // Get the main canvas and its drawing context
  canvas = document.getElementById("ns_canvas")
  ctx = canvas.getContext("2d")
  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientHeight

  // Create an offscreen canvas for offscreen rendering
  offscreenCanvas = document.createElement('canvas');
  offscreenCanvasCtx = offscreenCanvas.getContext('2d');
  offscreenCanvas.width = canvas.clientWidth
  offscreenCanvas.height = canvas.clientHeight

  // Initialize references to slider div elements
  initializeDiv()

  // Display the currently selected image's name on the UI
  displayImageName()

  // Render initial canvas content
  renderCanvas()

  // Add event listeners
  addEventListeners()
}

function renderCanvas(image_number=currentImageIndex) {

  // Clear the main canvas before rendering
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (image_number!==-1) {

    // Loop through each image in the images array
    images.map((image, index) => {

      if (image.src.src.includes("img/")) {

        if (index === image_number) {

          // Clear the offscreen canvas before drawing each image
          offscreenCanvasCtx.clearRect(0, 0, canvas.width, canvas.height)

          // Draw the image onto the offscreen canvas
          offscreenCanvasCtx.drawImage(image.src, image.x, image.y, image.width, image.height)
          let imageData


          // === Apply grayscale effect if enabled ===
          if (image.greyscale) {

            // Get pixel data from the image area
            imageData = offscreenCanvasCtx.getImageData(image.x, image.y, image.width, image.height)
            for (let i = 0; i < imageData.data.length; i += 4) {
              let grayscale = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3

              // Calculate the average to apply grayscale
              imageData.data[i] = grayscale
              imageData.data[i + 1] = grayscale
              imageData.data[i + 2] = grayscale
              imageData.data[i + 3] = 255
            }

            // Put the modified pixels back onto the offscreen canvas
            offscreenCanvasCtx.putImageData(imageData, image.x, image.y)
          }


          // === Apply brightness adjustment ===
          imageData = offscreenCanvasCtx.getImageData(image.x, image.y, image.width, image.height)
          for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] = imageData.data[i] + image.brightness             // Red
            imageData.data[i + 1] = imageData.data[i + 1] + image.brightness     // Green
            imageData.data[i + 2] = imageData.data[i + 2] + image.brightness     // Blue
            imageData.data[i + 3] = 255                                          // Alpha
          }
          // Update the image data after brightness adjustment
          offscreenCanvasCtx.putImageData(imageData, image.x, image.y)


          // === Rotate and draw image onto the main canvas ===
          ctx.save()  // Save current state before applying transformations
          // Move the origin to the image's center for rotation
          ctx.translate((image.x + image.width / 2), (image.y + image.height / 2))
          // Rotate the canvas based on the image's rotation value (must convert degrees to radians)
          ctx.rotate(Math.radians(image.rotation))
          // Move origin back
          ctx.translate(-(image.x + image.width / 2), -(image.y + image.height / 2))


          // Draw the manipulated offscreen image onto the display canvas
          ctx.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height)

          // Restore canvas to original state
          ctx.restore()
        }
      }
    })
  }
}

Math.radians = function (degrees) {
  // Convert from degrees to radians.
  return degrees * Math.PI / 180
}

function initializeDiv() {
  addImageDiv = document.getElementsByClassName("ns_addImage")
  brightnessDiv = document.getElementById("ns_brightnessSlider")
  rotationDiv = document.getElementById("ns_rotationSlider")
  grayscaleDiv = document.getElementById("ns_grayscaleSlider")
  sepiaDiv = document.getElementById("ns_sepiaSlider")
  invertDiv = document.getElementById("ns_invertSlider")
  textDiv = document.getElementById("ns_textSlider")
}

function addEventListeners() {

  // Add mouse down event listener to start dragging or selecting an image
  canvas.addEventListener('mousedown', mousedownHandler)

  // Add mouse move event listener to update image position while dragging
  canvas.addEventListener('mousemove', moveHandler)

  // Add mouse wheel event listener for zoom or other interactions
  canvas.addEventListener('wheel', mousewheelHandler)

  // Prevent default page zooming or scrolling with the mouse wheel
  document.addEventListener(
    'wheel',
    function(e) {e.preventDefault(); },
    { passive: false });
}

function slidersDisplayNone(divName) {
  // Hide specific slider UI element based on provided div name
  if (divName==="brightnessDiv") {
    brightnessDiv.style.display = "none"
  }
  else if (divName==="rotationDiv") {
    rotationDiv.style.display = "none"
  }
  else if (divName==="grayscaleDiv") {
    grayscaleDiv.style.display = "none"
  }
  else if (divName==="sepiaDiv") {
    sepiaDiv.style.display = "none"
  }
  else if (divName==="invertDiv") {
    invertDiv.style.display = "none"
  }

  // If no specific match, hide all sliders
  else {
    brightnessDiv.style.display = "none"
    rotationDiv.style.display = "none"
    grayscaleDiv.style.display = "none"
    sepiaDiv.style.display = "none"
    invertDiv.style.display = "none"
  }
}
