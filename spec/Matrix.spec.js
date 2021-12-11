const Matrix = require('../Matrix');
describe('Matrix static', function () {
    it('matrix dot product', function () {
        const a = new Matrix(2, 2);
        const b = new Matrix(2, 1);
        a.data = [[0, 2], [3, 4]];
        b.data = [[2], [2]];
        const c = Matrix.multiply(a, b);
        expect({...c}).toEqual({
            rows: 2,
            cols: 1,
            data: [[4], [14]]
        });
    });
});
