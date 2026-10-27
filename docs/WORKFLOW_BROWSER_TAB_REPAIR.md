# Saved-comparison browser-test navigation repair — 2026-10-27

The supplied October 25 browser log failed waiting for the existing Compare saved foods summary to become visible. Library navigation selects Recent by default; the comparison is intentionally restricted to Saved.

The workflow now checks the initial Recent state, selects Saved before checking visibility, checks that the panel is hidden on Recent and Changes, and returns to Saved to check visibility again. It asserts one comparison panel before and after switching. Both existing viewports and all candidate-selection, storage, guard and commit safeguards are retained. No app CSS or tab behavior changes.

Local validation: workflow YAML parsing, embedded shell syntax, JavaScript syntax, and targeted-edit checks passed. Browser assertions have not been executed locally; the next GitHub Actions result is required before calling the workflow successful. Live nutrition, deployed-site and physical iPhone verification remain separate.
