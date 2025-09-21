const circles = document.getElementsByClassName("circle");
const rings = document.getElementsByClassName("ring");

const ringConnections = {
    "circle1": ["circle2", "circle3"],
    "circle2": ["circle1", "circle3"]
}

let selectedCircle = null;
let offsetX, offsetY;

function updateRings() {
    for (let circleID in ringConnections) {
        let circle = document.getElementById(circleID);
        for (let ring of circle.getElementsByClassName('ring')) circle.removeChild(ring);

        for (let targetID of ringConnections[circleID]) {
            // Create ring if it doesn't exist
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
    updateRings();
    selectedCircle.style.left = `${e.clientX - offsetX}px`;
    selectedCircle.style.top = `${e.clientY - offsetY}px`;
}

function endDrag() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', endDrag);
    updateRings();
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
    updateRings();
    const touch = e.touches[0];
    selectedCircle.style.left = `${touch.clientX - offsetX}px`;
    selectedCircle.style.top = `${touch.clientY - offsetY}px`;
}

function endTouch() {
    document.removeEventListener('touchmove', touchDrag);
    document.removeEventListener('touchend', endTouch);
    updateRings();
    selectedCircle.classList.remove('selected');
    selectedCircle = null;
}

for (let circle of circles) {
    circle.addEventListener('mousedown', startDrag);
    circle.addEventListener('touchstart', startTouch);
}

// Initial ring update
updateRings();