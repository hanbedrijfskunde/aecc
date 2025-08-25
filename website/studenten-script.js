/* ==========================================
   Studenten Portal JavaScript
   ========================================== */

// ==========================================
// Tab Functionality for WAAROM/HOE/WAT
// ==========================================
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedContent = document.getElementById(`${tabName}-content`);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// ==========================================
// Week Details Modal
// ==========================================
async function showWeekDetails(weekNumber) {
    console.log(`Opening details for Week ${weekNumber} (type: ${typeof weekNumber})`);
    
    // Handle special cases for "Bekijk Resultaten" and "Project Continuïteit" cards
    // These might pass strings that need special handling
    if (typeof weekNumber === 'string') {
        // Try to extract number from string if it contains one
        const extracted = weekNumber.match(/\d+/);
        if (extracted) {
            weekNumber = parseInt(extracted[0]);
        } else {
            // Handle special card types
            console.error(`Invalid week identifier: ${weekNumber}`);
            alert('Deze functie is nog niet beschikbaar.');
            return;
        }
    } else {
        weekNumber = parseInt(weekNumber);
    }
    
    console.log(`Parsed week number: ${weekNumber}`);
    
    // Validate week number
    if (isNaN(weekNumber) || weekNumber < 1 || weekNumber > 7) {
        console.error(`Invalid week number: ${weekNumber}`);
        alert('Ongeldige week nummer. Probeer het opnieuw.');
        return;
    }
    
    // If content not loaded yet, try to load it
    if (!window.contentData || !window.contentData.weeks || window.contentData.weeks.length === 0) {
        console.log('Content not loaded yet, loading now...');
        try {
            const response = await fetch('content.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            window.contentData = data;
            console.log('Content loaded successfully. Found', data.weeks?.length || 0, 'weeks');
        } catch (error) {
            console.error('Failed to load content:', error);
            // Try alternative path for content.json
            try {
                const altResponse = await fetch('/content.json');
                if (altResponse.ok) {
                    const altData = await altResponse.json();
                    window.contentData = altData;
                    console.log('Content loaded from alternative path');
                } else {
                    throw new Error('Alternative path also failed');
                }
            } catch (altError) {
                console.error('Alternative path failed:', altError);
                alert('Fout bij het laden van cursusinhoud. Vernieuw de pagina en probeer opnieuw.');
                window.contentData = { weeks: [], roles: {} };
                return;
            }
        }
    }
    
    // Get week data from content if available
    let weekData = null;
    if (window.contentData && window.contentData.weeks && window.contentData.weeks.length > 0) {
        console.log('Available weeks:', window.contentData.weeks.map(w => w.number));
        weekData = window.contentData.weeks.find(w => w.number === weekNumber);
        console.log('Found week data:', weekData ? 'Yes' : 'No');
        
        if (!weekData) {
            console.warn(`Week ${weekNumber} not found in content data. Using fallback content.`);
        }
    } else {
        console.warn('No weeks data available, will show fallback content');
    }
    
    // Create modal content
    let modalContent = '';
    
    if (weekData) {
        // Use actual data from content.json
        modalContent = `
            <h3>${weekData.icon} ${weekData.title}</h3>
            <p class="theme-tag">Thema: ${weekData.theme}</p>
            <p>${weekData.description}</p>
            
            <div class="week-tabs">
                <button class="tab-btn active" onclick="switchModalTab(event, 'waarom')">WAAROM</button>
                <button class="tab-btn" onclick="switchModalTab(event, 'hoe')">HOE</button>
                <button class="tab-btn" onclick="switchModalTab(event, 'wat')">WAT</button>
            </div>
            
            <div id="waarom" class="tab-content active">
                <h4>Didactische Rationale</h4>
                <p>${weekData.waarom || 'Informatie volgt...'}</p>
            </div>
            
            <div id="hoe" class="tab-content" style="display:none;">
                <h4>Aanpak</h4>
                ${weekData.hoe ? `
                    <h5>Zelfstudie:</h5>
                    <ul>
                        ${weekData.hoe.zelfstudie.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                    <h5>Werkcollege:</h5>
                    <ul>
                        ${weekData.hoe.werkcollege.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                ` : '<p>Informatie volgt...</p>'}
            </div>
            
            <div id="wat" class="tab-content" style="display:none;">
                <h4>Deliverables</h4>
                ${weekData.wat ? `
                    <ul>
                        ${weekData.wat.deliverables.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                    <p><strong>Assessment:</strong> ${weekData.wat.assessment}</p>
                ` : '<p>Informatie volgt...</p>'}
            </div>
            
            ${weekData.aiPrompt ? `
                <div class="ai-prompt-section">
                    <h4>AI Briefing Prompt:</h4>
                    <div class="prompt-box">
                        <pre id="aiPromptText">${weekData.aiPrompt}</pre>
                        <button class="btn-secondary" onclick="copyModalPrompt()">
                            📋 Kopieer Prompt
                        </button>
                    </div>
                </div>
            ` : ''}
        `;
    } else {
        // Fallback content if no data available
        modalContent = `
            <h3>Deze Week</h3>
            <p>Gedetailleerde informatie over week ${weekNumber} komt hier...</p>
            
            <h4>Opdracht:</h4>
            <ul>
                <li>Download de AI-briefing</li>
                <li>Analyseer vanuit jouw rol-perspectief</li>
                <li>Bereid je boardroom presentatie voor</li>
            </ul>
            
            <h4>Deliverables:</h4>
            <ul>
                <li>Individuele analyse (500 woorden)</li>
                <li>Team besluit documentatie</li>
                <li>Link naar vorige week</li>
            </ul>
        `;
    }
    
    const modalHTML = `
        <div class="modal-overlay" id="weekModal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal()">×</button>
                <h2>Week ${weekNumber}: Details</h2>
                <div class="modal-body">
                    ${modalContent}
                    
                    <button class="btn-primary" onclick="downloadBriefing(${weekNumber})">
                        Download AI Briefing
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add CSS for modal if not already present
    if (!document.getElementById('modalStyles')) {
        const modalStyles = document.createElement('style');
        modalStyles.id = 'modalStyles';
        modalStyles.textContent = `
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
            
            .modal-body {
                margin-top: var(--space-xl);
            }
            
            .btn-primary {
                background: var(--primary-green);
                color: white;
                border: none;
                padding: var(--space-md) var(--space-xl);
                border-radius: var(--radius-md);
                cursor: pointer;
                font-weight: 600;
                margin-top: var(--space-lg);
                transition: all var(--transition-base);
            }
            
            .btn-primary:hover {
                background: var(--primary-green-dark);
                transform: translateY(-2px);
            }
            
            .btn-secondary {
                background: #FFFFFF;
                color: var(--text-dark);
                border: 1px solid var(--border-color);
                padding: var(--space-sm) var(--space-lg);
                border-radius: var(--radius-md);
                cursor: pointer;
                font-weight: 500;
                transition: all var(--transition-base);
                margin-left: var(--space-md);
            }
            
            .btn-secondary:hover {
                background: var(--primary-green);
                color: white;
            }
            
            .week-tabs {
                display: flex;
                gap: var(--space-sm);
                margin: var(--space-xl) 0;
                border-bottom: 2px solid var(--border-color);
            }
            
            .tab-btn {
                background: none;
                border: none;
                padding: var(--space-md) var(--space-lg);
                cursor: pointer;
                font-weight: 600;
                color: var(--text-medium);
                transition: all var(--transition-base);
                border-bottom: 3px solid transparent;
                margin-bottom: -2px;
            }
            
            .tab-btn:hover {
                color: var(--primary-green);
            }
            
            .tab-btn.active {
                color: var(--primary-green);
                border-bottom-color: var(--primary-green);
            }
            
            .tab-content {
                padding: var(--space-xl) 0;
            }
            
            .tab-content h5 {
                color: var(--text-dark);
                margin-top: var(--space-lg);
                margin-bottom: var(--space-md);
            }
            
            .theme-tag {
                display: inline-block;
                background: var(--primary-green);
                color: white;
                padding: var(--space-xs) var(--space-md);
                border-radius: var(--radius-sm);
                font-size: 0.9rem;
                margin: var(--space-md) 0;
            }
            
            .ai-prompt-section {
                margin-top: var(--space-2xl);
                padding: var(--space-xl);
                background: #F8F9FA;
                border-radius: var(--radius-lg);
                border: 1px solid var(--border-color);
            }
            
            .prompt-box {
                margin-top: var(--space-md);
            }
            
            .prompt-box pre {
                background: white;
                padding: var(--space-lg);
                border-radius: var(--radius-md);
                border: 1px solid var(--border-color);
                white-space: pre-wrap;
                word-wrap: break-word;
                font-size: 0.9rem;
                line-height: 1.6;
                margin-bottom: var(--space-md);
                font-family: monospace;
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
        document.head.appendChild(modalStyles);
    }
}

function closeModal() {
    const modal = document.getElementById('weekModal');
    if (modal) {
        modal.remove();
    }
}

// Copy function for modal AI prompts
function copyModalPrompt() {
    const promptElement = document.getElementById('aiPromptText');
    if (!promptElement) {
        alert('Prompt niet gevonden');
        return;
    }
    
    const promptText = promptElement.textContent;
    
    // Use navigator.clipboard API if available
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(promptText).then(() => {
            const button = event.target;
            const originalText = button.innerHTML;
            button.innerHTML = '✅ Gekopieerd!';
            button.classList.add('copied');
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopy(promptText);
        });
    } else {
        fallbackCopy(promptText);
    }
}

// Fallback copy method for older browsers
function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        alert('Prompt gekopieerd naar klembord!');
    } catch (err) {
        alert('Kopiëren mislukt. Selecteer de tekst handmatig.');
    }
    
    document.body.removeChild(textArea);
}

// Tab switching function for modals
function switchModalTab(event, tabName) {
    // Prevent event bubbling
    event.preventDefault();
    event.stopPropagation();
    
    // Hide all tab contents within the modal
    const modal = document.getElementById('weekModal');
    if (!modal) return;
    
    const tabContents = modal.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.style.display = 'none';
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons within the modal
    const tabButtons = modal.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedTab = modal.querySelector(`#${tabName}`);
    if (selectedTab) {
        selectedTab.style.display = 'block';
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    if (event.target) {
        event.target.classList.add('active');
    }
}

// Tab switching function for week details
function switchTab(event, tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.style.display = 'none';
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.style.display = 'block';
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

// Copy to clipboard function
function copyToClipboard(text) {
    // Create temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    
    // Select and copy
    textarea.select();
    document.execCommand('copy');
    
    // Remove textarea
    document.body.removeChild(textarea);
    
    // Show feedback
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '✓ Gekopieerd!';
    button.style.background = 'var(--primary-green)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
}

function downloadBriefing(weekNumber) {
    console.log(`Downloading briefing for week ${weekNumber}`);
    // This would trigger a download of the week's briefing materials
    alert(`AI Briefing voor Week ${weekNumber} wordt gedownload...`);
    closeModal();
}

// ==========================================
// Copy Prompt Functionality
// ==========================================
function copyPrompt(button) {
    const promptCard = button.parentElement;
    const promptText = promptCard.querySelector('pre').textContent;
    
    // Use the global copyToClipboard function from script.js
    window.copyToClipboard(promptText).then(success => {
        if (success) {
            // Change button text temporarily
            const originalText = button.textContent;
            button.textContent = '✅ Gekopieerd!';
            button.classList.add('copied');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copied');
            }, 2000);
        } else {
            alert('Kopiëren mislukt. Selecteer de tekst handmatig.');
        }
    });
}

// ==========================================
// Countdown Timer
// ==========================================
function startCountdown() {
    // Set the next deadline (example: next Monday at 23:59)
    const getNextMonday = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7 || 7;
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + daysUntilMonday);
        nextMonday.setHours(23, 59, 59, 999);
        return nextMonday;
    };
    
    const deadline = getNextMonday();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = deadline - now;
        
        if (distance < 0) {
            // Deadline passed, set next week's deadline
            startCountdown();
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update display
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        
        // Add urgency styling if less than 24 hours
        const countdownDisplay = document.querySelector('.countdown-display');
        if (days === 0 && hours < 24) {
            countdownDisplay.classList.add('urgent');
        } else {
            countdownDisplay.classList.remove('urgent');
        }
    }
    
    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ==========================================
// Update Week Status Based on Current Date
// ==========================================
function updateWeekStatuses() {
    const weeks = [
        { deadline: '2024-09-02', element: document.querySelector('[data-week="1"]') },
        { deadline: '2024-09-09', element: document.querySelector('[data-week="2"]') },
        { deadline: '2024-09-16', element: document.querySelector('[data-week="3"]') },
        { deadline: '2024-09-23', element: document.querySelector('[data-week="4"]') },
        { deadline: '2024-09-30', element: document.querySelector('[data-week="5"]') },
        { deadline: '2024-10-07', element: document.querySelector('[data-week="6"]') },
        { deadline: '2024-10-14', element: document.querySelector('[data-week="7"]') }
    ];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    weeks.forEach((week, index) => {
        if (!week.element) return;
        
        const deadlineDate = new Date(week.deadline);
        const statusElement = week.element.querySelector('.week-status');
        const buttonElement = week.element.querySelector('.week-btn');
        
        if (today > deadlineDate) {
            // Week is completed
            statusElement.textContent = 'Voltooid';
            statusElement.className = 'week-status status-completed';
            buttonElement.textContent = 'Bekijk Resultaten';
            buttonElement.disabled = false;
        } else if (index === 0 || (index > 0 && today > new Date(weeks[index - 1].deadline))) {
            // Current active week
            statusElement.textContent = 'Actief';
            statusElement.className = 'week-status status-active';
            buttonElement.textContent = 'Open Week →';
            buttonElement.disabled = false;
        } else if (index === 1 && today <= new Date(weeks[0].deadline)) {
            // Next week (upcoming)
            statusElement.textContent = 'Binnenkort';
            statusElement.className = 'week-status status-upcoming';
            buttonElement.textContent = 'Nog niet beschikbaar';
            buttonElement.disabled = true;
        }
    });
}

// ==========================================
// Timeline Interaction
// ==========================================
function initializeTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const weekNumber = parseInt(item.dataset.week);
            showWeekDetails(weekNumber);
        });
        
        // Add hover effect with delay
        item.addEventListener('mouseenter', () => {
            setTimeout(() => {
                item.classList.add('hovered');
            }, index * 50);
        });
        
        item.addEventListener('mouseleave', () => {
            item.classList.remove('hovered');
        });
    });
}

// ==========================================
// Triangle Conflict Interaction
// ==========================================
function initializeTriangleInteraction() {
    const svg = document.querySelector('.triangle-svg');
    const nodes = document.querySelectorAll('.strategy-node');
    const strategyCards = document.querySelectorAll('.strategy-card');
    
    // Enhanced click interactions for nodes
    nodes.forEach(node => {
        node.addEventListener('click', (e) => {
            e.stopPropagation();
            const circle = node.querySelector('circle');
            const classList = circle.classList;
            let strategy = '';
            let description = '';
            let details = {};
            
            if (classList.contains('exploit-circle')) {
                strategy = 'Exploit Strategy';
                description = 'Focus op het optimaliseren van bestaande processen en het maximaliseren van efficiëntie in de huidige business.';
                details = {
                    champion: 'COO',
                    color: '#8FD14F',
                    examples: ['Procesoptimalisatie', 'Kostenreductie', 'Lean management'],
                    risks: ['Innovatie verwaarlozen', 'Marktdisruptie missen']
                };
                highlightStrategy('exploit');
            } else if (classList.contains('explore-circle')) {
                strategy = 'Explore Strategy';
                description = 'Investeer in innovatie, nieuwe markten en disruptieve technologieën voor toekomstige groei.';
                details = {
                    champion: 'CIO',
                    color: '#E63946',
                    examples: ['R&D investeringen', 'Nieuwe markten', 'Digitale transformatie'],
                    risks: ['Hoge kosten', 'Onzekere ROI']
                };
                highlightStrategy('explore');
            } else if (classList.contains('buyback-circle')) {
                strategy = 'Buyback Strategy';
                description = 'Geef kapitaal terug aan aandeelhouders door middel van dividend en aandeleninkoop.';
                details = {
                    champion: 'CFO',
                    color: '#2C3E50',
                    examples: ['Dividend uitkering', 'Share buyback', 'Kapitaalstructuur optimalisatie'],
                    risks: ['Groei beperken', 'Innovatie ondefinanciering']
                };
                highlightStrategy('buyback');
            } else if (classList.contains('balance-point')) {
                strategy = 'CEO Balans';
                description = 'Als CEO moet je de juiste balans vinden tussen alle drie de strategieën voor duurzaam succes.';
                details = {
                    champion: 'CEO',
                    color: '#FFD700',
                    examples: ['Portfolio management', 'Strategische allocatie', 'Stakeholder balans'],
                    risks: ['Geen duidelijke richting', 'Iedereen ontevreden']
                };
                highlightAllStrategies();
            }
            
            if (strategy) {
                showEnhancedStrategyInfo(strategy, description, details);
            }
        });
        
        // Hover effects
        node.addEventListener('mouseenter', (e) => {
            const circle = node.querySelector('circle');
            circle.style.filter = 'brightness(1.2)';
            circle.style.transform = 'scale(1.1)';
        });
        
        node.addEventListener('mouseleave', (e) => {
            const circle = node.querySelector('circle');
            circle.style.filter = '';
            circle.style.transform = '';
        });
    });
    
    // Connect strategy cards to visualization
    strategyCards.forEach(card => {
        card.addEventListener('click', () => {
            if (card.classList.contains('exploit-card')) {
                simulateNodeClick('exploit-circle');
            } else if (card.classList.contains('explore-card')) {
                simulateNodeClick('explore-circle');
            } else if (card.classList.contains('buyback-card')) {
                simulateNodeClick('buyback-circle');
            }
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === '1') simulateNodeClick('exploit-circle');
        if (e.key === '2') simulateNodeClick('explore-circle');
        if (e.key === '3') simulateNodeClick('buyback-circle');
        if (e.key === '0') simulateNodeClick('balance-point');
    });
}

function simulateNodeClick(circleClass) {
    const circle = document.querySelector(`.${circleClass}`);
    if (circle) {
        const node = circle.closest('.strategy-node');
        if (node) {
            node.click();
        }
    }
}

function highlightStrategy(strategy) {
    // Dim other strategies
    const allNodes = document.querySelectorAll('.strategy-node');
    const allCards = document.querySelectorAll('.strategy-card');
    
    allNodes.forEach(node => {
        node.style.opacity = '0.3';
    });
    allCards.forEach(card => {
        card.style.opacity = '0.3';
    });
    
    // Highlight selected strategy
    const selectedNode = document.querySelector(`.${strategy}-node`);
    const selectedCard = document.querySelector(`.${strategy}-card`);
    
    if (selectedNode) selectedNode.style.opacity = '1';
    if (selectedCard) {
        selectedCard.style.opacity = '1';
        selectedCard.style.transform = 'scale(1.05)';
    }
    
    // Reset after 3 seconds
    setTimeout(() => {
        allNodes.forEach(node => {
            node.style.opacity = '';
        });
        allCards.forEach(card => {
            card.style.opacity = '';
            card.style.transform = '';
        });
    }, 3000);
}

function highlightAllStrategies() {
    const allNodes = document.querySelectorAll('.strategy-node');
    const allCards = document.querySelectorAll('.strategy-card');
    
    allNodes.forEach((node, index) => {
        setTimeout(() => {
            node.style.transform = 'scale(1.1)';
            setTimeout(() => {
                node.style.transform = '';
            }, 500);
        }, index * 200);
    });
    
    allCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'scale(1.05)';
            card.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
            setTimeout(() => {
                card.style.transform = '';
                card.style.boxShadow = '';
            }, 500);
        }, index * 200);
    });
}

function showStrategyInfo(strategy, description) {
    // Create info popup
    const popup = document.createElement('div');
    popup.className = 'strategy-popup';
    popup.innerHTML = `
        <h3>${strategy}</h3>
        <p>${description}</p>
    `;
    
    // Add to triangle container
    const container = document.querySelector('.triangle-container');
    container.appendChild(popup);
    
    // Remove after 3 seconds
    setTimeout(() => {
        popup.classList.add('fade-out');
        setTimeout(() => popup.remove(), 300);
    }, 3000);
}

function showEnhancedStrategyInfo(strategy, description, details) {
    // Remove any existing popup
    const existingPopup = document.querySelector('.strategy-popup-enhanced');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Create enhanced info popup
    const popup = document.createElement('div');
    popup.className = 'strategy-popup-enhanced';
    popup.style.borderTop = `4px solid ${details.color}`;
    
    popup.innerHTML = `
        <button class="popup-close" onclick="this.parentElement.remove()">×</button>
        <h3 style="color: ${details.color}">${strategy}</h3>
        <p class="popup-champion">Champion: <strong>${details.champion}</strong></p>
        <p class="popup-description">${description}</p>
        
        <div class="popup-details">
            <div class="popup-examples">
                <h4>Voorbeelden:</h4>
                <ul>
                    ${details.examples.map(ex => `<li>${ex}</li>`).join('')}
                </ul>
            </div>
            <div class="popup-risks">
                <h4>Risico's:</h4>
                <ul>
                    ${details.risks.map(risk => `<li>${risk}</li>`).join('')}
                </ul>
            </div>
        </div>
        
        <div class="popup-action">
            <button class="btn-explore-strategy" onclick="exploreStrategy('${details.champion.toLowerCase()}')">
                Verken ${details.champion} Perspectief →
            </button>
        </div>
    `;
    
    // Add to triangle container
    const container = document.querySelector('.triangle-container');
    container.appendChild(popup);
    
    // Add animation
    requestAnimationFrame(() => {
        popup.classList.add('show');
    });
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        popup.classList.add('fade-out');
        setTimeout(() => popup.remove(), 300);
    }, 8000);
}

function exploreStrategy(role) {
    // Scroll to role section or show more info
    const roleSection = document.querySelector(`#roles-section`);
    if (roleSection) {
        roleSection.scrollIntoView({ behavior: 'smooth' });
        // Highlight specific role card
        setTimeout(() => {
            const roleCards = document.querySelectorAll('.role-card');
            roleCards.forEach(card => {
                if (card.textContent.toLowerCase().includes(role)) {
                    card.style.transform = 'scale(1.05)';
                    card.style.boxShadow = '0 8px 32px rgba(143, 209, 79, 0.3)';
                    setTimeout(() => {
                        card.style.transform = '';
                        card.style.boxShadow = '';
                    }, 2000);
                }
            });
        }, 500);
    }
}

// ==========================================
// Progress Tracking
// ==========================================
function calculateProgress() {
    const completedWeeks = document.querySelectorAll('.status-completed').length;
    const totalWeeks = 7;
    const progressPercentage = (completedWeeks / totalWeeks) * 100;
    
    // Create progress bar if it doesn't exist
    if (!document.querySelector('.progress-bar')) {
        const progressHTML = `
            <div class="progress-container">
                <h3>Jouw Voortgang</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                </div>
                <p class="progress-text">${completedWeeks} van ${totalWeeks} weken voltooid</p>
            </div>
        `;
        
        const mainContent = document.querySelector('.main-content .container');
        mainContent.insertAdjacentHTML('afterbegin', progressHTML);
    }
}

// ==========================================
// Resource Download Functions
// ==========================================
function downloadResource(resourceType) {
    // Simulate resource download
    const resources = {
        'analyse-template': 'Strategische_Analyse_Template.docx',
        'besluit-template': 'Boardroom_Besluit_Format.pptx',
        'pijler-canvas': 'Strategische_Pijler_Canvas.pdf',
        'continuity-tracker': 'Project_Continuiteit_Tracker.xlsx',
        'reading-list': 'Leeslijst_Boardroom_Dynamics.pdf'
    };
    
    const filename = resources[resourceType] || 'resource.pdf';
    
    // Create a temporary download link
    const link = document.createElement('a');
    link.href = '#'; // In production, this would be the actual file URL
    link.download = filename;
    
    // Show feedback
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '✅ Download gestart!';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 2000);
    
    console.log(`Downloading ${filename}...`);
    // In production, trigger actual download here
}

function openVideoTutorials() {
    // Open video tutorial section or external link
    const modalHTML = `
        <div class="modal-overlay" id="videoModal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeVideoModal()">×</button>
                <h2>Video Tutorials</h2>
                <div class="modal-body">
                    <div class="video-list">
                        <div class="video-item">
                            <h3>1. Introductie AEC Module</h3>
                            <p>Overzicht van de cursus en verwachtingen (10 min)</p>
                            <button class="btn-primary" onclick="playVideo('intro')">▶️ Bekijk Video</button>
                        </div>
                        <div class="video-item">
                            <h3>2. AI-Briefing Gebruiken</h3>
                            <p>Hoe gebruik je AI voor strategische analyse (15 min)</p>
                            <button class="btn-primary" onclick="playVideo('ai-briefing')">▶️ Bekijk Video</button>
                        </div>
                        <div class="video-item">
                            <h3>3. Boardroom Simulatie Tips</h3>
                            <p>Best practices voor effectieve boardroom discussies (12 min)</p>
                            <button class="btn-primary" onclick="playVideo('boardroom')">▶️ Bekijk Video</button>
                        </div>
                        <div class="video-item">
                            <h3>4. Presentatie Technieken</h3>
                            <p>Je strategie overtuigend presenteren (20 min)</p>
                            <button class="btn-primary" onclick="playVideo('presentation')">▶️ Bekijk Video</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add styles if needed
    if (!document.getElementById('videoModalStyles')) {
        const styles = document.createElement('style');
        styles.id = 'videoModalStyles';
        styles.textContent = `
            .video-list {
                display: flex;
                flex-direction: column;
                gap: var(--space-lg);
            }
            .video-item {
                background: var(--background-grey);
                padding: var(--space-lg);
                border-radius: var(--radius-md);
            }
            .video-item h3 {
                color: var(--primary-green);
                margin-bottom: var(--space-sm);
            }
            .video-item p {
                color: var(--text-medium);
                margin-bottom: var(--space-md);
            }
        `;
        document.head.appendChild(styles);
    }
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.remove();
    }
}

function playVideo(videoId) {
    console.log(`Playing video: ${videoId}`);
    alert(`Video "${videoId}" zou hier afspelen in een embedded player.`);
    // In production, this would open an actual video player
}

// ==========================================
// Initialize Everything on Page Load
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    // Load content.json first
    console.log('Loading course content...');
    try {
        const response = await fetch('content.json');
        if (response.ok) {
            window.contentData = await response.json();
            console.log('Course content loaded successfully:', window.contentData.weeks?.length || 0, 'weeks found');
        } else {
            console.error('Failed to load content.json:', response.status);
        }
    } catch (error) {
        console.error('Error loading content:', error);
    }
    
    // Start countdown timer
    startCountdown();
    
    // Update week statuses
    updateWeekStatuses();
    
    // Initialize timeline
    initializeTimeline();
    
    // Initialize triangle interaction
    initializeTriangleInteraction();
    
    // Calculate and show progress
    calculateProgress();
    
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add parallax effect to triangle on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const triangle = document.querySelector('.triangle-svg');
        if (triangle) {
            triangle.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
    
    console.log('Studenten portal initialized successfully');
});

// ==========================================
// Add Dynamic Styles
// ==========================================
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .strategy-popup {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: var(--space-lg);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-xl);
        z-index: 10;
        animation: popIn 0.3s ease;
        max-width: 300px;
    }
    
    .strategy-popup.fade-out {
        animation: popOut 0.3s ease;
    }
    
    @keyframes popIn {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    @keyframes popOut {
        from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
    }
    
    .progress-container {
        background: var(--glass-bg);
        backdrop-filter: blur(var(--glass-blur));
        border-radius: var(--radius-lg);
        padding: var(--space-xl);
        margin-bottom: var(--space-2xl);
        box-shadow: var(--shadow-md);
    }
    
    .progress-bar {
        width: 100%;
        height: 20px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: var(--radius-full);
        overflow: hidden;
        margin: var(--space-md) 0;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-green), var(--primary-green-light));
        transition: width 1s ease;
        border-radius: var(--radius-full);
    }
    
    .progress-text {
        text-align: center;
        color: var(--text-medium);
        margin-top: var(--space-sm);
    }
    
    .countdown-display.urgent .countdown-value {
        color: var(--accent-red);
        animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .timeline-item.hovered .timeline-marker {
        transform: scale(1.8);
        background: var(--primary-green);
    }
    
    .timeline-item.hovered .timeline-content {
        transform: translateY(-8px);
        box-shadow: var(--shadow-lg);
    }
`;
document.head.appendChild(dynamicStyles);