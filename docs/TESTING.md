# Testing checklist (draft v0.1)

## What I run before every push
1. Syntax check of every changed script.
2. Open the app in a browser at 390 by 844, then 320 by 568, then 768 wide.
3. Click through every page: Scan, Home, Explore, Library, Profile, Result.
4. Open and close every sheet by button, backdrop and Escape.
5. Check the Result page for a sample product, a product with allergens and traces, a product with a seed oil, and a product with a test result in the register.
6. Check there are no errors in the browser console.
7. Check wording: plain language, allowed status words only, no scores.
8. Take a screenshot of every changed page and show it to the project owner before pushing.
9. After the push, compare the file fingerprints in the repo with my tested copies.

## What I cannot test, so the project owner checks on a phone
- Camera scanning, in the browser and in the home-screen app.
- A real barcode lookup for a known product.
- How the pages look and scroll on the real phone.
For each release I will list the two or three exact things to check.

## Pass rule
Nothing is pushed if any step above fails. A failed step is fixed, or the change is held and explained.

## Reporting a problem
Send a screenshot and say which page and what you tapped. I will reproduce it before changing anything.
