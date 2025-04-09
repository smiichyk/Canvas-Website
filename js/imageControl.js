
function addImageDisplay() {
  // Show the image input UI elements by setting their display to "flex"
  addImageDiv[0].style.display = "flex"
  addImageDiv[1].style.display = "flex"
}

function deleteImage(image_number) {

  let index

  let confirmed = confirm("Are you sure you want to delete this image?");
  if (!confirmed) return // Stop if user cancels

  if (image_number===0) {
    img1.src = ""
    if(img2.src!==null){
      index=1
    }
    else if (img3.src!==null){
      index=2
    }
    else {
      index=-1
    }
  }
  else if (image_number===1) {
    img2.src = ""
    if(img1.src!==null){
      index=0
    }
    else if (img3.src!==null){
      index=2
    }
    else {
      index=-1
    }
  }
  else if (image_number===2) {
    img3.src = ""
    if(img1.src!==null){
      index=0
    }
    else if (img2.src!==null){
      index=1
    }
    else {
      index=-1
    }
  }
  else {
    img1.src = ""
    img2.src = ""
    img3.src = ""
    index=-1
  }

  //
  displayImageName()
  selectImage(index)
}

function displayImageName() {
  let html = ""

  images.forEach((img, index) => {
    let hasImage = img.src.src && img.src.src !== window.location.href
    let imageName = hasImage ? img.src.src.split('/').pop() : ""

    html += `
      <button class="ns_imageName" onclick="selectImage(${index})" ${!imageName ? 'style="display: none;"' : ''}>
        <p>${imageName}</p>
        <span onclick="event.stopPropagation(); deleteImage(${index})" class="ns_close_button" role="button">&times;</span>
      </button>`
  })

  document.getElementById('ns_imageNameList').innerHTML = html;
}

function selectImage(index) {
  currentImageIndex = index
  renderCanvas(index)

  document.getElementById("ns_rotation").value = images[index].rotation
  document.getElementById("ns_brightness").value = images[index].brightness
  document.getElementById("ns_greyscale").checked = images[index].greyscale
}
