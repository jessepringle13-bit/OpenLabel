# Saved-comparison workflow guard repair — 2026-10-25

The guard now parses script elements, inserts only when the comparison scripts are absent, and treats one correctly ordered existing set as a successful no-op. It preserves cache versions and intervening source-adapter scripts. Missing/duplicate provenance, partial/duplicate comparison wiring, unexpected locations, async/module execution, mixed defer modes, and malformed script tags remain errors. No comparison tests or browser assertions were removed.

The final commit step now skips an empty commit after successful checks. The helper and its regression test are included in workflow path triggers.

Local verification: four unittest methods cover insertion/rerun, four existing variants, comment/closing-tag handling, and ten invalid states. Workflow YAML, embedded Python/JavaScript, shell syntax, and no-change/changed commit branches are checked locally. These tests use synthetic HTML; the actual index.html, full comparison suite, GitHub run, browser layout, live nutrition and iPhone behavior remain unverified. A successful push is not proof that the workflow or deployment passed. This fixes a known guard defect, not a log-confirmed diagnosis of the email notification.
