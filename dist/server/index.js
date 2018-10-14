parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"PTgE":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getMatches=exports.postMatch=void 0;var e=require("pg"),t=require("pg-format"),r=c(t),a=require("dotenv"),n=c(a),s=require("camelcase-keys"),o=c(s);function c(e){return e&&e.__esModule?e:{default:e}}"production"!==process.env.NODE_ENV&&n.default.load();const i=new e.Pool({connectionString:process.env.DATABASE_URL,ssl:!0}),u=exports.postMatch=(async(e,t)=>{const r=await i.connect(),a={name:"add-match",text:'\n      INSERT INTO "public"."matches"("winner", "loser")\n      VALUES($1, $2)\n      RETURNING "id", "created_at", "winner", "loser";\n    ',values:[e,t]},n=await r.query(a);return await r.release(),n&&n.rows&&n.rows[0]&&(0,o.default)(n.rows[0])}),l=exports.getMatches=(async()=>{const e=await i.connect(),t=await e.query("\n    SELECT *\n    FROM matches\n    ORDER BY created_at ASC\n  ");return await e.release(),t.rows});
},{}],"VO5s":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./postgres");Object.keys(e).forEach(function(r){"default"!==r&&"__esModule"!==r&&Object.defineProperty(exports,r,{enumerable:!0,get:function(){return e[r]}})});
},{"./postgres":"PTgE"}],"y1Ti":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.whoIsIt=void 0;var e=Object.assign||function(e){for(var o=1;o<arguments.length;o++){var t=arguments[o];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},o=require("fs"),t=a(o),r=require("opencv4nodejs"),s=a(r),n=require("face-recognition"),c=a(n);function a(e){return e&&e.__esModule?e:{default:e}}const l=c.default.withCv(s.default),i=l.FaceDetector(),u="production"===process.env.NODE_ENV?"model.json":"./server/utils/model.json";console.log(u);const d=JSON.parse(t.default.readFileSync(u));console.log(d);const p=l.FaceRecognizer();p.load(d);const g=150,f=exports.whoIsIt=(o=>{const t=l.CvImage(s.default.imdecode(o)),r=l.cvImageToImageRGB(t),n=i.locateFaces(r,150).map(e=>e.rect);if(!n.length)return[];const c=i.getFacesFromLocations(r,n,150);return c.length?c.map(e=>p.predictBest(e)).map((o,t)=>e({},o,n[t])).sort((e,o)=>o.right-e.right).map(o=>e({},o,{name:o.className})):[]});
},{}],"jWsf":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./face-recognitor");Object.keys(e).forEach(function(r){"default"!==r&&"__esModule"!==r&&Object.defineProperty(exports,r,{enumerable:!0,get:function(){return e[r]}})});const r=exports.resolveLadderFromMatches=(e=>{let r=[];return e.forEach(e=>{if(r.includes(e.loser)){const n=r.indexOf(e.loser);let s=r.indexOf(e.winner);-1===s&&(s=1/0),s>n&&r.splice(n,0,e.winner);const t=[];r=r.filter(e=>!t.includes(e)&&(t.push(e),!0))}else r.includes(e.winner)||r.push(e.winner),r.push(e.loser)}),r});
},{"./face-recognitor":"y1Ti"}],"lY9v":[function(require,module,exports) {
"use strict";var e=require("express"),t=y(e),s=require("path"),a=y(s),r=require("cors"),o=y(r),n=require("body-parser"),i=y(n),c=require("lodash.uniq"),l=y(c),u=require("lodash.flatten"),d=y(u),p=require("http"),f=require("./api"),h=require("./utils");function y(e){return e&&e.__esModule?e:{default:e}}const R=process.env.PORT||3e3,g=(0,t.default)(),m=(0,p.Server)(g);g.use((0,o.default)()),g.use(i.default.json()),g.use(i.default.urlencoded({extended:!0})),g.use(t.default.static("dist/client")),g.post("/api/match",async(e,t)=>{console.info("POST /api/match");const{text:s}=e.body;if(!s)return t.sendStatus(400);const a=s.split(" ").filter(e=>Boolean(e.trim())).map(e=>e.toLowerCase().trim().replace(/[^a-z_]/gi,""));if(2!==a.length)return t.sendStatus(400);const r=a[0],o=a[1];try{await(0,f.postMatch)(r,o),t.status(200).json({text:`Got it, ${r.replace(/_{1,}/gi," ")} won ${o.replace(/_{1,}/gi," ")} 🏆 \n _ps. notify luffis if you made a mistake_`})}catch(e){console.error("[ERROR]",e),t.sendStatus(500)}}),g.get("/api/matches",async(e,t)=>{console.info("GET /api/matches");try{const e=await(0,f.getMatches)();t.status(200).json(e)}catch(e){console.error("[ERROR]",e),t.sendStatus(500)}}),g.post("/api/ladder",async(e,t)=>{let s;console.info("POST /api/ladder");try{s=await(0,f.getMatches)()}catch(e){return console.error("[ERROR]",e),t.sendStatus(500)}const a=(0,h.resolveLadderFromMatches)(s);t.status(200).json({text:">>> \n"+a.map((e,t)=>`${t+1}. ${e}${0===t?" 👑":""}`).join("\n")})}),g.get("/api/ladder",async(e,t)=>{let s;console.info("GET /api/ladder");try{s=await(0,f.getMatches)()}catch(e){return console.error("[ERROR]",e),t.sendStatus(500)}const a=(0,h.resolveLadderFromMatches)(s);t.status(200).json(a)}),g.get("/api/players",async(e,t)=>{let s;console.info("GET /api/players");try{s=await(0,f.getMatches)()}catch(e){return console.error("[ERROR]",e),t.sendStatus(500)}const a=(0,l.default)((0,d.default)(s.map(e=>[e.winner,e.loser]))).sort();t.status(200).json(a)}),g.post("/api/whoisit",async(e,t)=>{console.log("POST /api/whoisit");const{image:s}=e.body;if(!s)return t.sendStatus(400);let a;try{const s=new Buffer(e.body.image.split(",")[1],"base64");a=(0,h.whoIsIt)(s)}catch(e){return console.error("[ERROR]",e),t.sendStatus(500)}t.json({players:a})}),g.get("*",(e,t)=>{t.sendFile(a.default.resolve(__dirname+"/../client/index.html"))}),m.listen(R,()=>{console.log(`Server listening port -> ${R}`)});
},{"./api":"VO5s","./utils":"jWsf"}],"Focm":[function(require,module,exports) {
require("babel-register")({}),require("./App");
},{"./App":"lY9v"}]},{},["Focm"], null)