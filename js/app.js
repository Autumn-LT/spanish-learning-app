// ============================================================
// 西班牙语学习 - 应用逻辑层
// ============================================================

// ===== 存储管理 =====
const Storage = {
    get(key, defaultVal = null) {
        try {
            const data = localStorage.getItem('spanish_' + key);
            return data ? JSON.parse(data) : defaultVal;
        } catch { return defaultVal; }
    },
    set(key, val) {
        localStorage.setItem('spanish_' + key, JSON.stringify(val));
    },
    getProgress() {
        return this.get('progress', {
            completedLessons: [],
            currentLesson: 0,
            learnedWords: [],
            quizHistory: [],
            studyDays: {},
            totalStudyMinutes: 0,
            streak: 0,
            lastStudyDate: null,
            wordStats: {}
        });
    },
    saveProgress(progress) {
        this.set('progress', progress);
    },
    getSettings() {
        return this.get('settings', { speechRate: 0.9, dailyReminder: false });
    },
    saveSettings(settings) {
        this.set('settings', settings);
    },
    getNotes() {
        return this.get('notes', {});
    },
    saveNotes(notes) {
        this.set('notes', notes);
    },
    getTodayNotes() {
        const notes = this.getNotes();
        const today = getTodayStr();
        return notes[today] || [];
    },
    saveTodayNote(text) {
        const notes = this.getNotes();
        const today = getTodayStr();
        if (!notes[today]) notes[today] = [];
        notes[today].push({
            id: Date.now(),
            text: text.trim(),
            createdAt: new Date().toISOString()
        });
        this.saveNotes(notes);
        return notes[today];
    },
    deleteTodayNote(noteId) {
        const notes = this.getNotes();
        const today = getTodayStr();
        if (notes[today]) {
            notes[today] = notes[today].filter(n => n.id !== noteId);
            this.saveNotes(notes);
        }
        return notes[today] || [];
    }
};

// ===== 语音合成 =====
const Speaker = {
    speak(text, rate = null) {
        if (!window.speechSynthesis) {
            showToast('您的浏览器不支持语音功能');
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = rate || Storage.getSettings().speechRate || 0.9;
        utterance.pitch = 1;
        // 尝试选择西班牙语语音
        const voices = window.speechSynthesis.getVoices();
        const esVoice = voices.find(v => v.lang.startsWith('es'));
        if (esVoice) utterance.voice = esVoice;
        window.speechSynthesis.speak(utterance);
    }
};

// ===== Toast 通知 =====
function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

// ===== 页面导航 =====
let currentPage = 'daily';
let studyTimer = null;
let studySeconds = 0;

function navigateTo(page) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-list li').forEach(li => li.classList.remove('active'));
    document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.remove('active'));

    // 显示目标页面
    const targetPage = document.getElementById('page-' + page);
    if (targetPage) targetPage.classList.add('active');

    // 高亮导航
    const navItem = document.querySelector(`.nav-list li[data-page="${page}"]`);
    if (navItem) navItem.classList.add('active');
    const bottomBtn = document.querySelector(`.bottom-nav button[data-page="${page}"]`);
    if (bottomBtn) bottomBtn.classList.add('active');

    currentPage = page;
    closeNav();

    // 渲染对应页面
    switch (page) {
        case 'daily': renderDaily(); break;
        case 'words': renderWords(); break;
        case 'quiz': renderQuiz(); break;
        case 'review': renderReview(); break;
        case 'calendar': renderCalendar(); break;
        case 'ocr': renderOCR(); break;
        case 'settings': renderSettings(); break;
    }
}

function openNav() {
    document.getElementById('sideNav').classList.add('open');
    document.getElementById('overlay').classList.add('show');
}

function closeNav() {
    document.getElementById('sideNav').classList.remove('open');
    document.getElementById('overlay').classList.remove('show');
}

// ===== 学习计时器 =====
function startTimer() {
    if (studyTimer) return;
    studySeconds = 0;
    studyTimer = setInterval(() => {
        studySeconds++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    if (studyTimer) {
        clearInterval(studyTimer);
        studyTimer = null;
        // 保存学习时间
        if (studySeconds > 0) {
            const progress = Storage.getProgress();
            const today = getTodayStr();
            if (!progress.studyDays[today]) {
                progress.studyDays[today] = { minutes: 0, lessons: [] };
            }
            progress.studyDays[today].minutes += Math.round(studySeconds / 60);
            progress.totalStudyMinutes += Math.round(studySeconds / 60);
            Storage.saveProgress(progress);
        }
        studySeconds = 0;
        updateTimerDisplay();
    }
}

function updateTimerDisplay() {
    const mins = Math.floor(studySeconds / 60);
    const secs = studySeconds % 60;
    const el = document.getElementById('timerDisplay');
    if (el) el.textContent = `⏱ 学习时间: ${mins}分${secs.toString().padStart(2, '0')}秒`;
}

function getTodayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
}

// ===== 更新连续打卡 =====
function updateStreak() {
    const progress = Storage.getProgress();
    const today = getTodayStr();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${(yesterday.getMonth()+1).toString().padStart(2,'0')}-${yesterday.getDate().toString().padStart(2,'0')}`;

    if (progress.studyDays[today]) {
        // 今天学习了
        if (!progress.lastStudyDate || progress.lastStudyDate !== today) {
            if (progress.lastStudyDate === yesterdayStr) {
                progress.streak = (progress.streak || 0) + 1;
            } else if (progress.lastStudyDate !== today) {
                progress.streak = 1;
            }
            progress.lastStudyDate = today;
        }
    } else {
        // 今天还没学，检查是否断签
        if (progress.lastStudyDate && progress.lastStudyDate !== today && progress.lastStudyDate !== yesterdayStr) {
            progress.streak = 0;
        }
    }
    Storage.saveProgress(progress);
    document.getElementById('streakDisplay').textContent = `🔥 ${progress.streak || 0}`;
}

// ===== 今日课程渲染 =====
function renderDaily() {
    const container = document.getElementById('dailyContent');
    const progress = Storage.getProgress();
    const today = getTodayStr();
    const courses = COURSES.A1;

    // 显示日期
    document.getElementById('todayDate').textContent = new Date().toLocaleDateString('zh-CN', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
    });

    // 计时器
    let html = `<div class="timer-display" id="timerDisplay">⏱ 学习时间: 0分00秒</div>`;

    // 今日学习状态
    const studiedToday = progress.studyDays[today];
    if (studiedToday) {
        html += `<div class="lesson-card completed">
            <div class="lesson-header">
                <span class="lesson-title">✅ 今日已完成</span>
                <span class="lesson-status completed">已完成</span>
            </div>
            <p>学习时间: ${studiedToday.minutes} 分钟</p>
            <p>完成课程: ${studiedToday.lessons.length} 课</p>
        </div>`;
    }

    // 今日笔记摘要
    const todayNotes = Storage.getTodayNotes();
    if (todayNotes.length > 0) {
        html += `<div class="lesson-card" style="border-left:4px solid var(--warning);">
            <div class="lesson-header">
                <span class="lesson-title">📝 今日笔记</span>
                <span class="lesson-status available">${todayNotes.length} 条</span>
            </div>
            <div style="font-size:13px;color:var(--text-secondary);">点击悬浮窗笔记本查看或添加笔记</div>
        </div>`;
    }

    // 课程列表
    html += `<h3 style="margin-bottom:12px;">A1 阶段课程 (${courses.length}课)</h3>`;

    courses.forEach((course, index) => {
        const isCompleted = progress.completedLessons.includes(course.id);
        const isCurrent = index === progress.currentLesson;
        const isLocked = index > progress.currentLesson;
        let statusClass = 'locked';
        let statusText = '🔒 未解锁';
        if (isCompleted) {
            statusClass = 'completed';
            statusText = '✅ 已完成';
        } else if (isCurrent) {
            statusClass = 'available';
            statusText = '📖 可学习';
        }

        html += `<div class="lesson-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}">
            <div class="lesson-header">
                <span class="lesson-title">${course.title}</span>
                <span class="lesson-status ${statusClass}">${statusText}</span>
            </div>
            <div class="lesson-preview">${course.words.length} 个生词 · ${course.examples.length} 个例句</div>
            <div class="lesson-actions">
                ${!isLocked ? `<button class="btn primary" onclick="startLesson('${course.id}')">开始学习</button>` : ''}
                ${isCompleted ? `<button class="btn" onclick="startLesson('${course.id}')">复习</button>` : ''}
            </div>
        </div>`;
    });

    // 整体进度
    const completedCount = progress.completedLessons.length;
    const totalCount = courses.length;
    const pct = Math.round((completedCount / totalCount) * 100);
    html += `<div class="lesson-card">
        <h4>A1 阶段进度</h4>
        <div class="progress-bar">
            <div class="progress-fill" style="width:${pct}%"></div>
        </div>
        <p style="font-size:13px;color:var(--text-secondary);margin-top:8px;">已完成 ${completedCount}/${totalCount} 课 (${pct}%)</p>
    </div>`;

    container.innerHTML = html;
    updateStreak();
    startTimer();
}

// ===== 开始课程 =====
function startLesson(lessonId) {
    stopTimer();
    const level = 'A1';
    const course = COURSES[level].find(c => c.id === lessonId);
    if (!course) return;

    const container = document.getElementById('dailyContent');
    const progress = Storage.getProgress();

    let html = `<button class="btn" onclick="renderDaily()" style="margin-bottom:16px;">← 返回课程列表</button>`;

    // 语法讲解
    html += `<div class="grammar-section">${course.grammar}</div>`;

    // 生词列表
    html += `<div class="grammar-section">
        <h3>📝 本课生词</h3>
        <div class="word-list">`;
    course.words.forEach(w => {
        const vocab = VOCABULARY[level].find(v => v.es === w);
        if (vocab) {
            html += `<div class="word-item">
                <div>
                    <span class="word-es">${vocab.es}</span>
                    <span class="word-cn">${vocab.cn}</span>
                </div>
                <div class="word-actions">
                    <button class="speak-btn" onclick="Speaker.speak('${vocab.es}')">🔊</button>
                </div>
            </div>`;
        }
    });
    html += `</div></div>`;

    // 例句
    html += `<div class="grammar-section">
        <h3>💬 例句</h3>`;
    course.examples.forEach(ex => {
        html += `<div class="word-item">
            <div>
                <div class="word-es">${ex.es}</div>
                <div class="word-cn">${ex.cn}</div>
            </div>
            <div class="word-actions">
                <button class="speak-btn" onclick="Speaker.speak('${ex.es.replace(/'/g, "\\'")}')">🔊</button>
            </div>
        </div>`;
    });
    html += `</div>`;

    // 完成按钮
    const isCompleted = progress.completedLessons.includes(lessonId);
    html += `<div style="text-align:center;margin:20px 0;">
        ${!isCompleted ? `<button class="btn success" onclick="completeLesson('${lessonId}')">✅ 完成本课学习</button>` : `<p style="color:var(--success);font-weight:600;">✅ 本课已完成</p>`}
    </div>`;

    container.innerHTML = html;
}

// ===== 完成课程 =====
function completeLesson(lessonId) {
    const progress = Storage.getProgress();
    if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
    }

    // 解锁下一课
    const level = 'A1';
    const courseIndex = COURSES[level].findIndex(c => c.id === lessonId);
    if (courseIndex >= 0 && courseIndex + 1 > progress.currentLesson) {
        progress.currentLesson = courseIndex + 1;
    }

    // 记录今日学习
    const today = getTodayStr();
    if (!progress.studyDays[today]) {
        progress.studyDays[today] = { minutes: 0, lessons: [] };
    }
    if (!progress.studyDays[today].lessons.includes(lessonId)) {
        progress.studyDays[today].lessons.push(lessonId);
    }

    Storage.saveProgress(progress);
    stopTimer();
    showToast('🎉 恭喜完成本课！');
    renderDaily();
}

// ===== 单词记忆 =====
let wordMode = 'card';
let wordIndex = 0;
let wordList = [];
let guessScore = { correct: 0, wrong: 0 };
let wrongWords = []; // 错题重练队列
let cardLessonId = null; // 卡片模式当前选中的课程ID

function renderWords(resetIndex = true) {
    const container = document.getElementById('wordsContent');
    const progress = Storage.getProgress();
    const level = 'A1';

    if (resetIndex) {
        wordIndex = 0;
        guessScore = { correct: 0, wrong: 0 };
        wrongWords = [];
    }

    switch (wordMode) {
        case 'card': renderCardMode(container); break;
        case 'guess': renderGuessMode(container); break;
        case 'fill': renderFillMode(container); break;
    }
}

function selectCardLesson(lessonId) {
    cardLessonId = lessonId;
    const progress = Storage.getProgress();
    const level = 'A1';
    const course = COURSES[level].find(c => c.id === lessonId);
    if (!course) return;
    wordList = VOCABULARY[level].filter(v => v.lesson === lessonId);
    wordIndex = 0;
    guessScore = { correct: 0, wrong: 0 };
    wrongWords = [];
    const container = document.getElementById('wordsContent');
    renderCardMode(container);
}

function backToLessonList() {
    cardLessonId = null;
    wordList = [];
    wordIndex = 0;
    const container = document.getElementById('wordsContent');
    renderCardMode(container);
}

// 显示错题复习提示和卡片模式顶部
function renderReviewReminder() {
    const progress = Storage.getProgress();
    const level = 'A1';
    const allWords = VOCABULARY[level].filter(v => progress.completedLessons.includes(v.lesson));
    const due = getDueWords(allWords);
    const stats = progress.wordStats || {};
    const totalErrors = Object.values(stats).reduce((sum, s) => sum + s.errorCount, 0);
    let html = '';
    if (due.length > 0) {
        html += `<div class="review-reminder">
            <span>📅 今日有 <strong>${due.length}</strong> 个单词到期复习</span>
            <button class="btn primary" onclick="reviewDueWords()">开始复习</button>
        </div>`;
    }
    if (totalErrors > 0) {
        html += `<div class="review-reminder error-summary">
            <span>📝 已记录 <strong>${totalErrors}</strong> 次错题</span>
        </div>`;
    }
    return html;
}

function reviewDueWords() {
    const progress = Storage.getProgress();
    const level = 'A1';
    const learnedLessons = progress.completedLessons;
    const allWords = VOCABULARY[level].filter(v => learnedLessons.includes(v.lesson));
    const due = getDueWords(allWords);
    if (due.length === 0) {
        showToast('没有需要复习的单词 🎉');
        return;
    }
    // 用到期单词替换当前词表，从第一个开始
    wordList = due;
    wordIndex = 0;
    guessScore = { correct: 0, wrong: 0 };
    const container = document.getElementById('wordsContent');
    switch (wordMode) {
        case 'card': renderCardMode(container); break;
        case 'guess': renderGuessMode(container); break;
        case 'fill': renderFillMode(container); break;
    }
    showToast(`📅 开始复习 ${due.length} 个单词`);
}

// 卡片模式
function renderCardMode(container) {
    const progress = Storage.getProgress();
    const level = 'A1';
    const courses = COURSES[level];

    // 如果没选课程，显示课程列表
    if (!cardLessonId) {
        let html = renderReviewReminder();
        html += `<div class="lesson-selector">
            <h3 style="margin-bottom:12px;">📚 选择课程查看单词</h3>
            <p style="font-size:13px;color:var(--text-secondary);margin-bottom:16px;">点击课程查看该课所有词汇的单词卡片</p>`;

        courses.forEach((course) => {
            const isCompleted = progress.completedLessons.includes(course.id);
            const isLocked = !isCompleted && !progress.completedLessons.includes(course.id) && course.id !== COURSES[level][progress.currentLesson]?.id;
            // 只有已解锁的课程才能进入
            if (!isCompleted && course.id !== COURSES[level][progress.currentLesson]?.id && progress.completedLessons.length < COURSES[level].findIndex(c => c.id === course.id)) return;
            if (course.id !== COURSES[level][progress.currentLesson]?.id && !isCompleted && progress.currentLesson < COURSES[level].findIndex(c => c.id === course.id)) return;

            const isUnlocked = isCompleted || COURSES[level].findIndex(c => c.id === course.id) <= progress.currentLesson;
            if (!isUnlocked) return;

            const lessonWords = VOCABULARY[level].filter(v => v.lesson === course.id);
            const dueCount = getDueWords(lessonWords).length;

            html += `<div class="lesson-card ${isCompleted ? 'completed' : ''}" onclick="selectCardLesson('${course.id}')" style="cursor:pointer;">
                <div class="lesson-header">
                    <span class="lesson-title">${course.title}</span>
                    <span class="lesson-status ${isCompleted ? 'completed' : 'available'}">${isCompleted ? '✅ 已学' : '📖 可用'}</span>
                </div>
                <div class="lesson-preview">${lessonWords.length} 个单词 ${dueCount > 0 ? `· 📅 ${dueCount} 个待复习` : ''}</div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;">`;
            lessonWords.forEach(w => {
                const stat = getWordStats(w.es);
                const hasError = stat && stat.errorCount > 0;
                html += `<span style="font-size:12px;padding:2px 8px;background:${hasError ? '#fee2e2' : '#f1f5f9'};border-radius:10px;color:${hasError ? '#ef4444' : 'var(--text-secondary)'};">${w.es}</span>`;
            });
            html += `</div></div>`;
        });

        container.innerHTML = html;
        return;
    }

    // 已选中课程，显示卡片
    if (wordList.length === 0) {
        const course = COURSES[level].find(c => c.id === cardLessonId);
        if (course) {
            wordList = VOCABULARY[level].filter(v => v.lesson === cardLessonId);
        }
    }
    if (wordList.length === 0) {
        container.innerHTML = `<div class="empty-state"><div class="emoji">📚</div><p>该课程暂无词汇</p><button class="btn" onclick="backToLessonList()">← 返回课程列表</button></div>`;
        return;
    }

    if (wordIndex >= wordList.length) wordIndex = 0;
    const word = wordList[wordIndex];
    if (!word) return;

    const course = COURSES[level].find(c => c.id === cardLessonId);
    const courseTitle = course ? course.title : '';

    let html = renderReviewReminder();
    html += `<button class="btn" onclick="backToLessonList()" style="margin-bottom:8px;font-size:13px;padding:6px 14px;">← 返回课程列表</button>
        <div style="font-size:12px;color:var(--text-secondary);text-align:center;margin-bottom:4px;">${courseTitle}</div>
        <div class="card-progress">${wordIndex + 1} / ${wordList.length}</div>
        <div class="card-container">
            <div class="flash-card" id="flashCard" onclick="flipCard()">
                <div class="card-front">
                    <div class="card-word">${word.es}</div>
                    <div class="card-hint">👆 点击翻转查看释义</div>
                </div>
                <div class="card-back">
                    <div class="card-translation">${word.cn}</div>
                    <div class="card-example">${word.example || ''}</div>
                </div>
            </div>
        </div>
        <div class="card-nav">
            <button class="btn" onclick="prevWord()">◀ 上一个</button>
            <button class="btn primary" onclick="Speaker.speak('${word.es.replace(/'/g, "\\'")}')">🔊 朗读</button>
            <button class="btn" onclick="nextWord()">下一个 ▶</button>
        </div>`;
    container.innerHTML = html;
}

function flipCard() {
    document.getElementById('flashCard').classList.toggle('flipped');
}

function nextWord() {
    wordIndex = (wordIndex + 1) % wordList.length;
    renderWords(false);
}

function prevWord() {
    wordIndex = (wordIndex - 1 + wordList.length) % wordList.length;
    renderWords(false);
}

// 猜词模式
function renderGuessMode(container) {
    if (wordIndex >= wordList.length) {
        // 如果有错词需要重练
        if (wrongWords.length > 0) {
            const retryList = shuffleArray([...new Set(wrongWords)]);
            wordList = retryList;
            wordIndex = 0;
            wrongWords = [];
            showToast(`🔄 开始复习 ${retryList.length} 个错词，直到答对为止`);
            renderGuessMode(container);
            return;
        }
        // 显示结果
        container.innerHTML = `<div class="guess-container">
            <div class="guess-result correct" style="font-size:18px;">
                🎯 全部完成！正确: ${guessScore.correct} 错误: ${guessScore.wrong}
            </div>
            <button class="btn primary" onclick="wordIndex=0;guessScore={correct:0,wrong:0};renderWords()" style="width:100%;margin-top:16px;">
                重新开始
            </button>
        </div>`;
        return;
    }

    const word = wordList[wordIndex];
    // 随机决定方向
    const isEs2Cn = Math.random() > 0.5;
    const displayWord = isEs2Cn ? word.es : word.cn;
    const correctAnswer = isEs2Cn ? word.cn : word.es;

    // 生成选项
    let options = [correctAnswer];
    const pool = wordList.filter(w => w.es !== word.es);
    while (options.length < 4 && pool.length > 0) {
        const rand = pool[Math.floor(Math.random() * pool.length)];
        const opt = isEs2Cn ? rand.cn : rand.es;
        if (!options.includes(opt)) options.push(opt);
        pool.splice(pool.indexOf(rand), 1);
    }
    // 打乱
    options = shuffleArray(options);

    let html = renderReviewReminder() + `<div class="guess-container">
        <div class="card-progress">${wordIndex + 1} / ${wordList.length} · 正确: ${guessScore.correct} 错误: ${guessScore.wrong}</div>
        <div class="guess-word">${displayWord}</div>
        <div class="guess-options" id="guessOptions">
            ${options.map((opt, i) => `<button class="guess-option" data-index="${i}" onclick="checkGuess(${i}, '${correctAnswer.replace(/'/g, "\\'")}', this)">${opt}</button>`).join('')}
        </div>
        <div id="guessResult"></div>
        <button class="btn primary" onclick="Speaker.speak('${word.es.replace(/'/g, "\\'")}')" style="width:100%;margin-top:12px;">🔊 朗读</button>
    </div>`;
    container.innerHTML = html;
}

function checkGuess(index, correct, el) {
    const options = document.querySelectorAll('.guess-option');
    options.forEach(o => o.disabled = true);

    const selectedText = options[index].textContent;
    const isCorrect = selectedText === correct;

    // 记录错题和遗忘曲线数据（以当前单词的es形式为准）
    const word = wordList[wordIndex];
    if (word) {
        recordWordAttempt(word.es, isCorrect);
    }

    if (isCorrect) {
        options[index].classList.add('correct');
        guessScore.correct++;
        document.getElementById('guessResult').innerHTML = '<div class="guess-result correct">✅ 正确！</div>';
        setTimeout(() => {
            wordIndex++;
            renderWords(false);
        }, 1200);
    } else {
        options[index].classList.add('wrong');
        guessScore.wrong++;
        // 显示正确答案
        options.forEach((o, i) => {
            if (o.textContent === correct) o.classList.add('correct');
        });
        // 记录错词，后续重复考察
        if (word) {
            wrongWords.push(word);
        }
        document.getElementById('guessResult').innerHTML = '<div class="guess-result wrong">❌ 错误，之后会再次考察这个单词</div>';
        setTimeout(() => {
            wordIndex++;
            renderWords(false);
        }, 1500);
    }
}

// 填空模式
function renderFillMode(container) {
    // 当一轮完成且有错词时，自动进入错题重练
    if (wordIndex >= wordList.length && wrongWords.length > 0) {
        const retryList = shuffleArray([...new Set(wrongWords)]);
        wordList = retryList;
        wordIndex = 0;
        wrongWords = [];
        showToast(`🔄 开始复习 ${retryList.length} 个错词，直到答对为止`);
        renderFillMode(container);
        return;
    }
    // 一轮全部完成且无错词 - 庆祝结束
    if (wordIndex >= wordList.length) {
        const totalWords = wordList.length;
        container.innerHTML = `<div class="fill-container" style="text-align:center;padding:40px 20px;">
            <div style="font-size:64px;margin-bottom:16px;">🎉</div>
            <h3 style="font-size:22px;color:var(--success);margin-bottom:12px;">太棒了！全部答对！</h3>
            <p style="font-size:15px;color:var(--text-secondary);margin-bottom:24px;">本轮 ${totalWords} 个单词全部正确，继续加油！💪</p>
            <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
                <button class="btn primary" onclick="wordIndex=0;guessScore={correct:0,wrong:0};renderWords()">🔄 再来一轮</button>
                <button class="btn" onclick="renderWords()">返回</button>
            </div>
        </div>`;
        return;
    }
    const word = wordList[wordIndex];

    let html = renderReviewReminder() + `<div class="fill-container">
        <div class="card-progress">${wordIndex + 1} / ${wordList.length}</div>
        <div class="fill-sentence">
            请填写: <strong>${word.cn}</strong> 对应的西班牙语
        </div>
        <div style="text-align:center;font-size:14px;color:var(--text-secondary);margin-bottom:8px;">
            提示: 共 ${word.es.length} 个字符
        </div>
        <input type="text" class="fill-input" id="fillInput" placeholder="输入西班牙语..." autocomplete="off"
            onkeydown="if(event.key==='Enter') checkFill()">
        <div id="fillResult"></div>
        <div style="display:flex;gap:8px;margin-top:12px;">
            <button class="btn primary" onclick="checkFill()" style="flex:1;">确认</button>
            <button class="btn" onclick="showFillAnswer()" style="flex:1;">显示答案</button>
            <button class="btn" onclick="Speaker.speak('${word.es.replace(/'/g, "\\'")}')">🔊</button>
        </div>
        <div style="display:flex;gap:8px;margin-top:8px;">
            <button class="btn" onclick="wordIndex=Math.max(0,wordIndex-1);renderWords(false)" style="flex:1;">◀ 上一个</button>
            <button class="btn" onclick="wordIndex=(wordIndex+1)%wordList.length;renderWords(false)" style="flex:1;">下一个 ▶</button>
        </div>
    </div>`;
    container.innerHTML = html;
    document.getElementById('fillInput').focus();
}

function checkFill() {
    const input = document.getElementById('fillInput');
    const word = wordList[wordIndex];
    const isCorrect = input.value.trim().toLowerCase() === word.es.toLowerCase();

    // 记录错题和遗忘曲线数据
    recordWordAttempt(word.es, isCorrect);

    input.classList.remove('correct', 'wrong');
    if (isCorrect) {
        input.classList.add('correct');
        document.getElementById('fillResult').innerHTML = '<div class="guess-result correct">✅ 正确！</div>';
        setTimeout(() => {
            wordIndex++;
            renderWords(false);
        }, 1000);
    } else {
        input.classList.add('wrong');
        // 记录错词，后续重复考察
        if (word) {
            wrongWords.push(word);
        }
        const stats = getWordStats(word.es);
        const errorCount = stats ? stats.errorCount : 1;
        document.getElementById('fillResult').innerHTML = `<div class="guess-result wrong">❌ 不正确，正确答案是: <strong>${word.es}</strong> (已错 ${errorCount} 次) · 之后会再次考察</div>`;
    }
}

function showFillAnswer() {
    const word = wordList[wordIndex];
    // 显示答案也记为错误，需要重练
    if (word) {
        wrongWords.push(word);
        recordWordAttempt(word.es, false);
    }
    document.getElementById('fillInput').value = word.es;
    document.getElementById('fillInput').classList.add('correct');
    document.getElementById('fillResult').innerHTML = `<div class="guess-result correct">答案: ${word.es} — ${word.cn} · 之后会再次考察</div>`;
}

// ===== 测验系统 =====
let quizType = 'daily'; // 'daily' 每日测验 | 'stage' 阶段测验
let quizQuestions = [];
let quizIndex = 0;
let quizCorrect = 0;
let quizWrong = 0;
let quizAnswered = false;

function renderQuiz() {
    const container = document.getElementById('quizContent');
    const progress = Storage.getProgress();
    const level = 'A1';
    const todayStr = getTodayStr();

    let html = '';

    // 获取今日学习的课程
    const todayStudy = progress.studyDays[todayStr];
    const todayLessonIds = todayStudy ? todayStudy.lessons : [];

    // 每日测验：今日课程词汇
    const dailyWords = [];
    todayLessonIds.forEach(id => {
        const course = COURSES[level].find(c => c.id === id);
        if (course) {
            course.words.forEach(w => {
                const vocab = VOCABULARY[level].find(v => v.es === w);
                if (vocab) dailyWords.push(vocab);
            });
        }
    });

    // 今日笔记
    const todayNotes = Storage.getTodayNotes();

    // 阶段测验：所有已学课程词汇
    const learnedLessons = progress.completedLessons;
    const stageWords = VOCABULARY[level].filter(v => learnedLessons.includes(v.lesson));

    // 每日测验信息
    if (quizType === 'daily') {
        if (dailyWords.length === 0 && todayNotes.length === 0) {
            html += `<div class="quiz-placeholder">📅 今日还没有学习内容，先去完成课程或记笔记吧！</div>`;
        } else {
            const totalItems = dailyWords.length + todayNotes.length;
            html += `<div class="lesson-card">
                <div class="lesson-header">
                    <span class="lesson-title">📅 每日测验</span>
                    <span class="lesson-status completed">${totalItems} 项</span>
                </div>
                <p style="font-size:14px;color:var(--text-secondary);margin-bottom:12px;">
                    测验今日内容：${todayLessonIds.length} 节课 (${dailyWords.length} 词) ${todayNotes.length > 0 ? `+ ${todayNotes.length} 条笔记` : ''}
                </p>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button class="btn primary" onclick="startDailyQuiz()">开始每日测验</button>
                    <button class="btn" onclick="quizType='stage';renderQuiz()">切换到阶段测验</button>
                </div>
            </div>`;
            // 列出今日课程名
            if (todayLessonIds.length > 0) {
                html += `<div style="font-size:13px;color:var(--text-secondary);padding:8px 0;">`;
                todayLessonIds.forEach(id => {
                    const course = COURSES[level].find(c => c.id === id);
                    if (course) html += `<span style="display:inline-block;background:#eff6ff;padding:2px 10px;border-radius:12px;margin:2px 4px;">${course.title}</span>`;
                });
                html += `</div>`;
            }
            // 列出今日词汇
            if (dailyWords.length > 0) {
                html += `<details style="margin-top:12px;" ${dailyWords.length <= 8 ? 'open' : ''}>
                    <summary style="font-size:14px;font-weight:600;cursor:pointer;color:var(--text-secondary);padding:4px 0;">📖 今日词汇 (${dailyWords.length})</summary>
                    <div class="word-list" style="margin-top:8px;">`;
                dailyWords.forEach(w => {
                    html += `<div class="word-item">
                        <div><span class="word-es">${w.es}</span><span class="word-cn">${w.cn}</span></div>
                        <button class="speak-btn" onclick="Speaker.speak('${w.es.replace(/'/g, "\\'")}')">🔊</button>
                    </div>`;
                });
                html += `</div></details>`;
            }
            // 列出今日笔记
            if (todayNotes.length > 0) {
                html += `<details style="margin-top:8px;" ${todayNotes.length <= 5 ? 'open' : ''}>
                    <summary style="font-size:14px;font-weight:600;cursor:pointer;color:var(--warning);padding:4px 0;">📝 今日笔记 (${todayNotes.length})</summary>
                    <div style="margin-top:8px;">`;
                todayNotes.forEach(n => {
                    html += `<div style="padding:8px 12px;background:#fffbeb;border-radius:6px;margin-bottom:6px;border-left:3px solid var(--warning);font-size:14px;">${escapeHtml(n.text)}</div>`;
                });
                html += `</div></details>`;
            }
        }
    } else {
        // 阶段测验
        const totalLearned = stageWords.length;
        if (totalLearned === 0) {
            html += `<div class="quiz-placeholder">📚 还没有已学词汇，先去完成课程吧！</div>`;
        } else {
            html += `<div class="lesson-card">
                <div class="lesson-header">
                    <span class="lesson-title">📚 阶段测验</span>
                    <span class="lesson-status completed">${totalLearned} 个词</span>
                </div>
                <p style="font-size:14px;color:var(--text-secondary);margin-bottom:12px;">
                    测试所有已学课程的全部 ${totalLearned} 个生词
                </p>
                <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px;">
                    <label style="font-size:14px;display:flex;align-items:center;gap:6px;">
                        <select id="quizDirection" style="padding:6px 10px;border-radius:6px;border:1px solid var(--border);font-size:14px;">
                            <option value="mixed">混合模式</option>
                            <option value="es2cn">西译中</option>
                            <option value="cn2es">中译西</option>
                        </select>
                    </label>
                    <button class="btn primary" onclick="startStageQuiz()">开始阶段测验</button>
                    <button class="btn" onclick="quizType='daily';renderQuiz()">切换到每日测验</button>
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width:${Math.round((progress.completedLessons.length / COURSES[level].length) * 100)}%"></div></div>
                <p style="font-size:12px;color:var(--text-secondary);margin-top:6px;">已完成 ${progress.completedLessons.length}/${COURSES[level].length} 课</p>
            </div>`;
        }
    }

    container.innerHTML = html;
}

// 从笔记文本中提取知识点并生成题目
function generateNoteQuestions(noteText) {
    const questions = [];
    const text = noteText.trim();
    const level = 'A1';

    // ---- 策略1: 提取词汇配对, 如 "hola = 你好" 或 "hola: 你好" ----
    const pairMatch = text.match(/^([a-záéíóúüñ]+)\s*[=:：]\s*(.+)$/i);
    if (pairMatch) {
        const es = pairMatch[1].trim().toLowerCase();
        const cn = pairMatch[2].trim();
        const vocab = VOCABULARY[level].find(v => v.es.toLowerCase() === es);
        if (vocab) {
            const wrongCn = shuffleArray(VOCABULARY[level].filter(v => v.es !== vocab.es)).slice(0, 3).map(v => v.cn);
            const optionsCn = shuffleArray([cn, ...wrongCn].slice(0, 4));
            questions.push({
                question: `📝 [笔记] "${es}" 是什么意思？`,
                options: optionsCn,
                answer: optionsCn.indexOf(cn),
                vocab: es,
                source: '笔记'
            });
        }
        return questions;
    }

    // ---- 策略2: 提取序号列表知识点 (如 "1. ... 2. ... 3. ...") ----
    const listItems = text.split(/\n/).filter(line => /^\s*(?:\d+[.、)．]|[-•*])\s+/.test(line.trim()));
    if (listItems.length >= 2) {
        listItems.forEach((item, idx) => {
            const clean = item.replace(/^\s*(?:\d+[.、)．]|[-•*])\s+/, '').trim();
            if (!clean) return;

            // 查找知识点中的核心内容：提取关键术语/数字/词汇
            // 提取括号内的西语词 (如 ca-sa, ha-blan)
            const bracketWords = clean.match(/[（(]([^）)]+)[）)]/g);
            if (bracketWords) {
                bracketWords.forEach(bw => {
                    const inner = bw.replace(/[（(）)]/g, '');
                    // 将括号内容挖空作为题目
                    const qText = clean.replace(/[（(][^）)]*[）)]/, '______');
                    questions.push({
                        question: `📝 [笔记知识点] ${qText}`,
                        options: shuffleArray([inner, ...getDistractors(inner, 3)]),
                        answer: 0,
                        source: '笔记知识点'
                    });
                });
            } else {
                // 提取关键数字/术语作为填空点
                const boldParts = clean.match(/\*\*(.+?)\*\*/g);
                if (boldParts) {
                    boldParts.forEach(bp => {
                        const term = bp.replace(/\*\*/g, '');
                        const qText = clean.replace(bp, '______');
                        questions.push({
                            question: `📝 [笔记知识点] ${qText}`,
                            options: shuffleArray([term, ...getDistractors(term, 3)]),
                            answer: 0,
                            source: '笔记知识点'
                        });
                    });
                } else {
                    // 从句子中提取一个关键名词/术语作为考点
                    const words = clean.split(/[\s,，、]+/).filter(w => w.length >= 2);
                    if (words.length >= 3) {
                        const keyIdx = Math.floor(words.length / 2);
                        const keyTerm = words[keyIdx];
                        const qWords = [...words];
                        qWords[keyIdx] = '______';
                        questions.push({
                            question: `📝 [笔记知识点] ${qWords.join(' ')}`,
                            options: shuffleArray([keyTerm, ...getDistractors(keyTerm, 3)]),
                            answer: 0,
                            source: '笔记知识点'
                        });
                    }
                }
            }
        });
        return questions;
    }

    // ---- 策略3: 单句知识点, 找 "是/为/指/表示" 等定义句式 ----
    const defMatch = text.match(/^(.+?)(?:是|为|指|表示|指的就是|意思就是)(.+)$/);
    if (defMatch) {
        const subject = defMatch[1].trim();
        const definition = defMatch[2].trim();
        const defWords = definition.split(/[\s,，、]+/).filter(w => w.length >= 2);
        if (defWords.length >= 2) {
            const keyIdx = Math.min(1, defWords.length - 1);
            const keyTerm = defWords[keyIdx];
            const qDef = definition.replace(keyTerm, '______');
            questions.push({
                question: `📝 [笔记知识点] ${subject} ${qDef}`,
                options: shuffleArray([keyTerm, ...getDistractors(keyTerm, 3)]),
                answer: 0,
                source: '笔记知识点'
            });
        }
        return questions;
    }

    // ---- 策略4: 包含"不能/必须/应该/只有"等规则词, 生成判断正误题 ----
    const ruleWords = ['不能', '必须', '应该', '只有', '需要', '可以', '通常', '一般'];
    const hasRule = ruleWords.some(rw => text.includes(rw));
    if (hasRule && text.length >= 8) {
        // 提取核心关键词
        const keyMatch = text.match(/[A-Za-záéíóúüñ]+/g);
        if (keyMatch) {
            const key = keyMatch[0];
            const vocab = VOCABULARY[level].find(v => v.es.toLowerCase() === key.toLowerCase());
            if (vocab) {
                const wrongCn = shuffleArray(VOCABULARY[level].filter(v => v.es !== vocab.es)).slice(0, 3).map(v => v.cn);
                const optionsCn = shuffleArray([vocab.cn, ...wrongCn].slice(0, 4));
                questions.push({
                    question: `📝 [笔记] "${key}" 是什么意思？（来自笔记规则）`,
                    options: optionsCn,
                    answer: optionsCn.indexOf(vocab.cn),
                    vocab: key.toLowerCase(),
                    source: '笔记知识点'
                });
            }
        }
        return questions;
    }

    // ---- 策略5: 如果笔记中有西语词汇, 至少出词汇题 ----
    const esWords = text.match(/[a-záéíóúüñ]+/gi) || [];
    esWords.forEach(es => {
        const esLower = es.toLowerCase();
        const vocab = VOCABULARY[level].find(v => v.es.toLowerCase() === esLower);
        if (vocab && questions.length < 3) {
            const wrongCn = shuffleArray(VOCABULARY[level].filter(v => v.es !== vocab.es)).slice(0, 3).map(v => v.cn);
            const optionsCn = shuffleArray([vocab.cn, ...wrongCn].slice(0, 4));
            questions.push({
                question: `📝 [笔记] 笔记中的 "${es}" 是什么意思？`,
                options: optionsCn,
                answer: optionsCn.indexOf(vocab.cn),
                vocab: esLower,
                source: '笔记'
            });
        }
    });

    return questions;
}

// 获取干扰项
function getDistractors(correctAnswer, count) {
    const level = 'A1';
    const allTerms = new Set();
    // 从词汇表中取干扰项
    VOCABULARY[level].forEach(v => {
        allTerms.add(v.es);
        allTerms.add(v.cn);
    });
    // 如果正确答案本身是数字/符号, 生成数字干扰
    if (/^\d+$/.test(correctAnswer)) {
        const nums = [];
        const base = parseInt(correctAnswer);
        for (let i = 1; i <= count; i++) {
            nums.push(String(base + i));
        }
        return nums;
    }
    const distractors = shuffleArray([...allTerms].filter(t => t !== correctAnswer)).slice(0, count);
    return distractors.length < count ? ['...', '..', '.'].slice(0, count) : distractors;
}

// 生成每日测验题目（基于今日所学词汇 + 今日笔记）
function generateDailyQuestions() {
    const progress = Storage.getProgress();
    const level = 'A1';
    const todayStr = getTodayStr();
    const todayStudy = progress.studyDays[todayStr];
    const questions = [];

    // 1) 从今日课程词汇生成题目
    if (todayStudy) {
        const todayLessonIds = todayStudy.lessons;
        const todayVocab = [];
        todayLessonIds.forEach(id => {
            const course = COURSES[level].find(c => c.id === id);
            if (course) {
                course.words.forEach(w => {
                    const vocab = VOCABULARY[level].find(v => v.es === w);
                    if (vocab && !todayVocab.find(v => v.es === vocab.es)) {
                        todayVocab.push(vocab);
                    }
                });
            }
        });

        todayVocab.forEach(vocab => {
            // 西译中
            const wrongCn = shuffleArray(VOCABULARY[level].filter(v => v.es !== vocab.es)).slice(0, 3).map(v => v.cn);
            const optionsCn = shuffleArray([vocab.cn, ...wrongCn].slice(0, 4));
            questions.push({
                question: `"${vocab.es}" 是什么意思？`,
                options: optionsCn,
                answer: optionsCn.indexOf(vocab.cn),
                vocab: vocab.es,
                source: '词汇'
            });

            // 中译西
            const wrongEs = shuffleArray(VOCABULARY[level].filter(v => v.es !== vocab.es)).slice(0, 3).map(v => v.es);
            const optionsEs = shuffleArray([vocab.es, ...wrongEs].slice(0, 4));
            questions.push({
                question: `"${vocab.cn}" 用西语怎么说？`,
                options: optionsEs,
                answer: optionsEs.indexOf(vocab.es),
                vocab: vocab.es,
                source: '词汇'
            });
        });
    }

    // 2) 从今日笔记智能提取知识点生成题目
    const todayNotes = Storage.getTodayNotes();
    todayNotes.forEach(note => {
        const noteQuestions = generateNoteQuestions(note.text);
        noteQuestions.forEach(q => questions.push(q));
    });

    return shuffleArray(questions);
}

function startDailyQuiz() {
    const questions = generateDailyQuestions();
    if (questions.length === 0) {
        showToast('今日还没有学习内容和笔记');
        return;
    }
    quizQuestions = questions;
    quizIndex = 0;
    quizCorrect = 0;
    quizWrong = 0;
    quizAnswered = false;
    showQuizQuestion('📅 每日测验');
}

function startStageQuiz() {
    const direction = document.getElementById('quizDirection').value;
    const level = 'A1';
    let pool = QUIZ_DATA[level];

    if (direction === 'es2cn') {
        pool = pool.filter(q => q.direction === 'es2cn');
    } else if (direction === 'cn2es') {
        pool = pool.filter(q => q.direction === 'cn2es' || q.direction === 'conjugation');
    }

    if (pool.length === 0) {
        showToast('没有匹配的题目');
        return;
    }

    quizQuestions = shuffleArray(pool).slice(0, Math.min(10, pool.length));
    quizIndex = 0;
    quizCorrect = 0;
    quizWrong = 0;
    quizAnswered = false;
    showQuizQuestion('📚 阶段测验');
}

function showQuizQuestion(title) {
    const container = document.getElementById('quizContent');
    if (quizIndex >= quizQuestions.length) {
        const pct = Math.round((quizCorrect / quizQuestions.length) * 100);
        container.innerHTML = `<div class="quiz-question" style="text-align:center;">
            <h3>🎉 ${title}完成！</h3>
            <div class="quiz-result-bar">
                <span class="correct-count">✅ 正确: ${quizCorrect}</span>
                <span class="wrong-count">❌ 错误: ${quizWrong}</span>
            </div>
            <div class="progress-bar" style="margin:16px 0;">
                <div class="progress-fill" style="width:${pct}%;background:${pct >= 70 ? 'var(--success)' : 'var(--danger)'}"></div>
            </div>
            <p style="font-size:18px;font-weight:600;">正确率: ${pct}%</p>
            <button class="btn primary" onclick="${title.includes('每日') ? 'startDailyQuiz()' : 'startStageQuiz()'}" style="margin-top:16px;">再来一次</button>
            <button class="btn" onclick="renderQuiz()" style="margin-top:8px;">返回</button>
        </div>`;

        const progress = Storage.getProgress();
        progress.quizHistory.push({
            date: getTodayStr(),
            correct: quizCorrect,
            wrong: quizWrong,
            total: quizQuestions.length,
            type: title
        });
        Storage.saveProgress(progress);
        return;
    }

    const q = quizQuestions[quizIndex];
    quizAnswered = false;

    const sourceTag = q.source === '笔记' ? '<span style="font-size:11px;background:#fef3c7;padding:1px 8px;border-radius:8px;margin-left:8px;">📝 笔记</span>' : '';

    let html = `<div class="quiz-question fade-in">
        <div class="card-progress">${title} · 第 ${quizIndex + 1}/${quizQuestions.length} 题 ${sourceTag}</div>
        <div class="quiz-question-text">${q.question}</div>
        <div class="quiz-options" id="quizOptions">
            ${q.options.map((opt, i) => `<button class="quiz-option" data-index="${i}" onclick="answerQuiz(${i}, ${q.answer}, this)">${opt}</button>`).join('')}
        </div>
        <div id="quizFeedback"></div>
    </div>`;

    container.innerHTML = html;
}

function answerQuiz(selected, correct, el) {
    if (quizAnswered) return;
    quizAnswered = true;

    const options = document.querySelectorAll('.quiz-option');
    options.forEach(o => o.disabled = true);

    // 记录答题中的词汇错题
    const q = quizQuestions[quizIndex];
    const isCorrect = selected === correct;
    if (q.vocab) {
        recordWordAttempt(q.vocab, isCorrect);
    }

    if (isCorrect) {
        el.classList.add('correct');
        quizCorrect++;
        document.getElementById('quizFeedback').innerHTML = '<div class="guess-result correct">✅ 回答正确！</div>';
    } else {
        el.classList.add('wrong');
        options[correct].classList.add('correct');
        quizWrong++;
        document.getElementById('quizFeedback').innerHTML = `<div class="guess-result wrong">❌ 正确答案是: ${options[correct].textContent}</div>`;
    }

    setTimeout(() => {
        quizIndex++;
        const title = quizType === 'daily' ? '📅 每日测验' : '📚 阶段测验';
        showQuizQuestion(title);
    }, 1200);
}

// ===== 图片识词(OCR)模块 =====
let ocrWords = [];  // 当前识别结果 { es, cn, matched, customCn }
let ocrImageData = null;

function renderOCR() {
    const container = document.getElementById('ocrContent');
    const saved = Storage.get('ocr_words', []);
    ocrWords = saved;
    ocrImageData = null;

    let html = `<div class="ocr-tip">
        📸 上传课本截图或单词表照片（推荐表格格式：左西语 + 右中文）。<br>
        系统将使用 <strong>百度智能云表格文字识别V2</strong> 进行识别，<br>
        自动解析表格行列，配对「西语词 ↔ 中文释义」，识别结果可逐条确认后再加入词库。
    </div>`;

    // 文件上传区域
    html += `<div class="ocr-upload-area" id="ocrUploadArea" onclick="document.getElementById('ocrFileInput').click()">
        <div class="ocr-upload-icon">📷</div>
        <div class="ocr-upload-text">点击选择图片，或将图片拖拽到此处</div>
        <div class="ocr-upload-hint">支持 JPG / PNG / WebP 格式</div>
        <input type="file" class="ocr-file-input" id="ocrFileInput" accept="image/*" onchange="handleOCRFile(event)">
    </div>`;

    // 如果有历史识别结果，显示
    if (ocrWords.length > 0) {
        html += renderOCRResults(false);
    } else {
        html += `<div class="ocr-empty-state">
            <div class="emoji">📖</div>
            <p style="font-size:14px;color:var(--text-secondary);">还没有识别记录，上传图片开始识词吧！</p>
            <p style="font-size:12px;color:var(--text-secondary);margin-top:8px;">支持：课本截图、打印的单词表、手写便签等</p>
        </div>`;
    }

    container.innerHTML = html;
    setupOCRDragAndDrop();
}

function setupOCRDragAndDrop() {
    const area = document.getElementById('ocrUploadArea');
    if (!area) return;
    area.addEventListener('dragover', (e) => { e.preventDefault(); area.classList.add('drag-over'); });
    area.addEventListener('dragleave', () => area.classList.remove('drag-over'));
    area.addEventListener('drop', (e) => {
        e.preventDefault();
        area.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleOCRFile({ target: { files: [file] } });
        }
    });
}

// ===== 本地代理服务器地址 =====
const OCR_PROXY_URL = 'http://127.0.0.1:3456';

function handleOCRFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        ocrImageData = e.target.result;
        // 通过本地代理服务器调用百度OCR
        runBaiduOCRViaProxy(ocrImageData);
    };
    reader.readAsDataURL(file);
}

// ===== 通过本地代理调用百度表格文字识别 =====
async function runBaiduOCRViaProxy(imageDataUrl) {
    const container = document.getElementById('ocrContent');
    if (!container) return;

    // 显示加载动画
    container.innerHTML = `<div class="ocr-loading" id="ocrLoading">
        <div class="ocr-loading-spinner"></div>
        <div class="ocr-loading-text">📤 正在通过本地代理发送图片...</div>
        <div class="ocr-loading-progress" id="ocrProgress">连接代理服务器...</div>
        <div style="margin-top:16px;font-size:12px;color:var(--text-secondary);">使用本地代理 → 百度智能云表格文字识别V2</div>
    </div>`;

    function setProgress(text) {
        const el = document.getElementById('ocrProgress');
        if (el) el.textContent = text;
    }
    function setLoadingText(text) {
        const el = document.querySelector('.ocr-loading-text');
        if (el) el.textContent = text;
    }

    const previewHtml = `<div class="ocr-upload-area has-image" onclick="document.getElementById('ocrFileInput').click()">
        <img src="${imageDataUrl}" class="ocr-preview-img" alt="上传的图片">
        <div style="font-size:12px;color:var(--text-secondary);margin-top:8px;">👆 点击更换图片</div>
        <input type="file" class="ocr-file-input" id="ocrFileInput" accept="image/*" onchange="handleOCRFile(event)">
    </div>`;

    try {
        // 1. 检查代理服务器是否运行
        setLoadingText('🔌 检查本地代理服务器...');
        setProgress('连接中...');
        try {
            const healthResp = await fetch(`${OCR_PROXY_URL}/health`);
            if (!healthResp.ok) throw new Error('代理未响应');
        } catch (e) {
            throw new Error(`本地代理服务器未运行！请先启动代理:\n   终端执行: cd Spanish/server && node proxy.js\n\n   或者使用 npm:\n   cd Spanish/server && npm start\n\n详细错误: ${e.message}`);
        }

        // 2. 将图片转为 base64（去掉 data:image/... 前缀）
        setLoadingText('📤 正在上传图片到代理服务器...');
        setProgress('转换图片格式...');
        const base64Data = imageDataUrl.replace(/^data:image\/[a-z]+;base64,/, '');

        // 3. 通过代理调用综合接口（自动获取 token + 识别）
        setProgress('🔄 调用表格文字识别...');
        setLoadingText('🔍 代理正在请求百度API...');
        const resp = await fetch(`${OCR_PROXY_URL}/ocr/table/auto`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                api_key: BAIDU_OCR_CONFIG.apiKey,
                secret_key: BAIDU_OCR_CONFIG.secretKey,
                image: base64Data
            })
        });

        const result = await resp.json();

        if (result.error) {
            throw new Error(result.error);
        }
        if (result.error_code) {
            throw new Error(`百度API错误 (${result.error_code}): ${result.error_msg}`);
        }

        setLoadingText('🔗 正在解析表格内容，配对西语-中文...');
        setProgress('解析单元格数据...');

        // 4. 解析表格结果
        const pairedWords = parseBaiduTableResult(result);

        if (pairedWords.length === 0) {
            setLoadingText('⚠️ 未能识别出单词对');
            container.innerHTML = previewHtml + `<div class="ocr-tip" style="background:#fee2e2;border-left-color:var(--danger);color:#991b1b;">
                ⚠️ 未能从图片的表格中识别出西语-中文配对。<br>
                请尝试：① 使用更清晰的图片 ② 确保图片为表格格式（左西语、右中文）③ 图片不要倾斜
            </div>
            <div class="ocr-actions">
                <button class="btn primary" onclick="runBaiduOCRViaProxy('${imageDataUrl}')">🔄 重新识别</button>
            </div>`;
            setupOCRDragAndDrop();
            return;
        }

        ocrWords = pairedWords;
        Storage.set('ocr_words', ocrWords);

        const matchedCount = pairedWords.filter(w => w.matched).length;
        const pendingCount = pairedWords.length - matchedCount;

        // 5. 显示确认列表
        setLoadingText('✅ 识别完成');
        setProgress('渲染结果...');

        let resultHtml = previewHtml;

        resultHtml += `<div class="ocr-tip">
            ✅ 百度表格识别完成 · 
            提取到 <strong>${pairedWords.length}</strong> 个配对 · 
            <strong>${matchedCount}</strong> 个已匹配词库
            ${pendingCount > 0 ? `· <strong style="color:var(--warning);">${pendingCount}</strong> 个待补充` : ''}
        </div>`;

        resultHtml += renderOCRConfirmList(pairedWords);

        container.innerHTML = resultHtml;
        setupOCRDragAndDrop();

    } catch (err) {
        console.error('Baidu OCR Error:', err);
        let errMsg = err.message || '未知错误';
        if (errMsg.includes('Access token') || errMsg.includes('鉴权')) {
            errMsg = 'API鉴权失败，请检查 config.js 中的密钥是否正确';
        }
        container.innerHTML = previewHtml + `<div class="ocr-tip" style="background:#fee2e2;border-left-color:var(--danger);color:#991b1b;">
            ❌ ${errMsg}
        </div>
        <div class="ocr-actions">
            <button class="btn primary" onclick="runBaiduOCRViaProxy('${imageDataUrl}')">🔄 重试</button>
        </div>`;
        setupOCRDragAndDrop();
    }
}

/**
 * 解析百度表格文字识别 V2 的返回结果
 * API 返回格式: { result: { body: [单元格列表], header: [表头] } }
 * 每个单元格: { row: n, col: n, words: str, location: {...} }
 */
function parseBaiduTableResult(result) {
    const body = result.result?.body || [];
    if (body.length === 0) {
        // 没有 body，尝试取 result 数组（某些版本可能不同）
        return fallbackBaiduParse(result.result);
    }

    // 按行列分组
    const cellMap = {}; // key: "row,col" -> { words, row, col }
    body.forEach(cell => {
        const key = `${cell.row},${cell.col}`;
        if (!cellMap[key]) {
            cellMap[key] = { words: cell.words || '', row: cell.row, col: cell.col };
        } else {
            // 同单元格多个片段的拼接
            cellMap[key].words += (cell.words || '');
        }
    });

    const cells = Object.values(cellMap);

    // 找出最大行列
    let maxRow = 0, maxCol = 0;
    cells.forEach(c => {
        if (c.row > maxRow) maxRow = c.row;
        if (c.col > maxCol) maxCol = c.col;
    });

    // 构建二维网格
    const grid = [];
    for (let r = 0; r <= maxRow; r++) {
        grid[r] = [];
        for (let c = 0; c <= maxCol; c++) {
            grid[r][c] = '';
        }
    }
    cells.forEach(c => {
        grid[c.row][c.col] = c.words.trim();
    });

    // 判断表头行（第一行可能包含 "西语" "中文" 等标签）
    let startRow = 0;
    if (maxRow > 0) {
        const headerRow = grid[0];
        const headerText = headerRow.join(' ').toLowerCase();
        if (/西语|español|spanish|单词|vocab|中|cn|释义|中文/.test(headerText)) {
            startRow = 1; // 跳过表头
        }
    }

    // 对每一行，尝试配对：左侧列为西语，右侧列为中文
    const results = [];
    const seen = new Set();
    const level = 'A1';
    const allVocab = VOCABULARY[level] || [];

    for (let r = startRow; r <= maxRow; r++) {
        const rowCells = grid[r].filter(c => c.trim().length > 0);
        if (rowCells.length === 0) continue;

        // 尝试用两列模式：第1列 = 西语，第2列 = 中文
        let esText = '', cnText = '';

        // 找到第一个可能是西语词的列
        for (let c = 0; c <= maxCol; c++) {
            const cellText = (grid[r][c] || '').trim();
            if (!cellText) continue;

            // 检测是否是西语（含拉丁字母和西语特殊字符）
            const cleanLatin = cellText.replace(/[^a-záéíóúüñ\s]/gi, '');
            const latinRatio = cleanLatin.length / Math.max(cellText.length, 1);

            if (latinRatio > 0.5 && /[aeiouáéíóúü]/i.test(cellText)) {
                // 这一列是西语
                if (!esText) {
                    esText = cellText;
                } else {
                    // 已有西语，说明这一行可能有更多列
                    cnText = cellText;
                }
            } else if (/[\u4e00-\u9fff]/.test(cellText)) {
                // 这一列是中文
                cnText = cellText;
            } else if (!esText) {
                // 不确定类型，当作西语尝试
                esText = cellText;
            } else {
                cnText = cellText;
            }
        }

        // 清理
        esText = cleanEsWord(esText);
        cnText = cnText.replace(/[^\u4e00-\u9fff\w\s]/g, '').trim();

        if (esText && esText.length >= 2 && !seen.has(esText)) {
            seen.add(esText);
            // 从词库匹配
            const vocabInfo = matchFromVocab(esText);
            results.push({
                es: vocabInfo.es || esText,
                original: grid[r][0] || esText, // 原文保留
                cn: cnText || vocabInfo.cn || '',
                matched: vocabInfo.matched || !!cnText,
                customCn: cnText || vocabInfo.cn || '',
                pending: !(vocabInfo.matched || !!cnText)
            });
        }
    }

    if (results.length === 0) {
        return fallbackBaiduParse(result.result);
    }

    return results;
}

/**
 * 回退方案：从百度返回的纯文本中提取西语词
 */
function fallbackBaiduParse(resultData) {
    if (!resultData) return [];

    // 尝试从 result.tables_result 或其他字段获取
    const tablesResult = resultData.tables_result || [];
    if (tablesResult.length > 0) {
        for (const table of tablesResult) {
            const body = table.body || [];
            if (body.length > 0) {
                // 重新用 parseBaiduTableResult 风格的逻辑处理
                const fakeResult = { result: { body } };
                return parseBaiduTableResult(fakeResult);
            }
        }
    }

    // 最后回退：提取所有文本中的西语和中文
    const allText = JSON.stringify(resultData);
    const esMatches = allText.match(/[a-záéíóúüñ]{3,30}/gi) || [];
    const cnMatches = allText.match(/[\u4e00-\u9fff]{2,10}/g) || [];

    const results = [];
    const seen = new Set();

    for (let i = 0; i < Math.min(esMatches.length, cnMatches.length + 5); i++) {
        const es = cleanEsWord(esMatches[i]);
        if (!es || es.length < 2 || seen.has(es)) continue;
        seen.add(es);
        const cn = cnMatches[i] || '';
        const vocabInfo = matchFromVocab(es);
        results.push({
            es: vocabInfo.es || es,
            original: es,
            cn: cn || vocabInfo.cn || '',
            matched: vocabInfo.matched || !!cn,
            customCn: cn || vocabInfo.cn || '',
            pending: !(vocabInfo.matched || !!cn)
        });
    }

    return results;
}

function renderOCRResults(showActions) {
    const total = ocrWords.length;
    const matchedCount = ocrWords.filter(w => w.matched).length;
    const pendingCount = total - matchedCount;

    let html = `<div class="ocr-word-count">📊 共识别 <strong>${total}</strong> 个单词 · 
        <span style="color:var(--success);">${matchedCount} 个已匹配</span>
        ${pendingCount > 0 ? `· <span style="color:var(--warning);">${pendingCount} 个待补充</span>` : ''}
    </div>`;

    if (pendingCount > 0) {
        html += `<div class="ocr-batch-edit">
            <label style="font-size:14px;font-weight:600;">✏️ 批量填写待补充词的中文释义</label>
            <div class="hint">每行一个，格式为：西语单词 = 中文含义（如 "gato = 猫"），留空的词将维持"待补充"状态</div>
            <textarea id="ocrBatchInput" placeholder="gato = 猫&#10;perro = 狗&#10;casa = 房子">${ocrWords.filter(w => w.pending).map(w => `${w.original} = `).join('\n')}</textarea>
            <button class="btn primary" onclick="applyBatchEdit()" style="margin-top:8px;">✅ 批量应用</button>
        </div>`;
    }

    html += '<div class="ocr-word-list">';
    ocrWords.forEach((word, idx) => {
        const statusClass = word.matched ? 'matched' : 'pending';
        const statusText = word.matched ? '✅ 已匹配' : '⏳ 待补充';
        const cnDisplay = word.matched
            ? `<span class="ocr-word-cn">${word.cn}</span>`
            : `<input type="text" class="ocr-word-cn-input" id="ocrCnInput_${idx}" placeholder="输入中文含义..." value="${word.customCn || ''}" onchange="updateOCRWordCn(${idx}, this.value)">`;

        html += `<div class="ocr-word-item">
            <span class="ocr-word-es">${word.es}</span>
            <span class="ocr-word-status ${statusClass}">${statusText}</span>
            ${cnDisplay}
            <button class="ocr-word-speak" onclick="Speaker.speak('${word.es.replace(/'/g, "\\'")}')" title="朗读">🔊</button>
        </div>`;
    });
    html += '</div>';

    if (showActions && total > 0) {
        const hasPending = ocrWords.some(w => w.pending);
        html += `<div class="ocr-actions">
            ${hasPending ? '<button class="btn success" onclick="saveAllPendingWords()">💾 保存所有待补充释义</button>' : ''}
            <button class="btn primary" onclick="addOCRWordsToWordList()" ${total === 0 ? 'disabled' : ''}>
                📚 将 ${matchedCount} 个已匹配词加入单词记忆
                ${pendingCount > 0 ? `(${pendingCount} 个待补充词不会加入)` : ''}
            </button>
            <button class="btn danger" onclick="clearOCRResults()">🗑️ 清空记录</button>
        </div>`;
    }

    return html;
}

function updateOCRWordCn(idx, value) {
    if (ocrWords[idx]) {
        ocrWords[idx].customCn = value.trim();
        ocrWords[idx].pending = !value.trim();
        Storage.set('ocr_words', ocrWords);
    }
}

function applyBatchEdit() {
    const input = document.getElementById('ocrBatchInput');
    if (!input) return;
    const lines = input.value.split('\n');
    let appliedCount = 0;

    lines.forEach(line => {
        const match = line.match(/^\s*([a-záéíóúüñ]+)\s*=\s*(.+)\s*$/i);
        if (match) {
            const es = match[1].trim().toLowerCase();
            const cn = match[2].trim();
            const found = ocrWords.find(w => w.original.toLowerCase() === es && w.pending);
            if (found) {
                found.customCn = cn;
                found.cn = cn;
                found.pending = false;
                found.matched = true;
                appliedCount++;
            }
        }
    });

    if (appliedCount > 0) {
        Storage.set('ocr_words', ocrWords);
        showToast(`✅ 已更新 ${appliedCount} 个单词的中文释义`);
        renderOCR();
    } else {
        showToast('⚠️ 未找到匹配项，请确保格式为 "西语词 = 中文"');
    }
}

function saveAllPendingWords() {
    let savedCount = 0;
    const inputs = document.querySelectorAll('[id^="ocrCnInput_"]');
    inputs.forEach(input => {
        const idx = parseInt(input.id.replace('ocrCnInput_', ''));
        if (ocrWords[idx] && input.value.trim()) {
            ocrWords[idx].customCn = input.value.trim();
            ocrWords[idx].cn = input.value.trim();
            ocrWords[idx].pending = false;
            ocrWords[idx].matched = true;
            savedCount++;
        }
    });
    if (savedCount > 0) {
        Storage.set('ocr_words', ocrWords);
        showToast(`✅ 已保存 ${savedCount} 个单词释义`);
        renderOCR();
    } else {
        showToast('⚠️ 没有填写任何释义');
    }
}

/** 清理西语词，去除标点、词性标记等 */
function cleanEsWord(text) {
    if (!text) return '';
    // 去除常见词性标注 (adj., adv., m., f., pron., prep., conj., interj., v., etc.)
    let clean = text.replace(/\b(adj|adv|m|f|pron|prep|conj|interj|v|art|num|prep|s|pl)\b\.?/gi, '');
    // 去除标点符号
    clean = clean.replace(/[.,;:!?()\[\]{}"'¿¡«»*#/\\\-]/g, ' ');
    // 去空格并归一化
    clean = clean.trim().toLowerCase().replace(/[^a-záéíóúüñ]/g, '').trim();
    return clean;
}

/** 从词库匹配西语词 */
function matchFromVocab(word) {
    const level = 'A1';
    const allVocab = VOCABULARY[level] || [];
    const key = word.toLowerCase().replace(/[^a-záéíóúüñ]/g, '');

    // 精确匹配
    for (const v of allVocab) {
        const vKey = v.es.toLowerCase().replace(/[^a-záéíóúüñ]/g, '');
        if (vKey === key) {
            return { es: v.es, cn: v.cn, matched: true };
        }
    }

    // 词根匹配
    for (const v of allVocab) {
        const vKey = v.es.toLowerCase().replace(/[^a-záéíóúüñ]/g, '');
        if (key.length >= 4 && (key.startsWith(vKey) || vKey.startsWith(key))) {
            return { es: v.es, cn: v.cn, matched: true };
        }
        // 动词词尾匹配
        if (key.length >= 5 && (key.endsWith('ar') || key.endsWith('er') || key.endsWith('ir'))) {
            const stem = key.slice(0, -2);
            if (vKey.startsWith(stem) && stem.length >= 3) {
                return { es: v.es, cn: v.cn, matched: true };
            }
        }
    }

    return { es: word, cn: '', matched: false };
}

/** 渲染确认列表：显示西语-中文配对，可逐条编辑 */
function renderOCRConfirmList(pairedWords) {
    const total = pairedWords.length;
    const matchedCount = pairedWords.filter(w => w.matched).length;
    const pendingCount = total - matchedCount;

    let html = `<div class="ocr-word-count">
        📋 共 <strong>${total}</strong> 条配对 · 
        <span style="color:var(--success);">${matchedCount} 条已确认</span>
        ${pendingCount > 0 ? `· <span style="color:var(--warning);">${pendingCount} 条待编辑</span>` : ''}
    </div>`;

    html += '<div class="ocr-word-list">';
    pairedWords.forEach((word, idx) => {
        const statusClass = word.matched && word.cn ? 'matched' : 'pending';
        const statusText = word.matched && word.cn ? '✅ 已确认' : '✏️ 待编辑';
        const cnPlaceholder = word.cn || '请输入中文释义...';

        html += `<div class="ocr-confirm-item" id="ocrConfirmItem_${idx}" style="background:var(--card-bg);border-radius:var(--radius-sm);box-shadow:var(--shadow);padding:12px 16px;margin-bottom:10px;">
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                <span class="ocr-word-es" style="flex:0 0 auto;">${word.es}</span>
                <span class="ocr-word-status ${statusClass}">${statusText}</span>
                <span style="color:var(--text-secondary);font-size:13px;">⬅️</span>
                <input type="text" class="ocr-word-cn-input" id="ocrConfirmCn_${idx}" 
                    value="${word.cn}" placeholder="${cnPlaceholder}" 
                    style="flex:1;min-width:100px;"
                    onchange="updateOCRConfirmPair(${idx}, this.value)">
                <button class="ocr-word-speak" onclick="Speaker.speak('${word.es.replace(/'/g, "\\'")}')" title="朗读">🔊</button>
            </div>
            <div style="display:flex;gap:8px;margin-top:6px;font-size:12px;color:var(--text-secondary);">
                <label style="display:flex;align-items:center;gap:4px;cursor:pointer;">
                    <input type="checkbox" id="ocrConfirmCheck_${idx}" ${word.matched && word.cn ? 'checked' : ''} onchange="toggleOCRConfirmPair(${idx})">
                    ✅ 确认无误
                </label>
                <span>识别原文: "${word.original || word.es}"</span>
            </div>
        </div>`;
    });
    html += '</div>';

    html += `<div class="ocr-actions">
        <button class="btn primary" onclick="addConfirmedOCRWords()">
            📚 将已确认的配对加入单词记忆
        </button>
        <button class="btn" onclick="clearOCRResults()">🗑️ 清空记录</button>
    </div>`;

    return html;
}

/** 更新单条配对的释义 */
function updateOCRConfirmPair(idx, value) {
    if (ocrWords[idx]) {
        ocrWords[idx].cn = value.trim();
        ocrWords[idx].customCn = value.trim();
        ocrWords[idx].pending = !value.trim();
        if (value.trim()) ocrWords[idx].matched = true;
        Storage.set('ocr_words', ocrWords);
        const statusEl = document.querySelector(`#ocrConfirmItem_${idx} .ocr-word-status`);
        if (statusEl) {
            statusEl.className = `ocr-word-status ${value.trim() ? 'matched' : 'pending'}`;
            statusEl.textContent = value.trim() ? '✅ 已确认' : '✏️ 待编辑';
        }
        const checkEl = document.getElementById(`ocrConfirmCheck_${idx}`);
        if (checkEl) checkEl.checked = !!value.trim();
    }
}

/** 切换确认状态 */
function toggleOCRConfirmPair(idx) {
    if (ocrWords[idx]) {
        const checkEl = document.getElementById(`ocrConfirmCheck_${idx}`);
        const inputEl = document.getElementById(`ocrConfirmCn_${idx}`);
        if (checkEl && inputEl) {
            if (checkEl.checked && !inputEl.value.trim()) {
                checkEl.checked = false;
                showToast('⚠️ 请先填写中文释义');
                return;
            }
            ocrWords[idx].matched = checkEl.checked;
            if (checkEl.checked) {
                ocrWords[idx].pending = false;
            }
            Storage.set('ocr_words', ocrWords);
            const statusEl = document.querySelector(`#ocrConfirmItem_${idx} .ocr-word-status`);
            if (statusEl) {
                statusEl.className = `ocr-word-status ${checkEl.checked ? 'matched' : 'pending'}`;
                statusEl.textContent = checkEl.checked ? '✅ 已确认' : '✏️ 待编辑';
            }
        }
    }
}

/** 将已确认的配对加入词库 */
function addConfirmedOCRWords() {
    const confirmed = ocrWords.filter(w => w.matched && w.cn && w.cn.trim().length > 0);

    if (confirmed.length === 0) {
        showToast('⚠️ 没有已确认的配对，请先勾选确认框');
        return;
    }

    const customVocab = Storage.get('custom_vocab', []);
    let addedCount = 0;

    confirmed.forEach(w => {
        const exists = customVocab.some(v => v.es.toLowerCase() === w.es.toLowerCase());
        if (!exists) {
            customVocab.push({
                es: w.es,
                cn: w.cn,
                source: 'ocr',
                addedAt: new Date().toISOString()
            });
            addedCount++;
        }
    });

    if (addedCount > 0) {
        Storage.set('custom_vocab', customVocab);
        const noteText = confirmed.map(w => `${w.es} = ${w.cn}`).join('\n');
        if (noteText) {
            Storage.saveTodayNote(`📷 [图片识词] ${noteText}`);
        }
        showToast(`✅ 已将 ${addedCount} 个单词加入学习词库`);
        renderOCR();
    } else {
        showToast('⚠️ 这些词已经添加过了');
    }
}

function addOCRWordsToWordList() {
    const matchedWords = ocrWords.filter(w => w.matched && w.cn);
    const pendingWords = ocrWords.filter(w => w.pending);

    if (matchedWords.length === 0) {
        showToast('⚠️ 没有已匹配的单词可以加入（请先填写待补充词的中文含义）');
        return;
    }

    // 获取已有的自定义词汇
    const customVocab = Storage.get('custom_vocab', []);
    let addedCount = 0;

    matchedWords.forEach(w => {
        const exists = customVocab.some(v => v.es.toLowerCase() === w.es.toLowerCase());
        if (!exists) {
            customVocab.push({
                es: w.es,
                cn: w.cn,
                source: 'ocr',
                addedAt: new Date().toISOString()
            });
            addedCount++;
        }
    });

    if (addedCount > 0) {
        Storage.set('custom_vocab', customVocab);
        // 同时添加到笔记中，以便在今日测验中出现
        const todayNotes = Storage.getTodayNotes();
        const noteText = matchedWords.map(w => `${w.es} = ${w.cn}`).join('\n');
        if (noteText) {
            Storage.saveTodayNote(`📷 [图片识词] ${noteText}`);
        }
        showToast(`✅ 已将 ${addedCount} 个单词加入学习词库（可在"单词记忆"中查看）`);
        renderOCR();
    } else {
        showToast('⚠️ 这些词已经添加过了');
    }
}

function clearOCRResults() {
    if (confirm('确定要清空所有OCR识别记录吗？')) {
        ocrWords = [];
        ocrImageData = null;
        Storage.set('ocr_words', []);
        showToast('已清空识别记录');
        renderOCR();
    }
}

// ===== 阶段复习 =====
function renderReview() {
    const container = document.getElementById('reviewContent');
    const progress = Storage.getProgress();
    const level = 'A1';
    const review = REVIEW_DATA[level];

    const allCompleted = progress.completedLessons.length >= COURSES[level].length;

    if (!allCompleted) {
        container.innerHTML = `<div class="empty-state">
            <div class="emoji">🔒</div>
            <p>需要完成A1阶段全部课程后才能进行综合复习。</p>
            <p style="font-size:13px;margin-top:8px;">已完成 ${progress.completedLessons.length}/${COURSES[level].length} 课</p>
        </div>`;
        return;
    }

    let html = `<div class="review-section">
        <h3>${review.title}</h3>
        <p style="font-size:14px;color:var(--text-secondary);margin-bottom:16px;">共 ${review.questions.length} 道选择题</p>
        <button class="btn primary" onclick="startReview()">开始复习</button>
    </div>`;

    container.innerHTML = html;
}

let reviewQuestions = [];
let reviewIndex = 0;
let reviewCorrect = 0;
let reviewWrong = 0;

function startReview() {
    const review = REVIEW_DATA.A1;
    reviewQuestions = shuffleArray([...review.questions]);
    reviewIndex = 0;
    reviewCorrect = 0;
    reviewWrong = 0;
    showReviewQuestion();
}

function showReviewQuestion() {
    const container = document.getElementById('reviewContent');
    if (reviewIndex >= reviewQuestions.length) {
        const pct = Math.round((reviewCorrect / reviewQuestions.length) * 100);
        container.innerHTML = `<div class="review-section" style="text-align:center;">
            <h3>🎉 复习完成！</h3>
            <div class="quiz-result-bar">
                <span class="correct-count">✅ 正确: ${reviewCorrect}</span>
                <span class="wrong-count">❌ 错误: ${reviewWrong}</span>
            </div>
            <div class="progress-bar" style="margin:16px 0;">
                <div class="progress-fill" style="width:${pct}%;background:${pct >= 70 ? 'var(--success)' : 'var(--danger)'}"></div>
            </div>
            <p style="font-size:18px;font-weight:600;">正确率: ${pct}%</p>
            <button class="btn primary" onclick="startReview()" style="margin-top:16px;">再来一次</button>
            <button class="btn" onclick="renderReview()" style="margin-top:8px;">返回</button>
        </div>`;
        return;
    }

    const q = reviewQuestions[reviewIndex];
    let html = `<div class="review-section fade-in">
        <div class="card-progress">第 ${reviewIndex + 1}/${reviewQuestions.length} 题</div>
        <div class="quiz-question-text">${q.question}</div>
        <div class="quiz-options" id="reviewOptions">
            ${q.options.map((opt, i) => `<button class="quiz-option" data-index="${i}" onclick="answerReview(${i}, ${q.answer}, this)">${opt}</button>`).join('')}
        </div>
        <div id="reviewFeedback"></div>
    </div>`;

    container.innerHTML = html;
}

function answerReview(selected, correct, el) {
    const options = document.querySelectorAll('#reviewOptions .quiz-option');
    options.forEach(o => o.disabled = true);

    if (selected === correct) {
        el.classList.add('correct');
        reviewCorrect++;
        document.getElementById('reviewFeedback').innerHTML = '<div class="guess-result correct">✅ 正确！</div>';
    } else {
        el.classList.add('wrong');
        options[correct].classList.add('correct');
        reviewWrong++;
        document.getElementById('reviewFeedback').innerHTML = `<div class="guess-result wrong">❌ 正确答案是: ${options[correct].textContent}</div>`;
    }

    setTimeout(() => {
        reviewIndex++;
        showReviewQuestion();
    }, 1200);
}

// ===== 学习日历 =====
let calendarDate = new Date();

function renderCalendar() {
    const progress = Storage.getProgress();
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    document.getElementById('calendarMonthYear').textContent =
        `${year}年${month + 1}月`;

    // 生成日历
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayStr = getTodayStr();

    let html = '<div class="calendar-grid">';
    // 星期头
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    weekDays.forEach(d => {
        html += `<div class="calendar-header">${d}</div>`;
    });

    // 空白填充
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day empty"></div>';
    }

    // 日期
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${(month+1).toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`;
        const isToday = dateStr === todayStr;
        const isChecked = progress.studyDays[dateStr];

        let cls = 'calendar-day';
        if (isToday) cls += ' today';
        if (isChecked) cls += ' checked';
        html += `<div class="${cls}">${day}</div>`;
    }

    html += '</div>';
    document.getElementById('calendarContent').innerHTML = html;

    // 统计
    const totalDays = Object.keys(progress.studyDays).length;
    const totalMinutes = progress.totalStudyMinutes || 0;
    const completedLessons = progress.completedLessons.length;
    const totalLessons = COURSES.A1.length;
    const streak = progress.streak || 0;

    document.getElementById('statsContent').innerHTML = `
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-value">${totalDays}</div>
                <div class="stat-label">学习天数</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${Math.round(totalMinutes / 60)}h ${totalMinutes % 60}m</div>
                <div class="stat-label">总学习时间</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${completedLessons}/${totalLessons}</div>
                <div class="stat-label">完成课程</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">🔥 ${streak}</div>
                <div class="stat-label">连续打卡</div>
            </div>
        </div>
    `;
}

function prevMonth() {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
}

// ===== 设置 =====
function renderSettings() {
    const settings = Storage.getSettings();
    document.getElementById('speechRate').value = settings.speechRate;
    document.getElementById('speechRateValue').textContent = settings.speechRate;
    document.getElementById('dailyReminder').checked = settings.dailyReminder;
}

// ===== 遗忘曲线复习系统 =====
const FORGETTING_CURVE_INTERVALS = [1, 3, 7, 14, 30, 60];

function getForgettingCurveInterval(consecutiveCorrect) {
    const idx = Math.min(consecutiveCorrect, FORGETTING_CURVE_INTERVALS.length - 1);
    return FORGETTING_CURVE_INTERVALS[idx];
}

function recordWordAttempt(wordEs, correct) {
    const progress = Storage.getProgress();
    if (!progress.wordStats) progress.wordStats = {};
    if (!progress.wordStats[wordEs]) {
        progress.wordStats[wordEs] = {
            errorCount: 0,
            totalAttempts: 0,
            consecutiveCorrect: 0,
            lastReviewDate: null,
            nextReviewDate: null
        };
    }
    const stats = progress.wordStats[wordEs];
    stats.totalAttempts++;
    if (correct) {
        stats.consecutiveCorrect++;
    } else {
        stats.errorCount++;
        stats.consecutiveCorrect = 0;
    }
    stats.lastReviewDate = getTodayStr();
    const daysUntilNext = getForgettingCurveInterval(stats.consecutiveCorrect);
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysUntilNext);
    stats.nextReviewDate = `${nextDate.getFullYear()}-${(nextDate.getMonth()+1).toString().padStart(2,'0')}-${nextDate.getDate().toString().padStart(2,'0')}`;
    Storage.saveProgress(progress);
}

function getDueWords(allWords) {
    const progress = Storage.getProgress();
    const today = getTodayStr();
    const stats = progress.wordStats || {};
    return allWords.filter(w => {
        const s = stats[w.es];
        if (!s || !s.nextReviewDate) return false;
        return s.nextReviewDate <= today;
    });
}

function getWordStats(wordEs) {
    const progress = Storage.getProgress();
    return (progress.wordStats || {})[wordEs] || null;
}

// ===== 悬浮笔记本 =====
function toggleNotebook() {
    const panel = document.getElementById('notebookPanel');
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
        renderNotebook();
    }
}

function renderNotebook() {
    const notes = Storage.getTodayNotes();
    const list = document.getElementById('notebookList');
    const count = document.getElementById('notebookCount');

    count.textContent = `今日笔记 (${notes.length})`;

    if (notes.length === 0) {
        list.innerHTML = `<div class="notebook-empty">📝 今天还没有记笔记，写点什么吧！</div>`;
    } else {
        list.innerHTML = notes.map(n => `
            <div class="notebook-item">
                <div class="notebook-text">${escapeHtml(n.text)}</div>
                <button class="notebook-delete" onclick="deleteNotebookNote(${n.id})">✕</button>
            </div>
        `).join('');
    }

    // 聚焦输入框
    document.getElementById('notebookInput').focus();
}

function addNotebookNote() {
    const input = document.getElementById('notebookInput');
    const text = input.value.trim();
    if (!text) return;

    Storage.saveTodayNote(text);
    input.value = '';
    renderNotebook();
    showToast('📝 笔记已保存');
}

function deleteNotebookNote(noteId) {
    Storage.deleteTodayNote(noteId);
    renderNotebook();
}

function handleNotebookKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addNotebookNote();
    }
}

// ===== 工具函数 =====
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== 事件绑定 =====
document.addEventListener('DOMContentLoaded', function() {
    // 导航
    document.getElementById('menuToggle').addEventListener('click', openNav);
    document.getElementById('navClose').addEventListener('click', closeNav);
    document.getElementById('overlay').addEventListener('click', closeNav);

    // 侧边导航点击
    document.querySelectorAll('.nav-list li').forEach(li => {
        li.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            if (page) navigateTo(page);
        });
    });

    // 底部导航点击
    document.querySelectorAll('.bottom-nav button').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.dataset.page;
            if (page) navigateTo(page);
        });
    });

    // 单词模式切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            wordMode = this.dataset.mode;
            renderWords();
        });
    });

    // 测验类型切换（每日/阶段）
    document.querySelectorAll('[data-quiz]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('[data-quiz]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            quizType = this.dataset.quiz;
            renderQuiz();
        });
    });

    // 笔记本
    document.getElementById('notebookToggle').addEventListener('click', toggleNotebook);
    document.getElementById('notebookClose').addEventListener('click', toggleNotebook);
    document.getElementById('notebookAddBtn').addEventListener('click', addNotebookNote);
    document.getElementById('notebookInput').addEventListener('keydown', handleNotebookKeydown);

    // 点击遮罩关闭笔记本
    document.getElementById('notebookOverlay').addEventListener('click', toggleNotebook);

    // 日历导航
    document.getElementById('prevMonth').addEventListener('click', prevMonth);
    document.getElementById('nextMonth').addEventListener('click', nextMonth);

    // 语音语速
    document.getElementById('speechRate').addEventListener('input', function() {
        document.getElementById('speechRateValue').textContent = this.value;
        const settings = Storage.getSettings();
        settings.speechRate = parseFloat(this.value);
        Storage.saveSettings(settings);
    });

    // 每日提醒
    document.getElementById('dailyReminder').addEventListener('change', function() {
        const settings = Storage.getSettings();
        settings.dailyReminder = this.checked;
        Storage.saveSettings(settings);
    });

    // 重置进度
    document.getElementById('resetProgress').addEventListener('click', function() {
        if (confirm('确定要重置所有学习进度吗？此操作不可撤销！')) {
            if (confirm('再次确认：所有课程进度、学习记录将被清除！')) {
                localStorage.removeItem('spanish_progress');
                showToast('已重置所有进度');
                navigateTo('daily');
            }
        }
    });

    // 预加载语音
    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }

    // 初始化 - 显示今日课程
    navigateTo('daily');
});