import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {decks,ledger,afford,mirrorCard,options,result,decode,comparison,shareURL,dailyDeck} from './docs/engine.js';
let paths=0,invalid=0;const outcomes=[];
for(let d=0;d<3;d++)for(let n=0;n<81;n++){
 let z=n;const a=Array.from({length:4},()=>{const v=['H','A','D'][z%3];z=Math.floor(z/3);return v;});
 let l;try{l=ledger(d,a);}catch{invalid++;continue;}
 assert(l.left>=0&&l.left<=100);
 assert.equal(l.human+l.ai+l.diy,4);
 for(let i=0;i<4;i++)assert(afford(d,a.slice(0,i),a[i]));
 const idx=mirrorCard(d,a);assert(idx>=0&&idx<4);assert(afford(d,a.slice(0,idx),'H'),'Personal twist must never blame an unaffordable decision');
 for(const f of options(d,a)){
  const r=result(d,a,f);assert.equal(r.changed,a[idx]!==f);
  assert.deepEqual(decode('#v2='+r.code),r);
  assert.equal(comparison(r,r).count,4);
  const u=shareURL('https://example.test/game/?utm_source=test#old',r);
  assert.equal(new URL(u).search,'');assert.deepEqual(decode(new URL(u).hash),r);
  outcomes.push(r);paths++;
 }
}
for(const r of outcomes)for(const s of outcomes.filter(x=>x.deck===r.deck)){
 const c=comparison(r,s);assert.equal(c.count,r.answers.filter((x,i)=>x===s.answers[i]).length);
 assert.equal(c.count,comparison(s,r).count);
}
for(const h of ['','#v2=0HHHHH','#v2=0AAAAD','#v2=9AAAAA','#v2=0AAAAA<script>','#v2=0AAA','#v2=0aaaah','#v2=0AAAAHH','#v2=0AAAAH&x=1'])assert.equal(decode(h),null);
assert.equal(ledger(0,['A','A','A','A']).left,90);
assert.equal(ledger(0,['D','D','D','D']).left,100);
assert.throws(()=>ledger(0,['H','H','H','H']));
assert(!afford(0,['H','H','H'],'H'));
assert.equal(mirrorCard(0,['H','H','H','A']),0,'Forced AI choice must not be used as an inconsistency trap');
assert.equal(dailyDeck(new Date('2026-10-19T23:59:59Z')),dailyDeck(new Date('2026-10-19T00:00:00Z')));
assert.notEqual(dailyDeck(new Date('2026-10-19T23:59:59Z')),dailyDeck(new Date('2026-10-20T00:00:00Z')));
for(const file of ['index.html','studio.html','v1/index.html']){
 const html=readFileSync('docs/'+file,'utf8'),dir='docs/'+(file.includes('/')?'v1/':'');
 for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
  if(/^(https?:|\.\/)/.test(m[1]))continue;
  assert(existsSync(dir+m[1]),'Missing local asset '+m[1]);
 }
}
console.log('PASS: '+paths+' valid final paths; '+invalid+' over-budget paths rejected; all same-deck pair comparisons; affordable mirror selection; daily rotation; challenge validation and local assets.');

