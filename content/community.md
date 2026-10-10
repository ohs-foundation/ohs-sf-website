---
title: Community
description: "Join the Open Health Stack community — monthly community calls, Discord, working groups and events for open digital health."
layout: community
pageStyle: community
navSection: community
hideNewsletter: true

# ─── Page content ──────────────────────────────────────────────────────────
# Text fields accept Markdown: **bold**, *italic*, [links](https://…).
# Links can use the shared links from hugo.yaml: @discord, @calendar, @github,
# @email:general … (see WRITING.md → "Links").

hero:
  label: The community
  heading: A global movement for open digital health.
  lead: >-
    A vibrant community of developers, ecosystem partners and supporters — building the blocks
    once, so they can be reused everywhere.

join:
  label: Join the community
  heading: Show up. Join the conversation.
  lead: The OHS community meets regularly and the conversation never stops. Two easy ways to take part.
  options:
    - icon: calendar
      color: core
      title: Monthly Community Calls
      text: >-
        Open calls for contributors, partners and curious builders — a standing forum to share
        progress, ask questions and shape direction together.
      link: { label: See the calendar, url: "#events" }
    - icon: chat
      color: toolkit
      title: Join us on Discord
      text: >-
        Real-time conversation across channels for each pillar — ask questions, share what you're
        building and connect with the broader community.
      link: { label: Get the invite link, url: "@discord" }
  mailingList:
    text: "To receive regular updates from the foundation:"
    button: Join the mailing list

involved:
  label: Get involved
  heading: Four ways to build with us.
  lead: >-
    Whether you write code, run a deployment, set standards or fund the mission — there's a place
    for you.
  cards:
    - icon: code
      color: core
      title: Contribute code
      text: >-
        Explore the Github repositories for getting started, pick up a good-first-issue or join a
        working group. All work happens in the open under transparent governance.
      link: { label: Browse the repositories, url: "https://github.com/ohs-foundation#start-here" }
    - icon: spark
      color: ai
      title: Join a working group
      text: >-
        Working groups are forming under the AI Commons pillar, shaping the building blocks with the
        community. To receive updates, join us on [Discord](@discord) and register your interest to
        hear when groups kick off.
      link: { label: Register interest, url: "#working-groups" }
    - icon: globe
      title: Deploy in your context
      text: >-
        Building with or for a Ministry of Health, an NGO or startup? Start with FHIR Foundations or
        the OHS Player reference toolkit and join the community of technical partners developing
        next-gen digital health solutions
      link: { label: See the projects, url: /projects.html#toolkit }
    - icon: dollar
      title: Fund the mission
      text: >-
        Become a founding member or strategic grantor and help secure a neutral, sustainable home
        for global digital health.
      link: { label: Explore membership, url: /foundation.html#membership }

# Sign-up form for working-group updates (the form itself is managed in EmailOctopus).
workingGroups:
  label: Working groups
  heading: Shape the building blocks with us.
  text: >-
    Working groups are forming under the AI Commons pillar. To receive updates, register your
    interest and we'll email you when a group kicks off, with the first call and how to join.
  note: "**Already on our newsletter?** Use the same email — no duplicates."

# Upcoming calls come from the community Google Calendar automatically;
# one-off events pinned to the list live in data/events.yaml.
events:
  label: Community events and meet-ups
  heading: Where the ecosystem comes together.
  lead: Summits, workshops and bootcamps that bring the community together — with the WHO and partners.
  calendarText: >-
    To add this and future calls to your calendar, subscribe to our
    [Community Calendar](@calendar). Open to everyone.
  calendarButton: Subscribe to calendar
  filters:
    all: All
    community: Community calls
    workingGroup: Working groups
    inPerson: In-person

cta:
  label: Build once, reuse everywhere
  heading: Help build the future of global digital health.
  lead: >-
    Join a community of developers and partners catalyzing AI-powered, locally-owned digital health
    solutions at scale.
  buttons:
    - { label: Start contributing, url: "https://github.com/google/android-fhir", style: light }
    - { label: Become a member, url: /foundation.html#membership, style: on-dark }

# Newsletter sign-up form (managed in EmailOctopus).
subscribe:
  label: Stay in the loop
  heading: Get updates from the foundation.
  text: >-
    Regular newsletter, community calls and project milestones — straight to your inbox. No spam,
    unsubscribe anytime.
---
