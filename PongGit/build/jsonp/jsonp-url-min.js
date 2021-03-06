/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.2.0
build: 2676
*/
YUI.add("jsonp-url",function(D){var A=D.JSONPRequest,C=D.Object.getValue,B=function(){};D.mix(A.prototype,{_pattern:/\bcallback=(.*?)(?=&|$)/i,_template:"callback={callback}",_defaultCallback:function(G){var F=G.match(this._pattern),I=[],H=0,E,J,K;if(F){E=F[1].replace(/\[(['"])(.*?)\1\]/g,function(M,L,N){I[H]=N;return".@"+(H++);}).replace(/\[(\d+)\]/g,function(M,L){I[H]=parseInt(L,10)|0;return".@"+(H++);}).replace(/^\./,"");if(!/[^\w\.\$@]/.test(E)){J=E.split(".");for(H=J.length-1;H>=0;--H){if(J[H].charAt(0)==="@"){J[H]=I[parseInt(J[H].substr(1),10)];}}K=C(D.config.win,J)||C(D,J)||C(D,J.slice(1));}}return K||B;},_format:function(E,G){var H=this._template.replace(/\{callback\}/,G),F;if(this._pattern.test(E)){return E.replace(this._pattern,H);}else{F=E.slice(-1);if(F!=="&"&&F!=="?"){E+=(E.indexOf("?")>-1)?"&":"?";}return E+H;}}},true);},"3.2.0",{requires:["jsonp"]});