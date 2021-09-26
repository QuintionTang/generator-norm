# Generator Norm

一个 WEB 前端项目自动化规范构建工具

目标：开发一个 WEB 前端项目自动化规范构建工具，让繁琐的流程及规范交给程序来完成，让每个前端项目都有统一的标准。

约定：为了更好的规划 WEB 项目结构，所有项目页面都将使用 shtml 格式。

环境依赖：Node、Yeoman。

## 安装

-   确定安装了 Yeoman（yo）:

    ```
    npm install -g yo
    ```

-   在项目目录下，安装这个工具，运行 `npm install generator-norm --savedev`

## 基本命令

-   `yo norm:app`:初始化项目

-   `yo norm:server`：执行完成后，将会自动在浏览器中打开测试页面并建立 websocket 实时更新项目文件，即项目的测试地址，支持解析 shtml 中的`<!--#include virtual=""-->`

-   `yo norm:lib`：建立公共类库文件结构

## 项目目录结构

`yo norm:app`：执行完成之后的项目目录结构

    ./
    ├── doc/ - 项目文档目录
    ├── scripts/ - 项目JS源代码
    ├── scss/ - scss文件目录
    │   	├── partials - 公共scss文件目录
    │   	│   	├── _common.scss - 公共样式文件
    │   	└── master.scss - 项目主样式文件
    ├── src/ - 项目源码目录
    │   	├── assets/ - 项目静态文件目录
    │   	│   	├── images/  - 项目图片目录
    │   	│   	├── scripts/ - 编译压缩后的JS脚本
    │   	│   	├── styles/  - 项目样式表目录，有scss文件编译生成
    │   	├── include/ - 项目公共HTML文件目录
    │   	│   	├── header.html  - 页头
    │   	│   	├── footer.html  - 页尾
    │   	├── favicon.ico - Favorites Icon
    │   	├── robots.txt - robots协议（也称为爬虫协议、爬虫规则、机器人协议等）
    │   	└── index.shtml  - 项目默认起始页，即默认首页
    ├── .gitignore  - git文件过滤规则
    ├── .bower.json   - bower配置文件
    ├── README.md - 项目说明文档
    └── package.json - NPM配置文件
