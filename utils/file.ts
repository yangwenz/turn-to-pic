function file(blobUrl: string, filename: string) {
    let a: any = document.createElement("a");
    a.download = filename;
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

export function downloadImage(url: string, filename: string) {
    fetch(url, {
        headers: new Headers({
            Origin: location.origin
        }),
        mode: "cors",
    })
        .then((response) => {
            return response.blob();
        })
        .then((blob) => {
            let blobUrl = window.URL.createObjectURL(blob);
            file(blobUrl, filename);
        })
        .catch((e) => console.error(e));
}

export function readAsDataURL(file: Blob) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onerror = reject;
        fr.onload = () => {
            resolve(fr.result);
        };
        fr.readAsDataURL(file);
    });
}

export async function downloadImageAsDataURL(url: string) {
    let dataUrl: string = "";

    await fetch(url, {
        headers: new Headers({
            Origin: location.origin
        }),
        mode: "cors",
    })
        .then((response) => {
            return response.blob();
        })
        .then((blob) => {
            return readAsDataURL(blob);
        })
        .then((result) => {
            dataUrl = result as string;
        })
        .catch((e) => console.error(e));

    return dataUrl;
}
