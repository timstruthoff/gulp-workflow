var gulp = require('gulp');

//CSS
var autoprefixer = require('gulp-autoprefixer');
var csscomb = require('gulp-csscomb');//Orders properties
var cssbeautify = require('gulp-cssbeautify');//Beautifier
var cleanCSS = require('gulp-clean-css');//Minifier

//JS
var autopolyfiller = require('gulp-autopolyfiller');
var uglify = require('gulp-uglify');
var prettify = require('gulp-jsbeautifier');

//HTML
var htmlmin = require('gulp-htmlmin');

//General
var clone = require('gulp-clone');
var rename = require("gulp-rename");
var replace = require('gulp-replace');
var ext_replace = require('gulp-ext-replace');
var concat = require('gulp-concat');
var insert = require('gulp-insert');
var merge = require('event-stream').merge;
var order = require('gulp-order');


gulp.task('html', function () {
    gulp.src("current/*.html")
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: true,
            removeComments: true,
            removeScriptTypeAttributes: true,
            sortAttributes: true
        }))
        .pipe(insert.prepend('<!--\r\n┌─────┐\r\n│ T M │ © 2016 - Tim Struthoff\r\n│ S T │ Licensed under MIT.\r\n└─────┘\r\n-->\r\n'))
        .pipe(gulp.dest('./build'));
});

gulp.task('css', function () {
    var all = gulp.src('current/dev_assets/core/css/*.css')
        .pipe(concat('app.css'))
        .pipe(autoprefixer({
            browsers: ['>0.1%']
        }))
        .pipe(csscomb());
        
    var min = all
        .pipe(clone())
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(insert.prepend('/*\r\n┌─────┐\r\n│ T M │ © 2016 - Tim Struthoff\r\n│ S T │ Licensed under MIT.\r\n└─────┘\r\n*/\r\n'))
        .pipe(rename("app.min.css"));
    
    var normal = all
        .pipe(clone())
        //.pipe(cssbeautify())
        .pipe(insert.prepend('/*\r\n┌─────┐\r\n│ T M │ © 2016 - Tim Struthoff\r\n│ S T │ Licensed under MIT.\r\n└─────┘\r\n*/\r\n'))
        .pipe(rename("app.css"));
    
    return merge(min, normal).pipe(gulp.dest('./build'));
});


gulp.task('js', function () {
    var sources = gulp.src('current/dev_assets/core/js/*.js')
        .pipe(concat('app.js'));
    
    var min = sources
        .pipe(clone())
        .pipe(uglify())
        .pipe(rename("app.min.js"))
        .pipe(insert.prepend('/*\r\n┌─────┐\r\n│ T M │ © 2016 - Tim Struthoff\r\n│ S T │ Licensed under MIT\r\n└─────┘\r\n*/\r\n'));
    
    var normal = sources
        .pipe(clone())
        .pipe(rename("app.js"))
        .pipe(prettify())
        .pipe(insert.prepend('/*\r\n┌─────┐\r\n│ T M │ © 2016 - Tim Struthoff\r\n│ S T │ Licensed under MIT\r\n└─────┘\r\n*/\r\n'));
    
    return merge(min, normal).pipe(gulp.dest('./build'));
});

gulp.task('root', ['html', 'css', 'js']);


gulp.task('pages', function () {
    var sources = gulp.src("current/pages/**/*.html");
    
    var min = sources
        .pipe(clone())
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: true,
            removeComments: true,
            removeScriptTypeAttributes: true,
            sortAttributes: true
        }))
        .pipe(ext_replace('.min.html'))
        .pipe(insert.prepend('<!--\r\n┌─────┐\r\n│ T M │ © 2016 - Tim Struthoff\r\n│ S T │ Licensed under MIT\r\n└─────┘\r\n-->\r\n'));
    
    var custom = sources
        .pipe(clone())
        .pipe(replace(/[\s\S]+?<!--_BEGIN_CUSTOM_-->/g, ''))
        .pipe(replace(/<!--_END_CUSTOM_-->[\s\S]*/g, ''))
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: true,
            removeComments: true,
            removeScriptTypeAttributes: true,
            sortAttributes: true
        }))
        .pipe(ext_replace('.custom.min.html'));
    
    return merge(min, custom)
        .pipe(gulp.dest('./build'));
});

gulp.task('assets_css', function () {
    return gulp.src('current/dev_assets/**/site.css')
        .pipe(autoprefixer({
            browsers: ['>0.1%']
        }))
        .pipe(csscomb())
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(ext_replace('.css'))
        .pipe(gulp.dest('./build/assets'));
});

gulp.task('assets_js', function () {
    return gulp.src('current/dev_assets/**/site.js')
        .pipe(uglify())
        .pipe(ext_replace('.js'))
        .pipe(gulp.dest('./build/assets'));
    
});

gulp.task('assets', ['assets_css', 'assets_js']);

gulp.task('default', ['root', 'pages', 'assets']);
