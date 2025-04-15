
// Load images to be displayed on the canvas
let img0 = new Image(); img0.src = "img/kitten.jpg"
let img1 = new Image(); img1.src = "img/kitten1.jpg"
let img2 = new Image(); img2.src = "img/kitten2.jpg"

// Array to hold image objects with their properties
let images = [
  {src: img0, x: 100, y: 100, width: img0.naturalWidth, height: img0.naturalHeight,
    rotation: rotation_value, greyscale: greyscale_value, brightness: brightness_value, sepia: sepia_value,
    invert: invert_value, posterise: posterise_value, threshold: threshold_value,
    redHue: redHue_value, greenHue: greenHue_value, blueHue: blueHue_value, texts: []},
  {src: img1, x: 100, y: 100, width: img1.naturalWidth, height: img1.naturalHeight,
    rotation: rotation_value, greyscale: greyscale_value, brightness: brightness_value, sepia: sepia_value,
    invert: invert_value, posterise: posterise_value, threshold: threshold_value,
    redHue: redHue_value, greenHue: greenHue_value, blueHue: blueHue_value, texts: []},
  {src: img2, x: 100, y: 100, width: img2.naturalWidth, height: img2.naturalHeight,
    rotation: rotation_value, greyscale: greyscale_value, brightness: brightness_value, sepia: sepia_value,
    invert: invert_value, posterise: posterise_value, threshold: threshold_value,
    redHue: redHue_value, greenHue: greenHue_value, blueHue: blueHue_value, texts: []}]

// Index of the currently selected image for manipulation
let currentImageIndex = 0

function addImageDisplay() {
  // Show the image input UI elements by setting their display to "flex"
  addImageDiv[0].style.display = "flex"
  addImageDiv[1].style.display = "flex"
}

function addImage(link) {

  // Hide the "add image" UI divs after selecting an image link
  addImageDiv[0].style.display = "none"
  addImageDiv[1].style.display = "none"

  // Check if there are fewer than 8 images
  if (images.length < 8) {

    // Create a new HTMLImageElement
    const img = new Image()
    img.crossOrigin = "anonymous" // Enable CORS to allow loading images from external domains
    img.src = link

    // When the image finishes loading...
    img.onload = function () {
      // Prepare image metadata
      let imageObject = {
        src: img,
        x: 100,
        y: 100,
        width: img.naturalWidth,
        height: img.naturalHeight,
        rotation: rotation_value,
        greyscale: greyscale_value,
        brightness: brightness_value
      }

      // Add the image object to the images array
      images.push(imageObject)

      // Optional: update UI with image name
      displayImageName()

      // Select the newly added image
      selectImage(images.length - 1)
    }
  } else {
    // If there are already 8 images, display a confirmation alert
    confirm("Maximum 8 images allowed.")
  }
}

function deleteImage(image_index) {
  // Ask for confirmation before deletion
  let confirmed = confirm("Are you sure you want to delete this image?")

  // If the user cancels, stop execution
  if (!confirmed) return

  // Remove the image from the `images` array
  images.splice(image_index, 1)

  // If there are still images left, set the current image to the first one
  if (images.length > 0) {
    // Set the new current image index
    currentImageIndex = 0
  } else {
    // No images left, set the index to -1
    currentImageIndex = -1
  }

  // Re-render the image list and canvas after deletion
  displayImageName();
  renderCanvas(currentImageIndex);
}

function displayImageName() {

  // Flag to check if there are any images with names
  let hasImageNames = false
  let html = ""

  // Iterate through each image in the images array
  images.forEach((img, index) => {

    // Check if the image has a valid source URL
    let hasImage = img.src && img.src.src

    // Get the image name from the URL (split by '/' and take the last part)
    let imageName = hasImage ? img.src.src.split('/').pop().split('?')[0] : ""

    // If the image has a name, set the flag to true
    if (imageName) {
      hasImageNames = true
    }

    // Check if the image is the currently selected one, add a CSS class for styling
    let isSelected = currentImageIndex === index ? 'ns_selectedImageName' : ''

    // Add the HTML for the image name button
    html += `
      <button class="ns_imageName ${isSelected}" onclick="selectImage(${index})" ${!imageName ? 'style="display: none;"' : ''}>
        <p>${imageName}</p>
        <span onclick="event.stopPropagation(); deleteImage(${index})" class="ns_closeButton" role="button">&times;</span>
      </button>`
  })

  // Get the container element for displaying the image list
  let imageListContainer = document.getElementById('ns_imageNameList')

  // If no images have names, set the background color of the container
  if (!hasImageNames) {
    imageListContainer.style.backgroundColor = 'rgb(30, 30, 30)'
  }

  // Update the inner HTML of the image list container
  imageListContainer.innerHTML = html
}

function selectImage(index) {
  // Set the current image index to the clicked image's index
  currentImageIndex = index

  // Get all the image name buttons
  const buttons = document.querySelectorAll('.ns_imageName')

  // Loop through each button to add or remove the selected class
  buttons.forEach((button, i) => {
    if (i === index) {
      button.classList.add('ns_selectedImageName')
    } else {
      button.classList.remove('ns_selectedImageName')
    }
  })

  // Re-render the canvas with the selected image
  renderCanvas(index)

  // Update sliders and options based on the selected image's properties
  updateSliders(index)
}

function saveImage(index = currentImageIndex) {
  let image = images[index]

  // Create a temporary canvas with the same size as the image
  let tempCanvas = document.createElement("canvas")
  tempCanvas.width = image.width
  tempCanvas.height = image.height

  let tempCtx = tempCanvas.getContext("2d")

  // Draw the image from the offscreen canvas, cropping only the image area
  tempCtx.drawImage(
    offscreenCanvas,          // source: offscreen canvas with filters and text
    image.x, image.y,         // source x and y
    image.width, image.height, // source width and height
    0, 0,                     // destination x and y on the temp canvas
    image.width, image.height // destination width and height
  )

  // Convert the canvas to an image URL
  let imageURL = tempCanvas.toDataURL("image/png")

  // Create a temporary link to trigger download
  let link = document.createElement('a')
  link.href = imageURL
  link.download = 'image.png'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
