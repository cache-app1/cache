# Roadmap

Where Cache is and where it's going. This is a living doc — priorities move as we watch how people actually use it.

## Shipped

- Upload screenshots from any device (the file picker opens your camera roll on phones)
- AI reads each screenshot on upload: pulls the text, picks a category, adds tags, writes a short description
- Natural-language search over everything you've saved (semantic, not just keyword matching)
- Auto-sort into albums, plus manual albums, merging, and bulk actions
- Accounts with a guest mode, and row-level security so your screenshots stay yours
- Landing page and lightweight event tracking for upload/search

## Now

- **Prove the accuracy.** First real eval run came back at ~80% top-3 on a 100-screenshot set. Next step is folding that labeled set and its results into the repo so the number is reproducible, not just a one-off measurement.
- **Get the live deploy stable.** The hosted site needs to reliably track `main` so the demo is always the real thing.
- **First real users.** Get it into the hands of 20–50 people and watch where search falls short and where people drop off.

## Next

- **Tighten the weak categories.** The eval showed some categories miss more than others — use that to improve the vision prompt and the search thresholds where it matters most.
- **Faster upload feel.** Processing runs synchronously today, so a big batch is slow. Move the vision/embedding step to a background job and let cards fill in as they finish.
- **Better first-run experience.** A clearer empty state and a sample set so a brand-new user sees the point in the first ten seconds.

## Later

- Auto-sync from your phone so you don't have to upload manually
- Sharing and shared collections (send someone the recipe album, not one screenshot at a time)
- Reminders and follow-ups on things you saved but never acted on
- A real mobile app if the browser experience proves the demand

## How we prioritize

We build for the person who screenshots constantly and loses track of it all — recipe savers, trip planners, apartment hunters. When two things compete, the one that helps that person *find what they saved* wins over the one that adds a new thing to save. Retention (did someone come back a week later and search) is the number we watch most; features that don't move it get cut.
