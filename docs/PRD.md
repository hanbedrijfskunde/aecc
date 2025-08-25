# Product Requirements Document (PRD)
## AEC Cursus Website

**Versie:** 5.0  
**Datum:** 24 augustus 2024  
**Status:** Draft  
**Context:** Dit is versie 5 van een iteratief ontwerpproces voor een pedagogische innovatie

---

## 1. Executive Summary

### 1.1 Product Visie
Een moderne, gebruiksvriendelijke website voor de cursus "Algemene Economie C-cluster" (AEC) die drie verschillende gebruikersgroepen bedient met specifieke, op maat gemaakte interfaces. De website faciliteert een innovatieve boardroom-simulatie waarbij studenten leren strategische beslissingen te nemen op basis van AI-gegenereerde intelligence briefings. Dit is geen traditionele cursuswebsite maar een **pedagogisch instrument ontworpen voor AI-proof HBO-onderwijs**.

### 1.2 Doelstellingen
- **Studenten**: Trainen in vaardigheden die AI niet kan vervangen: strategische besluitvorming, belangenafweging, coherente strategieopbouw
- **Docenten**: Faciliteren van boardroom-simulaties met duidelijke didactische handvatten (WAAROM/HOE/WAT)
- **Curriculum Commissie**: Transparantie bieden over de pedagogische innovatie en risicomanagement

### 1.3 Pedagogische Innovatie Context

#### Het Probleem
Traditioneel HBO-onderwijs waarbij studenten vragen beantwoorden en analyses maken wordt obsoleet door AI. Studenten kunnen opdrachten simpelweg door AI laten uitvoeren, waardoor de leerwaarde verdampt.

#### De Oplossing: "AI als Gegeven"
In plaats van AI te verbieden of te negeren, omarmt deze module AI volledig. De fundamentele aanname: **"AI kan een volledig en goed onderzocht onderzoek genereren."** De focus verschuift van kennisreproductie naar wat mensen uniek maken: besluitvorming onder onzekerheid met conflicterende belangen.

#### De Methodiek: Boardroom Simulatie
- Studenten vormen een Raad van Bestuur (RvB) met conflicterende rollen
- AI-output is de gemeenschappelijke intelligence briefing
- Wekelijkse strategische beslissingen bouwen op elkaar voort ("Project Continuïteit")
- Eindtoets: studenten functioneren als specialistische Raad van Toezicht (RvT)

---

## 2. Gebruikersanalyse

### 2.1 Primaire Gebruikers

#### **Studenten (HBO Bedrijfskunde)**
- **Aantal**: ~120 per semester
- **Leeftijd**: 18-25 jaar
- **Tech-savviness**: Hoog, mobile-first generatie
- **Behoeften**:
  - Duidelijk overzicht van weekopdrachten
  - Makkelijke toegang tot AI-prompt templates
  - Inzicht in hun rol (CEO/CFO/COO/CIO)
  - Progress tracking
  - Peer review tools voor RvT fase

#### **Docenten**
- **Aantal**: 4-6 docenten
- **Context**: Geven meerdere werkcolleges per week
- **Behoeften**:
  - Quick-reference lesplannen
  - Timer tools voor boardroom simulaties
  - Didactische aanwijzingen per fase
  - Assessment rubrics
  - Overzicht studentenrollen

#### **Curriculum Commissie**
- **Aantal**: 3-5 leden
- **Frequentie**: Quarterly reviews
- **Behoeften**:
  - Onderwijskundige verantwoording
  - Risico-analyse en mitigatie
  - Innovatie rationale (AI-integratie)
  - Leerdoelen mapping

### 2.2 User Journeys

#### **Student Journey (Week 1-7)**
1. **Week 1-5**: Wekelijks RvB rol vervullen
   - AI briefing genereren
   - Voorbereiden vanuit rol perspectief
   - Boardroom simulatie bijwonen
   - Strategische beslissing documenteren
   
2. **Week 6-7**: RvT rol voor peer review
   - Persona kaart bestuderen
   - Andere teams kritisch bevragen
   - Feedback formuleren

#### **Docent Journey (Per werkcollege)**
1. **Voorbereiding** (30 min voor les)
   - Weekplan doornemen
   - Materialen klaarzetten
   - Rollen verdelen

2. **Tijdens les** (135 min)
   - Timer starten voor fases
   - Discussie faciliteren
   - Interventies plegen volgens script
   - Beslissingen vastleggen

3. **Na les** (15 min)
   - Resultaten invoeren
   - Notities voor volgende week

---

## 3. Functionele Requirements

### 3.1 Landing Page (index.html)

#### Must Have
- [ ] Cursustitel en korte introductie
- [ ] 3 prominente kaarten voor doelgroepen
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Visueel aantrekkelijk met thema kleuren

#### Should Have
- [ ] Animated entrance effects
- [ ] Hover states met preview info
- [ ] Quick links naar belangrijke secties

#### Could Have
- [ ] Video introductie
- [ ] Testimonials van vorige studenten

### 3.2 Studenten Interface (studenten.html)

#### Must Have
- [ ] **Week Navigator**
  - 7 week cards met status indicators
  - Current week highlight
  - Progress percentage per week
  - Visuele verbinding tussen weken (doorlopend narratief)
  
- [ ] **Per Week View - WAAROM/HOE/WAT Structuur**
  - **WAAROM sectie**: Didactische rationale voor deze week
  - **HOE sectie**: Stapsgewijze aanpak voor de opdracht
  - **WAT sectie**: Concrete deliverables en beoordelingscriteria
  - AI prompt template (copy-ready)
  - Deadline countdown met inlevermomenten
  
- [ ] **Het Driehoeksconflict Visualisatie**
  - Interactieve driehoek: Exploit vs Explore vs Aandeleninkoop
  - Dynamische balans indicator
  - Uitleg per strategie met voor/nadelen
  
- [ ] **Rollen Sectie**
  - 4 rol cards (CEO/CFO/COO/CIO)
  - Rol beschrijving en conflicterende belangen
  - Persona details en beslissingscriteria
  - "Jouw rol deze week" highlighter
  
- [ ] **Project Continuïteit Timeline**
  - Visuele weergave van genomen beslissingen (Pijlers)
  - Hoe elke week voortbouwt op de vorige
  - Strategie coherentie checker
  
- [ ] **Resources**
  - Download links voor templates
  - Strategyzer model uitleg
  - Feedbackflow diagram

#### Should Have
- [ ] Personal progress dashboard
- [ ] Bookmark functionaliteit
- [ ] Print-friendly opdracht sheets
- [ ] AI briefing geschiedenis

#### Could Have
- [ ] Peer collaboration tools
- [ ] Achievement badges
- [ ] Discussion forum links

### 3.3 Docenten Dashboard (docenten.html)

#### Must Have
- [ ] **Week Planner**
  - Alle 7 weken overzicht
  - Per week: voor/tijdens/na structuur
  - Printbare lesplannen
  
- [ ] **Boardroom Timer**
  - Preset tijden per fase
  - Visual countdown
  - Audio alerts optie
  
- [ ] **Didactische Hulp**
  - Interventie suggesties
  - Discussie starters
  - Rol-specifieke vragen
  
- [ ] **Assessment Tools**
  - Beoordelingsrubrics
  - Checklist voor deliverables

#### Should Have
- [ ] Student rol overzicht
- [ ] Event cards bibliotheek
- [ ] Notes sectie per week
- [ ] Quick navigation tussen weken

#### Could Have
- [ ] Export naar calendar
- [ ] Team generator tool
- [ ] Feedback templates

### 3.4 Curriculum Commissie (commissie.html)

#### Must Have
- [ ] **Onderwijskundige Verantwoording**
  - Leerdoelen matrix
  - Competentie mapping
  - Toetsing validatie
  
- [ ] **Risico Management**
  - Geïdentificeerde risico's tabel
  - Impact/probability matrix
  - Mitigatie strategieën
  - Monitoring indicators
  
- [ ] **Innovatie Rationale**
  - AI-integratie motivatie
  - Verwachte leeruitkomsten
  - Meetbare KPI's

#### Should Have
- [ ] Changelog van updates
- [ ] Feedback analyse
- [ ] Benchmark met andere modules

#### Could Have
- [ ] Student evaluatie data
- [ ] Trend analyses
- [ ] Export functionaliteit

---

## 4. Non-Functionele Requirements

### 4.1 Performance
- **Page Load**: < 3 seconden op 3G
- **Interaction Response**: < 100ms
- **Smooth Animations**: 60 FPS

### 4.2 Accessibility
- **WCAG 2.1 AA** compliant
- **Keyboard Navigation**: Volledig navigeerbaar
- **Screen Reader**: Compatible met NVDA/JAWS
- **Color Contrast**: Minimum 4.5:1 ratio

### 4.3 Browser Compatibiliteit
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

### 4.4 Responsive Design
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+
- **Print**: Optimized stylesheets

### 4.5 Security & Privacy
- Geen persoonlijke data opslag
- HTTPS only deployment
- Content Security Policy headers
- No third-party trackers

---

## 5. Design Requirements

### 5.1 Visual Identity

#### Kleurenpalet
```css
--primary-green: #8FD14F;      /* Fris appelgroen */
--primary-green-light: #A8E06A; /* Voor gradients */
--accent-red: #E63946;         /* Framboosrood */
--accent-red-light: #FF6B6B;   /* Voor highlights */
--base-white: rgba(255,255,255,0.9);
--background-grey: #F8F9FA;
--text-dark: #2C3E50;
--text-light: #6C757D;
```

#### Typography
- **Headers**: Inter, -apple-system, system-ui
- **Body**: Inter, -apple-system, system-ui
- **Monospace**: 'Fira Code', 'Courier New'
- **Line Height**: 1.8 voor body text
- **Font Sizes**: Fluid typography met clamp()

### 5.2 UX Principles
- **Clarity**: Kristalhelder, geen verwarring
- **Serenity**: Rust, veel whitespace
- **Fluidity**: Water-inspired animations
- **Transparency**: Glassmorphism effects
- **Delight**: Subtiele micro-interactions

### 5.3 Component Library

#### Cards
- White background met 85% opacity
- Backdrop blur: 10px
- Border radius: 16px
- Soft shadow: 0 10px 40px rgba(0,0,0,0.1)
- Hover: scale(1.02) met transition

#### Buttons
- Primary: Appelgroen met white text
- Secondary: White met groene border
- Danger: Framboosrood
- Ripple effect on click
- Disabled state met 50% opacity

#### Navigation
- Sticky top navigation
- Glass effect background
- Active state met colored underline
- Smooth scroll to sections

---

## 6. Technical Specifications

### 6.1 Architecture
```
Multi-page Static Website
├── 4 HTML pages (index, studenten, docenten, commissie)
├── 1 Shared CSS file
├── 1 Shared JavaScript file
└── 1 JSON content database
```

### 6.2 Technology Stack
- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox
- **JavaScript ES6+**: Vanilla, no frameworks
- **JSON**: Content management
- **GitHub Pages**: Hosting

### 6.3 Data Structure
```json
{
  "metadata": {
    "version": "1.0",
    "lastUpdated": "2024-08-24",
    "language": "nl"
  },
  "course": {
    "name": "Algemene Economie C-cluster",
    "abbreviation": "AEC",
    "duration": 7,
    "ects": 5
  },
  "weeks": [{
    "number": 1,
    "title": "De Aftrap",
    "theme": "Waar zetten we ons geld op in?",
    "student": {
      "preparation": [],
      "objectives": [],
      "deliverables": [],
      "aiPrompt": ""
    },
    "teacher": {
      "beforeClass": [],
      "duringClass": {
        "phases": [],
        "timing": [],
        "interventions": []
      },
      "afterClass": [],
      "didactics": ""
    }
  }],
  "roles": [],
  "personas": [],
  "risks": []
}
```

### 6.4 Browser APIs Used
- LocalStorage (user preferences)
- Fetch API (load JSON)
- IntersectionObserver (lazy loading)
- CSS Custom Properties (theming)
- Print Media Queries

---

## 7. Content Requirements

### 7.1 Content Toon
- **Nederlands**: Alle content in het Nederlands
- **Formeel maar toegankelijk**: Je-vorm voor studenten
- **Actief en engaging**: Gebruik werkwoorden
- **Consistent**: Zelfde terminologie overal

### 7.2 Content Structuur
- **Scannable**: Headers, bullets, korte paragrafen
- **Hierarchisch**: Duidelijke informatie architectuur
- **Actionable**: Concrete stappen en acties
- **Contextual**: Relevante info op juiste moment

---

## 8. Testing Requirements

### 8.1 Test Strategie
- Unit tests per component
- Integration tests per pagina
- User acceptance testing met doelgroepen
- Performance testing
- Accessibility audit

### 8.2 Test Scenarios

#### Studenten
1. Navigeer naar week 3
2. Kopieer AI prompt
3. Check rol beschrijving
4. Download template

#### Docenten
1. Open lesplan week 5
2. Start boardroom timer
3. Print lesplan
4. Check assessment rubric

#### Commissie
1. Review risico matrix
2. Check leerdoelen mapping
3. Lees innovatie rationale

---

## 9. Development Phases

### Phase 1: Foundation (Sprint 1)
- [ ] Setup project structure
- [ ] Create landing page
- [ ] Implement base styling
- [ ] Setup JSON structure

### Phase 2: Student Experience (Sprint 2)
- [ ] Build student interface
- [ ] Implement week navigation
- [ ] Add role cards
- [ ] Create AI prompt system

### Phase 3: Teacher Tools (Sprint 3)
- [ ] Create teacher dashboard
- [ ] Build timer widget
- [ ] Add lesson plans
- [ ] Implement assessment tools

### Phase 4: Committee Portal (Sprint 4)
- [ ] Build committee page
- [ ] Create risk matrix
- [ ] Add accountability docs
- [ ] Implement KPI dashboard

### Phase 5: Polish & Deploy (Sprint 5)
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Deploy to GitHub Pages

---

## 10. Success Metrics

### 10.1 Kwantitatief
- **Page Load Time**: < 3 sec (gemeten met Lighthouse)
- **Accessibility Score**: > 95 (gemeten met axe)
- **Mobile Usage**: > 40% van traffic
- **Weekly Active Users**: > 80% van enrolled studenten

### 10.2 Kwalitatief
- Student tevredenheid > 4.0/5.0
- Docent adoptie 100%
- Positieve curriculum commissie review
- Verbeterde les efficiëntie

### 10.3 Pedagogische KPIs
- **Strategische Coherentie**: > 70% van teams bouwt coherente strategie over 7 weken
- **AI-Tool Adoptie**: 100% gebruikt AI als briefing tool (niet als antwoord)
- **Conflict Management**: > 80% van boardroom simulaties resulteert in consensusbesluit
- **Kritisch Denken**: Gemiddeld 3+ diepgaande vragen per RvT-sessie
- **Rolbegrip**: > 90% kan de conflicterende belangen van hun rol articuleren

---

## 11. Risico's en Mitigatie

| Risico | Impact | Kans | Mitigatie |
|--------|--------|------|-----------|
| Browser incompatibiliteit | Hoog | Laag | Progressive enhancement, feature detection |
| Trage JSON loading | Medium | Medium | Lazy loading, caching strategieën |
| Complexe navigatie | Hoog | Medium | User testing, clear information architecture |
| Content updates | Laag | Hoog | Duidelijke JSON structuur, documentatie |
| Mobile performance | Medium | Medium | Optimize assets, test on real devices |

---

## 12. Appendices

### A. Wireframes
*[Te ontwikkelen in design fase]*

### B. User Research
- Interviews met 5 studenten
- Observatie van 3 werkcolleges
- Feedback van 2 docenten

### C. Competitive Analysis
- Vergelijking met andere HBO modules
- Best practices van educational platforms

### D. Technical Decisions
- Waarom geen framework: Simpliciteit, learning curve, maintenance
- Waarom GitHub Pages: Gratis, betrouwbaar, version control
- Waarom JSON: Flexibel, makkelijk te updaten, geen database nodig

### E. Ontwerpevolutie - Van Concept naar Implementatie

#### **Fase 1: "AI als Stagiair"**
Eerste concept waarbij studenten AI-output moesten verbeteren en valideren. Verworpen omdat dit niet de kern raakt van wat mensen uniek maakt.

#### **Fase 2: "De Boardroom Simulatie"** (PIVOT 1)
Cruciale shift: AI-output wordt geaccepteerd als volledig en correct. Focus verschuift naar strategische besluitvorming met de AI-briefing als input.

#### **Fase 3: "Project Continuïteit"**
Losse weken worden verbonden tot één doorlopend strategisch narratief waarbij elke beslissing voortbouwt op de vorige.

#### **Fase 4: "De Dubbelrol"** (PIVOT 2)
Innovatie voor eindtoets: studenten zijn zowel RvB (presenteren) als specialistische RvT (kritisch bevragen).

#### **Website Iteraties:**
- **V1**: Basis draaiboeken en verantwoording
- **V2**: UX verfijning, meer webapplicatie gevoel
- **V3**: WAAROM/HOE/WAT structuur toegevoegd
- **V4**: Inlevermomenten en feedbackflow
- **V5**: Huidige versie met complete pedagogische context

---

**Document Status**: Dit PRD is een levend document en wordt bijgewerkt op basis van stakeholder feedback en development insights.

**Approval**: 
- [ ] Product Owner
- [ ] Lead Developer
- [ ] UX Designer
- [ ] Curriculum Commissie Vertegenwoordiger