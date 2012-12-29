({
    baseUrl: "./js",
    paths: {
        jquery: 'libs/jquery-1.8.3',
        underscore: 'libs/underscore',
        backbone: 'libs/backbone',
        text: 'libs/text',
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
    },

    name: "main",
    out: "min/main-min.js",
})
