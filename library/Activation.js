class Activation extends Layer {
    constructor(activation, activationPrime) {
        super();
        this.activation = activation;
        this.activationPrime = activationPrime;
    }

    forward(input) {
        this.input = input;
        return this.activation(input);
    }

    backward(outputGradient, learningRate) {
        return Matrix.multiply(outputGradient, this.activationPrime(this.input));
    }
}
