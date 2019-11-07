/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     3.0.1
 * @author      Blue Acorn iCi <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © Blue Acorn.
 */

const less = require('gulp-less');
const livereload = require('gulp-livereload');
const util = require('util');
const combo = require('../helpers/_combo');
const themes = require('../../gulp-config');
const DefaultRegistry = require('undertaker-registry');
const sourcemaps = require('gulp-sourcemaps');

function LessTasks() {
    'use strict';

    DefaultRegistry.call(this);
}

util.inherits(LessTasks, DefaultRegistry);

LessTasks.prototype.init = (gulp) => {
    'use strict';

    function executeLessTasks(theme, files, destination, done) {
        gulp.src(files)
            .pipe(sourcemaps.init())
            .pipe(less())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(destination))
            .pipe(livereload())
            .on('end', done);
    }

    for (let theme in themes) {
        if (themes.hasOwnProperty(theme)) {
            gulp.task(`less:${theme}`, (done) => {
                combo.lessFiles(theme).forEach((lessFile) => {
                    executeLessTasks(
                        theme,
                        lessFile,
                        `${lessFile.substring(0, lessFile.lastIndexOf("/"))}`,
                        done
                    );
                });
            });
        }
    }

    gulp.task('less:all', (done) => {
        Object.keys(themes).map((theme) => {
            combo.lessFiles(theme).forEach((lessFile) => {
                executeLessTasks(
                    theme,
                    lessFile,
                    `${lessFile.substring(0, lessFile.lastIndexOf("/"))}`,
                    done
                );
            });
        });
    });

    gulp.task('less:admin', (done) => {
        executeLessTasks('', combo.appLessFiles(), `${combo.adminAutoPathAssets()}/css`, done);
    });
};

module.exports = new LessTasks();