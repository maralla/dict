define([
    'jquery',
    'underscore',
    'backbone',
    'views/searchview',
    'views/backbuttonview',
], function($, _, Backbone, SearchView, backView){
    var AppView = Backbone.View.extend({
        initialize: function(router){
            this.search = new SearchView(router);
            $('section.main').append(backView.el);
            backView.hide(0);
            $(document).on('scroll', function(e){
                if ($(window).scrollTop() >= 700) {
                    backView.show();
                } else {
                    backView.hide();
                }
            });
        },
        render: function(){
            this.search.render();
        }
    });

    return AppView;
});
