const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const penButton = document.getElementById('penButton');
const eraserButton = document.getElementById('eraserButton');
const colorPicker = document.getElementById('colorPicker');
const clearButton = document.getElementById('clearButton');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let isErasing = false;

function startDrawing(e) {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
}

function draw(e) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = isErasing ? 'white' : colorPicker.value;
    ctx.lineWidth = isErasing ? 20 : 5;
    ctx.lineCap = 'round';
    ctx.stroke();
    lastX = e.offsetX;
    lastY = e.offsetY;
}

function stopDrawing() {
    isDrawing = false;
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

penButton.addEventListener('click', () => {
    isErasing = false;
});

eraserButton.addEventListener('click', () => {
    isErasing = true;
});

clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});