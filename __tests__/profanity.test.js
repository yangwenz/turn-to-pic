import "@testing-library/jest-dom";
import {clean} from "../utils/profanity";

describe("Profanity", () => {
    it("test clean", () => {
        console.log(clean("Don't be an ash0le"));
        console.log(clean("This is a fuck!ng test"));
    });
});
