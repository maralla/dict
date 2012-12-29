define([
    'jquery',
    'underscore',
    'backbone',
    'views/appview'
], function($, _, Backbone, AppView){
    var Router = Backbone.Router.extend({
        routes: {
            '*actions': 'defaultAction'
        },
        goto_fragment: function(frag){
            this.navigate(frag, {replace: true, trigger: true});
        },
        remove_hash: function(){
            var loc = window.location;
            if ('replaceState' in history) {
                history.replaceState('', document.title, 
                                  loc.pathname + loc.search);
            }
        },
    });

    var initialize = function(){
        var router = new Router();
        var app = new AppView(router);
        app.render();
        router.on('route:defaultAction', function(r){
            router.remove_hash();
        });

        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});


