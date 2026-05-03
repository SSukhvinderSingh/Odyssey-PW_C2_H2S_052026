/**
 * Odyssey AI Guide - Voice & Proactive Logic
 * Now integrated with Cloudflare Worker + Gemini 2.5 Flash
 */

const AI_GUIDE = {
    config: {
        // Cloudflare Worker URL - Deployed 2026-05-02
        workerUrl: 'https://election-odyssey-proxy.shawnhps1994.workers.dev',
        
        systemPrompt: `You are the Official Election Odyssey Guide for India. 
        Your sole purpose is to help users navigate the Election Commission of India (ECI) and National Voters' Service Portal (NVSP) process.
        
        STRICT RULES:
        1. NON-PARTISANSHIP: Never mention specific political parties, candidates, or symbols.
        2. ACCURACY: Use only ECI.gov.in or NVSP.in guidelines.
        3. TONE: Adapt to the user's persona:
           - First-Time Voter: Encouraging, simple language, step-by-step guidance
           - NRI Voter: Precise, formal, focus on passport/document requirements
           - Shifted Voter: Professional, focus on Form 8 and address proof
           - Experienced Voter: Efficient, direct, minimal explanation needed
           - Election Volunteer: Technical, detailed, ECI compliance focus
        4. DIRECTNESS: Provide actionable steps (e.g., "Fill Form 6 at nvsp.in").
        5. HINDI: If user writes in Hindi/mentions Hindi, respond in Hindi.
        
        When unsure, direct users to the official NVSP portal (nvsp.in) or ECI website (eci.gov.in).`,
    },

    resources: {
        'Form 6': 'https://voters.eci.gov.in/registration-portal/',
        'Form 6A': 'https://voters.eci.gov.in/registration-portal/',
        'Form 8': 'https://voters.eci.gov.in/registration-portal/',
        'Electoral Roll': 'https://electoralsearch.eci.gov.in/',
        'NVSP Portal': 'https://www.nvsp.in/',
        'ECI Official': 'https://eci.gov.in/',
        'Voter Helpline App': 'https://www.eci.gov.in/voter-helpline-app/'
    },

    voice: {
        recognition: null,
        synthesis: window.speechSynthesis,
        isVoiceEnabled: true,

        /**
         * Initializes the Web Speech Recognition API for voice input.
         * Sets up language to Indian English (en-IN) and non-continuous mode.
         */
        init() {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                this.recognition = new SpeechRecognition();
                this.recognition.continuous = false;
                this.recognition.lang = 'en-IN';
                this.recognition.interimResults = false;
            }
        },

        /**
         * Speaks a given text string using the Web Speech Synthesis API.
         * @param {string} text - The text to be spoken aloud.
         */
        speak(text) {
            if (!this.isVoiceEnabled) return;
            this.synthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-IN';
            utterance.rate = 1.0;
            this.synthesis.speak(utterance);
        },

        /**
         * Immediately stops any ongoing speech synthesis playback.
         */
        stop() {
            this.synthesis.cancel();
        },

        /**
         * Starts the speech recognition listener and returns the transcript via callback.
         * @param {Function} callback - Called with the transcribed text string once speech is detected.
         */
        listen(callback) {
            if (!this.recognition) {
                alert("Voice recognition not supported in this browser.");
                return;
            }
            this.recognition.start();
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                callback(transcript);
            };
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
            };
        }
    },

    proactive: {
        triggers: {
            onWelcome: (user, persona) => {
                if (persona.id === 'FTV') return `Namaste ${user}! I see you're a first-time voter. It's an exciting journey! Would you like me to help you start with Form 6?`;
                if (persona.id === 'NRI') return `Namaste ${user}! Navigating elections from abroad can be tricky. Shall we look at the Form 6A process together?`;
                if (persona.id === 'SV') return `Namaste ${user}! I notice you've shifted your residence. Let's get your address updated via Form 8 so you can vote at your new polling station.`;
                return `Namaste ${user}! Welcome to your Electoral Odyssey. I'm here to guide you through every ECI step. What can I help you with today?`;
            },
            onUrgent: (milestone) => {
                return `Attention! Your "${milestone.text}" is due in ${milestone.daysLeft} days. Do you have everything ready, or should I guide you through it?`;
            }
        }
    },

    /**
     * Sends a prompt and conversation history to the Cloudflare Worker proxy,
     * which forwards it to the Gemini 2.5 Flash API and returns a response.
     * @param {string} prompt - The user's question or input text.
     * @param {Object} context - Additional context (persona, userName).
     * @param {Array} history - Previous conversation history for context-aware responses.
     * @returns {Promise<string>} The AI's text response, or a fallback error message.
     */
    async askLLM(prompt, context, history = []) {
        try {
            const response = await fetch(this.config.workerUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                    history: history,
                    context: { systemPrompt: this.config.systemPrompt, ...context }
                })
            });

            if (!response.ok) {
                throw new Error(`Worker responded with status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            }
            
            if (data.error) {
                console.error('Gemini API Error:', data.error);
                return "I'm having trouble connecting to my brain right now. Please try again later.";
            }
            
            return "I received an unexpected response. Let me try again with a different approach.";
            
        } catch (error) {
            console.error('Worker fetch error:', error);
            return "I'm having trouble connecting to the AI service. Please check your internet connection and try again.";
        }
    },

    /**
     * Uses the Gemini AI to classify a freeform user bio into one of 5 persona IDs.
     * Falls back to 'UNKNOWN' if classification fails.
     * @param {string} bio - The user's freeform description of their voter situation.
     * @returns {Promise<string>} The matched persona ID (e.g., 'FTV', 'NRI').
     */
    async mapPersonaAI(bio) {
        const prompt = `Analyze this user description: "${bio}". 
        Categorize them into EXACTLY one of these persona IDs:
        - FTV: First-time voter (newly 18, never voted)
        - EV: Experienced voter (has voted in previous elections)
        - NRI: Non-resident Indian (lives abroad, overseas voter)
        - SV: Shifted voter (has moved residence/address)
        - EOV: Election official or volunteer (BLO, booth officer)
        
        Return ONLY the persona ID (e.g., "FTV", "EV", "NRI", "SV", "EOV"). If no match, return "UNKNOWN".`;

        try {
            const result = await this.askLLM(prompt, { systemPrompt: "You are a precise classification engine. Return ONLY the ID." }, []);
            const cleaned = result.trim().toUpperCase();
            return cleaned;
        } catch (e) {
            console.error('AI Mapping failed:', e);
            return 'UNKNOWN';
        }
    }
};

// Attach to window for global access in app.js
window.AI_GUIDE = AI_GUIDE;
