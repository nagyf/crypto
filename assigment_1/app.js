const fs = require('fs');
const readline = require('readline');
const _ = require('lodash');
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

        for (let j = i+1; j < cipherTexts.length; ++j) {
            const b = cipherTexts[j];
            const m1m2 = otp.xor(a, b); // we get back here the 2 original messages xor-ed
            const matches = otp.breakIt(a, b, m1m2);
            if(matches.length > 0) {
                console.log(`(${i+1}, ${j+1})`);
                console.log(m1m2);
                _.forEach(matches, match => console.log(match));
            }
        }
    }
}

function main() {
    readCipherTexts(processCipherTexts);
}

// Start the application
(function () {
    // main();

    const m = otp.asciiToHex('We can see the point where the chip is unhappy if a wrong bit is sent and consumes more power from the environment - Adi Shamir');
    const c = '315c4eeaa8b5f8bffd11155ea506b56041c6a00c8a08854dd21a4bbde54ce56801d943ba708b8a3574f40c00fff9e00fa1439fd0654327a3bfc860b92f89ee04132ecb9298f5fd2d5e4b45e40ecc3b9d59e9417df7c95bba410e9aa2ca24c5474da2f276baa3ac325918b2daada43d6712150441c2e04f6565517f317da9d3';
    const k = otp.xor(m, c);

    // And here is the solution
    console.log(otp.decrypt(k, '32510ba9babebbbefd001547a810e67149caee11d945cd7fc81a05e9f85aac650e9052ba6a8cd8257bf14d13e6f0a803b54fde9e77472dbff89d71b57bddef121336cb85ccb8f3315f4b52e301d16e9f52f904'));
})();


