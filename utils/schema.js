import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, serial, text, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const MockInterview = pgTable('mockInterview', {
    id: serial('id').primaryKey(),
    jsonMockResp: text('jsonMockResp').notNull(),
    jobPosition: varchar('jobPosition').notNull(),
    jobDesc: varchar('jobDesc').notNull(),
    jobExperience: varchar('jobExperience').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt: varchar('createdAt'),
    mockId: varchar('mockId').notNull()
});

export const Question = pgTable('question', {
    id: serial('id').primaryKey(),
    MockQuestionJsonResp: text('MockQuestionJsonResp').notNull(),
    jobPosition: varchar('jobPosition').notNull(),
    jobDesc: varchar('jobDesc').notNull(),
    jobExperience: varchar('jobExperience').notNull(),
    typeQuestion: varchar('typeQuestion').notNull(),
    company: varchar('company').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt: varchar('createdAt'),
    mockId: varchar('mockId').notNull()
});

export const UserAnswer = pgTable('userAnswer', {
    id: serial('id').primaryKey(),
    mockIdRef: varchar('mockId').notNull(),
    question: varchar('question').notNull(),
    correctAns: text('correctAns'),
    userAns: text('userAns'),
    feedback: text('feedback'),
    rating: varchar('rating'),
    userEmail: varchar('userEmail'),
    createdAt: varchar('createdAt')
});

export const courses = pgTable("courses", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    imageSrc: text("image_src").notNull()
});

export const coursesRelations = relations(courses, ({ many }) => ({
    userProgress: many(userProgress),
    units: many(units)
}));

export const units = pgTable("units", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(), // unit 1
    description: text("description").notNull(), // learn the basics of software development
    courseId: integer("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
    order: integer("order").notNull()
})

export const unitsRelations = relations(units, ({ many, one }) => ({
    course: one(courses, {
        fields: [units.courseId],
        references: [courses.id],
    }),
    lessons: many(lessons)
}))

export const challengesEnum = pgEnum("type", ["SELECT","ASSIST"])

export const challenges = pgTable("challenges",{
    id: serial("id").primaryKey(),
    lessonId: integer("lesson_id").references(()=>lessons.id, {onDelete:"cascade"}).notNull(),
    type: challengesEnum("type").notNull(),
    duoQuestion: text("question").notNull(),
    order: integer("order").notNull()
})

export const challengesRelations = relations(challenges, ({one, many})=>({
    lesson: one(lessons,{
        fields:[challenges.lessonId],
        references: [lessons.id]
    }),
    challengeOptions: many(challengesOptions),
    challengeProgress: many(challengeProgress)
}))


export const challengesOptions = pgTable("challenges_options",{
    id: serial("id").primaryKey(),
    challengeId: integer("challenge_id").references(()=>challenges.id, {onDelete:"cascade"}).notNull(),
    text: text("text").notNull(),
    correct: boolean("correct").notNull(),
    imageSrc: text("image_src"),
    audioSrc: text("audio_src")
})

export const challengeOptionsRelations = relations(challengesOptions, ({one})=>({
    challenge: one(challenges,{
        fields:[challengesOptions.challengeId],
        references: [challenges.id]
    }),
}))


export const challengeProgress = pgTable("challenge_progress",{
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    challengeId: integer("challenge_id").references(()=>challenges.id, {onDelete:"cascade"}).notNull(),
    completed: boolean("completed").notNull().default(false)
})

export const challengeProgressRelations = relations(challengeProgress, ({one})=>({
    challenge: one(challenges,{
        fields:[challengeProgress.challengeId],
        references: [challenges.id]
    }),
}))

export const lessons = pgTable("lessons", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    unitId: integer("unit_id").references(() => units.id, { onDelete: "cascade" }).notNull(),
    order: integer("order").notNull()
})

export const lessonsRelations = relations(lessons, ({one, many})=>({
    unit: one(units,{
        fields:[lessons.unitId],
        references: [units.id]
    }),
    challenges: many(challenges)
}))

export const userProgress = pgTable("user_progress", {
    userId: text("user_id").primaryKey(),
    userName: text("user_name").notNull().default("User"),
    userImageSrc: text("user_image_src").notNull().default("/logo.svg"),
    activeCourseId: integer("active_course_id").references(() => courses.id, { onDelete: "cascade" }),
    hearts: integer("hearts").notNull().default(5),
    points: integer("points").notNull().default(0),
});


export const userProgressRelations = relations(userProgress, ({ one }) => ({
    activeCourse: one(courses, {
        fields: [userProgress.activeCourseId],
        references: [courses.id]
    })
}));

export const Newsletter = pgTable('newsletter', {
    id: serial('id').primaryKey(),
    newName: varchar('newName'),
    newEmail: varchar('newEmail'),
    newMessage: text('newMessage'),
    createdAt: varchar('createdAt')
});

// Adaptive AI Mock Interview Sessions
export const AdaptiveInterview = pgTable('adaptiveInterview', {
    id: serial('id').primaryKey(),
    sessionId: varchar('sessionId').notNull().unique(),
    userId: varchar('userId').notNull(),
    userEmail: varchar('userEmail'),
    targetRole: varchar('targetRole').notNull(),
    experienceLevel: varchar('experienceLevel').notNull(),
    interviewType: varchar('interviewType').notNull(), // HR, Technical, Coding, Behavioral, Mixed, Resume-Based, Role-Specific
    initialDifficulty: varchar('initialDifficulty').notNull().default('Intermediate'), // Beginner, Intermediate, Advanced
    currentDifficulty: varchar('currentDifficulty').notNull().default('Intermediate'),
    totalQuestions: integer('totalQuestions').notNull().default(5),
    targetCompany: varchar('targetCompany'),
    preferredLanguage: varchar('preferredLanguage').default('javascript'),
    resumeContext: text('resumeContext'),
    status: varchar('status').notNull().default('in_progress'), // in_progress, completed, abandoned
    overallScore: varchar('overallScore'),
    technicalScore: varchar('technicalScore'),
    communicationScore: varchar('communicationScore'),
    codingScore: varchar('codingScore'),
    feedbackSummary: text('feedbackSummary'),
    strengths: text('strengths'), // JSON array string
    weaknesses: text('weaknesses'), // JSON array string
    recommendedTopics: text('recommendedTopics'), // JSON array string
    createdAt: varchar('createdAt').notNull(),
    completedAt: varchar('completedAt')
});

// Adaptive Questions & Answers log within an adaptive session
export const AdaptiveQuestion = pgTable('adaptiveQuestion', {
    id: serial('id').primaryKey(),
    sessionId: varchar('sessionId').notNull(),
    questionIndex: integer('questionIndex').notNull(),
    questionText: text('questionText').notNull(),
    category: varchar('category').notNull().default('Technical'),
    difficultyLevel: varchar('difficultyLevel').notNull().default('Intermediate'),
    generatedFrom: varchar('generatedFrom').notNull().default('Initial'), // Initial, Follow-Up, Escalation, Simplification, Resume, Weak Area
    idealAnswer: text('idealAnswer'),
    userResponse: text('userResponse'),
    userResponseMode: varchar('userResponseMode').default('text'), // voice, code, text
    score: varchar('score'), // 0-100 or 1-10
    relevanceScore: varchar('relevanceScore'),
    clarityScore: varchar('clarityScore'),
    technicalDepthScore: varchar('technicalDepthScore'),
    fillerWordsCount: integer('fillerWordsCount').default(0),
    fillerWordsDetails: text('fillerWordsDetails'), // JSON string
    speakingPaceWpm: integer('speakingPaceWpm'),
    confidenceRating: varchar('confidenceRating'),
    evaluationFeedback: text('evaluationFeedback'),
    adaptiveActionTaken: varchar('adaptiveActionTaken'), // escalate, maintain, simplify, follow_up
    createdAt: varchar('createdAt').notNull()
});

// Persisted User Resume Profiles & ATS Analysis
export const ResumeProfile = pgTable('resumeProfile', {
    id: serial('id').primaryKey(),
    userId: varchar('userId').notNull(),
    userEmail: varchar('userEmail'),
    fileName: varchar('fileName').notNull(),
    rawResumeText: text('rawResumeText').notNull(),
    targetRole: varchar('targetRole'),
    overallScore: integer('overallScore'),
    atsScore: integer('atsScore'),
    impactScore: integer('impactScore'),
    extractedSkills: text('extractedSkills'), // JSON string of categorized skills
    extractedProjects: text('extractedProjects'), // JSON string
    extractedExperience: text('extractedExperience'), // JSON string
    missingSkills: text('missingSkills'), // JSON string
    analysisJson: text('analysisJson'),
    createdAt: varchar('createdAt').notNull()
});

// Job Applications & Interview Pipeline Tracker
export const JobTracker = pgTable('jobTracker', {
    id: serial('id').primaryKey(),
    userId: varchar('userId').notNull(),
    userEmail: varchar('userEmail'),
    companyName: varchar('companyName').notNull(),
    jobRole: varchar('jobRole').notNull(),
    location: varchar('location'),
    salaryPackage: varchar('salaryPackage'),
    status: varchar('status').notNull().default('Applied'), // Wishlist, Applied, Screening, Interview Scheduled, Completed, Offer, Rejected, Withdrawn
    appliedDate: varchar('appliedDate'),
    interviewDate: varchar('interviewDate'),
    interviewRound: varchar('interviewRound'),
    jobUrl: text('jobUrl'),
    priority: varchar('priority').default('medium'), // high, medium, low
    notes: text('notes'),
    createdAt: varchar('createdAt').notNull(),
    updatedAt: varchar('updatedAt')
});

// User Skill Assessment & Progress Matrix
export const UserSkillMatrix = pgTable('userSkillMatrix', {
    id: serial('id').primaryKey(),
    userId: varchar('userId').notNull(),
    skillName: varchar('skillName').notNull(),
    category: varchar('category').notNull(), // Frontend, Backend, DSA, System Design, Communication, etc.
    proficiencyLevel: varchar('proficiencyLevel').notNull().default('Beginner'), // Beginner, Intermediate, Advanced
    score: integer('score').notNull().default(50),
    lastEvaluatedSource: varchar('lastEvaluatedSource'), // mock_interview, leetcode, resume, communication
    updatedAt: varchar('updatedAt').notNull()
});

