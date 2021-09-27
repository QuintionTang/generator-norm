# Generator Norm

一个 WEB 前端项目自动化规范构建工具

目标：开发一个 WEB 前端项目自动化规范构建工具，让繁琐的流程及规范交给程序来完成，让每个前端项目都有统一的标准。

环境依赖：Node、Yeoman。

## 安装

-   确定安装了 Yeoman（yo）:

    ```
    npm install -g yo
    ```

-   在项目目录下，安装这个工具，运行 `npm install generator-norm --savedev`

## 基本命令

-   `yo norm`:初始化项目

## 项目目录结构

`yo norm`：执行完成之后的项目目录结构

    ./
    ├── app/ - 项目源码主目录
    |       ├── fonts/ - 字体文件目录
    │   	├── images/ - 项目图片目录
    │   	├── scripts/ - 项目JS脚本目录
    │   	├── styles/ - 项目样式目录scss
    │   	├── favicon.ico - Favorites Icon
    │   	├── robots.txt - robots协议（也称为爬虫协议、爬虫规则、机器人协议等）
    │   	└── index.html  - 项目默认起始页，即默认首页
    ├── .gitignore  - git文件过滤规则
    ├── .bower.json   - bower配置文件
    ├── README.md - 项目说明文档
    └── package.json - NPM配置文件
