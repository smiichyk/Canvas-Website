
// Variables for slider div elements
let addImageDiv, rotationDiv, brightnessDiv, grayscaleDiv, sepiaDiv, invertDiv, textDiv, posteriseDiv, thresholdDiv,
  rgbHueDiv

// Canvas and drawing contexts
let canvas = null
let ctx = null
let offscreenCanvas = null
let offscreenCanvasCtx = null

// Call main function when all assets have loaded
window.onload = onAllAssetsLoaded

// Display a loading message while the page is loading
document.write("<div id='ns_loadingMessage'>Loading...</div>")

let imageData

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
  renderCanvas(currentImageIndex)

  // Add event listeners
  addEventListeners()
}

function renderCanvas(image_number = currentImageIndex) {

  // Clear the main canvas before rendering new content
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Only render the specified image if the image number is valid
  if (image_number !== -1) {

    // Loop through each image in the images array
    images.map((image, index) => {

      // Check if the image source is valid (contains "img/")
      if (image.src.src.includes("img/")) {

        // Ensure we're working with the correct image
        if (index === image_number) {

          // Clear the offscreen canvas before drawing each image
          offscreenCanvasCtx.clearRect(0, 0, canvas.width, canvas.height)

          // Draw the image onto the offscreen canvas at specified position and dimensions
          offscreenCanvasCtx.drawImage(image.src, image.x, image.y, image.width, image.height)

          // Apply various effects if they are enabled (adjustments for brightness, sepia, etc.)
          applyBrightness(image)
          applyRotation(image)
          applySepia(image)
          applyInvert(image)
          applyPosterise(image)
          applyThreshold(image)
          applyRGBHue(image)
          applyGreyscale(image)

          // Apply text transformations if any texts are added to the image
          if (image.texts) {
            image.texts.forEach(text => {
              // Set the font and text style for the current text
              offscreenCanvasCtx.font = `${text.bold ? 'bold ' : ''}${text.fontSize}px ${text.fontFamily}`
              offscreenCanvasCtx.fillStyle = text.colour

              // Apply the transformations (translation, rotation, scaling)
              offscreenCanvasCtx.save()
              offscreenCanvasCtx.translate(text.x, text.y)  // Set the origin to the text position
              offscreenCanvasCtx.rotate((text.rotation || 0) * Math.PI / 180) // Rotate the text if rotation is provided
              offscreenCanvasCtx.scale(text.scale || 1, text.scale || 1) // Scale the text if scale is provided

              // Draw the text at the transformed position (after rotation and scaling)
              offscreenCanvasCtx.fillText(text.text, 0, 0)

              // Restore the context to avoid affecting other drawing operations
              offscreenCanvasCtx.restore()
            })
          }

          // Draw the manipulated offscreen canvas onto the main display canvas
          ctx.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height)

          // Restore the canvas state to ensure that no transformations affect other elements
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
  else if (divName==="textDiv") {
    textDiv.style.display = "none"
  }
  else if (divName==="posteriseDiv") {
    posteriseDiv.style.display = "none"
  }
  else if (divName==="thresholdDiv") {
    thresholdDiv.style.display = "none"
  }
  else if (divName==="rgbHueDiv") {
    rgbHueDiv.style.display = "none"
  }

  // If no specific match, hide all sliders
  else {
    brightnessDiv.style.display = "none"
    rotationDiv.style.display = "none"
    grayscaleDiv.style.display = "none"
    sepiaDiv.style.display = "none"
    invertDiv.style.display = "none"
    textDiv.style.display = "none"
    posteriseDiv.style.display = "none"
    thresholdDiv.style.display = "none"
    rgbHueDiv.style.display = "none"
  }

  document.getElementById("ns_rgb_icon").style.padding = "15px"
  document.getElementById("ns_text_icon").style.padding = "15px"
}

function updateSliders(index = currentImageIndex) {

  // Helper function to set a slider's value if the element exists
  let setSliderValue = (id, value) => {
    let element = document.getElementById(id)
    if (element) { element.value = value }
  }

  // Update each individual slider with the corresponding image filter value
  setSliderValue("ns_rotation", images[index].rotation)
  setSliderValue("ns_brightness", images[index].brightness)
  setSliderValue("ns_greyscale", images[index].greyscale)
  setSliderValue("ns_sepia", images[index].sepia)
  setSliderValue("ns_invert", images[index].invert)
  setSliderValue("ns_posterise", images[index].posterise)
  setSliderValue("ns_threshold", images[index].threshold)
  setSliderValue("ns_redHue", images[index].redHue)
  setSliderValue("ns_greenHue", images[index].greenHue)
  setSliderValue("ns_blueHue", images[index].blueHue)
}

function initializeDiv() {
  addImageDiv = document.getElementsByClassName("ns_addImage")
  brightnessDiv = document.getElementById("ns_brightnessSlider")
  rotationDiv = document.getElementById("ns_rotationSlider")
  grayscaleDiv = document.getElementById("ns_grayscaleSlider")
  sepiaDiv = document.getElementById("ns_sepiaSlider")
  invertDiv = document.getElementById("ns_invertSlider")
  textDiv = document.getElementById("ns_textControls")
  posteriseDiv = document.getElementById("ns_posteriseSlider")
  thresholdDiv = document.getElementById("ns_thresholdSlider")
  rgbHueDiv = document.getElementById("ns_rgbHueSlider")
}
