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

membership:
  label: Membership
  heading: Take a seat at the table.
  lead: >-
    Help shape the charter, budget and direction — and build an enduring association with a
    first-of-its-kind initiative.
  # The membership options as described on this page (prices and benefits).
  # Member logos are grouped by the tiers in data/members.yaml — keep the two in step.
  groups:
    - label: Standard tiers · Linux Foundation model
      tiers:
        - name: Premier
          meta: $100k / year · 3-year commitment
          text: >-
            For organizations shaping the foundation. Includes a dedicated Governing Board seat, a
            hand in the charter, budget and direction, and founding-member brand association.
            Up-front grants may be accepted in lieu of fees.
        - name: Gold
          meta: Sliding scale, by organization size · incl. $5k/yr Linux Foundation membership
          text: >-
            The fee scales with organization size — indicatively $10k/year up to 100 employees.
            Gold members nominate a board representative (one per five members, up to three
            total) and take part in working groups and the technical, outreach and other committees.
        - name: Associate
          meta: No fee · non-profit, academic & government entities
          text: >-
            Reserved for approved non-profit, academic and government entities. Associate members
            may stand for election to the Governing Board (one seat available) and participate fully
            in working groups and committees.
    - label: Additional pathways · OHS-SF
      tiers:
        - name: Inclusive
          meta: No fee · LMIC for-profits under 100 employees
          text: >-
            The standard $10k/year Gold fee is waived to maximize accessibility for entrepreneurs
            in lower- and middle-income countries, with full participation in working groups.
        - name: Sponsorships or grants
          meta: Custom · funders & multilaterals
          text: >-
            We are open to mission aligned grants or financial sponsorships for specific projects or
            activities that support the foundations work.
  docs:
    title: Foundation Governance & Charter
    text: >-
      Read the official Linux Foundation agreement defining membership rights, board composition,
      and Foundation bylaws.
    button: View Governance Docs
  # "Join now" goes to the LFX enrollment link and "Get in touch" emails the
  # membership address — both set in hugo.yaml (params.links / params.contact).
  joinButton: Join now
  contactButton: Get in touch

  # Heading above the member logos (shown once data/members.yaml lists members).
  directory:
    label: Our members
    heading: The organisations at the table.
---
