/* ==========================================
   Onboarding Flow for New Students
   ========================================== */

class OnboardingFlow {
    constructor() {
        this.currentStep = 0;
        this.totalSteps = 5;
        this.hasSeenOnboarding = localStorage.getItem('aec_onboarding_complete') === 'true';
        this.selectedRole = null;
    }

    // Initialize onboarding on page load
    init() {
        // Only show for first-time visitors on student page
        if (!this.hasSeenOnboarding && window.location.pathname.includes('studenten')) {
            setTimeout(() => this.start(), 1000);
        }
        
        // Add help button to replay onboarding
        this.addHelpButton();
    }

    // Start the onboarding flow
    start() {
        this.currentStep = 0;
        this.createOnboardingModal();
        this.showStep(0);
    }

    // Create the main onboarding modal structure
    createOnboardingModal() {
        const modalHTML = `
            <div class="onboarding-overlay" id="onboardingOverlay">
                <div class="onboarding-modal">
                    <div class="onboarding-header">
                        <h2 class="onboarding-title">Welkom bij de AEC Boardroom Simulatie! 🎉</h2>
                        <button class="onboarding-close" onclick="onboarding.skip()">×</button>
                    </div>
                    
                    <div class="onboarding-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" id="progressFill" style="width: 20%"></div>
                        </div>
                        <span class="progress-text">Stap <span id="currentStep">1</span> van ${this.totalSteps}</span>
                    </div>
                    
                    <div class="onboarding-content" id="onboardingContent">
                        <!-- Dynamic content goes here -->
                    </div>
                    
                    <div class="onboarding-footer">
                        <button class="btn-secondary" id="prevBtn" onclick="onboarding.previousStep()" style="display: none;">
                            ← Vorige
                        </button>
                        <button class="btn-primary" id="nextBtn" onclick="onboarding.nextStep()">
                            Volgende →
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addOnboardingStyles();
    }

    // Show specific step content
    showStep(step) {
        const content = document.getElementById('onboardingContent');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const progressFill = document.getElementById('progressFill');
        const currentStepText = document.getElementById('currentStep');
        
        // Update progress
        progressFill.style.width = `${((step + 1) / this.totalSteps) * 100}%`;
        currentStepText.textContent = step + 1;
        
        // Show/hide navigation buttons
        prevBtn.style.display = step > 0 ? 'block' : 'none';
        nextBtn.textContent = step === this.totalSteps - 1 ? 'Start je reis! 🚀' : 'Volgende →';
        
        // Load step content
        switch(step) {
            case 0:
                content.innerHTML = this.getWelcomeContent();
                break;
            case 1:
                content.innerHTML = this.getCourseOverviewContent();
                break;
            case 2:
                content.innerHTML = this.getRoleSelectionContent();
                this.initRoleSelection();
                break;
            case 3:
                content.innerHTML = this.getTriangleExplanationContent();
                break;
            case 4:
                content.innerHTML = this.getGettingStartedContent();
                break;
        }
        
        this.currentStep = step;
    }

    // Step 0: Welcome message
    getWelcomeContent() {
        return `
            <div class="step-content welcome-step">
                <div class="welcome-icon">👋</div>
                <h3>Welkom, toekomstige boardroom executive!</h3>
                <p>Je staat op het punt om een unieke leerreis te beginnen waarbij je:</p>
                <ul class="feature-list">
                    <li>✅ Als lid van een Raad van Bestuur strategische beslissingen neemt</li>
                    <li>✅ AI gebruikt voor business intelligence en analyse</li>
                    <li>✅ Leert navigeren tussen conflicterende bedrijfsbelangen</li>
                    <li>✅ Een coherente langetermijnstrategie ontwikkelt</li>
                </ul>
                <div class="info-box">
                    <strong>💡 Tip:</strong> Deze cursus draait niet om het reproduceren van data, 
                    maar om het nemen van weloverwogen beslissingen onder onzekerheid.
                </div>
            </div>
        `;
    }

    // Step 1: Course overview
    getCourseOverviewContent() {
        return `
            <div class="step-content overview-step">
                <h3>Hoe werkt de boardroom simulatie?</h3>
                <div class="timeline-overview">
                    <div class="timeline-step">
                        <div class="step-number">1</div>
                        <div class="step-info">
                            <strong>Maandag: AI Briefing</strong>
                            <p>Ontvang je wekelijkse intelligence briefing gegenereerd door AI</p>
                        </div>
                    </div>
                    <div class="timeline-step">
                        <div class="step-number">2</div>
                        <div class="step-info">
                            <strong>Dinsdag-Woensdag: Analyse</strong>
                            <p>Bestudeer de briefing vanuit jouw rol-perspectief</p>
                        </div>
                    </div>
                    <div class="timeline-step">
                        <div class="step-number">3</div>
                        <div class="step-info">
                            <strong>Donderdag: Boardroom</strong>
                            <p>90 minuten boardroom simulatie met je team</p>
                        </div>
                    </div>
                    <div class="timeline-step">
                        <div class="step-number">4</div>
                        <div class="step-info">
                            <strong>Vrijdag: Documentatie</strong>
                            <p>Leg jullie strategische besluit vast als "pijler"</p>
                        </div>
                    </div>
                </div>
                <p class="emphasis">🎯 Elke week bouw je voort op eerdere beslissingen → Project Continuïteit</p>
            </div>
        `;
    }

    // Step 2: Role selection
    getRoleSelectionContent() {
        return `
            <div class="step-content role-step">
                <h3>Kies jouw rol in de Raad van Bestuur</h3>
                <p>Klik op een rol om meer te leren:</p>
                <div class="role-selection-grid">
                    <div class="role-option" data-role="ceo">
                        <div class="role-icon">👔</div>
                        <h4>CEO</h4>
                        <p class="role-subtitle">De Balanskunstenaar</p>
                        <div class="role-details" style="display: none;">
                            <p>Als CEO leid je de vergaderingen en zoek je balans tussen alle strategieën.</p>
                            <ul>
                                <li>Bewaakt de coherentie</li>
                                <li>Faciliteert besluitvorming</li>
                                <li>Houdt lange termijn visie</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="role-option" data-role="cfo">
                        <div class="role-icon">💰</div>
                        <h4>CFO</h4>
                        <p class="role-subtitle">De Kapitaal-Allocateur</p>
                        <div class="role-details" style="display: none;">
                            <p>Als CFO focus je op financieel rendement en aandeelhouderswaarde.</p>
                            <ul>
                                <li>Bewaakt ROI en margins</li>
                                <li>Pleit voor buyback strategieën</li>
                                <li>Analyseert risico's</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="role-option" data-role="coo">
                        <div class="role-icon">⚙️</div>
                        <h4>COO</h4>
                        <p class="role-subtitle">De Optimalisator</p>
                        <div class="role-details" style="display: none;">
                            <p>Als COO focus je op operationele excellentie en efficiëntie.</p>
                            <ul>
                                <li>Optimaliseert processen</li>
                                <li>Pleit voor Exploit strategie</li>
                                <li>Reduceert kosten</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="role-option" data-role="cio">
                        <div class="role-icon">🚀</div>
                        <h4>CIO</h4>
                        <p class="role-subtitle">De Pionier</p>
                        <div class="role-details" style="display: none;">
                            <p>Als CIO focus je op innovatie en nieuwe mogelijkheden.</p>
                            <ul>
                                <li>Identificeert disruptie</li>
                                <li>Pleit voor Explore strategie</li>
                                <li>Drijft digitale transformatie</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="selected-role-info" id="selectedRoleInfo" style="display: none;">
                    <p>✅ Je hebt gekozen voor: <strong id="selectedRoleName"></strong></p>
                </div>
            </div>
        `;
    }

    // Step 3: Triangle conflict explanation
    getTriangleExplanationContent() {
        return `
            <div class="step-content triangle-step">
                <h3>Het Driehoeksconflict: De kern van elke beslissing</h3>
                <div class="triangle-explanation">
                    <svg viewBox="0 0 300 260" style="max-width: 300px; margin: 0 auto; display: block;">
                        <polygon points="150,30 50,200 250,200" 
                                 fill="none" 
                                 stroke="#8FD14F" 
                                 stroke-width="2"
                                 opacity="0.3"/>
                        
                        <circle cx="50" cy="200" r="30" fill="#8FD14F" opacity="0.9"/>
                        <text x="50" y="205" text-anchor="middle" fill="white" font-weight="bold" font-size="12">Exploit</text>
                        
                        <circle cx="250" cy="200" r="30" fill="#E63946" opacity="0.9"/>
                        <text x="250" y="205" text-anchor="middle" fill="white" font-weight="bold" font-size="12">Explore</text>
                        
                        <circle cx="150" cy="30" r="30" fill="#2C3E50" opacity="0.9"/>
                        <text x="150" y="35" text-anchor="middle" fill="white" font-weight="bold" font-size="12">Buyback</text>
                        
                        <circle cx="150" cy="143" r="20" fill="#FFD700" opacity="0.9"/>
                        <text x="150" y="148" text-anchor="middle" fill="#2C3E50" font-weight="bold" font-size="11">CEO</text>
                    </svg>
                </div>
                <div class="conflict-explanation">
                    <p><strong>Elke week navigeer je tussen drie conflicterende strategieën:</strong></p>
                    <div class="strategy-list">
                        <div class="strategy-item exploit">
                            <strong>🎯 Exploit:</strong> Optimaliseer wat bestaat (COO)
                        </div>
                        <div class="strategy-item explore">
                            <strong>🚀 Explore:</strong> Ontdek nieuwe mogelijkheden (CIO)
                        </div>
                        <div class="strategy-item buyback">
                            <strong>💰 Buyback:</strong> Geef terug aan aandeelhouders (CFO)
                        </div>
                    </div>
                    <p class="ceo-note">⚖️ De CEO moet de balans bewaken - geen strategie mag permanent domineren!</p>
                </div>
            </div>
        `;
    }

    // Step 4: Getting started checklist
    getGettingStartedContent() {
        return `
            <div class="step-content checklist-step">
                <h3>Je bent klaar om te beginnen! 🎓</h3>
                <div class="checklist">
                    <h4>Jouw eerste week checklist:</h4>
                    <div class="checklist-item">
                        <input type="checkbox" id="check1" checked disabled>
                        <label for="check1">✅ Begrijp de boardroom simulatie opzet</label>
                    </div>
                    <div class="checklist-item">
                        <input type="checkbox" id="check2" checked disabled>
                        <label for="check2">✅ Ken je rol in de Raad van Bestuur</label>
                    </div>
                    <div class="checklist-item">
                        <input type="checkbox" id="check3" checked disabled>
                        <label for="check3">✅ Begrijp het driehoeksconflict</label>
                    </div>
                    <div class="checklist-item">
                        <input type="checkbox" id="check4">
                        <label for="check4">⏳ Ontvang je Week 1 AI-briefing (maandag)</label>
                    </div>
                    <div class="checklist-item">
                        <input type="checkbox" id="check5">
                        <label for="check5">⏳ Bereid je boardroom pitch voor</label>
                    </div>
                    <div class="checklist-item">
                        <input type="checkbox" id="check6">
                        <label for="check6">⏳ Neem deel aan de boardroom simulatie</label>
                    </div>
                </div>
                
                <div class="quick-links">
                    <h4>Handige links:</h4>
                    <ul>
                        <li>📋 <a href="#ai-heading">AI Prompt Templates</a></li>
                        <li>📊 <a href="#triangle-conflict">Het Driehoeksconflict</a></li>
                        <li>📅 <a href="#weeks-heading">7 Weken Programma</a></li>
                        <li>❓ <a href="#" onclick="onboarding.openFAQ()">Veelgestelde Vragen</a></li>
                    </ul>
                </div>
                
                <div class="ready-message">
                    <p><strong>Succes met je eerste week als boardroom executive! 💪</strong></p>
                </div>
            </div>
        `;
    }

    // Initialize role selection interactions
    initRoleSelection() {
        const roleOptions = document.querySelectorAll('.role-option');
        roleOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                // Remove previous selections
                roleOptions.forEach(opt => {
                    opt.classList.remove('selected');
                    opt.querySelector('.role-details').style.display = 'none';
                });
                
                // Select clicked role
                option.classList.add('selected');
                option.querySelector('.role-details').style.display = 'block';
                
                // Update selected role info
                this.selectedRole = option.dataset.role;
                const roleNames = {
                    'ceo': 'CEO - De Balanskunstenaar',
                    'cfo': 'CFO - De Kapitaal-Allocateur',
                    'coo': 'COO - De Optimalisator',
                    'cio': 'CIO - De Pionier'
                };
                
                document.getElementById('selectedRoleInfo').style.display = 'block';
                document.getElementById('selectedRoleName').textContent = roleNames[this.selectedRole];
            });
        });
    }

    // Navigate to next step
    nextStep() {
        if (this.currentStep < this.totalSteps - 1) {
            this.showStep(this.currentStep + 1);
        } else {
            this.complete();
        }
    }

    // Navigate to previous step
    previousStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }

    // Skip onboarding
    skip() {
        if (confirm('Weet je zeker dat je de introductie wilt overslaan?')) {
            this.close();
        }
    }

    // Complete onboarding
    complete() {
        localStorage.setItem('aec_onboarding_complete', 'true');
        if (this.selectedRole) {
            localStorage.setItem('aec_selected_role', this.selectedRole);
        }
        
        // Show completion animation
        const modal = document.querySelector('.onboarding-modal');
        modal.innerHTML = `
            <div class="completion-message">
                <div class="success-icon">🎉</div>
                <h2>Je bent klaar om te beginnen!</h2>
                <p>Veel succes met je boardroom simulatie journey!</p>
            </div>
        `;
        
        setTimeout(() => this.close(), 2000);
    }

    // Close onboarding modal
    close() {
        const overlay = document.getElementById('onboardingOverlay');
        if (overlay) {
            overlay.classList.add('fade-out');
            setTimeout(() => overlay.remove(), 300);
        }
    }

    // Add help button to replay onboarding
    addHelpButton() {
        const helpHTML = `
            <button class="help-button" onclick="onboarding.start()" title="Help & Introductie">
                ❓
            </button>
        `;
        document.body.insertAdjacentHTML('beforeend', helpHTML);
    }

    // Open FAQ modal
    openFAQ() {
        this.close();
        // FAQ modal will be implemented separately
        if (window.faq) {
            window.faq.open();
        } else {
            alert('FAQ sectie komt binnenkort!');
        }
    }

    // Add onboarding styles
    addOnboardingStyles() {
        if (document.getElementById('onboardingStyles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'onboardingStyles';
        styles.textContent = `
            .onboarding-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s;
            }
            
            .onboarding-overlay.fade-out {
                animation: fadeOut 0.3s;
            }
            
            .onboarding-modal {
                background: white;
                border-radius: var(--radius-xl);
                max-width: 700px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.3s;
            }
            
            .onboarding-header {
                padding: var(--space-xl);
                border-bottom: 1px solid #E8E8E8;
                position: relative;
            }
            
            .onboarding-title {
                margin: 0;
                color: var(--primary-green);
                font-size: 1.5rem;
            }
            
            .onboarding-close {
                position: absolute;
                top: var(--space-lg);
                right: var(--space-lg);
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                color: #999;
                transition: color 0.3s;
            }
            
            .onboarding-close:hover {
                color: #333;
            }
            
            .onboarding-progress {
                padding: var(--space-lg);
                background: #F8F9FA;
            }
            
            .progress-bar {
                height: 8px;
                background: #E8E8E8;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: var(--space-sm);
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--primary-green), var(--primary-green-light));
                transition: width 0.3s ease;
            }
            
            .progress-text {
                font-size: 0.9rem;
                color: var(--text-medium);
            }
            
            .onboarding-content {
                padding: var(--space-xl);
                min-height: 300px;
            }
            
            .onboarding-footer {
                padding: var(--space-xl);
                border-top: 1px solid #E8E8E8;
                display: flex;
                justify-content: space-between;
                gap: var(--space-md);
            }
            
            .step-content h3 {
                margin-top: 0;
                margin-bottom: var(--space-lg);
                color: var(--text-dark);
            }
            
            .welcome-icon {
                font-size: 4rem;
                text-align: center;
                margin-bottom: var(--space-lg);
            }
            
            .feature-list {
                list-style: none;
                padding: 0;
                margin: var(--space-lg) 0;
            }
            
            .feature-list li {
                padding: var(--space-sm) 0;
                font-size: 1.05rem;
            }
            
            .info-box {
                background: rgba(143, 209, 79, 0.1);
                padding: var(--space-lg);
                border-radius: var(--radius-md);
                border-left: 4px solid var(--primary-green);
                margin-top: var(--space-lg);
            }
            
            .timeline-overview {
                margin: var(--space-xl) 0;
            }
            
            .timeline-step {
                display: flex;
                gap: var(--space-lg);
                margin-bottom: var(--space-lg);
                align-items: flex-start;
            }
            
            .step-number {
                width: 40px;
                height: 40px;
                background: var(--primary-green);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                flex-shrink: 0;
            }
            
            .step-info strong {
                display: block;
                margin-bottom: var(--space-xs);
                color: var(--text-dark);
            }
            
            .step-info p {
                margin: 0;
                color: var(--text-medium);
            }
            
            .emphasis {
                background: linear-gradient(135deg, rgba(143, 209, 79, 0.1) 0%, rgba(230, 57, 70, 0.1) 100%);
                padding: var(--space-md);
                border-radius: var(--radius-md);
                text-align: center;
                font-weight: 600;
            }
            
            .role-selection-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: var(--space-lg);
                margin: var(--space-xl) 0;
            }
            
            .role-option {
                border: 2px solid #E8E8E8;
                border-radius: var(--radius-lg);
                padding: var(--space-lg);
                cursor: pointer;
                transition: all 0.3s;
                text-align: center;
            }
            
            .role-option:hover {
                border-color: var(--primary-green);
                transform: translateY(-2px);
                box-shadow: var(--shadow-md);
            }
            
            .role-option.selected {
                border-color: var(--primary-green);
                background: rgba(143, 209, 79, 0.05);
            }
            
            .role-icon {
                font-size: 2.5rem;
                margin-bottom: var(--space-sm);
            }
            
            .role-option h4 {
                margin: 0;
                color: var(--text-dark);
            }
            
            .role-subtitle {
                color: var(--text-medium);
                font-size: 0.9rem;
                margin: var(--space-xs) 0;
            }
            
            .role-details {
                text-align: left;
                margin-top: var(--space-md);
                padding-top: var(--space-md);
                border-top: 1px solid #E8E8E8;
            }
            
            .role-details ul {
                margin: var(--space-sm) 0;
                padding-left: var(--space-lg);
            }
            
            .selected-role-info {
                background: rgba(143, 209, 79, 0.1);
                padding: var(--space-md);
                border-radius: var(--radius-md);
                text-align: center;
            }
            
            .triangle-explanation svg {
                margin: var(--space-xl) auto;
            }
            
            .strategy-list {
                margin: var(--space-lg) 0;
            }
            
            .strategy-item {
                padding: var(--space-sm);
                margin: var(--space-sm) 0;
                border-radius: var(--radius-sm);
            }
            
            .strategy-item.exploit {
                background: rgba(143, 209, 79, 0.1);
            }
            
            .strategy-item.explore {
                background: rgba(230, 57, 70, 0.1);
            }
            
            .strategy-item.buyback {
                background: rgba(44, 62, 80, 0.1);
            }
            
            .ceo-note {
                background: rgba(255, 215, 0, 0.1);
                padding: var(--space-md);
                border-radius: var(--radius-md);
                text-align: center;
                font-weight: 600;
            }
            
            .checklist {
                background: #F8F9FA;
                padding: var(--space-lg);
                border-radius: var(--radius-md);
                margin: var(--space-lg) 0;
            }
            
            .checklist h4 {
                margin-top: 0;
                color: var(--text-dark);
            }
            
            .checklist-item {
                display: flex;
                align-items: center;
                gap: var(--space-sm);
                padding: var(--space-sm) 0;
            }
            
            .checklist-item input[type="checkbox"] {
                width: 20px;
                height: 20px;
            }
            
            .quick-links {
                margin: var(--space-xl) 0;
            }
            
            .quick-links h4 {
                margin-bottom: var(--space-md);
            }
            
            .quick-links ul {
                list-style: none;
                padding: 0;
            }
            
            .quick-links li {
                padding: var(--space-xs) 0;
            }
            
            .quick-links a {
                color: var(--primary-green);
                text-decoration: none;
                font-weight: 500;
            }
            
            .quick-links a:hover {
                text-decoration: underline;
            }
            
            .ready-message {
                background: linear-gradient(135deg, var(--primary-green) 0%, var(--primary-green-light) 100%);
                color: white;
                padding: var(--space-lg);
                border-radius: var(--radius-md);
                text-align: center;
                margin-top: var(--space-xl);
            }
            
            .completion-message {
                padding: var(--space-3xl);
                text-align: center;
            }
            
            .success-icon {
                font-size: 5rem;
                margin-bottom: var(--space-lg);
            }
            
            .completion-message h2 {
                color: var(--primary-green);
                margin-bottom: var(--space-md);
            }
            
            .help-button {
                position: fixed;
                bottom: var(--space-xl);
                right: var(--space-xl);
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: var(--primary-green);
                color: white;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                transition: all 0.3s;
                z-index: 1000;
            }
            
            .help-button:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
            }
            
            @media (max-width: 768px) {
                .role-selection-grid {
                    grid-template-columns: 1fr;
                }
                
                .onboarding-modal {
                    width: 95%;
                    max-height: 90vh;
                }
                
                .help-button {
                    bottom: var(--space-lg);
                    right: var(--space-lg);
                    width: 50px;
                    height: 50px;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Initialize onboarding
const onboarding = new OnboardingFlow();
document.addEventListener('DOMContentLoaded', () => {
    onboarding.init();
});