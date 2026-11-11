/* Gauss Lab — conjuntos essenciais orientados por habilidades */
(function(){
"use strict";
const stages={
 add:[
  {id:"starter",name:"Complementos de 10",desc:"Partes que completam 10",hint:"Procure quanto falta para chegar a 10."},
  {id:"doubles",name:"Dobros",desc:"2+2 até 9+9",hint:"Recupere o dobro sem contar um a um."},
  {id:"near",name:"Quase dobros",desc:"Um a mais que o dobro",hint:"Faça o dobro de um dos números e acrescente ou retire 1."},
  {id:"bridge",name:"Passagem pelo 10",desc:"Forme uma dezena primeiro",hint:"Separe uma parcela para completar 10."},
  {id:"tens",name:"Dezenas",desc:"Somar dezenas inteiras",hint:"Some as dezenas primeiro."},
  {id:"split",name:"Decomposição",desc:"Somar dezenas e unidades",hint:"Separe as dezenas e as unidades, depois reúna."},
  {id:"all",name:"Revisão essencial",desc:"Mistura das habilidades",hint:"Identifique a estratégia mais simples antes de responder."}
 ],
 sub:[
  {id:"starter",name:"Diferenças básicas",desc:"Diferenças pequenas sem zero",hint:"Relacione com a adição: quanto falta do menor ao maior?"},
  {id:"ten",name:"Complementos de 10",desc:"10 menos números de 2 a 9",hint:"Lembre-se dos pares que somam 10."},
  {id:"bridge",name:"Passagem pelo 10",desc:"Decompor para chegar ao 10",hint:"Retire primeiro o necessário para chegar a uma dezena."},
  {id:"countup",name:"Completar pela soma",desc:"Números próximos",hint:"Conte os saltos do menor número até o maior."},
  {id:"equal",name:"Diferença constante",desc:"Ajustar os dois números",hint:"Retire ou acrescente o mesmo valor aos dois termos."},
  {id:"comp",name:"Compensação",desc:"Aproximar das dezenas",hint:"Arredonde o subtraendo e corrija o ajuste."},
  {id:"all",name:"Revisão essencial",desc:"Mistura das estratégias",hint:"Escolha o atalho mais eficaz para cada conta."}
 ],
 mul:[
  {id:"starter",name:"Dobros e múltiplos de 5",desc:"Tabuadas do 2 e do 5",hint:"Para ×2, dobre. Para ×5, use metade de ×10. As regras de ×0, ×1 e ×10 são ensinadas sem exercícios repetitivos."},
  {id:"double",name:"Dobros sucessivos",desc:"Tabuadas do 4 e do 8",hint:"Para ×4, dobre duas vezes. Para ×8, dobre três."},
  {id:"relations",name:"Famílias 3, 6 e 9",desc:"Relações entre as tabuadas",hint:"×6 é o dobro de ×3; ×9 pode ser ×10 menos um grupo."},
  {id:"seven",name:"Tabuada do 7",desc:"Consolidação dos fatos",hint:"Relacione 7×8 a 7×4 dobrado ou recupere diretamente."},
  {id:"all",name:"Revisão essencial",desc:"Tabuadas de 2 a 9",hint:"Recupere o resultado sem contar um a um."},
  {id:"custom",name:"Minha seleção",desc:"Escolha as tabuadas",hint:"Treine apenas as tabuadas que marcou."}
 ],
 div:[
  {id:"starter",name:"Divisões por 2 e 5",desc:"Operação inversa",hint:"Pense: divisor × qual número dá o dividendo?"},
  {id:"double",name:"Divisões por 4 e 8",desc:"Família dos dobros",hint:"Use as tabuadas do 4 e do 8 como operações inversas."},
  {id:"relations",name:"Divisões por 3, 6 e 9",desc:"Famílias relacionadas",hint:"Use a multiplicação correspondente para encontrar o quociente."},
  {id:"seven",name:"Divisões por 7",desc:"Consolidação",hint:"Lembre-se da tabuada do 7 e encontre o fator que falta."},
  {id:"all",name:"Revisão essencial",desc:"Divisores de 2 a 9",hint:"Encontre o fator desconhecido sem dividir repetidamente."},
  {id:"custom",name:"Minha seleção",desc:"Configurações avançadas",hint:"Use os divisores configurados."}
]};
const families={starter:[2,5],double:[4,8],relations:[3,6,9],seven:[7],all:[2,3,4,5,6,7,8,9]};
function label(op,id){return stages[op]?.find(s=>s.id===id)||stages[op]?.[0]}
function make(op,id){
 const out=[],seen=new Set();
 const add=(a,b,skill)=>{
  if(!Number.isFinite(a)||!Number.isFinite(b)||a<=0||b<=0)return;
  if(op==="sub"&&(a<=b||a===b))return;
  if((op==="mul"||op==="div")&&(a===1||a===10||b===1||b===10))return;
  const prompt=op==="add"?a+" + "+b+" = ?":op==="sub"?a+" − "+b+" = ?":
   op==="mul"?a+" × "+b+" = ?":(a*b)+" ÷ "+a+" = ?";
  const answer=op==="add"?a+b:op==="sub"?a-b:op==="mul"?a*b:b;
  const key=prompt;if(seen.has(key))return;seen.add(key);
  out.push({prompt,answer,id:op+":"+a+":"+b,skill:skill||label(op,id)?.name||"Essencial"});
 };
 const chosen=id==="all"?stages[op].filter(x=>x.id!=="all"&&x.id!=="custom").map(x=>x.id):[id];
 if(op==="mul"||op==="div"){
  const tables=families[id]||families.all;
  for(const a of tables)for(let b=2;b<=9;b++)add(a,b,"Tabuada do "+a);
  return out;
 }
 for(const stage of chosen){
  const name=label(op,stage)?.name;
  if(op==="add"){
   if(stage==="starter")for(let a=2;a<=8;a++)add(a,10-a,name);
   if(stage==="doubles")for(let a=2;a<=9;a++)add(a,a,name);
   if(stage==="near")for(let a=2;a<=8;a++)add(a,a+1,name);
   if(stage==="bridge")for(let a=6;a<=9;a++)for(let b=3;b<=9;b++)if(a+b>10)add(a,b,name);
   if(stage==="tens")for(let a=2;a<=7;a++)for(let b=2;b<=7;b++)add(a*10,b*10,name);
   if(stage==="split")for(const a of [23,27,34,46,58,67,75,86])for(const b of [14,19,25,36,47])add(a,b,name);
  }else if(op==="sub"){
   if(stage==="starter")for(let a=3;a<=10;a++)for(let b=2;b<a;b++)add(a,b,name);
   if(stage==="ten")for(let b=2;b<=9;b++)add(10,b,name);
   if(stage==="bridge")for(let a=11;a<=19;a++)for(let b=3;b<=9;b++)if(a%10<b)add(a,b,name);
   if(stage==="countup")for(const a of [23,35,42,53,62,71,84,95])for(let d=2;d<=9;d++)add(a,a-d,name);
   if(stage==="equal")for(const a of [33,43,52,64,75,83,94])for(const b of [17,23,28,39,46,57,68])if(b<a&&b%10!==0)add(a,b,name);
   if(stage==="comp")for(const a of [42,57,63,74,85,96])for(const b of [19,29,38,49,58,69])if(b<a)add(a,b,name);
  }
 }
 return out;
}
function valid(op,item,selected){
 const text=String(item?.prompt||"");
 let m;
 if(op==="mul"){m=text.match(/^(\d+) × (\d+) = \?$/);return !!m&&+m[1]>=2&&+m[1]<=9&&+m[2]>=2&&+m[2]<=9&&(!selected||selected.includes(+m[1]))&&Number(item.answer)===+m[1]*+m[2]}
 if(op==="div"){m=text.match(/^(\d+) ÷ (\d+) = \?$/);return !!m&&+m[2]>=2&&+m[2]<=9&&Number.isInteger(+m[1]/+m[2])&&+m[1]/+m[2]>=2&&+m[1]/+m[2]<=9&&(!selected||selected.includes(+m[2]))&&Number(item.answer)===+m[1]/+m[2]}
 if(op==="sub"){m=text.match(/^(-?[\d.,]+) − (?:\((-?[\d.,]+)\)|(-?[\d.,]+)) = \?$/);if(!m)return false;const a=Number(m[1].replace(",",".")),b=Number((m[2]||m[3]).replace(",","."));return a!==0&&b!==0&&a!==b}
 if(op==="add"){m=text.match(/^(-?[\d.,]+) \+ (?:\((-?[\d.,]+)\)|(-?[\d.,]+)) = \?$/);if(!m)return false;return Number(m[1].replace(",","."))!==0&&Number((m[2]||m[3]).replace(",","."))!==0}
 return true;
}
window.GaussEssentials={stages,families,label,make,valid};
})();