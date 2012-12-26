nonlux={};
nonlux.conf={
    paths:{
        backbone:'backbone/backbone',
        jquery:'jquery/jquery',
        json2:'vendors/json2',
        underscore:'vendors/underscore',
        
    },
    shim:{
        jquery:{exports:'jQuery'},
        underscore:{exports:'_'},
        json2:{exports:'JSON'},
        backbone:{deps:['jquery','json2','underscore'], exports:'Backbone'},
    }
};

nonlux.conf.paths.trans_empty="http://admin.apex/bundles/bazingaexposetranslation/js/translation"; 
nonlux.conf.paths.translator_files="http://admin.apex/app_dev.php/ru/i18n";
nonlux.conf.paths.translator="http://admin.apex/app_dev.php/ru/i18n/icons";
nonlux.conf.paths.fos_routing_empty="http://admin.apex/bundles/fosjsrouting/js/router";
nonlux.conf.paths.fos_routing="http://admin.apex/app_dev.php/js/routing?callback=fos.Router.setData";

nonlux.conf.shim.trans_empty={exports:"ExposeTranslation"};
nonlux.conf.shim['translator_files/massages']={exports:"ExposeTranslation",deps:['trans_empty']};
nonlux.conf.shim.translator={exports:"ExposeTranslation", deps:['translator_files/massages']};
nonlux.conf.shim.for_routing_empty={exports:"fos.Router"},
nonlux.conf.shim.fos_routing={exports:"fos.Router", deps:['for_routing_empaty']};
nonlux.conf.deps=['app/main']
requirejs.config(nonlux.conf);