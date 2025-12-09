// Sudoku Game Logic
class SudokuGame {
    constructor() {
        this.grid = Array(9).fill(null).map(() => Array(9).fill(0));
        this.solution = Array(9).fill(null).map(() => Array(9).fill(0));
        this.initialGrid = Array(9).fill(null).map(() => Array(9).fill(0));
        this.selectedCell = null;
        this.history = [];
        this.difficulty = localStorage.getItem('sudoku_difficulty') || 'easy';
        this.timer = 0;
        this.timerInterval = null;
        this.isPaused = false;
        this.mistakes = 0;
        this.maxMistakes = 3;
    }

    // Generate a complete valid Sudoku solution
    generateSolution() {
        this.solution = Array(9).fill(null).map(() => Array(9).fill(0));
        this.fillGrid(this.solution);
    }

    // Fill grid with valid numbers
    fillGrid(grid) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    this.shuffle(numbers);
                    for (let num of numbers) {
                        if (this.isValid(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (this.fillGrid(grid)) {
                                return true;
                            }
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    // Check if number is valid in position
    isValid(grid, row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num) return false;
        }

        // Check column
        for (let x = 0; x < 9; x++) {
            if (grid[x][col] === num) return false;
        }

        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[boxRow + i][boxCol + j] === num) return false;
            }
        }

        return true;
    }

    // Shuffle array
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Remove numbers based on difficulty
    createPuzzle() {
        this.grid = this.solution.map(row => [...row]);

        const cellsToRemove = {
            'easy': 35,
            'medium': 45,
            'hard': 52,
            'expert': 58
        };

        const toRemove = cellsToRemove[this.difficulty] || 35;
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

    // Initialize new game
    newGame() {
        this.generateSolution();
        this.createPuzzle();
        this.history = [];
        this.timer = 0;
        this.mistakes = 0;
        this.isPaused = false;
        this.startTimer();
        this.render();
    }

    // Render the game board
    render() {
        const gridElement = document.getElementById('sudoku-grid');
        gridElement.innerHTML = '';
        const isDark = document.documentElement.classList.contains('dark');

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell flex items-center justify-center font-bold text-base sm:text-lg';
                cell.style.backgroundColor = isDark ? '#1a2c2e' : '#ffffff';
                cell.style.color = isDark ? '#e3f8fa' : '#102022';
                cell.dataset.row = row;
                cell.dataset.col = col;

                // Highlight same row/col
                if (this.selectedCell && (this.selectedCell.row === row || this.selectedCell.col === col)) {
                    cell.classList.add('bg-cell-highlight-light', 'dark:bg-cell-highlight-dark');
                }

                // Selected cell
                if (this.selectedCell && this.selectedCell.row === row && this.selectedCell.col === col) {
                    cell.classList.add('selected', 'bg-cell-selected-light', 'dark:bg-cell-selected-dark');
                }

                const value = this.grid[row][col];
                if (value !== 0) {
                    cell.textContent = value;

                    // Initial numbers (not editable)
                    if (this.initialGrid[row][col] !== 0) {
                        cell.style.color = isDark ? '#e3f8fa' : '#102022';
                    } else {
                        // User-entered numbers
                        cell.style.color = isDark ? '#409cff' : '#007AFF';
                    }

                    // Highlight same numbers
                    if (this.selectedCell && this.grid[this.selectedCell.row][this.selectedCell.col] === value && value !== 0) {
                        cell.classList.add('highlight-same');
                    }
                }

                cell.addEventListener('click', () => this.selectCell(row, col));
                gridElement.appendChild(cell);
            }
        }

        this.renderNumberPad();
        this.updateDifficultyLabel();
    }

    // Render number pad
    renderNumberPad() {
        const padElement = document.getElementById('number-pad');
        padElement.innerHTML = '';

        for (let num = 1; num <= 9; num++) {
            const button = document.createElement('button');

            // Count remaining uses of this number
            const count = this.countNumber(num);
            const isComplete = count >= 9;

            if (isComplete) {
                button.className = 'aspect-square flex items-center justify-center bg-primary/20 dark:bg-primary/20 text-primary dark:text-primary rounded-lg text-xl sm:text-2xl font-bold shadow-sm dark:shadow-md dark:shadow-black/20 transition-transform active:scale-95 opacity-50';
            } else {
                button.className = 'aspect-square flex items-center justify-center bg-cell-bg-light dark:bg-cell-bg-dark text-text-light dark:text-text-dark rounded-lg text-xl sm:text-2xl font-bold shadow-md dark:shadow-lg dark:shadow-black/25 transition-transform active:scale-95';
            }

            button.textContent = num;
            button.addEventListener('click', () => this.placeNumber(num));
            padElement.appendChild(button);
        }
    }

    // Count occurrences of a number
    countNumber(num) {
        let count = 0;
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] === num) count++;
            }
        }
        return count;
    }

    // Select a cell
    selectCell(row, col) {
        if (this.isPaused) return;

        this.selectedCell = { row, col };
        this.render();
    }

    // Place number in selected cell
    placeNumber(num) {
        if (!this.selectedCell || this.isPaused) return;

        const { row, col } = this.selectedCell;

        // Can't modify initial cells
        if (this.initialGrid[row][col] !== 0) return;

        // Save to history for undo
        this.history.push({
            row,
            col,
            value: this.grid[row][col]
        });

        this.grid[row][col] = num;

        // Check if correct
        if (this.solution[row][col] !== num) {
            this.mistakes++;
            this.showError(row, col);

            if (this.mistakes >= this.maxMistakes) {
                this.gameOver(false);
                return;
            }
        }

        this.render();
        this.checkWin();
        this.saveGame();
    }

    // Show error animation
    showError(row, col) {
        const cells = document.querySelectorAll('.cell');
        const index = row * 9 + col;
        cells[index].classList.add('error');
        setTimeout(() => {
            cells[index].classList.remove('error');
        }, 300);
    }

    // Erase selected cell
    erase() {
        if (!this.selectedCell || this.isPaused) return;

        const { row, col } = this.selectedCell;

        // Can't modify initial cells
        if (this.initialGrid[row][col] !== 0) return;

        this.history.push({
            row,
            col,
            value: this.grid[row][col]
        });

        this.grid[row][col] = 0;
        this.render();
        this.saveGame();
    }

    // Undo last move
    undo() {
        if (this.history.length === 0 || this.isPaused) return;

        const lastMove = this.history.pop();
        this.grid[lastMove.row][lastMove.col] = lastMove.value;
        this.render();
        this.saveGame();
    }

    // Provide hint
    hint() {
        if (!this.selectedCell || this.isPaused) return;

        const { row, col } = this.selectedCell;

        // Can't hint on filled cells
        if (this.grid[row][col] !== 0) return;

        this.history.push({
            row,
            col,
            value: this.grid[row][col]
        });

        this.grid[row][col] = this.solution[row][col];
        this.render();
        this.saveGame();
    }

    // Check if puzzle is solved
    checkWin() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] !== this.solution[row][col]) {
                    return false;
                }
            }
        }
        this.gameOver(true);
        return true;
    }

    // Game over
    gameOver(won) {
        this.stopTimer();

        if (won) {
            const timeStr = this.formatTime(this.timer);

            // Save best time
            const bestTimeKey = `sudoku_best_${this.difficulty}`;
            const currentBest = localStorage.getItem(bestTimeKey);

            if (!currentBest || this.timer < this.parseTime(currentBest)) {
                localStorage.setItem(bestTimeKey, timeStr);
            }

            setTimeout(() => {
                alert(`🎉 Congratulations! You solved the puzzle in ${timeStr}!`);
                window.location.href = 'difficulty.html';
            }, 500);
        } else {
            alert('😔 Game Over! Too many mistakes. Try again!');
            window.location.href = 'difficulty.html';
        }

        localStorage.removeItem('sudoku_current_game');
    }

    // Timer functions
    startTimer() {
        this.timerInterval = setInterval(() => {
            if (!this.isPaused) {
                this.timer++;
                this.updateTimer();
                this.saveGame();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    updateTimer() {
        document.getElementById('timer').textContent = this.formatTime(this.timer);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    parseTime(timeStr) {
        const [mins, secs] = timeStr.split(':').map(Number);
        return mins * 60 + secs;
    }

    // Pause/Resume game
    pauseGame() {
        this.isPaused = !this.isPaused;
        const icon = document.getElementById('pause-icon');
        icon.textContent = this.isPaused ? 'play_arrow' : 'pause';

        if (this.isPaused) {
            document.getElementById('sudoku-grid').style.filter = 'blur(8px)';
        } else {
            document.getElementById('sudoku-grid').style.filter = 'none';
        }
    }

    updateDifficultyLabel() {
        const label = this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1);
        document.getElementById('difficulty-label').textContent = label;
    }

    // Save game state
    saveGame() {
        const gameState = {
            grid: this.grid,
            solution: this.solution,
            initialGrid: this.initialGrid,
            difficulty: this.difficulty,
            timer: this.timer,
            history: this.history,
            mistakes: this.mistakes
        };
        localStorage.setItem('sudoku_current_game', JSON.stringify(gameState));
    }

    // Load saved game
    loadGame() {
        const saved = localStorage.getItem('sudoku_current_game');
        if (saved) {
            const gameState = JSON.parse(saved);
            this.grid = gameState.grid;
            this.solution = gameState.solution;
            this.initialGrid = gameState.initialGrid;
            this.difficulty = gameState.difficulty;
            this.timer = gameState.timer;
            this.history = gameState.history || [];
            this.mistakes = gameState.mistakes || 0;
            this.startTimer();
            this.render();
            return true;
        }
        return false;
    }
}

// Initialize game
let game;

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
}

// Start game when page loads
window.addEventListener('DOMContentLoaded', () => {
    game = new SudokuGame();

    // Try to load saved game, otherwise start new
    if (!game.loadGame()) {
        game.newGame();
    }
});

// Global functions for buttons
function pauseGame() {
    game.pauseGame();
}

function undo() {
    game.undo();
}

function erase() {
    game.erase();
}

function hint() {
    game.hint();
}

// Handle page visibility (pause when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden && game && !game.isPaused) {
        game.pauseGame();
    }
});
