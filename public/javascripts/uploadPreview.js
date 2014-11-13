
    var selDiv = "";
        
    document.addEventListener("DOMContentLoaded", init, false);
    
    function init() {
        document.querySelector('#imageFiles').addEventListener('change', handleFileSelect, false);
        selDiv = document.querySelector("#selectedFiles");
    }
        
    function handleFileSelect(e) {
        
        if(!e.target.files || !window.FileReader) return;
        
        selDiv.innerHTML = "";
        
        var files = e.target.files;
        var filesArr = Array.prototype.slice.call(files);
        var i = 1;
        filesArr.forEach(function(f) {
            if(!f.type.match("image.*")) {
                return;
            }
    
            var reader = new FileReader();
            reader.onload = function (e) {
                var html = '<img src="' + e.target.result + '" width="50px" height="50px">' + f.name + '<label for="caption' + i + '">Photo Comment</label><input type="text" id="caption' + i + '"><br/>';
                selDiv.innerHTML += html;               
            }
            reader.readAsDataURL(f);
            i++;
        });
        
        
    }
    