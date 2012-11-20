/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.2.0
build: 2676
*/
YUI.add("attribute-base",function(C){C.State=function(){this.data={};};C.State.prototype={add:function(O,Y,f){var e=this.data;e[Y]=e[Y]||{};e[Y][O]=f;},addAll:function(O,d){var Y;for(Y in d){if(d.hasOwnProperty(Y)){this.add(O,Y,d[Y]);}}},remove:function(O,Y){var e=this.data;if(e[Y]&&(O in e[Y])){delete e[Y][O];}},removeAll:function(O,e){var Y=this.data;C.each(e||Y,function(f,d){if(C.Lang.isString(d)){this.remove(O,d);}else{this.remove(O,f);}},this);},get:function(O,Y){var e=this.data;return(e[Y]&&O in e[Y])?e[Y][O]:undefined;},getAll:function(O){var e=this.data,Y;C.each(e,function(f,d){if(O in e[d]){Y=Y||{};Y[d]=f[O];}},this);return Y;}};var K=C.Object,F=C.Lang,L=C.EventTarget,X=".",U="Change",N="getter",M="setter",P="readOnly",Z="writeOnce",V="initOnly",c="validator",H="value",Q="valueFn",E="broadcast",S="lazyAdd",J="_bypassProxy",b="added",B="initializing",I="initValue",W="published",T="defaultValue",A="lazy",R="isLazyAdd",G,a={};a[P]=1;a[Z]=1;a[N]=1;a[E]=1;function D(){var d=this,O=this.constructor.ATTRS,Y=C.Base;d._ATTR_E_FACADE={};L.call(d,{emitFacade:true});d._conf=d._state=new C.State();d._stateProxy=d._stateProxy||null;d._requireAddAttr=d._requireAddAttr||false;if(O&&!(Y&&d instanceof Y)){d.addAttrs(this._protectAttrs(O));}}D.INVALID_VALUE={};G=D.INVALID_VALUE;D._ATTR_CFG=[M,N,c,H,Q,Z,P,S,E,J];D.prototype={addAttr:function(Y,O,e){var f=this,h=f._state,g,d;e=(S in O)?O[S]:e;if(e&&!f.attrAdded(Y)){h.add(Y,A,O||{});h.add(Y,b,true);}else{if(!f.attrAdded(Y)||h.get(Y,R)){O=O||{};d=(H in O);if(d){g=O.value;delete O.value;}O.added=true;O.initializing=true;h.addAll(Y,O);if(d){f.set(Y,g);}h.remove(Y,B);}}return f;},attrAdded:function(O){return !!this._state.get(O,b);},modifyAttr:function(Y,O){var d=this,f,e;if(d.attrAdded(Y)){if(d._isLazyAttr(Y)){d._addLazyAttr(Y);}e=d._state;for(f in O){if(a[f]&&O.hasOwnProperty(f)){e.add(Y,f,O[f]);if(f===E){e.remove(Y,W);}}}}},removeAttr:function(O){this._state.removeAll(O);},get:function(O){return this._getAttr(O);},_isLazyAttr:function(O){return this._state.get(O,A);},_addLazyAttr:function(Y){var d=this._state,O=d.get(Y,A);d.add(Y,R,true);d.remove(Y,A);this.addAttr(Y,O);},set:function(O,d,Y){return this._setAttr(O,d,Y);},reset:function(O){var d=this,Y;if(O){if(d._isLazyAttr(O)){d._addLazyAttr(O);}d.set(O,d._state.get(O,I));}else{Y=d._state.data.added;C.each(Y,function(e,f){d.reset(f);},d);}return d;},_set:function(O,d,Y){return this._setAttr(O,d,Y,true);},_getAttr:function(d){var e=this,i=d,f=e._state,g,O,h,Y;if(d.indexOf(X)!==-1){g=d.split(X);d=g.shift();}if(e._tCfgs&&e._tCfgs[d]){Y={};Y[d]=e._tCfgs[d];delete e._tCfgs[d];e._addAttrs(Y,e._tVals);}if(e._isLazyAttr(d)){e._addLazyAttr(d);}h=e._getStateVal(d);O=f.get(d,N);if(O&&!O.call){O=this[O];}h=(O)?O.call(e,h,i):h;h=(g)?K.getValue(h,g):h;return h;},_setAttr:function(d,g,O,e){var k=true,Y=this._state,h=this._stateProxy,m=Y.data,j,n,o,f,i,l;if(d.indexOf(X)!==-1){n=d;o=d.split(X);d=o.shift();}if(this._isLazyAttr(d)){this._addLazyAttr(d);}j=(!m.value||!(d in m.value));if(h&&d in h&&!this._state.get(d,J)){j=false;}if(this._requireAddAttr&&!this.attrAdded(d)){}else{i=Y.get(d,Z);l=Y.get(d,B);if(!j&&!e){if(i){k=false;}if(Y.get(d,P)){k=false;}}if(!l&&!e&&i===V){k=false;}if(k){if(!j){f=this.get(d);}if(o){g=K.setValue(C.clone(f),o,g);if(g===undefined){k=false;}}if(k){if(l){this._setAttrVal(d,n,f,g);}else{this._fireAttrChange(d,n,f,g,O);}}}}return this;},_fireAttrChange:function(h,g,e,d,O){var j=this,f=h+U,Y=j._state,i;if(!Y.get(h,W)){j.publish(f,{queuable:false,defaultTargetOnly:true,defaultFn:j._defAttrChangeFn,silent:true,broadcast:Y.get(h,E)});Y.add(h,W,true);}i=(O)?C.merge(O):j._ATTR_E_FACADE;i.type=f;i.attrName=h;i.subAttrName=g;i.prevVal=e;i.newVal=d;j.fire(i);},_defAttrChangeFn:function(O){if(!this._setAttrVal(O.attrName,O.subAttrName,O.prevVal,O.newVal)){O.stopImmediatePropagation();}else{O.newVal=this.get(O.attrName);}},_getStateVal:function(O){var Y=this._stateProxy;return Y&&(O in Y)&&!this._state.get(O,J)?Y[O]:this._state.get(O,H);},_setStateVal:function(O,d){var Y=this._stateProxy;if(Y&&(O in Y)&&!this._state.get(O,J)){Y[O]=d;}else{this._state.add(O,H,d);}},_setAttrVal:function(m,l,i,g){var o=this,j=true,d=o._state,e=d.get(m,c),h=d.get(m,M),k=d.get(m,B),n=this._getStateVal(m),Y=l||m,f,O;if(e){if(!e.call){e=this[e];}if(e){O=e.call(o,g,Y);if(!O&&k){g=d.get(m,T);O=true;}}}if(!e||O){if(h){if(!h.call){h=this[h];}if(h){f=h.call(o,g,Y);if(f===G){j=false;}else{if(f!==undefined){g=f;}}}}if(j){if(!l&&(g===n)&&!F.isObject(g)){j=false;}else{if(d.get(m,I)===undefined){d.add(m,I,g);}o._setStateVal(m,g);}}}else{j=false;}return j;},setAttrs:function(O,Y){return this._setAttrs(O,Y);},_setAttrs:function(Y,d){for(var O in Y){if(Y.hasOwnProperty(O)){this.set(O,Y[O]);}}return this;},getAttrs:function(O){return this._getAttrs(O);},_getAttrs:function(e){var g=this,j={},f,Y,O,h,d=(e===true);e=(e&&!d)?e:K.keys(g._state.data.added);for(f=0,Y=e.length;f<Y;f++){O=e[f];h=g.get(O);if(!d||g._getStateVal(O)!=g._state.get(O,I)){j[O]=g.get(O);}}return j;},addAttrs:function(O,Y,d){var e=this;if(O){e._tCfgs=O;e._tVals=e._normAttrVals(Y);e._addAttrs(O,e._tVals,d);e._tCfgs=e._tVals=null;}return e;},_addAttrs:function(Y,d,e){var g=this,O,f,h;for(O in Y){if(Y.hasOwnProperty(O)){f=Y[O];f.defaultValue=f.value;h=g._getAttrInitVal(O,f,g._tVals);if(h!==undefined){f.value=h;}if(g._tCfgs[O]){delete g._tCfgs[O];}g.addAttr(O,f,e);}}},_protectAttrs:function(Y){if(Y){Y=C.merge(Y);for(var O in Y){if(Y.hasOwnProperty(O)){Y[O]=C.merge(Y[O]);}}}return Y;},_normAttrVals:function(O){return(O)?C.merge(O):null;},_getAttrInitVal:function(O,Y,e){var f,d;if(!Y[P]&&e&&e.hasOwnProperty(O)){f=e[O];}else{f=Y[H];d=Y[Q];if(d){if(!d.call){d=this[d];}if(d){f=d.call(this);}}}return f;},_getAttrCfg:function(O){var d,Y=this._state.data;if(Y){d={};C.each(Y,function(e,f){if(O){if(O in e){d[f]=e[O];}}else{C.each(e,function(h,g){d[g]=d[g]||{};d[g][f]=h;});}});}return d;}};C.mix(D,L,false,null,1);C.Attribute=D;},"3.2.0",{requires:["event-custom"]});