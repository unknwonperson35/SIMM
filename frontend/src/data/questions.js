/**
 * Psychological Question Bank
 * 20 questions across 4 bias categories.
 * Each question has two options:
 *   A = neutral / authority-labelled / confirmation-seeking
 *   B = loss-framed / emotionally loaded / manipulated
 */
export const QUESTIONS = [
    // ── FRAMING BIAS (3 questions) ──────────────────────────────────────────
    {
        id: "f1",
        bias_category: "framing",
        text: "A new medical treatment is available. Which do you prefer?",
        option_a: "The treatment has a 90% survival rate.",
        option_b: "10% of patients die with this treatment.",
        tip: "Both options describe the same statistic.",
    },
    {
        id: "f2",
        bias_category: "framing",
        text: "You're evaluating a product quality report. Which description feels more reassuring?",
        option_a: "95 out of 100 units pass quality inspection.",
        option_b: "5 out of 100 units are found defective.",
        tip: "Identical data, different framing.",
    },
    {
        id: "f3",
        bias_category: "framing",
        text: "A city is implementing a crime reduction program. Which outcome do you support?",
        option_a: "The program will prevent 400 crimes per year.",
        option_b: "Without this program, 400 extra crimes per year will occur.",
        tip: "Notice how gain vs. loss framing affects your perception.",
    },

    // ── AUTHORITY BIAS (3 questions) ─────────────────────────────────────────
    {
        id: "a1",
        bias_category: "authority",
        text: "You read a claim about sleep. Which source do you find more credible?",
        option_a: "Harvard Medical School: Adults need 7–9 hours of sleep nightly.",
        option_b: "Personal experience: Most successful people sleep 5–6 hours.",
        tip: "Does the institution change your belief in the data?",
    },
    {
        id: "a2",
        bias_category: "authority",
        text: "Two people give you investment advice. Whose do you follow?",
        option_a: "A certified CFA with 20 years of experience in equity markets.",
        option_b: "A friend who made significant profits trading last year.",
        tip: "Credentials vs. anecdotal success.",
    },
    {
        id: "a3",
        bias_category: "authority",
        text: "You encounter two statements about climate science.",
        option_a: "97% of climate scientists agree on human-caused warming.",
        option_b: "A Nobel physicist disputes the climate consensus.",
        tip: "How do you weigh consensus vs. individual authority?",
    },

    // ── EMOTIONAL BIAS (3 questions) ──────────────────────────────────────────
    {
        id: "e1",
        bias_category: "emotional",
        text: "A charity asks for a donation to fight poverty.",
        option_a: "Your donation funds programs helping 10,000 people this year.",
        option_b: "Meet Amara, 7, who hasn't eaten in three days. You can change that.",
        tip: "Statistical impact vs. individual story.",
    },
    {
        id: "e2",
        bias_category: "emotional",
        text: "You're reading about an immigration policy.",
        option_a: "Policy reduces irregular immigration by 43% based on border data.",
        option_b: "Families torn apart, children separated at borders under this policy.",
        tip: "Data vs. emotional narrative.",
    },
    {
        id: "e3",
        bias_category: "emotional",
        text: "A product review describes the same experience two ways.",
        option_a: "Adequate performance within expected parameters.",
        option_b: "Finally something that doesn't make me want to scream.",
        tip: "Neutral vs. emotionally resonant language.",
    },

    // ── CONFIRMATION BIAS (3 questions) ──────────────────────────────────────
    {
        id: "c1",
        bias_category: "confirmation",
        text: "You believe social media harms mental health. Which study do you want to read more about?",
        option_a: "Study: Social media linked to anxiety and depression in teens.",
        option_b: "Study: Social media communities reduce isolation for at-risk youth.",
        tip: "Do you seek confirming or challenging information?",
    },
    {
        id: "c2",
        bias_category: "confirmation",
        text: "You're skeptical of remote work productivity.",
        option_a: "Research shows remote workers are 13% less collaborative.",
        option_b: "Stanford study finds remote workers are 13% more productive.",
        tip: "Which finding matches your existing belief?",
    },
    {
        id: "c3",
        bias_category: "confirmation",
        text: "You think healthy eating is expensive. Which statement feels more true?",
        option_a: "Whole foods and produce cost significantly more than processed options.",
        option_b: "With planning, a nutritious diet can be cheaper than fast food.",
        tip: "Our beliefs filter our acceptance of evidence.",
    },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
