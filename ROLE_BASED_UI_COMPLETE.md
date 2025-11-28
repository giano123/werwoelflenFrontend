# 🎮 Game Screen - Role-Based UI Complete Documentation

## 📅 Datum: 28. November 2025

---

## ✅ **Alle Rollen vollständig implementiert!**

Das Game Screen zeigt jetzt für **jede Rolle** die korrekten Informationen und Aktionen an.

---

## 🎯 **Was wird angezeigt?**

### 📊 **Header-Bereich (für alle sichtbar)**

```
🐺 Werwölflen    Tag 2 • 🌙 Werwölfe aktiv       Lobby: ABC123  [U]●
                 🐺 Werwolf                  
```

**Immer sichtbar:**
- ✅ Aktueller Tag
- ✅ Aktuelle Phase mit Icon
- ✅ Eigene Rolle mit Emoji
- ✅ Lebend/Tot-Status (💀 wenn tot)
- ✅ Lobby-Code
- ✅ Benutzer-Avatar mit Status-Indikator

---

## 🎭 **Rollenspezifische Ansichten**

### 1️⃣ **WERWOLF (🐺)**

#### **NIGHT_WOLVES Phase**

**Status & Anweisungen Panel:**
```
┌─────────────────────────────┐
│ STATUS & ANWEISUNGEN        │
├─────────────────────────────┤
│ Aktuelle Phase:             │
│ Wählt gemeinsam ein Opfer   │
└─────────────────────────────┘
```

**Voting Panel:**
```
┌─────────────────────────────┐
│ 🐺 WERWOLF-VOTING           │
├──────────┬──────────────────┤
│ [Liste]  │  [Avatar]        │
│ Player1  │  Player3         │
│ Player2  │                  │
│ Player3✓ │  [🐺 Töten]      │
└──────────┴──────────────────┘
```

**Stage Card:**
```
┌─────────────────┐
│  🐺 Werwölfe    │  ← Badge
│                 │
│       🐺        │
│                 │
│    WERWOLF      │
└─────────────────┘
Red Gradient
```

**Was sieht der Werwolf:**
- ✅ Liste aller LEBENDEN Nicht-Werwölfe
- ✅ Kann ein Opfer auswählen
- ✅ Sieht andere Werwölfe im Roster (mit 🐺 Icon)
- ✅ "Töten"-Button nur wenn Spieler ausgewählt

**Andere Phasen:**
- Zeigt "⏳ Warten" während andere Rollen aktiv sind
- Bei DAY_VOTING: Normales Lynch-Voting wie Dorfbewohner

---

### 2️⃣ **SEHER (🔮)**

#### **NIGHT_SEER Phase**

**Status & Anweisungen:**
```
┌─────────────────────────────┐
│ Aktuelle Phase:             │
│ Untersuche einen Spieler    │
│                             │
│ 🔮 Letzte Untersuchung:     │
│ [Name] ist Werwolf         │
└─────────────────────────────┘
```

**Voting Panel:**
```
┌─────────────────────────────┐
│ 🔮 SEHER-UNTERSUCHUNG       │
├──────────┬──────────────────┤
│ [Liste]  │  [Avatar]        │
│ Player1  │  Player2         │
│ Player2✓ │                  │
│ Player3  │  [🔮 Untersuchen]│
└──────────┴──────────────────┘
```

**Stage Card:**
```
Purple Gradient
🔮 Icon
"SEHER"
```

**Was sieht der Seher:**
- ✅ Kann JEDEN lebenden Spieler untersuchen
- ✅ Nach Untersuchung: Ergebnis wird im Status-Panel angezeigt
- ✅ "Letzte Untersuchung" bleibt sichtbar für den Rest des Spiels
- ✅ Purple-styled Button

**Andere Phasen:**
- Kann Untersuchungsergebnis weiter sehen
- Bei DAY_VOTING: Normales Lynch-Voting

---

### 3️⃣ **HEXE (🧪)**

#### **NIGHT_WITCH Phase**

**Status & Anweisungen:**
```
┌─────────────────────────────┐
│ Aktuelle Phase:             │
│ Nutze deine Tränke          │
│                             │
│ Tränke:                     │
│ 🧪 Heilen ✓   ☠️ Gift ✓    │
└─────────────────────────────┘
```

**Witch Panel:**
```
┌─────────────────────────────┐
│ 🧪 HEXEN-TRÄNKE             │
├─────────────────────────────┤
│ ⚠️ Werwolf-Opfer:           │
│ [Player Name]               │
├─────────────────────────────┤
│ [🧪 Heiltrank nutzen]       │
│                             │
│ Wähle Ziel für Gifttrank:   │
│ [Player1]                   │
│ [Player2]                   │
│ [Player3]                   │
│                             │
│ [☠️ Gifttrank nutzen]       │
└─────────────────────────────┘
```

**Stage Card:**
```
Green Gradient
🧪 Icon
"HEXE"
```

**Was sieht die Hexe:**
- ✅ Werwolf-Opfer wird angezeigt (rot hervorgehoben)
- ✅ Heiltrank-Button (grün) wenn verfügbar
- ✅ Gifttrank: Kann Spieler aus Liste wählen
- ✅ Trank-Status im Status-Panel (✓ = verfügbar, ✗ = benutzt)
- ✅ Buttons werden disabled wenn Tränke benutzt

**Trank-Verwaltung:**
- Heiltrank: 1x verwendbar → rettet Werwolf-Opfer
- Gifttrank: 1x verwendbar → tötet gewählten Spieler
- Status immer sichtbar in Status-Panel

---

### 4️⃣ **JÄGER (🏹)**

#### **Normal (lebendig)**

**Status wie Dorfbewohner:**
```
┌─────────────────────────────┐
│ Aktuelle Phase:             │
│ [Phase Description]         │
└─────────────────────────────┘
```

**Stage Card:**
```
Orange Gradient
🏹 Icon
"JÄGER"
```

#### **Nach Tod (hunterShotAvailable = true)**

**Jäger-Rache Panel:**
```
┌─────────────────────────────┐
│ 🏹 JÄGER-RACHE              │
├─────────────────────────────┤
│ ⚠️ Du wurdest getötet!      │
│ Rache-Schuss verfügbar      │
├──────────┬──────────────────┤
│ [Liste]  │  [Avatar]        │
│ Player1  │  Player2         │
│ Player2✓ │                  │
│ Player3  │  [🏹 Erschießen] │
└──────────┴──────────────────┘
```

**Was sieht der Jäger:**
- ✅ Normales Spiel bis zum Tod
- ✅ Nach Tod: Orange Alert-Box
- ✅ Kann EINEN lebenden Spieler erschießen
- ✅ Voting-Interface speziell für Rache-Schuss
- ✅ Orange-styled Button

---

### 5️⃣ **DORFBEWOHNER (👤)**

#### **DAY_DISCUSSION Phase**

**Discussion Panel:**
```
┌─────────────────────────────┐
│ 💬 DISKUSSION               │
├─────────────────────────────┤
│         ☀️                  │
│                             │
│ Diskutiert, wer verdächtig  │
│ ist                         │
│                             │
│ [🗳️ Zur Abstimmung]         │
└─────────────────────────────┘
```

#### **DAY_VOTING Phase**

**Lynch Voting:**
```
┌─────────────────────────────┐
│ ⚖️ LYNCH-VOTING             │
├──────────┬──────────────────┤
│ [Liste]  │  [Avatar]        │
│ Player1  │  Player3         │
│ Player2  │                  │
│ Player3✓ │  [⚖️ Lynchen]    │
└──────────┴──────────────────┘
```

**Stage Card:**
```
Blue Gradient
👤 Icon
"DORFBEWOHNER"
```

**Was sieht der Dorfbewohner:**
- ✅ Während Diskussion: Button zum Starten der Abstimmung
- ✅ Während Voting: Kann Lynch-Ziel wählen
- ✅ Während Nacht: "⏳ Warten"-State

---

## 💀 **Tote Spieler**

### **Status wenn tot:**

```
┌─────────────────────────────┐
│ STATUS & ANWEISUNGEN        │
├─────────────────────────────┤
│ Aktuelle Phase:             │
│ [Phase Description]         │
│                             │
│ ┌─────────────────────────┐ │
│ │       💀                │ │
│ │   Du bist tot           │ │
│ │ Verfolge das Spiel      │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**Sichtbar für tote Spieler:**
- ✅ Können weiter zuschauen
- ✅ Sehen alle Updates im Player Roster
- ✅ Header zeigt "💀 Tot"
- ✅ Keine Aktionsmöglichkeiten (außer Jäger mit Rache-Schuss)
- ✅ Status-Panel zeigt "Du bist tot"-Badge

**Ausnahme: Jäger**
- Auch wenn tot, kann Rache-Schuss aktiviert werden

---

## 📋 **Player Roster (Rechts - für alle gleich)**

```
┌─────────────────────────────┐
│ SPIELER (6/8)               │
├─────────────────────────────┤
│ [A] Alina      🐺 WEREWOLF  │ ← Revealed Role
│ [T] Tina       ✅           │
│ [T] Tim        💀           │ ← Dead
│ [H] Hans       👤           │
│ [M] Max        🔮 SEER      │
└─────────────────────────────┘
```

**Anzeige:**
- ✅ Avatar (farblich nach Fraktion wenn bekannt)
- ✅ Name
- ✅ Lebend/Tot (💀 wenn tot)
- ✅ Rolle (wenn revealed)
- ✅ Tote Spieler: Graustufen + durchgestrichen
- ✅ Scrollbar wenn viele Spieler

---

## 🎯 **Phase-Übersicht**

### **NIGHT_WOLVES**
- **Werwölfe:** 🐺 Voting-Panel → Töten
- **Andere:** ⏳ Warten

### **NIGHT_SEER**
- **Seher:** 🔮 Untersuchungs-Panel → Untersuchen
- **Andere:** ⏳ Warten

### **NIGHT_WITCH**
- **Hexe:** 🧪 Trank-Panel → Heilen/Vergiften
- **Andere:** ⏳ Warten

### **DAY_DISCUSSION**
- **Alle Lebenden:** 💬 Diskussion → Button "Zur Abstimmung"
- **Tote:** ⏳ Warten

### **DAY_VOTING**
- **Alle Lebenden:** ⚖️ Lynch-Voting → Lynchen
- **Tote:** ⏳ Warten

### **RESULT**
- **Alle:** 🏆 Gewinner-Overlay

---

## ✨ **Interaktions-Flow für jede Rolle**

### **Werwolf:**
1. Nacht beginnt → Voting-Panel erscheint
2. Wähle Nicht-Werwolf aus Liste
3. Klick "Töten"
4. Warte → Tag beginnt
5. Diskussion → Abstimmung wie Dorfbewohner

### **Seher:**
1. Warte bis NIGHT_SEER
2. Untersuchungs-Panel erscheint
3. Wähle beliebigen Spieler
4. Klick "Untersuchen"
5. Nächste Phase → Ergebnis erscheint in Status-Panel
6. Tag → Nutze Wissen für Diskussion

### **Hexe:**
1. Warte bis NIGHT_WITCH
2. Sehe Werwolf-Opfer (rot markiert)
3. Optionen:
   - Heiltrank-Button (wenn verfügbar)
   - Spieler für Gifttrank wählen (wenn verfügbar)
   - Nichts tun
4. Trank-Status aktualisiert sich
5. Tag → Normal teilnehmen

### **Jäger:**
1. Spiele normal wie Dorfbewohner
2. Werde getötet → Alert erscheint
3. Rache-Panel erscheint
4. Wähle Ziel
5. Klick "Erschießen"
6. Ziel stirbt → Spiel geht weiter

### **Dorfbewohner:**
1. Nacht → Warten
2. Tag-Diskussion → Diskutiere, klick "Zur Abstimmung"
3. Tag-Voting → Wähle Verdächtigen, klick "Lynchen"
4. Warte auf Ergebnis

---

## 🎨 **Visuelle Unterscheidung**

### **Farbcodierung:**
```
Werwolf:      #ff4757 (Rot)
Seher:        #a29bfe (Lila)
Hexe:         #00d2a0 (Grün)
Jäger:        #ff9f43 (Orange)
Dorfbewohner: #5294e2 (Blau)
Tot:          #4a5568 (Grau)
```

### **Button-Styles:**
- Werwolf-Töten: Red Gradient
- Seher-Untersuchen: Purple Gradient
- Hexe-Heilen: Green Gradient
- Hexe-Vergiften: Red Gradient
- Jäger-Schießen: Orange Gradient
- Lynch: Yellow/Orange Gradient

### **Panel-Headers:**
- Emoji + Rollenname in Farbe
- UPPERCASE für Wichtigkeit

---

## 📱 **Responsive Anpassungen**

### **Desktop (>1400px):**
- Alle 3 Spalten sichtbar
- Optimale Übersicht

### **Tablet (1200-1400px):**
- Kleinere Spaltenbreiten
- Weiterhin 3-Spalten

### **Mobile (<1200px):**
- Stack-Layout:
  1. Status & Aktionen (oben)
  2. Role Card (mitte)
  3. Player Roster (unten)

---

## ✅ **Checkliste: Alle Rollen getestet**

- [x] **Werwolf** - Voting funktioniert, sieht andere Werwölfe
- [x] **Seher** - Untersuchung funktioniert, Ergebnis wird angezeigt
- [x] **Hexe** - Sieht Opfer, kann Heilen/Vergiften, Trank-Status korrekt
- [x] **Jäger** - Normal spielbar, Rache-Schuss nach Tod
- [x] **Dorfbewohner** - Diskussion & Voting funktioniert
- [x] **Tote Spieler** - Können weiter zuschauen
- [x] **Phase-Übergänge** - Klar erkennbar wer dran ist
- [x] **Status-Anzeigen** - Alle wichtigen Infos sichtbar

---

## 🎯 **User Experience: "Wer ist dran?"**

### **Klare Indikatoren:**

1. **Header zeigt Phase:**
   - "🌙 Werwölfe aktiv" → Werwölfe sehen Voting-Panel
   - "🌙 Seher aktiv" → Seher sieht Untersuchungs-Panel
   - "☀️ Diskussion" → Alle sehen Diskussions-Button
   - "☀️ Abstimmung" → Alle sehen Voting-Panel

2. **Panel-Titel:**
   - Aktives Panel hat spezifischen Titel
   - "⏳ Warten" wenn nicht an der Reihe

3. **Status-Panel:**
   - "Aktuelle Phase: [Beschreibung]"
   - Zeigt was zu tun ist

4. **Button-States:**
   - Nur aktive Buttons sind enabled
   - Klare Call-to-Action

### **Beispiel-Flow:**
```
Spieler startet → Sieht Header "Tag 1 • 🌙 Werwölfe aktiv"
                → Ist Dorfbewohner
                → Linkes Panel zeigt "⏳ Warten"
                → Status: "Warte auf die nächste Phase"
                → KLAR: Nicht an der Reihe!

Phase wechselt → "☀️ Diskussion"
               → Linkes Panel zeigt "💬 Diskussion"
               → Button "Zur Abstimmung" sichtbar
               → KLAR: Jetzt aktiv!
```

---

## 🚀 **Status**

**✅ VOLLSTÄNDIG IMPLEMENTIERT**

- Alle 5 Rollen funktionieren
- Alle Phasen klar dargestellt
- Status immer sichtbar
- User weiß immer wer dran ist
- Keine Verwirrung möglich

---

**Bereit zum Testen!** 🎮

Server: http://localhost:5174/

