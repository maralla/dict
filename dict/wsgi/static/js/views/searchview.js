define([
    'jquery',
    'underscore',
    'backbone',
    'models/wordmodel',
    'collections/wordcollection',
    'views/contentview',
    'views/naview',
], function($, _, Backbone, WordModel, wordCollection, contentView, Naview){
    var SearchView = Backbone.View.extend({
        el: '#search',
        initialize: function(router){
            this.content = contentView;
            this.wordcollection = wordCollection;
            this.router = router;
            this.naview = new Naview(router);
        },
        render: function(){
            this.content.render();
        },
        events: {
            "click button[type=button]": 'checkSearch'
        },
        checkSearch: function(e, w, s){
            var word;
            if (w) {
                word = w;
            } else {
                word = this.$el.find('input').val().trim();
            }
            if (word != '' && /^[-A-Za-z0-9_]+(?: +[-A-Za-z0-9_]+)*$/
                    .test(word)) {
                this.doSearch(word, s);
            }
        },
        doSearch: function(word, s){
            var old = _.find(this.wordcollection.models, function(e, i, l){
                if (e.get('word') == word)
                    return true;
            });
            if (old) {
                this.content.word.set(old.attributes);
                this.content.render();
                this.naview.set_value(this.content.word.get('word'));
                return;
            }

            var that = this;
            this.wait();
            this.content.word.set({'word': word});
            this.content.word.fetch({
                success: function(model, response, options){
                    that.content.render();
                    that.unwait();
                    if (s) {
                       that.router.goto_fragment(s); 
                    }
                    that.naview.set_value(model.get('word'));
                    if (model.get('related') != '#') {
                        cloneModel = model.clone();
                        if (s) cloneModel.fragment = s;
                        that.wordcollection.add(cloneModel,
                                                {nav: that.naview});
                    }
                }
            });
        },
        wait: function(){
            var button = this.$el.find('button')
            button.removeClass('click').addClass('wait')
                  .attr('disabled', true);
            this.content.content_disable();
        },
        unwait: function(){
            this.$el.find('button').removeClass('wait')
                .addClass('click').attr('disabled', false);
            this.content.content_enable();
        }
    });
    return SearchView;
});
