# DynamicTimelineGenerator Test Cases
**Version**: 1.0.0
**Date**: 2026-05-02

## Test Suite
| Scenario | Input Date | Deadline Date | Expected Status | Result |
| :--- | :--- | :--- | :--- | :--- |
| FTV - Standard | 2026-09-01 | 2026-10-01 | Registration Pending | PASS |
| OMV - Critical | 2026-10-28 | 2026-10-31 | URGENCY ALERT (Mail-back) | PASS |
| EV - Completed | 2026-11-01 | 2026-11-05 | Polling Location Ready | PASS |
| PC - Missed | 2026-06-01 | 2026-05-15 | Filing Deadline Missed | PASS |
| Jurisdiction Change | NY $\rightarrow$ CA | N/A | Update all dates to CA laws | PASS |
