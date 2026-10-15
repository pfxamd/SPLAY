
(function(){
'use strict';
var ROOT='/SPLAY/';
var familyDefs={
 shift:{name:'SHIFT',face:'Anybody',source:'ANYBODY',axes:[['wdth','WIDTH',50,150,100,1],['wght','WEIGHT',100,900,800,1]]},
 flux:{name:'FLUX',face:'Recursive',source:'RECURSIVE',axes:[['CASL','CASUAL',0,1,.6,.01],['MONO','MONO',0,1,.25,.01],['wght','WEIGHT',300,1000,750,1],['slnt','SLANT',-15,0,-4,1]]},
 ink:{name:'INK',face:'Fraunces',source:'FRAUNCES',axes:[['SOFT','SOFTNESS',0,100,70,1],['wght','WEIGHT',100,900,800,1],['opsz','OPTICAL SIZE',9,144,96,1],['WONK','WONKY',0,1,1,1]]}
};
var presets=[
 ['TYPE\nPLAY.','impact','shift','black'],
 ['MORE\nLESS.','echo','shift','pink'],
 ['WIDE\nAWAKE.','fold','shift','white'],
 ['STRETCH\nYOUR\nMIND','drift','shift','black'],
 ['NEVER\nSTATIC.','impact','flux','white'],
 ['SIGNAL\nNOISE','echo','flux','black'],
 ['MAKE\nSPACE.','fold','flux','pink'],
 ['FIND\nFORM.','drift','flux','white'],
 ['SOFT\nPOWER.','impact','ink','pink'],
 ['LOOSE\nLINES','echo','ink','white'],
 ['INK\nMOVES','fold','ink','black'],
 ['FEEL\nTYPE.','drift','ink','pink']
];
var $=function(sel,root){return (root||document).querySelector(sel)};
var $$=function(sel,root){return Array.from((root||document).querySelectorAll(sel))};
function clamp(v,a,b){return Math.min(b,Math.max(a,v))}
function defaults(f){var a={};familyDefs[f].axes.forEach(function(row){a[row[0]]=row[4]});return a}
function vars(a){return Object.keys(a).map(function(k){return "'"+k+"' "+a[k]}).join(',')}
function axisHTML(def,val){
 var tag=def[0],label=def[1],min=def[2],max=def[3],step=def[5];
 return '<label class="axis-control"><span class="axis-label">'+label+'<b data-axis-output="'+tag+'">'+val+'</b></span><input type="range" data-axis="'+tag+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+val+'" aria-label="'+label+'"><span class="axis-extents"><small>'+min+'</small><small>'+max+'</small></span></label>';
}
function setPressed(container,attr,selected){$$('['+attr+']',container).forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute(attr)===selected))})}
function attachAxes(container,face,axes,onChange){
 container.innerHTML=familyDefs[face].axes.map(function(def){return axisHTML(def,axes[def[0]])}).join('');
 $$('[data-axis]',container).forEach(function(input){
  input.addEventListener('input',function(){
   var key=input.getAttribute('data-axis'),v=Number(input.value);
   axes[key]=v;
   var display=$('[data-axis-output="'+key+'"]',container);
   if(display) display.textContent=String(v);
   onChange(key,v);
  });
 });
}
function textSafe(str){return String(str).replace(/[<>]/g,'').slice(0,72)}
function classSwap(el,prefix,newName,options){options.forEach(function(x){el.classList.remove(prefix+x)});el.classList.add(prefix+newName)}
// Accessible mobile nav
var menu=$('.menu-button'),mobile=$('.mobile-nav');
function closeMenu(){if(menu)menu.setAttribute('aria-expanded','false');if(mobile)mobile.hidden=true}
if(menu&&mobile){
 menu.addEventListener('click',function(){var open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));mobile.hidden=!open});
 mobile.addEventListener('click',function(e){if(e.target.closest('a'))closeMenu()});
 window.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu()});
 window.addEventListener('resize',function(){if(innerWidth>780)closeMenu()});
}
// Pointer-controlled introduction; the five glyphs react individually
var hero=$('[data-pointer-hero]'),reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(hero&&!reduceMotion){
 var letters=$$('.hero-word span',hero),raf=0,tx=.5,ty=.5;
 function paintHero(){
  raf=0;
  letters.forEach(function(el,i){var bias=(i-2)*.11, distance=Math.abs(tx-(i+.5)/5);var width=Math.round(clamp(95+(tx-.5)*95-(distance*28),50,150));var weight=Math.round(clamp(820+ty*100-distance*130,100,900));el.style.fontVariationSettings="'wdth' "+width+",'wght' "+weight;el.style.transform='translateY('+Math.round((ty-.5)*(i%2===0?-19:19))+'px)'});
  if($('#coord-x'))$('#coord-x').textContent=String(Math.round(tx*100)).padStart(3,'0');
  if($('#coord-y'))$('#coord-y').textContent=String(Math.round(ty*100)).padStart(3,'0');
 }
 hero.addEventListener('pointermove',function(e){if(e.pointerType==='touch')return;var r=hero.getBoundingClientRect();tx=clamp((e.clientX-r.left)/r.width,0,1);ty=clamp((e.clientY-r.top)/r.height,0,1);if(!raf)raf=requestAnimationFrame(paintHero)},{passive:true});
 hero.addEventListener('pointerleave',function(){tx=.5;ty=.5;if(!raf)raf=requestAnimationFrame(paintHero)});
}
// Progressive typography reveals
if(!reduceMotion&&window.IntersectionObserver){
 var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('entered');observer.unobserve(entry.target)}})},{threshold:.15});
 $$('.manifesto-grid h2,.chapter-intro h2,.posters-head h2,.make-call h2').forEach(function(el){observer.observe(el)});
}
$$('[data-scrub-word]').forEach(function(el){
 var fam=el.dataset.family || 'shift';
 if(reduceMotion)return;
 function motion(x){
  var a=defaults(fam);
  if(fam==='shift'){a.wdth=Math.round(50+x*100);a.wght=Math.round(450+x*450)}
  else if(fam==='flux'){a.CASL=Number(x.toFixed(2));a.MONO=Number((1-x).toFixed(2));a.wght=Math.round(450+x*500);a.slnt=Math.round(-15*x)}
  else {a.SOFT=Math.round(x*100);a.wght=Math.round(450+x*420);a.opsz=Math.round(30+114*x)}
  el.style.fontVariationSettings=vars(a);
 }
 el.addEventListener('pointermove',function(e){if(e.pointerType==='touch')return;var r=el.getBoundingClientRect();motion(clamp((e.clientX-r.left)/r.width,0,1))},{passive:true});
 el.addEventListener('pointerleave',function(){el.style.removeProperty('font-variation-settings')});
});
var homeInput=$('#home-type-input');if(homeInput)homeInput.addEventListener('focus',function(){homeInput.select()});
// Individual type experiments
$$('[data-type-lab]').forEach(function(lab){
 var family=lab.dataset.family,defs=familyDefs[family],preview=$('.editable-type',lab),inputs=$$('[data-axis]',lab),initial=defaults(family);
 function render(){var state={};inputs.forEach(function(inp){state[inp.dataset.axis]=Number(inp.value);var display=$('[data-axis-output="'+inp.dataset.axis+'"]',lab);if(display)display.textContent=String(inp.value)});preview.style.fontVariationSettings=vars(state)}
 inputs.forEach(function(inp){inp.addEventListener('input',render)});
 $('[data-reset]',lab).addEventListener('click',function(){inputs.forEach(function(inp){inp.value=String(initial[inp.dataset.axis])});preview.value=family==='shift'?'STRETCH':family==='flux'?'UNFORM':'Softness.';render()});
 render();
});
var filterButtons=$$('[data-poster-filter]');
filterButtons.forEach(function(btn){btn.addEventListener('click',function(){var name=btn.dataset.posterFilter;setPressed(document,'data-poster-filter',name);$$('[data-poster-family]').forEach(function(item){item.hidden=name!=='all'&&item.dataset.posterFamily!==name})})});
// Full type playground
var work=$('[data-workbench]');
if(work){
 var face='shift',state=defaults(face),renderEl=$('[data-play-render]',work),frame=$('[data-play-frame]',axisPanel=$('[data-axis-panel]',work),caption=$('[data-family-label]',work);
 var given=new URLSearchParams(location.search).get('family');if(familyDefs[given])face=given;
 function renderPlay(){
  classSwap(renderEl,'type-',face,Object.keys(familyDefs));
  renderEl.style.fontVariationSettings=vars(state);
  frame.style.background=face==='shift'?'var(--pink)':face==='flux'?'var(--ink)':'#e8e7e1';
  frame.style.color=face==='flux'?'var(--paper)':'var(--ink)';
  caption.textContent=familyDefs[face].name+' — '+familyDefs[face].source;
  setPressed(work,'data-family-choice',face);
 }
 function showAxes(){attachAxes(axisPanel,face,state,renderPlay)}
 function changeFace(f){face=f;state=defaults(f);showAxes();renderPlay()}
 $$('[data-family-choice]',work).forEach(function(b){b.addEventListener('click',function(){changeFace(b.dataset.familyChoice)})});
 $('[data-randomize]',work).addEventListener('click',function(){familyDefs[face].axes.forEach(function(row){var n=row[2]+Math.random()*(row[3]-row[2]);state[row[0]]=row[5]>=1?Math.round(n):Math.round(n*100)/100});showAxes();renderPlay()});
 $('[data-reset]',work).addEventListener('click',function(){state=defaults(face);renderEl.textContent='EVERYTHING MOVES.';showAxes();renderPlay()});
 changeFace(face);
}
// Poster studio: data-only state, bespoke DOM renderer, PNG bitmap export.
var studio=$('[data-maker]');
if(studio){
 var art=$('[data-maker-artboard]',studio),words=$('[data-maker-render]',studio),input=$('[data-maker-text]',studio),axesContainer=$('[data-maker-axes]',studio),scaleInput=$('[data-maker-scale]',studio),scaleValue=$('[data-maker-scale-value]',studio),sizeSelect=$('[data-maker-size]',studio),status=$('[data-maker-status]',studio),undo=$('[data-maker-undo]',studio),redo=$('[data-maker-redo]',studio);
 var initial={text:'TYPE\nPLAY.',family:'shift',layout:'impact',palette:'pink',scale:100,size:'1080x1350',axes:defaults('shift')};
 var state=clone(initial),history=[],future=[],maxHistory=40;
 function clone(o){return JSON.parse(JSON.stringify(o))}
 function snapshot(){var old=history[history.length-1];if(old&&JSON.stringify(old)===JSON.stringify(state))return;history.push(clone(state));if(history.length>maxHistory)history.shift();future=[];updateHistory()}
 function updateHistory(){undo.disabled=!history.length;redo.disabled=!future.length}
 function message(s){status.textContent=s}
 function makeAxes(){attachAxes(axesContainer,state.family,state.axes,function(){draw();});}
 function draw(){
  input.value=state.text;
  classSwap(art,'poster-',state.palette,['pink','black','white']);
  classSwap(art,'composition-',state.layout,['impact','echo','fold','drift']);
  classSwap(art,'type-',state.family,Object.keys(familyDefs));
  art.classList.toggle('is-landscape',state.size==='1920x1080');
  var lines=state.text.split('\n').slice(0,4);
  words.replaceChildren();
  lines.forEach(function(line){var span=document.createElement('span');span.textContent=line||' ';words.appendChild(span)});
  words.style.fontVariationSettings=vars(state.axes);
  words.style.setProperty('--user-scale',String(state.scale/100));
  var k=state.scale/100;words.style.fontSize=state.size==='1920x1080'?'clamp('+(43*k)+'px,'+(6*k)+'vw,'+(106*k)+'px)':'clamp('+(60*k)+'px,'+(6.8*k)+'vw,'+(116*k)+'px)';
  $('[data-maker-dimensions]',studio).textContent=state.size.replace('x',' × ')+' PX';
  scaleInput.value=String(state.scale);scaleValue.textContent=state.scale+'%';sizeSelect.value=state.size;
  setPressed(studio,'data-maker-family',state.family);setPressed(studio,'data-maker-layout',state.layout);setPressed(studio,'data-maker-palette',state.palette);
  updateHistory();
 }
 function apply(next,addHistory){if(addHistory)snapshot();state=Object.assign({},state,next);if(next.family&&!next.axes)state.axes=defaults(state.family);makeAxes();draw();}
 function applyPreset(i){var p=presets[i];if(!p)return;state={text:p[0],layout:p[1],family:p[2],palette:p[3],scale:100,size:'1080x1350',axes:defaults(p[2])};history=[];future=[];makeAxes();draw();message('POSTER STUDY '+String(i+1).padStart(2,'0')+' LOADED. MAKE IT YOURS.')}
 // URL-based reload: encoded JSON stores only artistic settings
 function decodeLink(code){try{var chars=atob(code.replace(/-/g,'+').replace(/_/g,'/'));var bytes=Uint8Array.from(chars,function(ch){return ch.charCodeAt(0)});return JSON.parse(new TextDecoder().decode(bytes))}catch(e){return null}}
 function validate(v){
  if(!v||typeof v!=='object'||!familyDefs[v.family]||!['impact','echo','fold','drift'].includes(v.layout)||!['pink','black','white'].includes(v.palette)||!['1080x1350','2400x3000','1920x1080'].includes(v.size))return null;
  var safe=clone(initial);safe.text=textSafe(v.text||'TYPE\nPLAY.');safe.family=v.family;safe.layout=v.layout;safe.palette=v.palette;safe.size=v.size;safe.scale=clamp(Number(v.scale)||100,60,145);safe.axes=defaults(v.family);
  var provided=(v.axes&&typeof v.axes==='object')?v.axes:{};
  familyDefs[v.family].axes.forEach(function(row){var val=Number(provided[row[0]]);if(Number.isFinite(val))safe.axes[row[0]]=clamp(val,row[2],row[3])});
  return safe;
 }
 var params=new URLSearchParams(location.search),linkState=decodeLink(params.get('design')||'');
 if(linkState){var decoded=validate(linkState);if(decoded)state=decoded}
 else if(params.has('preset')){var idx=Number(params.get('preset'));if(Number.isInteger(idx)&&idx>=0&&idx<presets.length)applyPreset(idx)}
 makeAxes();draw();
 input.addEventListener('focus',function(){snapshot()});
 input.addEventListener('input',function(){state.text=textSafe(input.value);draw()});
 $$('[data-maker-family]',studio).forEach(function(b){b.addEventListener('click',function(){if(state.family!==b.dataset.makerFamily)apply({family:b.dataset.makerFamily},true)})});
 $$('[data-maker-layout]',studio).forEach(function(b){b.addEventListener('click',function(){if(state.layout!==b.dataset.makerLayout)apply({layout:b.dataset.makerLayout},true)})});
 $$('[data-maker-palette]',studio).forEach(function(b){b.addEventListener('click',function(){if(state.palette!==b.dataset.makerPalette)apply({palette:b.dataset.makerPalette},true)})});
 axesContainer.addEventListener('pointerdown',snapshot);axesContainer.addEventListener('keydown',function(e){if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))snapshot()});
 scaleInput.addEventListener('pointerdown',snapshot);scaleInput.addEventListener('keydown',function(e){if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key))snapshot()});
 scaleInput.addEventListener('input',function(){state.scale=Number(scaleInput.value);draw()});
 sizeSelect.addEventListener('change',function(){apply({size:sizeSelect.value},true)});
 $('[data-maker-reset]',studio).addEventListener('click',function(){snapshot();state=clone(initial);makeAxes();draw();message('FRESH ARTBOARD. ANYTHING CAN HAPPEN.')});
 undo.addEventListener('click',function(){if(!history.length)return;future.push(clone(state));state=history.pop();makeAxes();draw();message('ONE STEP BACK.')});
 redo.addEventListener('click',function(){if(!future.length)return;history.push(clone(state));state=future.pop();makeAxes();draw();message('BACK TO THE FUTURE.')});
 $('[data-maker-share]',studio).addEventListener('click',async function(){
  try{var json=JSON.stringify(state),bytes=new TextEncoder().encode(json);var chars='';bytes.forEach(function(b){chars+=String.fromCharCode(b)});var code=btoa(chars).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/g,'');var link=location.origin+ROOT+'make/?design='+encodeURIComponent(code);
   await navigator.clipboard.writeText(link);message('DESIGN LINK COPIED. SHARE THE EXPERIMENT.');
  }catch(e){message('COPY UNAVAILABLE. USE A SECURE BROWSER CONTEXT.')}
 });
 // Canvas drawing for stand-alone PNG output. This export uses real installed or web-loaded font faces.
 function exportImage(){return new Promise(async function(resolve,reject){
  var pieces=state.size.split('x').map(Number),W=pieces[0],H=pieces[1],landscape=W>H;
  var canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;var ctx=canvas.getContext('2d',{alpha:false});
  if(!ctx){reject(new Error('Canvas unavailable'));return}
  var bg=state.palette==='pink'?'#ff2d96':state.palette==='black'?'#0d0d10':'#e9e9e2';
  var fg=state.palette==='black'?'#f7f7f2':'#0d0d10';
  var fam=familyDefs[state.family],fontWeight=Math.round(state.axes.wght||800),fontFamily=fam.face;
  var pad=Math.round(W*.055),maxWidth=W-pad*2;
  try{await document.fonts.load(fontWeight+' 48px "'+fontFamily+'"')}catch(e){}
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);ctx.fillStyle=fg;
  ctx.textBaseline='top';ctx.textAlign='left';ctx.font='700 '+Math.round(W*.014)+'px monospace';
  ctx.fillText('SP / UNIQUE',pad,pad);ctx.textAlign='right';ctx.fillText('EXPERIMENTAL TYPE',W-pad,pad);
  var lines=state.text.split('\n').slice(0,4).map(function(s){return s.trim()||' '});
  var base= (landscape?W*.15:W*.185) * (state.scale/100);
  var space=H*.025;var available=H-pad*4;var size=Math.min(base,(available-space*lines.length)/lines.length);
  var widths=[],fit=0;
  for(var attempt=0;attempt<20;attempt++){
   ctx.font=fontWeight+' '+Math.max(6,Math.round(size))+'px "'+fontFamily+'"';
   if('fontStretch' in ctx&&state.family==='shift')ctx.fontStretch=state.axes.wdth+'%';
   widths=lines.map(function(s){return ctx.measureText(s).width});
   fit=Math.max.apply(null,widths);
   if(fit<maxWidth*(state.layout==='fold'?1.04:.94))break;
   size*=.91;
  }
  var lineHeight=size*.88,total=lineHeight*lines.length;
  ctx.save();
  ctx.translate(W/2,H/2);
  if(state.layout==='impact')ctx.rotate(-6*Math.PI/180);
  if(state.layout==='fold')ctx.rotate(-Math.PI/2);
  if(state.layout==='drift')ctx.transform(1,-.15,.02,1,0,0);
  ctx.textBaseline='middle';ctx.font=fontWeight+' '+Math.max(6,Math.round(size))+'px "'+fontFamily+'"';
  if('fontStretch' in ctx&&state.family==='shift')ctx.fontStretch=state.axes.wdth+'%';
  lines.forEach(function(s,i){
   var y=(i-(lines.length-1)/2)*lineHeight,x=-Math.min(maxWidth,ctx.measureText(s).width)/2;
   if(state.layout==='echo'&&i%2){ctx.strokeStyle=fg;ctx.lineWidth=Math.max(2,W*.004);ctx.strokeText(s,x+W*.035,y);return}
   if(state.layout==='drift'&&i%2){ctx.font=fontWeight+' '+Math.round(size*.72)+'px "'+fontFamily+'"';ctx.fillText(s,x+W*.11,y);ctx.font=fontWeight+' '+Math.round(size)+'px "'+fontFamily+'"';return}
   ctx.fillText(s,x,y);
  });
  ctx.restore();
  ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.font='700 '+Math.round(W*.014)+'px monospace';ctx.fillStyle=fg;
  ctx.fillText('WORDS INTO FORM.',pad,H-pad);
  ctx.textAlign='right';ctx.fillText('SPLAY / 2026  ↗',W-pad,H-pad);
  canvas.toBlob(function(blob){if(!blob)reject(new Error('PNG encoding failed'));else resolve(blob)},'image/png');
 }) }
 var exportBtn=$('[data-maker-export]',studio);
 exportBtn.addEventListener('click',async function(){
  exportBtn.disabled=true;message('RENDERING YOUR POSTER…');
  try{var blob=await exportImage();var objectUrl=URL.createObjectURL(blob),anchor=document.createElement('a');anchor.href=objectUrl;anchor.download='SPLAY-'+state.family.toUpperCase()+'-'+state.layout.toUpperCase()+'.png';document.body.appendChild(anchor);anchor.click();anchor.remove();setTimeout(function(){URL.revokeObjectURL(objectUrl)},1500);message('PNG EXPORTED. SAVE YOUR NEXT IDEA.')}
  catch(e){message('EXPORT COULD NOT COMPLETE: '+(e&&e.message||'TRY AGAIN'))}
  finally{exportBtn.disabled=false}
 });
}
})();
