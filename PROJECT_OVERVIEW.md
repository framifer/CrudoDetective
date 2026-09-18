# CRUDO DETECTIVE — Project Overview

Documento leggibile da umani e AI. Descrive cos'è il gioco, com'è fatto tecnicamente,
tutte le meccaniche e come sono strutturati i contenuti.

## 1. Cos'è
Gioco RPG 2D investigativo in stile Game Boy, atmosfera noir (True Detective S1).
Il protagonista è il **Detective Crudo**, un investigatore privato che risolve un caso di
scomparsa archiviato troppo in fretta. Bilingue **Italiano/Inglese**.

- File unico: `/shared/user/CrudoRPG/index.html` (HTML + CSS + JavaScript vanilla, canvas 192x168, tile 16px).
- Nessuna dipendenza esterna. Si apre in un browser o si serve con `python3 -m http.server 8000`.
- Salvataggio **automatico** su `localStorage` (chiave `crudoRPG.save.v2`).
- Altri file utili nella stessa cartella: `gemini_story.json` (storia centrale generata da Gemini),
  `PROJECT_OVERVIEW.md` (questo file), `DESIGN.md`, backup `index.backup-*.html`.

## 2. Come si gioca (controlli)
- **D-pad**: muovi il personaggio.
- **A**: interagisci/parla/conferma. **Tienilo premuto mentre cammini** = cammina furtivo/lento (utile nei pedinamenti).
- **B**: annulla/indietro. **Tienilo premuto mentre cammini** = corri (più veloce della camminata, più lento del motorino).
- **START**: menu (Diario, Taccuino, Mappa, Lingua, Chiudi).
- **SELECT**: sali/scendi dal **motorino** (una volta sbloccato).

## 3. Il mondo (aree)
Griglia 3x3 di aree (44x40 tile ciascuna). Aree terrestri/costiere collegate camminando ai bordi;
le aree di mare (Mare Aperto, Isola) si raggiungono via nave/zattera.
```
(0,0) Contea degli Altipiani  (1,0) Alture del Nord   (2,0) Bosco degli Olmi
(0,1) Borgo del Faro          (1,1) Baia del Sud       (2,1) Rione delle Officine
(0,2) Punta del Faro          (1,2) Mare Aperto        (2,2) Isola del Culto
```
Nomi EN: Highland County, North Heights, Elm Wood, Lighthouse Village, Southern Bay,
Industry District, Lighthouse Point, Open Sea, Cult Island. **9 aree in totale.**
- **Baia del Sud** = città centrale (case, emporio, municipio, molo, spiaggia a sud).
- **Borgo del Faro** = villaggio turistico; spiaggia animata in primavera/estate. La costa ovest
  scende a sud fino alla **Punta del Faro**.
- **Punta del Faro** = penisola rocciosa mista terra/mare; il **faro** sorge sulla punta sud (sugli
  scogli, quasi in acqua). Raggiungibile a piedi da sud del Borgo del Faro o in barca da Mare Aperto.
- **Rione delle Officine** = zona industriale, mare inquinato; una **zattera** al molo sud porta all'Isola.
- **Mare Aperto** = area di solo mare a sud della Baia; navigabile in barca (nave dal molo). A EST →
  Isola del Culto, a OVEST → Punta del Faro.
- **Isola del Culto** = isola col tempio/covo del culto; mare navigabile intorno, molo per attraccare.

## 4. Atmosfera dinamica
- **Stagioni** (primavera/estate/autunno/inverno): ognuna ha una palette che ricolora tutto (erba, acqua, cielo...).
  - Durante la storia centrale: la stagione è **narrativa** (la imposta ogni missione rossa).
  - **Dopo** aver completato TUTTA la storia centrale: le stagioni ruotano da sole ogni **10 minuti di gioco effettivo**.
- **Ciclo giorno/notte**: ~180s per un giorno; di notte cala il buio e si accendono lampioni, finestre,
  faro, luci delle boe e luce della barca.
- **Nebbia** perenne (banchi che vanno e vengono) e **musica chiptune noir** perenne.

## 5. Sistema delle missioni
Due binari, distinti dai marcatori sopra gli NPC (e sulla mappa):
- **Storia centrale** (marcatore "!" ROSSO): il caso investigativo. Catena lineare.
- **Casual/secondarie** (marcatore "!" GIALLO): opzionali, non bloccano la progressione.

### Storia centrale (rossa)
- **29 missioni** rosse in catena (obbligatorie, ordine cronologico), tra cui: le 14 originali
  `case1`–`case14`; 7 della revisione Livello B (`case2b, case6b, case7b, case9b, case11b, case12b,
  case13b`); la speciale `case_chase`; 3 **missioni-ponte di scoperta** (`case_disc1/2/3`) e 4 delle
  aree marine/penisola (`case_isle1, case_isle2, case_cape1, case_cape2`). Caricate da un **loader
  dati-driven** (`window.STORY_DATA`).
  - **IMPORTANTE**: a runtime il gioco legge SOLO `window.STORY_DATA`, definito **inline** dentro
    `index.html`. Il file `gemini_story.json` è la **fonte sorgente** e NON viene letto dal gioco:
    per far comparire una modifica di testo in gioco bisogna editare `STORY_DATA` in `index.html`
    (e, per coerenza, riflettere la stessa modifica nel JSON sorgente).
  - Le nuove missioni usano `order` **decimali** (2.5, 6.5, ...) per inserirsi tra le esistenti
    SENZA rinumerarle: così gli snodi meccanici cablati sugli id storici (case4/9/14 ecc.) non si rompono.
- **Il caso in breve (con spoiler)**: il colpevole è **Renzo** stesso. Non è morto: ha inscenato la
  propria scomparsa, ricatta l'officina con le prove dello sversamento tossico, guida il culto del
  mare (è il **"Re Cervo"**) e ha ucciso chi lo aveva riconosciuto (il corpo attribuito a Renzo è di
  un'altra persona — la figlia scomparsa della nonna, della medaglietta incisa col cervo). Il **Capo
  officina** è complice ricattato; il culto è il suo strumento. Foreshadowing seminato dai primi casi
  (chiave che Renzo non lasciava mai, pagina strappata dal taccuino, simbolo del cervo ricorrente).
- **Meccaniche usate nella storia** (per evitare ripetizione): pickup+interrogatorio (base),
  `CONFRONT_SNODI` (confronto verbale — case4/9/14 + **case13b**), `DEDUCTION_SNODI` (collega due
  indizi — case4/9/14 + **case6b**↔case3), `RECON_SNODI` (ricostruzione cronologica — case6/11 +
  **case9b**), `FIGHT_SNODI` (duello Zelda-like — case3/12 + **case11b**), `TAIL_SNODI` (pedinamento —
  case7 + **case2b**), `chase` (inseguimento a piedi — case_chase), `MORAL_SNODI` (dilemmi morali che
  pesano sul finale — case5/10).
- Ordine di sblocco a catena; ogni missione avviene in una stagione specifica. Arco stagionale:
  autunno → inverno → primavera → estate → autunno.
- **Intro**: all'avvio è attiva SOLO la missione intro gialla (Crudo arriva; il marinaio lo manda dalla
  vedova). Completandola si sbloccano la storia rossa (case1) e le missioni casual.

### Casual (gialle) — motore a "slot"
- Database in `window.SIDEQUESTS`, diviso per **7 meccaniche**: `recon` (ricostruzione), `morale`
  (dilemma), `confront` (confronto verbale), `tail` (pedinamento), `fight` (duello), `scooter`
  (consegna/inseguimento in motorino), **`courier`** (consegna a tempo **trasversale** tra aree diverse).
- **Motore a slot**: è attiva **1 missione per meccanica** alla volta (`SLOTS_PER_KIND=1`), quindi al
  massimo ~7 gialle attive insieme, sparse tra le aree. Completandone una, il motore ne attiva
  un'altra dello stesso tipo dal pool. Le casual si sbloccano dopo l'intro; le `scooter` solo dopo il
  motorino; le `courier` fanno attraversare la mappa (partenza in un'area, consegna in un'altra, a tempo).
- Tipi **locali** (nascono e finiscono nella stessa area): recon, morale, confront, tail, fight, scooter.
  Tipo **trasversale**: courier.
- **Distribuzione per area** (gialle definite): town 16, holiday/mountain/industrial/forestNW/forestNE 8
  ciascuna, Isola del Culto 4, Punta del Faro 4, + 8 courier (partenze varie). Ci sono anche le 6
  micro-missioni originali (cat, shell, parcel, kids, oldfriend, photos) e le 10 missioni-mare.

## 6. Meccaniche di gioco
Investigative (Leva 1):
- **Taccuino indizi**: raccogli indizi (esaminando la scena) che si accumulano in un diario consultabile.
- **Interrogatori** a scelta multipla: mostri l'indizio giusto per far cedere il testimone.
  Se sbagli, il testimone si chiude fino al **giorno dopo** (devi far passare la notte).
- **Deduzioni**: colleghi due indizi negli snodi chiave (case4, case9, case14).
- **Ricostruzione della scena**: ordini cronologicamente alcuni indizi (case6, case11).
- **Confronto a fasi** ("boss verbale"): barra di resistenza del sospetto vs compostezza del detective
  (climax: case4, case9, case14).
- **Scelte morali** + **finale multiplo** (giustizia/pietà/grigio) in base alle scelte.

Azione/movimento:
- **Combattimento Zelda-like** (arena, A=colpisci, B=schiva, HP) su 2 snodi (case3, case12).
- **Pedinamento** (stealth): segui un sospetto a distanza (né troppo vicino né troppo lontano); tieni **A**
  per andare furtivo/lento. Barra "sospetto".
- **Inseguimento a piedi** (case_chase): raggiungi il fuggitivo; ricompensa = il **motorino** dal sindaco.
- **Motorino (Vespa rossa)**: sblocco via case_chase; SELECT per salire/scendere; più veloce; suono "t-t-t";
  faro notturno. SELECT non attiva il motorino mentre nuoti o sei in barca / in un'area di mare.
- **Camminata furtiva (tieni A)** e **corsa (tieni B)** a piedi.

Fauna e mondo vivo:
- **Fauna per area** (decorativa): Baia del Sud 3 cani + 4 gatti; Borgo del Faro 5 gatti; Bosco degli
  Olmi 4 cervi + 7 conigli + 5 aquile (volano); Rione delle Officine 5 ratti; Isola 5 lucertole + 5
  pappagalli (volano); Contea 3 conigli + 3 volpi; Punta del Faro 10 gabbiani (volano); Mare Aperto 5
  delfini (saltano) + 10 gabbiani. Sistema `FAUNA_DEF`/`spawnFauna`/`updateFauna`/`drawFaunaCritter`.
- **Predatori (Alture del Nord)**: 1 orso + 2 lupi ti inseguono se ti avvicini (banner d'allerta). Se
  ti raggiungono → schermata d'attacco → **risveglio all'ospedale** di South Bay, di notte (nessun
  game-over). Interno `hospital`; nessuna perdita di progressi.
- **Corriere (courier)**: consegna a tempo che ti fa correre da un'area all'altra (barra timer +
  indicatore destinazione a schermo).
- **Fog of war** sulla mappa del menu Start: le aree partono coperte ("???") e si svelano visitandole
  o quando una missione-ponte le indica (set `discovered`, salvato). Isola e Mare restano velati fino
  a metà storia; le aree terrestri/costiere si scoprono entro le prime ~7 missioni via i ponti.

Parte mare (in Mare Aperto, si arriva dalla nave al molo della Baia del Sud):
- **Navigazione in barca** (bianca, faro notturno), più veloce, oltre le boe. Le boe hanno luci notturne.
- **Pesca ad abilità**: barra oscillante, premi A nella zona verde.
- **Rotta a checkpoint (regata)**: attraversa boe in sequenza entro il tempo (con corrente).
- **Recupero in mare**: raggiungi un oggetto che deriva con la corrente.
- **10 missioni-mare** avviate dal menu della nave: ne appare **una alla volta** (in ordine, con "!" giallo),
  più "Naviga in mare aperto". Completata una, compare la successiva.

## 7. Architettura tecnica (per una AI che riprende il progetto)
- Tutto in un IIFE dentro `index.html`. Loop di gioco: `update(dt)` + `draw()` via `requestAnimationFrame(loop)`.
- Stato principale: `player` (tx/ty in tile, px/py in pixel, dir, moving, swimming, scooter, boat),
  `areaKey`, `cur` (mappa corrente: rows/w/h), `season`, `clock`/`dayCount`.
- Aree: `AREAS` (key->array di righe), `AREA_GRID` (posizione griglia), `AREA_LABEL`, i18n `area_<key>`.
- Rendering per tile con depth-sorting: `drawGround`, `drawObject`, entità raccolte con `push(ty, fn)`.
- Testi bilingui in `STR.it`/`STR.en`; `t(key)` risolve; `VARIANTS`/`vpick` per varianti di sistema.
- Storia: oggetto `CASE` (order, clues, deduced, reconstructed, morals, fought, chaseCaught, introDone),
  esposto come `window.CASE_REF`. `caseAllDone()` = true quando tutte le rosse sono finite.
- Casual: motore `SQ` (`window.SQ_REF`): `SQ.pool` per meccanica, `SQ.active`, `sqActivate()`, `sqComplete()`.
- Salvataggio: `saveGame()`/`loadGame()` (JSON in localStorage) + `serializeCase`/`serializeSQ` e relativi restore.
- Overlay/attività bloccanti gestite nel loop con `return` (confront, fight, choice, fishSkill, ecc.);
  attività non bloccanti (chase, regatta, recovery, delivery) girano durante il movimento.

### Come si modifica in sicurezza
- Fare SEMPRE un backup di `index.html` prima di editare.
- Dopo ogni modifica: verificare la **sintassi JS** (estrarre i tag <script> e `node --check`) E fare un
  **test di caricamento runtime** con stub di canvas/AudioContext (il solo check di sintassi non intercetta
  errori tipo funzioni mancanti a runtime).
- Le mappe sono 44x40: mantenere la larghezza; i tile calpestabili esterni sono `. , ' m x s` (mare `~`/`q`
  è nuotabile ma non calpestabile a piedi). Tile solidi in `OUT_SOLID`.
- I waypoint di pedinamenti/rotte devono essere su tile raggiungibili (verificare con un BFS).

## 8. Durata stimata e stato
Contenuti attuali: **29 missioni rosse** (storia) + **~72 missioni gialle** nel pool (7 meccaniche,
servite 1 per tipo a rotazione, incluse le 8 courier trasversali) + **10 missioni-mare** + fauna,
predatori, esplorazione di **9 aree**.
- Sola storia centrale: **~7-10 ore**.
- Per vedere quasi tutto (gialle, mare, esplorazione): **~12-18 ore**.
Stima, non cronometrata; dipende molto dagli errori del giocatore (retry, "torna domani").

**Stato: giocabile e pubblicabile.** È un singolo `index.html` autoconsistente (nessuna dipendenza):
- Per giocare in locale: aprire `index.html` nel browser, oppure `python3 -m http.server 8000` nella cartella.
- Per GitHub Pages: mettere `index.html` nella root del repo (o in `/docs`) e attivare Pages; il gioco
  gira direttamente dal browser. `gemini_story.json`, `story_positions.json`, `DESIGN.md`,
  `PROJECT_OVERVIEW.md` sono file di supporto/documentazione (il gioco NON li carica a runtime: i dati
  sono inline in `index.html`). I `index.backup-*.html` non servono nel repo pubblico.

## 9. TODO / note aperte
- **Nave = barriera fisica al molo di South Bay (2026-09-17):** prima dalla punta del molo est il
  personaggio poteva proseguire verso sud e tuffarsi in acqua "oltre" la nave. Ora la ferma la nave:
  nuovo helper `isShipBlock(tx,ty)` (town, celle 35-39 x 36-37, cioe' lo scafo ormeggiato a sud del
  molo est) usato in `tryMove` prima della logica di ingresso in acqua -> il player ci sbatte e non
  entra in mare da li'. L'imbarco resta invariato: guardando la nave e premendo A si apre il menu nave
  (condizione `|fx-ship.tx|<=2 && |fy-ship.ty|<=2`). Verificato: tuffo bloccato da (37,35)/(36,35),
  footprint corretto (molo libero), condizione di imbarco vera dal molo, nuoto normale altrove intatto.
- **BUG CRITICO mare aperto — oggetto `regatta` non dichiarato (2026-09-17):** in Mare Aperto il gioco
  mostrava un box "undefined" e si bloccava. Causa: l'oggetto di stato `regatta` (usato in `update()`
  ogni frame come `regatta.active`, e in `startRegatta`/`updateRegatta`/`drawRegatta`) NON era piu'
  dichiarato — stessa identica classe di bug di `chase`: la dichiarazione
  `const regatta={ active:false, pts:[], idx:0, msg:"", msgT:0, onWin:null, onFail:null, timer:0 };`
  era presente nel backup 20260916-201757 ed era andata persa in un'edit. In strict mode leggere un
  identificatore non dichiarato lancia ReferenceError -> appena entri in `opensea` (dove update legge
  `regatta.active`) il loop crasha. Fix: ripristinata la dichiarazione prima di `startRegatta`.
  Riprodotto con un harness che avvia le sea quest (9x "regatta is not defined"), poi 0 errori dopo il
  fix; 40 frame in opensea/island/cape/town senza crash. NB: verificato che `regatta` era l'UNICO
  oggetto di stato ancora non dichiarato (recovery/fishing/fishSkill/seaCurrent/scDeliv/courier/tail/
  scour/chase risultano tutti dichiarati).
- **Inseguimento a piedi — rifinitura finale (2026-09-17):** velocità del sospetto in `startChase`
  (case_chase) impostata a **59 px/s** (player: camminata 62, corsa 92 con B, furtivo 34). Aggiunti
  nell'inseguimento del gioco reale (mappa `town`, NON un overlay separato) tre aiuti visivi presi
  dalla demo: 🧭 **freccia-bussola** attorno al detective che punta al fuggitivo (in `drawChase`),
  🔴 **freccia sul bordo** quando il fuggitivo è fuori schermo (in `drawChase`), 📊 **barra di
  prossimità + direzione cardinale** nell'HUD (in `drawChaseUI`). Nessun overlay/finestra (a differenza
  di foto/pesca): l'inseguimento resta movimento nel mondo. Musica invariata (quella noir del gioco);
  mappa/props/slider/musica della demo NON importati (restano in `chase_demo.html`). Verificato:
  sintassi OK, runtime OK, 60 frame con inseguimento attivo senza crash.
- **Diagnostica TOTALE + fix critico (2026-09-17):** eseguita una diagnostica esaustiva (non a
  campione): 1169 controlli su 12 categorie, tutti passati. Copertura: integrità delle 37 quest
  (order unici, catena `needs`, npc/pickup/stagioni/dialoghi), parità i18n IT+EN (752/752, 0 chiavi
  spaiate), cablaggio di TUTTI gli SNODI meccanici, geometria del mondo via BFS reale (9 mappe 44x40,
  36 pickup, punti scour, NPC storia+ambientali, porte-interno, 8 transizioni tra aree), playthrough
  completo della catena rossa fino a `caseAllDone`, invariante marcatore<->interazione su 77 NPC,
  state machine dei minigiochi foto (win/reset/fail) e perlustrazione (find-all), save/load round-trip,
  ed esecuzione di frame reali `update()`+`draw()` in tutte le 9 aree.
  - **BUG CRITICO trovato e corretto:** l'oggetto di stato `chase` (usato in `update`/`draw` a ogni
    frame: `chase.active`, `chase.target`, ecc.) **non era più dichiarato**. La dichiarazione
    `const chase = { active:false, id:null, target:null, msg:"", msgT:0 }` era presente nel backup
    `20260916-201757` ed era andata persa in un'edit successiva. In strict mode la lettura di un
    identificatore non dichiarato lancia `ReferenceError`, quindi il gioco sarebbe crashato al primo
    frame del loop (schermo nero/freddo) e faceva fallire anche `npcQuestKind` via `caseNpcHasQuest`.
    Fix: ripristinata la dichiarazione di `chase` (con anche `_onWin`/`_onFail`) subito prima di
    `startChase`. Verificato: update/draw girano in tutte le aree, npcQuestKind non lancia piu'.
  - Scansione statica anti-regressione: cercati altri identificatori usati come oggetto ma mai
    dichiarati (stessa classe di bug). Unico reale era `chase`; gli altri candidati (P, gb,
    outsideReturn, regatta, yel) sono dichiarazioni multi-variabile, tutte legittime.
- **Fase 2 — riuso meccaniche perlustrazione + foto (2026-09-17):** +6 missioni rosse (storia ora
  **37 in catena**, incluso `case_chase`), inserite con `order` decimali per non rinumerare gli snodi.
  Distribuite lungo tutto l'arco, mai due della stessa meccanica adiacenti.
  - **Perlustrazione (`SCOUR_SNODI`):** `case3c` "La banchina sporca" (3.4, autunno, industrial,
    guardia→pesc1); `case6c` "Sotto la neve" (6.2, inverno, mountain, eremita→vito); `case12c`
    "La radura dei riti" (12.2, autunno, forestNE, pesc2→bruno). Ognuna con 3 punti nascosti validati
    calpestabili (BFS/isSolid reale). Sequenza scour completa: 3.4 → 6.2 → 7.2(case7c) → 12.2.
  - **Appostamento foto (`PHOTO_SNODI`):** `case4c` "Consegne al gelo" (4.5, inverno, industrial,
    vito→guardia); `case8c` "Volti alla festa" (8.4, primavera, town, gina→capo); `case13c`
    "L'ultimo scarico" (13.2, autunno, industrial, bruno→pesc2). Sequenza foto: 4.5 → 8.4 →
    9.7(case9c) → 13.2. Riusano il minigioco `photoCam` (nessuna modifica al motore).
  - Coerenza narrativa: tutti i testi seminano indizi (veleni, doppia identità, culto ancora vivo)
    **senza mai nominare il colpevole** (il nome resta svelato solo in case14). Applicato in `STORY_DATA`
    (index.html) e rispecchiato in `gemini_story.json`. Pickup in `STORY_POS.pickups`.
  - Validato: sintassi OK, caricamento runtime OK (CASE.order=37, clue entries corrette), 21 punti
    scour + 3 pickup foto tutti calpestabili, giver/complete NPC esistenti nelle aree giuste.
- **Nuove missioni rosse + meccaniche (Fase 1, 2026-09-17):** +2 missioni rosse dopo case7 (order
  decimali, reveal finale intatto). Storia = 31 missioni.
  - 🔦 **case7c "La stanza sul mare"** (7.2, holiday): PERLUSTRAZIONE — `SCOUR_SNODI`, cerchi N punti
    nascosti con barra di prossimita' caldo/freddo; riusa il pattern tail. Nonna->Gina.
  - 📷 **case9c "Scatti nella notte"** (9.7, town): APPOSTAMENTO FOTO — `PHOTO_SNODI` + minigioco
    `photoCam` (overlay stile pesca): barra di tensione verticale, zona verde media oscillante; 3 scatti
    buoni di fila = ok, errore azzera, 3 errori = "Hai perso l'occasione" (ripetibile). Teo la da'.
    Grafica: mirino analogico + sagoma incappucciata neutra nella nebbia; suono `SFX.shutter` (click
    pieno). Rinominato photoCam/drawPhotoCam per non collidere con lo sprite drawPhoto delle micro-quest.
    Demo isolata in `photo_demo.html`. Validato: 31/31 completabili, testi IT+EN, win/fail/reset OK.
- **Juice / feeling / grafica (2026-09-17):**
  1. **Screen shake + vibrazione nei duelli:** `cam.shake` + `triggerShake(amount,vibeMs)`, applicato
     via `ctx.translate` che avvolge tutta `draw()` (decade in `update`). Innescato sui colpi del fight
     (nemico colpito 3/25ms, player colpito 4/40ms, vittoria 5/60ms) e sull'accusa a segno del confronto (2/20ms).
  2. **Vibrazione raccolta indizio:** aggiunta dentro `SFX.pickup` (navigator.vibrate 20ms); il suono
     c'era gia'. Copre tutte le raccolte (indizi rossi, gatto, conchiglia, palla, portachiavi, foto).
  3. **Completamento missione:** `qComplete` ora usa il breve `SFX.miniWin` (2 note) invece della
     fanfara lunga + vibrazione `[30,40,30]` + il popup gia' presente (`questPopup`).
  4. **Ritratti NPC storia nei dialoghi:** `drawPortrait(x,y,npc)` disegna un volto pixel 20x20 (da
     colori/kind dell'NPC) a sinistra del box dialogo, SOLO per NPC della storia rossa (`isStoryNpc`,
     via start_npc/complete_npc dei case o caseNpc). Il testo si sposta a destra (margine dinamico).
  5. **Diario: recap delle completate:** nel dettaglio di una missione `done` ora si mostra "Cosa hai
     fatto:" (`j_recap`) con il done_banner + gli step (rosse) o il testo (micro/SQ), non piu' solo
     "completata". Registro SQ.log usato per i titoli.
  Tutto validato: runtime OK, isStoryNpc corretto (window.CASE_REF), stringhe risolte.
- **Diario ristrutturato a 3 categorie (2026-09-17):** per non dover scorrere le completate.
  Vista MAIN: (1) STORIA CENTRALE = rosse attive (non done); (2) MICRO-MISSIONI = solo la gialla in
  corso (micro fissa active + SQ accettata); (3) voce "MISSIONI COMPLETATE" che apre un sottomenu.
  Sottomenu: "CENTRALI COMPLETATE" (rosse done, ordine QORDER) e "MICRO COMPLETATE" (micro fisse done
  in MICRO_ORDER + SQ dal nuovo registro `SQ.log`). Liste navigabili su/giu, A=dettaglio, B=indietro
  (dettaglio->lista->sottomenu->main->gioco). Helper: journalActiveRed/Yellow, journalDoneRed/Yellow.
  Nuovo `SQ.log` (id/kind/title/giver in ordine cronologico) popolato in `sqComplete`, serializzato,
  azzerato in resetProgress. Stato menu: jView/jSel/jDoneMenuSel/jDetail. Testato: attive mostrano solo
  in-corso, completate elencano rosse e (micro+SQ) cronologiche. Runtime OK.
- **Interni sparsi in Contea e Borgo (2026-09-17):** le 3 porte-interno di forestNW (Contea) e di
  holiday (Borgo) erano tutte sulla colonna ovest. Spostate su edifici sparsi (stessi char 7/8/9 ->
  stesso mapping interni). Contea: 7 @ (31,4) nord, 8 @ (31,26) centro, 9 @ (18,32) centro-sud.
  Borgo: 8 @ (21,11) centro-centro, 9 @ (37,17) centro-est, 7 @ (21,23) centro-sud. Le vecchie porte
  tornano `D` (chiuse). Validato: ogni porta ha accesso adiacente e BFS-raggiungibile dai bordi;
  nessuna collisione con pickup. Runtime OK.
- **Box suggerimenti = passo SUCCESSIVO (2026-09-17):** le quest rosse non fanno avanzare `q.step`,
  quindi l'HUD mostrava sempre `steps[0]` (es. "Parla con la madre") anche dopo aver fatto quel passo.
  Riscritto `activeQuestText` per le quest `case`: (1) se l'indizio/beat non e' pronto -> mostra il
  passo "trova l'oggetto" (`steps[1]`) + area (▶) + hint di posizione; (2) se l'indizio e' gia' raccolto
  (`caseClueReady`) ma la quest non e' chiusa -> `hud_report_clue` ("Torna dal (!) rosso per riferire");
  (3) tra una rossa e l'altra -> `hud_find_red` ("Cerca il (!) rosso..."). Testato nei 4 stati. Runtime OK.
- **Batch UX/menu (2026-09-17):**
  1. **HUD tra missioni rosse:** quando nessuna rossa e' attiva ma la storia continua e una rossa e'
     `available`, l'HUD mostra `hud_find_red` ("Cerca il (!) rosso...") invece dello step vecchio.
  2. **Bussola** spostata da sotto il box hint a sotto il box stagioni/ora (in alto a sinistra):
     `drawCompass(12,26)`.
  3. **Diario navigabile:** `drawJournal` riscritto con lista scrollabile (su/giu) di tutte le missioni
     (rosse+gialle) via `journalEntries()`; A apre un dettaglio (tag STORIA/EXTRA, stato, descrizione),
     B torna alla lista. Stato menu esteso (`journalSel`, `journalDetail`).
  4. **Intro marinaio:** dopo `intro_start`, spiega i marcatori (`intro_marks`/`intro_marks2`) e chiede
     conferma (`intro_understood_q`); "No" ripete la spiegazione (loop), "Si" manda dalla vedova
     (`intro_go_widow`). Esteso `askYesNo` con callback `onNo`.
  5. **Sindaco (municipio):** `in_mayor` ora avverte di prestare attenzione alle stagioni (cambiano il
     volto di citta' e zone limitrofe).
  6. **"ESCI DAL GIOCO"** sostituisce "CHIUDI": salva e torna al menu principale (`screen="title"`).
  7. **"REGOLE DI GIOCO":** nuovo sottomenu paginato (`drawRules`, 5 pagine bilingui), dati in
     `RULES_PAGES_DATA` inline + file sorgente `game_rules.json`.
  8. **Ordine menu START:** MAPPA, DIARIO, TACCUINO, LINGUA, REGOLE DI GIOCO, ESCI DAL GIOCO.
  9. Legenda "A: ok  B: chiudi" (`menu_hint`) mantenuta in basso in tutte le schermate del menu.
- **Fuzzer esaustivo invariante marcatore<->interazione (2026-09-16):** test che esplora tutti gli
  stati RAGGIUNGIBILI (rotazione micro accettando/completando in ordine legale, SQ accettata, 9 aree)
  = 15120 controlli NPC. Ha isolato un ultimo disallineamento: con una SQ accettata, `npcHasQuest`
  ritornava true per una micro-giver (micro offerta in astratto) mentre `npcQuestKind` la nascondeva
  (corretto). Non causava comportamento errato (`canStartMicro` bloccava comunque l'avvio) ma era
  incoerente. Fix: `startOffered(id)` ora richiede anche `canStartMicro(null,id)` (nessun'altra gialla
  in corso) -> `npcHasQuest`, `npcQuestKind`, `canStartMicro` perfettamente allineati. Nessuna
  ricorsione (canStartMicro non chiama npcHasQuest). Fuzzer ripetuto: 0 incoerenze. Regressione 5/5 OK.
- **Diagnostica completa sistema missioni/marcatori + fix strutturali (2026-09-16):** dopo vari fix
  incrementali, fatta una diagnostica sistematica dell'invariante "il '!' visibile == cosa l'NPC puo'
  fare". Trovati e risolti 2 problemi di fondo:
  - **Doppio cappello:** il motore SQ poteva assegnare una side-quest a un NPC che era gia' micro-giver
    (es. nonna+recon, pino+confront) -> due fonti di "!" sullo stesso NPC. Fix: `MICRO_GIVER_NPCS`
    (nonna,pino,boy,girl,fornaio,marinaio,nico,mamma) esclusi da `sqCandidateNpcs`. Un NPC = una sola
    fonte di giallo.
  - **Due percorsi di interazione scollegati:** le micro-quest passano da `npc.onTalk`, le side-quest SQ
    da un blocco separato (`sqNpcMission`) nel gestore input, che non controllava il marcatore. Fix:
    la SQ ora e' offribile SOLO se `npcQuestKind(n)==="casual"` (stesso criterio del "!"). Interazione
    e marcatore ora hanno un'unica fonte di verita' (`npcQuestKind`).
  - Regressione: 9/9 test OK (rotazione micro, foto gated, turni, doppio cappello, lock durante quest,
    SQ 1/meccanica). Runtime OK.
- **Micro-quest a rotazione "una alla volta" (2026-09-16):** le 6 micro-quest originali
  (cat/shell/parcel/kids/oldfriend/photos) prima erano TUTTE offerte insieme dopo l'intro. Ora seguono
  una rotazione come il motore SQ: `MICRO_ORDER=[cat,shell,parcel,kids,oldfriend,photos]` e
  `currentMicroSlot()` = la prima non ancora `done`. Solo quella mostra il "!" per l'AVVIO
  (`npcHasQuest` usa `startOffered(id)= available && currentMicroSlot()===id`); `canStartMicro(npc,questId)`
  avvia solo se questId e' lo slot corrente. Completandone una, appare la successiva. La CONCLUSIONE
  (riconsegna) resta sempre attiva. NB: le side-quest SQ restano un sistema separato (1 per meccanica),
  quindi un NPC che ha SIA una micro SIA una SQ puo' mostrare il "!" per la SQ anche fuori dal suo turno
  micro — sono due binari distinti. Test: rotazione isolata cat->shell->...->photos, sempre 1 alla volta.
- **Fix: parlare != accettare (conferma micro-quest) (2026-09-16):** le micro-quest si avviavano
  automaticamente alla fine di un normale dialogo (l'`onTalk` girava a dialogo chiuso e faceva subito
  `qStart`), quindi salutare un NPC come Nico avviava la sua missione senza scelta. Ora ogni micro-quest
  (cat/shell/parcel/kids/oldfriend/photos) chiede conferma con `askYesNo(t("accept_quest_q"))`: la quest
  parte solo con "Si'". Puoi conversare con l'NPC e rifiutare. Nuova stringa `accept_quest_q` (IT/EN).
  Test: onTalk apre la conferma, No non avvia, Si' avvia. Runtime OK.
- **Fix: foto raccolte senza richiesta + NPC che danno quest senza "!" (2026-09-16):**
  - (Bug 1) La quest `photos` si auto-avviava raccogliendo una foto sul campo, anche se nessuno l'aveva
    chiesta (le foto erano raccoglibili gia' in stato `available`). Ora `photos` ha un giver: **mamma**
    (town) la assegna parlandole; le foto diventano raccoglibili SOLO quando `photos` e' `active`.
    Aggiornati raccolta, `isCollectibleBlocking`, disegno e highlight (rimosso il caso `available`).
    Nuove stringhe `mamma_photos` + `photos_start` (IT/EN); `npcHasQuest("mamma")` true se photos available.
  - (Bug 2) Gli `onTalk` delle micro-quest avviavano la missione anche col "!" nascosto (interazione
    scollegata dal marcatore). Aggiunto `canStartMicro(npcId)` (true solo se nessun'altra gialla e' in
    corso) come guardia allo START di cat/shell/kids/parcel/oldfriend/photos. La CONCLUSIONE resta
    sempre possibile. Ora un NPC affida una quest solo se mostra davvero il "!".
  - Test: foto non bloccanti da available / bloccanti da active; mamma "!" prima e non durante; Nico
    non avvia col gatto in corso, riavvia dopo. Runtime OK.
- **Fix "!" fantasma sulla nonna / NPC allowed (2026-09-16):** durante una micro-quest, l'NPC
  "consentito" (`allowedNpc`) mostrava sempre il "!" anche quando NON aveva un'azione disponibile.
  Caso reale: mentre cerchi il gatto (`questState===1`) la nonna esponeva un "!" pur non avendo nulla
  da fare (il gatto va prima trovato). Peggio: se la nonna aveva anche una side-quest SQ, mostrava il
  "!" di QUELLA durante la ricerca del gatto. Fix in `npcQuestKind`: quando `yellowLocked`, l'allowedNpc
  mostra il "!" solo se ha un'azione dello STESSO tipo della quest in corso — durante una micro-quest
  conta solo `npcHasQuest(n)` (non una SQ concomitante); durante una SQ conta solo `sqNpcMission(n)`.
  Test: q=0 casual, q=1 niente marker, q=2 casual (consegna), q=1+SQ niente marker. Runtime OK.
- **Marcatori "!" sempre vivi, anche di notte (2026-09-16):** i marcatori (giallo `#ffd020` / rosso
  `#ff2a2a`) venivano disegnati in `drawWorld` PRIMA dell'overlay notturno (`rgba(20,26,60,~0.55)`),
  quindi di notte apparivano spenti/marroni. Fix (Opzione A): rimosso il disegno del "!" dal render
  NPC (`drawNpc`) e aggiunta `drawQuestMarksOverlay()`, chiamata in `draw()` DOPO notte+nebbia — i
  marcatori restano brillanti a qualsiasi ora (sono guida di gameplay). Nessun doppio disegno; stesse
  coordinate schermo del render (`n.px-cam.x, n.py-cam.y`). Runtime OK.
- **Hook/hint piu' accurati (2026-09-16):** l'HUD (riquadro missione in alto a destra) ora, per una
  quest rossa attiva il cui indizio non e' ancora raccolto, arricchisce lo step con: **area di
  destinazione** (prefisso "\u25B6 NOME AREA", mostrato solo se sei in un'altra area) + **hint di
  posizione** dell'indizio (fra parentesi, dai dati `cs_<id>_hint`, prima definiti ma inutilizzati in
  gioco). Es.: "Trova la tanica strana.  \u25B6 RIONE DELLE OFFICINE  (riva del mare scuro)". Quando sei
  nell'area giusta la freccia sparisce; dopo la raccolta torna al solo step. Implementato in
  `activeQuestText()`; HUD alzato a 4 righe (`drawHUD` cresce in altezza). Aggiunto `id:q.id`
  all'oggetto quest rosso nel loader (serviva per identificarla dall'HUD). Bilingue IT/EN.
- **Copertura oggetti solidi confermata (2026-09-16):** censiti tutti i punti di raccolta; `isCollectibleBlocking`
  copre indizi rossi (via `currentClues`) + cat/shell/ball/keyring/photos. Esclusi di proposito i beat
  TAIL (nessun oggetto fisico) e i mini-giochi pesca/recupero (non oggetti su tile).
- **Oggetti da raccogliere ora solidi (2026-09-16):** prima gli oggetti (chiave/taccuino/indizi
  rossi, e cat/shell/ball/keyring/photos) erano su tile calpestabili → il player ci passava sopra ed
  era difficile fermarsi per raccoglierli con A. Ora sono **solidi**: nuovo helper
  `isCollectibleBlocking(tx,ty)` (indizi attivi via `currentClues()`, esclusi i beat TAIL che non
  hanno pickup fisico; + micro-quest cat/shell/ball/keyring/photos) usato in `tryMove` — il player ci
  **sbatte** e li raccoglie premendo A dal tile di fronte (le raccolte usavano già `fx,fy`). Sostituiti
  i vecchi blocchi ad-hoc `blockedByCat/blockedByShell`. Validato: la chiave di `case1` blocca da
  attiva e smette da raccolta; ogni oggetto ha >=2 vicini calpestabili (nessuna trappola). Runtime OK.
- **Nuovi interni entrabili + NPC (2026-09-16):** esteso il sistema interni (prima 1 interno-default
  per area) per supportare piu' porte -> interni distinti. `AREA_INTERIOR` ora accetta una mappa
  `{char-porta: interior}`; `DOORS` (town) invariato come formato. Aggiunti 13 interni con 1 NPC ciascuno:
  - **Contea Altipiani (forestNW)** porte 7/8/9 -> `county_a/b/c`: 3 NPC che parlano di filosofia astratta.
  - **Borgo del Faro (holiday)** porte 8/9 -> `holiday_b/c` (+ bungalow su 7): perle di saggezza.
  - **Baia del Sud (town)** porte 3/5/6 -> `bay_scooter` (tutorial motorino/SELECT), `bay_map`
    (tutorial mappa/START), `bay_save` (autosave). Le porte 1/2/4 restano nonna/store/municipio.
  - **Rione Officine (industrial)** porte 7/8 -> `works_a/b`: 2 NPC pessimisti sul lavoro. Due `D`
    di edifici convertite in porte 7/8 (l'area non aveva porte-interno).
  - **Rifugi:** Bosco (forestNE porta 8 -> `forest_refuge`) e Alture (mountain porta 8 ->
    `heights_refuge`): NPC con frasi senza senso. Porta 7 di quelle aree resta il `cabin`.
  - Validato: runtime OK; tutti gli interni referenziati esistono; titoli/nomi/battute risolti IT+EN;
    ogni porta ha un tile calpestabile adiacente (BFS) da cui entrare.
- **Fix grafica/collisioni (2026-09-16):**
  - **Cani (Baia del Sud):** avevano solo il blob di fallback (nessuno sprite dedicato) → aggiunto
    `a.kind==="dog"` in `drawFaunaCritter` con corpo, testa, orecchio, coda che scodinzola e zampe al trotto.
  - **Cervi (Bosco degli Olmi):** sprite ridisegnato (corpo definito, collo, corna ramificate, macchia
    bianca, testa che ondeggia col passo + zampe animate) per dare movimento più leggibile. Il wander
    era già attivo (`FAUNA_DEF.forestNE deer wander`).
  - **Cartello Punta del Faro:** il tile `P` di `cape` (a 4,4) non aveva testo → aggiunte stringhe
    `sign_cape` (IT/EN) e aggancio in `A` sull'interazione col tile `P` quando `areaKey==="cape"`.
  - **Case Contea (forestNW) non solide:** i tile `X` (tetto) e `Z` (facciata) non erano in `OUT_SOLID`
    → il player le attraversava. Aggiunti a `OUT_SOLID` (usati SOLO in forestNW, nessun effetto altrove).
    La porta `D` e i dettagli `7/8/9` erano già solidi. Validato via BFS: pickup/NPC/waypoint restano
    raggiungibili e i 4 bordi restano attraversabili (1492 tile percorribili).
- **Messaggio di chiusura dopo il finale FATTO (2026-09-16)**: completata TUTTA la storia rossa
  (`case14` -> `showEnding()`), dopo le 3 righe del finale (variante just/mercy/grey) appare un
  secondo messaggio che chiude il caso ma rilancia sulle gialle: "Complimenti: hai risolto il caso!
  Ma non e' tempo di riposare, detective. C'e' sempre qualcuno, in citta', che ha bisogno del tuo
  aiuto." (EN: "Congratulations: you solved the case! ..."). Stringhe i18n `case_solved_0/1/2`
  (IT+EN); mostrato via callback di `showExamine` in coda a `showEnding`.
- **Visibilità missioni gialle "una alla volta" FATTO (2026-09-16)**: quando il giocatore **accetta**
  una missione gialla (side-quest), tutte le **altre** gialle spariscono — sia il "!" giallo sopra gli
  NPC in gioco, sia i pallini gialli sulla mappa dello START. Al **completamento** (o fallimento) della
  gialla in corso, le altre riappaiono, sempre rispettando il motore a slot (`SLOTS_PER_KIND=1`, 1 per
  meccanica). Implementazione: nuovo stato `SQ.acceptedNpc` (l'NPC della gialla accettata); settato in
  `sqStart` e rilasciato dalle callback win/fail di ogni tipo (incluso il caso di fallimento, prima
  scoperto solo per alcuni tipi). `npcQuestKind()` — usata sia dai marcatori in gioco sia da
  `drawMarkers` sulla mappa — nasconde ogni giallo tranne quello accettato quando `SQ.acceptedNpc` è
  impostato (o quando `sqBusy()`). `sqInit()` azzera `acceptedNpc` (un reload non lascia i marcatori
  nascosti). Le missioni **rosse** (storia) restano sempre visibili. Nessuna modifica a `SLOTS_PER_KIND`.
  - **FIX (2026-09-16, esteso):** la prima versione copriva SOLO il motore `SQ`, per cui le
    **micro-missioni originali** (`cat/shell/parcel/kids/oldfriend/photos`) — che vivono fuori da `SQ`
    con stati propri (`questState`, `shellQuest`, `QUESTS.*.status`) — continuavano a mostrare gli
    altri "!" (bug visto con la missione "gatto"). Ora `npcQuestKind()` calcola un unico `allowedNpc`
    considerando ENTRAMBI i sistemi: helper `microQuestActiveNpc()` restituisce l'NPC che chiude la
    micro-missione in corso (o null). Se una gialla di qualsiasi tipo è in corso, resta visibile solo
    il suo NPC; alla conclusione tutte riappaiono.
- **Fix ritmo del reveal (storia rossa) FATTO (2026-09-16)**: il colpo di scena "Renzo vivo = Re Cervo"
  veniva rivelato per nome già a metà storia (`case9b`) e ripetuto fino a `case14`, bruciando il finale.
  Riscritti 5 dialoghi `done` (`case9b` teo, `case11b` pesc2, `case12` bruno, `case13` vedova, `case13b`
  capo) per NON nominare il colpevole (indizi che puntano a "un uomo solo / il 'morto' / è ancora vivo"),
  e reso `case14` (capo) l'UNICO punto in cui il nome viene svelato. Prove e nessi causali invariati.
  Applicato sia in `STORY_DATA` (index.html, letto a runtime) sia in `gemini_story.json` (sorgente).
- ~~Rimuovere il **cheat SELECT** che sblocca il motorino~~ **FATTO (2026-09-16)**: il motorino
  ora si sblocca SOLO completando la missione `case_chase`. `toggleScooter()` rispetta il flag
  `scooterUnlocked`; premere SELECT senza motorino mostra "Non hai (ancora) un motorino." Rimossi
  anche i residui di test: le stringhe `scooter_cheat` ("[TEST]...") e il suggerimento
  "(SELECT per provare)/(SELECT to try it)" nella battuta di Vito.
- **Revisione storia — Livello A (refusi/lingua) FATTO (2026-09-16)**: correzioni applicate sia in
  `STORY_DATA` (dentro `index.html`, che è la fonte letta a runtime) sia in `gemini_story.json`
  (fonte sorgente), per tenerle allineate:
  - case6 titolo: "Ilchimista solitario" → "Il chimista solitario"
  - case6 done_banner IT: "Documento decrypted." → "Documento decifrato." (era inglese in campo IT)
  - case7 pickup: "medaglietta con r"/"locket with r" (troncato) → "medaglietta incisa"/"engraved locket"
  - case2 step: "Pescaggio sulla spiaggia." → "Cerca sulla spiaggia."
  - case10 start_banner IT: "Afra e minacce." → "Afa e minacce."
  - case5 dialogo Vito: "traccie" → "tracce"
- **Revisione storia — Livello B (narrativa profonda) FATTO (2026-09-16)**: risolte le "crepe"
  senza toccare struttura/meccaniche/id esistenti.
  - (1) **Colpevole chiaro**: è Renzo (vivo, il "Re Cervo"); il Capo officina è complice ricattato.
    La vittima è la figlia scomparsa della nonna (medaglietta incisa col cervo).
  - (2) **Nessi causali** espliciti: riscritti 14 dialoghi `done`/`start` perché ogni indizio dica
    perché porta al prossimo (es. la fiala di case3 ha un codice di lotto che rimanda ai condotti
    nei boschi di case4).
  - (3) **Niente indizi "convenienti"**: l'arma (coltello inciso, ora `case12b`) e la confessione
    (ora `case13b` → case14) sono costruite da missioni intermedie, non spuntano alla fine.
  - (4) **Movente NPC**: nonna = madre della vittima; Teo = ex adepto pentito; Silas = ex chimico
    dell'officina; guardia = complice reticente.
  - (5) **+7 missioni rosse** con `order` decimali, ridistribuite nelle stagioni esistenti, usando
    più meccaniche per varietà (tail, deduzione, ricostruzione, duello, confronto).
  - Snodi aggiornati in `index.html`: `FIGHT_SNODI(+case11b)`, `CONFRONT_SNODI(+case13b)`,
    `RECON_SNODI(+case9b)`, `TAIL_SNODI(+case2b)`, `DEDUCTION_SNODI(+case6b→case3)`.
  - Applicato via `apply_story_revision.js` (valida i limiti di lunghezza dei testi prima di scrivere).
- **Rinomina del colpevole + battute dei momenti clou FATTO (2026-09-16)**:
  - Il nome del colpevole è stato cambiato (sostituzione di parola intera in `index.html` e
    `gemini_story.json`, 44 occorrenze ciascuno) per preservare l'effetto sorpresa; il nome viene
    rivelato solo nel dialogo finale di `case14`.
  - Aggiunte **battute dedicate** ai due momenti clou, con fallback ai testi standard di sistema:
    il duello `case11b` e il duello `case13b`. Motore esteso con l'helper `csvar(id,key)`
    che cerca `cs_<id>_<key>` e, se assente, usa la chiave generica (`confront_*`, `fight_*`).
    Le battute dei clou NON nominano il colpevole (niente spoiler durante il gioco).
- **Ritocchi di ritmo (anti-noia) FATTO (2026-09-16)**:
  - Apertura più varia: `case2` ("L'ultima sera") ora è una **ricostruzione** invece di
    raccogli+interroga, così il secondo passo rompe subito il pattern. Sequenza iniziale:
    raccogli → ricostruzione → pedinamento → duello → inseguimento.
  - Finale meno ripetitivo: `case13b` passa da confronto a **duello** (uno scagnozzo del Capo ti
    ferma), così il climax non ha due confronti di fila: ...deduzione → duello → confronto (case14).
  - Risultato misurato: max 2 missioni consecutive con la stessa meccanica (era 3). Distribuzione:
    raccogli 7, ricostruzione 4, duello 4, confronto 3, deduzione 3, inseguimento 1.
- **Slot mappa liberi**: la griglia 3x3 ha due celle vuote, `(0,2)` Sud-Ovest e `(2,2)` Sud-Est
  (SO confina con holiday+opensea, SE con industrial+opensea). Candidate per due nuove aree future
  (da progettare narrativamente e validare con BFS le transizioni ai bordi).
- **Isola del culto (Sud-Est, cella `(2,2)`) FATTO (2026-09-16)** — area navigabile con attracco:
  - Nuova area `island` (44x40): **mare navigabile in barca** sul perimetro, isola centrale
    camminabile (tempio del culto con piazzale + lampioni, spiaggia, alberi/palme/scogli) e un
    **molo `w` sul lato ovest** dove si attracca. Registrata in `AREAS`, `AREA_GRID` (2,2),
    `AREA_LABEL`, i18n `area_island`. Il molo dell'isola è reso calpestabile in `isSolid`.
  - **Due modi per arrivarci** (entrambi ti portano nelle acque dell'isola *in barca*):
    1. **Via mare**: dal molo di South Bay → nave → "Naviga il mare aperto" → in Mare Aperto vai
       tutto a **EST** → sbuchi nelle acque dell'isola (bordo ovest). `opensea` E ↔ `island` W.
    2. **Zattera** metallica che galleggia alla riva sud-est del Quartiere Industriale (`raft` a
       33,34, sull'acqua; la usi dalla riva a 34,34): avvicinati e premi **A** → arrivi nelle acque
       dell'isola.
  - **Accessi sempre disponibili** (non più bloccati da `islandUnlocked`): sia il passaggio a EST in
    Mare Aperto sia la zattera funzionano appena li trovi esplorando. La missione `case_isle1` resta
    il momento narrativo in cui Teo rivela l'isola, ma non gate l'accesso fisico.
  - **Attracco/sbarco**: in barca, davanti al molo premi **A** per scendere a terra; a piedi sul molo,
    guardando l'acqua, premi **A** per risalire in barca. In barca ci si muove solo sull'acqua `~`.
  - **Ritorno simmetrico**: in barca, dal bordo **OVEST** dell'isola torni in Mare Aperto (bordo est),
    e da lì a **Nord** al molo di South Bay.
  - `islandUnlocked` si attiva quando parte `case_isle1`; è salvato/caricato. Le aree isolate
    (`opensea`, `island`) restano escluse dall'attraversamento a piedi degli altri bordi.
  - **2 missioni rosse** (estate, tra case11b e case12): `case_isle1` "Rotta per l'isola" e
    `case_isle2` "Il covo del Re Cervo" (duello col Custode, in `FIGHT_SNODI`, con battute dedicate).
    Nuovo NPC `custode` sull'isola. Totale storia: **24 missioni**.
  - Validazione: mappa 44x40; navigazione in barca (arrivo→molo) e cammino (molo→tempio/custode/
    pickup) verificati via BFS con la
    logica `isSolid` reale del gioco), sintassi + runtime OK, coerenza tra file inline e sorgenti.
  - Slot `(0,2)` Sud-Ovest ora occupato dalla **Punta del Faro** (vedi sotto).
- **Punta del Faro (Sud-Ovest, cella `(0,2)`) FATTO (2026-09-16)** — penisola mista terra/mare:
  - Nuova area `cape` (44x40): una lingua di terra che entra dal nord e si assottiglia verso sud,
    finendo in mare prima dell'estremo sud (metà inferiore = mare). Molo `w` sul lato est (reso
    calpestabile come quello dell'isola). Registrata in `AREAS`, `AREA_GRID` (0,2), `AREA_LABEL`,
    i18n `area_cape` ("PUNTA DEL FARO" / "LIGHTHOUSE POINT").
  - **Modifica al Borgo del Faro** (`holiday`): aperta una lingua di costa (sabbia) sul lato ovest
    (colonne 1-6) che scende fino al bordo sud, per far passare a piedi verso la penisola.
  - **Due accessi**: (a) **a piedi** dal Borgo del Faro (holiday SUD ↔ cape NORD, colonne 1-6
    allineate e verificate); (b) **in barca** dal Mare Aperto (opensea OVEST ↔ cape acque EST).
    Attracco/sbarco al molo con **A** (come l'isola). `cape` NON è in `ISOLATED_AREAS` perché è
    raggiungibile anche a piedi.
  - Direzioni: opensea OVEST → `enterCapeWaters` (arrivi in barca nel mare est di cape); cape EST in
    barca → `capeToOpenSea` (torni in Mare Aperto); cape NORD a piedi → holiday (via neighborArea).
  - Validazione: mappe 44x40; cammino (cape nord → molo) e navigazione (opensea → molo/bordo est)
    via BFS; allineamento colonne 1-6 tra holiday-sud e cape-nord; sintassi + runtime OK.
  - Nota: `cape` ospita ora il faro (punta sud, sugli scogli), 2 missioni rosse (`case_cape1/2`),
    il NPC `guardiano` (look "sailor": maglia a righe bianche/blu, barba bianca, cappellino rosso) e
    missioni gialle a tema.
- **Fauna + predatori/ospedale FATTO (2026-09-16)**: fauna decorativa in tutte le aree; orso/lupi
  alle Alture del Nord inseguono il giocatore e, se lo raggiungono, lo fanno risvegliare all'ospedale
  di notte (interno `hospital`). Vedi sezione 6.
- **Fog of war + missioni-ponte di scoperta FATTO (2026-09-16)**: mappa del menu Start con aree
  coperte che si svelano; 3 ponti rossi brevi (`case_disc1/2/3`) rivelano Borgo del Faro, Contea e
  Punta del Faro entro le prime ~7 missioni. Accesso a piedi sempre libero; isola/mare velati fino a metà.
- **Missioni gialle: nuovo tipo trasversale + ribilanciamento FATTO (2026-09-16)**: aggiunto il tipo
  **`courier`** (8 consegne a tempo cross-area). `SLOTS_PER_KIND` portato a **1** (max ~7 gialle
  attive). Alleggerita town (20→16), arricchite Isola e Punta (2→4 ciascuna) con NPC-giver aggiuntivi.
- **Bug motorino in mare FATTO (2026-09-16)**: `toggleScooter` blocca il motorino se in barca, se nuoti
  o se in un'area di mare (opensea/island/cape).
- **Save/discovered**: il salvataggio persiste `scooterUnlocked`, `islandUnlocked`, `discovered` (aree
  scoperte) e ripristina la barca com'era (anti-blocco in mare al reload).
- Possibili estensioni future discusse: meccaniche marine avanzate (tempesta, inseguimento navale, sonar),
  combattimento più profondo, altri contenuti.
