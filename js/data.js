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
    title: "Geen cafeïne na 12:00",
    why: "Cafeïne heeft een halfwaardetijd van ±6 uur. Bryan vermijdt stimulerende middelen 8–10 uur vóór het slapen, zodat zijn diepe slaap maximaal blijft.",
  },
  {
    id: "koelekamer",
    cat: "slaap",
    title: "Slaapkamer koel & donker",
    why: "16–19 °C, verduisterd en stil. Een koele kamer verlaagt je kerntemperatuur, wat het signaal is waarmee je lichaam de diepe slaap inzet.",
  },

  // ---- Voeding ----
  {
    id: "eetvenster",
    cat: "voeding",
    title: "Laatste maaltijd ruim vóór bedtijd",
    why: "Bryan eet al zijn maaltijden tussen ±6:00 en 11:00 en stopt minimaal 4 uur vóór bedtijd. Vroeg eten verbetert de slaapkwaliteit en geeft je spijsvertering rust. Begin haalbaar: niets meer eten na je ingestelde eindtijd.",
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
    title: "Vandaag getraind (kracht of cardio)",
    why: "Bryan traint élke dag ±1 uur: kracht, cardio, balans en mobiliteit. Richtlijn: minimaal 150 min matig-intensieve cardio en 90 min krachttraining per week. Beweging is het beste ‘medicijn’ dat bestaat.",
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
];

/* Protocol-uitleg (tab 2) — de nieuwste inzichten, beknopt. */
const PROTOCOL = [
  {
    icon: "🌙",
    title: "Slaap: prioriteit nummer één",
    color: "#7c8cf8",
    points: [
      "Vaste bedtijd én opstaantijd — Bryan: 20:30 naar bed, ±4:30 wakker zonder wekker.",
      "Wind-down van 30–60 min: lezen, warm bad, ademhaling, gedimd licht.",
      "Slaapkamer 16–19 °C, volledig donker en stil.",
      "Geen cafeïne na 12:00; laatste maaltijd minimaal 2–4 uur vóór bed.",
      "Zijn maatstaf: word je zonder wekker uitgerust wakker, dan zit je goed.",
    ],
  },
  {
    icon: "🥦",
    title: "Voeding: vroeg, plantaardig, doelgericht",
    color: "#4ade80",
    points: [
      "Eetvenster van ±6:00 tot 11:00 — extreem vroege time-restricted eating. Begin zelf met: niet meer eten na het avondeten.",
      "±2.250 kcal per dag, volledig plantaardig en onbewerkt.",
      "Vaste gerechten: ‘Green Giant’ (broccoli, bloemkool, linzen, hennepzaad) en ‘Super Veggies’ met gefermenteerd voedsel.",
      "Veel olijfolie, bessen, noten — nul alcohol, nul toegevoegde suiker.",
      "2026-update supplementen: NMN terug naar 6 dagen/week, rapamycine geschrapt, lithium (lage dosis) toegevoegd. Kern blijft: vitamine D, omega-3, creatine.",
    ],
  },
  {
    icon: "🏃",
    title: "Beweging: elke dag, gevarieerd",
    color: "#fbbf24",
    points: [
      "Dagelijks ±1 uur trainen: kracht, cardio, balans én mobiliteit.",
      "Minimaal: 150 min matige cardio + 90 min krachttraining per week.",
      "Elke 30 minuten zitten doorbreken met micro-beweging.",
      "Weekend = actief plezier: hiken, tennis, fietsen.",
      "VO₂max en spierkracht zijn de sterkste voorspellers van een lang leven.",
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

/* Motiverende boodschap bij dagscore. */
function scoreMessage(pct, name) {
  const n = name ? `, ${name}` : "";
  if (pct === 0)   return `Begin met één kleine keuze${n}. Die telt al.`;
  if (pct < 35)    return "Goed begin — elke vink is een stem voor je toekomstige zelf.";
  if (pct < 65)    return "Je bent op dreef. Het systeem werkt. 💪";
  if (pct < 100)   return "Sterk bezig! Nog een paar keuzes en de dag is van jou.";
  return `Perfecte dag${n}! Je oudere ik bedankt je alvast. 🧬`;
}
