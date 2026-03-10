export default function ProgressBar({ current, total }) {
    const pct = Math.round((current / total) * 100);
    return (
        <div className="progress-wrap">
            <div className="progress-meta">
                <span className="progress-tag">Question</span>
                <span className="progress-count">
                    {current}<span>/{total}</span>
                </span>
            </div>

            <div className="progress-track">
                <div
                    className="progress-fill"
                    style={{ width: `${pct}%` }}
                />
            </div>

            <span className="progress-pct">{pct}%</span>
        </div>
    );
}
