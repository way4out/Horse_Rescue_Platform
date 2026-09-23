import fs from "node:fs";
import assert from "node:assert/strict";

const html=fs.readFileSync("index.html","utf8");
const required=["index.html","manifest.webmanifest","icon.svg","supabase-config.js","sw.js"];
for(const file of required) assert.ok(fs.existsSync(file),`Missing required file: ${file}`);

const ids=[...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]);
const counts=new Map();
for(const id of ids) counts.set(id,(counts.get(id)||0)+1);
const duplicates=[...counts.entries()].filter(([,n])=>n>1).map(([id,n])=>`${id} (${n})`);
assert.equal(duplicates.length,0,`Duplicate HTML IDs: ${duplicates.join(", ")}`);

const scripts=[];
let cursor=0;
while(true){
  const start=html.indexOf("<script",cursor);
  if(start<0)break;
  const openEnd=html.indexOf(">",start);
  if(openEnd<0)throw new Error("Malformed script tag");
  const end=html.indexOf("</script>",openEnd+1);
  if(end<0)throw new Error("Unclosed script tag");
  const body=html.slice(openEnd+1,end);
  if(body.trim())scripts.push(body);
  cursor=end+9;
}
for(let i=0;i<scripts.length;i++) new Function(scripts[i]);

const config=fs.readFileSync("supabase-config.js","utf8");
assert.match(config,/window\.SUPABASE_CONFIG\s*=\s*\{/);
assert.match(html,/sb\.auth\.signUp\(/);
assert.match(html,/sb\.auth\.signInWithPassword\(/);
assert.match(html,/ensure_tucker_founder/);
assert.match(html,/request_rescue_capacity/);
assert.match(html,/version:"pass-3"/);
assert.match(html,/publicContactRouting:false/);

const integrationMarkers=[
  "Emergency / Animal Response",
  "Rehome / Surrender Assistance",
  "Foster / Adoption Interest",
  "Sponsorship / Direct Support",
  "Transport / Field Response",
  "Volunteer / Professional / Partner Capacity"
];
for(const marker of integrationMarkers) assert.ok(html.includes(marker),`Missing integration marker: ${marker}`);

assert.doesNotMatch(html,/DIRECT CONTACT|Reach Tucker directly|way_out4@yahoo\.com|623[) -]?764[ -]?5641|4out_og/);
assert.doesNotMatch(html,/Local demo workspace|horseRescuePlatform_v3|designer-access/);

const sw=fs.readFileSync("sw.js","utf8");
assert.match(sw,/url\.origin!==self\.location\.origin/);
assert.match(sw,/const CACHE="rlar-v4"/);

console.log(`Predeploy checks passed: ${scripts.length} inline scripts, ${ids.length} HTML IDs, required assets present.`);