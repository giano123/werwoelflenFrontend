# 🎮 Game Screen Redesign - Documentation

## 📅 Datum: 28. November 2025

---

## 🎯 Ziel

Neugestaltung des Game Screens als **non-scrollable Full-Screen-Interface** mit 3-Spalten-Layout, optimiert für Desktop/Tablet Landscape.

---

## 📐 Layout-Struktur

### Gesamtaufbau
```
┌─────────────────────────────────────────────────────┐
│ HEADER (70px)                                       │
├───────────────┬─────────────────┬───────────────────┤
│               │                 │                   │
│  ZONE A       │    ZONE B       │    ZONE C         │
│  (360px)      │    (flex 1)     │    (320px)        │
│               │                 │                   │
│  Interaction  │    Stage Area   │  Player Roster    │
│  Panel        │                 │                   │
│               │                 │                   │
│  [Voting]     │   [Role Card]   │  [Player List]    │
│  [Actions]    │                 │                   │
│               │                 │                   │
│               │                 │                   │
└───────────────┴─────────────────┴───────────────────┘
      Grid: 360px        1fr          320px
```

### Höhenverteilung
```
Header:        70px (fixed)
Main Content:  calc(100vh - 70px)
Total:         100vh (no scroll!)
```

---

## 🎨 Design-Spezifikationen

### Farbschema
```css
Background:       #2C2F33  (Deep charcoal/slate)
Panels:           #36393F  (Lighter container)
Borders:          rgba(82, 148, 226, 0.2)
Text Primary:     #ffffff
Text Secondary:   rgba(255, 255, 255, 0.7)
```

### Border-Radius
```css
Panels:           24px
Cards:            16-20px
Avatars:          50% (circles)
Buttons:          12px
```

### Typography
```css
Header Title:     1.8rem, 700 weight
Panel Title:      1.1rem, 700 weight, uppercase
Player Name:      1rem, 600 weight
```

---

## 📦 Zone A: Interaction Panel (Left Column)

### Komponenten
1. **Voting Panel** (flex: 1)
   - Header: "VOTING"
   - Content: 2-Column Grid
     - Left: Mini Player List (140px)
     - Right: Target View (flex: 1)

2. **Card Action Panel** (flex: 0.6, min-height: 200px)
   - Header: "CARD ACTION"
   - Content: Empty State / Special Abilities

### Voting Panel - Detailed Structure

#### Mini Player List
```typescript
.voting-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;  // Scrollable if many players
}

// Each Item:
Avatar (36px circle) + Name (truncated)
```

#### Target View
```typescript
Centered Container:
  - Large Avatar (120px circle)
  - Player Name (1.5rem)
  - Action Button (Kill/Lynch with icon)

Selected State:
  - Blue glow border
  - Shadow effect
```

### Interaktionen
- Click on Mini Player → Selects target
- Selected Player → Shows in Target View
- Action Button → Only enabled when player selected
- Hover → Border glow + slight transform

---

## 🎭 Zone B: Stage Area (Center Column)

### Content
```typescript
.stage-card {
  width: 100%;
  max-width: 500px;
  aspect-ratio: 1;  // Always square
  position: center;
}
```

### Role Card Display
```
┌─────────────────────┐
│                     │
│                     │
│        🐺           │  ← Large Role Icon (12rem)
│                     │
│    WERWOLF          │  ← Role Name (2rem, uppercase)
└─────────────────────┘
```

### Dynamic Coloring
```typescript
Werewolf:  Red Gradient   (#ff4757 → #c92a3a)
Seer:      Purple         (#a29bfe)
Witch:     Green          (#00d2a0)
Hunter:    Orange         (#ff9f43)
Villager:  Blue           (#5294e2)
```

---

## 👥 Zone C: Player Roster (Right Column)

### Structure
```typescript
Panel Header:
  "SPIELER (6/8)"  // Alive/Total count

Roster List:
  - Scrollable (overflow-y: auto)
  - Gap: 0.75rem between items
```

### Roster Item (Pill Shape)
```
┌────────────────────────────────┐
│ [A]  Alina         🐺 WEREWOLF │
│ [T]  Tina          ✅ ALIVE    │
│ [T]  Tim           💀 DEAD     │
└────────────────────────────────┘

Components:
  - Avatar (44px circle, colored by faction)
  - Name (1rem, 600 weight)
  - Status Icons (Role emoji if revealed, skull if dead)
```

### States
```css
Normal:  rgba(44, 62, 102, 0.3)
Hover:   transform: translateX(5px) + border glow
Dead:    opacity: 0.5, grayscale(80%)
```

---

## 🎯 Header Region

### Layout
```typescript
Display: flex, space-between
Height: 70px
Padding: 0.75rem 2rem
Background: #36393F
Border-Bottom: 2px solid rgba(82, 148, 226, 0.2)
```

### Left Section
```
🐺 Werwölflen
└─┘ └────────┘
Icon  Title
48px  1.8rem
```

### Right Section
```
Lobby: ABC123   [U]●
└────────────┘  └─┘
Code Display    Avatar + Status
```

---

## ⚙️ Responsiveness

### Desktop (>1400px)
```css
grid-template-columns: 360px 1fr 320px;
```

### Tablet (1200px - 1400px)
```css
grid-template-columns: 320px 1fr 280px;
```

### Mobile (<1200px)
```css
grid-template-columns: 1fr;
grid-template-rows: auto 1fr auto;

// Stack order:
1. Interaction Panel (top)
2. Stage Area (middle)
3. Player Roster (bottom)
```

---

## 🎨 UI Components

### Avatar Component
```css
.roster-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, blue, lightblue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #fff;
  box-shadow: 0 4px 15px rgba(82, 148, 226, 0.3);
}
```

### Panel Container
```css
.game-panel {
  background: #36393F;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
```

### Action Button
```css
.target-action-btn {
  background: linear-gradient(135deg, red, darkred);
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);
  
  // Icon + Text
  display: flex;
  gap: 0.5rem;
}

.target-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(255, 71, 87, 0.6);
}
```

---

## 🔄 State Management

### Selection State
```typescript
const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

// In Mini List:
onClick={() => setSelectedPlayer(player.playerId)}

// In Target View:
const selectedPlayerData = availableTargets.find(p => p.playerId === selectedPlayer);
```

### Action Handling
```typescript
const handleAction = async (actionType, targetPlayerId) => {
  if (gameState.currentPhase === 'NIGHT_WOLVES') {
    await gameAPI.submitVote(gameId, targetPlayerId);
  } else if (gameState.currentPhase === 'DAY_VOTING') {
    await gameAPI.submitVote(gameId, targetPlayerId);
  }
  
  setSelectedPlayer(null);  // Reset after action
  await loadGameState();     // Refresh game state
};
```

---

## 📊 Game Flow Integration

### Phases that show Voting Panel
- `NIGHT_WOLVES` - Werewolves select victim
- `DAY_VOTING` - Village votes to lynch

### Card Action Panel (Future)
Reserved for:
- Seer inspection UI
- Witch potion UI
- Hunter revenge shot UI
- Other special abilities

---

## 🎯 Mock Data Structure

```typescript
interface PlayerInfo {
  playerId: number;
  username: string;
  seatNumber: number;
  isAlive: boolean;
  revealedRole: boolean;
  role: RoleName | null;
}

// Example:
const mockPlayers = [
  { playerId: 1, username: "Alina", seatNumber: 1, isAlive: true, role: "WEREWOLF" },
  { playerId: 2, username: "Tina", seatNumber: 2, isAlive: true, role: null },
  { playerId: 3, username: "Tim", seatNumber: 3, isAlive: false, role: "VILLAGER" },
  // ...
];
```

---

## ✨ Animations & Transitions

### Hover Effects
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

// On hover:
transform: translateY(-2px);  // Buttons
transform: translateX(5px);   // Roster items
border-color: rgba(82, 148, 226, 0.5);  // Glow
```

### Selection Animation
```css
.selected {
  background: linear-gradient(135deg, blue, lightblue);
  box-shadow: 0 0 15px rgba(82, 148, 226, 0.4);
  transform: scale(1.05);
}
```

### Panel Entry
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.game-panel {
  animation: fadeIn 0.6s ease-out;
}
```

---

## 🔧 Technical Implementation

### CSS Grid
```css
.game-main-container {
  display: grid;
  grid-template-columns: 360px 1fr 320px;
  gap: 1.5rem;
  height: calc(100vh - 70px);
  overflow: hidden;  // ← KEY: No scrolling!
}
```

### Flex Columns
```css
.game-zone {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow: hidden;
}
```

### Scrollable Sections
```css
// Only these scroll internally:
.voting-list { overflow-y: auto; }
.roster-list { overflow-y: auto; }

// Custom scrollbar:
::-webkit-scrollbar {
  width: 6px;
  background: rgba(26, 31, 58, 0.3);
}
```

---

## 🎨 Color Reference

### Backgrounds
```
Main:      #2C2F33
Panels:    #36393F
Overlay:   rgba(10, 14, 39, 0.3)
```

### Roles
```
Werewolf:  #ff4757
Seer:      #a29bfe
Witch:     #00d2a0
Hunter:    #ff9f43
Village:   #5294e2
```

### States
```
Alive:     #00d2a0
Dead:      #4a5568
Selected:  #5294e2
Hover:     rgba(82, 148, 226, 0.3)
```

---

## 📱 Assets Needed

1. **Wolf Icon** - Used in logo & kill button
2. **Avatar Placeholders** - Circular, user initials
3. **Role Icons** - Emoji-based (🐺🔮🧪🏹👤)
4. **Status Icons** - ✅💀🎯

---

## ✅ Implementation Checklist

- [x] Full-screen layout (100vh, no scroll)
- [x] 3-column grid system
- [x] Header with logo & user
- [x] Voting panel with mini list
- [x] Target selection view
- [x] Large centered role card
- [x] Scrollable player roster
- [x] Responsive breakpoints
- [x] Hover & selection states
- [x] Color-coded roles
- [x] Dead player styling
- [x] Custom scrollbars

---

## 🚀 Status

**✅ FULLY IMPLEMENTED**

- Non-scrollable full-screen layout
- All 3 zones functional
- Responsive design
- Interactive voting system
- Role card display
- Player roster
- No compile errors
- Production ready

---

**Made for Werwölflen** 🐺  
**Date: 28.11.2025**

