(function() {
    function refreshCSS() {
        var sheets = document.getElementsByTagName("link");
        for (var i=0;i<sheets.length;++i) {
            var elem = sheets[i];
            var rel = elem.rel;
            if (elem.href && typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet") {
                var url = elem.href.replace(/(&|\?)_cacheRad=d+/,"");
                elem.href = url + (url.indexOf('?') >= 0 ? "&":"?")+"_cacheRad="+ (new Date().valueOf());
            }
        }
    }
    function refreshJS() {
        var scripts = document.getElementsByTagName("script");
        for (var i = 0;i<scripts.length;++i) {
            var elem = scripts[i];
            var type = elem.type;
            if (elem.src) {
                var url = elem.src.replace(/(&|\?)_cacheRad=d+/,"");
                elem.src = url + (url.indexOf("?")>=0?"&":"?") +"_cacheRad="+ (new Date().valueOf());
            }
        }
        window.location.reload();
    }
    
    if("WebSocket" in window){
        var protocol = window.location.protocol ==="http:"?"ws://":"wss://",
        address = protocol +"127.0.0.1:9000/ws",
        socket = new WebSocket(address);
        socket.onmessage = function(msg) {
            if (msg.data == "reload"){
                window.location.reload();
            } else if (msg.data == "refreshJS"){
                refreshJS();
            } else if (msg.data == "refreshcss"){
                refreshCSS();
            } 
        };
        console.log("Live reload enabled.");
    } else {
        console.log("本浏览器不支持WebSocket哦~");
        
    }
})();