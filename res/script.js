// Dragging circles with mouse and touch support
const circles = document.getElementsByClassName("circle");

let selectedCircle = null;
let offsetX, offsetY;

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
    selectedCircle.style.left = `${e.clientX - offsetX}px`;
    selectedCircle.style.top = `${e.clientY - offsetY}px`;
}

function endDrag() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', endDrag);
    selectedCircle.classList.remove('selected');
    selectedCircle = null;
}

for (let circle of circles) {
    circle.addEventListener('mousedown', startDrag);
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
    const touch = e.touches[0];
    selectedCircle.style.left = `${touch.clientX - offsetX}px`;
    selectedCircle.style.top = `${touch.clientY - offsetY}px`;
}

function endTouch() {
    document.removeEventListener('touchmove', touchDrag);
    document.removeEventListener('touchend', endTouch);
    selectedCircle.classList.remove('selected');
    selectedCircle = null;
}

for (let circle of circles) {
    circle.addEventListener('touchstart', startTouch);
}