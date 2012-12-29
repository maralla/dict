require.config({
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
    urlArgs: "bust=" + (new Date()).getTime(),

});

require([
    'router',
    'backbone',
], function(Router, Backbone){
    Router.initialize();
});

