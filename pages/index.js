import React, { useState, useEffect } from "react";

// Apptivate AI Marketing - Personal Edition (Single-file React + Tailwind)
// - Simple prototype for ChatGPT Canvas preview
// - Uses localStorage for persistence
// - Mock AI function included. Replace `callAI()` with real API call (OpenAI/Gemini) later.

export default function ApptivateAIMarketing() {
  // Company profile
  const [profile, setProfile] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("apptivate_profile")) || {
        companyName: "Apptivate It Solution",
        services: "Website Development, SEO, Digital Marketing, IT Hardware",
        website: "",
        instagram: "",
        gmb: "",
        location: "Surat, Gujarat",
      }
    );
  });

  const [editingProfile, setEditingProfile] = useState(false);

  // App state
  const [tab, setTab] = useState("dashboard");
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState(() => JSON.parse(localStorage.getItem("apptivate_chatlog")) || []);

  const [postPlatform, setPostPlatform] = useState("Instagram");
  const [postService, setPostService] = useState("Website Development");
  const [postGoal, setPostGoal] = useState("Leads");
  const [postResult, setPostResult] = useState(null);

  const [auditUrl, setAuditUrl] = useState("");
  const [auditResult, setAuditResult] = useState(null);

  const [growthEntries, setGrowthEntries] = useState(() => JSON.parse(localStorage.getItem("apptivate_growth")) || []);
  const [followers, setFollowers] = useState("");
  const [projects, setProjects] = useState("");

  // Voice
  const [ttsEnabled, setTtsEnabled] = useState(true);

  useEffect(() => {
    localStorage.setItem("apptivate_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("apptivate_chatlog", JSON.stringify(chatLog));
  }, [chatLog]);

  useEffect(() => {
    localStorage.setItem("apptivate_growth", JSON.stringify(growthEntries));
  }, [growthEntries]);

  // --- Mock AI call ---
  async function callAI(prompt, mode = "chat") {
    // This is a placeholder - replace with actual API call.
    // Example for OpenAI (server-side): call OpenAI with prompt and return result.

    // For prototype we return simple deterministic responses to feel interactive.
    await new Promise((r) => setTimeout(r, 700));

    if (mode === "chat") {
      return `Suggestion for Apptivate: \n- Focus on local SEO for ${profile.location}.\n- Post case study reels twice weekly.\n- Start a quick WhatsApp pitch for local shops.`;
    }

    if (mode === "post") {
      const caption = `Launch your business online with ${profile.companyName}. Get a modern website and start getting leads. DM us to start. #WebDesign #${profile.location.replace(/\s/g, "")}`;
      const hashtags = ["#DigitalMarketing", "#WebDesign", `#${profile.location.replace(/\s/g, "")}`, "#Apptivate"].join(" ");
      const imagePrompt = `Modern office desk with laptop and Apptivate logo, neon-blue lighting, flat-lay, 1080x1080`;
      return { caption, hashtags, imagePrompt, platform: postPlatform, time: "Tuesday 10:00 AM" };
    }

    if (mode === "audit") {
      return {
        issues: [
          "Missing meta title on homepage",
          "Instagram has no highlights and low posting frequency",
          "Google Business missing recent photos",
        ],
        fixes: [
          "Add SEO meta title and description with local keywords",
          "Post 3 reels weekly and add highlights",
          "Upload 3 new photos to Google Business and ask 5 customers for reviews" ,
        ],
        quickPost: `Posted: 'We just launched a new website project for a local client! Check link in bio. #Apptivate'`,
        goal: "Get 10 leads this month",
      };
    }

    return "OK";
  }

  // --- Handlers ---
  async function handleChatSubmit() {
    if (!chatInput.trim()) return;
    const userMsg = { who: "you", text: chatInput, date: new Date().toISOString() };
    setChatLog((c) => [...c, userMsg]);
    setChatInput("");
    const ai = await callAI(chatInput, "chat");
    const aiMsg = { who: "ai", text: ai, date: new Date().toISOString() };
    setChatLog((c) => [...c, aiMsg]);
    if (ttsEnabled) speak(ai);
  }

  async function handleGeneratePost() {
    setPostResult(null);
    const res = await callAI({ platform: postPlatform, service: postService, goal: postGoal }, "post");
    setPostResult(res);
    if (ttsEnabled) speak(`Generated post idea for ${postPlatform}: ${res.caption}`);
  }

  async function handleAudit() {
    setAuditResult(null);
    const res = await callAI(auditUrl, "audit");
    setAuditResult(res);
    if (ttsEnabled) speak(`Audit done. Top issue: ${res.issues[0]}`);
  }

  function savePostResult() {
    const saved = JSON.parse(localStorage.getItem("apptivate_saved")) || [];
    saved.push({ type: "post", created: new Date().toISOString(), data: postResult });
    localStorage.setItem("apptivate_saved", JSON.stringify(saved));
    alert("Saved to history");
  }

  function saveAuditResult() {
    const saved = JSON.parse(localStorage.getItem("apptivate_saved")) || [];
    saved.push({ type: "audit", created: new Date().toISOString(), data: auditResult });
    localStorage.setItem("apptivate_saved", JSON.stringify(saved));
    alert("Audit saved");
  }

  function addGrowthEntry() {
    if (!followers && !projects) return;
    const entry = { date: new Date().toISOString(), followers: followers || 0, projects: projects || 0 };
    setGrowthEntries((g) => [...g, entry]);
    setFollowers("");
    setProjects("");
    alert("Saved growth entry");
  }

  function speak(text) {
    if (!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  // --- Simple layout ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Apptivate Ai Marketing</h1>
            <div className="text-sm text-slate-300">Personal Edition — {profile.companyName}</div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-slate-700 rounded" onClick={() => setEditingProfile(true)}>Edit Profile</button>
            <button className="px-3 py-2 bg-blue-600 rounded" onClick={() => setTab('dashboard')}>Dashboard</button>
            <button className="px-3 py-2 bg-slate-700 rounded" onClick={() => setTab('chat')}>AI Chat</button>
            <button className="px-3 py-2 bg-slate-700 rounded" onClick={() => setTab('post')}>Post</button>
            <button className="px-3 py-2 bg-slate-700 rounded" onClick={() => setTab('audit')}>Audit</button>
            <button className="px-3 py-2 bg-slate-700 rounded" onClick={() => setTab('growth')}>Growth</button>
          </div>
        </header>

        {editingProfile && (
          <div className="bg-slate-800 p-4 rounded mb-6">
            <h2 className="font-semibold">Edit Company Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <input className="p-2 rounded bg-slate-700" value={profile.companyName} onChange={(e)=>setProfile({...profile, companyName: e.target.value})} />
              <input className="p-2 rounded bg-slate-700" value={profile.services} onChange={(e)=>setProfile({...profile, services: e.target.value})} />
              <input className="p-2 rounded bg-slate-700" placeholder="Website" value={profile.website} onChange={(e)=>setProfile({...profile, website: e.target.value})} />
              <input className="p-2 rounded bg-slate-700" placeholder="Instagram" value={profile.instagram} onChange={(e)=>setProfile({...profile, instagram: e.target.value})} />
              <input className="p-2 rounded bg-slate-700" placeholder="Google Business" value={profile.gmb} onChange={(e)=>setProfile({...profile, gmb: e.target.value})} />
              <input className="p-2 rounded bg-slate-700" placeholder="Location" value={profile.location} onChange={(e)=>setProfile({...profile, location: e.target.value})} />
            </div>
            <div className="mt-3 flex gap-2">
              <button className="px-4 py-2 bg-blue-600 rounded" onClick={()=>{setEditingProfile(false); alert('Saved profile')}}>Save</button>
              <button className="px-4 py-2 bg-slate-600 rounded" onClick={()=>setEditingProfile(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Dashboard */}
        {tab === 'dashboard' && (
          <div>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-700 p-4 rounded">
                <h3 className="font-medium">Quick Audit</h3>
                <p className="text-slate-300 text-sm">Run a quick audit for your website or Instagram</p>
                <div className="mt-3 flex gap-2">
                  <input className="flex-1 p-2 rounded bg-slate-600" placeholder="Paste website or IG link" value={auditUrl} onChange={(e)=>setAuditUrl(e.target.value)} />
                  <button className="px-3 py-2 bg-blue-600 rounded" onClick={handleAudit}>Run</button>
                </div>
              </div>

              <div className="bg-slate-700 p-4 rounded">
                <h3 className="font-medium">Generate Post</h3>
                <p className="text-slate-300 text-sm">Create captions and image ideas fast</p>
                <div className="mt-3 grid grid-cols-1 gap-2">
                  <select className="p-2 rounded bg-slate-600" value={postPlatform} onChange={(e)=>setPostPlatform(e.target.value)}>
                    <option>Instagram</option>
                    <option>LinkedIn</option>
                    <option>Facebook</option>
                  </select>
                  <select className="p-2 rounded bg-slate-600" value={postService} onChange={(e)=>setPostService(e.target.value)}>
                    <option>Website Development</option>
                    <option>SEO</option>
                    <option>IT Support</option>
                  </select>
                  <select className="p-2 rounded bg-slate-600" value={postGoal} onChange={(e)=>setPostGoal(e.target.value)}>
                    <option>Leads</option>
                    <option>Engagement</option>
                    <option>Branding</option>
                  </select>
                  <button className="px-3 py-2 bg-blue-600 rounded" onClick={handleGeneratePost}>Generate</button>
                </div>
              </div>

              <div className="bg-slate-700 p-4 rounded">
                <h3 className="font-medium">Quick Actions</h3>
                <div className="mt-3 flex flex-col gap-2">
                  <button className="p-2 bg-slate-600 rounded" onClick={()=>setTab('chat')}>Ask AI Strategy</button>
                  <button className="p-2 bg-slate-600 rounded" onClick={()=>setTab('messages')}>Write Message</button>
                  <button className="p-2 bg-slate-600 rounded" onClick={()=>setTab('growth')}>Add Growth Data</button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-700 p-4 rounded">
                <h3 className="font-medium">Recent Chat</h3>
                <div className="mt-2 space-y-2 max-h-48 overflow-auto">
                  {chatLog.slice(-6).map((m, i) => (
                    <div key={i} className={`p-2 rounded ${m.who==='you'? 'bg-slate-600 text-right':'bg-slate-800 text-left'}`}>
                      <div className="text-sm">{m.text}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <input className="w-full p-2 rounded bg-slate-600" placeholder="Ask strategy or marketing question" value={chatInput} onChange={(e)=>setChatInput(e.target.value)} />
                  <div className="mt-2 flex gap-2">
                    <button className="px-3 py-2 bg-blue-600 rounded" onClick={handleChatSubmit}>Send</button>
                    <button className="px-3 py-2 bg-slate-600 rounded" onClick={()=>{setTtsEnabled(!ttsEnabled)}}>{ttsEnabled? 'Voice: On':'Voice: Off'}</button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700 p-4 rounded">
                <h3 className="font-medium">Saved Items</h3>
                <div className="mt-2 text-slate-300 text-sm">Saved outputs (posts, audits) are stored in your browser local storage.</div>
                <div className="mt-3">
                  <button className="px-3 py-2 bg-slate-600 rounded" onClick={()=>{const s = JSON.parse(localStorage.getItem('apptivate_saved')||'[]'); alert(JSON.stringify(s.slice(-3), null, 2))}}>View Recent Saved</button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* AI Chat Tab */}
        {tab === 'chat' && (
          <div className="bg-slate-700 p-4 rounded">
            <h2 className="font-bold mb-2">AI Marketing Chat</h2>
            <p className="text-slate-300 text-sm mb-3">Ask any marketing question. AI will answer with steps, captions, or messages.</p>
            <div className="space-y-2">
              <textarea className="w-full p-3 rounded bg-slate-600" rows={4} placeholder="How can I get leads for my website design service this month?" value={chatInput} onChange={(e)=>setChatInput(e.target.value)} />
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 rounded" onClick={handleChatSubmit}>Ask AI</button>
                <button className="px-4 py-2 bg-slate-600 rounded" onClick={()=>{setChatInput('Generate 5 Instagram post ideas for Website Development with captions and hashtags')}}>Example: Post Ideas</button>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {chatLog.map((m,i)=> (
                <div key={i} className={`${m.who==='you' ? 'text-right' : ''}`}>
                  <div className={`inline-block p-3 rounded ${m.who==='you' ? 'bg-slate-600' : 'bg-slate-800'}`}>{m.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Post Tab */}
        {tab === 'post' && (
          <div className="bg-slate-700 p-4 rounded">
            <h2 className="font-bold">Post Idea Generator</h2>
            <div className="grid md:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="text-sm text-slate-300">Platform</label>
                <select className="w-full p-2 rounded bg-slate-600" value={postPlatform} onChange={(e)=>setPostPlatform(e.target.value)}>
                  <option>Instagram</option>
                  <option>LinkedIn</option>
                  <option>Facebook</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-300">Service</label>
                <select className="w-full p-2 rounded bg-slate-600" value={postService} onChange={(e)=>setPostService(e.target.value)}>
                  <option>Website Development</option>
                  <option>SEO</option>
                  <option>IT Support</option>
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label className="text-sm text-slate-300">Goal</label>
              <select className="w-full p-2 rounded bg-slate-600" value={postGoal} onChange={(e)=>setPostGoal(e.target.value)}>
                <option>Leads</option>
                <option>Engagement</option>
                <option>Branding</option>
              </select>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="px-4 py-2 bg-blue-600 rounded" onClick={handleGeneratePost}>Generate Post</button>
              <button className="px-4 py-2 bg-slate-600 rounded" onClick={()=>{setPostResult(null); setPostPlatform('Instagram'); setPostService('Website Development'); setPostGoal('Leads')}}>Reset</button>
            </div>

            {postResult && (
              <div className="mt-4 bg-slate-800 p-3 rounded">
                <h3 className="font-medium">Result</h3>
                <p className="mt-2">Caption: {postResult.caption}</p>
                <p className="mt-1 text-slate-300">Hashtags: {postResult.hashtags}</p>
                <p className="mt-1 text-slate-300">Image prompt: {postResult.imagePrompt}</p>
                <p className="mt-2 text-sm text-slate-400">Suggested time: {postResult.time}</p>
                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-2 bg-blue-600 rounded" onClick={savePostResult}>Save</button>
                  <button className="px-3 py-2 bg-slate-600 rounded" onClick={()=>navigator.clipboard.writeText(postResult.caption + '\n\n' + postResult.hashtags)}>Copy</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Audit Tab */}
        {tab === 'audit' && (
          <div className="bg-slate-700 p-4 rounded">
            <h2 className="font-bold">Quick Audit</h2>
            <p className="text-slate-300 text-sm">Paste a website or social profile URL and get quick issues & fixes.</p>
            <div className="mt-3 flex gap-2">
              <input className="flex-1 p-2 rounded bg-slate-600" placeholder="Paste URL" value={auditUrl} onChange={(e)=>setAuditUrl(e.target.value)} />
              <button className="px-3 py-2 bg-blue-600 rounded" onClick={handleAudit}>Analyze</button>
            </div>

            {auditResult && (
              <div className="mt-4 bg-slate-800 p-3 rounded">
                <h3 className="font-medium">Audit Result</h3>
                <ol className="mt-2 list-decimal ml-5">
                  {auditResult.issues.map((it,idx)=> <li key={idx}>{it}</li>)}
                </ol>
                <h4 className="mt-3">Quick Fixes</h4>
                <ul className="mt-1 list-disc ml-5 text-slate-300">
                  {auditResult.fixes.map((f,idx)=> <li key={idx}>{f}</li>)}
                </ul>
                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-2 bg-blue-600 rounded" onClick={saveAuditResult}>Save</button>
                  <button className="px-3 py-2 bg-slate-600 rounded" onClick={()=>navigator.clipboard.writeText(auditResult.quickPost)}>Copy Quick Post</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {tab === 'messages' && (
          <div className="bg-slate-700 p-4 rounded">
            <h2 className="font-bold">Message Writer</h2>
            <p className="text-slate-300 text-sm">Create WhatsApp or email templates for leads quickly.</p>
            <div className="mt-3 grid md:grid-cols-2 gap-2">
              <input className="p-2 rounded bg-slate-600" placeholder="Lead type (e.g., Jewellery Shop)" />
              <select className="p-2 rounded bg-slate-600">
                <option>Website Development</option>
                <option>SEO</option>
                <option>Digital Marketing</option>
              </select>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="px-3 py-2 bg-blue-600 rounded" onClick={async ()=>{ const res = await callAI('Write a short WhatsApp and email sales message for local lead', 'chat'); alert(res); }}>Generate</button>
            </div>
          </div>
        )}

        {/* Growth Tab */}
        {tab === 'growth' && (
          <div className="bg-slate-700 p-4 rounded">
            <h2 className="font-bold">Manual Growth Tracker</h2>
            <p className="text-slate-300 text-sm">Record weekly followers and project count.</p>
            <div className="mt-3 grid md:grid-cols-2 gap-2">
              <input className="p-2 rounded bg-slate-600" placeholder="Followers" value={followers} onChange={(e)=>setFollowers(e.target.value)} />
              <input className="p-2 rounded bg-slate-600" placeholder="Projects" value={projects} onChange={(e)=>setProjects(e.target.value)} />
            </div>
            <div className="mt-3 flex gap-2">
              <button className="px-3 py-2 bg-blue-600 rounded" onClick={addGrowthEntry}>Save</button>
            </div>
            <div className="mt-4">
              <h3 className="font-medium">History</h3>
              <ul className="mt-2 space-y-2">
                {growthEntries.map((g,i)=> (
                  <li key={i} className="bg-slate-800 p-2 rounded">{new Date(g.date).toLocaleDateString()} — Followers: {g.followers} / Projects: {g.projects}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <footer className="mt-8 text-center text-slate-400">© 2025 Apptivate It Solution — Personal Edition</footer>
      </div>
    </div>
  );
}
