import {getStylePrompts} from "@/configs/heroes";

export function buildPrompt(content: string, style: string, styleWeight: number) {
    const stylePrompts = getStylePrompts();
    let stylePrompt = stylePrompts.get(style);

    if (style !== "Default" && style !== "Realistic") {
        if (stylePrompt !== "" && styleWeight >= 1) {
            stylePrompt = "(" + stylePrompt + ")" + "+".repeat(styleWeight);
        }
    } else {
        styleWeight -=2;
        if (styleWeight > 0) {
            stylePrompt = "(" + stylePrompt + ")" + "+".repeat(styleWeight);
        } else if (styleWeight < 0) {
            stylePrompt = "(" + stylePrompt + ")" + "-".repeat(Math.abs(styleWeight));
        }
    }
    return stylePrompt !== ""? content + ", " + stylePrompt: content;
}
