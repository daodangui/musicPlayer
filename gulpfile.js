var gulp = require('gulp');
var sass = require("gulp-ruby-sass"); //sass

gulp.task("compilesass",function(){
    sass("./public/musicPlayer/sass/*.scss",{
        style : "expanded"
    }).pipe( gulp.dest("./public/musicPlayer/css/"));
});

gulp.task("listen",function(){
    gulp.watch("./public/musicPlayer/sass/*.scss",["compilesass"]);
});

gulp.task('default', ["listen"], function () {});