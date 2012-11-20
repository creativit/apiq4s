/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.2.0
build: 2676
*/
YUI.add("node-menunav",function(D){var m=D.UA,u=D.later,AM=D.ClassNameManager.getClassName,R="menu",G="menuitem",AI="hidden",S="parentNode",V="children",AA="offsetHeight",AD="offsetWidth",AO="px",g="id",I=".",E="handledMouseOut",s="handledMouseOver",a="active",AK="label",d="a",x="mousedown",AP="keydown",AC="click",Q="",U="first-of-type",AQ="role",N="presentation",AE="descendants",j="UI",v="activeDescendant",J="useARIA",y="aria-hidden",z="content",c="host",h=v+"Change",w="autoSubmenuDisplay",T="mouseOutHideDelay",l=AM(R),AG=AM(R,AI),Z=AM(R,"horizontal"),AJ=AM(R,AK),k=AM(R,AK,a),X=AM(R,AK,(R+"visible")),K=AM(G),A=AM(G,a),i=I+l,AH=(I+AM(R,"toggle")),n=I+AM(R,z),AR=I+AJ,AN=">"+n+">ul>li>a",O=">"+n+">ul>li>"+AR+">a:first-child";var L=function(Y){var AT=Y.previous(),AS;if(!AT){AS=Y.get(S).get(V);AT=AS.item(AS.size()-1);}return AT;};var b=function(Y){var AS=Y.next();if(!AS){AS=Y.get(S).get(V).item(0);}return AS;};var F=function(Y){var AS=false;if(Y){AS=Y.get("nodeName").toLowerCase()===d;}return AS;};var P=function(Y){return Y.hasClass(K);};var t=function(Y){return Y.hasClass(AJ);};var r=function(Y){return Y.hasClass(Z);};var o=function(Y){return Y.hasClass(X);};var q=function(Y){return F(Y)?Y:Y.one(d);};var AB=function(AT,AS,Y){var AU;if(AT){if(AT.hasClass(AS)){AU=AT;}if(!AU&&Y){AU=AT.ancestor((I+AS));}}return AU;};var M=function(Y){return Y.ancestor(i);};var W=function(AS,Y){return AB(AS,l,Y);};var AF=function(AS,Y){var AT;if(AS){AT=AB(AS,K,Y);}return AT;};var p=function(AS,Y){var AT;if(AS){if(Y){AT=AB(AS,AJ,Y);}else{AT=AB(AS,AJ)||AS.one((I+AJ));}}return AT;};var B=function(AS,Y){var AT;if(AS){AT=AF(AS,Y)||p(AS,Y);}return AT;};var C=function(Y){return B(Y.one("li"));};var f=function(Y){return P(Y)?A:k;};var e=function(Y,AS){return Y&&!Y[s]&&(Y.compareTo(AS)||Y.contains(AS));};var H=function(AS,Y){return AS&&!AS[E]&&(!AS.compareTo(Y)&&!AS.contains(Y));};var AL=function(){AL.superclass.constructor.apply(this,arguments);};AL.NAME="nodeMenuNav";AL.NS="menuNav";AL.SHIM_TEMPLATE_TITLE="Menu Stacking Shim";AL.SHIM_TEMPLATE='<iframe frameborder="0" tabindex="-1" class="'+AM("shim")+'" title="'+AL.SHIM_TEMPLATE_TITLE+'" src="javascript:false;"></iframe>';AL.ATTRS={useARIA:{value:true,writeOnce:true,lazyAdd:false,setter:function(AV){var AS=this.get(c),AW,Y,AU,AT;if(AV){AS.set(AQ,R);AS.all("ul,li,"+n).set(AQ,N);AS.all((I+AM(G,z))).set(AQ,G);AS.all((I+AJ)).each(function(AX){AW=AX;Y=AX.one(AH);if(Y){Y.set(AQ,N);AW=Y.previous();}AW.set(AQ,G);AW.set("aria-haspopup",true);AU=AX.next();if(AU){AU.set(AQ,R);AW=AU.previous();Y=AW.one(AH);if(Y){AW=Y;}AT=D.stamp(AW);if(!AW.get(g)){AW.set(g,AT);}AU.set("aria-labelledby",AT);AU.set(y,true);}});}}},autoSubmenuDisplay:{value:true,writeOnce:true},submenuShowDelay:{value:250,writeOnce:true},submenuHideDelay:{value:250,writeOnce:true},mouseOutHideDelay:{value:750,writeOnce:true}};D.extend(AL,D.Plugin.Base,{_rootMenu:null,_activeItem:null,_activeMenu:null,_hasFocus:false,_blockMouseEvent:false,_currentMouseX:0,_movingToSubmenu:false,_showSubmenuTimer:null,_hideSubmenuTimer:null,_hideAllSubmenusTimer:null,_firstItem:null,initializer:function(AT){var AU=this,AV=this.get(c),AS=[],Y;if(AV){AU._rootMenu=AV;AV.all("ul:first-child").addClass(U);AV.all(i).addClass(AG);AS.push(AV.on("mouseover",AU._onMouseOver,AU));AS.push(AV.on("mouseout",AU._onMouseOut,AU));AS.push(AV.on("mousemove",AU._onMouseMove,AU));AS.push(AV.on(x,AU._toggleSubmenuDisplay,AU));AS.push(D.on("key",AU._toggleSubmenuDisplay,AV,"down:13",AU));AS.push(AV.on(AC,AU._toggleSubmenuDisplay,AU));AS.push(AV.on("keypress",AU._onKeyPress,AU));AS.push(AV.on(AP,AU._onKeyDown,AU));Y=AV.get("ownerDocument");AS.push(Y.on(x,AU._onDocMouseDown,AU));AS.push(Y.on("focus",AU._onDocFocus,AU));this._eventHandlers=AS;AU._initFocusManager();}},destructor:function(){var Y=this._eventHandlers;if(Y){D.Array.each(Y,function(AS){AS.detach();});this._eventHandlers=null;}this.get(c).unplug("focusManager");},_isRoot:function(Y){return this._rootMenu.compareTo(Y);},_getTopmostSubmenu:function(AU){var AT=this,Y=M(AU),AS;if(!Y){AS=AU;}else{if(AT._isRoot(Y)){AS=AU;}else{AS=AT._getTopmostSubmenu(Y);}}return AS;},_clearActiveItem:function(){var AS=this,Y=AS._activeItem;if(Y){Y.removeClass(f(Y));}AS._activeItem=null;},_setActiveItem:function(AS){var Y=this;if(AS){Y._clearActiveItem();AS.addClass(f(AS));Y._activeItem=AS;}},_focusItem:function(AT){var AS=this,Y,AU;if(AT&&AS._hasFocus){Y=M(AT);AU=q(AT);if(Y&&!Y.compareTo(AS._activeMenu)){AS._activeMenu=Y;AS._initFocusManager();}AS._focusManager.focus(AU);}},_showMenu:function(AU){var Y=M(AU),AT=AU.get(S),AS=AT.getXY();if(this.get(J)){AU.set(y,false);}if(r(Y)){AS[1]=AS[1]+AT.get(AA);}else{AS[0]=AS[0]+AT.get(AD);}AU.setXY(AS);if(m.ie<8){if(m.ie===6&&!AU.hasIFrameShim){AU.appendChild(D.Node.create(AL.SHIM_TEMPLATE));AU.hasIFrameShim=true;}AU.setStyles({height:Q,width:Q});AU.setStyles({height:(AU.get(AA)+AO),width:(AU.get(AD)+AO)});}AU.previous().addClass(X);AU.removeClass(AG);},_hideMenu:function(AU,AS){var AT=this,AV=AU.previous(),Y;AV.removeClass(X);if(AS){AT._focusItem(AV);AT._setActiveItem(AV);}Y=AU.one((I+A));if(Y){Y.removeClass(A);}AU.setStyles({left:Q,top:Q});AU.addClass(AG);if(AT.get(J)){AU.set(y,true);}},_hideAllSubmenus:function(AS){var Y=this;AS.all(i).each(D.bind(function(AT){Y._hideMenu(AT);},Y));},_cancelShowSubmenuTimer:function(){var AS=this,Y=AS._showSubmenuTimer;if(Y){Y.cancel();AS._showSubmenuTimer=null;}},_cancelHideSubmenuTimer:function(){var Y=this,AS=Y._hideSubmenuTimer;if(AS){AS.cancel();Y._hideSubmenuTimer=null;}},_initFocusManager:function(){var AU=this,AW=AU._rootMenu,AS=AU._activeMenu||AW,AV=AU._isRoot(AS)?Q:("#"+AS.get("id")),Y=AU._focusManager,AT,AX,AY;if(r(AS)){AX=AV+AN+","+AV+O;AT={next:"down:39",previous:"down:37"};}else{AX=AV+AN;AT={next:"down:40",previous:"down:38"};}if(!Y){AW.plug(D.Plugin.NodeFocusManager,{descendants:AX,keys:AT,circular:true});Y=AW.focusManager;AY="#"+AW.get("id")+i+" a,"+AH;AW.all(AY).set("tabIndex",-1);Y.on(h,this._onActiveDescendantChange,Y,this);Y.after(h,this._afterActiveDescendantChange,Y,this);
AU._focusManager=Y;}else{Y.set(v,-1);Y.set(AE,AX);Y.set("keys",AT);}},_onActiveDescendantChange:function(AS,Y){if(AS.src===j&&Y._activeMenu&&!Y._movingToSubmenu){Y._hideAllSubmenus(Y._activeMenu);}},_afterActiveDescendantChange:function(AS,Y){var AT;if(AS.src===j){AT=B(this.get(AE).item(AS.newVal),true);Y._setActiveItem(AT);}},_onDocFocus:function(AV){var AU=this,Y=AU._activeItem,AT=AV.target,AS;if(AU._rootMenu.contains(AT)){if(AU._hasFocus){AS=M(AT);if(!AU._activeMenu.compareTo(AS)){AU._activeMenu=AS;AU._initFocusManager();AU._focusManager.set(v,AT);AU._setActiveItem(B(AT,true));}}else{AU._hasFocus=true;Y=B(AT,true);if(Y){AU._setActiveItem(Y);}}}else{AU._clearActiveItem();AU._cancelShowSubmenuTimer();AU._hideAllSubmenus(AU._rootMenu);AU._activeMenu=AU._rootMenu;AU._initFocusManager();AU._focusManager.set(v,0);AU._hasFocus=false;}},_onMenuMouseOver:function(AU,AT){var AS=this,Y=AS._hideAllSubmenusTimer;if(Y){Y.cancel();AS._hideAllSubmenusTimer=null;}AS._cancelHideSubmenuTimer();if(AU&&!AU.compareTo(AS._activeMenu)){AS._activeMenu=AU;if(AS._hasFocus){AS._initFocusManager();}}if(AS._movingToSubmenu&&r(AU)){AS._movingToSubmenu=false;}},_hideAndFocusLabel:function(){var AT=this,AS=AT._activeMenu,Y;AT._hideAllSubmenus(AT._rootMenu);if(AS){Y=AT._getTopmostSubmenu(AS);AT._focusItem(Y.previous());}},_onMenuMouseOut:function(AY,AW){var AV=this,AT=AV._activeMenu,AX=AW.relatedTarget,Y=AV._activeItem,AU,AS;if(AT&&!AT.contains(AX)){AU=M(AT);if(AU&&!AU.contains(AX)){if(AV.get(T)>0){AV._cancelShowSubmenuTimer();AV._hideAllSubmenusTimer=u(AV.get(T),AV,AV._hideAndFocusLabel);}}else{if(Y){AS=M(Y);if(!AV._isRoot(AS)){AV._focusItem(AS.previous());}}}}},_onMenuLabelMouseOver:function(AU,Y){var AS=this,AV=AS._activeMenu,AY=AS._isRoot(AV),AT=(AS.get(w)&&AY||!AY),AW=AS.get("submenuShowDelay"),AX;var AZ=function(Aa){AS._cancelHideSubmenuTimer();AS._cancelShowSubmenuTimer();if(!o(AU)){AX=AU.next();if(AX){AS._hideAllSubmenus(AV);AS._showSubmenuTimer=u(Aa,AS,AS._showMenu,AX);}}};AS._focusItem(AU);AS._setActiveItem(AU);if(AT){if(AS._movingToSubmenu){D.message("Pause path");AS._hoverTimer=u(AW,AS,function(){AZ(0);});}else{AZ(AW);}}},_onMenuLabelMouseOut:function(AV,AX){var AW=this,AS=AW._isRoot(AW._activeMenu),AU=(AW.get(w)&&AS||!AS),AY=AX.relatedTarget,AT=AV.next(),Y=AW._hoverTimer;if(Y){Y.cancel();}AW._clearActiveItem();if(AU){if(AW._movingToSubmenu&&!AW._showSubmenuTimer&&AT){AW._hideSubmenuTimer=u(AW.get("submenuHideDelay"),AW,AW._hideMenu,AT);}else{if(!AW._movingToSubmenu&&AT&&(!AY||(AY&&!AT.contains(AY)&&!AY.compareTo(AT)))){AW._cancelShowSubmenuTimer();AW._hideMenu(AT);}}}},_onMenuItemMouseOver:function(AU,AW){var AV=this,AT=AV._activeMenu,Y=AV._isRoot(AT),AS=(AV.get(w)&&Y||!Y);AV._focusItem(AU);AV._setActiveItem(AU);if(AS&&!AV._movingToSubmenu){AV._hideAllSubmenus(AT);}},_onMenuItemMouseOut:function(Y,AS){this._clearActiveItem();},_onVerticalMenuKeyDown:function(Y){var AS=this,AW=AS._activeMenu,Ab=AS._rootMenu,AT=Y.target,AV=false,Aa=Y.keyCode,AY,AU,AX,AZ;switch(Aa){case 37:AU=M(AW);if(AU&&r(AU)){AS._hideMenu(AW);AX=L(AW.get(S));AZ=B(AX);if(AZ){if(t(AZ)){AY=AZ.next();if(AY){AS._showMenu(AY);AS._focusItem(C(AY));AS._setActiveItem(C(AY));}else{AS._focusItem(AZ);AS._setActiveItem(AZ);}}else{AS._focusItem(AZ);AS._setActiveItem(AZ);}}}else{if(!AS._isRoot(AW)){AS._hideMenu(AW,true);}}AV=true;break;case 39:if(t(AT)){AY=AT.next();if(AY){AS._showMenu(AY);AS._focusItem(C(AY));AS._setActiveItem(C(AY));}}else{if(r(Ab)){AY=AS._getTopmostSubmenu(AW);AX=b(AY.get(S));AZ=B(AX);AS._hideAllSubmenus(Ab);if(AZ){if(t(AZ)){AY=AZ.next();if(AY){AS._showMenu(AY);AS._focusItem(C(AY));AS._setActiveItem(C(AY));}else{AS._focusItem(AZ);AS._setActiveItem(AZ);}}else{AS._focusItem(AZ);AS._setActiveItem(AZ);}}}}AV=true;break;}if(AV){Y.preventDefault();}},_onHorizontalMenuKeyDown:function(AX){var AW=this,AU=AW._activeMenu,AS=AX.target,Y=B(AS,true),AV=false,AY=AX.keyCode,AT;if(AY===40){AW._hideAllSubmenus(AU);if(t(Y)){AT=Y.next();if(AT){AW._showMenu(AT);AW._focusItem(C(AT));AW._setActiveItem(C(AT));}AV=true;}}if(AV){AX.preventDefault();}},_onMouseMove:function(AS){var Y=this;u(10,Y,function(){Y._currentMouseX=AS.pageX;});},_onMouseOver:function(AV){var AU=this,AS,Y,AX,AT,AW;if(AU._blockMouseEvent){AU._blockMouseEvent=false;}else{AS=AV.target;Y=W(AS,true);AX=p(AS,true);AW=AF(AS,true);if(e(Y,AS)){AU._onMenuMouseOver(Y,AV);Y[s]=true;Y[E]=false;AT=M(Y);if(AT){AT[E]=true;AT[s]=false;}}if(e(AX,AS)){AU._onMenuLabelMouseOver(AX,AV);AX[s]=true;AX[E]=false;}if(e(AW,AS)){AU._onMenuItemMouseOver(AW,AV);AW[s]=true;AW[E]=false;}}},_onMouseOut:function(AS){var AT=this,AV=AT._activeMenu,Aa=false,AU,AW,AY,Y,AX,AZ;AT._movingToSubmenu=(AV&&!r(AV)&&((AS.pageX-5)>AT._currentMouseX));AU=AS.target;AW=AS.relatedTarget;AY=W(AU,true);Y=p(AU,true);AZ=AF(AU,true);if(H(Y,AW)){AT._onMenuLabelMouseOut(Y,AS);Y[E]=true;Y[s]=false;}if(H(AZ,AW)){AT._onMenuItemMouseOut(AZ,AS);AZ[E]=true;AZ[s]=false;}if(Y){AX=Y.next();if(AX&&AW&&(AW.compareTo(AX)||AX.contains(AW))){Aa=true;}}if(H(AY,AW)||Aa){AT._onMenuMouseOut(AY,AS);AY[E]=true;AY[s]=false;}},_toggleSubmenuDisplay:function(AT){var AU=this,AV=AT.target,AS=p(AV,true),Y=AT.type,AZ,AY,AX,Aa,Ab,AW;if(AS){AZ=F(AV)?AV:AV.ancestor(F);if(AZ){AX=AZ.getAttribute("href",2);Aa=AX.indexOf("#");Ab=AX.length;if(Aa===0&&Ab>1){AW=AX.substr(1,Ab);AY=AS.next();if(AY&&(AY.get(g)===AW)){if(Y===x||Y===AP){if((m.opera||m.gecko||m.ie)&&Y===AP&&!AU._preventClickHandle){AU._preventClickHandle=AU._rootMenu.on("click",function(Ac){Ac.preventDefault();AU._preventClickHandle.detach();AU._preventClickHandle=null;});}if(Y==x){AT.preventDefault();AT.stopImmediatePropagation();AU._hasFocus=true;}if(AU._isRoot(M(AV))){if(o(AS)){AU._hideMenu(AY);AU._focusItem(AS);AU._setActiveItem(AS);}else{AU._hideAllSubmenus(AU._rootMenu);AU._showMenu(AY);AU._focusItem(C(AY));AU._setActiveItem(C(AY));}}else{if(AU._activeItem==AS){AU._showMenu(AY);AU._focusItem(C(AY));AU._setActiveItem(C(AY));}else{if(!AS._clickHandle){AS._clickHandle=AS.on("click",function(){AU._hideAllSubmenus(AU._rootMenu);
AU._hasFocus=false;AU._clearActiveItem();AS._clickHandle.detach();AS._clickHandle=null;});}}}}if(Y===AC){AT.preventDefault();}}}}}},_onKeyPress:function(Y){switch(Y.keyCode){case 37:case 38:case 39:case 40:Y.preventDefault();break;}},_onKeyDown:function(AW){var AV=this,Y=AV._activeItem,AS=AW.target,AU=M(AS),AT;if(AU){AV._activeMenu=AU;if(r(AU)){AV._onHorizontalMenuKeyDown(AW);}else{AV._onVerticalMenuKeyDown(AW);}if(AW.keyCode===27){if(!AV._isRoot(AU)){if(m.opera){u(0,AV,function(){AV._hideMenu(AU,true);});}else{AV._hideMenu(AU,true);}AW.stopPropagation();AV._blockMouseEvent=m.gecko?true:false;}else{if(Y){if(t(Y)&&o(Y)){AT=Y.next();if(AT){AV._hideMenu(AT);}}else{AV._focusManager.blur();AV._clearActiveItem();AV._hasFocus=false;}}}}}},_onDocMouseDown:function(AU){var AT=this,AS=AT._rootMenu,Y=AU.target;if(!(AS.compareTo(Y)||AS.contains(Y))){AT._hideAllSubmenus(AS);if(m.webkit){AT._hasFocus=false;AT._clearActiveItem();}}}});D.namespace("Plugin");D.Plugin.NodeMenuNav=AL;},"3.2.0",{requires:["node","classnamemanager","node-focusmanager"]});