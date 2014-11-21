
exports.formatDate = function (epochDate) {
    var d = new Date(epochDate);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var date = month + '-' + day + '-' + year;
    return date;
};

exports.formatTime = function (epochDate) {
    var d = new Date(epochDate);
    var hr = d.getHours();
    var ampm = (hr >= 12) ? "PM" : "AM";
    var hr = (hr > 12) ? hr - 12 : hr;
    var min = d.getMinutes();
    if (min.toString().length == 1) {
        min = '0' + min
    }
    var time = hr + ':' + min + ' ' + ampm;
    return time;
};