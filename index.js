import { useState, useEffect } from 'react';

const container = {
  fontFamily: 'Inter, Arial, sans-serif',
  background: 'linear-gradient(180deg,#0b1220,#0f1724)',
  color: '#ffffff',
  minHeight: '100vh',
  padding: '24px'
};
const card = { background: '#0f1724', padding: '16px', borderRadius: '10px', boxShadow: '0 6px 18px rgba(0,0,0,0.5)', marginBottom: '16px' };
const input = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #23303b', background: '#07101a', color: '#fff' };
const button = { background: '#0066ff', color: '#fff', padding: '10px 14px', border: 'none', borderRadius: '6px', cursor: 'pointer' };

export default function Home() {
  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('apptivate_profile')) || {
        companyName: 'Apptivate It Solution',
        services: 'Website Development, SEO, Digital Marketing, IT Hardware',
        website: '',
        instagram: '',
        gmb: '',
        location: 'Surat, Gujarat'
      };
    } catch(e) {
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

  async function handleChatSubmit() {
    if (!chatInput.trim()) return;
    const userMsg = { who: 'you', text: chatInput, date: new Date().toISOString() };
    setChatLog(c => [...c, userMsg]);
    setChatInput('');
    const ai = await callAI(chatInput);
    const aiMsg = { who: 'ai', text: ai, date: new Date().toISOString() };
    setChatLog(c => [...c, aiMsg]);
    if (ttsEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(ai);
      u.lang = 'en-IN';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  }

  async function handleGeneratePost() {
    setPostResult(null);
    const prompt = `Generate one social post caption, hashtags and image prompt for ${postService} targeting ${profile.location} with goal ${postGoal}.`;
    const res = await callAI(prompt);
    setPostResult({ text: res });
    if (ttsEnabled && typeof window !== 'undefined') {
      const u = new SpeechSynthesisUtterance('Post generated. Check the result section.');
      u.lang = 'en-IN';
      window.speechSynthesis.speak(u);
    }
  }

  async function handleAudit() {
    if (!auditUrl) return alert('Paste a URL first');
    setAuditResult(null);
    const prompt = `Perform a quick marketing audit for this URL: ${auditUrl}. Return top 3 issues and 3 quick fixes.`;
    const res = await callAI(prompt);
    setAuditResult({ text: res });
    if (ttsEnabled && typeof window !== 'undefined') {
      const u = new SpeechSynthesisUtterance('Audit complete. See results below.');
      u.lang = 'en-IN';
      window.speechSynthesis.speak(u);
    }
  }

  function savePostResult() {
    const saved = JSON.parse(localStorage.getItem('apptivate_saved')||'[]');
    saved.push({ type: 'post', created: new Date().toISOString(), data: postResult });
    localStorage.setItem('apptivate_saved', JSON.stringify(saved));
    alert('Saved to history');
  }
  function saveAuditResult() {
    const saved = JSON.parse(localStorage.getItem('apptivate_saved')||'[]');
    saved.push({ type: 'audit', created: new Date().toISOString(), data: auditResult });
    localStorage.setItem('apptivate_saved', JSON.stringify(saved));
    alert('Audit saved');
  }
  function addGrowthEntry() {
    if (!followers && !projects) return;
    const entry = { date: new Date().toISOString(), followers: followers||0, projects: projects||0 };
    setGrowthEntries(g => [...g, entry]);
    setFollowers(''); setProjects('');
    alert('Saved growth entry');
  }

  return (
    <div style={container}>
      <div style={{maxWidth: 960, margin: '0 auto'}}>
        <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 20}}>
          <div>
            <h1 style={{margin:0, fontSize:24}}>Apptivate Ai Marketing</h1>
            <div style={{color:'#9aa6b2', fontSize:13}}>Personal Edition — {profile.companyName}</div>
          </div>
          <div style={{display:'flex', gap:8}}>
            <button style={{...button, background:'#334155'}} onClick={()=>setEditingProfile(true)}>Edit Profile</button>
            <button style={button} onClick={()=>setTab('dashboard')}>Dashboard</button>
            <button style={{...button, background:'#334155'}} onClick={()=>setTab('chat')}>AI Chat</button>
            <button style={{...button, background:'#334155'}} onClick={()=>setTab('post')}>Post</button>
            <button style={{...button, background:'#334155'}} onClick={()=>setTab('audit')}>Audit</button>
            <button style={{...button, background:'#334155'}} onClick={()=>setTab('growth')}>Growth</button>
          </div>
        </header>

        {editingProfile && (
          <div style={card}>
            <h2 style={{marginTop:0}}>Edit Company Profile</h2>
            <div style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap:10}}>
              <input style={input} value={profile.companyName} onChange={(e)=>setProfile({...profile, companyName: e.target.value})} />
              <input style={input} value={profile.services} onChange={(e)=>setProfile({...profile, services: e.target.value})} />
              <input style={input} placeholder="Website" value={profile.website} onChange={(e)=>setProfile({...profile, website: e.target.value})} />
              <input style={input} placeholder="Instagram" value={profile.instagram} onChange={(e)=>setProfile({...profile, instagram: e.target.value})} />
              <input style={input} placeholder="Google Business" value={profile.gmb} onChange={(e)=>setProfile({...profile, gmb: e.target.value})} />
              <input style={input} placeholder="Location" value={profile.location} onChange={(e)=>setProfile({...profile, location: e.target.value})} />
            </div>
            <div style={{marginTop:10, display:'flex', gap:8}}>
              <button style={button} onClick={()=>{setEditingProfile(false); alert('Saved profile')}}>Save</button>
              <button style={{...button, background:'#334155'}} onClick={()=>setEditingProfile(false)}>Cancel</button>
            </div>
          </div>
        )}

        {tab === 'dashboard' && (
          <div>
            <div style={{display:'grid', gridTemplateColumns: '1fr 1fr 1fr', gap:12, marginBottom:16}}>
              <div style={card}>
                <h3 style={{margin:0}}>Quick Audit</h3>
                <p style={{color:'#9aa6b2', fontSize:13}}>Run a quick audit for your website or Instagram</p>
                <div style={{marginTop:10, display:'flex', gap:8}}>
                  <input style={{...input, flex:1}} placeholder="Paste website or IG link" value={auditUrl} onChange={(e)=>setAuditUrl(e.target.value)} />
                  <button style={button} onClick={handleAudit}>Run</button>
                </div>
              </div>

              <div style={card}>
                <h3 style={{margin:0}}>Generate Post</h3>
                <p style={{color:'#9aa6b2', fontSize:13}}>Create captions and image ideas fast</p>
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
                    <button style={button} onClick={handleGeneratePost}>Generate</button>
                    <button style={{...button, background:'#334155'}} onClick={()=>{setPostResult(null); setPostPlatform('Instagram'); setPostService('Website Development'); setPostGoal('Leads')}}>Reset</button>
                  </div>
                </div>
              </div>

              <div style={card}>
                <h3 style={{margin:0}}>Quick Actions</h3>
                <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:8}}>
                  <button style={{...button, background:'#334155'}} onClick={()=>setTab('chat')}>Ask AI Strategy</button>
                  <button style={{...button, background:'#334155'}} onClick={()=>setTab('messages')}>Write Message</button>
                  <button style={{...button, background:'#334155'}} onClick={()=>setTab('growth')}>Add Growth Data</button>
                </div>
              </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap:12}}>
              <div style={card}>
                <h3 style={{margin:0}}>Recent Chat</h3>
                <div style={{marginTop:10, maxHeight:200, overflow:'auto'}}>
                  {chatLog.slice(-6).map((m,i)=>(<div key={i} style={{marginBottom:6, textAlign: m.who==='you' ? 'right' : 'left' }}><div style={{display:'inline-block', background: m.who==='you' ? '#0b2636' : '#0a1922', padding:8, borderRadius:8}}>{m.text}</div></div>))}
                </div>
                <div style={{marginTop:10}}>
                  <input style={input} placeholder="Ask strategy or marketing question" value={chatInput} onChange={(e)=>setChatInput(e.target.value)} />
                  <div style={{marginTop:8, display:'flex', gap:8}}>
                    <button style={button} onClick={handleChatSubmit}>Send</button>
                    <button style={{...button, background:'#334155'}} onClick={()=>setTtsEnabled(!ttsEnabled)}>{ttsEnabled ? 'Voice: On' : 'Voice: Off'}</button>
                  </div>
                </div>
              </div>

              <div style={card}>
                <h3 style={{margin:0}}>Saved Items</h3>
                <p style={{color:'#9aa6b2'}}>Saved outputs (posts, audits) are stored in your browser local storage.</p>
                <div style={{marginTop:12}}>
                  <button style={{...button, background:'#334155'}} onClick={()=>{const s = JSON.parse(localStorage.getItem('apptivate_saved')||'[]'); alert(JSON.stringify(s.slice(-3), null, 2))}}>View Recent Saved</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'chat' && (
          <div style={card}>
            <h2 style={{marginTop:0}}>AI Marketing Chat</h2>
            <p style={{color:'#9aa6b2'}}>Ask any marketing question. AI will answer with steps, captions, or messages.</p>
            <textarea style={{...input, height:120, marginTop:8}} value={chatInput} onChange={(e)=>setChatInput(e.target.value)} placeholder="How can I get leads for my website design service this month?" />
            <div style={{marginTop:8, display:'flex', gap:8}}>
              <button style={button} onClick={handleChatSubmit}>Ask AI</button>
              <button style={{...button, background:'#334155'}} onClick={()=>{setChatInput('Generate 5 Instagram post ideas for Website Development with captions and hashtags')}}>Example: Post Ideas</button>
            </div>
            <div style={{marginTop:12}}>
              {chatLog.map((m,i)=>(<div key={i} style={{marginBottom:8, textAlign: m.who==='you' ? 'right' : 'left'}}><div style={{display:'inline-block', background: m.who==='you' ? '#0b2636' : '#07101a', padding:10, borderRadius:8}}>{m.text}</div></div>))}
            </div>
          </div>
        )}

        {tab === 'post' && (
          <div style={card}>
            <h2 style={{marginTop:0}}>Post Idea Generator</h2>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
              <div>
                <label style={{fontSize:13, color:'#9aa6b2'}}>Platform</label>
                <select style={input} value={postPlatform} onChange={(e)=>setPostPlatform(e.target.value)}><option>Instagram</option><option>LinkedIn</option><option>Facebook</option></select>
              </div>
              <div>
                <label style={{fontSize:13, color:'#9aa6b2'}}>Service</label>
                <select style={input} value={postService} onChange={(e)=>setPostService(e.target.value)}><option>Website Development</option><option>SEO</option><option>IT Support</option></select>
              </div>
            </div>
            <div style={{marginTop:10}}>
              <label style={{fontSize:13, color:'#9aa6b2'}}>Goal</label>
              <select style={input} value={postGoal} onChange={(e)=>setPostGoal(e.target.value)}><option>Leads</option><option>Engagement</option><option>Branding</option></select>
            </div>
            <div style={{marginTop:10, display:'flex', gap:8}}>
              <button style={button} onClick={handleGeneratePost}>Generate Post</button>
              <button style={{...button, background:'#334155'}} onClick={()=>{setPostResult(null); setPostPlatform('Instagram'); setPostService('Website Development'); setPostGoal('Leads')}}>Reset</button>
            </div>
            {postResult && (<div style={{marginTop:12, background:'#07101a', padding:12, borderRadius:8}}><h3 style={{margin:0}}>Result</h3><pre style={{whiteSpace:'pre-wrap'}}>{postResult.text}</pre><div style={{marginTop:8, display:'flex', gap:8}}><button style={button} onClick={savePostResult}>Save</button><button style={{...button, background:'#334155'}} onClick={()=>navigator.clipboard.writeText(postResult.text)}>Copy</button></div></div>)}
          </div>
        )}

        {tab === 'audit' && (
          <div style={card}>
            <h2 style={{marginTop:0}}>Quick Audit</h2>
            <p style={{color:'#9aa6b2'}}>Paste a website or social profile URL and get quick issues & fixes.</p>
            <div style={{marginTop:10, display:'flex', gap:8}}>
              <input style={{...input, flex:1}} placeholder="Paste URL" value={auditUrl} onChange={(e)=>setAuditUrl(e.target.value)} />
              <button style={button} onClick={handleAudit}>Analyze</button>
            </div>
            {auditResult && (<div style={{marginTop:12, background:'#07101a', padding:12, borderRadius:8}}><h3 style={{margin:0}}>Audit Result</h3><pre style={{whiteSpace:'pre-wrap'}}>{auditResult.text}</pre><div style={{marginTop:8, display:'flex', gap:8}}><button style={button} onClick={saveAuditResult}>Save</button><button style={{...button, background:'#334155'}} onClick={()=>navigator.clipboard.writeText(auditResult.text)}>Copy Quick Post</button></div></div>)}
          </div>
        )}

        {tab === 'messages' && (
          <div style={card}>
            <h2 style={{marginTop:0}}>Message Writer</h2>
            <p style={{color:'#9aa6b2'}}>Create WhatsApp or email templates for leads quickly.</p>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
              <input style={input} placeholder="Lead type (e.g., Jewellery Shop)" />
              <select style={input}><option>Website Development</option><option>SEO</option><option>Digital Marketing</option></select>
            </div>
            <div style={{marginTop:10}}><button style={button} onClick={async ()=>{ const res = await callAI('Write a short WhatsApp and email sales message for local lead'); alert(res); }}>Generate</button></div>
          </div>
        )}

        {tab === 'growth' && (
          <div style={card}>
            <h2 style={{marginTop:0}}>Manual Growth Tracker</h2>
            <p style={{color:'#9aa6b2'}}>Record weekly followers and project count.</p>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
              <input style={input} placeholder="Followers" value={followers} onChange={(e)=>setFollowers(e.target.value)} />
              <input style={input} placeholder="Projects" value={projects} onChange={(e)=>setProjects(e.target.value)} />
            </div>
            <div style={{marginTop:10}}><button style={button} onClick={addGrowthEntry}>Save</button></div>
            <div style={{marginTop:12}}><h3 style={{margin:0}}>History</h3><div style={{marginTop:8}}>{growthEntries.map((g,i)=>(<div key={i} style={{background:'#07101a', padding:8, borderRadius:8, marginTop:8}}>{new Date(g.date).toLocaleDateString()} — Followers: {g.followers} / Projects: {g.projects}</div>))}</div></div>
          </div>
        )}

        <footer style={{textAlign:'center', color:'#94a3b8', marginTop:30}}>© 2025 Apptivate It Solution — Personal Edition</footer>
      </div>
    </div>
  )
}
