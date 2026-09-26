// Isolated synthetic fixture: no real accounts, database writes, or signatures.
import {createServer} from 'node:http';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import vm from 'node:vm';
import '../wisp-appearance.js';
const {chromium}=await import(pathToFileURL(process.env.WISP_PLAYWRIGHT_PATH).href);
const root=process.cwd();
mkdirSync('tmp/pdfs/appearance',{recursive:true});
const server=createServer((req,res)=>{
  if(req.url==='/fixture'){res.setHeader('Content-Type','text/html');res.end('<!doctype html><html><head></head><body></body></html>');return;}
  const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(!file.startsWith(root+path.sep)||!existsSync(file)){res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type',file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':file.endsWith('.woff2')?'font/woff2':'text/html');
  res.end(readFileSync(file));
}).listen(0,'127.0.0.1');
await new Promise(resolve=>server.once('listening',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}});
  await page.goto(base+'/fixture');
  // Replace the page with a self-contained fixture before any authenticated action.
  await page.setContent(`<link rel="stylesheet" href="${base}/styles.css"><link rel="stylesheet" href="${base}/wisp-appearance.css"><style>body{background:#fff}</style><div id="fixture" style="margin:30px auto;max-width:1200px"></div>`);
  await page.addScriptTag({path:'wisp-appearance.js'});
  await page.addScriptTag({content:`window.state={builderDrafts:{},form:{companyName:'Hamilton & Cole Advisory'},firmProfile:{},settingsLogo:null};window.escapeHtml=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;');window.cleanupBuilderMergeDownloadUrl=()=>{};window.scheduleBuilderDraftSync=()=>{};window.handleAction=()=>{};`});
  await page.addScriptTag({path:'wisp-appearance-editor.js'});
  await page.evaluate(()=>{
    const c=document.createElement('canvas');c.width=600;c.height=180;const ctx=c.getContext('2d');ctx.fillStyle='#153f6d';ctx.fillRect(0,0,600,180);ctx.fillStyle='#fff';ctx.font='bold 52px Arial';ctx.textAlign='center';ctx.fillText('HAMILTON & COLE',300,108);
    state.builderDrafts.appearance=JSON.stringify(WispAppearance.normalize({logoData:c.toDataURL(),logoName:'Fixture logo',width:230,height:69}));
    document.getElementById('fixture').innerHTML=renderWispAppearanceEditor();bindWispAppearanceEditor();
  });
  const frame=page.frameLocator('[data-wa-preview]');
  await frame.locator('.wisp-cover-logo').waitFor();
  await page.locator('[data-wa-field="headingFont"]').selectOption('lora');
  await frame.locator('.wisp-cover-logo').waitFor();
  await frame.locator('.wisp-cover-logo').focus();
  await page.keyboard.press('Shift+ArrowRight');
  const afterKey=await page.evaluate(()=>getWispAppearance());
  if(afterKey.x!==316)throw Error('Keyboard movement did not persist');
  const box=await frame.locator('.wisp-cover-logo').boundingBox();
  const pageBox=await page.locator('.wa-paper-viewport').boundingBox();
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
  await page.mouse.down();await page.mouse.move(box.x+box.width/2+30,box.y+box.height/2+45,{steps:6});await page.mouse.up();
  const moved=await page.evaluate(()=>getWispAppearance());
  const expected=316+30/pageBox.width*612;
  if(Math.abs(moved.x-expected)>2)throw Error(`Scaled drag mismatch ${moved.x}, expected ${expected}`);
  await page.locator('[data-wa-field="logoEnabled"]').uncheck();
  await frame.locator('.wisp-cover').waitFor();
  if(await frame.locator('.wisp-cover-logo').count())throw Error('Hidden logo still visible');
  await page.locator('[data-wa-field="logoEnabled"]').check();
  await frame.locator('.wisp-cover-logo').waitFor();
  await page.screenshot({path:'tmp/pdfs/appearance/editor-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'tmp/pdfs/appearance/editor-mobile.png',fullPage:true});
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Mobile overflow');
  const a=await page.evaluate(()=>getWispAppearance());
  const source=readFileSync('scripts/wisp_merge_service.mjs','utf8');
  const render=vm.runInNewContext(source.slice(source.indexOf('function buildDownloadPreviewHtml('),source.indexOf('function runMerge('))+'\nbuildDownloadPreviewHtml',{
    WispAppearance:globalThis.WispAppearance,readFileSync,path,ROOT:root,SIGNATURE_FONT_DATA_URLS:{},escapeHtml:v=>String(v||'').replaceAll('&','&amp;').replaceAll('<','&lt;'),
  });
  const preview={pages:[{isCover:true,blocks:[{kind:'cover-firm',text:'Hamilton & Cole Advisory'}]},{title:'Scope',blocks:[{kind:'heading',text:'Scope'},...Array.from({length:100},()=>({kind:'paragraph',text:'Our firm protects client information through documented access controls, secure backups, and regular security reviews. This policy applies to all members of the firm.'}))]}]};
  const html=render(preview,[],'',a);
  writeFileSync('tmp/pdfs/appearance/rendered.html',html);
  const proof=await browser.newPage();
  await proof.setContent(html);await proof.evaluate(()=>document.fonts.ready);
  await proof.pdf({path:'tmp/pdfs/appearance/proof.pdf',printBackground:true,preferCSSPageSize:true});
  await proof.setViewportSize({width:816,height:1056});
  await proof.screenshot({path:'tmp/pdfs/appearance/cover-html.png'});
  console.log(JSON.stringify({keyboard:true,scaledDrag:true,logoToggle:true,mobileOverflow:false,appearance:a.logoName,x:a.x,y:a.y}));
}finally{await browser.close();server.close();}
