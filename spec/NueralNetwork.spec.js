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
    xit('should train ', function () {
        const nodes = [2, 2, 1];
        const nn = new NeuralNetwork(nodes);
        const inputs = [1, 1];
        const targets = [1];
        nn.train(inputs, targets);
    });
    xit('should activate', function () {
        const nodes = [2, 2, 1];
        const nn = new NeuralNetwork(nodes);
        nn.activation = function (x) {
            return x;
        }
        // set data
        // nn.weights[0].data = [[0.2, 0.1]];
        // nn.weights[1].data = [[0.3]];
        // nn.biases[0].data = [[0]];
        // nn.biases[1].data = [[0]];
        const input = [1, 1];
        const label = [1];
        nn.train(input, label);
        // console.log();
        // console.log(nn.predict(input));
        // console.log(nn.train(input, label,0.1));
        // console.log(nn.train(input, label,0.1));
        // expect(nn.predict(input)).toEqual([0]);
        // const output = nn.train(input, label);
        // console.log(output);
        // console.log(nn.predict(input));


    });
});
