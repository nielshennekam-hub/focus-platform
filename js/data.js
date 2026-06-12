/* ============================================================
   Blueprint Coach — content
   Gebaseerd op publiek beschikbare inzichten van Bryan Johnson
   (Blueprint-protocol, stand 2026). Geen medisch advies.
   ============================================================ */

const CATEGORIES = {
  slaap:    { name: "Slaap",    icon: "🌙", color: "#7c8cf8" },
  voeding:  { name: "Voeding",  icon: "🥦", color: "#4ade80" },
  beweging: { name: "Beweging", icon: "🏃", color: "#fbbf24" },
  focus:    { name: "Focus & verbinding", icon: "🧠", color: "#f472b6" },
};

/* Dagelijkse gewoontes. "why" is de inspirerende onderbouwing
   die in de app onder de gewoonte uitklapt. */
const HABITS = [
  // ---- Slaap — voor Bryan prioriteit nr. 1 ----
  {
    id: "bedtijd",
    cat: "slaap",
    title: "Op tijd naar bed (vaste bedtijd)",
    why: "Bryan noemt slaap zijn allerhoogste prioriteit: “Elke dag begint de avond ervoor.” Hij ligt er elke avond om 20:30 in — op exact dezelfde tijd. Een vast slaapritme is de krachtigste enkele interventie voor herstel, humeur en wilskracht.",
  },
  {
    id: "winddown",
    cat: "slaap",
    title: "Wind-down: 30–60 min schermvrij vóór bed",
    why: "Lezen, een warme douche of ademhalingsoefeningen in plaats van schermen. Bryan valt binnen 3 minuten in slaap — niet door geluk, maar door een vast afbouwritueel met gedimd licht.",
  },
  {
    id: "cafeine",
    cat: "slaap",
    title: "Geen cafeïne na 14:00",
    why: "Cafeïne heeft een halfwaardetijd van ±6 uur. Bryans actuele regel: geen cafeïne meer na 14:00, zodat er bij bedtijd zo min mogelijk overblijft en je diepe slaap maximaal blijft.",
  },
  {
    id: "koelekamer",
    cat: "slaap",
    title: "Slaapkamer koel & donker",
    why: "±18–21 °C, verduisterd en stil — de waarden uit Bryans actuele slaapprotocol. Een koele kamer verlaagt je kerntemperatuur, wat het signaal is waarmee je lichaam de diepe slaap inzet.",
  },
  {
    id: "hartslagrust",
    cat: "slaap",
    title: "Avond rustig afgesloten (lage hartslag)",
    why: "Bryans favoriete 'health hack' uit zijn recente video's: ga met een lage rusthartslag slapen. Geen zware maaltijd, stress of intensieve inspanning vlak voor bed — een avondwandeling, lezen of ademhalingsoefeningen brengen je hartslag omlaag en je slaapscore omhoog.",
  },

  // ---- Voeding ----
  {
    id: "eetvenster",
    cat: "voeding",
    title: "Laatste maaltijd ruim vóór bedtijd",
    why: "Bryan eet al zijn maaltijden tussen ±5:30 en 12:00 en is minimaal 4 uur vóór bedtijd klaar met eten. Vroeg eten verbetert de slaapkwaliteit en geeft je spijsvertering rust. Begin haalbaar: niets meer eten na je ingestelde eindtijd.",
  },
  {
    id: "plantaardig",
    cat: "voeding",
    title: "Plantaardig & onbewerkt gegeten",
    why: "De kern van Blueprint: groenten, peulvruchten, noten, bessen en olijfolie. Bryans “Green Giant” en “Super Veggies” draaien om broccoli, bloemkool, linzen en gefermenteerd voedsel — vezels en polyfenolen voor je microbioom.",
  },
  {
    id: "suiker",
    cat: "voeding",
    title: "Geen suiker of junkfood",
    why: "Elke hap in Blueprint is gemeten en doelgericht. Jij hoeft niet te wegen — maar één dag zonder toegevoegde suiker en ultrabewerkt voedsel is al een meetbare overwinning.",
  },
  {
    id: "alcohol",
    cat: "voeding",
    title: "Geen alcohol",
    why: "Alcohol sloopt je diepe slaap en je herstel — Bryan drinkt er geen druppel van. Eén avond zonder merk je de volgende ochtend direct in je energie.",
  },

  // ---- Beweging ----
  {
    id: "training",
    cat: "beweging",
    title: "Vandaag getraind (zie trainingsweek)",
    why: "Bryan traint 6–8 uur per week — dagelijks 30 min kracht + 30 min cardio — volgens vijf pijlers: kracht, zone 2-cardio, intensieve cardio, mobiliteit en balans. “Regelmatig bewegen verlaagt het risico op overlijden met 31%.” Begin met één pijler; het weekschema staat op het Training-tabblad.",
  },
  {
    id: "namaaltijd",
    cat: "beweging",
    title: "Na het eten 5–10 min bewogen",
    why: "Een korte wandeling na de maaltijd vlakt je bloedsuikerpiek af — een van Bryans simpelste en meest onderschatte aanbevelingen. Vijf tot tien minuten is al genoeg.",
  },
  {
    id: "microbeweging",
    cat: "beweging",
    title: "Elke 30 min even bewogen",
    why: "Lang stilzitten is een zelfstandig gezondheidsrisico, ook als je sport. Bryan bouwt micro-beweging in: elk half uur opstaan, rekken of een paar squats.",
  },
  {
    id: "buiten",
    cat: "beweging",
    title: "Daglicht & buitenlucht gepakt",
    why: "Ochtendlicht zet je biologische klok gelijk en maakt je bedtijd 's avonds makkelijker. In het weekend kiest Bryan voor wandelen, hiken of tennis — buiten zijn telt dubbel.",
  },

  // ---- Focus & verbinding — uit "8 Steps to Reclaim Your Life" (feb 2026) ----
  {
    id: "schermdiscipline",
    cat: "focus",
    title: "Telefoon bewust gebruikt, niet gescrold",
    why: "Bryan noemt feeds “ultrabewerkte content” en je smartphone “een gokkast in je broekzak” — net zo ontworpen om je verslaafd te houden als junkfood. Beperk afleiding zoals je suiker beperkt: bewust, met grenzen.",
  },
  {
    id: "verbinding",
    cat: "focus",
    title: "Echt contact met iemand gehad",
    why: "Chronische eenzaamheid is volgens Bryan net zo schadelijk als ongeveer een pakje sigaretten per dag. Een goed gesprek, samen eten of een belletje met aandacht telt — een feed scrollen niet.",
  },
  {
    id: "belofte",
    cat: "focus",
    title: "Eén kleine belofte aan jezelf nagekomen",
    why: "Zijn alternatief voor motivatievideo's: self-trust. Kies één klein ding, doe het vandaag, en morgen weer — óók als het saai of oncomfortabel is. Zo bouw je het vertrouwen op waarmee grotere beloftes haalbaar worden.",
  },
];

/* Inspirerende quotes — vertaald, met origineel gedachtegoed. */
const QUOTES = [
  { text: "Elke dag begint de avond ervoor.", author: "Bryan Johnson" },
  { text: "Don't die. De rest is detail.", author: "Bryan Johnson" },
  { text: "Slaap van topkwaliteit maakt moeilijke dingen makkelijk en onmogelijke dingen haalbaar.", author: "Bryan Johnson" },
  { text: "Je bent niet je gedachten van 22:00 's avonds. Laat je uitgeruste zelf beslissen.", author: "Blueprint-gedachte" },
  { text: "De beste versie van jou wordt gebouwd met duizend kleine, saaie, juiste keuzes.", author: "Blueprint-gedachte" },
  { text: "Meet wat ertoe doet. Wat je meet, verbeter je.", author: "Bryan Johnson" },
  { text: "Discipline is zelfliefde in actie.", author: "Blueprint-gedachte" },
  { text: "Het doel is niet ouder worden — het doel is langer jong zijn.", author: "Blueprint-gedachte" },
  { text: "Je lichaam houdt de score bij, elke dag. Speel mee.", author: "Blueprint-gedachte" },
  { text: "Maak van je avondroutine een cadeau aan je ochtend-zelf.", author: "Blueprint-gedachte" },
  { text: "Regelmatig bewegen verlaagt het risico op overlijden — waar dan ook aan — met 31%.", author: "Bryan Johnson" },
  { text: "Ga met een lage hartslag naar bed en de nacht doet de rest.", author: "Bryan Johnson" },
  { text: "Al het voedsel is schuldig tot het tegendeel bewezen is.", author: "Bryan Johnson" },
  { text: "Stop met motivatie kijken. Kom één kleine belofte aan jezelf na — elke dag.", author: "Bryan Johnson" },
  { text: "Elke eenheid VO₂max erbij is anderhalve maand extra leven.", author: "Blueprint-gedachte" },
];

/* Protocol-uitleg (tab 2) — de nieuwste inzichten, beknopt. */
const PROTOCOL = [
  {
    icon: "🌙",
    title: "Slaap: prioriteit nummer één",
    color: "#7c8cf8",
    points: [
      "Vaste bedtijd én opstaantijd — Bryan: 20:30 naar bed, ±5:00 wakker zonder wekker.",
      "Wind-down van 60 min: schermen uit, lezen, wandelen, journaling of meditatie bij gedimd licht.",
      "Slaapkamer ±18–21 °C, volledig donker en stil.",
      "Geen cafeïne na 14:00; laatste maaltijd minimaal 4 uur vóór bed.",
      "Recente video-tip: ga met een lage rusthartslag naar bed — dat is zijn sterkste voorspeller van een goede slaapscore.",
      "Ochtendlicht binnen 15–30 min na het opstaan (buiten, of een daglichtlamp).",
    ],
  },
  {
    icon: "🥦",
    title: "Voeding: vroeg, plantaardig, doelgericht",
    color: "#4ade80",
    points: [
      "Eetvenster van ±5:30 tot 12:00 — extreem vroege time-restricted eating. Begin zelf met: niet meer eten na het avondeten.",
      "±2.250 kcal per dag (±10% calorische restrictie): ±25% eiwit (130 g), 35% koolhydraten, 40% vet.",
      "Drie vaste maaltijden — eiwitontbijt, ‘Super Veggie’ en een wisselende derde maaltijd. De recepten staan hieronder. 👇",
      "Veel olijfolie (±3 el/dag), bessen, noten, gefermenteerde groenten — nul alcohol. Suiker: maximaal 20 g toegevoegd per dag (liefst 0); bewaar je ‘suikerbudget’ voor honing of polyfenolrijk fruit.",
      "Geen dieet-ideologie: Blueprint is niet keto, vegan of paleo — per voedingsmiddel kijken wat het bewijs zegt. “Al het voedsel is schuldig tot het tegendeel bewezen is.”",
      "Plan ál je maaltijden vooruit: één ‘onopgelost gat’ per dag is volgens Bryan precies waar het misgaat.",
      "2026-update supplementen: NMN terug naar 6 dagen/week, rapamycine geschrapt, lithium (lage dosis) en NDGA toegevoegd. Kern blijft: vitamine D, omega-3, creatine (5 g).",
    ],
  },
  {
    icon: "🏃",
    title: "Beweging: de vijf pijlers",
    color: "#fbbf24",
    points: [
      "Bryans vijf pijlers (video “You're Exercising Wrong”, mei 2026): ① krachttraining ② zone 2-cardio ③ intensieve cardio (zone 4/5) ④ mobiliteit & flexibiliteit ⑤ balans. Hyperfocus op één vorm schaadt de rest.",
      "De cijfers die hij noemt: bewegen verlaagt het sterfterisico met 31%, elke eenheid VO₂max-verbetering ≈ 45 dagen extra levensverwachting, en wie geen 10 seconden op één been kan staan heeft een fors hoger sterfterisico.",
      "Minimum: 3× per week kracht met samengestelde oefeningen (duwen, trekken, squatten) en progressive overload — elke week iets meer gewicht of herhalingen.",
      "Cardio: 150 min zone 2 per week (praat-test: kun je nog praten, dan zit je goed) + 75 min intensief op 80–90% van je maximale hartslag, bijv. het Noorse 4×4.",
      "Dagelijks 5–10 min mobiliteit (heupen, rug, enkels, hamstrings, schouders) en balansoefeningen — op één been staan, ook eens met ogen dicht.",
      "Bryan zelf traint 6–8 u/week: elke dag 30 min kracht + 30 min cardio, met mobiliteit en balans verspreid over de dag.",
      "Elke 30 minuten zitten doorbreken; na elke maaltijd 5–10 min wandelen (drukt je glucosepiek). Begin met één pijler — consistentie telt, niet perfectie. Het volledige weekschema staat op het 🏋️ Training-tabblad.",
    ],
  },
  {
    icon: "📵",
    title: "Aandacht & verbinding",
    color: "#38bdf8",
    points: [
      "Uit “8 Steps to Reclaim Your Life” (feb 2026): smartphone-feeds zijn “ultrabewerkte content” — een gokkast in je broekzak. Beperk afleiding zoals je junkfood beperkt.",
      "Chronische eenzaamheid is net zo schadelijk als ±een pakje sigaretten per dag. Investeer dagelijks in écht contact.",
      "De motivatieval: inspirerende video's kijken vóélt als vooruitgang, maar verandert niets. Bouw self-trust: kom elke dag één kleine belofte aan jezelf na.",
      "Doe moeilijke dingen — mensen zitten vast door comfort en excuusverhalen (“geen tijd”, “zo ben ik nu eenmaal”), niet door gebrek aan kennis.",
    ],
  },
  {
    icon: "🧠",
    title: "De mindset: word je eigen systeem",
    color: "#f472b6",
    points: [
      "“Don't die”: behandel je gezondheid als het belangrijkste project van je leven.",
      "Vertrouw niet op wilskracht om 22:00 — bouw een systeem dat de juiste keuze de makkelijke keuze maakt.",
      "De basis (slaap, eten, bewegen) kost vrijwel niets en levert ~80% van het resultaat. Bryans miljoenen zitten in de laatste 20%.",
      "Meet en vier je vooruitgang: consistentie verslaat perfectie.",
    ],
  },
];

/* ============================================================
   Een dag eten als Bryan — zijn actuele maaltijden met de
   officiële receptuur (Blueprint-merkproducten vertaald naar
   gewone alternatieven). Eetvenster: ±5:30–12:00.
   ============================================================ */
const MEALS = [
  {
    icon: "🥤",
    name: "Eiwitontbijt",
    time: "±5:35 · vóór de training",
    desc: "Bryan start de dag met een eiwitshake plus zijn ‘longevity mix’. Haalbare versie: plantaardige eiwitshake met bessen en olijfolie.",
    ingredients: [
      "30–60 g plantaardig eiwitpoeder (erwt)",
      "Handje blauwe bessen of gemengde bessen",
      "1 el extra vierge olijfolie",
      "5 g creatine",
      "Optioneel: 11 g collageenpeptiden, gemengde noten erdoor",
    ],
    prep: "Alles mengen met water of ongezoete notenmelk. Bryan drinkt hierbij zijn supplementen (vitamine D, omega-3).",
  },
  {
    icon: "🥦",
    name: "Super Veggie",
    time: "±11:00 · het signatuurgerecht",
    desc: "Hét dagelijkse kerngerecht van Blueprint: linzen plus een berg groenten, afgemaakt met olijfolie en gefermenteerde groenten.",
    ingredients: [
      "150 g gekookte zwarte linzen",
      "250 g broccoli (incl. steel)",
      "150 g bloemkool",
      "50 g shiitake- of maitake-paddenstoelen",
      "1 teen knoflook + 3 g verse gember",
      "1 limoen (sap), 1 el komijn",
      "1 el appelciderazijn, 1 el hennepzaad",
      "1 el extra vierge olijfolie (na het koken)",
      "1–4 el gefermenteerde groenten (zuurkool/kimchi)",
    ],
    prep: "Stoom of kook de groenten beetgaar, meng met de linzen en kruiden, en giet de olijfolie er pas op je bord overheen.",
  },
  {
    icon: "🍮",
    name: "Nutty Pudding",
    time: "klassieker · vaak als toetje",
    desc: "Bryans beroemdste recept — een notenpudding vol polyfenolen. “Mix ~2 minuten op hoog tot hij schuimig is.”",
    ingredients: [
      "50–100 ml ongezoete notenmelk",
      "3 el gemalen macadamianoten + 2 tl gemalen walnoten",
      "2 el chiazaad, 1 tl gemalen lijnzaad",
      "½ tl Ceylon-kaneel, ¼ paranoot",
      "¼ kop bessen + 3 kersen",
      "60 ml granaatappelsap",
      "Optioneel: 30–60 g erwteneiwit, 1 tl zonnebloemlecithine",
    ],
    prep: "Alles in de blender, ±2 min op hoog tot schuimig. Garneer met bessen en noten.",
  },
  {
    icon: "🍠",
    name: "Derde maaltijd (wisselt)",
    time: "±12:00 · laatste maaltijd van de dag",
    desc: "Wisselt per dag: groente + peulvrucht + gezond vet. Voorbeeld uit zijn actuele protocol: de gevulde zoete aardappel.",
    ingredients: [
      "300 g gekookte zoete aardappel",
      "45 g gekookte kikkererwten",
      "12 cherrytomaatjes + 4 radijsjes",
      "½ avocado, ¼ kop koriander",
      "1 jalapeño (naar smaak)",
      "Sap van 2 limoenen en 1 citroen",
      "1 tl chilipoeder, 1 el extra vierge olijfolie",
    ],
    prep: "Snijd de zoete aardappel open en vul met de rest. Hierna eet Bryan tot de volgende ochtend niets meer (±17 uur vasten).",
  },
];

/* ============================================================
   De Blueprint-trainingsweek — Bryans officiële schema voor
   thuis, met concrete oefeningen, sets en herhalingen.
   ±6 uur per week over de vijf pijlers.
   Elk blok heeft een type met eigen icoon en kleur.
   ============================================================ */

const TRAIN_TYPES = {
  warmup: {
    label: "Warming-up", color: "#fb923c",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c.5 4-4.5 5.5-4.5 10a4.5 4.5 0 0 0 9 0c0-1.6-.7-3-1.8-4.4-.3 1.1-1 2-1.9 2.6C12.6 9.4 11.4 6.5 12 3z"/></svg>',
  },
  strength: {
    label: "Kracht", color: "#f87171",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 10v4M6.5 7.5v9M17.5 7.5v9M20.5 10v4M6.5 12h11"/></svg>',
  },
  zone2: {
    label: "Zone 2-cardio", color: "#4ade80",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.3 12.9 12 20l-7.3-7.1a4.8 4.8 0 1 1 7.3-6.2 4.8 4.8 0 1 1 7.3 6.2z"/></svg>',
  },
  hiit: {
    label: "HIIT", color: "#fbbf24",
    svg: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13 2 5 13.5h6L9.5 22 19 10h-6V2z"/></svg>',
  },
  interval: {
    label: "Noors 4×4", color: "#c084fc",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13.5" r="6.5"/><path d="M12 10.5v3l2 1.5M10 2.5h4M12 2.5V5"/></svg>',
  },
  mobility: {
    label: "Mobiliteit & stretch", color: "#38bdf8",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"/></svg>',
  },
  balance: {
    label: "Balans", color: "#f472b6",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4.5" r="1.8"/><path d="M12 6.5V13M7 9.5h10M12 13v7M12 13l3.5 2.5"/></svg>',
  },
  stability: {
    label: "Stabiliteit & core", color: "#5eead4",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 2.8v5.4c0 4.3-2.9 7.2-7 9-4.1-1.8-7-4.7-7-9V5.8z"/></svg>',
  },
  cooldown: {
    label: "Cooldown", color: "#7c8cf8",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v16M5.1 8l13.8 8M18.9 8 5.1 16"/></svg>',
  },
  recovery: {
    label: "Actief herstel", color: "#34d399",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 19.5C6.5 10 13 4.5 20 4.5 20 14 14.5 19 8 19c-.5 0-1 0-1.5.5z"/><path d="M6.5 19.5C9 14 12.5 10.5 16.5 8"/></svg>',
  },
};
const TRAINING_WEEK = [
  {
    day: "Maandag",
    focus: "Full-body kracht + rustige cardio",
    duration: "±55 min",
    blocks: [
      { type: "warmup",   time: "5 min",  desc: "Losdraaien, lichte squats, armzwaaien." },
      { type: "strength", time: "20 min", desc: "Squats 3×10–15 · push-ups 3×8–12 (op knieën mag) · eenarmig roeien met dumbbell 3×10–12 per arm · kettlebell swings of farmer's walk 3×30 sec · plank 3×20–30 sec. Rust 60–90 sec tussen sets." },
      { type: "zone2",    time: "25 min", desc: "Stevig wandelen, fietsen of zwemmen. Praat-test: praten moet nog lukken." },
      { type: "cooldown", time: "5 min",  desc: "Rustig uitlopen en stretchen." },
    ],
  },
  {
    day: "Dinsdag",
    focus: "Korte HIIT + zone 2-cardio",
    duration: "±50 min",
    blocks: [
      { type: "warmup",   time: "10 min", desc: "Rustig inlopen of fietsen, tempo geleidelijk omhoog." },
      { type: "hiit",     time: "4 min",  desc: "8 × (20 sec voluit / 20 sec rust) — fiets, sprint of touwspringen." },
      { type: "zone2",    time: "30 min", desc: "Op gesprekstempo, 60–70% van je maximale hartslag." },
      { type: "cooldown", time: "5 min",  desc: "Uitlopen en stretchen." },
    ],
  },
  {
    day: "Woensdag",
    focus: "Kracht + mobiliteit/yoga",
    duration: "±60 min",
    blocks: [
      { type: "warmup",   time: "5 min",  desc: "Losdraaien en lichte oefeningen." },
      { type: "strength", time: "25 min", desc: "Zelfde blok als maandag, of varieer de oefeningen." },
      { type: "mobility", time: "25 min", desc: "Yoga of mobiliteit: heupen, rug, enkels, hamstrings, schouders." },
      { type: "balance",  time: "5 min",  desc: "Op één been staan, 30–60 sec per been — ook eens met ogen dicht." },
    ],
  },
  {
    day: "Donderdag",
    focus: "HIIT-intervallen",
    duration: "±30 min",
    blocks: [
      { type: "warmup",   time: "8 min",      desc: "Tempo rustig opbouwen." },
      { type: "hiit",     time: "16–20 min",  desc: "8–10 × (60 sec hard op ±90% HFmax / 60 sec rustig actief herstel). Kort maar zwaar — dé VO₂max-sessie." },
      { type: "cooldown", time: "5 min",      desc: "Rustig uitlopen." },
    ],
  },
  {
    day: "Vrijdag",
    focus: "Full-body kracht + stabiliteit",
    duration: "±50 min",
    blocks: [
      { type: "warmup",    time: "5 min",  desc: "Losdraaien en lichte oefeningen." },
      { type: "strength",  time: "25 min", desc: "Lunges 3×10–12 per been · overhead press 3×10–12 · chest press met dumbbells 3×10–12 · step-ups 3×10 per been · side planks 20–30 sec per kant. Rust 60–90 sec tussen sets." },
      { type: "stability", time: "10 min", desc: "Single-leg deadlift 2×8 per been · bird dog 2×10 · dead bug 2×10." },
      { type: "mobility",  time: "5 min",  desc: "Stretchen tot besluit." },
    ],
  },
  {
    day: "Zaterdag",
    focus: "Noors 4×4-protocol (VO₂max)",
    duration: "±40 min",
    blocks: [
      { type: "warmup",   time: "10 min", desc: "Rustig opbouwen tot zone 2." },
      { type: "interval", time: "25 min", desc: "4 × (4 min hard op 85–95% HFmax + 3 min rustig op 60–70%) — hardlopen, fietsen of roeien. De gouden standaard voor je conditie." },
      { type: "cooldown", time: "5 min",  desc: "Rustig uitlopen." },
    ],
  },
  {
    day: "Zondag",
    focus: "Actief herstel",
    duration: "35–50 min",
    blocks: [
      { type: "recovery", time: "30–45 min", desc: "Wandelen, rustige yoga of zwemmen — of Bryans weekendfavorieten: hiken, pickleball, fietsen." },
      { type: "balance",  time: "5 min",     desc: "Balans en lichte stretching tot besluit." },
    ],
  },
];

const TRAINING_TIPS = [
  "Maak er een gewoonte van: train dagelijks op een vast moment, zonder erover te onderhandelen.",
  "Blessurepreventie gaat boven intensiteit — nette uitvoering eerst, dan pas zwaarder.",
  "Progressive overload: elke week iets meer gewicht of herhalingen — houd het bij in een notitie of app.",
  "Zone 2-controle: de praat-test. Kun je geen gesprek meer voeren, dan zit je te hoog; een hartslagmeter helpt.",
  "Elke dag 5–10 min mobiliteit (heupen, rug, enkels, hamstrings, schouders) en even op één been staan — probeer het ook met je ogen dicht.",
  "Bryans eigen verdeling (mei 2026): dagelijks 30 min kracht + 30 min cardio, 6–8 uur per week totaal.",
  "Geen tijd? Begin met één pijler en bouw uit — consistentie verslaat perfectie.",
];

/* Motiverende boodschap bij dagscore. */
function scoreMessage(pct, name) {
  const n = name ? `, ${name}` : "";
  if (pct === 0)   return `Begin met één kleine keuze${n}. Die telt al.`;
  if (pct < 35)    return "Goed begin — elke vink is een stem voor je toekomstige zelf.";
  if (pct < 65)    return "Je bent op dreef. Het systeem werkt. 💪";
  if (pct < 100)   return "Sterk bezig! Nog een paar keuzes en de dag is van jou.";
  return `Perfecte dag${n}! Je oudere ik bedankt je alvast. 🧬`;
}
