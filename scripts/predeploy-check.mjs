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

const scripts=[...html.matchAll(/<script(?:[^>]*)>([\\s\\S]*?)<\\/script>/gi)].map(m=>m[1]).filter(s=>s.trim());
for(let i=0;i<scripts.length;i++) new Function(scripts[i]);
assert.match(html,/window\.SUPABASE_CONFIG\s*=\s*\{/);
assert.match(html,/sb\.auth\.signUp\(/);
assert.match(html,/sb\.auth\.signInWithPassword\(/);
assert.match(html,/ensure_tucker_founder/);
assert.match(html,/request_rescue_capacity/);
assert.doesNotMatch(html,/Local demo workspace|horseRescuePlatform_v3|designer-access/);
const sw=fs.readFileSync("sw.js","utf8");
assert.match(sw,/url\.origin!==self\.location\.origin/);
assert.doesNotMatch(sw,/caches\.match\(e\.request\).*supabase/);
console.log(`Predeploy checks passed: ${scripts.length} inline scripts, ${ids.length} unique IDs, required assets present.`);