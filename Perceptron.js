class Perceptron {
    constructor() {
        this.weights = [
            Math.random(),
            Math.random(),
            0,
        ];
    }
    predict(inputs) {
        let sum = 0;
        for (let i = 0; i < this.weights.length; i++) {
            sum += inputs[i] * this.weights[i];
        }
        return this.activation(sum);
    }
    train(inputs, label, rate) {
        const output = this.predict(inputs);
        const error = label - output;
        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i] += inputs[i] * error * rate;
        }
    }

    activation(sum) {
        return sum > 0 ? 1 : -1;
    }
}
