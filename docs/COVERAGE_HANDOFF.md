# Ingredient coverage: handoff for the next session (written 2026-11-01)

Start here. Read `CLAUDE.md`, `AGENTS.md` and `PRINCIPLES.md` first (they load automatically in a Claude Code session on this repo). The owner is not an expert developer: plain language, one decision at a time, show the diff and get approval before any push to `main`.

## The goal
The owner wants OpenLabel to explain the ingredients and supplements on typical labels "with no problem": every ingredient should either be explained from a real source, or be shown honestly as "not yet verified". Never guessed, never scored, never "safe" or "healthy".

## Where things stand (after commit fe63a14 on main)
Measured on a fixed set of 673 ingredient names from 45 typical US food labels and 26 typical supplement labels (written from general knowledge, not scanned products), using the app's own lookup on the full row label:

| | Names | Explained (sourced) | Plain food identified | Not yet verified |
|---|---|---|---|---|
| All | 673 | 61% | 9% | 30% |
| Food ingredients | 452 | 64% | 12% | 24% |
| Supplement actives | 135 | 42% | 2% | 56% |
| Supplement other ingredients | 86 | 72% | 1% | 27% |

Food labels fully covered: 9 of 45. Supplement labels fully covered: 0 of 26.

Done so far on this topic: batch 1 of regulated additives (see Update below), and a curated "Plain food ingredient" status (`ingredient-plain-foods.js`, `tests/plain-foods.test.cjs`). It is identification only and never overrides a reviewed entry.

## Update (same day, later): source access and batch 1
After the owner allowed more domains, these work from the build environment: the **eCFR data service** (official regulation text), `www.fda.gov`, `www.nccih.nih.gov`, `www.efsa.europa.eu`. Not working: `www.law.cornell.edu` (blocked; the bare domain redirects to www), `ods.od.nih.gov` (answers 403 to plain requests; do not disguise requests to get past it, ask the owner or use an allowed source instead). Always read a page's real text before writing a claim.

How to read an eCFR section (official, current):

    curl -sSL --compressed https://www.ecfr.gov/api/versioner/v1/titles.json      # find up_to_date_as_of for title 21
    curl -sSL --compressed "https://www.ecfr.gov/api/versioner/v1/structure/<date>/title-21.json?part=184"   # section titles
    curl -sSL --compressed "https://www.ecfr.gov/api/versioner/v1/full/<date>/title-21.xml?part=184&section=184.1230"

(`--compressed` is required; the service answers 406 without it.) Strip the XML tags and read the text; function definitions are in 21 CFR 170.3(o).

**Batch 1 is done** (`ingredient-regulated-additives-1.js`, 16 entries / 24 names, test `tests/regulated-additives-1.test.js`, fixture `tests/fixtures/ecfr-title21-2026-10-29.json`): the pattern to copy for the next batches. Each entry's listed uses are generated from a data array and the test compares them with the regulation text, in both directions.

Not done, and why: sodium bicarbonate (its listing names no functions; do not write an empty explanation), `sodium caseinate` and others whose listing only says GRAS under good manufacturing practice (only add if you can say something true and useful, as was done for the sequestrant phosphates), croscarmellose sodium and gelatin (no matching section found in Parts 172, 182 or 184; look in the FDA inventory), tripotassium phosphate and monopotassium phosphate (no matching section titles found).

## What remains blocked
Supplement actives (melatonin, taurine, L-carnitine, omega-3/EPA/DHA, CoQ10, creatine, probiotics...) need NIH fact sheets. NCCIH pages are reachable (for example melatonin), ODS pages are not from the build environment. Read what is reachable; leave anything you cannot read.

## The job: sourced entry batches (about 10 entries each)
Pattern to copy: `ingredient-starches-fibers.js` and `tests/starches-fibers.test.js`.
- Each record: `names` (lowercase, unique, not already resolvable), `role`, `use`, `form`, `purpose`, `difference`, `source` (https), `sourceLabel`, `formUnspecified` (boolean), `reviewed` (date). `OLIngredientEntries.add()` throws on duplicates or existing names.
- Wording: identity and common use only, tied to what the source actually says. No verdicts, no "safe", no scores. The label does not establish amount, purity, origin or effect. Existing health evidence is separate and unchanged.
- **Verify every source by reading the page text.** Quote the listed function and any limit from the page, do not paraphrase from memory. If a page cannot be read or does not say what you expected, leave that ingredient out and say so.
- Wire a new batch file in by adding it to the `mods` list in `ingredient-loader.js`, then bump the version string everywhere it appears (`index.html` for evidence.js, `evidence.js` for result.js, `result.js`, `ingredient-loader.js`; currently `20261103-plain2`). Add a test, update `FEATURES.md`, run all tests (`node tests/<name>`; 2 tests need `jsdom` and fail without it), and show the owner the diff before pushing.
- Re-run the coverage audit after each batch (see `docs/coverage-audit/README.md`) and report the before/after table.

## Suggested order (most frequent gaps in the audit set first)
1. Mineral salts and phosphates, capsule/coating/excipient ingredients, other common food additives.
2. Supplement actives and botanicals (melatonin, taurine, L-carnitine, omega-3, EPA/DHA, CoQ10, creatine, probiotics and so on). Prefer NIH ODS and NCCIH fact sheets. Keep wording strictly to what they say.
3. Name aliases and the education bridge (see below). Ask the owner first.

### What is already confirmed (from search results only; the function lists are NOT confirmed)
- 21 CFR 184.1230 is "Calcium sulfate" (Part 184, direct food substances affirmed as GRAS).
- 21 CFR 182.1778 is "Sodium phosphate" (mono-, di- and tribasic), listed as GRAS when used in accordance with good manufacturing practice.
- Everything else below is a CANDIDATE from memory and must be checked: 184.1193 calcium chloride; 184.1622 potassium chloride; 184.1207 calcium lactate; 184.1639 potassium lactate; 184.1742 sodium carbonate; 184.1619 potassium carbonate; 182.1217 calcium phosphate; 182.6285 / 182.6289 / 182.6290 potassium and sodium phosphates; 182.6890 sodium tripolyphosphate; 182.6760 sodium hexametaphosphate; 184.1090 stearic acid; 184.1978 carnauba wax; 184.1505 mono- and diglycerides.

## Two findings the owner has not yet decided on
1. **Education text exists but the top line says "Purpose not yet verified".** About 16 common names (vitamin B6, pyridoxine, niacin, pantothenic acid, potassium, sodium, chloride, choline, phytonadione, thiamine HCl and forms) have NIH-sourced education text (`OLIngredientEducation`, from the `nutrient-batch-*.js` files) but no purpose line, so a sheet contradicts itself. A bridge from the education `body` to the purpose line is possible, but `docs/INGREDIENT_STATUS_CONSISTENCY.md` says unknown purpose should stay explicit, so ask the owner before doing it. Gain: about 2 points of coverage.
2. **Bracketed items** like "Enriched flour (wheat flour, niacin, reduced iron, ...)" are one row, and the parts are not explained separately (about 34 names in the audit set).

## Gaps still not verified in the audit set (name, with times seen)
### other (72 occurrences, 62 distinct names)
brown sugar syrup ×2, soluble corn fiber ×2, wheat gluten ×2, whey ×2, lactose ×2, lemon juice concentrate ×2, brown sugar ×2, cheese culture ×2, enzymes ×2, glucose syrup ×2, dough conditioners (ascorbic acid, azodicarbonamide), cheddar cheese (milk, cheese cultures, salt, enzymes), cultured grade a low fat milk, modified corn starch, kosher gelatin, cultured pasteurized grade a milk, live active cultures (s. thermophilus, l. bulgaricus, l. acidophilus, bifidus, l. casei), protein blend (milk protein isolate, whey protein isolate), mustard flour, tomato puree (water, tomato paste), diced tomatoes in tomato juice, chocolate, oat base (water, oats), almondmilk (filtered water, almonds), mozzarella cheese (pasteurized part-skim milk, cheese cultures, salt, enzymes), soy sauce powder, hydrolyzed soy protein, tomato concentrate from red ripe tomatoes, hydrogenated vegetable oil (cottonseed, soybean and rapeseed oil), molasses, liquid sugar (sugar, water), glycerol ester of rosin, reverse osmosis water, crystalline fructose, pea protein, expeller-pressed canola oil, refined coconut oil, rice protein, mung bean protein, pomegranate fruit powder, tahini (ground sesame), alum, organic cane sugar, organic ginger juice, milk protein concentrate, soy sauce (water, wheat, soybeans, salt), natural hickory smoke flavor, enriched wheat flour, vegetable shortening, baking powder, chicken stock, enriched egg noodles, chicken fat, polyethylene glycol, fish oil concentrate, piperine, caffeine anhydrous, organic extra virgin olive oil, whey protein isolate, whey protein concentrate, rose hips, bioflavonoids

### supplement actives and botanicals (66 occurrences, 62 distinct names)
taurine ×2, stevia leaf extract ×2, melatonin ×2, protease ×2, guarana seed extract, l-carnitine, mechanically separated chicken, apple extract, kombucha (water, black tea, green tea, kombucha culture), omega-3 fatty acids, epa (eicosapentaenoic acid), dha (docosahexaenoic acid), lactobacillus acidophilus, lactobacillus rhamnosus gg, bifidobacterium lactis, saccharomyces boulardii, ashwagandha (withania somnifera) root extract (ksm-66), black pepper extract (piperine), turmeric root extract (curcuminoids 95%), turmeric root powder, creatine monohydrate, l-citrulline, beta-alanine, betaine anhydrous, l-tyrosine, theanine, creatine hcl, l-theanine, gaba, chamomile extract, passionflower extract, lemon balm extract, valerian root extract, 5-htp, collagen peptides (bovine), hyaluronic acid, spirulina, chlorella, wheatgrass juice powder, barley grass juice powder, alfalfa, amylase, lipase, cellulase, elderberry (sambucus nigra) extract, lactase, coenzyme q10 (ubiquinone), n-acetyl cysteine, alpha lipoic acid, glutathione, ginkgo biloba leaf extract, panax ginseng root extract, bacopa monnieri extract, huperzine a, alpha-gpc, phosphatidylserine, lion's mane mushroom, green tea extract (egcg), garcinia cambogia extract (hydroxycitric acid), cayenne pepper extract, glucomannan, dha (from algal oil)

### mineral salts and phosphates (21 occurrences, 20 distinct names)
calcium sulfate ×2, tripotassium phosphate, ammonium sulfate, tricalcium phosphate, calcium phosphates, potassium lactate, sodium phosphates, potassium carbonate, sodium carbonate, monopotassium phosphate, calcium lactate, potassium chloride, calcium chloride, sodium hexametaphosphate, enriched macaroni product (wheat flour, niacin, ferrous sulfate, thiamin mononitrate, riboflavin, folic acid), sodium tripolyphosphate, calcium phosphate, sodium (as sodium chloride), potassium (as potassium citrate), chloride

### capsule / coating / excipient (19 occurrences, 9 distinct names)
vegetable capsule ×6, carnauba wax ×3, stearic acid ×3, gelatin capsule ×2, croscarmellose sodium, vegetable cellulose capsule, leucine, softgel capsule (bovine gelatin, glycerin, water), softgel capsule

### vitamins and minerals (names/forms) (15 occurrences, 14 distinct names)
vitamin b6 ×2, vitamin e (mixed tocopherols) added to preserve freshness, reduced iron, enriched wheat flour (wheat flour, niacin, reduced iron, thiamine mononitrate, riboflavin, folic acid), inositol, enriched flour (wheat flour, niacin, reduced iron, thiamin mononitrate, riboflavin, folic acid), vitamin e acetate, sodium caseinate, vitamin k (as phytonadione), thiamine hcl, copper (as copper bisglycinate), iron (as ferrous bisglycinate), choline bitartrate, iodine (potassium iodide)

### other food additives (12 occurrences, 11 distinct names)
monoglycerides ×2, bht for freshness, datem, colors, artificial color (yellow 6, yellow 5, red 40), pepperoni (pork, beef, salt, spices, dextrose, lactic acid starter culture, flavorings, sodium nitrite, bha, bht, citric acid), beet juice extract (color), apocarotenal (color), turmeric (color), gum base, bifidobacterium longum

## Hard rules recap
- Never write a source claim you have not read on the page. Never use the food-word list `ingredient-vocab.json` to judge what is a food (it contains generic words like "extract" and "sodium").
- Do not add workflows, dependencies or third-party services without asking. No secrets in files.
- Be honest about what was tested. Phone-only checks belong to the owner: list two or three after each release.
