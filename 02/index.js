const canvas = document.getElementById("canvas");
canvas.width = 500;
canvas.height = 500;

const ctx = canvas.getContext("2d");

const coordinate = new Coordinate(canvas.width, canvas.height);
const interval = canvas.width / 20;
coordinate.setOptions('axis', {interval});

const points = [];

function handleClick(event) {
    const bound = canvas.getBoundingClientRect();
    const x = event.clientX - bound.left;
    const y = event.clientY - bound.top;
    const point = {
        x: coordinate.pixelX(x),
        y: coordinate.pixelY(y)
    };
    points.push(point);
}

canvas.addEventListener("click", handleClick);
let m = 0;
let b = 0;

function f(x) {
    return m * x + b;
}

// linear regression ordinary least squares
// m = Σ(x-x')(y-y') / Σ(x-x')²
// b = y' - mx'
function linear() {
    let xsum = 0;
    let ysum = 0;
    for (let p of points) {
        let x = p.x;
        let y = p.y;
        xsum += x;
        ysum += y;
    }
    let xmean = xsum / points.length; // x average
    let ymean = ysum / points.length; // y average
    let num = 0; // numerator
    let dem = 0; // denominator
    for (let p of points) {
        let x = p.x;
        let y = p.y;
        num += (x - xmean) * (y - ymean);
        dem += (x - xmean) * (x - ymean);
    }
    m = num / dem;
    b = ymean - m * xmean;
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
            type: "fill",
            color: "red"
        });
    }
    const x1 = -10;
    const y1 = f(x1);
    const x2 = 10;
    const y2 = f(x2);
    coordinate.drawLine(ctx, {x: x1, y: y1}, {x: x2, y: y2}, {color: 'black'});
    linear();
    ctx.restore();
    requestAnimationFrame(draw);
}

draw();
