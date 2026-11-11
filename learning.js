(() => {
"use strict";
const $=id=>document.getElementById(id);
const STORE="mental_training_v1", LEGACY="tabuada_trainer_v1", THEME="tabuada_theme";
const clone=x=>JSON.parse(JSON.stringify(x)), rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const limit=(x,a,b)=>Math.max(a,Math.min(b,x));
const read=k=>{try{return JSON.parse(localStorage.getItem(k))}catch{return null}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const operations=[
{id:"add",name:"Adição",symbol:"+",group:"Operações",desc:"Somar com agilidade"},
{id:"sub",name:"Subtração",symbol:"−",group:"Operações",desc:"Diferenças e compensação"},
{id:"mul",name:"Multiplicação",symbol:"×",group:"Operações",desc:"Dobrar, decompor e multiplicar"},
{id:"div",name:"Divisão",symbol:"÷",group:"Operações",desc:"Quocientes e relações"},
{id:"percent",name:"Porcentagem",symbol:"%",group:"Aplicações",desc:"Calcular partes de um todo"},
{id:"fraction",name:"Frações",symbol:"½",group:"Aplicações",desc:"Equivalência e operações"},
{id:"round",name:"Arredondamento",symbol:"≈",group:"Aplicações",desc:"Aproximar com precisão"},
{id:"prime",name:"Números primos",symbol:"#",group:"Números",desc:"Reconhecer e identificar"},
{id:"power",name:"Potenciação",symbol:"x²",group:"Potências e raízes",desc:"Potências e quadrados"},
{id:"root",name:"Radiciação",symbol:"√",group:"Potências e raízes",desc:"Raízes exatas e estimadas"},
{id:"scientific",name:"Notação científica",symbol:"10ⁿ",group:"Aplicações",desc:"Potências de dez"}
];
const modes=[
{id:"learning",name:"Aprender",desc:"Dois acertos seguidos; sem limite de velocidade."},
{id:"intelligent",name:"Aleatório inteligente",desc:"Dificuldades voltam até três acertos consecutivos."},
{id:"sequential",name:"Sequencial",desc:"Cada questão aparece uma vez, em ordem."},
{id:"random",name:"Aleatório simples",desc:"Cada questão aparece uma vez, embaralhada."},
{id:"fluency",name:"Desafio de fluência",desc:"Todas as questões uma vez, com tempo e precisão."}
];
const M={
add:[
{id:"free",name:"Livre",guide:["Some do seu jeito.","Exemplo: 47 + 38 = 85.","Você pode descobrir outra maneira mais rápida."]},
{id:"split",name:"Decomposição",guide:["Separe dezenas e unidades.","47 + 38: 40 + 30 = 70; 7 + 8 = 15.","Junte 70 + 15 = 85."]},
{id:"comp",name:"Compensação",guide:["Aproxime um dos valores de uma dezena.","47 + 38: faça 47 + 40 = 87.","Devolva os 2 acrescentados: 85."]}
],
sub:[
{id:"free",name:"Livre",guide:["Encontre a diferença da forma que preferir.","83 − 47 = 36.","Teste atalhos com dezenas próximas."]},
{id:"comp",name:"Compensação",guide:["Arredonde o valor que será subtraído.","83 − 47: faça 83 − 50 = 33.","Some os 3 retirados a mais: 36."]},
{id:"bridge",name:"Completar a diferença",guide:["Pense quanto falta para chegar ao número maior.","De 47 até 50 faltam 3; até 80 mais 30; até 83 mais 3.","Some: 3 + 30 + 3 = 36."]}
],
mul:[
{id:"free",name:"Livre",guide:["Use a estratégia que for melhor para você.","7 × 8 = 56.","O importante é construir o resultado com segurança."]},
{id:"double",name:"Dobros sucessivos",guide:["Dobrar é multiplicar por 2.","7 × 2 = 14; dobre novamente: 28.","Mais um dobro: 56, então 7 × 8 = 56."]},
{id:"split",name:"Decomposição",guide:["Divida um dos fatores.","7 × 8 = 7 × (5 + 3).","35 + 21 = 56."]},
{id:"comp",name:"Compensação",guide:["Use um fator próximo e mais fácil.","7 × 8 = 7 × (10 − 2).","70 − 14 = 56."]}
],
div:[
{id:"free",name:"Livre",guide:["Divida construindo o resultado mentalmente.","156 ÷ 12 = 13.","Você pode usar multiplicações conhecidas."]},
{id:"inverse",name:"Operação inversa",guide:["Transforme a divisão em multiplicação.","Para 156 ÷ 12, pergunte: 12 vezes quanto dá 156?","12 × 10 = 120; mais 12 × 3 = 36; total 13."]},
{id:"split",name:"Decomposição",guide:["Divida o dividendo em partes múltiplas do divisor.","156 ÷ 12 = (120 + 36) ÷ 12.","10 + 3 = 13."]}
],
percent:[
{id:"free",name:"Livre",guide:["Encontre a porcentagem com sua própria estratégia.","15% de 240 = 36.","Pense nas partes do total."]},
{id:"anchors",name:"Percentuais de referência",guide:["Comece por 10%, 5%, 25% ou 50%.","10% de 240 = 24 e 5% = 12.","15% é 10% + 5%: resultado 36."]},
{id:"fraction",name:"Frações equivalentes",guide:["Use porcentagens que são frações simples.","25% = 1/4 e 50% = 1/2.","25% de 80 = 80 ÷ 4 = 20."]}
],
fraction:[
{id:"free",name:"Livre",guide:["Resolva a operação com frações.","1/2 + 1/4 = 3/4.","Use equivalência quando necessário."]},
{id:"common",name:"Denominador comum",guide:["Converta as parcelas para o mesmo denominador.","1/2 equivale a 2/4.","2/4 + 1/4 = 3/4."]}
],
round:[
{id:"free",name:"Livre",guide:["Observe a casa em que deve arredondar.","47 arredondado à dezena mais próxima é 50.","Veja se o algarismo seguinte é 5 ou mais."]},
{id:"place",name:"Valor posicional",guide:["Marque a casa que deve permanecer.","Em 347, arredondando à dezena, olhe a unidade: 7.","Como 7 ≥ 5, a dezena sobe: 350."]}
],
prime:[
{id:"free",name:"Livre",guide:["Identifique se o número é primo.","Um primo tem exatamente dois divisores positivos.","1 não é primo."]},
{id:"divisors",name:"Teste de divisores",guide:["Procure divisores primos até a raiz quadrada do número.","Para verificar 97, teste 2, 3, 5 e 7.","Nenhum divide 97: é primo."]}
],
power:[
{id:"free",name:"Livre",guide:["Calcule a potência usando relações conhecidas.","3⁴ = 81.","Lembre-se que potência significa multiplicações repetidas."]},
{id:"square",name:"Quadrados perfeitos",guide:["Treine especialmente os quadrados de inteiros.","14² = 14 × 14 = 196.","Conhecer quadrados ajuda a estimar raízes."]},
{id:"double",name:"Quadrados sucessivos",guide:["Separe o expoente quando possível.","3⁴ = (3²)².","9² = 81."]}
],
root:[
{id:"free",name:"Livre",guide:["Encontre ou estime a raiz.","√50 está entre 7 e 8.","Pois 7² = 49 e 8² = 64."]},
{id:"square",name:"Quadrados perfeitos",guide:["Use o conhecimento das potências.","√196 = 14, pois 14² = 196.","Treine no sentido direto e inverso."]},
{id:"estimate",name:"Estimativa de raízes",guide:["Localize os quadrados perfeitos vizinhos.","√50 está entre 7 e 8 e muito perto de 7.","Com uma casa decimal, √50 ≈ 7,1."]},
{id:"heron",name:"Método babilônico",guide:["Escolha um palpite x próximo da raiz.","Calcule a média entre x e N/x.","Para N = 50 e x = 7: (7 + 50/7)/2 ≈ 7,0714."]}
],
scientific:[
{id:"free",name:"Livre",guide:["Expresse números usando potências de dez.","0,00045 equivale a 4,5 × 10⁻⁴.","Conte as casas deslocadas pela vírgula."]},
{id:"shift",name:"Deslocamento decimal",guide:["Mova a vírgula até obter valor entre 1 e 10.","0,00045 vira 4,5, deslocando quatro casas.","O expoente é −4."]}
]
};
const defaultCfg={operation:"mul",method:"free",mode:"intelligent",level:1,tables:[3,4,6,7,8,9],exclude:[1,10],min:1,max:10,count:24,showTimer:false,autofocus:true,format:"minimal",rootType:"exact",primeType:"check"};
function normalize(c){c={...clone(defaultCfg),...(c&&typeof c==="object"?c:{})};if(!operations.some(x=>x.id===c.operation))c.operation="mul";if(!modes.some(x=>x.id===c.mode))c.mode="intelligent";if(!M[c.operation].some(x=>x.id===c.method))c.method="free";c.level=limit(Number(c.level)||1,1,3);c.count=limit(Number(c.count)||24,5,120);c.min=limit(Number(c.min)||1,0,20);c.max=limit(Number(c.max)||10,0,20);c.tables=Array.isArray(c.tables)?[...new Set(c.tables.map(Number).filter(x=>Number.isInteger(x)&&x>=0&&x<=12))]:clone(defaultCfg.tables);c.exclude=Array.isArray(c.exclude)?[...new Set(c.exclude.map(Number).filter(x=>Number.isInteger(x)&&x>=0&&x<=12))]:clone(defaultCfg.exclude);c.format=c.format==="all"?"all":"minimal";c.rootType=["exact","estimate"].includes(c.rootType)?c.rootType:"exact";c.primeType=["check","list"].includes(c.primeType)?c.primeType:"check";return c}
const old=read(LEGACY);let cfg=normalize(read(STORE)?.cfg||(old?{...defaultCfg,tables:old.tables,exclude:old.excludeFactors,min:old.minMul,max:old.maxMul,format:old.mode==="conventional"?"all":"minimal",showTimer:old.timer}:defaultCfg));
let memory=read(STORE);if(!memory||typeof memory!=="object")memory={};
let history=Array.isArray(memory.history)?memory.history.slice(0,150):[];
let cycle=memory.cycle&&Array.isArray(memory.cycle.items)?memory.cycle:null;
let current=null,started=0,locked=false,nextTimeout=0,tickHandle=0,page="home",lastKey="";
const single=m=>["random","sequential","fluency"].includes(m);
const op=()=>operations.find(x=>x.id===cfg.operation);
const method=()=>M[cfg.operation].find(x=>x.id===cfg.method);
const p=(prompt,answer,id)=>({id:id||prompt,prompt,answer,weight:1,streak:0,attempts:0,wrong:0,correct:0,done:false,time:0});
const formatNumber=x=>new Intl.NumberFormat("pt-BR",{useGrouping:false,maximumFractionDigits:12}).format(x);
const isPrime=n=>{if(n<2)return false;for(let k=2;k*k<=n;k++)if(n%k===0)return false;return true};
const gcd=(a,b)=>b?gcd(b,a%b):a;
const fractional=(a,b)=>{const g=gcd(Math.abs(a),Math.abs(b));return (a/g)+"/"+(b/g)};
function generate(c){
const out=[],seen=new Set(),L=c.level,method=c.method;
const push=(prompt,answer,id)=>{if(!seen.has(id||prompt)){seen.add(id||prompt);out.push(p(prompt,answer,id))}};
if(c.operation==="mul"||c.operation==="div"){
const low=Math.min(c.min,c.max),high=Math.max(c.min,c.max);
for(const a of c.tables)for(let b=low;b<=high;b++){
if(c.exclude.includes(a)||c.exclude.includes(b))continue;
if(c.operation==="div"&&a*b===0)continue;
if(c.operation==="mul"&&method==="double"&&![2,4,8].includes(b)&&![2,4,8].includes(a))continue;
if(c.operation==="mul"&&method==="comp"&&![8,9,11,12].includes(b)&&![8,9,11,12].includes(a))continue;
const id=c.operation==="mul"&&c.format==="minimal"?[Math.min(a,b),Math.max(a,b)].join("x"):a+"-"+b;
if(c.operation==="mul")push(a+" × "+b+" = ?",a*b,id);
else push((a*b)+" ÷ "+a+" = ?",b,id);
}
return out;
}
if(c.operation==="prime"){
const max=[50,120,250][L-1];
for(let n=2;n<=max;n++){
if(c.primeType==="list"&&!isPrime(n))continue;
push(c.primeType==="list"?"Qual é o primo depois de "+(n===2?1:previousPrime(n))+"?":n+" é primo? (sim/não)",c.primeType==="list"?n:(isPrime(n)?"sim":"não"),"prime-"+n);
}
return out.slice(0,c.count);
}
if(c.operation==="power"){
for(let a=2;a<=[12,18,25][L-1];a++)for(let exp=2;exp<=(method==="square"?2:L===3?5:3);exp++)push(a+toSup(exp)+" = ?",Math.pow(a,exp));
return out.slice(0,c.count);
}
if(c.operation==="root"){
if(method==="square"||(c.rootType==="exact"&&!["estimate","heron"].includes(method))){
for(let a=2;a<=[18,30,45][L-1];a++)push("√"+a*a+" = ?",a);
}else{
for(let n=10;n<=[70,150,280][L-1];n++){if(Number.isInteger(Math.sqrt(n)))continue;push("√"+n+" ≈ ? (1 decimal)",Math.round(Math.sqrt(n)*10)/10)}
}
return out.slice(0,c.count);
}
if(c.operation==="scientific"){
for(let i=0;i<c.count;i++){const m=rand(11,99)/10,exp=rand(-[3,5,7][L-1],[3,5,7][L-1]);push(formatNumber(m*Math.pow(10,exp))+" = ? × 10^"+exp,Number(m.toFixed(1)),"sc-"+i)}
return out;
}
if(c.operation==="round"){
const places=L===1?[10,100]:L===2?[10,100,1000]:[1,10,100,1000];
for(let i=0;i<c.count;i++){const place=places[i%places.length],n=rand(1,Math.round(2000*L));const target=place===1?Math.round(n*10)/10:n;const step=place===1?.1:place;const val=place===1?Number((target+[.04,.05,.06,-.04,-.05][i%5]).toFixed(2)):target;push(formatNumber(val)+" → "+(place===1?"1 casa decimal":place===10?"dezena":place===100?"centena":"milhar")+" mais próxima?",place===1?Number(val.toFixed(1)):Math.round(val/step)*step,"round-"+i)}
return out;
}
if(c.operation==="fraction"){
for(let i=0;i<c.count;i++){const d=[4,6,8,10,12][i%5],a=rand(1,d-2),b=rand(1,d-a),num=a+b;push(a+"/"+d+" + "+b+"/"+d+" = ? (fração)",fractional(num,d),"fraction-"+i)}
return out;
}
if(c.operation==="percent"){
const percentages=method==="fraction"?[10,20,25,50,75]:method==="anchors"?[5,10,15,20,25,50]:[5,10,15,20,25,30,40,50,75];
const bases=[40,60,80,100,120,160,200,240,300,400,500];
for(let i=0;i<c.count;i++){const pc=percentages[i%percentages.length],base=bases[(i*7+Math.floor(i/percentages.length))%bases.length];push(pc+"% de "+base+" = ?",pc*base/100,"pct-"+pc+"-"+base)}
return out;
}
const cap=[30,100,500][L-1];
for(let i=0;i<c.count;i++){
let a=rand(2,cap),b=rand(2,cap);
if(method==="comp"){b=Math.max(1,Math.round(b/10)*10+[-2,-1,1,2][i%4])}
if(method==="split"){a=rand(2,cap);b=rand(2,cap)}
if(c.operation==="sub"&&a<b)[a,b]=[b,a];
push(a+(c.operation==="sub"?" − ":" + ")+b+" = ?",c.operation==="sub"?a-b:a+b,"arith-"+i)
}
return out;
}
function previousPrime(n){for(let v=n-1;v>=2;v--)if(isPrime(v))return v;return 1}
function toSup(n){return String(n).replace(/\d/g,x=>"⁰¹²³⁴⁵⁶⁷⁸⁹"[Number(x)])}
function startCycle(){
if(nextTimeout)clearTimeout(nextTimeout);
const items=generate(cfg);
if(!items.length){notify("Essa seleção não gerou contas. Ajuste as configurações.");openSettings();return false}
cycle={id:Date.now(),cfg:clone(cfg),items,answered:0,correct:0,wrong:0,skips:0,totalMs:0,created:new Date().toISOString(),last:null,complete:false};
current=null;persist();return true;
}
function persist(){save(STORE,{cfg,cycle,history})}
function showPage(name){
page=name;
$("home").hidden=name!=="home";$("workspace").hidden=name!=="workspace";
$("btnBack").hidden=name==="home";$("btnSettings").hidden=name==="home";
$("btnReset").hidden=name==="home";
$("brandSubtitle").textContent=name==="home"?"Treine seu raciocínio matemático":op().name+" · "+modes.find(x=>x.id===cfg.mode).name;
if(name==="workspace"){renderWorkspace();}else renderHome();
}
function renderHome(){
const groups=[...new Set(operations.map(x=>x.group))],container=$("moduleGroups");
container.replaceChildren();
for(const group of groups){
const section=document.createElement("section");section.className="module-section";
const title=document.createElement("h2");title.textContent=group;section.appendChild(title);
const grid=document.createElement("div");grid.className="modules-grid";
for(const item of operations.filter(x=>x.group===group)){
const btn=document.createElement("button");btn.type="button";btn.className="module-tile";
const sym=document.createElement("span");sym.className="module-symbol";sym.textContent=item.symbol;
const label=document.createElement("span");label.textContent=item.name;btn.append(sym,label);
btn.addEventListener("click",()=>selectOperation(item.id));grid.append(btn);
}
section.append(grid);container.append(section);
}
}
function selectOperation(id){
if(!operations.some(x=>x.id===id))return;
if(cycle&&!cycle.complete&&cycle.answered>0&&cycle.cfg.operation!==id){
if(!confirm("Iniciar outro módulo? O ciclo atual ainda não foi concluído."))return;
}
cfg.operation=id;if(!M[id].some(x=>x.id===cfg.method))cfg.method="free";
if(!cycle||cycle.complete||cycle.cfg.operation!==id)startCycle();
persist();showPage("workspace");
}
function options(select,items,key){select.replaceChildren();for(const x of items){const o=document.createElement("option");o.value=x.id;o.textContent=x.name;select.append(o)}select.value=key}
function renderWorkspace(){
if(!cycle||cycle.cfg.operation!==cfg.operation)startCycle();
options($("modeSelect"),modes,cfg.mode);
options($("methodSelect"),M[cfg.operation],cfg.method);
$("moduleTitle").textContent=op().name;$("methodNote").textContent=cfg.method==="free"?"Resolva pelo seu próprio caminho.":method().guide[0];
$("methodHelp").disabled=cfg.method==="free";
$("btnReview").hidden=history.length===0;
renderProgress();
if(cycle.complete){renderFinished();return}
showQuestion();
}
function renderProgress(){
const n=cycle.items.length,done=cycle.items.filter(x=>x.done).length;
const percentage=n?Math.round(done*100/n):0;
$("progressText").textContent=done+" de "+n;
$("progressRemaining").textContent=(n-done)+" restantes";
$("progressPercent").textContent=percentage+"%";
$("progressFill").style.width=percentage+"%";
$("progressTrack").setAttribute("aria-valuenow",percentage);
$("statCorrect").textContent=cycle.correct;
$("statWrong").textContent=cycle.wrong;
$("statAttempts").textContent=cycle.answered;
$("progressDescription").textContent=single(cfg.mode)?"Questões respondidas":"Multiplicações / questões concluídas";
}
function choose(){
const items=cycle.items.filter(x=>!x.done);
if(!items.length)return null;
if(cfg.mode==="sequential")return items[0];
const pool=items.length>1?items.filter(x=>x.id!==cycle.last):items;
if(cfg.mode==="random"||cfg.mode==="fluency")return pool[rand(0,pool.length-1)];
const w=pool.map(x=>Math.max(.25,x.weight));let r=Math.random()*w.reduce((a,b)=>a+b,0);
for(let i=0;i<pool.length;i++){r-=w[i];if(r<=0)return pool[i]}
return pool[pool.length-1];
}
function showQuestion(){
if(cycle.complete)return renderFinished();
if(current&&!locked&&cycle.items.includes(current)&&!current.done){
}else current=choose();
if(!current)return finish();
cycle.last=current.id;locked=false;started=performance.now();
$("problem").textContent=current.prompt;
$("answer").value="";$("answer").disabled=false;$("submitAnswer").disabled=false;$("skipAnswer").disabled=false;
$("answer").placeholder=cfg.operation==="prime"&&cfg.primeType==="check"?"sim ou não":cfg.operation==="fraction"?"Ex.: 3/4":"Sua resposta";
$("answer").setAttribute("inputmode",["prime","fraction"].includes(cfg.operation)?"text":"decimal");
$("feedback").textContent="Digite sua resposta e pressione Enter.";$("feedback").dataset.kind="";
$("trainingArea").hidden=false;$("summaryArea").hidden=true;
renderProgress();persist();
if(cfg.autofocus&&matchMedia("(pointer:fine)").matches)$("answer").focus({preventScroll:true});
}
function answerEquivalent(raw,expected){
const input=raw.trim().toLowerCase().replace(/\s/g,"").replace(",",".");
if(typeof expected==="string"){
if(expected==="sim"||expected==="não")return expected==="sim"?["sim","s","yes"].includes(input):["não","nao","n","no"].includes(input);
if(expected.includes("/")){
const match=input.match(/^(-?\d+)\/([1-9]\d*)$/);
if(!match)return false;const [a,b]=expected.split("/").map(Number);return Number(match[1])*b===a*Number(match[2])
}
return input===expected.toLowerCase();
}
if(!/^-?\d+(\.\d+)?$/.test(input))return false;
const val=Number(input);
return Math.abs(val-expected)<=1e-7;
}
function answer(skip){
if(locked||!current)return;
const raw=$("answer").value.trim();
if(!skip&&!raw){$("answer").focus();return}
if(!skip&&!answerLooksValid(raw)){notify("Digite uma resposta numérica válida ou sim/não.");return}
locked=true;
const ms=Math.max(0,performance.now()-started);current.attempts++;cycle.answered++;
let kind="good",message="";
if(skip){cycle.skips++;current.streak=0;current.weight=Math.min(25,current.weight*1.6+1);kind="warn";message="Pulou · "+cleanAnswer(current.answer)}
else if(answerEquivalent(raw,current.answer)){current.correct++;cycle.correct++;cycle.totalMs+=ms;current.time+=ms;current.streak++;current.weight=Math.max(.25,current.weight*.72);message="Correto!";
}else{cycle.wrong++;current.wrong++;cycle.totalMs+=ms;current.time+=ms;current.streak=0;current.weight=Math.min(25,current.weight*2.4+1.2);kind="bad";message="Resposta: "+cleanAnswer(current.answer)}
if(single(cfg.mode)||current.streak>=(cfg.mode==="learning"?2:3))current.done=true;
$("feedback").textContent=message;$("feedback").dataset.kind=kind;
$("answer").disabled=true;$("submitAnswer").disabled=true;$("skipAnswer").disabled=true;
renderProgress();persist();
if(nextTimeout)clearTimeout(nextTimeout);
nextTimeout=setTimeout(()=>{nextTimeout=0;current=null;if(cycle.items.every(x=>x.done))finish();else showQuestion()},kind==="bad"?1350:kind==="warn"?1100:750);
}
function cleanAnswer(ans){return String(ans).replace(".",",")}
function answerLooksValid(s){return /^-?\d+(?:[.,]\d+)?$/.test(s.trim())||/^(-?\d+)\/([1-9]\d*)$/.test(s.trim())||/^(sim|s|não|nao|n|yes|no)$/i.test(s.trim())}
function finish(){
if(!cycle.complete){
cycle.complete=true;
history.unshift({id:cycle.id,operation:cfg.operation,mode:cfg.mode,method:cfg.method,ended:new Date().toISOString(),count:cycle.items.length,correct:cycle.correct,wrong:cycle.wrong,skips:cycle.skips,answered:cycle.answered,avg:cycle.correct+cycle.wrong?cycle.totalMs/(cycle.correct+cycle.wrong):0,hard:cycle.items.filter(x=>x.wrong||x.attempts>3).map(x=>({id:x.id,prompt:x.prompt,answer:x.answer,weight:1,streak:0,attempts:0,wrong:0,correct:0,done:false,time:0})).slice(0,40)});
history=history.slice(0,150);persist();
}
renderFinished();
}
function renderFinished(){
$("trainingArea").hidden=true;$("summaryArea").hidden=false;
$("summaryTitle").textContent="Ciclo concluído";
$("endCount").textContent=cycle.items.length;
$("endCorrect").textContent=cycle.correct;
$("endAccuracy").textContent=cycle.correct+cycle.wrong?Math.round(cycle.correct*100/(cycle.correct+cycle.wrong))+"%":"—";
$("endAvg").textContent=cycle.correct+cycle.wrong?(cycle.totalMs/(cycle.correct+cycle.wrong)/1000).toFixed(1).replace(".",",")+"s":"—";
renderProgress();
}
function changeMode(mode){
if(cfg.mode===mode)return;
if(cycle&&!cycle.complete&&cycle.answered>0&&!confirm("Trocar o modo inicia um novo ciclo. Continuar?")){$("modeSelect").value=cfg.mode;return}
cfg.mode=mode;startCycle();renderWorkspace();
}
function changeMethod(id){
if(cfg.method===id)return;
if(cycle&&!cycle.complete&&cycle.answered>0&&!confirm("Trocar a metodologia inicia um novo ciclo. Continuar?")){$("methodSelect").value=cfg.method;return}
cfg.method=id;startCycle();renderWorkspace();
}
function displayGuide(){
const m=method(),el=$("guideSteps");el.replaceChildren();
$("guideTitle").textContent=m.name;
m.guide.forEach((step,i)=>{const row=document.createElement("div");row.className="guide-step";const num=document.createElement("span");num.textContent=i+1;const text=document.createElement("p");text.textContent=step;row.append(num,text);el.append(row)});
$("guideNote").textContent=m.id==="free"?"Experimente suas próprias estratégias.":"Você pode resolver de outra maneira. O tutorial apenas apresenta uma possibilidade.";
openModal("guideModal");
}
function openModal(id){$(id).hidden=false}
function closeModal(id){$(id).hidden=true}
function notify(msg){$("toast").textContent=msg;$("toast").hidden=false;clearTimeout(notify.timer);notify.timer=setTimeout(()=>$("toast").hidden=true,3500)}
function createSettings(){
const multi=cfg.operation==="mul"||cfg.operation==="div";
$("tableConfig").hidden=!multi;$("countConfig").hidden=multi;
$("comboConfig").hidden=cfg.operation!=="mul";
$("rootConfig").hidden=cfg.operation!=="root";
$("primeConfig").hidden=cfg.operation!=="prime";
$("countSetting").value=cfg.count;$("levelSetting").value=cfg.level;
$("minSetting").value=cfg.min;$("maxSetting").value=cfg.max;
$("formatSetting").value=cfg.format;$("rootSetting").value=cfg.rootType;$("primeSetting").value=cfg.primeType;
$("timerSetting").checked=cfg.showTimer;$("focusSetting").checked=cfg.autofocus;
const grid=$("tablesSetting"),excluded=$("excludeSetting");grid.replaceChildren();excluded.replaceChildren();
for(let n=0;n<=12;n++){
for(const [host,values,type] of [[grid,cfg.tables,"t"],[excluded,cfg.exclude,"e"]]){
const label=document.createElement("label");label.className="number-option";
const input=document.createElement("input");input.type="checkbox";input.value=String(n);input.dataset.group=type;input.checked=values.includes(n);
const txt=document.createElement("span");txt.textContent=n;label.append(input,txt);host.append(label);
}
}
}
function applySettings(){
const getNums=group=>[...document.querySelectorAll('input[data-group="'+group+'"]:checked')].map(x=>Number(x.value));
const next=normalize({...cfg,level:Number($("levelSetting").value),count:Number($("countSetting").value),min:Number($("minSetting").value),max:Number($("maxSetting").value),format:$("formatSetting").value,rootType:$("rootSetting").value,primeType:$("primeSetting").value,showTimer:$("timerSetting").checked,autofocus:$("focusSetting").checked,tables:getNums("t"),exclude:getNums("e")});
if((cfg.operation==="mul"||cfg.operation==="div")&&!next.tables.length){notify("Selecione pelo menos uma tabuada.");return}
const changed=JSON.stringify({...cfg,showTimer:false,autofocus:false})!==JSON.stringify({...next,showTimer:false,autofocus:false});
if(changed&&cycle&&!cycle.complete&&cycle.answered>0&&!confirm("Essas alterações iniciam outro ciclo. Continuar?"))return;
cfg=next;
if(changed&&!startCycle())return;
persist();closeModal("settingsModal");renderWorkspace();
}
function review(){
const source=history.find(x=>x.operation===cfg.operation&&Array.isArray(x.hard)&&x.hard.length);
if(!source){notify("Ainda não há dificuldades registradas para este módulo.");return}
if(cycle&&!cycle.complete&&cycle.answered>0&&!confirm("Iniciar uma revisão e substituir o ciclo atual?"))return;
cfg.mode="intelligent";startCycle();cycle.items=source.hard.map(x=>({...x,done:false,weight:2,streak:0,attempts:0,correct:0,wrong:0,time:0}));persist();renderWorkspace();
}
function historyView(){
const el=$("historyList");el.replaceChildren();
if(!history.length){const text=document.createElement("p");text.textContent="Nenhum ciclo concluído ainda.";el.append(text)}
for(const h of history.slice(0,30)){
const div=document.createElement("div");div.className="history-record";
const b=document.createElement("b");b.textContent=(operations.find(x=>x.id===h.operation)?.name||h.operation)+" · "+h.count+" questões";
const small=document.createElement("small");small.textContent=new Date(h.ended).toLocaleDateString("pt-BR")+" · "+(h.correct+h.wrong?Math.round(h.correct*100/(h.correct+h.wrong))+"%":"—")+" precisão";
div.append(b,small);el.append(div)
}
openModal("historyModal");
}
function theme(v){document.documentElement.dataset.theme=v;$("themeButton").textContent=v==="dark"?"☀":"☾";try{localStorage.setItem(THEME,v)}catch{}}
theme((()=>{try{return localStorage.getItem(THEME)}catch{return null}})()||(matchMedia("(prefers-color-scheme:light)").matches?"light":"dark"));
$("themeButton").addEventListener("click",()=>theme(document.documentElement.dataset.theme==="dark"?"light":"dark"));
const glow=$("ambientGlow");
if(matchMedia("(hover:hover) and (pointer:fine)").matches&&!matchMedia("(prefers-reduced-motion:reduce)").matches){
let x=innerWidth/2,y=innerHeight/2,tx=x,ty=y,r=0;
const animate=()=>{x+=(tx-x)*.12;y+=(ty-y)*.12;glow.style.transform="translate3d("+(x-230)+"px,"+(y-230)+"px,0)";r=Math.abs(tx-x)+Math.abs(ty-y)>.4?requestAnimationFrame(animate):0};
addEventListener("pointermove",e=>{tx=e.clientX;ty=e.clientY;if(!r)r=requestAnimationFrame(animate)},{passive:true});
}
$("btnBack").addEventListener("click",()=>showPage("home"));
$("btnSettings").addEventListener("click",()=>{createSettings();openModal("settingsModal")});
$("btnReset").addEventListener("click",()=>{if(cycle&&!cycle.complete&&cycle.answered>0&&!confirm("Recomeçar o ciclo atual?"))return;startCycle();renderWorkspace()});
$("methodSelect").addEventListener("change",e=>changeMethod(e.target.value));
$("modeSelect").addEventListener("change",e=>changeMode(e.target.value));
$("methodHelp").addEventListener("click",displayGuide);
$("answerForm").addEventListener("submit",e=>{e.preventDefault();answer(false)});
$("skipAnswer").addEventListener("click",()=>answer(true));
$("newCycle").addEventListener("click",()=>{startCycle();renderWorkspace()});
$("btnReview").addEventListener("click",review);
$("saveSettings").addEventListener("click",applySettings);
$("allTables").addEventListener("click",()=>document.querySelectorAll('input[data-group="t"]').forEach(x=>x.checked=true));
$("noTables").addEventListener("click",()=>document.querySelectorAll('input[data-group="t"]').forEach(x=>x.checked=false));
$("restoreSettings").addEventListener("click",()=>{const selected=cfg.operation;cfg=normalize({...defaultCfg,operation:selected});createSettings()});
$("historyButton").addEventListener("click",historyView);
$("exportButton").addEventListener("click",()=>{
const blob=new Blob([JSON.stringify({version:1,cfg,cycle,history},null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="calculo-mental.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
});
$("importButton").addEventListener("click",()=>$("importFile").click());
$("importFile").addEventListener("change",async e=>{
const file=e.target.files[0];if(!file)return;
try{if(file.size>1500000)throw Error("Arquivo muito grande.");const data=JSON.parse(await file.text());if(data.version!==1||!Array.isArray(data.history)||data.history.length>1000)throw Error("Formato não reconhecido.");if(!confirm("Substituir o progresso deste navegador?"))return;cfg=normalize(data.cfg);history=data.history.slice(0,150);cycle=data.cycle&&Array.isArray(data.cycle.items)&&data.cycle.items.length<=500?data.cycle:null;current=null;persist();closeModal("historyModal");showPage("home");notify("Dados importados.")}catch(err){notify(err.message)}finally{e.target.value=""}
});
document.querySelectorAll("[data-dismiss]").forEach(b=>b.addEventListener("click",()=>closeModal(b.dataset.dismiss)));
document.querySelectorAll(".modal-overlay").forEach(modal=>modal.addEventListener("click",e=>{if(e.target===modal)closeModal(modal.id)}));
document.addEventListener("keydown",e=>{if(e.key==="Escape")document.querySelectorAll(".modal-overlay:not([hidden])").forEach(el=>closeModal(el.id))});
function tick(){const t=$("timeDisplay");if(cfg.showTimer&&page==="workspace"&&!cycle?.complete){t.hidden=false;t.textContent=(current&&!locked?((performance.now()-started)/1000).toFixed(1):"0.0")+"s"}else t.hidden=true;tickHandle=requestAnimationFrame(tick)}
if(cycle&&cycle.cfg?.operation!==cfg.operation)cycle=null;
if(cycle&&cycle.complete)current=null;
showPage("home");tick();
})();