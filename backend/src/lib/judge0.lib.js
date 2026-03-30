import axios from "axios"

const sleep = (ms) => 
    new Promise(resolve => setTimeout(resolve, ms));

export const getJudge0LangId = (language) => {
    if(!language) console.log("Empty language");
    

    const languageMap = {
        "JAVA": 62,       
        "PYTHON": 71,      
        "JAVASCRIPT": 63,  
        "CPP": 54  
    }

    return languageMap[language]
}

export const getJudge0LangName = (id) => {
    if(!id) console.log("Empty language");
    

    const languageMap = {
        62: "JAVA",       
        71: "PYTHON",      
        63: "JAVASCRIPT",  
        54: "CPP"  
    }

    return languageMap[id]
}

export const submitBatch = async(submissions) => {
    const url = `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`
    const { data } = await axios.post(url, { submissions })

    console.log("Data: ", data);
    
    return data
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