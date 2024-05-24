// 禁止右鍵和檢視原始碼
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    if (e.key === "F12" || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') || 
        (e.ctrlKey && e.shiftKey && e.key === 'J') || 
        (e.ctrlKey && e.key === 'U') || 
        (e.ctrlKey && e.key === 'S')) {
        e.preventDefault();
    }
});

// 定義可能的E、V、M選項及其分數
const E_OPTIONS = [
    { text: '眼腫無法張開', score: 1 },
    { text: '沒有眼睛反應', score: 1 },
    { text: '對疼痛刺激張眼', score: 2 },
    { text: '對呼喚張眼', score: 3 },
    { text: '自動張眼', score: 4 }
];

const V_OPTIONS = [
    { text: '有影響溝通的因素如氣管插管、氣切或失語症等', score: 1 },
    { text: '沒有聲音反應', score: 1 },
    { text: '只能發出聲音', score: 2 },
    { text: '只能說出單詞', score: 3 },
    { text: '回答錯誤', score: 4 },
    { text: '回答完整且正確', score: 5 }
];

const M_OPTIONS = [
    { text: '癱瘓或其他限制四肢的因素', score: 1 },
    { text: '沒有痛刺激反應', score: 1 },
    { text: '對痛刺激肘關節及下肢皆僵直', score: 2 },
    { text: '對痛刺激會有病態屈曲', score: 3 },
    { text: '對痛刺激會有正常屈曲', score: 4 },
    { text: '會定位痛刺激', score: 5 },
    { text: '聽從指示', score: 6 }
];

let timerInterval;

// 隨機選擇一個選項
function getRandomOption(options) {
    return options[Math.floor(Math.random() * options.length)];
}

// 生成隨機考題
function generateQuestion() {
    const E = getRandomOption(E_OPTIONS);
    const V = getRandomOption(V_OPTIONS);
    const M = getRandomOption(M_OPTIONS);

    const totalScore = E.score + V.score + M.score;

    return {
        questionText: `某位傷患對：E: ${E.text}，V: ${V.text}，M: ${M.text}`,
        totalScore: totalScore,
        correctE: E.text,
        correctV: V.text,
        correctM: M.text,
        correctEScore: E.score,
        correctVScore: V.score,
        correctMScore: M.score
    };
}

// 顯示隨機考題
function displayQuestion() {
    const question = generateQuestion();
    document.getElementById('question').textContent = question.questionText;
    document.getElementById('responseForm').dataset.totalScore = question.totalScore;
    document.getElementById('responseForm').dataset.correctE = question.correctE;
    document.getElementById('responseForm').dataset.correctV = question.correctV;
    document.getElementById('responseForm').dataset.correctM = question.correctM;
    document.getElementById('responseForm').dataset.correctEScore = question.correctEScore;
    document.getElementById('responseForm').dataset.correctVScore = question.correctVScore;
    document.getElementById('responseForm').dataset.correctMScore = question.correctMScore;
    document.getElementById('prompt').style.display = 'block';
    resetTimer();
    document.getElementById('response').value = '';
    document.getElementById('result').textContent = '';
}

// 重設並開始計時器
function resetTimer() {
    clearInterval(timerInterval);
    let timeLeft = 80; // 80 seconds
    const timerElement = document.getElementById('timer');

    timerInterval = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('時間到！');
            showCorrectAnswer();
        }
        timeLeft--;
    }, 1000);
}

// 顯示正確的總分和答案組合
function showCorrectAnswer() {
    const totalScore = parseInt(document.getElementById('responseForm').dataset.totalScore, 10);
    const correctE = document.getElementById('responseForm').dataset.correctE;
    const correctV = document.getElementById('responseForm').dataset.correctV;
    const correctM = document.getElementById('responseForm').dataset.correctM;
    const correctEScore = document.getElementById('responseForm').dataset.correctEScore;
    const correctVScore = document.getElementById('responseForm').dataset.correctVScore;
    const correctMScore = document.getElementById('responseForm').dataset.correctMScore;
    const resultElement = document.getElementById('result');
    resultElement.textContent = `該傷患的昏迷指數為 ${totalScore}（E: ${correctE}，${correctEScore}分；V: ${correctV}，${correctVScore}分；M: ${correctM}，${correctMScore}分）`;
    resultElement.style.color = 'red';
}

// 驗證回答
document.getElementById('responseForm').addEventListener('submit', function(event) {
    event.preventDefault();
    clearInterval(timerInterval);
    const userResponse = parseInt(document.getElementById('response').value, 10);
    const totalScore = parseInt(this.dataset.totalScore, 10);
    const correctE = this.dataset.correctE;
    const correctV = this.dataset.correctV;
    const correctM = this.dataset.correctM;
    const correctEScore = this.dataset.correctEScore;
    const correctVScore = this.dataset.correctVScore;
    const correctMScore = this.dataset.correctMScore;
    const resultElement = document.getElementById('result');
    if (userResponse === totalScore) {
        resultElement.textContent = `回答正確! 該傷患的昏迷指數是 ${totalScore}`;
        resultElement.style.color = 'green';
    } else {
        resultElement.textContent = `回答錯誤。該傷患的昏迷指數是 ${totalScore}（E: ${correctE}，${correctEScore}分；V: ${correctV}，${correctVScore}分；M: ${correctM}，${correctMScore}分）`;
        resultElement.style.color = 'red';
    }
});

// 更新題目按鈕
document.getElementById('newQuestionBtn').addEventListener('click', displayQuestion);

// 初始化頁面時生成一個隨機考題
displayQuestion(); 
