var e=Object.defineProperty,t=(t,n)=>{let r={};for(var i in t)e(r,i,{get:t[i],enumerable:!0});return n||e(r,Symbol.toStringTag,{value:`Module`}),r};(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var n=null,r=[],i=null,a=[],o=null,s=0,c=new Set,l=100,u=0,d=class{_value;_subs=new Set;constructor(e){this._value=e}get value(){return n&&(this._subs.add(n),i?.add(this)),this._value}set value(e){Object.is(this._value,e)||(this._value=e,this._notify())}update(e){this.value=e(this._value)}peek(){return this._value}_removeSub(e){this._subs.delete(e)}_notify(){let e=[...this._subs];s>0?e.forEach(e=>c.add(e)):e.forEach(e=>e())}dispose(){this._subs.clear()}};function f(e){return new d(e)}function p(e){let t,s=new Set,c=o,d=()=>{if(typeof t==`function`&&t(),s.forEach(e=>e._removeSub(d)),s=new Set,r.push(n),a.push(i),n=d,i=s,++u>l)throw u=0,n=r.pop()||null,i=a.pop()||null,Error(`[Nix] Maximum effect re-execution depth exceeded (possible infinite loop).`);try{t=e()}catch(e){if(!c)throw e;c(e)}finally{u--,n=r.pop()||null,i=a.pop()||null}};return d(),()=>{typeof t==`function`&&t(),s.forEach(e=>e._removeSub(d)),s.clear()}}function m(e){let t=new d(void 0);return p(()=>{t.value=e()}),t}var h=class{__isNixComponent=!0;children;_slots=new Map;setChildren(e){return this.children=e,this}setSlot(e,t){return this._slots.set(e,t),this}slot(e){return this._slots.get(e)}};function g(e){return typeof e==`object`&&!!e&&!0===e.__isNixComponent}function _(e){return Symbol(e)}var v=[];function y(){return[...v]}function b(){v.push(new Map)}function x(){v.pop()}function ee(e,t){let n=v.splice(0);e.forEach(e=>v.push(e)),v.push(new Map);try{return t()}finally{v.splice(0),n.forEach(e=>v.push(e))}}_(`nix:portal-outlet`);function te(e){let t=e.lastIndexOf(`>`),n=e.lastIndexOf(`<`);if(n<=t)return{type:`node`};let r=e.slice(n+1),i=r.match(/@([\w:.-]+)=["']?$/);if(i){let e=i[1].split(`.`);return{type:`event`,eventName:e[0],modifiers:e.slice(1),hadOpenQuote:i[0].endsWith(`"`)||i[0].endsWith(`'`)}}let a=r.match(/([\w:.-]+)=["']?$/);return a?{type:`attr`,attrName:a[1],hadOpenQuote:a[0].endsWith(`"`)||a[0].endsWith(`'`)}:{type:`node`}}function ne(e,t){let n=Array(e.length).fill(0),r=``;for(let i=0;i<e.length;i++){let a=e[i];if(n[i]===1&&(a[0]===`"`||a[0]===`'`)&&(a=a.slice(1)),i<t.length){let e=t[i];if(e.type===`node`)r+=a+`\x3c!--nix-${i}--\x3e`;else if(e.type===`event`){let t=`@${e.modifiers.length?`${e.eventName}.${e.modifiers.join(`.`)}`:e.eventName}=`.length+(e.hadOpenQuote?1:0);r+=a.slice(0,-t)+` data-nix-e-${i}="${e.eventName}"`,e.hadOpenQuote&&(n[i+1]=1)}else{let t=`${e.attrName}=`.length+(e.hadOpenQuote?1:0);r+=a.slice(0,-t)+` data-nix-a-${i}="${e.attrName}"`,e.hadOpenQuote&&(n[i+1]=1)}}else r+=a}return r}function S(e){return typeof e==`object`&&!!e&&!0===e.__isNixTemplate}function re(e){return typeof e==`object`&&!!e&&!0===e.__isKeyedList}function ie(e){let t,n=new Map,r=document.createTreeWalker(e,NodeFilter.SHOW_COMMENT);for(;t=r.nextNode();){let e=t,r=e.nodeValue?.match(/^nix-(\d+)$/);r&&n.set(parseInt(r[1]),e)}return n}function ae(e){let t=new Map;return e.querySelectorAll(`*`).forEach(e=>{let n=Array.from(e.attributes);for(let r of n){let n=r.name.match(/^data-nix-e-(\d+)$/);n?(t.set(parseInt(n[1]),{el:e,type:`event`,name:r.value}),e.removeAttribute(r.name)):(n=r.name.match(/^data-nix-a-(\d+)$/),n&&(t.set(parseInt(n[1]),{el:e,type:`attr`,name:r.value}),e.removeAttribute(r.name)))}}),t}function oe(e,t,n){let r=[],i=[],a=ie(e),o=ae(e);for(let e=0;e<t.length;e++){let s=t[e],c=n[e];if(s.type===`event`){let t=o.get(e);if(!t)continue;let{el:n,name:i}=t,a=c,l=s.modifiers,u={};l.includes(`once`)&&(u.once=!0),l.includes(`capture`)&&(u.capture=!0),l.includes(`passive`)&&(u.passive=!0);let d={enter:`Enter`,escape:`Escape`,space:` `,tab:`Tab`,delete:`Delete`,backspace:`Backspace`,up:`ArrowUp`,down:`ArrowDown`,left:`ArrowLeft`,right:`ArrowRight`},f=e=>{if(l.includes(`prevent`)&&e.preventDefault(),l.includes(`stop`)&&e.stopPropagation(),!l.includes(`self`)||e.target===e.currentTarget){if(`key`in e){let t=e;for(let e of l){let n=d[e];if(n!==void 0&&t.key!==n||!d[e]&&e.length===1&&t.key.toLowerCase()!==e)return}}a(e)}};n.addEventListener(i,f,u),r.push(()=>n.removeEventListener(i,f,u));continue}if(s.type===`attr`){let t=o.get(e);if(!t)continue;let{el:n,name:i}=t;if(i===`ref`){c.el=n,r.push(()=>{c.el=null});continue}if(i===`show`||i===`hide`){let e=n,t=null;if(typeof c==`function`){let n=p(()=>{let n=!!c(),r=i===`show`?n:!n;t===null&&(t=e.style.display||``),e.style.display=r?t:`none`});r.push(n)}else (i===`show`?c:!c)||(n.style.display=`none`);continue}let a=(i===`value`||i===`checked`||i===`selected`)&&i in n;if(typeof c==`function`){let e=p(()=>{let e=c();a?n[i]=e??``:e==null||!1===e?n.removeAttribute(i):n.setAttribute(i,String(e))});r.push(e)}else a?n[i]=c??``:c!=null&&!1!==c&&n.setAttribute(i,String(c));continue}let l=a.get(e);if(!l)continue;if(typeof c!=`function`){if(g(c)){let e,t,n=c;b();try{try{n.onInit?.()}catch(e){if(!n.onError)throw e;n.onError(e)}e=n.render()._render(l.parentNode,l)}finally{x()}i.push(()=>{try{let e=n.onMount?.();typeof e==`function`&&(t=e)}catch(e){if(!n.onError)throw e;n.onError(e)}}),r.push(()=>{try{n.onUnmount?.()}catch{}try{t?.()}catch{}e()})}else if(S(c)){let e=c._render(l.parentNode,l);r.push(e)}else if(Array.isArray(c))for(let e of c)if(g(e)){let t,n;b();try{try{e.onInit?.()}catch(t){if(!e.onError)throw t;e.onError(t)}t=e.render()._render(l.parentNode,l)}finally{x()}i.push(()=>{try{let t=e.onMount?.();typeof t==`function`&&(n=t)}catch(t){if(!e.onError)throw t;e.onError(t)}}),r.push(()=>{try{e.onUnmount?.()}catch{}try{n?.()}catch{}t()})}else S(e)?e._render(l.parentNode,l):e!=null&&!1!==e&&l.parentNode.insertBefore(document.createTextNode(String(e)),l);else c!=null&&!1!==c&&l.parentNode.insertBefore(document.createTextNode(String(c)),l);continue}let u=null,d=null,f=null,m=y(),h=p(()=>{let e=c();if(typeof e==`string`||typeof e==`number`)return d&&=(d(),null),void(u?u.nodeValue=String(e):(u=document.createTextNode(String(e)),l.parentNode.insertBefore(u,l)));if(u&&=(u.parentNode?.removeChild(u),null),d&&=(d(),null),e!=null&&!1!==e)if(S(e))d=e._render(l.parentNode,l);else if(g(e)){let t,n,r=e;ee(m,()=>{try{r.onInit?.()}catch(e){if(!r.onError)throw e;r.onError(e)}t=r.render()._render(l.parentNode,l)});try{let e=r.onMount?.();typeof e==`function`&&(n=e)}catch(e){if(!r.onError)throw e;r.onError(e)}d=()=>{try{r.onUnmount?.()}catch{}try{n?.()}catch{}t()}}else if(re(e)){f||=new Map;let t=l.parentNode,n=e.items.map((t,n)=>e.keyFn(t,n)),r=new Set(n);for(let[e,n]of f)if(!r.has(e)){n.cleanup();let r=n.start;for(;r!==n.end;){let e=r.nextSibling;t.removeChild(r),r=e}t.removeChild(n.end),f.delete(e)}let i=l;for(let r=n.length-1;r>=0;r--){let a=n[r],o=e.items[r];if(f.has(a)){let e=f.get(a);if(e.end.nextSibling!==i){let n=[],r=e.start;for(;n.push(r),r!==e.end;)r=r.nextSibling;for(let e of n)t.insertBefore(e,i)}i=e.start}else{let n=document.createComment(`nix-ke`),s=document.createComment(`nix-ks`);t.insertBefore(n,i),t.insertBefore(s,n);let c,l=e.renderFn(o,r);if(g(l)){let e,r;ee(m,()=>{try{l.onInit?.()}catch(e){if(!l.onError)throw e;l.onError(e)}e=l.render()._render(t,n)});try{let e=l.onMount?.();typeof e==`function`&&(r=e)}catch(e){if(!l.onError)throw e;l.onError(e)}c=()=>{try{l.onUnmount?.()}catch{}try{r?.()}catch{}e()}}else c=l._render(t,n);f.set(a,{start:s,end:n,cleanup:c}),i=s}}}else if(Array.isArray(e)){let t=[];for(let n of e)if(g(n)){try{n.onInit?.()}catch(e){if(!n.onError)throw e;n.onError(e)}let e,r=n.render()._render(l.parentNode,l);try{let t=n.onMount?.();typeof t==`function`&&(e=t)}catch(e){if(!n.onError)throw e;n.onError(e)}t.push(()=>{try{n.onUnmount?.()}catch{}try{e?.()}catch{}r()})}else if(S(n))t.push(n._render(l.parentNode,l));else if(n!=null&&!1!==n){let e=document.createTextNode(String(n));l.parentNode.insertBefore(e,l),t.push(()=>e.parentNode?.removeChild(e))}d=()=>t.forEach(e=>e())}else u=document.createTextNode(String(e)),l.parentNode.insertBefore(u,l)});r.push(()=>{if(h(),d&&=(d(),null),u&&=(u.parentNode?.removeChild(u),null),f){for(let e of f.values())e.cleanup();f=null}})}return{disposes:r,postMountHooks:i}}function C(e,...t){let n=[],r=``;for(let t=0;t<e.length-1;t++){r+=e[t];let i=te(r);n.push(i),r+=`__nix__`}let i=ne(e,n);function a(e,r){let a=document.createElement(`template`);a.innerHTML=i;let o=a.content,{disposes:s,postMountHooks:c}=oe(o,n,t),l=document.createComment(`nix-scope`);e.insertBefore(l,r);let u=o.firstChild;for(;u;){let t=u.nextSibling;e.insertBefore(u,r),u=t}return c.forEach(e=>e()),()=>{s.forEach(e=>e());let e=l.nextSibling;for(;e&&e!==r;){let t=e.nextSibling;e.parentNode?.removeChild(e),e=t}l.parentNode?.removeChild(l)}}return{__isNixTemplate:!0,_render:a,mount(e){let t=typeof e==`string`?document.querySelector(e):e;if(!t)throw Error(`[Nix] mount: contenedor no encontrado: ${e}`);let n=a(t,null);return{unmount(){n()}}}}}function se(e,t){if(g(e)){let n,r,i=typeof t==`string`?document.querySelector(t):t;if(!i)throw Error(`[Nix] mount: container not found: ${t}`);b();try{try{e.onInit?.()}catch(t){if(!e.onError)throw t;e.onError(t)}n=e.render()._render(i,null)}finally{x()}try{let t=e.onMount?.();typeof t==`function`&&(r=t)}catch(t){if(!e.onError)throw t;e.onError(t)}return{unmount(){try{e.onUnmount?.()}catch{}try{r?.()}catch{}n()}}}return e.mount(t)}function ce(e,t){let n={};for(let t of Object.keys(e))n[t]=f(e[t]);let r=n,i=Object.assign(Object.create(null),r,{$reset:function(){for(let t of Object.keys(e))n[t].value=e[t]}});if(t){let e=t(r);for(let t of Object.keys(e))t===`$reset`?console.warn(`[Nix] Store action name "$reset" is reserved and will be ignored.`):i[t]=e[t]}return i}var w=null,T=null;function le(){if(!w)throw Error(`[Nix] No active router. Call createRouter() first.`);return w}function E(e){let t={};return new URLSearchParams(e).forEach((e,n)=>{t[n]=e}),t}function ue(e){let t=new URLSearchParams;for(let[n,r]of Object.entries(e))r!=null&&!1!==r&&t.set(n,String(r));let n=t.toString();return n?`?`+n:``}function de(e){return e===`*`?[{kind:`wildcard`}]:e.split(`/`).filter(Boolean).map(e=>e===`*`?{kind:`wildcard`}:e.startsWith(`:`)?{kind:`param`,name:e.slice(1)}:{kind:`literal`,value:e})}function fe(e,t){return t===`*`?e===``?`*`:e+`/*`:(e+(t.startsWith(`/`)?t:`/`+t)).replace(/\/+/g,`/`)||`/`}function pe(e,t=``,n=[]){let r=[];for(let i of e){let e=fe(t,i.path),a=[...n,i.component],o=de(e);r.push({fullPath:e,segments:o,chain:a,beforeEnter:i.beforeEnter}),i.children?.length&&r.push(...pe(i.children,e,a))}return r}function me(e,t){let n=e.split(`/`).filter(Boolean),r=t.segments;if(r.length===1&&r[0].kind===`wildcard`)return{};let i=r.length>0&&r[r.length-1].kind===`wildcard`,a=i?r.slice(0,-1):r;if(i){if(n.length<a.length)return null}else if(n.length!==a.length)return null;let o={};for(let e=0;e<a.length;e++){let t=a[e];if(t.kind===`literal`){if(n[e]!==t.value)return null}else if(t.kind===`param`)try{o[t.name]=decodeURIComponent(n[e]??``)}catch{o[t.name]=n[e]??``}}return o}function he(e){return e.segments.reduce((e,t)=>t.kind===`literal`?e+2:t.kind===`param`?e+1:e,0)}function D(e,t){let n,r={},i=-1;for(let a of t){let t=me(e,a);if(t===null)continue;let o=he(a);o>i&&(n=a,r=t,i=o)}return n?{route:n,params:r}:void 0}function O(e){let t=e.trim();return t&&t!==`/`?(t.startsWith(`/`)||(t=`/`+t),t.endsWith(`/`)&&(t=t.slice(0,-1)),t):``}function ge(){if(typeof document>`u`)return``;let e=document.querySelector(`base`);if(!e)return``;let t=e.getAttribute(`href`)||``;try{return O(new URL(t,window.location.origin).pathname)}catch{return O(t)}}function _e(e,t){let n=t?.base==null?ge():O(t.base);function r(){let e=window.location.pathname||`/`;if(n&&e.startsWith(n)){let t=e.slice(n.length);return t===``?`/`:t}return e}function i(e){return n?n+(e.startsWith(`/`)?e:`/`+e):e}let a=r(),o=pe(e),s=D(a,o),c=f(a),l=f(s?.params??{}),u=f(E(window.location.search)),d=[],p=[],m=0;function h(e,t,n,r,i){let a=[...d];n&&a.push(n);let o=++m;if(a.length===0)return void r();let s=0;(function n(c){if(o!==m)return;if(!1===c)return void i?.();if(typeof c==`string`)return void(c===e?r():b(c));if(s>=a.length)return void r();let l=a[s++](e,t);l instanceof Promise?l.then(n):n(l)})(void 0)}let g=!1;function _(e,t){let n=e.indexOf(`?`),r=n===-1?e:e.slice(0,n),i=n===-1?{}:E(e.slice(n)),a=t?{...i,...t}:i,o={};for(let[e,t]of Object.entries(a))t!=null&&!1!==t&&(o[e]=String(t));return{pathname:r,stringQuery:o}}T&&=(T(),null);let v=()=>{let e=r(),t=c.value,n=u.value,a=D(e,o),s=E(window.location.search);h(e,t,a?.route.beforeEnter,()=>{l.value=a?.params??{},u.value=s,c.value=e;for(let n of p)try{n(e,t)}catch{}},()=>{history.pushState(null,``,i(t)+ue(n))})};function y(e,t,n,r,a){l.value=r?.params??{},u.value=t,c.value=e;let o=i(e)+ue(t);a?history.replaceState(null,``,o):history.pushState(null,``,o);for(let t of p)try{t(e,n)}catch{}}function b(e,t){g=!0;let{pathname:n,stringQuery:r}=_(e,t),i=c.value,a=D(n,o);h(n,i,a?.route.beforeEnter,()=>y(n,r,i,a,!1))}window.addEventListener(`popstate`,v),T=()=>window.removeEventListener(`popstate`,v);let x={current:c,params:l,query:u,base:n||`/`,navigate:b,replace:function(e,t){g=!0;let{pathname:n,stringQuery:r}=_(e,t),i=c.value,a=D(n,o);h(n,i,a?.route.beforeEnter,()=>y(n,r,i,a,!0))},back:function(){history.back()},forward:function(){history.forward()},go:function(e){history.go(e)},isActive:function(e,t=!0){let n=c.value;return t?n===e:n===e||n.startsWith(e.endsWith(`/`)?e:e+`/`)},resolve:function(t){let n=D(t,o);if(!n)return{matched:!1,params:{},route:void 0};let r=n.route.chain[n.route.chain.length-1];return{matched:!0,params:n.params,route:function e(t){for(let n of t){if(n.component===r)return n;if(n.children){let t=e(n.children);if(t)return t}}}(e)}},beforeEach:function(e){return d.push(e),()=>{let t=d.indexOf(e);t!==-1&&d.splice(t,1)}},afterEach:function(e){return p.push(e),()=>{let t=p.indexOf(e);t!==-1&&p.splice(t,1)}},routes:e,_flat:o,_guards:d,_base:n};return w&&console.warn(`[Nix] A router already exists. The previous router is being replaced. Only one router instance should be active at a time.`),w=x,queueMicrotask(()=>{g||h(a,``,D(a,o)?.route.beforeEnter,()=>{},()=>{history.replaceState(null,``,i(`/`));let e=D(`/`,o);c.value=`/`,l.value=e?.params??{},u.value={}})}),x}function k(){return le()}var ve=class extends h{_depth;constructor(e=0){super(),this._depth=e}render(){let e=this._depth;return C`<div class="router-view">${()=>{let t=le(),n=D(t.current.value,t._flat);return n?e>=n.route.chain.length?C`<span></span>`:n.route.chain[e]():C`<div style="color:#f87171;padding:16px 0">
          404 — Route not found: <strong>${t.current.value}</strong>
        </div>`}}</div>`}};function ye(){return C`
        <span style="color:#52525b;font-size:13px;display:inline-flex;align-items:center;gap:6px">
            <span class="nix-spinner" style="
                display:inline-block;width:14px;height:14px;border-radius:50%;
                border:2px solid #38bdf840;border-top-color:#38bdf8;
                animation:nix-spin .7s linear infinite
            "></span>
            Loading…
        </span>
        <style>@keyframes nix-spin{to{transform:rotate(360deg)}}</style>
    `}function be(e){return C`
        <span style="color:#f87171;font-size:13px">
            ⚠ ${e instanceof Error?e.message:String(e)}
        </span>
    `}var A=new Map,xe=3e5,j=null,Se=xe;function Ce(){j===null&&(j=setInterval(()=>{let e=Date.now();for(let[t,n]of A)n.subscribers<=0&&e-n.fetchedAt>Se&&A.delete(t);A.size===0&&j!==null&&(clearInterval(j),j=null)},6e4))}function we(e){return A.get(e)}function Te(e,t){let n=A.get(e);A.set(e,{data:t,fetchedAt:Date.now(),subscribers:n?.subscribers??0}),Ce()}function Ee(e){let t=A.get(e);t&&t.subscribers++}function De(e){let t=A.get(e);t&&(t.subscribers=Math.max(0,t.subscribers-1))}function Oe(e,t){let n=A.get(e);return!!n&&Date.now()-n.fetchedAt<t}var M=new Map;function N(e){A.delete(e);let t=M.get(e);if(t)for(let e of t)e()}function P(e,t,n,r={}){let{fallback:i,errorFallback:a,resetOnRefresh:o=!1,staleTime:s=0,refetchOnMount:c=`always`}=r,l=i??ye(),u=a??be;return new class extends h{_state;constructor(){super();let t=we(e);this._state=f(t?{status:`resolved`,data:t.data}:{status:`pending`})}onMount(){M.has(e)||M.set(e,new Set);let t=M.get(e),n=()=>this._run();t.add(n),Ee(e);let r=we(e),i=Oe(e,s);return r?!1===c||c===`stale`&&i||c===`always`&&i&&s>0||this._fetch():this._run(),()=>{t.delete(n),t.size===0&&M.delete(e),De(e)}}_run(){(o||this._state.peek().status===`pending`)&&(this._state.value={status:`pending`}),this._fetch()}_fetch(){t().then(t=>{Te(e,t),this._state.value={status:`resolved`,data:t}},e=>{this._state.value={status:`error`,error:e}})}render(){return C`<div class="nix-query" style="display:contents">${()=>{let e=this._state.value;return e.status===`pending`?l:e.status===`error`?u(e.error):n(e.data)}}</div>`}}}function F(e=`Required`){return t=>t==null||t===``||Array.isArray(t)&&t.length===0?e:null}function ke(e,t=`Invalid format`){return n=>typeof n!=`string`||e.test(n)?null:t}function Ae(e=`Invalid email`){return ke(/^[^\s@]+@[^\s@]+\.[^\s@]+$/,e)}function je(e,t=[]){let n=f(e),r=f(!1),i=f(!1),a=f(null),o=m(()=>{if(a.value)return a.value;if(!r.value&&!i.value)return null;for(let e of t){let t=e(n.value);if(t)return t}return null});function s(t){if(!t||!(`value`in t))return e;let n=t;return typeof e==`boolean`?n.checked:typeof e==`number`?Number(n.value):n.value}return{value:n,error:o,touched:r,dirty:i,onInput:e=>{n.value=s(e.target),i.value=!0,a.value=null},onBlur:()=>{r.value=!0},reset:function(){n.value=e,r.value=!1,i.value=!1,a.value=null},_setExternalError:function(e){a.value=e,e&&(r.value=!0)}}}function Me(e,t={}){let n={};for(let r in e){let i=t.validators?.[r]??[];n[r]=je(e[r],i)}let r=m(()=>{let e={};for(let t in n)e[t]=n[t].value.value;return e}),i=m(()=>{let e={};for(let t in n){let r=n[t].error.value;r&&(e[t]=r)}return e}),a=m(()=>{for(let e in n)if(n[e].error.value)return!1;return!0}),o=m(()=>{for(let e in n)if(n[e].dirty.value)return!0;return!1});function s(e){for(let t in e)n[t]?._setExternalError(e[t]??null)}return{fields:n,values:r,errors:i,valid:a,dirty:o,handleSubmit:function(e){return i=>{i.preventDefault();for(let e in n)n[e].touched.value=!0;let a=r.value;if(t.validate){let e=t.validate(a);if(e){let t={},n=!1;for(let r in e){let i=e[r],a=Array.isArray(i)?i[0]??null:i??null;a&&(t[r]=a,n=!0)}if(n)return void s(t)}}for(let e in n)if(n[e].error.value)return;e(a)}},reset:function(){for(let e in n)n[e].reset()},setErrors:s}}var Ne=localStorage.getItem(`biblio_user`),Pe=localStorage.getItem(`biblio_token`),Fe=Ne?JSON.parse(Ne):null,I=ce({token:Pe??``,user:Fe},e=>({setAuth(t,n){e.user.value=t,e.token.value=n,localStorage.setItem(`biblio_user`,JSON.stringify(t)),localStorage.setItem(`biblio_token`,n)},logout(){e.user.value=null,e.token.value=``,localStorage.removeItem(`biblio_user`),localStorage.removeItem(`biblio_token`)}})),L=m(()=>!!I.token.value),Ie=m(()=>I.user.value?.role??null),R=m(()=>I.user.value?.id??null);f(0);var Le=t({adminGuard:()=>V,authGuard:()=>Be,consumePendingRedirect:()=>Re,setPendingRedirect:()=>B}),z=null;function B(e){z=e}function Re(){let e=z;return z=null,e}function ze(e){return e===`/login`||e===`/home`||e===`/`||e.startsWith(`/book/`)}var Be=(e,t)=>{if(ze(e))return e===`/login`&&L.value||e===`/`?`/home`:void 0;if(!L.value)return B(e),`/login`},V=(e,t)=>{if(!L.value)return`/login`;if(Ie.value!==`ADMIN`)return`/home`},Ve=[{id:1,name:`Carlos Mendoza`,email:`carlos@unicolombo.edu.co`,role:`STUDENT`,password:`123456`},{id:2,name:`María López`,email:`maria@unicolombo.edu.co`,role:`TEACHER`,password:`123456`},{id:3,name:`Admin Sistema`,email:`admin@unicolombo.edu.co`,role:`ADMIN`,password:`admin123`}];function H(e,t=400){return new Promise(n=>setTimeout(()=>n(e),t))}var He={async login(e){await H(null,600);let t=Ve.find(t=>t.email===e.email&&t.password===e.password);if(!t)throw Error(`Credenciales inválidas`);let{password:n,...r}=t;return{...r,token:`mock-jwt-${r.id}-${Date.now()}`}}},U=f([]),Ue=0;function W(e,t=`info`,n=3500){let r=Ue++;U.update(n=>[...n,{id:r,message:e,type:t}]),setTimeout(()=>{U.update(e=>e.filter(e=>e.id!==r))},n)}var We={success:`bg-green-600 text-white`,error:`bg-red-600 text-white`,info:`bg-blue-600 text-white`},Ge=class extends h{render(){return C`
            <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
                ${()=>U.value.map(e=>C`
                            <div class=${`px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-[slideIn_0.3s_ease] ${We[e.type]}`}>
                                ${e.message}
                            </div>
                        `)}
            </div>
            <style>
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(100%); }
                    to { opacity: 1; transform: translateX(0); }
                }
            </style>
        `}},Ke=`modulepreload`,qe=function(e){return`/parcial-1-analisis-2-unicolombo/`+e},Je={},Ye=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=o(t.map(t=>{if(t=qe(t,n),t in Je)return;Je[t]=!0;let r=t.endsWith(`.css`),i=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${i}`))return;let o=document.createElement(`link`);if(o.rel=r?`stylesheet`:Ke,r||(o.as=`script`),o.crossOrigin=``,o.href=t,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),r)return new Promise((e,n)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})};function Xe(){let e=k(),t=f(!1),n=f(``),r=Me({email:``,password:``},{validators:{email:[F(`El correo es obligatorio`),Ae(`Correo inválido`)],password:[F(`La contraseña es obligatoria`)]}});return C`
        <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4">
            <div class="w-full max-w-md">
                <div class="bg-white rounded-2xl shadow-xl p-8">
                    <div class="text-center mb-8">
                        <h1 class="text-3xl font-bold text-gray-900">📚 BiblioUniColombo</h1>
                        <p class="mt-2 text-gray-500">Inicia sesión para acceder al sistema</p>
                    </div>

                    <form @submit=${r.handleSubmit(async r=>{t.value=!0,n.value=``;try{let t=await He.login({email:r.email,password:r.password});I.setAuth({id:t.id,name:t.name,email:t.email,role:t.role},t.token),W(`¡Bienvenido, ${t.name}!`,`success`);let n=(await Ye(async()=>{let{consumePendingRedirect:e}=await Promise.resolve().then(()=>Le);return{consumePendingRedirect:e}},void 0)).consumePendingRedirect();e.navigate(n??`/home`)}catch(e){n.value=e instanceof Error?e.message:`Error al iniciar sesión`,W(n.value,`error`)}finally{t.value=!1}})} class="space-y-5">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                            <input
                                type="email"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                                placeholder="correo@unicolombo.edu.co"
                                value=${()=>r.fields.email.value.value}
                                @input=${r.fields.email.onInput}
                                @blur=${r.fields.email.onBlur}
                            />
                            ${()=>{let e=r.fields.email.error.value;return e?C`<p class="mt-1 text-sm text-red-500">${e}</p>`:C`<span></span>`}}
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                            <input
                                type="password"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                                placeholder="••••••••"
                                value=${()=>r.fields.password.value.value}
                                @input=${r.fields.password.onInput}
                                @blur=${r.fields.password.onBlur}
                            />
                            ${()=>{let e=r.fields.password.error.value;return e?C`<p class="mt-1 text-sm text-red-500">${e}</p>`:C`<span></span>`}}
                        </div>

                        ${()=>n.value?C`<div class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">${n.value}</div>`:C`<span></span>`}

                        <button
                            type="submit"
                            class="w-full py-2.5 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled=${()=>t.value}
                        >
                            ${()=>t.value?`Ingresando...`:`Iniciar Sesión`}
                        </button>
                    </form>

                    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p class="text-xs font-semibold text-gray-500 mb-2">Usuarios de prueba:</p>
                        <div class="space-y-1 text-xs text-gray-600">
                            <p><span class="font-medium">Estudiante:</span> carlos@unicolombo.edu.co / 123456</p>
                            <p><span class="font-medium">Docente:</span> maria@unicolombo.edu.co / 123456</p>
                            <p><span class="font-medium">Admin:</span> admin@unicolombo.edu.co / admin123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `}var G=[{id:1,title:`Cien años de soledad`,author:`Gabriel García Márquez`,publisher:`Editorial Sudamericana`,stock:3,cover:`https://covers.openlibrary.org/b/id/8228691-L.jpg`,synopsis:`La historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo.`},{id:2,title:`El Principito`,author:`Antoine de Saint-Exupéry`,publisher:`Reynal & Hitchcock`,stock:5,cover:`https://covers.openlibrary.org/b/id/8769371-L.jpg`,synopsis:`Un piloto perdido en el desierto del Sahara conoce a un pequeño príncipe que viene de un asteroide.`},{id:3,title:`Don Quijote de la Mancha`,author:`Miguel de Cervantes`,publisher:`Francisco de Robles`,stock:2,cover:`https://covers.openlibrary.org/b/id/12648289-L.jpg`,synopsis:`Las aventuras de un hidalgo manchego que enloquece leyendo libros de caballerías y sale a recorrer el mundo.`},{id:4,title:`1984`,author:`George Orwell`,publisher:`Secker & Warburg`,stock:0,cover:`https://covers.openlibrary.org/b/id/12648288-L.jpg`,synopsis:`En un futuro distópico, Winston Smith lucha contra un régimen totalitario que controla cada aspecto de la vida.`},{id:5,title:`Hábitos Atómicos`,author:`James Clear`,publisher:`Penguin Random House`,stock:4,cover:`https://covers.openlibrary.org/b/id/12890741-L.jpg`,synopsis:`Una guía práctica para construir buenos hábitos y romper los malos, basada en evidencia científica.`},{id:6,title:`Clean Code`,author:`Robert C. Martin`,publisher:`Prentice Hall`,stock:1,cover:`https://covers.openlibrary.org/b/id/7507472-L.jpg`,synopsis:`Manual de referencia para escribir código limpio, legible y mantenible en el desarrollo de software.`},{id:7,title:`El Arte de la Guerra`,author:`Sun Tzu`,publisher:`Ediciones Obelisco`,stock:3,cover:`https://covers.openlibrary.org/b/id/8091016-L.jpg`,synopsis:`Tratado militar chino escrito en el siglo V a.C. que aborda la estrategia y la táctica militar.`},{id:8,title:`Sapiens`,author:`Yuval Noah Harari`,publisher:`Debate`,stock:0,cover:`https://covers.openlibrary.org/b/id/10520644-L.jpg`,synopsis:`Un recorrido por la historia de la humanidad, desde los primeros Homo sapiens hasta la era moderna.`},{id:9,title:`Introduction to Algorithms`,author:`Thomas H. Cormen`,publisher:`MIT Press`,stock:2,cover:`https://covers.openlibrary.org/b/id/8474213-L.jpg`,synopsis:`Texto de referencia en ciencias de la computación que cubre una amplia variedad de algoritmos.`},{id:10,title:`La Metamorfosis`,author:`Franz Kafka`,publisher:`Kurt Wolff Verlag`,stock:6,cover:`https://covers.openlibrary.org/b/id/8406786-L.jpg`,synopsis:`Gregor Samsa despierta una mañana convertido en un enorme insecto y debe enfrentar las consecuencias.`}],K=[...G],Ze=K.length+1,q={async getAll(e){let t=K;if(e){let n=e.toLowerCase();t=K.filter(e=>e.title.toLowerCase().includes(n)||e.author.toLowerCase().includes(n))}return H([...t])},async getById(e){return H(K.find(t=>t.id===e)??null)},async create(e){let t={...e,id:Ze++};return K.push(t),H(t)},async update(e,t){let n=K.findIndex(t=>t.id===e);if(n===-1)throw Error(`Libro no encontrado`);return K[n]={...K[n],...t},H(K[n])}};function Qe(e){let t=k(),n=e.stock>0;return C`
        <div
            class="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col group"
            @click=${()=>t.navigate(`/book/${e.id}`)}
        >
            <div class="h-48 bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center overflow-hidden relative">
                ${e.cover?C`<img src=${e.cover} alt=${e.title} class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" />`:C`<span class="text-6xl group-hover:scale-110 transition-transform duration-300">📖</span>`}
                <div class="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors duration-300 flex items-center justify-center">
                    <span class="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-indigo-600/80 px-3 py-1.5 rounded-full backdrop-blur-sm">Ver detalle →</span>
                </div>
            </div>
            <div class="p-4 flex flex-col flex-1">
                <h3 class="font-bold text-gray-900 text-base line-clamp-2 group-hover:text-indigo-700 transition-colors">${e.title}</h3>
                <p class="text-sm text-gray-500 mt-1">${e.author}</p>
                <div class="mt-auto pt-3 flex items-center justify-between">
                    <span class="text-xs text-gray-400">${e.publisher}</span>
                    <span class=${`px-2.5 py-1 rounded-full text-xs font-semibold ${n?`bg-green-100 text-green-700`:`bg-red-100 text-red-700`}`}>
                        ${n?`${e.stock} disponible${e.stock>1?`s`:``}`:`Agotado`}
                    </span>
                </div>
            </div>
        </div>
    `}function J({size:e=`w-8 h-8`,trackColor:t=`border-indigo-200`,activeColor:n=`border-t-indigo-600`,padding:r=`py-16`}={}){return C`
        <div class=${`flex justify-center ${r}`}>
            <div class=${`animate-spin ${e} border-4 ${t} ${n} rounded-full`}></div>
        </div>
    `}function Y({icon:e,message:t,action:n}){return C`
        <div class="text-center py-16 text-gray-400">
            <p class="text-5xl mb-4">${e}</p>
            <p class="text-lg">${t}</p>
            ${n?C`
                    <button
                        class="mt-4 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer"
                        @click=${n.onClick}
                    >${n.label}</button>
                `:C`<span></span>`}
        </div>
    `}function $e(){let e=f(``),t=null;function n(n){e.value=n.target.value,t&&clearTimeout(t),t=setTimeout(()=>{N(`books`)},400)}return C`
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900">Catálogo de Libros</h1>
                <p class="mt-1 text-gray-500">Explora y reserva libros de nuestra biblioteca</p>
            </div>

            <div class="mb-6">
                <div class="relative max-w-lg">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        🔍
                    </span>
                    <input
                        type="text"
                        class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                        placeholder="Buscar por título o autor..."
                        @input=${n}
                    />
                </div>
            </div>

            ${P(`books`,()=>q.getAll(e.peek()||void 0),t=>t.length===0?Y({icon:`📭`,message:`No se encontraron libros`}):C`
                        <p class="mb-4 text-sm text-gray-500">
                            ${t.length} libro${t.length===1?``:`s`} encontrado${t.length===1?``:`s`}${e.peek()?C` — "<strong>${e.peek()}</strong>"`:``}
                        </p>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            ${t.map(e=>Qe(e))}
                        </div>
                    `,{fallback:J()})}
        </div>
    `}var et=[{id:1,userId:1,bookId:1,bookTitle:`Cien años de soledad`,bookAuthor:`Gabriel García Márquez`,requestDate:`2026-02-15T10:30:00`,returnDate:`2026-03-01T09:00:00`,status:`RETURNED`},{id:2,userId:1,bookId:5,bookTitle:`Hábitos Atómicos`,bookAuthor:`James Clear`,requestDate:`2026-03-01T14:00:00`,returnDate:null,status:`BORROWED`},{id:3,userId:2,bookId:6,bookTitle:`Clean Code`,bookAuthor:`Robert C. Martin`,requestDate:`2026-02-20T08:00:00`,returnDate:null,status:`RESERVED`},{id:4,userId:1,bookId:3,bookTitle:`Don Quijote de la Mancha`,bookAuthor:`Miguel de Cervantes`,requestDate:`2026-03-05T16:45:00`,returnDate:null,status:`RESERVED`}],tt=et.length+1;function nt(){return tt++}var X=[...et],Z={async getAll(){return H([...X])},async getByUser(e){return H([...X.filter(t=>t.userId===e)])},async create(e,t){if(await H(null,300),X.filter(t=>t.userId===e&&(t.status===`RESERVED`||t.status===`BORROWED`)).length>=5)throw Error(`Has alcanzado el límite máximo de 5 libros reservados/prestados.`);let n=G.find(e=>e.id===t);if(!n)throw Error(`Libro no encontrado.`);if(n.stock<=0)throw Error(`No hay copias disponibles de este libro.`);n.stock--;let r={id:nt(),userId:e,bookId:t,bookTitle:n.title,bookAuthor:n.author,requestDate:new Date().toISOString(),returnDate:null,status:`RESERVED`};return X.push(r),r},async cancel(e){await H(null,300);let t=X.findIndex(t=>t.id===e);if(t===-1)throw Error(`Reserva no encontrada.`);let n=X[t];if(n.status!==`RESERVED`)throw Error(`Solo se pueden cancelar reservas en estado RESERVED.`);n.status=`CANCELLED`;let r=G.find(e=>e.id===n.bookId);r&&r.stock++},async confirmLoan(e){await H(null,300);let t=X.find(t=>t.id===e);if(!t)throw Error(`Reserva no encontrada.`);if(t.status!==`RESERVED`)throw Error(`Solo se pueden confirmar préstamos en estado RESERVED.`);t.status=`BORROWED`},async returnBook(e){await H(null,300);let t=X.find(t=>t.id===e);if(!t)throw Error(`Reserva no encontrada.`);if(t.status!==`BORROWED`)throw Error(`Solo se pueden devolver libros en estado BORROWED.`);t.status=`RETURNED`,t.returnDate=new Date().toISOString();let n=G.find(e=>e.id===t.bookId);n&&n.stock++}};function rt(){let e=k(),t=Number(e.params.value.id),n=f(!1),r=f(!1),i=f(null);function a(){e.navigate(`/home`)}function o(){e.navigate(`/my-loans`)}function s(){e.navigate(`/home`)}let c=()=>Y({icon:`🔍`,message:`Libro no encontrado`,action:{label:`Ir al catálogo`,onClick:a}});return C`
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                class="group mb-6 text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1 transition-all cursor-pointer"
                @click=${a}
            >
                <span class="inline-block transition-transform group-hover:-translate-x-1">←</span> Volver al catálogo
            </button>

            ${P(`book-${t}`,()=>q.getById(t),t=>{if(!t)return c();let a=()=>i.value===null?t.stock:i.value;function l(){B(`/book/${t.id}`),W(`Inicia sesión para reservar`,`info`),e.navigate(`/login`)}async function u(){let e=R.value;if(e){n.value=!0;try{await Z.create(e,t.id),i.value=a()-1,r.value=!0,N(`books`),N(`my-loans-${e}`),N(`book-${t.id}`),W(`¡Reserva exitosa! 🎉`,`success`)}catch(e){W(e instanceof Error?e.message:`Error al reservar`,`error`)}finally{n.value=!1}}}return C`
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div class="md:flex">
                    <div class="md:w-1/3 bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center p-8 min-h-[300px] relative overflow-hidden">
                        ${t.cover?C`<img src=${t.cover} alt=${t.title} class="max-h-80 rounded-lg shadow-md hover:scale-105 transition-transform duration-300" />`:C`<span class="text-8xl">📖</span>`}
                    </div>
                    <div class="md:w-2/3 p-8">
                        <div class="flex items-start justify-between gap-4">
                            <h1 class="text-2xl font-bold text-gray-900">${t.title}</h1>
                            <span class=${()=>`shrink-0 px-3 py-1 rounded-full text-sm font-semibold transition-colors ${a()>0?`bg-green-100 text-green-700`:`bg-red-100 text-red-700`}`}>
                                ${()=>a()>0?`Disponible`:`Agotado`}
                            </span>
                        </div>

                        <p class="text-lg text-gray-600 mt-1">${t.author}</p>

                        <div class="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                            <span class="flex items-center gap-1">📄 <strong>Editorial:</strong> ${t.publisher}</span>
                            <span class="flex items-center gap-1">📦 <strong>Stock:</strong> ${()=>a()} copia${()=>a()===1?``:`s`}</span>
                        </div>

                        ${t.synopsis?C`
                                <div class="mt-6">
                                    <h3 class="text-sm font-semibold text-gray-700 mb-2">Sinopsis</h3>
                                    <p class="text-gray-600 leading-relaxed">${t.synopsis}</p>
                                </div>
                            `:C`<span></span>`}

                        <div class="mt-8">
                            ${r.value?C`
                    <div class="bg-green-50 border border-green-200 rounded-xl p-4 animate-[fadeIn_0.3s_ease]">
                        <p class="text-green-700 font-semibold flex items-center gap-2">
                            <span class="text-xl">✅</span> ¡Reserva realizada con éxito!
                        </p>
                        <p class="text-green-600 text-sm mt-1">Tu libro te espera. Revisa tu historial de préstamos.</p>
                        <div class="flex gap-3 mt-3">
                            <button
                                class="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 active:scale-95 transition-all cursor-pointer"
                                @click=${o}
                            >📋 Ver Mis Préstamos</button>
                            <button
                                class="px-4 py-2 bg-white text-green-700 text-sm font-semibold rounded-lg border border-green-300 hover:bg-green-50 active:scale-95 transition-all cursor-pointer"
                                @click=${s}
                            >📚 Seguir Explorando</button>
                        </div>
                    </div>
                `:L.value?C`
                <button
                    class=${()=>`px-6 py-3 font-semibold rounded-lg transition-all focus:ring-4 focus:ring-indigo-300 ${a()>0&&!n.value?`bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg active:scale-95 cursor-pointer`:`bg-gray-300 text-gray-500 cursor-not-allowed`}`}
                    disabled=${()=>a()<=0||n.value}
                    @click=${u}
                >
                    ${()=>n.value?C`<span class="flex items-center gap-2"><span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block"></span> Reservando...</span>`:C`<span>📚 Hacer Reserva</span>`}
                </button>
                ${()=>a()<=0?C`<p class="mt-2 text-sm text-red-500 animate-pulse">No hay copias disponibles actualmente</p>`:C`<span></span>`}
            `:C`
                    <button
                        class="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 hover:shadow-lg active:scale-95 focus:ring-4 focus:ring-indigo-300 transition-all cursor-pointer"
                        @click=${l}
                    >
                        🔐 Iniciar sesión para reservar
                    </button>
                `}
                        </div>
                    </div>
                </div>
            </div>
        `},{fallback:J()})}
        </div>
    `}function Q(e){return new Date(e).toLocaleDateString(`es-CO`)}var it={RESERVED:`bg-yellow-100 text-yellow-800`,BORROWED:`bg-blue-100 text-blue-800`,RETURNED:`bg-green-100 text-green-800`,CANCELLED:`bg-gray-100 text-gray-500`},at={RESERVED:`Reservado`,BORROWED:`Prestado`,RETURNED:`Devuelto`,CANCELLED:`Cancelado`};function ot(e){return C`
        <span class=${`px-2.5 py-1 rounded-full text-xs font-semibold ${it[e]}`}>
            ${at[e]}
        </span>
    `}function st(){let e=k(),t=f(!1),n=f(``),r=f(null);function i(){let e=R.peek();e&&N(`my-loans-${e}`)}function a(){e.navigate(`/home`)}function o(e,i){r.value=e,n.value=i,t.value=!0}function s(){t.value=!1,r.value=null}async function c(){let e=r.value;if(e!==null){t.value=!1,r.value=null;try{await Z.cancel(e),W(`Reserva cancelada`,`info`);let t=R.peek();t&&N(`my-loans-${t}`)}catch(e){W(e instanceof Error?e.message:`Error al cancelar`,`error`)}}}function l(e){e.key===`Escape`&&s()}return C`
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            ${()=>t.value?C`
                    <div class="fixed inset-0 z-50 flex items-center justify-center" @keydown=${l}>
                        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click=${s}></div>
                        <div role="dialog" aria-modal="true" aria-labelledby="cancel-modal-title"
                            class="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-fadeIn">
                            <div class="flex items-center gap-3 mb-2">
                                <span class="text-2xl">⚠️</span>
                                <h2 id="cancel-modal-title" class="text-lg font-bold text-gray-900">Cancelar reserva</h2>
                            </div>
                            <p class="text-gray-600 mb-6">
                                ¿Seguro que deseas cancelar la reserva de
                                <strong>${()=>n.value}</strong>?
                            </p>
                            <div class="flex gap-3 justify-end">
                                <button
                                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
                                    @click=${s}
                                >No, volver</button>
                                <button
                                    class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 active:scale-95 transition-all cursor-pointer"
                                    @click=${c}
                                >Sí, cancelar</button>
                            </div>
                        </div>
                    </div>
                `:C`<span></span>`}
            <div class="mb-8 flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Mis Préstamos</h1>
                    <p class="mt-1 text-gray-500">Historial de reservas y préstamos</p>
                </div>
                <button
                    class="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                    @click=${i}
                >
                    🔄 Actualizar
                </button>
            </div>

            ${()=>{let e=R.value;return e?P(`my-loans-${e}`,()=>Z.getByUser(e),e=>e.length===0?Y({icon:`📋`,message:`No tienes préstamos ni reservas aún`,action:{label:`📚 Explorar Catálogo`,onClick:a}}):C`
                            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                                <div class="overflow-x-auto">
                                    <table class="w-full">
                                        <thead>
                                            <tr class="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                <th class="px-6 py-3">Libro</th>
                                                <th class="px-6 py-3">Autor</th>
                                                <th class="px-6 py-3">Fecha Solicitud</th>
                                                <th class="px-6 py-3">Fecha Devolución</th>
                                                <th class="px-6 py-3">Estado</th>
                                                <th class="px-6 py-3">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-gray-100">
                                            ${e.map(e=>C`
                                                <tr class="hover:bg-gray-50 transition-colors">
                                                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${e.bookTitle}</td>
                                                    <td class="px-6 py-4 text-sm text-gray-600">${e.bookAuthor}</td>
                                                    <td class="px-6 py-4 text-sm text-gray-500">${Q(e.requestDate)}</td>
                                                    <td class="px-6 py-4 text-sm text-gray-500">${e.returnDate?Q(e.returnDate):`—`}</td>
                                                    <td class="px-6 py-4">${ot(e.status)}</td>
                                                    <td class="px-6 py-4">
                                                        ${e.status===`RESERVED`?C`
                                                                <button
                                                                    class="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 active:scale-95 transition-all cursor-pointer"
                                                                    @click=${()=>o(e.id,e.bookTitle)}
                                                                >✕ Cancelar</button>
                                                            `:C`<span class="text-sm text-gray-300">—</span>`}
                                                    </td>
                                                </tr>
                                            `)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        `,{fallback:J()}):C`<p class="text-gray-500">No autenticado</p>`}}
        </div>
    `}function ct(e){let t=f(!1),n=Me({title:``,author:``,publisher:``,stock:``,synopsis:``},{validators:{title:[F(`El título es obligatorio`)],author:[F(`El autor es obligatorio`)],publisher:[F(`La editorial es obligatoria`)],stock:[F(`El stock es obligatorio`),e=>{let t=Number(e);return Number.isInteger(t)&&t>=0?null:`Debe ser un número entero ≥ 0`}]}}),r=n.handleSubmit(async r=>{t.value=!0;try{await q.create({title:r.title,author:r.author,publisher:r.publisher,stock:Number(r.stock)||0,synopsis:r.synopsis||void 0}),W(`Libro creado exitosamente`,`success`),n.reset(),e()}catch(e){W(e instanceof Error?e.message:`Error al crear libro`,`error`)}finally{t.value=!1}}),i=`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow text-sm`;return C`
        <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Agregar Nuevo Libro</h2>
            <form @submit=${r} class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input type="text" class=${i} placeholder="Título del libro"
                            value=${()=>n.fields.title.value.value}
                            @input=${n.fields.title.onInput}
                            @blur=${n.fields.title.onBlur}
                        />
                        ${()=>{let e=n.fields.title.error.value;return e?C`<p class="mt-1 text-xs text-red-500">${e}</p>`:C`<span></span>`}}
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                        <input type="text" class=${i} placeholder="Nombre del autor"
                            value=${()=>n.fields.author.value.value}
                            @input=${n.fields.author.onInput}
                            @blur=${n.fields.author.onBlur}
                        />
                        ${()=>{let e=n.fields.author.error.value;return e?C`<p class="mt-1 text-xs text-red-500">${e}</p>`:C`<span></span>`}}
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Editorial</label>
                        <input type="text" class=${i} placeholder="Casa editorial"
                            value=${()=>n.fields.publisher.value.value}
                            @input=${n.fields.publisher.onInput}
                            @blur=${n.fields.publisher.onBlur}
                        />
                        ${()=>{let e=n.fields.publisher.error.value;return e?C`<p class="mt-1 text-xs text-red-500">${e}</p>`:C`<span></span>`}}
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                        <input type="number" class=${i} placeholder="Cantidad" min="0"
                            value=${()=>n.fields.stock.value.value}
                            @input=${n.fields.stock.onInput}
                            @blur=${n.fields.stock.onBlur}
                        />
                        ${()=>{let e=n.fields.stock.error.value;return e?C`<p class="mt-1 text-xs text-red-500">${e}</p>`:C`<span></span>`}}
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Sinopsis (opcional)</label>
                    <textarea class=${`${i} h-20 resize-none`} placeholder="Breve descripción del libro..."
                        @input=${n.fields.synopsis.onInput}
                    ></textarea>
                </div>
                <button
                    type="submit"
                    class="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 hover:shadow-lg active:scale-95 focus:ring-4 focus:ring-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
                    disabled=${()=>t.value}
                >
                    ${()=>t.value?`⏳ Creando...`:`➕ Crear Libro`}
                </button>
            </form>
        </div>
    `}var $=`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow text-sm`;function lt(){let e=f(null),t=f(``),n=f(``),r=f(``),i=f(``),a=f(``),o=f(!1),s=f(null),c=f([]),l=f(!1);function u(o){e.value=o,t.value=o.title,n.value=o.author,r.value=o.publisher,i.value=String(o.stock),a.value=o.synopsis??``}function d(){e.value=null}function p(e){e.key===`Escape`&&d()}async function m(){let s=e.peek();if(!s)return;let c=Number(i.value);if(!t.value.trim()||!n.value.trim()||!r.value.trim()){W(`Completa los campos obligatorios`,`error`);return}if(!Number.isInteger(c)||c<0){W(`El stock debe ser un entero ≥ 0`,`error`);return}o.value=!0;try{await q.update(s.id,{title:t.value.trim(),author:n.value.trim(),publisher:r.value.trim(),stock:c,synopsis:a.value.trim()||void 0}),W(`"${t.value.trim()}" actualizado`,`success`),d(),N(`books`)}catch(e){W(e instanceof Error?e.message:`Error al actualizar`,`error`)}finally{o.value=!1}}async function h(e){if(s.value===e){s.value=null;return}s.value=e,l.value=!0;try{c.value=(await Z.getAll()).filter(t=>t.bookId===e)}catch{W(`Error al cargar reservas`,`error`)}finally{l.value=!1}}async function g(e,t){if(!(t<=0))try{await q.update(e,{stock:t-1}),N(`books`)}catch{W(`Error al actualizar stock`,`error`)}}async function _(e,t){try{await q.update(e,{stock:t+1}),N(`books`)}catch{W(`Error al actualizar stock`,`error`)}}let v=()=>e.value?C`
            <div class="fixed inset-0 z-50 flex items-center justify-center" @keydown=${p}>
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click=${d}></div>
                <div role="dialog" aria-modal="true" aria-labelledby="edit-book-title"
                     class="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4">
                    <div class="flex items-center justify-between mb-5">
                        <h2 id="edit-book-title" class="text-lg font-bold text-gray-900">✏️ Editar Libro</h2>
                        <button class="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer" @click=${d}>✕</button>
                    </div>
                    <div class="space-y-4">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-medium text-gray-700 mb-1">Título *</label>
                                <input type="text" class=${$}
                                    value=${()=>t.value}
                                    @input=${e=>{t.value=e.target.value}}
                                />
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 mb-1">Autor *</label>
                                <input type="text" class=${$}
                                    value=${()=>n.value}
                                    @input=${e=>{n.value=e.target.value}}
                                />
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 mb-1">Editorial *</label>
                                <input type="text" class=${$}
                                    value=${()=>r.value}
                                    @input=${e=>{r.value=e.target.value}}
                                />
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 mb-1">Stock *</label>
                                <input type="number" min="0" class=${$}
                                    value=${()=>i.value}
                                    @input=${e=>{i.value=e.target.value}}
                                />
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Sinopsis (opcional)</label>
                            <textarea class=${`${$} h-20 resize-none`}
                                value=${()=>a.value}
                                @input=${e=>{a.value=e.target.value}}
                            ></textarea>
                        </div>
                    </div>
                    <div class="flex gap-3 justify-end mt-6">
                        <button
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
                            @click=${d}
                        >Cancelar</button>
                        <button
                            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                            disabled=${()=>o.value}
                            @click=${m}
                        >${()=>o.value?`Guardando...`:`💾 Guardar cambios`}</button>
                    </div>
                </div>
            </div>
        `:C`<span></span>`,y=()=>l.value?J({size:`w-5 h-5`,trackColor:`border-amber-200`,activeColor:`border-t-amber-500`,padding:`py-3`}):c.value.length===0?C`<p class="text-sm text-amber-700 text-center py-1">Sin reservas para este libro</p>`:C`
            <p class="text-xs font-semibold text-amber-800 mb-2">Reservas (${()=>c.value.length}):</p>
            <div class="flex flex-wrap gap-2">
                ${()=>c.value.map(e=>C`
                    <div class="flex items-center gap-2 text-xs bg-white rounded-lg px-3 py-1.5 shadow-sm border border-amber-100">
                        <span class="font-medium text-gray-700">Usuario #${e.userId}</span>
                        <span class="text-gray-400">${Q(e.requestDate)}</span>
                        ${e.returnDate?C`<span class="text-gray-400">→ ${Q(e.returnDate)}</span>`:C`<span></span>`}
                        ${ot(e.status)}
                    </div>
                `)}
            </div>
        `;return C`
        ${()=>v()}

        <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
                <h2 class="text-lg font-bold text-gray-900">Gestión de Libros</h2>
            </div>
            ${P(`books`,()=>q.getAll(),e=>C`
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th class="px-6 py-3">ID</th>
                                    <th class="px-6 py-3">Título</th>
                                    <th class="px-6 py-3">Autor</th>
                                    <th class="px-6 py-3">Editorial</th>
                                    <th class="px-6 py-3">Stock</th>
                                    <th class="px-6 py-3">Estado</th>
                                    <th class="px-6 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                ${e.map(e=>C`
                                    <tr class="hover:bg-gray-50 transition-colors">
                                        <td class="px-6 py-4 text-sm text-gray-500">${e.id}</td>
                                        <td class="px-6 py-4 text-sm font-medium text-gray-900">${e.title}</td>
                                        <td class="px-6 py-4 text-sm text-gray-600">${e.author}</td>
                                        <td class="px-6 py-4 text-sm text-gray-500">${e.publisher}</td>
                                        <td class="px-6 py-4">
                                            <div class="flex items-center gap-2">
                                                <button
                                                    class="w-7 h-7 flex items-center justify-center rounded bg-red-50 text-red-600 hover:bg-red-100 active:scale-90 text-sm font-bold transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                                    disabled=${e.stock<=0}
                                                    @click=${()=>g(e.id,e.stock)}
                                                >−</button>
                                                <span class="text-sm font-semibold text-gray-700 w-8 text-center">${e.stock}</span>
                                                <button
                                                    class="w-7 h-7 flex items-center justify-center rounded bg-green-50 text-green-600 hover:bg-green-100 active:scale-90 text-sm font-bold transition-all cursor-pointer"
                                                    @click=${()=>_(e.id,e.stock)}
                                                >+</button>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4">
                                            <span class=${`px-2.5 py-1 rounded-full text-xs font-semibold ${e.stock>0?`bg-green-100 text-green-700`:`bg-red-100 text-red-700`}`}>
                                                ${e.stock>0?`Disponible`:`Agotado`}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4">
                                            <div class="flex items-center gap-2">
                                                <button
                                                    class="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 active:scale-95 transition-all cursor-pointer"
                                                    @click=${()=>u(e)}
                                                >✏️ Editar</button>
                                                <button
                                                    class=${()=>`px-3 py-1.5 text-xs font-semibold rounded-lg active:scale-95 transition-all cursor-pointer ${s.value===e.id?`text-amber-700 bg-amber-100 hover:bg-amber-200`:`text-gray-600 bg-gray-100 hover:bg-gray-200`}`}
                                                    @click=${()=>h(e.id)}
                                                >${()=>s.value===e.id?`🔼 Ocultar`:`📋 Reservas`}</button>
                                            </div>
                                        </td>
                                    </tr>
                                    ${()=>s.value===e.id?C`
                                        <tr>
                                            <td colspan="7" class="px-6 py-3 bg-amber-50 border-t border-amber-100">
                                                ${y()}
                                            </td>
                                        </tr>
                                    `:C`<span></span>`}
                                `)}
                            </tbody>
                        </table>
                    </div>
                `,{fallback:J({size:`w-6 h-6`,padding:`py-8`})})}
        </div>
    `}function ut({reservations:e,currentFilter:t}){async function n(e){try{await Z.confirmLoan(e.id),W(`Préstamo confirmado: "${e.bookTitle}"`,`success`),N(`reservations`)}catch(e){W(e instanceof Error?e.message:`Error al confirmar`,`error`)}}async function r(e){try{await Z.returnBook(e.id),W(`Devolución registrada: "${e.bookTitle}"`,`success`),N(`reservations`),N(`books`)}catch(e){W(e instanceof Error?e.message:`Error al registrar devolución`,`error`)}}let i=t===`ALL`?e:e.filter(e=>e.status===t);return i.length===0?Y({icon:`📋`,message:`No hay registros${t===`ALL`?``:` con estado "${at[t]}"`}`}):C`
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <th class="px-6 py-3">ID</th>
                        <th class="px-6 py-3">Libro</th>
                        <th class="px-6 py-3">Autor</th>
                        <th class="px-6 py-3">Usuario ID</th>
                        <th class="px-6 py-3">Solicitud</th>
                        <th class="px-6 py-3">Devolución</th>
                        <th class="px-6 py-3">Estado</th>
                        <th class="px-6 py-3">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    ${i.map(e=>C`
                        <tr class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 text-sm text-gray-400">#${e.id}</td>
                            <td class="px-6 py-4 text-sm font-medium text-gray-900">${e.bookTitle}</td>
                            <td class="px-6 py-4 text-sm text-gray-600">${e.bookAuthor}</td>
                            <td class="px-6 py-4 text-sm text-gray-500">Usuario #${e.userId}</td>
                            <td class="px-6 py-4 text-sm text-gray-500">${Q(e.requestDate)}</td>
                            <td class="px-6 py-4 text-sm text-gray-500">${e.returnDate?Q(e.returnDate):`—`}</td>
                            <td class="px-6 py-4">${ot(e.status)}</td>
                            <td class="px-6 py-4">
                                ${e.status===`RESERVED`?C`<button
                                        class="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                                        @click=${()=>n(e)}
                                    >✔ Confirmar préstamo</button>`:e.status===`BORROWED`?C`<button
                                            class="px-3 py-1.5 text-xs font-semibold text-green-600 bg-green-50 rounded-lg hover:bg-green-100 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                                            @click=${()=>r(e)}
                                        >↩ Registrar devolución</button>`:C`<span class="text-sm text-gray-300">—</span>`}
                            </td>
                        </tr>
                    `)}
                </tbody>
            </table>
        </div>
    `}var dt=[{value:`ALL`,label:`Todos`},{value:`RESERVED`,label:`Reservados`},{value:`BORROWED`,label:`Prestados`},{value:`RETURNED`,label:`Devueltos`},{value:`CANCELLED`,label:`Cancelados`}];function ft(){let e=f(`ALL`);return C`
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                <h2 class="text-lg font-bold text-gray-900">Gestión de Préstamos</h2>
                <div class="flex gap-1.5">
                    ${dt.map(t=>C`
                        <button
                            class=${()=>`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${e.value===t.value?`bg-indigo-600 text-white`:`bg-gray-100 text-gray-600 hover:bg-gray-200`}`}
                            @click=${()=>{e.value=t.value}}
                        >${t.label}</button>
                    `)}
                </div>
            </div>

            ${P(`reservations`,()=>Z.getAll(),t=>C`
            ${()=>ut({reservations:t,currentFilter:e.value})}
        `,{fallback:J({size:`w-6 h-6`,padding:`py-8`})})}
        </div>
    `}function pt(){let e=f(`books`);function t(){e.value=`books`}function n(){e.value=`loans`}return C`
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900">Panel de Administración</h1>
                <p class="mt-1 text-gray-500">Gestiona libros, stock, préstamos y devoluciones</p>
            </div>

            <div class="flex gap-2 mb-6 border-b border-gray-200">
                <button
                    class=${()=>`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all cursor-pointer -mb-px ${e.value===`books`?`bg-white border border-b-white border-gray-200 text-indigo-700`:`text-gray-500 hover:text-gray-700`}`}
                    @click=${t}
                >📚 Libros</button>
                <button
                    class=${()=>`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all cursor-pointer -mb-px ${e.value===`loans`?`bg-white border border-b-white border-gray-200 text-indigo-700`:`text-gray-500 hover:text-gray-700`}`}
                    @click=${n}
                >📋 Préstamos</button>
            </div>

            ${()=>e.value===`books`?C`
                    <div class="space-y-8">
                        ${ct(()=>N(`books`))}
                        ${lt()}
                    </div>
                `:ft()}
        </div>
    `}function mt(){let e=_e([{path:`/login`,component:()=>Xe()},{path:`/home`,component:()=>$e()},{path:`/book/:id`,component:()=>rt()},{path:`/my-loans`,component:()=>st()},{path:`/admin`,component:()=>pt(),beforeEnter:V},{path:`*`,component:()=>$e()}]);e.beforeEach(Be);let t=window.location.pathname||`/`,n=Be(t,t);if(typeof n==`string`&&n!==t)e.navigate(n);else if(n===void 0&&t===`/admin`){let n=V(t,t);typeof n==`string`&&e.navigate(n)}return e}var ht=class extends h{render(){let e=k(),t=(t,n)=>C`
            <a
                href=${t}
                class=${()=>`px-3 py-2 rounded-md text-sm font-medium transition-colors ${e.current.value===t?`bg-indigo-700 text-white`:`text-indigo-100 hover:bg-indigo-500 hover:text-white`}`}
                @click=${n=>{n.preventDefault(),e.navigate(t)}}
            >${n}</a>
        `;return C`
            <nav class="bg-indigo-600 shadow-lg">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex items-center justify-between h-16">
                        <div class="flex items-center gap-2">
                            <a
                                href="/home"
                                class="text-white font-bold text-xl tracking-tight cursor-pointer hover:opacity-90"
                                @click=${t=>{t.preventDefault(),e.navigate(`/home`)}}
                            >
                                📚 BiblioUniColombo
                            </a>
                        </div>

                        <div class="flex items-center gap-1">
                            ${()=>{if(!L.value)return t(`/login`,`Iniciar Sesión`);let n=[t(`/home`,`Catálogo`),t(`/my-loans`,`Mis Préstamos`)];return Ie.value===`ADMIN`&&n.push(t(`/admin`,`Admin`)),C`
                                    ${n}
                                    <span class="text-indigo-200 text-sm ml-3 hidden sm:inline">
                                        ${()=>I.user.value?.name??``}
                                    </span>
                                    <span class="ml-1 px-2 py-0.5 text-xs rounded-full bg-indigo-800 text-indigo-200 hidden sm:inline">
                                        ${()=>I.user.value?.role??``}
                                    </span>
                                    <button
                                        class="ml-3 px-3 py-1.5 text-sm bg-indigo-800 text-indigo-100 rounded-md hover:bg-indigo-900 active:scale-95 transition-all cursor-pointer"
                                        @click=${()=>{I.logout(),W(`Sesión cerrada`,`info`),e.navigate(`/login`)}}
                                    >
                                        🚪 Salir
                                    </button>
                                `}}
                        </div>
                    </div>
                </div>
            </nav>
        `}},gt=class extends h{render(){return C`
            <div class="min-h-screen bg-gray-50 flex flex-col">
                ${new ht}
                <main class="flex-1">
                    ${new ve}
                </main>
                ${new Ge}
            </div>
        `}};mt(),se(new gt,`#app`);