# skills.md
# Format version: 1.1
# Last updated: 2026-05-02
# Owner: opencode

## Skill: PersonaMapper (India)
**Role**: Indian Voter Profiler and Path Identifier.
**Intent**: Categorize users into "Voter Personas" specific to India (e.g., First-Time Voter, NRI, Shifted Voter, Election Volunteer) to unlock the correct ECI path.
**Context**: Analyzes input for keywords like "Form 6", "NRI", "EPIC", "Shifted address".
**Enforcement**: Must clarify if the user is an NRI or a domestic voter as the registration processes differ significantly.
**Interface**: Input: User Profile/Interactions -> Output: PersonaID, Tailored Tone, Initial Journey Path.
**Dependencies**: None.
**Metadata**: language: generic; runtime: LLM; compatibility: OpenCode, Antigravity, Windsurf; tags: profiling, india-election.
**Version**: 1.1.0
**Changelog**: 2026-05-02: Updated for Indian voter personas.
**Test Cases**: Correct identification of NRI vs Domestic Voter.
**Artifact Location**: /artifacts/skills/PersonaMapper/

## Skill: DynamicTimelineGenerator (India)
**Role**: Indian Electoral Roadmap Architect.
**Intent**: Generate a state-aware timeline based on the ECI's typical election cycle and the user's persona.
**Context**: Maps PersonaID and State against the electoral roll revision dates and polling day.
**Enforcement**: Must trigger "EPIC Card" alerts for those without voter IDs.
**Interface**: Input: PersonaID, State, CurrentDate -> Output: Interactive Roadmap (Milestones, ECI Deadlines, Status).
**Dependencies**: PersonaMapper.
**Metadata**: language: generic; runtime: LLM; compatibility: OpenCode, Antigravity, Windsurf; tags: scheduling, india-election.
**Version**: 1.1.0
**Changelog**: 2026-05-02: Updated with ECI milestones (Form 6, Electoral Roll).
**Test Cases**: Deadline calculation for NRI registration.
**Artifact Location**: /artifacts/skills/DynamicTimelineGenerator/

## Skill: ProcessSimulator (India)
**Role**: Indian Voting Educator via Gamification.
**Intent**: Explain the Indian voting process (EVM, VVPAT, NOTA) through interactive simulations.
**Context**: Uses the actual ECI process: Entering booth -> Identification -> Ink application -> EVM Press -> VVPAT Verification.
**Enforcement**: Must accurately represent the NOTA (None of the Above) option as a legal right.
**Interface**: Input: ConceptID -> Output: Interactive Scenario Session -> Conceptual Summary.
**Dependencies**: None.
**Metadata**: language: generic; runtime: LLM; compatibility: OpenCode, Antigravity, Windsurf; tags: education, india-election.
**Version**: 1.1.0
**Changelog**: 2026-05-02: Updated to simulate EVM/VVPAT process.
**Test Cases**: Accuracy of the VVPAT verification step simulation.
**Artifact Location**: /artifacts/skills/ProcessSimulator/

## Skill: OfficialSourceTranslator (India)
**Role**: ECI Legal-to-Layman Translator.
**Intent**: Translate complex ECI notifications and NVSP guidelines into simple, actionable steps for Indian citizens.
**Context**: Operates on ECI.gov.in and NVSP.in content.
**Enforcement**: Must link directly to the official ECI form or portal (e.g., link to Form 6 on NVSP).
**Interface**: Input: Official URL/Raw Text -> Output: Plain-English Action Items.
**Dependencies**: None.
**Metadata**: language: generic; runtime: LLM; compatibility: OpenCode, Antigravity, Windsurf; tags: translation, india-election.
**Version**: 1.1.0
**Changelog**: 2026-05-02: Updated to focus on NVSP/ECI sources.
**Test Cases**: Translation of "Electoral Roll Revision" into "Updating your name in the voter list".
**Artifact Location**: /artifacts/skills/OfficialSourceTranslator/
