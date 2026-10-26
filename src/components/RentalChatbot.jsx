import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, X, Sparkles, MapPin, ExternalLink, Key, Check, Train, RotateCcw, ArrowRight } from 'lucide-react';
import listingsData from '../data/mockListings.json';

// Comprehensive Bangkok 50-District Location Engine
// Maps all 50 districts, 180 subdistricts (khwaeng), landmarks, and common misspellings
// Note: Thawi Watthana is listed before Watthana to prevent substring interception
const BANGKOK_DISTRICTS = [
  {
    name: "Khan Na Yao",
    aliases: [
      "khan na yao", "khannayao", "kha na yo", "khannayo", "khannayaw", "kan na yao",
      "ram inthra", "fashion island", "the promenade", "siam amazing park", "siam park city",
      "navatanee", "khu bon", "ramintra 83", "ramintra km 8", "ramintra km 9", "คันนายาว"
    ]
  },
  {
    name: "Bang Kapi",
    aliases: [
      "bang kapi", "bangkapi", "khlong chan", "hua mak", "the mall bangkapi",
      "ramkhamhaeng university", "rajamangala", "lam sali", "happy land", "บางกะปิ"
    ]
  },
  {
    name: "Bang Khen",
    aliases: [
      "bang khen", "bangkhen", "anusawari", "tha raeng", "wat phra si mahathat",
      "phranakhon rajabhat", "ram inthra km 1", "ram inthra km 2", "บางเขน"
    ]
  },
  {
    name: "Bang Kho Laem",
    aliases: [
      "bang kho laem", "bangkholaem", "wat phraya krai", "bang khlo",
      "asiatique", "rama 3", "charoen krung", "บางคอแหลม"
    ]
  },
  {
    name: "Bang Na",
    aliases: [
      "bang na", "bangna", "bang na nuea", "bang na tai", "bitec",
      "central bangna", "mega bangna", "bearing", "lasalle", "บางนา"
    ]
  },
  {
    name: "Bang Rak",
    aliases: [
      "bang rak", "bangrak", "maha phruettharam", "si phraya", "suriyawong", "si lom",
      "silom", "mahanakhon", "patpong", "sala daeng", "chong nonsi", "บางรัก"
    ]
  },
  {
    name: "Bang Sue",
    aliases: [
      "bang sue", "bangsue", "wong sawang", "krung thep aphiwat", "bang sue grand station",
      "tao poon", "taopoon", "bang pho", "scg", "gateway at bangsue", "บางซื่อ"
    ]
  },
  {
    name: "Bueng Kum",
    aliases: [
      "bueng kum", "buengkum", "khlong kum", "nawamin", "nuan chan",
      "pattavikorn", "seri thai park", "chocolate ville", "บึงกุ่ม"
    ]
  },
  {
    name: "Chatuchak",
    aliases: [
      "chatuchak", "jatujak", "lat yao", "chan kasem", "chomphon", "sena nikhom",
      "jj market", "rot fai park", "central ladprao", "union mall", "ratchayothin", "kasetsart", "จตุจักร"
    ]
  },
  {
    name: "Din Daeng",
    aliases: [
      "din daeng", "dindaeng", "ratchadaphisek", "utcc", "din daeng market",
      "pracha songkhro", "ดินแดง"
    ]
  },
  {
    name: "Don Mueang",
    aliases: [
      "don mueang", "donmuang", "si kan", "sanambin", "dmk", "don mueang airport",
      "song prapha", "songprapha", "chang akat uthit", "saranakhom", "ดอนเมือง"
    ]
  },
  {
    name: "Dusit",
    aliases: [
      "dusit", "wachiraphayaban", "suan chitlada", "si yaek maha nak", "thanon nakhon chai si",
      "parliament", "sappaya-sapasathan", "dusit palace", "royal plaza", "chitralada",
      "ratchawat", "sriyan", "thewet", "samsen", "suan sunandha", "suan dusit", "vajira", "ดุสิต"
    ]
  },
  {
    name: "Huai Khwang",
    aliases: [
      "huai khwang", "huay kwang", "huaikwang", "huaykwang", "sam sen nok",
      "ratchada", "sutthisan", "thailand cultural centre", "rama 9", "phra ram 9",
      "the street ratchada", "meng jai", "20 mithuna", "ห้วยขวาง"
    ]
  },
  {
    name: "Khlong Sam Wa",
    aliases: [
      "khlong sam wa", "klongsamwa", "sam wa tawan tok", "sam wa tawan ok", "bang chan",
      "sai kong din", "safari world", "phraya suren", "hathairat", "kip mu", "คลองสามวา"
    ]
  },
  {
    name: "Khlong Toei",
    aliases: [
      "khlong toei", "klongtoey", "khlong tan", "phra khanong", "bangkok port",
      "qsncc", "queen sirikit", "benjakitti", "sukhumvit 22", "sukhumvit 24", "sukhumvit 26", "sukhumvit 36", "คลองเตย"
    ]
  },
  {
    name: "Lak Si",
    aliases: [
      "lak si", "laksi", "thung song hong", "talat bang khen", "chaeng watthana",
      "government complex", "it square", "chulabhorn", "chinnakhet", "dpu", "หลักสี่"
    ]
  },
  {
    name: "Lat Krabang",
    aliases: [
      "lat krabang", "ladkrabang", "khlong song ton nun", "khlong sam prawet", "lam pla thio",
      "thap yao", "khum thong", "kmitl", "hua takhe", "chalong krung", "soi jinda", "suvarnabhumi", "ลาดกระบัง"
    ]
  },
  {
    name: "Lat Phrao",
    aliases: [
      "lat phrao", "ladprao", "chorakhe bua", "chok chai 4", "chokchai 4",
      "central eastville", "pradit manutham", "wat lat phrao", "nak niwat", "wang hin", "ลาดพร้าว"
    ]
  },
  {
    name: "Min Buri",
    aliases: [
      "min buri", "minburi", "saen saep", "min buri market", "sihaburanukit",
      "suwinthawong", "tharakon", "rat uthit", "มีนบุรี"
    ]
  },
  {
    name: "Nong Chok",
    aliases: [
      "nong chok", "nongchok", "krathum rai", "khlong sip", "khok faet",
      "bangkok arena", "mahanakorn", "mut", "chueam samphan", "หนองจอก"
    ]
  },
  {
    name: "Pathum Wan",
    aliases: [
      "pathum wan", "pathu wan", "pathumwan", "patumwan", "rong mueang", "wang mai", "lumphini",
      "siam square", "siam paragon", "centralworld", "mbk", "chulalongkorn", "chula",
      "banthat thong", "sam yan", "samyan", "national stadium", "ploenchit", "ปทุมวัน"
    ]
  },
  {
    name: "Phaya Thai",
    aliases: [
      "phaya thai", "phayathai", "sam sen nai", "ari", "phahonyothin 7",
      "saphan khwai", "saphankhwai", "sanam pao", "pradiphat", "พญาไท"
    ]
  },
  {
    name: "Phra Khanong",
    aliases: [
      "phra khanong", "phrakhanong", "bang chak", "phra khanong tai",
      "true digital park", "punnawithi", "on nut", "onnut", "sukhumvit 101", "พระโขนง"
    ]
  },
  {
    name: "Phra Nakhon",
    aliases: [
      "phra nakhon", "phranakhon", "rattanakosin", "grand palace", "wat pho", "khaosan",
      "khao san", "sanam luang", "giant swing", "sao chingcha", "sam yot", "tanao", "wisut kasat", "พระนคร"
    ]
  },
  {
    name: "Pom Prap Sattru Phai",
    aliases: [
      "pom prap", "pomprap", "wat thep sirin", "khlong maha nak", "ban bat", "wat sommanat",
      "golden mount", "wat saket", "bobae", "khlong thom", "worachak", "ป้อมปราบศัตรูพ่าย"
    ]
  },
  {
    name: "Prawet",
    aliases: [
      "prawet", "nong bon", "dokmai", "suan luang rama 9", "seacon square",
      "paradise park", "srinagarindra", "ban thap chang", "ประเวศ"
    ]
  },
  {
    name: "Ratchathewi",
    aliases: [
      "ratchathewi", "thung phaya thai", "makkasan", "victory monument",
      "pratunam", "platinum mall", "baiyoke", "ratchaprarop", "ราชเทวี"
    ]
  },
  {
    name: "Sai Mai",
    aliases: [
      "sai mai", "saimai", "o ngoen", "khlong thanon", "saphan mai", "saphanmai",
      "yaek kor por aor", "ying charoen", "sukhaphiban 5", "permsin", "สายไหม"
    ]
  },
  {
    name: "Samphanthawong",
    aliases: [
      "samphanthawong", "chakkrawat", "talat noi", "yaowarat", "chinatown",
      "sampheng", "wat traimit", "สัมพันธวงศ์"
    ]
  },
  {
    name: "Saphan Sung",
    aliases: [
      "saphan sung", "saphansung", "rat phatthana", "thap chang", "mistine",
      "sammakorn", "krungthep kreetha", "สะพานสูง"
    ]
  },
  {
    name: "Sathon",
    aliases: [
      "sathon", "sathorn", "thung wat don", "thung maha mek", "north sathorn", "south sathorn",
      "suan phlu", "suanplu", "saint louis", "surasak", "sathorn pier", "chan rd", "สาทร"
    ]
  },
  {
    name: "Suan Luang",
    aliases: [
      "suan luang", "suanluang", "phatthanakan", "thanya park", "on nut 46", "on nut 66", "si nut", "สวนหลวง"
    ]
  },
  {
    name: "Wang Thonglang",
    aliases: [
      "wang thonglang", "wangthonglang", "saphan song", "khlong chaokhun sing", "phlapphla",
      "town in town", "lat phrao 101", "lat phrao 87", "srivara", "วังทองหลาง"
    ]
  },
  {
    name: "Thawi Watthana",
    aliases: [
      "thawi watthana", "tawi watthana", "thawiwatthana", "tawiwatthana", "sala thammasop",
      "utthayan", "aksa", "sanam luang 2", "bangkokthonburi", "btu", "ทวีวัฒนา"
    ]
  },
  {
    name: "Watthana",
    aliases: [
      "watthana", "wattana", "asoke", "terminal 21", "phrom phong", "emdistrict",
      "thong lo", "thonglor", "ekkamai", "ekamai", "pridi banomyong", "sukhumvit 71", "วัฒนา"
    ]
  },
  {
    name: "Yan Nawa",
    aliases: [
      "yan nawa", "yannawa", "chong nonsi", "bang phongphang", "rama 3",
      "central rama 3", "bhumibol bridge", "brt wat dan", "brt wat dokmai", "ยานนาวา"
    ]
  },
  {
    name: "Bang Bon",
    aliases: [
      "bang bon", "bangbon", "bang bon nuea", "bang bon tai", "ekkachai", "bang bon market", "บางบอน"
    ]
  },
  {
    name: "Bang Khae",
    aliases: [
      "bang khae", "bangkhae", "lak song", "the mall bangkae", "phetkasem", "bang khae market", "บางแค"
    ]
  },
  {
    name: "Bang Khun Thian",
    aliases: [
      "bang khun thian", "bangkhunthian", "tha kham", "samae dam", "central rama 2", "bang kradi", "บางขุนเทียน"
    ]
  },
  {
    name: "Bang Phlat",
    aliases: [
      "bang phlat", "bangphlat", "bang o", "bang bamru", "bang yi khan",
      "charan sanit wong", "yanhee hospital", "rama 8 bridge", "pinklao", "บางพลัด"
    ]
  },
  {
    name: "Bangkok Noi",
    aliases: [
      "bangkok noi", "bangkoknoi", "siri rat", "ban chang lo", "bang khun non",
      "siriraj", "wang lang", "prannok", "fai chai", "บางกอกน้อย"
    ]
  },
  {
    name: "Bangkok Yai",
    aliases: [
      "bangkok yai", "bangkokyai", "wat arun", "wat tha phra", "temple of dawn",
      "tha phra", "itsaraphap", "บางกอกใหญ่"
    ]
  },
  {
    name: "Chom Thong",
    aliases: [
      "chom thong", "chomthong", "wutthakat", "dao khanong", "จอมทอง"
    ]
  },
  {
    name: "Khlong San",
    aliases: [
      "khlong san", "klongsan", "somdet chao phraya", "charoen nakhon",
      "iconsiam", "gold line", "tha din daeng", "wongwian yai", "คลองสาน"
    ]
  },
  {
    name: "Nong Khaem",
    aliases: [
      "nong khaem", "nongkhaem", "nong khang phlu", "southeast asia university",
      "thonburi university", "phetkasem 77", "phetkasem 81", "phetkasem 110", "หนองแขม"
    ]
  },
  {
    name: "Phasi Charoen",
    aliases: [
      "phasi charoen", "phasicharoen", "bang wa", "bangwa", "bang chak", "bang waek",
      "wat paknam", "seacon bangkae", "phetkasem 48", "phetkasem 56", "ภาษีเจริญ"
    ]
  },
  {
    name: "Rat Burana",
    aliases: [
      "rat burana", "radburana", "ratburana", "bang pakok", "kasikornbank hq",
      "suksawat", "ราษฎร์บูรณะ"
    ]
  },
  {
    name: "Taling Chan",
    aliases: [
      "taling chan", "talingchan", "khlong chak phra", "bang ramat", "suan phak",
      "taling chan floating market", "khlong lat mayom", "the circle ratchapruk", "sai tai mai", "ตลิ่งชัน"
    ]
  },
  {
    name: "Thon Buri",
    aliases: [
      "thon buri", "thonburi", "wat kanlaya", "talat phlu", "talatphlu",
      "bukkhalo", "pho nimit", "wongwian yai", "kudi chin", "ธนบุรี"
    ]
  },
  {
    name: "Thung Khru",
    aliases: [
      "thung khru", "thungkru", "bang mot", "bangmod", "kmutt",
      "thonburirom park", "pracha uthit", "phutthabucha", "ทุ่งครุ"
    ]
  }
];

// Clean formatting: removes raw markdown asterisks and standardizes bullets
function cleanText(text) {
  if (!text) return "";
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/^[\s]*-\s+/gm, '• ')
    .trim();
}

function normalize(str) {
  if (!str) return "";
  return str.toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]/gu, '');
}

// Levenshtein similarity distance for typo tolerance
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

// Intent Parser: District, Transit Line, and Budget
function parseUserIntent(query) {
  const rawQ = query.toLowerCase();
  const normQ = normalize(query);

  let detectedDistrict = null;

  // If the query is just a greeting, do not search for districts
  const isPureGreeting = /^(hi|hello|hey|sawadee|sawasdee|good morning|good afternoon|good evening|greetings|help)(\s*!*)?$/i.test(query.trim());
  if (isPureGreeting) {
    return { detectedDistrict: null, transitLine: null, maxPrice: null };
  }

  // 1. Direct and Alias match across the 50 districts
  for (const entry of BANGKOK_DISTRICTS) {
    const normName = normalize(entry.name);
    if (rawQ.includes(entry.name.toLowerCase()) || (normName.length >= 4 && normQ.includes(normName))) {
      detectedDistrict = entry.name;
      break;
    }
    const matched = entry.aliases.find(alias => {
      const normAlias = normalize(alias);
      if (!normAlias || normAlias.length < 3) return false;
      return rawQ.includes(alias.toLowerCase()) || normQ.includes(normAlias);
    });
    if (matched) {
      detectedDistrict = entry.name;
      break;
    }
  }

  // 2. Fuzzy match for misspelled inputs (only evaluate words with at least 4 letters)
  if (!detectedDistrict) {
    const words = rawQ.split(/\s+/).filter(w => w.length >= 4);
    let bestScore = 0;
    let bestDistrict = null;

    for (const entry of BANGKOK_DISTRICTS) {
      const candidates = [entry.name, ...entry.aliases];
      for (const cand of candidates) {
        const normCand = normalize(cand);
        if (!normCand || normCand.length < 4) continue;
        for (let i = 0; i < words.length; i++) {
          const w1 = normalize(words[i]);
          const w2 = normalize(words.slice(i, i + 2).join(' '));
          const w3 = normalize(words.slice(i, i + 3).join(' '));

          const sim1 = getSimilarity(w1, normCand);
          const sim2 = getSimilarity(w2, normCand);
          const sim3 = getSimilarity(w3, normCand);
          const top = Math.max(sim1, sim2, sim3);

          if (top > bestScore) {
            bestScore = top;
            bestDistrict = entry.name;
          }
        }
      }
    }

    if (bestScore >= 0.72) {
      detectedDistrict = bestDistrict;
    }
  }

  // 3. Transit match
  let transitLine = null;
  if (rawQ.includes('bts') || rawQ.includes('skytrain')) transitLine = 'BTS';
  else if (rawQ.includes('mrt') || rawQ.includes('subway')) transitLine = 'MRT';
  else if (rawQ.includes('yellow line')) transitLine = 'Yellow Line';
  else if (rawQ.includes('pink line')) transitLine = 'Pink Line';
  else if (rawQ.includes('red line') || rawQ.includes('srt')) transitLine = 'Red Line';
  else if (rawQ.includes('arl') || rawQ.includes('airport link')) transitLine = 'Airport Rail Link';

  // 4. Budget constraints
  let maxPrice = null;
  const priceKMatch = rawQ.match(/(?:under|below|<|less than|budget of|budget is|max|around)\s*(\d+)\s*k/);
  const priceNumMatch = rawQ.match(/(?:under|below|<|less than|budget of|budget is|max|around)\s*(\d{4,5})/);
  if (priceKMatch) {
    maxPrice = parseInt(priceKMatch[1], 10) * 1000;
  } else if (priceNumMatch) {
    maxPrice = parseInt(priceNumMatch[1], 10);
  } else if (rawQ.includes('cheap') || rawQ.includes('budget') || rawQ.includes('low cost')) {
    maxPrice = 6000;
  }

  return { detectedDistrict, transitLine, maxPrice };
}

export default function RentalChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    return import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key') || '';
  });
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState('');
  const [input, setInput] = useState('');

  const INITIAL_MESSAGE = {
    role: 'assistant',
    text: "Sawadee krub! I'm your Rental Assistant.\n\nLooking for an accommodation in Bangkok? Feel free to tell me your preferred district, budget, or nearby transit line.",
    recommendations: []
  };

  const [messages, setMessages] = useState([INITIAL_MESSAGE]);

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

  // Reset conversation back to the initial clean state
  const resetChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setInput('');
    setSuggestedChips([
      "Condos in Khan Na Yao under 12k",
      "What is the standard deposit for a condo?",
      "Budget rooms under 6k in Pathum Wan"
    ]);
  };

  // Strict District Isolation Search
  // If the user specifies a district, NEVER return listings from any other district!
  const getAccurateRecommendations = (intent) => {
    if (!intent.detectedDistrict && !intent.transitLine && !intent.maxPrice) {
      return [];
    }

    if (intent.detectedDistrict) {
      const normTarget = normalize(intent.detectedDistrict).replace('thawi', 'tawi');
      const inDistrict = listingsData.filter(item => 
        item.district && (
          item.district.toLowerCase() === intent.detectedDistrict.toLowerCase() ||
          normalize(item.district).replace('thawi', 'tawi') === normTarget
        )
      );

      if (inDistrict.length === 0) {
        return [];
      }

      if (intent.maxPrice) {
        const budgetMatch = inDistrict.filter(item => item.rent <= intent.maxPrice);
        if (budgetMatch.length > 0) return budgetMatch.slice(0, 3);
        // If none strictly under budget, show lowest price entries in that district
        return inDistrict.sort((a, b) => a.rent - b.rent).slice(0, 2);
      }

      return inDistrict.slice(0, 3);
    }

    if (intent.transitLine) {
      let pool = listingsData.filter(item =>
        item.transit && item.transit.toLowerCase().includes(intent.transitLine.toLowerCase())
      );
      if (intent.maxPrice) {
        pool = pool.filter(item => item.rent <= intent.maxPrice);
      }
      return pool.slice(0, 3);
    }

    if (intent.maxPrice) {
      return listingsData.filter(item => item.rent <= intent.maxPrice).slice(0, 3);
    }

    return [];
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
        "Is 8 THB per unit electric normal for dorms?",
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
    const matched = getAccurateRecommendations(intent);
    let text = "";

    const q = query.toLowerCase().trim();
    const isGreeting = /^(hi|hello|hey|sawadee|sawasdee|good morning|good afternoon|good evening|greetings|help)(\s.*)?$/i.test(q);

    if (isGreeting) {
      return {
        text: "Sawadee krub! Welcome to Bangkok. I am your Rental Assistant.\n\nHow can I help you today? Feel free to ask me:\n• To find verified accommodations in any district (e.g., Khan Na Yao, Huai Khwang, or Sathon)\n• Recommendations under a specific budget (e.g., condos under 12k THB)\n• Legal rental rules (fair deposits, advance rent, MEA vs private electricity)",
        recommendations: []
      };
    }

    if (intent.detectedDistrict) {
      const budgetNote = intent.maxPrice ? ` within ${intent.maxPrice.toLocaleString()} THB/month` : '';
      if (matched.length > 0) {
        text = `Here are verified accommodations in ${intent.detectedDistrict}${budgetNote}. Click any card to view its location on Google Maps:`;
      } else {
        text = `I searched for verified places in ${intent.detectedDistrict}${budgetNote}, but none matched that exact criteria. Would you like to adjust your budget or see all available options in ${intent.detectedDistrict}?`;
      }
    } else if (query.toLowerCase().includes('deposit') || query.toLowerCase().includes('advance') || query.toLowerCase().includes('lease')) {
      text = "In Bangkok, rental deposits follow two clear standards:\n\n• Condominiums: Standard terms require 2 months security deposit + 1 month advance rent (2+1). You get direct MEA government electric billing (~4.5 THB/unit).\n• Dorms & Apartments: Standard terms require 1 month security deposit + 1 month advance rent (1+1). Electricity is billed by sub-meter at 7 to 8 THB/unit.\n\nNever pay more than 1 month advance rent upfront.";
    } else {
      text = "I can help you find rooms anywhere in Bangkok. Please tell me your preferred district (such as Khan Na Yao, Huai Khwang, or Dusit), your budget, or your transit line.";
    }

    const shouldShowCards = Boolean(intent.detectedDistrict || intent.transitLine || intent.maxPrice);
    return { text: cleanText(text), recommendations: shouldShowCards ? matched : [] };
  };

  const callGeminiAPI = async (userPrompt, intent) => {
    const matchedListings = getAccurateRecommendations(intent);

    let districtCatalog = [];
    if (intent.detectedDistrict) {
      const normTarget = normalize(intent.detectedDistrict).replace('thawi', 'tawi');
      districtCatalog = listingsData
        .filter(l => l.district && (
          l.district.toLowerCase() === intent.detectedDistrict.toLowerCase() ||
          normalize(l.district).replace('thawi', 'tawi') === normTarget
        ))
        .slice(0, 15);
    } else {
      districtCatalog = matchedListings.slice(0, 15);
    }

    const compactData = districtCatalog.map(l => ({
      name: l.name,
      district: l.district,
      type: l.type,
      rent: `${l.rent} THB/mo`,
      transit: l.transit,
      electric: l.electricityBilling,
      maps: l.googleMapsUrl
    }));

    const systemPrompt = `
You are Rental Assistant, an intelligent and friendly Bangkok living and accommodation rental guide.
Be conversational, helpful, and natural.

STRICT ACCURACY RULES:
1. GREETINGS: If the user is just saying hello or greeting you (e.g., "Hi", "Hello", "Sawadee"), greet them warmly and ask how you can help with their rental search or lease review. DO NOT list or recommend properties unless they ask for places.
2. STRICT DISTRICT LOCK: The user is asking about: District="${intent.detectedDistrict || 'Unspecified'}", MaxBudget="${intent.maxPrice || 'Unspecified'}".
3. If a district is identified, YOU MUST ONLY discuss that exact district. Under no circumstances should you mention or recommend properties in Thung Khru, Bang Mot, or any other area unless explicitly asked.
4. ZERO ASTERISKS: DO NOT use asterisks (*) or (**) anywhere in your response. No markdown asterisks for bold or italic. Use standard bullet points (•) if needed.
5. Provide clear, honest details on rent, move-in cash, and electricity billing.
`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${systemPrompt}\n\nProperties in target district:\n${JSON.stringify(compactData, null, 1)}\n\nUser Question: ${userPrompt}`
              }
            ]
          }
        ]
      })
    });

    if (!res.ok) throw new Error(`Gemini API Error: ${res.statusText}`);
    const json = await res.json();
    const rawReply = json.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const shouldShowCards = Boolean(intent.detectedDistrict || intent.transitLine || intent.maxPrice);

    return {
      text: cleanText(rawReply),
      recommendations: shouldShowCards ? matchedListings : []
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
        }, 250);
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
                  <span>{apiKey ? "Powered by Gemini 3.5 Flash" : "Bangkok Rental Guide"}</span>
                  {apiKey && <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                title="Restart conversation"
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4"/>
              </button>
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

          {/* API Key Modal */}
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
