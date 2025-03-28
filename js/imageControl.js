
// Create an image object and load the picture
let img = new Image()
let imgName

let addImageDiv = document.getElementsByClassName("ns_addImage")

function addImageDisplay() {
  addImageDiv[0].style.display = "flex"
  addImageDiv[1].style.display = "flex"
}

function addImage(link) {
  document.getElementById('ns_canvas').style.background = 'rgb(30, 30, 30)'
  addImageDiv[0].style.display = "none"
  addImageDiv[1].style.display = "none"
  img.src = link
  imgName = img.src.split('/').pop()
  drawImage()
}

function saveImage() {

}

function deleteImage() {
  if (imgName!=="") {
    if (confirm("Are you sure you want to delete the image?")) {
      document.getElementById('ns_canvas').style.background = 'rgb(41, 41, 41)'
      img.src = ""
      drawImage()
      imgName = ""
      displayImageName()
    }
  }
}

function displayImageName() {
  let imageNameDiv = document.getElementById('ns_imageName')

  if (imgName!=="") {
    imageNameDiv.style.display = 'flex'
    imgName = img.src.split('/').pop()
  } else {
    imageNameDiv.style.display = 'none'
  }
  imageNameDiv.innerHTML = `<p>${imgName}</p>
    <button onclick="deleteImage()" class="ns_close_button">&times;</button>`
}
