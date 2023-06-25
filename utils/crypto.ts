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

export function hashHistoryRecord(r: {
    hero: string,
    style: string,
    prompt: string,
    negativePrompt: string,
    width: number,
    height: number,
    imageUrl?: string;
    dataUrl?: string;
}) {
    const prefix = "YJY936zEW3";
    const suffix = "2NRX0sFpZ5";
    const info = `${r.hero} ${r.style} ${r.prompt} ${r.negativePrompt} ${r.width} ${r.height} ${r.imageUrl} ${r.dataUrl}`;
    return CryptoJS.SHA256(prefix + info + suffix).toString();
}

export function getUploadKey() {
    return process.env.NEXT_PUBLIC_UPLOAD_KEY!;
}
