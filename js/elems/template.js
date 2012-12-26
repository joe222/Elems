define(['backbone','underscore', 'jquery','json2', 'translator'], function(Backbone, _, jQuery, JSON, Trans){

    var templateEngine=function(){
        this.templateSettings = {
            evaluate    : /<%([\s\S]+?)%>/g,
            interpolate : /<%=([\s\S]+?)%>/g,
            escape      : /<%-([\s\S]+?)%>/g
        };
        this.replaceSettings={
            escape:function(match, code) {
                return "'+\n((__t=(" + unescape(code) + "))==null?'':_.escape(__t))+\n'";
            },
            interpolate:function(match, code) {
                return "'+\n((__t=(" + unescape(code) + "))==null?'':__t)+\n'";
            },
            evaluate:function(match, code) {
                return "';\n" + unescape(code) + "\n__p+='";
            }
        }
    };
        
            
    _.extend(templateEngine.prototype,   {  
        finder:function(name){
            console.log(name+"Template");
            return $("#"+name+"Template").html();
            
        },
        create:function (Underscore){    
                
            var _={};
            // By default, Underscore uses ERB-style template delimiters, change the
            // following template settings to use alternative delimiters.
           

            // When customizing `templateSettings`, if you don't want to define an
            // interpolation, evaluation or escaping regex, we need one that is
            // guaranteed not to match.
            var noMatch = /.^/;

            // Certain characters need to be escaped so that they can be put into a
            // string literal.
            var escapes = {
                '\\':   '\\',
                "'":    "'",
                r:      '\r',
                n:      '\n',
                t:      '\t',
                u2028:  '\u2028',
                u2029:  '\u2029'
            };

            for (var key in escapes) escapes[escapes[key]] = key;
            var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
            var unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g;

            // Within an interpolation, evaluation, or escaping, remove HTML escaping
            // that had been previously added.
            var unescape = function(code) {
                return code.replace(unescaper, function(match, escape) {
                    return escapes[escape];
                });
            };

            var creator=this;
               
            _.template = function(text, data, settings) {
                settings = Underscore.defaults({}, settings, creator.templateSettings);

                // Compile the template source, taking care to escape characters that
                // cannot be included in a string literal and then unescape them in code
                // blocks.
                console.log(text);
                var source = "__p+='" + text
                .replace(escaper, function(match) {
                    return '\\' + escapes[match];
                })
                .replace(settings.escape || noMatch, creator.replaceSettings.escape )
                .replace(settings.interpolate || noMatch, creator.replaceSettings.interpolate )
                .replace(settings.evaluate || noMatch,creator.replaceSettings.evaluate ) + "';\n";

                // If a variable is not specified, place data values in local scope.
                if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

                source = "var __t,__p='',__j=Array.prototype.join," +
                "print=function(){__p+=__j.call(arguments,'');};\n" +
                source + "return __p;\n";

                try {
                    var render = new Function(settings.variable || 'obj', '_', source);
                } catch (e) {
                    e.source = source;
                    throw e;
                }

                if (data) return render(data,Underscore);
                var template = function(data) {
                    return render.call(this, data, Underscore);
                };

                // Provide the compiled function source as a convenience for precompilation.
                template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

                return template;
            };
            return _.template;
        }
    }   
    );
    //
  
    var viewTemplate=function(renderingObject,name,options){
        var id;
        if (name)
            id=name;
        else if (renderingObject.templating.name)
            id=renderingObject.templating.name;
        else throw e('templateName not set');
        options=options?options:{};     
       
        var obj={};
        var fn=function(){};
        if (renderingObject instanceof Backbone.View){
            fn=function(match, code){
                var id=_.uniqueId(code);
                obj[id]=code;
                return '<div id="'+id+'"></div>';
            }
        }
        if (renderingObject instanceof Backbone.Model){
            fn=function(match,code){
                return renderingObject.get(code);
            }
        }
        var  $parent=options.context?options.context:renderingObject.templating.context?renderingObject.templating.context:$("<div>");
        var  template=function(){
            var tc=new templateEngine();
            tc.templateSettings.interpolate=/\{\{(.+?)\}\}/g
            tc.templateSettings.evaluate=/\{\{\{(.+?)\}\}\}/g
            tc.replaceSettings.interpolate=fn;
            return tc.create(_);   
        }();   
        
        var addFn=options.addType?options.addType:'html';
        $parent[addFn]((template(templateEngine.prototype.finder(id))()));
        if (renderingObject instanceof Backbone.View){
            for (var i in obj){    
                var inclusion=renderingObject[obj[i]];
                if (inclusion){    
                    if (inclusion instanceof Backbone.View){
                        $parent.find("#"+i).html(inclusion.render().$el);
                        inclusion.$el.unwrap();     
                    };
                    if (inclusion.templating){                
                        if (inclusion.templating.innerCollection){                                         
                            inclusion.collection.each(function(item){                                
                                viewTemplate(item,inclusion.templating.innerCollection,{
                                    context:inclusion.$el, 
                                    addType:'append'
                                });
                            })
                        }
                    }
                }
            
            }
        }

        return     $parent.html();
    };

    return {
        templateEngine:templateEngine,
        view:viewTemplate,
    }
});
