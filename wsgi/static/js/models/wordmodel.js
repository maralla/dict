define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    var WordModel = Backbone.Model.extend({
        urlRoot: '/word',
        defaults: {
            word: '',
            related: '',
            content: '<div class="welcome">Welcome</div>',
        },
        fragment: '',
        sync: function(method, model, options){
            if (method == 'read') {
                model.url = function(){
                    return model.urlRoot + '/' + model.get('word');
                };
            }
            return Backbone.sync(method, model, options);
        }
    });
    return WordModel;
});
