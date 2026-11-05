---
title: "The “FHIR Tax” Is Shrinking"
date: 2026-10-20
author:
  - fikri-milano
  - jing-tang
category: "OHS Labs"
summary: "We had AI coding agents build the same offline-first antenatal care app four ways. Combining AI coding agents with Open Health Stack libraries and Agent Skills significantly reduces the “FHIR tax” — building a fully working offline-first FHIR app for under $1."
cover: cover.jpg
coverAlt: "The “FHIR Tax” Is Shrinking: A visual trend chart shows the cost and complexity of implementing FHIR plunging down toward the custom stack baseline when AI coding agents use Open Health Stack libraries and Agent Skills."
cardImage: card.jpg       # narrower 4:3 picture for the blog page's featured card
shortTitle: "The “FHIR Tax” is shrinking"
readMore: "Read the experiment"
draft: false
---

For years, digital health projects skipped open standards like [HL7 FHIR](https://fhir.org/) because implementation was complex and time-consuming. Instead, teams built custom data models, resulting in fragmented, siloed data and ultimately hampering interoperability efforts. When we launched Open Health Stack (OHS) in 2023, our goal was to lower the barriers to working with FHIR, and to make it the obvious choice for digital health developers. Today, we show that combining AI coding agents with the OHS libraries and Agent Skills has significantly reduced the “FHIR tax” for developers.

## The Experiment: Building the Same Digital Health App Four Ways

Recently, [Health Samurai](https://www.health-samurai.io/articles/fhir-as-a-framework-for-agentic-coding) showed qualitatively that FHIR could act as the ready-made “rails” for AI coding agents. Inspired by this work, and to demonstrate it more empirically, we built an [automated test harness](https://github.com/ohs-foundation/ohs-labs/tree/main/ohs-agent-experiment) to evaluate AI coding agents' ability to build an offline-first Android Antenatal Care (ANC) register from a prompt. A successfully built app (e.g., [here](https://raw.githubusercontent.com/ohs-foundation/ohs-labs/main/ohs-agent-experiment/runs/s1-ohs-skills-gemini-3.8-flash-medium-15/launch.png)) had to list patients, show their visit history, record new visits, retain data after a restart, and demonstrate 2-way sync with a FHIR server.

**We compared four ways of building it:**

1. **No FHIR:** The agent received a [blank Android project](https://github.com/ohs-foundation/ohs-labs/tree/main/ohs-agent-experiment/harness/template-src/cold) and was free to design the data model and store data any way it saw fit. This was used as the baseline for the costs of not using FHIR (though there are limitations here, as no back-end was developed).
2. **FHIR only:** The agent received a [blank Android project](https://github.com/ohs-foundation/ohs-labs/tree/main/ohs-agent-experiment/harness/template-src/fhir) and the same local HAPI FHIR server, but no OHS libraries. It was free to use any library to work with FHIR.
3. **FHIR + OHS Libraries:** The [project](https://github.com/ohs-foundation/ohs-labs/tree/main/ohs-agent-experiment/harness/template-src/ohs) came with three [Open Health Stack](https://ohs.foundation) Kotlin Multiplatform libraries: [Kotlin FHIR Models](https://github.com/ohs-foundation/kotlin-fhir), [Kotlin FHIR Engine](https://github.com/ohs-foundation/kotlin-fhir-engine), and [Kotlin FHIR Data Capture](https://github.com/ohs-foundation/kotlin-fhir-data-capture) (FHIR Models, FHIR Engine, and Data Capture, respectively). It also came with a local HAPI FHIR server and no extra documentation for the agent.
4. **FHIR + OHS Libraries + Skills:** The same OHS setup plus three short [Agent Skills (SKILL.md)](https://github.com/ohs-foundation/ohs-labs/tree/main/ohs-agent-experiment/skills). A skill is a Markdown file with additional instructions for using the libraries that the agent reads while it works.

We ran each condition twice on six models (in order of our tests). Anthropic’s Claude Haiku 5.5, Sonnet 5.5, Opus 5.5, and Fable 5.1 ran in Claude Code, and Gemini 3.8 Flash and Gemini 4 Argon ran in the Antigravity CLI, all at medium reasoning effort. Every run was headless, with no human input. Costs are at API prices at the time of the runs.

**👉 [Explore the GitHub Repository: ohs-foundation/labs-ohs-agent](https://github.com/ohs-foundation/labs-ohs-agent)**

We tested every app on an Android emulator and scored it against a set of criteria (see box), with each criterion worth 1 point, for an objective score out of 10.

{{< callout >}}
**10-point evaluation criteria (1 point each):**
- Lists the patients
- Shows a patient's past visits
- Uses the clinic's visit form
- Saves a new visit
- Keeps the visit after a restart
- Sends data the server accepts as valid FHIR
- Saves a visit with no network
- Uploads it by itself once the network is back
- Still opens offline
- Still uploads it after the app is closed
{{< /callout >}}

## A Fully Working FHIR App for under $1

With skills, every OHS app was fully working and cost an average of $0.50 (50 cents) more to build than the zero-shot custom app (which didn’t work as a fully functioning app anyway). ✅ indicates a fully working app that passes all 10 checks. All the models below are running on medium level reasoning effort. 

| Model | No FHIR | FHIR without OHS | OHS only | OHS + Skills |
| :--- | :--- | :--- | :--- | :--- |
| **Claude Sonnet 5.5** | $0.24, 1.5 min, 4/10 | $0.72, 6.0 min, 6/10 | $0.78, 5.9 min, 6/10 | ✅ $0.54, 3.2 min, 10/10 |
| **Gemini 4 Argon** | $0.63, 8.7 min, 4/10 | $0.44, 6.3 min, 6/10 | $4.05, 23.3 min, 8/10 | ✅ $0.80, 8.9 min^, 10/10 |
| **Claude Opus 5.5** | $0.70, 4.1 min, 4/10 | $1.08, 4.7 min, 6/10 | $2.65, 7.8 min, 8/10 | ✅ $1.17, 4.7 min, 10/10 |
| **Gemini 3.8 Flash** | $0.84, 4.6 min, 4/10 | $1.08, 15.6 min, 5/10 | $3.48, 16.4 min, 8/10 | ✅ $1.22, 13.5 min^, 10/10 |
| **Claude Fable 5.1** | $1.53, 3.9 min, 4/10 | $2.56, 9.6 min, 6/10 | $7.48, 17.8 min, 8/10 | ✅ $2.73, 5.2 min, 10/10 |

Cost and time per build were the average of two runs and based on current token pricing. [Full results here](https://github.com/ohs-foundation/ohs-labs/blob/main/ohs-agent-experiment/results/app-scores.md).

*^Gemini 3.8 Flash's builds with skills took longer mainly because of waiting for responses from the Gemini API. Its token use and tool actions were about the same as in earlier builds that finished in around 6.5 minutes. Claude Haiku 5.5 is not shown because it never built a FHIR app that works offline, even with skills.*

## Three Key Takeaways

### 1. The “FHIR Tax” is negligible
Across the models that scored 10/10 building with skills cost on average 50 cents ($0.17 to $1.20) more than a custom (non-functional) app. For that additional cost, we were able to develop a working offline-capable FHIR-based app that stores visits on the device, syncs them with a FHIR server, and renders the clinic's standard visit form (defined in FHIR Questionnaires).

### 2. FHIR server validation provides an automated feedback loop
In the OHS runs, a local HAPI FHIR server checks every incoming resource against the standard FHIR profiles. When an agent sent something invalid, the server rejected it with an OperationOutcome error explaining why, and the agent could read that error and fix its code without anyone stepping in. This shows the value of a toolchain that validates the agent's work and explains what is wrong in a form the agent can act on.

### 3. Libraries and skills work best together
Agent Skills made the biggest difference. Without them, the AI agents spent about 11 actions per build digging through the libraries' compiled code to work out how to use them. With these plain-language custom skills.md files, that fell to about 2, and the total work per build was roughly halved. Because they're based on the open [Agent Skills specification](https://agentskills.io/home), the same skills can be used across models and harnesses.

## What are the implications of this?
The cost of implementing standards has long been a hurdle to adoption of FHIR. When budgets are tight, and projects are measured by time to delivery, many see the learning curve as too steep. This pragmatic approach, whilst understandable, tends to kick conversations about interoperability down the road. In this experiment, we have shown that the combination of OHS tooling + skills + AI coding agents changes the math. **For digital health projects, it no longer makes sense not to choose the standards-based approach.**

Looking ahead, what matters more for developers and product owners is a deeper understanding of the FHIR standard, specifically the *“why”*, not just the *“how”*. For example, using FHIR profiles appropriately to cater for context specific use cases, defining extensions for custom data needs without breaking compatibility, grounding data in terminologies for true semantic interoperability, and deploying implementation guides for complex workflows and clinical quality metrics. These are high-value, durable skills that are key for organizations and countries alike that want to build and implement truly interoperable systems.

What's more, when the cost of building FHIR-compliant apps is lowered, the bottleneck shifts from the initial build to rigorous testing and quality control. Teams must be extra vigilant in verifying data mappings, stress-testing edge cases, and ensuring clinical safety. With fast, safe, high-quality apps more readily available, the truly creative solutions will begin to shine.

## Closing thoughts
When we set out to build Open Health Stack, we wanted to reduce the complexity of building with FHIR. Whilst it would be nice to claim *“mission accomplished”*, we are not quite there yet. For us, this work provides an empirical signal that combining open data standards (HL7 FHIR) and open technologies (OHS Libraries and Agent Skills) with AI models and coding harnesses significantly shrinks the economic and time barriers to building FHIR-based digital health solutions.

## Get Involved

{{< closer >}}
This experiment, along with the OHS Libraries, Reference Toolkit, and AI Commons projects, is open-sourced, and we invite anyone interested to try it out and get involved with the community!

**👉 [Learn more about OHS Software Foundation and get involved](/community.html)**
{{< /closer >}}
