export const VERSION=2,BUDGET=100;
const c=(id,title,story,human,ai,diy,role,deliverable)=>({id,title,story,human,ai,diy,role,deliverable});
export const decks=[
{name:'The launch',cards:[
c('logo','Your idea needs a face.','A logo for your tiny new business.',45,5,'Make it yourself · 2 hours','designer','a business logo'),
c('voice','Give it a voice.','A 15-second voiceover for your launch video.',30,3,'Record it yourself · 45 min','voice actor','a video voiceover'),
c('words','Make it personal.','A thank-you poem for the friend who helped you start.',20,0,'Write it yourself · 30 min','writer','a personal poem'),
c('music','Set the mood.','A licensed track for your first promo video.',35,2,'Make it yourself · 3 hours','musician','a music track')]},
{name:'The big day',cards:[
c('portrait','A gift they’ll keep.','A custom portrait for your best friend’s birthday.',40,4,'Draw it yourself · 3 hours','illustrator','a birthday portrait'),
c('invite','You’re all invited.','A digital invitation for the surprise party.',25,0,'Design it yourself · 1 hour','designer','a party invitation'),
c('song','Their very own song.','A short birthday song with a personal message.',45,5,'Write it yourself · 2 hours','songwriter','a birthday song'),
c('speech','Find the right words.','A funny, heartfelt toast for the big night.',30,0,'Write it yourself · 45 min','writer','a party toast')]},
{name:'The side project',cards:[
c('cover','Make them look.','Cover art for the first episode of your podcast.',35,3,'Draw it yourself · 2 hours','illustrator','podcast cover art'),
c('intro','Make an entrance.','A custom music sting for your podcast intro.',40,4,'Make it yourself · 2 hours','musician','a podcast intro'),
c('subtitles','Let more people in.','Accurate English subtitles for a short clip.',25,2,'Translate it yourself · 1 hour','translator','English subtitles'),
c('trailer','Tell your story.','A voiceover for the trailer of your first episode.',35,3,'Record it yourself · 45 min','voice actor','a trailer voiceover')]}];
export const labels={H:'Human',A:'AI',D:'DIY'};
export function validDeck(d){return Number.isInteger(d)&&d>=0&&d<decks.length;}
export function ledger(deck,answers){
 if(!validDeck(deck)||!Array.isArray(answers)||answers.length>4)throw Error('Invalid play');
 let spent=0,aiSavings=0;
 answers.forEach((a,i)=>{if(!['H','A','D'].includes(a))throw Error('Invalid choice');const c=decks[deck].cards[i];spent+=a==='H'?c.human:a==='A'?c.ai:0;if(a==='A')aiSavings+=c.human-c.ai;});
 if(spent>BUDGET)throw Error('Over budget');
 return {spent,left:BUDGET-spent,aiSavings,human:answers.filter(a=>a==='H').length,ai:answers.filter(a=>a==='A').length,diy:answers.filter(a=>a==='D').length};
}
export function afford(deck,answers,choice){try{ledger(deck,[...answers,choice]);return answers.length<4;}catch{return false;}}
export function mirrorCard(deck,answers){
 if(answers.length!==4)throw Error('Incomplete play');ledger(deck,answers);
 const voluntaryAI=answers.some((a,i)=>a==='A'&&afford(deck,answers.slice(0,i),'H'));
 const preferred=voluntaryAI?'A':answers.includes('H')?'H':'D';
 return decks[deck].cards.reduce((best,c,i)=>answers[i]===preferred&&(preferred!=='A'||afford(deck,answers.slice(0,i),'H'))&&(best<0||c.human-c.ai>decks[deck].cards[best].human-decks[deck].cards[best].ai)?i:best,-1);
}
export function options(deck,answers){const original=answers[mirrorCard(deck,answers)];return original==='H'?['H','A']:[original,'H'];}
export function result(deck,answers,final){
 const l=ledger(deck,answers),index=mirrorCard(deck,answers),original=answers[index];
 if(!options(deck,answers).includes(final))throw Error('Invalid final');
 const changed=original!==final;
 const title=changed?(final==='H'?'Different when it’s you.':'You gave the saving away.'):(original==='D'?'I’ll do it myself.':'Same choice. My invoice too.');
 return {...l,deck,answers:[...answers],final,index,original,changed,title,code:String(deck)+answers.join('')+final};
}
export function decode(hash){
 const match=/^#v2=([0-2])([HAD]{4})([HAD])$/.exec(hash);if(!match)return null;
 try{return result(Number(match[1]),match[2].split(''),match[3]);}catch{return null;}
}
export function comparison(a,b){
 if(a.deck!==b.deck)throw Error('Different dilemmas');
 const same=a.answers.map((x,i)=>x===b.answers[i]),sameFinal=a.final===b.final;
 return {same,sameFinal,count:same.filter(Boolean).length,sharedMirror:a.index===b.index};
}
export function shareURL(base,r){const u=new URL(base);u.search='';u.hash='v2='+r.code;return u.href;}
export function dailyDeck(date=new Date()){return Math.floor(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate())/86400000)%decks.length;}

