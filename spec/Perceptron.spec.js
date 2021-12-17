const Perceptron = require('../Perceptron');
describe('Perceptron', function () {
    it('should predict', function () {
        const perceptron = new Perceptron(1);
        perceptron.activation = function (x) {
            return x;
        }
        perceptron.weights[0] = 0.2;
        const inputs = [2];
        const target = 1;
        perceptron.train(inputs, target, 1);
    });
});
