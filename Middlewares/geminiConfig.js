import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = "AIzaSyB1jMMF_FMRJiWZKIb1CtuSqvI3gZMysRg"

const genAI = new GoogleGenerativeAI(apiKey)

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
})

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
}

export { model, generationConfig }
