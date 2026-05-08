import type { BrandInspiration, Creative, Format, Industry } from "@/types/creative";
import { additionalUploadedSeeds } from "@/data/additional-uploaded-seeds";

export const industries: Array<"All" | Industry> = [
  "All",
  "Devtools",
  "Fintech",
  "AI",
  "Productivity",
  "Security",
  "Collaboration",
];

export const formats: Array<"All" | Format> = [
  "All",
  "Static",
  "Carousel",
  "LinkedIn",
  "X/Twitter",
  "Meta",
  "Launch",
  "Comparison",
  "Founder-led",
];

export const brandInspirations: BrandInspiration[] = [
  "Ramp",
  "Cursor",
  "Claude",
  "Notion",
  "Linear",
  "Wiz",
  "Superhuman",
  "Vercel",
  "Stripe",
  "Figma",
];

const structure =
  "Lead with one plain claim. Place a quiet product artifact underneath it. Use one proof detail, one constraint, and a restrained footer tag so the reader knows what kind of company this is for.";

const negative =
  "No purple AI gradients, no floating robot, no fake metrics, no stock-photo people, no exclamation marks, no glossy 3D objects, no crowded UI montage.";

const remix = [
  "Swap the proof detail for a customer objection.",
  "Keep the headline under eight words.",
  "Use one product artifact instead of a full dashboard.",
];

const motifDescriptions: Record<Creative["visual"]["motif"], string> = {
  receipt: "a familiar finance artifact",
  code: "a small piece of product evidence",
  chat: "a calm conversational moment",
  docs: "a working document",
  shield: "a clear security symbol",
  timeline: "a visible sense of progress",
  mail: "one clean communication moment",
  terminal: "a developer artifact",
  ledger: "an ordered proof system",
  canvas: "a shared working surface",
};

function buildSeedWhyItWorks(title: string, motif: Creative["visual"]["motif"], industry: Industry) {
  return `One good idea gets the room here, and the ad is smart enough not to crowd it. ${motifDescriptions[motif][0].toUpperCase()}${motifDescriptions[motif].slice(1)} carries the argument with a quiet hand, while the promise behind "${title}" stays close to the kind of ${industry.toLowerCase()} work people actually recognize.`;
}

function buildUploadedWhyItWorks(visualDirection: string, format: Format, industry: Industry) {
  const direction = visualDirection.toLowerCase();

  if (direction.includes("testimonial") || direction.includes("customer")) {
    return `The proof feels human without turning into a case study. The ${format.toLowerCase()} frame gives the reader a quick center of gravity, and the customer-led structure makes the ${industry.toLowerCase()} point feel observed rather than announced.`;
  }

  if (direction.includes("comparison") || direction.includes("versus") || direction.includes("table")) {
    return "The contrast has discipline, which is rarer than it sounds. There is no need for theater here, just a clean read, a steady hierarchy, and enough restraint for the better choice to feel obvious by the time the eye reaches the bottom.";
  }

  if (direction.includes("dashboard") || direction.includes("interface") || direction.includes("ui") || direction.includes("product")) {
    return `The product is treated like evidence, not decoration. The interface gives the claim something concrete to lean on, and the surrounding space keeps the ad from becoming a tour of features, which is where a lot of ${industry.toLowerCase()} creative starts to lose its nerve.`;
  }

  if (direction.includes("illustration") || direction.includes("line art") || direction.includes("character")) {
    return `The illustration softens the idea without making it cute for its own sake. There is enough personality to invite the reader in, but the composition stays composed, which lets the message keep its footing as a serious ${industry.toLowerCase()} reference.`;
  }

  if (direction.includes("poster") || direction.includes("editorial") || direction.includes("typography")) {
    return "It behaves more like a good poster than a hard-selling ad. The type and spacing do the quiet work, the visual system gives the idea a point of view, and the whole piece feels confident enough to leave some air in the room.";
  }

  if (direction.includes("black") || direction.includes("dark")) {
    return "The darker frame gives the idea weight without asking the copy to posture. The contrast pulls the eye toward the center, the hierarchy stays clean, and the result feels considered rather than loud.";
  }

  return `The reference has a clear center of gravity. It gives the reader one visual idea to settle into, keeps the message close to the surface, and lets the ${industry.toLowerCase()} promise feel composed instead of overexplained.`;
}

const basePrompt = (title: string, brand: BrandInspiration, industry: Industry, motif: string) =>
  `Create a quiet, editorial tech ad for a fictional ${industry.toLowerCase()} company. The piece is inspired by the restraint and spacing often seen in ${brand}-adjacent design language, but it must not copy any real brand asset. Concept: ${title}. Use a warm off-white canvas, near-black type, muted borders, one restrained accent, and a single ${motif} product artifact. Make it feel composed, useful, and worth saving.`;

const variables = [
  "Company name",
  "Primary product truth",
  "Audience segment",
  "Proof detail",
  "Accent color",
];

const rows: Array<[
  string,
  BrandInspiration,
  Industry,
  Format,
  Creative["visual"]["motif"],
  string,
  string,
  string,
  boolean
]> = [
  ["The spend report that reads back", "Ramp", "Fintech", "LinkedIn", "receipt", "Close the month without the hunt.", "Policy drift, caught early.", "#f5efe4", true],
  ["The quiet card control", "Ramp", "Fintech", "Static", "ledger", "Every limit has a reason.", "Less chasing. Cleaner books.", "#efe7d9", false],
  ["Budgets before they wander", "Ramp", "Fintech", "Carousel", "receipt", "Set the rail before the spend.", "A finance ad without panic.", "#f7f0e7", true],
  ["Code review with a second set of hands", "Cursor", "Devtools", "X/Twitter", "code", "Ship the fix you can explain.", "Context kept inside the diff.", "#ece9df", false],
  ["The migration map", "Cursor", "Devtools", "Launch", "terminal", "Old code, made legible.", "A path through the repo.", "#f3eee5", true],
  ["The bug report becomes the patch", "Cursor", "Devtools", "Meta", "code", "From trace to change list.", "Less theater around fixes.", "#eee8dd", true],
  ["The answer with a margin", "Claude", "AI", "Static", "chat", "Useful answers leave room.", "Reasoning, stated plainly.", "#f4eadf", false],
  ["Notes from the second read", "Claude", "AI", "Founder-led", "docs", "The brief gets sharper.", "A calmer assistant story.", "#efe6db", true],
  ["The meeting that became a decision", "Claude", "AI", "LinkedIn", "chat", "Less summary. More judgment.", "For teams that write to decide.", "#f7efe4", true],
  ["The workspace with no front desk", "Notion", "Productivity", "Static", "docs", "Everything has a place.", "Pages, not portals.", "#f5efe6", false],
  ["A launch plan that stays readable", "Notion", "Productivity", "Carousel", "timeline", "Work in the order it happens.", "A plan people can scan.", "#eee5d8", true],
  ["The operating doc", "Notion", "Productivity", "LinkedIn", "docs", "One page for the work.", "Less ceremony around alignment.", "#f6eee2", true],
  ["The issue that tells the truth", "Linear", "Productivity", "Comparison", "timeline", "Status without theater.", "A cleaner view of motion.", "#f0ece3", false],
  ["Planning without the drumroll", "Linear", "Productivity", "Launch", "timeline", "The roadmap got quieter.", "Decisions over announcements.", "#f4eadc", true],
  ["The handoff with a spine", "Linear", "Collaboration", "LinkedIn", "timeline", "Every task knows its owner.", "A team ad with discipline.", "#eee8dc", true],
  ["The cloud inventory that answers", "Wiz", "Security", "Static", "shield", "Find the path before it matters.", "Risk shown in plain sight.", "#f3eadf", false],
  ["Exposure, in one sentence", "Wiz", "Security", "Comparison", "shield", "Know what is reachable.", "Security made readable.", "#ede6da", true],
  ["The board packet for risk", "Wiz", "Security", "Carousel", "ledger", "A clear route from asset to exposure.", "For security leaders under time.", "#f6efe5", true],
  ["Inbox, trimmed to the point", "Superhuman", "Productivity", "Meta", "mail", "Handle the mail that matters.", "Speed without bravado.", "#f2eadf", false],
  ["The follow-up that wrote itself", "Superhuman", "Productivity", "Founder-led", "mail", "A sharper reply, already drafted.", "Email as judgment work.", "#efe8dd", true],
  ["Deploy notes for grown teams", "Vercel", "Devtools", "Launch", "terminal", "Preview the change before the meeting.", "Shipping with a paper trail.", "#f5eee3", false],
  ["The edge case got a home", "Vercel", "Devtools", "X/Twitter", "code", "Fast is better when it is understood.", "Developer speed, plainly framed.", "#eee8dc", true],
  ["Payments, minus the fog", "Stripe", "Fintech", "Comparison", "ledger", "The money path, drawn once.", "Infrastructure with a calm face.", "#f4ece0", false],
  ["The canvas everyone can mark up", "Figma", "Collaboration", "LinkedIn", "canvas", "The decision is visible.", "Design work without translation.", "#f1e9dd", true],
];

const generatedCreatives: Creative[] = rows.map(
  ([title, brandInspiration, industry, format, motif, headline, subline, background, premium], index) => ({
    id: `creative-${index + 1}`,
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    brandInspiration,
    industry,
    format,
    visualStyleTags: ["editorial", "warm", "artifact-led", motif],
    premium,
    shortDescription: `${brandInspiration}-inspired ${format.toLowerCase()} concept for ${industry.toLowerCase()} teams.`,
    whyItWorks: buildSeedWhyItWorks(title, motif, industry),
    structureNotes: structure,
    fullPrompt: basePrompt(title, brandInspiration, industry, motif),
    editableVariables: variables,
    negativePrompt: negative,
    recommendedModel: index % 3 === 0 ? "Midjourney v7" : index % 3 === 1 ? "GPT-4.1 image" : "Ideogram 3.0",
    aspectRatio: format === "LinkedIn" ? "1.91:1" : format === "X/Twitter" ? "16:9" : "4:5",
    remixNotes: remix,
    visual: {
      headline,
      subline,
      background,
      accent: index % 4 === 0 ? "#8b6f47" : index % 4 === 1 ? "#536052" : index % 4 === 2 ? "#7b4f42" : "#3f5661",
      motif,
    },
  }),
);

export type UploadedSeed = [
  filename: string,
  title: string,
  brandInspiration: BrandInspiration,
  industry: Industry,
  format: Format,
  visualDirection: string,
];

const uploadedSeeds: UploadedSeed[] = [
  ["0093b098f960b16b4c2cdcf60cdc8f50.jpg", "Choose a Bank That Fits", "Stripe", "Fintech", "Static", "pastel mascot illustration with a small seated character, plenty of empty space, and a direct finance headline"],
  ["044c09d3fbaf86d4acbc5354581aba98.jpg", "What Now, What Next", "Cursor", "Devtools", "Launch", "browser-window crop with a vivid gradient panel and small speech note, built as a calm software teaser"],
  ["0b416699a0382b1a3fc7be66f8d95f7a.jpg", "Can It Wait", "Ramp", "Fintech", "Meta", "dark editorial still life with receipts and cards rising from a wallet, lit like a premium magazine ad"],
  ["0f4ac3e9d1be3c503bafa8f5ff7747eb.jpg", "Do Not Miss Praying Hours", "Notion", "Productivity", "Static", "minimal product poster with a device centered on cream paper and a compact serif headline"],
  ["10f30b3b9121973d8648db069e6e45ba.jpg", "All Together Now", "Figma", "Collaboration", "LinkedIn", "lightweight line illustration of a team around a table with a quiet collaboration claim"],
  ["14472b12c8bfd218d8df8c7110b0e7cd.jpg", "What If Your Business Was Bread", "Ramp", "Fintech", "Carousel", "playful metaphor poster using sliced bread as the main proof object"],
  ["1776438442718.jpeg", "Hidden Spend", "Ramp", "Fintech", "LinkedIn", "black background, crumpled paper as spend metaphor, small yellow CTA and direct finance copy"],
  ["218b3a1c5a0852445219848b067457d9.jpg", "Hello Good Buy", "Superhuman", "Productivity", "Static", "nostalgic product hero with telephone hardware, dramatic lighting, and theatrical headline"],
  ["249cdf1ff87952eb2893732096630f06.jpg", "Overthinking Versus Doing", "Linear", "Productivity", "Comparison", "two-object comparison poster with a messy ball beside a neat square"],
  ["2719756e4f518acf5f3ad1c27e605c6b.jpg", "I Hope You Found This Useful", "Figma", "Collaboration", "Static", "bright yellow social-style poster with colorful circles spilling from an envelope"],
  ["321cef8f4527a80c13679aeb29a2938b.jpg", "Before AI", "Claude", "AI", "Static", "simple hand-drawn pencil poster with a compact line about craft before automation"],
  ["397a3f9dba40a09676c94666b14daf0c.jpg", "Incredible Proportions", "Vercel", "Devtools", "Launch", "vintage product announcement with a hand holding a thin object and restrained technical copy"],
  ["3b8321a23dd57d1cf5d605bd538d8523.jpg", "Change Is Possible", "Notion", "Productivity", "Static", "bold yellow typographic poster with one declarative line and small butterfly mark"],
  ["416HmyoFPZL._SY445_SX342_FMwebp_.webp", "Mood and Trope", "Figma", "Collaboration", "Static", "minimal matrix of small rounded color objects arranged like a design-system study"],
  ["45c9f3d8ab2997ac1eeb66137a48e14b.jpg", "The Green Cover", "Claude", "AI", "Static", "large quiet magazine cover with one tiny figure and almost no copy"],
  ["48f36c55713443d5366c01044ef07ffd.jpg", "What You Do Not Hear", "Superhuman", "Productivity", "Static", "minimal product-centered poster with a hanging object and serif headline"],
  ["5768f7a06cfc40f43099c8fe0f81900f.jpg", "Matter Without Weight", "Notion", "Productivity", "Static", "newspaper-like vertical ad with a single physical object and black serif copy"],
  ["6a8edc666000fe7a45cd839a7b5dd5fc.jpg", "Design to Have but Crash", "Linear", "Productivity", "Static", "retro car illustration on a sweeping red road with a concise design line"],
  ["6b25ecc2576e542dd088710e4a137877.jpg", "First in Space", "Vercel", "Devtools", "Launch", "vintage aerospace editorial layout with dense copy blocks and a product-first headline"],
  ["6eaf61c03f3ee91092e0e1720693dd90.jpg", "Never Run Out of Design Inspiration", "Figma", "Collaboration", "LinkedIn", "clean white SaaS-style layout with a straightforward design-resource headline"],
  ["6f87b4be5be61f4e1e1d3d7545844ce0.jpg", "Innovation Does Not Carry Weight", "Vercel", "Devtools", "Static", "premium product ad with large serif headline and sneaker-like object"],
  ["6fb9cb1f07ac0fc4f531f2dd800846ef.jpg", "All Hands on Doc", "Notion", "Collaboration", "LinkedIn", "line-art collaboration scene around a shared document and spare workspace copy"],
  ["7021fd8489e39d3d1a91b16e7c5c3494.jpg", "Automated Emails by Hand", "Superhuman", "Productivity", "Static", "cream poster with hand-drawn figure holding workflow cards"],
  ["731edbf67b90c2b965cfef2e20ceed25.jpg", "Proudly Braniff", "Stripe", "Fintech", "Static", "retro airline poster with bright layered color ribbons and clean product pride"],
  ["7355b4b72a9780d4d228810b95825357.jpg", "How to Save and Invest", "Ramp", "Fintech", "Carousel", "stacked green coin columns with educational finance headline"],
  ["784994f5b2c0cc2d1906ca8f9260b8fb.jpg", "The Works", "Notion", "Productivity", "Static", "file-folder tab system as metaphor for organized knowledge"],
  ["7e75ff60f27e79545d8d6a3b1a39feb9.jpg", "Books Make Us Better", "Notion", "Productivity", "Launch", "bold split-color book promotion with simple illustration and start-here cue"],
  ["815a07125bfc808a0f1ea092c55d70ff.jpg", "How to Civilize 7 A.M.", "Superhuman", "Productivity", "Static", "editorial tabletop photo with coffee and morning-routine headline"],
  ["8c5fa791eb97799587f9b7889c323f6c.jpg", "Small Deeds Done Right", "Linear", "Productivity", "Static", "cream poster with small tools arranged as symbols for careful work"],
  ["8e050094f860b3fdf0a57ac4c65ed8f4.jpg", "The Design Files", "Figma", "Collaboration", "Static", "folder and notebook still life with label-style headline"],
  ["8e5e6588fbf3a1215ca7085d4410fa9f.jpg", "How to Read a Banana", "Claude", "AI", "Comparison", "annotated object poster using a banana as a humorous analysis diagram"],
  ["961b1e9164941744026b739f9d0bf6d8.jpg", "You Can Point, You Can Use Macintosh", "Cursor", "Devtools", "Static", "classic computer ad with hand gesture and product interface"],
  ["973ee197ac7f806c6223a16857c9e8e9.jpg", "Very Very Smart", "Cursor", "Devtools", "Static", "dark vintage computer poster with centered hardware and oversized serif claim"],
  ["9941495476bd0631eea5bd2497dd461d.jpg", "I Knew I Wanted to Pin It", "Notion", "Productivity", "Static", "yellow retro software poster with centered computer and annotation lines"],
  ["9992b011e3691f76220dbff2f5eeb432.jpg", "Trains of Thought", "Claude", "AI", "Static", "newspaper metaphor poster with large serif headline and cylindrical paper object"],
  ["9b242efcd5af4639bb6ca8bb60d34160.jpg", "More Pull", "Linear", "Productivity", "Static", "minimal white automotive poster with a small vehicle and lots of negative space"],
  ["Ent-Finance_Implementation_logo-proof-fun_1x1jpg.jpeg", "Implementation Took Weeks Not Months", "Ramp", "Fintech", "LinkedIn", "finance newspaper spoof with logo-proof credibility and bright frame"],
  ["IncentiveAds12391png.jpeg", "Get an Oura Ring", "Ramp", "Fintech", "Meta", "blue gradient incentive ad with product ring and partner CTA"],
  ["LinkedIn_Legal-test_image-card_4x5jpg.jpeg", "Client Expenses the Old Way", "Ramp", "Fintech", "LinkedIn", "corporate card product shot with old-way expense tracking critique"],
  ["OPT1_Enterprise_Inaction_Static_Paid_1x1png.jpeg", "Being Proactive Is Powerful Leadership", "Notion", "Productivity", "LinkedIn", "enterprise benefits ad with phone mockup and soft neutral hierarchy"],
  ["OPT2_Enterprise_Value_Static_Paid_1x1png.jpeg", "Empower Employees to Stay Focused", "Notion", "Productivity", "LinkedIn", "dark green enterprise ad with benefit tiles and calm HR positioning"],
  ["Symbolism_nonprofit_expense-management_folders_4x5jpg.jpeg", "Program Expenses the Old Way", "Ramp", "Fintech", "LinkedIn", "stacked folder metaphor for old expense workflows"],
  ["a4549861d757bee59b9cfda23a986f50.jpg", "Newsletter", "Superhuman", "Productivity", "Launch", "person holding a paper newsletter over blue sky with oversized serif title"],
  ["a488cf717b3ab6ec867aa6f7238284cb.jpg", "Happy New Month", "Notion", "Productivity", "Static", "illustrated file box and calendar motif in cheerful editorial colors"],
  ["a8d90a5d159aa373e22cb2f696edd4cd.jpg", "One Thousand Songs in Your Pocket", "Superhuman", "Productivity", "Static", "classic product launch poster with device centered and one simple capability"],
  ["af42800f56c916cdce42012c9ca65839.jpg", "The Most Uncomfortable Chair", "Linear", "Productivity", "Static", "single red chair on pale background with a sharp product metaphor"],
  ["b674972c2bf3d206d27731acc6b51c0c.jpg", "Your Space Is Not Plain", "Figma", "Collaboration", "Static", "gallery-like poster with small artworks and a curatorial claim"],
  ["b91d89057f6db47c09bf8e11ead0bd85.jpg", "Remember the Days", "Notion", "Productivity", "Static", "nostalgic desk-lamp poster with a small price bubble and memory-led copy"],
  ["b9cf322e8f434d3d62e91069c633a0b9.jpg", "Marketing Smarts to Grow and Scale", "Superhuman", "Productivity", "Static", "yellow typographic poster with playful object overlays"],
  ["bbfbacf0161f658008ad02fbfa55b013.jpg", "Useful Shapes", "Figma", "Collaboration", "Static", "clean poster with colorful blocks falling into a shadow shape"],
  ["be6fe9d0327e092e7680cff182c9fa70.jpg", "American Dream Diary", "Notion", "Productivity", "Static", "newspaper diary ad with centered notebook and high-contrast serif headline"],
  ["behance.jpg", "Stacked Ideas", "Figma", "Collaboration", "Static", "tower of colorful blocks on white background as a visual metaphor for accumulated work"],
  ["c247f702ce8256b26042f6650ba63fa4.jpg", "Two Notes", "Notion", "Productivity", "Static", "two sticky notes on open white space with newspaper masthead styling"],
  ["c37bf647bdca9b7e89872c2e0f2abefe.jpg", "Transcend Earthly Bonds", "Vercel", "Devtools", "Launch", "retro computer and satellite concept with poetic product language"],
  ["c464a38645d5fcd79ee03abc45e1309d.jpg", "The Magazine Index", "Notion", "Productivity", "Static", "yellow editorial index poster with long list composition"],
  ["c6d5a25943121e0a08553bc248e01e75.jpg", "Break Your Own Records", "Linear", "Productivity", "Static", "minimal staircase illustration with compact motivational copy"],
  ["c74cdbd9924fbe0c1bccc77e3d860dbe.jpg", "Escape From Ordinary", "Cursor", "Devtools", "Static", "single keyboard key object on gray field with a small arrow"],
  ["d12ddfed4085e6c3840aaffacd124427.jpg", "Confused Overwhelmed Misled", "Claude", "AI", "Static", "yellow bookish typographic poster with an expressive object"],
  ["dc3d9268ac312e6a1dd5b5910e0d9461.jpg", "My Brain Speaks English Better", "Claude", "AI", "Static", "newspaper column layout with oversized typographic quote"],
  ["dc85e8710bd58bf99e79cb74633b0ca1.jpg", "Instagram Strategy Guide", "Superhuman", "Productivity", "Static", "yellow illustrated guide cover with hand-drawn social-marketing objects"],
  ["e0d9675cd8372f4aeab1387224e24c4e.jpg", "Fast Track Passing Lane", "Linear", "Productivity", "Static", "serif editorial ad with a strong metaphor for speed and prioritization"],
  ["e6f98ab89fdff4d7837176ae7dd98625.jpg", "25 Million People Can Use a Computer", "Cursor", "Devtools", "Static", "vintage computer accessibility ad with human figure and machine"],
  ["ea23267abb5944ef3ccc876550c03094.jpg", "Trust the Processor", "Vercel", "Devtools", "Static", "blue processor poster with large technical claim and centered chip"],
  ["ea38f81b552c4fb60c9348ac5cbd17fa.jpg", "Lisa 77", "Cursor", "Devtools", "Static", "vertical Apple-style interface poster with pointing hand and feature list"],
  ["f2fd30eaba880831a50b3a41d6f2e4f8.jpg", "He Did Everything Manually", "Linear", "Productivity", "Comparison", "photo of a tired worker slumped over drawers with a blunt automation headline"],
  ["f504704f2764dda0a536f73fff6fbac8.jpg", "Le Monde", "Notion", "Productivity", "Static", "diagonal newspaper-like orange composition with premium editorial restraint"],
  ["f67724ef7f58c5def526fdf30d4c8677.jpg", "Too Many Ideas", "Notion", "Productivity", "Static", "small yellow notes gathered into a cloud on white space"],
  ["f7d9b9e90db552a44a7cab18cdbe8c2d.jpg", "World in Color", "Figma", "Collaboration", "Static", "retro computer with rainbow trail and soft Apple-like product optimism"],
  ["fa3c5c85a185c24e6d5fcb68f084c8d8.jpg", "Global Presence", "Stripe", "Fintech", "Static", "shopping cart report poster with blue background and tabular proof"],
  ["fbaa23303dc0fdac26ffff1ec42dc64d.jpg", "Out of Ideas", "Claude", "AI", "Static", "minimal black-and-white poster with a single device and idea shortage headline"],
  ["fc9d02937e6b42f1c81e411f2fd8dfaa.jpg", "Great Ideas Happen Outside the Office", "Figma", "Collaboration", "LinkedIn", "line illustration with three small framed scenes and remote-work copy"],
  ["fca2b89a4a8fedebcadee1bf19e2f561.jpg", "Nothing", "Claude", "AI", "Static", "extreme negative space poster with a small illustration and a single bold word"],
  ["guardian.jpg", "Please Give to Young Newsagent", "Stripe", "Fintech", "Static", "blue charitable newspaper poster with hand-made civic illustration"],
  ["hiring.jpg", "We Are Hiring", "Linear", "Productivity", "Launch", "orange hiring poster with cable-like line art and workstation objects"],
  ["lego.jpg", "My Child the Artist", "Figma", "Collaboration", "Static", "classic toy poster with hand placing blocks and tender editorial copy"],
  ["metro.jpg", "Multiple Stops Along Your Route", "Linear", "Productivity", "Static", "green transit-map poster with vertical route and numbered stops"],
  ["vacay.jpg", "Show the World You Mean Business", "Stripe", "Fintech", "Static", "vintage business-card ad with hand-held card and dense editorial proof"],
];

const uploadedCreatives: Creative[] = [...additionalUploadedSeeds, ...uploadedSeeds].map(
  ([filename, title, brandInspiration, industry, format, visualDirection], index) => ({
    id: `uploaded-${index + 1}`,
    title,
    slug: `uploaded-${index + 1}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
    brandInspiration,
    industry,
    format,
    visualStyleTags: ["uploaded", "reference", "editorial"],
    premium: index % 4 !== 0,
    image: `/ads/${filename}`,
    shortDescription: `${brandInspiration}-adjacent ${format.toLowerCase()} reference for ${industry.toLowerCase()} teams.`,
    whyItWorks: buildUploadedWhyItWorks(visualDirection, format, industry),
    structureNotes:
      "Start with a single plain claim. Pair it with one memorable object, artifact, or scene. Keep the supporting copy secondary, use generous negative space, and leave one clear action or proof cue near the edge.",
    fullPrompt:
      `Create a high-fidelity original tech/SaaS ad based on this reference direction: ${visualDirection}. Reconstruct the visual logic closely while replacing any real logo, brand mark, trademarked object, and exact source copy with fictional equivalents. Match the reference's canvas feel, hierarchy, object count, typography weight, negative space, palette, lighting, texture, margin system, and headline placement. Make it suitable for a ${industry.toLowerCase()} product inspired by ${brandInspiration}'s restraint and composed enough to work as a ${format} ad. Use one clear visual metaphor, a short confident headline, and no hype.`,
    reconstructionPrompt:
      `Recreate this ad as an original fictional ${industry.toLowerCase()} SaaS ad, keeping the source image's composition as closely as possible without copying real logos, brand marks, or exact wording. Visual direction: ${visualDirection}. Preserve the canvas ratio, amount of negative space, primary subject placement, type scale, headline position, color temperature, border/margin rhythm, lighting style, and editorial pacing. Replace the source brand with a fictional product. Use a short plainspoken headline in the same approximate location and line length. Keep secondary copy minimal. Output should look like a close cousin of the reference at first glance, not just a generic ad in the same category.`,
    remixPrompt:
      `Create a fresh ${industry.toLowerCase()} ad inspired by this reference strategy: ${visualDirection}. Keep the calm editorial restraint and one-metaphor structure, but change the subject, headline, and product context so it becomes a new concept for a fictional ${brandInspiration}-inspired SaaS product.`,
    editableVariables: [
      "Product category",
      "Primary claim",
      "Visual metaphor",
      "Audience",
      "Proof detail",
      "CTA",
    ],
    negativePrompt:
      "No copied logos, no exact brand assets, no stock-photo people, no fake performance claims, no purple AI glow, no busy dashboard collage, no exclamation marks, no hype language.",
    recommendedModel: index % 3 === 0 ? "Midjourney v7" : index % 3 === 1 ? "GPT-4.1 image" : "Ideogram 3.0",
    aspectRatio: format === "LinkedIn" ? "4:5" : format === "Meta" ? "1:1" : "4:5",
    remixNotes: [
      "Replace the metaphor with a product-specific artifact.",
      "Keep the headline under seven words.",
      "Use the same layout with a different proof point.",
    ],
    visual: {
      headline: title,
      subline: "Uploaded reference.",
      background: "#f5efe6",
      accent: "#7a5c38",
      motif: "docs",
    },
  }),
);

export const creatives: Creative[] = [...uploadedCreatives, ...generatedCreatives];

export function getCreativeBySlug(slug: string) {
  return creatives.find((creative) => creative.slug === slug);
}
