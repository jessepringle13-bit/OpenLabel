# Source Check Service - Spec (draft v0.1)

## Purpose
Every study the app cites runs the same checklist, automatically, and the result is shown with the study. Nothing is displayed as evidence without its check state. Follows PRINCIPLES.md.

## Input / output
Input: DOI (or PubMed ID). Output: a checklist with one state per check: passed / flagged / not found / not run. "Not found" is never a pass. Claims whose mandatory checks are incomplete are labeled provisional.

## Checks
- C1 Standing: retractions, corrections, expressions of concern. Primary source: Crossref (includes Retraction Watch data). Cross-check with OpenAlex; OpenAlex's single retraction flag has been reported to misclassify some papers, so it is not the only source.
- C2 Declared funding: Crossref funder registry / OpenAlex funder data, plus publisher text. Gap: works only when funders are deposited in metadata.
- C3 Declared conflicts: PubMed conflict-of-interest field and article text. Extraction is assisted and spot-checked, not trusted blindly.
- C4 Relationship check: match authors, affiliations and funders against the Relationship Registry (below). Output is a FLAG for human review, never a verdict.
- C5 Design and human relevance: assisted; software drafts, a reviewer confirms.
- C6 Contested: replications, rebuttals, disputes.

## Known limit
Disclosure-only checks cannot detect a relationship that was never disclosed. The 1967 sugar review omitted the funder and its role, so checking the disclosed funding alone would not have caught it (Kearns et al. 2016). A Coca-Cola audit found 471 authors on 128 studies declaring company funding who were absent from the company's own transparency lists, and 38 listed researchers who did not declare it. C4 exists for this reason.

## Relationship Registry
Each entry: entity A, entity B, relationship type (direct funding / corporate membership / shared personnel / commissioned work / PR representation / documented coordination), dates, evidence links, confidence (documented / alleged / inferred), reviewer, last reviewed.
Language rule: say "linked to" and state the type. Do not use labels such as "front group" unless the relationship is documented.
Source tiers:
- Tier 1: primary documents (UCSF Industry Documents Library, FOIA releases, court records, company disclosure lists, payment databases such as CMS Open Payments).
- Tier 2: peer-reviewed audits (for example the Coca-Cola funding network study).
- Tier 3: investigative and advocacy compilations (U.S. Right to Know, Tobacco Tactics, DeSmog, SourceWatch). Leads only; each entry must be checked against Tier 1 or 2 before use. These sources have their own viewpoints and funding and are vetted like any other source. Descriptions of them have not yet been independently verified [?].
Symmetry rule: the registry covers all sides - food and agrichemical industry, supplement, organic and wellness industry, advocacy groups, and government bodies.
Identity: matching uses name plus affiliation, specialty and time period to avoid confusing people with similar names. Consequential matches need human review.
Maintenance: a named owner and a review schedule. Lesson: CSPI's Integrity in Science database closed in 2009 for lack of funding.

## Build order
1. DOI in, checks C1-C3 out, with states and provisional labeling.
2. Registry v0 seeded with well-documented cases only (Sugar Research Foundation 1967 review, ILSI North America ties, Coca-Cola Global Energy Balance Network), each with Tier 1 or 2 evidence.
3. C4 matching and a reviewer screen.
4. Scheduled re-checks (retractions and corrections arrive after publication).
5. C5-C6 assisted review.

## Open questions
- Who owns and maintains the registry?
- Accuracy of software extraction of funding and conflict statements on our own test set.
- Legal review of registry wording before public release.
