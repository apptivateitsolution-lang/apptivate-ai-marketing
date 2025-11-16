import React, { useState, useEffect } from "react";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [chatLog, setChatLog] = useState([]);
  const [growthEntries, setGrowthEntries] = useState([]);
  const [ready, setReady] = useState(false);

  const [tab, setTab] = useState("dashboard");
  const [chatInput, setChatInput] = useState("");
  const [postPlatform, setPostPlatform] = useState("Instagram");
  const [postService, setPostService] = useState("Website Development");
  const [postGoal, setPostGoal] = useState("Leads");
  const [postResult, setPostResult] = useState(null);
  const [auditUrl, setAuditUrl] = useState("");
  const [auditResult, setAuditResult] = useState(null);

  // -------------------------
  // LOAD LOCALSTORAGE SAFELY
  // -------------------------
  useEffect(() => {
    if (typeof window !== "undefined") {
      const p =
        JSON.parse(localStorage.getItem("apptivate_profile")) ||
        {
          companyName: "Apptivate It Solution",
          services: "Website Development, SEO, Digital Marketing, IT Hardware",
          website: "",
          instagram: "",
          gmb: "",
          location: "Surat, Gujarat",
        };

      const chat = JSON.parse(localStorage.getItem("apptivate_chatlog")) || [];
      const growth = JSON.parse(localStorage.getItem("apptivate_growth")) || [];

      setProfile(p);
      setChatLog(chat);
      setGrowthEntries(growth);
      setReady(true);
    }
  }, []);

  // save back to localStorage
  useEffect(() => {
    if (ready) localStorage.setItem("apptivate_profile", JSON.stringify(profile));
  }, [profile, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem("apptivate_chatlog", JSON.stringify(chatLog));
  }, [chatLog, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem("apptivate_growth", JSON.stringify(growthEntries));
  }, [growthEntries, ready]);

  // -------------------------
  // MOCK AI
  // -------------------------
  async function fakeAI(prompt, mode = "chat") {
    await new Promise((r) => setTimeout(r, 500));

    if (mode === "post") {
      return {
        caption: `Grow your business with ${profile.companyName}. Modern websites, SEO & marketing.`,
        hashtags: "#DigitalMarketing #WebDesign #" + profile.location.replace(/\s/g, ""),
        imagePrompt: "Modern digital workspace, neon blue",
      };
    }
    if (mode === "audit") {
      return {
        issues: ["Low posting frequency", "Outdated GMB photos"],
        fixes: ["Upload new photos", "Post 3 reels per week"],
      };
    }

    return `Marketing suggestion for ${profile.location}`;
  }

  // CHAT
  async function handleChatSubmit() {
    if (!chatInput.trim()) return;
    setChatLog((c) => [...c, { who: "you", text: chatInput }]);
    const ai = await fakeAI(chatInput, "chat");
    setChatLog((c) => [...c, { who: "ai", text: ai }]);
    setChatInput("");
  }

  // POST
  async function handleGeneratePost() {
    const res = await fakeAI("", "post");
    setPostResult(res);
  }

  // AUDIT
  async function handleAudit() {
    const res = await fakeAI(auditUrl, "audit");
    setAuditResult(res);
  }

  // -------------------------
  // FIRST LOAD WAIT
  // -------------------------
  if (!ready || !profile) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold">Apptivate AI Marketing</h1>
      <p className="text-gray-600">
        Personal Edition — {profile.companyName}
      </p>

      <div className="flex gap-4 mt-4">
        <button onClick={() => setTab("dashboard")}>Dashboard</button>
        <button onClick={() => setTab("chat")}>Chat</button>
        <button onClick={() => setTab("post")}>Post</button>
        <button onClick={() => setTab("audit")}>Audit</button>
        <button onClick={() => setTab("growth")}>Growth</button>
      </div>

      {/* CONTENT */}
      <div className="mt-6">
        {tab === "dashboard" && <div>Dashboard content</div>}

        {tab === "chat" && (
          <div>
            <textarea
              className="w-full border p-2"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            ></textarea>
            <button onClick={handleChatSubmit}>Send</button>

            <div className="mt-4">
              {chatLog.map((msg, i) => (
                <div key={i}>
                  <b>{msg.who}:</b> {msg.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "post" && (
          <div>
            <button onClick={handleGeneratePost}>Generate Post</button>
            {postResult && (
              <div className="mt-3">
                <p>Caption: {postResult.caption}</p>
                <p>Hashtags: {postResult.hashtags}</p>
              </div>
            )}
          </div>
        )}

        {tab === "audit" && (
          <div>
            <input
              className="border p-2 w-full"
              value={auditUrl}
              onChange={(e) => setAuditUrl(e.target.value)}
              placeholder="Enter URL"
            />
            <button onClick={handleAudit}>Audit</button>

            {auditResult && (
              <ul className="mt-3">
                {auditResult.issues.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "growth" && <div>Growth records here…</div>}
      </div>
    </div>
  );
}
