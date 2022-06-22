import{Y as m}from"./index-374dfc94.js";function d(t){return t<.5?4*t*t*t:.5*Math.pow(2*t-2,3)+1}function l(t){const o=t-1;return o*o*o+1}function g(t){return t*t}function b(t,{delay:o=0,duration:c=400,easing:r=d,amount:a=5,opacity:e=0}={}){const n=getComputedStyle(t),s=+n.opacity,i=n.filter==="none"?"":n.filter,u=s*(1-e);return{delay:o,duration:c,easing:r,css:(p,f)=>`opacity: ${s-u*f}; filter: ${i} blur(${f*a}px);`}}function _(t,{delay:o=0,duration:c=400,easing:r=m}={}){const a=+getComputedStyle(t).opacity;return{delay:o,duration:c,easing:r,css:e=>`opacity: ${e*a}`}}function x(t,{delay:o=0,duration:c=400,easing:r=l,x:a=0,y:e=0,opacity:n=0}={}){const s=getComputedStyle(t),i=+s.opacity,u=s.transform==="none"?"":s.transform,p=i*(1-n);return{delay:o,duration:c,easing:r,css:(f,y)=>`
			transform: ${u} translate(${(1-f)*a}px, ${(1-f)*e}px);
			opacity: ${i-p*y}`}}function C(t,{delay:o=0,duration:c=400,easing:r=l,start:a=0,opacity:e=0}={}){const n=getComputedStyle(t),s=+n.opacity,i=n.transform==="none"?"":n.transform,u=1-a,p=s*(1-e);return{delay:o,duration:c,easing:r,css:(f,y)=>`
			transform: ${i} scale(${1-u*y});
			opacity: ${s-p*y}
		`}}export{_ as a,b,l as c,x as f,g as q,C as s};
