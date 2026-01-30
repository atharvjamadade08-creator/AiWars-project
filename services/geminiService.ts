
import { GoogleGenAI, Type } from "@google/genai";
import { ClassificationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const classifyComplaint = async (complaintText: string): Promise<ClassificationResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Classify the following government complaint and suggest appropriate imagery categories: "${complaintText}"`,
    config: {
      systemInstruction: `You are an expert Government Grievance Officer. Analyze a citizen's complaint and classify it.
      
      Administrative Levels: Municipal Level, State Level, Central Level.
      Departments: Road and Transport, Water Supply and Sanitation, Electrical/Power, Healthcare, Education, PDS (Food), Telecommunications, Banking, Railways, Environment, Labor, Post, Home Affairs.

      Assignment Rule: 
      Assign a realistic dummy official. Generate a valid-looking 10-digit Indian phone number.
      Estimate a resolution timeline (2-30 days).

      Respond in JSON format only.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          level: { type: Type.STRING },
          department: { type: Type.STRING },
          summary: { type: Type.STRING },
          urgency: { type: Type.STRING },
          reasoning: { type: Type.STRING },
          assignedOfficial: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              designation: { type: Type.STRING },
              phone: { type: Type.STRING }
            },
            required: ["name", "designation", "phone"]
          },
          estimatedTimelineDays: { type: Type.NUMBER },
          initialProgress: { type: Type.NUMBER }
        },
        required: ["level", "department", "summary", "urgency", "reasoning", "assignedOfficial", "estimatedTimelineDays", "initialProgress"]
      }
    }
  });

  try {
    const result = JSON.parse(response.text || "{}");
    return result as ClassificationResult;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Classification failed");
  }
};
