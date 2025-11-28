# ✅ Frontend Deployment Checklist

## Pre-Deployment

### 1. Entwicklungsumgebung
- [x] Node.js 18+ installiert
- [x] npm dependencies installiert (`npm install`)
- [x] Dev-Server läuft (`npm run dev`)
- [x] Keine Compilation-Errors
- [x] Backend läuft auf Port 8080

### 2. Code-Qualität
- [x] Alle Komponenten erstellt (10)
- [x] Alle Pages erstellt (5)
- [x] Services konfiguriert (1)
- [x] Context Provider aktiv (1)
- [x] Routing konfiguriert (5 Routes)
- [x] Keine ESLint Errors (nur Warnings)

### 3. Funktionalität
- [ ] Registrierung getestet
- [ ] Login getestet
- [ ] Lobby erstellen getestet
- [ ] Lobby beitreten getestet
- [ ] Spiel starten getestet
- [ ] Alle Rollen getestet
- [ ] Chat getestet
- [ ] Gewinn-Bedingungen getestet

---

## Build-Prozess

### 1. Environment-Konfiguration
```javascript
// src/services/api.js - Zeile 3
// DEVELOPMENT:
const API_BASE_URL = 'http://localhost:8080/api';

// PRODUCTION:
const API_BASE_URL = 'https://your-backend-domain.com/api';
// oder mit Environment Variable:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
```

### 2. Environment File erstellen (optional)
```bash
# .env.production
VITE_API_URL=https://api.werwoelfeln.com/api
```

### 3. Production Build
```bash
npm run build
```
Erstellt `dist/` Ordner mit optimierten Files

### 4. Preview testen (optional)
```bash
npm run preview
```
Testet Production Build lokal

---

## Backend-Konfiguration

### CORS Update
```java
// Backend: CorsConfig.java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
        .allowedOrigins(
            "http://localhost:5173",  // Development
            "https://your-frontend-domain.com"  // Production
        )
        .allowedMethods("*")
        .allowedHeaders("*")
        .allowCredentials(true);
}
```

---

## Deployment-Optionen

### Option 1: Vercel (Empfohlen für React)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
# Set VITE_API_URL in Environment Variables
```

### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Production
netlify deploy --prod

# Set Environment Variables in Netlify Dashboard
```

### Option 3: Static Hosting (AWS S3, GitHub Pages, etc.)
```bash
# Build
npm run build

# Upload dist/ folder content to:
# - AWS S3 + CloudFront
# - GitHub Pages
# - Nginx Server
# - Apache Server
```

### Option 4: Docker
```dockerfile
# Dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build & Run
docker build -t werwoelfeln-frontend .
docker run -p 80:80 werwoelfeln-frontend
```

---

## Post-Deployment

### 1. Backend-Verbindung prüfen
- [ ] API-Calls erreichen Backend
- [ ] CORS-Fehler behoben
- [ ] Token-Authentifizierung funktioniert
- [ ] Alle Endpoints erreichbar

### 2. Funktionalitäts-Test
- [ ] Registrierung
- [ ] Login
- [ ] Lobby erstellen
- [ ] Lobby beitreten
- [ ] Spiel starten
- [ ] Rollen-Funktionen
- [ ] Chat-System
- [ ] Gewinn-Bildschirm

### 3. Browser-Kompatibilität
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari
- [ ] Mobile (iOS)
- [ ] Mobile (Android)

### 4. Performance
- [ ] Ladezeit < 3 Sekunden
- [ ] Keine Console-Errors
- [ ] Polling funktioniert
- [ ] Chat-Updates in Echtzeit
- [ ] Keine Memory-Leaks

### 5. Security
- [ ] HTTPS aktiv (Production)
- [ ] Tokens sicher gespeichert
- [ ] Keine sensitiven Daten in Console
- [ ] API-Keys geschützt

---

## Monitoring (Optional)

### Analytics
```javascript
// Google Analytics
// Sentry Error Tracking
// LogRocket Session Recording
```

### Performance Monitoring
```javascript
// Lighthouse Scores
// Web Vitals
// Bundle Size Analysis
```

---

## Rollback-Plan

### Bei Problemen:
1. Vorherige Version wiederherstellen
2. Backend-Kompatibilität prüfen
3. Error-Logs analysieren
4. Hot-Fix deployment

### Version Control
```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## Maintenance

### Regelmäßige Updates
- [ ] Dependencies updaten (`npm update`)
- [ ] Security-Patches
- [ ] React-Version
- [ ] Build-Tools

### Backup
- [ ] Source-Code in Git
- [ ] Environment-Variablen dokumentiert
- [ ] Build-Konfiguration gesichert

---

## Support

### Dokumentation bereitstellen
- [x] README.md
- [x] QUICK_START.md
- [x] IMPLEMENTATION_SUMMARY.md
- [x] Dieses Deployment-Checklist

### User-Feedback
- [ ] Issue-Tracker einrichten
- [ ] Feature-Requests sammeln
- [ ] Bug-Reports bearbeiten

---

## Production-URL-Beispiele

### Frontend
```
https://werwoelfeln.com
https://app.werwoelfeln.com
https://play.werwoelfeln.com
```

### Backend
```
https://api.werwoelfeln.com
https://backend.werwoelfeln.com
```

---

## ✅ Final Checklist

Vor Go-Live:
- [ ] Production Build erfolgreich
- [ ] API-URL auf Production geändert
- [ ] Backend CORS konfiguriert
- [ ] HTTPS konfiguriert
- [ ] DNS konfiguriert
- [ ] Alle Features getestet
- [ ] Performance akzeptabel
- [ ] Security-Review durchgeführt
- [ ] Backup-Plan erstellt
- [ ] Monitoring aktiv
- [ ] Dokumentation vollständig
- [ ] Team informiert

**Nach erfolgreicher Prüfung: DEPLOY! 🚀**

---

## Quick Commands Übersicht

```bash
# Development
npm install
npm run dev

# Production Build
npm run build
npm run preview

# Linting
npm run lint

# Clean Install
rm -rf node_modules package-lock.json
npm install

# Version Check
node --version
npm --version
```

---

**Viel Erfolg beim Deployment! 🎮🐺**

