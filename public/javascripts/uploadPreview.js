var selDiv = "";

$(document).ready(init);


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
    $('#imageFiles').change(handleFileSelect);
    selDiv = $('#selectedFiles');
}

function handleFileSelect(e) {
    if (e.target.files.length > 0) {
        $('#upload').prop("disabled", false);
        $('.loading').show();
    }
    if (!e.target.files || !window.FileReader) return;
    selDiv.html('');

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);

    var checkProgress = function(count) {
        if (filesArr.length === count) {
            return true;
        }
        return false;
    }

    var counter = 0;

    function loadFiles(f) {
        if (!f.type.match("image.*")) {
            return;
        }
        var reader = new FileReader();

        reader.onload = function(e) {
            counter++;
            var loader = $('.loading');
            var progress = checkProgress(counter);
            if (progress) {
                loader.hide();
            }
            var html = '<img src="' + e.target.result + '">';
            selDiv.append(thumbnailContainer(html, f.name));
        }
        reader.readAsDataURL(f);
    }

    filesArr.forEach(loadFiles);

}
