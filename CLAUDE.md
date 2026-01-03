# Sudoku Game - Claude Code Config

## Proje Bilgileri

| Bilgi | Deger |
|-------|-------|
| **Proje** | Sudoku Puzzle Game |
| **Tip** | Web (HTML/JS) + Capacitor (iOS/Android) |
| **Domain** | https://sudoku.ceylan.world |
| **Repo Root** | /home/musa/projects/sudoku-game |

## Sunucu Bilgileri

| Bilgi | Deger |
|-------|-------|
| **Hostname** | m-server |
| **IP** | 116.203.78.184 |
| **User** | musa |
| **Sudo** | NOPASSWD (full access) |

## Deploy

Bu proje **static web** - dosyalar direkt serve ediliyor.

### Deploy Komutu
```bash
cd /home/musa/projects/sudoku-game && git pull origin main
```

### Nginx Config
- **Config:** /etc/nginx/sites-available/sudoku.ceylan.world
- **Root:** /home/musa/projects/sudoku-game
- **SSL:** Let's Encrypt (otomatik)

## Dosya Yapisi

```
sudoku-game/
├── index.html        # Ana menu
├── game.html         # Oyun sayfasi
├── daily.html        # Gunluk challenge
├── difficulty.html   # Zorluk secimi
├── achievements.html # Basarimlar
├── android/          # Android Capacitor
├── ios/              # iOS Capacitor
└── manifest.json     # PWA manifest
```

## Calisma Prensipleri

- Kod degisikligi yaptiktan sonra DEPLOY YAP
- Deploy = `git pull` (sunucuda)
- Test et: https://sudoku.ceylan.world

### Deploy Tam Komut (SSH ile)
```bash
ssh musa@116.203.78.184 "cd /home/musa/projects/sudoku-game && git pull origin main"
```

### Veya Sunucudaysan
```bash
cd /home/musa/projects/sudoku-game && git pull origin main
```
