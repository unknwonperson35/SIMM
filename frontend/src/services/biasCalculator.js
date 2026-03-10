/**
 * Bias Calculator
 * Calculates four cognitive bias scores from experiment response telemetry.
 * Each score is 0-100 where higher = more susceptible to that bias.
 */

/**
 * Normalize a value to 0-100 range given min/max boundaries.
 */
const normalize = (value, min, max) => {
    if (max === min) return 50;
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
};

/**
 * Framing Bias — tendency to be swayed by how options are worded.
 * Signals: chose the "loss-framed" option, high option_switches, low confidence.
 */
const calcFramingScore = (responses) => {
    const framingResponses = responses.filter(
        (r) => r.bias_category === "framing"
    );
    if (framingResponses.length === 0) return 50;

    let score = 0;
    framingResponses.forEach((r) => {
        // Chose manipulated option
        if (r.selected_option === "B") score += 30;
        // Many option switches = indecision driven by framing
        score += normalize(r.option_switches || 0, 0, 5) * 0.3;
        // Low confidence after choosing = framing uncertainty
        score += normalize(10 - (r.confidence_rating || 5), 0, 10) * 0.2;
        // Fast response = gut reaction to framing
        if ((r.response_time || 5000) < 3000) score += 20;
    });

    return Math.min(100, score / framingResponses.length);
};

/**
 * Authority Bias — deferring to authority-labeled options.
 * Signals: chose authority-labeled option, high hover on authority text.
 */
const calcAuthorityScore = (responses) => {
    const authResponses = responses.filter(
        (r) => r.bias_category === "authority"
    );
    if (authResponses.length === 0) return 50;

    let score = 0;
    authResponses.forEach((r) => {
        // Chose the authority option
        if (r.selected_option === "A") score += 40;
        // Long hover on authority option = deliberating on authority label
        score += normalize(r.hover_time || 0, 0, 5000) * 0.3;
        // High scroll pause = processing authority cue
        score += normalize(r.scroll_pause || 0, 0, 3000) * 0.2;
        // Low option switches = immediate deference
        score += normalize(5 - (r.option_switches || 0), 0, 5) * 0.1;
    });

    return Math.min(100, score / authResponses.length);
};

/**
 * Emotional Bias — responding to emotionally charged language.
 * Signals: high hover time, slow response, chose emotionally charged option.
 */
const calcEmotionalScore = (responses) => {
    const emoResponses = responses.filter(
        (r) => r.bias_category === "emotional"
    );
    if (emoResponses.length === 0) return 50;

    let score = 0;
    emoResponses.forEach((r) => {
        // Chose emotionally loaded option (B)
        if (r.selected_option === "B") score += 35;
        // Very slow OR very fast = emotional engagement
        const rt = r.response_time || 5000;
        if (rt > 8000 || rt < 2000) score += 25;
        // High hover = dwelling on emotional content
        score += normalize(r.hover_time || 0, 0, 6000) * 0.25;
        // Many mouse movements = agitation
        score += normalize(r.mouse_distance || 0, 0, 1500) * 0.15;
    });

    return Math.min(100, score / emoResponses.length);
};

/**
 * Confirmation Bias — choosing options that align with prior beliefs.
 * Signals: consistent A or B choices, low option switches, high confidence.
 */
const calcConfirmationScore = (responses) => {
    const confResponses = responses.filter(
        (r) => r.bias_category === "confirmation"
    );
    if (confResponses.length === 0) return 50;

    const totalA = confResponses.filter((r) => r.selected_option === "A").length;
    const totalB = confResponses.filter((r) => r.selected_option === "B").length;
    const consistency =
        Math.abs(totalA - totalB) / Math.max(confResponses.length, 1);

    // Consistency contributes up to 65% of the score per question
    let score = normalize(consistency, 0, 1) * 0.65 * confResponses.length;

    confResponses.forEach((r) => {
        // High confidence = confirmation (no doubt)
        score += normalize(r.confidence_rating || 5, 0, 10) * 0.2;
        // Low switches = no reconsideration
        score += normalize(5 - (r.option_switches || 0), 0, 5) * 0.15;
    });

    return Math.min(100, score / confResponses.length);
};

/**
 * Main calculator: returns an object with all bias scores + manipulation index.
 */
export const calculateBiasScores = (responses) => {
    const framing_score = Math.round(calcFramingScore(responses));
    const authority_score = Math.round(calcAuthorityScore(responses));
    const emotional_score = Math.round(calcEmotionalScore(responses));
    const confirmation_score = Math.round(calcConfirmationScore(responses));
    const manipulation_index = Math.round(
        (framing_score + authority_score + emotional_score + confirmation_score) / 4
    );

    return {
        framing_score,
        authority_score,
        emotional_score,
        confirmation_score,
        manipulation_index,
    };
};
