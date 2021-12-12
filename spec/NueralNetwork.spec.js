const NeuralNetwork = require('../NeuralNetwork');
const Matrix = require('../Matrix');
describe('NeuralNetwork', function () {
    it('should predict ', function () {
        const nodes = [2, 2, 1];
        const nn = new NeuralNetwork(nodes);

        function activation(n) {
            return n + 2;
        }

        nn.activation = activation;
        // check weights
        expect(nn.weights.length).toEqual(2);
        expect(nn.weights[0].rows).toEqual(2);
        expect(nn.weights[0].cols).toEqual(2);
        expect(nn.weights[1].rows).toEqual(1);
        expect(nn.weights[1].cols).toEqual(2);
        // check biases
        expect(nn.biases.length).toEqual(2);
        expect(nn.biases[0].rows).toEqual(2);
        expect(nn.biases[0].cols).toEqual(1);
        expect(nn.biases[1].rows).toEqual(1);
        expect(nn.biases[1].cols).toEqual(1);
        // set data
        nn.weights[0].data = [[1, 2], [3, 4]];
        nn.weights[1].data = [[1, 1]];
        nn.biases[0].data = [[-1], [-1]];
        nn.biases[1].data = [[-1]];
        const inputs = [0, 2];
        // compute
        const sum_0 = Matrix.multiply(nn.weights[0], Matrix.fromArray(inputs));
        expect(sum_0.data).toEqual([[4], [8]]);
        sum_0.add(nn.biases[0]);
        sum_0.map(activation);
        expect(sum_0.data).toEqual([[5], [9]]);
        const sum_1 = Matrix.multiply(nn.weights[1], sum_0);
        expect(sum_1.data).toEqual([[14]]);
        sum_1.add(nn.biases[1]);
        sum_1.map(activation);
        expect(sum_1.data).toEqual([[15]]);
        const output = nn.predict(inputs);
        expect(output).toEqual(sum_1.data[0]);
    });
    it('should train single row', function () {
        const nodes = [1, 1, 1];
        const nn = new NeuralNetwork(nodes);

        function activation(n) {
            return n;
        }

        nn.activation = activation;
        nn.derivative = activation;
        nn.weights[0].data = [[1]];
        nn.weights[1].data = [[1]];
        nn.biases[0].data = [[-1]];
        nn.biases[1].data = [[-1]];
        const inputs = [0];
        const targets = [1];
        const rate = 1;
        const output = nn.train(inputs, targets, rate);// -2
        const error = targets[0] - output[0];// 1 - -2 = 3
        const gradient1 = output[0] * error * rate;// -6
        const gradient0 = -1 * error * rate;// -3
        const w1 = 1 + gradient1 * -1; // 7
        const w0 = 1 + gradient0 * inputs[0];// 1
        expect(nn.weights[1].data).toEqual([[w1]]);
        expect(nn.weights[0].data).toEqual([[w0]]);
        // compute bias
        const b1 = -1 + gradient1;// -7
        const b0 = -1 + gradient0;// -4
        expect(nn.biases[1].data).toEqual([[b1]]);
        expect(nn.biases[0].data).toEqual([[b0]]);
    });
    it('should train multiple row', function () {
        const nodes = [2, 2, 1];
        const nn = new NeuralNetwork(nodes);

        function activation(n) {
            return n;
        }

        nn.activation = activation;
        nn.derivative = activation;
        nn.weights[0].data = [[1, 2], [3, 4]];
        nn.weights[1].data = [[1, 1]];
        nn.biases[0].data = [[-1], [-1]];
        nn.biases[1].data = [[-1]];
        const inputs = [1, 1];
        const targets = [1];
        const rate = 1;
        const error = Matrix.fromArray([-6, -6]);
        const gradient = Matrix.fromArray([2, 6]);
        gradient.multiply(error);
        gradient.multiply(rate);
        const delta = Matrix.multiply(gradient, Matrix.transpose(Matrix.fromArray([1, 1])));
        const w0 = Matrix.add(nn.weights[0], delta);
        expect(nn.train(inputs, targets, 1)).toEqual([7]);
        expect(nn.weights[0].data).toEqual([[-11, -10], [-33, -32]]);
        expect(nn.weights[1].data).toEqual([[-83, -251]]);
    });
});
