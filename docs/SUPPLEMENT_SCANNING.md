# Supplement scanning: first implementation slice

Status: design agreed; repository integration partially inspected; live supplement data not validated. Recorded 2026-10-12.

## Inspected integration points
- result.js getExtra fetches Open Food Facts photos, nutriments and serving_size. It retains only energy, fat, saturated fat, sodium, salt, carbohydrates, fiber, sugars, added sugars and protein. pick chooses serving versus 100g from availability of energy or carbohydrate. This food path must not be reused as authoritative Supplement Facts.
- explore-search.js searches Open Food Facts and opens products through OLOpenCode where available. Preserve food search and navigation. Barcode scanner implementation, Library serialization and full panel hooks still need inspection.

## Data-source feasibility
The DSLD FAQ documents current and historical label exports and explicitly says label accuracy and regulatory conformity are not independently verified.
Source: https://dsld.od.nih.gov/faq
The retrieved developer guide documents search-filter quoted barcode queries, individual label lookup, public-domain data, and 1,000 requests/hour/IP without a key; a key increases the documented limit to 10,000. These are published guide claims, not verified production behavior. Development endpoints are not a production deployment commitment.
Source: https://dsld-dev-web.app.cloud.gov/api-guide
Retrieval attempts for the guide's label 82118 and barcode 80004843 examples failed. No actual product records, response fields, production availability, CORS, pagination or barcode precision were validated. Do not claim that an API key is mandatory. Do not place private API keys in browser code.

## Data contract
supplements/record-contract.json is a field contract, not executable JSON Schema or a populated product database. Preserve original text alongside normalized fields. Each fact carries provenance and a verification state. Null means unknown, not zero. Label-confirmed never means laboratory-verified.

## Adapter and matching requirements
- Inspect production API specification and successful real responses before implementing an adapter.
- Preserve leading barcode zeros; never parse a barcode as a number. Normalize spaces only for comparison; any UPC/EAN equivalence needs explicit tested rules.
- A barcode search hit is a candidate. Verify its actual barcode field, brand, strength, dosage form, market and label version. Historical records remain historical; conflicts require package verification.
- Track matched, uncertain, conflicting, not found and unavailable separately. Reject stale responses after another product opens.
- Keep label data, serving calculations and evidence records separate. Avoid automatic disease or genetic suitability claims.
- No OCR, image upload, interaction screening or nutrient upper-limit rules are implemented by this slice.

## Calculation gates
Require confirmed numeric amount, compatible unit and known serving basis. Keep nutrient amount separate from supplying-compound weight. Do not split proprietary blend totals. Do not sum DFE and declared folate mass. No universal IU conversion. Do not convert scoops or drops without a documented mapping. User-selected intake is a calculation, not a dose recommendation. Preference matches are neutral, not safety endorsements.

## Next implementation sequence
1. Inspect main barcode lookup, Library storage and complete panel lifecycle.
2. Validate production access and real responses for 12-20 representative labels; store source IDs, versions and field accuracy logs, not fabricated fixtures presented as real products.
3. Implement and test adapter plus candidate matching.
4. Add Supplement Facts rendering behind a development flag; preserve food rendering.
5. Add confirmation controls and serving calculations; test browser then owner iPhone.
6. Only afterward implement combined-intake checks and reviewed dose references.

## Required regression cases
Leading-zero barcodes; multiple versions; wrong strength; no record; timeout; missing amount; mcg/mg ambiguity; multi-capsule serving; nutrient versus compound weight; folate DFE; undisclosed blend doses; botanical forms; user correction; stale asynchronous responses; food-scan regression.

## Evidence and privacy
Agency, academic, commercial and advocacy sources receive consistent methods, relevance, funding and conflict review. Recommendations are not automatic app conclusions. Do not infer a methylated multivitamin requirement or dose from MTHFR alone. Support explicit form preferences without collecting genetic reports. No medication, condition or genetic data collection in this slice. Any future image upload requires a disclosed storage/deletion policy and consent.

## Completion gate
No supplement feature is marked Built until code exists; no real-data validation is marked passed without retrieved records; no browser or phone check is marked passed without execution. These documents do not change the live app.
