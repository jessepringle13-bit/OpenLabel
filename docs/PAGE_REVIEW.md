# Page review: decisions and build order (draft v0.1)

Reviewed 2026-09-30 with the project owner. Each page was compared with the layered design in DESIGN_LAYERS.md and the rules in PRINCIPLES.md.

## Decisions
1. No scores anywhere. Remove the Nutri-Score line from the result page (it shows as a letter grade in "On this label").
2. Processing level is a small tag near the top of the result page, alongside other tags. A longer processing-level explanation goes lower on the page, later, not in the first version.
3. Explore becomes a live search by product name. Sample products stay, labeled as demo.
4. Profile becomes a thorough picker: the customer selects everything that relates to them from a full list in a pop-up with search and multiple selection. The list covers common and rare allergies, dietary needs, and topics to watch (for example seed oils, artificial sweeteners, ultra-processed foods, added sugar). The profile decides what ranks first in Worth knowing.
5. Library shows a marker on saved items when a recall or a change appears, once those checks exist.

## Notes and limits
- Build the allergy and dietary list from official sources (FDA and EU allergen lists and similar), not from memory.
- Rare allergies can only be matched against ingredient text, because the product database has official tags only for the common allergens. Those matches must say what they are based on and must never claim certainty. No match never means safe.
- Health conditions are optional and stay on the device only. The profile privacy note must be updated to say so before conditions are offered.
- Tags on the result page beyond processing level (for example organic, vegan) only if the database has them; to be confirmed.

## Build order
- Batch 1: result page tags, Nutri-Score removed, new profile picker with topics to watch.
- Batch 2: live Explore search by name.
- Batch 3: warnings list (allergen and recall matches pinned, up to three more ranked by profile then how contested, visible count, See all findings with filters) and recall checks.
- Batch 4: Library markers and recent changes.
- Batch 5: live research after each scan with automatic source checks.

## Page status
- Scan: keep as is.
- Home: thin (one recent item); revisit after Batch 1.
- Result: changes in Batch 1 and Batch 3.
- Explore: Batch 2.
- Library: Batch 4.
- Profile: Batch 1.
- Sheets: standardize on the layered style (plain language, status words) as each feature lands.
