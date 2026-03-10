const Section = ({ title, children }) => (
    <div className="policy-section">
        <h2 className="policy-heading">{title}</h2>
        {children}
    </div>
);

export default function PrivacyPage() {
    return (
        <div className="info-page fade-in">
            <section className="info-hero">
                <span className="info-tag">◎ Legal</span>
                <h1 className="info-hero-title">
                    Privacy <span className="text-accent">Policy</span>
                </h1>
                <p className="info-hero-sub">
                    Last updated: March 2026 · Subconscious Influence Mapper (SIM)
                </p>
            </section>

            <section className="info-section">
                <div className="policy-doc">
                    <Section title="1. Overview">
                        <p>
                            Subconscious Influence Mapper ("SIM", "we", "us") is committed to protecting your
                            privacy. This policy explains what data we collect, how we use it, and how it is
                            stored. By creating an account and participating in experiments, you agree to the
                            practices described below.
                        </p>
                    </Section>

                    <Section title="2. Data We Collect">
                        <p>We collect the following categories of information:</p>
                        <ul className="policy-list">
                            <li>
                                <strong>Account data:</strong> Your email address, used to authenticate your
                                account via Firebase Authentication.
                            </li>
                            <li>
                                <strong>Experiment responses:</strong> The options you select during each
                                experiment question, and your self-reported confidence rating.
                            </li>
                            <li>
                                <strong>Behavioral telemetry:</strong> Response time (ms), mouse cursor travel
                                distance (px), option hover duration (ms), option switch count, and scroll
                                pause duration (ms) recorded during experiment sessions.
                            </li>
                            <li>
                                <strong>Bias scores:</strong> Calculated framing, authority, emotional, and
                                confirmation bias scores, and the derived Manipulation Vulnerability Index.
                            </li>
                            <li>
                                <strong>Session metadata:</strong> Experiment start and end timestamps,
                                session status, and total question count.
                            </li>
                        </ul>
                        <p style={{ marginTop: 12 }}>
                            We do <strong>not</strong> collect your name, physical address, payment information,
                            camera/microphone data, or any device identifiers beyond those automatically
                            processed by Firebase.
                        </p>
                    </Section>

                    <Section title="3. Behavioral Interaction Tracking">
                        <p>
                            SIM tracks your behavioral interactions <em>only within the context of active
                                experiment sessions</em>. Tracking is scoped entirely to the experiment interface
                            and begins when you click "Begin Experiment" and ends when the last question is
                            answered. We do not track behavior on any other page of the application, and we
                            do not use cookies or third-party trackers.
                        </p>
                        <p style={{ marginTop: 12 }}>
                            The behavioral signals collected (hover time, mouse distance, scroll pauses) are
                            used exclusively to calculate your cognitive bias scores. They are stored as
                            numeric values in Firestore and are never shared with third parties for advertising,
                            profiling, or marketing purposes.
                        </p>
                    </Section>

                    <Section title="4. Data Storage">
                        <p>
                            All data is stored in Google Firebase Firestore (Google Cloud). Your data is
                            associated with your Firebase UID and is protected by Firestore security rules.
                            Firebase is a SOC 2, ISO 27001, and GDPR-compliant platform. Data is stored in
                            Google's data centers and subject to Google's infrastructure security guarantees.
                        </p>
                        <p style={{ marginTop: 12 }}>
                            Analytics data (Firebase Analytics) may be collected by Google for
                            aggregate platform usage metrics, subject to Google's own privacy policy.
                        </p>
                    </Section>

                    <Section title="5. How We Use Your Data">
                        <ul className="policy-list">
                            <li>To calculate and display your cognitive bias profile.</li>
                            <li>To track your experiment history and Manipulation Vulnerability Index over time.</li>
                            <li>To allow you to export your own analytics data as CSV.</li>
                            <li>For aggregate, non-personally-identifiable research insights.</li>
                        </ul>
                        <p style={{ marginTop: 12 }}>
                            We do not sell, rent, or share your personal data with any third party.
                        </p>
                    </Section>

                    <Section title="6. Your Rights">
                        <ul className="policy-list">
                            <li><strong>Access:</strong> You can view your experiment history and scores at any time via your Dashboard.</li>
                            <li><strong>Export:</strong> You can download all your data as CSV using the Download Report feature.</li>
                            <li><strong>Deletion:</strong> To request deletion of your account and all associated data, contact us at privacy@sim-research.dev.</li>
                        </ul>
                    </Section>

                    <Section title="7. Cookies">
                        <p>
                            SIM uses only Firebase Authentication session cookies to maintain your login
                            state. We do not use advertising cookies, tracking pixels, or cross-site
                            analytics cookies.
                        </p>
                    </Section>

                    <Section title="8. Contact">
                        <p>
                            For privacy-related inquiries, email us at{" "}
                            <a href="mailto:privacy@sim-research.dev" className="auth-link">
                                privacy@sim-research.dev
                            </a>.
                        </p>
                    </Section>
                </div>
            </section>
        </div>
    );
}
