import axios from "axios";

const encode = (str) => {
    if (str === null || str === undefined) return str;
    return Buffer.from(str).toString("base64");
};

const decode = (str) => {
    if (!str) return str;
    return Buffer.from(str, "base64").toString("utf-8");
};
export const submitBatch = async (submissions) => {
    const encodedSubmissions = submissions.map((s) => ({
        ...s,
        source_code: encode(s.source_code),
        stdin: encode(s.stdin),
        expected_output: encode(s.expected_output)
    }));

    const url = `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=true`;

    const { data } = await axios.post(url, {
        submissions: encodedSubmissions
    });

    console.log("Data:", data);

    return data;
};

export const pollBatchResults = async (tokens) => {
    const maxAttempts = 30;
    let attempts = 0;

    const tokenString = tokens.join(",");

    while (attempts < maxAttempts) {
        try {
            const { data } = await axios.get(
                `${process.env.JUDGE0_API_URL}/submissions/batch`,
                {
                    params: {
                        tokens: tokenString,
                        base64_encoded: true
                    }
                }
            );

            const results = data.submissions.map((r) => ({
                ...r,
                stdout: decode(r.stdout),
                stderr: decode(r.stderr),
                compile_output: decode(r.compile_output),
                message: decode(r.message)
            }));

            const isAlldone = results.every(
                (r) => r.status.id !== 1 && r.status.id !== 2
            );

            if (isAlldone) return results;

            await sleep(1000);
            attempts++;

        } catch (error) {
            console.log("Judge0 status:", error.response?.status);
            console.log("Judge0 error:", error.response?.data);
            console.log("Token string:", tokenString);
            throw error;
        }
    }

    throw new Error("Judge0 polling timeout");
};



export const getJudge0LanguageId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
    CPP: 54
  };
  return languageMap[language.toUpperCase()];
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function getLanguageName(languageId) {
  const LANGUAGE_NAMES = {
    63: "JavaScript",
    71: "Python",
    62: "Java",
    54: "CPP"
  };

  return LANGUAGE_NAMES[languageId] || "Unknown";
}