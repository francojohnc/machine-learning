const percent_element = document.getElementById("percent");
const predict_element = document.getElementById("predict");
const canvas = document.getElementById("canvas");
canvas.width = 400;
canvas.height = 400;

const drawing = document.createElement('canvas');
drawing.width = 400;
drawing.height = 400;
const ctx = canvas.getContext("2d");

let mnist;
let train_index = 0;
let test_index = 0;
let total_tests = 0;
let correct = 0;
let isDrawing = false;
const nn = new NeuralNetwork([784, 10]);
const size = 784;

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
    const error = nn.train(inputs, targets);
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


const handler = function (event) {
    const bound = canvas.getBoundingClientRect();
    const x = event.clientX - bound.left;
    const y = event.clientY - bound.top;
    const ctx = drawing.getContext('2d');
    switch (event.type) {
        case 'pointerdown':
            canvas.addEventListener('pointerup', handler);
            canvas.addEventListener('pointermove', handler);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineWidth = 40;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.strokeStyle = 'black';
            break;
        case 'pointerup':
            canvas.removeEventListener('pointerup', handler);
            canvas.removeEventListener('pointermove', handler);
            isDrawing = true;
            break;
        case 'pointermove':
            ctx.lineTo(x, y);
            ctx.stroke();
            break;
        default:
    }
}

function keydown(event) {
    if (event.key === 'Backspace') {
        drawing.getContext('2d').clearRect(0, 0, drawing.width, drawing.height);
        isDrawing = false;
    }
}

canvas.addEventListener('pointerdown', handler);
document.addEventListener('keydown', keydown);

function imageToCanvas(image) {
    const temp = document.createElement('canvas');
    temp.width = image.width;
    temp.height = image.height;
    temp.getContext('2d').putImageData(image, 0, 0);
    return temp;
}

function show(inputs) {
    const image = new ImageData(28, 28);
    for (let i = 0; i < inputs.length; i++) {
        const bright = inputs[i] * 255;
        const channel = i * 4;// 4 channel RGBA
        image.data[channel + 0] = bright;// R
        image.data[channel + 1] = bright;// G
        image.data[channel + 2] = bright;// B
        image.data[channel + 3] = 255;  //  A
    }
    ctx.drawImage(imageToCanvas(image), 0, 0, canvas.width, canvas.height);
}

function getDrawingPixel() {
    const temp = document.createElement('canvas');
    temp.width = 28;
    temp.height = 28;
    temp.getContext('2d').drawImage(drawing, 0, 0, temp.width, temp.height);
    return temp.getContext('2d').getImageData(0, 0, temp.width, temp.height);
}

function guess() {
    const inputs = [];
    const image = getDrawingPixel();
    for (let i = 0; i < size; i++) {
        inputs[i] = 255 - image.data[i * 4 + 3];
    }
    const output = softmax(nn.predict(inputs));
    predict_element.innerText = output;
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 5; i++) {
        train();
    }
    test();
    // draw digit
    if (isDrawing) {
        guess();
    } else {
        predict_element.innerText = '_';
    }
    ctx.drawImage(drawing, 0, 0);
    // show actual data
    // const image = getDrawingPixel();
    // ctx.putImageData(image, 0, 0);
    requestAnimationFrame(draw);
}
