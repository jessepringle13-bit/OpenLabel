# Inline Explore tabs: verification scope

Only `tiles.js` changes runtime behavior. Product search and Worker code, health/evidence text, registry files, and source links are not edited.

The original search form remains in Explore. Its input targets the selected topic; query text and source filters persist across topic switches. Product requests are cancelled on leaving Products. Original recall/lab nodes are moved rather than copied and restored for standalone Home entry points. Learn and lab detail views use inline Back controls, retaining original content and source links.

One measured highlight slides between four tabs. Keyboard activation is manual: Left/Right/Home/End move focus, Enter/Space select. Reduced-motion CSS removes the indicator transition. The original hidden Products/Learn switch is not used for navigation.

Run `node tests/explore-inline-tabs.test.cjs`; repeat with `LEGACY_DIALOG=1` to model browsers without native dialog methods. This is a modeled DOM/event contract test, not a real browser, CSS-layout, screen-reader or iPhone test. It is not automatically added to the existing Worker build command.

After the static site deploys, verify on the actual app:
1. Search Products, switch to each topic, and return: top form remains, queries/filters persist, and no page routing occurs.
2. Watch the single rectangle move between all four labels at narrow/wide sizes and after rotation.
3. Filter Recalls and Lab Tests using the shared input; Clear must not run a product search.
4. Open two Learn details successively, then Back/Escape; no modal backdrop or scroll reset.
5. Open lab evidence, expand disclosures and follow sources, then Back/Escape; original text and list remain.
6. Navigate Home and open the standalone recall/lab views; close them, return to Explore, and repeat.
7. Check keyboard, focus visibility, reduced-motion settings, empty/loading/error states, browser Back, and product opening.

The existing Git connection may trigger an unchanged Worker build on this frontend commit. Commit success is not proof of static-site deployment or device-level success.
