import Filter from "bad-words";

export function clean(text) {
    const filter = new Filter();
    return filter.clean(text);
}
