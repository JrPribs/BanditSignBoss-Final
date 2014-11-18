var selDiv = "";

document.addEventListener("DOMContentLoaded", init, false);


function thumbnailContainer(thumbnail, caption) {
    caption = caption;
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
    document.querySelector('.loading').setAttribute('style', 'display:none');;

}

function handleFileSelect(e) {
    if (e.target.files.length > 0) {
        document.querySelector('#upload').disabled = false;
    }
    if (!e.target.files || !window.FileReader) return;
    selDiv.innerHTML = "";

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);

    var checkProgress = function(count) {
        if (filesArr.length === count) {
            return true;
        }
        return false;
    }

    var counter = 0;
    filesArr.forEach(function(f) {
        if (!f.type.match("image.*")) {
            return;
        }

        var reader = new FileReader();
        reader.onloadstart = function(e) {
            var loader = document.querySelector('.loading');
            var progress = checkProgress(counter);
            if (!progress) {
                loader.setAttribute('style', 'display:block');
            }

        }
        reader.onload = function(e) {
            counter ++ 
            var loader = document.querySelector('.loading');
            var progress = checkProgress(counter);
            if (progress) {
                loader.setAttribute('style', 'display:none');
            }
            var html = '<img src="' + e.target.result + '">';
            selDiv.innerHTML += thumbnailContainer(html, f.name);
        }
        reader.readAsDataURL(f);
    });


}