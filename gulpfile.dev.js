var globalConfig = {
  // apiRemote: "http://99.48.58.89:8085"
  // apiRemote: "https://sittest.memedai.cn"
  apiRemote: "https://aliuat.memedai.cn"
};

var version ='dev';

var gulp = require("gulp"), // 基础库
    imagemin = require("gulp-imagemin"), // 图片压缩
    sass = require("gulp-sass"), // sass
    autoprefixer = require("gulp-autoprefixer"), // css 浏览器前缀
    minifycss = require("gulp-minify-css"), // css压缩
    uglify  = require("gulp-uglify"), // js压缩
    rename = require("gulp-rename"), // 重命名
    concat = require("gulp-concat"), // 合并文件
    clean = require("gulp-clean"), // 清空文件夹
    ejs = require("gulp-ejs"), // html模板引擎
    htmlmin = require("gulp-htmlmin"), // html页面压缩
    proxyMiddleware = require('http-proxy-middleware'), // 代理中间件
    browserSync = require("browser-sync"); // 热加载服务

var targetProxy = proxyMiddleware(['/api'], {
    target: globalConfig.apiRemote,
    changeOrigin: true,
    logLevel: 'debug'
});

var browserS = browserSync.create("coupon");
const reload = browserSync.get("coupon").reload;

gulp.task('brSync', function() {
  browserS.init({
    server: {
      baseDir: './dist',
      middleware: [targetProxy]
    },
    notify: false,
    port: 3020,
    ui: {
      port: 3021
    }
  });
});

gulp.task("css", function () {
  gulp.src([
      "./src/sass/reset.scss",
      "./src/sass/*.scss"
    ])
    .pipe(sass({"sourcemap":true}))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'Android >= 4.0'],
      cascade: true, //是否美化属性值 默认：true
      remove:true //是否去掉不必要的前缀 默认：true
    }))
    .pipe(rename({ "suffix": ".min" }))
    // .pipe(minifycss())
    .pipe(gulp.dest("./dist/css/"));
});


gulp.task("images", function () {
  return gulp.src("./src/images/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest("./dist/images/"));
});

gulp.task("commonjs", function () {
  gulp.src(["./src/js/common/jquery.js", "./src/js/common/Ajax.js",
      "./src/js/common/common.js"])
    .pipe(concat("main.js"))
    .pipe(rename({ "suffix": ".min" }))
    // .pipe(uglify())
    .pipe(gulp.dest("./dist/js/"));
});

gulp.task("pagejs", function () {
  gulp.src("./src/js/pages/*.js")
    .pipe(rename({ "suffix": ".min" }))
    // .pipe(uglify())
    .pipe(gulp.dest("./dist/js/pages/"));
});

// gulp.task("copy", function() {
//   gulp.src("./src/html/*.html")
//     .pipe(gulp.dest("./dist/"));

//   gulp.src("./src/js/config.test.js")
//     .pipe(rename("config.js"))
//     .pipe(gulp.dest("./dist/js/"));
// });

gulp.task("html", function () {
  gulp.src(["./src/html/*.html"])
    .pipe(ejs({
      version: version
    }))
    .pipe(htmlmin({
      "removeComments": true, // 清除HTML注释
      "collapseWhitespace": true, // 压缩HTML
      "collapseBooleanAttributes": true, // 省略布尔属性的值 <input checked="true"/> ==> <input />
      "removeEmptyAttributes": false, // 不删除所有空格作属性值 <input id="" /> ==> <input />
      "removeScriptTypeAttributes": false, // 不删除<script>的type="text/javascript"
      "removeStyleLinkTypeAttributes": false, // 不删除<style>和<link>的type="text/css"
      "minifyJS": true, // 压缩页面JS
      "minifyCSS": true // 压缩页面CSS
    }))
    .pipe(gulp.dest("./dist/"));
});

gulp.task("default", [
  "html", "css", "commonjs", "pagejs",
  "images", "brSync"], function () {
    gulp.watch(["./src/html/*.html"], ["html"]).on('change', reload);
    gulp.watch(["./src/images/*"], ["images"]).on('change', reload);
    gulp.watch(["./src/js/common/*.js"], ["commonjs"]).on('change', reload);
    gulp.watch(["./src/js/pages/*.js"], ["pagejs"]).on('change', reload);
    gulp.watch(["./src/sass/*.scss","./*/sass/**/*.scss"], ["css"]).on('change', reload);
});
