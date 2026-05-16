// 全局状态
let gameState = {
    targetWord: '',
    currentLetterIndex: 0,
    currentSubLevel: 0,
    level3Position: 0,
    level3Completed: 0,
    selectedSlotIndex: null,
    letterColors: [],
    colors: ['blue', 'yellow', 'pink']
};

const els = {
    wordInput: document.getElementById('wordInputZh'),
    charCount: document.getElementById('charCountZh'),
    inputError: document.getElementById('inputErrorZh'),
    startLevel2Btn: document.getElementById('startLevel2BtnZh'),
    currentLetterBig: document.getElementById('currentLetterBigZh'),
    letterProgress: document.getElementById('letterProgressZh'),
    brailleDemo: document.getElementById('brailleDemoZh'),
    toggleDemoBtn: document.getElementById('toggleDemoBtnZh'),
    brailleInput: document.getElementById('brailleInputZh'),
    level2Feedback: document.getElementById('level2FeedbackZh'),
    checkLevel2Btn: document.getElementById('checkLevel2BtnZh'),
    targetWord: document.getElementById('targetWordZh'),
    letterSlots: document.getElementById('letterSlotsZh'),
    currentPosition: document.getElementById('currentPositionZh'),
    level3BrailleInput: document.getElementById('level3BrailleInputZh'),
    level3Feedback: document.getElementById('level3FeedbackZh'),
    checkLevel3Btn: document.getElementById('checkLevel3BtnZh'),
    level4Word: document.getElementById('level4WordZh'),
    customizationSlots: document.getElementById('customizationSlotsZh'),
    previewSlots: document.getElementById('previewSlotsZh'),
    confirmColorsBtn: document.getElementById('confirmColorsBtnZh'),
    loading: document.getElementById('loading-zh'),
    finalPreview: document.getElementById('finalPreviewZh'),
    restartBtn: document.getElementById('restartBtnZh'),
    final: document.getElementById('final-zh'),
    level1: document.getElementById('level1-zh'),
    level2: document.getElementById('level2-zh'),
    level3: document.getElementById('level3-zh'),
    level4: document.getElementById('level4-zh')
};

const messages = {
    lettersOnly: '请输入纯英文字母',
    max5Letters: '最多输入5个字母',
    invalidLetter: '字母 "${char}" 无效',
    correct: '正确！',
    incorrect: '不正确，请重试！'
};

function hideAllSections() {
    document.querySelectorAll('.level-section').forEach(section => {
        section.classList.remove('active');
    });
}

function init() {
    initLevel1();
}

function initLevel1() {
    els.wordInput.value = '';
    els.charCount.textContent = '0/5';
    els.inputError.textContent = '';
    els.startLevel2Btn.disabled = true;
    
    els.wordInput.addEventListener('input', handleWordInput);
    els.startLevel2Btn.addEventListener('click', startLevel2);
}

function handleWordInput() {
    const value = els.wordInput.value.trim();
    els.charCount.textContent = `${value.length}/5`;
    els.inputError.textContent = '';
    els.startLevel2Btn.disabled = true;
    
    if (value.length === 0) {
        return;
    }
    
    if (!/^[a-zA-Z]+$/.test(value)) {
        els.inputError.textContent = messages.lettersOnly;
        return;
    }
    
    if (value.length > 5) {
        els.inputError.textContent = messages.max5Letters;
        return;
    }
    
    for (let char of value) {
        if (!isValidLetter(char)) {
            els.inputError.textContent = messages.invalidLetter.replace('${char}', char);
            return;
        }
    }
    
    els.startLevel2Btn.disabled = false;
    gameState.targetWord = value.toLowerCase();
}

function startLevel2() {
    gameState.currentLetterIndex = 0;
    gameState.currentSubLevel = 0;
    
    switchLevel('level2');
    updateLevel2Progress();
    setupCurrentLetter();
    
    els.toggleDemoBtn.addEventListener('click', toggleDemoVisibility);
    els.checkLevel2Btn.addEventListener('click', checkLevel2Answer);
    
    const level2Dots = els.brailleInput.querySelectorAll('.dot.clickable');
    level2Dots.forEach(dot => {
        dot.addEventListener('click', () => toggleDot(dot));
    });
}

function updateLevel2Progress() {
    const totalLetters = gameState.targetWord.length;
    const currentLetter = gameState.targetWord[gameState.currentLetterIndex];
    
    els.currentLetterBig.textContent = currentLetter.toUpperCase();
    els.letterProgress.textContent = `${gameState.currentLetterIndex + 1}/${totalLetters}`;
}

function setupCurrentLetter() {
    const letter = gameState.targetWord[gameState.currentLetterIndex];
    const brailleInfo = getBrailleInfo(letter);
    
    els.level2Feedback.textContent = '';
    els.level2Feedback.className = 'feedback-message';
    
    resetMatrix(els.brailleInput);
    
    const demoDots = els.brailleDemo.querySelectorAll('.dot');
    demoDots.forEach(dot => {
        const dotNum = parseInt(dot.dataset.dot);
        if (brailleInfo.dots.includes(dotNum)) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    const subLevel = gameState.currentSubLevel;
    els.brailleDemo.classList.remove('covered');
    els.toggleDemoBtn.style.display = 'none';
    
    if (subLevel === 0) {
        els.brailleDemo.classList.remove('covered');
    } else if (subLevel === 1) {
        els.brailleDemo.classList.add('covered');
        els.toggleDemoBtn.style.display = 'block';
    } else if (subLevel === 2) {
        els.brailleDemo.classList.add('covered');
    }
}

function toggleDemoVisibility() {
    els.brailleDemo.classList.toggle('covered');
}

function toggleDot(dotElement) {
    dotElement.classList.toggle('active');
}

function resetMatrix(container) {
    container.querySelectorAll('.dot.clickable').forEach(dot => {
        dot.classList.remove('active');
    });
}

function getSelectedDots(container) {
    const dots = container.querySelectorAll('.dot.clickable.active');
    const selected = [];
    dots.forEach(dot => {
        selected.push(parseInt(dot.dataset.dot));
    });
    return selected.sort((a, b) => a - b);
}

function checkLevel2Answer() {
    const letter = gameState.targetWord[gameState.currentLetterIndex];
    const brailleInfo = getBrailleInfo(letter);
    const userDots = getSelectedDots(els.brailleInput);
    const correctDots = [...brailleInfo.dots].sort((a, b) => a - b);
    
    if (compareBrailleDots(userDots, correctDots)) {
        els.level2Feedback.textContent = '太棒了！✨';
        els.level2Feedback.className = 'feedback-message success';
        
        const matrix = els.brailleInput.querySelector('.matrix-cell');
        matrix.classList.add('success-animation');
        setTimeout(() => matrix.classList.remove('success-animation'), 800);
        
        const stars = ['⭐', '🌟', '💫', '✨', '🎉'];
        for (let i = 0; i < 5; i++) {
            createSuccessStars(stars[Math.floor(Math.random() * stars.length)], i);
        }
        
        setTimeout(() => {
            if (gameState.currentSubLevel < 2) {
                gameState.currentSubLevel++;
                updateLevel2Progress();
                setupCurrentLetter();
            } else {
                gameState.currentSubLevel = 0;
                if (gameState.currentLetterIndex < gameState.targetWord.length - 1) {
                    gameState.currentLetterIndex++;
                    updateLevel2Progress();
                    setupCurrentLetter();
                } else {
                    startLevel3();
                }
            }
        }, 1500);
    } else {
        els.level2Feedback.textContent = '再试一次！💪';
        els.level2Feedback.className = 'feedback-message error';
    }
}

function createSuccessStars(emoji, index) {
    const star = document.createElement('div');
    star.className = 'success-stars';
    star.textContent = emoji;
    star.style.top = (40 + Math.random() * 20) + '%';
    star.style.left = (30 + index * 10) + '%';
    star.style.animationDelay = (index * 0.1) + 's';
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 1200);
}

function startLevel3() {
    gameState.level3Position = 0;
    gameState.level3Completed = 0;
    
    els.targetWord.textContent = gameState.targetWord.toUpperCase();
    els.currentPosition.textContent = '1';
    els.level3Feedback.textContent = '';
    els.level3Feedback.className = 'feedback-message';
    
    resetMatrix(els.level3BrailleInput);
    createLetterSlots();
    
    switchLevel('level3');
    
    els.checkLevel3Btn.addEventListener('click', checkLevel3Answer);
    
    const level3Dots = els.level3BrailleInput.querySelectorAll('.dot.clickable');
    level3Dots.forEach(dot => {
        dot.addEventListener('click', () => toggleDot(dot));
    });
}

function createLetterSlots() {
    els.letterSlots.innerHTML = '';
    
    for (let i = 0; i < gameState.targetWord.length; i++) {
        const letter = gameState.targetWord[i];
        const slot = document.createElement('div');
        slot.className = 'letter-slot';
        slot.dataset.index = i;
        
        const front = document.createElement('div');
        front.className = 'front';
        const slotNum = document.createElement('div');
        slotNum.className = 'slot-number';
        slotNum.textContent = i + 1;
        front.appendChild(slotNum);
        
        const back = document.createElement('div');
        back.className = 'back';
        const letterLabel = document.createElement('div');
        letterLabel.className = 'letter-label';
        letterLabel.textContent = letter.toUpperCase();
        
        const brailleInfo = getBrailleInfo(letter);
        const smallMatrix = document.createElement('div');
        smallMatrix.className = 'small-matrix';
        
        const col1 = document.createElement('div');
        col1.className = 'matrix-column';
        const col2 = document.createElement('div');
        col2.className = 'matrix-column';
        
        [1, 2, 3].forEach(dotNum => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (brailleInfo.dots.includes(dotNum)) {
                dot.classList.add('active');
            }
            col1.appendChild(dot);
        });
        
        [4, 5, 6].forEach(dotNum => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (brailleInfo.dots.includes(dotNum)) {
                dot.classList.add('active');
            }
            col2.appendChild(dot);
        });
        
        smallMatrix.appendChild(col1);
        smallMatrix.appendChild(col2);
        
        back.appendChild(letterLabel);
        back.appendChild(smallMatrix);
        
        slot.appendChild(front);
        slot.appendChild(back);
        
        els.letterSlots.appendChild(slot);
    }
}

function checkLevel3Answer() {
    const position = gameState.level3Position;
    const letter = gameState.targetWord[position];
    const brailleInfo = getBrailleInfo(letter);
    const userDots = getSelectedDots(els.level3BrailleInput);
    const correctDots = [...brailleInfo.dots].sort((a, b) => a - b);
    
    if (compareBrailleDots(userDots, correctDots)) {
        els.level3Feedback.textContent = '完美！🌟';
        els.level3Feedback.className = 'feedback-message success';
        
        const matrix = els.level3BrailleInput.querySelector('.matrix-cell');
        matrix.classList.add('success-animation');
        setTimeout(() => matrix.classList.remove('success-animation'), 800);
        
        for (let i = 0; i < 3; i++) {
            createSuccessStars('✨', i);
        }
        
        const slot = els.letterSlots.children[position];
        slot.classList.add('flipped');
        
        gameState.level3Completed++;
        
        setTimeout(() => {
            if (gameState.level3Completed >= gameState.targetWord.length) {
                completeGame();
            } else {
                gameState.level3Position++;
                els.currentPosition.textContent = gameState.level3Position + 1;
                resetMatrix(els.level3BrailleInput);
                els.level3Feedback.textContent = '';
            }
        }, 1500);
    } else {
        els.level3Feedback.textContent = '加油！💪';
        els.level3Feedback.className = 'feedback-message error';
    }
}

function switchLevel(levelId) {
    hideAllSections();
    els[levelId].classList.add('active');
}

function completeGame() {
    startLevel4();
}

function startLevel4() {
    gameState.selectedSlotIndex = null;
    gameState.letterColors = [];
    
    for (let i = 0; i < gameState.targetWord.length; i++) {
        gameState.letterColors.push(gameState.colors[i % 3]);
    }
    
    els.level4Word.textContent = gameState.targetWord.toUpperCase();
    
    createCustomizationSlots();
    createPreviewSlots();
    
    switchLevel('level4');
    
    els.confirmColorsBtn.addEventListener('click', confirmColorsAndStartLoading);
}

function createCustomizationSlots() {
    els.customizationSlots.innerHTML = '';
    
    for (let i = 0; i < gameState.targetWord.length; i++) {
        const letter = gameState.targetWord[i];
        const slot = document.createElement('div');
        slot.className = 'customization-slot';
        slot.dataset.index = i;
        slot.dataset.color = gameState.letterColors[i];
        
        const letterLabel = document.createElement('div');
        letterLabel.className = 'slot-letter';
        letterLabel.textContent = letter.toUpperCase();
        
        const brailleInfo = getBrailleInfo(letter);
        const smallMatrix = document.createElement('div');
        smallMatrix.className = `small-matrix color-${gameState.letterColors[i]}`;
        
        const col1 = document.createElement('div');
        col1.className = 'matrix-column';
        const col2 = document.createElement('div');
        col2.className = 'matrix-column';
        
        [1, 2, 3].forEach(dotNum => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (brailleInfo.dots.includes(dotNum)) {
                dot.classList.add('active');
            }
            col1.appendChild(dot);
        });
        
        [4, 5, 6].forEach(dotNum => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (brailleInfo.dots.includes(dotNum)) {
                dot.classList.add('active');
            }
            col2.appendChild(dot);
        });
        
        smallMatrix.appendChild(col1);
        smallMatrix.appendChild(col2);
        
        slot.appendChild(letterLabel);
        slot.appendChild(smallMatrix);
        
        slot.addEventListener('click', () => selectSlot(i));
        
        els.customizationSlots.appendChild(slot);
    }
}

function createPreviewSlots() {
    els.previewSlots.innerHTML = '';
    
    for (let i = 0; i < gameState.targetWord.length; i++) {
        const letter = gameState.targetWord[i];
        const slot = document.createElement('div');
        slot.className = `preview-slot color-${gameState.letterColors[i]}`;
        
        const letterLabel = document.createElement('div');
        letterLabel.className = 'slot-letter';
        letterLabel.textContent = letter.toUpperCase();
        
        const brailleInfo = getBrailleInfo(letter);
        const smallMatrix = document.createElement('div');
        smallMatrix.className = `small-matrix color-${gameState.letterColors[i]}`;
        
        const col1 = document.createElement('div');
        col1.className = 'matrix-column';
        const col2 = document.createElement('div');
        col2.className = 'matrix-column';
        
        [1, 2, 3].forEach(dotNum => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (brailleInfo.dots.includes(dotNum)) {
                dot.classList.add('active');
            }
            col1.appendChild(dot);
        });
        
        [4, 5, 6].forEach(dotNum => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (brailleInfo.dots.includes(dotNum)) {
                dot.classList.add('active');
            }
            col2.appendChild(dot);
        });
        
        smallMatrix.appendChild(col1);
        smallMatrix.appendChild(col2);
        
        slot.appendChild(letterLabel);
        slot.appendChild(smallMatrix);
        
        els.previewSlots.appendChild(slot);
    }
}

function selectSlot(index) {
    if (gameState.selectedSlotIndex !== null) {
        const prevSlot = els.customizationSlots.children[gameState.selectedSlotIndex];
        prevSlot.classList.remove('selected');
    }
    
    gameState.selectedSlotIndex = index;
    const currentSlot = els.customizationSlots.children[index];
    currentSlot.classList.add('selected');
    
    const colorCircles = document.querySelectorAll('.color-circle');
    colorCircles.forEach(circle => {
        circle.classList.remove('selected');
        if (circle.dataset.color === gameState.letterColors[index]) {
            circle.classList.add('selected');
        }
        
        circle.onclick = () => changeColor(circle.dataset.color);
    });
}

function changeColor(color) {
    if (gameState.selectedSlotIndex === null) {
        return;
    }
    
    const index = gameState.selectedSlotIndex;
    gameState.letterColors[index] = color;
    
    const slot = els.customizationSlots.children[index];
    slot.dataset.color = color;
    
    const matrix = slot.querySelector('.small-matrix');
    matrix.className = `small-matrix color-${color}`;
    
    const colorCircles = document.querySelectorAll('.color-circle');
    colorCircles.forEach(circle => {
        circle.classList.remove('selected');
        if (circle.dataset.color === color) {
            circle.classList.add('selected');
        }
    });
    
    createPreviewSlots();
}

function confirmColorsAndStartLoading() {
    switchLevel('loading');
    
    setTimeout(() => {
        showFinalScreen();
    }, 60000);
}

function showFinalScreen() {
    els.finalPreview.innerHTML = '';
    
    for (let i = 0; i < gameState.targetWord.length; i++) {
        const letter = gameState.targetWord[i];
        const color = gameState.letterColors[i];
        
        const slot = document.createElement('div');
        slot.className = `final-slot color-${color}`;
        
        const letterLabel = document.createElement('div');
        letterLabel.className = 'letter-label';
        letterLabel.textContent = letter.toUpperCase();
        
        const brailleInfo = getBrailleInfo(letter);
        const smallMatrix = document.createElement('div');
        smallMatrix.className = `small-matrix color-${color}`;
        
        const col1 = document.createElement('div');
        col1.className = 'matrix-column';
        const col2 = document.createElement('div');
        col2.className = 'matrix-column';
        
        [1, 2, 3].forEach(dotNum => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (brailleInfo.dots.includes(dotNum)) {
                dot.classList.add('active');
            }
            col1.appendChild(dot);
        });
        
        [4, 5, 6].forEach(dotNum => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (brailleInfo.dots.includes(dotNum)) {
                dot.classList.add('active');
            }
            col2.appendChild(dot);
        });
        
        smallMatrix.appendChild(col1);
        smallMatrix.appendChild(col2);
        
        slot.appendChild(letterLabel);
        slot.appendChild(smallMatrix);
        
        els.finalPreview.appendChild(slot);
    }
    
    switchLevel('final');
    
    els.restartBtn.addEventListener('click', restartGame);
}

function restartGame() {
    gameState = {
        targetWord: '',
        currentLetterIndex: 0,
        currentSubLevel: 0,
        level3Position: 0,
        level3Completed: 0,
        selectedSlotIndex: null,
        letterColors: [],
        colors: ['blue', 'yellow', 'pink']
    };
    
    els.wordInput.value = '';
    els.charCount.textContent = '0/5';
    els.inputError.textContent = '';
    els.startLevel2Btn.disabled = true;
    
    resetMatrix(els.brailleInput);
    resetMatrix(els.level3BrailleInput);
    
    switchLevel('level1');
}

window.addEventListener('DOMContentLoaded', init);
