import aesjs from 'aes-js';
import {pbkdf2Sync} from 'crypto-browserify';

function postData(url, data) {
    return fetch(url, {
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST'
    }).then(response => response.json());
}

function encryptText(plainText, key, salt) {
    let hashedKey = pbkdf2Sync(key, salt, 10000, 256 / 8, 'sha512');
    let textBytes = aesjs.utils.utf8.toBytes(plainText);
    let aesCtr = new aesjs.ModeOfOperation.ctr(hashedKey, new aesjs.Counter(5));
    let encryptedBytes = aesCtr.encrypt(textBytes);

    return aesjs.utils.hex.fromBytes(encryptedBytes);
}

function decryptText(encryptedText, key, salt) {
    let hashedKey = pbkdf2Sync(key, salt, 10000, 256 / 8, 'sha512');
    let encryptedBytes = aesjs.utils.hex.toBytes(encryptedText);
    let aesCtr = new aesjs.ModeOfOperation.ctr(hashedKey, new aesjs.Counter(5));
    let decryptedBytes = aesCtr.decrypt(encryptedBytes);

    return aesjs.utils.utf8.fromBytes(decryptedBytes);
}

const utils = { postData, encryptText, decryptText };
export default utils;