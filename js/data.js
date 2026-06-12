/* ============================================================
   Blueprint Coach — content
   Gebaseerd op publiek beschikbare inzichten van Bryan Johnson
   (Blueprint-protocol, stand 2026). Geen medisch advies.
   ============================================================ */

const CATEGORIES = {
  slaap:    { name: "Slaap",    icon: "🌙", color: "#7c8cf8" },
  voeding:  { name: "Voeding",  icon: "🥦", color: "#4ade80" },
  beweging: { name: "Beweging", icon: "🏃", color: "#fbbf24" },
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
    why: "Bryan traint 6 dagen per week 60–90 min volgens vijf pijlers: kracht, zone 2-cardio, intensieve cardio (HIIT), mobiliteit en balans. “Regelmatig bewegen verlaagt het risico op overlijden met 31%.” Het concrete weekschema staat op het Protocol-tabblad.",
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
      "Veel olijfolie (±3 el/dag), bessen, noten, gefermenteerde groenten — nul alcohol, nul toegevoegde suiker.",
      "2026-update supplementen: NMN terug naar 6 dagen/week, rapamycine geschrapt, lithium (lage dosis) en NDGA toegevoegd. Kern blijft: vitamine D, omega-3, creatine (5 g).",
    ],
  },
  {
    icon: "🏃",
    title: "Beweging: de vijf pijlers",
    color: "#fbbf24",
    points: [
      "Bryans vijf pijlers (uit zijn recente video): ① krachttraining ② zone 2-cardio ③ intensieve cardio/HIIT ④ mobiliteit & flexibiliteit ⑤ balans.",
      "“Regelmatig bewegen verlaagt het risico op overlijden — waar dan ook aan — met 31%.”",
      "±6 uur per week: 4,5 u rustig-matig (zone 1–2), 1,5 u intensief, waarvan 3× HIIT.",
      "Cardio doodt geen spiergroei — een betere conditie versterkt juist je krachttraining.",
      "Elke 30 minuten zitten doorbreken; na elke maaltijd 5–10 min bewegen.",
      "Weekend = actief plezier: hiken, pickleball, fietsen, klimmen. Het concrete weekschema staat hieronder. 👇",
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
   ============================================================ */
const TRAINING_WEEK = [
  {
    day: "Maandag",
    focus: "Full-body kracht + rustige cardio",
    duration: "45–60 min",
    items: [
      "Squats — 3×10–15",
      "Push-ups — 3×8–12 (op knieën mag)",
      "Eenarmig roeien met dumbbell — 3×10–12 per arm",
      "Kettlebell swings of farmer's walk — 3×30 sec",
      "Plank — 3×20–30 sec",
      "Daarna 25 min zone 2: stevig wandelen, fietsen of zwemmen (praten moet nog lukken)",
    ],
  },
  {
    day: "Dinsdag",
    focus: "Korte HIIT + zone 2-cardio",
    duration: "45–60 min",
    items: [
      "HIIT: 8 × (20 sec voluit / 20 sec rust) — fiets, sprint of touwspringen",
      "Rest van de sessie: zone 2-cardio op 60–70% van je maximale hartslag",
    ],
  },
  {
    day: "Woensdag",
    focus: "Kracht + mobiliteit/yoga",
    duration: "±60 min",
    items: [
      "Zelfde krachtblok als maandag (of varieer de oefeningen)",
      "30 min yoga, stretching of mobiliteitswerk",
      "Stabiliteit: op één been staan, bird dog, dead bug",
    ],
  },
  {
    day: "Donderdag",
    focus: "HIIT-intervallen",
    duration: "25–30 min",
    items: [
      "8–10 × (60 sec hoog tempo op ±90% HFmax / 60 sec rustig actief herstel)",
      "Kort maar zwaar — dit is de sessie die je VO₂max het hardst opdrijft",
    ],
  },
  {
    day: "Vrijdag",
    focus: "Full-body kracht",
    duration: "45–60 min",
    items: [
      "Lunges — 3×10–12 per been",
      "Overhead press — 3×10–12",
      "Chest press met dumbbells — 3×10–12",
      "Step-ups — 3×10 per been",
      "Side planks — 20–30 sec per kant",
      "Stabiliteit: single-leg deadlift, bird dog",
    ],
  },
  {
    day: "Zaterdag",
    focus: "Noors 4×4-protocol (VO₂max)",
    duration: "30–40 min",
    items: [
      "4 × (4 min op 85–95% HFmax / 3 min rustig op 60–70%)",
      "Hardlopen, fietsen of roeien — de gouden standaard voor je conditie",
    ],
  },
  {
    day: "Zondag",
    focus: "Actief herstel",
    duration: "35–50 min",
    items: [
      "Wandelen, rustige yoga of zwemmen",
      "Bryans weekendfavorieten: hiken, pickleball, fietsen, klimmen",
    ],
  },
];

const TRAINING_TIPS = [
  "Maak er een gewoonte van: train dagelijks op een vast moment, zonder erover te onderhandelen.",
  "Blessurepreventie gaat boven intensiteit — nette uitvoering eerst, dan pas zwaarder.",
  "Progressieve overload: voer gewicht, herhalingen of tempo héél geleidelijk op.",
  "Geen tijd? Het minimum dat al enorm loont: 3× kracht + 3× cardio per week, en elke 30 min even opstaan.",
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
