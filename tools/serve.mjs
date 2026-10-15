import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
const root = resolve('docs');
const rootPrefix = '/SPLAY/';
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.ttf':'font/ttf','.woff2':'font/woff2','.png':'image/png'};
const port = Number(process.env.PORT || 8078);
createServer(async(req,res)=>{
  let target;
  try {
    const u = new URL(req.url || '/', 'http://localhost');
    if (u.pathname === '/') {res.writeHead(302,{Location:rootPrefix});res.end();return;}
    const p = decodeURIComponent(u.pathname);
    if (!p.startsWith(rootPrefix)) {res.writeHead(404);res.end('Outside SPLAY preview');return;}
    const sub=p.slice(rootPrefix.length);
    target=resolve(root,sub || '.',sub.endsWith('/') || !sub.includes('.') ? 'index.html' : '');
    if (target!==root && !target.startsWith(root+sep)) throw new Error('Traversal');
    const info=await stat(target); if(!info.isFile())throw new Error('Not a file');
    const ext=target.slice(target.lastIndexOf('.'));
    const data=await readFile(target);
    res.writeHead(200,{'Content-Type':mime[ext]||'application/octet-stream','Content-Length':data.length,'Cache-Control':'no-cache'});
    if(req.method==='HEAD')res.end();else res.end(data);
  }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found')}
}).listen(port,'127.0.0.1',()=>console.log('SPLAY preview: http://127.0.0.1:'+port+rootPrefix));
