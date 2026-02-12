const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbywsnHlIMBHcgSkYGTWGzG5GPfj1k7WA-00wLY9P0_GnV9IxdVKn3giEcb9cJHRDakF/exec';

// ================= DRIVERS =================

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

// ================= QUESTIONS =================

const questions = [
    ...[1,2,3,4,5,16,17,18,19,20].map(p => ({
        id: `p${p}`,
        title: `F1 2026 Season - YOUR P${p}`,
        type: 'driver'
    })),
    { id: 'Flop', title: 'Flop Driver', type: 'driver' },
    { id: 'good', title: 'Better Than Expected', type: 'driver' },
    { id: 'dnf', title: 'Most Crashes', type: 'driver' },
    { id: 'fucked', title: 'Booted Mid Season', type: 'driver' },
    { id: 'WCC', title: 'Constructors Champion', type: 'text', placeholder: 'Which team wins WCC?' },
    { id: 'bold_prediction', title: 'Crazy Prediction', type: 'text', placeholder: 'Write something wild...' }
];

questions.forEach((q,i)=>{
    q.questionNumber = `Question ${i+1} / ${questions.length}`;
});

// ================= STATE =================

let currentQuestion = 0;
let predictions = {};
let selectedDrivers = new Set();

// ================= START =================

function startPrediction() {
    const name = document.getElementById('participantName').value.trim();
    if (!name) return alert("Enter name");

    predictions.participantName = name;
    predictions.timestamp = new Date().toISOString();

    document.getElementById('displayName').textContent = name;

    showScreen('predictionScreen');
    showQuestion(0);
}

// ================= SCREEN SWITCH =================

function showScreen(id){
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// ================= SHOW QUESTION =================

function showQuestion(index){
    currentQuestion = index;
    const q = questions[index];

    document.getElementById('questionNumber').textContent = q.questionNumber;
    document.getElementById('questionTitle').textContent = q.title;

    const driversGrid = document.getElementById('driversGrid');
    const textInputContainer = document.getElementById('textInputContainer');
    const textInput = document.getElementById('textInput');

    driversGrid.style.display = 'none';
    textInputContainer.style.display = 'none';

    if(q.type === 'driver'){
        driversGrid.style.display = 'grid';
        renderDrivers(q.id);
    }

    if(q.type === 'text'){
        textInputContainer.style.display = 'block';
        textInput.placeholder = q.placeholder || '';
        textInput.value = predictions[q.id] || '';
    }

    document.getElementById('prevBtn').style.display = index > 0 ? 'inline-block' : 'none';
    document.getElementById('nextBtn').textContent =
        index < questions.length-1 ? 'Next' : 'Submit';
}

// ================= RENDER DRIVERS =================

function renderDrivers(questionId){
    const grid = document.getElementById('driversGrid');
    grid.innerHTML = '';

    drivers.forEach(driver=>{
        const card = document.createElement('div');
        card.className = 'driver-card';

        if(predictions[questionId] === driver.name){
            card.classList.add('selected');
        }

        card.innerHTML = `
            <div>${driver.number}</div>
            <img src="driver pics/${driverImages[driver.name]}" style="width:60px;">
            <div>${driver.name}</div>
            <div>${driver.team}</div>
        `;

        card.onclick = ()=>{
            predictions[questionId] = driver.name;
            renderDrivers(questionId);
        };

        grid.appendChild(card);
    });
}

// ================= NAVIGATION =================

function nextQuestion(){
    const q = questions[currentQuestion];

    if(q.type === 'text'){
        const val = document.getElementById('textInput').value.trim();
        if(!val) return alert("Enter answer");
        predictions[q.id] = val;
    }

    if(!predictions[q.id]) return alert("Answer question");

    if(currentQuestion < questions.length-1){
        showQuestion(currentQuestion+1);
    } else {
        submitPredictions();
    }
}

function previousQuestion(){
    if(currentQuestion>0){
        showQuestion(currentQuestion-1);
    }
}

// ================= SUBMIT =================

async function submitPredictions(){
    await fetch(GOOGLE_SCRIPT_URL,{
        method:'POST',
        mode:'no-cors',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(predictions)
    });

    document.getElementById('successName').textContent = predictions.participantName;
    showScreen('successScreen');
}
