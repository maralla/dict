define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone){
    var BackView = Backbone.View.extend({
        hide: function(speed){
            var s = null;
            s = (speed == 0) ? null : 'fast';
            this.$el.hide(s);
        },
        show: function(){
            this.$el.show('slow');
        },
        initialize: function(){
            this.$el.addClass('back');
        },
        events: {
            'click': 'back',
        },
        back: function(){
            $(window).scrollTop(0);
        },
    });
    return (new BackView());
});


