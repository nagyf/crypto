const _ = require('lodash');

/**
 * Convert a string that contains hex numbers to a string of ASCII characters
 */
function hexToAscii(hex) {
    let message = '';
    for (let i = 0; i < hex.length; i += 2)
        message += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return message;
}

/**
 * Convert a string that contains ASCII characters to string that contains the hex representation of the characters
 */
function asciiToHex(ascii) {
    let hex = '';
    for (let i = 0; i < ascii.length; ++i) {
        let h = ascii.charCodeAt(i).toString(16);
        if (h === '0') {
            h = '00';
        }
        hex += h;
    }
    return hex;
}

/**
 * Apply XOR on the 2 strings. Both strings must contain hex numbers
 */
function xor(c1, c2) {
    let result = '';
    while (c1.length > 0 && c2.length > 0) {
        const a = parseInt(_.join(_.take(c1, 2), ''), 16);
        const b = parseInt(_.join(_.take(c2, 2), ''), 16);
        let xorValue = (a ^ b).toString(16);
        if (xorValue.length == 1) {
            xorValue = '0' + xorValue;
        }
        result += xorValue;
        c1 = _.drop(c1, 2);
        c2 = _.drop(c2, 2);
    }
    return result;
}

function encrypt(key, message) {
    const m = asciiToHex(message);
    return xor(key, m);
}

function decrypt(key, cipherText) {
    return hexToAscii(xor(key, cipherText));
}

function breakIt(c1, c2, c) {
    const key = asciiToHex(' next produc');
    const matches = [];
    for (let i = 0; i < c.length - key.length; i += 2) {
        const sub = c.substring(i, i + key.length);
        const d = decrypt(key, sub);

        if (d.match(/^[a-zA-Z ]*$/)) {
            matches.push(_.padEnd(_.padStart(d, (i/2) + d.length, '.'), c.length / 2, '.'));
        }
    }

    return matches;
}

module.exports = {
    hexToAscii: hexToAscii,
    asciiToHex: asciiToHex,
    xor: xor,
    encrypt: encrypt,
    decrypt: decrypt,
    breakIt: breakIt
};