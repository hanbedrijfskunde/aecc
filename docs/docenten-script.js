/* ==========================================
   Docenten Portal JavaScript
   ========================================== */

// ==========================================
// Timer Variables
// ==========================================
let timerInterval = null;
let timerSeconds = 0;
let totalSeconds = 0;
let currentPhase = null;
let isPaused = false;

// ==========================================
// Week Planner Functions
// ==========================================
function showWeekPlan(weekNumber) {
    // Remove active class from all tabs and plans
    document.querySelectorAll('.week-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Add active class to selected tab
    const selectedTab = document.querySelector(`.week-tab[data-week="${weekNumber}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Load and display week content from ContentLoader
    loadAndDisplayWeekContent(weekNumber);
}

async function loadAndDisplayWeekContent(weekNumber) {
    const weekContentContainer = document.getElementById('week-content');
    
    try {
        // Ensure content is loaded
        if (!window.contentLoader) {
            console.error('ContentLoader not available');
            showLoadingMessage(weekContentContainer, weekNumber);
            return;
        }
        
        await window.contentLoader.loadContent();
        const weekData = window.contentLoader.getWeek(weekNumber);
        
        if (!weekData) {
            showErrorMessage(weekContentContainer, weekNumber);
            return;
        }
        
        // Render the week content for teachers
        weekContentContainer.innerHTML = renderTeacherWeekContent(weekData);
        
    } catch (error) {
        console.error('Error loading week content:', error);
        showErrorMessage(weekContentContainer, weekNumber);
    }
}

function renderTeacherWeekContent(week) {
    return `
        <div class="week-plan active" data-week="${week.number}">
            <h3>Week ${week.number}: ${week.title}</h3>
            
            <!-- WAAROM/HOE/WAT Structure for Teachers -->
            <div class="teacher-whw">
                <div class="whw-section waarom">
                    <h4>WAAROM - Didactische Rationale</h4>
                    <p>${week.waarom}</p>
                    
                    ${week.docentNotes ? `
                        <div class="teaching-notes">
                            <h5>Docent Aandachtspunten:</h5>
                            <ul>
                                ${week.docentNotes.map(note => `<li>${note}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
                
                <div class="whw-section hoe">
                    <h4>HOE - Lesstructuur</h4>
                    <div class="lesson-phases">
                        <div class="phase voor">
                            <h5>VOOR (Voorbereiding)</h5>
                            <ul>
                                ${week.hoe.zelfstudie.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="phase tijdens">
                            <h5>TIJDENS (Werkcollege)</h5>
                            <ul>
                                ${week.hoe.werkcollege.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="whw-section wat">
                    <h4>WAT - Deliverables & Assessment</h4>
                    <div class="deliverables-section">
                        <h5>Verwachte Deliverables:</h5>
                        <ul>
                            ${week.wat.deliverables.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                        <div class="assessment-criteria">
                            <h5>Assessment Focus:</h5>
                            <p>${week.wat.assessment}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            ${week.aiPrompt ? `
                <div class="ai-prompt-section">
                    <h4>🤖 AI Prompt voor Studenten</h4>
                    <div class="prompt-container">
                        <p class="prompt-text">${escapeHtml(week.aiPrompt)}</p>
                        <button class="copy-prompt" data-prompt="${escapeForAttribute(week.aiPrompt)}" onclick="copyPromptFromButton(this)">
                            📋 Kopieer Prompt
                        </button>
                    </div>
                </div>
            ` : ''}
            
            <!-- Placeholder for other existing content like timing tools -->
            <div class="lesson-tools">
                <h4>🛠️ Les Tools</h4>
                <p>Boardroom Timer en andere tools blijven beschikbaar ongeacht de geselecteerde week.</p>
            </div>
        </div>
    `;
}

// Helper functions for safe HTML rendering
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function escapeForAttribute(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r');
}

function copyPromptFromButton(buttonElement) {
    const promptText = buttonElement.getAttribute('data-prompt');
    if (!promptText) {
        console.error('No prompt text found');
        return;
    }
    
    navigator.clipboard.writeText(promptText).then(() => {
        // Show feedback
        const originalText = buttonElement.textContent;
        buttonElement.textContent = '✅ Gekopieerd!';
        setTimeout(() => {
            buttonElement.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Could not copy text: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = promptText;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            const originalText = buttonElement.textContent;
            buttonElement.textContent = '✅ Gekopieerd!';
            setTimeout(() => {
                buttonElement.textContent = originalText;
            }, 2000);
        } catch (err) {
            console.error('Fallback copy failed', err);
        }
        document.body.removeChild(textArea);
    });
}

function showLoadingMessage(container, weekNumber) {
    container.innerHTML = `
        <div class="week-plan active" data-week="${weekNumber}">
            <h3>Week ${weekNumber}: Inhoud wordt geladen...</h3>
            <div class="loading-message">
                <p>📚 Content wordt geladen vanaf content.json...</p>
            </div>
        </div>
    `;
}

function showErrorMessage(container, weekNumber) {
    container.innerHTML = `
        <div class="week-plan active" data-week="${weekNumber}">
            <h3>Week ${weekNumber}: Fout bij laden</h3>
            <div class="error-message">
                <p>❌ Kon weekinhoud niet laden. Controleer of content.json beschikbaar is.</p>
                <button onclick="loadAndDisplayWeekContent(${weekNumber})" class="retry-btn">
                    🔄 Probeer opnieuw
                </button>
            </div>
        </div>
    `;
}

function copyPromptToClipboard(promptText, buttonElement) {
    // If buttonElement is not passed, try to get it from event
    if (!buttonElement && window.event) {
        buttonElement = window.event.target;
    }
    
    navigator.clipboard.writeText(promptText).then(() => {
        // Show feedback
        if (buttonElement) {
            const originalText = buttonElement.textContent;
            buttonElement.textContent = '✅ Gekopieerd!';
            setTimeout(() => {
                buttonElement.textContent = originalText;
            }, 2000);
        }
    }).catch(err => {
        console.error('Could not copy text: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = promptText;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            if (buttonElement) {
                const originalText = buttonElement.textContent;
                buttonElement.textContent = '✅ Gekopieerd!';
                setTimeout(() => {
                    buttonElement.textContent = originalText;
                }, 2000);
            }
        } catch (err) {
            console.error('Fallback copy failed', err);
        }
        document.body.removeChild(textArea);
    });
}

// ==========================================
// Boardroom Timer Functions
// ==========================================
function setTimerPhase(phase, minutes) {
    currentPhase = phase;
    totalSeconds = minutes * 60;
    timerSeconds = totalSeconds;
    isPaused = false;
    
    // Update phase buttons to show active
    document.querySelectorAll('.phase-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update display
    updateTimerDisplay();
    
    // Update phase name
    const phaseNames = {
        'intro': 'Introductie',
        'pitch': 'Pitches',
        'discussion': 'Discussie',
        'consensus': 'Consensus',
        'documentation': 'Documentatie'
    };
    
    const timerText = document.querySelector('.timer-text tspan:last-child');
    if (timerText) {
        timerText.textContent = phaseNames[phase] || 'Timer';
    }
}

function setCustomTimer() {
    const customMinutes = document.getElementById('customMinutes').value;
    if (customMinutes && customMinutes > 0) {
        currentPhase = 'custom';
        totalSeconds = customMinutes * 60;
        timerSeconds = totalSeconds;
        isPaused = false;
        
        // Remove active from phase buttons
        document.querySelectorAll('.phase-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Update display
        updateTimerDisplay();
        
        // Update phase name
        const timerText = document.querySelector('.timer-text tspan:last-child');
        if (timerText) {
            timerText.textContent = `Custom: ${customMinutes} min`;
        }
    }
}

function startTimer() {
    if (timerSeconds === 0) {
        // No timer set, use default 15 minutes
        timerSeconds = 900;
        totalSeconds = 900;
    }
    
    isPaused = false;
    
    // Clear any existing interval
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Start new interval
    timerInterval = setInterval(() => {
        if (!isPaused && timerSeconds > 0) {
            timerSeconds--;
            updateTimerDisplay();
            
            // Check for warnings
            if (timerSeconds === 300) { // 5 minutes warning
                showTimerWarning('5 minuten resterend!');
            } else if (timerSeconds === 60) { // 1 minute warning
                showTimerWarning('1 minuut resterend!');
            } else if (timerSeconds === 0) { // Time's up
                timerComplete();
            }
        }
    }, 1000);
}

function pauseTimer() {
    isPaused = !isPaused;
    const pauseBtn = document.querySelector('.timer-btn.pause');
    if (pauseBtn) {
        pauseBtn.textContent = isPaused ? '▶️ Hervat' : '⏸️ Pauze';
    }
}

function resetTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    timerSeconds = totalSeconds;
    isPaused = false;
    updateTimerDisplay();
    
    const pauseBtn = document.querySelector('.timer-btn.pause');
    if (pauseBtn) {
        pauseBtn.textContent = '⏸️ Pauze';
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // Update text
    const timerTextElement = document.querySelector('.timer-text tspan:first-child');
    if (timerTextElement) {
        timerTextElement.textContent = timeString;
    }
    
    // Update progress circle
    const progressCircle = document.querySelector('.timer-progress');
    if (progressCircle && totalSeconds > 0) {
        const circumference = 2 * Math.PI * 90; // radius is 90
        const progress = timerSeconds / totalSeconds;
        const dashOffset = circumference * (1 - progress);
        progressCircle.style.strokeDashoffset = dashOffset;
        
        // Change color based on time remaining
        if (timerSeconds <= 60) {
            progressCircle.style.stroke = '#E63946'; // Red for last minute
        } else if (timerSeconds <= 300) {
            progressCircle.style.stroke = '#FFD700'; // Yellow for last 5 minutes
        } else {
            progressCircle.style.stroke = '#8FD14F'; // Green for normal
        }
    }
}

function ringBell() {
    // Create bell sound effect
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create oscillator for bell sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800; // Bell frequency
    oscillator.type = 'sine';
    
    // Create envelope for bell sound
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
    
    // Visual feedback
    const bellBtn = document.querySelector('.timer-btn.bell');
    if (bellBtn) {
        bellBtn.style.animation = 'shake 0.5s';
        setTimeout(() => {
            bellBtn.style.animation = '';
        }, 500);
    }
}

function showTimerWarning(message) {
    // Create warning notification
    const warning = document.createElement('div');
    warning.className = 'timer-warning';
    warning.textContent = message;
    warning.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #FFD700;
        color: #2C3E50;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(warning);
    
    // Ring bell for warning
    ringBell();
    
    // Remove after 3 seconds
    setTimeout(() => {
        warning.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => warning.remove(), 300);
    }, 3000);
}

function timerComplete() {
    // Stop timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Ring bell multiple times
    ringBell();
    setTimeout(ringBell, 300);
    setTimeout(ringBell, 600);
    
    // Show completion message
    showTimerWarning('⏰ Tijd is om! Fase voltooid.');
    
    // Update display
    const timerText = document.querySelector('.timer-text tspan:last-child');
    if (timerText) {
        timerText.textContent = 'Voltooid!';
    }
}

// ==========================================
// Quick Action Functions
// ==========================================
function startBoardroomTimer() {
    // Set default boardroom timer (90 minutes)
    currentPhase = 'boardroom';
    totalSeconds = 90 * 60;
    timerSeconds = totalSeconds;
    isPaused = false;
    
    updateTimerDisplay();
    startTimer();
    
    // Scroll to timer section
    document.querySelector('.timer-section').scrollIntoView({ behavior: 'smooth' });
}

function openInterventions() {
    // Scroll to interventions section
    const interventionSection = document.querySelector('.didactic-tools');
    if (interventionSection) {
        interventionSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function openRubrics() {
    // This would open assessment rubrics
    alert('Assessment rubrics worden geopend...');
    // In production, this would open a modal or navigate to rubrics
}

function generateEventCard() {
    const events = [
        {
            title: "Plotselinge Marktschok",
            description: "Een grote concurrent heeft zojuist een disruptieve technologie aangekondigd. Hoe reageren jullie?",
            focus: "Explore vs Exploit"
        },
        {
            title: "Investeerder Druk",
            description: "Activistische aandeelhouders eisen 20% hogere dividenden. Wat is jullie reactie?",
            focus: "Buyback vs Investeren"
        },
        {
            title: "Talent Oorlog",
            description: "Drie key employees dreigen over te stappen naar een startup. Hoe behouden jullie ze?",
            focus: "Korte vs Lange termijn"
        },
        {
            title: "Regulatory Change",
            description: "Nieuwe wetgeving vereist grote compliance investeringen. Hoe financieren jullie dit?",
            focus: "Operationeel vs Strategisch"
        },
        {
            title: "Partnership Opportunity",
            description: "Een tech giant biedt een exclusieve partnership aan, maar eist 30% van de opbrengsten.",
            focus: "Autonomie vs Groei"
        }
    ];
    
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    
    // Create modal for event card
    const modalHTML = `
        <div class="modal-overlay" id="eventModal">
            <div class="modal-content event-card-modal">
                <button class="modal-close" onclick="closeEventModal()">×</button>
                <div class="event-card">
                    <h2>🎲 Random Event Card</h2>
                    <div class="event-content">
                        <h3>${randomEvent.title}</h3>
                        <p class="event-description">${randomEvent.description}</p>
                        <div class="event-focus">
                            <strong>Focus:</strong> ${randomEvent.focus}
                        </div>
                    </div>
                    <div class="event-instructions">
                        <h4>Instructies voor gebruik:</h4>
                        <ol>
                            <li>Introduceer dit event halverwege de discussie</li>
                            <li>Geef teams 5 minuten om te reageren</li>
                            <li>Observeer hoe rollen reageren op de crisis</li>
                            <li>Gebruik als basis voor feedback</li>
                        </ol>
                    </div>
                    <button class="btn-primary" onclick="generateEventCard()">
                        🎲 Nieuwe Event Card
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('eventModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeEventModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.remove();
    }
}

// ==========================================
// Schedule Management
// ==========================================
function updateScheduleProgress() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    const scheduleItems = document.querySelectorAll('.timeline-item');
    scheduleItems.forEach(item => {
        const timeText = item.querySelector('.time').textContent;
        const [hours, minutes] = timeText.split(':').map(Number);
        const itemTime = hours * 60 + minutes;
        
        if (currentTime >= itemTime) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// ==========================================
// Initialize on Page Load
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Update schedule progress
    updateScheduleProgress();
    setInterval(updateScheduleProgress, 60000); // Update every minute
    
    // Initialize timer display
    updateTimerDisplay();
    
    // Initialize navigation
    updateProgress();
    setupEnhancedKeyboardShortcuts();
    
    // Initialize notes
    loadNotesList();
    
    // Add keyboard shortcuts for timer controls
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case ' ': // Ctrl+Space to start/pause timer
                    e.preventDefault();
                    if (isPaused || !timerInterval) {
                        startTimer();
                    } else {
                        pauseTimer();
                    }
                    break;
                case 'r': // Ctrl+R to reset timer
                    e.preventDefault();
                    resetTimer();
                    break;
                case 'b': // Ctrl+B to ring bell
                    e.preventDefault();
                    ringBell();
                    break;
            }
        }
    });
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s;
        }
        
        .modal-content {
            background: white;
            border-radius: var(--radius-xl);
            padding: var(--space-2xl);
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            animation: slideUp 0.3s;
        }
        
        .modal-close {
            position: absolute;
            top: var(--space-md);
            right: var(--space-md);
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: var(--text-medium);
            transition: color var(--transition-base);
        }
        
        .modal-close:hover {
            color: var(--accent-red);
        }
        
        .event-card h2 {
            color: var(--primary-green);
            margin-bottom: var(--space-xl);
        }
        
        .event-card h3 {
            color: var(--accent-red);
            margin-bottom: var(--space-md);
        }
        
        .event-description {
            font-size: 1.1rem;
            line-height: 1.6;
            color: var(--text-dark);
            margin-bottom: var(--space-lg);
            padding: var(--space-lg);
            background: var(--background-grey);
            border-radius: var(--radius-md);
        }
        
        .event-focus {
            background: rgba(143, 209, 79, 0.1);
            padding: var(--space-md);
            border-radius: var(--radius-md);
            color: var(--primary-green);
            font-size: 1rem;
            margin-bottom: var(--space-xl);
        }
        
        .event-instructions {
            background: rgba(230, 57, 70, 0.05);
            padding: var(--space-lg);
            border-radius: var(--radius-md);
            margin-bottom: var(--space-xl);
        }
        
        .event-instructions h4 {
            color: var(--accent-red);
            margin-bottom: var(--space-md);
        }
        
        .event-instructions ol {
            padding-left: var(--space-xl);
            line-height: 1.8;
        }
        
        .btn-primary {
            background: var(--primary-green);
            color: white;
            border: none;
            padding: var(--space-md) var(--space-xl);
            border-radius: var(--radius-md);
            cursor: pointer;
            font-weight: 600;
            transition: all var(--transition-base);
            font-size: 1rem;
        }
        
        .btn-primary:hover {
            background: var(--primary-green-dark);
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    console.log('Docenten portal initialized successfully');
});

// ==========================================
// Assessment Functions
// ==========================================
function calculateWeightedScore() {
    // Get all score inputs
    const individualScore = parseFloat(document.getElementById('individualScore').value) || 0;
    const teamScore = parseFloat(document.getElementById('teamScore').value) || 0;
    const decisionScore = parseFloat(document.getElementById('decisionScore').value) || 0;
    const presentationScore = parseFloat(document.getElementById('presentationScore').value) || 0;
    
    // Calculate weighted average (each component is 25%)
    const weightedScore = (individualScore * 0.25) + (teamScore * 0.25) + 
                         (decisionScore * 0.25) + (presentationScore * 0.25);
    
    // Display the result
    const resultElement = document.getElementById('weightedResult');
    if (resultElement) {
        resultElement.textContent = `Gewogen Gemiddelde: ${weightedScore.toFixed(1)}/10`;
        
        // Add color coding based on score
        if (weightedScore >= 7.5) {
            resultElement.style.color = '#8FD14F'; // Green for good
        } else if (weightedScore >= 5.5) {
            resultElement.style.color = '#FFD700'; // Yellow for pass
        } else {
            resultElement.style.color = '#E63946'; // Red for fail
        }
    }
    
    // Update visual distribution chart
    updateGradeDistribution(individualScore, teamScore, decisionScore, presentationScore);
    
    return weightedScore;
}

function updateGradeDistribution(individual, team, decision, presentation) {
    // Update the bar chart heights
    const bars = document.querySelectorAll('.distribution-bar');
    const scores = [individual, team, decision, presentation];
    
    bars.forEach((bar, index) => {
        if (scores[index]) {
            const percentage = (scores[index] / 10) * 100;
            bar.style.height = `${percentage}%`;
            
            // Update the value display
            const valueElement = bar.querySelector('.bar-value');
            if (valueElement) {
                valueElement.textContent = scores[index].toFixed(1);
            }
        }
    });
}

function saveAssessment() {
    // Collect all assessment data
    const assessmentData = {
        timestamp: new Date().toISOString(),
        week: document.querySelector('.week-tab.active')?.dataset.week || '1',
        scores: {
            individual: parseFloat(document.getElementById('individualScore').value) || 0,
            team: parseFloat(document.getElementById('teamScore').value) || 0,
            decision: parseFloat(document.getElementById('decisionScore').value) || 0,
            presentation: parseFloat(document.getElementById('presentationScore').value) || 0,
            weighted: calculateWeightedScore()
        },
        checklist: collectChecklistData(),
        rubrics: collectRubricData(),
        notes: document.getElementById('assessmentNotes')?.value || ''
    };
    
    // Save to localStorage
    const savedAssessments = JSON.parse(localStorage.getItem('docentenAssessments') || '[]');
    savedAssessments.push(assessmentData);
    localStorage.setItem('docentenAssessments', JSON.stringify(savedAssessments));
    
    // Show success message
    showNotification('✅ Beoordeling opgeslagen!', 'success');
    
    return assessmentData;
}

function collectChecklistData() {
    const checklist = {};
    const checkboxes = document.querySelectorAll('.assessment-checklist input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checklist[checkbox.id] = checkbox.checked;
    });
    return checklist;
}

function collectRubricData() {
    const rubrics = {};
    const rubricSelections = document.querySelectorAll('.rubric-table input[type="radio"]:checked');
    rubricSelections.forEach(radio => {
        const criterion = radio.name;
        rubrics[criterion] = radio.value;
    });
    return rubrics;
}

function exportAssessment() {
    const assessmentData = saveAssessment();
    
    // Create a formatted text document
    const exportContent = `
ALGEMENE ECONOMIE C-CLUSTER
BEOORDELINGSFORMULIER
========================

Datum: ${new Date().toLocaleDateString('nl-NL')}
Tijd: ${new Date().toLocaleTimeString('nl-NL')}
Week: ${assessmentData.week}

SCORES
------
Individuele Analyse: ${assessmentData.scores.individual}/10
Team Performance: ${assessmentData.scores.team}/10
Besluitkwaliteit: ${assessmentData.scores.decision}/10
Presentatie: ${assessmentData.scores.presentation}/10

GEWOGEN GEMIDDELDE: ${assessmentData.scores.weighted.toFixed(1)}/10

CHECKLIST
---------
${Object.entries(assessmentData.checklist).map(([key, value]) => 
    `${value ? '✅' : '❌'} ${key.replace(/([A-Z])/g, ' $1').trim()}`
).join('\n')}

RUBRIC SCORES
------------
${Object.entries(assessmentData.rubrics).map(([criterion, level]) => 
    `${criterion}: ${level}`
).join('\n')}

NOTITIES
--------
${assessmentData.notes}

========================
Gegenereerd door AEC Docenten Portal
`;
    
    // Create blob and download
    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beoordeling_week${assessmentData.week}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('📥 Beoordeling geëxporteerd!', 'success');
}

function emailAssessment() {
    const assessmentData = saveAssessment();
    
    // Create email content
    const subject = `AEC Beoordeling - Week ${assessmentData.week}`;
    const body = `
Beste collega,

Hierbij de beoordeling voor Week ${assessmentData.week}:

SCORES:
- Individuele Analyse: ${assessmentData.scores.individual}/10
- Team Performance: ${assessmentData.scores.team}/10
- Besluitkwaliteit: ${assessmentData.scores.decision}/10
- Presentatie: ${assessmentData.scores.presentation}/10

Gewogen Gemiddelde: ${assessmentData.scores.weighted.toFixed(1)}/10

Met vriendelijke groet,
AEC Docenten Team
    `.trim();
    
    // Open email client with pre-filled content
    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    
    showNotification('📧 Email client geopend!', 'info');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style based on type
    const colors = {
        success: '#8FD14F',
        error: '#E63946',
        warning: '#FFD700',
        info: '#4A9FFF'
    };
    
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-weight: 600;
        z-index: 1000;
        animation: slideInUp 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideOutDown {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// ==========================================
// Teacher Notes Functions
// ==========================================
let currentNoteTab = 'general';
let currentIncidentTag = null;
let savedNotes = [];

function switchNoteTab(tabName) {
    // Update tabs
    document.querySelectorAll('.note-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update panels
    document.querySelectorAll('.note-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(tabName + '-notes').classList.add('active');
    
    currentNoteTab = tabName;
}

function addTimestamp(textareaId) {
    const textarea = document.getElementById(textareaId);
    if (textarea) {
        const timestamp = new Date().toLocaleTimeString('nl-NL', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        const currentText = textarea.value;
        textarea.value = currentText + (currentText ? '\n' : '') + `[${timestamp}] `;
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
}

function saveNotes(type) {
    let noteContent = '';
    let noteMetadata = {
        type: type,
        timestamp: new Date().toISOString(),
        week: currentWeek,
        starred: false
    };
    
    switch(type) {
        case 'general':
            noteContent = document.getElementById('generalNotesArea').value;
            break;
        case 'team':
            const teamSelect = document.getElementById('teamSelect');
            noteContent = document.getElementById('teamNotesArea').value;
            noteMetadata.team = teamSelect.value;
            break;
        case 'individual':
            const studentName = document.getElementById('studentName').value;
            const roleSelect = document.getElementById('roleSelect').value;
            noteContent = document.getElementById('individualNotesArea').value;
            noteMetadata.student = studentName;
            noteMetadata.role = roleSelect;
            break;
        case 'incident':
            noteContent = document.getElementById('incidentNotesArea').value;
            noteMetadata.tag = currentIncidentTag;
            break;
    }
    
    if (noteContent.trim()) {
        const note = {
            ...noteMetadata,
            content: noteContent,
            id: Date.now()
        };
        
        savedNotes.push(note);
        localStorage.setItem('teacherNotes', JSON.stringify(savedNotes));
        
        // Clear the textarea
        const textareaId = type === 'general' ? 'generalNotesArea' : 
                          type === 'team' ? 'teamNotesArea' : 
                          type === 'individual' ? 'individualNotesArea' : 
                          'incidentNotesArea';
        document.getElementById(textareaId).value = '';
        
        // Update notes list
        loadNotesList();
        
        showNotification('✅ Notitie opgeslagen!', 'success');
    } else {
        showNotification('⚠️ Voeg eerst tekst toe', 'warning');
    }
}

function loadTeamNotes(teamId) {
    // Load notes for specific team from localStorage
    const teamNotes = savedNotes.filter(note => 
        note.type === 'team' && note.team === teamId
    );
    
    if (teamNotes.length > 0) {
        // Show most recent note
        document.getElementById('teamNotesArea').value = teamNotes[0].content;
    } else {
        document.getElementById('teamNotesArea').value = '';
    }
}

function tagIncident(tag) {
    // Update active tag
    document.querySelectorAll('.tag-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    currentIncidentTag = tag;
}

function useTemplate(templateType) {
    const templates = {
        roleConsistency: `Rol Consistentie Observatie\n========================\nStudent: [naam]\nRol: [CEO/CFO/COO/CIO]\n\nRolvastheid:\n- Blijft bij rol perspectief: [ja/nee]\n- Gebruikt rol-specifieke argumenten: [voorbeelden]\n- Conflicten met andere rollen: [beschrijving]\n\nVerbeterpunten:\n- `,
        conflictResolution: `Conflict Oplossing Observatie\n=============================\nTeam: [nummer]\nTijd: [timestamp]\n\nConflict type:\n- [ ] Exploit vs Explore\n- [ ] Korte vs Lange termijn\n- [ ] Kapitaal allocatie\n\nOplossing strategie:\n- Compromis bereikt: [ja/nee]\n- CEO rol in mediatie: [beschrijving]\n- Consensus niveau: [1-10]\n\nNotities:\n`,
        decisionQuality: `Besluit Kwaliteit Observatie\n============================\nBesluit: [beschrijving]\n\nKwaliteitscriteria:\n- Data-onderbouwd: [score 1-5]\n- Stakeholder overweging: [score 1-5]\n- Risico analyse: [score 1-5]\n- Implementeerbaarheid: [score 1-5]\n\nStrategische alignment:\n- Past bij bedrijfsstrategie: [ja/nee]\n- Trade-offs benoemd: [ja/nee]\n\nOpmerkingen:\n`,
        teamDynamics: `Team Dynamiek Observatie\n========================\nTeam: [nummer]\n\nCommunicatie:\n- Actieve luisteren: [score 1-5]\n- Respectvolle discussie: [score 1-5]\n- Gelijke participatie: [score 1-5]\n\nLeadership:\n- CEO effectiviteit: [beschrijving]\n- Natuurlijke leiders: [namen]\n- Dominante stemmen: [namen]\n\nVerbeterpunten:\n`,
        aiIntegration: `AI Integratie Observatie\n========================\nTeam: [nummer]\n\nAI Gebruik:\n- Kritisch naar AI output: [ja/nee]\n- AI als tool niet als antwoord: [voorbeelden]\n- Eigen interpretatie toegevoegd: [voorbeelden]\n\nKwaliteit van integratie:\n- Selectief in AI gebruik: [score 1-5]\n- Context toegevoegd: [score 1-5]\n- Kritische vragen gesteld: [voorbeelden]\n\nNotities:\n`,
        triangleBalance: `Driehoek Balans Observatie\n==========================\nTeam: [nummer]\n\nStrategie keuze:\n- [ ] Exploit focus (COO)\n- [ ] Explore focus (CIO)\n- [ ] Buyback focus (CFO)\n- [ ] Gebalanceerd\n\nArgumentatie:\n- Exploit argumenten: [lijst]\n- Explore argumenten: [lijst]\n- Buyback argumenten: [lijst]\n\nUiteindelijke balans:\n- Consensus bereikt: [ja/nee]\n- Compromis type: [beschrijving]\n\nReflectie:\n`
    };
    
    const activePanel = document.querySelector('.note-panel.active textarea');
    if (activePanel && templates[templateType]) {
        activePanel.value = templates[templateType];
        activePanel.focus();
    }
}

function loadNotesList() {
    const notesList = document.getElementById('notesList');
    if (!notesList) return;
    
    // Load from localStorage
    const stored = localStorage.getItem('teacherNotes');
    if (stored) {
        savedNotes = JSON.parse(stored);
    }
    
    // Sort by date (newest first)
    savedNotes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Generate HTML
    const notesHTML = savedNotes.slice(0, 10).map(note => `
        <div class="note-item" data-id="${note.id}">
            <div class="note-header">
                <span class="note-date">${new Date(note.timestamp).toLocaleString('nl-NL')}</span>
                <span class="note-type">${note.type}</span>
                <button class="star-btn ${note.starred ? 'starred' : ''}" onclick="toggleStar(${note.id})">
                    ${note.starred ? '⭐' : '☆'}
                </button>
            </div>
            <div class="note-preview">
                ${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}
            </div>
            <div class="note-footer">
                <button class="expand-btn" onclick="expandNote(${note.id})">Meer →</button>
                <button class="edit-btn" onclick="editNote(${note.id})">✏️</button>
                <button class="delete-btn" onclick="deleteNote(${note.id})">🗑️</button>
            </div>
        </div>
    `).join('');
    
    notesList.innerHTML = notesHTML || '<p style="text-align: center; color: #999;">Nog geen notities opgeslagen</p>';
}

function filterNotes(filter) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    let filteredNotes = [...savedNotes];
    const today = new Date();
    
    switch(filter) {
        case 'today':
            filteredNotes = savedNotes.filter(note => {
                const noteDate = new Date(note.timestamp);
                return noteDate.toDateString() === today.toDateString();
            });
            break;
        case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            filteredNotes = savedNotes.filter(note => 
                new Date(note.timestamp) >= weekAgo
            );
            break;
        case 'starred':
            filteredNotes = savedNotes.filter(note => note.starred);
            break;
    }
    
    // Update display with filtered notes
    displayFilteredNotes(filteredNotes);
}

function displayFilteredNotes(notes) {
    const notesList = document.getElementById('notesList');
    if (!notesList) return;
    
    const notesHTML = notes.slice(0, 10).map(note => `
        <div class="note-item" data-id="${note.id}">
            <div class="note-header">
                <span class="note-date">${new Date(note.timestamp).toLocaleString('nl-NL')}</span>
                <span class="note-type">${note.type}</span>
                <button class="star-btn ${note.starred ? 'starred' : ''}" onclick="toggleStar(${note.id})">
                    ${note.starred ? '⭐' : '☆'}
                </button>
            </div>
            <div class="note-preview">
                ${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}
            </div>
            <div class="note-footer">
                <button class="expand-btn" onclick="expandNote(${note.id})">Meer →</button>
                <button class="edit-btn" onclick="editNote(${note.id})">✏️</button>
                <button class="delete-btn" onclick="deleteNote(${note.id})">🗑️</button>
            </div>
        </div>
    `).join('');
    
    notesList.innerHTML = notesHTML || '<p style="text-align: center; color: #999;">Geen notities gevonden</p>';
}

function toggleStar(noteId) {
    const note = savedNotes.find(n => n.id === noteId);
    if (note) {
        note.starred = !note.starred;
        localStorage.setItem('teacherNotes', JSON.stringify(savedNotes));
        loadNotesList();
    }
}

function expandNote(noteId) {
    const note = savedNotes.find(n => n.id === noteId);
    if (note) {
        alert(note.content); // In production, this would open a modal
    }
}

function editNote(noteId) {
    const note = savedNotes.find(n => n.id === noteId);
    if (note) {
        // Load note into appropriate textarea
        const textareaId = note.type === 'general' ? 'generalNotesArea' : 
                          note.type === 'team' ? 'teamNotesArea' : 
                          note.type === 'individual' ? 'individualNotesArea' : 
                          'incidentNotesArea';
        
        document.getElementById(textareaId).value = note.content;
        
        // Switch to appropriate tab
        switchNoteTab(note.type === 'individual' ? 'individuals' : note.type + 's');
        
        // Delete the old note
        deleteNote(noteId);
    }
}

function deleteNote(noteId) {
    if (confirm('Weet je zeker dat je deze notitie wilt verwijderen?')) {
        savedNotes = savedNotes.filter(n => n.id !== noteId);
        localStorage.setItem('teacherNotes', JSON.stringify(savedNotes));
        loadNotesList();
        showNotification('🗑️ Notitie verwijderd', 'info');
    }
}

function exportNotes(format) {
    if (savedNotes.length === 0) {
        showNotification('⚠️ Geen notities om te exporteren', 'warning');
        return;
    }
    
    switch(format) {
        case 'json':
            const jsonData = JSON.stringify(savedNotes, null, 2);
            downloadFile('teacher-notes.json', jsonData, 'application/json');
            break;
            
        case 'csv':
            const csvHeaders = 'Date,Type,Week,Content\n';
            const csvData = savedNotes.map(note => 
                `"${new Date(note.timestamp).toLocaleString('nl-NL')}","${note.type}","Week ${note.week}","${note.content.replace(/"/g, '""')}"`
            ).join('\n');
            downloadFile('teacher-notes.csv', csvHeaders + csvData, 'text/csv');
            break;
            
        case 'pdf':
            // In production, this would generate a proper PDF
            const pdfContent = savedNotes.map(note => 
                `${new Date(note.timestamp).toLocaleString('nl-NL')} - ${note.type}\n${note.content}\n\n`
            ).join('---\n\n');
            downloadFile('teacher-notes.txt', pdfContent, 'text/plain');
            showNotification('📄 PDF export komt binnenkort - TXT bestand gegenereerd', 'info');
            break;
    }
}

function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('📥 Export succesvol!', 'success');
}

// Voice Recording Functions (Simplified - would need Web Speech API)
let isRecording = false;
let recordingStartTime = null;
let recordingInterval = null;

function toggleVoiceRecording() {
    const btn = document.getElementById('voiceRecordBtn');
    const statusText = document.querySelector('.status-text');
    
    if (!isRecording) {
        // Start recording
        isRecording = true;
        recordingStartTime = Date.now();
        btn.classList.add('recording');
        btn.querySelector('.record-text').textContent = 'Stop Recording';
        statusText.textContent = 'Recording...';
        
        // Update timer
        recordingInterval = setInterval(updateRecordingTime, 1000);
        
        // In production, this would use Web Speech API
        showNotification('🎤 Voice recording gestart (demo mode)', 'info');
        
    } else {
        // Stop recording
        isRecording = false;
        btn.classList.remove('recording');
        btn.querySelector('.record-text').textContent = 'Start Recording';
        statusText.textContent = 'Ready to record...';
        
        clearInterval(recordingInterval);
        document.getElementById('recordingTime').textContent = '00:00';
        
        // Show mock transcription
        showTranscription();
    }
}

function updateRecordingTime() {
    const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    document.getElementById('recordingTime').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function showTranscription() {
    const transcriptionDiv = document.getElementById('voiceTranscription');
    const transcriptionText = document.getElementById('transcriptionText');
    
    // Mock transcription
    transcriptionText.textContent = 'Team 3 toont uitstekende samenwerking. De CEO neemt duidelijk de leiding in de discussie. CFO brengt sterke financiële argumenten. Conflict tussen COO en CIO over resource allocatie werd constructief opgelost.';
    
    transcriptionDiv.style.display = 'block';
}

function addTranscriptionToNotes() {
    const transcriptionText = document.getElementById('transcriptionText').textContent;
    const activeTextarea = document.querySelector('.note-panel.active textarea');
    
    if (activeTextarea && transcriptionText) {
        const timestamp = new Date().toLocaleTimeString('nl-NL', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        activeTextarea.value += (activeTextarea.value ? '\n\n' : '') + 
                               `[Voice Note ${timestamp}]\n${transcriptionText}`;
        
        // Hide transcription
        document.getElementById('voiceTranscription').style.display = 'none';
        
        showNotification('✅ Transcriptie toegevoegd aan notities', 'success');
    }
}

// ==========================================
// Quick Navigation Functions
// ==========================================
let currentWeek = 3; // Default to week 3

function jumpToWeek(weekNumber) {
    if (!weekNumber) return;
    
    currentWeek = parseInt(weekNumber);
    showWeekPlan(currentWeek);
    updateProgress();
    
    // Scroll to week planner
    document.querySelector('.teacher-week-nav').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function navigateWeek(direction) {
    if (direction === 'prev' && currentWeek > 1) {
        currentWeek--;
    } else if (direction === 'next' && currentWeek < 7) {
        currentWeek++;
    }
    
    // Update dropdown
    document.getElementById('weekJumper').value = currentWeek;
    
    // Show week plan
    showWeekPlan(currentWeek);
    updateProgress();
}

function goToCurrentWeek() {
    // Calculate current week based on course schedule
    // This is a placeholder - in production, this would check actual dates
    const today = new Date();
    const courseStartDate = new Date('2024-09-01'); // Example start date
    const weeksSinceStart = Math.floor((today - courseStartDate) / (7 * 24 * 60 * 60 * 1000));
    const actualCurrentWeek = Math.min(Math.max(1, weeksSinceStart + 1), 7);
    
    currentWeek = actualCurrentWeek;
    document.getElementById('weekJumper').value = currentWeek;
    showWeekPlan(currentWeek);
    updateProgress();
    
    // Scroll to week planner
    document.querySelector('.teacher-week-nav').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function jumpToSection(sectionClass) {
    const section = document.querySelector('.' + sectionClass);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function toggleShortcuts() {
    const shortcutsList = document.getElementById('shortcutsList');
    if (shortcutsList) {
        const isVisible = shortcutsList.style.display !== 'none';
        shortcutsList.style.display = isVisible ? 'none' : 'block';
        
        // Update button text
        const button = document.querySelector('.toggle-shortcuts');
        if (button) {
            button.textContent = isVisible ? '⌨️ Keyboard Shortcuts' : '✖️ Verberg Shortcuts';
        }
    }
}

function updateProgress() {
    const progressFill = document.getElementById('courseProgress');
    const progressPercentage = (currentWeek / 7) * 100;
    
    if (progressFill) {
        progressFill.style.width = progressPercentage + '%';
        progressFill.querySelector('.progress-text').textContent = `Week ${currentWeek} van 7`;
    }
    
    // Update progress details
    const progressDetails = document.querySelector('.progress-details');
    if (progressDetails) {
        const completed = currentWeek > 1 ? `✓ Week 1-${currentWeek - 1} voltooid` : '○ Nog niet begonnen';
        const current = `→ Week ${currentWeek} actief`;
        const remaining = currentWeek < 7 ? `○ Week ${currentWeek + 1}-7 komend` : '✓ Alle weken voltooid';
        
        progressDetails.innerHTML = `
            <span class="completed">${completed}</span>
            <span class="current">${current}</span>
            <span class="remaining">${remaining}</span>
        `;
    }
}

// Enhanced keyboard shortcuts
function setupEnhancedKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Week navigation with arrow keys
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                navigateWeek('prev');
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                navigateWeek('next');
            } else if (e.key === 'h' || e.key === 'H') {
                e.preventDefault();
                goToCurrentWeek();
            } else if (e.key >= '1' && e.key <= '7') {
                e.preventDefault();
                jumpToWeek(e.key);
            } else if (e.key === '?') {
                e.preventDefault();
                toggleShortcuts();
            }
        }
        
        // Section navigation with Alt+Number
        if (e.altKey && !e.ctrlKey && !e.metaKey) {
            const sectionMap = {
                '1': 'teacher-week-nav',
                '2': 'timer-section',
                '3': 'didactic-tools',
                '4': 'assessment-tools',
                '5': 'event-cards-library'
            };
            
            if (sectionMap[e.key]) {
                e.preventDefault();
                jumpToSection(sectionMap[e.key]);
            }
        }
    });
}

// ==========================================
// Event Card Deployment Functions
// ==========================================
function deployEventCard(button) {
    const eventCard = button.closest('.event-card');
    const title = eventCard.querySelector('h4').textContent;
    const description = eventCard.querySelector('.event-description').textContent;
    const impact = eventCard.querySelector('.event-impact').textContent;
    const questions = Array.from(eventCard.querySelectorAll('.event-questions li'))
        .map(li => li.textContent);
    
    // Create deployment modal
    const modalHTML = `
        <div class="modal-overlay" id="deploymentModal">
            <div class="modal-content deployment-modal">
                <button class="modal-close" onclick="closeDeploymentModal()">×</button>
                <h2>🎯 Event Card Deployment</h2>
                
                <div class="deployment-preview">
                    <h3>${title}</h3>
                    <p class="event-description">${description}</p>
                    <div class="event-impact">${impact}</div>
                </div>
                
                <div class="deployment-options">
                    <h4>Deployment Opties:</h4>
                    
                    <div class="option-group">
                        <label>
                            <input type="radio" name="timing" value="immediate" checked>
                            <span>Direct introduceren</span>
                        </label>
                        <label>
                            <input type="radio" name="timing" value="5min">
                            <span>Over 5 minuten</span>
                        </label>
                        <label>
                            <input type="radio" name="timing" value="10min">
                            <span>Over 10 minuten</span>
                        </label>
                    </div>
                    
                    <div class="deployment-script">
                        <h4>Suggested Script:</h4>
                        <div class="script-box">
                            <p>"Ik heb zojuist breaking news ontvangen..."</p>
                            <p>[Lees beschrijving voor]</p>
                            <p>"Jullie hebben 5 minuten om als board te reageren."</p>
                            <p>"Denk aan jullie individuele rollen en belangen."</p>
                        </div>
                    </div>
                    
                    <div class="deployment-checklist">
                        <h4>Observatie Checklist:</h4>
                        <ul>
                            ${questions.map(q => `<li>☐ ${q}</li>`).join('')}
                            <li>☐ Blijven rollen consistent onder druk?</li>
                            <li>☐ Wordt er naar consensus gezocht?</li>
                            <li>☐ Zijn trade-offs expliciet benoemd?</li>
                        </ul>
                    </div>
                </div>
                
                <div class="deployment-actions">
                    <button class="btn-primary" onclick="startEventDeployment()">
                        🚀 Start Event
                    </button>
                    <button class="btn-secondary" onclick="closeDeploymentModal()">
                        Annuleren
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('deploymentModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add styles for deployment modal
    if (!document.getElementById('deploymentModalStyles')) {
        const deploymentStyles = document.createElement('style');
        deploymentStyles.id = 'deploymentModalStyles';
        deploymentStyles.textContent = `
            .deployment-modal {
                max-width: 700px;
            }
            
            .deployment-preview {
                background: var(--glass-bg);
                padding: var(--space-lg);
                border-radius: var(--radius-md);
                margin-bottom: var(--space-xl);
            }
            
            .deployment-options {
                margin-bottom: var(--space-xl);
            }
            
            .option-group {
                display: flex;
                gap: var(--space-lg);
                margin: var(--space-md) 0;
            }
            
            .option-group label {
                display: flex;
                align-items: center;
                gap: var(--space-sm);
                cursor: pointer;
            }
            
            .script-box {
                background: rgba(143, 209, 79, 0.1);
                padding: var(--space-lg);
                border-radius: var(--radius-md);
                border-left: 4px solid var(--primary-green);
                font-style: italic;
            }
            
            .deployment-checklist ul {
                list-style: none;
                padding: 0;
            }
            
            .deployment-checklist li {
                padding: var(--space-xs) 0;
                color: var(--text-medium);
            }
            
            .deployment-actions {
                display: flex;
                gap: var(--space-md);
                justify-content: center;
            }
            
            .btn-secondary {
                background: var(--text-light);
                color: var(--text-dark);
                border: none;
                padding: var(--space-md) var(--space-xl);
                border-radius: var(--radius-md);
                cursor: pointer;
                font-weight: 600;
                transition: all var(--transition-base);
            }
            
            .btn-secondary:hover {
                background: var(--text-medium);
            }
        `;
        document.head.appendChild(deploymentStyles);
    }
}

function closeDeploymentModal() {
    const modal = document.getElementById('deploymentModal');
    if (modal) {
        modal.remove();
    }
}

function startEventDeployment() {
    const timing = document.querySelector('input[name="timing"]:checked').value;
    
    if (timing === 'immediate') {
        // Start immediately
        showNotification('🎯 Event card geactiveerd!', 'success');
        ringBell();
    } else {
        // Set timer for delayed deployment
        const minutes = parseInt(timing);
        showNotification(`⏰ Event wordt over ${minutes} minuten geïntroduceerd`, 'info');
        
        setTimeout(() => {
            showNotification('🎯 Event card NU actief!', 'success');
            ringBell();
            ringBell(); // Double bell for attention
        }, minutes * 60 * 1000);
    }
    
    closeDeploymentModal();
}

// ==========================================
// Print Functions
// ==========================================
function preparePrintLayout(weekNumber) {
    const printLayout = document.getElementById('printLayout');
    
    if (!weekNumber) {
        printLayout.classList.remove('active');
        return;
    }
    
    // Clear existing content
    printLayout.innerHTML = '';
    
    if (weekNumber === 'all') {
        // Generate all weeks
        for (let i = 1; i <= 7; i++) {
            printLayout.appendChild(generateLessonPage(i));
        }
    } else {
        // Generate single week
        printLayout.appendChild(generateLessonPage(parseInt(weekNumber)));
    }
    
    printLayout.classList.add('active');
}

function generateLessonPage(weekNum) {
    const weekData = getWeekData(weekNum);
    
    const pageDiv = document.createElement('div');
    pageDiv.className = 'lesson-page';
    pageDiv.setAttribute('data-week', weekNum);
    
    const includeNotes = document.getElementById('includeNotes')?.checked !== false;
    const includeTimer = document.getElementById('includeTimer')?.checked !== false;
    const includeChecklist = document.getElementById('includeChecklist')?.checked !== false;
    
    pageDiv.innerHTML = `
        <header class="print-header">
            <div class="header-left">
                <h1>AEC - Algemene Economie C-cluster</h1>
                <h2>Week ${weekNum}: ${weekData.title}</h2>
            </div>
            <div class="header-right">
                <p>Datum: _____________</p>
                <p>Klas: _____________</p>
                <p>Docent: _____________</p>
            </div>
        </header>
        
        <div class="print-content">
            <!-- Learning Objectives -->
            <section class="print-section">
                <h3>📎 Leerdoelen</h3>
                <ul class="objectives-list">
                    ${weekData.objectives.map(obj => `<li>☐ ${obj}</li>`).join('')}
                </ul>
            </section>
            
            ${includeTimer ? `
            <!-- Lesson Structure -->
            <section class="print-section">
                <h3>⏱️ Lesstructuur (90 minuten)</h3>
                <table class="timing-table">
                    <thead>
                        <tr>
                            <th>Tijd</th>
                            <th>Fase</th>
                            <th>Activiteit</th>
                            <th>✓</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${weekData.timing.map(phase => `
                            <tr>
                                <td>${phase.time}</td>
                                <td>${phase.phase}</td>
                                <td>${phase.activity}</td>
                                <td>☐</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </section>
            ` : ''}
            
            <!-- Key Conflicts -->
            <section class="print-section">
                <h3>⚡ Kernconflicten Deze Week</h3>
                <div class="conflict-box">
                    ${weekData.conflicts.map(conflict => `
                        <div class="conflict-item">
                            <strong>${conflict.role}:</strong> "${conflict.statement}"
                        </div>
                    `).join('')}
                </div>
            </section>
            
            ${includeChecklist ? `
            <!-- Intervention Points -->
            <section class="print-section">
                <h3>🎯 Interventie Momenten</h3>
                <div class="intervention-checklist">
                    ${weekData.interventions.map(int => `
                        <p>☐ <strong>${int.time}:</strong> ${int.action}</p>
                    `).join('')}
                </div>
            </section>
            ` : ''}
            
            ${includeNotes ? `
            <!-- Observation Notes -->
            <section class="print-section notes-section">
                <h3>📝 Observatie Notities</h3>
                <div class="notes-grid">
                    <div class="note-box">
                        <h4>Team Dynamiek:</h4>
                        <div class="lines">
                            <p>_________________________________</p>
                            <p>_________________________________</p>
                            <p>_________________________________</p>
                        </div>
                    </div>
                    <div class="note-box">
                        <h4>Rol Consistentie:</h4>
                        <div class="lines">
                            <p>_________________________________</p>
                            <p>_________________________________</p>
                            <p>_________________________________</p>
                        </div>
                    </div>
                    <div class="note-box">
                        <h4>Besluitkwaliteit:</h4>
                        <div class="lines">
                            <p>_________________________________</p>
                            <p>_________________________________</p>
                            <p>_________________________________</p>
                        </div>
                    </div>
                    <div class="note-box">
                        <h4>Verbeterpunten:</h4>
                        <div class="lines">
                            <p>_________________________________</p>
                            <p>_________________________________</p>
                            <p>_________________________________</p>
                        </div>
                    </div>
                </div>
            </section>
            ` : ''}
            
            <!-- Assessment Quick Rubric -->
            <section class="print-section">
                <h3>✅ Quick Assessment</h3>
                <table class="assessment-grid">
                    <thead>
                        <tr>
                            <th>Team</th>
                            <th>Individueel<br>(1-10)</th>
                            <th>Team<br>(1-10)</th>
                            <th>Besluit<br>(1-10)</th>
                            <th>Presentatie<br>(1-10)</th>
                            <th>Totaal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${[1,2,3,4,5].map(team => `
                            <tr>
                                <td>Team ${team}</td>
                                <td>___</td>
                                <td>___</td>
                                <td>___</td>
                                <td>___</td>
                                <td>___</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </section>
        </div>
        
        <footer class="print-footer">
            <p>AEC Module - HANBK © 2024 | Pagina ${weekNum} van 7 | Week ${weekNum}: ${weekData.title}</p>
        </footer>
    `;
    
    return pageDiv;
}

function getWeekData(weekNum) {
    const weekData = {
        1: {
            title: "Introductie & Rolverdeling",
            objectives: [
                "Begrijpen van de boardroom simulatie structuur",
                "Identificeren met toegewezen executive rol",
                "Leren werken met AI-gegenereerde briefings",
                "Eerste ervaring met consensus building"
            ],
            timing: [
                { time: "0-15 min", phase: "Introductie", activity: "Module uitleg & verwachtingen" },
                { time: "15-30 min", phase: "Rolverdeling", activity: "Teams formeren & rollen toewijzen" },
                { time: "30-60 min", phase: "Eerste Briefing", activity: "AI briefing analyseren per rol" },
                { time: "60-75 min", phase: "Mini-simulatie", activity: "Eerste boardroom ervaring" },
                { time: "75-90 min", phase: "Reflectie", activity: "Lessons learned & vooruitblik" }
            ],
            conflicts: [
                { role: "CEO", statement: "We moeten een duidelijke visie neerzetten" },
                { role: "CFO", statement: "Eerst de financiële basis op orde" },
                { role: "COO", statement: "Focus op operationele excellentie" },
                { role: "CIO", statement: "Innovatie als differentiator" }
            ],
            interventions: [
                { time: "30 min", action: "Check begrip van rollen" },
                { time: "45 min", action: "Stimuleer eerste discussie" },
                { time: "60 min", action: "Help met structureren" },
                { time: "75 min", action: "Begeleid reflectie" }
            ]
        },
        2: {
            title: "Marktanalyse & Positioning",
            objectives: [
                "Analyseren van marktpositionering",
                "Identificeren van competitieve voordelen",
                "Ontwikkelen van strategische opties",
                "Rolgebonden argumentatie versterken"
            ],
            timing: [
                { time: "0-15 min", phase: "Markt Context", activity: "Industry briefing & trends" },
                { time: "15-30 min", phase: "SWOT Analyse", activity: "Teams werken SWOT uit" },
                { time: "30-60 min", phase: "Positioning Debat", activity: "Boardroom discussie positionering" },
                { time: "60-75 min", phase: "Strategiekeuze", activity: "Consensus over marktbenadering" },
                { time: "75-90 min", phase: "Documentatie", activity: "Strategische pijler vastleggen" }
            ],
            conflicts: [
                { role: "COO (Exploit)", statement: "Versterk huidige marktpositie" },
                { role: "CIO (Explore)", statement: "Zoek nieuwe marktsegmenten" },
                { role: "CFO (Buyback)", statement: "Focus op meest winstgevende segmenten" }
            ],
            interventions: [
                { time: "30 min", action: "Als SWOT te oppervlakkig → diepgang vragen" },
                { time: "45 min", action: "Bij dominante stem → anderen activeren" },
                { time: "60 min", action: "Als geen focus → prioriteiten dwingen" },
                { time: "75 min", action: "Check strategische consistentie" }
            ]
        },
        3: {
            title: "Innovatie vs Optimalisatie",
            objectives: [
                "Begrijpen van de exploit/explore trade-off",
                "Ervaren van rolgebonden perspectieven",
                "Ontwikkelen van compromisvaardigheden",
                "Leren documenteren van strategische keuzes"
            ],
            timing: [
                { time: "0-15 min", phase: "Introductie", activity: "Context schets: R&D investeringsbeslissing" },
                { time: "15-30 min", phase: "Voorbereiding", activity: "Teams analyseren AI-briefing vanuit rollen" },
                { time: "30-60 min", phase: "Boardroom", activity: "Simulatie met rolgebonden discussie" },
                { time: "60-75 min", phase: "Besluit", activity: "Consensus vorming & documentatie" },
                { time: "75-90 min", phase: "Reflectie", activity: "Peer feedback & strategische pijler" }
            ],
            conflicts: [
                { role: "COO (Exploit)", statement: "We moeten eerst onze huidige processen optimaliseren" },
                { role: "CIO (Explore)", statement: "Innovatie is essentieel voor toekomstige groei" },
                { role: "CFO (Buyback)", statement: "Het kapitaal kan beter naar aandeelhouders" }
            ],
            interventions: [
                { time: "30 min", action: "Als discussie vastloopt → Event card introduceren" },
                { time: "45 min", action: "Als één rol domineert → CEO herinneren aan balans" },
                { time: "60 min", action: "Als geen consensus → Faciliteer stemming" },
                { time: "75 min", action: "Als besluit onduidelijk → Framework check" }
            ]
        },
        4: {
            title: "Kapitaalallocatie",
            objectives: [
                "Begrijpen van kapitaalallocatie dilemma's",
                "Afwegen van risk/return trade-offs",
                "Balanceren van stakeholder belangen",
                "Financiële argumentatie ontwikkelen"
            ],
            timing: [
                { time: "0-15 min", phase: "Financiële Context", activity: "Budget constraints & opportunities" },
                { time: "15-30 min", phase: "Investeringsopties", activity: "Analyse van alternatieven" },
                { time: "30-60 min", phase: "Allocatie Debat", activity: "Boardroom kapitaalverdeling" },
                { time: "60-75 min", phase: "Portfolio Besluit", activity: "Finale allocatie beslissing" },
                { time: "75-90 min", phase: "Risk Assessment", activity: "Risico's documenteren" }
            ],
            conflicts: [
                { role: "CFO", statement: "Maximaliseer shareholder return via buyback" },
                { role: "CIO", statement: "Investeer in toekomstige technologie" },
                { role: "COO", statement: "Versterk operationele capaciteit" }
            ],
            interventions: [
                { time: "30 min", action: "Bij te veel focus op cijfers → strategische link" },
                { time: "45 min", action: "Als CFO domineert → andere perspectieven" },
                { time: "60 min", action: "Check risico afweging" },
                { time: "75 min", action: "Toets aan eerdere strategische pijlers" }
            ]
        },
        5: {
            title: "Crisis Management",
            objectives: [
                "Reageren onder tijdsdruk",
                "Prioriteiten stellen in crisis",
                "Stakeholder communicatie managen",
                "Adaptief leiderschap tonen"
            ],
            timing: [
                { time: "0-10 min", phase: "Crisis Introductie", activity: "Urgent scenario presentatie" },
                { time: "10-25 min", phase: "Rapid Assessment", activity: "Teams analyseren impact" },
                { time: "25-55 min", phase: "Crisis Response", activity: "Boardroom crisis management" },
                { time: "55-70 min", phase: "Actieplan", activity: "Concrete maatregelen formuleren" },
                { time: "70-90 min", phase: "Communicatie", activity: "Stakeholder berichten opstellen" }
            ],
            conflicts: [
                { role: "CEO", statement: "Bescherm de reputatie" },
                { role: "CFO", statement: "Minimaliseer financiële schade" },
                { role: "COO", statement: "Waarborg business continuity" },
                { role: "CIO", statement: "Gebruik crisis als innovatie trigger" }
            ],
            interventions: [
                { time: "25 min", action: "Verhoog tijdsdruk met updates" },
                { time: "40 min", action: "Introduceer tweede crisis element" },
                { time: "55 min", action: "Dwing prioritering af" },
                { time: "70 min", action: "Check volledigheid actieplan" }
            ]
        },
        6: {
            title: "Strategie Integratie",
            objectives: [
                "Integreren van weekbeslissingen",
                "Coherente strategie formuleren",
                "Story-telling ontwikkelen",
                "Presentatie voorbereiden"
            ],
            timing: [
                { time: "0-15 min", phase: "Strategie Review", activity: "Overzicht van 5 pijlers" },
                { time: "15-35 min", phase: "Integratie", activity: "Verbinden tot coherent verhaal" },
                { time: "35-60 min", phase: "Story Development", activity: "Narratief ontwikkelen" },
                { time: "60-75 min", phase: "Presentatie Prep", activity: "Pitch voorbereiden" },
                { time: "75-90 min", phase: "Dry Run", activity: "Oefenpresentatie met feedback" }
            ],
            conflicts: [
                { role: "Team", statement: "Welke beslissingen benadrukken we?" },
                { role: "Team", statement: "Hoe presenteren we trade-offs?" },
                { role: "Team", statement: "Wat is onze unique value proposition?" }
            ],
            interventions: [
                { time: "35 min", action: "Check rode draad in verhaal" },
                { time: "50 min", action: "Test elevator pitch" },
                { time: "65 min", action: "Adviseer over visualisaties" },
                { time: "80 min", action: "Geef presentatie tips" }
            ]
        },
        7: {
            title: "Presentatie & Reflectie",
            objectives: [
                "Professioneel presenteren",
                "Kritische vragen beantwoorden",
                "Peer assessment uitvoeren",
                "Persoonlijke reflectie"
            ],
            timing: [
                { time: "0-10 min", phase: "Setup", activity: "RvT rollen verdelen" },
                { time: "10-40 min", phase: "Presentaties", activity: "Teams presenteren (6 min per team)" },
                { time: "40-60 min", phase: "Q&A", activity: "RvT questioning per team" },
                { time: "60-75 min", phase: "Peer Assessment", activity: "Teams beoordelen elkaar" },
                { time: "75-90 min", phase: "Reflectie", activity: "Individuele learning points" }
            ],
            conflicts: [
                { role: "RvT", statement: "Waarom deze strategische keuzes?" },
                { role: "RvT", statement: "Hoe zijn risico's afgewogen?" },
                { role: "RvT", statement: "Wat zijn de alternatieven?" }
            ],
            interventions: [
                { time: "25 min", action: "Time management presentaties" },
                { time: "45 min", action: "Stimuleer kritische vragen" },
                { time: "60 min", action: "Structureer peer feedback" },
                { time: "75 min", action: "Begeleid reflectie proces" }
            ]
        }
    };
    
    return weekData[weekNum] || weekData[1];
}

function togglePrintPreview() {
    const modal = document.getElementById('printPreviewModal');
    const isVisible = modal.style.display === 'block' || modal.classList.contains('active');
    
    if (isVisible) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    } else {
        modal.style.display = 'block';
        modal.classList.add('active');
        
        // Load print content into iframe
        const printLayout = document.getElementById('printLayout');
        const iframe = document.getElementById('printPreviewFrame');
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        // Copy styles and content
        const styles = Array.from(document.styleSheets)
            .map(sheet => {
                try {
                    return Array.from(sheet.cssRules)
                        .map(rule => rule.cssText)
                        .join('\n');
                } catch (e) {
                    return '';
                }
            })
            .join('\n');
        
        iframeDoc.open();
        iframeDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <style>${styles}</style>
                <style>
                    body { padding: 20px; }
                    .print-layout { display: block !important; }
                </style>
            </head>
            <body>
                ${printLayout.innerHTML}
            </body>
            </html>
        `);
        iframeDoc.close();
    }
}

// ==========================================
// Export functions for global use
// ==========================================
window.showWeekPlan = showWeekPlan;
window.setTimerPhase = setTimerPhase;
window.setCustomTimer = setCustomTimer;
window.startTimer = startTimer;
window.pauseTimer = pauseTimer;
window.resetTimer = resetTimer;
window.ringBell = ringBell;
window.startBoardroomTimer = startBoardroomTimer;
window.openInterventions = openInterventions;
window.openRubrics = openRubrics;
window.generateEventCard = generateEventCard;
window.closeEventModal = closeEventModal;
window.calculateWeightedScore = calculateWeightedScore;
window.saveAssessment = saveAssessment;
window.exportAssessment = exportAssessment;
window.emailAssessment = emailAssessment;
window.deployEventCard = deployEventCard;
window.closeDeploymentModal = closeDeploymentModal;
window.startEventDeployment = startEventDeployment;
window.jumpToWeek = jumpToWeek;
window.navigateWeek = navigateWeek;
window.goToCurrentWeek = goToCurrentWeek;
window.jumpToSection = jumpToSection;
window.toggleShortcuts = toggleShortcuts;
window.updateProgress = updateProgress;
window.switchNoteTab = switchNoteTab;
window.addTimestamp = addTimestamp;
window.saveNotes = saveNotes;
window.loadTeamNotes = loadTeamNotes;
window.tagIncident = tagIncident;
window.useTemplate = useTemplate;
window.filterNotes = filterNotes;
window.toggleStar = toggleStar;
window.expandNote = expandNote;
window.editNote = editNote;
window.deleteNote = deleteNote;
window.exportNotes = exportNotes;
window.toggleVoiceRecording = toggleVoiceRecording;
window.addTranscriptionToNotes = addTranscriptionToNotes;
window.preparePrintLayout = preparePrintLayout;
window.togglePrintPreview = togglePrintPreview;