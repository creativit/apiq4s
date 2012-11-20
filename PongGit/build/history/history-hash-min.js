/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.2.0
build: 2676
*/
YUI.add("history-hash",function(A){var C=A.HistoryBase,F=A.Lang,K=A.Array,J=YUI.namespace("Env.HistoryHash"),B="hash",E,D,I,H=A.config.win,L=H.location,M=A.config.useHistoryHTML5;function G(){G.superclass.constructor.apply(this,arguments);}A.extend(G,C,{_init:function(N){var O=G.parseHash();N=N||{};this._initialState=N.initialState?A.merge(N.initialState,O):O;A.after("hashchange",A.bind(this._afterHashChange,this),H);G.superclass._init.apply(this,arguments);},_storeState:function(P,O){var N=G.createHash(O);G.superclass._storeState.apply(this,arguments);if(G.getHash()!==N){G[P===C.SRC_REPLACE?"replaceHash":"setHash"](N);}},_afterHashChange:function(N){this._resolveChanges(B,G.parseHash(N.newHash),{});}},{NAME:"historyHash",SRC_HASH:B,hashPrefix:"",_REGEX_HASH:/([^\?#&]+)=([^&]+)/g,createHash:function(P){var N=G.encode,O=[];A.Object.each(P,function(R,Q){if(F.isValue(R)){O.push(N(Q)+"="+N(R));}});return O.join("&");},decode:function(N){return decodeURIComponent(N.replace(/\+/g," "));},encode:function(N){return encodeURIComponent(N).replace(/%20/g,"+");},getHash:(A.UA.gecko?function(){var O=/#(.*)$/.exec(L.href),P=O&&O[1]||"",N=G.hashPrefix;return N&&P.indexOf(N)===0?P.replace(N,""):P;}:function(){var O=L.hash.substr(1),N=G.hashPrefix;return N&&O.indexOf(N)===0?O.replace(N,""):O;}),getUrl:function(){return L.href;},parseHash:function(Q){var N=G.decode,R,U,S,O,P={},T=G.hashPrefix,V;Q=F.isValue(Q)?Q:G.getHash();if(T){V=Q.indexOf(T);if(V===0||(V===1&&Q.charAt(0)==="#")){Q=Q.replace(T,"");}}S=Q.match(G._REGEX_HASH)||[];for(R=0,U=S.length;R<U;++R){O=S[R].split("=");P[N(O[0])]=N(O[1]);}return P;},replaceHash:function(N){if(N.charAt(0)==="#"){N=N.substr(1);}L.replace("#"+(G.hashPrefix||"")+N);},setHash:function(N){if(N.charAt(0)==="#"){N=N.substr(1);}L.hash=(G.hashPrefix||"")+N;}});E=J._notifiers;if(!E){E=J._notifiers=[];}A.Event.define("hashchange",{on:function(P,N,O){if(P.compareTo(H)||P.compareTo(A.config.doc.body)){E.push(O);}},detach:function(Q,O,P){var N=K.indexOf(E,P);if(N!==-1){E.splice(N,1);}}});D=G.getHash();I=G.getUrl();if(C.nativeHashChange){A.Event.attach("hashchange",function(P){var N=G.getHash(),O=G.getUrl();K.each(E.concat(),function(Q){Q.fire({_event:P,oldHash:D,oldUrl:I,newHash:N,newUrl:O});});D=N;I=O;},H);}else{if(!J._hashPoll){if(A.UA.webkit&&!A.UA.chrome&&navigator.vendor.indexOf("Apple")!==-1){A.on("unload",function(){},H);}J._hashPoll=A.later(50,null,function(){var N=G.getHash(),O;if(D!==N){O=G.getUrl();K.each(E,function(P){P.fire({oldHash:D,oldUrl:I,newHash:N,newUrl:O});});D=N;I=O;}},null,true);}}A.HistoryHash=G;if(M===false||(!A.History&&M!==true&&(!C.html5||!A.HistoryHTML5))){A.History=G;}},"3.2.0",{requires:["event-synthetic","history-base","yui-later"]});