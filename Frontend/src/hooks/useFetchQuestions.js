import { useState } from "react"
import { toast } from "react-hot-toast"

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getRandomElementsFromArray(array, count) {
    if (count > array.length) {
        throw new Error("Count exceeds array length");
    }

    const shuffledArray = shuffleArray(array);
    return shuffledArray.slice(0, count);
}

export default function useFetchQuestions() {
    const [loading, setLoading] = useState(false)
    const [questions, setQuestions] = useState([])

    const fetchQuestions = async (round, timeLimit) => {
        const success = handleInputErrors(round, timeLimit)
        if (!success) return

        setLoading(true)
        try {
            let fetchedQuestions = [];

            if (round == "apti") {
                const response = await fetch(`http://localhost:8000/api/questions/apti`)
                const data = await response.json()
                if (data.error) throw new Error(data.error)
                fetchedQuestions = data.aptiQuestions;
            }
            else if (round == "cs") {
                const response = await fetch(`http://localhost:8000/api/questions/cs`)
                const data = await response.json()
                if (data.error) throw new Error(data.error)
                fetchedQuestions = data.csQuestions;
            }
            else {
                const response = await fetch(`http://localhost:8000/api/questions/coding`)
                const data = await response.json()
                if (data.error) throw new Error(data.error)
                fetchedQuestions = data.codingQuestions;
            }
            
            // Shuffle and select random elements
            const randomQuestions = getRandomElementsFromArray(fetchedQuestions, timeLimit);
            setQuestions(randomQuestions);

        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return { loading, questions, fetchQuestions }
}

function handleInputErrors(round, timeLimit) {
    if (!round || !timeLimit) {
        toast.error("All fields are required")
        return false
    }

    return true
}
