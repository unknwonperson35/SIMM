import {
    collection,
    addDoc,
    doc,
    updateDoc,
    query,
    where,
    orderBy,
    getDocs,
    serverTimestamp,
    increment,
} from "firebase/firestore";
import { db } from "../firebase";

// --- EXPERIMENT SESSIONS ---

export const createSession = async (userId, totalQuestions) => {
    const sessionRef = await addDoc(collection(db, "experiment_sessions"), {
        user_id: userId,
        status: "in_progress",
        started_at: serverTimestamp(),
        completed_at: null,
        total_questions: totalQuestions,
    });
    return sessionRef.id;
};

export const completeSession = async (sessionId) => {
    await updateDoc(doc(db, "experiment_sessions", sessionId), {
        status: "completed",
        completed_at: serverTimestamp(),
    });
};

// --- RESPONSES ---

export const saveResponse = async (responseData) => {
    await addDoc(collection(db, "responses"), {
        ...responseData,
        created_at: serverTimestamp(),
    });
};

// --- BIAS SCORES ---

export const saveBiasScores = async (scoreData) => {
    await addDoc(collection(db, "bias_scores"), {
        ...scoreData,
        calculated_at: serverTimestamp(),
    });
};

// --- USER STATS UPDATE ---

export const updateUserStats = async (userId, manipulationIndex) => {
    await updateDoc(doc(db, "users", userId), {
        experiments_completed: increment(1),
        latest_manipulation_index: manipulationIndex,
    });
};

// --- ANALYTICS QUERIES ---

export const getUserBiasHistory = async (userId) => {
    const q = query(
        collection(db, "bias_scores"),
        where("user_id", "==", userId)
    );
    const snapshot = await getDocs(q);
    // Convert Firestore snapshot into an array using snapshot.docs.map(doc => doc.data())
    const data = snapshot.docs.map(doc => doc.data());
    // Sort on client side to avoid composite index requirement
    return data.sort((a, b) => {
        const tA = a.calculated_at?.toMillis?.() || 0;
        const tB = b.calculated_at?.toMillis?.() || 0;
        return tA - tB;
    });
};

export const getUserSessions = async (userId) => {
    const q = query(
        collection(db, "experiment_sessions"),
        where("user_id", "==", userId),
        orderBy("started_at", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};
