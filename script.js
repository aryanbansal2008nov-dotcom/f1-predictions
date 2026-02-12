// Configuration
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbywsnHlIMBHcgSkYGTWGzG5GPfj1k7WA-00wLY9P0_GnV9IxdVKn3giEcb9cJHRDakF/exec';

// =======================
// DRIVERS
// =======================

const drivers = [
    { number: 3, name: 'MAX VERSTAPPEN', team: 'Red Bull Racing' },
    { number: 21, name: 'ISACK HADJAR', team: 'Red Bull Racing' },
    { number: 1, name: 'LANDO NORRIS', team: 'McLaren' },
    { number: 81, name: 'OSCAR PIASTRI', team: 'McLaren' },
    { number: 44, name: 'LEWIS HAMILTON', team: 'Ferrari' },
    { number: 16, name: 'CHARLES LECLERC', team: 'Ferrari' },
    { number: 63, name: 'GEORGE RUSSELL', team: 'Mercedes' },
    { number: 12, name: 'KIMI ANTONELLI', team: 'Mercedes' },
    { number: 55, name: 'CARLOS SAINZ', team: 'Williams' },
    { number: 23, name: 'ALEX ALBON', team: 'Williams' },
    { number: 14, name: 'FERNANDO ALONSO', team: 'Aston Martin' },
    { number: 18, name: 'LANCE STROLL', team: 'Aston Martin' },
    { number: 41, name: 'ARVID LINDBLAD', team: 'Racing Bulls' },
    { number: 30, name: 'LIAM LAWSON', team: 'Racing Bulls' },
    { number: 27, name: 'NICO HULKENBERG', team: 'Audi Racing' },
    { number: 5, name: 'GABRIEL BORTOLETO', team: 'Audi Racing' },
    { number: 87, name: 'OLIVER BEARMAN', team: 'Haas' },
    { number: 31, name: 'ESTEBAN OCON', team: 'Haas' },
    { number: 10, name: 'PIERRE GASLY', team: 'Alpine' },
    { number: 43, name: 'FRANCO COLAPINTO', team: 'Alpine' },
    { number: 11, name: 'SERGIO PEREZ', team: 'Cadillac Racing' },
    { number: 77, name: 'VALTERRI BOTTAS', team: 'Cadillac Racing' }
];

const driverImages = {
    'MAX VERSTAPPEN': 'max.png',
    'ARVID LINDBLAD': 'lindblad.png',
    'LEWIS HAMILTON': 'hamilton.png',
    'CHARLES LECLERC': 'charles.png',
    'LANDO NORRIS': 'lundo.png',
    'OSCAR PIASTRI': 'piastri.png',
    'GEORGE RUSSELL': 'george.png',
    'KIMI ANTONELLI': 'kimi.png',
    'FERNANDO ALONSO': 'fernando.png',
    'LANCE STROLL': 'stroll.png',
    'PIERRE GASLY': 'gasly.png',
    'FRANCO COLAPINTO': 'franco.png',
    'OLIVER BEARMAN': 'bear.png',
    'ESTEBAN OCON': 'ocon.png',
    'NICO HULKENBERG': 'nico.png',
    'GABRIEL BORTOLETO': 'gabriel.png',
    'CARLOS SAINZ': 'carlos.png',
    'ALEX ALBON': 'albon.png',
    'ISACK HADJAR': 'hadjar.png',
    'LIAM LAWSON': 'lawson.png',
    'SERGIO PEREZ': 'perez.jpg',
    'VALTERRI BOTTAS': 'bottas.png'
};

// =======================
// QUESTIONS
// =======================

const questions = [
    ...[1,2,3,4,5,16,17,18,19,20].map(position => ({
        id: `p${position}`,
        title: `F1 2026 Season - YOUR P${position}`,
        type: 'driver'
    })),
    { id: 'Flop', title: 'F1 2026 Season - Flop Driver', type: 'driver' },
    { id: 'good', title: 'F1 2026 Season - Better than expected', type: 'driver' },
    { id: 'dnf', title: 'F1 2026 Season - Driver crashing the most', type: 'driver' },
    { id: 'fucked', title: 'F1 2026 Season - Driver getting booted mid season', type: 'driver' },
    { id: 'WCC', title: 'F1 2026 Season - Constructors Champion', type: 'text', placeholder: 'Which team will win WCC?' },
    { id: 'bold_prediction', title: 'F1 2026 Season - Crazy Prediction', type: 'text', placeholder: 'Write your bold prediction...' }
];

questions.forEach((q, index) => {
    q.questionNumber = `QUESTION ${index + 1} / ${questions.length}`;
});

// =======================
// STATE
// =======================

let currentQuestion = 0;
let predictions = {
    participantName: '',
    timestamp: ''
};
let selectedDrivers = new Set();

// =======================
// START
// =======================

function startPrediction() {
    const name = document.getElementById('participantName').value.trim();
    if (!name) {
        alert('Please enter your name');
        return;
    }

    predictions.participantName = name;
    predictions.timestamp = new Date().toISOString();
    document.getElementById('displayName').textContent = name;

    showScreen('predictionScreen');
    renderQuestionNavigation();
    showQuestion(0);
}

// =======================
// SCREEN SWITCH
// =======================

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// =======================
// NAVIGATION BAR
// =======================

function renderQuestionNavigation() {
    const questionNav = document.getElementById('questionNav');
    questionNav.innerHTML = '';

    questions.forEach((question, index) => {
        const navItem = document.createElement('div');
        navItem.className = 'question-nav-item';
        navItem.textContent = question.id;
        navItem.onclick = () => showQuestion(index);
        questionNav.appendChild(navItem);
    });

    updateQuestionNavigation();
}

function updateQuestionNavigation() {
    const navItems = document.querySelectorAll('.question-nav-item');

    navItems.forEach((item, index) => {
        item.classList.remove('active', 'completed');

        if (predictions[questions[index].id]) {
            item.classList.add('completed');
        }

        if (index === currentQuestion) {
            item.classList.add('active');
        }
    });
}

// =======================
// SHOW QUESTION (FIXED)
// =======================

function showQuestion(index) {
    currentQuestion = index;
    const question = questions[index];

    updateQuestionNavigation();

    document.getElementById('questionNumber').textContent = question.questionNumber;
    document.getElementById('questionTitle').textContent = question.title;

    const driversGrid = document.getElementById('driversGrid');
    const timeInputContainer = document.getElementById('timeInputContainer');
    const textInputContainer = document.getElementById('textInputContainer');
    const textInput = document.getElementById('textInput');

    driversGrid.style.display = 'none';
    timeInputContainer.style.display = 'none';
    textInputContainer.style.display = 'none';

    if (question.type === 'driver') {
        driversGrid.style.display = 'grid';
        renderDrivers(question.id);
    }
    else if (question.type === 'text') {
        textInputContainer.style.display = 'block';
        textInput.placeholder = question.placeholder || 'Enter your answer...';
        textInput.value = predictions[question.id] || '';
    }

    document.getElementById('prevBtn').style.display = index > 0 ? 'block' : 'none';
    document.getElementById('nextBtnText').textContent =
        index < questions.length - 1 ? 'NEXT →' : 'SUBMIT';
}

// =======================
// DRIVER GRID
// =======================

function renderDrivers(questionId) {
    const driversGrid = document.getElementById('driversGrid');
    driversGrid.innerHTML = '';

    drivers.forEach(driver => {
        const card = document.createElement('div');
        card.className = 'driver-card';

        if (predictions[questionId] === driver.name) {
            card.classList.add('selected');
        }

        card.innerHTML = `
            <div>${driver.number}</div>
            <div>${driver.name}</div>
            <div>${driver.team}</div>
        `;

        card.onclick = () => {
            predictions[questionId] = driver.name;
            updateQuestionNavigation();
            renderDrivers(questionId);
        };

        driversGrid.appendChild(card);
    });
}

// =======================
// NEXT / PREVIOUS
// =======================

function nextQuestion() {
    const question = questions[currentQuestion];

    if (!predictions[question.id]) {
        if (question.type === 'text') {
            const value = document.getElementById('textInput').value.trim();
            if (!value) {
                alert('Please enter a response');
                return;
            }
            predictions[question.id] = value;
        } else {
            alert('Please answer this question');
            return;
        }
    }

    if (currentQuestion < questions.length - 1) {
        showQuestion(currentQuestion + 1);
    } else {
        submitPredictions();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        showQuestion(currentQuestion - 1);
    }
}

// =======================
// SUBMIT
// =======================

async function submitPredictions() {
    const submissionData = {
        participantName: predictions.participantName,
        timestamp: predictions.timestamp,
        ...predictions
    };

    await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
    });

    document.getElementById('successName').textContent = predictions.participantName;
    showScreen('successScreen');
}
