# 🧬 Blueprint Coach

Een installeerbare PWA die je elke dag stimuleert om de juiste leefstijlkeuzes te maken — gebaseerd op de nieuwste publieke inzichten van Bryan Johnson (Blueprint-protocol, stand 2026).

> *"Elke dag begint de avond ervoor."*

## Wat de app doet

- **Vandaag** — dagelijkse checklist met 11 gewoontes in drie categorieën (🌙 Slaap, 🥦 Voeding, 🏃 Beweging), elk met een uitklapbare onderbouwing. Een dagscore-ring, streak-teller en confetti bij een perfecte dag.
- **Protocol** — de kern van Blueprint helder uitgelegd: slaap als prioriteit nr. 1, vroeg & plantaardig eten, dagelijks gevarieerd trainen, en de "Don't die"-mindset. Inclusief de 2026-updates (NMN naar 6 dagen/week, rapamycine geschrapt).
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
