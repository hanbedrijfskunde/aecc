// Content Loader - content-loader.js
// Handles fetching and managing course content from content.json

class ContentLoader {
    constructor() {
        this.content = null;
        this.loadPromise = null;
        this.observers = [];
        this.cache = {
            timestamp: null,
            data: null,
            ttl: 5 * 60 * 1000 // 5 minutes cache
        };
    }

    // Singleton pattern
    static getInstance() {
        if (!ContentLoader.instance) {
            ContentLoader.instance = new ContentLoader();
        }
        return ContentLoader.instance;
    }

    // Load content from JSON file
    async loadContent(forceRefresh = false) {
        // Check cache first
        if (!forceRefresh && this.isCacheValid()) {
            this.content = this.cache.data;
            return this.content;
        }

        // Prevent multiple simultaneous loads
        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = this.fetchContent();
        
        try {
            this.content = await this.loadPromise;
            this.updateCache(this.content);
            this.notifyObservers('content-loaded', this.content);
            return this.content;
        } catch (error) {
            this.notifyObservers('content-error', error);
            throw error;
        } finally {
            this.loadPromise = null;
        }
    }

    // Fetch content from server
    async fetchContent() {
        try {
            const response = await fetch('content.json', {
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to load content: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            this.validateContent(data);
            return data;
        } catch (error) {
            console.error('Error fetching content:', error);
            // Try to load from localStorage as fallback
            const fallback = this.loadFromLocalStorage();
            if (fallback) {
                console.log('Using cached content from localStorage');
                return fallback;
            }
            throw error;
        }
    }

    // Validate content structure
    validateContent(data) {
        const requiredFields = ['metadata', 'course', 'weeks', 'roles'];
        
        for (const field of requiredFields) {
            if (!data[field]) {
                throw new Error(`Invalid content structure: missing ${field}`);
            }
        }

        // Validate weeks
        if (!Array.isArray(data.weeks) || data.weeks.length === 0) {
            throw new Error('Content must contain weeks array');
        }

        // Validate roles
        if (!data.roles.rvb || !data.roles.rvt) {
            throw new Error('Content must contain RvB and RvT roles');
        }

        return true;
    }

    // Cache management
    isCacheValid() {
        if (!this.cache.data || !this.cache.timestamp) {
            return false;
        }
        
        const now = Date.now();
        return (now - this.cache.timestamp) < this.cache.ttl;
    }

    updateCache(data) {
        this.cache = {
            timestamp: Date.now(),
            data: data,
            ttl: this.cache.ttl
        };
        
        // Also save to localStorage
        this.saveToLocalStorage(data);
    }

    // LocalStorage management
    saveToLocalStorage(data) {
        try {
            localStorage.setItem('aec-content', JSON.stringify({
                timestamp: Date.now(),
                data: data
            }));
        } catch (error) {
            console.warn('Failed to save content to localStorage:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem('aec-content');
            if (stored) {
                const parsed = JSON.parse(stored);
                // Check if content is not too old (24 hours)
                if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
                    return parsed.data;
                }
            }
        } catch (error) {
            console.warn('Failed to load content from localStorage:', error);
        }
        return null;
    }

    // Observer pattern for content updates
    subscribe(callback) {
        this.observers.push(callback);
        return () => {
            this.observers = this.observers.filter(obs => obs !== callback);
        };
    }

    notifyObservers(event, data) {
        this.observers.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('Observer callback error:', error);
            }
        });
    }

    // Content getters
    getWeek(weekNumber) {
        if (!this.content) return null;
        return this.content.weeks.find(w => w.number === weekNumber);
    }

    getCurrentWeek() {
        // Calculate current week based on start date or return week 1
        if (!this.content) return null;
        
        const startDate = localStorage.getItem('course-start-date');
        if (!startDate) {
            return this.content.weeks[0];
        }

        const start = new Date(startDate);
        const now = new Date();
        const diffTime = Math.abs(now - start);
        const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
        
        const weekNumber = Math.min(diffWeeks, this.content.weeks.length);
        return this.getWeek(weekNumber);
    }

    getRole(roleId, type = 'rvb') {
        if (!this.content) return null;
        return this.content.roles[type].find(r => r.id === roleId);
    }

    getRoles(type = 'rvb') {
        if (!this.content) return [];
        return this.content.roles[type] || [];
    }

    getRisk(riskId) {
        if (!this.content) return null;
        return this.content.risks.find(r => r.id === riskId);
    }

    getRisks(category = null) {
        if (!this.content) return [];
        
        if (category) {
            return this.content.risks.filter(r => r.category === category);
        }
        return this.content.risks;
    }

    getTriangleConflict() {
        if (!this.content) return null;
        return this.content.triangleConflict;
    }

    getAssessmentRubric() {
        if (!this.content) return null;
        return this.content.assessmentRubric;
    }

    getResources(type = null) {
        if (!this.content || !this.content.resources) return [];
        
        if (type) {
            return this.content.resources[type] || [];
        }
        return this.content.resources;
    }

    // Search functionality
    search(query, fields = ['title', 'description']) {
        if (!this.content || !query) return [];
        
        const results = [];
        const searchTerm = query.toLowerCase();
        
        // Search in weeks
        this.content.weeks.forEach(week => {
            if (this.searchInObject(week, searchTerm, fields)) {
                results.push({
                    type: 'week',
                    data: week
                });
            }
        });
        
        // Search in roles
        ['rvb', 'rvt'].forEach(roleType => {
            this.content.roles[roleType].forEach(role => {
                if (this.searchInObject(role, searchTerm, fields)) {
                    results.push({
                        type: 'role',
                        subtype: roleType,
                        data: role
                    });
                }
            });
        });
        
        return results;
    }

    searchInObject(obj, searchTerm, fields) {
        for (const field of fields) {
            if (obj[field] && obj[field].toString().toLowerCase().includes(searchTerm)) {
                return true;
            }
        }
        return false;
    }

    // Update content (for future content management)
    async updateContent(path, value) {
        if (!this.content) {
            throw new Error('Content not loaded');
        }

        // Navigate to the path and update value
        const keys = path.split('.');
        let current = this.content;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        
        // Save to localStorage
        this.saveToLocalStorage(this.content);
        
        // Notify observers
        this.notifyObservers('content-updated', {
            path: path,
            value: value
        });
        
        return this.content;
    }
}

// Content Renderer - Handles rendering content to HTML
class ContentRenderer {
    constructor(loader) {
        this.loader = loader;
    }

    // Render week card
    renderWeekCard(week, options = {}) {
        const { 
            showDetails = true, 
            showDeliverables = false,
            interactive = true 
        } = options;

        const card = document.createElement('div');
        card.className = 'week-card';
        card.setAttribute('data-week', week.number);
        
        card.innerHTML = `
            <div class="week-header">
                <span class="week-number">Week ${week.number}</span>
                <span class="week-icon">${week.icon}</span>
            </div>
            <h3 class="week-title">${week.title}</h3>
            <p class="week-theme">${week.theme}</p>
            ${showDetails ? `<p class="week-description">${week.description}</p>` : ''}
            ${showDeliverables ? this.renderDeliverables(week.wat.deliverables) : ''}
            ${interactive ? '<button class="week-action">Bekijk Details</button>' : ''}
        `;

        if (interactive) {
            card.querySelector('.week-action').addEventListener('click', () => {
                this.showWeekDetails(week);
            });
        }

        return card;
    }

    // Render deliverables list
    renderDeliverables(deliverables) {
        if (!deliverables || deliverables.length === 0) return '';
        
        return `
            <div class="deliverables">
                <h4>Deliverables:</h4>
                <ul>
                    ${deliverables.map(d => `<li>${d}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    // Render role card
    renderRoleCard(role, options = {}) {
        const { 
            showMetrics = false,
            showConflicts = false,
            interactive = true 
        } = options;

        const card = document.createElement('div');
        card.className = 'role-card';
        card.setAttribute('data-role', role.id);
        
        card.innerHTML = `
            <div class="role-header">
                <span class="role-icon">${role.icon}</span>
                <h3 class="role-title">${role.title}</h3>
            </div>
            <p class="role-name">${role.name}</p>
            <p class="role-description">${role.description}</p>
            ${showMetrics ? this.renderMetrics(role.keyMetrics) : ''}
            ${showConflicts && role.conflictsWith ? this.renderConflicts(role.conflictsWith) : ''}
            ${interactive ? '<button class="role-action">Selecteer Rol</button>' : ''}
        `;

        if (interactive) {
            card.querySelector('.role-action').addEventListener('click', () => {
                this.selectRole(role);
            });
        }

        return card;
    }

    // Render metrics
    renderMetrics(metrics) {
        if (!metrics || metrics.length === 0) return '';
        
        return `
            <div class="metrics">
                <h4>Key Metrics:</h4>
                <ul>
                    ${metrics.map(m => `<li>${m}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    // Render conflicts
    renderConflicts(conflicts) {
        if (!conflicts || conflicts.length === 0) return '';
        
        return `
            <div class="conflicts">
                <p class="conflict-label">Conflicteert met: 
                    ${conflicts.map(c => c.toUpperCase()).join(', ')}
                </p>
            </div>
        `;
    }

    // Render triangle conflict visualization
    renderTriangleConflict(triangleData) {
        const container = document.createElement('div');
        container.className = 'triangle-conflict-viz';
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 400 400');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        
        // Create triangle
        const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        triangle.setAttribute('d', 'M200,50 L350,300 L50,300 Z');
        triangle.setAttribute('fill', 'none');
        triangle.setAttribute('stroke', '#333');
        triangle.setAttribute('stroke-width', '2');
        
        svg.appendChild(triangle);
        
        // Add vertices
        triangleData.vertices.forEach((vertex, index) => {
            const positions = [
                { x: 200, y: 50 },   // Top
                { x: 350, y: 300 },  // Bottom right
                { x: 50, y: 300 }    // Bottom left
            ];
            
            const pos = positions[index];
            
            // Circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pos.x);
            circle.setAttribute('cy', pos.y);
            circle.setAttribute('r', '30');
            circle.setAttribute('fill', vertex.color);
            circle.setAttribute('class', 'triangle-vertex');
            circle.setAttribute('data-vertex', vertex.id);
            
            // Label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', pos.x);
            text.setAttribute('y', pos.y + 50);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('class', 'vertex-label');
            text.textContent = vertex.name;
            
            svg.appendChild(circle);
            svg.appendChild(text);
        });
        
        container.appendChild(svg);
        
        // Add legend
        const legend = document.createElement('div');
        legend.className = 'triangle-legend';
        legend.innerHTML = triangleData.vertices.map(v => `
            <div class="legend-item">
                <span class="legend-color" style="background: ${v.color}"></span>
                <span class="legend-label">${v.name}: ${v.champion}</span>
            </div>
        `).join('');
        
        container.appendChild(legend);
        
        return container;
    }

    // Render risk matrix
    renderRiskMatrix(risks) {
        const matrix = document.createElement('div');
        matrix.className = 'risk-matrix-grid';
        
        // Create 3x3 grid
        const probabilities = ['low', 'medium', 'high'];
        const impacts = ['low', 'medium', 'high'];
        
        probabilities.forEach(prob => {
            impacts.forEach(impact => {
                const cell = document.createElement('div');
                cell.className = `matrix-cell ${prob}-${impact}`;
                cell.setAttribute('data-probability', prob);
                cell.setAttribute('data-impact', impact);
                
                // Find risks for this cell
                const cellRisks = risks.filter(r => 
                    r.probability === prob && r.impact === impact
                );
                
                cellRisks.forEach(risk => {
                    const riskElement = document.createElement('div');
                    riskElement.className = 'risk-item';
                    riskElement.textContent = risk.title;
                    riskElement.setAttribute('data-risk-id', risk.id);
                    cell.appendChild(riskElement);
                });
                
                matrix.appendChild(cell);
            });
        });
        
        return matrix;
    }

    // Show week details modal
    showWeekDetails(week) {
        const modal = document.createElement('div');
        modal.className = 'modal week-details-modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${week.icon} Week ${week.number}: ${week.title}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <h3>Waarom?</h3>
                    <p>${week.waarom}</p>
                    
                    <h3>Hoe?</h3>
                    <div class="how-section">
                        <h4>Zelfstudie:</h4>
                        <ul>
                            ${week.hoe.zelfstudie.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                        <h4>Werkcollege:</h4>
                        <ul>
                            ${week.hoe.werkcollege.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <h3>Wat?</h3>
                    <div class="what-section">
                        <h4>Deliverables:</h4>
                        <ul>
                            ${week.wat.deliverables.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                        <p><strong>Assessment:</strong> ${week.wat.assessment}</p>
                    </div>
                    
                    ${week.aiPrompt ? `
                        <h3>AI Prompt:</h3>
                        <div class="ai-prompt">
                            <p>${week.aiPrompt}</p>
                            <button class="copy-prompt">Kopieer Prompt</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        const copyBtn = modal.querySelector('.copy-prompt');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(week.aiPrompt);
                copyBtn.textContent = 'Gekopieerd!';
                setTimeout(() => {
                    copyBtn.textContent = 'Kopieer Prompt';
                }, 2000);
            });
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Select role
    selectRole(role) {
        // Store selected role
        localStorage.setItem('selected-role', role.id);
        
        // Update UI
        document.querySelectorAll('.role-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`[data-role="${role.id}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        // Notify
        this.showNotification(`Rol geselecteerd: ${role.title}`);
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Export for use in other files
window.ContentLoader = ContentLoader;
window.ContentRenderer = ContentRenderer;

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
    const loader = ContentLoader.getInstance();
    const renderer = new ContentRenderer(loader);
    
    // Make available globally
    window.contentLoader = loader;
    window.contentRenderer = renderer;
    
    // Auto-load content
    try {
        await loader.loadContent();
        console.log('Content loaded successfully');
    } catch (error) {
        console.error('Failed to load content:', error);
    }
});