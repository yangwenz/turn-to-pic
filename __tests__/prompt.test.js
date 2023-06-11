import "@testing-library/jest-dom";
import {buildPrompt} from "../utils/prompt";

describe("Prompt", () => {
    it("test building prompts", () => {
        const prompt = buildPrompt(
            "standing, (full body)++",
            "Vincent van Gogh",
            3
        )
        console.log(prompt);
        expect(prompt).toEqual("standing, (full body)++, (Vincent van Gogh)+++");
    });
});
