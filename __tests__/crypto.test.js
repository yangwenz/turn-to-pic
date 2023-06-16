import "@testing-library/jest-dom";
import * as CryptoJS from 'crypto-js';
import {encrypt, decrypt, hashHistoryRecord} from "../utils/crypto";

describe("Crypto", () => {
    it("test encrypt and decrypt", () => {
        const key = CryptoJS.enc.Utf8.parse('4512631236589784');
        const iv = CryptoJS.enc.Utf8.parse('4512631236589784');
        const data = "r8_PT67qpcPYfcc94KOzLlibxxxxxxxxxxxxxxxx";
        const encrypted = encrypt(data, key, iv);
        const decrypted = decrypt(encrypted, key, iv);
        expect(decrypted).toEqual(data);

        const obj = {
            hero: "Crystal Maiden",
            style: "Default",
            prompt: "standing",
            negativePrompt: "",
            width: 480,
            height: 720,
            imageUrl: "https://xxx",
            dataUrl: "xxx"
        }
        const hash = hashHistoryRecord(obj);
        console.log(hash);
    });
});
