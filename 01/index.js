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
let trainingData = generatePoints(target, 50, 3);
var model = {
    x: 10 * 2 * (0.5 - Math.random()),
    y: 10 * 2 * (0.5 - Math.random())
};

function handleClick(event) {
    const clientRect = canvas.getBoundingClientRect();
    const x = event.clientX - clientRect.left;
    const y = event.clientY - clientRect.top;
    target = {
        x: coordinate.pixelX(x),
        y: coordinate.pixelY(y)
    };
    trainingData = generatePoints(target, 50, 3);
}

canvas.addEventListener("click", handleClick);
var learningRate = 0.01;
var dataIndex = 0;

function learning(output, labeled) {
    var dE_dX = (labeled.x - output.x) * -1;
    var dE_dY = (labeled.y - output.y) * -1;
    var gradientX = dE_dX;
    var gradientY = dE_dY;
    model.x += learningRate * -gradientX;
    model.y += learningRate * -gradientY;
    return model;
}

function training() {
    dataIndex++;
    dataIndex = dataIndex >= trainingData.length ? 0 : dataIndex;
    model = learning(model, trainingData[dataIndex]);
}

function draw() {
    // draw coordinate
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    coordinate.goToOrigin(ctx);
    coordinate.drawAxis(ctx);
    for (let i = 0; i < trainingData.length; i++) {
        coordinate.drawPoint(ctx, trainingData[i], {
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
