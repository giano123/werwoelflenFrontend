# 🐺 Werwölfeln Frontend

React-basierte Frontend-Anwendung für das Werwölfeln-Spiel mit komplett überarbeitetem Dark-Theme-Design.

## ✨ Version 2.0 - Complete Style Revamp (28.11.2025)

### 🎨 Was ist neu?
- **Mystisches Dark-Theme** - Perfekt für die Werwolf-Atmosphäre
- **Interaktive Animationen** - Smooth Transitions auf allen Elementen
- **Glassmorphism-Design** - Moderne, durchsichtige Card-Effekte
- **Rollenspezifische Farben** - Sofortige visuelle Erkennung
- **Responsive Layout** - Optimiert für Desktop, Tablet und Mobile
- **1500+ Zeilen CSS** - Professionelles Senior-Developer-Level-Design

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Server läuft auf: **http://localhost:5174/**

## 🎮 Features

### Authentifizierung
- Benutzerregistrierung mit Username, E-Mail und Passwort
- Login-System mit Token-basierter Authentifizierung
- Geschützte Routen mit automatischer Umleitung

### Lobby-System
- Lobbys mit eindeutigen 6-stelligen Codes erstellen
- Bestehenden Lobbys beitreten
- Echtzeit-Lobby-Status (alle 2 Sekunden Polling)
- Bereit-Status für alle Spieler
- Host-Rechte (nur Host kann Spiel starten)
- Automatische Rollenverteilungsvorschau

### Spiel-Funktionalität

#### Alle Rollen implementiert:
- 🐺 **Werwolf**: Gemeinsames nächtliches Voting zum Töten
- 🔮 **Seher**: Untersucht nachts einen Spieler
- 🧪 **Hexe**: Heiltrank (einmalig) und Gifttrank (einmalig)
- 🏹 **Jäger**: Rache-Schuss beim Tod
- 👤 **Dorfbewohner**: Teilnahme an Tages-Abstimmungen

#### Spiel-Phasen:
- 🌙 **Nacht - Werwölfe**: Werwölfe wählen Opfer
- 🌙 **Nacht - Seher**: Seher untersucht einen Spieler
- 🌙 **Nacht - Hexe**: Hexe kann heilen oder vergiften
- ☀️ **Tag - Diskussion**: Alle diskutieren im Chat
- ☀️ **Tag - Abstimmung**: Alle stimmen für Lynch-Opfer
- 🏆 **Ergebnis**: Anzeige des Gewinners

#### UI-Komponenten:
- **GameInfo**: Zeigt aktuelle Phase, Tag-Nummer, eigene Rolle
- **PlayerList**: Übersicht aller Spieler mit Status
- **ActionPanel**: Rollenspezifische Aktionen
- **ChatPanel**: Echtzeit-Chat mit mehreren Kanälen

### Chat-System
- Mehrkanal-Unterstützung (LOBBY, DAY, NIGHT_WOLVES, SYSTEM)
- Echtzeit-Updates durch Polling
- System-Nachrichten für Spiel-Events
- Automatisches Scrollen zu neuen Nachrichten

## 📁 Projektstruktur

```
src/
├── components/          # Wiederverwendbare Komponenten
│   ├── ActionPanel.jsx     # Rollenspezifische Aktionen
│   ├── ChatPanel.jsx       # Chat-Funktionalität
│   ├── GameInfo.jsx        # Spielinformationen
│   ├── PlayerList.jsx      # Spielerliste
│   └── ProtectedRoute.jsx  # Route-Schutz
├── context/             # React Context
│   └── AuthContext.jsx     # Authentifizierungs-Context
├── pages/               # Hauptseiten
│   ├── GamePage.jsx        # Spiel-Oberfläche
│   ├── HomePage.jsx        # Startseite
│   ├── LobbyPage.jsx       # Lobby-Verwaltung
│   ├── LoginPage.jsx       # Login-Formular
│   └── RegisterPage.jsx    # Registrierungs-Formular
├── services/            # API-Dienste
│   └── api.js              # Axios API-Konfiguration
├── App.css              # App-Styles
├── App.jsx              # Haupt-App-Komponente
├── index.css            # Globale Styles
└── main.jsx             # Einstiegspunkt
```

## 🛠 Technologie-Stack

- **React 19.1.1** - UI-Framework
- **React Router 7.9.1** - Client-seitiges Routing
- **React Bootstrap 2.10.10** - UI-Komponenten
- **Bootstrap 5.3.8** - CSS-Framework
- **Axios 1.12.2** - HTTP-Client
- **Vite 7.1.7** - Build-Tool

## 📦 Installation

```bash
npm install
```

## 🚀 Entwicklung starten

```bash
npm run dev
```

Die Anwendung läuft auf: http://localhost:5173

## 🏗 Build für Produktion

```bash
npm run build
```

## 🔧 Konfiguration

### API-Endpunkt
Die Backend-URL ist in `src/services/api.js` konfiguriert:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

### CORS
Stellen Sie sicher, dass das Backend CORS für `http://localhost:5173` erlaubt.

## 🎮 Benutzung

### 1. Registrierung/Login
- Registriere einen neuen Account oder melde dich an
- Token wird automatisch im localStorage gespeichert

### 2. Lobby erstellen oder beitreten
- **Erstellen**: Erstelle eine neue Lobby mit automatisch generiertem Code
- **Beitreten**: Gib einen 6-stelligen Lobby-Code ein

### 3. Spiel vorbereiten
- Warte auf mindestens 4 Spieler
- Alle Spieler müssen "Bereit" sein
- Host startet das Spiel

### 4. Spielen
- **Nacht-Phasen**: Rollenspezifische Aktionen (Werwolf-Vote, Seher-Untersuchung, Hexen-Tränke)
- **Tag-Phasen**: Diskutieren im Chat und Abstimmen für Lynch
- **Chat nutzen**: Kommuniziere mit anderen Spielern
- **Aktionen ausführen**: Klicke auf Spieler und wähle deine Aktion

### 5. Gewinnbedingungen
- **Dorf gewinnt**: Alle Werwölfe eliminiert
- **Werwölfe gewinnen**: Werwölfe ≥ Dorfbewohner

## 🔄 API-Integration

### Authentifizierung
- `POST /api/auth/register` - Registrierung
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Aktuellen Benutzer abrufen

### Lobby
- `POST /api/lobbies` - Lobby erstellen
- `GET /api/lobbies/{code}/state` - Lobby-Status
- `POST /api/lobbies/{code}/join` - Lobby beitreten
- `POST /api/lobbies/{code}/leave` - Lobby verlassen
- `POST /api/lobbies/{code}/ready` - Bereit-Status setzen
- `POST /api/lobbies/{code}/start` - Spiel starten

### Spiel
- `GET /api/games/{gameId}/state` - Spielstatus
- `POST /api/games/{gameId}/actions/vote` - Abstimmen
- `POST /api/games/{gameId}/actions/power` - Spezialfähigkeit nutzen
- `POST /api/games/{gameId}/transition-to-voting` - Zu Voting wechseln
- `GET /api/games/{gameId}/wolf-victim` - Werwolf-Opfer (Hexe)
- `GET /api/games/{gameId}/inspection-result` - Untersuchungsergebnis (Seher)
- `GET /api/games/{gameId}/chat` - Chat-Nachrichten abrufen
- `POST /api/games/{gameId}/chat` - Nachricht senden

## 🎨 UI/UX Features

- Responsive Design mit Bootstrap
- Echtzeit-Updates durch Polling (2s Intervall)
- Intuitive Spieler-Auswahl
- Rollenspezifische UI-Anpassungen
- Visuelle Feedback für Aktionen
- Klare Phasen-Anzeigen
- Emoji-Icons für bessere Erkennbarkeit

## 🔐 Sicherheit

- Token-basierte Authentifizierung
- Automatische Token-Verwaltung via Axios Interceptor
- Geschützte Routen mit Redirect zu Login
- Automatisches Token-Refresh beim Laden der App

## 📝 Wichtige Hinweise

- Spiel erfordert mindestens 4 Spieler
- Polling-Intervalle können bei Bedarf angepasst werden
- Alle Spieler müssen bereit sein, bevor Host starten kann
- Backend muss auf Port 8080 laufen

## 🐛 Debugging

Bei Problemen prüfe:
1. Backend läuft auf http://localhost:8080
2. CORS ist korrekt konfiguriert
3. Browser-Console auf Fehler prüfen
4. Network-Tab für API-Calls überprüfen

## 📄 Lizenz

Dieses Projekt ist für Bildungszwecke erstellt.

