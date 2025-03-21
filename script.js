const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const penButton = document.getElementById('penButton');
const eraserButton = document.getElementById('eraserButton');
const colorPicker = document.getElementById('colorPicker');
const clearButton = document.getElementById('clearButton');
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');
const exportButton = document.getElementById('exportButton');
const importButton = document.getElementById('importButton');
const importInput = document.getElementById('importInput');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let isErasing = false;
let history = [];
let historyIndex = -1;

function saveState() {
    historyIndex++;
    if (historyIndex < history.length) {
        history.length = historyIndex;
    }
    history.push(canvas.toDataURL());
}

function restoreState() {
    let img = new Image();
    img.src = history[historyIndex];
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
}

function startDrawing(e) {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
    saveState();
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
    saveState();
});

undoButton.addEventListener('click', () => {
    if (historyIndex > 0) {
        historyIndex--;
        restoreState();
    }
});

redoButton.addEventListener('click', () => {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        restoreState();
    }
});

exportButton.addEventListener('click', () => {
    let link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
});

importButton.addEventListener('click', () => {
    importInput.click();
});

importInput.addEventListener('change', (e) => {
    let file = e.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = (event) => {
            let img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                saveState();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    restoreState();
});

saveState();
