
// Create an image object and load the picture
let img = new Image()
let imageName

function addPhotoDisplay() {
  document.getElementsByClassName("ns_addImage")[0].style.display = "flex"
  document.getElementsByClassName("ns_addImage")[1].style.display = "flex"
}

function addPhoto(link) {
  document.getElementsByClassName("ns_addImage")[0].style.display = "none"
  document.getElementsByClassName("ns_addImage")[1].style.display = "none"
  img.src = link
  imageName = img.src.split('/').pop()
  drawImage()
}

function savePhoto() {

}

function deletePhoto() {
  if (imageName!=="") {
    if (confirm("Are you sure you want to delete the image?")) {
      document.getElementById('ns_canvas').style.background = 'rgb(41, 41, 41)'
      img.src = ""
      drawImage()
      imageName = ""
      displayImageName()
    }
  }
}

function displayImageName() {
  let imageNameDiv = document.getElementById('ns_imageName')
  if (imageName!=="") {
    imageNameDiv.style.display = 'flex'
    imageName = img.src.split('/').pop()
  } else {
    imageNameDiv.style.display = 'none'
  }
  imageNameDiv.innerHTML = `<p>${imageName}</p>
    <button onclick="deletePhoto()"><img src="img/buttons/add_minus/delete.png" height="10"/></button>`
}
