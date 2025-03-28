
// Variables for slider div elements
let brightnessDiv, grayscaleDiv, sepiaDiv, invertDiv, textDiv

// Object to store active filters
let filters = {}

// Variables to store filter values (default settings)
let brightnessPercent = 100
let grayscalePercent = 0
let sepiaPercent = 0
let invertPercent = 0

function brightness(percentage=brightnessPercent) {

  brightnessDiv.style.cursor = 'default'

  // Update brightness value
  brightnessPercent = percentage

  // Show brightness slider
  brightnessDiv.style.display = 'flex'

  // Update the brightness slider UI
  brightnessDiv.innerHTML = `
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

  grayscaleDiv.style.cursor = 'default'

  // Update grayscale value
  grayscalePercent = percentage

  // Show grayscale slider
  grayscaleDiv.style.display = 'flex'

  // Update the grayscale slider UI
  grayscaleDiv.innerHTML = `
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

  sepiaDiv.style.cursor = 'default'

  // Update sepia value
  sepiaPercent = percentage

  // Show sepia slider
  sepiaDiv.style.display = 'flex'

  // Update the sepia slider UI
  sepiaDiv.innerHTML = `
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
  invertDiv.style.cursor = 'default'

  // Update invert value
  invertPercent = percentage

  // Show invert slider
  invertDiv.style.display = 'flex'

  // Update the invert slider UI
  invertDiv.innerHTML = `
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

function text() {
  // Update the text div
  textDiv.innerHTML = `

  `

}

function setFilter(type, value, unit) {
  // Store the filter in the object
  filters[type] = `${type}(${value}${unit})`

  // Draw image with all active filters
  drawImage()
}
