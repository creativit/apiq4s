/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.2.0
build: 2676
*/
YUI.add("io-xdr",function(C){var K=C.publish("io:xdrReady",{fireOnce:true}),F={},G={},B=L&&L.XDomainRequest,J=C.config.doc,L=C.config.win;function H(M,P){var N='<object id="yuiIoSwf" type="application/x-shockwave-flash" data="'+M+'" width="0" height="0">'+'<param name="movie" value="'+M+'">'+'<param name="FlashVars" value="yid='+P+'">'+'<param name="allowScriptAccess" value="always">'+"</object>",O=J.createElement("div");J.body.appendChild(O);O.innerHTML=N;}function A(M,N){M.c.onprogress=function(){G[M.id]=3;};M.c.onload=function(){G[M.id]=4;C.io.xdrResponse(M,N,"success");};M.c.onerror=function(){G[M.id]=4;C.io.xdrResponse(M,N,"failure");};if(N.timeout){M.c.ontimeout=function(){G[M.id]=4;C.io.xdrResponse(M,N,"timeout");};M.c.timeout=N.timeout;}}function D(Q,P,N){var O,M;if(!Q.e){O=P?decodeURI(Q.c.responseText):Q.c.responseText;M=N==="xml"?C.DataType.XML.parse(O):null;return{id:Q.id,c:{responseText:O,responseXML:M}};}else{return{id:Q.id,status:Q.e};}}function I(M,N){return M.c.abort(M.id,N);}function E(M){return B?G[M.id]!==4:M.c.isInProgress(M.id);}C.mix(C.io,{_transport:{},xdr:function(M,N,O){if(O.on&&O.xdr.use==="flash"){F[N.id]={on:O.on,context:O.context,arguments:O.arguments};O.context=null;O.form=null;N.c.send(M,O,N.id);}else{if(B){A(N,O);N.c.open(O.method||"GET",M);N.c.send(O.data);}else{N.c.send(M,N,O);}}return{id:N.id,abort:function(){return N.c?I(N,O):false;},isInProgress:function(){return N.c?E(N.id):false;}};},xdrResponse:function(R,S,Q){var N,M=B?G:F,P=S.xdr.use==="flash"?true:false,O=S.xdr.dataType;S.on=S.on||{};if(P){N=F[R.id]?F[R.id]:null;if(N){S.on=N.on;S.context=N.context;S.arguments=N.arguments;}}switch(Q.toLowerCase()){case"start":C.io.start(R.id,S);break;case"complete":C.io.complete(R,S);break;case"success":C.io.success(O||P?D(R,P,O):R,S);delete M[R.id];break;case"timeout":case"abort":case"failure":if(Q===("abort"||"timeout")){R.e=Q;}C.io.failure(O||P?D(R,P,O):R,S);delete M[R.id];break;}},xdrReady:function(M){C.fire(K,M);},transport:function(M){var N=M.yid?M.yid:C.id;M.id=M.id||"flash";if(M.id==="native"||M.id==="flash"){H(M.src,N);this._transport.flash=J.getElementById("yuiIoSwf");}else{this._transport[M.id]=M.src;}}});},"3.2.0",{requires:["io-base","datatype-xml"]});