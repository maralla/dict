define([
    'jquery',
    'underscore',
    'backbone',
    'views/contentview',
    'collections/wordcollection',
], function($, _, Backbone, contentView, wordCollection){
    var Naview = Backbone.View.extend({
        el: '#history',
        _select: function(){ return this.$el.find('select'); },
        initialize: function(router){
            this.content = contentView;
            this.router = router;
        },
        events: {
            'click select': 'render_histroy',
        },
        render_histroy: function(e){
            var t = e.currentTarget;
            var index = parseInt($(t.options[t.selectedIndex])
                                    .attr('data-index'));
            var cacheWord = wordCollection.at(index);
            this.content.word.set(cacheWord.attributes);
            this.content.render();
            if (cacheWord.fragment)
                this.router.goto_fragment(cacheWord.fragment);
            $('#search input').val(this.content.word.get('word'));
        },
        add_option: function(text, index){
            this._select().prepend($('<option>')
                                  .text(text)
                                  .attr('value', text)
                                  .attr('data-index', index));
        },
        cut_last: function(){
            this._select().find(':last-child').remove();
            _.each(this._select().children(), function(e, i, l){
                $(e).attr('data-index', parseInt($(e).attr('data-index')) - 1);
            });
        },
        set_value: function(value){
            this.el.querySelector('select').value = value;
        },
    });
    return Naview;
});
