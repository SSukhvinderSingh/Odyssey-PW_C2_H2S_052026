/**
 * Election Odyssey - Logic Utilities
 * Extracted for testability and reuse
 */

const PERSONAS = {
    FTV: { id: 'FTV', name: 'First-Time Voter', tone: 'encouraging', focus: 'Form 6 (Registration) and getting your EPIC card', color: 'blue' },
    EV: { id: 'EV', name: 'Experienced Voter', tone: 'efficient', focus: 'Checking name in Electoral Roll and Polling Station', color: 'green' },
    NRI: { id: 'NRI', name: 'NRI Voter', tone: 'precise', focus: 'Overseas Voter Registration and Passport verification', color: 'purple' },
    SV: { id: 'SV', name: 'Shifted Voter', tone: 'professional', focus: 'Form 8 (Address change/Correction)', color: 'orange' },
    EOV: { id: 'EOV', name: 'Election Volunteer (BLO)', tone: 'technical', focus: 'Electoral Roll revision and Booth management', color: 'red' }
};

const MILESTONES = {
    FTV: [
        { id: 'ftv1', text: 'Submit Form 6 via NVSP Portal', phase: 'Preparation', deadlineOffset: -90 },
        { id: 'ftv2', text: 'Track Application Status for EPIC Card', phase: 'Preparation', deadlineOffset: -60 },
        { id: 'ftv3', text: 'Verify Name in Electoral Roll (Voter List)', phase: 'Engagement', deadlineOffset: -30 },
        { id: 'ftv4', text: 'Locate Polling Station via Voter Helpline App', phase: 'Execution', deadlineOffset: -14 },
        { id: 'ftv5', text: 'Cast Vote via EVM & Verify VVPAT', phase: 'Execution', deadlineOffset: 0 },
    ],
    NRI: [
        { id: 'nri1', text: 'Submit Form 6A for Overseas Election', phase: 'Preparation', deadlineOffset: -120 },
        { id: 'nri2', text: 'Passport Verification Process', phase: 'Preparation', deadlineOffset: -90 },
        { id: 'nri3', text: 'Confirm Registration in Home Constituency', phase: 'Engagement', deadlineOffset: -60 },
        { id: 'nri4', text: 'Travel to Home Polling Station', phase: 'Execution', deadlineOffset: -7 },
        { id: 'nri5', text: 'Cast Vote via EVM', phase: 'Execution', deadlineOffset: 0 },
    ],
    SV: [
        { id: 'sv1', text: 'Submit Form 8 for Address Change', phase: 'Preparation', deadlineOffset: -90 },
        { id: 'sv2', text: 'Verify Updated Entry in Electoral Roll', phase: 'Preparation', deadlineOffset: -60 },
        { id: 'sv3', text: 'Download e-EPIC Card', phase: 'Engagement', deadlineOffset: -30 },
        { id: 'sv4', text: 'Locate New Polling Station', phase: 'Execution', deadlineOffset: -14 },
        { id: 'sv5', text: 'Cast Vote via EVM', phase: 'Execution', deadlineOffset: 0 },
    ],
    EV: [
        { id: 'ev1', text: 'Verify Name in Current Electoral Roll', phase: 'Preparation', deadlineOffset: -60 },
        { id: 'ev2', text: 'Research Candidates via ECI App', phase: 'Engagement', deadlineOffset: -30 },
        { id: 'ev3', text: 'Identify Polling Booth and Serial Number', phase: 'Execution', deadlineOffset: -14 },
        { id: 'ev4', text: 'Cast Vote via EVM & Verify VVPAT', phase: 'Execution', deadlineOffset: 0 },
    ],
    EOV: [
        { id: 'eov1', text: 'Complete BLO Certification Training', phase: 'Preparation', deadlineOffset: -90 },
        { id: 'eov2', text: 'Conduct Door-to-Door Roll Verification', phase: 'Preparation', deadlineOffset: -60 },
        { id: 'eov3', text: 'Assist Voters with Form 6/8/7', phase: 'Engagement', deadlineOffset: -30 },
        { id: 'eov4', text: 'Booth Setup and EVM Testing', phase: 'Execution', deadlineOffset: -7 },
        { id: 'eov5', text: 'Manage Polling Day Operations', phase: 'Execution', deadlineOffset: 0 },
    ]
};

/**
 * Maps a given user input string to a specific voter persona.
 * @param {string} input - The raw text input from the user describing their situation.
 * @returns {Object} The matched persona object from the PERSONAS dictionary, or an UNKNOWN fallback.
 */
function mapPersona(input) {
    const text = (input || "").toLowerCase();
    if (text.includes('first time') || text.includes('never voted') || (text.includes('18') && text.includes('start'))) return PERSONAS.FTV;
    if (text.includes('nri') || text.includes('overseas') || text.includes('abroad') || text.includes('passport')) return PERSONAS.NRI;
    if (text.includes('shifted') || text.includes('moved') || text.includes('address change') || text.includes('correction')) return PERSONAS.SV;
    if (text.includes('blo') || text.includes('booth level officer') || text.includes('volunteer') || text.includes('official')) return PERSONAS.EOV;
    if (text.includes('voted before') || text.includes('epic') || text.includes('voter id')) return PERSONAS.EV;
    return { id: 'UNKNOWN', name: 'Undetermined', tone: 'neutral', focus: 'General Indian election information', color: 'gray' };
}

/**
 * Generates a localized timeline with milestones based on the selected persona and the election date.
 * @param {string} personaId - The unique ID of the persona (e.g., 'FTV', 'NRI').
 * @param {string} electionDateStr - The official election date string (e.g., '2026-11-03').
 * @returns {Array<Object>} An array of milestone objects with calculated deadlines and status flags.
 */
function generateTimeline(personaId, electionDateStr) {
    const electionDate = new Date(electionDateStr);
    const today = new Date();
    const milestones = MILESTONES[personaId] || MILESTONES.EV;

    return milestones.map(m => {
        const deadline = new Date(electionDate);
        deadline.setDate(electionDate.getDate() + m.deadlineOffset);
        const diffTime = deadline - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let status = 'pending';
        if (diffDays < 0) status = 'missed';
        else if (diffDays <= 3) status = 'urgent';
        return { ...m, deadline: deadline.toDateString(), daysLeft: diffDays, status: status };
    });
}

if (typeof module !== 'undefined') {
    module.exports = { mapPersona, generateTimeline, PERSONAS, MILESTONES };
}
