(() => {
"use strict";
const $=id=>document.getElementById(id);
const STORE="mental_training_v1", LEGACY="tabuada_trainer_v1", THEME="tabuada_theme";
const PANEL_KEY="mental_panels_v1";

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
{id:"scientific",name:"Notação científica",symbol:"10ⁿ",group:"Aplicações",desc:"Potências de dez"},
...window.MentalExtra.operations
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
{id:"auto",name:"Automática",guide:["Antes de resolver, olhe os números e escolha um atalho.","Números próximos: conte a diferença. Perto de uma dezena: arredonde.","Você pode usar qualquer estratégia; a dica por questão mostra uma possibilidade."]},
{id:"free",name:"Livre",guide:["Encontre a diferença da forma que preferir.","83 − 47 = 36.","Teste atalhos com dezenas próximas."]},
{id:"equal",name:"Diferença constante",guide:["Se você subtrair o mesmo valor dos dois números, a diferença permanece.","33 − 23: retire 3 de ambos. Vira 30 − 20.","30 − 20 = 10. Também é válido somar 7 aos dois: 40 − 30 = 10."]},
{id:"split",name:"Subtrair por partes",guide:["Divida o segundo número em partes mais simples.","83 − 27: retire 20 e obtenha 63.","Depois retire 7: o resultado é 56."]},
{id:"countup",name:"Completar pela soma",guide:["Se os números forem próximos, descubra quanto falta do menor ao maior.","62 − 57: de 57 a 60 faltam 3; de 60 a 62 faltam 2.","A diferença é 3 + 2 = 5."]},
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
],
...window.MentalExtra.methods
};
const defaultCfg={presetVersion:3,operation:"mul",method:"free",mode:"intelligent",level:1,tables:[1,2,3,4,5,6,7,8,9,10],exclude:[],min:1,max:10,count:24,showTimer:false,autofocus:true,format:"minimal",rootType:"exact",primeType:"check",aMin:0,aMax:10,bMin:0,bMax:10,allCombos:false,negativeResults:false,negativeOperands:false,decimalOperands:false,decimalResults:false,decimalPlaces:1,customNumbers:false,quickPreset:"custom",customBase:null,difficultyPreset:"balanced",excludeEqual:true,excludeZero:false,excludeOne:false,excludeSmallResults:false};
function normalize(c){
const previous=c&&typeof c==="object"?c:{};
const legacyDifficulty=!Object.prototype.hasOwnProperty.call(previous,"difficultyPreset");
c={...clone(defaultCfg),...previous};
if(legacyDifficulty&&["add","sub","mul","div"].includes(c.operation)){
 const profile=Number(c.level)>=3?"hard":Number(c.level)===2?"balanced":"balanced";
 Object.assign(c,profile==="hard"?{difficultyPreset:"hard",excludeEqual:true,excludeZero:true,excludeOne:true,excludeSmallResults:true}:{difficultyPreset:"balanced",excludeEqual:true,excludeZero:false,excludeOne:false,excludeSmallResults:false});
}if(!operations.some(x=>x.id===c.operation))c.operation="mul";c.presetVersion=Number(c.presetVersion)||0;if(!modes.some(x=>x.id===c.mode))c.mode="intelligent";if(!M[c.operation].some(x=>x.id===c.method))c.method="free";c.level=limit(Number(c.level)||1,1,3);c.count=limit(Number(c.count)||24,5,120);c.min=limit(Number(c.min)||1,0,20);c.max=limit(Number(c.max)||10,0,20);c.tables=Array.isArray(c.tables)?[...new Set(c.tables.map(Number).filter(x=>Number.isInteger(x)&&x>=0&&x<=12))]:clone(defaultCfg.tables);c.exclude=Array.isArray(c.exclude)?[...new Set(c.exclude.map(Number).filter(x=>Number.isInteger(x)&&x>=0&&x<=12))]:clone(defaultCfg.exclude);c.format=c.format==="all"?"all":"minimal";c.rootType=["exact","estimate"].includes(c.rootType)?c.rootType:"exact";c.primeType=["check","list"].includes(c.primeType)?c.primeType:"check";for(const key of ["aMin","aMax","bMin","bMax"])c[key]=limit(Number.isFinite(Number(c[key]))?Math.trunc(Number(c[key])):0,0,1000);c.allCombos=!!c.allCombos;c.negativeResults=!!c.negativeResults;c.negativeOperands=!!c.negativeOperands;c.decimalOperands=!!c.decimalOperands;c.decimalResults=!!c.decimalResults;c.customNumbers=!!c.customNumbers;
c.quickPreset=["easy","intermediate","hard","expert","custom"].includes(c.quickPreset)?c.quickPreset:"custom";
c.customBase=["easy","intermediate","hard","expert"].includes(c.customBase)?c.customBase:null;
c.difficultyPreset=["basic","balanced","hard","custom"].includes(c.difficultyPreset)?c.difficultyPreset:"balanced";
for(const key of ["excludeEqual","excludeZero","excludeOne","excludeSmallResults"])c[key]=!!c[key];
c.decimalPlaces=c.decimalPlaces===2||c.decimalPlaces==="2"?2:1;
if(c.operation==="mul"){
 c.tables=c.tables.filter(x=>x>=1&&x<=10).sort((a,b)=>a-b);
 if(!c.tables.length)c.tables=[1,2,3,4,5,6,7,8,9,10];
 c.customNumbers=false;c.min=1;c.max=10;c.exclude=[];c.format="all";c.allCombos=true;
 c.negativeOperands=false;c.negativeResults=false;c.decimalOperands=false;c.decimalResults=false;
 c.excludeEqual=false;c.excludeZero=false;c.excludeOne=false;c.excludeSmallResults=false;
 c.presetVersion=3;
}
return c}
const PRESET_NAMES={easy:"Fácil",intermediate:"Intermediário",hard:"Difícil",expert:"Superdifícil",custom:"Personalizado"};
function presetConfig(id,operation,base){
 const c={...clone(base),operation,quickPreset:id,customBase:id,presetVersion:2,method:"free",
  allCombos:false,customNumbers:false,decimalOperands:false,decimalResults:false,
  negativeOperands:false,negativeResults:false,decimalPlaces:1,
  excludeEqual:false,excludeZero:false,excludeOne:false,excludeSmallResults:false,difficultyPreset:"basic"};
 const index={easy:0,intermediate:1,hard:2,expert:3}[id]??1;
 if(operation==="mul"){
  c.tables=index===0?[1,2,3,4,5]:[1,2,3,4,5,6,7,8,9,10];
  c.exclude=[];c.min=1;c.max=10;c.customNumbers=false;c.allCombos=true;
  c.format="all";c.method="free";c.presetVersion=3;
 }else if(operation==="div"){
  c.tables=index===0?[2,3,4,5]:index===1?[2,3,4,5,6,7,8,9,10]:index===2?[2,3,4,5,6,7,8,9,10,11,12]:[2,3,4,5,6,7,8,9,10,11,12];
  c.min=1;c.max=index===3?20:10;c.exclude=[];
  c.excludeEqual=index>=1;c.excludeOne=index>=1;c.customNumbers=false;
  c.count=[20,28,36,40][index];c.method="free";
 }else if(operation==="sub"||operation==="add"){
  c.aMin=0;c.bMin=0;
  c.aMax=(operation==="sub"?[10,30,150,500]:[10,50,150,500])[index];
  c.bMax=c.aMax;
  c.count=[20,28,30,36][index];
  c.negativeResults=index>=2;c.negativeOperands=index===3;
  c.decimalOperands=index>=2;c.decimalPlaces=index===3?2:1;
  c.excludeEqual=index>=1;c.excludeZero=index>=2;c.excludeOne=index>=2;c.excludeSmallResults=index>=2;
  c.difficultyPreset=index===0?"basic":index===1?"balanced":"hard";
  c.method=operation==="sub"&&index>=1?"auto":"free";
 }else{
  c.level=[1,2,3,3][index];c.count=[15,24,30,36][index];
 }
 return normalize(c);
}
const FIRST_OPERATIONS=["add","sub","mul","div"];
const arithmetic=(op)=>FIRST_OPERATIONS.includes(op);
const safeRange=(a,b)=>[Math.min(a,b),Math.max(a,b)];
function operandValues(lo,hi,c){
 const scale=c.decimalOperands?10**c.decimalPlaces:1;
 const [low,high]=safeRange(lo,hi),positive=[];
 for(let i=low*scale;i<=high*scale;i++)positive.push(i);
 if(!c.negativeOperands)return positive;
 const negatives=positive.filter(n=>n!==0).map(n=>-n).reverse();
 return negatives.concat(positive);
}
function arithmeticAnswer(c,a,b){
 return c.operation==="add"?a+b:c.operation==="sub"?a-b:c.operation==="mul"?a*b:a/b;
}
function allowedByDifficulty(c,a,b,result){
 if(c.excludeEqual&&Math.abs(a-b)<1e-9)return false;
 if(c.excludeZero&&(Math.abs(a)<1e-9||Math.abs(b)<1e-9))return false;
 if(c.excludeOne&&(Math.abs(Math.abs(a)-1)<1e-9||Math.abs(Math.abs(b)-1)<1e-9))return false;
 if(c.excludeSmallResults&&Math.abs(result)<=2+1e-9)return false;
 return true;
}
function supportsValue(c,a,b){
 if(c.operation==="div"&&b===0)return false;
 const value=arithmeticAnswer(c,a,b);
 if(!allowedByDifficulty(c,a,b,value))return false;
 if(!c.negativeResults&&value<0)return false;
 if(c.operation==="div"&&!c.decimalResults&&!Number.isInteger(value))return false;
 if(c.operation==="div"&&c.decimalResults&&Math.abs(value-Number(value.toFixed(c.decimalPlaces)))>1e-9)return false;
 return true;
}
function arithmeticCount(c){
 const a=operandValues(c.aMin,c.aMax,c),b=operandValues(c.bMin,c.bMax,c);
 if(a.length*b.length>120000)return -1;
 let count=0;
 for(const x of a)for(const y of b)if(supportsValue(c,x/(c.decimalOperands?10**c.decimalPlaces:1),y/(c.decimalOperands?10**c.decimalPlaces:1)))count++;
 return count;
}
function subtractionSkill(a,b){
 if(a<0||b<0)return "Regra de sinais";
 if(!Number.isInteger(a)||!Number.isInteger(b))return "Subtração com decimais";
 if(b>=10&&a>b&&a-b<=12&&a>=20)return "Completar pela soma";
 const remainder=((b%10)+10)%10;
 if(a>=20&&b>=10&&(remainder===8||remainder===9))return "Compensação";
 if(a>=20&&b>=10&&remainder!==0&&(remainder===1||remainder===2||remainder===3||remainder===7))return "Diferença constante";
 if(a>=10&&b>0&&a%10<b%10)return "Passagem pela dezena";
 if(a>=20&&b>=10)return "Subtrair por partes";
 return "Fundamentos";
}
function arithmeticProblems(c,push){
 const scale=c.decimalOperands?10**c.decimalPlaces:1;
 const left=operandValues(c.aMin,c.aMax,c),right=operandValues(c.bMin,c.bMax,c);
 const totalSize=left.length*right.length;
 if(c.allCombos&&totalSize>120000)throw Error("Intervalo muito amplo para todas as combinações. Reduza os valores.");
 const eligible=[];
 if(totalSize>120000&&!c.allCombos){
  const seen=new Set();let tries=0;
  while(eligible.length<Math.min(500,c.count*10)&&tries<Math.max(5000,c.count*500)){
   tries++;
   const i=rand(0,left.length-1),j=rand(0,right.length-1),key=i+":"+j;
   if(seen.has(key))continue;seen.add(key);
   const a=left[i]/scale,b=right[j]/scale;
   if(supportsValue(c,a,b))eligible.push([a,b]);
  }
 }else{
  for(const x of left)for(const y of right){
   const a=x/scale,b=y/scale;
   if(supportsValue(c,a,b))eligible.push([a,b]);
  }
 }
 if(!eligible.length)return;
 if(c.allCombos&&eligible.length>10000)throw Error("Esta seleção gera "+eligible.length.toLocaleString("pt-BR")+" operações. Limite de 10.000 por ciclo; reduza o intervalo.");
 if(!c.allCombos){
  if(c.operation==="sub"&&c.method==="equal"){
   const favored=eligible.filter(([a,b])=>a>10&&b>10&&Number.isInteger(a)&&Number.isInteger(b)&&Math.abs(b%10)>=2&&Math.abs(b%10)<=9);
   if(favored.length){eligible.length=0;for(const pair of favored)eligible.push(pair)}
  }
  if(c.operation==="sub"&&c.method==="countup"){
   const favored=eligible.filter(([a,b])=>a>b&&a-b<=15&&a>=20);
   if(favored.length){eligible.length=0;for(const pair of favored)eligible.push(pair)}
  }
  if(c.operation==="sub"&&c.method==="split"){
   const favored=eligible.filter(([a,b])=>a>20&&b>10&&Math.abs(b%10)>=1);
   if(favored.length){eligible.length=0;for(const pair of favored)eligible.push(pair)}
  }
  if(c.method==="comp"){
   const favored=eligible.filter(([a,b])=>Math.min(Math.abs(b)%10,10-(Math.abs(b)%10))<=2&&Math.abs(b)%10!==0);
   if(favored.length){eligible.length=0;for(const pair of favored)eligible.push(pair)}
  }
  if(c.operation==="sub"&&c.method==="bridge"){
   const favored=eligible.filter(([a,b])=>a>=10&&b>0&&Math.floor(a/10)!==Math.floor((a-b)/10));
   if(favored.length){eligible.length=0;for(const pair of favored)eligible.push(pair)}
  }
 }
 const wanted=c.allCombos?eligible.length:Math.min(c.count,eligible.length);
 let pairs;
 if(c.operation==="sub"&&c.method==="auto"&&!c.allCombos){
  const groups=new Map(),order=["Fundamentos","Passagem pela dezena","Subtrair por partes","Completar pela soma","Diferença constante","Compensação","Regra de sinais","Subtração com decimais"];
  for(const pair of eligible){
   const skill=subtractionSkill(pair[0],pair[1]);
   if(!groups.has(skill))groups.set(skill,[]);
   groups.get(skill).push(pair);
  }
  for(const list of groups.values()){
   for(let i=0;i<list.length;i++){const j=rand(i,list.length-1);[list[i],list[j]]=[list[j],list[i]]}
  }
  pairs=[];let rounds=0;
  while(pairs.length<wanted&&rounds<wanted+1){
   let advanced=false;
   for(const skill of order){
    const group=groups.get(skill);
    if(group?.length){pairs.push(group.pop());advanced=true;if(pairs.length>=wanted)break}
   }
   if(!advanced)break;
   rounds++;
  }
 }
 if(!pairs&&(c.allCombos||c.mode==="sequential"))pairs=eligible.slice(0,wanted);
 else if(!pairs){
  // Sorteio sem reposição, usando algoritmo parcial de Fisher-Yates.
  for(let i=0;i<wanted;i++){
   const j=rand(i,eligible.length-1);
   [eligible[i],eligible[j]]=[eligible[j],eligible[i]];
  }
  pairs=eligible.slice(0,wanted);
 }
 const symbol={add:" + ",sub:" − ",mul:" × ",div:" ÷ "}[c.operation];
 for(const [a,b] of pairs){
  const raw=c.operation==="add"?a+b:c.operation==="sub"?a-b:c.operation==="mul"?a*b:a/b;
  const ans=Number(raw.toFixed(10));
  const fmt=x=>formatNumber(x);
  push(fmt(a)+symbol+(b<0?"("+fmt(b)+")":fmt(b))+" = ?",ans,c.operation+":"+a+":"+b,
c.operation==="sub"?(c.method==="auto"?subtractionSkill(a,b):(M.sub.find(x=>x.id===c.method)?.name||"Subtração")):null);
 }
}
const old=read(LEGACY);let cfg=normalize(read(STORE)?.cfg||(old?{...defaultCfg,tables:old.tables,exclude:old.excludeFactors,min:old.minMul,max:old.maxMul,format:old.mode==="conventional"?"all":"minimal",showTimer:old.timer}:presetConfig("intermediate","mul",defaultCfg)));
let memory=read(STORE);if(!memory||typeof memory!=="object")memory={};
let profiles=memory.profiles&&typeof memory.profiles==="object"?memory.profiles:{};
profiles[cfg.operation]=clone(cfg);
let history=Array.isArray(memory.history)?memory.history.slice(0,150):[];
let cycle=memory.cycle&&Array.isArray(memory.cycle.items)?memory.cycle:null;
function migrateCycle(c){
 if(!c||c.cycleVersion===2)return c;
 c.cycleVersion=2;c.reviewLimit=2;c.answered=Number(c.answered)||0;
 for(const item of c.items){
   item.firstSeen=Number(item.attempts)>0;
   item.reviews=Math.min(2,Math.max(0,(Number(item.attempts)||0)-1));
   item.mastered=!!item.done&&Number(item.correct)>0;
   item.reviewStreak=Number(item.streak)||0;
   if(item.firstSeen&&!item.done&&item.reviews>=2)item.done=true;
 }
 return c;
}
cycle=migrateCycle(cycle);
if(cycle?.cfg?.operation==="mul"){
 const acceptable=cycle.items.every(item=>{
  const m=String(item.prompt||"").match(/^([1-9]|10) × ([1-9]|10) = \?$/);
  return m&&cfg.operation==="mul"&&cfg.tables.includes(Number(m[1]))&&Number(item.answer)===Number(m[1])*Number(m[2]);
 });
 if(!acceptable||(!cycle.reviewSession&&cycle.items.length!==cfg.tables.length*10))cycle=null;
}
let current=null,started=0,locked=false,nextTimeout=0,tickHandle=0,page="home",lastKey="";
const mobileView=matchMedia("(max-width:650px) and (pointer:coarse)");
let mobileNativeKeyboard=false;
const single=m=>["random","sequential","fluency"].includes(m);
const op=()=>operations.find(x=>x.id===cfg.operation);
const method=()=>M[cfg.operation].find(x=>x.id===cfg.method);
function multiplicationAllowed(item,c=cfg){
 if(c.operation!=="mul")return true;
 const match=String(item.prompt||"").match(/^([1-9]|10) × ([1-9]|10) = \?$/);
 if(!match)return false;
 const a=Number(match[1]),b=Number(match[2]);
 return c.tables.includes(a)&&b>=1&&b<=10&&Number(item.answer)===a*b;
}
function showMultiplicationPicker(){
 const show=cfg.operation==="mul";
 $("multiplicationPicker").hidden=!show;
 if(!show)return;
 const grid=$("mulPickerGrid");grid.replaceChildren();
 for(let n=1;n<=10;n++){
  const label=document.createElement("label");label.className="mul-option";
  const check=document.createElement("input");check.type="checkbox";check.value=String(n);
  check.checked=cfg.tables.includes(n);check.dataset.mulTable=String(n);
  const visual=document.createElement("span");visual.textContent=String(n);
  label.append(check,visual);grid.append(label);
 }
 updateMulPickerCount();
 $("mulSelectedLabel").textContent=cfg.tables.join(", ");
 $("mulTotalLabel").textContent=(cfg.tables.length*10)+" contas";
}
function updateMulPickerCount(){
 const nums=[...document.querySelectorAll("input[data-mul-table]:checked")].map(x=>Number(x.value));
 $("mulSelectionCount").textContent=nums.length+" tabuada"+(nums.length===1?"":"s")+" · "+(nums.length*10)+" contas";
 $("mulApply").disabled=nums.length===0;
}

function renderMethodCards(){
 const root=$("methodCards");root.replaceChildren();
 const methods=M[cfg.operation];
 for(const m of methods){
  const button=document.createElement("button");button.type="button";
  button.className="method-card";button.dataset.active=String(cfg.method===m.id);
  button.setAttribute("aria-pressed",String(cfg.method===m.id));
  const title=document.createElement("strong");title.textContent=m.name;
  const subtitle=document.createElement("small");subtitle.textContent=m.guide[0];
  button.append(title,subtitle);
  button.addEventListener("click",()=>changeMethod(m.id));
  root.append(button);
 }
 $("selectedMethodName").textContent=method().name;
$("compactMethod").textContent=method().name;
}
const p=(prompt,answer,id)=>({id:id||prompt,prompt,answer,weight:1,streak:0,
 attempts:0,wrong:0,correct:0,done:false,firstSeen:false,mastered:false,reviews:0,reviewStreak:0,time:0,hintUsed:false});
const formatNumber=x=>new Intl.NumberFormat("pt-BR",{useGrouping:false,maximumFractionDigits:12}).format(x);
const isPrime=n=>{if(n<2)return false;for(let k=2;k*k<=n;k++)if(n%k===0)return false;return true};
const gcd=(a,b)=>b?gcd(b,a%b):a;
const fractional=(a,b)=>{const g=gcd(Math.abs(a),Math.abs(b));return (a/g)+"/"+(b/g)};
function generate(c){
const out=[],seen=new Set(),L=c.level,method=c.method;
const push=(prompt,answer,id,skill)=>{if(!seen.has(id||prompt)){
 seen.add(id||prompt);const item=p(prompt,answer,id);if(skill)item.skill=skill;out.push(item)
}};
if(c.operation==="mul"){
 for(const a of c.tables)for(let b=1;b<=10;b++){
  push(a+" × "+b+" = ?",a*b,"mul:"+a+":"+b,"Tabuada do "+a);
 }
 return out;
}
if(arithmetic(c.operation)&&(c.operation==="add"||c.operation==="sub"||c.customNumbers)){arithmeticProblems(c,push);return out;}
if(window.MentalExtra.methods[c.operation]){window.MentalExtra.create(c,push);return out;}
if(c.operation==="mul"||c.operation==="div"){
const low=Math.min(c.min,c.max),high=Math.max(c.min,c.max);
for(const a of c.tables)for(let b=low;b<=high;b++){
if(c.exclude.includes(a)||c.exclude.includes(b))continue;
if(c.operation==="div"&&a*b===0)continue;
 const factorA=c.operation==="mul"?a:a*b;
 const factorB=c.operation==="mul"?b:a;
 const answer=c.operation==="mul"?a*b:b;
 if(!allowedByDifficulty(c,factorA,factorB,answer))continue;
if(c.operation==="mul"&&method==="double"&&![2,4,8].includes(b)&&![2,4,8].includes(a))continue;
if(c.operation==="mul"&&method==="comp"&&![8,9,11,12].includes(b)&&![8,9,11,12].includes(a))continue;
const id=c.operation==="mul"&&c.format==="minimal"?[Math.min(a,b),Math.max(a,b)].join("x"):a+"-"+b;
if(c.operation==="mul")push(a+" × "+b+" = ?",a*b,id);
else push((a*b)+" ÷ "+a+" = ?",b,id);
}
if(!c.allCombos&&out.length>c.count){
 if(c.mode==="sequential"||c.mode==="learning"){
  const spaced=[];
  for(let i=0;i<c.count;i++)spaced.push(out[Math.floor((i+.5)*out.length/c.count)]);
  return spaced;
 }
 for(let i=0;i<c.count;i++){
  const j=rand(i,out.length-1);
  [out[i],out[j]]=[out[j],out[i]];
 }
 return out.slice(0,c.count);
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
let items;try{items=generate(cfg)}catch(err){notify(err.message);return false}
if(!items.length){notify("Essa seleção não gerou contas. Ajuste as configurações.");return false}
cycle={id:Date.now(),cycleVersion:2,cfg:clone(cfg),items,
 answered:0,correct:0,wrong:0,skips:0,totalMs:0,firstPassCorrect:0,hints:0,
 reviewLimit:single(cfg.mode)?0:2,created:new Date().toISOString(),last:null,complete:false};
current=null;persist();return true;
}
function persist(){profiles[cfg.operation]=clone(cfg);save(STORE,{cfg,cycle,history,profiles})}
function mobileInputMode(){
 const enabled=mobileView.matches&&page==="workspace";
 $("mobileInputArea").hidden=!enabled||cycle?.complete;
 const isPrime=cfg.operation==="prime"&&cfg.primeType==="check";
 $("mobileKeypad").hidden=isPrime;
 $("mobilePrimeKeys").hidden=!isPrime;
 $("answer").readOnly=enabled&&!mobileNativeKeyboard;
 $("answer").setAttribute("aria-label",enabled&&!mobileNativeKeyboard?"Resposta; use os botões logo abaixo":"Resposta");
 $("mobileKeyboardToggle").textContent=mobileNativeKeyboard?"▦ Teclas rápidas":"⌨ Teclado";
 $("mobileKeyboardToggle").setAttribute("aria-pressed",String(mobileNativeKeyboard));
}
function showPage(name){
page=name;
$("home").hidden=name!=="home";$("workspace").hidden=name!=="workspace";
$("btnBack").hidden=name==="home";$("btnSettings").hidden=name==="home";
$("btnReset").hidden=name==="home";
$("brandSubtitle").textContent=name==="home"?"Treine seu raciocínio matemático":op().name+" · "+modes.find(x=>x.id===cfg.mode).name;
if(name==="workspace"){renderWorkspace();}else renderHome();
mobileInputMode();
window.scrollTo(0,0);
}
function renderHome(){
$("homeCycleCount").textContent=history.length.toLocaleString("pt-BR");
$("homeQuestionCount").textContent=history.reduce((sum,h)=>sum+(Number(h.answered)||0),0).toLocaleString("pt-BR");
$("homeModuleCount").textContent=new Set(history.map(h=>h.operation)).size.toLocaleString("pt-BR");
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
profiles[cfg.operation]=clone(cfg);
const saved=profiles[id];
cfg=saved&&!(saved.quickPreset!=="custom"&&saved.presetVersion<2)?
 normalize(saved):presetConfig(saved?.quickPreset&&saved.quickPreset!=="custom"?saved.quickPreset:"intermediate",id,{...defaultCfg,operation:id,method:"free"});
cfg.operation=id;
if(!M[id].some(x=>x.id===cfg.method))cfg.method="free";
const cycleChanged=!!cycle&&JSON.stringify(cycle.cfg)!==JSON.stringify(cfg);
if(cycleChanged&&cycle&&!cycle.complete&&cycle.answered>0&&cycle.cfg.operation===id&&!confirm("As configurações deste módulo mudaram. Reiniciar o ciclo para aplicá-las?")){cfg=normalize(cycle.cfg);return}
if(!cycle||cycle.complete||cycleChanged){if(!startCycle()){createSettings();openModal("settingsModal");return}}
persist();showPage("workspace");
}
function options(select,items,key){select.replaceChildren();for(const x of items){const o=document.createElement("option");o.value=x.id;o.textContent=x.name;select.append(o)}select.value=key}
function renderWorkspace(){
if(!cycle||cycle.cfg.operation!==cfg.operation){if(!startCycle()){createSettings();openModal("settingsModal");return}}
options($("modeSelect"),modes,cfg.mode);
showMultiplicationPicker();
options($("methodSelect"),M[cfg.operation],cfg.method);
renderMethodCards();
$("moduleTitle").textContent=op().name;$("questionOperation").textContent=op().name.toUpperCase()+" · RESOLVA MENTALMENTE";$("methodNote").textContent=cfg.method==="free"?"Resolva pelo seu próprio caminho.":method().guide[0];
$("methodHelp").disabled=false;
$("btnReview").hidden=!history.some(h=>h.operation===cfg.operation&&
 Array.isArray(h.hard)&&h.hard.some(item=>cfg.operation!=="mul"||multiplicationAllowed(item)));
renderProgress();
if(cycle.complete){renderFinished();return}
showQuestion();
}
function cycleStatus(){
 const all=cycle.items;
 const mastered=all.filter(x=>x.mastered).length;
 const unseen=all.filter(x=>!x.firstSeen).length;
 const reviewed=all.filter(x=>x.firstSeen&&!x.mastered&&!x.done).length;
 const unresolved=all.filter(x=>x.firstSeen&&!x.mastered&&x.done).length;
 return {total:all.length,mastered,unseen,reviewed,unresolved,
   seen:all.length-unseen,
   settled:mastered+unresolved,
   completed:unseen===0&&reviewed===0};
}
function renderProgress(){
 const status=cycleStatus();
 const percentage=status.total?Math.round(status.settled*100/status.total):0;
 const label=status.settled+" de "+status.total+" finalizadas";
 $("progressText").textContent=label;
 $("progressRemaining").textContent=status.unseen+" novas · "+status.reviewed+" revisar";
 $("progressPercent").textContent=percentage+"%";
 $("compactProgress").textContent=percentage+"%";
 $("progressFill").style.width=percentage+"%";
 $("progressTrack").setAttribute("aria-valuenow",percentage);
 $("statCorrect").textContent=cycle.correct;
 $("statWrong").textContent=cycle.wrong;
 $("statAttempts").textContent=cycle.answered;
 $("progressMastered").textContent=status.mastered;
 $("progressPending").textContent=status.unresolved+status.reviewed;
 $("progressDescription").textContent="Questões encerradas neste ciclo";
 $("cycleStage").textContent=status.unseen?"ETAPA 1 · QUESTÕES NOVAS":status.reviewed?"ETAPA 2 · REVISÃO":"CICLO FINALIZADO";
 $("cycleMiniCount").textContent=status.settled+"/"+status.total;
 $("cycleMiniFill").style.width=percentage+"%";
 $("miniMastered").textContent=status.mastered;
 $("miniNew").textContent=status.unseen;
 $("miniReview").textContent=status.reviewed+status.unresolved;
}
function choose(){
 const unseen=cycle.items.filter(x=>!x.firstSeen);
 if(unseen.length){
  if(cfg.mode==="sequential"||cfg.mode==="learning")return unseen[0];
  const candidates=unseen.length>1?unseen.filter(x=>x.id!==cycle.last):unseen;
  return candidates[rand(0,candidates.length-1)];
 }
 if(single(cfg.mode))return null;
 const review=cycle.items.filter(x=>x.firstSeen&&!x.done&&x.reviews<cycle.reviewLimit);
 if(!review.length)return null;
 const candidates=review.length>1?review.filter(x=>x.id!==cycle.last):review;
 if(cfg.mode==="intelligent"){
  let total=0,weights=candidates.map(x=>{const w=Math.max(1,x.wrong*2+(2-x.reviewStreak));total+=w;return w});
  let r=Math.random()*total;
  for(let i=0;i<candidates.length;i++){r-=weights[i];if(r<=0)return candidates[i]}
 }
 return candidates[0];
}
function strategyForQuestion(item){
 if(!item)return "";
 if(cfg.operation!=="sub")return (method()?.guide?.[0]||"Pense em um cálculo equivalente.");
 const match=item.prompt.match(/^(-?[\d.,]+) − (?:\((-?[\d.,]+)\)|(-?[\d.,]+)) = \?$/);
 if(!match)return method().guide[0];
 const a=Number(match[1].replace(",",".")),b=Number((match[2]||match[3]).replace(",","."));
 if(!Number.isFinite(a)||!Number.isFinite(b))return method().guide[0];
 if((cfg.method==="auto"||cfg.method==="free")&&b<0)return "Subtrair um número negativo equivale a somar o seu oposto: pense em "+formatNumber(a)+" + "+formatNumber(-b)+".";
 if((cfg.method==="auto"||cfg.method==="free")&&a<b)return "O resultado será negativo. Calcule primeiro "+formatNumber(b)+" − "+formatNumber(a)+" e depois coloque o sinal de menos.";
 let technique=cfg.method;
 if(technique==="auto"||technique==="free"){
  const d=a-b,near=Math.min(Math.abs(b)%10,10-(Math.abs(b)%10));
  technique=(a>b&&d<=12&&a>=20)?"countup":(a>=20&&b>=10&&near<=4&&near>0)?"equal":(a>=20&&b>=10)?"split":"bridge";
 }
 if(technique==="equal"){
  const rem=((b%10)+10)%10,plus=(10-rem)%10;
  const delta=rem<=plus?-rem:plus;
  if(delta===0)return "Diferença constante: escolha um valor igual para ajustar os dois números, sem alterar a diferença.";
  return "Diferença constante: "+formatNumber(a)+" − "+formatNumber(b)+" pode virar "+
   formatNumber(a+delta)+" − "+formatNumber(b+delta)+". Ajuste ambos pelo mesmo valor.";
 }
 if(technique==="countup")return "Completar pela soma: parta de "+formatNumber(b)+" e descubra quanto falta para chegar a "+formatNumber(a)+".";
 if(technique==="split")return "Subtrair por partes: separe "+formatNumber(b)+" em dezenas e unidades; retire uma parte de cada vez.";
 if(technique==="comp")return "Compensação: aproxime "+formatNumber(b)+" de uma dezena. Depois corrija o resultado pelo valor acrescentado ou retirado.";
 if(technique==="bridge")return "Passagem pela dezena: primeiro retire o suficiente para chegar a uma dezena inteira. Depois retire o restante.";
 return method().guide[0];
}
function showQuestion(){
if(cycle.complete)return renderFinished();
if(current&&!locked&&cycle.items.includes(current)&&!current.done){
}else current=choose();
if(!current)return finish();
cycle.last=current.id;locked=false;started=performance.now();
$("problem").textContent=current.prompt;
$("questionSkill").hidden=!current.skill;
$("questionSkill").textContent=current.skill||"";
$("strategyHintText").hidden=true;
$("btnStrategyHint").setAttribute("aria-expanded","false");
$("strategyHintText").textContent=strategyForQuestion(current);
$("answer").value="";$("answer").disabled=false;$("submitAnswer").disabled=false;$("skipAnswer").disabled=false;
$("answer").placeholder=cfg.operation==="prime"&&cfg.primeType==="check"?"sim ou não":cfg.operation==="fraction"?"Ex.: 3/4":"Sua resposta";
$("answer").setAttribute("inputmode",["prime","fraction"].includes(cfg.operation)?"text":"decimal");
$("feedback").textContent="Digite sua resposta e pressione Enter.";$("feedback").dataset.kind="";
$("trainingArea").hidden=false;$("summaryArea").hidden=true;
renderProgress();persist();
if(cfg.autofocus&&(!mobileView.matches||mobileNativeKeyboard)&&matchMedia("(pointer:fine)").matches)$("answer").focus({preventScroll:true});
mobileInputMode();
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
 const ms=Math.max(0,performance.now()-started);
 const first=!current.firstSeen;
 current.firstSeen=true;
 current.attempts++;cycle.answered++;
 const correct=!skip&&answerEquivalent(raw,current.answer);
 let kind="good",message="";
 if(skip){cycle.skips++;current.streak=0;current.wrong++;current.weight=Math.min(25,current.weight*1.6+1);kind="warn";message="Pulou · "+cleanAnswer(current.answer)}
 else if(correct){
  current.correct++;cycle.correct++;cycle.totalMs+=ms;current.time+=ms;
  current.streak++;current.weight=Math.max(.25,current.weight*.72);message="Correto!";
 }else{
  cycle.wrong++;current.wrong++;cycle.totalMs+=ms;current.time+=ms;
  current.streak=0;current.weight=Math.min(25,current.weight*2.4+1.2);
  kind="bad";message="Resposta: "+cleanAnswer(current.answer);
 }
 if(first){
  if(correct){
   cycle.firstPassCorrect++;
   if(cfg.mode==="learning"){current.reviewStreak=1}
   else{current.mastered=true;current.done=true}
  }
  else if(single(cfg.mode)){current.done=true}
 }else{
  current.reviews++;
  current.reviewStreak=correct?current.reviewStreak+1:0;
  if(current.reviewStreak>=2){current.mastered=true;current.done=true}
  if(current.reviews>=cycle.reviewLimit)current.done=true;
 }
 $("feedback").textContent=message;$("feedback").dataset.kind=kind;
 $("answer").disabled=true;$("submitAnswer").disabled=true;$("skipAnswer").disabled=true;
 renderProgress();persist();
 if(nextTimeout)clearTimeout(nextTimeout);
 nextTimeout=setTimeout(()=>{
  nextTimeout=0;current=null;
  if(cycleStatus().completed)finish();else showQuestion();
 },kind==="bad"?1200:kind==="warn"?950:650);
}
function cleanAnswer(ans){return String(ans).replace(".",",")}
function answerLooksValid(s){return /^-?\d+(?:[.,]\d+)?$/.test(s.trim())||/^(-?\d+)\/([1-9]\d*)$/.test(s.trim())||/^(sim|s|não|nao|n|yes|no)$/i.test(s.trim())}
function finish(){
 if(!cycle.complete){
  cycle.complete=true;
  const status=cycleStatus();
  history.unshift({
   id:cycle.id,operation:cfg.operation,mode:cfg.mode,method:cfg.method,
   level:cfg.quickPreset,ended:new Date().toISOString(),count:status.total,
   mastered:status.mastered,pending:status.unresolved,firstPassCorrect:cycle.firstPassCorrect||0,
   hints:cycle.hints||0,correct:cycle.correct,wrong:cycle.wrong,skips:cycle.skips,
   skills:Object.entries(cycle.items.reduce((acc,item)=>{
    const skill=item.skill||"Geral";const v=acc[skill]||(acc[skill]={total:0,mastered:0});
    v.total++;if(item.mastered)v.mastered++;return acc
   },{})).map(([skill,result])=>({skill,...result})),
   answered:cycle.answered,
   avg:cycle.correct+cycle.wrong?cycle.totalMs/(cycle.correct+cycle.wrong):0,
   hard:cycle.items.filter(x=>!x.mastered||x.wrong||x.attempts>2).map(x=>({
     id:x.id,prompt:x.prompt,answer:x.answer,weight:1,streak:0,attempts:0,wrong:0,
     correct:0,done:false,firstSeen:false,mastered:false,reviews:0,reviewStreak:0,time:0
   })).slice(0,150)
  });
  history=history.slice(0,150);persist();
 }
 renderFinished();
}
function renderFinished(){
 $("trainingArea").hidden=true;$("summaryArea").hidden=false;
 $("mobileInputArea").hidden=true;
 const status=cycleStatus();
 $("summaryTitle").textContent="Ciclo concluído!";
 $("endCount").textContent=status.total;
 $("endCorrect").textContent=status.mastered;
 $("endAccuracy").textContent=status.total?Math.round((cycle.firstPassCorrect||0)*100/status.total)+"%":"—";
 $("endAvg").textContent=cycle.correct+cycle.wrong?(cycle.totalMs/(cycle.correct+cycle.wrong)/1000).toFixed(1).replace(".",",")+"s":"—";
 $("summaryOutcome").textContent=status.mastered+" dominadas · "+status.unresolved+
 " para revisar em outra sessão. Precisão inicial: "+$("endAccuracy").textContent+".";
 $("reviewCompleted").disabled=status.unresolved===0;
 const trend=$("summaryTrend"),prior=history.slice(1).find(h=>
  h.operation===cfg.operation&&h.level===cfg.quickPreset&&h.method===cfg.method&&h.count>0&&
  h.firstPassCorrect!==undefined);
 if(prior){
  const now=status.total?Math.round((cycle.firstPassCorrect||0)*100/status.total):0;
  const previous=Math.round(prior.firstPassCorrect*100/prior.count);
  const delta=now-previous;
  trend.textContent=delta>0?"↑ "+delta+" pontos percentuais de precisão inicial desde o ciclo anterior":
    delta<0?"↓ "+Math.abs(delta)+" pontos percentuais em relação ao ciclo anterior":
    "Mesma precisão inicial do ciclo anterior.";
 }else trend.textContent="Primeiro ciclo comparável registrado nesta configuração.";
 const skillRoot=$("summarySkills");skillRoot.replaceChildren();
 const groups=new Map();
 for(const item of cycle.items){
  const name=item.skill||"Geral",row=groups.get(name)||{mastered:0,total:0};
  row.total++;if(item.mastered)row.mastered++;groups.set(name,row);
 }
 skillRoot.hidden=groups.size<2;
 if(!skillRoot.hidden){
  const head=document.createElement("strong");head.textContent="Domínio por habilidade";skillRoot.append(head);
  for(const [name,counts] of groups){
   const row=document.createElement("div");row.className="summary-skill-row";
   const label=document.createElement("span");label.textContent=name;
   const count=document.createElement("b");count.textContent=counts.mastered+"/"+counts.total;
   row.append(label,count);skillRoot.append(row);
  }
 }
 renderProgress();
}
function startPendingReview(items){
 if(cfg.operation==="mul")items=items.filter(item=>multiplicationAllowed(item));
 if(!items.length){notify("Não há questões pendentes para revisar.");return}
 if(nextTimeout){clearTimeout(nextTimeout);nextTimeout=0}
 cfg.mode="learning";
 cycle={id:Date.now(),cycleVersion:2,reviewSession:true,cfg:clone(cfg),
  items:items.map(x=>({...p(x.prompt,x.answer,x.id),skill:x.skill,weight:2})),
  answered:0,correct:0,wrong:0,skips:0,totalMs:0,firstPassCorrect:0,
  hints:0,reviewLimit:2,created:new Date().toISOString(),last:null,complete:false};
 current=null;persist();showPage("workspace");
}
function changeMode(mode){
if(cfg.mode===mode)return;
if(cycle&&!cycle.complete&&cycle.answered>0&&!confirm("Trocar o modo inicia um novo ciclo. Continuar?")){$("modeSelect").value=cfg.mode;return}
cfg.mode=mode;if(!startCycle()){createSettings();openModal("settingsModal");return}renderWorkspace();
}
function changeMethod(id){
if(cfg.method===id)return;
if(cycle&&!cycle.complete&&cycle.answered>0&&!confirm("Trocar a metodologia inicia um novo ciclo. Continuar?")){$("methodSelect").value=cfg.method;return}
cfg.method=id;if(!startCycle()){createSettings();openModal("settingsModal");return}renderWorkspace();
}
let tutorialIndex=0,tutorialSteps=[],tutorialPractice=null;
function tutorialExample(){
 if(cfg.operation==="sub"){
  if(cfg.method==="auto")return {prompt:"72 − 68 = ?",answer:4};
  if(cfg.method==="equal")return {prompt:"43 − 23 = ?",answer:20};
  if(cfg.method==="split")return {prompt:"73 − 21 = ?",answer:52};
  if(cfg.method==="countup")return {prompt:"72 − 67 = ?",answer:5};
  if(cfg.method==="bridge")return {prompt:"14 − 8 = ?",answer:6};
  if(cfg.method==="comp")return {prompt:"72 − 38 = ?",answer:34};
  return {prompt:"13 − 5 = ?",answer:8};
 }
 if(cfg.operation==="root")return {prompt:"√60 ≈ ? (1 decimal)",answer:7.7};
 if(cfg.operation==="mul")return {prompt:"6 × 8 = ?",answer:48};
 if(cfg.operation==="add")return {prompt:"58 + 27 = ?",answer:85};
 const sample=cycle?.items?.find(item=>!item.done)||cycle?.items?.[0];
 return sample?{prompt:sample.prompt,answer:sample.answer}:null;
}
function updateGuide(){
 const total=tutorialSteps.length+1,stage=tutorialIndex+1;
 $("guideSteps").replaceChildren();
 $("guidePractice").hidden=tutorialIndex!==tutorialSteps.length;
 $("guideStepCounter").textContent="Etapa "+stage+" de "+total;
 $("guideStepPercent").textContent=Math.round(stage/total*100)+"%";
 $("guideStepFill").style.width=(stage/total*100)+"%";
 $("guidePrev").disabled=tutorialIndex===0;
 $("guideNext").textContent=tutorialIndex>=tutorialSteps.length?"Recomeçar":"Próximo";
 if(tutorialIndex<tutorialSteps.length){
  const row=document.createElement("div");row.className="guide-step";
  const num=document.createElement("span");num.textContent=stage;
  const content=document.createElement("p");content.textContent=tutorialSteps[tutorialIndex];
  row.append(num,content);$("guideSteps").append(row);
 }else{
  $("guidePracticeQuestion").textContent=tutorialPractice?("Agora pratique: "+tutorialPractice.prompt):"Experimente o método no exercício seguinte.";
 }
}
function displayGuide(){
 const m=method();
 tutorialIndex=0;tutorialSteps=m.guide.slice();
 tutorialPractice=tutorialExample();
 $("guideTitle").textContent=m.name;
 $("guidePracticeAnswer").value="";$("guidePracticeResult").textContent="";
 $("guideNote").textContent="Use esta explicação como apoio. Você pode construir a resposta de outra maneira.";
 $("guidePracticeAnswer").disabled=!tutorialPractice;
 $("guideCheck").disabled=!tutorialPractice;
 updateGuide();openModal("guideModal");
}
function openModal(id){$(id).hidden=false}
function closeModal(id){$(id).hidden=true}
function notify(msg){$("toast").textContent=msg;$("toast").hidden=false;clearTimeout(notify.timer);notify.timer=setTimeout(()=>$("toast").hidden=true,3500)}
let draftPreset="custom";
let draftBasePreset=null;
let pendingPresetConfig=null;
let advancedOpen=false;
function renderPresetSelection(){
 for(const button of document.querySelectorAll("[data-preset]")){
  button.dataset.active=String(button.dataset.preset===draftPreset);
  button.setAttribute("aria-pressed",String(button.dataset.preset===draftPreset));
 }
 $("presetCurrent").textContent=draftPreset==="custom"?
 (draftBasePreset?PRESET_NAMES[draftBasePreset]+" modificado":"Treino personalizado"):
 PRESET_NAMES[draftPreset]+" · configuração pronta";
}
function fillPresetForm(c){
 for(const k of ["aMin","aMax","bMin","bMax"])$("operand"+k.charAt(0).toUpperCase()+k.slice(1)).value=c[k];
 for(const [id,key] of [["allCombos","allCombos"],["negativeResults","negativeResults"],["negativeOperands","negativeOperands"],["decimalOperands","decimalOperands"],["decimalResults","decimalResults"],["customNumbers","customNumbers"]])$(id).checked=!!c[key];
 for(const k of ["excludeEqual","excludeZero","excludeOne","excludeSmallResults"])$(k).checked=!!c[k];
 $("decimalPlaces").value=String(c.decimalPlaces);
 $("countSetting").value=c.count;
 $("levelSetting").value=c.level;
 $("difficultyPreset").value=c.difficultyPreset;
 updateComboPreview();
}
function createSettings(){
draftPreset=cfg.quickPreset||"custom";
draftBasePreset=cfg.customBase||null;
pendingPresetConfig=null;
renderPresetSelection();
$("advancedSettings").hidden=!advancedOpen;
$("toggleAdvanced").setAttribute("aria-expanded",String(advancedOpen));
const multi=cfg.operation==="mul"||cfg.operation==="div";
const mul=cfg.operation==="mul";
$("quickConfiguration").hidden=mul;
$("advancedSettings").hidden=mul?false:!advancedOpen;
$("difficultyFilters").hidden=mul||!arithmetic(cfg.operation);
$("customRangeConfig").hidden=mul||!multi;
$("numberConfig").hidden=mul;
$("factorExclusions").hidden=mul;
$("factorRange").hidden=mul;
$("countConfig").hidden=mul;
$("comboConfig").hidden=mul;
$("tablesHeading").textContent=mul?"Escolha as tabuadas de 1 a 10":"Tabuadas ou divisores";
$("tablesDescription").textContent=mul?"Cada tabuada selecionada inclui as 10 multiplicações, de ×1 até ×10.":"Selecione os números que deseja trabalhar.";
const personalized=arithmetic(cfg.operation)&&(!multi||cfg.customNumbers);
$("difficultyFilters").hidden=!arithmetic(cfg.operation)||mul;
$("difficultyPreset").value=cfg.difficultyPreset;
for(const key of ["excludeEqual","excludeZero","excludeOne","excludeSmallResults"])$(key).checked=cfg[key];
$("customRangeConfig").hidden=!multi||mul;
$("customNumbers").checked=cfg.customNumbers;
$("operandConfig").hidden=!personalized;
$("numberConfig").hidden=mul||!arithmetic(cfg.operation)||(multi&&!cfg.customNumbers);
$("tableConfig").hidden=!multi||cfg.customNumbers;
$("countConfig").hidden=mul;
$("comboConfig").hidden=true;
$("levelConfig").hidden=arithmetic(cfg.operation);
$("rootConfig").hidden=cfg.operation!=="root";
$("primeConfig").hidden=cfg.operation!=="prime";
$("countSetting").value=cfg.count;$("levelSetting").value=cfg.level;
$("minSetting").value=cfg.min;$("maxSetting").value=cfg.max;
$("formatSetting").value=cfg.format;$("rootSetting").value=cfg.rootType;$("primeSetting").value=cfg.primeType;
$("timerSetting").checked=cfg.showTimer;$("focusSetting").checked=cfg.autofocus;
for(const k of ["aMin","aMax","bMin","bMax"])$("operand"+k.charAt(0).toUpperCase()+k.slice(1)).value=cfg[k];
$("allCombos").checked=cfg.allCombos;
$("negativeResults").checked=cfg.negativeResults;
$("negativeOperands").checked=cfg.negativeOperands;
$("decimalOperands").checked=cfg.decimalOperands;
$("decimalResults").checked=cfg.decimalResults;
$("decimalPlaces").value=String(cfg.decimalPlaces);
$("decimalResults").parentElement.hidden=cfg.operation!=="div";
const grid=$("tablesSetting"),excluded=$("excludeSetting");grid.replaceChildren();excluded.replaceChildren();
for(let n=mul?1:0;n<=(mul?10:12);n++){
for(const [host,values,type] of [[grid,cfg.tables,"t"],[excluded,cfg.exclude,"e"]]){
const label=document.createElement("label");label.className="number-option";
const input=document.createElement("input");input.type="checkbox";input.value=String(n);input.dataset.group=type;input.checked=values.includes(n);
const txt=document.createElement("span");txt.textContent=n;label.append(input,txt);host.append(label);
}
}
updateComboPreview();
}
function settingsDraft(){
 const getNums=group=>[...document.querySelectorAll('input[data-group="'+group+'"]:checked')].map(x=>Number(x.value));
 return normalize({...cfg,...(pendingPresetConfig||{}),level:Number($("levelSetting").value),count:Number($("countSetting").value),
 min:Number($("minSetting").value),max:Number($("maxSetting").value),
 format:$("formatSetting").value,rootType:$("rootSetting").value,primeType:$("primeSetting").value,
 showTimer:$("timerSetting").checked,autofocus:$("focusSetting").checked,
 tables:getNums("t"),exclude:getNums("e"),
 customNumbers:$("customNumbers").checked,
 aMin:$("operandAMin").value,aMax:$("operandAMax").value,
 bMin:$("operandBMin").value,bMax:$("operandBMax").value,
 allCombos:cfg.operation==="mul"?true:
 (cfg.operation==="div"&&!$("customNumbers").checked?cfg.allCombos:$("allCombos").checked),
 negativeResults:$("negativeResults").checked,
 negativeOperands:$("negativeOperands").checked,
 decimalOperands:$("decimalOperands").checked,
 decimalResults:$("decimalResults").checked,
 decimalPlaces:$("decimalPlaces").value,
 quickPreset:draftPreset,
 customBase:draftBasePreset,
 difficultyPreset:$("difficultyPreset").value,
 excludeEqual:$("excludeEqual").checked,excludeZero:$("excludeZero").checked,
 excludeOne:$("excludeOne").checked,excludeSmallResults:$("excludeSmallResults").checked});
}
function updateComboPreview(){
 const c=settingsDraft();
 const preview=$("comboPreview");
 const len=c.operation==="mul"?c.tables.length*10:arithmeticCount(c);
 preview.textContent=len<0?
 "Intervalo amplo · "+(c.allCombos?"reduza o intervalo para treinar todas":"até "+c.count+" questões sorteadas"):
 len.toLocaleString("pt-BR")+" combinações disponíveis"+
 (c.allCombos?" · ciclo completo":(" · até "+Math.min(c.count,len)+" por ciclo"));
 preview.dataset.warning=c.allCombos&&(len<0||len>10000)?"true":"false";
 if(cfg.operation==="mul"||cfg.operation==="div"){
  $("operandConfig").hidden=cfg.operation==="mul"||!c.customNumbers;
  $("tableConfig").hidden=cfg.operation==="mul"?false:c.customNumbers;
  $("countConfig").hidden=cfg.operation==="mul";
  $("numberConfig").hidden=cfg.operation==="mul"||!c.customNumbers;
  $("comboConfig").hidden=true;
 }
 $("decimalPlaces").disabled=!c.decimalOperands&&!c.decimalResults;
}
function applySettings(){
 const next=settingsDraft();
 if(cfg.operation==="mul"&&![...document.querySelectorAll('input[data-group="t"]:checked')].length){
  notify("Selecione pelo menos uma tabuada de 1 a 10.");return;
 }
 if((cfg.operation==="mul"||cfg.operation==="div")&&!next.customNumbers&&!next.tables.length){
  notify("Selecione pelo menos uma tabuada.");return;
 }
 const isSame=(x,y)=>JSON.stringify({...x,showTimer:false,autofocus:false})===JSON.stringify({...y,showTimer:false,autofocus:false});
 const changed=!isSame(cfg,next);
 if(changed&&cycle&&!cycle.complete&&cycle.answered>0&&!confirm("Essas alterações iniciam um novo ciclo. Continuar?"))return;
 const previous=cfg;cfg=next;
 if(changed&&!startCycle()){cfg=previous;createSettings();return}
 persist();closeModal("settingsModal");renderWorkspace();
}
function review(){
 const last=history.find(x=>x.operation===cfg.operation&&Array.isArray(x.hard)&&
 x.hard.some(item=>cfg.operation!=="mul"||multiplicationAllowed(item)));
 if(!last){notify("Ainda não há dificuldades registradas para este módulo.");return}
 if(cycle&&!cycle.complete&&cycle.answered>0&&!confirm("Iniciar revisão e substituir o ciclo atual?"))return;
 startPendingReview(last.hard);
}
function historyView(){
const el=$("historyList");el.replaceChildren();
if(!history.length){const text=document.createElement("p");text.textContent="Nenhum ciclo concluído ainda.";el.append(text)}
for(const h of history.slice(0,30)){
const div=document.createElement("div");div.className="history-record";
const b=document.createElement("b");b.textContent=(operations.find(x=>x.id===h.operation)?.name||h.operation)+" · "+h.count+" questões";
const small=document.createElement("small");
const pct=h.firstPassCorrect!==undefined&&h.count?Math.round(h.firstPassCorrect*100/h.count):
(h.correct+h.wrong?Math.round(h.correct*100/(h.correct+h.wrong))+"%":"—");
small.textContent=new Date(h.ended).toLocaleDateString("pt-BR")+" · "+
(h.mastered??"—")+" dominadas · "+(h.pending??"—")+" pendentes · "+
(pct==="—"?pct:pct+"%")+" precisão inicial";
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
$("mulPickerGrid").addEventListener("change",updateMulPickerCount);
$("mulPickAll").addEventListener("click",()=>{
 document.querySelectorAll("input[data-mul-table]").forEach(x=>x.checked=true);updateMulPickerCount();
});
$("mulPickNone").addEventListener("click",()=>{
 document.querySelectorAll("input[data-mul-table]").forEach(x=>x.checked=false);updateMulPickerCount();
});
$("mulApply").addEventListener("click",()=>{
 const selected=[...document.querySelectorAll("input[data-mul-table]:checked")].map(x=>Number(x.value)).sort((a,b)=>a-b);
 if(!selected.length){notify("Escolha pelo menos uma tabuada.");return}
 if(selected.join(",")===cfg.tables.join(",")){$("multiplicationPicker").open=false;return}
 if(cycle&&!cycle.complete&&cycle.answered>0&&!confirm("Trocar as tabuadas reinicia o ciclo atual. Continuar?"))return;
 const oldCfg=cfg;
 cfg=normalize({...cfg,tables:selected,quickPreset:"custom",customBase:null});
 if(!startCycle()){cfg=oldCfg;return}
 $("multiplicationPicker").open=false;renderWorkspace();
});
$("btnReset").addEventListener("click",()=>{if(cycle&&!cycle.complete&&cycle.answered>0&&!confirm("Recomeçar o ciclo atual?"))return;if(startCycle())renderWorkspace()});
$("methodSelect").addEventListener("change",e=>changeMethod(e.target.value));
$("modeSelect").addEventListener("change",e=>changeMode(e.target.value));
$("methodHelp").addEventListener("click",displayGuide);
$("btnStrategyHint").addEventListener("click",()=>{
 const note=$("strategyHintText");note.hidden=!note.hidden;
 if(!note.hidden&&current&&!current.hintUsed){current.hintUsed=true;cycle.hints=(cycle.hints||0)+1;persist()}
 $("btnStrategyHint").setAttribute("aria-expanded",String(!note.hidden));
});
$("guidePrev").addEventListener("click",()=>{tutorialIndex=Math.max(0,tutorialIndex-1);updateGuide()});
$("guideNext").addEventListener("click",()=>{tutorialIndex=tutorialIndex>=tutorialSteps.length?0:tutorialIndex+1;updateGuide()});
$("guideCheck").addEventListener("click",()=>{
 if(!tutorialPractice)return;
 const correct=answerEquivalent($("guidePracticeAnswer").value,tutorialPractice.answer);
 $("guidePracticeResult").textContent=correct?"Correto! Você aplicou o raciocínio.":"Tente novamente. Releia as etapas se precisar.";
 $("guidePracticeResult").dataset.kind=correct?"good":"bad";
});

function appendMobileKey(key){
 if(page!=="workspace"||locked||$("trainingArea").hidden||!current)return;
 const input=$("answer");
 if(key==="enter"){answer(false);return}
 if(key==="yes"||key==="no"){input.value=key==="yes"?"sim":"não";answer(false);return}
 if(key==="clear")input.value="";
 else if(key==="erase")input.value=input.value.slice(0,-1);
 else if(key==="minus"){input.value=input.value.startsWith("-")?input.value.slice(1):"-"+input.value}
 else if(key==="decimal"){
  if(!/[.,]/.test(input.value))input.value+=input.value?" ,".trim(): "0,";
 }else if(key==="slash"){
  if(!input.value.includes("/"))input.value+="/";
 }else if(/^\d$/.test(key)){
  if(input.value.length<18)input.value+=key;
 }
}
$("mobileKeypad").addEventListener("click",e=>{
 const target=e.target.closest("button[data-key]");
 if(target)appendMobileKey(target.dataset.key);
});
$("mobilePrimeKeys").addEventListener("click",e=>{
 const target=e.target.closest("button[data-key]");
 if(target)appendMobileKey(target.dataset.key);
});
$("mobileKeyboardToggle").addEventListener("click",()=>{
 mobileNativeKeyboard=!mobileNativeKeyboard;
 mobileInputMode();
 if(mobileNativeKeyboard)$("answer").focus({preventScroll:true});
 else $("answer").blur();
});
if(typeof mobileView.addEventListener==="function")mobileView.addEventListener("change",mobileInputMode);
$("answerForm").addEventListener("submit",e=>{e.preventDefault();answer(false)});
$("skipAnswer").addEventListener("click",()=>answer(true));
$("newCycle").addEventListener("click",()=>{
 const same=cycle.items.map(x=>({...p(x.prompt,x.answer,x.id),skill:x.skill}));
 if(!same.length)return;
 if(nextTimeout){clearTimeout(nextTimeout);nextTimeout=0}
 cycle={id:Date.now(),cycleVersion:2,cfg:clone(cfg),items:same,answered:0,correct:0,wrong:0,skips:0,
 totalMs:0,firstPassCorrect:0,hints:0,reviewLimit:single(cfg.mode)?0:2,
 created:new Date().toISOString(),last:null,complete:false};
 current=null;persist();renderWorkspace();
});
$("reviewCompleted").addEventListener("click",()=>startPendingReview(cycle.items.filter(x=>!x.mastered)));
$("summaryHome").addEventListener("click",()=>showPage("home"));
$("summaryAnother").addEventListener("click",()=>showPage("home"));
$("btnReview").addEventListener("click",review);
$("saveSettings").addEventListener("click",applySettings);
$("toggleAdvanced").addEventListener("click",()=>{
 advancedOpen=!advancedOpen;
 $("advancedSettings").hidden=!advancedOpen;
 $("toggleAdvanced").setAttribute("aria-expanded",String(advancedOpen));
});
for(const button of document.querySelectorAll("[data-preset]")){
 button.addEventListener("click",()=>{
  const next=presetConfig(button.dataset.preset,cfg.operation,cfg);
  draftPreset=button.dataset.preset;
  draftBasePreset=draftPreset;
  pendingPresetConfig=next;
  fillPresetForm(next);renderPresetSelection();
  // A opção pronta pode ser iniciada imediatamente, sem passar pelos controles avançados.
  applySettings();
 });
}
$("advancedSettings").addEventListener("input",event=>{
 if(event.target.matches("input,select")){if(draftPreset!=="custom")draftBasePreset=draftPreset;draftPreset="custom";renderPresetSelection()}
});
$("advancedSettings").addEventListener("change",event=>{
 if(event.target.matches("input,select")){if(draftPreset!=="custom")draftBasePreset=draftPreset;draftPreset="custom";renderPresetSelection()}
});
document.querySelectorAll("[data-range]").forEach(button=>button.addEventListener("click",()=>{
 const max=Number(button.dataset.range);
 for(const id of ["operandAMin","operandBMin"])$(id).value="0";
 for(const id of ["operandAMax","operandBMax"])$(id).value=String(max);
 if(draftPreset!=="custom")draftBasePreset=draftPreset;draftPreset="custom";renderPresetSelection();
 updateComboPreview();
}));
const difficultyPresets={
 basic:{excludeEqual:false,excludeZero:false,excludeOne:false,excludeSmallResults:false},
 balanced:{excludeEqual:true,excludeZero:false,excludeOne:false,excludeSmallResults:false},
 hard:{excludeEqual:true,excludeZero:true,excludeOne:true,excludeSmallResults:true}
};
$("difficultyPreset").addEventListener("change",e=>{
 const flags=difficultyPresets[e.target.value];
 if(flags)for(const [k,v] of Object.entries(flags))$(k).checked=v;
 updateComboPreview();
});
for(const key of ["excludeEqual","excludeZero","excludeOne","excludeSmallResults"]){
 $(key).addEventListener("change",()=>{
  const matching=Object.entries(difficultyPresets).find(([name,flags])=>Object.entries(flags).every(([k,v])=>$(k).checked===v));
  $("difficultyPreset").value=matching?.[0]||"custom";
  updateComboPreview();
 });
}
$("settingsModal").addEventListener("change",event=>{
 if(event.target.matches('input,select'))updateComboPreview();
});
$("settingsModal").addEventListener("input",event=>{
 if(event.target.matches('input[type="number"]'))updateComboPreview();
});
$("allTables").addEventListener("click",()=>document.querySelectorAll('input[data-group="t"]').forEach(x=>x.checked=true));
$("noTables").addEventListener("click",()=>document.querySelectorAll('input[data-group="t"]').forEach(x=>x.checked=false));
$("restoreSettings").addEventListener("click",()=>{
 const next=presetConfig("intermediate",cfg.operation,{...defaultCfg,operation:cfg.operation});
 draftPreset="intermediate";draftBasePreset="intermediate";pendingPresetConfig=next;
 fillPresetForm(next);renderPresetSelection();
});
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
$("helpShortcuts").addEventListener("click",()=>openModal("shortcutModal"));
function anyModalOpen(){return [...document.querySelectorAll(".modal-overlay")].some(el=>!el.hidden)}
function shortcutExit(){
 if(page!=="workspace")return;
 if(nextTimeout){clearTimeout(nextTimeout);nextTimeout=0;current=null}
 showPage("home");
}
document.addEventListener("keydown",e=>{
 if(e.key==="Escape"){
  if(anyModalOpen()){for(const modal of document.querySelectorAll(".modal-overlay:not([hidden])"))closeModal(modal.id)}
  else if(page==="workspace")shortcutExit();
  return;
 }
 if(e.altKey||e.ctrlKey||e.metaKey||e.isComposing||e.repeat||anyModalOpen())return;
 const target=e.target;
 const editing=!!target?.closest?.("input,textarea,select,[contenteditable='true']");
 const key=e.key.toLowerCase();
 const textAnswer=cfg.operation==="prime"&&cfg.primeType==="check";
 const numericAnswer=target===$("answer")&&!textAnswer;
 const shortcutsAllowed=!editing||numericAnswer;
 if(key==="?"&&shortcutsAllowed){e.preventDefault();openModal("shortcutModal");return}
 if(page!=="workspace")return;
 // A tecla S funciona mesmo com foco no campo numérico. Respostas em texto ficam protegidas.
 if(key==="s"&&shortcutsAllowed){
  e.preventDefault();shortcutExit();return;
 }
 if(!shortcutsAllowed)return;
 if(key==="p"){e.preventDefault();answer(true)}
 else if(key==="d"){e.preventDefault();$("btnStrategyHint").click()}
 else if(key==="c"){e.preventDefault();$("btnSettings").click()}
 else if(key==="m"){e.preventDefault();$("workspaceOptions").open=!$("workspaceOptions").open}
 else if(key==="g"){e.preventDefault();$("workspaceProgress").open=!$("workspaceProgress").open}
 else if(key==="f"||e.key===" "){e.preventDefault();$("answer").focus({preventScroll:true})}
 else if(e.key==="Enter"&&$("trainingArea").hidden===false){e.preventDefault();answer(false)}
});
function tick(){const t=$("timeDisplay");if(cfg.showTimer&&page==="workspace"&&!cycle?.complete){t.hidden=false;t.textContent=(current&&!locked?((performance.now()-started)/1000).toFixed(1):"0.0")+"s"}else t.hidden=true;tickHandle=requestAnimationFrame(tick)}
if(cycle&&cycle.cfg?.operation!==cfg.operation)cycle=null;
if(cycle&&cycle.complete)current=null;
const panelDefaults={workspaceOptions:true,workspaceProgress:false};
let panels={...panelDefaults,...(read(PANEL_KEY)||{})};
for(const name of ["workspaceOptions","workspaceProgress"]){
 const el=$(name);el.open=!!panels[name];
 el.addEventListener("toggle",()=>{panels[name]=el.open;save(PANEL_KEY,panels)});
}
showPage("home");tick();
})();