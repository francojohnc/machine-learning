const defaults = {
    axis: {
        unit: 1,// step
        max: 10,// max step
        interval: 20, // pixel value per unit
        height: 10, // unit height
        color: "blue",
    },
    text: {
        offset: 14,
        color: "#333",
    },
    point: {
        radius: 3,
        color: "#333",
        type: 'fill'
    }
};

function Coordinate(width, height) {
    this.width = width;
    this.height = height;
    this.options = Object.assign({}, defaults);
}

Coordinate.prototype.setOptions = function (type, options) {
    if (typeof type === "object") {
        Object.assign(this.options, type);
    } else {
        Object.assign(this.options[type], options);
    }
}
Coordinate.prototype.getOrigin = function () {
    return {x: this.width / 2, y: this.height / 2};
}
Coordinate.prototype.goToOrigin = function (context) {
    const origin = this.getOrigin();
    context.translate(origin.x, origin.y);
}
Coordinate.prototype.drawLine = function (context, from, to, options) {
    const color = options && options.color || this.options.axis.color;
    context.beginPath();
    context.moveTo(from.x, -from.y);
    context.lineTo(to.x, -to.y);
    context.strokeStyle = color;
    context.stroke();
}
Coordinate.prototype.drawText = function (context, text, position, options) {
    const color = options && options.color || this.options.text.color;
    const alignment = options && options.alignment || "center";
    context.textAlign = alignment;
    context.fillStyle = color;
    context.fillText(text, position.x, -position.y);
}
Coordinate.prototype.drawAxis = function (context) {
    const origin = this.getOrigin();
    // draw x
    this.drawLine(context, {x: -origin.x, y: 0}, {x: origin.x, y: 0});
    // draw y
    this.drawLine(context, {x: 0, y: origin.y}, {x: 0, y: -origin.y});
    // get options
    const axis = this.options.axis;
    const text = this.options.text;
    const max = axis.max;
    for (let i = -max + 1; i < max; i++) {
        // draw x grid
        this.drawLine(context, {x: this.getX(i), y: axis.height}, {x: this.getX(i), y: 0});
        // draw x label
        this.drawText(context, i, {x: this.getX(i), y: -text.offset}, {alignment: i == 0 ? 'start' : 'center'});
        // draw y grid
        this.drawLine(context, {x: 0, y: this.getY(i)}, {x: axis.height, y: this.getY(i)});
        // draw y label
        this.drawText(context, i, {x: -text.offset, y: this.getY(i)});
    }
}
Coordinate.prototype.getX = function (x) {
    const axis = this.options.axis;
    return x * axis.unit * axis.interval;
}
Coordinate.prototype.getY = function (y) {
    const axis = this.options.axis;
    return -y * axis.unit * axis.interval;
}
Coordinate.prototype.pixelX = function (x) {
    const origin = coordinate.getOrigin();
    return (x - origin.x) / interval;
}
Coordinate.prototype.pixelY = function (y) {
    const origin = coordinate.getOrigin();
    return -(y - origin.y) / interval;
}
Coordinate.prototype.drawPoint = function (context, position, options) {
    const radius = options && options.radius || this.options.point.radius;
    const color = options && options.color || this.options.point.color;
    const type = options && options.type || this.options.point.type;
    const isFill = type === 'fill';
    context.beginPath();
    context.arc(this.getX(position.x), this.getY(position.y), radius, 0, 2 * Math.PI);
    if (isFill) {
        context.fillStyle = color;
        context.fill();
    } else {
        context.strokeStyle = color;
        context.stroke();
    }
}
