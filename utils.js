// utils.js


function getDecimalPlaces(num) {
    const str = num.toString();
    const dotIndex = str.indexOf('.');
    return dotIndex === -1 ? 0 : str.length - dotIndex - 1;
}


function safeAdd(a, b) {
    const maxPlaces = Math.max(getDecimalPlaces(a), getDecimalPlaces(b));
    const factor = Math.pow(10, maxPlaces);
    return (a * factor + b * factor) / factor;
}


function safeMultiply(a, b) {
    const decimalPlacesA = getDecimalPlaces(a);
    const decimalPlacesB = getDecimalPlaces(b);
    const factor = Math.pow(10, decimalPlacesA + decimalPlacesB);
    return (a * b * factor) / factor;
}


function safeSubtract(a, b) {
    const maxPlaces = Math.max(getDecimalPlaces(a), getDecimalPlaces(b));
    const factor = Math.pow(10, maxPlaces);
    return (a * factor - b * factor) / factor;
}
