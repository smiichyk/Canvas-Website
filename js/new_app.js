
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

function renderCanvas(image_number=currentImageIndex+1) {

  // Clear the main canvas before rendering
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (image_number!==0) {

    // Loop through each image in the images array
    images.map((image, index) => {

      console.log(image.src)
      if (image.src.src.includes("img/")) {

        if (index === image_number - 1) {

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

function mousedownHandler(e) {
  if (e.which === 1) { // left mouse button
    let canvasBoundingRectangle = canvas.getBoundingClientRect()
    mouseX = e.clientX - canvasBoundingRectangle.left
    mouseY = e.clientY - canvasBoundingRectangle.top

    for (let i = images.length - 1; i > -1; i--) {
      if (mouseIsInsideImage(images[i].x, images[i].y, images[i].width, images[i].height, mouseX, mouseY)) {
        offsetX = mouseX - images[i].x
        offsetY = mouseY - images[i].y
        renderCanvas()
        break
      }
    }
  }
}

function moveHandler(e) {
  let mouseX
  let mouseY
  if ((currentImageIndex !== null) && (e.which === 1)) { // left mouse button
    let canvasBoundingRectangle = canvas.getBoundingClientRect()
    mouseX = e.clientX - canvasBoundingRectangle.left
    mouseY = e.clientY - canvasBoundingRectangle.top

    images[currentImageIndex].x = mouseX - offsetX
    images[currentImageIndex].y = mouseY - offsetY
    renderCanvas()
  }
}

function mousewheelHandler(e) {
  if (currentImageIndex !== null) {
    let canvasBoundingRectangle = canvas.getBoundingClientRect()
    mouseX = e.clientX - canvasBoundingRectangle.left
    mouseY = e.clientY - canvasBoundingRectangle.top
    //  if (mouseIsInsideImage(imageX, imageY, imageWidth, imageHeight, mouseX, mouseY))
    {
      let oldCentreX = images[currentImageIndex].x + (images[currentImageIndex].width / 2)
      let oldCentreY = images[currentImageIndex].y + (images[currentImageIndex].height / 2)

      images[currentImageIndex].width += e.wheelDelta / 120
      images[currentImageIndex].height += e.wheelDelta / 120

      images[currentImageIndex].x = oldCentreX - (images[currentImageIndex].width / 2)
      images[currentImageIndex].y = oldCentreY - (images[currentImageIndex].height / 2)

      renderCanvas()
    }
  }
}

function mouseIsInsideImage(imageTopLeftX, imageTopLeftY, imageWidth, imageHeight, x, y) {
  if ((x > imageTopLeftX) && (y > imageTopLeftY)) {
    if (x > imageTopLeftX) {
      if ((x - imageTopLeftX) > imageWidth) {
        return false // to the right of the image
      }
    }

    if (y > imageTopLeftY) {
      if ((y - imageTopLeftY) > imageHeight) {
        return false // below the image
      }
    }
  } else {
    // above or to the left of the image
    return false
  }
  // inside image
  return true
}

function setRotationDegrees(value=rotation_value) {
  rotation_value = value
  images[currentImageIndex].rotation = parseInt(value)
  renderCanvas()
}

function setBrightness(value=brightness_value) {
  brightness = value
  images[currentImageIndex].brightness = parseInt(value)
  renderCanvas()
}

function toggleGreyscale(greyscaleIsSet=greyscale_value) {
  greyscale_value = greyscaleIsSet
  images[currentImageIndex].greyscale = greyscaleIsSet
  renderCanvas()
}

// Convert from degrees to radians.
Math.radians = function (degrees) {
  return degrees * Math.PI / 180
}


// ------

function displayBrightness() {
  brightnessDiv.style.display = "flex"
  brightnessDiv.innerHTML = `
  <label for="ns_brightness"></label>
  <input type="range" id="ns_brightness" value="${brightness_value}" min="-255" max="255" onChange="setBrightness(this.value)"/>`
}

function displayRotation() {
  rotationDiv.style.display = "flex"
  rotationDiv.innerHTML = `
  <label for="ns_rotation"></label>
  <input type="range" id="ns_rotation" value="${rotation_value}" min="-255" max="255" onChange="setRotationDegrees(this.value)"/>`
}

function displayGreyscale() {
  grayscaleDiv.style.display = "flex"
  grayscaleDiv.innerHTML = `
  <label for="ns_greyscale"></label>
      <label class="ns_switch">
        <input type="checkbox" id="ns_greyscale" onchange="toggleGreyscale(this.checked)">
        <span class="slider round"></span>
      </label>`
}

function addImageDisplay() {
  // Show the image input UI elements by setting their display to "flex"
  addImageDiv[0].style.display = "flex"
  addImageDiv[1].style.display = "flex"
}

function deleteImage(image_number) {

  let confirmed = confirm("Are you sure you want to delete this image?");
  if (!confirmed) return // Stop if user cancels

  if (image_number===1) {
    img1.src = ""
    console.log(img1.src)
    console.log(img2.src)
    console.log(img3.src)
    if(img2.src!==""){
      renderCanvas(2)
    }
    else if (img3.src!==""){
      renderCanvas(3)
    }
    else {
      renderCanvas(0)
    }
  }
  else if (image_number===2) {
    img2.src = ""
    console.log(img1.src)
    console.log(img2.src)
    console.log(img3.src)
    if(img1.src!==""){
      renderCanvas(1)
    }
    else if (img3.src!==""){
      renderCanvas(3)
    }
    else {
      renderCanvas(0)
    }
  }
  else if (image_number===3) {
    img3.src = ""
    console.log(img1.src)
    console.log(img2.src)
    console.log(img3.src)
    if(img1.src!==""){
      renderCanvas(1)
    }
    else if (img2.src!==""){
      renderCanvas(2)
    }
    else {
      renderCanvas(0)
    }
  }
  else {
    img1.src = ""
    img2.src = ""
    img3.src = ""
    renderCanvas(0)
  }

  // Render initial canvas content
  displayImageName()
  renderCanvas()
}

function displayImageName() {
  const images = [img1, img2, img3]
  let html = ""

  images.forEach((img, index) => {
    let i = index + 1

    let hasImage = img.src && img.src !== window.location.href && !img.src.startsWith("data:")
    let imageName = hasImage ? img.src.split('/').pop() : ""

    html += `
      <button class="ns_imageName" onclick="selectImage(${i})" ${!imageName ? 'style="display: none;"' : ''}>
        <p>${imageName}</p>
        <span onclick="event.stopPropagation(); deleteImage(${i})" class="ns_close_button" role="button">&times;</span>
      </button>`
  })

  document.getElementById('ns_imageNameList').innerHTML = html;
}

function selectImage(i) {
  currentImageIndex = i - 1
  renderCanvas(i)

  document.getElementById("ns_rotation").value = images[currentImageIndex].rotation
  document.getElementById("ns_brightness").value = images[currentImageIndex].brightness
  document.getElementById("ns_greyscale").checked = images[currentImageIndex].greyscale
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
