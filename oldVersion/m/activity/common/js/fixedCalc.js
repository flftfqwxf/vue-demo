function fixedCalc(str){
    if(!/Android/i.test(navigator.userAgent)) return;
    
    var deviceWidth = window.innerWidth;
    var scale = deviceWidth / 640;
    var doc = document;
    var style = doc.createElement("style");
    var str = str.replace(/\{(\-*\d+)\}/g, function($1, $2){
        return $2 * scale;
    });

    var cssText = doc.createTextNode(str);

    style.appendChild(cssText);
    $('head').append(style);
}