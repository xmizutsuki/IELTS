import { CurriculumWeek, StudyTask } from "@/types";

function task(
  id: string,
  title: string,
  description: string,
  minutes: number,
  skill: StudyTask["skill"],
  type: StudyTask["type"],
  href?: string,
): StudyTask {
  return { id, title, description, minutes, skill, type, href };
}

export const curriculum: CurriculumWeek[] = [
  {
    week: 1,
    title: "Understand",
    theme: "IELTS from zero",
    goal: "Understand exactly how IELTS works and establish your starting point.",
    days: [
      {
        day: 1,
        title: "Meet the IELTS",
        objective: "Learn the exam structure, band scores and the four skills.",
        tasks: [
          task("w1d1-basics", "IELTS from zero", "Learn the format, timing and scoring system.", 35, "general", "lesson", "/ielts-zero"),
          task("w1d1-reading", "First Reading look", "See common IELTS Reading question formats.", 20, "reading", "practice", "/skills/reading"),
          task("w1d1-speaking", "First Speaking answers", "Learn how IELTS Speaking differs from casual conversation.", 20, "speaking", "speaking", "/skills/speaking"),
        ],
      },
      {
        day: 2,
        title: "Listening foundations",
        objective: "Understand the four Listening parts and how prediction works.",
        tasks: [
          task("w1d2-listening-format", "How Listening works", "Parts, instructions, word limits and answer prediction.", 30, "listening", "lesson", "/skills/listening"),
          task("w1d2-paraphrase", "Hear meaning, not just words", "Recognise paraphrases and common distractors.", 30, "listening", "practice", "/skills/listening"),
          task("w1d2-vocab", "Vocabulary capture", "Save useful words and collocations from today's lesson.", 15, "general", "vocabulary"),
        ],
      },
      {
        day: 3,
        title: "Reading foundations",
        objective: "Learn scanning, skimming and the difference between False and Not Given.",
        tasks: [
          task("w1d3-reading-format", "How Reading works", "Understand three passages, timing and question families.", 25, "reading", "lesson", "/skills/reading"),
          task("w1d3-tfng", "True / False / Not Given", "Use textual evidence instead of outside knowledge.", 35, "reading", "practice", "/skills/reading"),
          task("w1d3-review", "Fast review", "Review today's mistakes and vocabulary.", 15, "general", "review", "/mistakes"),
        ],
      },
      {
        day: 4,
        title: "Meet Writing",
        objective: "Understand Task 1, Task 2 and the official assessment criteria.",
        tasks: [
          task("w1d4-writing-format", "Writing explained", "Learn Task 1 vs Task 2, timing and minimum word counts.", 30, "writing", "lesson", "/skills/writing"),
          task("w1d4-task2-plan", "Plan before you write", "Analyse a Task 2 prompt and build a simple essay plan.", 35, "writing", "writing", "/skills/writing"),
          task("w1d4-grammar", "Accuracy check", "Notice grammar errors that can limit higher bands.", 15, "writing", "review"),
        ],
      },
      {
        day: 5,
        title: "Meet Speaking",
        objective: "Experience Parts 1, 2 and 3 without pressure.",
        tasks: [
          task("w1d5-speaking-format", "Speaking explained", "Understand the interview structure and scoring criteria.", 25, "speaking", "lesson", "/skills/speaking"),
          task("w1d5-part1", "Part 1 warm-up", "Answer familiar questions naturally and extend your answers.", 25, "speaking", "speaking", "/skills/speaking"),
          task("w1d5-part2", "Your first cue card", "Plan for one minute and speak for up to two minutes.", 25, "speaking", "speaking", "/skills/speaking"),
        ],
      },
      {
        day: 6,
        title: "Diagnostic day",
        objective: "Collect the first evidence about your strengths and weaknesses.",
        tasks: [
          task("w1d6-diagnostic", "Quick diagnostic", "Complete the initial diagnostic across all four skills.", 60, "general", "mock", "/diagnostic"),
          task("w1d6-reflect", "Read your baseline", "Understand the difference between a score estimate and a verified band.", 20, "general", "review", "/progress"),
        ],
      },
      {
        day: 7,
        title: "Review & reset",
        objective: "Review Week 1 and prepare the personalised focus for Week 2.",
        tasks: [
          task("w1d7-review", "Week 1 review", "Review lessons, errors and unfamiliar IELTS terminology.", 30, "general", "review", "/progress"),
          task("w1d7-light", "Light English input", "Read or listen to English for enjoyment without test pressure.", 30, "general", "review"),
        ],
      },
    ],
  },
  {
    week: 2,
    title: "Build",
    theme: "Core foundations",
    goal: "Build reliable Reading and Listening habits while starting structured Writing and Speaking.",
    days: [
      {
        day: 1,
        title: "Listening Part 1",
        objective: "Master prediction, spelling and form completion.",
        tasks: [
          task("w2d1-listen", "Part 1 strategy", "Predict answer type before listening.", 35, "listening", "practice", "/skills/listening"),
          task("w2d1-spell", "Spelling & numbers", "Train names, dates, numbers and common spelling traps.", 25, "listening", "practice"),
          task("w2d1-speaking", "Speaking Part 1", "Give natural extended answers.", 20, "speaking", "speaking", "/skills/speaking"),
        ],
      },
      {
        day: 2,
        title: "Reading evidence",
        objective: "Strengthen T/F/NG and Y/N/NG reasoning.",
        tasks: [
          task("w2d2-tfng", "T/F/NG drill", "Separate contradiction from missing information.", 40, "reading", "practice", "/skills/reading"),
          task("w2d2-ynng", "Y/N/NG drill", "Apply the same evidence discipline to opinions and claims.", 30, "reading", "practice"),
          task("w2d2-vocab", "Paraphrase bank", "Capture equivalent expressions from the passages.", 20, "general", "vocabulary"),
        ],
      },
      {
        day: 3,
        title: "Task 2 foundations",
        objective: "Understand prompts and create strong thesis statements.",
        tasks: [
          task("w2d3-prompt", "Prompt analysis", "Identify topic, task words and required position.", 30, "writing", "lesson", "/skills/writing"),
          task("w2d3-thesis", "Thesis builder", "Write clear positions without memorised templates.", 35, "writing", "writing"),
          task("w2d3-listen", "Listening maintenance", "Short Part 2 practice.", 20, "listening", "practice"),
        ],
      },
      {
        day: 4,
        title: "Listening Part 2",
        objective: "Follow monologues, maps and changes of direction.",
        tasks: [
          task("w2d4-map", "Maps & plans", "Follow location language and distractors.", 40, "listening", "practice"),
          task("w2d4-notes", "Note completion", "Predict grammar and word type.", 30, "listening", "practice"),
          task("w2d4-reading", "Reading maintenance", "Short sentence-completion set.", 20, "reading", "practice"),
        ],
      },
      {
        day: 5,
        title: "Speaking naturally",
        objective: "Develop answers without sounding memorised.",
        tasks: [
          task("w2d5-part1", "Part 1 expansion", "Answer, explain and add a relevant detail.", 30, "speaking", "speaking"),
          task("w2d5-fluency", "Fluency drill", "Speak with limited preparation and reduce unnecessary pauses.", 25, "speaking", "speaking"),
          task("w2d5-writing", "Topic sentences", "Write clear paragraph controlling ideas.", 25, "writing", "writing"),
        ],
      },
      {
        day: 6,
        title: "Mini test",
        objective: "Test Reading and Listening under light time pressure.",
        tasks: [
          task("w2d6-listen", "Timed Listening", "Complete a short timed Listening set.", 35, "listening", "mock"),
          task("w2d6-read", "Timed Reading", "Complete a short timed Reading set.", 35, "reading", "mock"),
          task("w2d6-review", "Error review", "Classify why each incorrect answer happened.", 20, "general", "review", "/mistakes"),
        ],
      },
      {
        day: 7,
        title: "Weekly review",
        objective: "Consolidate the foundation before advanced strategies.",
        tasks: [
          task("w2d7-review", "Review weak question types", "Repeat the two weakest micro-skills.", 40, "general", "review"),
          task("w2d7-input", "English input", "Listen or read outside IELTS and collect useful language.", 30, "general", "vocabulary"),
        ],
      },
    ],
  },
  {
    week: 3,
    title: "Develop",
    theme: "Reading & Listening strategy",
    goal: "Become faster at recognising paraphrases, structure and distractors.",
    days: [
      { day: 1, title: "Matching Headings", objective: "Match paragraph purpose, not isolated words.", tasks: [
        task("w3d1-headings", "Matching Headings", "Identify main ideas and paragraph function.", 45, "reading", "practice"),
        task("w3d1-paraphrase", "Paraphrase sprint", "Match IELTS-style paraphrases quickly.", 25, "reading", "practice"),
        task("w3d1-speaking", "Speaking maintenance", "Part 1 fluency practice.", 20, "speaking", "speaking"),
      ]},
      { day: 2, title: "Listening Part 3", objective: "Track multiple speakers and opinion changes.", tasks: [
        task("w3d2-part3", "Part 3 strategy", "Follow academic conversations and speaker positions.", 45, "listening", "practice"),
        task("w3d2-distractors", "Distractor lab", "Recognise corrections and changed decisions.", 25, "listening", "practice"),
        task("w3d2-writing", "Writing maintenance", "Develop one body paragraph.", 25, "writing", "writing"),
      ]},
      { day: 3, title: "Matching Information", objective: "Find details efficiently across paragraphs.", tasks: [
        task("w3d3-info", "Matching Information", "Locate specific facts without rereading everything.", 40, "reading", "practice"),
        task("w3d3-features", "Matching Features", "Track people, theories and categories.", 30, "reading", "practice"),
        task("w3d3-vocab", "Vocabulary review", "Review words collected this week.", 20, "general", "vocabulary"),
      ]},
      { day: 4, title: "Listening Part 4", objective: "Handle lecture-style information density.", tasks: [
        task("w3d4-part4", "Part 4 lecture", "Use structure and prediction to follow a monologue.", 45, "listening", "practice"),
        task("w3d4-notes", "Academic note completion", "Track signposting and synonyms.", 30, "listening", "practice"),
        task("w3d4-speaking", "Part 2 cue card", "Speak for up to two minutes.", 20, "speaking", "speaking"),
      ]},
      { day: 5, title: "Summary & Multiple Choice", objective: "Handle inference and paraphrase-heavy questions.", tasks: [
        task("w3d5-summary", "Summary completion", "Use grammar and meaning together.", 35, "reading", "practice"),
        task("w3d5-mcq", "Multiple Choice", "Compare options against evidence.", 35, "reading", "practice"),
        task("w3d5-writing", "Essay planning", "Plan a Task 2 essay in under eight minutes.", 20, "writing", "writing"),
      ]},
      { day: 6, title: "Timed strategy test", objective: "Apply the week's strategies under time pressure.", tasks: [
        task("w3d6-read", "Timed Reading section", "Complete an advanced mixed Reading set.", 40, "reading", "mock"),
        task("w3d6-listen", "Timed Listening section", "Complete an advanced mixed Listening set.", 35, "listening", "mock"),
        task("w3d6-review", "Deep review", "Explain every mistake before moving on.", 25, "general", "review"),
      ]},
      { day: 7, title: "Weekly review", objective: "Retest the weakest question type.", tasks: [
        task("w3d7-retest", "Weakness retest", "Repeat a fresh set of your weakest question type.", 40, "general", "review"),
        task("w3d7-input", "Natural English", "Long-form listening or reading for comprehension.", 35, "general", "review"),
      ]},
    ],
  },
  {
    week: 4,
    title: "Write",
    theme: "Academic Task 1 + accuracy",
    goal: "Describe visual information clearly, select key features and improve grammatical control.",
    days: [
      { day: 1, title: "Task 1 structure", objective: "Build Introduction, Overview and body paragraphs.", tasks: [
        task("w4d1-structure", "Task 1 anatomy", "Learn what each paragraph must accomplish.", 35, "writing", "lesson"),
        task("w4d1-overview", "Overview practice", "Select the most important features.", 35, "writing", "writing"),
        task("w4d1-listen", "Listening maintenance", "Short Part 3 practice.", 20, "listening", "practice"),
      ]},
      { day: 2, title: "Charts & comparisons", objective: "Compare data instead of listing numbers.", tasks: [
        task("w4d2-charts", "Line, bar and pie charts", "Describe trends and meaningful comparisons.", 45, "writing", "writing"),
        task("w4d2-grammar", "Comparatives & superlatives", "Use comparison grammar accurately.", 25, "writing", "practice"),
        task("w4d2-read", "Reading maintenance", "Mixed Reading drill.", 20, "reading", "practice"),
      ]},
      { day: 3, title: "Tables & mixed visuals", objective: "Group information efficiently.", tasks: [
        task("w4d3-table", "Tables", "Prioritise patterns and avoid data dumping.", 35, "writing", "writing"),
        task("w4d3-mixed", "Mixed charts", "Combine related features into logical paragraphs.", 35, "writing", "writing"),
        task("w4d3-speaking", "Speaking maintenance", "Part 2 practice.", 20, "speaking", "speaking"),
      ]},
      { day: 4, title: "Processes", objective: "Describe stages and use passive voice where appropriate.", tasks: [
        task("w4d4-process", "Process diagrams", "Sequence stages clearly from start to finish.", 40, "writing", "writing"),
        task("w4d4-passive", "Passive voice", "Choose active vs passive accurately.", 25, "writing", "practice"),
        task("w4d4-vocab", "Task 1 language", "Review trend and comparison collocations.", 20, "general", "vocabulary"),
      ]},
      { day: 5, title: "Maps", objective: "Describe spatial change over time.", tasks: [
        task("w4d5-maps", "Map reports", "Organise changes by location and significance.", 40, "writing", "writing"),
        task("w4d5-accuracy", "Accuracy clinic", "Check articles, prepositions and tense consistency.", 30, "writing", "review"),
        task("w4d5-listen", "Listening maintenance", "Short Part 4 practice.", 20, "listening", "practice"),
      ]},
      { day: 6, title: "Timed Task 1", objective: "Write a complete response under exam conditions.", tasks: [
        task("w4d6-task1", "20-minute Task 1", "Plan, write and review under time pressure.", 30, "writing", "mock"),
        task("w4d6-review", "Task 1 review", "Evaluate selection, overview, organisation and accuracy.", 35, "writing", "review"),
        task("w4d6-reading", "Reading maintenance", "Timed mixed questions.", 25, "reading", "practice"),
      ]},
      { day: 7, title: "Weekly review", objective: "Consolidate Task 1 patterns and recurring grammar errors.", tasks: [
        task("w4d7-errors", "Writing error bank", "Review recurring grammar and vocabulary errors.", 35, "writing", "review", "/mistakes"),
        task("w4d7-rewrite", "Rewrite one response", "Apply feedback to produce a cleaner version.", 35, "writing", "writing"),
      ]},
    ],
  },
  {
    week: 5,
    title: "Argue",
    theme: "Writing Task 2",
    goal: "Build clear positions, develop ideas deeply and write coherent essays under time pressure.",
    days: [
      { day: 1, title: "Opinion essays", objective: "Take a clear position and support it.", tasks: [
        task("w5d1-opinion", "Opinion essay", "Analyse, plan and write a strong argument.", 50, "writing", "writing"),
        task("w5d1-ideas", "Idea development", "Move from claim to explanation and example.", 30, "writing", "practice"),
        task("w5d1-speaking", "Part 3 connection", "Discuss the same topic orally.", 20, "speaking", "speaking"),
      ]},
      { day: 2, title: "Discussion essays", objective: "Represent both views before giving a clear position.", tasks: [
        task("w5d2-discussion", "Discuss both views", "Balance competing positions logically.", 50, "writing", "writing"),
        task("w5d2-cohesion", "Cohesion without over-linking", "Use reference and logical flow naturally.", 25, "writing", "practice"),
        task("w5d2-listen", "Listening maintenance", "Part 3 or 4 practice.", 20, "listening", "practice"),
      ]},
      { day: 3, title: "Problems & solutions", objective: "Link causes, consequences and realistic solutions.", tasks: [
        task("w5d3-problem", "Problem / Solution", "Build specific, developed solutions.", 50, "writing", "writing"),
        task("w5d3-lexical", "Precision over complexity", "Choose natural collocations instead of forced vocabulary.", 25, "writing", "vocabulary"),
        task("w5d3-reading", "Reading maintenance", "Advanced paraphrase drill.", 20, "reading", "practice"),
      ]},
      { day: 4, title: "Advantages & disadvantages", objective: "Compare significance instead of listing points.", tasks: [
        task("w5d4-advantages", "Advantages / Disadvantages", "Develop and weigh both sides.", 50, "writing", "writing"),
        task("w5d4-grammar", "Complex but controlled", "Practise accurate complex sentence structures.", 25, "writing", "practice"),
        task("w5d4-speaking", "Speaking maintenance", "Part 2 + follow-up.", 20, "speaking", "speaking"),
      ]},
      { day: 5, title: "Two-part questions", objective: "Answer every part of the prompt fully.", tasks: [
        task("w5d5-two", "Two-part essay", "Allocate ideas and paragraph space to both questions.", 50, "writing", "writing"),
        task("w5d5-check", "Task Response audit", "Check whether every requirement was answered.", 25, "writing", "review"),
        task("w5d5-listen", "Listening maintenance", "Short mixed practice.", 20, "listening", "practice"),
      ]},
      { day: 6, title: "Timed Task 2", objective: "Write a full essay in forty minutes.", tasks: [
        task("w5d6-task2", "40-minute Task 2", "Plan, write and check under strict timing.", 45, "writing", "mock"),
        task("w5d6-review", "Essay deep review", "Identify the three biggest barriers to the next band.", 35, "writing", "review"),
        task("w5d6-read", "Reading maintenance", "Short timed Reading set.", 20, "reading", "practice"),
      ]},
      { day: 7, title: "Weekly review", objective: "Rewrite weak paragraphs and review recurring errors.", tasks: [
        task("w5d7-rewrite", "Rewrite clinic", "Rewrite two paragraphs using feedback.", 40, "writing", "writing"),
        task("w5d7-errors", "Error bank review", "Retest recurring grammar and lexical errors.", 30, "writing", "review", "/mistakes"),
      ]},
    ],
  },
  {
    week: 6,
    title: "Speak",
    theme: "Speaking & natural English",
    goal: "Improve fluency, response development and intelligible pronunciation across all three Speaking parts.",
    days: [
      { day: 1, title: "Part 1 control", objective: "Answer naturally without one-word or memorised responses.", tasks: [
        task("w6d1-part1", "Part 1 circuits", "Answer familiar topics with natural expansion.", 35, "speaking", "speaking"),
        task("w6d1-fluency", "Fluency drill", "Reduce pauses caused by over-planning.", 25, "speaking", "speaking"),
        task("w6d1-writing", "Writing maintenance", "One Task 2 paragraph.", 20, "writing", "writing"),
      ]},
      { day: 2, title: "Part 2 long turn", objective: "Plan quickly and sustain a coherent two-minute answer.", tasks: [
        task("w6d2-cue", "Cue card method", "Use one minute to build a flexible speaking map.", 35, "speaking", "lesson"),
        task("w6d2-two", "Two-minute challenge", "Record two complete long turns.", 35, "speaking", "speaking"),
        task("w6d2-listen", "Listening maintenance", "Part 4 practice.", 20, "listening", "practice"),
      ]},
      { day: 3, title: "Part 3 thinking", objective: "Explain, compare, speculate and evaluate abstract ideas.", tasks: [
        task("w6d3-part3", "Part 3 framework", "Build developed answers without memorised formulas.", 40, "speaking", "speaking"),
        task("w6d3-reasons", "Reason + example", "Turn short opinions into developed responses.", 30, "speaking", "practice"),
        task("w6d3-reading", "Reading maintenance", "Mixed advanced questions.", 20, "reading", "practice"),
      ]},
      { day: 4, title: "Pronunciation", objective: "Improve intelligibility through stress, rhythm and connected speech.", tasks: [
        task("w6d4-stress", "Sentence stress", "Highlight meaning through stressed content words.", 30, "speaking", "speaking"),
        task("w6d4-linking", "Connected speech", "Practise linking and natural reductions without forcing an accent.", 30, "speaking", "speaking"),
        task("w6d4-shadow", "Shadowing", "Listen, repeat, record and compare.", 20, "speaking", "speaking"),
      ]},
      { day: 5, title: "Lexical flexibility", objective: "Paraphrase naturally when the exact word is unavailable.", tasks: [
        task("w6d5-paraphrase", "Speaking paraphrase", "Explain ideas with flexible language.", 35, "speaking", "practice"),
        task("w6d5-collocations", "Natural collocations", "Prefer precise combinations over rare vocabulary.", 30, "speaking", "vocabulary"),
        task("w6d5-writing", "Writing maintenance", "Task 1 or Task 2 accuracy review.", 20, "writing", "review"),
      ]},
      { day: 6, title: "Full Speaking mock", objective: "Complete Parts 1, 2 and 3 without feedback interruptions.", tasks: [
        task("w6d6-mock", "Speaking mock", "Complete a full speaking simulation.", 20, "speaking", "mock"),
        task("w6d6-review", "Speaking review", "Review fluency, vocabulary, grammar and pronunciation.", 35, "speaking", "review"),
        task("w6d6-retest", "Targeted retest", "Repeat the weakest part with a new topic.", 25, "speaking", "speaking"),
      ]},
      { day: 7, title: "Weekly review", objective: "Consolidate natural speaking and maintain all four skills.", tasks: [
        task("w6d7-shadow", "Shadowing review", "Repeat your most useful shadowing clips.", 25, "speaking", "speaking"),
        task("w6d7-mixed", "Mixed maintenance", "Short Reading, Listening and Writing review.", 45, "general", "review"),
      ]},
    ],
  },
  {
    week: 7,
    title: "Perform",
    theme: "Exam mode",
    goal: "Transfer skills into timed performance and diagnose score loss under pressure.",
    days: [
      { day: 1, title: "Timed Listening", objective: "Perform a full timed Listening simulation.", tasks: [
        task("w7d1-listen", "Listening mock", "Complete a full Listening simulation.", 45, "listening", "mock"),
        task("w7d1-review", "Listening deep review", "Classify every missed point.", 40, "listening", "review"),
      ]},
      { day: 2, title: "Timed Reading", objective: "Perform a full Reading simulation in sixty minutes.", tasks: [
        task("w7d2-read", "Reading mock", "Complete a full Reading simulation.", 60, "reading", "mock"),
        task("w7d2-review", "Reading deep review", "Separate timing errors from comprehension errors.", 35, "reading", "review"),
      ]},
      { day: 3, title: "Timed Writing", objective: "Complete Task 1 and Task 2 in sixty minutes.", tasks: [
        task("w7d3-write", "Writing mock", "Complete both Writing tasks under strict timing.", 60, "writing", "mock"),
        task("w7d3-review", "Writing audit", "Review score criteria and recurring errors.", 35, "writing", "review"),
      ]},
      { day: 4, title: "Timed Speaking", objective: "Complete a realistic Speaking mock.", tasks: [
        task("w7d4-speak", "Speaking mock", "Complete Parts 1, 2 and 3.", 20, "speaking", "mock"),
        task("w7d4-review", "Speaking audit", "Identify the highest-impact speaking limitation.", 35, "speaking", "review"),
        task("w7d4-retest", "Retest weakness", "Repeat the weakest part with a fresh topic.", 25, "speaking", "speaking"),
      ]},
      { day: 5, title: "Weakness day", objective: "Spend most study time on the current bottleneck.", tasks: [
        task("w7d5-weak", "Priority weakness", "Use your dashboard to target the lowest-performing skill.", 55, "general", "practice"),
        task("w7d5-errors", "Error bank", "Retest recurring mistakes.", 30, "general", "review", "/mistakes"),
      ]},
      { day: 6, title: "Full mock", objective: "Simulate a demanding exam day.", tasks: [
        task("w7d6-full", "Full mock exam", "Complete a full multi-skill simulation.", 150, "general", "mock"),
      ]},
      { day: 7, title: "Deep review", objective: "Understand why points were lost before taking another mock.", tasks: [
        task("w7d7-analysis", "Mock autopsy", "Review every meaningful error and timing issue.", 60, "general", "review"),
        task("w7d7-light", "Light English", "Low-pressure input and recovery.", 30, "general", "review"),
      ]},
    ],
  },
  {
    week: 8,
    title: "Prove",
    theme: "Band 8 readiness",
    goal: "Measure consistency, repair final bottlenecks and leave with a clear next-step decision.",
    days: [
      { day: 1, title: "Full Mock 1", objective: "Establish Week 8 performance under exam conditions.", tasks: [
        task("w8d1-mock", "Full Mock 1", "Complete a strict mock and preserve the raw results.", 150, "general", "mock"),
      ]},
      { day: 2, title: "Deep analysis", objective: "Turn Mock 1 into a precise improvement plan.", tasks: [
        task("w8d2-review", "Mock 1 analysis", "Classify score loss by skill, question type and cause.", 60, "general", "review"),
        task("w8d2-errors", "Error retest", "Immediately retest high-impact mistakes.", 30, "general", "practice"),
      ]},
      { day: 3, title: "Weakest skill intensive", objective: "Attack the largest remaining Band 8 gap.", tasks: [
        task("w8d3-weak", "Weakest skill intensive", "Spend the session on your highest-priority bottleneck.", 90, "general", "practice"),
      ]},
      { day: 4, title: "Second weakness", objective: "Strengthen the next most important limitation.", tasks: [
        task("w8d4-weak", "Second priority skill", "Train the second-largest remaining gap.", 75, "general", "practice"),
        task("w8d4-review", "Fast review", "Retest mistakes from the intensive sessions.", 20, "general", "review"),
      ]},
      { day: 5, title: "Full Mock 2", objective: "Measure whether changes survive exam pressure.", tasks: [
        task("w8d5-mock", "Full Mock 2", "Complete the second strict full simulation.", 150, "general", "mock"),
      ]},
      { day: 6, title: "Final productive review", objective: "Complete final Writing and Speaking checks.", tasks: [
        task("w8d6-writing", "Final Writing assessment", "Complete the task type that still limits your score.", 50, "writing", "mock"),
        task("w8d6-speaking", "Final Speaking assessment", "Complete a full Speaking mock.", 25, "speaking", "mock"),
        task("w8d6-errors", "Final error review", "Review only recurring, high-impact mistakes.", 25, "general", "review"),
      ]},
      { day: 7, title: "Readiness report", objective: "Review consistency and define the next phase honestly.", tasks: [
        task("w8d7-report", "Band 8 readiness", "Review trends, consistency, confidence and remaining gaps.", 35, "general", "review", "/progress"),
        task("w8d7-light", "Light strategy review", "Review exam-day strategy without heavy new study.", 30, "general", "review"),
      ]},
    ],
  },
];

export function getWeek(weekNumber: number) {
  return curriculum.find((week) => week.week === weekNumber);
}

export function getDay(weekNumber: number, dayNumber: number) {
  return getWeek(weekNumber)?.days.find((day) => day.day === dayNumber);
}

export function getTotalTaskCount() {
  return curriculum.reduce(
    (total, week) => total + week.days.reduce((dayTotal, day) => dayTotal + day.tasks.length, 0),
    0,
  );
}
