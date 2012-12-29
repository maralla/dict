define([
    'jquery',
    'underscore',
    'backbone',
    'models/wordmodel',
], function($, _, Backbone, WordModel){
    var WordCollection = Backbone.Collection.extend({
        model: WordModel,
        initialize: function(){
            var that = this;
            this.on('add', function(model, collection, options){
                options.nav.add_option(model.get('word'), 
                                       collection.length - 1);
                if (collection.length == 50)
                    collection.remove(collection.at(0), options);
            });
            this.on('remove', function(model, collection, options){
                options.nav.cut_last();
            });
        },
    });

    return (new WordCollection());
});
