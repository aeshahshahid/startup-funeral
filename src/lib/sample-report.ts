import type { StartupReport } from "./report";

export const SAMPLE_REPORT: StartupReport = {
  startupName: "Rehearse AI",
  stage: "Pre-seed / MVP live",
  healthScore: 58,
  confidence: 82,
  investmentReadiness: "Requires Strategic Improvements",
  investmentReadinessReasoning:
    "Rehearse AI has a credible wedge and a working product, but revenue is concentrated in three pilot accounts and pricing has never been tested above $49/seat. Investors will want repeatable acquisition and one proven paid channel before a priced round. Fix retention measurement and pricing, and this becomes a fundable pre-seed story within a quarter.",
  biggestRisk:
    "Distribution dependency: 78% of signups come from one founder's LinkedIn audience, which does not scale and cannot be bought.",
  biggestOpportunity:
    "Enterprise L&D budgets already pay $200-400/seat for interview and pitch coaching. Repositioning from consumer productivity to team enablement raises ACV roughly 6x with the same product.",
  scores: {
    market: 72,
    execution: 64,
    differentiation: 46,
    revenue: 38,
    competition: 41,
    scalability: 69,
    funding: 52,
  },
  executiveSummary:
    "Rehearse AI helps professionals practise high-stakes conversations — interviews, pitches, difficult feedback — with an AI counterpart that responds in real time. The product works, early users are enthusiastic, and the founding team ships quickly. The core weakness is commercial rather than technical: the company is selling a $49/month consumer tool into a problem that companies pay far more to solve, and it has no repeatable acquisition channel outside one founder's personal network.\n\nDifferentiation is currently framed around model quality, which is not defensible — the same base models are available to every competitor. The durable moat available here is proprietary scenario libraries, scoring rubrics and outcome data from teams. Competition is intensifying from both incumbents adding coaching modules and well-funded interview-prep startups.\n\nThe recommended path is a deliberate three-month repositioning: pick one high-value vertical, raise price aggressively, instrument retention properly, and prove one paid acquisition channel. Executed well, this moves the health score into the low-to-mid 70s and makes the round straightforward.",
  topRisks: [
    {
      title: "Single-channel distribution",
      description:
        "Nearly four fifths of signups originate from organic LinkedIn posts by one founder. This channel is unbuyable, non-transferable and will plateau. There is no tested paid channel, no SEO surface and no partnership motion.",
      severity: "critical",
    },
    {
      title: "Pricing well below value delivered",
      description:
        "At $49/month you are priced as a productivity app while competing with $300+/seat enterprise coaching. Low price attracts churning individuals, suppresses CAC payback and signals low value to buyers.",
      severity: "high",
    },
    {
      title: "Non-defensible differentiation",
      description:
        "'Better AI conversations' is a model-level claim, not a company-level moat. Any competitor can match it within a release cycle. Nothing proprietary compounds today.",
      severity: "high",
    },
    {
      title: "Retention is unmeasured",
      description:
        "There is no cohort retention curve past week four. Practice tools are notoriously spiky — users engage before an event and disappear after. Without this data, all growth projections are unfounded.",
      severity: "critical",
    },
    {
      title: "Technical key-person concentration",
      description:
        "One technical founder owns the entire inference pipeline, prompt layer and infrastructure. Any absence stops delivery, and this is a documented diligence blocker.",
      severity: "moderate",
    },
  ],
  hiddenAssumptions: [
    "That enthusiastic early users represent the broader market rather than an unusually motivated cohort recruited from a founder's network.",
    "That people will keep paying monthly for a tool they only need before specific events.",
    "That the current low price is what makes the product attractive, rather than what limits who takes it seriously.",
    "That model quality will remain a differentiator as base models converge.",
    "That a bottom-up consumer motion will naturally convert into team and company contracts without a dedicated sales motion.",
  ],
  criticalIssues: [
    "No instrumented cohort retention beyond week four — the single most important number for this business is unknown.",
    "Revenue concentration: three accounts represent over 60% of MRR.",
    "No written ICP; marketing copy addresses students, job seekers and executives simultaneously.",
    "Inference cost per active user has never been measured against price, so gross margin is unverified.",
  ],
  growthOpportunities: [
    "Reposition to team-based sales enablement and interview panels, where budgets are 5-8x larger and already allocated.",
    "Build a proprietary scenario library per vertical — this compounds and is genuinely hard to copy.",
    "Partner with bootcamps, accelerators and university career centres for distribution with built-in credibility.",
    "Publish outcome data (offer rates, deal-close rates) as the marketing engine; nobody in this category has credible outcome evidence.",
  ],
  experts: [
    {
      role: "Investor Perspective",
      opinion:
        "Credible team and real usage, but this is not yet a priced-round story. I would need one repeatable channel and honest retention data before committing.",
      reasoning:
        "At pre-seed I underwrite the founder plus evidence of pull. The pull here is real but sourced entirely from a personal audience, which does not generalise. Revenue concentration and unmeasured retention mean I cannot model this business.",
      recommendations: [
        "Publish an eight-week cohort retention curve before your next investor conversation.",
        "Prove one paid channel with CAC payback under 6 months, even at small scale.",
        "Reduce top-account revenue concentration below 40%.",
      ],
    },
    {
      role: "Customer Perspective",
      opinion:
        "The product genuinely helped me prepare, but I stopped using it once my interviews were done. I would not have noticed if my subscription lapsed.",
      reasoning:
        "The value is event-driven, not habitual. Nothing pulls me back between high-stakes moments, and there is no artefact or progress record that makes me feel loss when leaving.",
      recommendations: [
        "Create a persistent skill profile that visibly degrades without practice.",
        "Add manager- or peer-triggered sessions so usage is not self-initiated.",
        "Offer an annual or event-pack price that matches how people actually consume this.",
      ],
    },
    {
      role: "Competitor Perspective",
      opinion:
        "I would not be worried yet. Their positioning is generic enough that my next release erodes it, and their price makes them easy to undercut on perceived value.",
      reasoning:
        "They compete on model output, which I get from the same providers. They have no data moat, no distribution lock-in and no enterprise contracts to defend.",
      recommendations: [
        "Take a narrow vertical I cannot serve credibly and own it completely.",
        "Lock in accounts with annual contracts and integrations before larger players notice.",
        "Accumulate proprietary outcome data that cannot be replicated by prompting.",
      ],
    },
    {
      role: "Market Analyst",
      opinion:
        "The category is real and growing, but it is bifurcating fast into cheap consumer tools and expensive enterprise enablement. The middle is disappearing.",
      reasoning:
        "Corporate L&D and sales-enablement budgets are consolidating around fewer vendors with measurable outcomes. Consumer practice apps face brutal churn economics. Rehearse AI is currently priced in the shrinking middle.",
      recommendations: [
        "Pick a side within 90 days — enterprise is the higher-value option given the product.",
        "Benchmark against enablement platforms, not interview-prep apps.",
        "Track budget-holder titles in your pipeline, not user job titles.",
      ],
    },
    {
      role: "Product Strategist",
      opinion:
        "The core loop is strong but ends too early. Practice without measurement and follow-up is entertainment, not enablement.",
      reasoning:
        "Retention in practice products comes from progress visibility and external accountability. Both are absent. The product currently completes its job in one session, which is the opposite of what recurring revenue needs.",
      recommendations: [
        "Ship scoring rubrics with a longitudinal progress view.",
        "Add team dashboards so a manager becomes the retention mechanism.",
        "Instrument every session for outcome tracking from day one.",
      ],
    },
    {
      role: "Founder Coach",
      opinion:
        "You are working hard on the right product and avoiding the harder commercial questions. That is the pattern I would most want to interrupt right now.",
      reasoning:
        "Shipping features is comfortable and measurable. Raising price, narrowing the ICP and running cold outbound are uncomfortable and revealing. The next unlock is commercial courage, not engineering throughput.",
      recommendations: [
        "Block two half-days a week exclusively for customer development and selling.",
        "Run the price increase as a fixed experiment with a defined end date so it feels reversible.",
        "Write down the ICP in one sentence and reject anything outside it for 60 days.",
      ],
    },
    {
      role: "Risk Analyst",
      opinion:
        "The dominant risks are concentration risks: one channel, one technical founder, three revenue accounts. Any one failing is materially damaging.",
      reasoning:
        "Concentration risks compound because they tend to fail together — losing the technical founder also stops the channel, since both are the same two people. Unmeasured gross margin adds a further blind spot.",
      recommendations: [
        "Document the inference pipeline and add a second engineer with deploy access.",
        "Measure cost per active user monthly and set a gross-margin floor before scaling spend.",
        "Diversify to at least three functioning acquisition channels before raising.",
      ],
    },
  ],
  recoveryStrategy:
    "Treat the next 90 days as a commercial repositioning sprint rather than a product sprint. Week one: instrument cohort retention and cost per active user so every later decision has a baseline. Weeks two to four: narrow to one vertical — sales teams preparing for high-value deals is the strongest candidate — and rewrite all positioning to that buyer. Weeks four to eight: launch a team plan at $249/seat/month with a scenario library and manager dashboard, and grandfather existing users to protect goodwill. In parallel, run structured outbound to 100 target accounts to test whether the higher price closes. Weeks eight to twelve: double down on whichever channel produced qualified pipeline, publish the first outcome data, and reduce revenue concentration. Ship no non-vertical feature during this period.",
  quickWins: [
    "Add cohort retention and week-8 activity tracking to your analytics today.",
    "Rewrite the homepage headline for one buyer instead of three audiences.",
    "Email your three most engaged accounts and ask directly what they would pay for a team plan.",
    "Calculate inference cost per active user and compare it against current pricing.",
    "Document the deployment pipeline so a second person can ship.",
  ],
  plan30: [
    "Publish a written ICP and reject all out-of-scope prospects.",
    "Instrument retention, activation and margin dashboards.",
    "Interview 15 buyers inside the chosen vertical.",
    "Draft team-plan pricing at $199-299/seat and validate with five buyers.",
    "Reduce homepage messaging to a single job-to-be-done.",
  ],
  plan60: [
    "Launch the team plan with manager dashboard and scenario library.",
    "Run 100-account outbound sequence and measure reply-to-demo conversion.",
    "Sign two paid team pilots with defined success metrics.",
    "Add a second engineer or contractor with production access.",
    "Ship longitudinal skill scoring.",
  ],
  plan90: [
    "Convert pilots into annual contracts with published outcome data.",
    "Prove CAC payback under six months on one channel.",
    "Bring top-account revenue concentration below 40%.",
    "Assemble the pre-seed data room with retention, margin and pipeline evidence.",
    "Set the next-quarter hiring plan against proven channel economics.",
  ],
  projectedImprovement: {
    score: 76,
    summary:
      "Executing the 90-day plan primarily lifts Revenue (38 → 68), Differentiation (46 → 66) and Funding (52 → 74), because each addresses a measurement or positioning gap rather than requiring new technology. Market and scalability scores are already strong and remain roughly stable.",
  },
};