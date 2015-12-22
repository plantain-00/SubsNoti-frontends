"use strict";

let gulp = require("gulp");
let rename = require("gulp-rename");
let ejs = require("gulp-ejs");
let webpack = require("webpack-stream");
let minifyHtml = require("gulp-minify-html");
let rev = require("gulp-rev");
let minifyCSS = require("gulp-minify-css");
let autoprefixer = require("autoprefixer");
let postcss = require("gulp-postcss");
let revReplace = require("gulp-rev-replace");
let shell = require("gulp-shell");
let tslint = require("gulp-tslint");
let liveServer = require("live-server");
let babel = require("gulp-babel");

let pjson = require("./package.json");

let minifyHtmlConfig = {
    conditionals: true,
    spare: true,
};

let jsFiles = ["index", "login", "invite", "user", "registered", "authorized", "access_tokens", "authorization"];
let cssFiles = ["base"];
let jsxFiles = ["app", "success", "error", "new_organization", "head"];

gulp.task("jsx", () => {
    for (let file of jsxFiles) {
        gulp.src(`components/${file}.jsx`)
            .pipe(babel())
            .pipe(rename(`${file}.js`))
            .pipe(gulp.dest("build"));
    }
});

let sassCommand = "sass styles/base.scss > build/base.css";

let command = "rm -rf build && tsc -p scripts --pretty && gulp tslint && scss-lint styles/*.scss";

gulp.task("build", shell.task(`rm -rf dest && ${command} && ${sassCommand} && gulp jsx && gulp css-dev && gulp js-dev && gulp rev-dev && gulp html-dev && rm -rf build`));

gulp.task("deploy", shell.task(`${command} && ${sassCommand} && gulp jsx && gulp css-dest && gulp js-dest && gulp rev-dest && gulp html-dest && rm -rf build`));

gulp.task("css-dev", () => {
    for (let file of cssFiles) {
        uglifyCss(file, true);
    }
});

gulp.task("css-dest", () => {
    for (let file of cssFiles) {
        uglifyCss(file, false);
    }
});

gulp.task("js-dev", () => {
    bundleAndUglifyJs("app", true);
});

gulp.task("js-dest", () => {
    bundleAndUglifyJs("app", false);
});

gulp.task("rev-dev", () => {
    revCssAndJs(true);
});

gulp.task("rev-dest", () => {
    revCssAndJs(false);
});

gulp.task("html-dev", () => {
    bundleAndUglifyHtml("app", true);
});

gulp.task("html-dest", () => {
    bundleAndUglifyHtml("app", false);
});

gulp.task("tslint", () => {
    return gulp.src(["scripts/**/*.ts"])
        .pipe(tslint({
            tslint: require("tslint")
        }))
        .pipe(tslint.report("prose", { emitError: true }));
});

gulp.task("host", () => {
    liveServer.start({
        port: 8888,
        host: "0.0.0.0",
        root: "dest",
        open: false,
        ignore: "",
        wait: 500,
    });
});

function uglifyCss(name, isDevelopment) {
    if (isDevelopment) {
        gulp.src("build/" + name + ".css")
            .pipe(postcss([autoprefixer({ browsers: ["last 2 versions"] })]))
            .pipe(rename(name + ".css"))
            .pipe(gulp.dest("build/styles/"));
    }
    else {
        gulp.src("build/" + name + ".css")
            .pipe(postcss([autoprefixer({ browsers: ["last 2 versions"] })]))
            .pipe(minifyCSS())
            .pipe(rename(name + ".min.css"))
            .pipe(gulp.dest("build/styles/"));
    }
}

function bundleAndUglifyJs(name, isDevelopment) {
    if (isDevelopment) {
        gulp.src("build/" + name + ".js")
            .pipe(webpack())
            .pipe(rename(name + ".js"))
            .pipe(gulp.dest("build/scripts/"));
    }
    else {
        gulp.src("build/" + name + ".js")
            .pipe(webpack({
                plugins: [
                    new webpack.webpack.optimize.UglifyJsPlugin({ minimize: true })
                ],
                devtool: "source-map",
                output: {
                    filename: name + ".min.js"
                },
            }))
            .pipe(gulp.dest("build/scripts/"));
    }
}

function revCssAndJs(isDevelopment) {
    gulp.src(["build/styles/*.css", "build/scripts/*.js"], { base: "build" })
        .pipe(rev())
        .pipe(gulp.dest("dest"))
        .pipe(rev.manifest())
        .pipe(gulp.dest("build/"));
    gulp.src("build/scripts/*.map", { base: "build" })
        .pipe(gulp.dest("dest"));
}

function bundleAndUglifyHtml(name, isDevelopment) {
    let manifest = gulp.src("build/rev-manifest.json");
    let config = {
        dotMin: ".min",
        version: pjson.version,
        environment: "",
        imageServerBaseUrl: "https://img.yorkyao.xyz",
        imageUploaderBaseUrl: "https://img.yorkyao.xyz",
        apiBaseUrl: "",
    };
    if (isDevelopment) {
        config.dotMin = "";
        config.environment = "dev";
        config.imageServerBaseUrl = "http://localhost:7777";
        config.imageUploaderBaseUrl = "http://localhost:9999";
        config.apiBaseUrl = "http://localhost:9998";

        gulp.src("templates/" + name + ".ejs")
            .pipe(ejs(config))
            .pipe(rename(name + ".html"))
            .pipe(revReplace({
                manifest: manifest
            }))
            .pipe(gulp.dest("dest"));
    }
    else {
        gulp.src("templates/" + name + ".ejs")
            .pipe(ejs(config))
            .pipe(minifyHtml(minifyHtmlConfig))
            .pipe(rename(name + ".html"))
            .pipe(revReplace({
                manifest: manifest
            }))
            .pipe(gulp.dest("dest"));
    }
}
