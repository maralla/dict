define([
    'jquery',
    'underscore',
    'backbone',
    'models/wordmodel',
    'text!templates/waittemplate.html'
], function($, _, Backbone, WordModel, WaitTemplate){
    var ContentView = Backbone.View.extend({
        el: '#definition',
        initialize: function(){
            var that = this;
            this.word = new WordModel();
            this.audio = new Audio();
            window.playSoundFromFlash = function(src, obj){
                that.audio.src = 'http://oaadonline.' + 
                                  'oxfordlearnersdictionaries.com' + src;
                that.audio.play();
            };
        },
        render: function(){
            var related = this.word.get('related');
            related = (related != '#') ? related : ''
            this.$el.find('.related').html(related);
            this.$el.find('.content').html(this.word.get('content'));
            var oald = this.$el.find('a[href^="http://oald8"]');
            if (oald)
                oald.html('other dictionaries').addClass('noa')
                    .removeAttr('title').removeAttr('href');
        },
        content_disable: function(){
            var padding = this.$el.find('.padding'),
                word = this.$el.find('.word'),
                related = this.$el.find('.related');
            var ch = parseInt(word.css('height')),
                rh = parseInt(related.css('height'));
            var height = ch < rh ? rh : ch;
            padding.css('height', height)
                   .css('width', word.css('width'))
                   .css('top', -1 * ch);
        },
        content_enable: function(){
            this.$el.find('.padding').css('height', 0);
        },
        events: {
            'click .word a': 'redirect_href',
        },
        redirect_href: function(e){
            var word = $(e.currentTarget).attr('href');
            if (/^\/search\/\?q=/.test(word))
               word = word.split('=', 2)[1];
            if (/^\/dictionary/.test(word))
                word = word.split('/', 3)[2];
            if (/^http:\/\/oald8/.test(word))
                word = null;

            if (word) {
                var showWord = word.split('#', 2), seg = '';
                if (showWord[1] == '') {
                    showWord = word.split('_', 1)[0];
                } else {
                    seg = showWord[1];
                    showWord = showWord[0];
                    word = showWord;
                }
                $('#search input').val(showWord);
                $('#search button').trigger('click', [word, seg]);
            }
            e.preventDefault();  
            e.stopPropagation();
        },
        ignore_event: function(e){
            e.preventDefault();
            e.stopPropagation();
        },
    });
    return (new ContentView());
});


