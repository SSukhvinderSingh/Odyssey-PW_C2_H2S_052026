/**
 * Election Odyssey - India Edition
 * Main application logic
 */

console.log('🚀 app.js: Script loading started...');

const app = {
    state: {
        persona: null,
        timeline: [],
        electionDate: '2026-11-03', 
        userName: '',
        chatHistory: [],
        completedMilestones: [],
        hasCompletedOnboarding: false,
        language: 'en'
    },

    init() {
        console.log('Odyssey App: Initializing...');
        try {
            this.cacheDOM();
            this.bindEvents();
            this.loadState();
            this.translateUI();
            this.render();
            if (window.AI_GUIDE && window.AI_GUIDE.voice) {
                window.AI_GUIDE.voice.init();
            }
            console.log('✅ Odyssey App: Initialized successfully');
        } catch (e) {
            console.error('❌ Odyssey App: Critical failure during init:', e);
        }
    },

    loadState() {
        const saved = localStorage.getItem('odyssey_state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.state = { ...this.state, ...parsed };
                console.log('Odyssey App: State loaded from storage');
            } catch (e) {
                console.error('Failed to load saved state:', e);
            }
        }
    },

        saveState() {
            localStorage.setItem('odyssey_state', JSON.stringify(this.state));
        },

        translateUI() {
            console.log('Odyssey App: Translating UI to', this.state.language);
            const lang = this.state.language;
            const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

            // Update simple text elements
            if (document.getElementById('nav-title')) {
                document.getElementById('nav-title').innerText = t.nav_title;
            }
            
            // Update elements with data-i18n attribute
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (t[key]) el.innerText = t[key];
            });

            // Update placeholders
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                if (t[key]) el.placeholder = t[key];
            });

            // Update Persona Cards (dynamic content)
            if (this.personaCards) {
                this.personaCards.forEach(card => {
                    const persona = card.dataset.persona;
                    const titleEl = card.querySelector('.font-bold');
                    const descEl = card.querySelector('.text-xs');
                    
                    if (!titleEl || !descEl) return;

                    const keyPrefix = persona.toLowerCase();
                    if (t[`card_${keyPrefix}_title`] && t[`card_${keyPrefix}_desc`]) {
                        titleEl.innerText = t[`card_${keyPrefix}_title`];
                        descEl.innerText = t[`card_${keyPrefix}_desc`];
                    }
                });
            }
        },

        cacheDOM() {

        this.screens = {
            intro: document.getElementById('screen-intro'),
            persona: document.getElementById('screen-persona'),
            odyssey: document.getElementById('screen-odyssey')
        };
        this.btnBeginJourney = document.getElementById('btn-begin-journey');
        this.form = document.getElementById('persona-form');
        this.inputName = document.getElementById('input-name');
        this.inputBio = document.getElementById('input-bio');
        this.customBioContainer = document.getElementById('custom-bio-container');
        this.personaCards = document.querySelectorAll('.persona-card');
        this.timelineContainer = document.getElementById('timeline-container');
        this.personaBadge = document.getElementById('persona-badge');
        this.welcomeText = document.getElementById('welcome-text');
        this.suggestionsContainer = document.getElementById('ai-suggestions');

        this.aiBubble = document.getElementById('ai-bubble');
        this.aiChat = document.getElementById('ai-chat');
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.btnSendChat = document.getElementById('btn-send-chat');
        this.btnCloseChat = document.getElementById('btn-close-chat');
        this.btnVoiceListen = document.getElementById('btn-voice-listen');
        this.btnVoiceToggle = document.getElementById('btn-voice-toggle');
        this.btnStopSpeech = document.getElementById('btn-stop-speech');
        this.voiceStatus = document.getElementById('voice-status');
        this.langSelector = document.getElementById('lang-selector');
    },

    bindEvents() {
        if (this.btnBeginJourney) {
            this.btnBeginJourney.addEventListener('click', () => {
                console.log('Event: Begin Journey clicked');
                this.screens.intro.classList.add('hidden');
                this.screens.persona.classList.remove('hidden');
            });
        }

        if (this.personaCards && this.personaCards.length > 0) {
            this.personaCards.forEach(card => {
                card.addEventListener('click', () => {
                    this.personaCards.forEach(c => {
                        c.classList.remove('border-amber-500', 'bg-amber-50', 'dark:bg-amber-900/20', 'ring-2', 'ring-amber-200', 'dark:ring-amber-800');
                        c.classList.add('border-slate-100', 'dark:border-slate-700');
                    });
                    card.classList.remove('border-slate-100', 'dark:border-slate-700');
                    card.classList.add('border-amber-500', 'bg-amber-50', 'dark:bg-amber-900/20', 'ring-2', 'ring-amber-200', 'dark:ring-amber-800');
                    const persona = card.dataset.persona;
                    if (persona === 'CUSTOM') {
                        this.customBioContainer.classList.remove('hidden');
                        this.inputBio.setAttribute('required', 'true');
                    } else {
                        this.customBioContainer.classList.add('hidden');
                        this.inputBio.removeAttribute('required');
                    }
                    this.selectedPersonaId = persona;
                });
            });
        }

        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePersonaSubmission();
            });
        }

        const restartBtn = document.getElementById('btn-restart');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                localStorage.removeItem('odyssey_state');
                this.state.persona = null;
                this.state.timeline = [];
                this.state.userName = '';
                this.state.chatHistory = [];
                this.state.completedMilestones = [];
                this.state.hasCompletedOnboarding = false;
                this.render();
            });
        }

        if (this.aiBubble) {
            this.aiBubble.addEventListener('click', () => this.toggleChat(true));
        }
        if (this.btnCloseChat) {
            this.btnCloseChat.addEventListener('click', () => this.toggleChat(false));
        }
        if (this.btnSendChat) {
            this.btnSendChat.addEventListener('click', () => this.handleAIChat());
        }
        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleAIChat();
            });
        }

        if (this.btnVoiceListen) {
            this.btnVoiceListen.addEventListener('click', () => {
                window.AI_GUIDE.voice.listen((text) => {
                    this.chatInput.value = text;
                    this.handleAIChat();
                });
            });
        }

        if (this.btnVoiceToggle) {
            this.btnVoiceToggle.addEventListener('click', () => {
                window.AI_GUIDE.voice.isVoiceEnabled = !window.AI_GUIDE.voice.isVoiceEnabled;
                this.voiceStatus.innerText = window.AI_GUIDE.voice.isVoiceEnabled ? 'ON' : 'OFF';
            });
        }

        if (this.btnStopSpeech) {
            this.btnStopSpeech.addEventListener('click', () => {
                window.AI_GUIDE.voice.stop();
            });
        }

        if (this.langSelector) {
            this.langSelector.addEventListener('change', (e) => {
                this.state.language = e.target.value;
                this.saveState();
                this.translateUI();
            });
        }
    },

    toggleChat(show) {
        if (show) {
            this.aiChat.classList.remove('hidden');
            setTimeout(() => {
                this.aiChat.classList.remove('translate-y-4', 'opacity-0');
            }, 10);
            this.renderSuggestions();
        } else {
            this.aiChat.classList.add('translate-y-4', 'opacity-0');
            setTimeout(() => {
                this.aiChat.classList.add('hidden');
            }, 300);
        }
    },

    async handleAIChat(overrideQuery = null) {
        const query = overrideQuery || this.chatInput.value.trim();
        if (!query) return;

        this.renderAIMessage('user', query);
        this.chatInput.value = '';

        const langPrompt = `(Please respond in ${this.state.language === 'en' ? 'English' : this.state.language === 'hi' ? 'Hindi' : this.state.language === 'bn' ? 'Bengali' : 'Tamil'}). `;
        const finalQuery = langPrompt + query;

        const response = await window.AI_GUIDE.askLLM(finalQuery, {
            persona: this.state.persona,
            userName: this.state.userName
        }, this.state.chatHistory);

        this.state.chatHistory.push({ role: 'user', parts: [{ text: query }] });
        this.state.chatHistory.push({ role: 'model', parts: [{ text: response }] });

        if (this.state.chatHistory.length > 20) {
            this.state.chatHistory = this.state.chatHistory.slice(-20);
        }

        this.renderAIMessage('ai', response);
        window.AI_GUIDE.voice.speak(response);
        this.saveState();
    },

    renderSuggestions() {
        this.suggestionsContainer.innerHTML = '';
        const suggestions = this.getSuggestionsForPersona();
        if (suggestions.length === 0) {
            this.suggestionsContainer.classList.add('hidden');
            return;
        }
        this.suggestionsContainer.classList.remove('hidden');
        suggestions.forEach(text => {
            const btn = document.createElement('button');
            btn.className = 'text-xs bg-white border border-gray-200 px-2 py-1 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-all text-gray-600';
            btn.innerText = text;
            btn.onclick = () => this.handleAIChat(text);
            this.suggestionsContainer.appendChild(btn);
        });
    },

    getSuggestionsForPersona() {
        if (!this.state.persona) return [];
        const common = ['How do I check my name in the voter list?', 'Where is the NVSP portal?'];
        const personaSpecific = {
            'FTV': ['How do I fill Form 6?', 'What documents do I need for EPIC card?'],
            'NRI': ['What is Form 6A?', 'How does passport verification work?'],
            'SV': ['How to update address using Form 8?', 'Do I need a new voter ID?'],
            'EOV': ['What are BLO duties?', 'How to manage a polling booth?'],
            'EV': ['How to find my polling station?', 'How to download e-EPIC?']
        };
        return [...(personaSpecific[this.state.persona.id] || []), ...common];
    },

    renderAIMessage(sender, text) {
        const msg = document.createElement('div');
        msg.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
        const bubble = document.createElement('div');
        bubble.className = `max-w-[80%] p-3 rounded-2xl ${sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`;
        bubble.innerText = text;
        msg.appendChild(bubble);
        this.chatMessages.appendChild(msg);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    },

    triggerProactiveAI() {
        const welcomeMsg = window.AI_GUIDE.proactive.triggers.onWelcome(this.state.userName, this.state.persona);
        this.toggleChat(true);
        setTimeout(() => {
            this.renderAIMessage('ai', welcomeMsg);
            window.AI_GUIDE.voice.speak(welcomeMsg);
        }, 500);

        const urgent = this.state.timeline.find(m => m.status === 'urgent');
        if (urgent) {
            setTimeout(() => {
                const urgentMsg = window.AI_GUIDE.proactive.triggers.onUrgent(urgent);
                this.renderAIMessage('ai', urgentMsg);
                window.AI_GUIDE.voice.speak(urgentMsg);
            }, 3000);
        }
    },

    async handlePersonaSubmission() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        if (!this.selectedPersonaId) {
            alert('Please select your voter status from the cards!');
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Mapping your journey...`;

            this.state.userName = this.inputName.value;
            let personaId = this.selectedPersonaId;
            if (personaId === 'CUSTOM') {
                const bio = this.inputBio.value;
                personaId = await window.AI_GUIDE.mapPersonaAI(bio);
            }

            const mapped = PERSONAS[personaId] || { id: 'UNKNOWN', name: 'Undetermined', tone: 'neutral', focus: 'General Indian election information', color: 'gray' };
            this.state.persona = mapped;
            this.state.timeline = generateTimeline(this.state.persona.id, this.state.electionDate);
            this.state.hasCompletedOnboarding = true;
            this.saveState();
            this.render();
            this.triggerProactiveAI();
        } catch (error) {
            console.error('Persona submission error:', error);
            alert('Something went wrong while mapping your journey. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    },

    render() {
        Object.values(this.screens).forEach(s => s.classList.add('hidden'));
        if (!this.state.hasCompletedOnboarding) {
            this.screens.intro.classList.remove('hidden');
        } else {
            this.screens.odyssey.classList.remove('hidden');
            this.renderOdyssey();
        }
    },

    renderOdyssey() {
        this.welcomeText.innerText = `Namaste, ${this.state.userName}. Your Odyssey begins here.`;
        this.personaBadge.innerText = this.state.persona.name;
        this.personaBadge.className = `px-3 py-1 rounded-full text-xs font-bold text-white bg-${this.state.persona.color}-500`;
        this.timelineContainer.innerHTML = '';
        const sortedTimeline = [...this.state.timeline].sort((a, b) => a.deadlineOffset - b.deadlineOffset);
        sortedTimeline.forEach(m => {
            const isCompleted = this.state.completedMilestones?.includes(m.id);
            const item = document.createElement('div');
            item.className = `p-4 mb-4 rounded-lg border-l-4 transition-all ${isCompleted ? 'bg-slate-100 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 opacity-60' : this.getStatusStyle(m.status)}`;
            const resourceLink = window.AI_GUIDE.resources[m.text.split(' ').slice(0,3).join(' ')] || '';
            const linkHtml = resourceLink ? `<a href="${resourceLink}" target="_blank" class="text-xs text-amber-600 dark:text-amber-400 hover:underline ml-2"><i class="fas fa-external-link-alt"></i> Official Link</a>` : '';
            item.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="flex items-center space-x-3">
                        <input type="checkbox" ${isCompleted ? 'checked' : ''} 
                               class="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-amber-600 dark:text-amber-500 focus:ring-amber-500 cursor-pointer"
                               onchange="app.toggleMilestone('${m.id}')">
                        <div>
                            <span class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">${m.phase}</span>
                            <h4 class="text-lg font-bold ${isCompleted ? 'line-through text-slate-500 dark:text-slate-500' : 'text-slate-800 dark:text-white'}">${m.text} ${linkHtml}</h4>
                            <p class="text-sm text-slate-600 dark:text-slate-400">Target Date: ${m.deadline}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        ${isCompleted ? '<span class="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-1 rounded text-xs font-bold">DONE</span>' : this.getStatusBadge(m.status, m.daysLeft)}
                    </div>
                </div>
            `;
            this.timelineContainer.appendChild(item);
        });
    },

    toggleMilestone(id) {
        if (!this.state.completedMilestones) this.state.completedMilestones = [];
        if (this.state.completedMilestones.includes(id)) {
            this.state.completedMilestones = this.state.completedMilestones.filter(mid => mid !== id);
        } else {
            this.state.completedMilestones.push(id);
        }
        this.saveState();
        this.renderOdyssey();
    },

    getStatusStyle(status) {
        switch(status) {
            case 'urgent': return 'bg-red-50 dark:bg-red-900/20 border-red-500';
            case 'missed': return 'bg-slate-100 dark:bg-slate-800 border-slate-400 opacity-60';
            default: return 'bg-white dark:bg-slate-800 border-amber-500';
        }
    },
        
    getStatusBadge(status, days) {
        switch(status) {
            case 'urgent': return `<span class="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">URGENT: ${days} days left</span>`;
            case 'missed': return `<span class="bg-slate-400 dark:bg-slate-600 text-white px-2 py-1 rounded text-xs font-bold">MISSED</span>`;
            default: return `<span class="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-2 py-1 rounded text-xs font-bold">${days} days left</span>`;
        }
    }
};

window.app = app;

// Ensure app starts whether DOM is already loaded or not
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}
