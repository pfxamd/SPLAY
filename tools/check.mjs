import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
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
for(const file of ['assets/site.css','assets/site.js','assets/favicon.svg','assets/fonts/Anybody.ttf','assets/fonts/Recursive.woff2','assets/fonts/Fraunces.ttf'])assert.ok((await stat(resolve(root,file))).size>0,'asset '+file);
const src=await readFile(resolve(root,'assets/site.js'),'utf8');
for(const key of ['data-type-lab','data-workbench','data-maker','toBlob','data-maker-undo','data-maker-redo','data-maker-share'])assert.ok(src.includes(key),'missing interaction '+key);
const posters=await readFile(resolve(root,'posters/index.html'),'utf8');
assert.equal((posters.match(/class="archive-item"/g)||[]).length,12,'12 poster studies');
const check=spawnSync(process.execPath,['--check',resolve(root,'assets/site.js')],{encoding:'utf8'});
assert.equal(check.status,0,check.stderr);
console.log('SPLAY checks passed: 10 pages, 12 posters, fonts and script syntax.');
