var selDiv = "";

document.addEventListener("DOMContentLoaded", init, false);

function thumbnailContainer(thumbnail, caption) {
    caption = caption || ''
    return ['<div class="col-xs-4 col-md-3">',
        '<span class="thumbnail">',
        thumbnail,
        '</span>',
        '<label>Filename </label> ' + caption,
        '<br/><label for="' + caption + '">Photo Comment </label> <input type="text" name="' + caption + '">',
        '</div>'
    ].join('\n');

};


function init() {
    document.querySelector('#imageFiles').addEventListener('change', handleFileSelect, false);
    selDiv = document.querySelector("#selectedFiles");
}

function handleFileSelect(e) {
    if (e.target.files.length !== 0) {
        document.querySelector('#upload').disabled = false;
    }
    if (!e.target.files || !window.FileReader) return;
    selDiv.innerHTML = "";

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);

    filesArr.forEach(function(f) {
        if (!f.type.match("image.*")) {
            return;
        }

        var reader = new FileReader();
        reader.onload = function(e) {
            var html = '<img src="' + e.target.result + '">';
            selDiv.innerHTML += thumbnailContainer(html, f.name);
        }
        reader.readAsDataURL(f);
    });


}
