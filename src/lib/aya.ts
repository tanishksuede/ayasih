/**
 * AYA landing page configuration + content.
 *
 * GAME_ROUTE points at the EXISTING AYA game. Change this one constant to
 * re-point every "START YOUR JOURNEY" CTA on the landing page.
 */
export const GAME_ROUTE = "/game";

export const INCUBATION_LINE = "An IIT-incubated startup";

/** Relatable situations → how AYA reframes them through real journeys. */
export const REFRAMES: { you: string; aya: string }[] = [
  {
    you: "I don't know what I'm good at.",
    aya: "Let's see how someone who once felt uncertain discovered their strengths.",
  },
  {
    you: "I feel behind.",
    aya: "At your age, they hadn't started either. Here's what changed.",
  },
  {
    you: "I failed.",
    aya: "Someone remarkable failed too. What did they do next?",
  },
  {
    you: "I don't know what to choose.",
    aya: "Watch how one person narrowed six options down to one.",
  },
  {
    you: "I've lost motivation.",
    aya: "Their motivation broke too. Here's what carried them through it.",
  },
  {
    you: "I don't know where I'm going.",
    aya: "Nobody had a map. Let's look at how theirs got drawn.",
  },
];

export const FLOW_NODES = [
  { label: "YOUR ANSWERS", note: "What you pick, skip and linger on." },
  { label: "YOUR PATTERNS", note: "How you decide, again and again." },
  { label: "YOUR STRENGTHS", note: "What you keep doing well." },
  { label: "YOUR MATCHES", note: "Journeys that feel like yours." },
  { label: "YOUR DISCOVERIES", note: "Things you didn't know you knew." },
];

export const JOURNEY_STEPS = [
  { n: "01", title: "DISCOVER YOURSELF", copy: "A few questions. No right answers." },
  { n: "02", title: "MEET THEIR JOURNEYS", copy: "People at exactly the age you are." },
  { n: "03", title: "UNDERSTAND YOUR PATTERNS", copy: "AYA notices how you choose." },
  { n: "04", title: "DISCOVER YOUR POSSIBILITIES", copy: "Strengths you show, not claim." },
  { n: "05", title: "FIND YOUR DIRECTION", copy: "Where those strengths could lead." },
];

export const OUTCOMES = [
  { n: "01", title: "PERSPECTIVE", copy: "See your age differently." },
  { n: "02", title: "INSPIRATION", copy: "Learn from people who faced real challenges." },
  { n: "03", title: "SELF-DISCOVERY", copy: "Understand your strengths and patterns." },
  { n: "04", title: "DIRECTION", copy: "Explore possibilities that may fit who you are." },
];

export const DISCOVERY_FACETS = [
  "personality",
  "strengths",
  "interests",
  "decision-making",
  "mindset",
  "preferences",
];

export const CAREER_FIELDS = [
  "Technology",
  "Design",
  "Business",
  "Research",
  "Media",
  "Leadership",
  "Science",
  "Creative Fields",
];

/**
 * Idol carousel data.
 */
export type Idol = {
  name: string;
  age: string;
  doing: string;
  challenge: string;
  lesson: string;
};

export const IDOLS: Idol[] = [
  {
    name: "Personality name",
    age: "16",
    doing: "Still in school, building small things nobody asked for.",
    challenge: "Nobody around them understood what they were trying to do.",
    lesson: "Being early looks like being lost.",
  },
  {
    name: "Personality name",
    age: "17",
    doing: "Failed the one exam their whole plan depended on.",
    challenge: "A year that felt completely wasted.",
    lesson: "A closed door forced a better question.",
  },
  {
    name: "Personality name",
    age: "18",
    doing: "Switched fields entirely, three months in.",
    challenge: "Explaining the switch to everyone who doubted it.",
    lesson: "Changing direction isn't starting over.",
  },
  {
    name: "Personality name",
    age: "19",
    doing: "Working a job that had nothing to do with the dream.",
    challenge: "Time and energy for the real work barely existed.",
    lesson: "Small, boring consistency compounded.",
  },
  {
    name: "Personality name",
    age: "20",
    doing: "Rejected by the place they wanted most.",
    challenge: "Believing they were behind everyone their age.",
    lesson: "The timeline was never real.",
  },
  {
    name: "Personality name",
    age: "21",
    doing: "First attempt collapsed, publicly.",
    challenge: "Starting again with an audience watching.",
    lesson: "The second attempt was sharper for it.",
  },
];
