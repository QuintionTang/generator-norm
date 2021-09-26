"use strict";
var util = require("util");
var path = require("path");
var yeoman = require("yeoman-generator");
var spawn = require("child_process").spawn;
var chalk = require("chalk");

var NormGenerator = (module.exports = function Generator(args, options) {
    yeoman.generators.Base.apply(this, arguments);
    this.indexFile = this.readFileAsString(
        path.join(this.sourceRoot(), "index.shtml")
    );
    this.on("error", function () {});
    this.on("end", function () {
        this.installDependencies({
            skipInstall: this.options["skip-install"],
        });
    });
    this.pkg = JSON.parse(
        this.readFileAsString(path.join(__dirname, "../package.json"))
    );
});

util.inherits(NormGenerator, yeoman.generators.Base);

NormGenerator.prototype.askFor = function askFor() {
    var cb = this.async(),
        folderName = path.basename(process.cwd());

    function parseProName(name) {
        return name.replace(/\b(\w)|(-\w)/g, function (m) {
            return m.toUpperCase().replace("-", "");
        });
    }
    if (!this.options["skip-welcome-message"]) {
        console.log(this.yeoman);
        console.log(chalk.magenta("开始您的项目开发之旅^_^"));
    }

    var prompts = [
        {
            name: "projectName",
            message: "项目名称（英文名称）？",
            default: folderName,
            warning: " ",
            validate: function (answer) {
                if (answer === "") {
                    return "您必须输入项目名称^_^";
                } else {
                    var _pattern = /[\u4e00-\u9fa5]/g;
                    if (_pattern.test(answer)) {
                        return "项目名称必须是英文^_^";
                    }
                }
                return true;
            },
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
        {
            type: "checkbox",
            name: "features",
            message:
                "请选择项目所需要的类库（ClientApi、RegisterApi、Proxy、Common）？",
            choices: [
                {
                    name: "跨域通讯代理库？",
                    value: "includeProxy",
                    checked: true,
                },
                {
                    name: "RPC接口注册库？",
                    value: "includeRegisterApi",
                    checked: true,
                },
                {
                    name: "谷歌统计？",
                    value: "includeAnalysis",
                    checked: true,
                },
                {
                    name: "公共功能库（定时器Timer、参数获取Query）？",
                    value: "includeCommon",
                    checked: false,
                },
                {
                    name: "黄金岛客户端通讯接口库？",
                    value: "includeClientApi",
                    checked: false,
                },
            ],
        },
    ];
    this.prompt(
        prompts,
        function (props) {
            this.packageName = props.projectName;
            // project-name
            this.projectName = parseProName(this.packageName);
            //ProjectName
            this.author = "4a volcano";
            this.description = props.description;
            this.version = props.version;
            this.email = "";
            var features = props.features;

            function hasFeature(feat) {
                return features.indexOf(feat) !== -1;
            }

            this.includeProxy = hasFeature("includeProxy");
            this.includeRegisterApi = hasFeature("includeRegisterApi");
            this.includeCommon = hasFeature("includeCommon");
            this.includeClientApi = hasFeature("includeClientApi");
            if (this.bitbucket !== "") {
                cb();
            }
        }.bind(this)
    );
};

/**
 * 初始化package.json
 */
NormGenerator.prototype.packageJSON = function packageJSON() {
    this.template("_package.json", "package.json");
};

/**
 * 生成gitignore
 */
NormGenerator.prototype.git = function git() {
    //生成git过滤规则
    this.copy("_gitignore", ".gitignore");
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
    this.copy("favicon.ico", "src/favicon.ico");
    this.copy("robots.txt", "src/robots.txt");
    this.write("src/index.shtml", this.indexFile);
};

/**
 * 初始化scss
 */
NormGenerator.prototype.scss = function scss() {
    this.copy("_animate.sass", "scss/partials/_animate.sass");
    this.copy("_common.scss", "scss/partials/_common.scss");
    this.copy("master.scss", "scss/master.scss");
};
/**
 * 初始化scripts
 */
NormGenerator.prototype.scripts = function scripts() {
    this.copy("WebApp.js", "scripts/WebApp.js");
    this.copy("websocket.js", "src/runner/websocket.js");
};

NormGenerator.prototype.gruntfile = function gruntfile() {
    this.template("Gruntfile.js", "Gruntfile.js");
};

/**
 * 初始化项目目录
 */
NormGenerator.prototype.app = function app() {
    this.mkdir("src");
    //项目核心文件夹，包括静态文件及页面文件
    this.mkdir("src/assets");
    this.mkdir("src/include");
    //项目公共html文件
    this.mkdir("src/assets/images");
    //项目图片文件夹
    this.mkdir("src/assets/styles");
    //项目样式文件夹
    this.mkdir("src/assets/scripts");
    //项目编译后的JS脚本文件夹

    this.mkdir("src/runner");
    //测试服务器临时文件文件夹

    this.mkdir("scripts"); //项目JS源码
    this.mkdir("scss");
    //项目SCSS文件夹
    this.mkdir("scss/partials");
    //公共SCSS文件

    this.mkdir("doc");
    //项目文档

    this.template("README.md");
};
