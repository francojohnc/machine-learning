const canvas = document.getElementById("canvas");
canvas.width = 500;
canvas.height = 500;

const ctx = canvas.getContext("2d");

const coordinate = new Coordinate(canvas.width, canvas.height);
const perceptron = new Perceptron();
const interval = canvas.width / 20;
coordinate.setOptions('axis', {interval, color: 'black'});

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function generatePoints(target, amount, range) {
    const points = [];
    for (let i = 0; i < amount; i++) {
        const x = random(target.x - range, target.x + range);
        const y = random(target.y - range, target.y + range);
        const label = x + y > 0 ? 1 : -1;
        points.push({
            x: x,
            y: y,
            label: label
        });
    }
    return points;
}

let target = {
    x: random(-7, 7),
    y: random(-7, 7)
};
let points = generatePoints(target, 100, 9);
let learningRate = 0.001;
let index = 0;

function handleClick(event) {
    const bound = canvas.getBoundingClientRect();
    const x = event.clientX - bound.left;
    const y = event.clientY - bound.top;
    target = {
        x: coordinate.pixelX(x),
        y: coordinate.pixelY(y)
    };
    points = generatePoints(target, 100, 9);
}

canvas.addEventListener("click", handleClick);


function training() {
    index++;
    if (index >= points.length) {
        index = 0;
    }
    const point = points[index];
    const inputs = [point.x, point.y, 1];
    perceptron.train(inputs, point.label, learningRate);
}

function y(x) {
    const w0 = perceptron.weights[0];// x
    const w1 = perceptron.weights[1];// y
    const w2 = perceptron.weights[2];// b
    // (b / y) - (x / y) * x
    return (w2 / w1) - (w0 / w1) * x;
}


function draw() {
    // draw coordinate
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    coordinate.goToOrigin(ctx);
    coordinate.drawAxis(ctx);
    // draw the points
    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const inputs = [point.x, point.y, 1];
        const output = perceptron.predict(inputs);
        coordinate.drawPoint(ctx, point, {
            type: 'fill',
            color: output === 1 ? 'blue' : 'red',
            radius: 4
        });
    }
    // draw the actual line
    const x1 = -10;
    const y1 = 10;
    const x2 = 10;
    const y2 = -10;
    coordinate.drawLine(ctx, {x: x1, y: y1}, {x: x2, y: y2}, {color: 'black'});
    // draw the predict line
    const from = {x: x1, y: y(x1)};
    const to = {x: x2, y: y(x2)};
    coordinate.drawLine(ctx, from, to, {color: 'green'});
    ctx.restore();
    training();
    requestAnimationFrame(draw);
}

draw();
