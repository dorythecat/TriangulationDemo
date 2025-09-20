// Dragging circles with mouse and touch support
const circles = document.getElementsByClassName("circle");

let selectedCircle = null;
let offsetX, offsetY;

// Update rings to be as big as the distance to the closest circle
function updateRings() {
    for (let ring of document.getElementsByClassName("ring")) {
        const ringRect = ring.getBoundingClientRect();
        const ringCenterX = ringRect.left + ringRect.width / 2;
        const ringCenterY = ringRect.top + ringRect.height / 2;

        let minDistance = Infinity;
        for (let circle of circles) {
            if (circle === ring.parentElement) continue;
            const circleRect = circle.getBoundingClientRect();
            const circleCenterX = circleRect.left + circleRect.width / 2;
            const circleCenterY = circleRect.top + circleRect.height / 2;
            const distance = Math.hypot(circleCenterX - ringCenterX, circleCenterY - ringCenterY);
            if (distance < minDistance) minDistance = distance;
        } ring.style.width = ring.style.height = `${minDistance * 2}px`;
    }
}

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

    // Create and append ring element
    let ring = document.createElement('div');
    ring.className = 'ring';
    ring.style.pointerEvents = 'none';
    circle.appendChild(ring);
}

// Initial ring update
updateRings();