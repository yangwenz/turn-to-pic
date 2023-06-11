import * as CryptoJS from 'crypto-js';

export function encrypt(
    data: string,
    key: CryptoJS.lib.WordArray,
    iv: CryptoJS.lib.WordArray
): string {
    return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString();
}

export function decrypt(
    data: string,
    key: CryptoJS.lib.WordArray,
    iv: CryptoJS.lib.WordArray
): string {
    const decrypted = CryptoJS.AES.decrypt(data, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}
