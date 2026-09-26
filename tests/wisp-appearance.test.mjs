import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import '../wisp-appearance.js';
const design = globalThis.WispAppearance;
const source=readFileSync(new URL('../scripts/wisp_merge_service.mjs',import.meta.url),'utf8');
const render=vm.runInNewContext(source.slice(source.indexOf('function buildDownloadPreviewHtml('),source.indexOf('function runMerge('))+'\nbuildDownloadPreviewHtml',{
  WispAppearance:design,readFileSync,path,ROOT:process.cwd(),SIGNATURE_FONT_DATA_URLS:{},
  escapeHtml:v=>String(v||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;'),
});
const preview={pages:[{isCover:true,blocks:[{kind:'cover-firm',text:'Example & Partners'}]},{title:'Scope',blocks:[{kind:'heading',text:'Scope'},{kind:'paragraph',text:'Security policy content.'}]}]};
test('appearance round-trips through the existing string-valued draft contract',()=>{
  const value=design.normalize({headingFont:'lora',bodyFont:'lato',x:430,y:600,topBarColor:'#008877',logoEnabled:false});
  assert.deepEqual(design.normalize(JSON.parse(JSON.stringify(value))),value);
  assert.equal(value.logoEnabled,false);
});
test('PDF renderer uses the same cover markup, geometry and font files as the editor',()=>{
  const value=design.normalize({headingFont:'lora',bodyFont:'lato',x:410,y:540});
  const html=render(preview,[], '',value);
  assert.ok(html.includes(design.coverHtml(value,'Example & Partners')));
  assert.ok(html.includes(design.coverCss(value)));
  assert.match(html,/data:font\/woff2;base64,/);
  assert.match(html,/Example &amp; Partners/);
  assert.ok(html.includes(design.documentCss(value)));
});
test('unsafe appearance input cannot inject markup, styles or remote asset URLs',()=>{
  const a=design.normalize({headingFont:'bad";}',bodyColor:'red;}body{display:none}',logoData:'https://example.com/secret',x:Infinity,y:-1000,width:100000});
  assert.equal(a.headingFont,design.defaults.headingFont);
  assert.equal(a.bodyColor,design.defaults.bodyColor);
  assert.equal(a.logoData,'');
  assert.ok(a.x-a.width/2>=18 && a.x+a.width/2<=594);
  assert.ok(a.y-a.height/2>=36);
  assert.doesNotMatch(design.coverHtml(a,'<img src=x onerror=alert(1)>'),/<img src=x/);
});
test('all offered font families have regular and bold WOFF2 assets and licenses',()=>{
  assert.equal(design.fonts.length,12);
  for(const [id] of design.fonts){
    for(const weight of [400,700]) assert.equal(readFileSync(`assets/fonts/wisp/${id}-${weight}.woff2`).subarray(0,4).toString(),'wOF2');
    assert.ok(readFileSync(`assets/fonts/wisp/${id}-LICENSE.txt`,'utf8').length>100);
  }
});
test('disabling a logo removes it from cover output without losing its saved asset',()=>{
  const logoData='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jmSkAAAAASUVORK5CYII=';
  assert.match(design.coverHtml({logoData},'Example'),/<img class="wisp-cover-logo"/);
  const a=design.normalize({logoData,logoEnabled:false});
  assert.equal(a.logoData,logoData);
  assert.doesNotMatch(design.coverHtml(a,'Example'),/<img /);
});
