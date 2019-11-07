/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     3.0.1
 * @author      Blue Acorn iCi <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © Blue Acorn.
 */

const path = require('path');
const themes = require('../../gulp-config');
const {
    exec
} = require('child_process');
const chalk = require('chalk');
const settings = require('./_settings');

const combo = {

    rootPath() {
        'use strict';

        return path.join(__dirname, settings.root);
    },

    autoPath(themeName, folder) {
        let theme = themes[themeName];

        return path.join(folder, theme.appPath, theme.themePath, theme.locale);
    },

    autoPathThemes(themeName) {
        let theme = themes[themeName];

        return path.join(this.rootPath(), settings.appDir, settings.frontend, theme.themePath);
    },

    getThemePath(theme, folder) {
        return `${this.autoPathThemes(theme) + folder}`;
    },

    getNodeModulesDir() {
        console.log(settings.nodeModulesPath);
        console.log(__dirname);
        return path.join(__dirname, '../../', settings.nodeModulesPath);
    },

    autoPathAssets(theme) {
        return this.autoPath(theme, settings.pub);
    },

    adminAutoPathAssets() {
        return path.join(this.rootPath(), settings.pub, settings.backend, '/Magento/backend/en_US');
    },

    autoPathImages(theme) {
        return this.getThemePath(theme, '/web/images/');
    },

    autoPathImageSrc(theme) {
        return this.getThemePath(theme, '/web/src/');
    },

    autoPathSpriteSrc(theme) {
        return this.getThemePath(theme, '/web/spritesrc/');
    },

    autoPathIntermediateSvg(theme) {
        return `${this.getPathImageSrc(theme)}intermediate-svg`;
    },

    autoPathThemeJs(theme) {
        return this.getThemePath(theme, '/**/web/js/**/source/');
    },

    autoPathThemeCss(theme) {
        return this.getThemePath(theme, '/web/css/source/');
    },

    autoPathCss(theme) {
        return `${this.autoPathAssets(theme)}/css/`;
    },

    getNodeModulesDir() {
        return path.join(__dirname, '../../', settings.nodeModulesPath);
    },

    appCodePath() {
        return path.join(this.rootPath(), settings.appDir, settings.codeDir);
    },

    cleanPaths(themeName) {
        let cleanPaths = [],
            pubPath = combo.autoPath(themeName, settings.pub),
            tmpLess = combo.autoPath(themeName, settings.tmpLess),
            tmpSource = combo.autoPath(themeName, settings.tmpSource);

        cleanPaths.push(`${settings.tmp}/cache/*`);
        [pubPath, tmpLess, tmpSource].forEach((idx, themePath) => {
            cleanPaths.push(`${themePath}/*`);
        });

        return cleanPaths;
    },

    cleanVarPaths() {
        let varPaths = [];

        [
            'cache',
            'generation',
            'log',
            'maps',
            'page_cache',
            'tmp',
            'view',
            'view_preprocessed'
        ].forEach((idx, cachePath) => {
            varPaths.push(`${settings.tmp}/${cachePath}/**/*`);
        });

        varPaths.push(`${settings.deployedVersion}`);

        return varPaths;
    },

    collector(themeName) {
        const cmdPlus = /^win/.test(process.platform) ? ' & ' : ' && ';
        const theme = themes[themeName];

        let command = '';

        theme.locales.forEach((locale, idx) => {
            if (idx > 0) {
                command += cmdPlus;
            }

            command += `php bin/magento dev:source-theme:deploy ${theme.stylesheets.join(' ')} --type=less --locale=${locale} --area=${theme.appPath} --theme=${theme.themePath}`;
        });

        console.log(command);
        return command;
    },

    /**
     * Returns Less Files for Current Theme
     * @param themeName
     */
    lessFiles(themeName) {
        let theme = themes[themeName],
            assetsPath = this.autoPathAssets(themeName);

        if (theme.stylesheets.length) {
            let lessFiles = theme.stylesheets.map((stylesheet) => {
                return `${assetsPath}/${stylesheet.replace('::','/')}.less`;
            });

            return lessFiles;
        }
    },

    appLessFiles() {
        let assetsPath = this.adminAutoPathAssets();
        return [`${assetsPath}/css/styles.less`];
    },

    lessWatchFiles(themeName) {
        let theme = themes[themeName],
            assetsPath = this.autoPathThemes(themeName),
            files = [];

        if (theme.stylesheets.length) {
            files.push(`${assetsPath}/**/*.less`);
        }

        files.push(`${this.appCodePath()}/**/frontend/**/*.less`);

        return files;
    },

    appLessWatchFiles() {
        const files = [];

        files.push(`${this.appCodePath()}/**/adminhtml/**/*.less`);

        return files;
    },

    imgWatchFiles(themeName) {
        return `${this.autoPathImageSrc(themeName)}**/*.{png,jpg,gif,jpeg,svg}`;
    },

    appWatchFiles() {
        return `${this.appCodePath()}/BlueAcorn/**/*.{phtml,php,xml}`;
    },

    appWatchJsFiles() {
        return this.appJsSourceFiles();
    },

    execMessages(task, stdout, stderror) {
        if (stdout) {
            console.log(chalk.green('Results of ' + task + ':\n\n' + stdout));
        }

        if (stderror) {
            console.log(chalk.red(task + 'ERROR:\n\n' + stderror));
        }
    },

    execCommands(command, commandName, done) {
        const self = this;

        exec(command, (error, stdout, stderr) => {
            self.execMessages(commandName, stdout, stderr);
            done(error);
        });
    },

    jsSourceFiles(themeName) {
        return this.getThemePath(themeName, settings.jsThemeGlob);
    },

    jsSourceDestination(themeName) {
        return this.getThemePath(themeName, settings.jsThemeGlob.replace('source/', ''));
    },

    appJsSourceFiles() {
        return `${this.appCodePath()}${settings.jsThemeGlob}`;
    },

    templateWatchFiles(themeName) {
        return `${this.autoPathThemes(themeName)}/**/*.{phtml,xml}`;
    },
};

module.exports = combo;