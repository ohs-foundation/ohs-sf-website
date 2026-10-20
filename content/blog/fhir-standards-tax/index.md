---
title: "The Standards Tax Is Shrinking: What Happens When Building on FHIR Costs 62 Cents?"
date: 2026-10-20
author: "the OHS-SF team"
category: "Research"
summary: "We had AI coding agents build the same offline-first antenatal care app three ways. Building on FHIR and Open Health Stack cost just 62 cents more than a quick-and-dirty custom stack, and produced an app whose data isn't trapped on the device."
cover: cover.jpg
coverAlt: "62 cents: the extra AI cost of building an offline-first app on FHIR and Open Health Stack. A bar chart compares the cost to build the same app: custom stack $0.84, Open Health Stack with skills $1.46, Open Health Stack libraries only $3.48."
cardImage: card.jpg       # narrower 4:3 picture for the blog page's featured card
shortTitle: "The standards tax is shrinking"
readMore: "Read the experiment"
draft: false
---

**For decades, digital health projects have skipped open data standards for an understandable reason: doing things "properly" is hard, takes too much time and money.**

Health data standards like HL7 FHIR are notoriously complex. Implementing them requires specialized domain knowledge: navigating extensive specifications, mapping clinical concepts, building custom schema validators, and engineering resilient, offline-first synchronization engines. In global health and early-stage healthtech — where teams operate on shoe-string budgets and relentless delivery deadlines — building bespoke database tables and proprietary REST APIs has often been the pragmatic choice.

The predictable consequence is what our sector has long called **"pilotitis"**: thousands of working digital tools deployed across health systems whose data remains trapped in local silos, dying whenever the app, device, or vendor contract is retired.

Recently, [Health Samurai](https://www.health-samurai.io/) suggested that AI coding agents might break this cycle. Their hypothesis: **FHIR provides ready-made "rails" for agentic coding.** A standardized clinical data model and strict server-side validation constrain what an agent can produce, preventing the hallucinations, schema drift, and architectural decay typical of unconstrained coding sessions.

Their early evidence was qualitative, drawn from rebuilding an internal Personal Health Record twice with Claude Code. We wanted to put hard empirical numbers to this idea in a real-world, frontline mobile health context. And the results are pretty interesting. Read on.

## The Experiment: Building the Same Digital Health App Three Ways

We built a fully automated test harness and tasked autonomous AI coding agents with building a pretty simple offline-first Android Antenatal Care (ANC) register from scratch.

The requirements mirrored common clinical use cases:

- **Register Screen:** Display a list of pregnant patients sorted by estimated due date, showing name, age, and current gestational age.
- **Patient Detail Screen:** Historical ANC visits with recorded vitals (blood pressure, weight, hemoglobin).
- **New Visit Form:** Capture visit date, gestational age, vitals, danger signs, and clinical notes.
- **Persistence & Synchronization:** Save records locally so the app functions seamlessly without internet connectivity, survive app restarts, and bidirectionally sync data with a central server once online.

We evaluated this build across three distinct conditions:

1. **Condition 1: Cold (Unconstrained):** The agent received a blank Android project and was free to design the data model and storage mechanism any way it saw fit.
2. **Condition 2: Open Health Stack (OHS):** The project came pre-configured with [Open Health Stack](/projects.html) Kotlin Multiplatform (KMP) libraries (Kotlin FHIR Models, Kotlin FHIR Engine, and Kotlin FHIR Data Capture) alongside a local HAPI FHIR server, but with *no* extra agent documentation.
3. **Condition 3: OHS + Skills:** The exact same OHS setup, accompanied by three concise markdown reference documents ("skills") detailing how the libraries work, their primary API entry points, and common integration traps.

The harness was tested across multiple frontier models, including **Gemini 3.8 Flash** driving the Antigravity CLI and Anthropic's Claude suite (**Haiku 5.5, Sonnet 5.5, Opus 5.5, Fable 5.1**) driving Claude Code. All runs used medium reasoning effort and operated completely headlessly: the agent received the prompt once, terminal commands were executed automatically, and no human touched the keyboard until the build completed.

## What the Benchmark Showed

Here are the results for **Gemini 3.8 Flash** running in the Antigravity CLI (averaged across two runs per condition):

| Metric | Cold (Custom Stack) | OHS (Libraries Only) | OHS + Skills (Libraries + Docs) |
|---|---|---|---|
| Working App | 2 of 2 | 2 of 2 | **2 of 2** |
| Total API Cost | $0.84 | $3.48 | **$1.46** |
| Time to Finish | 4.6 min | 16.4 min | **6.5 min** |
| Agent Tool Actions | 72 | 221 | **94** |
| Lines of Kotlin | ~2,130 | ~1,740 | **~1,600** |
| Server Rejections Self-Corrected | N/A (no server) | 3 | **4** |
| Underlying Data Architecture | Flat JSON file on device | Mixed custom & FHIR | **SQLite FHIR DB & background sync** |

## Three Key Takeaways

### 1. The "Standards Tax" was 62 cents and under 2 minutes

With basic markdown skills provided, generating an app that persists data to an offline-first FHIR database and syncs with a standard FHIR server cost **$1.46 and took 6.5 minutes**. Compared to the quick-and-dirty custom app ($0.84, 4.6 minutes), the premium for building on open standards was just **62 cents and 114 seconds**.

### 2. The custom app was an architectural dead end

The unconstrained "Cold" runs produced working user interfaces quickly, but they accomplished it by cutting every corner that matters in production healthcare. The agent simply overwrote a single flat JSON file on the device on every save. No other clinic system could ingest it, the data could never feed national reporting indicators, and if the device broke, the patient's longitudinal history vanished with it.

### 3. Server validation became an automated feedback loop

In the OHS runs, a local HAPI FHIR server actively validated incoming payloads against standard clinical resource profiles. When the agent generated an invalid structure or omitted a required code binding, the server rejected it with a structured `OperationOutcome` error. Rather than failing silently, the agent inspected the validation failure, fixed its Kotlin resource builders, and re-submitted until accepted — without any human intervention.

## Does the Result Hold Across Models?

Was 62 cents an isolated anomaly? We evaluated the exact same task across four Claude models using Claude Code:

| Model | Cold (Custom Stack) | OHS (Libraries Only) | OHS + Skills (Libraries + Docs) |
|---|---|---|---|
| Claude Haiku 5.5 | $0.05, 4.3 min | $0.16, 5.2 min | $0.20, 5.8 min |
| Claude Sonnet 5.5 | $0.24, 1.5 min | $0.78, 5.9 min | **$0.52, 3.5 min** |
| Claude Opus 5.5 | $0.70, 4.1 min | $2.65, 7.8 min | **$1.31, 4.3 min** |
| Claude Fable 5.1 | $1.53, 3.9 min | $7.48, 17.8 min | **$2.66, 6.1 min** |

The "Standards Tax" remained negligible across the board. On Sonnet, OHS with Skills cost just 28 cents more than Cold; on Opus, 61 cents more.

### What Changed: How Agents Used the Libraries

- **Opus and Fable used the libraries regardless of skills:** They leveraged FHIR Engine and Structured Data Capture (SDC) across every OHS run. Providing skills cut API consumption dramatically — from $2.65 to $1.31 on Opus, and from $7.48 to $2.66 on Fable.
- **Sonnet required skills to use FHIR Engine properly:** Without skills, it skipped local offline persistence and streamed data directly to the server. With skills provided, it properly wired FHIR Engine and offline sync, while build cost fell from $0.78 to $0.52.
- **Haiku never wired FHIR Engine:** Even with skills, Haiku sent data straight to HTTP endpoints, ignoring local offline caching. Its low price came at the cost of production readiness.

### Real-World Testing on the Emulator

To verify whether low cost translated to clinical utility, we tested all 24 generated apps in an Android emulator just as a nurse would: opening patients, recording visits, verifying persistence across app restarts, and checking server ingestion.

- **18 of the 24 apps passed full end-to-end verification.**
- **All six failures stemmed from the same shortcut:** bypassing local offline persistence in favor of direct HTTP calls to the server. Sonnet took this shortcut only when deprived of skills; Haiku took it every single time.

**Key Rule:** Skills keep the Standards Tax small for capable frontier models.

Smaller models take shortcuts, and skills alone cannot compensate for model reasoning limits.

## AI Alone Is Not Enough: The Case for Open Health Infrastructure

It is tempting to believe that AI coding agents mean developers can simply prompt complex digital health solutions into existence out of thin air. But frontline healthcare demands rigorous systems engineering:

- **True offline-first operation:** Health workers in rural or remote settings cannot afford app freezes when network connectivity drops.
- **Resilient background sync:** Merging clinical updates across intermittent networks without duplicating records or corrupting longitudinal histories.
- **Dynamic clinical data entry:** Rendering validated clinical questionnaires without hardcoding hundreds of bespoke form fields into UI screens.

AI agents cannot reliably invent that level of distributed systems plumbing during a single coding session. When the agent had libraries without architectural maps (Condition 2), it burned time and tokens inspecting raw JAR signatures and writing redundant HTTP boilerplate.

{{< callout >}}
The breakthrough is not "AI alone." It is the powerful intersection of:

Open Standards (FHIR) + Open Infrastructure (OHS) + AI Coding Agents (with Skills)
{{< /callout >}}

Open Health Stack libraries (FHIR Engine, Structured Data Capture, Kotlin FHIR Models) solve the deep, invisible plumbing problems once (and now across platforms). The AI agent, steered by lightweight skills, becomes the rapid assembler that connects those battle-tested components directly to the clinic's workflow.

## What Developers Should Actually Master

For years, digital health engineering teams treated FHIR compliance as an intimidating chore best outsourced to specialized consultancies. That made sense when implementing FHIR meant handwriting thousands of lines of serialization boilerplate, custom Room schemas, and sync workers.

When AI agents absorb that undifferentiated heavy lifting, the role of the health software engineer fundamentally shifts:

1. **You don't need a decade of FHIR specialization to build compliant software.** Small product teams no longer need to be paralyzed by the volume of glue code needed to stand up a standard-compliant app.
2. **Domain principles matter far more than framework syntax.** What engineers need to master are the core clinical concepts: how Encounters, Observations, and Conditions relate and link to create longitudinal patient histories; how Questionnaires standardize data capture; how terminologies and value sets prevent data degradation and promote interoperability.

Learning FHIR and Open Health Stack patterns is a high-leverage, durable investment. You provide clinical intent and architectural choices; the agent writes the glue.

## When the Plumbing Is Solved, What Matters Next?

When standing up a compliant, offline-first clinical application drops from months to minutes, engineering and clinical energy can finally refocus where it matters:

- **Frontline Clinical UX:** Spending time in clinics observing community health workers and nurses, eliminating tap fatigue, streamlining flows, and accommodating interruptions during patient visits.
- **Clinical Decision Support:** Focusing on genuine clinical bottlenecks, adherence to local protocols, and user adoption instead of debugging database locks.
- **Leveraging Interoperable Data:** Because data lands in standard FHIR stores from day one, it is immediately usable for longitudinal patient tracking, cohort analytics, and national health reporting.

## Limitations & Reality Check: An Early Experiment, Not a Solved Problem

It is vital to be clear about what this experiment is — and what it is not.

**This is an exploratory early result, not a solved engineering problem.**

Generating an initial Android register from a clean slate in an emulator is vastly simpler than operating a live clinical deployment. Real-world frontline health software presents challenges that our small harness did not test:

- **Longitudinal Schema Evolution:** How do coding agents navigate data migrations, schema evolution, and FHIR Implementation Guide (IG) upgrades over five-year deployment lifecycles?
- **Complex Clinical Logic:** How reliably do agents handle nested clinical decision support trees, complex triage protocols, and multi-facility referral chains?
- **Model Vulnerability & Shortcuts:** As our benchmark demonstrated, smaller models still take risky architectural shortcuts (like skipping offline caching entirely), and capable models require explicit architectural guardrails ("skills") to avoid catastrophic architectural failure.

This work is not declaring digital health software engineering "solved by AI." Rather, it provides an empirical directional signal: when given the right open infrastructure and clinical rails, the economic and time barriers to adopting open standards shrink by an order of magnitude.

## An Open Invitation to Build

This experiment evaluated a well-defined mobile digital health use case across multiple model sweeps and harness configurations. While two runs per condition illustrate strong directional patterns, many open questions remain. To accelerate research into agentic approaches for building standards-based apps, we have open-sourced the harness, task prompts, library skills, and raw execution transcripts in our repository:

👉 [Explore the GitHub Repository: ohs-foundation/ohs-labs](https://github.com/ohs-foundation/ohs-labs/blob/main/ohs-agent-experiment)

{{< closer >}}
Whether you are deploying solutions on Open Health Stack, implementing FHIR, or experimenting with AI coding agents, we invite you to inspect the harness, run sweeps against your own workflows, and join the conversation.
{{< /closer >}}
