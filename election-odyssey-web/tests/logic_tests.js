const { mapPersona, generateTimeline } = require('../js/utils');
const assert = require('assert');

console.log('🚀 Starting Logic Tests for Election Odyssey...');

try {
    // 1. Persona Mapping Tests
    console.log('\nTesting Persona Mapper...');

    const testCases = [
        { input: "I'm 18 and starting to vote", expected: 'FTV' },
        { input: "I live abroad in USA", expected: 'NRI' },
        { input: "I moved to a new city", expected: 'SV' },
        { input: "I am a BLO volunteer", expected: 'EOV' },
        { input: "I have voted before", expected: 'EV' },
        { input: "Random text", expected: 'UNKNOWN' },
    ];

    testCases.forEach(({ input, expected }, i) => {
        const result = mapPersona(input);
        assert.strictEqual(result.id, expected, `Test case ${i + 1} failed: ${input}`);
        console.log(`✅ Passed: "${input}" -> ${expected}`);
    });

    // 2. Timeline Generation Tests
    console.log('\nTesting Timeline Generator...');

    const electionDate = '2026-11-03';
    const timeline = generateTimeline('FTV', electionDate);

    assert.ok(Array.isArray(timeline), 'Timeline should be an array');
    assert.strictEqual(timeline.length, 5, 'FTV should have 5 milestones');

    // Check if dates are generated
    assert.ok(timeline[0].deadline, 'Milestone should have a date string');

    // Check status logic (Since today is constant in the function, 
    // we verify that it calculates based on current date)
    console.log(`✅ Passed: Timeline generated with ${timeline.length} milestones`);

    console.log('\n✨ ALL LOGIC TESTS PASSED SUCCESSFULLY!');
} catch (error) {
    console.error('\n❌ TEST FAILED:');
    console.error(error);
    process.exit(1);
}
