let _ = require('lodash');
let fs = require('fs');
let sjcl = require('sjcl');

/**
 * Read a file as byte blocks.
 *
 * @param filename the filename to read
 * @param blockSize the block size in bytes (e.g. 1024)
 * @return {Array}
 */
function readBlocks(filename, blockSize) {
    const fileContent = fs.readFileSync(filename);
    return _.chunk(fileContent, blockSize);
}

/**
 * Hash a series of data blocks backwards, thus hashing the last block first, then append the result hash to the second
 * last block and hash that too, then append that hash to the third block from the end, and hash it, and so forth.
 * The result will be the final hash: h0.
 *
 * @param blocks an array of data blocks
 * @return {*} the final SHA-256 hash
 */
function hashBlocksBackwards(blocks) {
    let lastHash = null;

    _.forEachRight(blocks, function (block) {
        lastHash = hashBlock(block, lastHash);
    });

    return lastHash;
}

/**
 * Hashes a block using SHA-256 hash algorithm.
 * If a previous hash is given, append it to the end of the block before hashing.
 *
 * @param block the block of data
 * @param lastHash the hash to append to the data, can be null
 * @return {bitArray} the SHA-256 hash of the block
 */
function hashBlock(block, lastHash) {
    if (lastHash !== null) {
        block = block.concat(fromBitsToBytes(lastHash));
    }
    return sjcl.hash.sha256.hash(fromBytesToBits(block));
}

/**
 * Copied from the sjcl library's core/codecBytes.js file, because it was unaccessible at the time of the writing of
 * this program.
 */
function fromBitsToBytes(arr) {
    let out = [], bl = sjcl.bitArray.bitLength(arr), i, tmp;
    for (i = 0; i < bl / 8; i++) {
        if ((i & 3) === 0) {
            tmp = arr[i / 4];
        }
        out.push(tmp >>> 24);
        tmp <<= 8;
    }
    return out;
}

/**
 * Copied from the sjcl library's core/codecBytes.js file, because it was unaccessible at the time of the writing of
 * this program.
 */
function fromBytesToBits(bytes) {
    let out = [], i, tmp = 0;
    for (i = 0; i < bytes.length; i++) {
        tmp = tmp << 8 | bytes[i];
        if ((i & 3) === 3) {
            out.push(tmp);
            tmp = 0;
        }
    }
    if (i & 3) {
        out.push(sjcl.bitArray.partial(8 * (i & 3), tmp));
    }
    return out;
}


// Sample file with the corresponding final hash with the algorithm defined in the assignment
const sample_filename = '6.2.birthday.mp4_download';
const sample_hash = '03c08f4ee0b576fe319338139c045c89c3e8e9409633bea29442e21425006ea8';

const blocks = readBlocks(sample_filename, 1024);
const hash = hashBlocksBackwards(blocks);
const hashAsString = sjcl.codec.hex.fromBits(hash);

console.log(hashAsString);
console.log(hashAsString === sample_hash);