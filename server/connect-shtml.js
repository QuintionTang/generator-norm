module.exports = function shtmlEmulator(rootDir) {
    return function (req, res, next) {
        var Buffer = require("buffer").Buffer;
        var WritableStream = require("stream-buffers").WritableStreamBuffer;
        var fs = require("fs");
        var path = require("path");
        var _ = require("underscore");
        if (req.url != "/" && !req.url.match(/\.html$/)) return next();
        var buffer = new WritableStream();

        var oldWrite = res.write;
        res.write = function (chunk) {
            buffer.write(chunk);
            return true;
        };
        var oldEnd = res.end;
        res.end = function (data) {
            res.end = oldEnd;
            if (data) {
                buffer.write(data);
            }
            if (!buffer.size()) {
                return oldEnd.call(this, buffer.getContents());
            }
            var body = buffer.getContentsAsString();
            var includes = body.match(
                /<!--\s*#include\s*virtual=\".+\"\s*-->/g
            );
            if (includes) {
                var remaining = includes.length;
                _.each(includes, function (include) {
                    var file = path.join(
                        rootDir,
                        path.dirname(req.originalUrl),
                        include.match(
                            /<!--\s*#include\s*virtual=\"(.+)\"\s*-->/
                        )[1]
                    );

                    fs.readFile(file, "utf8", function (err, data) {
                        if (err) {
                            console.log(
                                "ERROR including file " + file + ": " + err
                            );
                        } else {
                            body = body.replace(include, data);
                        }
                        if (!--remaining) {
                            res.end(body);
                        }
                    });
                });
            } else {
                res.end(body);
            }
        };

        next();
    };
};
