/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.2.0
build: 2676
*/
YUI.add("features",function(c){var a={};c.mix(c.namespace("Features"),{tests:a,add:function(d,e,f){a[d]=a[d]||{};a[d][e]=f;},all:function(e,f){var g=a[e],d="";if(g){c.Object.each(g,function(i,h){d+=h+":"+(c.Features.test(e,h,f)?1:0)+";";});}return d;},test:function(e,g,f){var d,i,k,j=a[e],h=j&&j[g];if(!h){}else{d=h.result;if(c.Lang.isUndefined(d)){i=h.ua;if(i){d=(c.UA[i]);}k=h.test;if(k&&((!i)||d)){d=k.apply(c,f);}h.result=d;}}return d;}});var b=c.Features.add;b("load","0",{"trigger":"dom-style","ua":"ie"});b("load","1",{"test":function(e){var d=e.config.doc.documentMode;return e.UA.ie&&(!("onhashchange" in e.config.win)||!d||d<8);},"trigger":"history-hash"});b("load","2",{"test":function(d){return(d.config.win&&("ontouchstart" in d.config.win&&!d.UA.chrome));},"trigger":"dd-drag"});},"3.2.0",{requires:["yui-base"]});