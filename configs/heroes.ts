
export function label2name(label: string) {
    if (label === "natures-prophet")
        label = "nature's-prophet"
    return label.split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
