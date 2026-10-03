// IMAGE PREVIEW
function previewImage(file, previewElement) {
    let reader = new FileReader();
    reader.onload = function() {
        previewElement.src = reader.result;
    };
    reader.readAsDataURL(file);
}

// IMAGE TO DATA URL
function convertImageToDataURL(file) {
    return new Promise(function(resolve, reject) {
        let reader = new FileReader();
        reader.onload = function() {
            resolve(reader.result);
        };
        reader.onerror = function() {
            reject(reader.error);
        };
        reader.readAsDataURL(file);
    });
}