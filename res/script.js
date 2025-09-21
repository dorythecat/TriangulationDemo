// Get references to DOM elements
const circles = document.getElementsByClassName("circle");
const text = document.getElementById("text");
const nextButton = document.getElementById("nextButton");

let texts = [ // Texts to display
    "Welcome to the triangulation demonstration!",
    "This is a circle. Try dragging it around!"
];
let currentText = -1; // Start at -1 so the first updateText call sets it to 0

// Define connections between circles
let lineConnections = {}
let ringConnections = {}

// Variables for dragging
let selectedCircle = null;
let offsetX, offsetY;

function updateText() {
    currentText = (currentText + 1) % texts.length;
    text.innerText = texts[currentText];

    switch (currentText) {
        case 1:
            const circle = document.createElement('div');
            circle.classList.add('circle');
            circle.id = 'circle1';
            circle.style.left = '50%';
            circle.style.top = '50%';
            document.body.appendChild(circle);
            break;
    }
}

nextButton.addEventListener('click', updateText);

function updateConnections() {
    for (let circleID in ringConnections) {
        let circle = document.getElementById(circleID);
        for (let line of circle.getElementsByClassName('line')) circle.removeChild(line);
        for (let ring of circle.getElementsByClassName('ring')) circle.removeChild(ring);

        for (let targetID of lineConnections[circleID]) {
            let line = document.createElement('div');
            line.className = 'line';
            line.style.pointerEvents = 'none';
            circle.appendChild(line);

            let rect1 = circle.getBoundingClientRect();
            let rect2 = document.getElementById(targetID).getBoundingClientRect();

            let angle = Math.atan2(rect2.top - rect1.top, rect2.left - rect1.left) * 180 / Math.PI;
            let distance = Math.hypot(rect2.left - rect1.left, rect2.top - rect1.top);

            line.style.width = `${distance}px`;
            line.style.transform = `rotate(${angle}deg)`;
            line.style.transformOrigin = '0 50%';
            line.style.left = `${rect1.width / 2}px`;
            line.style.top = `${rect1.height / 2}px`;
        }

        for (let targetID of ringConnections[circleID]) {
            let ring = document.createElement('div');
            ring.className = 'ring';
            ring.style.pointerEvents = 'none';
            circle.appendChild(ring);

            let rect1 = circle.getBoundingClientRect();
            let rect2 = document.getElementById(targetID).getBoundingClientRect();

            let distance = Math.hypot(rect2.left - rect1.left, rect2.top - rect1.top) * 2;
            ring.style.width = ring.style.height = `${distance}px`;
        }
    }
}

// Dragging circles with mouse and touch support

// Mouse support
function startDrag(e) {
    selectedCircle = e.target;
    offsetX = e.clientX - selectedCircle.getBoundingClientRect().left;
    offsetY = e.clientY - selectedCircle.getBoundingClientRect().top;
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    selectedCircle.classList.add('selected');
}

function drag(e) {
    if (!selectedCircle) return;
    updateConnections();
    selectedCircle.style.left = `${e.clientX - offsetX}px`;
    selectedCircle.style.top = `${e.clientY - offsetY}px`;
}

function endDrag() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', endDrag);
    updateConnections();
    selectedCircle.classList.remove('selected');
    selectedCircle = null;
}

// Touch support
function startTouch(e) {
    e.preventDefault();
    selectedCircle = e.target;
    const touch = e.touches[0];
    offsetX = touch.clientX - selectedCircle.getBoundingClientRect().left;
    offsetY = touch.clientY - selectedCircle.getBoundingClientRect().top;
    document.addEventListener('touchmove', touchDrag);
    document.addEventListener('touchend', endTouch);
    selectedCircle.classList.add('selected');
}

function touchDrag(e) {
    if (!selectedCircle) return;
    updateConnections();
    const touch = e.touches[0];
    selectedCircle.style.left = `${touch.clientX - offsetX}px`;
    selectedCircle.style.top = `${touch.clientY - offsetY}px`;
}

function endTouch() {
    document.removeEventListener('touchmove', touchDrag);
    document.removeEventListener('touchend', endTouch);
    updateConnections();
    selectedCircle.classList.remove('selected');
    selectedCircle = null;
}

for (let circle of circles) {
    circle.addEventListener('mousedown', startDrag);
    circle.addEventListener('touchstart', startTouch);
}

// Initial updates
updateConnections();
updateText();