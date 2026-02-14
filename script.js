// Configuration - Update this with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzuW1kf7f-MvfQqUeuYAGrYuXCZTtC95ehkU3NRJGZ9u_IZzT7GKnzYFXoF2Y2zeieX/exec';

// F1 2025 Drivers Data
const drivers = [
    // Red Bull Racing
    { number: 3, name: 'MAX VERSTAPPEN', team: 'Red Bull Racing' },
    { number: 21, name: 'ISACK HADJAR', team: 'Red Bull Racing' },
    // McLaren
    { number: 1, name: 'LANDO NORRIS', team: 'McLaren' },
    { number: 81, name: 'OSCAR PIASTRI', team: 'McLaren' },
    // Ferrari
    { number: 44, name: 'LEWIS HAMILTON', team: 'Ferrari' },
    { number: 16, name: 'CHARLES LECLERC', team: 'Ferrari' },
    // Mercedes
    { number: 63, name: 'GEORGE RUSSELL', team: 'Mercedes' },
    { number: 12, name: 'KIMI ANTONELLI', team: 'Mercedes' },
    // Williams
    { number: 55, name: 'CARLOS SAINZ', team: 'Williams' },
    { number: 23, name: 'ALEX ALBON', team: 'Williams' },
    // Aston Martin
    { number: 14, name: 'FERNANDO ALONSO', team: 'Aston Martin' },
    { number: 18, name: 'LANCE STROLL', team: 'Aston Martin' },
    // Racing Bulls
    { number: 41, name: 'ARVID LINDBLAD', team: 'Racing Bulls' },
    { number: 30, name: 'LIAM LAWSON', team: 'Racing Bulls' },
    // Sauber
    { number: 27, name: 'NICO HULKENBERG', team: 'Audi Racing' },
    { number: 5, name: 'GABRIEL BORTOLETO', team: 'Audi Racing' },
    // Haas
    { number: 87, name: 'OLIVER BEARMAN', team: 'Haas' },
    { number: 31, name: 'ESTEBAN OCON', team: 'Haas' },
    // Alpine
    { number: 10, name: 'PIERRE GASLY', team: 'Alpine' },
    { number: 43, name: 'FRANCO COLAPINTO', team: 'Alpine' },
    // Cadillac
    { number: 11, name: 'SERGIO PEREZ', team: 'Cadillac Racing'},
    { number: 77, name: 'VALTERRI BOTTAS', team: 'Cadillac Racing'}
];

// Driver image mapping
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

// Constructors Data
const constructors = [
    { name: 'Red Bull Racing', color: '#3671C6', logo: 'redbull.png' },
    { name: 'McLaren', color: '#FF8000', logo: 'mclaren.png' },
    { name: 'Ferrari', color: '#E8002D', logo: 'ferrari.png' },
    { name: 'Mercedes', color: '#27F4D2', logo: 'mercedes.png' },
    { name: 'Aston Martin', color: '#229971', logo: 'astonmartin.png' },
    { name: 'Alpine', color: '#FF87BC', logo: 'alpine.png' },
    { name: 'Williams', color: '#64C4FF', logo: 'williams.png' },
    { name: 'Racing Bulls', color: '#6692FF', logo: 'racingbulls.png' },
    { name: 'Audi Racing', color: '#52E252', logo: 'audi.png' },
    { name: 'Haas', color: '#B6BABD', logo: 'haas.png' },
    { name: 'Cadillac Racing', color: '#000000', logo: 'cadillac.png' }
];

// Questions structure
const questions = [
   // Position predictions (Selected positions only)
...[
    1, 2, 3, 4, 5,
    18, 19, 20, 21, 22
].map(position => ({
    id: `p${position}`,
    title: `F1 2026 Season - YOUR P${position}`,
    type: 'driver'
})),
    // Constructor predictions
    ...[1, 2, 3, 10, 11].map(position => ({
        id: `constructor_p${position}`,
        title: `F1 2026 Constructors Championship - P${position}`,
        type: 'constructor'
    })),
    // Special predictions
    { id: 'Flop', title: 'F1 2026 Season - Biggest Flop', type: 'driver', questionNumber: 'QUESTION 21 / 24' },
    { id: 'good', title: 'F1 2026 Season - Biggest Surprise', type: 'driver', questionNumber: 'QUESTION 22 / 24',},
    { id: 'dnf', title: 'F1 2026 Season - Driver Crashing the most', type: 'driver', questionNumber: 'QUESTION 23 / 24' },
    { id: 'fucked', title: 'F1 2026 Season - Driver getting booted mid season', type: 'driver', questionNumber: 'QUESTION 25 / 24' },
    { id: 'crazy', title: 'F1 2026 Season - Crazy Prediction', type: 'text', questionNumber: 'QUESTION 26 / 24' }
];

// Update questions count
questions.forEach((q, index) => {
    q.questionNumber = `QUESTION ${index + 1} / ${questions.length}`;
});

// State
let currentQuestion = 0;
let predictions = {
    participantName: '',
    timestamp: ''
};
let selectedDrivers = new Set();

// Initialize
function startPrediction() {
    const name = document.getElementById('participantName').value.trim();
    
    if (!name) {
        alert('Enter your name you fucking idiot');
        return;
    }
    
    predictions.participantName = name;
    predictions.timestamp = new Date().toISOString();
    document.getElementById('displayName').textContent = name;
    
    showScreen('predictionScreen');
    renderQuestionNavigation();
    showQuestion(0);
    
    // Add time input formatting
    setupTimeInputFormatting();
}

function setupTimeInputFormatting() {
    const timeInputSeconds = document.getElementById('timeInputSeconds');
    const timeInputMilliseconds = document.getElementById('timeInputMilliseconds');
    
    // Seconds input handling
    timeInputSeconds.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^\d]/g, ''); // Only allow digits
        
        // Limit to 2 digits
        if (value.length > 2) {
            value = value.slice(0, 2);
        }
        
        // Don't allow seconds greater than 59
        if (parseInt(value) > 59) {
            value = '59';
        }
        
        e.target.value = value;
        
        // Auto-focus to milliseconds when 2 digits entered
        if (value.length === 2) {
            timeInputMilliseconds.focus();
        }
    });
    
    // Milliseconds input handling
    timeInputMilliseconds.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^\d]/g, ''); // Only allow digits
        
        // Limit to 3 digits
        if (value.length > 3) {
            value = value.slice(0, 3);
        }
        
        e.target.value = value;
    });
    
    // Allow backspace to go back to seconds input
    timeInputMilliseconds.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && this.value.length === 0) {
            timeInputSeconds.focus();
            // Move cursor to end of seconds input
            setTimeout(() => {
                timeInputSeconds.setSelectionRange(timeInputSeconds.value.length, timeInputSeconds.value.length);
            }, 0);
        }
    });
    
    // Prevent invalid keys
    [timeInputSeconds, timeInputMilliseconds].forEach(input => {
        input.addEventListener('keydown', function(e) {
            // Allow backspace, delete, tab, escape, enter, and arrow keys
            if ([8, 9, 13, 27, 37, 38, 39, 40, 46].includes(e.keyCode) ||
                // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
                (e.ctrlKey && [65, 67, 86, 88, 90].includes(e.keyCode))) {
                return;
            }
            
            // Only allow numbers
            if (e.key && !/^\d$/.test(e.key)) {
                e.preventDefault();
            }
        });
    });
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    
    // Manage scroll restriction on mobile
    if (screenId === 'welcomeScreen') {
        document.body.classList.add('welcome-active');
    } else {
        document.body.classList.remove('welcome-active');
    }
}

function renderQuestionNavigation() {
    const questionNav = document.getElementById('questionNav');
    questionNav.innerHTML = '';
    
    questions.forEach((question, index) => {
        const navItem = document.createElement('div');
        navItem.className = 'question-nav-item';
        
        // Determine label based on question type
        let label = '';
        if (question.id.startsWith('constructor_p')) {
            label = `C${question.id.replace('constructor_p', '')}`;
        } else if (question.id.startsWith('p')) {
            label = `P${question.id.substring(1)}`;
        } else if (question.id === 'Flop') {
            label = 'Flop';
        } else if (question.id === 'fucked') {
            label = 'Fuck';
        } else if (question.id === 'dnf') {
            label = 'DNF';
        } else if (question.id === 'good') {
            label = 'Good';
        } else if (question.id === 'crazy') {
            label = 'Crazy';
        } else if (question.id === 'most_positions') {
            label = 'MOST';
        }
        
        navItem.textContent = label;
        navItem.onclick = () => navigateToQuestion(index);
        
        questionNav.appendChild(navItem);
    });
    
    updateQuestionNavigation();
}

function updateQuestionNavigation() {
    const navItems = document.querySelectorAll('.question-nav-item');
    
    navItems.forEach((item, index) => {
        item.classList.remove('active', 'completed');
        
        const question = questions[index];
        
        // Mark as completed if answered
        if (predictions[question.id]) {
            item.classList.add('completed');
        }
        
        // Mark current question as active
        if (index === currentQuestion) {
            item.classList.add('active');
            // Scroll into view
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    });
}



function navigateToQuestion(index) {
    // Allow navigation to any question without validation
    showQuestion(index);
}

function showQuestion(index) {
    currentQuestion = index;
    const question = questions[index];
    
    updateQuestionNavigation();
    
    // Update progress
    const progress = ((index + 1) / questions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    
    // Update question details
    document.getElementById('questionNumber').textContent = question.questionNumber;
    document.getElementById('questionTitle').textContent = question.title;
    
    // Show appropriate input type
    const driversGrid = document.getElementById('driversGrid');
    const timeInputContainer = document.getElementById('timeInputContainer');
    const textInputContainer = document.getElementById('textInputContainer');
    
    if (question.type === 'driver') {
        driversGrid.style.display = 'grid';
        timeInputContainer.style.display = 'none';
        if (textInputContainer) textInputContainer.style.display = 'none';
        renderDrivers(question.id);
    } else if (question.type === 'constructor') {
        driversGrid.style.display = 'grid';
        timeInputContainer.style.display = 'none';
        if (textInputContainer) textInputContainer.style.display = 'none';
        renderConstructors(question.id);
    } else if (question.type === 'text') {
        driversGrid.style.display = 'none';
        timeInputContainer.style.display = 'none';
        if (textInputContainer) {
            textInputContainer.style.display = 'block';
            const textInput = document.getElementById('crazyPredictionInput');
            textInput.value = predictions[question.id] || '';
            
            // Add event listener to save text as user types
            textInput.oninput = () => {
                predictions[question.id] = textInput.value;
                updateQuestionNavigation();
            };
        }
    } else {
        driversGrid.style.display = 'none';
        timeInputContainer.style.display = 'block';
        if (textInputContainer) textInputContainer.style.display = 'none';
        const timeInputSeconds = document.getElementById('timeInputSeconds');
        const timeInputMilliseconds = document.getElementById('timeInputMilliseconds');
        
        // Handle existing prediction value
        const existingValue = predictions[question.id];
        if (existingValue && existingValue.startsWith('1:')) {
            // Extract just the XX.XXX part
            const parts = existingValue.split(':');
            if (parts.length === 2) {
                const timeParts = parts[1].split('.');
                timeInputSeconds.value = timeParts[0] || '';
                timeInputMilliseconds.value = timeParts[1] || '';
            }
        } else {
            timeInputSeconds.value = '';
            timeInputMilliseconds.value = '';
        }
    }
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const nextBtnText = document.getElementById('nextBtnText');
    
    prevBtn.style.display = index > 0 ? 'block' : 'none';
    nextBtnText.textContent = index < questions.length - 1 ? 'NEXT →' : 'SUBMIT';
}

function renderDrivers(questionId) {
    const driversGrid = document.getElementById('driversGrid');
    driversGrid.innerHTML = '';
    
    // Filter out already selected drivers ONLY for race position predictions (P1-P20)
    // For special predictions (pole, fastest lap, most positions), show all drivers
    let availableDrivers = drivers;
    if (questionId.startsWith('p') && questionId.match(/^p\d+$/)) {
        // Only filter for P1, P2, ... P20 (not pole_driver, etc.)
        availableDrivers = drivers.filter(driver => 
            !selectedDrivers.has(driver.name) || predictions[questionId] === driver.name
        );
    }
    
    // Keep drivers in team order (as defined in the drivers array)
    const sortedDrivers = [...availableDrivers];
    
    sortedDrivers.forEach(driver => {
        const card = document.createElement('div');
        card.className = 'driver-card';
        
        if (predictions[questionId] === driver.name) {
            card.classList.add('selected');
        }
        
        // Better layout for mobile - horizontal card with driver info grouped
        card.innerHTML = `
            <div class="driver-header">
                <div class="driver-number">${driver.number}</div>
                <img src="driver pics/${driverImages[driver.name]}" alt="${driver.name}" class="driver-image">
            </div>
            <div class="driver-info">
                <div class="driver-name">${driver.name}</div>
                <div class="driver-team">${driver.team}</div>
            </div>
        `;
        
        card.onclick = () => selectDriver(questionId, driver.name);
        card.ondblclick = () => {
            selectDriver(questionId, driver.name);
            setTimeout(() => nextQuestion(), 100); // Small delay to show selection before moving
        };
        driversGrid.appendChild(card);
    });
}

function renderConstructors(questionId) {
    const driversGrid = document.getElementById('driversGrid');
    driversGrid.innerHTML = '';
    
    // Get already selected constructors for this championship
    const selectedConstructors = new Set();
    questions.forEach(q => {
        if (q.type === 'constructor' && predictions[q.id] && q.id !== questionId) {
            selectedConstructors.add(predictions[q.id]);
        }
    });
    
    // Filter out already selected constructors
    const availableConstructors = constructors.filter(constructor => 
        !selectedConstructors.has(constructor.name) || predictions[questionId] === constructor.name
    );
    
    availableConstructors.forEach(constructor => {
        const card = document.createElement('div');
        card.className = 'driver-card constructor-card';
        
        if (predictions[questionId] === constructor.name) {
            card.classList.add('selected');
        }
        
        card.innerHTML = `
            <div class="constructor-info">
                <img src="driver pics/${constructor.logo}" alt="${constructor.name}" class="constructor-logo">
                <div class="constructor-name">${constructor.name}</div>
            </div>
        `;
        
        card.onclick = () => selectConstructor(questionId, constructor.name);
        card.ondblclick = () => {
            selectConstructor(questionId, constructor.name);
            setTimeout(() => nextQuestion(), 100);
        };
        driversGrid.appendChild(card);
    });
}

function selectDriver(questionId, driverName) {
    // Remove previous selection for this question from the set (only for position predictions)
    if (predictions[questionId] && questionId.startsWith('p') && questionId.match(/^p\d+$/)) {
        selectedDrivers.delete(predictions[questionId]);
    }
    
    // Add new selection
    predictions[questionId] = driverName;
    if (questionId.startsWith('p') && questionId.match(/^p\d+$/)) {
        selectedDrivers.add(driverName);
    }
    
    // Re-render drivers to show selection
    renderDrivers(questionId);
    
    // Update navigation bar to show completion
    updateQuestionNavigation();
}

function selectConstructor(questionId, constructorName) {
    // Add new selection
    predictions[questionId] = constructorName;
    
    // Re-render constructors to show selection
    renderConstructors(questionId);
    
    // Update navigation bar to show completion
    updateQuestionNavigation();
}

function allQuestionsAnswered() {
    return questions.every(question => {
        const answer = predictions[question.id];
        if (!answer) return false;
        // For text questions, check if the answer is not just whitespace
        if (question.type === 'text') {
            return answer.trim().length > 0;
        }
        return true;
    });
}

function nextQuestion() {
    const question = questions[currentQuestion];
    
    // Validate current question
    if (question.type === 'driver') {
        if (!predictions[question.id]) {
            alert('nigga select a driver before moving on');
            return;
        }
    } else if (question.type === 'constructor') {
        if (!predictions[question.id]) {
            alert('Please select a constructor');
            return;
        }
    } else if (question.type === 'text') {
        const textInput = document.getElementById('crazyPredictionInput').value.trim();
        if (!textInput) {
            alert('Enter your crazy prediction you fucking donkey');
            return;
        }
        predictions[question.id] = textInput;
        updateQuestionNavigation();
    } else {
        const timeInputSeconds = document.getElementById('timeInputSeconds').value.trim();
        const timeInputMilliseconds = document.getElementById('timeInputMilliseconds').value.trim();
        
        if (!timeInputSeconds || !timeInputMilliseconds) {
            alert('dont be a retard');
            return;
        }
        if (!validateTime(timeInputSeconds + '.' + timeInputMilliseconds)) {
            alert('valid time stupid imbecile (seconds: 00-59, milliseconds: 000-999)');
            return;
        }
        predictions[question.id] = '1:' + timeInputSeconds + '.' + timeInputMilliseconds;
        updateQuestionNavigation();
    }
    
    // Move to next question or submit
    if (currentQuestion < questions.length - 1) {
        showQuestion(currentQuestion + 1);
    } else {
        // Check if all questions are answered before submitting
        if (!allQuestionsAnswered()) {
            alert('Get yo ass back here and submit all questions before leaving stupid nigga');
            return;
        }
        submitPredictions();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        showQuestion(currentQuestion - 1);
    }
}

function validateTime(time) {
    // Format: SS.mmm (seconds.milliseconds)
    const pattern = /^\d{2}\.\d{3}$/;
    return pattern.test(time);
}

async function submitPredictions() {
    try {
        // Show loading state
        const nextBtn = document.getElementById('nextBtn');
        const originalText = nextBtn.innerHTML;
        nextBtn.innerHTML = '<span>SUBMITTING...</span>';
        nextBtn.disabled = true;
        
        // Prepare data for Google Sheets
        const submissionData = {
            participantName: predictions.participantName,
            timestamp: predictions.timestamp,
            ...predictions
        };
        
        // Submit to Google Sheets
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionData)
        });
        
        // Show success screen
        document.getElementById('successName').textContent = predictions.participantName;
        showScreen('successScreen');
        
    } catch (error) {
        console.error('Error submitting predictions:', error);
        alert('Theres something wrong niggs. stfu try again.');
        
        // Restore button
        const nextBtn = document.getElementById('nextBtn');
        nextBtn.innerHTML = originalText;
        nextBtn.disabled = false;
    }
}

function resetForm() {
    // Reset all state
    currentQuestion = 0;
    predictions = {
        participantName: '',
        timestamp: ''
    };
    selectedDrivers.clear();
    
    // Clear inputs
    document.getElementById('participantName').value = '';
    
    // Show welcome screen
    showScreen('welcomeScreen');
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const activeScreen = document.querySelector('.screen.active');
        if (activeScreen.id === 'welcomeScreen') {
            startPrediction();
        } else if (activeScreen.id === 'predictionScreen') {
            nextQuestion();
        }
    }
});
