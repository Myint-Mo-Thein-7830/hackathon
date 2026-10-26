import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Bot, User, Send, X, Sparkles, MapPin, ExternalLink, Key, Check, Train, DollarSign } from 'lucide-react';
import listingsData from '../data/mockListings.json';

// Official 50 Districts + Aliases + Typo Tolerance
const DISTRICT_ALIASES = {
  "Pathum Wan": ["pathu wan", "pathumwan", "patumwan", "siam", "chula", "samyan", "national stadium", "mbk", "ploenchit"],
  "Huai Khwang": ["huay kwang", "huaikwang", "huai khwang", "ratchada", "sutthisan", "thailand cultural centre", "rama 9", "phra ram 9"],
  "Thung Khru": ["thung khru", "thungkru", "bang mot", "bangmod", "kmutt", "pracha uthit"],
  "Rat Burana": ["rat burana", "radburana", "ratburana", "suksawat"],
  "Bang Khen": ["bang khen", "bangkhen", "phahonyothin", "wat phra sri", "ram inthra"],
  "Bang Kapi": ["bang kapi", "bangkapi", "lam sali", "the mall bangkapi", "happy land"],
  "Bang Na": ["bang na", "bangna", "udom suk", "udomsuk", "bearing", "lasalle"],
  "Bang Phlat": ["bang phlat", "bangphlat", "charan", "yanhee", "bang o", "pinklao"],
  "Bang Rak": ["bang rak", "bangrak", "silom", "chong nonsi", "sala daeng", "surawong"],
  "Bang Sue": ["bang sue", "bangsue", "tao poon", "taopoon", "wong sawang", "bang son"],
  "Bangkok Noi": ["bangkok noi", "bangkoknoi", "siriraj", "wang lang", "prannok", "fai chai"],
  "Bangkok Yai": ["bangkok yai", "bangkokyai", "tha phra", "thaphra", "itsaraphap"],
  "Chatuchak": ["chatuchak", "jatujak", "mo chit", "mochit", "ladprao", "kasetsart"],
  "Don Mueang": ["don mueang", "donmuang", "dmk", "song prapha", "songprapha"],
  "Dusit": ["dusit", "ratchawat", "sriyan", "thewet", "samsen", "suan sunandha", "suan dusit"],
  "Khlong San": ["khlong san", "klongsan", "iconsiam", "wongwian yai", "charoen nakhon"],
  "Khlong Toei": ["khlong toei", "klongtoey", "phrom phong", "thong lo", "thonglor", "ekkamai", "asoke", "queen sirikit"],
  "Lat Krabang": ["lat krabang", "ladkrabang", "kmitl", "chalong krung", "suvarnabhumi"],
  "Lat Phrao": ["lat phrao", "ladprao", "chok chai 4", "chokchai 4", "nak niwat", "wang hin"],
  "Phasi Charoen": ["phasi charoen", "phasicharoen", "seacon bangkae", "bang wa", "bangwa", "phetkasem 48"],
  "Phaya Thai": ["phaya thai", "phayathai", "ari", "saphan khwai", "saphankhwai", "sanam pao"],
  "Phra Khanong": ["phra khanong", "phrakhanong", "bang chak", "punnawithi", "on nut", "onnut"],
  "Phra Nakhon": ["phra nakhon", "phranakhon", "khao san", "khaosan", "sanam luang", "sam yot"],
  "Pom Prap Sattru Phai": ["pom prap", "pomprap", "bobae", "chinatown", "klong thom", "worachak"],
  "Ratchathewi": ["ratchathewi", "victory monument", "pratunam", "makkasan"],
  "Sai Mai": ["sai mai", "saimai", "saphan mai", "saphanmai", "sai yud", "kor por aor"],
  "Watthana": ["watthana", "wattana", "asok", "midtown asoke"]
};

// String similarity (Levenshtein distance) for typo detection
function getSimilarity(s1, s2) {
  const longer = s1.length < s2.length ? s2 : s1;
  const shorter = s1.length < s2.length ? s1 : s2;
  const longerLength = longer.length;
  if (longerLength === 0) return 1.0;
  
  const costs = [];
  for (let i = 0; i <= longer.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= shorter.length; j++) {
      if (i === 0) costs[j] = j;
      else if (j > 0) {
        let newValue = costs[j - 1];
        if (longer.charAt(i - 1) !== shorter.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[shorter.length] = lastValue;
  }
  return (longerLength - costs[shorter.length]) / parseFloat(longerLength);
}

// Intent Extraction Engine
function parseUserIntent(query) {
  const q = query.toLowerCase();

  // 1. Detect District (Exact, Alias, or Fuzzy)
  let detectedDistrict = null;
  for (const [official, aliases] of Object.entries(DISTRICT_ALIASES)) {
    if (q.includes(official.toLowerCase())) {
      detectedDistrict = official;
      break;
    }
    const matchedAlias = aliases.find(alias => q.includes(alias));
    if (matchedAlias) {
      detectedDistrict = official;
      break;
    }
  }

  // If still not found, check word-by-word fuzzy similarity for misspellings like "Pathu Wan"
  if (!detectedDistrict) {
    const words = q.split(/\s+/);
    for (const [official, aliases] of Object.entries(DISTRICT_ALIASES)) {
      const candidates = [official, ...aliases];
      for (const candidate of candidates) {
        // Compare against single words or two-word sliding window
        for (let i = 0; i < words.length; i++) {
          const single = words[i];
          const double = words.slice(i, i + 2).join(' ');
          if (getSimilarity(single, candidate) > 0.8 || getSimilarity(double, candidate) > 0.8) {
            detectedDistrict = official;
            break;
          }
        }
        if (detectedDistrict) break;
      }
      if (detectedDistrict) break;
    }
  }

  // 2. Detect Transit Lines
  let transitLine = null;
  if (q.includes('bts') || q.includes('skytrain')) transitLine = 'BTS';
  else if (q.includes('mrt') || q.includes('subway') || q.includes('underground')) transitLine = 'MRT';
  else if (q.includes('yellow line')) transitLine = 'Yellow Line';
  else if (q.includes('pink line')) transitLine = 'Pink Line';
  else if (q.includes('red line') || q.includes('srt')) transitLine = 'Red Line';
  else if (q.includes('arl') || q.includes('airport rail link')) transitLine = 'Airport Rail Link';

  // 3. Detect Budget / Price constraints
  let maxPrice = null;
  const priceKMatch = q.match(/(?:under|below|<|less than|max)\s*(\d+)\s*k/);
  const priceNumMatch = q.match(/(?:under|below|<|less than|budget of|max)\s*(\d{4,5})/);
  if (priceKMatch) {
    maxPrice = parseInt(priceKMatch[1], 10) * 1000;
  } else if (priceNumMatch) {
    maxPrice = parseInt(priceNumMatch[1], 10);
  } else if (q.includes('cheap') || q.includes('budget') || q.includes('low cost')) {
    maxPrice = 6000;
  }

  // 4. Property Type
  let propertyType = null;
  if (q.includes('condo') || q.includes('condominium')) propertyType = 'Condominium';
  else if (q.includes('dorm') || q.includes('apartment') || q.includes('room')) propertyType = 'Apartment';

  return { detectedDistrict, transitLine, maxPrice, propertyType };
}

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
      text: "Sawadee krub! I'm your **SafeRoom Accommodation Assistant** for Bangkok.\n\nTell me your preferred **district** (even if misspelled!), **budget** (e.g., *'under 8,000 THB'*), or **transit line** (BTS/MRT), and I'll find matching verified rooms with direct Google Maps links!",
      recommendations: []
    }
  ]);
  const [suggestedChips, setSuggestedChips] = useState([
    "Condos under 12k in Huai Khwang",
    "What is the standard deposit for a condo?",
    "Budget rooms under 6k in Pathum Wan"
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

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

  // Local Intent-Driven Matcher
  const filterListingsByIntent = (intent) => {
    return listingsData.filter(item => {
      if (intent.detectedDistrict && item.district.toLowerCase() !== intent.detectedDistrict.toLowerCase()) {
        return false;
      }
      if (intent.maxPrice && item.rent > intent.maxPrice) {
        return false;
      }
      if (intent.propertyType === 'Condominium' && item.type !== 'Condominium') {
        return false;
      }
      if (intent.propertyType === 'Apartment' && item.type === 'Condominium') {
        return false;
      }
      if (intent.transitLine && (!item.transit || !item.transit.toLowerCase().includes(intent.transitLine.toLowerCase()))) {
        return false;
      }
      return true;
    }).slice(0, 3);
  };

  const updateDynamicChips = (intent) => {
    if (intent.detectedDistrict) {
      setSuggestedChips([
        `Budget dorms under 6k in ${intent.detectedDistrict}`,
        `Is electricity direct MEA in ${intent.detectedDistrict}?`,
        `Condos near BTS/MRT in ${intent.detectedDistrict}`
      ]);
    } else if (intent.transitLine) {
      setSuggestedChips([
        `Rooms under 8k along ${intent.transitLine}`,
        `Best student areas on the ${intent.transitLine}`,
        `How much is advance rent for condos?`
      ]);
    } else {
      setSuggestedChips([
        "Condos under 10k in Bang Na",
        "Explain MEA meter vs private sub-meter",
        "Student dorms near KMUTT"
      ]);
    }
  };

  const localSmartFallback = (query, intent) => {
    const matched = filterListingsByIntent(intent);

    let text = "";
    if (intent.detectedDistrict) {
      text = `📍 Recognized area: **${intent.detectedDistrict}**${intent.maxPrice ? ` with budget **≤ ${intent.maxPrice.toLocaleString()} THB**` : ''}.\nHere are matching verified accommodations from our Bangkok database:`;
    } else if (matched.length > 0) {
      text = `Here are verified recommendations matching your criteria:`;
    } else if (query.toLowerCase().includes('deposit') || query.toLowerCase().includes('advance') || query.toLowerCase().includes('lease')) {
      text = "📋 **Bangkok Rental Deposit Standards:**\n\n• **Condominiums:** Standard terms require **(2+1) Months** (2 months deposit + 1 month advance rent). Electricity is billed via direct MEA government meter (~4.5 THB/unit).\n• **Apartments/Dorms:** Standard terms require **(1+1) Months** (1 month deposit + 1 month advance rent). Electricity is sub-metered at 7.0–8.0 THB/unit.\n\nAvoid landlords asking for 3+ months upfront!";
    } else {
      text = "I'm ready to help you find verified Bangkok accommodations! Try naming a district (*'Pathu Wan'*, *'Huai Khwang'*, *'Don Mueang'*), budget (*'under 8,000 THB'*), or transit line (*'near BTS'*).";
    }

    return { text, recommendations: matched };
  };

  const callGeminiAPI = async (userPrompt, intent) => {
    const matchedListings = filterListingsByIntent(intent);
    const catalogSubset = (matchedListings.length > 0 ? matchedListings : listingsData.slice(0, 30)).map(l => ({
      name: l.name,
      district: l.district,
      type: l.type,
      rent: `${l.rent} THB/mo`,
      transit: l.transit,
      electric: l.electricityBilling,
      maps: l.googleMapsUrl
    }));

    const systemPrompt = `
You are the SafeRoom Accommodation AI Concierge for Bangkok, Thailand.
Help tenants find rooms, understand Bangkok lease rules, and avoid rental traps.

CRITICAL INSTRUCTION - FUZZY DISTRICT & INTENT PARSING:
- Users frequently misspell Thai district names (e.g. "Pathu Wan" -> Pathum Wan, "Huay Kwang" -> Huai Khwang, "Ladprao" -> Lat Phrao, "Bangmod" -> Thung Khru, "Silom" -> Bang Rak).
- Always recognize the intended district, transit line (BTS/MRT), and budget (e.g. "under 10k").
- User Detected Intent: District="${intent.detectedDistrict || 'None'}", Transit="${intent.transitLine || 'None'}", MaxBudget="${intent.maxPrice || 'None'}".

Bangkok Rental Rules:
1. Condos: Standard (2+1) months [2 months deposit + 1 month advance]. Direct MEA meters (~4.5 THB/unit).
2. Apartments/Dorms: Standard (1+1) months [1 month deposit + 1 month advance]. Sub-meters 7-8 THB/unit.

Verified Listings Catalog for this context:
${JSON.stringify(catalogSubset, null, 1)}

Output requirements:
- If matching properties exist, recommend 1 to 2 options with their name, district, rent, and explicit Markdown Google Maps link: [View on Google Maps](URL).
- Be polite, concise, and helpful with bullet points.
`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nUser Question: ${userPrompt}` }] }]
      })
    });

    if (!res.ok) throw new Error(`Gemini API Error: ${res.statusText}`);
    const json = await res.json();
    return {
      text: json.candidates?.[0]?.content?.parts?.[0]?.text,
      recommendations: matchedListings
    };
  };

  const handleSend = async (manualText) => {
    const textToSend = manualText || input;
    if (!textToSend.trim()) return;

    const userMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // 1. Parse user intent (District, Transit, Budget)
    const intent = parseUserIntent(textToSend);
    updateDynamicChips(intent);

    try {
      if (apiKey) {
        const botResult = await callGeminiAPI(textToSend, intent);
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: botResult.text,
            recommendations: botResult.recommendations
          }
        ]);
      } else {
        setTimeout(() => {
          const fallback = localSmartFallback(textToSend, intent);
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              text: fallback.text,
              recommendations: fallback.recommendations
            }
          ]);
        }, 400);
      }
    } catch (err) {
      console.warn("Gemini call failed, switching to local intent fallback:", err);
      const fallback = localSmartFallback(textToSend, intent);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: fallback.text,
          recommendations: fallback.recommendations
        }
      ]);
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

          {/* Quick API Key Modal */}
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
                          {place.transit && (
                            <p className="text-[10px] text-slate-400 flex items-center gap-1 line-clamp-1">
                              <Train className="w-3 h-3 text-emerald-500"/> {place.transit}
                            </p>
                          )}
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
                <span>Searching verified Bangkok listings...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Dynamic Follow-up Chips */}
          <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {suggestedChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300 whitespace-nowrap transition-colors border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
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
              placeholder="e.g., 'Pathu Wan under 15k', 'condos near BTS Bang Wa'..."
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
