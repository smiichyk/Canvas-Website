
// Global variables for dragging and text manipulation
let isDragging = false
let isDraggingText = false
let selectedTextIndex = null
let textOffsetX = 0
let textOffsetY = 0

// Mousedown handler to start dragging or selecting text
function mousedownHandler(event) {

  // Get canvas position and calculate mouse coordinates relative to the canvas
  const rect = canvas.getBoundingClientRect()
  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top
  const image = images[currentImageIndex]

  // Reset all drag states
  selectedTextIndex = null
  isDragging = false
  isDraggingText = false

  // Check if mouse clicked inside a text element
  if (image.texts) {

    // Iterate in reverse to prioritize top-most text
    for (let i = image.texts.length - 1; i >= 0; i--) {
      const t = image.texts[i]

      // Estimate text box dimensions (approximate width based on font size, text length, and scale)
      const textWidth = t.fontSize * t.text.length * 0.5 * (t.scale || 1)
      const textHeight = t.fontSize * (t.scale || 1)

      // If the mouse is inside the text box
      if (
        mouseX >= t.x &&
        mouseX <= t.x + textWidth &&
        mouseY <= t.y &&
        mouseY >= t.y - textHeight
      ) {

        // Set selected text for dragging
        selectedTextIndex = i
        textOffsetX = mouseX - t.x
        textOffsetY = mouseY - t.y
        isDraggingText = true

        // Pre-fill input fields with selected text's properties
        document.getElementById("ns_textInput").value = t.text
        document.getElementById("ns_textColor").value = t.colour
        document.getElementById("ns_textFont").value = t.fontFamily

        return // Exit loop after selecting the top-most text
      }
    }
  }

  // If no text was selected, check if the image is selected for dragging
  if (mouseIsInsideImage(image.x, image.y, image.width, image.height, mouseX, mouseY)) {
    offsetX = mouseX - image.x
    offsetY = mouseY - image.y
    isDragging = true
  }
}

// Move handler to update the position of text or image during dragging
function moveHandler(event) {

  // Get canvas position and calculate mouse coordinates relative to the canvas
  let rect = canvas.getBoundingClientRect()
  let mouseX = event.clientX - rect.left
  let mouseY = event.clientY - rect.top

  // Move the selected text
  if (isDraggingText && selectedTextIndex !== null) {
    let text = images[currentImageIndex].texts[selectedTextIndex]
    text.x = mouseX - textOffsetX
    text.y = mouseY - textOffsetY
    renderCanvas(currentImageIndex)
  }
  // Move the image if dragging
  else if (isDragging && event.which === 1) {
    images[currentImageIndex].x = mouseX - offsetX
    images[currentImageIndex].y = mouseY - offsetY
    renderCanvas(currentImageIndex)
  }
}

// Mouse wheel handler for zooming text and image
function mousewheelHandler(event) {

  // If a text element is selected for zooming
  if (selectedTextIndex !== null) {
    // Prevent the default scroll behavior (zooming the page)
    event.preventDefault()

    let text = images[currentImageIndex].texts[selectedTextIndex]

    // Determine zoom direction based on the wheel scroll
    let scaleFactor = event.deltaY < 0 ? 1.05 : 0.95

    // Scale the text based on the zoom direction (in or out)
    text.scale = (text.scale || 1) * scaleFactor

    // Re-render the canvas to reflect the updated text scale
    renderCanvas(currentImageIndex)

    return // prevent zooming of image
  }

  // If no text is selected, apply zoom to the image
  if (currentImageIndex !== null) {
    // Prevent the default scroll behavior (zooming the page)
    event.preventDefault()

    let image = images[currentImageIndex]

    // Save the current center of the image to maintain its position during zoom
    let oldCentreX = image.x + image.width / 2
    let oldCentreY = image.y + image.height / 2

    // Determine zoom direction
    let scaleFactor = event.deltaY < 0 ? 1.02 : 0.98

    // Apply proportional scaling to the image
    image.width *= scaleFactor
    image.height *= scaleFactor

    // Re-center the image after scaling
    image.x = oldCentreX - image.width / 2
    image.y = oldCentreY - image.height / 2

    // Re-render the canvas to reflect the updated image size and position
    renderCanvas(currentImageIndex)
  }
}

// Mouseup handler to stop dragging when mouse button is released
function mouseupHandler() {
  isDragging = false
  isDraggingText = false
}

// Check if mouse position is inside the image
function mouseIsInsideImage(imageTopLeftX, imageTopLeftY, imageWidth, imageHeight, x, y) {
  if ((x > imageTopLeftX) && (y > imageTopLeftY)) {
    if (x > imageTopLeftX) {
      if ((x - imageTopLeftX) > imageWidth) {
        return false // Mouse is to the right of the image
      }
    }

    if (y > imageTopLeftY) {
      if ((y - imageTopLeftY) > imageHeight) {
        return false // Mouse is below the image
      }
    }
  } else {
    return false // Mouse is to the left or above the image
  }
  return true // Mouse is inside the image
}

// Event listener to manage mouse actions
function addEventListeners() {
  canvas.addEventListener('mousedown', mousedownHandler)
  canvas.addEventListener('mousemove', moveHandler)
  canvas.addEventListener('wheel', mousewheelHandler)
  canvas.addEventListener('mouseup', mouseupHandler)
  document.addEventListener('wheel', function(e) { e.preventDefault() }, { passive: false })
}
