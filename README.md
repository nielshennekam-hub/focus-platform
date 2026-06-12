# 🧬 Blueprint Coach

Een installeerbare PWA die je elke dag stimuleert om de juiste leefstijlkeuzes te maken — gebaseerd op de nieuwste publieke inzichten van Bryan Johnson (Blueprint-protocol, stand 2026), aangevuld met data uit zijn recentste YouTube-video's.

> *"Elke dag begint de avond ervoor."*

## Wat de Coach doet

- **Vandaag** — dagelijkse checklist met 16 gewoontes in vier categorieën (🌙 Slaap, 🥦 Voeding, 🏃 Beweging, 🧠 Focus & verbinding), elk met een uitklapbare onderbouwing. Een dagscore-ring, streak-teller en confetti bij een perfecte dag. De Focus & verbinding-categorie (schermdiscipline, echt contact, self-trust) komt uit de analyse van Bryans nieuwste video's, o.a. *"8 Steps to Reclaim Your Life"* (feb 2026) en *"You're Exercising Wrong"* (mei 2026).
- **Protocol** — de kern van Blueprint helder uitgelegd: slaap als prioriteit nr. 1, vroeg & plantaardig eten, de vijf trainings­pijlers, aandacht & verbinding en de "Don't die"-mindset. Inclusief de 2026-updates (NMN naar 6 dagen/week, rapamycine geschrapt, lithium/NDGA erbij) en de uitklapbare sectie **Een dag eten als Bryan** (eiwitontbijt, Super Veggie, Nutty Pudding en de derde maaltijd, met officiële receptuur).
- **Training** — Bryans officiële 7-daagse weekschema als eigen tabblad, met tijdsblokken per onderdeel (warming-up → hoofdblok → cooldown), concrete oefeningen, sets en herhalingen, rusttijden en het Noorse 4×4-protocol.
- **Voortgang** — 14-daagse grafiek, huidige & beste streak, 7-daags gemiddelde en scores per categorie.
- **Instellingen** — naam, eigen bedtijd, einde eetvenster, gewoontes aan/uit en een optionele wind-down-melding 1 uur vóór bedtijd.
- **🕸️ Webslinger** — een mobiele 3D-minigame (te vinden onder *Meer*, of direct via `/game/`): slinger als een spin van flat naar flat door een eindeloze nachtstad. Houd het scherm vast om een web te schieten (linker- of rechterhelft bepaalt de kant), laat los om te vliegen, en raak de straat niet. Score = afgelegde afstand; je record wordt lokaal bewaard.

Een dag telt mee voor je streak vanaf 60% dagscore: consistentie verslaat perfectie.

## Techniek

- Pure HTML/CSS/JS — geen build-stap, geen dependencies. De Webslinger-minigame gebruikt een lokaal meegeleverde kopie van [Three.js](https://threejs.org) (r160, MIT) in `game/vendor/`, dus ook die werkt volledig offline.
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
