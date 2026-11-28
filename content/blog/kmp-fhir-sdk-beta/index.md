---
title: "One Codebase, Every Platform: Bringing Cross-Platform FHIR Development to Global Digital Health"
date: 2026-11-26
author: "the OHS-SF team"
category: "Releases"
badge: "FHIR Foundations"
summary: >-
  Open Health Stack is building a Kotlin Multiplatform FHIR SDK so global digital health developers can write offline-first FHIR apps once and run them across Android, iOS, desktop, and web, with core libraries at v1.0 and Beta and client SDKs targeting Q1 2027 Beta.
cover: cover.jpg
coverAlt: "One Codebase, Every Platform: Shared Kotlin Multiplatform FHIR Foundations libraries (kotlin-fhir, kotlin-fhirpath, kotlin-fhir-engine, kotlin-fhir-data-capture) running across Android, iOS, Desktop, and WebAssembly."
cardImage: card.jpg
shortTitle: "One codebase, every platform"
announce: "KMP FHIR SDK: cross-platform FHIR development for global digital health"
readMore: "Read the post"
draft: true
---

In [*The “FHIR Tax” Is Shrinking*](/blog/fhir-standards-tax.html), we showed how Open Health Stack's Kotlin Multiplatform libraries and Agent Skills lower the cost of building standards-based healthcare apps on Android. Even once FHIR itself stops being the bottleneck, digital health teams still hit a second source of friction: rebuilding patient data models, clinical form logic, and offline sync separately across Android, iOS, desktop, and the web.

We are building a Kotlin Multiplatform (KMP) FHIR SDK to remove that duplication for global digital health teams. With shared Kotlin code, teams can write their FHIR data handling, clinical questionnaires, and offline storage once and ship across Android, iOS, desktop, and modern web browsers via WebAssembly. Core foundation libraries have already reached v1.0 and Beta, signaling overall readiness for the SDK to enter a Beta phase even as the higher-level client libraries complete work toward their own Beta releases in Q1 2027.

## Supporting every device in a health program {kicker="Why multiplatform matters"}

Health programs rarely run on a single type of device. A community health worker records antenatal visits on an offline Android phone in the field, a supervisor reviews cases on a tablet, doctors want to use an iPhone or iPad, and clinic staff manage registers from a desktop app or browser. Until now, teams have had to pick between two bad options: maintain separate apps whose clinical logic drifts apart over time, or build online-only web apps that stop working when the network drops.

Kotlin Multiplatform lets teams avoid that choice while keeping offline support and open [HL7 FHIR](https://fhir.org/) standards intact. Paired with [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/), one codebase builds native Android and iOS apps, desktop JVM apps, and WebAssembly apps for modern browsers. Offline storage works in the browser, too: patient records stay on the device in local storage, so staff can search registers and save visits offline with the same logic that runs on phones and tablets.

Because every screen and local record uses standard FHIR data models, questionnaires, and sync APIs, clinical content stays reusable and data exchanges cleanly with other health systems.

{{< video src="kmp-multiplatform-demo.mp4" poster="kmp-multiplatform-poster.jpg" autoplay="true" loop="true" caption="Real screen-recorded demo built with the KMP FHIR SDK: one shared Antenatal Care app running across Android, iPhone, Mac, and Web with smart FHIR Questionnaire forms, PlanDefinition care plans, offline capture, FHIR server sync, 94% shared code, and an invitation to start building (unmute for soundtrack)." >}}

## Inside the stack: the FHIR Foundations libraries {kicker="Pillar 01 · FHIR Foundations"}

The KMP FHIR SDK grew out of the original [Android FHIR SDK](https://github.com/ohs-foundation/android-fhir) into modular libraries under the [FHIR Foundations](https://docs.ohs.foundation/fhir-foundations/) pillar and its [KMP FHIR SDK hub](https://docs.ohs.foundation/fhir-foundations/kmp-fhir-sdk/), published under `dev.ohs.fhir`. Teams can adopt individual libraries as needed or use the full stack together:

- **[Kotlin FHIR](https://github.com/ohs-foundation/kotlin-fhir) (`v1.0.0`):** Standard FHIR health data models in Kotlin (covering `R4`, `R4B`, and `R5`). Mobile apps, web apps, and backend services all work with the same patient, observation, and encounter structures.
- **[Kotlin FHIRPath](https://github.com/ohs-foundation/kotlin-fhirpath) (Beta):** A clinical rules and expression engine tested against the official HL7 test suite. It powers dynamic form checks, clinical alerts, search filtering, and complex clinical workflows across platforms.
- **[Kotlin FHIR Engine](https://github.com/ohs-foundation/kotlin-fhir-engine) (Targeting Q1 2027 Beta):** The offline-first storage and sync layer for FHIR R4. It saves patient records locally on the device or in the browser, supports local search, tracks offline edits, and automatically syncs changes with a FHIR server when connectivity returns.
- **[Kotlin FHIR Data Capture](https://github.com/ohs-foundation/kotlin-fhir-data-capture) (Targeting Q1 2027 Beta):** A cross-platform digital forms engine that turns standard FHIR questionnaires into accessible screens with skip logic, automatic calculations, input validation, and structured FHIR output.

Beyond those four client libraries, FHIR Foundations covers other parts of a health system. [Kotlin FHIR Knowledge](https://github.com/ohs-foundation/kotlin-fhir-knowledge) and [Kotlin FHIR Workflow](https://github.com/ohs-foundation/kotlin-fhir-workflow) bring clinical guideline packages and care-plan workflows to KMP. On the server side, [FHIR Info Gateway](https://github.com/ohs-foundation/fhir-gateway) manages secure access control, and [FHIR Data Pipes](https://github.com/ohs-foundation/fhir-data-pipes) powers population-level analytics.

| Platform | Shared Data Models &amp; Rules | Offline Storage &amp; Sync | Digital Forms (UI) |
| --- | --- | --- | --- |
| **Android** | ✓ | ✓ (On-device SQLite + background sync) | ✓ (Native Compose UI) |
| **iOS** | ✓ | ✓ (On-device SQLite + iOS background sync) | ✓ (Native Compose UI) |
| **Web Browser (Wasm &amp; JS)** | ✓ | ✓ (Local browser storage + sync) | ✓ (Browser UI via WebAssembly) |
| **Desktop &amp; Server (JVM)** | ✓ | ✓ (Local SQLite + sync) | ✓ (Desktop Compose UI) |

*(For specific target architectures and OS coverage, see the [Platform Support matrix](https://docs.ohs.foundation/fhir-foundations/platform-support/).)*

## What builders can expect today

Teams such as [Nawi](https://nawi.ke/) and [IntelliSOFT](https://www.intellisoftkenya.com/) are already building on KMP. Today, the core workflow (rendering clinical forms, validating answers, saving patient records offline, and syncing with a FHIR server) runs across Android, iOS, desktop, and web browsers.

Because the libraries sit at different stages as the SDK enters its Beta phase and Kotlin FHIR Engine and Data Capture finish work toward their Q1 2027 Beta releases, keep a few practical points in mind when testing early:

- **Library versions and compatibility:** Because libraries progress independently across v1.0, Beta, and pre-release milestones, check compatible dependency pairings while we finalize a unified versioning strategy across the SDK. See the [KMP FHIR SDK repositories on GitHub](https://github.com/orgs/ohs-foundation/repositories?q=topic:kmp-fhir-sdk) and the [Versions &amp; compatibility](https://docs.ohs.foundation/fhir-foundations/versions/) guide for tested combinations.
- **Web hosting and configuration:** Running offline storage in the browser requires specific hosting headers and web setup. See the [Kotlin FHIR Engine GitHub repository](https://github.com/ohs-foundation/kotlin-fhir-engine) and the [Run the engine in the browser](https://docs.ohs.foundation/fhir-foundations/kotlin-fhir-engine/web-targets/) guide for current configuration instructions.
- **Platform-specific background sync and encryption:** Background sync while an app is closed and on-device database encryption are most mature on Android. On iOS, sync runs via native background tasks, while web apps sync whenever the browser tab is active.

Teams can already build with the shared stack today, both directly and alongside AI coding agents. As we saw in [our FHIR Tax benchmark](/blog/fhir-standards-tax.html), a single strongly typed set of FHIR APIs and declarative forms lets developers and coding agents build and test a clinical workflow once and ship it across platforms together.

## Upgrading from the Android FHIR SDK

Teams already running apps on the [Android FHIR SDK](https://github.com/ohs-foundation/android-fhir) do not start over on clinical content. Because both stacks build directly on open [HL7 FHIR](https://fhir.org/) standards, portability comes from FHIR itself: R4 data models, `Questionnaire` resources, Structured Data Capture (SDC) rules, FHIRPath expressions, and clinical workflows carry across stacks.

On the application side, migrating an existing app involves updating Gradle coordinates and package imports from the legacy Android FHIR SDK to the `dev.ohs.fhir` Maven Central modules, and integrating each project's platform entry points. To make that transition smoother, we designed the KMP libraries to follow the existing Android FHIR SDK API patterns, ensured local database migration works automatically, and kept the Structured Data Capture UI consistent in Compose Multiplatform. At the same time, migrating is not guaranteed to be automatic for every codebase: these KMP libraries were inspired by the Android FHIR SDK, yet they are a ground-up multiplatform rewrite, so exact migration effort varies by project.

## From libraries to reference stack: powering OHS Player {kicker="Pillar 02 · Reference Toolkit"}

The KMP FHIR SDK also powers [OHS Player](https://docs.ohs.foundation/ohs-player/), our open-source Reference Toolkit under Pillar 02 for assembling complete digital health systems.

Inside OHS Player's cross-platform [Reference Client App](https://github.com/ohs-foundation/player-reference), the KMP libraries connect through [`player-client`](https://github.com/ohs-foundation/player-client) so teams can configure patient lists and clinical screens from FHIR definitions instead of hardcoding every view. The app authenticates via standard OpenID Connect (Keycloak) and communicates through FHIR Info Gateway to an unmodified HAPI FHIR server, paired with an admin portal and analytics dashboards ([explore the architecture](https://docs.ohs.foundation/ohs-player/architecture/)).

Programs have two ways to start: add individual `dev.ohs.fhir` libraries to an existing app, or build from OHS Player as a full reference system covering mobile, web, backend, and reporting.

{{< callout >}}
**Developers: try the hands-on codelabs**

To test the KMP libraries in code, start with our codelabs on [docs.ohs.foundation](https://docs.ohs.foundation/tutorials-and-codelabs/):
- **[Manage FHIR Resources (Kotlin FHIR Engine Codelab)](https://docs.ohs.foundation/tutorials-and-codelabs/engine/):** Set up a local FHIR server, sync patient records, search, and save offline edits in a Kotlin Multiplatform app.
- **[Capture and Process Health Data (Kotlin FHIR Data Capture Codelab)](https://docs.ohs.foundation/tutorials-and-codelabs/data-capture/):** Render a FHIR Questionnaire, capture responses, and extract structured FHIR resources.
{{< /callout >}}

## Help us test ahead of Q1 2027

Through Q1 2027, we are finishing stability work, documentation, and cross-platform testing for Kotlin FHIR Engine and Data Capture ahead of their Beta releases. If you build or maintain digital health software, try the libraries and codelabs on your own workflows across Android, iOS, desktop, and WebAssembly, and report edge cases or feedback to the community.

Read the [KMP FHIR SDK overview](https://docs.ohs.foundation/fhir-foundations/kmp-fhir-sdk/), browse the [FHIR Foundations docs](https://docs.ohs.foundation/fhir-foundations/), walk through the [Tutorials and Codelabs](https://docs.ohs.foundation/tutorials-and-codelabs/), explore the [KMP FHIR SDK repositories](https://github.com/orgs/ohs-foundation/repositories?q=topic:kmp-fhir-sdk), or check out [OHS Player](https://docs.ohs.foundation/ohs-player/).

{{< closer >}}
**[Join the OHS Software Foundation community on Discord, GitHub, and our calls](/community.html)**
{{< /closer >}}
