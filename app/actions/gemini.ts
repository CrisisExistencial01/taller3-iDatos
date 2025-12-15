'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateConclusions(contextData: string) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("GEMINI_API_KEY is not set in environment variables");
        return "Error: La clave de API de Gemini no está configurada. Por favor, añade GEMINI_API_KEY a tu archivo .env.local.";
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Actúa como un analista de datos experto. Basándote en los siguientes datos resumidos del Reporte de Felicidad Mundial, genera una conclusión concisa, profesional y perspicaz (máximo 80 palabras) en español. 
    
    Enfócate en:
    1. Tendencias generales a lo largo de los años.
    2. Regiones con mejor desempeño.
    3. Factores potenciales (menciona correlaciones generales si aplica, aunque no tengas los datos crudos de factores).
    
    Datos proporcionados:
    ${contextData}
    
    Respuesta (solo el texto del análisis):`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error("Error generating content with Gemini:", error);
        return "Error al generar conclusiones con IA. Por favor, intenta de nuevo más tarde.";
    }
}
