import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
const source=readFileSync(new URL("../app.js",import.meta.url),"utf8");
const functions=source.slice(source.indexOf("async function refreshActivityLogs("),source.indexOf("function formatCompanyAddress("));
function fixture(overrides={}) {
  const feed={items:[],total:0,page:0,pageSize:10,status:"idle",error:"",asOf:null,exporting:false};
  const state={activityFeed:feed,authUser:{id:"owner"},screen:"settings",settingsTab:"logs"};
  const context={state,Blob,Date,console,queueMicrotask:()=>{},render:()=>{},escapeHtml:v=>String(v??"").replaceAll("<","&lt;").replaceAll(">","&gt;"),
    listFirmActivityLogs:async()=>({items:[],total:0,asOf:"2026-10-02T12:00:00Z"}),...overrides};
  vm.createContext(context);vm.runInContext(functions,context);return context;
}
test("activity tab distinguishes loading, empty, error and populated states",()=>{
  const f=fixture();assert.match(f.settingsActivityLogsTab(),/Loading activity/);
  f.state.activityFeed.status="ready";assert.match(f.settingsActivityLogsTab(),/No recorded activity yet/);
  f.state.activityFeed.status="error";f.state.activityFeed.error="Permission denied";assert.match(f.settingsActivityLogsTab(),/Permission denied/);assert.match(f.settingsActivityLogsTab(),/>Retry</);
  f.state.activityFeed.status="ready";f.state.activityFeed.total=1;
  f.state.activityFeed.items=[{activity:"Document created",user:"<script>",details:"safe",date:"2026-10-02T12:00:00Z"}];
  const markup=f.settingsActivityLogsTab();assert.match(markup,/Document created/);assert.doesNotMatch(markup,/<script>/);assert.doesNotMatch(markup,/Build-stage/);
});
test("server page requests use offset and snapshot; invalid last pages are clamped",async()=>{
  const calls=[];const f=fixture({listFirmActivityLogs:async args=>{calls.push(args);return {items:[],total:11,asOf:"snapshot"};}});
  f.state.activityFeed.page=5;await f.refreshActivityLogs();
  assert.equal(calls[0].offset,50);assert.equal(calls[1].offset,10);assert.equal(calls[1].before,"snapshot");
  assert.equal(f.state.activityFeed.page,1);assert.equal(f.state.activityFeed.status,"ready");
});
test("failed activity requests expose errors and allow retry",async()=>{
  const f=fixture({listFirmActivityLogs:async()=>{throw new Error("Denied");}});
  await f.refreshActivityLogs();assert.equal(f.state.activityFeed.status,"error");assert.equal(f.state.activityFeed.error,"Denied");
  f.listFirmActivityLogs=async()=>({items:[],total:0,asOf:"snapshot"});await f.refreshActivityLogs();assert.equal(f.state.activityFeed.status,"ready");
});
test("late results cannot populate a different user or firm",async()=>{
  let finish;const f=fixture({listFirmActivityLogs:()=>new Promise(resolve=>{finish=resolve;})});
  const pending=f.refreshActivityLogs();f.state.activityFeed={items:[],status:"idle"};f.state.authUser={id:"other"};
  finish({items:[{activity:"private"}],total:1,asOf:"snapshot"});await pending;
  assert.equal(f.state.activityFeed.items.length,0);assert.equal(f.state.activityFeed.status,"idle");
});
test("CSV cells quote embedded commas, quotes and neutralize spreadsheet formulas",()=>{
  const f=fixture();assert.equal(f.activityCsvCell('a,"b"'),'"a,""b"""');assert.equal(f.activityCsvCell("=HYPERLINK()"),'"\'=HYPERLINK()"');
  assert.equal(f.activityCsvCell(" +CMD"),'"\' +CMD"');assert.equal(f.activityCsvCell(null),'""');
});
test("CSV exports every server page with the same snapshot",async()=>{
  const requests=[];let csv;
  const f=fixture({listFirmActivityLogs:async args=>{
    requests.push(args);return {items:Array.from({length:args.offset?1:200},()=>({activity:"Saved",user:"Owner",details:"ok",date:"2026-10-02"})),total:201,asOf:"snapshot"};
  },URL:{createObjectURL:blob=>{csv=blob;return "blob:test";},revokeObjectURL:()=>{}},document:{createElement:()=>({click(){},remove(){}}),body:{appendChild(){}}},setTimeout:()=>{},showToast:()=>{}});
  Object.assign(f.state.activityFeed,{status:"ready",total:201,asOf:"snapshot"});
  await f.downloadSettingsActivityLogs();assert.equal(requests.length,2);assert.equal(requests[1].offset,200);assert.equal(requests[1].before,"snapshot");
  assert.equal((await csv.text()).split("\r\n").length,202);assert.equal(f.state.activityFeed.exporting,false);
});
test("activity RPCs require firm permission and prohibit public audit writes",()=>{
  const sql=readFileSync(new URL("../supabase/migrations/20261002120000_server_owned_activity_feed.sql",import.meta.url),"utf8");
  assert.match(sql,/private.has_firm_permission\(p_firm_id,'settings_logs'\)/);assert.match(sql,/set search_path = ''/);
  assert.match(sql,/revoke all on function public.list_firm_activity/);assert.match(sql,/v_limit integer := greatest\(1, least/);
  assert.match(sql,/on conflict do nothing/);assert.match(sql,/metadata->>'session_id'/);
});
