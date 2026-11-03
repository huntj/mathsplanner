// The test version's feedback link. It is set when the app is built, from the VITE_FEEDBACK_URL
// environment variable (the LEARN_FEEDBACK_URL repository variable in the deploy workflow), so a
// form can be added or changed without touching the code. Without one, no link is shown.
const raw: unknown = import.meta.env.VITE_FEEDBACK_URL;

export const FEEDBACK_URL =
  typeof raw === "string" && /^https:\/\/\S+$/.test(raw.trim()) ? raw.trim() : undefined;
