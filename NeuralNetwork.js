if (typeof global !== 'undefined') {
    global.Matrix = require('./Matrix');
}

class NeuralNetwork {
    constructor(layers) {
        this.weights = [];
        this.biases = [];
        for (let i = 1; i < layers.length; i++) {
            const input = layers[i - 1];
            const output = layers[i];
            const weight = new Matrix(output, input);
            const bias = new Matrix(output, 1);
            weight.random();
            bias.random();
            this.weights.push(weight);
            this.biases.push(bias);
        }
    }

    forward(inputs) {
        inputs = Matrix.fromArray(inputs);
        const outputs = [inputs];
        for (let i = 0; i < this.weights.length; i++) {
            const weight = this.weights[i];
            const sum = Matrix.multiply(weight, inputs);
            const bias = this.biases[i];
            sum.add(bias);
            sum.map(this.activation);
            inputs = sum;
            outputs.push(sum);
        }
        return outputs;
    }

    predict(inputs) {
        const outputs = this.forward(inputs);
        return outputs[outputs.length - 1].toArray();
    }

    // in the forward propagation add all result into array an pass into back propagation
    // Δm = rate * x * error
    // Δb = rate * error
    train(inputs, targets, rate = 0.01) {
        const outputs = this.forward(inputs);
        const output = outputs[outputs.length - 1];
        let error = Matrix.subtract(Matrix.fromArray(targets), output);
        for (let i = this.weights.length - 1; i >= 0; i--) {
            const weight = this.weights[i];
            const bias = this.biases[i];
            const input = outputs[i];
            const output = outputs[i + 1];
            const gradient = Matrix.map(output, this.derivative);
            gradient.multiply(error);
            gradient.multiply(rate);
            const delta = Matrix.multiply(gradient, Matrix.transpose(input));
            weight.add(delta);
            bias.add(gradient);
            error = Matrix.multiply(Matrix.transpose(weight), error);
        }
        return output.toArray();
    }

    derivative(x) {
        return x * (1 - x);
    }

    activation(x) {
        return 1 / (1 + Math.exp(-x));
    }
}

if (typeof module !== 'undefined') {
    module.exports = NeuralNetwork;
}
