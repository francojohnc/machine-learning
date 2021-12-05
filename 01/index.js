const canvas = document.getElementById("canvas");
canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext("2d");
const weights = {
    x: Math.random(),
    y: Math.random(),
}

function generatePoints(amount) {
    const points = [];
    for (let i = 0; i < amount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const label = x > y ? 1 : -1;
        points.push({
            x: x,
            y: y,
            label: label
        });
    }
    return points;
}

let points = generatePoints(100);

function activation(n) {
    return n > 0 ? 1 : -1;
}

function predict(point) {
    const sum = point.x * weights.x + point.y * weights.y;
    return activation(sum);
}

function handleClick(event) {
    const bound = canvas.getBoundingClientRect();
    const x = event.clientX - bound.left;
    const y = event.clientY - bound.top;
    target = {
        x: x,
        y: y
    };
    points = generatePoints(100);
}

canvas.addEventListener("click", handleClick);
const learningRate = 0.0001;

function train(input, label) {
    const output = predict(input);
    const error = label - output;
    weights.x += input.x * error * learningRate;
    weights.y += input.y * error * learningRate;
}

let index = 0;

function training() {
    index++;
    if (index >= points.length) {
        index = 0;
    }
    const point = points[index];
    train(point, point.label);
}

function draw() {
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //draw line
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();
    // draw the points
    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgb(255,0,0)";
        const output = predict(point);
        if (output === 1) {
            ctx.fillStyle = "rgb(0,0,255)";
        } else {
            ctx.fillStyle = "rgb(255,0,0)";
        }
        ctx.fill();
    }
    training();
    requestAnimationFrame(draw);
}

draw();
