/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.2.0
build: 2676
*/
YUI.add("dom-screen",function(a){(function(f){var d="documentElement",q="compatMode",o="position",c="fixed",m="relative",g="left",h="top",i="BackCompat",p="medium",e="borderLeftWidth",b="borderTopWidth",r="getBoundingClientRect",k="getComputedStyle",l=f.DOM,n=/^t(?:able|d|h)$/i,j;if(f.UA.ie){if(f.config.doc[q]!=="quirks"){j=d;}else{j="body";}}f.mix(l,{winHeight:function(t){var s=l._getWinSize(t).height;return s;},winWidth:function(t){var s=l._getWinSize(t).width;return s;},docHeight:function(t){var s=l._getDocSize(t).height;return Math.max(s,l._getWinSize(t).height);},docWidth:function(t){var s=l._getDocSize(t).width;return Math.max(s,l._getWinSize(t).width);},docScrollX:function(u,v){v=v||(u)?l._getDoc(u):f.config.doc;var t=v.defaultView,s=(t)?t.pageXOffset:0;return Math.max(v[d].scrollLeft,v.body.scrollLeft,s);},docScrollY:function(u,v){v=v||(u)?l._getDoc(u):f.config.doc;var t=v.defaultView,s=(t)?t.pageYOffset:0;return Math.max(v[d].scrollTop,v.body.scrollTop,s);},getXY:function(){if(f.config.doc[d][r]){return function(w){var D=null,x,t,y,B,A,s,v,z,C,u;if(w&&w.tagName){C=w.ownerDocument;u=C[d];if(u.contains){inDoc=u.contains(w);}else{inDoc=f.DOM.contains(u,w);}if(inDoc){x=(j)?C[j].scrollLeft:l.docScrollX(w,C);t=(j)?C[j].scrollTop:l.docScrollY(w,C);y=w[r]();D=[y.left,y.top];if(f.UA.ie){B=2;A=2;z=C[q];s=l[k](C[d],e);v=l[k](C[d],b);if(f.UA.ie===6){if(z!==i){B=0;A=0;}}if((z==i)){if(s!==p){B=parseInt(s,10);}if(v!==p){A=parseInt(v,10);}}D[0]-=B;D[1]-=A;}if((t||x)){if(!f.UA.ios){D[0]+=x;D[1]+=t;}}}else{D=l._getOffset(w);}}return D;};}else{return function(t){var w=null,v,s,y,u,x;if(t){if(l.inDoc(t)){w=[t.offsetLeft,t.offsetTop];v=t.ownerDocument;s=t;y=((f.UA.gecko||f.UA.webkit>519)?true:false);while((s=s.offsetParent)){w[0]+=s.offsetLeft;w[1]+=s.offsetTop;if(y){w=l._calcBorders(s,w);}}if(l.getStyle(t,o)!=c){s=t;while((s=s.parentNode)){u=s.scrollTop;x=s.scrollLeft;if(f.UA.gecko&&(l.getStyle(s,"overflow")!=="visible")){w=l._calcBorders(s,w);}if(u||x){w[0]-=x;w[1]-=u;}}w[0]+=l.docScrollX(t,v);w[1]+=l.docScrollY(t,v);}else{w[0]+=l.docScrollX(t,v);w[1]+=l.docScrollY(t,v);}}else{w=l._getOffset(t);}}return w;};}}(),getX:function(s){return l.getXY(s)[0];},getY:function(s){return l.getXY(s)[1];},setXY:function(t,w,z){var u=l.setStyle,y,x,s,v;if(t&&w){y=l.getStyle(t,o);x=l._getOffset(t);if(y=="static"){y=m;u(t,o,y);}v=l.getXY(t);if(w[0]!==null){u(t,g,w[0]-v[0]+x[0]+"px");}if(w[1]!==null){u(t,h,w[1]-v[1]+x[1]+"px");}if(!z){s=l.getXY(t);if(s[0]!==w[0]||s[1]!==w[1]){l.setXY(t,w,true);}}}else{}},setX:function(t,s){return l.setXY(t,[s,null]);},setY:function(s,t){return l.setXY(s,[null,t]);},swapXY:function(t,s){var u=l.getXY(t);l.setXY(t,l.getXY(s));l.setXY(s,u);},_calcBorders:function(v,w){var u=parseInt(l[k](v,b),10)||0,s=parseInt(l[k](v,e),10)||0;if(f.UA.gecko){if(n.test(v.tagName)){u=0;s=0;}}w[0]+=s;w[1]+=u;return w;},_getWinSize:function(v,y){y=y||(v)?l._getDoc(v):f.config.doc;var x=y.defaultView||y.parentWindow,z=y[q],u=x.innerHeight,t=x.innerWidth,s=y[d];if(z&&!f.UA.opera){if(z!="CSS1Compat"){s=y.body;}u=s.clientHeight;t=s.clientWidth;}return{height:u,width:t};},_getDocSize:function(t){var u=(t)?l._getDoc(t):f.config.doc,s=u[d];if(u[q]!="CSS1Compat"){s=u.body;}return{height:s.scrollHeight,width:s.scrollWidth};}});})(a);(function(g){var d="top",c="right",h="bottom",b="left",f=function(m,k){var o=Math.max(m[d],k[d]),p=Math.min(m[c],k[c]),i=Math.min(m[h],k[h]),j=Math.max(m[b],k[b]),n={};n[d]=o;n[c]=p;n[h]=i;n[b]=j;return n;},e=g.DOM;g.mix(e,{region:function(j){var k=e.getXY(j),i=false;if(j&&k){i=e._getRegion(k[1],k[0]+j.offsetWidth,k[1]+j.offsetHeight,k[0]);}return i;},intersect:function(k,i,m){var j=m||e.region(k),l={},p=i,o;if(p.tagName){l=e.region(p);}else{if(g.Lang.isObject(i)){l=i;}else{return false;}}o=f(l,j);return{top:o[d],right:o[c],bottom:o[h],left:o[b],area:((o[h]-o[d])*(o[c]-o[b])),yoff:((o[h]-o[d])),xoff:(o[c]-o[b]),inRegion:e.inRegion(k,i,false,m)};},inRegion:function(l,i,j,o){var m={},k=o||e.region(l),q=i,p;if(q.tagName){m=e.region(q);}else{if(g.Lang.isObject(i)){m=i;}else{return false;}}if(j){return(k[b]>=m[b]&&k[c]<=m[c]&&k[d]>=m[d]&&k[h]<=m[h]);}else{p=f(m,k);if(p[h]>=p[d]&&p[c]>=p[b]){return true;}else{return false;}}},inViewportRegion:function(j,i,k){return e.inRegion(j,e.viewportRegion(j),i,k);},_getRegion:function(k,m,i,j){var n={};n[d]=n[1]=k;n[b]=n[0]=j;n[h]=i;n[c]=m;n.width=n[c]-n[b];n.height=n[h]-n[d];return n;},viewportRegion:function(j){j=j||g.config.doc.documentElement;var i=false,l,k;if(j){l=e.docScrollX(j);k=e.docScrollY(j);i=e._getRegion(k,e.winWidth(j)+l,k+e.winHeight(j),l);}return i;}});})(a);},"3.2.0",{requires:["dom-base","dom-style","event-base"]});