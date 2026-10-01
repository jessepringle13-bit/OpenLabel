# Testing checklist (v0.2)

## What is run before every push
1. Syntax check of every changed script.
2. Open the app in a browser at 390 by 844, then 320 by 568, then 768 wide.
3. Click through every page: Scan, Home, Explore, Library, Profile, product panel, Recent recalls, Lab tested.
4. Open and close every sheet by button, backdrop and Escape. Check each sheet opens at the top.
5. Check the product panel for: a sample product, a product with allergens and traces, a product with a seed oil, a product with a test result in the register, a product with a recall match, and a product with almost no data.
6. Check the swipe gestures: up to full, down to partial, down again to close, tap on the header.
7. Check there are no errors in the browser console and no sideways scrolling.
8. Check wording: plain language, allowed status words only, no scores, no verdicts.
9. Take a screenshot of every changed page.
10. After the push, compare the file sizes and fingerprints in the repo with the tested copies.

## How the checks are run
The build side drives the app in a headless browser with stand-in data for the online services (Open Food Facts, the FDA recall database). That proves the logic, layout and gestures. It does not prove the live services work.

## What only a phone can show, so the owner checks
- Camera scanning, in the browser and in the home-screen app.
- A real barcode lookup, product photo and nutrition values.
- Whether the FDA recall data loads in a phone browser (Recalls tag, Recent recalls page).
- How the pages feel to swipe, scroll and tap.
For each release the build side lists the two or three exact things to check.

## Known gaps
- Recall matching is tested only against stand-in records.
- Ingredient descriptions are tested in a stand-in panel.
- Sample products on Explore cannot show photos, macros or recalls.

## Pass rule
Nothing is pushed if any step above fails. A failed step is fixed, or the change is held and explained.

## Reporting a problem
Send a screenshot and say which page and what you tapped. The build side reproduces it before changing anything.
