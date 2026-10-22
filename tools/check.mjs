import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const root=resolve('docs');
const routes=['','type','type/shift','type/flux','type/ink','play','posters','make','studio','credits'];
for(const route of routes){
 const file=resolve(root,route,'index.html');
 const body=await readFile(file,'utf8');
 assert.match(body,/<!doctype html>/i,'doctype '+route);
 assert.match(body,/<main id="main">/,'main '+route);
 assert.match(body,/<title>/,'title '+route);
 assert.match(body,/\/SPLAY\/assets\/site.css/,'styles '+route);
 assert.match(body,/\/SPLAY\/assets\/site.js/,'scripts '+route);
}
for(const file of ['assets/site.css','assets/site.js'])assert.ok((await stat(resolve(root,file))).size>0,'asset '+file);
const manifest=JSON.parse(await readFile(resolve('media/manifest.json'),'utf8'));
const verified=JSON.parse((await readFile(resolve('media/verification.json'),'utf8')).replace(/^\uFEFF/,''));
assert.equal(manifest.records.length,4);assert.equal(verified.length,4);
for(const row of manifest.records){
 let data=await readFile(resolve(row.source));
 if(row.output.endsWith('.svg'))data=Buffer.from(data.toString().replaceAll('\r\n','\n'));
 assert.equal(createHash('sha256').update(data).digest('hex'),row.sha256,'original '+row.source);
 assert.ok(verified.some(v=>v.key===row.key&&v.verified&&v.sha256===row.sha256&&v.bytes===row.bytes),'verified R2 '+row.key);
}
const src=await readFile(resolve(root,'assets/site.js'),'utf8');
for(const key of ['data-type-lab','data-workbench','data-maker','toBlob','data-maker-undo','data-maker-redo','data-maker-share'])assert.ok(src.includes(key),'missing interaction '+key);
const posters=await readFile(resolve(root,'posters/index.html'),'utf8');
assert.equal((posters.match(/class="archive-item"/g)||[]).length,12,'12 poster studies');
const check=spawnSync(process.execPath,['--check',resolve(root,'assets/site.js')],{encoding:'utf8'});
assert.equal(check.status,0,check.stderr);

// Protect navigation, branding and relative Pages links.
const fsPaths=new Set();
async function collect(dir, prefix='') {
 for(const item of await (await import('node:fs/promises')).readdir(dir,{withFileTypes:true})){
  const relative=prefix+item.name;
  if(item.isDirectory())await collect(resolve(dir,item.name),relative+'/');
  else fsPaths.add(relative);
 }
}
await collect(root);
for(const route of routes){
 const content=await readFile(resolve(root,route,'index.html'),'utf8');
 assert.match(content,/aria-label="SPLAY Home">SPL<span class="logo-a">Λ<\/span>Y/,'correct SPLAY logo in '+route);
 for(const match of content.matchAll(/(?:href|src)="(\/SPLAY\/[^"]*)"/g)){
  const url=match[1].split(/[?#]/)[0].slice('/SPLAY/'.length);
  const path=(!url||url.endsWith('/')) ? url+'index.html' : url;
  assert.ok(fsPaths.has(path),'missing local link target: '+match[1]+' in '+route);
 }
}
const css=await readFile(resolve(root,'assets/site.css'),'utf8');
for(const font of ['Anybody.ttf','Recursive.woff2','Fraunces.ttf']){
 assert.ok(css.includes('https://media.pfxamd.com/pfxamd/concepts/splay/'+font),'missing R2 font declaration '+font);
}

console.log('SPLAY checks passed: 10 pages, 12 posters, fonts and script syntax.');
