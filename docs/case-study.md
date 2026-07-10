# Cache — Case Study

How we took a screenshot organizer from an idea to a shipped, working product, and the decisions that shaped it.

## The problem

People screenshot constantly — recipes, travel plans, receipts, outfits, apartment listings — because it's the fastest way to save something before it's gone. But the camera roll is where those screenshots go to die. There's no structure and no real search, so "that pasta recipe I saved" means scrolling through hundreds of images hoping to spot it. The information is saved but effectively lost.

Apple and Google Photos have basic search, but it's built for *photos* (faces, places, objects), not for the text-heavy, intent-heavy things people screenshot. Nobody was solving "help me find the thing I saved because of what it *said* or *meant*."

## Who it's for

We wrote three personas — recipe savers, trip planners, apartment hunters — and built first for the person all three share: someone who screenshots as a save button and then can't get back to any of it. That focus set the scope. It's why the wedge is *search and auto-organize*, not sharing or social or a note-taking app.

## What shipped

A responsive web app (works in a phone browser, file picker opens the camera roll) where:

- You upload screenshots and an AI model reads each one — pulls the text, assigns a category, adds tags, writes a short description.
- Everything is searchable in plain English via semantic search, not keyword matching.
- Screenshots auto-sort into albums, with manual albums, merging, and bulk actions on top.
- Accounts include a one-tap guest mode, and row-level security keeps every screenshot scoped to its owner.

Full technical detail is in [architecture.md](architecture.md); the search-quality work is in [../evals/failure-analysis.md](../evals/failure-analysis.md).

## Key decisions and tradeoffs

**Narrow the wedge to search + auto-organize.** The temptation was to also do sharing, collections, reminders, phone sync. We cut all of it to roadmap. Shipping a small thing that genuinely works beat shipping a broad thing that half-works — and it's the only reason a real v1 was live in weeks, not months.

**Search on meaning, not keywords.** The headline differentiator is semantic search — you can ask for "recipes under 30 minutes," not just match the word "recipe." This is the whole reason to use Cache over the Photos app you already have, so it got the investment.

**Synchronous processing, on purpose.** Reading and embedding a screenshot happens inside the upload request — the user waits a few seconds and gets a fully tagged result. We chose this over a background job queue knowing it doesn't scale to 50-image batches, because for v1, simple and correct beat fast. The upgrade path (background jobs, cards that fill in as they finish) is documented and deferred until batch upload is a proven pain, not a hypothetical one.

**One taxonomy, deliberately sized.** We landed on nine categories — enough to cover what real screenshots actually are, few enough that the model (and the eval) isn't drawing hair-thin distinctions. When two categories start getting confused in the numbers, the plan is to merge them, not add more.

**Prove quality with numbers.** Rather than claim "great search," we built an eval: a labeled set of screenshots and queries, scored on top-3 accuracy. First run came back at ~80%, with a written analysis of where the other 20% fails and what would fix it. The number is the credibility.

## Metrics

Quality is measured and real: **~80% top-3 search accuracy** on the first 100-screenshot eval.

Usage metrics are instrumented and collecting. Every upload and search logs an event, and the queries for signups, activation (did a signup upload anything), weekly retention (did they come back a week later and search), and searches per active user are written and ready in [metrics.md](metrics.md). These are early — the honest state is that the funnel is wired up and the first real users are the next milestone, not that we have a retention curve yet. Getting 20–50 real people using it, watching where search fails and where people drop off, and shipping changes driven by that data is the current focus.

## What's next / what I'd do differently

- **Attack the weak search categories first.** The failure analysis points at text-light screenshots (outfits, travel, memes) as the biggest miss. Better vision descriptions there is the highest-leverage next change.
- **Make uploads feel instant.** The synchronous-processing tradeoff was right for v1 but is the first thing to revisit as soon as people upload in bulk.
- **Instrument earlier.** Analytics went in after the core product; wiring the funnel from day one would have meant a fuller usage picture by launch. Next time, events before features.

See [roadmap.md](roadmap.md) for where the product goes from here.
