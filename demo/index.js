"use strict";
var util = require("util");
var path = require("path");
var yeoman = require("yeoman-generator");
var spawn = require("child_process").spawn;

var NormGenerator = (module.exports = function Generator(args, options) {
    yeoman.generators.Base.apply(this, arguments);
    this.indexFile = this.readFileAsString(
        path.join(this.sourceRoot(), "index.shtml")
    );
    this.on("error", function () {});
    this.on("end", function () {
        this.installDependencies({ skipInstall: this.options["skip-install"] });
    });
    this.pkg = JSON.parse(
        this.readFileAsString(path.join(__dirname, "../package.json"))
    );
});

util.inherits(NormGenerator, yeoman.generators.Base);

NormGenerator.prototype.askFor = function askFor() {
    var cb = this.async();
    var folderName = path.basename(process.cwd());

    function parseProName(name) {
        return name.replace(/\b(\w)|(-\w)/g, function (m) {
            return m.toUpperCase().replace("-", "");
        });
    }
    var prompts = [
        {
            name: "projectName",
            message: "项目名称？",
            default: folderName,
            warning: "",
        },
        {
            name: "author",
            message: "开发者姓名：",
            default: "4a volcano",
            warning: "",
        },
        {
            name: "email",
            message: "开发者邮箱：",
            default: "",
            warning: "",
        },
        {
            name: "description",
            message: "项目描述？",
            default: "一个WEB项目。",
            warning: "",
        },
        {
            name: "version",
            message: "Version:",
            default: "0.0.1",
            warning: "",
        },
    ];
    this.prompt(
        prompts,
        function (props) {
            this.packageName = props.projectName + "Demo"; // project-name
            this.projectName = parseProName(this.packageName); //ProjectName
            this.author = props.author;
            this.email = props.email;
            this.description = props.description;
            this.version = props.version;
            cb();
        }.bind(this)
    );
};

/**
 * 初始化package.json
 */
NormGenerator.prototype.packageJSON = function packageJSON() {
    this.template("_package.json", "package.json");
};

NormGenerator.prototype.bowerJSON = function bowerJSON() {
    this.template("_bower.json", ".bower.json");
};

/**
 * 初始化项目首页
 */
NormGenerator.prototype.writeIndex = function writeIndex() {
    var contentText = ["<h1>Hello World!</h1>", "<p>从这里开始！</p>"];
    this.indexFile = this.indexFile.replace(
        "<%= packageName %>",
        this.packageName
    );
    this.indexFile = this.indexFile.replace(
        '<div id="main">',
        '<div id="main">\n\t\t\t' + contentText.join("\n\t\t\t")
    );
};

/**
 *  初始化项目WEB文件
 */
NormGenerator.prototype.site = function site() {
    this.write("src/index.shtml", this.indexFile);
};

/**
 * 初始化scss
 */
NormGenerator.prototype.scss = function scss() {
    this.copy("_common.scss", "scss/partials/_common.scss");
    this.copy("master.scss", "scss/master.scss");
};

/**
 * 初始化scripts
 */
NormGenerator.prototype.scripts = function scripts() {
    this.copy("app.js", "scripts/app.js");
    this.copy("websocket.js", "src/runner/websocket.js");
};

NormGenerator.prototype.gruntfile = function gruntfile() {
    this.copy("Gruntfile.js");
};

/**
 * 初始化项目目录
 */
NormGenerator.prototype.app = function app() {
    this.mkdir("src"); //项目核心文件夹，包括静态文件及页面文件
    this.mkdir("src/assets");
    this.mkdir("src/assets/images"); //项目图片文件夹
    this.mkdir("src/assets/styles"); //项目样式文件夹
    this.mkdir("src/assets/scripts"); //项目编译后的JS脚本文件夹

    this.mkdir("src/runner"); //测试服务器临时文件文件夹

    this.mkdir("scripts"); //项目JS源码
    this.mkdir("scss"); //项目SCSS文件夹
    this.mkdir("scss/partials"); //公共SCSS文件
};
