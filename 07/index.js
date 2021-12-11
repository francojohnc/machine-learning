const canvas = document.getElementById("canvas");
canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext("2d");
const coordinate = new Coordinate(canvas.width, canvas.height);
const interval = canvas.width / 20;
coordinate.setOptions('axis', {interval, color: 'black'});


function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function sigmoidDerivative(x) {
    return sigmoid(x) * (1 - sigmoid(x));
}

function draw() {
    // draw coordinate
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    coordinate.goToOrigin(ctx);
    coordinate.drawAxis(ctx);

    for (let i = -9; i < 9; i += 1) {
        const x = i;
        const y = sigmoid(x) * 9;
        const d = sigmoidDerivative(x) * 9;
        console.log(d);
        coordinate.drawPoint(ctx, {x, y: d}, {color: 'red'});
        coordinate.drawPoint(ctx, {x, y}, {color: 'blue'});
    }

    ctx.restore();
}

draw();
