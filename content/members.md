---
title: Members & supporters
description: "The organisations behind the Open Health Stack Software Foundation — Foundation members, supporting organisations and advisory partners."
layout: members
pageStyle: members
navSection: members

# ─── Page content ──────────────────────────────────────────────────────────
# The organisations and their logos are in data/members.yaml; this file only
# holds the wording. Text fields accept Markdown.

hero:
  label: Members & supporters
  heading: The organisations behind Open Health Stack.
  lead: >-
    Foundation members, supporting organisations and advisory partners working together on shared,
    open building blocks for global digital health.

# One band per group, in this order, on alternating backgrounds. `tiers` are tier
# ids from data/members.yaml; `featured` tiers get the larger cards; `columns: 6`
# puts six logos per row on wide screens (fewer on smaller ones). A band with no
# organisations to show is hidden.
bands:
  - id: members
    label: Foundation members
    heading: Members & strategic partners.
    lead: >-
      Organisations that have joined the Foundation, or partner with it strategically, to fund and
      govern shared open infrastructure.
    tiers: [premier_strategic, general_associate]
    featured: [premier_strategic]
    link: { label: Explore membership options, url: "#membership" }
  - id: supporters
    label: Supporting organisations
    heading: Supporting the mission.
    lead: >-
      Ecosystem organisations supporting the adoption and mission of Open Health Stack. They are not
      Foundation members.
    tiers: [supporters]
    columns: 6
  - id: advisory
    label: Advisory support
    heading: With advisory support from.
    lead: Global organisations advising the Foundation's work.
    tiers: [advisory_support]

membership:
  label: Membership
  heading: Take a seat at the table.
  lead: >-
    Help shape the charter, budget, and direction while sustaining shared open-source infrastructure
    for global digital health. Contributing code is always free.
  # The membership options as described on this page (prices and benefits).
  # (The logos above are grouped separately, by the tiers in data/members.yaml.)
  groups:
    - label: Standard tiers · Linux Foundation model
      tiers:
        - name: Premier
          meta: $100k / year · 3-year commitment
          text: >-
            For anchor funders and strategic technology partners. Includes an appointed Governing
            Board seat, a voting Technical Advisory Council (TAC) seat, Working Group and committee
            leadership, founding-member recognition, and upfront grant compatibility.
        - name: General
          meta: Sliding scale by organization size · starting at $5k–$10k / year
          text: >-
            For digital health builders, implementers, and NGOs. Fees scale by headcount, starting at
            $5k/year for existing LF members and eligible $0 LF Associate non-profits ($10k/year
            combined with LF Silver under 100 staff). Includes elected shared Governing Board seats
            (one per five members, up to two) and Working Group leadership.
        - name: Associate
          meta: No fee · non-profit, academic & government entities
          text: >-
            Reserved at no cost for approved non-profits, academic and research institutions,
            multilaterals, and government entities (including Ministries of Health). Includes open
            Working Groups, community calls, Discord channels, and advisory input via the External
            Advisory Council or up to two Board-invited seats.
    - label: Additional pathways · OHS-SF
      tiers:
        - name: Implementer
          meta: No fee · Board-approved pre-revenue builders
          text: >-
            A recognition pathway for small, pre-revenue teams actively building on OHS, subject to
            Governing Board approval. Provides community recognition and open Working Group access
            while teams build toward commercial scale and graduate to General membership.
        - name: Sponsorships & grants
          meta: Custom · strategic funders & multilaterals
          text: >-
            Mission-aligned multi-year grants and directed project sponsorships are welcome.
            Qualifying strategic grants carry Governing Board representation under the Foundation
            Charter, while directed sponsorships fund targeted technical, evaluation, or
            capacity-building initiatives.
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
---
