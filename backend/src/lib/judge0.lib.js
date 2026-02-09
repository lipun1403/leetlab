import asyncHandler from "../utils/asyncHandler"

export const getJudge0LangId = (language) => {
    const languageMap = {
        "JAVA": 62,       
        "PYTHON": 71,      
        "JAVASCRIPT": 63,  
        "C++": 54  
    }

    return languageMap[language.toUpperCase()]
}

export const submitBatch = async(submissions) => {
    const {data} = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{
        submissions
    })
}

export const pollBatchResults = async(tokens) => {
    while(true) {
        const { data } = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`, {
            params: {
                tokens: tokens.join(","),
                base64_encoded: false
            }
        })

        const results = data.submissions

        const isAlldone = results.every(
            (r) => r.status.id !== 1 && r.status.id !== 2
        )

        if(isAlldone) return results

        await sleep(1000)
    }
}