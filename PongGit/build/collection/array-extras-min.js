/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.2.0
build: 2676
*/
YUI.add("array-extras",function(d){var b=d.Lang,c=Array.prototype,a=d.Array;a.lastIndexOf=(c.lastIndexOf)?function(e,f){return e.lastIndexOf(f);}:function(e,g){for(var f=e.length-1;f>=0;f=f-1){if(e[f]===g){break;}}return f;};a.unique=function(f,h){var e=f.slice(),g=0,k=-1,j=null;while(g<e.length){j=e[g];while((k=a.lastIndexOf(e,j))!==g){e.splice(k,1);}g+=1;}if(h){if(b.isNumber(e[0])){e.sort(a.numericSort);}else{e.sort();}}return e;};a.filter=(c.filter)?function(e,g,h){return c.filter.call(e,g,h);}:function(e,h,i){var g=[];a.each(e,function(k,j,f){if(h.call(i,k,j,f)){g.push(k);}});return g;};a.reject=function(e,g,h){return a.filter(e,function(k,j,f){return !g.call(h,k,j,f);});};a.every=(c.every)?function(e,g,h){return c.every.call(e,g,h);}:function(g,j,k){for(var h=0,e=g.length;h<e;h=h+1){if(!j.call(k,g[h],h,g)){return false;}}return true;};a.map=(c.map)?function(e,g,h){return c.map.call(e,g,h);}:function(e,h,i){var g=[];a.each(e,function(k,j,f){g.push(h.call(i,k,j,f));});return g;};a.reduce=(c.reduce)?function(e,i,g,h){return c.reduce.call(e,function(l,k,j,f){return g.call(h,l,k,j,f);},i);}:function(e,j,h,i){var g=j;a.each(e,function(l,k,f){g=h.call(i,g,l,k,f);});return g;};a.find=function(g,j,k){for(var h=0,e=g.length;h<e;h++){if(j.call(k,g[h],h,g)){return g[h];}}return null;};a.grep=function(e,f){return a.filter(e,function(h,g){return f.test(h);});};a.partition=function(e,h,i){var g={matches:[],rejects:[]};a.each(e,function(j,f){var k=h.call(i,j,f,e)?g.matches:g.rejects;k.push(j);});return g;};a.zip=function(f,e){var g=[];a.each(f,function(i,h){g.push([i,e[h]]);});return g;};a.forEach=a.each;},"3.2.0");