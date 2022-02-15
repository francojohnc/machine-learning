class ConvolutionalNeuralNetwork {
    constructor(layers) {
        this.kernels = [];
        this.biases = [];
        for (let i = 1; i < layers.length; i++) {
            const input = layers[i - 1];
            const output = layers[i];
            const weight = new Matrix(output, input);
            const bias = new Matrix(output, 1);
            weight.random(-0.5, 0.5);
            bias.random(-0.5, 0.5);
            this.kernels.push(weight);
            this.biases.push(bias);
        }
    }
}
