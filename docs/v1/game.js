export const rounds = [
  {title:'A gift with a face.',category:'01 / THE PORTRAIT',item:'Birthday portrait',human:80,ai:3,symbol:'portrait',story:'Your best friend turns 30. You want a custom portrait of the two of you.',humanText:'Commission an illustrator.',aiText:'Generate a portrait.',question:'Does it matter who made the gift?'},
  {title:'A voice without a person.',category:'02 / THE VOICE',item:'Video voiceover',human:240,ai:12,symbol:'voice',story:'Your side project needs a 30-second voiceover. Both auditions sound right.',humanText:'Book a voice actor.',aiText:'License a synthetic voice.',question:'If you cannot hear the difference, what are you paying for?'},
  {title:'Just three dollars.',category:'03 / THE SOUNDTRACK',item:'Original music',human:12,ai:9,symbol:'music',story:'You need a music track for a video. This time, the price gap is tiny.',humanText:'License an indie artist’s track.',aiText:'License an AI-made track.',question:'How small does the gap have to get?'},
  {title:'Your dream. Their work.',category:'04 / THE LOGO',item:'Business logo',human:400,ai:20,symbol:'logo',story:'You are launching a tiny business. Money is tight. You need a logo.',humanText:'Hire an independent designer.',aiText:'Use an AI design service.',question:'Does supporting someone else come before starting yourself?'},
  {title:'Lost in translation?',category:'05 / THE SUBTITLES',item:'Video subtitles',human:18,ai:6,symbol:'words',story:'Your video needs English subtitles. In this scenario, both versions are accurate.',humanText:'Pay a translator.',aiText:'Use automatic translation.',question:'Does a person need to do every task?'},
  {title:'The words “I do.”',category:'06 / THE VOWS',item:'Wedding vows',human:90,ai:0,symbol:'heart',story:'You know what you feel. You cannot find the words. You want help writing your vows.',humanText:'Work with a human writer.',aiText:'Ask an AI writing assistant.',question:'Is the feeling yours if the words are not?'}
];
export function summarize(answers,mirror){
  if(!Array.isArray(answers)||answers.length!==6||!answers.every(x=>['H','A','P'].includes(x))||!['H','A'].includes(mirror))throw Error('Invalid decisions');
  const human=answers.filter(x=>x==='H').length, ai=answers.filter(x=>x==='A').length, passed=6-human-ai;
  const spent=rounds.reduce((s,r,i)=>s+(answers[i]==='H'?r.human:answers[i]==='A'?r.ai:0),0);
  const saved=rounds.reduce((s,r,i)=>s+(answers[i]==='A'?r.human-r.ai:0),0);
  let title,description;
  if(mirror==='H'&&ai>0){title='Different when it’s you.';description=`You chose AI ${ai} time${ai===1?'':'s'}. When your own work was on the line, you chose the human. What changed: the principle, or the perspective?`;}
  else if(mirror==='A'&&human>0){title='Generous to others. Tough on yourself.';description=`You paid for people ${human} time${human===1?'':'s'}, but accepted the cheaper option when it was your work. Is that consistency, realism, or being harder on yourself?`;}
  else if(mirror==='H'&&human>0){title='People, even at a price.';description='You chose a person every time you bought. You asked for the same when it was your turn. What would make that sustainable?';}
  else if(mirror==='A'&&ai>0){title='Same rules. Even for you.';description='You chose the cheaper technology every time you bought, then applied that rule to your own work. Where would you draw a limit?';}
  else {title='You refused the checkout.';description='You passed on every purchase. When your own work appeared, you still had a decision to make. Is opting out an answer everyone can afford?';}
  return {human,ai,passed,spent,saved,title,description,mirror,code:answers.join('')+mirror};
}
export function decodeChallenge(hash){const match=/^#c=([HAP]{6}[HA])$/.exec(hash);return match?{answers:match[1].slice(0,6).split(''),mirror:match[1][6]}:null;}
export function compare(a,b){return a.reduce((n,x,i)=>n+(x===b[i]?1:0),0);}
