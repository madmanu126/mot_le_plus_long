import React, {Component, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Tirage} from './business/Tirage';
import {MotsTirage} from './business/Mots_tirage';
import {Select} from './business/NVoyel';

const serviceMot_dev = `http://localhost/portail/tetradev/dico/recherche.php?tirage=`;
const serviceMot = "https://chesslab-velay.com/dico/recherche.php?tirage=";

function App() {
  const [tirage, setTirage] = useState('#');
  const [analyse, setAnalyse] = useState(0);
  const [feedback, setFeedback] = useState(false);
  const [nvoyel, setNvoyel] = useState(4);
  const [networkError, setNetworkError] = useState();
  //const envoyel = "envoyel";
  function stat(word){
    const stat={};
      for(var nc=0; nc<word.length;nc++){
          let ch = word[nc];
          stat[ch]=stat[ch]||0;
          stat[ch]++;
      }
      return stat;
  }

  function getletters(items){
      setTirage(items.map((x)=>x.letter.toLowerCase()));
      console.log(tirage);
      editeur().value="";
      setAnalyse(false);
      setFeedback(false);
  }
  function preAnalyse(){
      //console.log("Correction!");
      let answer = editeur().value;
      if(!answer.length) return false;
      const stt = stat(tirage);
      const sta = stat(answer);
      for(var key in sta){
          if(!(stt[key] >= sta[key])) return 1;
      }
      //correction(tirage.join(''));
      return 2;
  }
  function editeur(){
      return document.getElementById("eanswer");
  }
  
  function correction(){
      setAnalyse(3);
      setNetworkError(false);
      let answer=tirage.join('');

      fetch(`${serviceMot}${answer}`, {
        method: "GET"
        }).then((response)=>response.json(), (reason)=>{
            console.log(reason); setNetworkError("Problème réseau!"); return {error:true};}).then((resu)=>{
                console.log(resu);
                if(!resu || (resu.error)) return;
                setAnalyse(4); 
                setFeedback(resu)});
   }
  
  return (
    <div className="App">
      <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" /> 
          <p>Le mot le plus long!</p>
      </header>
      <body>
          <Tirage nvoy={nvoyel} ncon={10-nvoyel} client={getletters}/>
          <Select options={[4,5,6]} title="Combien de voyelles?" value={nvoyel} setter={setNvoyel}/>
          <h2>Votre proposition :</h2>
          <input type='text' id="eanswer" onChange={()=>setAnalyse(preAnalyse())}/>
          <div>{analyse==1?
               <p>Vous avez mis une lettre en trop!</p>:
               analyse==2?
              <p><span>Pre-analyse OK!</span>
              <input type='button' value='Corriger' onClick={()=>correction()}/></p>:
              analyse==3?<i>Attente du serveur...</i>:
              analyse==4?<MotsTirage service={feedback}/>:''}
          </div>
          <p className='error'>{networkError}</p>
      </body>
    </div>
  );
}

export default App;
/* <!--MovingChars tirage="QIZEIMDMVE"/-->*/
