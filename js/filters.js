
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
