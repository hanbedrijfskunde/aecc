/* ==========================================
   FAQ Section with Search
   ========================================== */

class FAQSystem {
    constructor() {
        this.questions = this.getFAQData();
        this.filteredQuestions = [...this.questions];
        this.isOpen = false;
    }

    // FAQ Data
    getFAQData() {
        return [
            {
                category: 'Algemeen',
                questions: [
                    {
                        q: 'Wat is de AEC Boardroom Simulatie precies?',
                        a: 'De AEC Boardroom Simulatie is een innovatief onderwijsconcept waarbij je als lid van een Raad van Bestuur (CEO, CFO, COO of CIO) strategische beslissingen neemt. Je gebruikt AI-gegenereerde intelligence briefings als basis voor boardroom discussies. Het doel is om te leren beslissen onder onzekerheid, niet om data te reproduceren.'
                    },
                    {
                        q: 'Waarom gebruiken we AI in deze cursus?',
                        a: 'AI genereert de business intelligence briefings die als uitgangspunt dienen voor jullie beslissingen. Dit simuleert de realiteit waarin executives ook werken met door analisten voorbereide rapporten. De AI-output is een gegeven - jullie taak is om daar strategische beslissingen op te baseren, niet om de output te verbeteren.'
                    },
                    {
                        q: 'Wat betekent "Project Continuïteit"?',
                        a: 'Project Continuïteit betekent dat elke week voortbouwt op de beslissingen van voorgaande weken. Je bouwt gedurende 7 weken aan één coherente strategie. Elke weekbeslissing wordt een "pijler" van je totale strategie. In week 6 integreer je alle pijlers tot één samenhangend verhaal.'
                    }
                ]
            },
            {
                category: 'Rollen & Teams',
                questions: [
                    {
                        q: 'Hoe worden de rollen verdeeld?',
                        a: 'Elk team bestaat uit 4 leden: CEO (leidt en balanceert), CFO (focus op financieel rendement en buyback), COO (focus op operationele efficiëntie en exploit), en CIO (focus op innovatie en explore). Verdeel de rollen onderling based op interesse en sterke punten.'
                    },
                    {
                        q: 'Kan ik van rol wisselen tijdens de cursus?',
                        a: 'Nee, je houdt dezelfde rol gedurende alle 7 weken. Dit zorgt voor consistentie in perspectief en helpt je om echt vanuit één executive rol te leren denken. In week 7 wissel je wel van RvB naar RvT (Raad van Toezicht) rol.'
                    },
                    {
                        q: 'Wat als ons team uit minder dan 4 personen bestaat?',
                        a: 'Bij kleinere teams combineert één persoon meerdere rollen. Bijvoorbeeld: bij 3 personen kan de CEO ook de CFO-rol vervullen. Het belangrijkste is dat alle perspectieven (exploit, explore, buyback) vertegenwoordigd zijn in de discussie.'
                    }
                ]
            },
            {
                category: 'Wekelijkse Workflow',
                questions: [
                    {
                        q: 'Wat is het weekschema?',
                        a: 'Maandag: Ontvang AI-briefing. Dinsdag-Woensdag: Individuele analyse vanuit je rol. Donderdag: 90 minuten boardroom simulatie (werkcollege). Vrijdag: Documenteer jullie strategische besluit als "pijler". Elke week heeft een nieuw thema maar bouwt voort op eerdere beslissingen.'
                    },
                    {
                        q: 'Hoeveel tijd kost de cursus per week?',
                        a: 'Reken op ongeveer 6-8 uur per week: 2-3 uur voorbereiding (AI-briefing analyseren), 2 uur werkcollege (boardroom simulatie), 2-3 uur voor documentatie en reflectie. De exacte tijd hangt af van hoe diep je in de materie duikt.'
                    },
                    {
                        q: 'Wat als ik een werkcollege mis?',
                        a: 'Probeer dit te voorkomen omdat de boardroom simulatie de kern van de cursus is. Als het toch gebeurt: vraag je teamleden om een uitgebreide briefing, bestudeer hun besluitdocumentatie, en lever alsnog je individuele analyse in. Je mist wel de discussie-ervaring.'
                    }
                ]
            },
            {
                category: 'Het Driehoeksconflict',
                questions: [
                    {
                        q: 'Wat is het driehoeksconflict precies?',
                        a: 'Het driehoeksconflict is de fundamentele spanning tussen drie strategische richtingen: Exploit (optimaliseer huidige business - COO), Explore (ontdek nieuwe mogelijkheden - CIO), en Buyback (geef kapitaal terug aan aandeelhouders - CFO). De CEO moet deze in balans houden.'
                    },
                    {
                        q: 'Moet ik altijd voor mijn eigen strategie pleiten?',
                        a: 'Ja, je pleit primair vanuit je rol-perspectief (COO voor exploit, CIO voor explore, CFO voor buyback). Maar je moet ook luisteren naar anderen en compromissen kunnen sluiten. Het gaat om realistische boardroom dynamiek, niet om star vasthouden aan één positie.'
                    },
                    {
                        q: 'Hoe bepalen we de uiteindelijke balans?',
                        a: 'De CEO faciliteert de discussie en zoekt naar consensus. Meestal eindigt een besluit met een hoofdrichting (bijv. 50% exploit) en twee ondersteunende richtingen (bijv. 30% explore, 20% buyback). De exacte verdeling hangt af van de weekcase en jullie argumenten.'
                    }
                ]
            },
            {
                category: 'AI & Technologie',
                questions: [
                    {
                        q: 'Welke AI-tool moet ik gebruiken?',
                        a: 'Je mag elke AI-tool gebruiken die je wilt: ChatGPT, Claude, Gemini, etc. Gebruik de prompt templates die we aanleveren als startpunt. Het belangrijkste is dat je de AI-output als intelligence briefing gebruikt, niet als kant-en-klaar antwoord.'
                    },
                    {
                        q: 'Mag ik de AI-prompts aanpassen?',
                        a: 'Ja, je mag de prompts aanpassen aan je behoefte. Vraag door op punten die relevant zijn voor jouw rol. De basis-prompt is een startpunt. Experimenteer gerust met verschillende invalshoeken om rijkere briefings te krijgen.'
                    },
                    {
                        q: 'Wat als de AI tegenstrijdige informatie geeft?',
                        a: 'Dat is realistisch - ook in het echt zijn intelligence briefings soms tegenstrijdig. Gebruik dit als discussiepunt in de boardroom. Welke informatie vertrouwen jullie? Hoe gaan jullie om met onzekerheid? Dit is juist waardevol voor de simulatie.'
                    }
                ]
            },
            {
                category: 'Beoordeling',
                questions: [
                    {
                        q: 'Hoe word ik beoordeeld?',
                        a: 'Je wordt beoordeeld op: 1) Kwaliteit van je rolanalyse, 2) Actieve deelname aan boardroom discussies, 3) Bijdrage aan teambesluiten, 4) Project continuïteit (voortbouwen op eerdere weken), 5) Eindpresentatie in week 6, 6) Kritische bevraging als RvT in week 7.'
                    },
                    {
                        q: 'Telt elke week even zwaar mee?',
                        a: 'Nee. Week 1-5 zijn formatief (oefening/feedback). Week 6 (eindpresentatie) en week 7 (RvT bevraging) zijn summatief en tellen het zwaarst. Maar consistente deelname door alle weken is essentieel voor een goed eindresultaat.'
                    },
                    {
                        q: 'Wat gebeurt er in week 7?',
                        a: 'In week 7 wissel je van rol: je wordt Raad van Toezicht (RvT) met een specialistische persona (bijv. duurzaamheidsexpert, tech-investeerder). Je bevraagt kritisch de strategie van een ander team. Dit test je analytisch vermogen en strategisch inzicht.'
                    }
                ]
            }
        ];
    }

    // Initialize FAQ
    init() {
        this.addFAQButton();
    }

    // Add FAQ button to page
    addFAQButton() {
        const buttonHTML = `
            <button class="faq-float-button" onclick="faq.toggle()" title="Veelgestelde Vragen">
                <span class="faq-icon">❓</span>
                <span class="faq-label">FAQ</span>
            </button>
        `;
        document.body.insertAdjacentHTML('beforeend', buttonHTML);
    }

    // Toggle FAQ modal
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    // Open FAQ modal
    open() {
        this.createFAQModal();
        this.isOpen = true;
        this.renderQuestions();
    }

    // Close FAQ modal
    close() {
        const modal = document.getElementById('faqModal');
        if (modal) {
            modal.classList.add('fade-out');
            setTimeout(() => modal.remove(), 300);
        }
        this.isOpen = false;
    }

    // Create FAQ modal structure
    createFAQModal() {
        const modalHTML = `
            <div class="faq-modal-overlay" id="faqModal">
                <div class="faq-modal">
                    <div class="faq-header">
                        <h2>❓ Veelgestelde Vragen</h2>
                        <button class="faq-close" onclick="faq.close()">×</button>
                    </div>
                    
                    <div class="faq-search">
                        <input type="text" 
                               id="faqSearch" 
                               placeholder="Zoek in FAQ..." 
                               onkeyup="faq.searchQuestions(this.value)">
                        <span class="search-icon">🔍</span>
                    </div>
                    
                    <div class="faq-content" id="faqContent">
                        <!-- Questions will be rendered here -->
                    </div>
                    
                    <div class="faq-footer">
                        <div class="contact-info">
                            <h4>Nog vragen?</h4>
                            <p>📧 Email: <a href="mailto:docent@hanbedrijfskunde.nl">docent@hanbedrijfskunde.nl</a></p>
                            <p>📚 Resources: <a href="#resources">Bekijk alle resources</a></p>
                            <p>💬 Teams: Stel je vraag in het cursuskanaal</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addFAQStyles();
        
        // Focus search field
        setTimeout(() => {
            document.getElementById('faqSearch').focus();
        }, 100);
    }

    // Render questions in modal
    renderQuestions(searchTerm = '') {
        const content = document.getElementById('faqContent');
        if (!content) return;
        
        let html = '';
        
        this.questions.forEach(category => {
            const filteredQuestions = searchTerm 
                ? category.questions.filter(q => 
                    q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    q.a.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                : category.questions;
            
            if (filteredQuestions.length > 0) {
                html += `
                    <div class="faq-category">
                        <h3>${category.category}</h3>
                        <div class="faq-items">
                `;
                
                filteredQuestions.forEach((item, index) => {
                    const uniqueId = `${category.category}-${index}`;
                    html += `
                        <div class="faq-item">
                            <button class="faq-question" onclick="faq.toggleAnswer('${uniqueId}')">
                                <span>${item.q}</span>
                                <span class="faq-arrow" id="arrow-${uniqueId}">▼</span>
                            </button>
                            <div class="faq-answer" id="answer-${uniqueId}" style="display: none;">
                                <p>${item.a}</p>
                            </div>
                        </div>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
            }
        });
        
        if (html === '') {
            html = `
                <div class="no-results">
                    <p>Geen resultaten gevonden voor "${searchTerm}"</p>
                    <p>Probeer een andere zoekterm of <a href="#" onclick="faq.clearSearch()">bekijk alle vragen</a></p>
                </div>
            `;
        }
        
        content.innerHTML = html;
    }

    // Search questions
    searchQuestions(term) {
        this.renderQuestions(term);
    }

    // Clear search
    clearSearch() {
        document.getElementById('faqSearch').value = '';
        this.renderQuestions();
    }

    // Toggle answer visibility
    toggleAnswer(id) {
        const answer = document.getElementById(`answer-${id}`);
        const arrow = document.getElementById(`arrow-${id}`);
        
        if (answer) {
            if (answer.style.display === 'none') {
                // Close all other answers first
                document.querySelectorAll('.faq-answer').forEach(a => {
                    a.style.display = 'none';
                });
                document.querySelectorAll('.faq-arrow').forEach(a => {
                    a.style.transform = 'rotate(0deg)';
                });
                
                // Open this answer
                answer.style.display = 'block';
                arrow.style.transform = 'rotate(180deg)';
            } else {
                answer.style.display = 'none';
                arrow.style.transform = 'rotate(0deg)';
            }
        }
    }

    // Add FAQ styles
    addFAQStyles() {
        if (document.getElementById('faqStyles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'faqStyles';
        styles.textContent = `
            .faq-float-button {
                position: fixed;
                bottom: var(--space-xl);
                left: var(--space-xl);
                background: linear-gradient(135deg, #3498DB 0%, #2980B9 100%);
                color: white;
                border: none;
                padding: var(--space-md) var(--space-lg);
                border-radius: 30px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
                transition: all 0.3s;
                z-index: 999;
                display: flex;
                align-items: center;
                gap: var(--space-sm);
                font-weight: 600;
            }
            
            .faq-float-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(52, 152, 219, 0.4);
            }
            
            .faq-icon {
                font-size: 1.2rem;
            }
            
            .faq-modal-overlay {
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
            
            .faq-modal-overlay.fade-out {
                animation: fadeOut 0.3s;
            }
            
            .faq-modal {
                background: white;
                border-radius: var(--radius-xl);
                max-width: 800px;
                width: 90%;
                max-height: 80vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.3s;
            }
            
            .faq-header {
                padding: var(--space-xl);
                border-bottom: 1px solid #E8E8E8;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .faq-header h2 {
                margin: 0;
                color: var(--text-dark);
            }
            
            .faq-close {
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                color: #999;
                transition: color 0.3s;
            }
            
            .faq-close:hover {
                color: #333;
            }
            
            .faq-search {
                padding: var(--space-lg);
                background: #F8F9FA;
                position: relative;
            }
            
            .faq-search input {
                width: 100%;
                padding: var(--space-md) var(--space-xl);
                padding-right: 50px;
                border: 2px solid #E8E8E8;
                border-radius: var(--radius-md);
                font-size: 1rem;
                transition: border-color 0.3s;
            }
            
            .faq-search input:focus {
                outline: none;
                border-color: var(--primary-green);
            }
            
            .search-icon {
                position: absolute;
                right: calc(var(--space-lg) + var(--space-md));
                top: 50%;
                transform: translateY(-50%);
                font-size: 1.2rem;
                color: #999;
            }
            
            .faq-content {
                flex: 1;
                overflow-y: auto;
                padding: var(--space-xl);
            }
            
            .faq-category {
                margin-bottom: var(--space-xl);
            }
            
            .faq-category h3 {
                color: var(--primary-green);
                margin-bottom: var(--space-md);
                padding-bottom: var(--space-sm);
                border-bottom: 2px solid var(--primary-green);
            }
            
            .faq-item {
                margin-bottom: var(--space-md);
                border: 1px solid #E8E8E8;
                border-radius: var(--radius-md);
                overflow: hidden;
            }
            
            .faq-question {
                width: 100%;
                padding: var(--space-lg);
                background: white;
                border: none;
                text-align: left;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: background 0.3s;
                font-size: 1rem;
                font-weight: 500;
                color: var(--text-dark);
            }
            
            .faq-question:hover {
                background: #F8F9FA;
            }
            
            .faq-arrow {
                transition: transform 0.3s;
                color: var(--primary-green);
                font-size: 0.8rem;
            }
            
            .faq-answer {
                padding: var(--space-lg);
                background: #F8F9FA;
                border-top: 1px solid #E8E8E8;
            }
            
            .faq-answer p {
                margin: 0;
                line-height: 1.6;
                color: var(--text-medium);
            }
            
            .faq-footer {
                padding: var(--space-xl);
                background: #F8F9FA;
                border-top: 1px solid #E8E8E8;
            }
            
            .contact-info h4 {
                margin-top: 0;
                color: var(--text-dark);
            }
            
            .contact-info p {
                margin: var(--space-sm) 0;
                color: var(--text-medium);
            }
            
            .contact-info a {
                color: var(--primary-green);
                text-decoration: none;
            }
            
            .contact-info a:hover {
                text-decoration: underline;
            }
            
            .no-results {
                text-align: center;
                padding: var(--space-2xl);
                color: var(--text-medium);
            }
            
            .no-results a {
                color: var(--primary-green);
                text-decoration: none;
            }
            
            @media (max-width: 768px) {
                .faq-modal {
                    width: 95%;
                    max-height: 90vh;
                }
                
                .faq-float-button {
                    bottom: var(--space-lg);
                    left: var(--space-lg);
                }
                
                .faq-float-button .faq-label {
                    display: none;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Initialize FAQ
const faq = new FAQSystem();
document.addEventListener('DOMContentLoaded', () => {
    faq.init();
});

// Make FAQ available globally for onboarding
window.faq = faq;