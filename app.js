(()=>{
const $=s=>document.querySelector(s);
const day=new Date();
const dateKey=[day.getFullYear(),String(day.getMonth()+1).padStart(2,'0'),String(day.getDate()).padStart(2,'0')].join('-');
const weekKey=(()=>{let d=new Date(day);d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return d.toISOString().slice(0,10)})();
const affirmations=[
["You do not need to know everything today. You only need to stay curious and keep building.","Your future is built through small, repeatable steps."],
["You are allowed to be a beginner and still be ambitious.","Every problem you work through is practice for the engineer you are becoming."],
["Consistency is more powerful than a perfect plan.","A focused 20 minutes can move you forward."],
["Your skills grow every time you try, test, and improve.","You are building proof of what you can do."],
["You do not have to compare your chapter one to someone else's chapter ten.","Keep your pace. Keep learning."],
["The goal is progress you can explain and demonstrate.","One small win is still a real win."],
["You are becoming someone who can solve harder problems.","Stay patient with the process."]
];
const challenges=[
["SQL thinking","Write a query that groups orders by customer and calculates each customer's total spend.","Try GROUP BY with SUM()."],
["Python practice","Write a function that takes a list of numbers and returns the average.","Test it with an empty list and a one-item list."],
["Data literacy","Explain the difference between correlation and causation in your own words.","Think of a real-world example."],
["BI storytelling","Find a chart online and write one sentence explaining the main takeaway.","Ask whether the chart supports that conclusion."],
["Git habit","Learn what a commit does and why a useful commit message matters.","Try a small commit in a practice repository."],
["AI awareness","Compare an AI-generated answer with an official technical source.","Look for accuracy, date, and limitations."],
["Career insight","Open a data internship posting and identify its three most repeated skills.","Save the role and note one skill gap."]
];
const weekday=day.getDay();
const plans={
0:[["Weekly reset","Review saved roles and choose next week's priorities",10,10],["Pick next skill sprint","Choose Monday's SQL topic and Thursday's Python task",5,10],["Career scout","Check one promising internship or employer page",10,15]],
1:[["SQL skill sprint","Practice WHERE, ORDER BY, JOIN, or GROUP BY; write 3 queries",20,20],["Save your proof","Keep one query or a short learning note",5,10],["Career scout","Find one realistic Summer 2027 role",10,15]],
2:[["Career scout","Find 1–2 realistic internship roles and verify employer details",15,15],["Save a role","Record requirements, location, deadline, and link",5,10],["Skill gap note","Write down one repeated skill from job descriptions",5,10]],
3:[["Career move","Tailor 1–2 resume bullets to a suitable role",20,20],["Application or next step","Apply if it is a good match, or note what to improve",10,20],["Update your pipeline","Record status and follow-up date",5,10]],
4:[["Python / data sprint","Clean a tiny dataset, write a function, debug, or add a test",20,20],["Save your proof","Save a script, test, chart, or explanation",5,10],["Explain your code","Write two sentences explaining what your code does",5,10]],
5:[["Career scout","Check new roles and deadlines on employer career pages",15,15],["Professional awareness","Note two skills that appear in a job description",5,10],["Network (optional)","Send one thoughtful connection or follow-up message",5,10]],
6:[["Portfolio boss battle","Polish a project, README, dashboard, or interview example",30,25],["Career move","Submit one strong application if a suitable role is open",10,20],["Save an accomplishment","Write one resume-ready result or lesson",5,10]]
};
const stateKey='levelup-career-v1';
let state=JSON.parse(localStorage.getItem(stateKey)||'{}');
if(state.date!==dateKey){state={...state,date:dateKey,done:[],challengeDone:false,week:state.week||weekKey,weekly:{}}}
if(state.week!==weekKey){state.week=weekKey;state.weekly={}}
state.xp=Number.isFinite(state.xp)?state.xp:240;state.done=state.done||[];state.weekly=state.weekly||{};
const save=()=>localStorage.setItem(stateKey,JSON.stringify(state));
const plan=plans[weekday];
$('#today-label').textContent=day.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'}).toUpperCase()+' · YOUR DAILY QUEST';
const a=affirmations[day.getDay()];$('#affirmation').textContent='“'+a[0]+'”';$('#affirmation-sub').textContent=a[1];
const c=challenges[(Math.floor((Date.UTC(day.getFullYear(),day.getMonth(),day.getDate())/86400000))%challenges.length)];$('#challenge-title').textContent=c[0];$('#challenge-desc').textContent=c[1]+' '+c[2];
if(state.challengeDone){$('#challenge-done').textContent='Explored ✓';$('#challenge-done').disabled=true}
$('#challenge-done').addEventListener('click',()=>{state.challengeDone=true;state.xp+=10;$('#challenge-done').textContent='Explored ✓';$('#challenge-done').disabled=true;save();render()});
const weeklyTargets=[['Skill sprints',2],['Career scouts',3],['Career moves',2],['Proof logs',3]];
function render(){
 const quests=$('#quests');quests.innerHTML='';
 plan.forEach((q,i)=>{let item=document.createElement('div');item.className='quest';let done=state.done.includes(i);item.innerHTML=`<button class="check ${done?'done':''}" aria-label="Complete quest">${done?'✓':''}</button><div style="flex:1;min-width:0"><div class="quest-title">${q[0]}</div><div class="quest-desc">${q[1]} · ${q[2]} min</div></div><span class="xp">+${q[3]} XP</span>`;item.querySelector('button').addEventListener('click',()=>{if(state.done.includes(i))return;state.done.push(i);state.xp+=q[3];const title=q[0].toLowerCase();
  const category=/sprint/.test(title)?'skill':(/scout|save a role/.test(title)?'scout':(/career move|application|network|portfolio/.test(title)?'move':'proof'));
  state.weekly[category]=(state.weekly[category]||0)+1;save();render()});quests.append(item)});
 const level=3+Math.floor(Math.max(0,state.xp-240)/400),within=(state.xp-240)%400;
 $('#xp-label').textContent=state.xp+' XP';$('#xp-bar').style.width=(within/400*100)+'%';$('#xp-next').textContent=(400-within)+' XP until your next level';$('#level').textContent=level;$('#profile-level').textContent=level;$('#profile-xp').textContent=state.xp;$('#done-count').textContent=state.done.length+'/'+plan.length;$('#profile-complete').textContent=state.done.length;
 let count=Object.values(state.weekly).reduce((x,y)=>x+y,0);$('#week-count').textContent=count;
 let completed=weeklyTargets.filter(([name,target])=>{
  const key=name==='Skill sprints'?'skill':name==='Career scouts'?'scout':name==='Career moves'?'move':'proof';
  return (state.weekly[key]||0)>=target;
 }).length;
 $('#weekly-progress').textContent=completed+' / 4 goals';
 $('#weekly-bar').style.width=(completed/4*100)+'%';
}
render();
const topics=[['AI & machine learning','https://news.google.com/search?q=AI+machine+learning+research+industry&hl=en-US&gl=US&ceid=US:en'],['Data & analytics','https://news.google.com/search?q=data+analytics+engineering+SQL+BI&hl=en-US&gl=US&ceid=US:en'],['Software engineering','https://news.google.com/search?q=software+engineering+developer+tools+cloud&hl=en-US&gl=US&ceid=US:en'],['Tech hiring & internships','https://news.google.com/search?q=data+analytics+internship+skills+hiring+trends&hl=en-US&gl=US&ceid=US:en']];
topics.forEach(([name,url])=>{let a=document.createElement('a');a.className='source';a.href=url;a.target='_blank';a.rel='noopener';a.innerHTML=`<b>${name} ↗</b><small>Open current coverage</small>`;$('#topic-links').append(a)});
document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===btn));document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===btn.dataset.tab));window.scrollTo({top:0,behavior:'smooth'})}));
$('#reset-data').addEventListener('click',()=>{if(confirm('Reset XP and quest progress on this device?')){localStorage.removeItem(stateKey);location.reload()}});
save();
})();
if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(()=>{});
