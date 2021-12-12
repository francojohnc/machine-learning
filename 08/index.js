const canvas = document.getElementById("canvas");
canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext("2d");

const training_data = [
    {
        inputs: [0, 0],
        outputs: [0]
    },
    {
        inputs: [0, 1],
        outputs: [1]
    },
    {
        inputs: [1, 0],
        outputs: [1]
    },
    {
        inputs: [1, 1],
        outputs: [0]
    }
];
const nn = new NeuralNetwork([2, 2, 1]);

function training() {
    for (let i = 0; i < 10; i++) {
        const data = training_data[Math.floor(Math.random() * training_data.length)];
        nn.train(data.inputs, data.outputs, 0.5);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let resolution = 10;
    let cols = canvas.width / resolution;
    let rows = canvas.height / resolution;
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const x1 = i / cols;
            const x2 = j / rows;
            const inputs = [x1, x2];
            const output = nn.predict(inputs);
            const color = output[0] * 255;
            ctx.fillStyle = `rgb(${color},${color},${color})`;
            ctx.fillRect(i * resolution, j * resolution, resolution, resolution);
        }
    }
    training();
    requestAnimationFrame(draw);
}

draw();
