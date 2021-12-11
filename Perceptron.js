class Perceptron {
    constructor(layers) {
        this.weights = [];
        for (let i = 0; i < layers; i++) {
            this.weights.push(Math.random())
        }
    }

    predict(inputs) {
        let sum = 0;
        for (let i = 0; i < this.weights.length; i++) {
            sum += this.weights[i] * inputs[i];
        }
        return this.activation(sum);
    }

    train(inputs, target, rate = 0.01) {
        const output = this.predict(inputs);
        const error = target - output;
        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i] += error * inputs[i] * rate;
        }
        return output;
    }

    activation(sum) {
        return sum > 0 ? 1 : -1;
    }
}

if (typeof module !== 'undefined') {
    module.exports = Perceptron;
}
