const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const percent_element = document.getElementById("percent");

let mnist;
let train_index = 1;
let test_index = 0;
let total_tests = 0;
let correct = 0;
const size = 784;
const padding = 10;
const scale = 100;
const width = (scale + padding) * 5 - padding;
const height = (scale + padding) * 2 - padding;
canvas.width = width;
canvas.height = height;
const nn = new NeuralNetwork([size, 10]);

load().then(data => {
    mnist = data;
    draw();
});

function softmax(inputs) {
    let record = 0;
    let index = 0;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i] > record) {
            record = inputs[i];
            index = i;
        }
    }
    return index;

}

function train() {
    const inputs = [];
    for (let i = 0; i < 784; i++) {
        const bright = mnist.train_images[i + train_index * size];
        inputs[i] = (255 - bright) / 255;
    }
    const label = mnist.train_labels[train_index];
    const targets = new Array(10).fill(0);
    targets[label] = 1;
    const error = nn.train(inputs, targets, 0.03);
    train_index++;
    if (train_index == mnist.train_labels.length) {
        train_index = 0;
    }
    return inputs;
}

function test() {
    let inputs = [];
    for (let i = 0; i < 784; i++) {
        let bright = mnist.test_images[i + test_index * size];
        inputs[i] = (255 - bright) / 255;
    }
    let label = mnist.test_labels[test_index];
    let prediction = nn.predict(inputs);
    let guess = softmax(prediction);
    total_tests++;
    if (guess == label) {
        correct++;
    }
    let percent = (100 * (correct / total_tests)).toFixed(2);
    percent_element.innerText = percent + '%';
    test_index++;
    if (test_index == mnist.test_labels.length) {
        test_index = 0;
        console.log('accuracy', percent);
        total_tests = 0;
        correct = 0;
    }
}


function imageToCanvas(image) {
    const temp = document.createElement('canvas');
    temp.width = image.width;
    temp.height = image.height;
    temp.getContext('2d').putImageData(image, 0, 0);
    return temp;
}

function show(inputs, x, y) {
    const image = new ImageData(28, 28);
    for (let i = 0; i < inputs.length; i++) {
        const bright = inputs[i] * 255;
        const channel = i * 4;// 4 channel RGBA
        image.data[channel + 0] = bright;// R
        image.data[channel + 1] = bright;// G
        image.data[channel + 2] = bright;// B
        image.data[channel + 3] = 255;  //  A
    }
    ctx.drawImage(imageToCanvas(image), x, y, scale, scale);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 10; i++) {
        train();
    }
    test();
    const weights = nn.weights;
    const matrix = weights[0];
    const data = matrix.data;
    for (let i = 0; i < data.length; i++) {
        const x = (i % 5) * (scale + padding);
        const y = Math.floor(i / 5) * (scale + padding);
        show(data[i], x, y);
    }
    requestAnimationFrame(draw);
}
