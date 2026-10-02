import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { prepareRenderIdentity, reuseOrRenderPdf } from '../scripts/lib/wisp-render-cache.mjs';

const firmId='11111111-1111-4111-8111-111111111111';
const otherFirm='22222222-2222-4222-8222-222222222222';
const attachment={storagePath:`${firmId}/wisp/project/attachments/policy.pdf`,name:'Policy.pdf',order:1};
const payload={firmId,generatedAt:'first',mergeFields:{companyName:'Example'},blocks:{scope:'Original'},appearance:{headingFont:'lora'},attachments:[attachment]};
const pdf=Buffer.from('%PDF-1.7\nserver-rendered-bytes');
const identity=(overrides={})=>prepareRenderIdentity({payload,firmId,revision:'renderer-v1',readAttachment:async()=>pdf,...overrides});

test('same reviewed PDF is reused byte-for-byte at finalization without a render',async()=>{
  const cache=new Map(); let renders=0;
  const opts={identity:await identity(),readCache:async path=>cache.get(path),writeCache:async(path,bytes)=>cache.set(path,bytes)&&bytes,render:async()=>{renders++;return pdf;}};
  const review=await reuseOrRenderPdf(opts);
  const final=await reuseOrRenderPdf({...opts,identity:await identity({payload:{...payload,generatedAt:'later'}})});
  assert.equal(review.reused,false); assert.equal(final.reused,true); assert.equal(renders,1); assert.deepEqual(final.bytes,review.bytes);
});

test('object key order and generatedAt do not cause a new PDF',async()=>{
  const a=await identity(); const b=await identity({payload:{attachments:[attachment],appearance:{headingFont:'lora'},blocks:{scope:'Original'},mergeFields:{companyName:'Example'},generatedAt:'later',firmId}});
  assert.equal(a.fingerprint,b.fingerprint);
});

test('all render changes invalidate the reviewed artifact',async()=>{
  const base=await identity();
  for(const changes of [
    {payload:{...payload,blocks:{scope:'Changed'}}},
    {payload:{...payload,mergeFields:{companyName:'New name'}}},
    {payload:{...payload,appearance:{headingFont:'inter'}}},
    {payload:{...payload,appearance:{logoData:'different-logo'}}},
    {payload:{...payload,attachments:[]}},
    {payload:{...payload,attachments:[{...attachment,order:2}]}},
    {readAttachment:async()=>Buffer.from('%PDF-1.7\nchanged attachment bytes')},
    {signatures:[{signer_name:'Signer',signature_data:'New signature'}]},
    {coverLogo:'new-company-logo'},
    {revision:'renderer-v2'},
  ]) assert.notEqual((await identity(changes)).fingerprint,base.fingerprint);
});

test('attachment order, cross-firm identity, and selected appearance change the key',async()=>{
  const second={...attachment,storagePath:`${firmId}/wisp/project/attachments/second.pdf`};
  const a=await identity({payload:{...payload,attachments:[attachment,second]}});
  const b=await identity({payload:{...payload,attachments:[second,attachment]}});
  assert.notEqual(a.fingerprint,b.fingerprint);
  const c=await identity({firmId:otherFirm,payload:{...payload,firmId:otherFirm,attachments:[]}});
  assert.ok(c.path.startsWith(otherFirm+'/')); assert.notEqual(c.fingerprint,(await identity({payload:{...payload,attachments:[]}})).fingerprint);
});

test('cross-firm paths, traversal, missing files, and non-PDF bytes never reach cache',async()=>{
  for(const storagePath of [`${otherFirm}/wisp/project/attachments/a.pdf`,`${firmId}/wisp/../attachments/a.pdf`,'',`${firmId}/wisp/version/final.pdf`]) {
    let reads=0;
    await assert.rejects(identity({payload:{...payload,attachments:[{storagePath}]},readAttachment:async()=>{reads++;return pdf;}}),/attachment path/); assert.equal(reads,0);
  }
  await assert.rejects(identity({readAttachment:async()=>{throw new Error('Access denied');}}),/Access denied/);
  await assert.rejects(identity({readAttachment:async()=>Buffer.from('not a PDF')}),/Invalid PDF/);
});

test('fresh attachment authorization runs before reuse, with no cached-byte fallback',async()=>{
  let reads=0;
  await identity({readAttachment:async()=>{reads++;return pdf;}});
  await identity({readAttachment:async()=>{reads++;return pdf;}});
  assert.equal(reads,2);
});

test('missing cache renders safely; corrupt cache and storage failures do not masquerade as success',async()=>{
  const id=await identity(); let renders=0;
  const opts={identity:id,render:async()=>{renders++;return pdf;},readCache:async()=>null,writeCache:async()=>pdf};
  assert.equal((await reuseOrRenderPdf(opts)).reused,false);
  await assert.rejects(reuseOrRenderPdf({...opts,readCache:async()=>Buffer.from('corrupt')}),/stored reviewed PDF/);
  assert.equal(renders,1);
  await assert.rejects(reuseOrRenderPdf({...opts,writeCache:async()=>{throw new Error('Storage down');}}),/Storage down/);
});

test('concurrent insert returns the stored winner so review and finalize use identical bytes',async()=>{
  const winner=Buffer.from('%PDF-1.7\nfirst writer');
  const result=await reuseOrRenderPdf({identity:await identity(),readCache:async()=>null,writeCache:async()=>winner,render:async()=>pdf});
  assert.deepEqual(result.bytes,winner);
});

test('cache is private and explicitly denied to browser and anonymous roles',()=>{
  const migration=readFileSync(new URL('../supabase/migrations/20261002080000_server_only_wisp_render_cache.sql',import.meta.url),'utf8');
  assert.match(migration,/false, 52428800/); assert.match(migration,/as restrictive for all to anon, authenticated/);
  assert.match(migration,/using \(bucket_id <> 'wisp-render-cache'\)/);
  assert.match(migration,/with check \(bucket_id <> 'wisp-render-cache'\)/);
});
