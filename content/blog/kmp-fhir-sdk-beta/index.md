---
title: "One Codebase, Three Platforms: The KMP FHIR SDK Enters Beta"
date: 2026-11-26
author: "the OHS-SF team"
category: "Releases"
badge: "FHIR Foundations"
summary: >-
  The Kotlin Multiplatform FHIR SDK is now in Beta. Digital health teams can build offline-first, FHIR-native apps once in Kotlin and ship across iOS, Android, and Web via WebAssembly.
cover: cover.jpg
coverAlt: "One Codebase, Three Platforms: Shared Kotlin Multiplatform FHIR Foundations libraries (kotlin-fhir, kotlin-fhirpath, kotlin-fhir-engine, kotlin-fhir-data-capture) running across iOS, Android, and WebAssembly."
cardImage: card.jpg
shortTitle: "The KMP FHIR SDK enters Beta"
announce: "New release: the KMP FHIR SDK enters Beta"
readMore: "Read the release post"
draft: true
---

In [*The “FHIR Tax” Is Shrinking*](/blog/fhir-standards-tax.html), we showed how Open Health Stack libraries and Agent Skills dramatically lower the cost of building standards-based healthcare apps. Yet most digital health teams still pay a second tax: rebuilding the exact same FHIR data models, clinical form logic, and offline sync rules separately for Android, iOS, and the web.

Today, the **Kotlin Multiplatform (KMP) FHIR SDK enters Beta**. Developers can write their core FHIR application logic, data capture forms, and offline persistence once in shared Kotlin and ship natively across **iOS, Android, and Web (via WebAssembly)**, bringing next-generation, vendor-neutral developer tooling to open health systems.

## Next-Gen Tooling for Real-World Health Systems {kicker="Why multiplatform matters"}

Real health programs rarely live on a single screen size. A community health worker captures antenatal visits on an offline Android tablet in the field, a visiting supervisor or specialist reviews cases on iOS, and clinic staff work from a desktop browser at a facility. Historically, teams faced an uncomfortable tradeoff: maintain separate native stacks that drift out of sync clinically, or fall back to online-only web wrappers that break when connectivity drops.

Kotlin Multiplatform removes that tradeoff without sacrificing offline reliability. Combined with [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) and Room 3 for KMP, your shared `commonMain` code compiles down to native Android and iOS binaries and runs directly in modern browsers using **Kotlin/Wasm (`wasmJs`)**. Even on-device storage carries across all three: in the browser, the SDK runs SQLite inside a WebAssembly Web Worker backed by the Origin Private File System (OPFS), so your app queries and queues patient records offline using the exact same Kotlin APIs it uses on mobile.

{{< video src="kmp-multiplatform-demo.mp4" poster="kmp-multiplatform-poster.jpg" autoplay="true" loop="true" caption="One shared `commonMain` Kotlin codebase running an Antenatal Care (ANC) register across iOS (`iosArm64`), Android, and Web (`wasmJs` with OPFS SQLite): typed search, live FHIRPath clinical alerts, offline Bundle extraction, and two-phase FHIR R4 sync." >}}

## Inside the Stack: The FHIR Foundations Libraries {kicker="Pillar 01 · FHIR Foundations"}

The KMP FHIR SDK evolved from the original [Android FHIR SDK](https://github.com/ohs-foundation/android-fhir) into modular, unbundled building blocks under the [FHIR Foundations](https://docs.ohs.foundation/fhir-foundations/) pillar, published to Maven Central under `dev.ohs.fhir`:

- **[Kotlin FHIR (`fhir-model`)](https://github.com/ohs-foundation/kotlin-fhir):** Now at `v1.0.0`, this is a lean, code-generated implementation of the HL7 FHIR data model (`R4`, `R4B`, and `R5`) backed by `kotlinx.serialization`. It strips away XML, Turtle, and logging bloat so mobile apps, browser bundles, and backend services can share identical immutable Kotlin classes.
- **[Kotlin FHIRPath (`fhir-path`)](https://github.com/ohs-foundation/kotlin-fhirpath):** A strict, ANTLR-based FHIRPath v3.0.0 expression evaluator with UCUM clinical unit support, tested against the official HL7 conformance suite. It powers both search-parameter indexing and dynamic form logic.
- **[Kotlin FHIR Engine (`fhir-engine`)](https://github.com/ohs-foundation/kotlin-fhir-engine):** The offline-first storage and sync layer for FHIR R4. Built on Room for Kotlin Multiplatform, it stores resources in SQLite (or browser OPFS), indexes typed search queries via `kotlin-fhirpath`, records offline edits in a `LocalChange` log, and runs two-phase sync (`FhirSyncTask`) with pluggable conflict resolution.
- **[Kotlin FHIR Data Capture (`fhir-data-capture`)](https://github.com/ohs-foundation/kotlin-fhir-data-capture):** A Compose Multiplatform Structured Data Capture (SDC) engine that turns FHIR R4 `Questionnaire` JSON into Material 3 forms across mobile, desktop, and web, complete with `enableWhen` skip logic, calculated expressions, validation, custom widgets, and `TemplateExtractionEngine` transaction Bundle output.

Around those four core client libraries, the wider FHIR Foundations pillar rounds out the end-to-end stack. **[Kotlin FHIR Knowledge](https://github.com/ohs-foundation/kotlin-fhir-knowledge)** and **[Kotlin FHIR Workflow](https://github.com/ohs-foundation/kotlin-fhir-workflow)** bring canonical FHIR NPM package indexing and `PlanDefinition/$apply` clinical workflows to KMP, while server-side **[FHIR Info Gateway](https://github.com/ohs-foundation/fhir-gateway)** and **[FHIR Data Pipes](https://github.com/ohs-foundation/fhir-data-pipes)** handle OIDC access control and SQL-on-FHIR analytics.

| Target Platform | Gradle Target | Model &amp; FHIRPath | Engine (SQLite + Sync) | Data Capture (SDC UI) |
| :--- | :--- | :--- | :--- | :--- |
| **Android** | `android` | ✓ | ✓ (Room + WorkManager) | ✓ (Compose M3) |
| **iOS** (`iosArm64`, Apple Silicon Sim) | `iosArm64` / `iosSimulatorArm64` | ✓ | ✓ (Room KMP + `BGTaskScheduler`) | ✓ (Compose Multiplatform) |
| **Web (Wasm &amp; JS)** | `wasmJs` / `js` | ✓ | ✓ (SQLite Wasm Worker + OPFS) | ✓ (Compose for Web) |
| **JVM (Desktop &amp; Server)** | `jvm` | ✓ | ✓ (SQLite + Foreground Sync) | ✓ (Compose Desktop) |

*(See the full [Platform Support matrix](https://docs.ohs.foundation/fhir-foundations/platform-support/) for `iosX64`, `wasmWasi`, macOS, and Linux coverage.)*

{{< callout >}}
**What goes in `shared/commonMain` vs. platform shells:**

In our [FHIR Engine codelab](https://docs.ohs.foundation/tutorials-and-codelabs/engine/) and [Data Capture codelab](https://docs.ohs.foundation/tutorials-and-codelabs/data-capture/), platform folders (`androidApp`, `iosApp`, `webApp`) contain only thin startup hooks (providing Android `Context`, iOS `MainViewController`, or web server headers). Everything else lives once in `shared/commonMain`:
- FHIR engine initialization and `DownloadWorkManager` sync policies
- Type-safe patient search (`fhirEngine.search<Patient>`) and local CRUD updates
- `Questionnaire(...)` form rendering, FHIRPath validation, and `TemplateExtractionEngine` Bundle extraction

**Result: one clinical codebase, native UX on phones, and an install-free Wasm client in the browser.**
{{< /callout >}}

## What Beta Means for Builders (and AI Coding Agents)

Calling this milestone **Beta** reflects real-world deployment readiness paired with honest engineering boundaries. Teams such as Ona are already migrating production ecosystems like OpenSRP toward KMP, and every core workflow (rendering SDC forms, validating answers, persisting R4 resources offline, and syncing Bundles) runs end-to-end across Android, iOS, desktop, and Wasm today. At the same time, builders adopting the Beta should plan around three practical details:

- **Pin lockstep library versions:** While `kotlin-fhir` reached `v1.0.0`, `kotlin-fhir-engine` and `kotlin-fhir-data-capture` are still pre-2.0 (`2.0.0-alpha05`), and both target **FHIR R4**. Align versions across the stack rather than mixing releases ([Versions &amp; compatibility](https://docs.ohs.foundation/fhir-foundations/versions/)).
- **WebAssembly headers and worker setup:** Browser OPFS SQLite relies on `SharedArrayBuffer`, which requires serving `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` headers plus copying the small `sqlite-wasm-worker` module documented in [Run the engine in the browser](https://docs.ohs.foundation/fhir-foundations/kotlin-fhir-engine/web-targets/).
- **Platform-aware scheduling and encryption:** `WorkManager` background sync and SQLCipher encryption remain Android-specific today; iOS uses `BGTaskScheduler`, and browser targets schedule foreground sync loops while the tab is open.

Even with those Beta edges, the architectural payoff is immediate, especially when paired with AI coding agents. Just as we observed in [our FHIR Tax benchmark](/blog/fhir-standards-tax.html), giving developers and coding agents strongly typed `commonMain` APIs, declarative FHIR `Questionnaire`s, and server-side validation means a single agent prompt and a single test loop now produce working healthcare software across three platforms simultaneously.

## From Libraries to Reference Stack: Powering OHS Player {kicker="Pillar 02 · Reference Toolkit"}

Unbundled SDKs are only half the story. Under Pillar 02 of the foundation, the KMP FHIR SDK directly powers **[OHS Player](https://docs.ohs.foundation/ohs-player/)**, our open-source Reference Toolkit for assembling complete digital health systems.

Inside OHS Player's multiplatform [Reference Client App](https://github.com/ohs-foundation/player-reference) (`player-reference`), `kotlin-fhir`, `kotlin-fhirpath`, `kotlin-fhir-engine`, and `kotlin-fhir-data-capture` connect through **[`player-client`](https://github.com/ohs-foundation/player-client)**, a configuration-driven UI library that projects local FHIR search results via SQL-on-FHIR `ViewDefinition`s into Compose Multiplatform screens. From there, clients authenticate over OpenID Connect (Keycloak) and sync through **FHIR Info Gateway** to an un-forked HAPI FHIR server, paired out of the box with a Web Admin Portal and SQL-on-FHIR analytics dashboards ([explore the architecture](https://docs.ohs.foundation/ohs-player/architecture/)).

That gives builders two clean entry points: import the individual `dev.ohs.fhir` libraries into an existing KMP or mobile application, or fork OHS Player as a full-stack reference starting point across mobile, web, backend, and analytics.

## Try the Beta and Get Involved

{{< closer >}}
Ready to build once and run across Android, iOS, and WebAssembly? Start with the [FHIR Foundations overview](https://docs.ohs.foundation/fhir-foundations/), walk through the hands-on [FHIR Engine](https://docs.ohs.foundation/tutorials-and-codelabs/engine/) and [Data Capture](https://docs.ohs.foundation/tutorials-and-codelabs/data-capture/) codelabs, explore the [KMP FHIR SDK repositories](https://github.com/orgs/ohs-foundation/repositories?q=topic:kmp-fhir-sdk), or see the stack assembled end-to-end in [OHS Player](https://docs.ohs.foundation/ohs-player/).

**👉 [Join the OHS Software Foundation community on Discord, GitHub, and our calls](/community.html)**
{{< /closer >}}
