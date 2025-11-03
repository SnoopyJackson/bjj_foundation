// Tab Navigation and Quiz Logic for IBJJF Rules Guide
function switchTab(tabName, buttonEl) {
    // Remove active from all tabs and sections
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));

    // Add active to clicked tab and corresponding section
    if (buttonEl) buttonEl.classList.add('active');
    document.getElementById(tabName).classList.add('active');

    // Initialize quiz if quiz tab is clicked
    if (tabName === 'quiz') {
        initQuiz();
    }
}

// Quiz Data
const quizQuestions = [
    // (same questions as before)
    {
        question: "How many points is a successful guard pass worth?",
        options: ["2 points", "3 points", "4 points", "1 advantage"],
        correct: 1
    },
    {
        question: "What happens if you mount your opponent but both of their arms are trapped under your body?",
        options: ["4 points", "2 points", "1 advantage only", "No points or advantage"],
        correct: 2
    },
    {
        question: "How long must you hold a scoring position to be awarded points?",
        options: ["1 second", "3 seconds", "5 seconds", "10 seconds"],
        correct: 1
    },
    {
        question: "Which position awards 4 points?",
        options: ["Guard pass", "Sweep", "Mount", "Takedown"],
        correct: 2
    },
    {
        question: "If you have back control but use a body triangle instead of hooks, what do you get?",
        options: ["4 points", "2 points", "1 advantage", "Nothing"],
        correct: 2
    },
    {
        question: "What is the result of slamming your opponent to escape a submission?",
        options: ["Technical foul", "Warning", "Immediate disqualification", "2 points to opponent"],
        correct: 2
    },
    {
        question: "How many penalties lead to disqualification?",
        options: ["2 penalties", "3 penalties", "4 penalties", "5 penalties"],
        correct: 2
    },
    {
        question: "If you sweep your opponent from guard, how many points do you get?",
        options: ["0 points", "2 points", "3 points", "4 points"],
        correct: 1
    },
    {
        question: "What happens if you flee the mat to avoid a sweep?",
        options: ["Warning", "1 advantage to opponent", "2 points to opponent", "Disqualification"],
        correct: 2
    },
    {
        question: "If both competitors pull guard simultaneously, who gets the advantage?",
        options: ["Neither", "Both", "The one who comes on top", "The referee decides"],
        correct: 2
    },
    {
        question: "Knee on belly is worth how many points?",
        options: ["1 point", "2 points", "3 points", "4 points"],
        correct: 1
    },
    {
        question: "What breaks a tie if points are equal?",
        options: ["Referee decision", "Advantages", "Weight", "Submission attempts"],
        correct: 1
    },
    {
        question: "At what belt level are heel hooks typically legal in IBJJF?",
        options: ["White belt", "Blue belt", "Purple belt", "Brown/Black belt"],
        correct: 3
    },
    {
        question: "After how many stalling penalties does your opponent get an advantage?",
        options: ["1 penalty", "2 penalties", "3 penalties", "4 penalties"],
        correct: 1
    },
    {
        question: "If you achieve a takedown but land on bottom, what happens?",
        options: ["No points", "Thrower gets 2 points, top gets advantage", "Top gets 2 points", "Both get advantages"],
        correct: 1
    }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;

function initQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedOption = null;

    // Shuffle questions
    shuffleArray(quizQuestions);

    // Show quiz content, hide results
    document.getElementById('quizContent').style.display = 'block';
    document.getElementById('resultsContent').style.display = 'none';

    displayQuestion();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayQuestion() {
    const question = quizQuestions[currentQuestionIndex];

    // Update score display
    document.getElementById('scoreDisplay').textContent = `Score: ${score}/${currentQuestionIndex}`;

    // Display question
    document.getElementById('questionText').textContent = `Question ${currentQuestionIndex + 1}/${quizQuestions.length}: ${question.question}`;

    // Display options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.onclick = () => selectOption(index);
        optionsContainer.appendChild(btn);
    });

    // Reset buttons
    document.getElementById('submitBtn').style.display = 'inline-block';
    document.getElementById('submitBtn').disabled = false;
    document.getElementById('nextBtn').style.display = 'none';

    selectedOption = null;
}

function selectOption(index) {
    // Only allow selection if answer hasn't been submitted
    if (document.getElementById('submitBtn').style.display === 'none') return;

    selectedOption = index;

    // Remove selected class from all options
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Add selected class to clicked option
    document.querySelectorAll('.option-btn')[index].classList.add('selected');
}

function checkAnswer() {
    if (selectedOption === null) {
        alert('Please select an answer!');
        return;
    }

    const question = quizQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.option-btn');

    // Disable all option buttons
    options.forEach((btn, index) => {
        btn.classList.add('disabled');
        btn.onclick = null;

        // Highlight correct answer
        if (index === question.correct) {
            btn.classList.add('correct');
        }

        // Highlight incorrect answer if selected
        if (index === selectedOption && index !== question.correct) {
            btn.classList.add('incorrect');
        }
    });

    // Update score if correct
    if (selectedOption === question.correct) {
        score++;
    }

    // Update buttons
    document.getElementById('submitBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'inline-block';

    // Update score display
    document.getElementById('scoreDisplay').textContent = `Score: ${score}/${currentQuestionIndex + 1}`;
}

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    let emoji, message;

    if (percentage >= 90) {
        emoji = '🏆';
        message = 'Outstanding! You know the IBJJF rules like a black belt!';
    } else if (percentage >= 75) {
        emoji = '🥈';
        message = 'Great job! You have a solid understanding of the rules!';
    } else if (percentage >= 60) {
        emoji = '🥉';
        message = 'Good effort! Review the rules and try again!';
    } else {
        emoji = '📚';
        message = 'Keep studying! The rules take time to master!';
    }

    document.getElementById('quizContent').style.display = 'none';
    const resultsContent = document.getElementById('resultsContent');
    resultsContent.style.display = 'block';
    resultsContent.innerHTML = `
        <div class="results-container">
            <div class="results-emoji">${emoji}</div>
            <div class="results-score">${score}/${quizQuestions.length}</div>
            <div class="results-percentage">${percentage}%</div>
            <div class="results-message">${message}</div>
            <div class="quiz-actions">
                <button class="quiz-btn" onclick="initQuiz()">Try Again</button>
                <button class="quiz-btn" onclick="backToRules()">Back to Rules</button>
            </div>
        </div>
    `;
}

function backToRules() {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));

    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    document.getElementById('points').classList.add('active');
}


// Expose functions to window for onclick handlers
window.switchTab = switchTab;
window.initQuiz = initQuiz;
window.checkAnswer = checkAnswer;
window.nextQuestion = nextQuestion;
window.backToRules = backToRules;

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    // Points section is already active by default
});
