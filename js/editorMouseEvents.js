
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
