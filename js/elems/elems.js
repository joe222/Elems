define(['backbone', 'underscore', 'jquery','json2', 'elems/template'], function(Backbone, _, jQuery, JSON,Template){
   
    var Elems={
        template:Template,
        _local:{},
    };
    
   var TopNavigationView=Backbone.View.extend({
       className:'nav',
       tagName:'ul',
       templating:{
           innerCollection:'navItem',
       },
   }); 
   
   var BodyView=Backbone.View.extend({
        _ensureElement:function(){
            this.setElement($('body'));
        },
        initialize:function(options){
            this.options=_.extend({
                template:'body'
            },options);
            this.tempating=_.extend(this.templating,{name:this.options.template,context:this.$el});
            this.topNavigation=new Elems.view.topNavigation({collection:options.topNavigation});
           Template.view(this);
        },
        templating:{},
    });
   
   
   var App=function(){
       this.init();
   };
   App.prototype=_.extend(App.prototype,{
      init:function(){
          this._local={};
      },
      run:function(){
          this.getBody(
      {
          topNavigation:this._local.topNavigation,
      });
      },
      getBody:function(options){
            if (!this._local.body){
                this._local.body=new Elems.view.body(options);
            }   
                return this._local.body;            
        },
     setTopNavigation:function(collection){
         this._local.topNavigation=collection;
     }
   });
   
    Elems=_.extend(Elems,{
        view:{
            body:BodyView,
            topNavigation:TopNavigationView
            
        },
        app:App,
    })
   
    return Elems;
});
