let images = [
    "./imgs/pin5.jpeg",
    "./imgs/pic1.jpg",
    "./imgs/pic4.jpg",
    "./imgs/pic6.jpg"
];
let currentIndex = 0;
let textsForSlides = []; // Array to store text boxes for each slide

function updateSlider() {
    const sliderImage = document.getElementById("sliderImage");
    clearCanvas();
    sliderImage.src = images[currentIndex];
    if (textsForSlides[currentIndex]) {
        textsForSlides[currentIndex].forEach(textBoxData => {
            createTextBox(
                textBoxData.text,
                textBoxData.color,
                textBoxData.fontSize,
                textBoxData.fontStyle,
                textBoxData.left,
                textBoxData.top
            );
        });
    }
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateSlider();
}

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateSlider();
}

function clearCanvas() {
    const canvas = document.getElementById("canvas");
    const textBoxes = canvas.querySelectorAll(".text-box");
    textBoxes.forEach(textBox => textBox.remove());
}

let selectedTextBox = null;

function addText() {
    const canvas = document.getElementById("canvas");
    const userInput = document.getElementById("userInput").value.trim();
    const textColor = document.getElementById("textColor").value;
    const fontSize = document.getElementById("fontSize").value;
    const fontStyle = document.getElementById("fontStyle").value;

    if (!userInput) return alert("Please enter text!");
    createTextBox(userInput, textColor, fontSize, fontStyle, 10, 10);
    if (!textsForSlides[currentIndex]) {
        textsForSlides[currentIndex] = [];
    }
    textsForSlides[currentIndex].push({
        text: userInput,
        color: textColor,
        fontSize: fontSize,
        fontStyle: fontStyle,
        left: 10,
        top: 10
    });
}

function createTextBox(text, color, fontSize, fontStyle, left, top) {
    const canvas = document.getElementById("canvas");

    const textBox = document.createElement("div");
    textBox.className = "text-box";
    textBox.contentEditable = true;
    textBox.style.position = "absolute";
    textBox.style.left = `${left}px`;
    textBox.style.top = `${top}px`;
    textBox.style.color = color;
    textBox.style.fontSize = `${fontSize}px`;
    textBox.style.fontFamily = fontStyle;
    textBox.style.border = "1px dashed gray";
    textBox.style.padding = "5px";
    textBox.style.cursor = "move";
    textBox.innerHTML = text;

    addControlsToTextBox(textBox);
    canvas.appendChild(textBox);
    addDragFunctionality(textBox);

    textBox.addEventListener("click", () => selectTextBox(textBox));
}

function addDragFunctionality(textBox) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    textBox.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - textBox.offsetLeft;
        offsetY = e.clientY - textBox.offsetTop;
        e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const newLeft = e.clientX - offsetX;
        const newTop = e.clientY - offsetY;
        textBox.style.left = `${newLeft}px`;
        textBox.style.top = `${newTop}px`;
        updateTextBoxPosition(textBox);
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) isDragging = false;
    });
}

function updateTextBoxPosition(textBox) {
    const index = textsForSlides[currentIndex].findIndex(data => data.text === textBox.innerHTML);
    if (index !== -1) {
        textsForSlides[currentIndex][index].left = parseInt(textBox.style.left);
        textsForSlides[currentIndex][index].top = parseInt(textBox.style.top);
    }
}

function addControlsToTextBox(textBox) {
    const controls = document.createElement("div");
    controls.className = "controls";
    controls.style.marginTop = "5px";
    controls.innerHTML = `
        <i class="fa-solid fa-trash" onclick="deleteText(event)"></i>
        <i class="fa-solid fa-copy" onclick="copyText(event)"></i>
    `;
    textBox.appendChild(controls);
}

function copyText(event) {
    const originalTextBox = event.target.closest(".text-box");
    const canvas = document.getElementById("canvas");

    const clonedTextBox = originalTextBox.cloneNode(true);
    clonedTextBox.style.left = `${parseInt(originalTextBox.style.left) + 20}px`;
    clonedTextBox.style.top = `${parseInt(originalTextBox.style.top) + 20}px`;

    clonedTextBox.addEventListener("click", () => selectTextBox(clonedTextBox));
    addDragFunctionality(clonedTextBox);
    canvas.appendChild(clonedTextBox);

    textsForSlides[currentIndex].push({
        text: clonedTextBox.innerHTML,
        color: getComputedStyle(clonedTextBox).color,
        fontSize: parseInt(getComputedStyle(clonedTextBox).fontSize),
        fontStyle: getComputedStyle(clonedTextBox).fontFamily.replace(/"/g, ''),
        left: parseInt(clonedTextBox.style.left),
        top: parseInt(clonedTextBox.style.top)
    });
}

function deleteText(event) {
    const textBox = event.target.closest(".text-box");
    if (textBox === selectedTextBox) selectedTextBox = null;
    textBox.remove();
    const index = textsForSlides[currentIndex].indexOf(textBox);
    if (index !== -1) {
        textsForSlides[currentIndex].splice(index, 1);
    }
}

function selectTextBox(textBox) {
    if (selectedTextBox) selectedTextBox.style.border = "1px dashed gray";
    selectedTextBox = textBox;
    selectedTextBox.style.border = "2px solid blue";

    const fontStyle = document.getElementById("fontStyle");
    const fontSize = document.getElementById("fontSize");
    const textColor = document.getElementById("textColor");

    fontStyle.value = getComputedStyle(selectedTextBox).fontFamily.replace(/"/g, '');
    fontSize.value = parseInt(getComputedStyle(selectedTextBox).fontSize);
    textColor.value = rgbToHex(getComputedStyle(selectedTextBox).color);
}

function updateSelectedText() {
    if (!selectedTextBox) return;
    const fontStyle = document.getElementById("fontStyle").value;
    const fontSize = document.getElementById("fontSize").value;
    const textColor = document.getElementById("textColor").value;

    selectedTextBox.style.fontFamily = fontStyle;
    selectedTextBox.style.fontSize = `${fontSize}px`;
    selectedTextBox.style.color = textColor;
}

function rgbToHex(rgb) {
    const result = rgb.match(/\d+/g)
        .map(x => parseInt(x).toString(16).padStart(2, '0'))
        .join('');
    return `#${result}`;
}
