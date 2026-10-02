# Diet-fit rule definitions (v0)

Purpose: define exactly what each yes / no / maybe / can't tell means before more diet logic is added. Implemented in `profile-rows.js` (`evalDiet`), tested in `tests/diet-fit.test.js`.

## Result meanings
- yes: a source outside our own word matching says so (Open Food Facts analysis tag or a label tag). We never say yes from the ingredient list alone.
- no: an ingredient word (or a numeric threshold) conflicts with the diet. The reason is shown.
- maybe: nothing conflicting was found, but a list cannot prove the product fits. Absence of a word is not confirmation.
- can't tell: required data (ingredient list or per-serving nutrition) is missing. Missing is never reassuring.

## Rules
| Diet | no when | yes when | maybe when |
|---|---|---|---|
| Vegan | milk, egg, meat, fish or animal-derived word (honey, beeswax, royal jelly, lanolin, shellac) in list, or OFF tag non-vegan | OFF tag or label vegan | none of those found |
| Vegetarian | meat or fish word, or OFF tag non-vegetarian | OFF tag or label vegetarian/vegan | none found |
| Pescatarian | meat word | OFF tag vegetarian/vegan | no meat word |
| Dairy-free | milk word (milk, whey, casein, lactose, butter, cream, cheese, yogurt, ghee, and similar) | label dairy-free or vegan | no dairy word |
| Gluten-free | gluten grain word (wheat, barley, rye, malt, spelt, semolina and similar) | label gluten-free | no gluten word (cross-contact not judged) |
| Paleo | grain, legume, dairy, refined sugar or seed oil word | never | none found (definitions vary) |
| Keto, Low-carb | 35 g or more carbs per serving, or more than 10 g sugar per serving | never | carbs listed and below that |
| Low-sugar | more than 10 g sugar per serving | never | sugar listed and at or below 10 g |
| Low-sodium | never | never | sodium listed (user compares to own limit) |

Keto and low-carb share one heuristic threshold and show the share of the user's own daily carb target when set. Thresholds are placeholders, not clinical criteria, and are labelled as such in the notes. Halal and kosher are not judged (certification, not ingredients).

## Per-serving versus per 100 g
Keto, low-carb, low-sugar and low-sodium use the per-serving value when Open Food Facts has one. If only a per 100 g or 100 mL value exists, it is used and labelled that way (keto and low-carb: no at 25 g or more per 100 g; low-sugar: no at 10 g or more per 100 g). If neither exists the result says the database lists no value. A product's nutrition table and the diet row now use the same data.

## Exceptions (not counted as the animal or dairy word)
Plant milks, cocoa/shea/peanut/almond/nut/seed/sunflower/apple butter, coconut cream and butter, cream of tartar, cream soda, butter beans, and vegetable, mushroom and seaweed broth or stock.

## Known limits
- Word lists are English only and miss derivatives and misspellings.
- Hidden animal-derived items (some sugar, wine, colors, vitamin D3) are not caught.
- Per-serving data may be absent or wrong; Open Food Facts is volunteer data.
- Diet fit is a preference helper, not a dietary or medical claim.

## Not yet defined
Low-sodium numeric threshold, a clinical basis for keto/low-carb thresholds, intolerance word lists review (lactose, fructose, sugar alcohols, sulfites). Deferred until a source for each is chosen.
