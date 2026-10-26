import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, X, Sparkles, MapPin, ExternalLink, Key, Check, HelpCircle } from 'lucide-react';
import listingsData from '../data/mockListings.json';

export default function RentalChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    return import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key') || '';
  });
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Sawadee krub! I'm your **SafeRoom Accommodation Assistant** for Bangkok. Tell me your preferred district (e.g. Bang Mot, Bang Khen, Dusit, Huai Khwang), budget, or proximity to BTS/MRT, and I'll find matching verified rooms with direct Google Maps links!",
      recommendations: []
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedChips, setSuggestedChips] = useState([
    "Recommend condos under 12k in Huai Khwang",
    "What is the standard deposit for a condo?",
    "Find student dorms near Dusit"
  ]);
  const messagesEndRef = useRef(null);

  // Heuristic engine to dynamically generate follow-up question chips based on conversation context
  const updateSuggestedChips = (query, recommendations = []) => {
    const q = query.toLowerCase();

    // Check known districts in query or recommendations
    const knownDistricts = [
      "Huai Khwang", "Dusit", "Don Mueang", "Chatuchak", "Lat Krabang",
      "Lat Phrao", "Min Buri", "Khlong San", "Khlong Toei", "Phasi Charoen",
      "Phra Nakhon", "Bang Khen", "Bang Na", "Bang Sue", "Sai Mai", "Thung Khru",
      "Bang Bon", "Bang Kapi", "Bang Kho Laem", "Bang Khun Thian", "Bang Phlat",
      "Bang Rak", "Bangkok Noi", "Bangkok Yai", "Bueng Kum", "Chom Thong",
      "Din Daeng", "Khan Na Yao", "Khlong Sam Wa", "Lak Si", "Nong Chok",
      "Nong Khaem", "Pathum Wan", "Phaya Thai", "Phra Khanong", "Pom Prap Sattru Phai",
      "Prawet", "Rat Burana", "Ratchathewi", "Saphan Sung"
    ];

    let detectedDistrict = knownDistricts.find(d => q.includes(d.toLowerCase()));
    if (!detectedDistrict && recommendations.length > 0 && recommendations[0].district) {
      detectedDistrict = recommendations[0].district;
    }

    let newChips = [];

    if (detectedDistrict) {
      newChips = [
        `Condos with direct MEA meter in ${detectedDistrict}`,
        `Budget dorms under 6k in ${detectedDistrict}`,
        `Proximity to BTS/MRT in ${detectedDistrict}`
      ];
    } else if (q.includes('deposit') || q.includes('advance') || q.includes('lease') || q.includes('contract') || q.includes('cost') || q.includes('rule')) {
      newChips = [
        "What is direct MEA government electricity rate?",
        "Can a landlord legally demand 3 months deposit?",
        "Show rooms with standard 1+1 deposit"
      ];
    } else if (q.includes('student') || q.includes('dorm') || q.includes('cheap') || q.includes('budget') || q.includes('university') || q.includes('campus')) {
      newChips = [
        "Dorms near KMUTT Bang Mot under 5k",
        "Student apartments near Kasetsart / Saphan Mai",
        "Affordable rooms near Lat Krabang KMITL"
      ];
    } else if (q.includes('bts') || q.includes('mrt') || q.includes('transit') || q.includes('station') || q.includes('train')) {
      newChips = [
        "Condos within 500m of BTS Sukhumvit",
        "MRT Blue Line rooms under 10k",
        "Rooms near SRT Don Mueang Red Line"
      ];
    } else if (q.includes('condo')) {
      newChips = [
        "Condos with direct MEA electricity (~4.5 THB)",
        "Pet-friendly condos under 15k in Bangkok",
        "What is the standard (2+1) condo move-in cost?"
      ];
    } else {
      newChips = [
        "Recommend condos under 12k in Huai Khwang",
        "What is the standard deposit for an apartment?",
        "Find verified dorms near Dusit universities"
      ];
    }

    setSuggestedChips(newChips);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSaveKey = (e) => {
    e.preventDefault();
    if (!tempKey.trim()) return;
    setApiKey(tempKey.trim());
    localStorage.setItem('gemini_api_key', tempKey.trim());
    setShowKeyModal(false);
    setTempKey('');
  };

  // Local fallback engine if API key is absent or quota is limited
  const localSmartFallback = (query) => {
    const q = query.toLowerCase();
    const matched = listingsData.filter(item =>
      item.district.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      (item.transit && item.transit.toLowerCase().includes(q)) ||
      (q.includes('condo') && item.type === 'Condominium') ||
      (q.includes('dorm') && item.type.includes('Apartment'))
    ).slice(0, 3);

    let text = "";
    if (q.includes('deposit') || q.includes('advance') || q.includes('lease') || q.includes('cost')) {
      text = "📋 **Bangkok Rental Standard Guide:**\n\n• **Condominiums:** Standard terms require **(2+1) Months** (2 months deposit + 1 month advance). Electricity is billed via direct MEA government meter (~4.5 THB/unit).\n• **Apartments & Dorms:** Standard terms require **(1+1) Months** (1 month deposit + 1 month advance). Electricity is sub-metered at 7.0–8.0 THB/unit.\n\nNever pay more than 1 month advance rent upfront!";
    } else if (matched.length > 0) {
      text = `Here are verified recommendations from our Bangkok database matching your search:`;
    } else {
      text = "I'm ready to help you find verified Bangkok accommodations! Try asking:\n• *'Recommend a condo under 12k in Huai Khwang'* \n• *'Find a budget student room near Bang Mot'* \n• *'What is the deposit for an apartment?'*";
    }

    return { text, recommendations: matched };
  };

  const callGeminiAPI = async (userPrompt) => {
    // Provide a sample of our listings database to ground the model
    const sampleCatalog = listingsData.slice(0, 25).map(l => ({
      name: l.name,
      district: l.district,
      type: l.type,
      rent: `${l.rent} THB/mo`,
      transit: l.transit,
      electricity: l.electricityBilling,
      maps: l.googleMapsUrl
    }));

    const systemPrompt = `
You are the SafeRoom Accommodation AI Assistant for Bangkok, Thailand.
Help tenants find rooms, understand Bangkok lease rules, and avoid rental scams.
Core Bangkok tenancy rules:
1. Condominiums: Standard (2+1) months [2 months deposit + 1 month advance]. Direct MEA Government electricity (~4.5 THB/unit).
2. Apartments/Dorms: Standard (1+1) months [1 month deposit + 1 month advance]. Sub-meter electricity typically 7-8 THB/unit. Over 8.5 THB/unit is high.
3. Relevant listings available in our verified Bangkok dataset:
${JSON.stringify(sampleCatalog, null, 1)}

Instructions:
- When the user asks for places, recommend 1-2 realistic options from the data with their exact district, monthly rent, and direct Google Maps link in Markdown: [View on Google Maps](URL).
- Be polite, authentic, and concise with bullet points.
`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\nUser Question: ${userPrompt}` }]
        }
      ]
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Gemini API Error: ${res.statusText}`);
    }

    const json = await res.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text;
  };

  const handleSend = async (manualText) => {
    const textToSend = manualText || input;
    if (!textToSend.trim()) return;

    const userMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      if (apiKey) {
        const botReply = await callGeminiAPI(textToSend);
        setMessages(prev => [...prev, { role: 'assistant', text: botReply, recommendations: [] }]);
        updateSuggestedChips(textToSend);
      } else {
        // Run local fallback when API key is not yet configured
        setTimeout(() => {
          const fallback = localSmartFallback(textToSend);
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              text: fallback.text,
              recommendations: fallback.recommendations
            }
          ]);
          updateSuggestedChips(textToSend, fallback.recommendations);
        }, 400);
      }
    } catch (err) {
      console.warn("Gemini API call failed, switching to local assistant:", err);
      const fallback = localSmartFallback(textToSend);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: fallback.text,
          recommendations: fallback.recommendations
        }
      ]);
      updateSuggestedChips(textToSend, fallback.recommendations);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-950/20 hover:scale-105 transition-all"
        >
          <Bot className="w-5 h-5 text-white"/>
          <span>Find Rooms (AI)</span>
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[550px] max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all">
          {/* Header */}
          <div className="p-4 bg-emerald-600 text-white flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white"/>
              </div>
              <div>
                <h4 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                  SafeRoom Concierge
                  <Sparkles className="w-3.5 h-3.5 text-emerald-200"/>
                </h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span>{apiKey ? "Powered by Gemini 2.5 Flash" : "Local Verified Assistant"}</span>
                  {apiKey && <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowKeyModal(!showKeyModal)}
                title="Configure Gemini API Key"
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <Key className="w-4 h-4"/>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4"/>
              </button>
            </div>
          </div>

          {/* Quick API Key Toggle Modal */}
          {showKeyModal && (
            <form onSubmit={handleSaveKey} className="p-3 bg-emerald-50 dark:bg-slate-800 border-b border-emerald-100 dark:border-slate-700 flex gap-2">
              <input
                type="password"
                placeholder="Paste Google AI Studio API key (AIza...)"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                className="flex-1 text-xs px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm"
              >
                <Check className="w-3.5 h-3.5"/> Save
              </button>
            </form>
          )}

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-slate-50 dark:bg-slate-950/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5"/>
                  </div>
                )}
                <div className="space-y-2 max-w-[85%]">
                  <div
                    className={`p-3 rounded-2xl whitespace-pre-line leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Recommendation Card Attachments */}
                  {m.recommendations && m.recommendations.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {m.recommendations.map(place => (
                        <div
                          key={place.id}
                          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60 shadow-sm space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{place.name}</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{place.rent.toLocaleString()}฿</span>
                          </div>
                          <p className="text-[10px] text-slate-500 line-clamp-1">📍 {place.address}</p>
                          <a
                            href={place.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline pt-0.5"
                          >
                            <MapPin className="w-3 h-3"/>
                            View on Google Maps <ExternalLink className="w-2.5 h-2.5 ml-0.5"/>
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {m.role === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5"/>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                <Bot className="w-3.5 h-3.5 text-emerald-500 animate-spin"/>
                <span>Searching Bangkok listings...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips (Dynamic Contextual) */}
          <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {suggestedChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950 dark:hover:text-emerald-300 whitespace-nowrap transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about rooms, areas, or rental safety..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-none rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-3.5 h-3.5"/>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
