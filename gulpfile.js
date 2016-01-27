"use strict";

const gulp = require("gulp");
const rename = require("gulp-rename");
const ejs = require("gulp-ejs");
const webpack = require("webpack-stream");
const minifyHtml = require("gulp-minify-html");
const rev = require("gulp-rev");
const minifyCSS = require("gulp-minify-css");
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const revReplace = require("gulp-rev-replace");
const shell = require("gulp-shell");
const tslint = require("gulp-tslint");
const liveServer = require("live-server");

const pjson = require("./package.json");

const minifyHtmlConfig = {
    conditionals: true,
    spare: true,
};

const command = "rm -rf build && tsc -p components --pretty && sass styles/base.scss > build/base.css && scss-lint styles/*.scss";

gulp.task("build", shell.task(`rm -rf dest && ${command} && gulp html-dev && rm -rf build`));

gulp.task("deploy", shell.task(`${command} && gulp html-dest && rm -rf build`));

gulp.task("css-dev", () => {
    return uglifyCss("base", true);
});

gulp.task("css-dest", () => {
    return uglifyCss("base", false);
});

gulp.task("js-dev", ["tslint"], () => {
    return bundleAndUglifyJs("index", true);
});

gulp.task("js-dest", ["tslint"], () => {
    return bundleAndUglifyJs("index", false);
});

gulp.task("rev-dev", ["css-dev", "js-dev"], () => {
    return revCssAndJs();
});

gulp.task("rev-dest", ["css-dest", "js-dest"], () => {
    return revCssAndJs();
});

gulp.task("map-dest", ["css-dest", "js-dest"], () => {
    return mapJs();
});

gulp.task("html-dev", ["rev-dev"], () => {
    return bundleAndUglifyHtml("index", true);
});

gulp.task("html-dest", ["rev-dest", "map-dest"], () => {
    return bundleAndUglifyHtml("index", false);
});

gulp.task("tslint", () => {
    return gulp.src(["components/**/*.ts", "components/**/*.tsx"])
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
        return gulp.src("build/" + name + ".css")
            .pipe(postcss([autoprefixer({ browsers: ["last 2 versions"] })]))
            .pipe(rename(name + ".css"))
            .pipe(gulp.dest("build/styles/"));
    }
    else {
        return gulp.src("build/" + name + ".css")
            .pipe(postcss([autoprefixer({ browsers: ["last 2 versions"] })]))
            .pipe(minifyCSS())
            .pipe(rename(name + ".min.css"))
            .pipe(gulp.dest("build/styles/"));
    }
}

const webpackexternals = {
    "react": "React",
    "react-dom": "ReactDOM",
    "history": "History",
    "react-router": "ReactRouter",
};

function bundleAndUglifyJs(name, isDevelopment) {
    if (isDevelopment) {
        return gulp.src("build/components/" + name + ".js")
            .pipe(webpack({
                externals: webpackexternals
            }))
            .pipe(rename(name + ".js"))
            .pipe(gulp.dest("build/scripts/"));
    }
    else {
        return gulp.src("build/components/" + name + ".js")
            .pipe(webpack({
                plugins: [
                    new webpack.webpack.optimize.UglifyJsPlugin({ minimize: true })
                ],
                devtool: "source-map",
                output: {
                    filename: name + ".min.js"
                },
                externals: webpackexternals,
            }))
            .pipe(gulp.dest("build/scripts/"));
    }
}

function revCssAndJs() {
    return gulp.src(["build/styles/*.css", "build/scripts/*.js"], { base: "build" })
        .pipe(rev())
        .pipe(gulp.dest("dest"))
        .pipe(rev.manifest())
        .pipe(gulp.dest("build/"));
}

function mapJs() {
    return gulp.src("build/scripts/*.map", { base: "build" })
        .pipe(gulp.dest("dest"));
}

function bundleAndUglifyHtml(name, isDevelopment) {
    const manifest = gulp.src("build/rev-manifest.json");
    let config = {
        dotMin: ".min",
        version: pjson.version,
        environment: "",
        imageServerBaseUrl: "https://img.yorkyao.xyz",
        imageUploaderBaseUrl: "https://upload.yorkyao.xyz",
        apiBaseUrl: "",
    };
    if (isDevelopment) {
        config.dotMin = "";
        config.environment = "dev";
        config.imageServerBaseUrl = "http://localhost:7777";
        config.imageUploaderBaseUrl = "http://localhost:9999";
        config.apiBaseUrl = "http://localhost:9998";

        return gulp.src("templates/" + name + ".ejs")
            .pipe(ejs(config))
            .pipe(rename(name + ".html"))
            .pipe(revReplace({
                manifest: manifest
            }))
            .pipe(gulp.dest("dest"));
    }
    else {
        return gulp.src("templates/" + name + ".ejs")
            .pipe(ejs(config))
            .pipe(minifyHtml(minifyHtmlConfig))
            .pipe(rename(name + ".html"))
            .pipe(revReplace({
                manifest: manifest
            }))
            .pipe(gulp.dest("dest"));
    }
}
