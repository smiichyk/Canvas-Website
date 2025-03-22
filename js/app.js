let canvas = null
let ctx = null

window.onload = onAllAssetsLoaded

let img = new Image()
img.src = "img/kitten.jpg"

function onAllAssetsLoaded() {
  // associate the canvas variable with the HTML canvas element
  canvas = document.getElementById('ns_canvas')

  // assign the graphics context to the canvas, so we draw on it
  ctx = canvas.getContext('2d')

  // set the width and height
  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientHeight

  renderCanvas()
}

function renderCanvas() {
  displayImage()
}

function brightness(percent=100) {
  document.getElementById("ns_controls").innerHTML = `
    <h1>Brightness</h1>
    <input type="range" min="10" max="250" value="${percent}" onclick="brightness(this.value)">
    <p>${percent}</p>`
  ctx.filter = `brightness(${percent}%)`;
  displayImage()
}

function grayscale(percent=0) {
  document.getElementById("ns_controls").innerHTML = `
    <h1>Grayscale</h1>
    <input type="range" min="0" max="100" value="${percent}" onclick="grayscale(this.value)">
    <p>${percent}</p>`
  ctx.filter = `grayscale(${percent}%)`;
  displayImage()
}

function sepia(percent=0) {
  document.getElementById("ns_controls").innerHTML = `
    <h1>Sepia</h1>
    <input type="range" min="0" max="100" value="${percent}" onclick="sepia(this.value)">
    <p>${percent}</p>`
  ctx.filter = `sepia(${percent}%)`;
  displayImage()
}

function invert(percent=0) {
  document.getElementById("ns_controls").innerHTML = `
    <h1>Invert</h1>
    <input type="range" min="0" max="100" value="${percent}" onclick="invert(this.value)">
    <p>${percent}</p>`
  ctx.filter = `invert(${percent}%)`;
  displayImage()
}

function posterise() {

}

function threshold() {

}

function displayImage() {
  return ctx.drawImage(img, 100, 150)
}
