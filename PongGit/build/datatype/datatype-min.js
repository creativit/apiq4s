/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.2.0
build: 2676
*/
YUI.add("datatype-number-parse",function(B){var A=B.Lang;B.mix(B.namespace("DataType.Number"),{parse:function(D){var C=(D===null)?D:+D;if(A.isNumber(C)){return C;}else{return null;}}});B.namespace("Parsers").number=B.DataType.Number.parse;},"3.2.0");YUI.add("datatype-number-format",function(B){var A=B.Lang;B.mix(B.namespace("DataType.Number"),{format:function(I,E){if(A.isNumber(I)){E=E||{};var D=(I<0),F=I+"",M=E.decimalPlaces,C=E.decimalSeparator||".",L=E.thousandsSeparator,K,G,J,H;if(A.isNumber(M)&&(M>=0)&&(M<=20)){F=I.toFixed(M);}if(C!=="."){F=F.replace(".",C);}if(L){K=F.lastIndexOf(C);K=(K>-1)?K:F.length;G=F.substring(K);for(J=0,H=K;H>0;H--){if((J%3===0)&&(H!==K)&&(!D||(H>1))){G=L+G;}G=F.charAt(H-1)+G;J++;}F=G;}F=(E.prefix)?E.prefix+F:F;F=(E.suffix)?F+E.suffix:F;return F;}else{return(A.isValue(I)&&I.toString)?I.toString():"";}}});},"3.2.0");YUI.add("datatype-number",function(A){},"3.2.0",{use:["datatype-number-parse","datatype-number-format"]});YUI.add("datatype-date-parse",function(B){var A=B.Lang;B.mix(B.namespace("DataType.Date"),{parse:function(D){var C=null;if(!(A.isDate(D))){C=new Date(D);}else{return C;}if(A.isDate(C)&&(C!="Invalid Date")&&!isNaN(C)){return C;}else{return null;}}});B.namespace("Parsers").date=B.DataType.Date.parse;},"3.2.0");YUI.add("datatype-date-format",function(D){var A=function(E,G,F){if(typeof F==="undefined"){F=10;}G=G.toString();for(;parseInt(E,10)<F&&F>1;F/=10){E=G+E;}return E.toString();};var C={formats:{a:function(F,E){return E.a[F.getDay()];},A:function(F,E){return E.A[F.getDay()];},b:function(F,E){return E.b[F.getMonth()];},B:function(F,E){return E.B[F.getMonth()];},C:function(E){return A(parseInt(E.getFullYear()/100,10),0);},d:["getDate","0"],e:["getDate"," "],g:function(E){return A(parseInt(C.formats.G(E)%100,10),0);},G:function(G){var H=G.getFullYear();var F=parseInt(C.formats.V(G),10);var E=parseInt(C.formats.W(G),10);if(E>F){H++;}else{if(E===0&&F>=52){H--;}}return H;},H:["getHours","0"],I:function(F){var E=F.getHours()%12;return A(E===0?12:E,0);},j:function(I){var H=new Date(""+I.getFullYear()+"/1/1 GMT");var F=new Date(""+I.getFullYear()+"/"+(I.getMonth()+1)+"/"+I.getDate()+" GMT");var E=F-H;var G=parseInt(E/60000/60/24,10)+1;return A(G,0,100);},k:["getHours"," "],l:function(F){var E=F.getHours()%12;return A(E===0?12:E," ");},m:function(E){return A(E.getMonth()+1,0);},M:["getMinutes","0"],p:function(F,E){return E.p[F.getHours()>=12?1:0];},P:function(F,E){return E.P[F.getHours()>=12?1:0];},s:function(F,E){return parseInt(F.getTime()/1000,10);},S:["getSeconds","0"],u:function(E){var F=E.getDay();return F===0?7:F;},U:function(H){var E=parseInt(C.formats.j(H),10);var G=6-H.getDay();var F=parseInt((E+G)/7,10);return A(F,0);},V:function(H){var G=parseInt(C.formats.W(H),10);var E=(new Date(""+H.getFullYear()+"/1/1")).getDay();var F=G+(E>4||E<=1?0:1);if(F===53&&(new Date(""+H.getFullYear()+"/12/31")).getDay()<4){F=1;}else{if(F===0){F=C.formats.V(new Date(""+(H.getFullYear()-1)+"/12/31"));}}return A(F,0);},w:"getDay",W:function(H){var E=parseInt(C.formats.j(H),10);var G=7-C.formats.u(H);var F=parseInt((E+G)/7,10);return A(F,0,10);},y:function(E){return A(E.getFullYear()%100,0);},Y:"getFullYear",z:function(G){var F=G.getTimezoneOffset();var E=A(parseInt(Math.abs(F/60),10),0);var I=A(Math.abs(F%60),0);return(F>0?"-":"+")+E+I;},Z:function(E){var F=E.toString().replace(/^.*:\d\d( GMT[+-]\d+)? \(?([A-Za-z ]+)\)?\d*$/,"$2").replace(/[a-z ]/g,"");if(F.length>4){F=C.formats.z(E);}return F;},"%":function(E){return"%";}},aggregates:{c:"locale",D:"%m/%d/%y",F:"%Y-%m-%d",h:"%b",n:"\n",r:"%I:%M:%S %p",R:"%H:%M",t:"\t",T:"%H:%M:%S",x:"locale",X:"locale"},format:function(O,J){J=J||{};if(!D.Lang.isDate(O)){return D.Lang.isValue(O)?O:"";}var N,E,I,G,M;N=J.format||D.config.dateFormat||"%Y-%m-%d";I=D.Lang.isUndefined(D.config.lang)&&(D.Lang.isValue(J.locale)||D.Lang.isValue(D.config.locale));if(I){G=J.locale||D.config.locale;M=D.DataType.Date.Locale;G=G.replace(/_/g,"-");if(!M[G]){var H=G.replace(/-[a-zA-Z]+$/,"");if(H in M){G=H;}else{if(D.config.locale in M){G=D.config.locale;}else{G="en";}}}E=M[G];}else{E=D.Intl.get("datatype-date-format");}var K=function(Q,P){if(I&&P==="r"){return E[P];}var R=C.aggregates[P];return(R==="locale"?E[P]:R);};var F=function(Q,P){var R=C.formats[P];switch(D.Lang.type(R)){case"string":return O[R]();case"function":return R.call(O,O,E);case"array":if(D.Lang.type(R[0])==="string"){return A(O[R[0]](),R[1]);}default:return P;}};while(N.match(/%[cDFhnrRtTxX]/)){N=N.replace(/%([cDFhnrRtTxX])/g,K);}var L=N.replace(/%([aAbBCdegGHIjklmMpPsSuUVwWyYzZ%])/g,F);K=F=undefined;return L;}};D.mix(D.namespace("DataType.Date"),C);var B={a:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],A:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],b:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],B:["January","February","March","April","May","June","July","August","September","October","November","December"],c:"%a %d %b %Y %T %Z",p:["AM","PM"],P:["am","pm"],r:"%I:%M:%S %p",x:"%d/%m/%y",X:"%T"};D.namespace("DataType.Date.Locale");D.DataType.Date.Locale["en"]=B;D.DataType.Date.Locale["en-US"]=D.merge(B,{c:"%a %d %b %Y %I:%M:%S %p %Z",x:"%m/%d/%Y",X:"%I:%M:%S %p"});D.DataType.Date.Locale["en-GB"]=D.merge(B,{r:"%l:%M:%S %P %Z"});D.DataType.Date.Locale["en-AU"]=D.merge(B);},"3.2.0",{lang:["ar","ar-JO","ca","ca-ES","da","da-DK","de","de-AT","de-DE","el","el-GR","en","en-AU","en-CA","en-GB","en-IE","en-IN","en-JO","en-MY","en-NZ","en-PH","en-SG","en-US","es","es-AR","es-BO","es-CL","es-CO","es-EC","es-ES","es-MX","es-PE","es-PY","es-US","es-UY","es-VE","fi","fi-FI","fr","fr-BE","fr-CA","fr-FR","hi","hi-IN","id","id-ID","it","it-IT","ja","ja-JP","ko","ko-KR","ms","ms-MY","nb","nb-NO","nl","nl-BE","nl-NL","pl","pl-PL","pt","pt-BR","ro","ro-RO","ru","ru-RU","sv","sv-SE","th","th-TH","tr","tr-TR","vi","vi-VN","zh-Hans","zh-Hans-CN","zh-Hant","zh-Hant-HK","zh-Hant-TW"]});YUI.add("datatype-date",function(A){},"3.2.0",{use:["datatype-date-parse","datatype-date-format"]});
YUI.add("datatype-xml-parse",function(B){var A=B.Lang;B.mix(B.namespace("DataType.XML"),{parse:function(E){var D=null;if(A.isString(E)){try{if(!A.isUndefined(DOMParser)){D=new DOMParser().parseFromString(E,"text/xml");}}catch(F){try{if(!A.isUndefined(ActiveXObject)){D=new ActiveXObject("Microsoft.XMLDOM");D.async=false;D.loadXML(E);}}catch(C){}}}if((A.isNull(D))||(A.isNull(D.documentElement))||(D.documentElement.nodeName==="parsererror")){}return D;}});B.namespace("Parsers").xml=B.DataType.XML.parse;},"3.2.0");YUI.add("datatype-xml-format",function(B){var A=B.Lang;B.mix(B.namespace("DataType.XML"),{format:function(C){try{if(!A.isUndefined(XMLSerializer)){return(new XMLSerializer()).serializeToString(C);}}catch(D){if(C&&C.xml){return C.xml;}else{return(A.isValue(C)&&C.toString)?C.toString():"";}}}});},"3.2.0");YUI.add("datatype-xml",function(A){},"3.2.0",{use:["datatype-xml-parse","datatype-xml-format"]});YUI.add("datatype",function(A){},"3.2.0",{use:["datatype-number","datatype-date","datatype-xml"]});