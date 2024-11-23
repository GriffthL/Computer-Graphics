const imageUpload = document.getElementById("imageUpload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const grayscaleButton = document.getElementById("grayscaleButton");
const blurButton = document.getElementById("blurButton");


let imageData;

imageUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

grayscaleButton.addEventListener("click", () => {
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
        const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        pixels[i] = avg; // Red
        pixels[i + 1] = avg; // Green
        pixels[i + 2] = avg; // Blue
    }
    ctx.putImageData(imageData, 0, 0);
    downloadButton.style.display = "block";
});

blurButton.addEventListener("click", () => {
    const pixels = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    const copy = new Uint8ClampedArray(pixels);

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let r = 0, g = 0, b = 0, count = 0;

            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const idx = ((y + dy) * width + (x + dx)) * 4;
                    r += copy[idx];
                    g += copy[idx + 1];
                    b += copy[idx + 2];
                    count++;
                }
            }

            const idx = (y * width + x) * 4;
            pixels[idx] = r / count; // Red
            pixels[idx + 1] = g / count; // Green
            pixels[idx + 2] = b / count; // Blue
        }
    }
    ctx.putImageData(imageData, 0, 0);
    downloadButton.style.display = "block";
});

