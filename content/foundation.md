---
title: Foundation
description: "An independent, community-owned software foundation hosted by the Linux Foundation — mission, charter, governance and membership."
layout: foundation
pageStyle: foundation
navSection: foundation

# ─── Page content ──────────────────────────────────────────────────────────
# Text fields accept Markdown: **bold**, *italic*, [links](https://…).
# Icons: see WRITING.md → "Icons". Colours: core, toolkit, ai (or leave out).

hero:
  label: The next chapter
  heading: An independent, community-owned software foundation.
  lead: >-
    We're transitioning the current Open Health Stack from a Google-led project into an umbrella
    project at the Linux Foundation — creating a neutral home built to support the global health
    ecosystem it serves.

mission:
  label: The charter · North star
  heading: Catalyze sustainable, next-gen digital health solutions.
  text: >-
    The OHS-SF aims to accelerate "next-gen" digital health aligned with the "Full-STAC remedy"
    approach — co-authored by the WHO Digital Health Unit and a community of partners — by lowering
    the cost of innovation and promoting open standards for health.

charter:
  label: The charter
  heading: Four commitments, one clear boundary.
  lead: What the foundation will do — and the one thing it deliberately won't.
  # Numbered 01, 02, … automatically, in this order.
  commitments:
    - title: Develop & maintain open-source code
      text: >-
        Supporting standards based development that promote interoperability (HL7 FHIR) and
        reusable AI commons libraries and tooling (built on skills, MCP).
    - title: Enable safe AI adoption
      text: >-
        Identifying initiatives like evals and benchmarks to support efforts to develop safe,
        effective, Verifiable AI (with WHO and partners).
    - title: Capacity building, advocacy & ecosystem support
      text: >-
        Promoting person-centered digital transformation and building capacity through events,
        workshops and bootcamps.
    - title: Standards collaboration
      text: >-
        Partnering with standards development organizations and other software foundations to
        proliferate reference architectures and open standards.
  boundary:
    title: The boundary — no "complete products"
    text: >-
      The foundation will not publish standalone, deployable end-user solutions. It builds the
      blocks; the community builds the applications.

governance:
  label: Governance
  heading: Balanced voices, transparent decisions.
  lead: Multiple pathways ensure inclusivity, balance and strategic focus for the global health ecosystem.
  cards:
    - icon: users
      color: core
      title: External Advisory Council
      text: >-
        Voices from multilaterals, NGOs and Ministries of Health keep the foundation focused on core
        global health goals.
    - icon: balance
      color: ai
      title: Balanced board
      text: >-
        A capped board size balances voices and recognizes strategic grants on par with membership
        fees — with the WHO as an invited observer and strategic partner.
  # The link is the governance docs URL in hugo.yaml (params.links.governanceDocs).
  docsButton: View Governance Docs

model:
  label: Why this model
  heading: Built for neutrality, sustainability and scale.
  items:
    - icon: building
      title: Neutral, open governance
      text: >-
        A trusted non-profit holds the project's assets and trademark. Decisions are made
        transparently by those doing the work.
    - icon: banknote
      title: Sustainable, diverse funding
      text: Tiered memberships and grants de-risk the project — no single funder, no single point of failure.
    - icon: bulb
      color: ai
      title: Future-ready platform
      text: An umbrella structure ready to house new initiatives like an AI Commons — ready for what comes next.
    - icon: wrench
      title: Cost-effective by design
      text: >-
        The Linux Foundation shared "Foundation-as-a-Service" model keeps overheads low meaning the
        majority of funds support coordination of technical projects and the community.

# The membership options (prices, benefits, join buttons) are on the Members page:
# content/members.md → membership. This is the short pointer to them.
membership:
  label: Membership
  heading: Take a seat at the table.
  lead: >-
    Help shape the charter, budget, and direction while sustaining shared open-source infrastructure
    for global digital health. See the membership options, and the organisations already at the table.
  buttons:
    - { label: Membership options, url: /members.html#membership, style: primary, icon: arrow-right-16 }
    - { label: Meet our members & supporters, url: /members.html, style: ghost }
---
