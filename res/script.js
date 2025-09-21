// Get references to DOM elements
const text = document.getElementById("text");
const nextButton = document.getElementById("nextButton");

let texts = [ // Texts to display
    "Welcome to the triangulation demonstration!",
    "This is a circle. Try dragging it around!",
    "Now we have two circles!",
    "And now they are connected with a line! The distance between them is shown below the line.",
    "Now we have a third point. Now, if we want to know the position of this point, how would you do it?",
    "We could take the distance to both points...",
    "...which means the point must be somewhere on this circle...",
    "...and this circle, which gives us two possible positions for the point.",
    "By adding a fourth point...",
    "...we eliminate the ambiguity! (As long as the three points aren't collinear)",
    "You can extend this to 3D space by noticing that the intersection of two spheres is a circle!",
    "Now, play around and have some fun with the points! :D"
];
let currentText = -1; // Start at -1 so the first updateText call sets it to 0

// Define connections between circles
let lineConnections = {}
let ringConnections = {}

// Variables for dragging
let selectedCircle = null;
let offsetX, offsetY;

function updateConnections() {
    for (let circleID in lineConnections) {
        let circle = document.getElementById(circleID);
        for (let line of circle.getElementsByClassName('line')) circle.removeChild(line);

        for (let targetID of lineConnections[circleID]) {
            const line = document.createElement('div');
            line.className = 'line';
            line.style.pointerEvents = 'none';
            circle.appendChild(line);

            const rect1 = circle.getBoundingClientRect();
            const rect2 = document.getElementById(targetID).getBoundingClientRect();

            const angle = Math.atan2(rect2.top - rect1.top, rect2.left - rect1.left) * 180 / Math.PI;
            const distance = Math.hypot(rect2.left - rect1.left, rect2.top - rect1.top);

            line.style.width = `${distance}px`;
            line.style.height = '2px';
            line.style.transform = `rotate(${angle}deg)`;
            line.style.transformOrigin = '0 50%';
            line.style.left = `${rect1.width / 2}px`;
            line.style.top = `${rect1.height / 2}px`;

            const lineText = document.createElement('div');
            lineText.textContent = `${distance.toFixed(0)}px`;
            line.appendChild(lineText);

            lineText.style.position = 'absolute';
            lineText.style.left = `${distance / 2}px`;
            lineText.style.transform = 'translate(-50%)';
            if (Math.abs(angle) > 90) {
                lineText.style.transform = 'translate(-50%) rotate(180deg)';
                lineText.style.top = '-20px';
            }
        }
    }

    for (let circleID in ringConnections) {
        let circle = document.getElementById(circleID);
        for (let ring of circle.getElementsByClassName('ring')) circle.removeChild(ring);

        for (let targetID of ringConnections[circleID]) {
            const ring = document.createElement('div');
            ring.className = 'ring';
            ring.style.pointerEvents = 'none';
            circle.appendChild(ring);

            const rect1 = circle.getBoundingClientRect();
            const rect2 = document.getElementById(targetID).getBoundingClientRect();
            const distance = Math.hypot(rect2.left - rect1.left, rect2.top - rect1.top) * 2;
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

function updateText() {
    currentText++;
    if (currentText === texts.length - 1) nextButton.style.display = 'none';
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
        case 2:
            const circle2 = document.createElement('div');
            circle2.classList.add('circle');
            circle2.id = 'circle2';
            circle2.style.left = '70%';
            circle2.style.top = '50%';
            document.body.appendChild(circle2);
            break;
        case 3:
            lineConnections['circle1'] = ['circle2'];
            break;
        case 4:
            const circle3 = document.createElement('div');
            circle3.classList.add('circle');
            circle3.id = 'circle3';
            circle3.style.left = '60%';
            circle3.style.top = '30%';
            document.body.appendChild(circle3);
            break;
        case 5:
            lineConnections['circle3'] = ['circle1', 'circle2'];
            break;
        case 6:
            ringConnections['circle1'] = ['circle3'];
            break;
        case 7:
            ringConnections['circle2'] = ['circle3'];
            break;
        case 8:
            const circle4 = document.createElement('div');
            circle4.classList.add('circle');
            circle4.id = 'circle4';
            circle4.style.left = '80%';
            circle4.style.top = '30%';
            document.body.appendChild(circle4);
            break;
        case 9:
            ringConnections['circle4'] = ['circle3'];
    }

    // Update circles
    for (let circle of document.getElementsByClassName('circle')) {
        circle.addEventListener('mousedown', startDrag);
        circle.addEventListener('touchstart', startTouch);
    }

    updateConnections(); // Connection update
}

nextButton.addEventListener('click', updateText); // Next button click event

// Initial text update
updateText();