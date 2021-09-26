exports.Expires = {
    fileMatch: /^(gif|png|jpg|js|css)$/gi,
    maxAge: 60 * 60 * 24 * 365,
};
exports.Mime = {
    css: "text/css",
    gif: "image/gif",
    html: "text/html",
    shtml: "text/html",
    ico: "image/x-icon",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    js: "text/javascript",
    json: "application/json",
    pdf: "application/pdf",
    png: "image/png",
    svg: "image/svg+xml",
    swf: "application/x-shockwave-flash",
    tiff: "image/tiff",
    txt: "text/plain",
    wav: "audio/x-wav",
    wma: "audio/x-ms-wma",
    wmv: "video/x-ms-wmv",
    xml: "text/xml",
};
exports.Exts = [".html", ".htm", ".shtml", ".xhtml"];
exports.Port = 9999;
exports.Index = {
    file: "index.shtml",
};
