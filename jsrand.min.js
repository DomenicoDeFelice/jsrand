/*
  jsrand v1.2
  https://github.com/DomenicoDeFelice/jsrand

  @license none/public domain, just leave this comment.
*/
!function(n){if(!n.dfd){n.dfd={}}dfd.Srand=Srand=function(n){var r=function(n){if(n!==undefined){this.seed(n)}else{this.randomize()}};r._oldSrand=n;return r}(n.Srand);Srand.prototype={};Srand.seed=Srand.prototype.seed=function(n){if(n===undefined){return this._seed}this._mz=123456789;return this._mw=this._seed=n};Srand.randomize=Srand.prototype.randomize=function(){var n=this.randomIntegerIn(1,4294967295,Math.random());this.seed(n);return n};Srand.random=Srand.prototype.random=function(){if(this._seed===undefined){this.randomize()}var n=this._mz;var r=this._mw;n=(n&65535)*36969+(n>>16)&4294967295;r=(r&65535)*18e3+(r>>16)&4294967295;this._mz=n;this._mw=r;var d=((n<<16)+r&4294967295)/4294967296;return.5+d};Srand.randomIn=Srand.prototype.randomIn=function(n,r,d){if(d===undefined){d=this.random()}return n+d*(r-n)};Srand.randomIntegerIn=Srand.prototype.randomIntegerIn=function(n,r,d){if(d===undefined){d=this.random()}return n+Math.floor(d*(r-n+1))};Srand.choice=Srand.prototype.choice=function(n,r){if(n.length===0){return undefined}var d=this.randomIntegerIn(0,n.length-1,r);return n[d]};Srand.noConflict=function(){Srand=dfd.Srand._oldSrand;return dfd.Srand}}(window);
//# sourceMappingURL=jsrand.js.map