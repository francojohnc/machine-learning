const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
//load image
const img = new Image();
img.onload = onload;
img.src = '../data/lena.jpg'

// https://img.ly/blog/how-to-apply-filters-in-javascript/
// https://www.youtube.com/watch?v=qPKsVAI_W6M
function onload() {
    canvas.width = img.width * 2;
    canvas.height = img.height;
    // draw original image
    ctx.drawImage(img, 0, 0)
    draw()
}

// 2D array of filter
// you can change value of the filter
// let filter = [
//     [-1, 1, 0],
//     [-1, 1, 0],
//     [-1, 1, 0]
// ];
const filter = [
    [1, 2],
    [-1, 0],
]

function draw() {
    const image = ctx.getImageData(0, 0, img.width, img.height); // image data is 1D array
    const stride = 2; // the number of pixels move the filter
    const output = new ImageData(image.width, image.height); // the output image
    for (let y = 0; y < image.height; y += stride) {
        for (let x = 0; x < image.width; x += stride) {
            let sumR = 0;
            let sumG = 0;
            let sumB = 0;
            for (let i = 0; i < filter.length; i++) {
                for (let j = 0; j < filter[0].length; j++) {
                    const index = (x + j) + (y + i) * image.width;
                    const channel = index * 4;
                    const factor = filter[i][j];
                    sumR += image.data[channel + 0] * factor;
                    sumG += image.data[channel + 1] * factor;
                    sumB += image.data[channel + 2] * factor;
                }
            }
            const index = x + y * output.width;
            const channel = index * 4;
            output.data[channel + 0] = sumR;
            output.data[channel + 1] = sumG;
            output.data[channel + 2] = sumB;
            output.data[channel + 3] = 255;
        }
    }
    // draw to canvas
    ctx.putImageData(output, image.width, 0);
}
