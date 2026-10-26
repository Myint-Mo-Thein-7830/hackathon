import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, X, Sparkles, MapPin, ExternalLink, Key, Check, Train, ArrowRight } from 'lucide-react';
import listingsData from '../data/mockListings.json';

// Official 50 Districts + Common Aliases & Misspellings
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
  "Dusit": ["dusit", "ratchawat", "sriyan", "thewet", "samsen", "suan sunandha", "suan dusit", "vajira"],
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

// Strips out all asterisks and bullet symbols so display stays completely clean
function cleanText(text) {
  if (!text) return "";
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/^[\s]*-\s+/gm, '• ')
    .trim();
}

// Levenshtein similarity for handling misspellings like "Pathu Wan" -> "Pathum Wan"
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

function parseUserIntent(query) {
  const q = query.toLowerCase();

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

  // Fuzzy match fallback for typos
  if (!detectedDistrict) {
    const words = q.split(/\s+/);
    for (const [official, aliases] of Object.entries(DISTRICT_ALIASES)) {
      const candidates = [official, ...aliases];
      for (const candidate of candidates) {
        for (let i = 0; i < words.length; i++) {
          const single = words[i];
          const double = words.slice(i, i + 2).join(' ');
          if (getSimilarity(single, candidate) > 0.78 || getSimilarity(double, candidate) > 0.78) {
            detectedDistrict = official;
            break;
          }
        }
        if (detectedDistrict) break;
      }
      if (detectedDistrict) break;
    }
  }

  let transitLine = null;
  if (q.includes('bts') || q.includes('skytrain')) transitLine = 'BTS';
  else if (q.includes('mrt') || q.includes('subway')) transitLine = 'MRT';
  else if (q.includes('yellow line')) transitLine = 'Yellow Line';
  else if (q.includes('pink line')) transitLine = 'Pink Line';
  else if (q.includes('red line') || q.includes('srt')) transitLine = 'Red Line';
  else if (q.includes('arl') || q.includes('airport link')) transitLine = 'Airport Rail Link';

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
      text: "Sawadee krub! I'm your SafeRoom Assistant.\n\nLooking for an accommodation in Bangkok? You can tell me a district (even if you misspell it), your budget (like 'under 7,000 THB'), or your preferred transit station.",
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

  const updateDynamicChips = (intent, query = "") => {
    const q = query.toLowerCase();

    if (intent.detectedDistrict) {
      setSuggestedChips([
        `Budget dorms under 6k in ${intent.detectedDistrict}`,
        `Direct MEA condos in ${intent.detectedDistrict}`,
        `What is the usual deposit in ${intent.detectedDistrict}?`
      ]);
    } else if (q.includes('deposit') || q.includes('advance') || q.includes('lease')) {
      setSuggestedChips([
        "Can a landlord deduct cleaning fees?",
        "What notice period is normal to move out?",
        "Find apartments with only 1 month deposit"
      ]);
    } else if (q.includes('electric') || q.includes('bill') || q.includes('meter')) {
      setSuggestedChips([
        "Is 8 THB per unit electric normal for a dorm?",
        "How much is electricity in a condo?",
        "What is MEA government rate?"
      ]);
    } else if (intent.transitLine) {
      setSuggestedChips([
        `Rooms under 8k near ${intent.transitLine}`,
        `Condos with free shuttle to ${intent.transitLine}`,
        `Compare condo vs dorm move-in cost`
      ]);
    } else {
      setSuggestedChips([
        "Rooms near Chula under 10k",
        "Student dorms near KMUTT Bang Mot",
        "Rooms near BTS Ari"
      ]);
    }
  };

  const localSmartFallback = (query, intent) => {
    const matched = filterListingsByIntent(intent);
    let text = "";

    if (intent.detectedDistrict) {
      const budgetNote = intent.maxPrice ? ` under ${intent.maxPrice.toLocaleString()} THB` : '';
      text = `Got it! Looking at ${intent.detectedDistrict}${budgetNote}.\n\nHere are verified places from our database. Would you prefer a modern condo with direct MEA electricity or a budget-friendly apartment?`;
    } else if (matched.length > 0) {
      text = `Here are verified recommendations matching your request. Click any card to view its exact location on Google Maps:`;
    } else if (query.toLowerCase().includes('deposit') || query.toLowerCase().includes('advance') || query.toLowerCase().includes('lease')) {
      text = "In Bangkok, rental deposits follow two clear standards:\n\n• Condominiums: Usually 2 months security deposit + 1 month advance rent (2+1). You get direct MEA government electric (~4.5 THB/unit).\n• Dorms & Apartments: Usually 1 month security deposit + 1 month advance rent (1+1). Electric is billed by sub-meter at 7 to 8 THB/unit.\n\nNever pay more than 1 month advance rent before moving in!";
    } else {
      text = "I'm ready to help! You can give me any Bangkok neighborhood (like Huai Khwang, Dusit, or Bang Na), transit line, or budget (like 'under 8,000 THB').";
    }

    return { text: cleanText(text), recommendations: matched };
  };

  const callGeminiAPI = async (userPrompt, intent) => {
    const matchedListings = filterListingsByIntent(intent);
    const catalogSubset = (matchedListings.length > 0 ? matchedListings : listingsData.slice(0, 25)).map(l => ({
      name: l.name,
      district: l.district,
      type: l.type,
      rent: `${l.rent} THB/mo`,
      transit: l.transit,
      electric: l.electricityBilling,
      maps: l.googleMapsUrl
    }));

    const systemPrompt = `
You are the SafeRoom Assistant for Bangkok accommodation rentals.
Be friendly, direct, authentic, and interactive. 

IMPORTANT FORMATTING RULES:
- DO NOT use asterisks (*) or (**) anywhere in your response. No bold asterisks, no italic asterisks.
- Keep sentences clean and natural. Use standard bullet points (•) if listing items.
- If the user misspells a district (e.g. "Pathu Wan" -> Pathum Wan, "Huay Kwang" -> Huai Khwang, "Ladprao" -> Lat Phrao), recognize it effortlessly without scolding them.
- User Intent: District="${intent.detectedDistrict || 'None'}", Transit="${intent.transitLine || 'None'}", MaxBudget="${intent.maxPrice || 'None'}".

Rental standards to reinforce:
- Condos: Standard (2+1) months [2 months deposit + 1 month advance]. Direct MEA meters (~4.5 THB/unit).
- Apartments/Dorms: Standard (1+1) months. Sub-meters 7-8 THB/unit.

Verified listings in our database:
${JSON.stringify(catalogSubset, null, 1)}

Respond in 2-3 engaging, conversational sentences, provide property details, and invite them to specify room type or amenities.
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
    const rawReply = json.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return {
      text: cleanText(rawReply),
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

    const intent = parseUserIntent(textToSend);
    updateDynamicChips(intent, textToSend);

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
        }, 350);
      }
    } catch (err) {
      console.warn("Switching to local assistant:", err);
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
          <span>Find Rooms</span>
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
                  SafeRoom Assistant
                  <Sparkles className="w-3.5 h-3.5 text-emerald-200"/>
                </h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span>{apiKey ? "Powered by Gemini 2.5 Flash" : "Bangkok Room Guide"}</span>
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

          {/* Quick API Key Dropdown */}
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
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm rounded-tl-none font-normal'
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
                            <span className="font-semibold text-slate-900 dark:text-white line-clamp-1">{place.name}</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{place.rent.toLocaleString()}฿</span>
                          </div>
                          <p className="text-[10px] text-slate-500 line-clamp-1">📍 {place.address}</p>
                          {place.transit && (
                            <p className="text-[10px] text-slate-400 flex items-center gap-1 line-clamp-1">
                              <Train className="w-3 h-3 text-emerald-500 shrink-0"/> {place.transit}
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
                <span>Finding matching places...</span>
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
                className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300 whitespace-nowrap transition-colors border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800 flex items-center gap-1"
              >
                <span>{chip}</span>
                <ArrowRight className="w-2.5 h-2.5 opacity-60"/>
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
              placeholder="e.g. Pathu Wan under 15k, condos near BTS Bang Wa..."
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
