const gulp = require('gulp')
const del = require('del')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const rename = require('gulp-rename')
const replace = require('gulp-replace')
const sourcemaps = require('gulp-sourcemaps')
const ts = require('gulp-typescript')
const pack = require('./package.json')
const tsconfig = require('./tsconfig.json')

const exportModuleName = 'VXETablePluginShortcutKey'

gulp.task('build_commonjs', function () {
  return gulp.src(['index.ts'])
    .pipe(sourcemaps.init())
    .pipe(ts(tsconfig.compilerOptions))
    .pipe(babel({
      presets: [
        '@babel/env'
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties'
      ]
    }))
    .pipe(rename({
      basename: 'index',
      extname: '.common.js'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
})

gulp.task('build_umd', function () {
  return gulp.src(['index.ts'])
    .pipe(ts(tsconfig.compilerOptions))
    .pipe(replace('import XEUtils from \'xe-utils/ctor\';', 'import XEUtils from \'xe-utils\';'))
    .pipe(babel({
      moduleId: pack.name,
      presets: [
        '@babel/env'
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        ['@babel/transform-modules-umd', {
          globals: {
            [pack.name]: exportModuleName,
            'xe-utils': 'XEUtils'
          },
          exactGlobals: true
        }]
      ]
    }))
    .pipe(replace(`global.${exportModuleName} = mod.exports;`, `global.${exportModuleName} = mod.exports.default;`))
    .pipe(rename({
      basename: 'index',
      suffix: '.umd',
      extname: '.js'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename({
      basename: 'index',
      suffix: '.umd.min',
      extname: '.js'
    }))
    .pipe(gulp.dest('dist'))
})

gulp.task('clear', () => {
  return del([
    'dist/depend.*'
  ])
})

gulp.task('build', gulp.series(gulp.parallel('build_commonjs', 'build_umd'), 'clear'))
