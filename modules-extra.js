(function(){
"use strict";
const operations=[
{id:"signs",name:"Regra de sinais",symbol:"±",group:"Fundamentos"},
{id:"units",name:"Conversão de unidades",symbol:"⇄",group:"Fundamentos"},
{id:"tenpower",name:"Potências de 10",symbol:"10ⁿ",group:"Fundamentos"},
{id:"powerlaws",name:"Propriedades de potências",symbol:"aⁿ",group:"Potências e raízes"},
{id:"rootlaws",name:"Propriedades de raízes",symbol:"ⁿ√",group:"Potências e raízes"},
{id:"ratio",name:"Razão e proporção",symbol:"a:b",group:"Aplicações"},
{id:"rulethree",name:"Regra de três",symbol:"∝",group:"Aplicações"}
];
const methods={
fraction:[
{id:"free",name:"Livre",guide:["Resolva operações de frações usando o raciocínio apropriado.","Na soma, iguale denominadores; na multiplicação, multiplique numeradores e denominadores.","Simplifique o resultado sempre que possível."]},
{id:"common",name:"Soma de frações",guide:["Use um denominador comum.","1/2 + 1/4 = 2/4 + 1/4.","Resultado: 3/4."]},
{id:"subtract",name:"Subtração de frações",guide:["Encontre denominadores comuns.","3/4 − 1/2 = 3/4 − 2/4.","Resultado: 1/4."]},
{id:"multiply",name:"Multiplicação de frações",guide:["Multiplique numeradores entre si e denominadores entre si.","2/3 × 3/4 = 6/12.","Simplifique: 1/2."]},
{id:"divide",name:"Divisão de frações",guide:["Multiplique pela fração inversa da segunda.","2/3 ÷ 4/5 = 2/3 × 5/4.","Resultado: 5/6."]},
{id:"simplify",name:"Simplificar frações",guide:["Divida numerador e denominador pelo mesmo divisor comum.","12/18 = 2/3.","Use o máximo divisor comum quando possível."]}
],
signs:[
{id:"free",name:"Livre",guide:["Observe os sinais antes de calcular.","−7 + 3 = −4.","Em multiplicação e divisão, sinais iguais dão positivo e diferentes dão negativo."]},
{id:"add",name:"Soma e subtração",guide:["Na soma, sinais iguais: some módulos e conserve o sinal.","Sinais diferentes: subtraia módulos e mantenha o sinal do maior.","5 − (−3) = 8."]},
{id:"multiply",name:"Multiplicação e divisão",guide:["Primeiro calcule usando os módulos.","Sinais iguais: positivo; sinais diferentes: negativo.","(−4) × (−3) = 12 e (−12) ÷ 3 = −4."]},
{id:"powers",name:"Sinais em potências",guide:["Base negativa com expoente par tem resultado positivo.","Expoente ímpar produz resultado negativo.","(−2)⁴ = 16, mas −2⁴ = −16."]}
],
units:[
{id:"free",name:"Livre",guide:["Observe a unidade de origem e a de destino.","1 km = 1.000 m; 1 hora = 60 minutos.","Nunca misture unidades de grandezas diferentes."]},
{id:"length",name:"Comprimento",guide:["Cada passo entre km, hm, dam, m, dm, cm e mm é um fator de 10.","2,5 m = 250 cm.","Ao converter para unidades menores, aumente o valor numérico."]},
{id:"mass",name:"Massa",guide:["1 kg = 1.000 g e 1 g = 1.000 mg.","0,75 kg = 750 g.","Verifique o sentido da conversão."]},
{id:"volume",name:"Capacidade",guide:["1 L = 1.000 mL.","2,5 L = 2.500 mL.","A grandeza capacidade tem escala própria."]},
{id:"time",name:"Tempo",guide:["1 hora = 60 minutos e 1 minuto = 60 segundos.","2 horas = 120 minutos.","Conversão de tempo não segue sempre potências de 10."]}
],
tenpower:[
{id:"free",name:"Livre",guide:["Expoentes positivos multiplicam por potências de dez.","10³ = 1.000.","10⁻³ = 0,001, e não −1.000."]},
{id:"negative",name:"Expoentes negativos",guide:["10⁻ⁿ é o inverso de 10ⁿ.","10⁻² = 1/100 = 0,01.","Expoente negativo não torna o resultado negativo."]},
{id:"shift",name:"Deslocamento da vírgula",guide:["Multiplicar por 10² desloca a vírgula duas casas à direita.","3,5 × 10² = 350.","Multiplicar por 10⁻² desloca duas casas à esquerda."]}
],
powerlaws:[
{id:"free",name:"Livre",guide:["Use propriedades de expoentes apenas nas condições corretas.","2³ × 2² = 2⁵ = 32.","No produto de mesma base, somam-se os expoentes."]},
{id:"product",name:"Produto de potências",guide:["aᵐ × aⁿ = aᵐ⁺ⁿ.","3² × 3³ = 3⁵.","Não multiplique os expoentes nessa operação."]},
{id:"quotient",name:"Quociente de potências",guide:["aᵐ ÷ aⁿ = aᵐ⁻ⁿ, quando a ≠ 0.","2⁵ ÷ 2² = 2³ = 8.","Subtraia os expoentes."]},
{id:"nested",name:"Potência de potência",guide:["(aᵐ)ⁿ = aᵐⁿ.","(2³)² = 2⁶ = 64.","Multiplique os expoentes."]}
],
rootlaws:[
{id:"free",name:"Livre",guide:["A raiz quadrada principal é não negativa.","√(36 × 4) = 12.","Busque fatores quadrados perfeitos."]},
{id:"product",name:"Produto de radicais",guide:["Para a, b ≥ 0, √(ab) = √a × √b.","√(9 × 16) = 3 × 4 = 12.","Confira as condições antes de aplicar."]},
{id:"quotient",name:"Quociente de radicais",guide:["Para a ≥ 0 e b > 0, √(a/b) = √a / √b.","√(144/9) = 12/3 = 4.","O denominador deve ser positivo."]},
{id:"simplify",name:"Simplificação",guide:["Procure fatores quadrados perfeitos.","√72 = √(36 × 2).","Portanto √72 = 6√2; treine identificar o coeficiente."]}
],
ratio:[
{id:"free",name:"Livre",guide:["Uma razão compara grandezas por divisão.","6:9 = 2:3.","Frações equivalentes formam proporções."]},
{id:"simplify",name:"Simplificar razão",guide:["Encontre um divisor comum dos dois termos.","12:18 = 2:3.","Divida ambos os termos por 6."]},
{id:"equivalent",name:"Razões equivalentes",guide:["Multiplique ou divida os dois termos pelo mesmo número não nulo.","2:3 = 8:12.","Se 2/3 = 8/x, então x = 12."]}
],
rulethree:[
{id:"free",name:"Livre",guide:["Descubra se as grandezas são diretas ou inversas.","3 itens custam R$ 18; 5 custam R$ 30.","Identifique relações antes de calcular."]},
{id:"simple",name:"Simples direta",guide:["As duas grandezas crescem ou diminuem juntas, na mesma proporção.","3 cadernos custam R$ 18; 5 custam R$ 30.","Use o valor por unidade."]},
{id:"inverse",name:"Simples inversa",guide:["Quando uma grandeza sobe, a outra diminui.","4 trabalhadores levam 12 dias; 6 levam 8 dias.","A produtividade individual é considerada constante."]},
{id:"compound",name:"Composta",guide:["Relacione três ou mais grandezas.","2 máquinas, 3 h/dia, por 5 dias produzem 120 peças.","4 máquinas, 6 h/dia, por 5 dias produzem 480 peças, com produtividade constante."]}
]};
function create(c,push){
const n=c.count,L=c.level,m=c.method;
const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const sup=x=>String(x).replace(/\d/g,d=>"⁰¹²³⁴⁵⁶⁷⁸⁹"[Number(d)]);
const signed=x=>x<0?"("+x+")":String(x);
const display=x=>new Intl.NumberFormat("pt-BR",{useGrouping:false,maximumFractionDigits:12}).format(x);
const add=(prompt,result,i)=>push(prompt,result,c.operation+"-"+i);
if(c.operation==="fraction"){
const gcd=(a,b)=>b?gcd(b,a%b):a;
const reduced=(a,b)=>{const d=gcd(Math.abs(a),Math.abs(b));return (a/d)+"/"+(b/d)};
for(let i=0;i<n;i++){
 const a=rand(1,7),b=rand(2,9),d=rand(2,8),e=rand(2,9),kind=m==="common"?0:m==="subtract"?1:m==="multiply"?2:m==="divide"?3:m==="simplify"?4:i%5;
 if(kind===0)add(a+"/"+b+" + "+d+"/"+e+" = ?",reduced(a*e+d*b,b*e),i);
 if(kind===1)add(a+"/"+b+" − "+d+"/"+e+" = ?",reduced(a*e-d*b,b*e),i);
 if(kind===2)add(a+"/"+b+" × "+d+"/"+e+" = ?",reduced(a*d,b*e),i);
 if(kind===3)add(a+"/"+b+" ÷ "+d+"/"+e+" = ?",reduced(a*e,b*d),i);
 if(kind===4){const k=rand(2,8);add((a*k)+"/"+(b*k)+" = ? (fração simplificada)",reduced(a,b),i)}
}return;
}
if(c.operation==="signs"){
for(let i=0;i<n;i++){
 const R=[10,30,100][L-1],kind=m==="add"?i%2:m==="multiply"?2+i%2:m==="powers"?4:i%5;
 const a=rand(-R,R),b=rand(-R,R);
 if(kind===0)add(signed(a)+" + "+signed(b)+" = ?",a+b,i);
 if(kind===1)add(signed(a)+" − "+signed(b)+" = ?",a-b,i);
 if(kind===2)add(signed(a)+" × "+signed(b)+" = ?",a*b,i);
 if(kind===3){const divisor=b||2;add(signed(a*divisor)+" ÷ "+signed(divisor)+" = ?",a,i)}
 if(kind===4){const base=rand(-8,-2),exponent=rand(2,L+3);add("("+base+")"+sup(exponent)+" = ?",base**exponent,i)}
}return;
}
if(c.operation==="units"){
const sets={length:[["km",1000],["hm",100],["dam",10],["m",1],["dm",.1],["cm",.01],["mm",.001]],mass:[["kg",1000],["g",1],["mg",.001]],volume:[["L",1000],["mL",1]],time:[["h",3600],["min",60],["s",1]]};
const kinds=m==="free"?Object.keys(sets):[m];
for(let i=0;i<n;i++){
const set=sets[kinds[i%kinds.length]],a=set[i%set.length],b=set[(i+1+Math.floor(i/set.length))%set.length];
if(a[0]===b[0])continue;
const amount=rand(1,[20,100,300][L-1])/(L===1?1:L===2?10:100);
add(display(amount)+" "+a[0]+" = ? "+b[0],Number((amount*a[1]/b[1]).toPrecision(12)),i);
}return;
}
if(c.operation==="tenpower"){
for(let i=0;i<n;i++){
const e=m==="negative"?-rand(1,L+3):rand(-(L+2),L+3);
if(m==="shift"||i%2===1){
 const a=rand(11,99)/10;
 add(display(a)+" × 10"+sup(e)+" = ?",Number((a*10**e).toPrecision(12)),i);
}else add("10"+sup(e)+" = ?",Number((10**e).toPrecision(12)),i);
}return;
}
if(c.operation==="powerlaws"){
for(let i=0;i<n;i++){
const a=rand(2,L===1?4:6),x=rand(1,3),y=rand(1,3),kind=m==="product"?0:m==="quotient"?1:m==="nested"?2:i%3;
if(kind===0)add(a+sup(x)+" × "+a+sup(y)+" = ?",a**(x+y),i);
if(kind===1)add(a+sup(x+y)+" ÷ "+a+sup(y)+" = ?",a**x,i);
if(kind===2)add("("+a+sup(x)+")"+sup(y)+" = ?",a**(x*y),i);
}return;
}
if(c.operation==="rootlaws"){
for(let i=0;i<n;i++){
const a=rand(2,L===1?10:20),b=rand(2,L===1?8:12),kind=m==="product"?0:m==="quotient"?1:m==="simplify"?2:i%3;
if(kind===0)add("√("+a*a+" × "+b*b+") = ?",a*b,i);
if(kind===1)add("√("+a*a*b*b+" ÷ "+b*b+") = ?",a,i);
if(kind===2){const factor=[2,3,5,6,7][i%5];add("√"+a*a*factor+" = ?√"+factor,a,i)}
}return;
}
if(c.operation==="ratio"){
for(let i=0;i<n;i++){
const a=rand(1,12),b=rand(2,12),k=rand(2,7),kind=m==="simplify"?0:m==="equivalent"?1:i%2;
if(kind===0)add((a*k)+":"+(b*k)+" = ?:"+b,a,i);
else add(a+":"+b+" = "+(a*k)+":?",b*k,i);
}return;
}
if(c.operation==="rulethree"){
for(let i=0;i<n;i++){
const kind=m==="simple"?0:m==="inverse"?1:m==="compound"?2:i%3;
const u=rand(2,8),v=rand(2,8),k=rand(2,L===1?3:5);
if(kind===0)add(u+" itens custam R$ "+u*v+". "+(u*k)+" itens custam quanto? (R$)",u*v*k,i);
if(kind===1)add((u*k)+" trabalhadores fazem uma obra em "+v+" dias. "+u+" trabalhadores levam quantos dias?",v*k,i);
if(kind===2){
 const machines=rand(2,5),hours=rand(2,6),days=rand(2,6),per=rand(2,5),pieces=machines*hours*days*per;
 add(machines+" máquinas, "+hours+" h/dia, "+days+" dias → "+pieces+" peças. "+(machines*k)+" máquinas, "+hours+" h/dia, "+(days*2)+" dias → ? peças",pieces*k*2,i);
}
}return;
}
}
window.MentalExtra={operations,methods,create};
})();