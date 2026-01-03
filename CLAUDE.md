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

**OTOMATIK DEPLOY AKTIF** - GitHub'a push ettiğinde sunucu otomatik güncellenir.

GitHub Actions workflow: `.github/workflows/deploy.yml`

### Ne Yapman Gerekiyor
1. Kod değişikliği yap
2. Commit et
3. `git push origin main`
4. **Bitti!** Sunucu otomatik güncellenir (1-2 dakika)

### Test Et
https://sudoku.ceylan.world

### Nginx Config
- **Root:** /home/musa/projects/sudoku-game
- **SSL:** Let's Encrypt
