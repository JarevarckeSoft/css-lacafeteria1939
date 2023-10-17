// Gulp
const { src, dest, watch, series, parallel } = require("gulp");

// CSS y SASS
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

// Imágenes
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

function css(done) {
  // Compilar sass
  // pasos: 1 - identificar archivo, 2 - compilar el archivo, 3 - guardar el .css
  src("src/scss/app.scss")
    .pipe(sass(/*{outputStyle: 'compressed'}*/))
    .pipe(postcss([autoprefixer()]))
    .pipe(dest("build/css"));
  done();
}

function imagenes(done) {
  src("src/img/**/*")
    .pipe(imagemin({ optimizationLevel: 3 }))
    .pipe(dest("build/img"));
  done();
}

function versionWebp() {
  const opciones = {
    quality: 50,
  };
  return src("src/img/**/*.{png,jpg}")
    .pipe(webp(opciones))
    .pipe(dest("build/img"));
}

function versionAvif(done) {
  const opciones = {
    quality: 50,
  };
  src("src/img/**/*.{png,jpg}").pipe(avif(opciones)).pipe(dest("build/img"));
  done();
}

function dev() {
  watch("src/scss/**/*.scss", css);
  watch("src/img/**/*", imagenes);
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(imagenes, versionWebp, versionAvif, css, dev);
//exports.default = parallel(css, dev);

// series - Se inicia una tarea y hasta que finaliza, se inicia la siguiente
// parallel -  Todas las tareas se inician al mismo tiempo y van finalizando en el tiempo que se vayan completando
