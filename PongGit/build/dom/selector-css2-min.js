/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.2.0
build: 2676
*/
YUI.add("selector-css2",function(G){var H="parentNode",D="tagName",E="attributes",A="combinator",F="pseudos",C=G.Selector,B={_reRegExpTokens:/([\^\$\?\[\]\*\+\-\.\(\)\|\\])/,SORT_RESULTS:true,_children:function(M,I){var J=M.children,L,K=[],N,O;if(M.children&&I&&M.children.tags){K=M.children.tags(I);}else{if((!J&&M[D])||(J&&I)){N=J||M.childNodes;J=[];for(L=0;(O=N[L++]);){if(O.tagName){if(!I||I===O.tagName){J.push(O);}}}}}return J||[];},_re:{attr:/(\[[^\]]*\])/g,pseudos:/:([\-\w]+(?:\(?:['"]?(.+)['"]?\)))*/i},shorthand:{"\\#(-?[_a-z]+[-\\w]*)":"[id=$1]","\\.(-?[_a-z]+[-\\w]*)":"[className~=$1]"},operators:{"":function(J,I){return G.DOM.getAttribute(J,I)!=="";},"~=":"(?:^|\\s+){val}(?:\\s+|$)","|=":"^{val}-?"},pseudos:{"first-child":function(I){return G.Selector._children(I[H])[0]===I;}},_bruteQuery:function(N,R,T){var O=[],I=[],Q=C._tokenize(N),M=Q[Q.length-1],S=G.DOM._getDoc(R),K,J,P,L;if(M){J=M.id;P=M.className;L=M.tagName||"*";if(R.getElementsByTagName){if(J&&(R.all||(R.nodeType===9||G.DOM.inDoc(R)))){I=G.DOM.allById(J,R);}else{if(P){I=R.getElementsByClassName(P);}else{I=R.getElementsByTagName(L);}}}else{K=R.firstChild;while(K){if(K.tagName){I.push(K);}K=K.nextSilbing||K.firstChild;}}if(I.length){O=C._filterNodes(I,Q,T);}}return O;},_filterNodes:function(R,N,P){var W=0,V,X=N.length,Q=X-1,M=[],T=R[0],a=T,Y=G.Selector.getters,L,U,K,O,I,S,J,Z;for(W=0;(a=T=R[W++]);){Q=X-1;O=null;testLoop:while(a&&a.tagName){K=N[Q];J=K.tests;V=J.length;if(V&&!I){while((Z=J[--V])){L=Z[1];if(Y[Z[0]]){S=Y[Z[0]](a,Z[0]);}else{S=a[Z[0]];if(S===undefined&&a.getAttribute){S=a.getAttribute(Z[0]);}}if((L==="="&&S!==Z[2])||(typeof L!=="string"&&L.test&&!L.test(S))||(!L.test&&typeof L==="function"&&!L(a,Z[0]))){if((a=a[O])){while(a&&(!a.tagName||(K.tagName&&K.tagName!==a.tagName))){a=a[O];}}continue testLoop;}}}Q--;if(!I&&(U=K.combinator)){O=U.axis;a=a[O];while(a&&!a.tagName){a=a[O];}if(U.direct){O=null;}}else{M.push(T);if(P){return M;}break;}}}T=a=null;return M;},combinators:{" ":{axis:"parentNode"},">":{axis:"parentNode",direct:true},"+":{axis:"previousSibling",direct:true}},_parsers:[{name:E,re:/^\[(-?[a-z]+[\w\-]*)+([~\|\^\$\*!=]=?)?['"]?([^\]]*?)['"]?\]/i,fn:function(K,L){var J=K[2]||"",I=G.Selector.operators,M;if((K[1]==="id"&&J==="=")||(K[1]==="className"&&G.config.doc.documentElement.getElementsByClassName&&(J==="~="||J==="="))){L.prefilter=K[1];L[K[1]]=K[3];}if(J in I){M=I[J];if(typeof M==="string"){K[3]=K[3].replace(G.Selector._reRegExpTokens,"\\$1");M=G.DOM._getRegExp(M.replace("{val}",K[3]));}K[2]=M;}if(!L.last||L.prefilter!==K[1]){return K.slice(1);}}},{name:D,re:/^((?:-?[_a-z]+[\w-]*)|\*)/i,fn:function(J,K){var I=J[1].toUpperCase();K.tagName=I;if(I!=="*"&&(!K.last||K.prefilter)){return[D,"=",I];}if(!K.prefilter){K.prefilter="tagName";}}},{name:A,re:/^\s*([>+~]|\s)\s*/,fn:function(I,J){}},{name:F,re:/^:([\-\w]+)(?:\(['"]?(.+)['"]?\))*/i,fn:function(I,J){var K=C[F][I[1]];if(K){return[I[2],K];}else{return false;}}}],_getToken:function(I){return{tagName:null,id:null,className:null,attributes:{},combinator:null,tests:[]};},_tokenize:function(K){K=K||"";K=C._replaceShorthand(G.Lang.trim(K));var J=C._getToken(),P=K,O=[],Q=false,M,N,L,I;outer:do{Q=false;for(L=0;(I=C._parsers[L++]);){if((M=I.re.exec(K))){if(I.name!==A){J.selector=K;}K=K.replace(M[0],"");if(!K.length){J.last=true;}if(C._attrFilters[M[1]]){M[1]=C._attrFilters[M[1]];}N=I.fn(M,J);if(N===false){Q=false;break outer;}else{if(N){J.tests.push(N);}}if(!K.length||I.name===A){O.push(J);J=C._getToken(J);if(I.name===A){J.combinator=G.Selector.combinators[M[1]];}}Q=true;}}}while(Q&&K.length);if(!Q||K.length){O=[];}return O;},_replaceShorthand:function(J){var K=C.shorthand,L=J.match(C._re.attr),O=J.match(C._re.pseudos),N,M,I;if(O){J=J.replace(C._re.pseudos,"!!REPLACED_PSEUDO!!");}if(L){J=J.replace(C._re.attr,"!!REPLACED_ATTRIBUTE!!");}for(N in K){if(K.hasOwnProperty(N)){J=J.replace(G.DOM._getRegExp(N,"gi"),K[N]);}}if(L){for(M=0,I=L.length;M<I;++M){J=J.replace("!!REPLACED_ATTRIBUTE!!",L[M]);}}if(O){for(M=0,I=O.length;M<I;++M){J=J.replace("!!REPLACED_PSEUDO!!",O[M]);}}return J;},_attrFilters:{"class":"className","for":"htmlFor"},getters:{href:function(J,I){return G.DOM.getAttribute(J,I);}}};G.mix(G.Selector,B,true);G.Selector.getters.src=G.Selector.getters.rel=G.Selector.getters.href;if(G.Selector.useNative&&G.config.doc.querySelector){G.Selector.shorthand["\\.(-?[_a-z]+[-\\w]*)"]="[class~=$1]";}},"3.2.0",{requires:["selector-native"]});