import { useState, useEffect } from "react";

const HOUSES = [
  {id:"stark",    name:"Stark",    emoji:"🐺", homeland:"Der Norden",      hSize:13, needed:7, color:"#8fa8b8", bg:"rgba(143,168,184,0.12)", border:"rgba(143,168,184,0.5)"},
  {id:"baratheon",name:"Baratheon",emoji:"🦌", homeland:"Die Sturmlande",  hSize:4,  needed:4, color:"#f0c040", bg:"rgba(240,192,64,0.12)",  border:"rgba(240,192,64,0.5)"},
  {id:"lannister",name:"Lannister",emoji:"🦁", homeland:"Die Westerlande", hSize:5,  needed:5, color:"#c0392b", bg:"rgba(192,57,43,0.12)",   border:"rgba(192,57,43,0.55)"},
  {id:"tyrell",   name:"Tyrell",   emoji:"🌾", homeland:"Die Weite",       hSize:7,  needed:7, color:"#4caf6e", bg:"rgba(76,175,110,0.12)",  border:"rgba(76,175,110,0.5)"},
  {id:"martell",  name:"Martell",  emoji:"🌞", homeland:"Dorne",           hSize:4,  needed:4, color:"#e07b30", bg:"rgba(224,123,48,0.12)",  border:"rgba(224,123,48,0.5)"},
];

const ice = "#b8d4e2";
const iceDim = "rgba(184,212,226,0.18)";
const FT = '"Palatino Linotype","Book Antiqua",Palatino,Georgia,serif';
const FS = '"Garamond","Times New Roman",Georgia,serif';
const FB = '"Helvetica Neue",Arial,sans-serif';
const BG = "linear-gradient(145deg,#0a0d14 0%,#111620 40%,#0c0f18 70%,#080b10 100%)";
const CHARGE = 2200;

const CSS = `
* { box-sizing: border-box; }
body { margin: 0; }
.rg-wrap  { max-width: 520px;  width: 100%; margin: 0 auto; padding: 28px 16px; }
.rg-pass  { max-width: 480px;  width: 100%; }
.rg-card  { max-width: 420px;  width: 100%; }
.rg-btn   { max-width: 480px;  width: 100%; }
@media (min-width: 768px) {
  .rg-wrap { max-width: 700px; padding: 40px 32px; }
  .rg-pass { max-width: 600px; }
  .rg-card { max-width: 500px; }
  .rg-btn  { max-width: 500px; }
}
@media (min-width: 1100px) {
  .rg-wrap { max-width: 860px; padding: 48px 48px; }
  .rg-pass { max-width: 700px; }
  .rg-card { max-width: 560px; }
  .rg-btn  { max-width: 560px; }
}
@keyframes iceCharge {
  0%   { transform:rotate(0deg);   opacity:.25; }
  75%  { transform:rotate(270deg); opacity:.9;  }
  100% { transform:rotate(360deg); opacity:1;   }
}
@keyframes iceReady {
  0%,100% { filter:brightness(1.2); }
  50%     { filter:brightness(1.6); }
}
@keyframes iceBlob1 {
  0%,100% { transform:translate(10%,20%) scale(1);   opacity:.6;  }
  50%     { transform:translate(60%,60%) scale(1.3); opacity:.85; }
}
@keyframes iceBlob2 {
  0%,100% { transform:translate(80%,70%) scale(1.1); opacity:.5; }
  50%     { transform:translate(20%,10%) scale(.85); opacity:.8; }
}
@keyframes glowPulse {
  0%,100% { box-shadow:0 0 16px 2px var(--hc),0 0 38px 5px var(--hs); }
  50%     { box-shadow:0 0 30px 8px var(--hc),0 0 65px 16px var(--hs); }
}
@keyframes cardFlip {
  0%  { transform:rotateY(0deg);  }
  50% { transform:rotateY(90deg); }
  100%{ transform:rotateY(0deg);  }
}
.ice-btn {
  position:relative; overflow:hidden; width:100%; padding:15px;
  border:none; border-radius:8px; cursor:pointer;
  font-size:15px; letter-spacing:2px; font-weight:700;
  color:#e8f4fa; z-index:0; background:transparent;
}
.ice-btn:disabled { cursor:not-allowed; opacity:.3; }
.ice-btn::before {
  content:''; position:absolute; inset:-60%; width:220%; height:220%;
  background:conic-gradient(from 0deg,transparent 0deg,#1a3040 40deg,#2e6080 80deg,#5090b0 120deg,#88bcd0 160deg,#b8d4e2 200deg,#daeef8 220deg,#b8d4e2 240deg,#6aaac8 280deg,#2e6080 320deg,transparent 360deg);
  animation:iceCharge ${CHARGE}ms ease-out 1 forwards; z-index:-2;
}
.ice-btn.charged::before { animation:iceReady 2.5s ease-in-out infinite; opacity:1; }
.ice-btn .b1 { position:absolute;border-radius:50%;z-index:-1;pointer-events:none;width:60%;height:160%;background:radial-gradient(ellipse,rgba(184,212,226,0.5) 0%,transparent 70%);animation:iceBlob1 4s ease-in-out infinite; }
.ice-btn .b2 { position:absolute;border-radius:50%;z-index:-1;pointer-events:none;width:70%;height:140%;background:radial-gradient(ellipse,rgba(100,180,220,0.35) 0%,transparent 65%);animation:iceBlob2 5s ease-in-out infinite; }
.ice-btn .bl { position:absolute;inset:2px;border-radius:6px;z-index:0;background:rgba(8,12,20,0.72);backdrop-filter:blur(10px); }
.ice-btn .lb { position:relative;z-index:1; }
.cg { animation:glowPulse 3s ease-in-out infinite; }
.cf { animation:cardFlip .5s ease-in-out forwards; }
input::placeholder { color:rgba(184,212,226,0.2); }
input:focus { border-color:rgba(184,212,226,0.35) !important; outline:none; }
`;

function injectCSS() {
  if (document.getElementById("rg-css")) return;
  const s = document.createElement("style");
  s.id = "rg-css"; s.textContent = CSS;
  document.head.appendChild(s);
}

function minTerr(n) { return ({2:29,3:26,4:22,5:18})[n] || 22; }
function getHouses(n) { return HOUSES.slice(0, n<=3?3:n===4?4:5); }

// ── TRANSLATIONS ─────────────────────────────────────────────────
const T = {
  es:{
    title:"RISK", sub:"GAME OF THRONES", mini:"Misiones Secretas",
    numP:"Número de Jugadores", playerN:"Jugador", ph:function(i){return "Nombre del jugador "+(i+1)+"...";},
    homeland:"Tierra natal", territories:"territorios",
    note:"Tyrell desde 4 · Martell desde 5",
    deal:"REPARTIR MISIONES", enterAll:"Ingresá el nombre de todos los jugadores",
    passTo:"Pasá el celular a",
    tap:"TOCA PARA REVELAR", onlySee:function(n){return "Solo "+n+" debe ver la pantalla";},
    secret:"TU MISIÓN SECRETA",
    note2:"Guardá tu misión en secreto. Podés negociar, mentir y aliarte.",
    next:"Pasar al Siguiente", start:"¡A Conquistar Westeros!",
    war1:"¡QUE COMIENCE", war2:"LA GUERRA!",
    warDesc:"Todos conocen su misión. Negociá, mentí y traicioná. ¡El Trono de Hierro aguarda!",
    playersL:"Jugadores", houseL:"Casa", newGame:"Nueva Partida",
    seeMissions:"Ver Misiones", revTitle:"Misiones Reveladas", close:"Cerrar",
    sealWarn:"Estás rompiendo el sello real.",
    sealSub:"Si lo hacés, la partida terminará y el Juego de Tronos volverá a empezar.",
    sealConfirm:"Romper el sello", sealCancel:"Volver",
    hw:"CASA",
  },
  en:{
    title:"RISK", sub:"GAME OF THRONES", mini:"Secret Missions",
    numP:"Number of Players", playerN:"Player", ph:function(i){return "Player "+(i+1)+" name...";},
    homeland:"Homeland", territories:"territories",
    note:"Tyrell from 4 · Martell from 5",
    deal:"DEAL MISSIONS", enterAll:"Enter the name of all players",
    passTo:"Pass the phone to",
    tap:"TAP TO REVEAL", onlySee:function(n){return "Only "+n+" should see the screen";},
    secret:"YOUR SECRET MISSION",
    note2:"Keep your mission secret. Negotiate, lie and ally to achieve it.",
    next:"Pass to Next Player", start:"Conquer Westeros!",
    war1:"LET THE", war2:"WAR BEGIN!",
    warDesc:"Everyone knows their mission. Negotiate, lie and betray. The Iron Throne awaits!",
    playersL:"Players", houseL:"House", newGame:"New Game",
    seeMissions:"See Missions", revTitle:"Revealed Missions", close:"Close",
    sealWarn:"You are breaking the royal seal.",
    sealSub:"If you do, the game will end and the Game of Thrones will begin again.",
    sealConfirm:"Break the seal", sealCancel:"Go back",
    hw:"HOUSE",
  },
  de:{
    title:"RISK", sub:"GAME OF THRONES", mini:"Geheimmissionen",
    numP:"Anzahl der Spieler", playerN:"Spieler", ph:function(i){return "Name von Spieler "+(i+1)+"...";},
    homeland:"Heimatland", territories:"Gebiete",
    note:"Tyrell ab 4 · Martell ab 5",
    deal:"MISSIONEN AUSTEILEN", enterAll:"Bitte alle Spielernamen eingeben",
    passTo:"Gib das Handy weiter an",
    tap:"TIPPEN ZUM AUFDECKEN", onlySee:function(n){return "Nur "+n+" darf den Bildschirm sehen";},
    secret:"DEINE GEHEIMMISSION",
    note2:"Halte deine Mission geheim. Verhandle, lüge und schmied Allianzen.",
    next:"Weiter zum nächsten", start:"Westeros erobern!",
    war1:"DER KRIEG", war2:"BEGINNT!",
    warDesc:"Alle kennen ihre Mission. Verhandeln, lügen und verraten ist erlaubt!",
    playersL:"Spieler", houseL:"Haus", newGame:"Neues Spiel",
    seeMissions:"Missionen anzeigen", revTitle:"Aufgedeckte Missionen", close:"Schließen",
    sealWarn:"Du brichst das königliche Siegel.",
    sealSub:"Wenn du das tust, endet die Partie und das Spiel beginnt von vorn.",
    sealConfirm:"Siegel brechen", sealCancel:"Zurück",
    hw:"HAUS",
  }
};

// ── MISSIONS ─────────────────────────────────────────────────────
function getMission(id, houseId, np, lang) {
  const L = lang==="en", DE = lang==="de";
  const min = minTerr(np);
  const ph = HOUSES.find(function(h){return h.id===houseId;}) || HOUSES[0];

  function ex(base){ return Math.max(0, min-base); }
  function xtra(base){
    const x = ex(base);
    if (!x) return "";
    return L ? " + "+x+" additional territories anywhere." : DE ? " + "+x+" weitere Gebiete beliebig." : " + "+x+" territorios adicionales en Westeros.";
  }
  function tot(base){
    return L ? " Total: "+min+" territories." : DE ? " Gesamt: "+min+" Gebiete." : " Total: "+min+" territorios.";
  }

  // homeland
  if (id.indexOf("homeland_")===0) {
    const needed = ph.needed;
    const base = needed + 4;
    const hDesc = needed===ph.hSize
      ? (L?"all of "+ph.homeland : DE?"ganz "+ph.homeland : ph.homeland+" completa")
      : (L?needed+" of "+ph.hSize+" territories of "+ph.homeland : DE?needed+" von "+ph.hSize+" Gebieten in "+ph.homeland : needed+" de "+ph.hSize+" territorios de "+ph.homeland);
    return {
      title: L?"Lord of His Land":DE?"Herr seines Landes":"Señor de Su Tierra",
      desc: (L?"Control "+hDesc+" + all of Die Kronlande":DE?"Kontrolliere "+hDesc+" + ganz Die Kronlande":"Controla "+hDesc+" + Die Kronlande completa")+xtra(base)+tot(base)
    };
  }

  // elimination
  if (id.indexOf("elim_")===0) {
    const th = HOUSES.find(function(h){return h.id===id.replace("elim_","");}) || HOUSES[1];
    return {
      title: L?"Eliminate House "+th.name:DE?"Haus "+th.name+" vernichten":"Exterminar Casa "+th.name,
      desc: L?"Eliminate all armies of House "+th.name+" AND control all of "+th.homeland+" + all of Die Kronlande. If already eliminated: conquer "+min+" territories instead."
          : DE?"Vernichte alle Armeen von Haus "+th.name+" UND kontrolliere ganz "+th.homeland+" + ganz Die Kronlande. Falls bereits eliminiert: "+min+" Gebiete beliebig."
          : "Eliminá todos los ejércitos de la Casa "+th.name+" Y controlá "+th.homeland+" completa + Die Kronlande completa. Si ya fue eliminada: conquistá "+min+" territorios libres."
    };
  }

  // general pool
  const pool = {
    conquista_a: {
      title: L?"Grand Conqueror":DE?"Großer Eroberer":"Gran Conquistador",
      desc: (L?"Control "+min+" territories anywhere in Westeros.":DE?"Kontrolliere "+min+" beliebige Gebiete in Westeros.":"Controla "+min+" territorios en cualquier parte de Westeros.")
    },
    conquista_b: {
      title: L?"Iron Conqueror":DE?"Eiserner Eroberer":"Conquistador de Hierro",
      desc: (L?"Control "+(min-2)+" territories, each with at least 2 armies.":DE?"Kontrolliere "+(min-2)+" Gebiete, je mit mind. 2 Armeen.":"Controla "+(min-2)+" territorios, cada uno con al menos 2 ejércitos.")
    },
    rey: {
      title: L?"King of the Seven Kingdoms":DE?"König der Sieben Königslande":"Rey de los Siete Reinos",
      desc: (L?"Control all of Die Kronlande (Königsmund, Klauenhorn, Drachenstein, Königswald)":DE?"Kontrolliere ganz Die Kronlande (Königsmund, Klauenhorn, Drachenstein, Königswald)":"Controla Die Kronlande completa (Königsmund, Klauenhorn, Drachenstein, Königswald)")+xtra(4)+tot(4)
    },
    centro: {
      title: L?"Heart of the Realm":DE?"Herz des Reiches":"Corazón del Reino",
      desc: (L?"Control all of Die Flusslande + all of Die Kronlande":DE?"Kontrolliere ganz Die Flusslande + ganz Die Kronlande":"Controla Die Flusslande completa + Die Kronlande completa")+xtra(9)+tot(9)
    },
    norte: {
      title: L?"The North Remembers":DE?"Der Norden erinnert sich":"El Norte Recuerda",
      desc: (L?"Control Winterfell + 8 territories of Der Norden + all of Die Kronlande":DE?"Kontrolliere Winterfell + 8 Gebiete in Der Norden + ganz Die Kronlande":"Controla Winterfell + 8 territorios de Der Norden + Die Kronlande completa")+xtra(13)+tot(13)
    },
    sur: {
      title: L?"Lord of the South":DE?"Herr des Südens":"Señor del Sur",
      desc: (L?"Control all of Dorne + all of Die Sturmlande + all of Die Kronlande":DE?"Kontrolliere ganz Dorne + ganz Die Sturmlande + ganz Die Kronlande":"Controla Dorne completa + Die Sturmlande completa + Die Kronlande completa")+xtra(12)+tot(12)
    },
    oeste: {
      title: L?"Lord of the West":DE?"Herr des Westens":"Señor del Oeste",
      desc: (L?"Control all of Die Westerlande + all of Das Tal von Arryn + all of Die Kronlande":DE?"Kontrolliere ganz Die Westerlande + ganz Das Tal von Arryn + ganz Die Kronlande":"Controla Die Westerlande completa + Das Tal von Arryn completo + Die Kronlande completa")+xtra(13)+tot(13)
    },
    rios: {
      title: L?"Master of Rivers":DE?"Herr der Flüsse":"Señor de los Ríos",
      desc: (L?"Control all of Die Flusslande + all of Das Tal von Arryn + all of Die Kronlande":DE?"Kontrolliere ganz Die Flusslande + ganz Das Tal von Arryn + ganz Die Kronlande":"Controla Die Flusslande completa + Das Tal von Arryn completo + Die Kronlande completa")+xtra(13)+tot(13)
    },
    fuego_hielo: {
      title: L?"Ice and Fire":DE?"Eis und Feuer":"De Hielo y Fuego",
      desc: (L?"Control 8 territories of Der Norden + all of Dorne + all of Die Kronlande":DE?"Kontrolliere 8 Gebiete in Der Norden + ganz Dorne + ganz Die Kronlande":"Controla 8 territorios de Der Norden + Dorne completa + Die Kronlande completa")+xtra(16)+tot(16)
    },
    dominio: {
      title: L?"Lord of the Reach":DE?"Herr des Dominium":"Señor del Dominio",
      desc: (L?"Control all of Die Weite + all of Die Westerlande + all of Die Kronlande":DE?"Kontrolliere ganz Die Weite + ganz Die Westerlande + ganz Die Kronlande":"Controla Die Weite completa + Die Westerlande completa + Die Kronlande completa")+xtra(16)+tot(16)
    },
  };
  return pool[id] || pool["conquista_a"];
}

function buildPool(players) {
  const base = ["conquista_a","conquista_b","rey","centro","norte","sur","oeste","rios","fuego_hielo","dominio"];
  const pool = base.map(function(id){return {id:id,ex:null,fh:null};});
  players.forEach(function(p){
    pool.push({id:"homeland_"+p.house, fh:p.house, ex:null});
    pool.push({id:"elim_"+p.house,     fh:null,    ex:p.house});
  });
  return pool;
}

function assignMissions(players) {
  const pool = buildPool(players), used = {};
  return players.map(function(p){
    const valid = pool.filter(function(m){
      return !used[m.id] && m.ex!==p.house && (!m.fh||m.fh===p.house);
    });
    const pick = valid[Math.floor(Math.random()*valid.length)];
    if (pick) used[pick.id] = true;
    return pick ? pick.id : "conquista_a";
  });
}

// ── COMPONENTS ────────────────────────────────────────────────────
function Divider(){
  return <div style={{borderTop:"1px solid rgba(143,168,184,0.1)",margin:"14px 0"}}/>;
}

function IceBtn(props){
  const [charged,setCharged] = useState(false);
  useEffect(function(){
    const t = setTimeout(function(){setCharged(true);},CHARGE);
    return function(){clearTimeout(t);};
  },[]);
  return(
    <button className={"ice-btn"+(charged?" charged":"")} onClick={props.onClick} disabled={props.disabled} style={{fontFamily:FB}}>
      <span className="b1"/><span className="b2"/>
      <span className="bl"/>
      <span className="lb">{props.children}</span>
    </button>
  );
}

function OutlineBtn(props){
  return(
    <button onClick={props.onClick} style={{padding:"10px 24px",background:"transparent",border:"1px solid "+(props.danger?"rgba(180,50,40,0.6)":iceDim),color:props.danger?"#e06050":ice,borderRadius:6,cursor:"pointer",fontFamily:FB,fontSize:14,letterSpacing:1}}>
      {props.children}
    </button>
  );
}

function MissionCard(props){
  const [flip,setFlip] = useState(false);
  const h = props.house;
  const hc = h?h.color:ice, hb = h?h.border:"rgba(184,212,226,0.3)", hs = h?h.bg:"rgba(184,212,226,0.05)";
  function handleClick(){
    if(flip)return;
    setFlip(true);
    setTimeout(function(){props.onReveal();},260);
  }
  return(
              <div style={{width:"100%",maxWidth:300,margin:"0 auto 24px"}}>
      <div onClick={handleClick} className={"cg"+(flip?" cf":"")}
        style={{"--hc":hc,"--hs":hs,aspectRatio:"2/3",background:"linear-gradient(150deg,#0e1320 0%,#18202e 55%,#0a0e18 100%)",border:"1.5px solid "+hb,borderRadius:14,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",userSelect:"none",transformStyle:"preserve-3d"}}>
        <div style={{position:"absolute",inset:10,border:"1px solid "+hb.replace("0.5)","0.2)").replace("0.55)","0.2)"),borderRadius:9,pointerEvents:"none"}}/>
        <div style={{fontSize:"min(52px,14vw)",marginBottom:14}}>{h?h.emoji:"🐉"}</div>
        <p style={{color:hc,fontSize:"clamp(11px,3vw,14px)",letterSpacing:4,margin:"0 0 6px",fontFamily:FB}}>MISSION</p>
        <p style={{color:"rgba(143,168,184,0.3)",fontSize:"clamp(9px,2.5vw,11px)",letterSpacing:3,margin:0,fontFamily:FB}}>{props.t.tap}</p>
      </div>
    </div>
  );
}

function SealModal(props){
  const t = props.t;
  return(
    <div onClick={props.onCancel} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div onClick={function(e){e.stopPropagation();}} style={{width:"100%",maxWidth:340,textAlign:"center",background:"rgba(12,8,6,0.98)",border:"1px solid rgba(180,50,40,0.35)",borderRadius:12,padding:"28px 20px",boxShadow:"0 0 60px rgba(180,50,40,0.15)"}}>
        <div style={{fontSize:36,marginBottom:14}}>🔱</div>
        <p style={{color:"#e06050",fontSize:"clamp(15px,4vw,18px)",margin:"0 0 10px",fontFamily:FT,letterSpacing:1}}>{t.sealWarn}</p>
        <p style={{color:"rgba(200,180,170,0.55)",fontSize:"clamp(12px,3vw,14px)",lineHeight:1.7,margin:"0 0 24px",fontFamily:FB}}>{t.sealSub}</p>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <OutlineBtn onClick={props.onCancel}>{t.sealCancel}</OutlineBtn>
          <OutlineBtn onClick={props.onConfirm} danger={true}>{t.sealConfirm}</OutlineBtn>
        </div>
      </div>
    </div>
  );
}

function MissionsModal(props){
  const {t,missionIds,players,numPlayers,lang,onClose} = props;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={function(e){e.stopPropagation();}} style={{width:"100%",maxWidth:440,maxHeight:"82vh",overflowY:"auto",background:"rgba(10,13,20,0.98)",border:"1px solid rgba(184,212,226,0.1)",borderRadius:10,padding:20}}>
        <p style={{color:"rgba(184,212,226,0.4)",fontSize:11,letterSpacing:3,margin:"0 0 16px",textAlign:"center",fontFamily:FB}}>{t.revTitle}</p>
        {players.map(function(p,i){
          const h = HOUSES.find(function(h){return h.id===p.house;});
          const m = getMission(missionIds[i]||"conquista_a", p.house, numPlayers, lang);
          return(
            <div key={i} style={{padding:"12px 0",borderBottom:i<players.length-1?"1px solid rgba(143,168,184,0.07)":"none"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{color:h?h.color:"#fff",fontSize:14,fontWeight:"600",fontFamily:FB}}>{p.name}</span>
                <span style={{color:"rgba(143,168,184,0.35)",fontSize:12,fontFamily:FB}}>{t.houseL} {h?h.name:""}</span>
              </div>
              <p style={{color:ice,fontSize:13,margin:"0 0 3px",fontFamily:FS}}>{m.title}</p>
              <p style={{color:"rgba(200,210,220,0.5)",fontSize:12,margin:0,lineHeight:1.6,fontFamily:FB}}>{m.desc}</p>
            </div>
          );
        })}
        <div style={{marginTop:16,textAlign:"center"}}><OutlineBtn onClick={onClose}>{t.close}</OutlineBtn></div>
      </div>
    </div>
  );
}

function TopBar(props){
  const {lang,setLang,showMissions,missionIds,players,numPlayers} = props;
  const [seal,setSeal] = useState(false);
  const [miss,setMiss] = useState(false);
  const t = T[lang];
  return(
    <div>
      <div style={{position:"sticky",top:0,zIndex:100,background:"rgba(8,11,16,0.97)",borderBottom:"1px solid rgba(143,168,184,0.07)",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",backdropFilter:"blur(8px)"}}>
        <div style={{display:"flex",gap:6}}>
          {["es","en","de"].map(function(l){
            return(
              <button key={l} onClick={function(){setLang(l);}} style={{background:lang===l?"rgba(184,212,226,0.08)":"transparent",border:"1px solid "+(lang===l?"rgba(184,212,226,0.4)":"rgba(143,168,184,0.12)"),color:lang===l?ice:"rgba(143,168,184,0.35)",borderRadius:4,padding:"4px 8px",cursor:"pointer",fontFamily:FB,fontSize:11,letterSpacing:1}}>
                {l.toUpperCase()}
              </button>
            );
          })}
        </div>
        <span style={{color:"rgba(184,212,226,0.2)",fontSize:10,letterSpacing:4,fontFamily:FB}}>RISK · GoT</span>
        {showMissions
          ? <button onClick={function(){setSeal(true);}} style={{background:"transparent",border:"1px solid rgba(184,212,226,0.12)",color:"rgba(184,212,226,0.4)",borderRadius:4,padding:"4px 10px",cursor:"pointer",fontFamily:FB,fontSize:11,letterSpacing:1}}>{t.seeMissions}</button>
          : <div style={{width:72}}/>
        }
      </div>
      {seal && <SealModal t={t} onCancel={function(){setSeal(false);}} onConfirm={function(){setSeal(false);setMiss(true);}}/>}
      {miss && <MissionsModal t={t} missionIds={missionIds} players={players} numPlayers={numPlayers} lang={lang} onClose={function(){setMiss(false);}}/>}
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────
export default function App(){
  useEffect(function(){injectCSS();},[]);
  const [lang,setLang]         = useState("es");
  const [screen,setScreen]     = useState("setup");
  const [numPlayers,setNp]     = useState(4);
  const [players,setPlayers]   = useState([{name:"",house:"stark"},{name:"",house:"baratheon"},{name:"",house:"lannister"},{name:"",house:"tyrell"}]);
  const [missionIds,setMids]   = useState([]);
  const [idx,setIdx]           = useState(0);
  const [revealed,setRevealed] = useState(false);

  const t = T[lang];
  const availH = getHouses(numPlayers);
  const canStart = players.every(function(p){return p.name.trim()!=="";});
  const player = players[idx]||{};
  const house  = HOUSES.find(function(h){return h.id===player.house;});
  const mission = missionIds[idx] ? getMission(missionIds[idx], player.house, numPlayers, lang) : null;

  function handleNum(n){
    const h = getHouses(n);
    setNp(n);
    setPlayers(Array.from({length:n},function(_,i){return {name:players[i]?players[i].name:"",house:h[Math.min(i,h.length-1)].id};}));
  }
  function handleHouse(pi,hid){
    setPlayers(function(prev){
      const next = prev.map(function(p){return Object.assign({},p);});
      const c = next.findIndex(function(p,i){return i!==pi&&p.house===hid;});
      if(c!==-1) next[c].house = next[pi].house;
      next[pi].house = hid;
      return next;
    });
  }
  function handleStart(){ setMids(assignMissions(players)); setIdx(0); setRevealed(false); setScreen("pass"); }
  function handleNext(){ if(idx+1>=players.length){setScreen("done");return;} setIdx(idx+1); setRevealed(false); }

  const page = {minHeight:"100vh",background:BG,fontFamily:FB,color:"#c8cdd8"};
  const cardBox = {background:"rgba(255,255,255,0.03)",border:"1px solid rgba(143,168,184,0.1)",borderRadius:10,padding:"16px"};
  const hc = house?house.color:ice;
  const hb = house?house.border:"rgba(184,212,226,0.3)";
  const hbg = house?house.bg:"rgba(184,212,226,0.04)";

  // ── SETUP ──────────────────────────────────────────────────────
  if(screen==="setup") return(
    <div style={page}>
      <TopBar lang={lang} setLang={setLang} showMissions={false} missionIds={missionIds} players={players} numPlayers={numPlayers}/>
      <div className="rg-wrap">

        <div style={{textAlign:"center",marginBottom:28}}>
          <h1 style={{color:ice,fontSize:"clamp(26px,7vw,36px)",margin:"0 0 2px",letterSpacing:6,fontFamily:FT}}>{t.title}</h1>
          <p style={{color:"rgba(184,212,226,0.5)",fontSize:"clamp(11px,3vw,14px)",margin:"0 0 3px",letterSpacing:5,fontFamily:FT}}>{t.sub}</p>
          <p style={{color:"rgba(184,212,226,0.22)",fontSize:"clamp(11px,3vw,13px)",margin:0,letterSpacing:2,fontFamily:FS}}>{t.mini}</p>
        </div>

        <div style={Object.assign({},cardBox,{marginBottom:14})}>
          <p style={{color:"rgba(184,212,226,0.35)",fontSize:12,letterSpacing:1.5,margin:"0 0 10px",fontFamily:FB}}>{t.numP}</p>
          <div style={{display:"flex",gap:8}}>
            {[2,3,4,5].map(function(n){
              return(
                <button key={n} onClick={function(){handleNum(n);}} style={{flex:1,padding:"12px 0",fontSize:"clamp(18px,5vw,24px)",background:numPlayers===n?"rgba(184,212,226,0.08)":"transparent",border:"2px solid "+(numPlayers===n?ice:"rgba(143,168,184,0.1)"),color:numPlayers===n?ice:"rgba(143,168,184,0.25)",cursor:"pointer",borderRadius:6,fontFamily:FB}}>
                  {n}
                </button>
              );
            })}
          </div>
          {numPlayers<4&&<p style={{color:"rgba(143,168,184,0.2)",fontSize:11,margin:"8px 0 0",fontFamily:FB}}>{t.note}</p>}
        </div>

        {players.map(function(p,i){
          const h = HOUSES.find(function(h){return h.id===p.house;});
          return(
            <div key={i} style={Object.assign({},cardBox,{marginBottom:10})}>
              <p style={{color:"rgba(184,212,226,0.3)",fontSize:11,letterSpacing:2,margin:"0 0 8px",fontFamily:FB}}>{t.playerN} {i+1}</p>
              <input value={p.name}
                onChange={function(e){setPlayers(function(prev){return prev.map(function(pl,j){return j===i?Object.assign({},pl,{name:e.target.value}):pl;});});}}
                placeholder={t.ph(i)}
                style={{width:"100%",background:"rgba(0,0,0,0.3)",border:"1px solid rgba(143,168,184,0.1)",color:"#c8cdd8",padding:"10px 12px",borderRadius:6,fontSize:"clamp(13px,3.5vw,15px)",boxSizing:"border-box",fontFamily:FB,marginBottom:10}}
              />
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {availH.map(function(hh){
                  const sel = p.house===hh.id;
                  return(
                    <button key={hh.id} onClick={function(){handleHouse(i,hh.id);}}
                      style={{padding:"7px 11px",background:sel?hh.bg:"transparent",border:"1px solid "+(sel?hh.border:"rgba(143,168,184,0.1)"),color:sel?hh.color:"rgba(143,168,184,0.3)",cursor:"pointer",borderRadius:6,fontSize:"clamp(12px,3vw,14px)",fontFamily:FB,fontWeight:sel?"600":"400"}}>
                      {hh.emoji} {hh.name}
                    </button>
                  );
                })}
              </div>
              {h&&<p style={{color:"rgba(143,168,184,0.25)",fontSize:11,margin:"6px 0 0",fontFamily:FB}}>{t.homeland}: {h.homeland} ({h.hSize} {t.territories})</p>}
            </div>
          );
        })}

        <IceBtn onClick={handleStart} disabled={!canStart}>{t.deal}</IceBtn>
        {!canStart&&<p style={{textAlign:"center",color:"rgba(143,168,184,0.2)",fontSize:12,marginTop:8,fontFamily:FB}}>{t.enterAll}</p>}
      </div>
    </div>
  );

  // ── PASS / REVEAL ──────────────────────────────────────────────
  if(screen==="pass") return(
    <div style={Object.assign({},page,{display:"flex",flexDirection:"column"})}>
      <TopBar lang={lang} setLang={setLang} showMissions={false} missionIds={missionIds} players={players} numPlayers={numPlayers}/>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px 16px"}}>
        <div className="rg-pass">
          {!revealed ? (
            <div style={{textAlign:"center"}}>
              <p style={{color:"rgba(200,215,225,0.45)",fontSize:"clamp(14px,4vw,17px)",margin:"0 0 8px",fontFamily:FB}}>{t.passTo}</p>
              <p style={{color:hc,fontSize:"clamp(28px,8vw,42px)",margin:"0 0 4px",fontWeight:"700",fontFamily:FT}}>{player.name}</p>
              <p style={{color:"rgba(184,212,226,0.28)",fontSize:"clamp(13px,3.5vw,16px)",marginBottom:28,fontFamily:FS}}>{house?house.name:""}</p>
              <MissionCard house={house} t={t} onReveal={function(){setRevealed(true);}}/>
              <p style={{color:"rgba(143,168,184,0.18)",fontSize:12,fontFamily:FB}}>{t.onlySee(player.name)}</p>
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              <p style={{color:"rgba(184,212,226,0.35)",fontSize:"clamp(9px,2.5vw,11px)",letterSpacing:3,margin:"0 0 12px",textAlign:"center",fontFamily:FB}}>{t.secret}</p>
              <div className="rg-card" style={{marginBottom:14,background:"rgba(10,14,22,0.97)",border:"1px solid "+hb,borderRadius:14,padding:"20px 18px",boxShadow:"0 0 40px "+hbg,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",inset:8,border:"1px solid rgba(184,212,226,0.05)",borderRadius:9,pointerEvents:"none"}}/>
                <div style={{textAlign:"center",marginBottom:14}}>
                  <p style={{color:hc,fontSize:"clamp(10px,3vw,13px)",letterSpacing:2,margin:"0 0 2px",fontFamily:FB,fontWeight:"600"}}>{t.hw+" "+(house?house.name.toUpperCase():"")}</p>
                  <p style={{color:"rgba(143,168,184,0.28)",fontSize:"clamp(10px,2.5vw,12px)",margin:"0 0 8px",fontFamily:FB}}>{house?house.homeland:""}</p>
                  <span style={{fontSize:"clamp(28px,8vw,38px)"}}>{house?house.emoji:""}</span>
                </div>
                <Divider/>
                <p style={{color:ice,fontSize:"clamp(15px,4.5vw,19px)",margin:"0 0 8px",lineHeight:1.35,fontFamily:FT,textAlign:"left"}}>{mission?mission.title:""}</p>
                <p style={{color:"rgba(200,215,225,0.7)",fontSize:"clamp(12px,3.5vw,14px)",lineHeight:1.7,margin:0,fontFamily:FB,textAlign:"left"}}>{mission?mission.desc:""}</p>
                <Divider/>
                <p style={{color:"rgba(143,168,184,0.2)",fontSize:"clamp(10px,2.5vw,12px)",margin:0,fontFamily:FB,fontStyle:"italic",textAlign:"left"}}>{t.note2}</p>
              </div>
              <div className="rg-btn">
                <IceBtn onClick={handleNext}>{idx+1>=players.length?t.start:t.next}</IceBtn>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ── DONE ───────────────────────────────────────────────────────
  return(
    <div style={Object.assign({},page,{display:"flex",flexDirection:"column"})}>
      <TopBar lang={lang} setLang={setLang} showMissions={true} missionIds={missionIds} players={players} numPlayers={numPlayers}/>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px 16px"}}>
        <div className="rg-pass" style={{textAlign:"center"}}>
          <h2 style={{color:ice,fontSize:"clamp(24px,7vw,32px)",margin:"0 0 4px",letterSpacing:4,fontFamily:FT}}>{t.war1}</h2>
          <h2 style={{color:ice,fontSize:"clamp(24px,7vw,32px)",margin:"0 0 20px",letterSpacing:4,fontFamily:FT}}>{t.war2}</h2>
          <p style={{color:"rgba(184,212,226,0.35)",fontSize:"clamp(12px,3.5vw,14px)",lineHeight:1.7,maxWidth:300,margin:"0 auto 24px",fontFamily:FB}}>{t.warDesc}</p>
          <div style={Object.assign({},cardBox,{marginBottom:20,textAlign:"left"})}>
            <p style={{color:"rgba(184,212,226,0.25)",fontSize:10,letterSpacing:3,margin:"0 0 12px",textAlign:"center",fontFamily:FB}}>{t.playersL}</p>
            {players.map(function(p,i){
              const h = HOUSES.find(function(h){return h.id===p.house;});
              return(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:i<players.length-1?"1px solid rgba(143,168,184,0.07)":"none"}}>
                  <span style={{color:"#c8cdd8",fontSize:"clamp(13px,3.5vw,16px)",fontFamily:FB}}>{p.name}</span>
                  <span style={{color:h?h.color:"#aaa",fontSize:"clamp(11px,3vw,13px)",fontFamily:FB,fontWeight:"600"}}>{h?h.emoji:""} {t.houseL} {h?h.name:""}</span>
                </div>
              );
            })}
          </div>
          <OutlineBtn onClick={function(){setScreen("setup");setMids([]);}}>{t.newGame}</OutlineBtn>
        </div>
      </div>
    </div>
  );
}