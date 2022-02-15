const files = {
    train_images: '../data/mnist/train-images-idx3-ubyte',
    train_labels: '../data/mnist/train-labels-idx1-ubyte',
    test_images: '../data/mnist/t10k-images-idx3-ubyte',
    test_labels: '../data/mnist/t10k-labels-idx1-ubyte',
};
const data = {};

function loadFile(path) {
    return fetch(path).then(response => response.arrayBuffer());
}

function load() {
    return Object.keys(files).reduce((promise, key) => {
        return promise.then(() => loadFile(files[key]))
            .then((buffer) => {
                const header = new DataView(buffer, 0, 32);
                const magic = header.getUint32(); // magic number of mnist
                const offset = magic === 2051 ? 16 : 8;
                data[key] = new Uint8Array(buffer, offset);
                return data;
            });
    }, Promise.resolve())
}
