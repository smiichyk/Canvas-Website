
// Image effect values
let rotation_value = 0
let greyscale_value = 0
let brightness_value = 0
let sepia_value = 0
let invert_value = 0
let posterise_value = 0
let threshold_value = -1
let redHue_value = 0, greenHue_value = 0, blueHue_value = 0


// BRIGHTNESS

function displayBrightness() {
  brightnessDiv.style.display = "flex"
  brightnessDiv.innerHTML = `
  <label for="ns_brightness"></label>
  <input type="range" id="ns_brightness" value="${brightness_value}" min="-255" max="255" onChange="setBrightness(this.value)"/>`
}

function setBrightness(value=brightness_value) {
  brightness_value = value
  images[currentImageIndex].brightness = parseInt(value)
  renderCanvas(currentImageIndex)
}

function applyBrightness(image) {
  imageData = offscreenCanvasCtx.getImageData(image.x, image.y, image.width, image.height)
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = imageData.data[i] + image.brightness             // Red
    imageData.data[i + 1] = imageData.data[i + 1] + image.brightness     // Green
    imageData.data[i + 2] = imageData.data[i + 2] + image.brightness     // Blue
    imageData.data[i + 3] = 255                                          // Alpha
  }
  // Update the image data after brightness adjustment
  offscreenCanvasCtx.putImageData(imageData, image.x, image.y)
}

// GREYSCALE

function displayGreyscale() {
  grayscaleDiv.style.display = "flex"
  grayscaleDiv.innerHTML = `
    <label for="ns_greyscale"></label>
    <input type="range" id="ns_greyscale" value="${greyscale_value}" min="0" max="100" onChange="setGreyscale(this.value)"/>`
}

function setGreyscale(value = greyscale_value) {
  greyscale_value = value
  images[currentImageIndex].greyscale = parseInt(value)
  renderCanvas(currentImageIndex)
}

function applyGreyscale(image) {
  // Get the intensity level of greyscale from the image (from 0 to 100)
  let intensity = image.greyscale / 100

  // If intensity is greater than 0 (meaning greyscale effect is applied)
  if (intensity > 0) {
    let imageData = offscreenCanvasCtx.getImageData(image.x, image.y, image.width, image.height)

    // Loop through each pixel in the image data (4 values per pixel: R, G, B, A)
    for (let i = 0; i < imageData.data.length; i += 4) {
      let r = imageData.data[i]
      let g = imageData.data[i + 1]
      let b = imageData.data[i + 2]

      // Calculate the grayscale value (average of R, G, B)
      let gray = (r + g + b) / 3

      // Apply the greyscale effect by blending the original color with the grayscale
      // The degree of blending is determined by the intensity
      imageData.data[i] = r * (1 - intensity) + gray * intensity
      imageData.data[i + 1] = g * (1 - intensity) + gray * intensity
      imageData.data[i + 2] = b * (1 - intensity) + gray * intensity
      imageData.data[i + 3] = 255
    }

    // Put the modified image data back to the offscreen canvas at the image's location
    offscreenCanvasCtx.putImageData(imageData, image.x, image.y)
  }
}


// SEPIA

function displaySepia() {
  sepiaDiv.style.display = "flex"
  sepiaDiv.innerHTML = `
    <label for="ns_sepia"></label>
    <input type="range" id="ns_sepia" value="${sepia_value}" min="0" max="100" onChange="setSepia(this.value)"/>`
}

function setSepia(value = sepia_value) {
  sepia_value = value
  images[currentImageIndex].sepia = parseInt(value)
  renderCanvas(currentImageIndex)
}

function applySepia(image) {
  // Get the intensity level of sepia from the image (from 0 to 100)
  let intensity = image.sepia / 100

  // If intensity is greater than 0 (meaning sepia effect is applied)
  if (intensity > 0) {
    let imageData = offscreenCanvasCtx.getImageData(image.x, image.y, image.width, image.height)
    let data = imageData.data

    // Loop through each pixel in the image data (4 values per pixel: R, G, B, A)
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i]
      let g = data[i + 1]
      let b = data[i + 2]

      // Standard sepia calculation
      let sepiaR = (r * 0.393) + (g * 0.769) + (b * 0.189)
      let sepiaG = (r * 0.349) + (g * 0.686) + (b * 0.168)
      let sepiaB = (r * 0.272) + (g * 0.534) + (b * 0.131)

      // Blend with original depending on intensity
      data[i]     = r * (1 - intensity) + sepiaR * intensity
      data[i + 1] = g * (1 - intensity) + sepiaG * intensity
      data[i + 2] = b * (1 - intensity) + sepiaB * intensity
      data[i + 3] = 255 // Full alpha
    }

    // Apply the modified image data back to the offscreen canvas at the image's location
    offscreenCanvasCtx.putImageData(imageData, image.x, image.y)
  }
}


// INVERT

function displayInvert() {
  invertDiv.style.display = "flex"
  invertDiv.innerHTML = `
    <label for="ns_invert"></label>
    <input type="range" id="ns_invert" value="${invert_value}" min="0" max="100" onChange="setInvert(this.value)"/>`
}

function setInvert(value = invert_value) {
  invert_value = value
  images[currentImageIndex].invert = parseInt(value)
  renderCanvas(currentImageIndex)
}

function applyInvert(image) {
  let intensity = image.invert / 100

  if (intensity > 0) {
    let imageData = offscreenCanvasCtx.getImageData(image.x, image.y, image.width, image.height)
    let data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i]
      let g = data[i + 1]
      let b = data[i + 2]

      // Standard invert
      let invertedR = 255 - r
      let invertedG = 255 - g
      let invertedB = 255 - b

      // Blend with original
      data[i]     = r * (1 - intensity) + invertedR * intensity
      data[i + 1] = g * (1 - intensity) + invertedG * intensity
      data[i + 2] = b * (1 - intensity) + invertedB * intensity
      data[i + 3] = 255
    }

    offscreenCanvasCtx.putImageData(imageData, image.x, image.y)
  }
}


// POSTERISE

function displayPosterise() {
  posteriseDiv.style.display = "flex"
  posteriseDiv.innerHTML = `
    <label for="ns_posterise"></label>
    <input type="range" id="ns_posterise" value="${posterise_value}" min="2" max="64" step="1" onChange="setPosterise(this.value)"/>`
}

function setPosterise(value = posterise_value) {
  posterise_value = value
  images[currentImageIndex].posterise = parseInt(value)
  renderCanvas(currentImageIndex)
}

function applyPosterise(image) {
  // Get the posterise level (greater than 1 for posterization to take effect)
  let level = image.posterise

  // If the level is greater than 1 (ensuring posterization is applied)
  if (level > 1) {
    let imageData = offscreenCanvasCtx.getImageData(image.x, image.y, image.width, image.height)
    let data = imageData.data

    // Loop through each pixel in the image data (4 values per pixel: R, G, B, A)
    for (let i = 0; i < data.length; i += 4) {
      data[i]     = data[i] - data[i] % level     // Red
      data[i + 1] = data[i + 1] - data[i + 1] % level // Green
      data[i + 2] = data[i + 2] - data[i + 2] % level // Blue

      // Set full opacity for each pixel
      data[i + 3] = 255
    }

    // Apply the modified image data back to the offscreen canvas at the image's location
    offscreenCanvasCtx.putImageData(imageData, image.x, image.y)
  }
}


// THRESHOLD

function displayThreshold() {
  thresholdDiv.style.display = "flex"
  thresholdDiv.innerHTML = `
    <label for="ns_threshold"></label>
    <input type="range" id="ns_threshold" value="${threshold_value}" min="-1" max="255" onChange="setThreshold(this.value)" />`
}

function setThreshold(value = threshold_value) {
  threshold_value = value
  images[currentImageIndex].threshold = parseInt(value)
  renderCanvas(currentImageIndex)
}

function applyThreshold(image) {
  // Get the threshold value for the effect
  let threshold = image.threshold

  // Apply the threshold only if it's a valid number (threshold >= 0)
  if (threshold >= 0) {
    let imageData = offscreenCanvasCtx.getImageData(image.x, image.y, image.width, image.height)
    let data = imageData.data

    // Loop through each pixel in the image (every 4th value is a color channel: R, G, B, A)
    for (let i = 0; i < data.length; i += 4) {
      for (let rgb = 0; rgb < 3; rgb++) {
        data[i + rgb] = data[i + rgb] < threshold ? 0 : 255
      }

      // Set full opacity for each pixel (alpha channel)
      data[i + 3] = 255
    }

    // Apply the modified image data back to the offscreen canvas at the image's location
    offscreenCanvasCtx.putImageData(imageData, image.x, image.y)
  }
}


// ROTATION

function displayRotation() {
  rotationDiv.style.display = "flex"
  rotationDiv.innerHTML = `
  <label for="ns_rotation"></label>
  <input type="range" id="ns_rotation" value="${rotation_value}" min="-255" max="255" onChange="setRotationDegrees(this.value)"/>`
}

function setRotationDegrees(value=rotation_value) {
  rotation_value = value
  images[currentImageIndex].rotation = parseInt(value)
  renderCanvas(currentImageIndex)
}

function applyRotation(image) {

  // Save current state before applying transformations
  ctx.save()

  // Move the origin to the image's center for rotation
  ctx.translate((image.x + image.width / 2), (image.y + image.height / 2))

  // Rotate the canvas based on the image's rotation value (must convert degrees to radians)
  ctx.rotate(Math.radians(image.rotation))

  // Move origin back
  ctx.translate(-(image.x + image.width / 2), -(image.y + image.height / 2))
}


// RGB

function displayRGBHue() {
  rgbHueDiv.style.display = "flex"
  document.getElementById("ns_rgb_icon").style.padding = "40px 15px"
  rgbHueDiv.innerHTML = `
    <div class="ns_rgbDiv">
        <img src="img/buttons/rgb/red.png" height="512" alt="rgb_red_buttons"/>
        <input type="range" min="-100" max="100" value="${redHue_value}" onchange="setRGBHue('red', this.value)" id="ns_redHue"/>
    </div>
    <div class="ns_rgbDiv">
        <img src="img/buttons/rgb/green.png" height="512" alt="rgb_green_buttons"/>
        <input type="range" min="-100" max="100" value="${greenHue_value}" onchange="setRGBHue('green', this.value)" id="ns_greenHue"/>
    </div>
    <div class="ns_rgbDiv">
        <img src="img/buttons/rgb/blue.png" height="512" alt="rgb_blue_buttons"/>
        <input type="range" min="-100" max="100" value="${blueHue_value}" onchange="setRGBHue('blue', this.value)" id="ns_blueHue"/>
    </div>`
}

function setRGBHue(channel, value) {
  // Convert the input value to an integer
  let intVal = parseInt(value)

  // Based on the channel, assign the hue value to the corresponding variable
  if (channel === 'red') redHue_value = intVal
  if (channel === 'green') greenHue_value = intVal
  if (channel === 'blue') blueHue_value = intVal

  // Update the corresponding hue values in the image object (current image being edited)
  images[currentImageIndex].redHue = redHue_value
  images[currentImageIndex].greenHue = greenHue_value
  images[currentImageIndex].blueHue = blueHue_value

  // Re-render the canvas to reflect the changes
  renderCanvas(currentImageIndex)
}

function applyRGBHue(image) {

  // Get the hue shift values for Red, Green, and Blue channels from the image object
  let rShift = image.redHue || 0
  let gShift = image.greenHue || 0
  let bShift = image.blueHue || 0

  // If any hue shift is applied to any channel, proceed with the transformation
  if (rShift !== 0 || gShift !== 0 || bShift !== 0) {
    let imageData = offscreenCanvasCtx.getImageData(image.x, image.y, image.width, image.height)
    let data = imageData.data

    // Iterate over each pixel's data (4 elements per pixel: RGBA)
    for (let i = 0; i < data.length; i += 4) {
      data[i] = clamp(data[i] + rShift, 0, 255)     // Red
      data[i + 1] = clamp(data[i + 1] + gShift, 0, 255) // Green
      data[i + 2] = clamp(data[i + 2] + bShift, 0, 255) // Blue
    }

    // Put the updated image data (with hue shift) back onto the canvas
    offscreenCanvasCtx.putImageData(imageData, image.x, image.y)
  }
}

function clamp(value, min, max) {
  // Return the value bounded between min and max
  return Math.max(min, Math.min(max, value))
}


// Else

function setToDefaultImageEffectValues() {
  images.forEach((image, index) => {
    if (index === currentImageIndex) {
      image.rotation = 0
      image.greyscale = 0
      image.brightness = 0
      image.sepia = 0
      image.invert = 0
      image.posterise = 0
      image.threshold = -1
      image.redHue = 0
      image.greenHue = 0
      image.blueHue = 0
      image.texts = []
    }
  })
  updateSliders()
  renderCanvas(currentImageIndex)
}
