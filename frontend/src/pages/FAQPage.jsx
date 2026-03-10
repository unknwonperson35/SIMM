import { useState } from "react";

const FAQS = [
    {
        q: "What is the Subconscious Influence Mapper?",
        a: "SIM is a behavioral psychology research platform that runs structured cognitive experiments to detect and quantify unconscious biases in your decision-making. It uses response telemetry — time, mouse movement, hover patterns — combined with psychologically-designed questions to calculate your cognitive bias profile.",
    },
    {
        q: "What are cognitive biases?",
        a: "Cognitive biases are systematic patterns of deviation from rational judgment, where inferences about situations are drawn in an illogical fashion. They arise from mental shortcuts (heuristics), emotions, social pressure, and memory limitations. SIM measures four primary biases: framing, authority, emotional, and confirmation bias.",
    },
    {
        q: "How does the experiment work?",
        a: "You answer 12 carefully designed questions presented one at a time. Each question targets a specific bias category by presenting two semantically equivalent but differently framed options. While you answer, the system records your behavioral telemetry in real time. After completion, a scoring algorithm analyzes all signals to produce your bias profile.",
    },
    {
        q: "What is behavioral telemetry?",
        a: "Behavioral telemetry is the real-time recording of your interaction patterns during the experiment. SIM tracks: response time (how long you take to answer), mouse distance (how much you move the cursor), hover duration (how long you hover over options), option switches (how often you change selection), scroll pauses, and your self-reported confidence rating.",
    },
    {
        q: "How are bias scores calculated?",
        a: "Each bias score is calculated using a weighted multi-signal algorithm. For example, Framing Bias factors in whether you chose the loss-framed option, how many times you switched options, how confident you were, and how quickly you answered. Scores range from 0 to 100, with higher scores indicating greater susceptibility to that bias.",
    },
    {
        q: "What is the Manipulation Vulnerability Index (MVI)?",
        a: "The MVI is your composite bias score — the arithmetic average of your four individual bias scores. It represents your overall susceptibility to subconscious influence on a 0–100 scale: Minimal (0–24), Low (25–49), Moderate (50–74), or High (75–100).",
    },
    {
        q: "Can I run multiple experiments?",
        a: "Yes. You can run as many experiments as you like. Each session is stored separately, and your dashboard shows historical trends of how your MVI changes over time. This allows you to track shifts in your cognitive bias susceptibility across sessions.",
    },
    {
        q: "Is my data stored securely?",
        a: "All data is stored in Google Firebase Firestore, a production-grade NoSQL cloud database with security rules. Your experiment data is linked to your authenticated user account. We collect only the behavioral data described — we do not collect personal identifiers beyond your email address used for authentication.",
    },
    {
        q: "Can I export my data?",
        a: "Yes. From your Analytics Dashboard, you can click 'Download Report' to export all your experiment history as a CSV file. The file includes your framing, authority, emotional, and confirmation scores plus MVI for every session.",
    },
    {
        q: "Are the results scientifically accurate?",
        a: "SIM is a research and educational tool. The scoring algorithm is based on established behavioral psychology principles, but this platform is not a clinical diagnostic tool. Results should be interpreted as approximate indicators of bias susceptibility for educational and self-reflection purposes, not clinical conclusions.",
    },
];

function FAQItem({ item, index }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`faq-item${open ? " faq-item--open" : ""}`}>
            <button className="faq-q" onClick={() => setOpen(o => !o)} id={`faq-${index}`}>
                <span className="faq-q-text">{item.q}</span>
                <span className="faq-chevron">{open ? "−" : "+"}</span>
            </button>
            {open && (
                <div className="faq-a fade-in">
                    <p>{item.a}</p>
                </div>
            )}
        </div>
    );
}

export default function FAQPage() {
    return (
        <div className="info-page fade-in">
            <section className="info-hero">
                <span className="info-tag">◎ Frequently Asked Questions</span>
                <h1 className="info-hero-title">
                    Everything You Need to Know About{" "}
                    <span className="text-accent">SIM</span>
                </h1>
                <p className="info-hero-sub">
                    Answers to the most common questions about the platform, experiments,
                    bias scoring, and data privacy.
                </p>
            </section>

            <section className="info-section">
                <div className="faq-list">
                    {FAQS.map((item, idx) => (
                        <FAQItem key={idx} item={item} index={idx} />
                    ))}
                </div>
            </section>

            <section className="info-section">
                <div className="info-card info-card--highlight" style={{ textAlign: "center" }}>
                    <p className="info-card-body">
                        Still have questions?{" "}
                        <a href="/contact" className="auth-link">Contact us →</a>
                    </p>
                </div>
            </section>
        </div>
    );
}
