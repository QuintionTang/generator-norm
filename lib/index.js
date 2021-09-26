'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var spawn = require('child_process').spawn;
var chalk = require('chalk');

var NormGenerator = module.exports = function Generator(args, options) {
    yeoman.generators.Base.apply(this, arguments);
    this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
    this.on('error',function(){});
    this.on('end', function (){
        this.installDependencies({skipInstall:this.options["skip-install"]});
    });
    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, "../package.json")));
};

util.inherits(NormGenerator, yeoman.generators.Base);

NormGenerator.prototype.askFor = function askFor() {
    var cb = this.async();
    var folderName = path.basename(process.cwd());

    function parseProName(name){
        return name.replace(/\b(\w)|(-\w)/g,function(m){
            return m.toUpperCase().replace('-','');
        });
    }
    var prompts = [
        {
            name:"projectName",
            message:"类库名称？",
            default:folderName,
            warning:"",
            validate:function( answer ) {
                if ( answer === "" ) {
                    return "您必须输入类库名称^_^";
                } else {
                    var _pattern=/[\u4e00-\u9fa5]/g;  
                    if(_pattern.test(answer)){
                        return "类库名称必须是英文^_^";
                    }
                }
                return true;
            }
        },
        {
            name:"author",
            message:"开发者姓名：",
            default:"4a volcano",
            warning:""
        },
        {
            name:"email",
            message:"开发者邮箱：",
            default:"",
            warning:""
        },
        {
            name:"description",
            message:"类库描述？",
            default:"一个javascript类库。",
            warning:""
        },
        {
            name:"version",
            message:"Version:",
            default:"0.0.1",
            warning:""
        }
    ];
    this.prompt(prompts, function (props) {
        this.packageName = props.projectName;// project-name
        this.projectName = parseProName(this.packageName); //ProjectName
        this.author = props.author;
        this.email = props.email;
        this.description = props.description;
        this.version = props.version;
        cb();
    }.bind(this));
};
/**
 * 初始化package.json
 */
NormGenerator.prototype.packageJSON = function packageJSON(){
    this.template('_package.json','package.json');
};

/**
 * 生成gitignore
 */
NormGenerator.prototype.git = function git(){    //生成git过滤规则
    this.copy('_gitignore', '.gitignore');
};

/**
 * 初始化项目首页
 */
NormGenerator.prototype.writeIndex = function writeIndex(){
  this.indexFile = this.indexFile.replace('<%= packageName %>',this.packageName);
};

NormGenerator.prototype.bowerJSON = function bowerJSON(){
    this.template('_bower.json', 'bower.json');
};

/**
 *  初始化Demo文件 
 */
NormGenerator.prototype.site = function site() {
  this.write('demo/index.html', this.indexFile);
};

/**
 * 初始化scripts
 */
NormGenerator.prototype.scripts = function scripts(){
    this.copy('websocket.js', 'demo/runner/websocket.js');
}

NormGenerator.prototype.gruntfile = function gruntfile(){
    this.copy('Gruntfile.js');
};

/**
 * 初始化项目目录
 */
NormGenerator.prototype.app = function app(){
    this.mkdir("demo");                 //类库实例文件夹
    
    this.mkdir("build");                 //类库实例文件夹

    this.mkdir("demo/runner");         //测试服务器临时文件文件夹
    
    this.mkdir("scripts")            //项目JS源码
    
    this.mkdir("doc");                //项目文档

    this.template('README.md');
};