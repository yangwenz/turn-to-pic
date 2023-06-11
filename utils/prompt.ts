import {getStylePrompts} from "@/configs/heroes";

export function buildPrompt(content: string, style: string, styleWeight: number) {
    const stylePrompts = getStylePrompts();
    let stylePrompt = stylePrompts.get(style);
    if (styleWeight >= 1) {
        stylePrompt = "(" + stylePrompt + ")" + "+".repeat(styleWeight);
    }
    return content + ", " + stylePrompt;
}
