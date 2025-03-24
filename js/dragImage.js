
// Variables for dragging
let imgPositionX = 0, imgPositionY = 0
let isDragging = false
let startX, startY

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
