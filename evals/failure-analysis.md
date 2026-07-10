# Search failure analysis

The first real eval run scored **~80% top-3** on a 100-screenshot set: for 80% of the test queries, the right screenshot showed up in the top three results. This writeup is about the other 20% — where search misses, why, and what would move the number.

## How the number is measured

Each test screenshot is labeled with its true category (`data/labels.json`) and paired with a natural-language query it should return (`data/queries.json`). The harness (`run_eval.ts`) runs every query against the live `/api/search` endpoint, checks whether the expected screenshot lands in the top 3, and reports accuracy overall and per category. Top-3 rather than top-1 because in the actual product you're scanning a small grid, not trusting a single answer — if the right result is in the first few, the search did its job.

## Where the misses come from

The pipeline is: the vision model reads each screenshot into text + a one-line description + tags, that gets embedded into a vector, and search embeds your query and finds the nearest vectors. Every failure traces back to one of these steps not carrying enough signal. Four patterns account for most of it.

**1. Text-light screenshots.** Recipes, quotes, and receipts are mostly words, so there's a lot for the model to extract and a lot for a query to match against. Outfits, travel photos, and memes are mostly *image* — a photo of a dress produces little text, so the whole match rests on how good the one-line description is. When the description is generic ("a woman wearing a dress"), a specific query ("blue floral sundress") has nothing precise to latch onto. This is the single biggest lever: search quality on visual categories is capped by description quality.

**2. Semantically adjacent categories.** Search doesn't filter by category — it matches on meaning — so content that *reads* similarly competes. A screenshotted tweet (`social`) and a screenshotted quote (`quote`) embed close together; a receipt (`receipt`) and a marketplace listing (`listing`) both look like "item + price." The right screenshot is often in the results, just not top-3, because two or three near-duplicates from the neighboring category crowd it out.

**3. Vague or very short queries.** "Recipe" or "that thing I saved" gives the embedding almost nothing to discriminate on, so it returns a spread of loosely related items. The more specific the query, the sharper the match — which is a product/onboarding problem as much as a model one (people don't know how specific they can be).

**4. Threshold effects.** Search uses a fixed similarity cutoff (`match_threshold`). Set it low and weak-but-real matches get buried under noise; set it high and valid matches get filtered out entirely. One global threshold can't be right for both text-rich and text-light categories at once.

## What would fix each

- **Better descriptions for visual categories** — the highest-value change. Push the vision prompt to be concrete and attribute-rich for outfits/travel/memes (colors, style, setting, subject), so text-light screenshots carry real search signal.
- **Category-aware ranking** — use the category the model already assigns to break ties, so an adjacent-category near-duplicate doesn't outrank the true match.
- **Query hints in the UI** — nudge people toward specific phrasing with examples and good empty-state prompts. Cheap, and it attacks the vague-query failures directly.
- **Per-category thresholds** — instead of one global cutoff, tune it per category once the per-category numbers show where recall is being lost.

## Reproducing the per-category breakdown

The 80% headline came from a manual run. To turn it into a reproducible, per-category table, the labeled set and its output need to live in the repo:

1. Upload the 100 test screenshots through the app so they exist with embeddings.
2. Fill `data/labels.json` and `data/queries.json` with the real set (they still hold placeholder entries).
3. `npm run eval` and paste the per-category table into `evals/README.md`.

That per-category breakdown is what confirms which of the four patterns above is actually costing the most, and turns this analysis from "here's where it *should* miss" into "here's where it *does*."
