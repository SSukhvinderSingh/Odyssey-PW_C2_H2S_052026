# Test Execution Matrix - Election Odyssey (India Edition)

This document outlines the strict execution matrix for verifying the Election Odyssey application, complete with expected and actual outcomes.

## 1. Persona Mapping & Timeline (Frontend)
| Step | Action | Expected Result | Actual Result | Status |
|------|--------|-----------------|---------------|--------|
| 1.1 | Input "I am 18 and this is my first time" | Persona: **First-Time Voter**, Color: Blue, 5 Milestones | N/A | [ ] |
| 1.2 | Input "I live in Canada" | Persona: **NRI Voter**, Color: Purple, 5 Milestones | N/A | [ ] |
| 1.3 | Input "I shifted my home" | Persona: **Shifted Voter**, Color: Orange, 5 Milestones | N/A | [ ] |
| 1.4 | Input "I am a BLO official" | Persona: **Election Volunteer**, Color: Red, 5 Milestones | N/A | [ ] |
| 1.5 | Input "I have a voter ID" | Persona: **Experienced Voter**, Color: Green, 4 Milestones | N/A | [ ] |
| 1.6 | Input extremely long text string | App handles input without crashing, defaults properly | N/A | [ ] |
| 1.7 | Input completely empty string | Form validation prevents submission, or defaults gracefully | N/A | [ ] |

## 2. AI Assistant Proactivity
| Step | Action | Expected Result | Actual Result | Status |
|------|--------|-----------------|---------------|--------|
| 2.1 | Complete Persona setup (FTV) | Chat bubble opens automatically, AI greets and mentions Form 6 | N/A | [ ] |
| 2.2 | Set election date close to today | AI triggers "Urgent" nudge for a milestone with < 3 days left | N/A | [ ] |

## 3. Chat & AI Logic
| Step | Action | Expected Result | Actual Result | Status |
|------|--------|-----------------|---------------|--------|
| 3.1 | Ask "What is Form 6?" | Accurate, non-partisan answer based on ECI guidelines | N/A | [ ] |
| 3.2 | Ask follow-up: "Where do I find it?" | AI remembers context of Form 6 and provides NVSP link | N/A | [ ] |
| 3.3 | Enter text in Hindi | AI responds in Hindi | N/A | [ ] |

## 4. Voice Services
| Step | Action | Expected Result | Actual Result | Status |
|------|--------|-----------------|---------------|--------|
| 4.1 | Click "Speak" and say a query | Text is transcribed and automatically sent to AI | N/A | [ ] |
| 4.2 | AI response generates | AI speaks the response in an Indian-English accent | N/A | [ ] |
| 4.3 | Click "Stop" button | Voice playback stops immediately | N/A | [ ] |
| 4.4 | Toggle "Voice Response" OFF | AI answers in text only, no audio | N/A | [ ] |

## 5. Worker Proxy
| Step | Action | Expected Result | Actual Result | Status |
|------|--------|-----------------|---------------|--------|
| 5.1 | Call Worker via Curl | Status 200, JSON response from Gemini 2.5 Flash | N/A | [ ] |
| 5.2 | Send request without prompt | Status 400, Error: "Missing prompt" | N/A | [ ] |
| 5.3 | Trigger network timeout | Proxy handles timeout gracefully without breaking UI | N/A | [ ] |
