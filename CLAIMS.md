# Content inventory — invented figures and claims

AlphaDecibel is a stealth-stage company and this site was written as pre-launch
marketing material. **Every number, customer, quote, and certification below is
fictional.** This file exists so you can find and replace them all before the site
is used in a real commercial context.

Search each string to find every occurrence.

## Company facts

| Claim | Where | Real? |
|---|---|---|
| Founded 2023, Seattle | `company/`, timeline | ✗ |
| 1201 Second Avenue, Suite 1500, Seattle WA 98101 | footer, `company/`, `contact/` | ✗ |
| 31 people, two-thirds engineering | `_disabled/leadership-section.html` | ✗ |
| Seed led by Elliott Bay Ventures (2023) | `company/` | ✗ — fictional firm |
| Series A led by Foghorn Capital (2026) | `company/` | ✗ — fictional firm |
| Rainier Software Partners | `company/` | ✗ — fictional firm |
| Six named leadership team members | **currently hidden** — `_disabled/leadership-section.html` | ✗ — fictional people |
| Five open roles | `company/#careers` | ✗ |
| All `@alphadecibel.com` addresses | throughout | ✗ — not yet provisioned |

## Product metrics

| Claim | Where |
|---|---|
| 41.6M conversations analyzed | home stats band |
| 97.2% transcription accuracy | home stats, `platform/` specs |
| 99.1% diarization (dual-channel), 94.3% (mono) | `platform/` specs |
| 31 languages | home stats, `platform/` specs |
| 22% average handle time reduction | home stats |
| Under 4 min post-call scoring at p95, 8s live | `platform/` specs |
| 40,000 concurrent calls per deployment | `platform/` specs |
| 60+ certified connectors | `integrations/` |
| 9 deployments | `company/` timeline |
| ~6 hours/week returned per supervisor | `solutions/#supervisors` |
| Custom connector build ≈ 2 weeks | `integrations/` |

## Industry statistics (used as "the problem")

| Claim | Where |
|---|---|
| 1.8% of conversations reviewed | home, `solutions/`, `security/` |
| 34-point spread between two human scorers | home |
| 19 days from call to coaching | home |

These are presented as general industry facts, not AlphaDecibel measurements. They are
plausible but unsourced. If you keep them, cite a real source (e.g. an analyst report)
or reframe them as "in the operations we've seen".

## Customers and testimonials

All three are **fictional companies and fictional people**:

- Tessa Brandt, VP Quality & Compliance, **Meridian Mutual Insurance**
- Rahul Oyelaran, Director of Contact Center Technology, **Cascade Financial Group**
- Joanna Mbeki, Senior Director Member Services, **Northbay Health**

The Leadership section on `company/` is **removed from the live site** while in stealth;
the markup is parked in `_disabled/leadership-section.html`.

Also referenced: Kestrel (team name), and agent names throughout the dashboard mockups
(M. Okonjo, D. Restrepo, A. Lindqvist, J. Whitfield, P. Nkemdirim, S. Bergström).

**Before launch:** replace with real, consented customer quotes, or remove the section.
Fabricated endorsements attributed to named individuals are an FTC endorsement-guides
problem in the US, regardless of whether the company is fictional.

## Compliance certifications — highest risk

`security/#compliance` currently states:

- SOC 2 Type II — **audited**
- ISO/IEC 27001 — **certified**
- HIPAA — aligned, BAA available
- GDPR / UK GDPR — compliant
- CCPA / CPRA — compliant
- PCI DSS — scoped
- NAIC / state DOI evidence packs
- FedRAMP Moderate — in progress

None of these are real. Claiming an unheld SOC 2 or ISO 27001 attestation is
misrepresentation and will be caught immediately in any enterprise vendor review.
**Replace with actual attestation status before the site is live.**

The engineering-practice table in `security/` (encryption, access control, SDLC,
pen testing, RPO/RTO, incident response) is likewise aspirational.

## Financial and outcome figures

| Claim | Where |
|---|---|
| Close rate by quality band: 11 / 19 / 28 / 37 / 44% | home chart, `solutions/` |
| n = 214,880 calls, 9 deployments | home chart |
| $41.7M revenue influenced | home + `solutions/` exec dashboards |
| $6.2M / $3.8M / $2.7M / $1.1M modeled lever upside | home, `solutions/` |
| $4.82 cost per contact, ▼ $1.19 | home, `solutions/` |
| 17-point close-rate lift from disclosure ordering | home, `platform/`, `solutions/` |
| 23% retention lift from clarifying questions | `platform/`, `solutions/` |
| Q2 objection cost: $4.1M / $2.5M / $1.4M | `platform/#search` |

All dashboard mockups carry an "Illustrative data" note on the home page. Consider
adding the same note to `solutions/` and `platform/`.

## Product capabilities

The capability descriptions are extrapolated from the real architecture in this
repository (`src/`, `docs/superpowers/specs/2026-06-09-azure-onprem-verint-design.md`).
The on-premises data-residency story, the four-stage pipeline, diarization, PII
redaction, and the natural-language query interface all correspond to designed
behaviour. Live-stream analysis, air-gapped local inference, the 60+ connector
catalogue, and Outcome Intelligence's CRM join are **not built yet** — they are
roadmap described in present tense.

## Integration compatibility

Platform names (Amazon Connect, Genesys, Avaya, RingCentral, Verint, Calabrio,
Salesforce, Snowflake, and the rest) are real products and are named as compatibility
claims. They are rendered as styled text wordmarks rather than reproduced logos, so
there is no trademark asset use — but the *compatibility* claim itself needs to be
true before launch. Anything not yet built should move to the `soon` class, which
renders it greyed with a target quarter.
