import dbConnect from "@/lib/dbConnect";
import QuizModel from "@/model/Quiz";
import { generateQuestions } from "@/helpers/generateQuestions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();
  try {
    //need to fetch userid from jwt 
    //need to fix error in error.message
    const { grade, subject, totalQuestions, maxScore, difficulty, userId } = await req.json();

    const questions = await generateQuestions(grade, subject, totalQuestions, difficulty);
    const betterLookingQuestion = questions.replace(/```json|```/g, '').trim();
    const jsonQuestions = JSON.parse(betterLookingQuestion);

    const quiz = await QuizModel.create({
      grade,
      subject,
      totalQuestions,
      maxScore,
      difficulty,
      questions:jsonQuestions,
      createdBy: userId,
    });

    return NextResponse.json({
      message: "data fetched succefully from the openai",
      success: true,
      questions: jsonQuestions,
    }, { status: 200 });
  } 
  catch (error) {
    return NextResponse.json({
      message:/* error.message || */ "may-be openai fault or database storage problem in Quiz schema",
      success: false,
    }, { status: 500 });
  }
}
