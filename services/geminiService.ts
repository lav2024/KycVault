import { GoogleGenAI, Type, Schema } from "@google/genai";
import { KycSubmission, RiskLevel } from "../types";

// Define the response schema for Gemini
const kycResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    extractedName: { type: Type.STRING, description: "Name extracted from the document" },
    extractedDob: { type: Type.STRING, description: "Date of Birth extracted from the document (YYYY-MM-DD) or 'Not Found'" },
    extractedGender: { type: Type.STRING, description: "Gender extracted from the document" },
    docType: { type: Type.STRING, description: "Type of document (e.g., Aadhaar, PAN, DL, Passport)" },
    docNumber: { type: Type.STRING, description: "Unique ID number from the document" },
    matchStatus: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.BOOLEAN, description: "True if extracted name matches user provided name closely" },
        dob: { type: Type.BOOLEAN, description: "True if extracted DOB matches user provided DOB" },
        gender: { type: Type.BOOLEAN, description: "True if extracted gender matches user provided gender" }
      },
      required: ["name", "dob", "gender"]
    },
    fraudScore: { type: Type.INTEGER, description: "0-100 score indicating probability of fraud" },
    riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"], description: "Overall risk assessment" },
    explanation: { type: Type.STRING, description: "Brief explanation of the fraud score and risk level" }
  },
  required: ["extractedName", "extractedDob", "extractedGender", "docType", "docNumber", "matchStatus", "fraudScore", "riskLevel", "explanation"]
};

export const analyzeDocumentWithGemini = async (
  base64Image: string,
  userProvidedData: { fullName: string; dob: string; gender: string }
): Promise<KycSubmission['aiAnalysis']> => {
  
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is missing in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Clean base64 string if it contains metadata prefix
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  const prompt = `
    Analyze this identity document image for KYC verification.
    
    User Provided Details:
    - Name: ${userProvidedData.fullName}
    - Date of Birth: ${userProvidedData.dob}
    - Gender: ${userProvidedData.gender}

    Tasks:
    1. Identify the document type (Aadhaar, PAN, Driving License, Passport, etc.).
    2. Extract the Name, DOB, Gender, and ID Number from the image. If a field is missing or illegible, mark it as "Not Found" or "NA".
    3. Compare the extracted details with the User Provided Details.
       - Allow for minor OCR errors or case differences in Name.
       - DOB must match exactly.
    4. Calculate a Fraud Score (0-100) and assign a Risk Badge (Low, Medium, High).
       - High Risk/High Score: DOB mismatch, Name completely different, Document looks fake/edited, or Face/Text is blurry.
       - Medium Risk: Minor name typo, glare on ID number.
       - Low Risk: Data matches perfectly, document is clear.
    5. Provide a short explanation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: kycResponseSchema,
        temperature: 0.1, // Low temperature for factual extraction
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from Gemini");

    const parsedResult = JSON.parse(resultText);

    return {
      documentData: {
        extractedName: parsedResult.extractedName,
        extractedDob: parsedResult.extractedDob,
        extractedGender: parsedResult.extractedGender,
        docType: parsedResult.docType,
        docNumber: parsedResult.docNumber,
        matchStatus: parsedResult.matchStatus
      },
      riskLevel: parsedResult.riskLevel as RiskLevel,
      fraudScore: parsedResult.fraudScore,
      explanation: parsedResult.explanation
    };

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback for demo purposes if API fails or quota exceeded
    return {
      documentData: {
        extractedName: "Error Extracting",
        extractedDob: "NA",
        extractedGender: "NA",
        docType: "Unknown",
        docNumber: "NA",
        matchStatus: { name: false, dob: false, gender: false }
      },
      riskLevel: RiskLevel.HIGH,
      fraudScore: 99,
      explanation: "AI Analysis failed due to network or API error. Manual review required."
    };
  }
};
