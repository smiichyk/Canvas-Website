
function displayTextControls() {

  // Set up the text controls UI to be displayed
  textDiv.style.display = "flex"
  document.getElementById("ns_text_icon").style.padding = "50px 15px"

  // Set the HTML content for the text controls
  textDiv.innerHTML = `
    <label for="ns_textInput"></label><input type="text" id="ns_textInput" placeholder="Enter your text"
           oninput="renderCanvas()" onclick="event.stopPropagation()"/>
    <div>
        <div class="ns_nextDiv">
            <label for="ns_textColor">Text color</label><input type="color" id="ns_textColor" value="#ffffff"
             oninput="renderCanvas()" onclick="event.stopPropagation()"/>
        </div>
        <div class="ns_nextDiv">
            <label for="ns_textFont">Font</label><select id="ns_textFont" onchange="renderCanvas()" onclick="event.stopPropagation()">
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Verdana">Verdana</option>
            <option value="Georgia">Georgia</option></select>
        </div>

        <button onclick="event.stopPropagation(); addTextToCanvas()" id="ns_addTextButton">Add Text</button>
        <button onclick="deleteSelectedText()" id="ns_deleteTextButton">Delete Text</button>
        <button onclick="editSelectedText()" id="ns_editTextButton">Edit Text</button>
    </div>`
}

function addTextToCanvas() {
  let input = document.getElementById("ns_textInput").value
  let colour = document.getElementById("ns_textColor").value
  let font = document.getElementById("ns_textFont").value

  // Check if the input is not empty
  if (input.trim() !== "") {

    // Add the new text object to the current image's texts array
    images[currentImageIndex].texts.push({
      id: Date.now(),
      text: input,
      colour: colour,
      x: 100,
      y: 100,
      fontSize: 120,
      fontFamily: "Arial",
      color: "white",
      font: font,
      rotation: 0,
      scale: 1.0,
      bold: false
    })

    // Render the canvas again to show the newly added text
    renderCanvas(currentImageIndex)

    // Clear the text input field after adding the text
    document.getElementById("ns_textInput").value = ""
  }
}

function deleteSelectedText() {
  // Check if a text is selected
  if (selectedTextIndex !== null) {
    // Remove the selected text from the current image's texts array
    images[currentImageIndex].texts.splice(selectedTextIndex, 1)

    // Reset the selected text index
    selectedTextIndex = null

    // Re-render the canvas after deletion
    renderCanvas(currentImageIndex)
  }
}

function editSelectedText() {

  // Check if a text is selected
  if (selectedTextIndex !== null) {
    const text = images[currentImageIndex].texts[selectedTextIndex]

    // Get values from input fields
    const input = document.getElementById("ns_textInput").value
    const colour = document.getElementById("ns_textColor").value
    const font = document.getElementById("ns_textFont").value

    // If the input is not empty, update the text properties
    if (input.trim() !== "") {
      text.text = input
      text.colour = colour
      text.fontFamily = font

      // Re-render the canvas to show the updated text
      renderCanvas(currentImageIndex)
    }
  }
}

