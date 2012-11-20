/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.2.0
build: 2676
*/
YUI.add("node-flick",function(C){var R="host",I="parentNode",S="boundingBox",A="offsetHeight",J="offsetWidth",E="scrollHeight",K="scrollWidth",G="bounce",O="minDistance",F="minVelocity",L="bounceDistance",D="deceleration",M="step",N="duration",P="easing",B="flick",H=C.ClassNameManager.getClassName;function Q(T){Q.superclass.constructor.apply(this,arguments);}Q.ATTRS={deceleration:{value:0.98},bounce:{value:0.7},bounceDistance:{value:150},minVelocity:{value:0},minDistance:{value:10},boundingBox:{valueFn:function(){return this.get(R).get(I);}},step:{value:10},duration:{value:null},easing:{value:null}};Q.NAME="pluginFlick";Q.NS="flick";C.extend(Q,C.Plugin.Base,{initializer:function(T){this._node=this.get(R);this._renderClasses();this.setBounds();this._node.on(B,C.bind(this._onFlick,this),{minDistance:this.get(O),minVelocity:this.get(F)});},setBounds:function(){var X=this.get(S),W=this._node,Y=X.get(A),V=X.get(J),U=W.get(E),T=W.get(K);if(U>Y){this._maxY=U-Y;this._minY=0;this._scrollY=true;}if(T>V){this._maxX=T-V;this._minX=0;this._scrollX=true;}this._x=this._y=0;W.set("top",this._y+"px");W.set("left",this._x+"px");},_renderClasses:function(){this.get(S).addClass(Q.CLASS_NAMES.box);this._node.addClass(Q.CLASS_NAMES.content);},_onFlick:function(T){this._v=T.flick.velocity;this._flick=true;this._flickAnim();},_flickAnim:function(){var a=this._y,b=this._x,T=this._maxY,W=this._minY,U=this._maxX,X=this._minX,Y=this._v,V=this.get(M),Z=this.get(D),c=this.get(G);this._v=(Y*Z);this._snapToEdge=false;if(this._scrollX){b=b-(Y*V);}if(this._scrollY){a=a-(Y*V);}if(Math.abs(Y).toFixed(4)<=Q.VELOCITY_THRESHOLD){this._flick=false;this._killTimer(!(this._exceededYBoundary||this._exceededXBoundary));if(this._scrollX){if(b<X){this._snapToEdge=true;this._setX(X);}else{if(b>U){this._snapToEdge=true;this._setX(U);}}}if(this._scrollY){if(a<W){this._snapToEdge=true;this._setY(W);}else{if(a>T){this._snapToEdge=true;this._setY(T);}}}}else{if(this._scrollX&&(b<X||b>U)){this._exceededXBoundary=true;this._v*=c;}if(this._scrollY&&(a<W||a>T)){this._exceededYBoundary=true;this._v*=c;}if(this._scrollX){this._setX(b);}if(this._scrollY){this._setY(a);}this._flickTimer=C.later(V,this,this._flickAnim);}},_setX:function(T){this._move(T,null,this.get(N),this.get(P));},_setY:function(T){this._move(null,T,this.get(N),this.get(P));},_move:function(T,W,U,V){if(T!==null){T=this._bounce(T);}else{T=this._x;}if(W!==null){W=this._bounce(W);}else{W=this._y;}U=U||this._snapToEdge?Q.SNAP_DURATION:0;V=V||this._snapToEdge?Q.SNAP_EASING:Q.EASING;this._x=T;this._y=W;this._anim(T,W,U,V);},_anim:function(T,Z,V,Y){var U=T*-1,X=Z*-1,W={duration:V/1000,easing:Y};if(C.Transition.useNative){W.transform="translate("+(U)+"px,"+(X)+"px)";}else{W.left=U+"px";W.top=X+"px";}this._node.transition(W);},_bounce:function(X,T){var V=this.get(G),W=this.get(L),U=V?-W:0;T=V?T+W:T;if(!V){if(X<U){X=U;}else{if(X>T){X=T;}}}return X;},_killTimer:function(){if(this._flickTimer){this._flickTimer.cancel();}}},{VELOCITY_THRESHOLD:0.015,SNAP_DURATION:400,EASING:"cubic-bezier(0, 0.1, 0, 1.0)",SNAP_EASING:"ease-out",CLASS_NAMES:{box:H(Q.NS),content:H(Q.NS,"content")}});C.Plugin.Flick=Q;},"3.2.0",{requires:["classnamemanager","transition","event-flick","plugin"]});