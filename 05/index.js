const canvas = document.getElementById("canvas");
canvas.width = 500;
canvas.height = 500;

const ctx = canvas.getContext("2d");

const coordinate = new Coordinate(canvas.width, canvas.height);
const interval = canvas.width / 20;
coordinate.setOptions('axis', {interval});

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function generatePoints(target, amount, range) {
    const points = [];
    for (let i = 0; i < amount; i++) {
        const x = random(target.x - range, target.x + range);
        const y = random(target.y - range, target.y + range);
        points.push({
            x: x,
            y: y
        });
    }
    return points;
}

let target = {
    x: random(-7, 7),
    y: random(-7, 7)
};
let points = generatePoints(target, 50, 3);
let model = {
    x: random(-8, 8),
    y: random(-8, 8)
};
let learningRate = 0.01;
let index = 0;

function handleClick(event) {
    const bound = canvas.getBoundingClientRect();
    const x = event.clientX - bound.left;
    const y = event.clientY - bound.top;
    target = {
        x: coordinate.pixelX(x),
        y: coordinate.pixelY(y)
    };
    points = generatePoints(target, 50, 3);
}

canvas.addEventListener("click", handleClick);

function training() {
    index++;
    if (index >= points.length) {
        index = 0;
    }
    const point = points[index];
    const errorX = point.x - model.x;
    const errorY = point.y - model.y;
    model.x += errorX * learningRate;
    model.y += errorY * learningRate;
}

function draw() {
    // draw coordinate
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    coordinate.goToOrigin(ctx);
    coordinate.drawAxis(ctx);
    for (let i = 0; i < points.length; i++) {
        coordinate.drawPoint(ctx, points[i], {
            type: "stroke",
        });
    }
    // draw model
    coordinate.drawPoint(ctx, model, {
        type: "fill",
        color: "red"
    });
    ctx.restore();
    training();
    requestAnimationFrame(draw);
}

draw();
