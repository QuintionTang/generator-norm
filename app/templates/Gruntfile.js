module.exports = function(grunt){

    // 项目配置
    grunt.initConfig({
        uglify: {
            options: {
                banner: '/*! <%= packageName %> */\n'
            },
            target: {
                src: [<% if (includeProxy) { %>
                    './bower_components/proxy/build/{,*/}*.js',<% } if (includeRegisterApi) { %>
                    './bower_components/registerApi/build/{,*/}*.js',<% } if (includeCommon) { %>
                    './bower_components/hjdCommon/build/{,*/}*.js',<% } if (includeClientApi) { %>
                    './bower_components/clientApi/build/{,*/}*.js',<% } %>              
                    './bower_components/jquery/build/{,*/}*.js',
                    './scripts/{,*/}*.js'
                ],
                dest: './src/assets/scripts/<%= packageName %>_<%= version %>.min.js'
            }
        },        
        compass: {                  // Task
            dist: {                   // Target
              options: {              // Target options
                sassDir: 'scss',
                cssDir: 'src/assets/styles',
                imagesDir:'src/assets/images',
                environment: 'production',
                httpPath : "src/"
              }
            },
            dev: {                    // Another target
              options: {
                sassDir: './scss',
                cssDir: './src/assets/styles'
              }
            }
          },
        watch: {
            // watch方法可以监听js和css的改动 然后执行对应的编译方法
         scripts: {
            files: './scripts/{,*/}*.js',
            tasks: ['jshint','uglify'],
            options: {
              interrupt: true,
            },
          },
          css: {
            files: './scss/{,*/}*.scss',
            tasks: ['compass'],
            options: {
              livereload: true,
            }
          }
        },
        
        concat: {
            // 合并文件的方法
            options: {
                //定义一个用于插入合并输出文件之间的字符
                separator: ''
            },
            dist: {
                //用于连接的文件
                src: [<% if (includeProxy) { %>
                    './bower_components/proxy/build/{,*/}*.js',<% } if (includeRegisterApi) { %>
                    './bower_components/registerApi/build/{,*/}*.js',<% } if (includeCommon) { %>
                    './bower_components/hjdCommon/build/{,*/}*.js',<% } if (includeClientApi) { %>
                    './bower_components/clientApi/build/{,*/}*.js',<% } %>              
                    './bower_components/jquery/build/{,*/}*.js',  
                    './scripts/{,*/}*.js'],
                //返回的JS文件位置
                dest: 'src/assets/scripts/<%= packageName %>_<%= version %>.js'
            }
        },
        jshint: {
            //定义用于检测的文件
            files: ['./scripts/{,*/}*.js'],
            //配置JSHint (参考文档:http://www.jshint.com/docs)
            options: {
                //你可以在这里重写jshint的默认配置选项
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
    });

    // 加载任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['uglify','compass:dev']);
};