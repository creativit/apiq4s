/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.2.0
build: 2676
*/
YUI.add("loader-rollup",function(a){a.Loader.prototype._rollup=function(){var k,h,g,p,o={},b=this.required,e,f=this.moduleInfo,d,l,n;if(this.dirty||!this.rollups){for(k in f){if(f.hasOwnProperty(k)){g=this.getModule(k);if(g&&g.rollup){o[k]=g;}}}this.rollups=o;this.forceMap=(this.force)?a.Array.hash(this.force):{};}for(;;){d=false;for(k in o){if(o.hasOwnProperty(k)){if(!b[k]&&((!this.loaded[k])||this.forceMap[k])){g=this.getModule(k);p=g.supersedes||[];e=false;if(!g.rollup){continue;}l=0;for(h=0;h<p.length;h=h+1){n=f[p[h]];if(this.loaded[p[h]]&&!this.forceMap[p[h]]){e=false;break;}else{if(b[p[h]]&&g.type==n.type){l++;e=(l>=g.rollup);if(e){break;}}}}if(e){b[k]=true;d=true;this.getRequires(g);}}}}if(!d){break;}}};},"3.2.0",{requires:["loader-base"]});