

function zoomImage(image) {
    var lightbox = document.getElementById("modal");
    var lightboximg = document.getElementById("img01");
    lightboximg.src = image.src;
    lightbox.className = "show";

    lightbox.onclick = () => lightbox.className = "";
}
