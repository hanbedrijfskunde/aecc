// Committee Portal JavaScript - commissie-script.js

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeRiskMatrix();
    initializeQualityChecklist();
    initializeCommunicationTemplates();
    initializeDecisionFlowchart();
    initializeMetrics();
    initializeModals();
    initializeTooltips();
    loadSavedData();
});

// Navigation System
function initializeNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('section');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetId = this.getAttribute('data-section');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Smooth scroll to section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            // Save active tab
            localStorage.setItem('activeCommitteeTab', targetId);
        });
    });
    
    // Restore active tab
    const savedTab = localStorage.getItem('activeCommitteeTab');
    if (savedTab) {
        const tab = document.querySelector(`[data-section="${savedTab}"]`);
        if (tab) tab.click();
    }
}

// Risk Matrix Management
function initializeRiskMatrix() {
    const riskData = {
        high_low: [
            { title: 'Studentenweerstand', score: 6 },
            { title: 'Docentenworkload', score: 7 }
        ],
        high_medium: [
            { title: 'AI-afhankelijkheid', score: 8 },
            { title: 'Technische complexiteit', score: 8 }
        ],
        high_high: [
            { title: 'Accreditatie risico', score: 9 },
            { title: 'Kwaliteitsborging', score: 9 }
        ],
        medium_low: [
            { title: 'Schaalbaarheid', score: 4 }
        ],
        medium_medium: [
            { title: 'Docenttraining', score: 5 },
            { title: 'Resource allocatie', score: 5 }
        ],
        medium_high: [
            { title: 'Stakeholder buy-in', score: 6 }
        ],
        low_low: [
            { title: 'Content updates', score: 2 }
        ],
        low_medium: [
            { title: 'Platform stabiliteit', score: 3 }
        ],
        low_high: []
    };
    
    // Populate risk matrix cells
    Object.keys(riskData).forEach(key => {
        const cell = document.querySelector(`[data-risk="${key}"]`);
        if (cell && riskData[key].length > 0) {
            cell.innerHTML = riskData[key].map(risk => `
                <div class="risk-item">
                    ${risk.title}
                    <span class="risk-score">${risk.score}</span>
                </div>
            `).join('');
            
            // Add appropriate risk class
            if (risk.score >= 7) {
                cell.classList.add('high-risk');
            } else if (risk.score >= 4) {
                cell.classList.add('medium-risk');
            } else {
                cell.classList.add('low-risk');
            }
        }
    });
    
    // Add click handlers for risk details
    document.querySelectorAll('.matrix-cell').forEach(cell => {
        cell.addEventListener('click', function() {
            const risks = this.querySelectorAll('.risk-item');
            if (risks.length > 0) {
                showRiskDetails(risks);
            }
        });
    });
    
    // Also add handlers for individual risk items
    document.querySelectorAll('.risk-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            showRiskItemDetails(this);
        });
    });
}

// Quality Assurance Checklist
function initializeQualityChecklist() {
    const checklistData = [
        {
            category: 'Onderwijskundige Kwaliteit',
            items: [
                { id: 'edu1', label: 'Leerdoelen aligned met curriculum', checked: true },
                { id: 'edu2', label: 'Competenties duidelijk gedefinieerd', checked: true },
                { id: 'edu3', label: 'Toetsing valide en betrouwbaar', checked: true },
                { id: 'edu4', label: 'Feedback mechanismen ingericht', checked: false },
                { id: 'edu5', label: 'Differentiatie mogelijkheden', checked: false }
            ]
        },
        {
            category: 'Technische Implementatie',
            items: [
                { id: 'tech1', label: 'Platform stabiel en toegankelijk', checked: true },
                { id: 'tech2', label: 'AI integratie functioneel', checked: true },
                { id: 'tech3', label: 'Data privacy gewaarborgd', checked: true },
                { id: 'tech4', label: 'Backup en recovery procedures', checked: false },
                { id: 'tech5', label: 'Performance monitoring actief', checked: false }
            ]
        },
        {
            category: 'Organisatorische Readiness',
            items: [
                { id: 'org1', label: 'Docenten getraind', checked: false },
                { id: 'org2', label: 'Support structuur ingericht', checked: false },
                { id: 'org3', label: 'Communicatieplan actief', checked: true },
                { id: 'org4', label: 'Resources toegewezen', checked: true },
                { id: 'org5', label: 'Escalatie procedures duidelijk', checked: false }
            ]
        }
    ];
    
    const checklistContainer = document.querySelector('.qa-checklist');
    if (!checklistContainer) return;
    
    checklistData.forEach(category => {
        const categoryElement = createChecklistCategory(category);
        checklistContainer.appendChild(categoryElement);
    });
    
    // Add change handlers
    document.querySelectorAll('.checklist-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            this.classList.toggle('checked');
            const itemId = this.getAttribute('data-item-id');
            saveChecklistState(itemId, this.classList.contains('checked'));
            updateCategoryProgress(this.closest('.checklist-category'));
            updateOverallQAStatus();
        });
    });
}

function createChecklistCategory(category) {
    const checkedCount = category.items.filter(item => item.checked).length;
    const totalCount = category.items.length;
    const progress = (checkedCount / totalCount) * 100;
    
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'checklist-category';
    categoryDiv.innerHTML = `
        <div class="category-header">
            <span class="category-title">${category.category}</span>
            <div class="category-progress">
                <span>${checkedCount}/${totalCount}</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
        </div>
        <div class="checklist-items">
            ${category.items.map(item => `
                <div class="checklist-item">
                    <div class="checklist-checkbox ${item.checked ? 'checked' : ''}" 
                         data-item-id="${item.id}"></div>
                    <span class="checklist-label">${item.label}</span>
                    <span class="checklist-status ${item.checked ? 'status-complete' : 'status-incomplete'}">
                        ${item.checked ? 'Voltooid' : 'Open'}
                    </span>
                </div>
            `).join('')}
        </div>
    `;
    
    return categoryDiv;
}

function updateCategoryProgress(categoryElement) {
    const checkboxes = categoryElement.querySelectorAll('.checklist-checkbox');
    const checkedCount = categoryElement.querySelectorAll('.checklist-checkbox.checked').length;
    const totalCount = checkboxes.length;
    const progress = (checkedCount / totalCount) * 100;
    
    const progressBar = categoryElement.querySelector('.progress-fill');
    const progressText = categoryElement.querySelector('.category-progress span');
    
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${checkedCount}/${totalCount}`;
}

function updateOverallQAStatus() {
    const allCheckboxes = document.querySelectorAll('.checklist-checkbox');
    const checkedCount = document.querySelectorAll('.checklist-checkbox.checked').length;
    const totalCount = allCheckboxes.length;
    const overallProgress = Math.round((checkedCount / totalCount) * 100);
    
    // Update QA status card
    const qaCard = document.querySelector('.summary-card[data-metric="qa"]');
    if (qaCard) {
        const valueElement = qaCard.querySelector('.card-value');
        const statusBadge = qaCard.querySelector('.status-badge');
        
        if (valueElement) valueElement.textContent = `${overallProgress}%`;
        
        if (statusBadge) {
            statusBadge.classList.remove('status-approved', 'status-pending', 'status-review');
            if (overallProgress >= 80) {
                statusBadge.classList.add('status-approved');
                statusBadge.textContent = 'Goedgekeurd';
            } else if (overallProgress >= 60) {
                statusBadge.classList.add('status-review');
                statusBadge.textContent = 'Review';
            } else {
                statusBadge.classList.add('status-pending');
                statusBadge.textContent = 'In Progress';
            }
        }
    }
}

/**
 * Switch between different communication template tabs
 * @param {string} templateType - The type of template to show ('management', 'students', 'external', 'crisis')
 * Called from HTML onclick handlers in commissie.html
 */
function showTemplate(templateType) {
    console.log('showTemplate called with:', templateType);
    
    // Stap 1: Verwijder 'active' class van alle tabs
    const allTabs = document.querySelectorAll('.template-tab');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Stap 2: Voeg 'active' class toe aan geklikte tab via templateType
    const targetTab = document.querySelector(`button[onclick*="${templateType}"]`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Stap 3: Verberg alle template panels
    const allPanels = document.querySelectorAll('.template-panel');
    allPanels.forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Stap 4: Toon het geselecteerde panel
    const selectedPanel = document.getElementById(templateType + '-template');
    if (selectedPanel) {
        selectedPanel.classList.add('active');
        console.log('Switched to template:', templateType);
    } else {
        console.error('Panel not found for template:', templateType);
    }
}

// Communication Templates
function initializeCommunicationTemplates() {
    console.log('Initializing Communication Templates...');
    
    // Ensure all panels are hidden first
    const allPanels = document.querySelectorAll('.template-panel');
    allPanels.forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Remove active from all tabs
    const allTabs = document.querySelectorAll('.template-tab');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Initialize first tab and panel as active
    const firstTab = document.querySelector('.template-tab');
    const firstPanel = document.querySelector('.template-panel');
    
    if (firstTab) {
        firstTab.classList.add('active');
        console.log('First tab activated:', firstTab.textContent);
    }
    
    if (firstPanel) {
        firstPanel.classList.add('active');
        console.log('First panel activated:', firstPanel.id);
    }
    
    console.log('Communication Templates initialization complete');
}

// Legacy template configuration (keeping for compatibility)
function getLegacyTemplates() {
    const templates = {
        management: {
            subject: 'Update: AEC Innovatief Onderwijsproject',
            body: `Geachte [Naam],

Hierbij informeer ik u over de voortgang van het AEC innovatieve onderwijsproject.

Status:
- Fase: [Huidige Fase]
- Voortgang: [Percentage]%
- Belangrijkste mijlpalen bereikt: [Mijlpalen]

Belangrijkste resultaten:
1. [Resultaat 1]
2. [Resultaat 2]
3. [Resultaat 3]

Aandachtspunten:
- [Aandachtspunt 1]
- [Aandachtspunt 2]

Volgende stappen:
- [Stap 1]
- [Stap 2]

Voor vragen ben ik uiteraard beschikbaar.

Met vriendelijke groet,
[Uw naam]`
        },
        teachers: {
            subject: 'Uitnodiging: Training AEC Boardroom Simulatie',
            body: `Beste collega's,

Graag nodig ik jullie uit voor de training over de nieuwe AEC boardroom simulatie methodiek.

Training Details:
- Datum: [Datum]
- Tijd: [Tijd]
- Locatie: [Locatie/Online]
- Duur: 2 uur

Agenda:
1. Introductie boardroom simulatie concept (15 min)
2. Rolverdeling en conflictmanagement (30 min)
3. AI-integratie in het onderwijs (30 min)
4. Praktijkoefening (30 min)
5. Q&A en feedback (15 min)

Voorbereiding:
- Lees het moduleplan door (bijgevoegd)
- Bekijk de online materialenvideo's
- Bereid minimaal één vraag voor

Graag aanmelden via [link/email].

Met vriendelijke groet,
[Naam]`
        },
        students: {
            subject: 'Welkom bij AEC - Boardroom Simulatie',
            body: `Beste studenten,

Welkom bij het vak Algemene Economie C-cluster! Dit kwartaal gaan jullie aan de slag met een unieke boardroom simulatie.

Wat kunnen jullie verwachten:
- Werken in managementteams als Raad van Bestuur
- Wekelijkse strategische beslissingen nemen
- AI-gegenereerde business intelligence analyseren
- Conflicterende belangen balanceren

Belangrijke informatie:
- Eerste les: [Datum en tijd]
- Locatie: [Locatie]
- Teamindeling: Week 1
- Benodigdheden: Laptop met internettoegang

Resources:
- Course website: [URL]
- Teams kanaal: [Link]
- Support: [Email]

We kijken uit naar een uitdagend en leerzaam kwartaal!

Met vriendelijke groet,
Het docententeam`
        },
        committee: {
            subject: 'Ter goedkeuring: AEC Curriculum Innovatie',
            body: `Geachte leden van de curriculumcommissie,

Hierbij leg ik het voorstel voor de AEC curriculum innovatie ter goedkeuring aan u voor.

Samenvatting voorstel:
- Innovatie: AI-geïntegreerde boardroom simulatie
- Doelgroep: [Studiejaar/groep]
- Implementatie: [Startdatum]
- Pilot periode: [Duur]

Belangrijkste innovaties:
1. AI als gegeven input voor besluitvorming
2. Rolgebaseerd conflictmanagement
3. Continue strategieopbouw over 7 weken

Risicomitigatie:
- Fallback naar traditioneel curriculum mogelijk
- Wekelijkse monitoring en bijsturing
- Docentondersteuning gegarandeerd

Bijlagen:
- Volledig projectplan
- Risicoanalyse
- Onderwijskundige onderbouwing
- Planning en resources

Graag ontvang ik uw feedback voor [datum].

Met vriendelijke groet,
[Naam]`
        }
    };
    
    // Add preview and copy functionality
    document.querySelectorAll('.template-card').forEach(card => {
        const templateType = card.getAttribute('data-template');
        
        const previewBtn = card.querySelector('.btn-preview');
        const copyBtn = card.querySelector('.btn-copy');
        
        if (previewBtn) {
            previewBtn.addEventListener('click', () => {
                showTemplateModal(templates[templateType]);
            });
        }
        
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                copyTemplate(templates[templateType]);
            });
        }
    });
}

function showTemplateModal(template) {
    const modal = document.getElementById('templateModal') || createTemplateModal();
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <strong>Onderwerp:</strong><br>
            <input type="text" value="${template.subject}" style="width: 100%; padding: 0.5rem; margin-top: 0.5rem;">
        </div>
        <div>
            <strong>Bericht:</strong><br>
            <textarea style="width: 100%; min-height: 300px; padding: 0.5rem; margin-top: 0.5rem; font-family: inherit;">${template.body}</textarea>
        </div>
    `;
    
    modal.classList.add('active');
}

function createTemplateModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'templateModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Email Template</h3>
                <button class="modal-close">×</button>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal').classList.remove('active')">Sluiten</button>
                <button class="btn btn-primary" onclick="copyModalContent()">Kopiëren</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    return modal;
}

function copyTemplate(template) {
    const text = `Onderwerp: ${template.subject}\n\n${template.body}`;
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Template gekopieerd naar klembord!', 'success');
    }).catch(() => {
        showNotification('Kopiëren mislukt. Probeer opnieuw.', 'error');
    });
}

function copyModalContent() {
    const modal = document.getElementById('templateModal');
    const subject = modal.querySelector('input').value;
    const body = modal.querySelector('textarea').value;
    const text = `Onderwerp: ${subject}\n\n${body}`;
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Template gekopieerd naar klembord!', 'success');
        modal.classList.remove('active');
    });
}

// Decision Flowchart
function initializeDecisionFlowchart() {
    const flowNodes = document.querySelectorAll('.flow-node');
    
    flowNodes.forEach(node => {
        const yesBtn = node.querySelector('.option-yes');
        const noBtn = node.querySelector('.option-no');
        
        if (yesBtn) {
            yesBtn.addEventListener('click', () => {
                handleDecision(node, 'yes');
            });
        }
        
        if (noBtn) {
            noBtn.addEventListener('click', () => {
                handleDecision(node, 'no');
            });
        }
    });
}

function handleDecision(node, decision) {
    const nodeId = node.getAttribute('data-node-id');
    
    // Store decision
    const decisions = JSON.parse(localStorage.getItem('committeeDecisions') || '{}');
    decisions[nodeId] = {
        decision: decision,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('committeeDecisions', JSON.stringify(decisions));
    
    // Visual feedback
    node.style.borderColor = decision === 'yes' ? 'var(--success-green)' : 'var(--danger-red)';
    
    // Show next node based on decision
    const nextNodeId = decision === 'yes' ? 
        node.getAttribute('data-next-yes') : 
        node.getAttribute('data-next-no');
    
    if (nextNodeId) {
        const nextNode = document.querySelector(`[data-node-id="${nextNodeId}"]`);
        if (nextNode) {
            nextNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
            nextNode.classList.add('highlight');
            setTimeout(() => nextNode.classList.remove('highlight'), 2000);
        }
    }
    
    // Update decision status
    updateDecisionStatus();
}

function updateDecisionStatus() {
    const decisions = JSON.parse(localStorage.getItem('committeeDecisions') || '{}');
    const totalNodes = document.querySelectorAll('.flow-node').length;
    const completedNodes = Object.keys(decisions).length;
    
    const statusCard = document.querySelector('.summary-card[data-metric="decision"]');
    if (statusCard) {
        const valueElement = statusCard.querySelector('.card-value');
        if (valueElement) {
            valueElement.textContent = `${completedNodes}/${totalNodes}`;
        }
    }
}

// Metrics Dashboard
function initializeMetrics() {
    // Calculate and display various metrics
    updateRiskScore();
    updateImplementationProgress();
    updateStakeholderReadiness();
}

function updateRiskScore() {
    const riskItems = document.querySelectorAll('.risk-item');
    let totalScore = 0;
    let count = 0;
    
    riskItems.forEach(item => {
        const score = parseInt(item.querySelector('.risk-score')?.textContent || 0);
        totalScore += score;
        count++;
    });
    
    const averageScore = count > 0 ? Math.round(totalScore / count) : 0;
    
    const riskCard = document.querySelector('.summary-card[data-metric="risk"]');
    if (riskCard) {
        const valueElement = riskCard.querySelector('.card-value');
        const statusBadge = riskCard.querySelector('.status-badge');
        
        if (valueElement) valueElement.textContent = averageScore;
        
        if (statusBadge) {
            statusBadge.classList.remove('status-approved', 'status-pending', 'status-critical');
            if (averageScore <= 3) {
                statusBadge.classList.add('status-approved');
                statusBadge.textContent = 'Laag';
            } else if (averageScore <= 6) {
                statusBadge.classList.add('status-pending');
                statusBadge.textContent = 'Medium';
            } else {
                statusBadge.classList.add('status-critical');
                statusBadge.textContent = 'Hoog';
            }
        }
    }
}

function updateImplementationProgress() {
    // This would normally calculate based on actual project data
    const milestones = [
        { name: 'Ontwerp', completed: true },
        { name: 'Ontwikkeling', completed: true },
        { name: 'Testing', completed: true },
        { name: 'Pilot', completed: false },
        { name: 'Evaluatie', completed: false },
        { name: 'Rollout', completed: false }
    ];
    
    const completed = milestones.filter(m => m.completed).length;
    const total = milestones.length;
    const progress = Math.round((completed / total) * 100);
    
    const progressCard = document.querySelector('.summary-card[data-metric="progress"]');
    if (progressCard) {
        const valueElement = progressCard.querySelector('.card-value');
        if (valueElement) valueElement.textContent = `${progress}%`;
    }
}

function updateStakeholderReadiness() {
    const stakeholders = {
        management: 85,
        teachers: 60,
        students: 75,
        support: 70
    };
    
    const average = Math.round(
        Object.values(stakeholders).reduce((a, b) => a + b, 0) / 
        Object.keys(stakeholders).length
    );
    
    const readinessCard = document.querySelector('.summary-card[data-metric="readiness"]');
    if (readinessCard) {
        const valueElement = readinessCard.querySelector('.card-value');
        if (valueElement) valueElement.textContent = `${average}%`;
    }
}

// Modal System
function initializeModals() {
    // Close modals on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
}

// Tooltip System
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.classList.add('tooltip');
    });
}

// Show Risk Details in the risk details section
function showRiskDetails(risks) {
    const riskDetailsSection = document.getElementById('riskDetails');
    if (!riskDetailsSection) return;
    
    let content = '<h3>Risk Details</h3>';
    risks.forEach(risk => {
        const riskText = risk.textContent.trim();
        const riskData = getRiskData(risk.getAttribute('data-risk'));
        
        content += `
            <div class="risk-detail-item" style="margin-bottom: 1.5rem; padding: 1rem; border: 1px solid #ddd; border-radius: 8px;">
                <h4 style="margin: 0 0 0.5rem 0; color: var(--committee-primary);">${riskText}</h4>
                <p><strong>Impact:</strong> ${riskData.impact}</p>
                <p><strong>Waarschijnlijkheid:</strong> ${riskData.probability}</p>
                <p><strong>Beschrijving:</strong> ${riskData.description}</p>
                <p><strong>Mitigatie:</strong> ${riskData.mitigation}</p>
            </div>
        `;
    });
    
    riskDetailsSection.innerHTML = content;
}

// Show individual risk item details
function showRiskItemDetails(riskItem) {
    const riskDetailsSection = document.getElementById('riskDetails');
    if (!riskDetailsSection) return;
    
    const riskText = riskItem.textContent.trim();
    const riskData = getRiskData(riskItem.getAttribute('data-risk'));
    
    const content = `
        <h3>Risk Details</h3>
        <div class="risk-detail-item" style="padding: 1.5rem; border: 1px solid #ddd; border-radius: 8px;">
            <h4 style="margin: 0 0 0.5rem 0; color: var(--committee-primary);">${riskText}</h4>
            <p><strong>Impact:</strong> ${riskData.impact}</p>
            <p><strong>Waarschijnlijkheid:</strong> ${riskData.probability}</p>
            <p><strong>Beschrijving:</strong> ${riskData.description}</p>
            <p><strong>Mitigatie:</strong> ${riskData.mitigation}</p>
        </div>
    `;
    
    riskDetailsSection.innerHTML = content;
}

// Get risk data based on risk identifier
function getRiskData(riskId) {
    const riskDatabase = {
        'tech-failure': {
            impact: 'Hoog',
            probability: 'Laag',
            description: 'Platform storing kan onderwijsproces volledig onderbreken.',
            mitigation: 'GitHub Pages hosting (99.9% uptime), offline fallback via downloads, printbare lesson plans backup.'
        },
        'ai-dependency': {
            impact: 'Hoog', 
            probability: 'Medium',
            description: 'Studenten worden te afhankelijk van AI-output zonder kritische evaluatie.',
            mitigation: 'AI output als startpunt niet eindpunt, focus op kritische evaluatie, rolgebonden interpretatie vereist.'
        },
        'quality': {
            impact: 'Hoog',
            probability: 'Medium', 
            description: 'Kwaliteit van onderwijs kan afnemen door te veel focus op technologie.',
            mitigation: 'Gestandaardiseerde rubrics, peer review systeem, continue monitoring via dashboard.'
        },
        'staff': {
            impact: 'Medium',
            probability: 'Laag',
            description: 'Uitval van getrainde docenten kan continuïteit bedreigen.',
            mitigation: 'Backup docenten trainen, documentatie compleet houden, knowledge sharing sessies.'
        },
        'engagement': {
            impact: 'Medium',
            probability: 'Medium',
            description: 'Student engagement kan afnemen door complexiteit van de simulatie.',
            mitigation: 'Competitief element via teams, weekly nieuwe scenarios, event cards voor dynamiek.'
        },
        'confusion': {
            impact: 'Medium',
            probability: 'Medium',
            description: 'Rol verwarring kan effectiviteit van simulatie verminderen.',
            mitigation: 'Duidelijke rolbeschrijvingen, onboarding proces, regelmatige check-ins.'
        },
        'time': {
            impact: 'Medium',
            probability: 'Hoog',
            description: 'Tijdsdruk tijdens 90-minuten sessies kan kwaliteit beïnvloeden.',
            mitigation: 'Timer widget met fase-indicatie, duidelijke 90-minuten structuur, interventie momenten gepland.'
        },
        'plagiarism': {
            impact: 'Laag',
            probability: 'Laag',
            description: 'Traditionele plagiaat risico\'s zijn minder relevant in simulatie context.',
            mitigation: 'Focus op proces beoordeling, peer evaluation, unieke rol-specifieke opdrachten.'
        },
        'absence': {
            impact: 'Laag',
            probability: 'Medium',
            description: 'Student afwezigheid kan team dynamiek verstoren.',
            mitigation: 'Backup rollen, flexibele team grootte, opname van sessies voor inhaal.'
        },
        'initial-confusion': {
            impact: 'Laag',
            probability: 'Hoog',
            description: 'Initiële verwarring over nieuwe onderwijsmethode is normaal.',
            mitigation: 'Uitgebreide onboarding, FAQ sectie, proactive support eerste weken.'
        }
    };
    
    return riskDatabase[riskId] || {
        impact: 'Onbekend',
        probability: 'Onbekend', 
        description: 'Geen gedetailleerde informatie beschikbaar.',
        mitigation: 'Nader te bepalen.'
    };
}

function createRiskModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'riskModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Risk Details</h3>
                <button class="modal-close">×</button>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal').classList.remove('active')">Sluiten</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    return modal;
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--success-green)' : 
                     type === 'error' ? 'var(--danger-red)' : 
                     'var(--info-blue)'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const committeeStyle = document.createElement('style');
committeeStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .highlight {
        animation: highlight 2s ease;
    }
    
    @keyframes highlight {
        0%, 100% { background: transparent; }
        50% { background: rgba(52, 152, 219, 0.1); }
    }
`;
document.head.appendChild(committeeStyle);

// Data Persistence
function saveChecklistState(itemId, checked) {
    const checklistData = JSON.parse(localStorage.getItem('committeeChecklist') || '{}');
    checklistData[itemId] = checked;
    localStorage.setItem('committeeChecklist', JSON.stringify(checklistData));
}

function loadSavedData() {
    // Load checklist state
    const checklistData = JSON.parse(localStorage.getItem('committeeChecklist') || '{}');
    Object.keys(checklistData).forEach(itemId => {
        const checkbox = document.querySelector(`[data-item-id="${itemId}"]`);
        if (checkbox && checklistData[itemId]) {
            checkbox.classList.add('checked');
        }
    });
    
    // Load decisions
    const decisions = JSON.parse(localStorage.getItem('committeeDecisions') || '{}');
    Object.keys(decisions).forEach(nodeId => {
        const node = document.querySelector(`[data-node-id="${nodeId}"]`);
        if (node) {
            const decision = decisions[nodeId].decision;
            node.style.borderColor = decision === 'yes' ? 'var(--success-green)' : 'var(--danger-red)';
        }
    });
    
    // Update all metrics
    updateOverallQAStatus();
    updateDecisionStatus();
}

// Export Functions
function exportReport() {
    const reportData = {
        timestamp: new Date().toISOString(),
        riskScore: document.querySelector('.summary-card[data-metric="risk"] .card-value')?.textContent,
        qaProgress: document.querySelector('.summary-card[data-metric="qa"] .card-value')?.textContent,
        implementation: document.querySelector('.summary-card[data-metric="progress"] .card-value')?.textContent,
        checklist: JSON.parse(localStorage.getItem('committeeChecklist') || '{}'),
        decisions: JSON.parse(localStorage.getItem('committeeDecisions') || '{}')
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `committee-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Report geëxporteerd!', 'success');
}

// Print Functionality
function printReport() {
    window.print();
}

// Initialize Print Button
document.addEventListener('DOMContentLoaded', function() {
    const printBtn = document.querySelector('.btn-print');
    if (printBtn) {
        printBtn.addEventListener('click', printReport);
    }
    
    const exportBtn = document.querySelector('.btn-export');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportReport);
    }
});

// Make showTemplate globally available
window.showTemplate = showTemplate;