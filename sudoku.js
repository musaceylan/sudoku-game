// ============================================
// SUDOKU GAME - Ultimate Enhanced Version
// ============================================

// Note: t() function and TRANSLATIONS are provided by translations.js

// ===========================================
// CONFIGURATION
// ===========================================
const XP_CONFIG = {
    baseXP: { beginner: 25, easy: 50, medium: 100, hard: 200, expert: 400, master: 600 },
    timeBonus: { threshold: 300, maxBonus: 100 },
    noMistakeBonus: 50,
    noHintBonus: 25,
    dailyBonus: 50,
    timeAttackBonus: 75,
    streakMultiplier: 0.1,
    levelXP: [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000, 5000, 6500, 8000, 10000, 12500, 15000, 18000, 22000, 27000, 33000, 40000]
};

const TIME_ATTACK_LIMITS = {
    beginner: 8 * 60,
    easy: 10 * 60,
    medium: 15 * 60,
    hard: 25 * 60,
    expert: 40 * 60,
    master: 60 * 60
};

const CELLS_TO_REMOVE = {
    beginner: 30,
    easy: 38,
    medium: 46,
    hard: 52,
    expert: 56,
    master: 60
};

const FONTS = {
    system: { name: 'System', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
    jakarta: { name: 'Jakarta', value: '"Plus Jakarta Sans", sans-serif' },
    mono: { name: 'Mono', value: '"SF Mono", "Fira Code", monospace' },
    rounded: { name: 'Rounded', value: '"Nunito", "Varela Round", sans-serif' },
    serif: { name: 'Serif', value: 'Georgia, "Times New Roman", serif' }
};

const SOUND_PACKS = {
    default: {
        name: 'Default',
        tap: { freq: 800, type: 'sine', duration: 0.05 },
        place: { freq: [600, 800], type: 'sine', duration: 0.1 },
        correct: { freq: [523, 659], type: 'sine', duration: 0.2 },
        error: { freq: [200, 150], type: 'square', duration: 0.15 },
        complete: { chord: [523, 659, 784, 1047], duration: 0.5 },
        rowComplete: { freq: [880, 1760], type: 'sine', duration: 0.2 },
        achievement: { chord: [659, 784, 988, 1319], duration: 0.6 },
        levelUp: { chord: [523, 659, 784, 1047, 1319], duration: 0.8 }
    },
    minimal: {
        name: 'Minimal',
        tap: { freq: 440, type: 'sine', duration: 0.03 },
        place: { freq: [440, 550], type: 'sine', duration: 0.05 },
        correct: { freq: [550, 660], type: 'sine', duration: 0.1 },
        error: { freq: [220, 180], type: 'sine', duration: 0.1 },
        complete: { chord: [440, 550, 660], duration: 0.3 },
        rowComplete: { freq: [660, 880], type: 'sine', duration: 0.1 },
        achievement: { chord: [550, 660, 880], duration: 0.4 },
        levelUp: { chord: [440, 550, 660, 880], duration: 0.5 }
    },
    arcade: {
        name: 'Arcade',
        tap: { freq: 1200, type: 'square', duration: 0.03 },
        place: { freq: [800, 1200], type: 'square', duration: 0.08 },
        correct: { freq: [800, 1000, 1200], type: 'square', duration: 0.15 },
        error: { freq: [300, 200, 150], type: 'sawtooth', duration: 0.2 },
        complete: { chord: [523, 659, 784, 1047], duration: 0.4 },
        rowComplete: { freq: [1000, 1500, 2000], type: 'square', duration: 0.15 },
        achievement: { chord: [800, 1000, 1200, 1600], duration: 0.5 },
        levelUp: { chord: [600, 800, 1000, 1200, 1600], duration: 0.7 }
    },
    zen: {
        name: 'Zen',
        tap: { freq: 300, type: 'sine', duration: 0.08 },
        place: { freq: [250, 350], type: 'sine', duration: 0.15 },
        correct: { freq: [350, 440], type: 'sine', duration: 0.25 },
        error: { freq: [180, 150], type: 'sine', duration: 0.2 },
        complete: { chord: [262, 330, 392, 523], duration: 0.8 },
        rowComplete: { freq: [440, 550], type: 'sine', duration: 0.25 },
        achievement: { chord: [330, 392, 494], duration: 0.7 },
        levelUp: { chord: [262, 330, 392, 523], duration: 1.0 }
    }
};

const THEMES = {
    default: {
        name: 'Ocean',
        primary: '#13daec',
        primaryDark: '#0fb8c9',
        highlight: '#e3f8fa',
        highlightDark: '#1e3a3d',
        accent: '#5BB5C5'
    },
    forest: {
        name: 'Forest',
        primary: '#22c55e',
        primaryDark: '#16a34a',
        highlight: '#dcfce7',
        highlightDark: '#14532d',
        accent: '#4ade80'
    },
    sunset: {
        name: 'Sunset',
        primary: '#f97316',
        primaryDark: '#ea580c',
        highlight: '#fed7aa',
        highlightDark: '#431407',
        accent: '#fb923c'
    },
    purple: {
        name: 'Purple',
        primary: '#8b5cf6',
        primaryDark: '#7c3aed',
        highlight: '#ede9fe',
        highlightDark: '#2e1065',
        accent: '#a78bfa'
    },
    rose: {
        name: 'Rose',
        primary: '#f43f5e',
        primaryDark: '#e11d48',
        highlight: '#ffe4e6',
        highlightDark: '#4c0519',
        accent: '#fb7185'
    }
};

// ===========================================
// SEEDED RANDOM
// ===========================================
class SeededRandom {
    constructor(seed) {
        this.seed = seed;
    }
    next() {
        this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
        return this.seed / 0x7fffffff;
    }
    nextInt(max) {
        return Math.floor(this.next() * max);
    }
}

function getDailySeed() {
    const now = new Date();
    return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

// ===========================================
// ENHANCED SOUND MANAGER
// ===========================================
class SoundManager {
    constructor() {
        this.enabled = localStorage.getItem('soundEnabled') !== 'false';
        this.volume = parseFloat(localStorage.getItem('soundVolume') || '0.5');
        this.packName = localStorage.getItem('soundPack') || 'default';
        this.audioContext = null;
        this.initialized = false;
    }

    get pack() {
        return SOUND_PACKS[this.packName] || SOUND_PACKS.default;
    }

    init() {
        if (this.initialized) return;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    setPack(packName) {
        if (SOUND_PACKS[packName]) {
            this.packName = packName;
            localStorage.setItem('soundPack', packName);
        }
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        localStorage.setItem('soundVolume', this.volume.toString());
    }

    play(type) {
        if (!this.enabled || !this.audioContext) return;

        const sound = this.pack[type];
        if (!sound) return;

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        if (sound.chord) {
            this.playChord(sound.chord, sound.duration);
            return;
        }

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        const frequencies = Array.isArray(sound.freq) ? sound.freq : [sound.freq];
        oscillator.frequency.setValueAtTime(frequencies[0], now);

        if (frequencies.length > 1) {
            frequencies.slice(1).forEach((freq, i) => {
                oscillator.frequency.setValueAtTime(freq, now + (i + 1) * (sound.duration / frequencies.length));
            });
        }

        oscillator.type = sound.type || 'sine';
        gainNode.gain.setValueAtTime(this.volume * 0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + sound.duration);

        oscillator.start(now);
        oscillator.stop(now + sound.duration);
    }

    playChord(frequencies, duration) {
        if (!this.enabled || !this.audioContext) return;
        const ctx = this.audioContext;
        const now = ctx.currentTime;

        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(freq, now);
            osc.type = 'sine';
            gain.gain.setValueAtTime(this.volume * 0.15, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
            osc.start(now + i * 0.05);
            osc.stop(now + duration);
        });
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('soundEnabled', this.enabled);
        return this.enabled;
    }
}

// ===========================================
// HAPTIC MANAGER
// ===========================================
class HapticManager {
    constructor() {
        this.enabled = localStorage.getItem('hapticEnabled') !== 'false';
        this.intensity = localStorage.getItem('hapticIntensity') || 'medium';
    }

    vibrate(pattern) {
        if (!this.enabled || !navigator.vibrate) return;

        const multiplier = this.intensity === 'light' ? 0.5 : this.intensity === 'heavy' ? 1.5 : 1;

        if (Array.isArray(pattern)) {
            navigator.vibrate(pattern.map(p => Math.round(p * multiplier)));
        } else {
            navigator.vibrate(Math.round(pattern * multiplier));
        }
    }

    light() { this.vibrate(10); }
    medium() { this.vibrate(20); }
    heavy() { this.vibrate(40); }
    error() { this.vibrate([30, 50, 30]); }
    success() { this.vibrate([20, 30, 20, 30, 50]); }
    achievement() { this.vibrate([50, 100, 50, 100, 100]); }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('hapticEnabled', this.enabled);
        return this.enabled;
    }
}

// ===========================================
// SETTINGS MANAGER
// ===========================================
class SettingsManager {
    constructor() {
        this.settings = this.load();
    }

    load() {
        const defaults = {
            autoRemoveNotes: true,
            highlightSameNumbers: true,
            highlightRowColBox: true,
            showRemainingCount: true,
            showTimer: true,
            showMistakes: true,
            popupNumpad: true,
            darkMode: false,
            theme: 'default',
            font: 'jakarta',
            language: 'en',
            soundEnabled: true,
            soundPack: 'default',
            soundVolume: 0.5,
            hapticEnabled: true,
            hapticIntensity: 'medium'
        };

        const saved = localStorage.getItem('sudoku_settings');
        if (saved) {
            try {
                return { ...defaults, ...JSON.parse(saved) };
            } catch (e) {
                return defaults;
            }
        }
        return defaults;
    }

    save() {
        localStorage.setItem('sudoku_settings', JSON.stringify(this.settings));
    }

    get(key) {
        return this.settings[key];
    }

    set(key, value) {
        this.settings[key] = value;
        this.save();

        // Apply setting immediately
        this.apply(key, value);
    }

    apply(key, value) {
        switch(key) {
            case 'darkMode':
                document.documentElement.classList.toggle('dark', value);
                localStorage.setItem('darkMode', value);
                break;
            case 'theme':
                this.applyTheme(value);
                localStorage.setItem('sudokuTheme', value);
                break;
            case 'font':
                this.applyFont(value);
                localStorage.setItem('sudokuFont', value);
                break;
            case 'language':
                localStorage.setItem('sudokuLanguage', value);
                break;
        }
    }

    applyTheme(themeName) {
        const theme = THEMES[themeName] || THEMES.default;
        const root = document.documentElement;
        root.style.setProperty('--theme-primary', theme.primary);
        root.style.setProperty('--theme-primary-dark', theme.primaryDark);
        root.style.setProperty('--theme-highlight', theme.highlight);
        root.style.setProperty('--theme-highlight-dark', theme.highlightDark);
        root.style.setProperty('--theme-accent', theme.accent);
    }

    applyFont(fontName) {
        const font = FONTS[fontName] || FONTS.jakarta;
        document.documentElement.style.setProperty('--game-font', font.value);
        document.body.style.fontFamily = font.value;
    }

    applyAll() {
        if (this.settings.darkMode) {
            document.documentElement.classList.add('dark');
        }
        this.applyTheme(this.settings.theme);
        this.applyFont(this.settings.font);
    }
}

// ===========================================
// STATISTICS MANAGER
// ===========================================
class StatsManager {
    constructor() {
        this.stats = this.load();
    }

    load() {
        const saved = localStorage.getItem('sudoku_stats');
        const defaults = {
            gamesPlayed: 0,
            gamesWon: 0,
            gamesLost: 0,
            totalTime: 0,
            bestTimes: { easy: null, medium: null, hard: null, expert: null },
            streakCurrent: 0,
            streakBest: 0,
            lastPlayedDate: null,
            lastWinDate: null,
            totalMistakes: 0,
            hintsUsed: 0,
            totalXP: 0,
            level: 1,
            dailyChallengesCompleted: 0,
            perfectGames: 0,
            noHintGames: 0,
            timeAttackWins: 0,
            byDifficulty: {
                easy: { played: 0, won: 0, totalTime: 0 },
                medium: { played: 0, won: 0, totalTime: 0 },
                hard: { played: 0, won: 0, totalTime: 0 },
                expert: { played: 0, won: 0, totalTime: 0 }
            }
        };

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return { ...defaults, ...parsed, byDifficulty: { ...defaults.byDifficulty, ...parsed.byDifficulty } };
            } catch (e) {
                return defaults;
            }
        }
        return defaults;
    }

    getLevel() {
        const xp = this.stats.totalXP;
        for (let i = XP_CONFIG.levelXP.length - 1; i >= 0; i--) {
            if (xp >= XP_CONFIG.levelXP[i]) {
                return i + 1;
            }
        }
        return 1;
    }

    getXPProgress() {
        const level = this.getLevel();
        const currentLevelXP = XP_CONFIG.levelXP[level - 1] || 0;
        const nextLevelXP = XP_CONFIG.levelXP[level] || this.stats.totalXP;
        const progress = this.stats.totalXP - currentLevelXP;
        const needed = nextLevelXP - currentLevelXP;
        return { progress, needed, percentage: Math.min(100, (progress / needed) * 100) };
    }

    addXP(amount) {
        const oldLevel = this.getLevel();
        this.stats.totalXP += amount;
        this.stats.level = this.getLevel();
        this.save();
        return { xpGained: amount, levelUp: this.stats.level > oldLevel, newLevel: this.stats.level };
    }

    calculateXP(difficulty, time, mistakes, hintsUsed, isDaily, streakDays, isTimeAttack = false) {
        let xp = XP_CONFIG.baseXP[difficulty] || 100;

        if (time < XP_CONFIG.timeBonus.threshold) {
            const timeRatio = 1 - (time / XP_CONFIG.timeBonus.threshold);
            xp += Math.round(XP_CONFIG.timeBonus.maxBonus * timeRatio);
        }

        if (mistakes === 0) xp += XP_CONFIG.noMistakeBonus;
        if (hintsUsed === 0) xp += XP_CONFIG.noHintBonus;
        if (isDaily) xp += XP_CONFIG.dailyBonus;
        if (isTimeAttack) xp += XP_CONFIG.timeAttackBonus;

        const streakBonus = Math.min(1, streakDays * XP_CONFIG.streakMultiplier);
        xp = Math.round(xp * (1 + streakBonus));

        return xp;
    }

    save() {
        localStorage.setItem('sudoku_stats', JSON.stringify(this.stats));

        // Sync best times to legacy format
        Object.entries(this.stats.bestTimes).forEach(([diff, time]) => {
            if (time) {
                const mins = Math.floor(time / 60);
                const secs = time % 60;
                const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
                localStorage.setItem(`sudoku_best_${diff}`, timeStr);
            }
        });
    }

    recordGame(difficulty, won, time, mistakes, hintsUsed, isDaily = false, isTimeAttack = false) {
        this.stats.gamesPlayed++;
        this.stats.totalTime += time;
        this.stats.totalMistakes += mistakes;
        this.stats.hintsUsed += hintsUsed;
        this.stats.byDifficulty[difficulty].played++;
        this.stats.byDifficulty[difficulty].totalTime += time;

        let xpResult = null;

        if (won) {
            this.stats.gamesWon++;
            this.stats.byDifficulty[difficulty].won++;

            if (mistakes === 0) this.stats.perfectGames++;
            if (hintsUsed === 0) this.stats.noHintGames++;
            if (isTimeAttack) this.stats.timeAttackWins++;

            // Update best time
            if (!this.stats.bestTimes[difficulty] || time < this.stats.bestTimes[difficulty]) {
                this.stats.bestTimes[difficulty] = time;
            }

            // Update streak
            const today = new Date().toDateString();
            const lastWin = this.stats.lastWinDate;

            if (lastWin !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                if (lastWin === yesterday.toDateString()) {
                    this.stats.streakCurrent++;
                } else if (lastWin !== today) {
                    this.stats.streakCurrent = 1;
                }

                if (this.stats.streakCurrent > this.stats.streakBest) {
                    this.stats.streakBest = this.stats.streakCurrent;
                }

                this.stats.lastWinDate = today;
            }

            this.stats.lastPlayedDate = today;

            // Calculate and add XP
            const xpEarned = this.calculateXP(difficulty, time, mistakes, hintsUsed, isDaily, this.stats.streakCurrent, isTimeAttack);
            xpResult = this.addXP(xpEarned);

            if (isDaily) {
                this.stats.dailyChallengesCompleted++;
                this.saveDailyCompletion(time, mistakes, xpEarned);
            }
        } else {
            this.stats.gamesLost++;
        }

        this.save();
        return xpResult;
    }

    saveDailyCompletion(time, mistakes, xp) {
        const dailyData = JSON.parse(localStorage.getItem('sudoku_daily') || '{}');
        const now = new Date();
        const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        dailyData[todayKey] = { time, mistakes, xp, completedAt: now.toISOString() };
        localStorage.setItem('sudoku_daily', JSON.stringify(dailyData));
    }

    isDailyCompleted() {
        const dailyData = JSON.parse(localStorage.getItem('sudoku_daily') || '{}');
        const now = new Date();
        const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        return !!dailyData[todayKey];
    }

    getWinRate() {
        if (this.stats.gamesPlayed === 0) return 0;
        return Math.round((this.stats.gamesWon / this.stats.gamesPlayed) * 100);
    }
}

// ===========================================
// ACHIEVEMENT MANAGER
// ===========================================
class AchievementManager {
    constructor(stats) {
        this.stats = stats;
        this.unlocked = JSON.parse(localStorage.getItem('sudoku_achievements') || '[]');
        this.definitions = [
            { id: 'first_win', icon: '🎯', name: 'First Steps', nametr: 'İlk Adım', check: s => s.gamesWon >= 1 },
            { id: 'ten_wins', icon: '🔟', name: 'Getting Warmed Up', nametr: 'Isınma Turu', check: s => s.gamesWon >= 10 },
            { id: 'fifty_wins', icon: '🏅', name: 'Puzzle Enthusiast', nametr: 'Bulmaca Tutkunu', check: s => s.gamesWon >= 50 },
            { id: 'hundred_wins', icon: '💯', name: 'Century Club', nametr: 'Yüzler Kulübü', check: s => s.gamesWon >= 100 },
            { id: 'easy_master', icon: '🌱', name: 'Easy Master', nametr: 'Kolay Ustası', check: s => (s.byDifficulty?.easy?.won || 0) >= 10 },
            { id: 'medium_master', icon: '🌿', name: 'Medium Master', nametr: 'Orta Ustası', check: s => (s.byDifficulty?.medium?.won || 0) >= 10 },
            { id: 'hard_master', icon: '🔥', name: 'Hard Master', nametr: 'Zor Ustası', check: s => (s.byDifficulty?.hard?.won || 0) >= 10 },
            { id: 'expert_master', icon: '💀', name: 'Expert Master', nametr: 'Uzman Ustası', check: s => (s.byDifficulty?.expert?.won || 0) >= 10 },
            { id: 'streak_3', icon: '🔥', name: 'On Fire', nametr: 'Ateşte', check: s => s.streakBest >= 3 },
            { id: 'streak_7', icon: '🔥', name: 'Week Warrior', nametr: 'Hafta Savaşçısı', check: s => s.streakBest >= 7 },
            { id: 'streak_30', icon: '🔥', name: 'Monthly Master', nametr: 'Aylık Usta', check: s => s.streakBest >= 30 },
            { id: 'perfect_game', icon: '✨', name: 'Flawless', nametr: 'Kusursuz', check: s => s.perfectGames >= 1 },
            { id: 'no_hints', icon: '🧠', name: 'Pure Logic', nametr: 'Saf Mantık', check: s => s.noHintGames >= 1 },
            { id: 'level_5', icon: '⭐', name: 'Rising Star', nametr: 'Yükselen Yıldız', check: s => (s.level || 1) >= 5 },
            { id: 'level_10', icon: '🌟', name: 'Shining Bright', nametr: 'Parlayan Yıldız', check: s => (s.level || 1) >= 10 },
            { id: 'time_attack', icon: '⚡', name: 'Speed Demon', nametr: 'Hız Şeytanı', check: s => s.timeAttackWins >= 1 },
            { id: 'daily_7', icon: '📅', name: 'Weekly Challenger', nametr: 'Haftalık Meydan Okuyucu', check: s => s.dailyChallengesCompleted >= 7 },
            { id: 'daily_30', icon: '📆', name: 'Monthly Challenger', nametr: 'Aylık Meydan Okuyucu', check: s => s.dailyChallengesCompleted >= 30 }
        ];
    }

    check() {
        const newlyUnlocked = [];

        this.definitions.forEach(ach => {
            if (!this.unlocked.includes(ach.id) && ach.check(this.stats.stats)) {
                this.unlocked.push(ach.id);
                newlyUnlocked.push(ach);
            }
        });

        if (newlyUnlocked.length > 0) {
            localStorage.setItem('sudoku_achievements', JSON.stringify(this.unlocked));
        }

        return newlyUnlocked;
    }
}

// ===========================================
// POPUP NUMPAD
// ===========================================
class PopupNumpad {
    constructor(game) {
        this.game = game;
        this.element = null;
        this.visible = false;
        this.currentCell = null;
        this.createElement();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.id = 'popup-numpad';
        this.element.className = 'popup-numpad hidden';
        this.element.innerHTML = `
            <div class="popup-numpad-grid">
                ${[1,2,3,4,5,6,7,8,9].map(n => `
                    <button class="popup-num-btn" data-num="${n}">${n}</button>
                `).join('')}
            </div>
            <div class="popup-numpad-actions">
                <button class="popup-action-btn" data-action="notes">
                    <span class="material-symbols-outlined">edit_note</span>
                </button>
                <button class="popup-action-btn" data-action="erase">
                    <span class="material-symbols-outlined">backspace</span>
                </button>
                <button class="popup-action-btn popup-close-btn" data-action="close">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
        `;
        document.body.appendChild(this.element);
        this.bindEvents();
    }

    bindEvents() {
        this.element.querySelectorAll('.popup-num-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const num = parseInt(btn.dataset.num);
                this.game.placeNumber(num);
                if (!this.game.notesMode) {
                    this.hide();
                }
                this.updateButtons();
            });
        });

        this.element.querySelectorAll('.popup-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                if (action === 'notes') {
                    this.game.toggleNotesMode();
                    this.updateNotesButton();
                } else if (action === 'erase') {
                    this.game.erase();
                    this.hide();
                } else if (action === 'close') {
                    this.hide();
                }
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.visible && !this.element.contains(e.target) && !e.target.closest('.cell')) {
                this.hide();
            }
        });
    }

    show(cellElement, row, col) {
        if (!this.game.settings.get('popupNumpad')) return;

        this.currentCell = { row, col };
        this.visible = true;
        this.element.classList.remove('hidden');

        // Position near the cell
        const cellRect = cellElement.getBoundingClientRect();
        const popupRect = this.element.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let left = cellRect.left + cellRect.width / 2 - popupRect.width / 2;
        let top = cellRect.bottom + 10;

        // Adjust if off-screen
        if (left < 10) left = 10;
        if (left + popupRect.width > viewportWidth - 10) {
            left = viewportWidth - popupRect.width - 10;
        }

        if (top + popupRect.height > viewportHeight - 10) {
            top = cellRect.top - popupRect.height - 10;
        }

        this.element.style.left = `${left}px`;
        this.element.style.top = `${top}px`;

        this.updateButtons();
        this.updateNotesButton();
    }

    hide() {
        this.visible = false;
        this.element.classList.add('hidden');
        this.currentCell = null;
    }

    updateButtons() {
        this.element.querySelectorAll('.popup-num-btn').forEach(btn => {
            const num = parseInt(btn.dataset.num);
            const count = this.game.countNumber(num);
            const isComplete = count >= 9;
            btn.classList.toggle('complete', isComplete);
            btn.disabled = isComplete;
        });
    }

    updateNotesButton() {
        const notesBtn = this.element.querySelector('[data-action="notes"]');
        notesBtn.classList.toggle('active', this.game.notesMode);
    }
}

// ===========================================
// MAIN GAME CLASS
// ===========================================
class SudokuGame {
    constructor() {
        this.grid = Array(9).fill(null).map(() => Array(9).fill(0));
        this.solution = Array(9).fill(null).map(() => Array(9).fill(0));
        this.initialGrid = Array(9).fill(null).map(() => Array(9).fill(0));
        this.notes = Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set()));
        this.selectedCell = null;
        this.history = [];
        this.difficulty = localStorage.getItem('sudoku_difficulty') || 'easy';
        this.gameMode = localStorage.getItem('sudoku_mode') || 'classic';
        this.timer = 0;
        this.timerInterval = null;
        this.isPaused = false;
        this.mistakes = 0;
        this.maxMistakes = this.gameMode === 'zen' ? Infinity : 3;
        this.hintsUsed = 0;
        this.notesMode = false;
        this.seededRandom = null;
        this.timeAttackLimit = 0;
        this.timeRemaining = 0;
        this.isTimeAttack = this.gameMode === 'timeattack';
        this.isLoading = false;

        // Managers
        this.settings = new SettingsManager();
        this.sound = new SoundManager();
        this.haptic = new HapticManager();
        this.stats = new StatsManager();
        this.achievements = new AchievementManager(this.stats);
        this.popupNumpad = null;

        // Apply settings
        this.settings.applyAll();
        this.sound.packName = this.settings.get('soundPack');
        this.sound.enabled = this.settings.get('soundEnabled');
        this.haptic.enabled = this.settings.get('hapticEnabled');
    }

    init() {
        this.popupNumpad = new PopupNumpad(this);
        this.bindKeyboard();
        this.bindAccessibility();
    }

    bindKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (this.isPaused || !this.selectedCell) return;

            const { row, col } = this.selectedCell;

            // Number keys
            if (e.key >= '1' && e.key <= '9') {
                e.preventDefault();
                this.placeNumber(parseInt(e.key));
            }

            // Arrow keys
            if (e.key === 'ArrowUp' && row > 0) {
                e.preventDefault();
                this.selectCell(row - 1, col);
            } else if (e.key === 'ArrowDown' && row < 8) {
                e.preventDefault();
                this.selectCell(row + 1, col);
            } else if (e.key === 'ArrowLeft' && col > 0) {
                e.preventDefault();
                this.selectCell(row, col - 1);
            } else if (e.key === 'ArrowRight' && col < 8) {
                e.preventDefault();
                this.selectCell(row, col + 1);
            }

            // Backspace/Delete
            if (e.key === 'Backspace' || e.key === 'Delete') {
                e.preventDefault();
                this.erase();
            }

            // N for notes toggle
            if (e.key === 'n' || e.key === 'N') {
                e.preventDefault();
                this.toggleNotesMode();
            }

            // Z for undo
            if ((e.key === 'z' || e.key === 'Z') && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.undo();
            }

            // H for hint
            if (e.key === 'h' || e.key === 'H') {
                e.preventDefault();
                this.hint();
            }

            // Space for pause
            if (e.key === ' ') {
                e.preventDefault();
                this.pauseGame();
            }
        });
    }

    bindAccessibility() {
        // Add ARIA attributes to grid
        const grid = document.getElementById('sudoku-grid');
        if (grid) {
            grid.setAttribute('role', 'grid');
            grid.setAttribute('aria-label', 'Sudoku puzzle grid');
        }
    }

    showLoading() {
        this.isLoading = true;
        const loader = document.getElementById('loading-overlay');
        if (loader) loader.classList.remove('hidden');
    }

    hideLoading() {
        this.isLoading = false;
        const loader = document.getElementById('loading-overlay');
        if (loader) loader.classList.add('hidden');
    }

    shuffleSeeded(array, rng) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = rng.nextInt(i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    fillGridSeeded(grid, rng) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    this.shuffleSeeded(numbers, rng);
                    for (let num of numbers) {
                        if (this.isValid(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (this.fillGridSeeded(grid, rng)) return true;
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    generateDailyPuzzle() {
        const seed = getDailySeed();
        this.seededRandom = new SeededRandom(seed);
        this.solution = Array(9).fill(null).map(() => Array(9).fill(0));
        this.fillGridSeeded(this.solution, this.seededRandom);
        this.grid = this.solution.map(row => [...row]);

        const toRemove = CELLS_TO_REMOVE.medium;
        let removed = 0;
        while (removed < toRemove) {
            const row = this.seededRandom.nextInt(9);
            const col = this.seededRandom.nextInt(9);
            if (this.grid[row][col] !== 0) {
                this.grid[row][col] = 0;
                removed++;
            }
        }
        this.initialGrid = this.grid.map(row => [...row]);
    }

    generateSolution() {
        this.solution = Array(9).fill(null).map(() => Array(9).fill(0));
        this.fillGrid(this.solution);
    }

    fillGrid(grid) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    this.shuffle(numbers);
                    for (let num of numbers) {
                        if (this.isValid(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (this.fillGrid(grid)) return true;
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    isValid(grid, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num) return false;
        }
        for (let x = 0; x < 9; x++) {
            if (grid[x][col] === num) return false;
        }
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[boxRow + i][boxCol + j] === num) return false;
            }
        }
        return true;
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    createPuzzle() {
        this.grid = this.solution.map(row => [...row]);
        const toRemove = CELLS_TO_REMOVE[this.difficulty] || 35;
        let removed = 0;

        while (removed < toRemove) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            if (this.grid[row][col] !== 0) {
                this.grid[row][col] = 0;
                removed++;
            }
        }
        this.initialGrid = this.grid.map(row => [...row]);
    }

    newGame() {
        this.showLoading();

        setTimeout(() => {
            if (this.gameMode === 'daily') {
                if (this.stats.isDailyCompleted()) {
                    alert(t('alreadyCompleted'));
                    window.location.href = 'daily.html';
                    return;
                }
                this.generateDailyPuzzle();
                this.difficulty = 'medium';
            } else {
                this.generateSolution();
                this.createPuzzle();
            }

            this.notes = Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set()));
            this.history = [];
            this.timer = 0;
            this.mistakes = 0;
            this.hintsUsed = 0;
            this.isPaused = false;
            this.notesMode = false;
            this.isTimeAttack = this.gameMode === 'timeattack';
            this.maxMistakes = this.gameMode === 'zen' ? Infinity : 3;

            if (this.isTimeAttack) {
                this.timeAttackLimit = TIME_ATTACK_LIMITS[this.difficulty] || 600;
                this.timeRemaining = this.timeAttackLimit;
                this.maxMistakes = Infinity;
            }

            this.startTimer();
            this.render();
            this.updateNotesButton();
            this.updateModeIndicator();
            this.hideLoading();
        }, 100);
    }

    render() {
        const gridElement = document.getElementById('sudoku-grid');
        if (!gridElement) return;

        const highlightSame = this.settings.get('highlightSameNumbers');
        const highlightRCB = this.settings.get('highlightRowColBox');

        // Performance optimization: only update changed cells
        const existingCells = gridElement.querySelectorAll('.cell');
        const needsFullRender = existingCells.length !== 81;

        if (needsFullRender) {
            gridElement.innerHTML = '';
        }

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const index = row * 9 + col;
                let cell;

                if (needsFullRender) {
                    cell = document.createElement('div');
                    cell.className = 'cell';
                    cell.dataset.row = row;
                    cell.dataset.col = col;
                    cell.setAttribute('role', 'gridcell');
                    cell.setAttribute('tabindex', '0');
                    gridElement.appendChild(cell);
                } else {
                    cell = existingCells[index];
                }

                // Reset classes
                cell.className = 'cell';
                cell.innerHTML = '';

                // Highlight logic
                if (this.selectedCell && highlightRCB) {
                    const sameRow = this.selectedCell.row === row;
                    const sameCol = this.selectedCell.col === col;
                    const sameBox = Math.floor(this.selectedCell.row / 3) === Math.floor(row / 3) &&
                                   Math.floor(this.selectedCell.col / 3) === Math.floor(col / 3);

                    if (sameRow || sameCol || sameBox) {
                        cell.classList.add('highlighted');
                    }
                }

                // Selected cell
                if (this.selectedCell && this.selectedCell.row === row && this.selectedCell.col === col) {
                    cell.classList.add('selected');
                }

                const value = this.grid[row][col];
                const notes = this.notes[row][col];

                if (value !== 0) {
                    cell.textContent = value;

                    if (this.initialGrid[row][col] !== 0) {
                        cell.classList.add('given');
                    } else {
                        cell.classList.add('user-entered');
                    }

                    // Highlight same numbers
                    if (highlightSame && this.selectedCell) {
                        const selectedValue = this.grid[this.selectedCell.row][this.selectedCell.col];
                        if (selectedValue === value && selectedValue !== 0) {
                            cell.classList.add('highlight-same');
                        }
                    }
                } else if (notes.size > 0) {
                    const notesDiv = document.createElement('div');
                    notesDiv.className = 'cell-notes';
                    for (let n = 1; n <= 9; n++) {
                        const noteSpan = document.createElement('span');
                        noteSpan.textContent = notes.has(n) ? n : '';
                        notesDiv.appendChild(noteSpan);
                    }
                    cell.appendChild(notesDiv);
                }

                // ARIA
                cell.setAttribute('aria-label', `Row ${row + 1}, Column ${col + 1}, ${value || 'empty'}`);

                // Event listeners (only on full render)
                if (needsFullRender) {
                    cell.addEventListener('click', (e) => {
                        this.selectCell(row, col);
                        if (this.settings.get('popupNumpad') && this.initialGrid[row][col] === 0) {
                            this.popupNumpad.show(cell, row, col);
                        }
                    });
                }
            }
        }

        this.renderNumberPad();
        this.updateDifficultyLabel();
        this.updateMistakes();
    }

    updateMistakes() {
        const el = document.getElementById('mistakes');
        if (!el) return;

        if (this.isTimeAttack) {
            el.innerHTML = `<span class="timeattack-badge">${t('timeAttack')}</span>`;
        } else if (this.gameMode === 'zen') {
            el.innerHTML = `<span class="zen-badge">${t('zenMode')}</span>`;
        } else {
            const maxHearts = this.maxMistakes;
            const remaining = maxHearts - this.mistakes;
            let hearts = '';
            for (let i = 0; i < maxHearts; i++) {
                if (i < remaining) {
                    hearts += '<span class="heart">&#10084;</span>';
                } else {
                    hearts += '<span class="heart empty">&#10084;</span>';
                }
            }
            el.innerHTML = hearts;
            el.className = 'mistake-hearts';
        }
    }

    renderNumberPad() {
        const padElement = document.getElementById('number-pad');
        if (!padElement) return;

        const showRemaining = this.settings.get('showRemainingCount');
        padElement.innerHTML = '';

        for (let num = 1; num <= 9; num++) {
            const button = document.createElement('button');
            const count = this.countNumber(num);
            const remaining = 9 - count;
            const isComplete = remaining <= 0;

            button.className = `numpad-btn ${isComplete ? 'numpad-complete' : ''}`;
            button.textContent = num;
            button.disabled = isComplete;
            button.setAttribute('aria-label', `Number ${num}, ${remaining} remaining`);

            if (!isComplete && showRemaining) {
                button.setAttribute('data-remaining', remaining);
            }

            button.addEventListener('click', () => {
                if (!isComplete) this.placeNumber(num);
            });
            padElement.appendChild(button);
        }
    }

    countNumber(num) {
        let count = 0;
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] === num) count++;
            }
        }
        return count;
    }

    selectCell(row, col) {
        if (this.isPaused) return;
        this.sound.init();
        this.sound.play('tap');
        this.haptic.light();
        this.selectedCell = { row, col };
        this.render();

        // Close popup if selecting a given cell
        if (this.initialGrid[row][col] !== 0 && this.popupNumpad) {
            this.popupNumpad.hide();
        }
    }

    placeNumber(num) {
        if (!this.selectedCell || this.isPaused) return;
        const { row, col } = this.selectedCell;
        if (this.initialGrid[row][col] !== 0) return;

        if (this.notesMode) {
            this.toggleNote(row, col, num);
            return;
        }

        // Save to history
        this.history.push({
            row, col,
            value: this.grid[row][col],
            notes: new Set(this.notes[row][col])
        });

        this.notes[row][col].clear();
        this.grid[row][col] = num;

        if (this.solution[row][col] !== num) {
            this.mistakes++;
            this.showError(row, col);
            this.sound.play('error');
            this.haptic.error();

            if (this.mistakes >= this.maxMistakes) {
                this.gameOver(false);
                return;
            }
        } else {
            this.sound.play('place');
            this.haptic.medium();
            this.showCorrectAnimation(row, col);

            if (this.settings.get('autoRemoveNotes')) {
                this.removeNotesForNumber(row, col, num);
            }

            this.checkCompletions(row, col);
        }

        this.render();
        this.checkWin();
        this.saveGame();
    }

    toggleNote(row, col, num) {
        if (this.grid[row][col] !== 0) return;

        this.history.push({
            row, col,
            value: this.grid[row][col],
            notes: new Set(this.notes[row][col])
        });

        if (this.notes[row][col].has(num)) {
            this.notes[row][col].delete(num);
        } else {
            this.notes[row][col].add(num);
        }

        this.sound.play('tap');
        this.haptic.light();
        this.render();
        this.saveGame();
    }

    removeNotesForNumber(row, col, num) {
        for (let c = 0; c < 9; c++) this.notes[row][c].delete(num);
        for (let r = 0; r < 9; r++) this.notes[r][col].delete(num);
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                this.notes[r][c].delete(num);
            }
        }
    }

    checkCompletions(row, col) {
        if (this.isRowComplete(row)) {
            this.animateRowComplete(row);
            this.sound.play('rowComplete');
        }
        if (this.isColComplete(col)) {
            this.animateColComplete(col);
            this.sound.play('rowComplete');
        }
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        if (this.isBoxComplete(boxRow, boxCol)) {
            this.animateBoxComplete(boxRow, boxCol);
            this.sound.play('rowComplete');
        }
    }

    isRowComplete(row) {
        for (let col = 0; col < 9; col++) {
            if (this.grid[row][col] !== this.solution[row][col]) return false;
        }
        return true;
    }

    isColComplete(col) {
        for (let row = 0; row < 9; row++) {
            if (this.grid[row][col] !== this.solution[row][col]) return false;
        }
        return true;
    }

    isBoxComplete(boxRow, boxCol) {
        for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                if (this.grid[r][c] !== this.solution[r][c]) return false;
            }
        }
        return true;
    }

    animateRowComplete(row) {
        const cells = document.querySelectorAll('.cell');
        for (let col = 0; col < 9; col++) {
            const index = row * 9 + col;
            setTimeout(() => {
                cells[index]?.classList.add('row-complete-anim');
                setTimeout(() => cells[index]?.classList.remove('row-complete-anim'), 500);
            }, col * 30);
        }
    }

    animateColComplete(col) {
        const cells = document.querySelectorAll('.cell');
        for (let row = 0; row < 9; row++) {
            const index = row * 9 + col;
            setTimeout(() => {
                cells[index]?.classList.add('row-complete-anim');
                setTimeout(() => cells[index]?.classList.remove('row-complete-anim'), 500);
            }, row * 30);
        }
    }

    animateBoxComplete(boxRow, boxCol) {
        const cells = document.querySelectorAll('.cell');
        let delay = 0;
        for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                const index = r * 9 + c;
                setTimeout(() => {
                    cells[index]?.classList.add('row-complete-anim');
                    setTimeout(() => cells[index]?.classList.remove('row-complete-anim'), 500);
                }, delay * 30);
                delay++;
            }
        }
    }

    showCorrectAnimation(row, col) {
        const cells = document.querySelectorAll('.cell');
        const index = row * 9 + col;
        cells[index]?.classList.add('number-pop');
        setTimeout(() => cells[index]?.classList.remove('number-pop'), 250);
    }

    showError(row, col) {
        const cells = document.querySelectorAll('.cell');
        const index = row * 9 + col;
        cells[index]?.classList.add('error');
        setTimeout(() => cells[index]?.classList.remove('error'), 300);
    }

    erase() {
        if (!this.selectedCell || this.isPaused) return;
        const { row, col } = this.selectedCell;
        if (this.initialGrid[row][col] !== 0) return;

        this.history.push({
            row, col,
            value: this.grid[row][col],
            notes: new Set(this.notes[row][col])
        });

        this.grid[row][col] = 0;
        this.notes[row][col].clear();
        this.sound.play('tap');
        this.haptic.light();
        this.render();
        this.saveGame();
    }

    undo() {
        if (this.history.length === 0 || this.isPaused) return;
        const lastMove = this.history.pop();
        this.grid[lastMove.row][lastMove.col] = lastMove.value;
        this.notes[lastMove.row][lastMove.col] = lastMove.notes;
        this.sound.play('tap');
        this.haptic.light();
        this.render();
        this.saveGame();
    }

    hint() {
        if (!this.selectedCell || this.isPaused) return;
        const { row, col } = this.selectedCell;
        if (this.grid[row][col] !== 0) return;

        this.history.push({
            row, col,
            value: this.grid[row][col],
            notes: new Set(this.notes[row][col])
        });

        this.grid[row][col] = this.solution[row][col];
        this.notes[row][col].clear();
        this.hintsUsed++;

        if (this.settings.get('autoRemoveNotes')) {
            this.removeNotesForNumber(row, col, this.solution[row][col]);
        }

        this.sound.play('correct');
        this.haptic.success();
        this.showCorrectAnimation(row, col);
        this.checkCompletions(row, col);
        this.render();
        this.checkWin();
        this.saveGame();
    }

    toggleNotesMode() {
        this.notesMode = !this.notesMode;
        this.updateNotesButton();
        this.sound.play('tap');
        this.haptic.light();
    }

    updateNotesButton() {
        const btn = document.getElementById('notes-btn');
        if (btn) {
            btn.classList.toggle('notes-active', this.notesMode);
        }
    }

    checkWin() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] !== this.solution[row][col]) return false;
            }
        }
        this.gameOver(true);
        return true;
    }

    gameOver(won, timeRanOut = false) {
        this.stopTimer();
        const timeStr = this.formatTime(this.timer);
        const isDaily = this.gameMode === 'daily';

        const xpResult = this.stats.recordGame(
            this.difficulty, won, this.timer,
            this.mistakes, this.hintsUsed, isDaily, this.isTimeAttack
        );

        if (won) {
            this.sound.play('complete');
            this.haptic.success();
            this.showConfetti();

            // Check achievements
            const newAchievements = this.achievements.check();
            if (newAchievements.length > 0) {
                setTimeout(() => {
                    newAchievements.forEach((ach, i) => {
                        setTimeout(() => this.showAchievementNotification(ach), i * 1500);
                    });
                }, 1000);
            }

            setTimeout(() => showModal(true, timeStr, this.mistakes, this.hintsUsed, this.stats, xpResult, isDaily, this.isTimeAttack), 500);
        } else {
            setTimeout(() => showModal(false, timeStr, this.mistakes, this.hintsUsed, this.stats, null, isDaily, this.isTimeAttack, timeRanOut), 300);
        }

        localStorage.removeItem('sudoku_current_game');

        if (isDaily || this.isTimeAttack) {
            localStorage.setItem('sudoku_mode', 'classic');
        }
    }

    showAchievementNotification(achievement) {
        const lang = getLang();
        const name = lang === 'tr' ? achievement.nametr : achievement.name;

        this.sound.play('achievement');
        this.haptic.achievement();

        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-content">
                <div class="achievement-title">${t('achievementUnlocked')}</div>
                <div class="achievement-name">${name}</div>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showConfetti() {
        const container = document.getElementById('confetti-container');
        if (!container) return;

        const colors = ['#5BB5C5', '#6EE7B7', '#A78BFA', '#FCD34D', '#F9A8D4', '#93C5FD'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (2.5 + Math.random() * 1.5) + 's';
            confetti.style.opacity = 0.8 + Math.random() * 0.2;
            container.appendChild(confetti);
            setTimeout(() => confetti.remove(), 4000);
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (!this.isPaused) {
                if (this.isTimeAttack) {
                    this.timeRemaining--;
                    this.timer++;

                    if (this.timeRemaining <= 0) {
                        this.timeRemaining = 0;
                        this.gameOver(false, true);
                        return;
                    }

                    if (this.timeRemaining === 60) {
                        this.sound.play('error');
                        this.haptic.heavy();
                    } else if (this.timeRemaining <= 10) {
                        this.haptic.light();
                    }
                } else {
                    this.timer++;
                }
                this.updateTimer();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
    }

    updateTimer() {
        const el = document.getElementById('timer');
        if (!el) return;

        if (this.isTimeAttack) {
            el.textContent = this.formatTime(this.timeRemaining);
            if (this.timeRemaining <= 60) {
                el.classList.add('text-red-500', 'animate-pulse');
            } else if (this.timeRemaining <= 120) {
                el.classList.add('text-amber-500');
                el.classList.remove('text-red-500', 'animate-pulse');
            } else {
                el.classList.remove('text-red-500', 'text-amber-500', 'animate-pulse');
            }
        } else {
            el.textContent = this.formatTime(this.timer);
        }
    }

    updateModeIndicator() {
        this.updateMistakes();
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    pauseGame() {
        this.isPaused = !this.isPaused;
        const icon = document.getElementById('pause-icon');
        if (icon) icon.textContent = this.isPaused ? 'play_arrow' : 'pause';

        const grid = document.getElementById('sudoku-grid');
        if (grid) grid.style.filter = this.isPaused ? 'blur(8px)' : 'none';

        if (this.popupNumpad) this.popupNumpad.hide();
        this.sound.play('tap');
    }

    updateDifficultyLabel() {
        const lang = getLang();
        const labels = {
            en: { easy: 'Easy', medium: 'Medium', hard: 'Hard', expert: 'Expert' },
            tr: { easy: 'Kolay', medium: 'Orta', hard: 'Zor', expert: 'Uzman' }
        };
        const label = labels[lang]?.[this.difficulty] || this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1);
        const el = document.getElementById('difficulty-label');
        if (el) el.textContent = label;
    }

    saveGame() {
        const gameState = {
            grid: this.grid,
            solution: this.solution,
            initialGrid: this.initialGrid,
            notes: this.notes.map(row => row.map(set => Array.from(set))),
            difficulty: this.difficulty,
            gameMode: this.gameMode,
            timer: this.timer,
            history: this.history.map(h => ({...h, notes: Array.from(h.notes)})),
            mistakes: this.mistakes,
            hintsUsed: this.hintsUsed,
            notesMode: this.notesMode,
            isTimeAttack: this.isTimeAttack,
            timeAttackLimit: this.timeAttackLimit,
            timeRemaining: this.timeRemaining
        };
        localStorage.setItem('sudoku_current_game', JSON.stringify(gameState));
    }

    loadGame() {
        const saved = localStorage.getItem('sudoku_current_game');
        if (!saved) return false;

        try {
            const gs = JSON.parse(saved);

            // Validate data
            if (!gs.grid || !gs.solution || gs.grid.length !== 9) {
                localStorage.removeItem('sudoku_current_game');
                return false;
            }

            this.grid = gs.grid;
            this.solution = gs.solution;
            this.initialGrid = gs.initialGrid;
            this.notes = gs.notes ? gs.notes.map(row => row.map(arr => new Set(arr))) :
                         Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set()));
            this.difficulty = gs.difficulty;
            this.gameMode = gs.gameMode || 'classic';
            this.timer = gs.timer;
            this.history = gs.history ? gs.history.map(h => ({...h, notes: new Set(h.notes)})) : [];
            this.mistakes = gs.mistakes || 0;
            this.hintsUsed = gs.hintsUsed || 0;
            this.notesMode = gs.notesMode || false;
            this.isTimeAttack = gs.isTimeAttack || false;
            this.timeAttackLimit = gs.timeAttackLimit || 0;
            this.timeRemaining = gs.timeRemaining || 0;
            this.maxMistakes = this.gameMode === 'zen' || this.isTimeAttack ? Infinity : 3;

            this.startTimer();
            this.render();
            this.updateNotesButton();
            this.updateModeIndicator();
            return true;
        } catch (e) {
            localStorage.removeItem('sudoku_current_game');
            return false;
        }
    }

    generateShareText() {
        const lang = getLang();
        const diffLabel = lang === 'tr'
            ? { easy: 'Kolay', medium: 'Orta', hard: 'Zor', expert: 'Uzman' }[this.difficulty]
            : this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1);

        const timeStr = this.formatTime(this.timer);
        const hearts = '❤️'.repeat(Math.max(0, 3 - this.mistakes)) + '🖤'.repeat(this.mistakes);

        return `🎯 Sudoku Play\n📊 ${diffLabel}\n⏱️ ${timeStr}\n${hearts}\n\n🔗 sudoku.ceylan.world`;
    }

    async share() {
        const text = this.generateShareText();

        if (navigator.share) {
            try {
                await navigator.share({ text });
            } catch (e) {
                this.copyToClipboard(text);
            }
        } else {
            this.copyToClipboard(text);
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast(t('copied'));
        });
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
}

// ===========================================
// GLOBAL INSTANCE & FUNCTIONS
// ===========================================
let game;

// Initialize on page load
if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
}

window.addEventListener('DOMContentLoaded', () => {
    game = new SudokuGame();
    game.init();

    if (!game.loadGame()) {
        game.newGame();
    }
});

// Global functions
function pauseGame() { game?.pauseGame(); }
function undo() { game?.undo(); }
function erase() { game?.erase(); }
function hint() { game?.hint(); }
function toggleNotes() { game?.toggleNotesMode(); }
function shareGame() { game?.share(); }

// Visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden && game && !game.isPaused) {
        game.pauseGame();
    }
});

// Modal functions
function showModal(won, time, mistakes, hints, stats, xpResult, isDaily, isTimeAttack = false, timeRanOut = false) {
    const modal = document.getElementById('modal');
    const icon = document.getElementById('modal-icon');
    const title = document.getElementById('modal-title');
    const message = document.getElementById('modal-message');
    const timeEl = document.getElementById('modal-time');
    const mistakesEl = document.getElementById('modal-mistakes');
    const statsDiv = document.getElementById('modal-stats');

    // Clear previous dynamic stats
    statsDiv.querySelectorAll('.dynamic-stat').forEach(el => el.remove());

    if (won) {
        if (isTimeAttack) {
            icon.textContent = '⚡';
            title.textContent = t('timeAttackComplete');
        } else if (isDaily) {
            icon.textContent = '🏆';
            title.textContent = t('dailyComplete');
        } else {
            icon.textContent = '🎉';
            title.textContent = t('congratulations');
        }

        let msg = isTimeAttack ? t('youBeatClock') : t('youSolvedPuzzle');

        if (stats && stats.stats.streakCurrent > 0) {
            msg += ` 🔥 ${stats.stats.streakCurrent} ${t('dayStreak')}`;
        }

        message.textContent = msg;

        if (xpResult) {
            const xpDiv = document.createElement('div');
            xpDiv.className = 'text-center dynamic-stat';
            xpDiv.innerHTML = `
                <div class="text-2xl font-bold text-green-500">+${xpResult.xpGained}</div>
                <div class="text-xs text-gray-500">${t('xp')}</div>
            `;
            statsDiv.appendChild(xpDiv);

            if (xpResult.levelUp) {
                const levelDiv = document.createElement('div');
                levelDiv.className = 'col-span-full mt-2 p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-bold dynamic-stat';
                levelDiv.textContent = `🎉 ${t('levelUp')} ${xpResult.newLevel}`;
                statsDiv.appendChild(levelDiv);
            }
        }

        // Add share button
        const shareDiv = document.createElement('div');
        shareDiv.className = 'col-span-full mt-2 dynamic-stat';
        shareDiv.innerHTML = `
            <button onclick="shareGame()" class="w-full py-2 bg-primary/20 text-primary font-medium rounded-lg flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-lg">share</span>
                ${t('share')}
            </button>
        `;
        statsDiv.appendChild(shareDiv);
    } else {
        if (isTimeAttack && timeRanOut) {
            icon.textContent = '⏰';
            title.textContent = t('timeUp');
            message.textContent = t('ranOutOfTime');
        } else {
            icon.textContent = '😔';
            title.textContent = t('gameOver');
            message.textContent = t('tooManyMistakes');
        }
    }

    timeEl.textContent = time;
    mistakesEl.textContent = mistakes;

    if (hints > 0) {
        const existingHints = statsDiv.querySelector('.hints-stat');
        if (!existingHints) {
            const newHintsDiv = document.createElement('div');
            newHintsDiv.className = 'text-center hints-stat dynamic-stat';
            newHintsDiv.innerHTML = `
                <div class="text-2xl font-bold text-amber-500">${hints}</div>
                <div class="text-xs text-gray-500">${t('hints')}</div>
            `;
            statsDiv.appendChild(newHintsDiv);
        }
    }

    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    const mode = localStorage.getItem('sudoku_mode');
    if (mode === 'daily') {
        window.location.href = 'daily.html';
    } else {
        window.location.href = 'difficulty.html';
    }
}
