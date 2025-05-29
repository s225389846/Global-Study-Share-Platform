const Answer = require("../models/Answer");
const Question = require("../models/question");
const { slugify } = require("../utils/slug");
const { sendAnswerNotificationEmail } = require("../utils/mailer");
const socketio = require("../socket"); 

async function createAnswer(req, res) {
  try {
    const { question, body } = req.body;

    if (!body) {
      return res.status(400).json({ error: "Body is required" });
    }

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const isValidQuestion = await Question.findById(question);
    if (!isValidQuestion) {
      return res.status(400).json({ error: "Invalid question ID" });
    }

    const answer = await Answer.create({
      ...req.body,
      author: req.user._id,
    });

    let questionAuthorId = null;

    // Email Notifying Logic
    try {
      const questionData = await Question.findById(question).populate('author');
      if (questionData && questionData.author) {
        questionAuthorId = questionData.author._id.toString();
        if (questionData.author.email) {
          await sendAnswerNotificationEmail(
            questionData.author.email,
            questionData.author.name,
            questionData.title,
            answer.body,
            questionData._id
          );
          console.log(`Notification email sent to ${questionData.author.email} for question "${questionData.title}"`);
        } else {
          console.warn('Question author has no email. Skipping email notification.');
        }
      } else {
        console.warn('Could not send answer notification: Question author not found or could not be populated.');
      }
    } catch (emailError) {
      console.error('Error sending answer notification email:', emailError);
    }

   
    if (questionAuthorId) {
        const io = socketio.getIo(); 
        io.emit('newAnswerNotification', {
            questionId: question,
            questionTitle: isValidQuestion.title,
            answerBodySnippet: answer.body.substring(0, 100) + (answer.body.length > 100 ? '...' : ''),
            answerAuthorName: req.user.name || 'Someone',
            questionAuthorId: questionAuthorId
        });
        console.log();
    }


    res.status(201).json({ message: "Answer created successfully", answer });
  } catch (error) {
    console.error("Failed to create answer:", error);
    res.status(500).json({ error: "Failed to create answer" });
  }
}

async function updateAnswer(req, res) { /* ... */ }
async function deleteAnswer(req, res) { /* ... */ }

module.exports = {
  createAnswer,
  deleteAnswer,
  updateAnswer,
};