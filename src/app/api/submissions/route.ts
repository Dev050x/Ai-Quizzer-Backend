import dbConnect from "@/lib/dbConnect";
import QuizModel from "@/model/Quiz";
import SubmissionModel from "@/model/Submission";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
      const { quizId, responses ,userId} = await req.json();
  
      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return NextResponse.json({
            message:"quiz not found in database",
        },{status:404});
      }
  
      let score = 0;
      const evaluatedResponses = responses.map((response:any) => {
        const question = quiz.questions.find((q) => q._id.equals(response.questionId));
        const isCorrect = question && question.correctAnswer === response.userResponse;
        if (isCorrect) score += quiz.maxScore / quiz.totalQuestions;
        return { ...response, isCorrect };
      });
  
      const submission = await SubmissionModel.create({
        quizId,
        userId:userId,
        responses: evaluatedResponses,
        score,
        submittedAt: new Date(),
        retried: false,
      });


      return NextResponse.json({
        message:"quiz submitted succefully",
        success:true,
        score,
        submission
       },{status:200});



    } catch (error) {
        return NextResponse.json({
            message:"not able to submit quiz",
            success:false,
        },{status:500});
    }
  }