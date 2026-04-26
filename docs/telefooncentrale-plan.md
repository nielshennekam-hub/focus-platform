# Plan: Telefooncentrale Ergotherapiepraktijk

**Doel:** een professionele cloud-telefooncentrale opzetten voor een solo
ergotherapie­praktijk, met keuzemenu en doorschakeling, binnen een budget van
**max. € 25 per maand**.

---

## 1. Uitgangspunten

| Onderwerp        | Keuze                                                     |
| ---------------- | --------------------------------------------------------- |
| Aantal gebruikers| 1 therapeut, 1 locatie                                    |
| Bestaand nummer  | Behouden (porteren)                                       |
| Mobiel werken    | Veel onderweg, dus softphone-app en doorschakelen mobiel  |
| EPD              | Intramed (niet altijd paraat onderweg)                    |
| Voicemail        | Voicemail-to-email                                        |
| Budget           | ≤ € 25 per maand all-in                                   |
| Compliance       | AVG + NEN 7510 (zorgcontext)                              |

---

## 2. Provider­keuze

### Aanbeveling: **Voys**

- Nederlandse VoIP-aanbieder, sterk in keuzemenu's en flexibele belstromen.
- Tekent een **verwerkers­overeenkomst** (AVG) en data staat in NL.
- Webinterface ("Vialer") + mobiele app + webphone, geen vast toestel nodig.
- Geschikt voor zorgverleners; veel praktijken gebruiken het al.

### Indicatie maandlasten (solo)

| Post                                | Bedrag (indicatief)   |
| ----------------------------------- | --------------------- |
| 1 gebruiker                         | ± € 5,00              |
| 1 vast nummer (geporteerd)          | ± € 1,50              |
| Belminuten (uitgaand + doorschakel) | ± € 5,00 – € 10,00    |
| Webphone / mobiele app              | gratis                |
| **Totaal**                          | **± € 12 – € 18 / mnd** |

→ ruim binnen het budget van € 25.

### Alternatieven (kort)

- **Belfabriek** – vergelijkbaar, iets duurder bij keuzemenu's.
- **Yuki / KPN ÉÉN Zakelijk** – gebruiks­vriendelijk, vaak boven € 25.
- **3CX self-hosted** – goedkoper, maar te veel beheer voor solo­praktijk.

---

## 3. Belstroom (call flow)

```
Inkomend op praktijk­nummer
        │
        ▼
 ┌──────────────────┐
 │ Tijdcontrole     │
 │ (openingstijden) │
 └────────┬─────────┘
          │
   ┌──────┴───────┐
   │              │
buiten         binnen
tijden         tijden
   │              │
   ▼              ▼
Voicemail   Welkomstboodschap +
"buiten     keuzemenu (IVR)
kantoor"        │
   │            │
   ▼            ├─ 1  Nieuwe cliënt
 e-mail        │     │
                │     ├─ (optie) cliëntenstop-mededeling
                │     └─ Voicemail "nieuwe aanmelding"
                │              │
                │              ▼
                │           e-mail
                │
                ├─ 2  Bestaande cliënt
                │     └─ Mededeling + Voicemail
                │              │
                │              ▼
                │           e-mail
                │
                ├─ 3  Zorgverlener / instantie
                │     └─ Direct doorschakelen naar mobiel
                │              │
                │     ┌────────┴───────┐
                │  opgenomen        niet opgenomen
                │     │                 │
                │  gesprek           Voicemail
                │                       │
                │                       ▼
                │                    e-mail
                │
                └─ Geen keuze / time-out
                      └─ Herhaal menu (1x), daarna voicemail
```

### Detail per optie

**Optie 1 – Nieuwe cliënt**
- Inspreektekst: korte uitleg + verwachte terugbel­termijn.
- **Cliëntenstop-schakelaar:** in de Voys-webinterface een "feature flag"
  (tijds­profiel of variabele dagroute) waarmee je met één klik een extra
  mededeling activeert: *"Op dit moment hanteren wij een aanmeldstop tot
  [datum]. U kunt nog steeds een bericht achterlaten."*
- Daarna voicemail → e-mail.

**Optie 2 – Bestaande cliënt**
- Tekst: *"Spreek uw naam, telefoonnummer en korte vraag in; ik bel u
  dezelfde werkdag terug."*
- Voicemail → e-mail.

**Optie 3 – Zorgverlener / instantie**
- Direct doorschakelen naar mobiel (06-xxxxxxxx).
- Fallback bij niet opnemen of buiten bereik: voicemail "zorgverlener" →
  e-mail (apart label, zodat je deze met voorrang opvolgt).
- Caller-ID instellen op het praktijk­nummer (zodat de beller weet wie er
  belt en jij niet je 06 prijsgeeft).

### Openingstijden
- Standaard werkweek vastleggen (bv. ma–vr 08:30–17:00).
- Lunchpauze optioneel als apart blok.
- Vakanties via tijdelijk profiel "afwezig".

---

## 4. Voicemail-naar-e-mail

- Eén centrale praktijk-mailbox (bijv. `info@<praktijk>.nl`).
- Drie labels/filters in de mailbox:
  - `VM-Nieuw` (optie 1)
  - `VM-Bestaand` (optie 2)
  - `VM-Zorgverlener` (optie 3, voorrang)
- Bestand­type: MP3 of WAV als bijlage; transcriptie optioneel (Voys biedt
  speech-to-text als add-on; check kosten t.o.v. budget).
- **AVG:** voicemails kunnen patiëntgegevens bevatten → mailbox moet
  AVG-proof zijn (bij voorkeur Zorgmail, ZIVVER, of Microsoft 365 Business
  met verwerkers­overeenkomst).

---

## 5. Hardware & software

| Onderdeel             | Keuze                                                    |
| --------------------- | -------------------------------------------------------- |
| Mobiel toestel        | Voys-app op privé-/werk­toestel (tweede lijn)            |
| Werkplek              | Webphone in browser (geen extra installatie)             |
| Headset (aanbevolen)  | USB-headset met microfoon, ± € 60 eenmalig               |
| Vast toestel          | **Niet nodig** (bespaart kosten en kabels)               |

---

## 6. Intramed-koppeling

Volledige CTI-koppeling met Intramed is voor solo-gebruik vaak overkill en
buiten budget. Praktische tussenoplossing:

- Bij optie 3 (zorgverlener) zie je op je mobiel het **praktijk­nummer** als
  binnenkomend gesprek → je weet meteen dat het een doorgeschakelde lijn is.
- Bij optie 1 en 2 ontvang je een **e-mail met het telefoon­nummer van de
  beller**. Vanuit de mail kun je terugbellen wanneer je achter Intramed
  zit en de cliëntkaart erbij hebt.
- Eventuele upgrade later: Voys heeft een "click-to-dial" browser­extensie
  die naast Intramed werkt.

---

## 7. AVG / NEN 7510 checklist

- [ ] Verwerkers­overeenkomst (VWO) met provider getekend.
- [ ] Dataopslag in NL/EU bevestigd.
- [ ] Gespreks­opname **uit** (tenzij expliciete grondslag + toestemming).
- [ ] Voicemail-mailbox AVG-proof (zie §4).
- [ ] Bewaartermijn voicemails: max 4 weken automatisch opschonen.
- [ ] Verwerkings­register bijgewerkt (telefonie + voicemail als
      verwerkings­activiteit).
- [ ] Privacy­verklaring praktijk aangepast: vermeld telefonische
      verwerking + bewaartermijn.

---

## 8. Stappenplan & planning

| Week | Actie                                                           |
| ---- | --------------------------------------------------------------- |
| 1    | Account openen bij Voys + VWO tekenen                           |
| 1    | IVR-teksten opstellen (zie §9) en (laten) inspreken             |
| 1–2  | Belstroom configureren in test­omgeving met tijdelijk nummer    |
| 2    | Voicemail-to-email instellen en testen                          |
| 2    | Doorschakeling naar mobiel testen (incl. fallback)              |
| 2–4  | Nummerportering aanvragen (looptijd 2–4 weken)                  |
| 4    | Go-live op portering­datum: belstroom switchen naar live nummer |
| 4    | Patiënten/verwijzers informeren (mail + website)                |
| 5    | Evaluatie: gesprekken, voicemails, doorschakel­percentage       |

---

## 9. Concept inspreek­teksten

**Welkomst + menu (binnen kantoortijden):**
> "Welkom bij Ergotherapie [Praktijknaam]. Voor een nieuwe aanmelding,
> toets 1. Bent u al cliënt en wilt u een bericht achterlaten, toets 2.
> Bent u zorgverlener of instantie, toets 3."

**Optie 1 zonder cliëntstop:**
> "U heeft gekozen voor een nieuwe aanmelding. Spreek na de toon uw naam,
> telefoonnummer en de reden van aanmelding in. Ik neem binnen twee
> werkdagen contact met u op."

**Optie 1 mét cliëntstop (toggle):**
> "Op dit moment hanteren wij een aanmeldstop tot nader bericht. Wilt u
> toch een bericht achterlaten, dan kan dat na de toon."

**Optie 2 (bestaande cliënt):**
> "Spreek na de toon uw naam, telefoonnummer en korte vraag in. Ik bel u
> dezelfde werkdag nog terug."

**Optie 3 (zorgverlener):**
> "Een moment, ik verbind u door."

**Buiten kantoortijden:**
> "U belt buiten onze openingstijden. Spreek na de toon een bericht in,
> dan bel ik u de eerstvolgende werkdag terug. Voor spoed verwijs ik u
> naar uw huisarts."

---

## 10. Risico's & aandachtspunten

- **Porteringsdatum** valt soms onverwacht: zorg dat de belstroom een dag
  vooraf live staat in test­modus.
- **Doorschakelkosten** lopen op als optie 3 vaak gebruikt wordt; monitor
  de eerste maand.
- **Mobiel buiten bereik / vol**: zorg voor fallback voicemail, anders
  vallen gesprekken in een doodlopende lijn.
- **Klant­ervaring IVR**: houd het menu kort (max 3 opties, max 15 sec).
- **Cliëntenstop-toggle**: documenteer hoe je deze aan/uit zet, anders
  blijft hij per ongeluk staan.

---

## 11. Vervolgbeslissingen

1. Akkoord op **Voys** als provider, of eerst een offerte bij een
   alternatief opvragen?
2. IVR-teksten zelf inspreken of laten doen door een voice-over (± € 50
   eenmalig)?
3. Welke mailbox wordt gebruikt voor voicemail-to-email? (i.v.m. AVG)
4. Cliëntenstop: per direct nodig of pas later inschakelen?
