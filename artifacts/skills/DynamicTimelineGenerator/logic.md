# DynamicTimelineGenerator Logic Specification
**Version**: 1.0.0
**Date**: 2026-05-02

## Timeline Architecture
The timeline is constructed as a series of "Milestones" grouped by "Phase".

### Phases
1. **Preparation**: Discovery and registration.
2. **Engagement**: Research and candidate tracking.
3. **Execution**: Casting the ballot.
4. **Post-Vote**: Results and verification.

### Persona-Specific Milestones
- **First-Time Voter (FTV)**: 
  - [ ] Check Registration Eligibility
  - [ ] Complete Voter Registration
  - [ ] Find Polling Location
  - [ ] Sample Ballot Review
- **Overseas/Military Voter (OMV)**:
  - [ ] Submit FPCA (Federal Post Card Application)
  - [ ] Request Absentee Ballot
  - [ ] Verify Ballot Receipt
  - [ ] Mail-back Deadline
- **Experienced Voter (EV)**:
  - [ ] Update Registration (if moved)
  - [ ] Review New Ballot Measures
  - [ ] Confirm Polling Site Changes
- **Potential Candidate (PC)**:
  - [ ] Review Filing Requirements
  - [ ] Collect Signatures
  - [ ] Official Filing Deadline
  - [ ] Campaign Finance Disclosure

## Temporal Logic
1. **Deadline Fetching**: Retrieve official dates for the given `Jurisdiction`.
2. **Relative Mapping**: 
   - Calculate `DaysUntil(Deadline)`.
   - Assign priority based on proximity.
3. **State Tracking**:
   - Mark Milestones as `Pending`, `Completed`, or `Missed`.
4. **Urgency Engine**:
   - If `DaysUntil(CriticalDeadline) <= 3`, trigger **URGENCY ALERT**.

## Interface
**Input**: `{ PersonaID, Jurisdiction, CurrentDate, CompletedMilestones }`
**Output**: `{ TimelineMap, NextAction, UrgentAlerts }`
