




define(['backbone','underscore', 'jquery', "elems/elems"],function   (Backbone, _, $, Elems) {
    var coll=new Backbone.Collection([{
        state:'',
        href:'ssss',
        title:'ssss'
    },

    {
        state:'',
        href:'ssss',
        title:'ssss'
    },

    {
        state:'',
        href:'ssss',
        title:'ssss'
    },

    {
        state:'',
        href:'ssss',
        title:'ssss'
    },

    {
        state:'active',
        href:'ssss',
        title:'ssss'
    },

    {
        state:'active',
        href:'ssss',
        title:'ssss'
    },

    {
        state:'',
        href:'ssss',
        title:'ssss'
    },

    {
        state:'',
        href:'ssss',
        title:'ssss'
    },

    {
        state:'',
        href:'ssss',
        title:'ssss'
    },

    {
        state:'',
        href:'ssss',
        title:'ssss'
    },])

    var App=new Elems.app;
    App.setTopNavigation(coll);
    App.run();
    
});
    