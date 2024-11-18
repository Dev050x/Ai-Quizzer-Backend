import mongoose, { Schema, Document, Model } from "mongoose";

export interface Quiz extends Document {
  grade: number;
  subject: string;
  totalQuestions: number;
  maxScore: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  questions: {
    questionText: string;
    options: string[];
    correctAnswer: string;
    aiGenerated: boolean;
  }[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema: Schema<Quiz> = new Schema(
  {
    grade: {
      type: Number,
      required: true
    },
    subject:
    {
      type: String,
      required: true,
      trim: true
    },
    totalQuestions:
    {
      type: Number,
      required: true
    },
    maxScore: {
      type: Number,
      required: true
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["EASY", "MEDIUM", "HARD"]
    },
    questions: [
      {
        questionText: { type: String, required: true },
        options: { type: [String], required: true, validate: [(val: string[]) => val.length === 4, "Options must include 4 items"] },
        correctAnswer: { type: String, required: true },
        aiGenerated: { type: Boolean, default: false },
      },
    ],
    createdBy:
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  {
    timestamps: true
  }
);

const QuizModel = (mongoose.models.Quiz as Model<Quiz>) || mongoose.model<Quiz>("Quiz", QuizSchema);
export default QuizModel;
