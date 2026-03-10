\resumeProjectHeading
  {\textbf{Canopi} $|$ \emph{React, TypeScript, Python, Next.js, Three.js, Supabase, Node.js}}{Feb 2026 -- Present}
  \resumeItemListStart
    \resumeItem{Built a conversational AI rental platform using Google Gemini to infer user lifestyle preferences across 8 axes from natural conversation, re-ranking 200+ listings on a live map in real time}
    \resumeItem{Engineered a data pipeline in Python: scraped RentFaster.ca via DOM parsing, normalized inconsistent fields with AI-assisted parsing, geocoded addresses, enriched rental listings with nearby amenity data via Overpass API}
    \resumeItem{Built an immersive, interactive 3D neighborhood explorer in React Three Fiber and Mapbox GL}
    \resumeItem{Integrated ElevenLabs STT/TTS for full voice I/O and shipped bilingual English/French support}
  \resumeItemListEnd
\vspace{-14pt}



Devpost
Join a hackathon 
Host a hackathon 
Resources 
 
ryan-muxiwang
Notifications
Loading...

Canopi
A data-powered rental companion that matches you to homes and neighborhoods that fit your lifestyle.

 Liked 5  Comment
Story
Updates







Canopi — Find your place. Not just an apartment.
Inspiration
A few weeks ago, our teammate Ryan got his first co-op offer in Toronto. It was exciting - until it wasn't.

He didn't know anyone in the city. He had no idea which neighborhoods were actually livable versus just cheap. He'd never rented before. And every platform he opened - Kijiji, Zumper, Rentals.ca - just threw a grid of listings at him filtered by beds and price, as if those two numbers could tell him whether he'd be happy somewhere.

He ended up picking a place mostly blind, cross-referencing Reddit threads and Google Street View at midnight, hoping for the best.

He's not alone. Across Canada, thousands of students land co-op placements and new jobs every semester in cities they've never lived in. They're expected to figure out one of the most consequential decisions of their year - where they'll actually live - with tools that haven't meaningfully changed in a decade. Rental platforms are glorified spreadsheets. They tell you what's available. They don't help you figure out what actually fits.

We built Canopi because we think renting should start with a conversation, not a filter.

What it does
Canopi is an AI-powered rental discovery platform that gets to know you before it shows you anything.

Instead of asking you to set filters, our AI assistant - warm, curious, a little like talking to a friend who knows the city - asks you things like:

"What does a good Sunday morning look like for you?"
"Are you someone who recharges by going out, or by staying in?"
"What did you love most about where you grew up?"
From your answers, Canopi infers your lifestyle across 8 preference axes: walkability, nourishment, wellness, greenery, buzz, essentials, safety, and transit. A live radar chart updates in real time as the AI learns who you are. The map re-ranks listings to match - not your filters, your actual life.

Each listing is enriched with real neighborhood data: nearby cafés, parks, gyms, groceries, transit stops, pharmacies, and schools within 1 km. You can explore a selected neighborhood in a 3D diorama view built in Three.js, showing the vitality and density of life around a given address.

Canopi also supports voice input and output (via ElevenLabs), works in both English and French, and lets you save listings across sessions with a Supabase-backed account.

The data problem, and how we fought through it
This was the part that nearly broke us.

Getting real, structured rental data in Canada is much harder than it should be. The data that is publicly visible is fragmented, inconsistent, and often hard to reuse. For a small team trying to build something genuinely useful for renters, that became one of the biggest technical challenges of the project.

We started by scraping RentFaster listings and saved HTML snapshots, then fought through inconsistent formats, missing fields, duplicate records, and descriptions that ranged from clean and structured to completely freeform. Important details like unit type, amenities, availability, and even address quality were often irregular, which made the raw data hard to use directly.

So we built a custom scraping and enrichment pipeline. We merged and deduplicated listings, normalized inconsistent fields, geocoded addresses, and enriched each property with nearby amenity context like groceries, parks, restaurants, cafes, schools, pharmacies, and transit. We cached that enrichment layer locally so we could iterate quickly without repeatedly hitting external services.

Once the data was clean enough to trust, Gemini became the reasoning layer, not the extraction layer. It used the structured listing and neighborhood data to infer renter preferences from conversation and recommend homes that fit someone’s lifestyle, not just their price range.

The result was a dataset of 200+ real listings, each carrying enough property and neighborhood context for Canopi to make recommendations with real specificity.
How we built it
Layer	Technology
Framework	Next.js 16 (App Router), React 19, TypeScript
Backend Infrastructure	Vultr Cloud Compute (Toronto)
AI	Google Gemini 2.5 Flash (structured JSON output)
Map	Mapbox GL 3
3D	Three.js, @react-three/fiber, @react-three/drei
Auth & DB	Supabase
Styling	Tailwind CSS 4, GSAP
Voice	ElevenLabs STT/TTS
Network Security	Tailscale
Amenity data	Overpass API (OpenStreetMap)
The AI layer is built entirely around structured JSON output from Gemini. Every response from the model returns both a natural language reply and a prefUpdate object - a partial update to the 8-axis preference vector. The frontend merges these updates incrementally, so the radar chart and listing rankings evolve fluidly as the conversation develops. The model is prompted to read between the lines, not just match keywords - "I grew up with a big backyard" maps to greenery: 85, even though the user never said the word "greenery."

Challenges
Data acquisition: Rental platforms in Canada are not built to be built on. We spent significant time working around hostile scraping environments and normalizing genuinely messy data before we could even start on the product.
Preference inference: Getting the AI to infer nuanced lifestyle preferences from casual conversation - without feeling like a questionnaire - required careful prompt engineering and a lot of iteration.
Real-time map ranking: Re-ranking 200+ listings smoothly on every preference update, without UI jank, took more work than we expected.
Infrastructure: We self-hosted our backend API and data pipeline on a Vultr Toronto cloud instance, keeping compute geographically close to our Canadian rental data.
Secure networking: We used Tailscale to privately connect our Vultr backend to our development environment, keeping the data API accessible only through authenticated devices on our tailnet.
3D neighborhood view: Building an intuitive Three.js diorama that communicates neighborhood vitality at a glance was a fun but genuinely hard design problem.
Accomplishments we're proud of
A conversational UX that actually feels like a conversation, not a form
A fully working AI-to-map feedback loop: talk to the assistant, watch the map change
Getting real, enriched Canadian rental data into the product despite the ecosystem being stacked against us
Shipping voice input/output and French language support on top of everything else
The 3D diorama - it just looks cool
What we learned
That the rental market in Canada has a data problem that goes deeper than technology. The information renters need to make good decisions exists; it's just locked up. We learned how to fight through that, and we learned how much better the experience could be if it weren't that way.

We also learned that the best way to understand what someone wants in a home isn't to ask them what they want in a home.

What's next
Expand listing coverage to more Canadian cities: Vancouver, Calgary, Ottawa, Montreal
Deeper neighborhood data: commute times, noise levels, walkability scores
Listing alerts: "Tell me when something that fits me shows up"
Roommate matching: find people with compatible lifestyle profiles, not just overlapping budgets
Partnerships with property managers and landlords to get clean, first-party data - so we're not fighting scrapers forever
Built by
Ryan Wang, Ryan Li, Bryan Zhu, Jerry Liu

Built With
elevenlabs
gemini-2.5-flash
google-gemini
gsap
mapbox-gl
next.js
node.js
openstreetmap
overpass-api
postgresql
react
react-three-fiber
supabase
tailscale
tailwind-css
three.js
typescript
vercel
vultr
webgl
Try it out
 hack-canada.vercel.app
 GitHub Repo
 155.138.128.99
Edit project
Submitted to
image
Hack Canada 2026

Created by
i made tethers and deployed

Bryan Zhu
Bryan Zhu 
i rote enlish

Ryan Li
Ryan Li 
i created the 3d render

edit
Ryan Wang
Ryan Wang 
Jerry Liu
Jerry Liu 
+ add team members

 Report inappropriate content
 Hide project from my portfolio
 Liked 5 5 people like this: 
Ryan Li
Bryan Zhu
Ekam Kooner
Ryan Wang
Jerry Liu
Updates
Ryan Wang
Post an update about Canopi
Keep a log of how Canopi has evolved. Post about new features, app store releases, screenshots, or even code snippets. Your followers will see your updates in their feeds and can comment on them.

Use markdown for formatting.
 Turn on notifications
Bryan Zhu
Bryan Zhu started this project — 2 days ago

Leave feedback in the comments!

Ryan Wang
Write a comment
Devpost
About
Careers
Contact
Help
Hackathons
Browse hackathons
Explore projects
Host a hackathon
Hackathon guides
Portfolio
Your projects
Your hackathons
Settings
Connect
 Twitter
 Discord
 Facebook
 LinkedIn
© 2026 Devpost, Inc. All rights reserved.
Community guidelines
Security
CA notice
Privacy policy
Terms of service
