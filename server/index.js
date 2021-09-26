"use strict";
var util = require("util"),
    path = require("path"),
    http = require("http"),
    url = require("url"),
    fs = require("fs"),
    express = require("express"),
    colors = require("colors"),
    open = require("open"),
    WebSocket = require("faye-websocket"),
    grunt = require("child_process").spawn("grunt", ["default", "watch"]),
    config = require("./config"),
    mime = config.Mime,
    port = config.Port,
    yeoman = require("yeoman-generator"),
    watchr = require("watchr"),
    shtml = require("./connect-shtml"),
    send = require("send"),
    ws;

function staticServer(root, indexFile) {
    return function (req, res, next) {
        if ("GET" != req.method && "HEAD" != req.method) return next();
        var reqpath = url.parse(req.url).pathname;
        res.header(
            "Cache-Control",
            "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
        );

        function directory() {
            var pathname = url.parse(req.originalUrl).pathname;
            res.statusCode = 301;
            res.setHeader("Location", pathname + "/");
            res.end("Redirecting to " + pathname + "/");
        }

        function error(err) {
            if (404 == err.status) return next();
            next(err);
        }

        function inArray(needle, array) {
            if (typeof needle == "string" || typeof needle == "number") {
                for (var i in array) {
                    if (needle === array[i]) {
                        return true;
                    }
                }
                return false;
            }
        }

        function inject(stream) {
            var _ext = path.extname(reqpath);

            if (_ext === "" || inArray(_ext, config.Exts)) {
                res.type("html");
                var websocketCode =
                        '<script type="text/javascript" src="/runner/websocket.js"></script>',
                    len =
                        websocketCode.length + res.getHeader("Content-Length");
                res.setHeader("Content-Length", len);
                res.write(websocketCode);
            }
        }

        send(req, reqpath)
            .root(root)
            .index(indexFile)
            .on("error", error)
            .on("stream", inject)
            .on("directory", directory)
            .pipe(res);
    };
}

function createServer(directory, indexFile) {
    var _app = express()
        .use(shtml(directory))
        .use(express.bodyParser())
        .use(express.methodOverride())
        .use(staticServer(directory, indexFile));
    var server = _app.listen(port);
    server.addListener("upgrade", function (request, socket, head) {
        ws = new WebSocket(request, socket, head);
        ws.onopen = function () {
            ws.send("connected");
        };
    });

    watchr
        .watch({
            path: directory,
            ignoreCommonPatterns: true,
            ignoreHiddenFiles: true,
            preferredMethods: ["watchFile", "watch"],
            interval: 1000,
            listeners: {
                log: function (logLevel) {
                    //console.log('a log message occured:', arguments);
                },
                watching: function (err, watcherInstance, isWatching) {
                    if (err) {
                        console.log(
                            "watching the path " +
                                watcherInstance.path +
                                " failed with error",
                            err
                        );
                    } else {
                        console.log(
                            "watching the path " +
                                watcherInstance.path +
                                " completed"
                        );
                    }
                },
                error: function (err) {
                    console.log("Error:".red, err);
                },
                change: function (
                    eventName,
                    filePath,
                    fileCurrentStat,
                    filePreviousStat
                ) {
                    if (!ws) return;
                    var _ext = path.extname(filePath),
                        _loginfo = "==>" + _ext;
                    _loginfo += " File changed";
                    if (_ext === ".css") {
                        ws.send("refreshCSS");
                        console.log(_loginfo.yellow);
                    } else if (_ext === ".js") {
                        ws.send("refreshJS");
                        console.log(_loginfo.green);
                    } else {
                        ws.send("reload");
                        console.log(_loginfo.cyan);
                    }
                },
            },
        })
        .listen(80166, function () {});

    console.log(("Server run at：http://localhost:" + port).green);

    open("http://localhost:" + port);
}
var NormGenerator = (module.exports = function Generator(args, options) {
    yeoman.generators.Base.apply(this, arguments);
    var pwd = process.cwd(),
        _self = this,
        _directory = pwd + "/src";

    grunt.stdout.on("data", function (data) {
        console.log("%s", data);
    });
    this.on("error", function () {});
    this.on(
        "end",
        function () {
            fs.exists(_directory, function (exists) {
                var _home_file = config.Index.file;
                if (!exists) {
                    _directory = pwd + "/demo";
                    _home_file = "index.html";
                }
                createServer(_directory, _home_file);
            });

            this.installDependencies({
                skipInstall: this.options["skip-install"],
            });
        }.bind(this)
    );
});
util.inherits(NormGenerator, yeoman.generators.Base);
