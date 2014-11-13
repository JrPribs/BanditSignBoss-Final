var selDiv = "";

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    document.querySelector('#imageFiles').addEventListener('change', handleFileSelect, false);
}

function handleFileSelect(e) {
    if (!e.target.files || !window.FileReader) return;
    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    var previews = [];
    var i = 0;
    var len = filesArr.length - 1;
    filesArr.forEach(function(f) {
        if (!f.type.match("image.*")) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            var html = '<img src="' + e.target.result + '" width="50px" height="50px"><label for="' + f.name + '">Photo Comment</label><input type="text" name="' + f.name + '"><br/>';
            previews.push(html);
            if (i === len) {
                $('#selectedFiles').html(previews.join(''));
            }
            i++;
        }
        reader.readAsDataURL(f);
    });


}
