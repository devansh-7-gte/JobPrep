"use server";
import React from 'react'
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';
import { is } from 'zod/v4/locales';

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

export async function generateQuiz(){
    const { userId }= await auth();
    if(!userId) throw new error("Invalid user");

    const user = db.user.findUnique({
        where: {clerkUserId: userId},
        select:{
          industry:true,
          skills: true
        }
    })
  const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: `
     Generate 10 technical interview questions for a ${
      user.industry
    } professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
    `,
                      },
                    ],
                  },
                ],
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`API failed: ${response.status}`);
          }

          const result = await response.json();

          const text =
            result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

          // 🔥 Extract JSON safely
          const jsonMatch = text.match(/\{[\s\S]*\}/);

          if (!jsonMatch) {
            throw new Error("No JSON found");
          }

          let quiz;
          try {
            quiz = JSON.parse(jsonMatch[0]);

            return quiz.questions;
          } catch (err) {
            console.error("❌ JSON Parse Error:", jsonMatch[0]);
            throw new Error("Invalid JSON");
          }
    

}


export async function saveQuizResult(questions, answers, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
if (!user) throw new Error ("User Not Found");

const quesResults = questions.map((q, idx) => ({
  question: q.question,
  answer: q.correctAnswer,
  userAnswer: answers[idx],
  isCorrect: q.correctAnswer === answers[idx],
  explanation: q.explanation
}));
const wrongAnswers = quesResults.filter((q)=>!q.isCorrect);
  const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

const TipText = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: `
     The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `,
                      },
                    ],
                  },
                ],
              }),
            }
          );
       const response = await TipText;
          if (!response.ok) {
            throw new Error(`API failed: ${response.status}`);
          }

          const tipResult = await TipText;
          const improvementTip = tipResult?.candidates?.[0]?.content?.parts?.[0]?.text().trim()|| "Keep practicing and reviewing key concepts in your industry. Focus on understanding the underlying principles to improve your performance in future interviews.";

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: quesResults,
        category: user.industry,
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }

}
export const getAssessments= async ()=>{
  const{userId}= await auth();
  if(!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}
