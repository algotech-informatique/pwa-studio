// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-junit-reporter'),
            require('karma-coverage'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
            jasmine: {
                random: false // needed as some tests are meant to be executed in sequence like those for HelperService
            },
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        reporters: ['progress', 'kjhtml', 'junit'],
        jasmineHtmlReporter: {
            suppressAll: true // removes the duplicated traces
        },
        coverageReporter: {
            dir: require('path').join(__dirname, './coverage'),
            subdir: '.',
            reporters: [
                { type: 'lcovonly', file: 'lcov.info' },
                { type: 'cobertura', file: 'cobertura-coverage.xml' },
                { type: 'text-summary' }
            ]
        },
        junitReporter: {
            outputDir: 'test-reports/karma',
            outputFile: 'junit.xml',
            useBrowserName: false
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['ChromeHeadlessCI'],
        customLaunchers: {
            ChromeHeadlessCI: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
        },
        singleRun: false,
        restartOnFileChange: true
    });
};
