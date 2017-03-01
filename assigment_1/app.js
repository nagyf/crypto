const fs = require('fs');
const readline = require('readline');
const otp = require('./otp');

/**
 * Read the cipher texts from a file
 * @param callback the callback that is called when the app is finished reading the whole file
 */
function readCipherTexts(callback) {
    const input = fs.createReadStream('test_input2.txt');
    const rl = readline.createInterface({
        input: input
    });
    const cipherTexts = [];

    // Read it line by line
    rl.on('line', line => {
        cipherTexts.push(line);
    });

    // On close call the callback
    rl.on('close', () => {
        callback(cipherTexts);
    });
}

function processCipherTexts(cipherTexts) {
    for (let i = 0; i < cipherTexts.length - 1; ++i) {
        const a = cipherTexts[i];

        for (let j = i + 1; j < cipherTexts.length; ++j) {
            const b = cipherTexts[j];
            const m1m2 = otp.xor(a, b); // we get back here the 2 original messages xor-ed
            console.log(otp.breakIt(a, b, m1m2));
        }
    }
}

function main() {
    readCipherTexts(processCipherTexts);
}

// Start the application
(function () {
    main();
})();


