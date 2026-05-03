# PersonaMapper Logic Specification
**Version**: 1.0.0
**Date**: 2026-05-02

## Persona Categories
1. **First-Time Voter (FTV)**: Users aged 18-22 or those who explicitly state they have never voted.
   - *Focus*: Basic registration, "How to vote" guides, overcoming anxiety.
   - *Tone*: Encouraging, simplified, supportive.
2. **Experienced Voter (EV)**: Users who have voted before and are registered.
   - *Focus*: Candidate updates, changes in polling locations, ballot measures.
   - *Tone*: Efficient, direct, informative.
3. **Overseas/Military Voter (OMV)**: Citizens living outside their home jurisdiction.
   - *Focus*: FWAB/FPCA forms, mailing deadlines, specialized registration.
   - *Tone*: Precise, alert-driven, formal.
4. **Potential Candidate (PC)**: Users interested in running for office.
   - *Focus*: Filing deadlines, signature requirements, campaign finance basics.
   - *Tone*: Professional, strategic, instructional.
5. **Election Official/Volunteer (EOV)**: Users helping run the election.
   - *Focus*: Training manuals, legal compliance, operational checklists.
   - *Tone*: Technical, authoritative, detailed.

## Mapping Algorithm
1. **Keyword Analysis**: Scan input for triggers (e.g., "first time", "abroad", "running for", "poll worker").
2. **Attribute Check**: Verify age, residency, and intent.
3. **Ambiguity Resolution**: If multiple personas apply or info is missing, trigger `ClarificationRequest`.
   - *Example*: "I live in London but I'm from New York" $\rightarrow$ OMV.
   - *Example*: "I'm 19 and I want to help" $\rightarrow$ Could be FTV or EOV. Ask: "Are you looking to cast your first vote or help organize the election?"
4. **Output Generation**: Return `PersonaID` and the corresponding `Tone` and `JourneyPath`.
