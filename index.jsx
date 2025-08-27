
const { useState, useEffect } = React;

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function App(){
  const initial = {
    groupName: "Madera Son",
    tagline: "Folclor cartagenero — Cumbia | Porro | Bullerengue | Mapalé | Champeta",
    logo: "",
    coverPhoto: "",
    biography: "Madera Son nace en Cartagena con la misión de rescatar y difundir el folclor del Caribe colombiano.",
    members: [
      {id:1, name:"Juan Pérez", role:"Gaita / Voz", instruments:"Gaita hembra y macho"},
      {id:2, name:"María Gómez", role:"Tambora / Coros", instruments:"Tambora"}
    ],
    repertoire: ["Cumbia tradicional","Porro","Bullerengue","Mapalé","Champeta folclórica"],
    instruments: ["Tambora","Alegre","Llamador","Gaitas","Maracas","Acordeón"],
    achievements: ["Ganadores Festival del Caribe (2019)","Gira: Miami & NY (2022)"],
    media: { spotify:"", youtube:"", instagram:"" },
    press: ['"Una agrupación que combina autenticidad y frescura." — Crítica local'],
    rider: { stage:"6 x 4 metros (mínimo)", sound:"Consola 16 canales; 3 micrófonos percusión; 2 gaitas; 2 voces inalámbricas", lights:"Iluminación cálida con acentos caribeños"},
    contact: { bookingPhone:"+57 300 123 4567", bookingEmail:"maderasonmusic@gmail.com", facebook:"" }
  };

  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem("maderason_epk");
      return raw ? JSON.parse(raw) : initial;
    } catch(e){
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("maderason_epk", JSON.stringify(state));
    } catch(e){}
  }, [state]);

  async function handleFileInput(e, key){
    const file = e.target.files[0];
    const data = await readFileAsDataURL(file);
    setState(s => ({ ...s, [key]: data }));
  }

  async function handleImageInputForNested(e, path){
    // path example: "media.cover" not used here, but kept for reference
    const file = e.target.files[0];
    const data = await readFileAsDataURL(file);
    setState(s => ({ ...s, [path]: data }));
  }

  function addMember(){
    const id = Date.now();
    setState(s => ({ ...s, members: [...s.members, {id, name:"Nuevo miembro", role:"Rol", instruments:""}] }));
  }
  function removeMember(id){
    setState(s => ({ ...state, members: state.members.filter(m => m.id !== id) }));
  }
  function updateMember(id, field, value){
    setState(s => ({ ...s, members: s.members.map(m => m.id===id ? {...m, [field]: value} : m) }));
  }

  function addToList(key, text="Nuevo"){
    setState(s => ({ ...s, [key]: [...s[key], text] }));
  }
  function updateListItem(key, index, value){
    setState(s => ({ ...s, [key]: s[key].map((it,i)=> i===index? value: it) }));
  }
  function removeListItem(key, index){
    setState(s => ({ ...s, [key]: s[key].filter((_,i)=>i!==index) }));
  }

  function exportJSON(){
    const blob = new Blob([JSON.stringify(state, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.groupName.replace(/\s+/g,"_")}_EPK.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyToClipboard(){
    navigator.clipboard && navigator.clipboard.writeText(JSON.stringify(state)).then(()=> alert("EPK copiado al portapapeles (JSON)"));
  }

  return (
    <div className="container">
      <div className="header">
        <div className="logo">{ state.logo ? <img src={state.logo} style={{width:"96px",height:"96px",objectFit:"cover",borderRadius:8}} /> : "MS" }</div>
        <div>
          <h1 contentEditable={true} suppressContentEditableWarning onInput={(e)=> setState(s=>({...s, groupName:e.currentTarget.textContent}))}>{state.groupName}</h1>
          <p contentEditable={true} suppressContentEditableWarning onInput={(e)=> setState(s=>({...s, tagline:e.currentTarget.textContent}))}>{state.tagline}</p>
        </div>
      </div>

      <div className="layout">
        <div>
          <div className="card">
            <h3>Portada</h3>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <label className="upload">Subir Logo
                <input type="file" accept="image/*" onChange={(e)=> handleFileInput(e,"logo")} />
              </label>
              <label className="upload">Subir foto de portada
                <input type="file" accept="image/*" onChange={(e)=> handleFileInput(e,"coverPhoto")} />
              </label>
            </div>
            <p className="small-note">Las imágenes se guardan localmente en tu navegador.</p>
            <hr style={{margin:"12px 0"}} />
            <div className="field">
              <label>Biografía</label>
              <textarea value={state.biography} onChange={(e)=> setState(s=>({...s, biography:e.target.value}))}></textarea>
            </div>

            <div className="field">
              <label>Integrantes</label>
              {state.members.map((m,idx)=>
                <div key={m.id} style={{marginBottom:8,border:"1px dashed #f3f4f6",padding:8,borderRadius:8}}>
                  <div style={{display:"flex",gap:8}}>
                    <input type="text" value={m.name} onChange={(e)=> updateMember(m.id,"name",e.target.value)} style={{flex:1}} />
                    <input type="text" value={m.role} onChange={(e)=> updateMember(m.id,"role",e.target.value)} style={{width:150}} />
                  </div>
                  <div style={{marginTop:6}}>
                    <input type="text" value={m.instruments} onChange={(e)=> updateMember(m.id,"instruments",e.target.value)} style={{width:"100%"}} />
                  </div>
                  <div style={{marginTop:6}}>
                    <button className="btn secondary" onClick={()=> removeMember(m.id)}>Eliminar</button>
                  </div>
                </div>
              )}
              <button className="btn" onClick={addMember}>Agregar integrante</button>
            </div>

            <div className="field">
              <label>Instrumentos tradicionales</label>
              {state.instruments.map((it,i)=> (
                <div key={i} style={{display:"flex",gap:8,marginBottom:6}}>
                  <input value={it} onChange={(e)=> updateListItem("instruments",i,e.target.value)} style={{flex:1}} />
                  <button className="btn danger" onClick={()=> removeListItem("instruments",i)}>Eliminar</button>
                </div>
              ))}
              <button className="btn" onClick={()=> addToList("instruments","Nuevo instrumento")}>Agregar instrumento</button>
            </div>

            <div className="field">
              <label>Repertorio</label>
              {state.repertoire.map((r,i)=> (
                <div key={i} style={{display:"flex",gap:8,marginBottom:6}}>
                  <input value={r} onChange={(e)=> updateListItem("repertoire",i,e.target.value)} style={{flex:1}} />
                  <button className="btn danger" onClick={()=> removeListItem("repertoire",i)}>Eliminar</button>
                </div>
              ))}
              <button className="btn" onClick={()=> addToList("repertoire","Nuevo tema")}>Agregar tema</button>
            </div>

            <div style={{display:"flex",gap:8,marginTop:10}}>
              <button className="btn" onClick={exportJSON}>Exportar JSON</button>
              <button className="btn secondary" onClick={copyToClipboard}>Copiar JSON</button>
              <button className="btn secondary" onClick={()=>{ localStorage.removeItem("maderason_epk"); location.reload(); }}>Restablecer</button>
            </div>
          </div>

          <div className="card" style={{marginTop:14}}>
            <h3>Material multimedia</h3>
            <div className="field"><label>Spotify (enlace)</label><input type="text" value={state.media.spotify} onChange={(e)=> setState(s=>({...s, media:{...s.media, spotify:e.target.value}}))} /></div>
            <div className="field"><label>YouTube (enlace)</label><input type="text" value={state.media.youtube} onChange={(e)=> setState(s=>({...s, media:{...s.media, youtube:e.target.value}}))} /></div>
            <div className="field"><label>Instagram</label><input type="text" value={state.media.instagram} onChange={(e)=> setState(s=>({...s, media:{...s.media, instagram:e.target.value}}))} /></div>
          </div>

          <div className="card" style={{marginTop:14}}>
            <h3>Ficha técnica</h3>
            <div className="field"><label>Escenario</label><input type="text" value={state.rider.stage} onChange={(e)=> setState(s=>({...s, rider:{...s.rider, stage:e.target.value}}))} /></div>
            <div className="field"><label>Sonido</label><input type="text" value={state.rider.sound} onChange={(e)=> setState(s=>({...s, rider:{...s.rider, sound:e.target.value}}))} /></div>
            <div className="field"><label>Luces</label><input type="text" value={state.rider.lights} onChange={(e)=> setState(s=>({...s, rider:{...s.rider, lights:e.target.value}}))} /></div>
          </div>

          <div className="card" style={{marginTop:14}}>
            <h3>Contacto / Booking</h3>
            <div className="field"><label>Teléfono</label><input type="text" value={state.contact.bookingPhone} onChange={(e)=> setState(s=>({...s, contact:{...s.contact, bookingPhone:e.target.value}}))} /></div>
            <div className="field"><label>Correo</label><input type="email" value={state.contact.bookingEmail} onChange={(e)=> setState(s=>({...s, contact:{...s.contact, bookingEmail:e.target.value}}))} /></div>
            <div className="field"><label>Facebook / Página</label><input type="text" value={state.contact.facebook} onChange={(e)=> setState(s=>({...s, contact:{...s.contact, facebook:e.target.value}}))} /></div>
          </div>

        </div>

        <aside>
          <div className="card preview">
            <div style={{height:140,background: state.coverPhoto ? `url(${state.coverPhoto}) center/cover` : "linear-gradient(90deg,#fde68a,#fb7185)", borderRadius:8}}></div>
            <div style={{marginTop:10}}>
              <div className="title">{state.groupName}</div>
              <div className="small">{state.tagline}</div>
            </div>
            <hr style={{margin:"10px 0"}} />
            <div><strong>Biografía</strong><p className="small" style={{marginTop:6}}>{state.biography}</p></div>
            <div style={{marginTop:8}}>
              <strong>Integrantes</strong>
              <ul className="members-list">
                {state.members.map(m => <li key={m.id}>{m.name} — {m.role} ({m.instruments})</li>)}
              </ul>
            </div>
            <div style={{marginTop:8}}><strong>Repertorio</strong><div className="small">{state.repertoire.join(" · ")}</div></div>
            <div style={{marginTop:8}}><strong>Contacto</strong><div className="small">{state.contact.bookingPhone} • {state.contact.bookingEmail}</div></div>

            <div style={{marginTop:10, display:"flex",gap:8}}>
              <a className="btn secondary" href={state.media.spotify || "#"} target="_blank">Spotify</a>
              <a className="btn secondary" href={state.media.youtube || "#"} target="_blank">YouTube</a>
              <a className="btn secondary" href={state.media.instagram || "#"} target="_blank">Instagram</a>
            </div>
          </div>

          <div className="card" style={{marginTop:12}}>
            <strong>Rider rápido</strong>
            <div className="small" style={{marginTop:8}}><div><strong>Escenario:</strong> {state.rider.stage}</div><div><strong>Sonido:</strong> {state.rider.sound}</div><div><strong>Luces:</strong> {state.rider.lights}</div></div>
          </div>

          <div className="card" style={{marginTop:12}}>
            <strong>Prensa y logros</strong>
            <ul className="members-list" style={{marginTop:8}}>
              {state.achievements.map((a,i)=> <li key={i}>{a}</li>)}
            </ul>
          </div>
        </aside>
      </div>

      <div className="footer">Sitio EPK • Madera Son — Editable localmente en tu navegador</div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
