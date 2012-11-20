/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.2.0
build: 2676
*/
YUI.add("loader-base",function(d){if(!YUI.Env[d.version]){(function(){var I=d.version,E="/build/",F=I+E,D=d.Env.base,A="gallery-2010.09.01-19-12",C="2in3",B="3",z="2.8.1",G=D+"combo?",H={version:I,root:F,base:d.Env.base,comboBase:G,skin:{defaultSkin:"sam",base:"assets/skins/",path:"skin.css",after:["cssreset","cssfonts","cssgrids","cssbase","cssreset-context","cssfonts-context"]},groups:{},patterns:{}},y=H.groups,x=function(K,L){var J=C+"."+(K||B)+"/"+(L||z)+E;y.yui2.base=D+J;y.yui2.root=J;},w=function(J){var K=(J||A)+E;y.gallery.base=D+K;y.gallery.root=K;};y[I]={};y.gallery={ext:false,combine:true,comboBase:G,update:w,patterns:{"gallery-":{},"gallerycss-":{type:"css"}}};y.yui2={combine:true,ext:false,comboBase:G,update:x,patterns:{"yui2-":{configFn:function(J){if(/-skin|reset|fonts|grids|base/.test(J.name)){J.type="css";J.path=J.path.replace(/\.js/,".css");J.path=J.path.replace(/\/yui2-skin/,"/assets/skins/sam/yui2-skin");}}}}};w();x();YUI.Env[I]=H;}());}var f={},c=[],m=(d.UA.ie)?2048:8192,a=YUI.Env,p=a._loaded,q="css",k="js",v="intl",s=d.version,u="",e=d.Object,r=e.each,j=d.Array,h=a._loaderQueue,t=a[s],b="skin-",i=d.Lang,n=a.mods,l,o,g=function(x,y,z,w){var A=x+"/"+y;if(!w){A+="-min";}A+="."+(z||q);return A;};d.Env.meta=t;d.Loader=function(y){var x=t.modules,w=this;l=t.md5;w.context=d;w.base=d.Env.meta.base;w.comboBase=d.Env.meta.comboBase;w.combine=y.base&&(y.base.indexOf(w.comboBase.substr(0,20))>-1);w.maxURLLength=m;w.root=d.Env.meta.root;w.timeout=0;w.forceMap={};w.allowRollup=true;w.filters={};w.required={};w.patterns={};w.moduleInfo={};w.groups=d.merge(d.Env.meta.groups);w.skin=d.merge(d.Env.meta.skin);w.conditions={};w.config=y;w._internal=true;o=a._renderedMods;if(o){r(o,function(A,z){w.moduleInfo[z]=d.merge(A);});o=a._conditions;r(o,function(A,z){w.conditions[z]=d.merge(A);});}else{r(x,w.addModule,w);}if(!a._renderedMods){a._renderedMods=d.merge(w.moduleInfo);a._conditions=d.merge(w.conditions);}w._inspectPage();w._internal=false;w._config(y);w.sorted=[];w.loaded=p[s];w.dirty=true;w.inserted={};w.skipped={};};d.Loader.prototype={FILTER_DEFS:{RAW:{"searchExp":"-min\\.js","replaceStr":".js"},DEBUG:{"searchExp":"-min\\.js","replaceStr":"-debug.js"}},_inspectPage:function(){r(n,function(y,x){if(y.details){var w=this.moduleInfo[x],A=y.details.requires,z=w&&w.requires;if(w){if(!w._inspected&&A&&z.length!=A.length){delete w.expanded;}}else{w=this.addModule(y.details,x);}w._inspected=true;}},this);},_requires:function(D,C){var z,B,w,E,F,x=this.moduleInfo,y=x[D],A=x[C];if(!y||!A){return false;}B=y.expanded_map;w=y.after;E=y.after_map;if(B&&(C in B)){return true;}if(E&&(C in E)){return true;}else{if(w&&j.indexOf(w,C)>-1){return true;}}F=x[C]&&x[C].supersedes;if(F){for(z=0;z<F.length;z++){if(this._requires(D,F[z])){return true;}}}if(y.ext&&y.type==q&&!A.ext&&A.type==q){return true;}return false;},_config:function(C){var y,x,B,z,A,D,w=this;if(C){for(y in C){if(C.hasOwnProperty(y)){B=C[y];if(y=="require"){w.require(B);}else{if(y=="skin"){d.mix(w.skin,C[y],true);}else{if(y=="groups"){for(x in B){if(B.hasOwnProperty(x)){D=x;A=B[x];w.addGroup(A,D);}}}else{if(y=="modules"){r(B,w.addModule,w);}else{if(y=="gallery"){this.groups.gallery.update(B);}else{if(y=="yui2"||y=="2in3"){this.groups.yui2.update(C["2in3"],C.yui2);}else{if(y=="maxURLLength"){w[y]=Math.min(m,B);}else{w[y]=B;}}}}}}}}}}z=w.filter;if(i.isString(z)){z=z.toUpperCase();w.filterName=z;w.filter=w.FILTER_DEFS[z];if(z=="DEBUG"){w.require("yui-log","dump");}}},formatSkin:function(y,w){var x=b+y;if(w){x=x+"-"+w;}return x;},_addSkin:function(E,C,D){var B,A,w,z=this.moduleInfo,x=this.skin,y=z[C]&&z[C].ext;if(C){w=this.formatSkin(E,C);if(!z[w]){B=z[C];A=B.pkg||C;this.addModule({name:w,group:B.group,type:"css",after:x.after,after_map:j.hash(x.after),path:(D||A)+"/"+x.base+E+"/"+C+".css",ext:y});}}return w;},addGroup:function(z,x){var y=z.modules,w=this;x=x||z.name;z.name=x;w.groups[x]=z;if(z.patterns){r(z.patterns,function(B,A){B.group=x;w.patterns[A]=B;});}if(y){r(y,function(B,A){B.group=x;w.addModule(B,A);},w);}},addModule:function(K,R){R=R||K.name;K.name=R;if(!K||!K.name){return null;}if(!K.type){K.type=k;}if(!K.path&&!K.fullpath){K.path=g(R,R,K.type);}K.ext=("ext" in K)?K.ext:(this._internal)?false:true;K.requires=K.requires||[];var O=K.submodules,N,L,w,H,y,J,x,M,I,F,C,A,z,Q,P,G,B,D=this.conditions,E;this.moduleInfo[R]=K;if(!K.langPack&&K.lang){I=j(K.lang);for(M=0;M<I.length;M++){Q=I[M];F=this.getLangPackName(Q,R);y=this.moduleInfo[F];if(!y){y=this._addLangPack(Q,K,F);}}}if(O){w=K.supersedes||[];L=0;for(N in O){if(O.hasOwnProperty(N)){H=O[N];H.path=H.path||g(R,N,K.type);H.pkg=R;H.group=K.group;if(H.supersedes){w=w.concat(H.supersedes);}y=this.addModule(H,N);w.push(N);if(y.skinnable){K.skinnable=true;G=this.skin.overrides;if(G&&G[N]){for(M=0;M<G[N].length;M++){B=this._addSkin(G[N][M],N,R);w.push(B);}}B=this._addSkin(this.skin.defaultSkin,N,R);w.push(B);}if(H.lang&&H.lang.length){I=j(H.lang);for(M=0;M<I.length;M++){Q=I[M];F=this.getLangPackName(Q,R);C=this.getLangPackName(Q,N);y=this.moduleInfo[F];if(!y){y=this._addLangPack(Q,K,F);}A=A||j.hash(y.supersedes);if(!(C in A)){y.supersedes.push(C);}K.lang=K.lang||[];z=z||j.hash(K.lang);if(!(Q in z)){K.lang.push(Q);}}}L++;}}K.supersedes=e.keys(j.hash(w));K.rollup=(L<4)?L:Math.min(L-1,4);}J=K.plugins;if(J){for(N in J){if(J.hasOwnProperty(N)){x=J[N];x.pkg=R;x.path=x.path||g(R,N,K.type);x.requires=x.requires||[];x.group=K.group;this.addModule(x,N);if(K.skinnable){this._addSkin(this.skin.defaultSkin,N,R);}}}}if(K.condition){E=K.condition.trigger;D[E]=D[E]||{};D[E][R]=K.condition;}if(K.configFn){P=K.configFn(K);if(P===false){delete this.moduleInfo[R];K=null;}}return K;},require:function(x){var w=(typeof x==="string")?arguments:x;this.dirty=true;d.mix(this.required,j.hash(w));},getRequires:function(M){if(!M||M._parsed){return c;}var H,E,G,A,z,O,P=M.name,y,F,N=n[P]&&n[P].details,J=[],B,K,C,x,L,D=M.lang||M.intl,I=this.moduleInfo,w={};if(M.temp&&N){K=M;M=this.addModule(N,P);M.group=K.group;M.pkg=K.pkg;delete M.expanded;
}if(M.expanded&&(!M.langCache||M.langCache==this.lang)){return M.expanded;}B=M.requires;C=M.optional;M._parsed=true;if(M.skinnable){L=this.skin.overrides;if(L&&L[P]){for(H=0;H<L[P].length;H++){x=this._addSkin(L[P][H],P);J.push(x);}}else{x=this._addSkin(this.skin.defaultSkin,P);J.push(x);}}for(H=0;H<B.length;H++){if(!w[B[H]]){J.push(B[H]);w[B[H]]=true;E=this.getModule(B[H]);if(E){A=this.getRequires(E);D=D||(E.expanded_map&&(v in E.expanded_map));for(G=0;G<A.length;G++){J.push(A[G]);}}}}B=M.supersedes;if(B){for(H=0;H<B.length;H++){if(!w[B[H]]){if(M.submodules){J.push(B[H]);}w[B[H]]=true;E=this.getModule(B[H]);if(E){A=this.getRequires(E);D=D||(E.expanded_map&&(v in E.expanded_map));for(G=0;G<A.length;G++){J.push(A[G]);}}}}}if(C&&this.loadOptional){for(H=0;H<C.length;H++){if(!w[C[H]]){J.push(C[H]);w[C[H]]=true;E=I[C[H]];if(E){A=this.getRequires(E);D=D||(E.expanded_map&&(v in E.expanded_map));for(G=0;G<A.length;G++){J.push(A[G]);}}}}}y=this.conditions[P];if(y){r(y,function(R,Q){if(!w[Q]){F=R&&((R.ua&&d.UA[R.ua])||(R.test&&R.test(d,B)));if(F){w[Q]=true;J.push(Q);E=this.getModule(Q);if(E){A=this.getRequires(E);for(G=0;G<A.length;G++){J.push(A[G]);}}}}},this);}M._parsed=false;if(D){if(M.lang&&!M.langPack&&d.Intl){O=d.Intl.lookupBestLang(this.lang||u,M.lang);M.langCache=this.lang;z=this.getLangPackName(O,P);if(z){J.unshift(z);}}J.unshift(v);}M.expanded_map=j.hash(J);M.expanded=e.keys(M.expanded_map);return M.expanded;},getProvides:function(x){var w=this.getModule(x),z,y;if(!w){return f;}if(w&&!w.provides){z={};y=w.supersedes;if(y){j.each(y,function(A){d.mix(z,this.getProvides(A));},this);}z[x]=true;w.provides=z;}return w.provides;},calculate:function(x,w){if(x||w||this.dirty){if(x){this._config(x);}if(!this._init){this._setup();}this._explode();if(this.allowRollup){this._rollup();}this._reduce();this._sort();}},_addLangPack:function(B,w,A){var y=w.name,x,z=this.moduleInfo[A];if(!z){x=g((w.pkg||y),A,k,true);this.addModule({path:x,intl:true,langPack:true,ext:w.ext,group:w.group,supersedes:[]},A,true);if(B){d.Env.lang=d.Env.lang||{};d.Env.lang[B]=d.Env.lang[B]||{};d.Env.lang[B][y]=true;}}return this.moduleInfo[A];},_setup:function(){var C=this.moduleInfo,z,A,y,w,x,B;for(z in C){if(C.hasOwnProperty(z)){w=C[z];if(w){w.requires=e.keys(j.hash(w.requires));if(w.lang&&w.lang.length){B=this.getLangPackName(u,z);this._addLangPack(null,w,B);}}}}x={};if(!this.ignoreRegistered){d.mix(x,a.mods);}if(this.ignore){d.mix(x,j.hash(this.ignore));}for(y in x){if(x.hasOwnProperty(y)){d.mix(x,this.getProvides(y));}}if(this.force){for(A=0;A<this.force.length;A++){if(this.force[A] in x){delete x[this.force[A]];}}}d.mix(this.loaded,x);this._init=true;},getLangPackName:function(x,w){return("lang/"+w+((x)?"_"+x:""));},_explode:function(){var A=this.required,w,z,x={},y=this;y.dirty=false;r(A,function(B,C){if(!x[C]){x[C]=true;w=y.getModule(C);if(w){var D=w.expound;if(D){A[D]=y.getModule(D);z=y.getRequires(A[D]);d.mix(A,j.hash(z));}z=y.getRequires(w);d.mix(A,j.hash(z));}}});},getModule:function(B){if(!B){return null;}var A,z,x,w=this.moduleInfo[B],y=this.patterns;if(!w){for(x in y){if(y.hasOwnProperty(x)){A=y[x];if(B.indexOf(x)>-1){z=A;break;}}}if(z){if(A.action){A.action.call(this,B,x);}else{w=this.addModule(d.merge(z),B);w.temp=true;}}}return w;},_rollup:function(){},_reduce:function(B){B=B||this.required;var y,x,A,w,z=this.loadType;for(y in B){if(B.hasOwnProperty(y)){w=this.getModule(y);if(((this.loaded[y]||n[y])&&!this.forceMap[y]&&!this.ignoreRegistered)||(z&&w&&w.type!=z)){delete B[y];}A=w&&w.supersedes;if(A){for(x=0;x<A.length;x++){if(A[x] in B){delete B[A[x]];}}}}}return B;},_finish:function(y,x){h.running=false;var w=this.onEnd;if(w){w.call(this.context,{msg:y,data:this.data,success:x});}this._continue();},_onSuccess:function(){var w=d.merge(this.skipped),x;r(w,function(y){delete this.inserted[y];},this);this.skipped={};r(this.inserted,function(z,y){d.mix(this.loaded,this.getProvides(y));},this);x=this.onSuccess;if(x){x.call(this.context,{msg:"success",data:this.data,success:true,skipped:w});}this._finish("success",true);},_onFailure:function(y){var w=this.onFailure,x="failure: "+y.msg;if(w){w.call(this.context,{msg:x,data:this.data,success:false});}this._finish(x,false);},_onTimeout:function(){var w=this.onTimeout;if(w){w.call(this.context,{msg:"timeout",data:this.data,success:false});}this._finish("timeout",false);},_sort:function(){var F=e.keys(this.required),B={},w=0,y,E,D,A,z,C,x;for(;;){y=F.length;C=false;for(A=w;A<y;A++){E=F[A];for(z=A+1;z<y;z++){x=E+F[z];if(!B[x]&&this._requires(E,F[z])){D=F.splice(z,1);F.splice(A,0,D[0]);B[x]=true;C=true;break;}}if(C){break;}else{w++;}}if(!C){break;}}this.sorted=F;},_insert:function(y,z,x){if(y){this._config(y);}this.calculate(z);this.loadType=x;if(!x){var w=this;this._internalCallback=function(){var B=w.onCSS,D,C,A;if(this.insertBefore&&d.UA.ie){D=d.config.doc.getElementById(this.insertBefore);C=D.parentNode;A=D.nextSibling;C.removeChild(D);if(A){C.insertBefore(D,A);}else{C.appendChild(D);}}if(B){B.call(w.context,d);}w._internalCallback=null;w._insert(null,null,k);};this._insert(null,null,q);return;}this._loading=true;this._combineComplete={};this.loadNext();},_continue:function(){if(!(h.running)&&h.size()>0){h.running=true;h.next()();}},insert:function(y,x){var w=this,z=d.merge(this,true);delete z.require;delete z.dirty;h.add(function(){w._insert(z,y,x);});this._continue();},loadNext:function(A){if(!this._loading){return;}var H,P,O,M,z,E,B,L,D,G,N,w,C,K,y,F,Q,R,x=this.loadType,J=this,S=function(T){J.loadNext(T.data);},I=function(V){J._combineComplete[x]=true;var U,T=F.length;for(U=0;U<T;U++){J.inserted[F[U]]=true;}S(V);};if(this.combine&&(!this._combineComplete[x])){F=[];this._combining=F;H=this.sorted;P=H.length;R=this.comboBase;z=R;Q=[];K={};for(O=0;O<P;O++){C=R;M=this.getModule(H[O]);G=M&&M.group;if(G){D=this.groups[G];if(!D.combine){M.combine=false;continue;}M.combine=true;if(D.comboBase){C=D.comboBase;}if(D.root){M.root=D.root;}}K[C]=K[C]||[];K[C].push(M);}for(N in K){if(K.hasOwnProperty(N)){z=N;
y=K[N];P=y.length;for(O=0;O<P;O++){M=y[O];if(M&&(M.type===x)&&(M.combine||!M.ext)){w=(M.root||this.root)+M.path;if((z!==N)&&(O<(P-1))&&((w.length+z.length)>this.maxURLLength)){Q.push(this._filter(z));z=N;}z+=w;if(O<(P-1)){z+="&";}F.push(M.name);}}if(F.length&&(z!=N)){Q.push(this._filter(z));}}}if(F.length){if(x===q){E=d.Get.css;L=this.cssAttributes;}else{E=d.Get.script;L=this.jsAttributes;}E(Q,{data:this._loading,onSuccess:I,onFailure:this._onFailure,onTimeout:this._onTimeout,insertBefore:this.insertBefore,charset:this.charset,attributes:L,timeout:this.timeout,autopurge:false,context:this});return;}else{this._combineComplete[x]=true;}}if(A){if(A!==this._loading){return;}this.inserted[A]=true;if(this.onProgress){this.onProgress.call(this.context,{name:A,data:this.data});}}H=this.sorted;P=H.length;for(O=0;O<P;O=O+1){if(H[O] in this.inserted){continue;}if(H[O]===this._loading){return;}M=this.getModule(H[O]);if(!M){B="Undefined module "+H[O]+" skipped";this.skipped[H[O]]=true;continue;}D=(M.group&&this.groups[M.group])||f;if(!x||x===M.type){this._loading=H[O];if(M.type===q){E=d.Get.css;L=this.cssAttributes;}else{E=d.Get.script;L=this.jsAttributes;}z=(M.fullpath)?this._filter(M.fullpath,H[O]):this._url(M.path,H[O],D.base||M.base);E(z,{data:H[O],onSuccess:S,insertBefore:this.insertBefore,charset:this.charset,attributes:L,onFailure:this._onFailure,onTimeout:this._onTimeout,timeout:this.timeout,autopurge:false,context:J});return;}}this._loading=null;E=this._internalCallback;if(E){this._internalCallback=null;E.call(this);}else{this._onSuccess();}},_filter:function(y,x){var A=this.filter,w=x&&(x in this.filters),z=w&&this.filters[x];if(y){if(w){A=(i.isString(z))?this.FILTER_DEFS[z.toUpperCase()]||null:z;}if(A){y=y.replace(new RegExp(A.searchExp,"g"),A.replaceStr);}}return y;},_url:function(y,w,x){return this._filter((x||this.base||"")+y,w);}};},"3.2.0",{requires:["get"]});