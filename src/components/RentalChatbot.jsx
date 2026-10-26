import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Bot, User, Send, X, Sparkles, MapPin, ExternalLink, Key, Check, Train, ArrowRight } from 'lucide-react';
import listingsData from '../data/mockListings.json';

// All 50 Official Bangkok Districts
const ALL_50_DISTRICTS = [
  "Bang Bon", "Bang Kapi", "Bang Khen", "Bang Kho Laem", "Bang Khun Thian",
  "Bang Na", "Bang Phlat", "Bang Rak", "Bang Sue", "Bangkok Noi",
  "Bangkok Yai", "Bueng Kum", "Chatuchak", "Chom Thong", "Din Daeng",
  "Don Mueang", "Dusit", "Huai Khwang", "Khan Na Yao", "Khlong Sam Wa",
  "Khlong San", "Khlong Toei", "Lak Si", "Lat Krabang", "Lat Phrao",
  "Min Buri", "Nong Chok", "Nong Khaem", "Pathum Wan", "Phasi Charoen",
  "Phaya Thai", "Phra Khanong", "Phra Nakhon", "Pom Prap Sattru Phai", "Prawet",
  "Rat Burana", "Ratchathewi", "Sai Mai", "Samphanthawong", "Saphan Sung",
  "Sathon", "Suan Luang", "Taling Chan", "Tawi Watthana", "Thon Buri",
  "Thung Khru", "Wang Thonglang", "Watthana", "Yan Nawa", "Bang Khae"
];

// District Aliases & Common Nicknames / Station / Landmark Names
const DISTRICT_ALIASES = {
  "Khan Na Yao": ["khan na yao", "khannayao", "kha na yo", "khannayo", "fashion island", "khu bon", "ramintra km 8", "ramintra km 9", "promenade"],
  "Pathum Wan": ["pathum wan", "pathu wan", "pathumwan", "patumwan", "siam", "chula", "sam yan", "samyan", "national stadium", "mbk", "ploenchit"],
  "Huai Khwang": ["huai khwang", "huay kwang", "huaikwang", "huaykwang", "ratchada", "sutthisan", "thailand cultural centre", "rama 9", "phra ram 9"],
  "Thung Khru": ["thung khru", "thungkru", "bang mot", "bangmod", "kmutt", "pracha uthit", "phutthabucha"],
  "Rat Burana": ["rat burana", "radburana", "ratburana", "suksawat", "bang pakok"],
  "Bang Khen": ["bang khen", "bangkhen", "phahonyothin", "wat phra sri", "ram inthra", "anusan"],
  "Bang Kapi": ["bang kapi", "bangkapi", "lam sali", "the mall bangkapi", "happy land", "ramkhamhaeng"],
  "Bang Na": ["bang na", "bangna", "udom suk", "udomsuk", "bearing", "lasalle", "mega bangna"],
  "Bang Phlat": ["bang phlat", "bangphlat", "charan", "yanhee", "bang o", "pinklao", "sirindhorn"],
  "Bang Rak": ["bang rak", "bangrak", "silom", "chong nonsi", "sala daeng", "surawong", "samyan"],
  "Bang Sue": ["bang sue", "bangsue", "tao poon", "taopoon", "wong sawang", "bang son", "scg"],
  "Bangkok Noi": ["bangkok noi", "bangkoknoi", "siriraj", "wang lang", "prannok", "fai chai"],
  "Bangkok Yai": ["bangkok yai", "bangkokyai", "tha phra", "thaphra", "itsaraphap"],
  "Chatuchak": ["chatuchak", "jatujak", "mo chit", "mochit", "kasetsart", "ku"],
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
  "Sai Mai": ["sai mai", "saimai", "saphan mai", "saphanmai", "sai yud", "kor por aor", "permsin"],
  "Sathon": ["sathon", "sathorn", "surasak", "saint louis", "chan rd", "narathiwas"],
  "Watthana": ["watthana", "wattana", "asok", "midtown asoke", "thonglor", "ekamai"]
};

// Remove raw markdown asterisks and standardize bullets
function cleanText(text) {
  if (!text) return "";
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/^[\s]*-\s+/gm, '• ')
    .trim();
}

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Levenshtein similarity distance for typos
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

// Robust Intent Parser
function parseUserIntent(query) {
  const rawQ = query.toLowerCase();
  const normQ = normalize(query);

  // 1. Direct exact or alias match across all districts
  let detectedDistrict = null;

  for (const district of ALL_50_DISTRICTS) {
    if (rawQ.includes(district.toLowerCase()) || normQ.includes(normalize(district))) {
      detectedDistrict = district;
      break;
    }
  }

  if (!detectedDistrict) {
    for (const [official, aliases] of Object.entries(DISTRICT_ALIASES)) {
      if (aliases.some(alias => rawQ.includes(alias) || normQ.includes(normalize(alias)))) {
        detectedDistrict = official;
        break;
      }
    }
  }

  // 2. Fuzzy match against all 50 districts and aliases (e.g., "Kha Na Yo" -> "Khan Na Yao")
  if (!detectedDistrict) {
    const words = rawQ.split(/\s+/);
    let bestScore = 0;
    let bestMatch = null;

    for (const district of ALL_50_DISTRICTS) {
      const candidates = [district, ...(DISTRICT_ALIASES[district] || [])];
      for (const cand of candidates) {
        const normCand = normalize(cand);
        // Compare with sliding 1 to 3 word windows
        for (let i = 0; i < words.length; i++) {
          const window1 = normalize(words[i]);
          const window2 = normalize(words.slice(i, i + 2).join(' '));
          const window3 = normalize(words.slice(i, i + 3).join(' '));

          const sim1 = getSimilarity(window1, normCand);
          const sim2 = getSimilarity(window2, normCand);
          const sim3 = getSimilarity(window3, normCand);
          const maxSim = Math.max(sim1, sim2, sim3);

          if (maxSim > bestScore) {
            bestScore = maxSim;
            bestMatch = district;
          }
        }
      }
    }

    if (bestScore >= 0.72) {
      detectedDistrict = bestMatch;
    }
  }

  // 3. Transit Detection
  let transitLine = null;
  if (rawQ.includes('bts') || rawQ.includes('skytrain')) transitLine = 'BTS';
  else if (rawQ.includes('mrt') || rawQ.includes('subway')) transitLine = 'MRT';
  else if (rawQ.includes('yellow line')) transitLine = 'Yellow Line';
  else if (rawQ.includes('pink line')) transitLine = 'Pink Line';
  else if (rawQ.includes('red line') || rawQ.includes('srt')) transitLine = 'Red Line';
  else if (rawQ.includes('arl') || rawQ.includes('airport link')) transitLine = 'Airport Rail Link';

  // 4. Budget constraints
  let maxPrice = null;
  const priceKMatch = rawQ.match(/(?:under|below|<|less than|budget is|budget of|max)\s*(\d+)\s*k/);
  const priceNumMatch = rawQ.match(/(?:under|below|<|less than|budget is|budget of|max)\s*(\d{4,5})/);
  if (priceKMatch) {
    maxPrice = parseInt(priceKMatch[1], 10) * 1000;
  } else if (priceNumMatch) {
    maxPrice = parseInt(priceNumMatch[1], 10);
  } else if (rawQ.includes('cheap') || rawQ.includes('budget') || rawQ.includes('low cost')) {
    maxPrice = 6000;
  }

  // 5. Property Type
  let propertyType = null;
  if (rawQ.includes('condo') || rawQ.includes('condominium')) propertyType = 'Condominium';
  else if (rawQ.includes('dorm') || rawQ.includes('apartment') || rawQ.includes('room')) propertyType = 'Apartment';

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
      text: "Sawadee krub! I'm your Rental Assistant.\n\nHow can I help you find accommodation in Bangkok today? Feel free to share your preferred district, monthly budget, or transit station.",
      recommendations: []
    }
  ]);

  const [suggestedChips, setSuggestedChips] = useState([
    "Condos in Khan Na Yao under 12k",
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

  // Strictly filter listings based on recognized user intent
  const filterListingsByIntent = (intent) => {
    if (!intent.detectedDistrict && !intent.transitLine && !intent.maxPrice && !intent.propertyType) {
      return [];
    }

    return listingsData.filter(item => {
      // Must match district if detected
      if (intent.detectedDistrict && item.district.toLowerCase() !== intent.detectedDistrict.toLowerCase()) {
        return false;
      }
      // Must match budget if specified
      if (intent.maxPrice && item.rent > intent.maxPrice) {
        return false;
      }
      // Must match property type if specified
      if (intent.propertyType === 'Condominium' && item.type !== 'Condominium') {
        return false;
      }
      if (intent.propertyType === 'Apartment' && item.type === 'Condominium') {
        return false;
      }
      // Must match transit line if specified
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
        `Condos with MEA meter in ${intent.detectedDistrict}`,
        `What is the usual deposit in ${intent.detectedDistrict}?`
      ]);
    } else if (q.includes('deposit') || q.includes('advance') || q.includes('lease')) {
      setSuggestedChips([
        "Can a landlord deduct cleaning fees?",
        "Standard notice period to move out",
        "Places with only 1 month deposit"
      ]);
    } else if (q.includes('electric') || q.includes('bill') || q.includes('meter')) {
      setSuggestedChips([
        "Is 8 THB per unit electric legal for dorms?",
        "How much is electricity in a condo?",
        "Difference between MEA meter and sub-meter"
      ]);
    } else if (intent.transitLine) {
      setSuggestedChips([
        `Rooms under 8k along ${intent.transitLine}`,
        `Condos near ${intent.transitLine} stations`,
        `Move-in deposit for condos vs dorms`
      ]);
    } else {
      setSuggestedChips([
        "Rooms in Khan Na Yao under 10k",
        "Condos near BTS Bang Wa",
        "Student rooms near Chula"
      ]);
    }
  };

  const localSmartFallback = (query, intent) => {
    const matched = filterListingsByIntent(intent);
    let text = "";

    if (intent.detectedDistrict) {
      const budgetNote = intent.maxPrice ? ` within ${intent.maxPrice.toLocaleString()} THB/month` : '';
      if (matched.length > 0) {
        text = `Here are verified accommodations in ${intent.detectedDistrict}${budgetNote}. Click any card to open its exact location on Google Maps:`;
      } else {
        text = `I found your search for ${intent.detectedDistrict}${budgetNote}, but there are currently no verified listings within that exact price bracket. Would you like to adjust your budget or see nearby transit options?`;
      }
    } else if (query.toLowerCase().includes('deposit') || query.toLowerCase().includes('advance') || query.toLowerCase().includes('lease')) {
      text = "In Bangkok, rental deposits follow two clear standards:\n\n• Condominiums: Standard terms require 2 months security deposit + 1 month advance rent (2+1). You get direct MEA government electric billing (~4.5 THB/unit).\n• Dorms & Apartments: Standard terms require 1 month security deposit + 1 month advance rent (1+1). Electricity is billed by sub-meter at 7 to 8 THB/unit.\n\nNever pay more than 1 month advance rent upfront.";
    } else {
      text = "I can find rooms for you anywhere in Bangkok. Please tell me your preferred district (such as Khan Na Yao, Huai Khwang, or Dusit), your budget, or transit line.";
    }

    return { text: cleanText(text), recommendations: matched };
  };

  const callGeminiAPI = async (userPrompt, intent) => {
    const matchedListings = filterListingsByIntent(intent);
    
    // STRICT: Only feed properties in the detected district to Gemini so it cannot cross-recommend other districts!
    let relevantCatalog = [];
    if (intent.detectedDistrict) {
      relevantCatalog = listingsData
        .filter(l => l.district.toLowerCase() === intent.detectedDistrict.toLowerCase())
        .slice(0, 20);
    } else {
      relevantCatalog = matchedListings.length > 0 ? matchedListings : listingsData.slice(0, 20);
    }

    const compactData = relevantCatalog.map(l => ({
      name: l.name,
      district: l.district,
      type: l.type,
      rent: `${l.rent} THB/mo`,
      transit: l.transit,
      electric: l.electricityBilling,
      maps: l.googleMapsUrl
    }));

    const systemPrompt = `
You are Rental Assistant for Bangkok living and accommodation search.
Be friendly, natural, and helpful.

STRICT ACCURACY RULES:
1. The user is asking about: District="${intent.detectedDistrict || 'Unspecified'}", MaxBudget="${intent.maxPrice || 'Unspecified'}".
2. If a district is detected (e.g., Khan Na Yao), you MUST ONLY suggest properties in that exact district. NEVER suggest places from Thung Khru, Bang Mot, or other districts when another district was requested.
3. If no properties exist in the provided list for that district, state clearly that you checked ${intent.detectedDistrict} and offer advice on typical rents there.
4. ZERO ASTERISKS: DO NOT use asterisks (*) or (**) anywhere in your response. No markdown asterisks for bold or italic. Use standard bullet points (•) if needed.
5. Provide clear details on rent, move-in cost, and electricity type.
`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${systemPrompt}\n\nAvailable properties in target district:\n${JSON.stringify(compactData, null, 1)}\n\nUser Message: ${userPrompt}`
              }
            ]
          }
        ]
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
        }, 300);
      }
    } catch (err) {
      console.warn("Switching to local verified engine:", err);
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
          <span>Rental Assistant</span>
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
                  Rental Assistant
                  <Sparkles className="w-3.5 h-3.5 text-emerald-200"/>
                </h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span>{apiKey ? "Powered by Gemini 2.5 Flash" : "Bangkok Rental Guide"}</span>
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
              placeholder="Ask about districts, budgets, or transit..."
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
