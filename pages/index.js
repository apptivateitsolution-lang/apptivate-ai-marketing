import React, { useState, useEffect } from 'react';

const container = {
  fontFamily: 'Inter, Arial, sans-serif',
  background: 'linear-gradient(180deg,#071128,#0b1220)',
  color: '#fff',
  minHeight: '100vh',
  padding: 24
};
const card = { background: '#071426', padding: 16, borderRadius: 12, boxShadow: '0 8px 24px rgba(2,6,23,0.6)', marginBottom: 16 };
const input = { width: '100%', padding: 10, borderRadius: 8, border: '1px solid #12313f', background: '#02121a', color: '#fff' };
const button = { background: '#0ea5ff', color: '#032236', padding: '10px 14px', border: 'none', borderRadius: 8, cursor: 'pointer' };

export default function Home() {
  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('apptivate_profile')) || {
        companyName: 'Apptivate It Solution',
        services: 'Website Development, SEO, Digital Marketing, IT Hardware',
        website: '', instagram: '', gmb: '', location: 'Surat, Gujarat'
      };
    } catch (e) {
      return { companyName: 'Apptivate It Solution', services: '', website: '', instagram: '', gmb:'', location: 'Surat, Gujarat' };
    }
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState(() => JSON.parse(localStorage.getItem('apptivate_chatlog')||'[]'));
  const [postPlatform, setPostPlatform] = useState('Instagram');
  const [postService, setPostService] = useState('Website Development');
  const [postGoal, setPostGoal] = useState('Leads');
  const [postResult, setPostResult] = useState(null);
  const [auditUrl, setAuditUrl] = useState('');
  const [auditResult, setAuditResult] = useState(null);
  const [growthEntries, setGrowthEntries] = useState(() => JSON.parse(localStorage.getItem('apptivate_growth')||'[]'));
  const [followers, setFollowers] = useState('');
  const [projects, setProjects] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);

  useEffect(()=> localStorage.setItem('apptivate_profile', JSON.stringify(profile)), [profile]);
  useEffect(()=> localStorage.setItem('apptivate_chatlog', JSON.stringify(chatLog)), [chatLog]);
  useEffect(()=> localStorage.setItem('apptivate_growth', JSON.stringify(growthEntries)), [growthEntries]);

  async function callAI(prompt) {
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      return data.text || 'No response';
    } catch (e) {
      console.error(e);
      return 'Error connecting to AI';
    }
  }

  async function sendChat() {
    if (!chatInput.trim()) return;
    const userMsg = { who: 'you', text: chatInput, date: new Date().toISOString() };
    setChatLog(c => [...c, userMsg]);
    setChatInput('');
    const ai = await callAI(chatInput);
    const aiMsg = { who: 'ai', text: ai, date: new Date().toISOString() };
    setChatLog(c => [...c, aiMsg]);

    if (ttsEnabled && typeof window !== 'undefined') {
      const u = new SpeechSynthesisUtterance(ai);
      u.lang = 'en-IN';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  }

  async function generatePost() {
    setPostResult(null);

    const prompt = 
      `Create 1 social media post (caption + hashtags + image prompt) 
      for service "${postService}" in location "${profile.location}". 
      Goal: ${postGoal}. Add a short CTA.`;

    const res = await callAI(prompt);
    setPostResult(res);
  }

  async function runAudit() {
    if (!auditUrl) return alert('Paste a URL first');
    setAuditResult(null);

    const prompt = 
      `Do a short marketing audit for URL: ${auditUrl}. 
      Return top 3 issues and 3 actionable fixes.`;

    const res = await callAI(prompt);
    setAuditResult(res);
  }

  function saveToHistory(type, data) {
    const saved = JSON.parse(localStorage.getItem('apptivate_saved')||'[]');
    saved.push({ type, created: new Date().toISOString(), data });
    localStorage.setItem('apptivate_saved', JSON.stringify(saved));
    alert('Saved to history');
  }

  function addGrowth() {
    if (!followers && !projects) return;

    const entry = { 
      date: new Date().toISOString(), 
      followers: followers||0, 
      projects: projects||0 
    };

    setGrowthEntries(g => [...g, entry]);
    setFollowers(''); 
    setProjects('');
    alert('Growth saved');
  }

  return (
    <div style={container}>
      <div style={{maxWidth:1000, margin:'0 auto'}}>
        <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
          <div>
            <h1 style={{margin:0, fontSize:26}}>Apptivate AI Marketing</h1>
            <div style={{color:'#9fb4c6', fontSize:13}}>Personal Edition — {profile.companyName}</div>
          </div>
          <div style={{display:'flex', gap:8}}>
            <button style={{...button, background:'#0b556b'}} onClick={()=>setEditingProfile(true)}>Edit Profile</button>
            <button style={button} onClick={()=>setTab('dashboard')}>Dashboard</button>
            <button style={{...button, background:'#083847'}} onClick={()=>setTab('chat')}>AI Chat</button>
            <button style={{...button, background:'#083847'}} onClick={()=>setTab('post')}>Post</button>
            <button style={{...button, background:'#083847'}} onClick={()=>setTab('audit')}>Audit</button>
            <button style={{...button, background:'#083847'}} onClick={()=>setTab('growth')}>Growth</button>
          </div>
        </header>

        {editingProfile && (
          <div style={card}>
            <h3 style={{margin:0}}>Edit Company Profile</h3>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:10}}>
              <input style={input} value={profile.companyName} onChange={(e)=>setProfile({...profile, companyName: e.target.value})} />
              <input style={input} value={profile.services} onChange={(e)=>setProfile({...profile, services: e.target.value})} />
              <input style={input} placeholder="Website" value={profile.website} onChange={(e)=>setProfile({...profile, website: e.target.value})} />
              <input style={input} placeholder="Instagram" value={profile.instagram} onChange={(e)=>setProfile({...profile, instagram: e.target.value})} />
              <input style={input} placeholder="Google Business" value={profile.gmb} onChange={(e)=>setProfile({...profile, gmb: e.target.value})} />
              <input style={input} placeholder="Location" value={profile.location} onChange={(e)=>setProfile({...profile, location: e.target.value})} />
            </div>
            <div style={{marginTop:12, display:'flex', gap:8}}>
              <button style={button} onClick={()=>{setEditingProfile(false); alert('Profile saved')}}>Save</button>
              <button style={{...button, background:'#083847'}} onClick={()=>setEditingProfile(false)}>Cancel</button>
            </div>
          </div>
        )}

        {tab === 'dashboard' && (
          <div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:16}}>
              <div style={card}>
                <h4 style={{margin:0}}>Quick Audit</h4>
                <p style={{color:'#9fb4c6', fontSize:13}}>Analyze website or social profile</p>
                <div style={{marginTop:10, display:'flex', gap:8}}>
                  <input style={{...input, flex:1}} placeholder="Paste website or IG link" value={auditUrl} onChange={(e)=>setAuditUrl(e.target.value)} />
                  <button style={button} onClick={runAudit}>Analyze</button>
                </div>
                {auditResult && (<pre style={{marginTop:10, whiteSpace:'pre-wrap', background:'#02121a', padding:10, borderRadius:8}}>{auditResult}</pre>)}
              </div>

              <div style={card}>
                <h4 style={{margin:0}}>Post Generator</h4>
                <p style={{color:'#9fb4c6', fontSize:13}}>Create captions + image prompts fast</p>
                <div style={{marginTop:10, display:'grid', gap:8}}>
                  <select style={input} value={postPlatform} onChange={(e)=>setPostPlatform(e.target.value)}>
                    <option>Instagram</option><option>LinkedIn</option><option>Facebook</option>
                  </select>
                  <select style={input} value={postService} onChange={(e)=>setPostService(e.target.value)}>
                    <option>Website Development</option><option>SEO</option><option>IT Support</option>
                  </select>
                  <select style={input} value={postGoal} onChange={(e)=>setPostGoal(e.target.value)}>
                    <option>Leads</option><option>Engagement</option><option>Branding</option>
                  </select>
                  <div style={{display:'flex', gap:8}}>
                    <button style={button} onClick={generatePost}>Generate</button>
                    <button style={{...button, background:'#083847'}} onClick={()=>{setPostResult(null); setPostPlatform('Instagram'); setPostService('Website Development'); setPostGoal('Leads')}}>Reset</button>
                  </div>
                </div>
                {postResult && (<pre style={{marginTop:10, whiteSpace:'pre-wrap', background:'#02121a', padding:10, borderRadius:8}}>{postResult}</pre>)}
              </div>

              <div style={card}>
                <h4 style={{margin:0}}>Quick Actions</h4>
                <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:8}}>
                  <button style={{...button, background:'#083847'}} onClick={()=>setTab('chat')}>Ask AI</button>
                  <button style={{...button, background:'#083847'}} onClick={()=>setTab('messages')}>Write Message</button>
                  <button style={{...button, background:'#083847'}} onClick={()=>setTab('growth')}>Add Growth</button>
                </div>
              </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <div style={card}>
                <h4 style={{margin:0}}>Recent Chat</h4>
                <div style={{marginTop:10, maxHeight:220, overflow:'auto'}}>
                  {chatLog.slice(-8).map((m,i)=>(<div key={i} style={{marginBottom:8, textAlign: m.who==='you' ? 'right' : 'left'}}><div style={{display:'inline-block', background: m.who==='you' ? '#053340' : '#071426', padding:10, borderRadius:8}}>{m.text}</div></div>))}
                </div>
                <div style={{marginTop:10}}>
                  <input style={input} placeholder="Ask strategy or marketing question" value={chatInput} onChange={(e)=>setChatInput(e.target.value)} />
                  <div style={{marginTop:8, display:'flex', gap:8}}>
                    <button style={button} onClick={sendChat}>Send</button>
                    <button style={{...button, background:'#083847'}} onClick={()=>setTtsEnabled(!ttsEnabled)}>{ttsEnabled? 'Voice: On':'Voice: Off'}</button>
                  </div>
                </div>
              </div>

              <div style={card}>
                <h4 style={{margin:0}}>Saved Items</h4>
                <p style={{color:'#9fb4c6'}}>Saved outputs are in local storage</p>
                <div style={{marginTop:12}}>
                  <button style={{...button, background:'#083847'}} onClick={()=>{const s = JSON.parse(localStorage.getItem('apptivate_saved')||'[]'); alert(JSON.stringify(s.slice(-6), null,2))}}>View Recent</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab==='chat' && (
          <div style={card}>
            <h3>AI Chat</h3>
            <textarea style={{...input, height:120}} value={chatInput} onChange={(e)=>setChatInput(e.target.value)} />
            <div style={{marginTop:8, display:'flex', gap:8}}>
              <button style={button} onClick={sendChat}>Ask AI</button>
              <button style={{...button, background:'#083847'}} onClick={()=>{setChatInput('Generate 5 Instagram post ideas for Website Development')}}>Example</button>
            </div>
            <div style={{marginTop:12}}>
              {chatLog.map((m,i)=>(<div key={i} style={{marginBottom:8, textAlign: m.who==='you' ? 'right': 'left'}}><div style={{display:'inline-block', background: m.who==='you' ? '#053340':'#071426', padding:10, borderRadius:8}}>{m.text}</div></div>))}
            </div>
          </div>
        )}

        {tab==='post' && (
          <div style={card}>
            <h3>Post Generator</h3>
            <div style={{marginTop:10}}>
              <div><strong>Result:</strong></div>
              {postResult ? (<pre style={{whiteSpace:'pre-wrap', background:'#02121a', padding:10, borderRadius:8}}>{postResult}</pre>) : (<div style={{color:'#9fb4c6'}}>No result yet</div>)}
              <div style={{marginTop:8, display:'flex', gap:8}}>
                <button style={button} onClick={()=>saveToHistory('post', postResult)}>Save</button>
                <button style={{...button, background:'#083847'}} onClick={()=>navigator.clipboard.writeText(postResult||'')}>Copy</button>
              </div>
            </div>
          </div>
        )}

        {tab==='audit' && (
          <div style={card}>
            <h3>Quick Audit</h3>
            <div style={{marginTop:10, display:'flex', gap:8}}>
              <input style={{...input, flex:1}} placeholder="Paste URL" value={auditUrl} onChange={(e)=>setAuditUrl(e.target.value)} />
              <button style={button} onClick={runAudit}>Run</button>
            </div>
            {auditResult && (<pre style={{whiteSpace:'pre-wrap', background:'#02121a', padding:10, borderRadius:8, marginTop:10}}>{auditResult}</pre>)}
          </div>
        )}

        {tab==='messages' && (
          <div style={card}>
            <h3>Message Writer</h3>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
              <input style={input} placeholder="Lead type (e.g., Jewellery Shop)" />
              <select style={input}><option>Website Development</option><option>SEO</option><option>Digital Marketing</option></select>
            </div>
            <div style={{marginTop:8}}><button style={button} onClick={async ()=>{ const res = await callAI('Write a short WhatsApp and email sales message for local lead'); alert(res); }}>Generate</button></div>
          </div>
        )}

        {tab==='growth' && (
          <div style={card}>
            <h3>Growth Tracker</h3>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
              <input style={input} placeholder="Followers" value={followers} onChange={(e)=>setFollowers(e.target.value)} />
              <input style={input} placeholder="Projects" value={projects} onChange={(e)=>setProjects(e.target.value)} />
            </div>
            <div style={{marginTop:10}}><button style={button} onClick={addGrowth}>Save</button></div>
            <div style={{marginTop:12}}>
              <h4>History</h4>
              <ul>
                {growthEntries.map((g,i)=>(<li key={i}>{new Date(g.date).toLocaleDateString()} — Followers: {g.followers} / Projects: {g.projects}</li>))}
              </ul>
            </div>
          </div>
        )}

        <footer style={{marginTop:20, textAlign:'center', color:'#8fb6c4'}}>© 2025 Apptivate It Solution — Personal</footer>
      </div>
    </div>
  );
}
