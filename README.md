# 🧬 Blueprint Coach + 🧘 Klank Timer

Eén installeerbare PWA met twee apps die elkaar aanvullen:

1. **Blueprint Coach** — dagelijkse leefstijlcoach gebaseerd op de nieuwste publieke inzichten van Bryan Johnson (Blueprint-protocol, stand 2026).
2. **Klank Timer** (`meditatie.html`) — meditatietimer in de stijl van Insight Timer, met het geluid van klankschalen en een meditatietracker.

> *"Elke dag begint de avond ervoor."*

## 🧘 Klank Timer

- **Vijf klankschalen** — grote Tibetaanse schaal, Tibetaanse schaal, kristallen schaal, gong en zen-bel. De klanken worden **live gesynthetiseerd met de Web Audio API** (inharmonische boventonen met zweving, zoals een echte schaal) — geen audiobestanden, dus volledig offline en supersnel.
- **Timer** — duur van 3 tot 60 minuten of *open einde*, optionele beginbel, intervalbellen (elke 1/2/5/10 min) en drie rustige eindslagen. Ademhalingsanimatie tijdens de sessie en wake-lock zodat je scherm aan blijft.
- **Tracker (Inzicht)** — dagen-streak, totaal aantal minuten, aantal sessies, 14-daagse grafiek in minuten en je recente sessies.

Je vindt de timer via het 🧘-tabblad in de Coach (en andersom via het 🧬-tabblad terug).

## Wat de Coach doet

- **Vandaag** — dagelijkse checklist met 16 gewoontes in vier categorieën (🌙 Slaap, 🥦 Voeding, 🏃 Beweging, 🧠 Focus & verbinding), elk met een uitklapbare onderbouwing. Een dagscore-ring, streak-teller en confetti bij een perfecte dag. De Focus & verbinding-categorie (schermdiscipline, echt contact, self-trust) komt uit de analyse van Bryans nieuwste video's, o.a. *"8 Steps to Reclaim Your Life"* (feb 2026) en *"You're Exercising Wrong"* (mei 2026).
- **Protocol** — de kern van Blueprint helder uitgelegd: slaap als prioriteit nr. 1, vroeg & plantaardig eten, de vijf trainings­pijlers en de "Don't die"-mindset. Inclusief de 2026-updates (NMN naar 6 dagen/week, rapamycine geschrapt, lithium/NDGA erbij). Plus twee uitklapbare secties met Bryans actuele data: **Een dag eten als Bryan** (eiwitontbijt, Super Veggie, Nutty Pudding en de derde maaltijd, met officiële receptuur) en **De Blueprint-trainingsweek** (7-daags schema met concrete oefeningen, sets en herhalingen, incl. het Noorse 4×4-protocol).
- **Voortgang** — 14-daagse grafiek, huidige & beste streak, 7-daags gemiddelde en scores per categorie.
- **Instellingen** — naam, eigen bedtijd, einde eetvenster, gewoontes aan/uit en een optionele wind-down-melding 1 uur vóór bedtijd.

Een dag telt mee voor je streak vanaf 60% dagscore: consistentie verslaat perfectie.

## Techniek

- Pure HTML/CSS/JS — geen build-stap, geen dependencies.
- Volledig offline via een service worker (cache-first app-shell).
- Installeerbaar op iOS/Android/desktop via het web-manifest.
- Alle gegevens blijven lokaal op je apparaat (`localStorage`), er is geen backend.

## Lokaal draaien

Een service worker vereist een (lokale) webserver:

```bash
npx serve .
# of
python3 -m http.server 8000
```

Open vervolgens `http://localhost:8000` en kies "Toevoegen aan beginscherm" / "Installeren" in je browser.

## Hosten

Elke statische host werkt (GitHub Pages, Netlify, Vercel). Voor GitHub Pages: zet in de repo-instellingen *Pages → Deploy from branch → main → / (root)*.

## Iconen opnieuw genereren

```bash
node tools/gen-icons.mjs
```

## Disclaimer

Deze app is niet gelieerd aan Bryan Johnson of Blueprint en is geen medisch advies. Overleg met een arts voordat je supplementen neemt of je leefstijl drastisch wijzigt.
