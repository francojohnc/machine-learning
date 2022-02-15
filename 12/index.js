const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
//load image
const img = new Image();
img.onload = onload;
img.src = '../data/lena.jpg'

function onload() {
    canvas.width = img.width * 2;
    canvas.height = img.height;
    // draw original image
    ctx.drawImage(img, 0, 0)
    draw()
}

function imageToCanvas(image) {
    const temp = document.createElement('canvas');
    temp.width = image.width;
    temp.height = image.height;
    temp.getContext('2d').putImageData(image, 0, 0);
    return temp;
}

function draw() {
    const image = ctx.getImageData(0, 0, img.width, img.height); // image data is 1D array
    const stride = 2; // the number of pixels move the filter
    const output = new ImageData(image.width / stride, image.height / stride); // the output image
    for (let y = 0; y < image.height; y += stride) {
        for (let x = 0; x < image.width; x += stride) {
            let maxR = 0;
            let maxG = 0;
            let maxB = 0;
            for (let i = 0; i < stride; i++) {
                for (let j = 0; j < stride; j++) {
                    const index = (x + j) + (y + i) * image.width;
                    const channel = index * 4;
                    maxR = Math.max(maxR, image.data[channel + 0]);
                    maxG = Math.max(maxG, image.data[channel + 1]);
                    maxB = Math.max(maxB, image.data[channel + 2]);
                }
            }
            const px = x / stride;
            const py = y / stride;
            const index = px + py * output.width;
            const channel = index * 4;
            output.data[channel + 0] = maxR;
            output.data[channel + 1] = maxG;
            output.data[channel + 2] = maxB;
            output.data[channel + 3] = 255;
        }
    }
    // draw to canvas
    ctx.drawImage(imageToCanvas(output), image.width, 0, image.width, image.height);
}
