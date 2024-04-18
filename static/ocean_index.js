const quizContainer = document.getElementById("question-container");
const progressBar = document.getElementById("progress");
const scoreContainer = document.getElementById("score-container");
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
let currentQuestionIndex = 0;
let score = {
  E: 0,
  N: 0,
  A: 0,
  C: 0,
  O: 0,
};

let questions = [];

// Fetch the CSV file containing the questions
fetch("questions.csv")
  .then((response) => response.text())
  .then((csv) => {
    loadQuestionsFromCSV(csv);
    // Don't call createQuestion here
  })
  .catch((error) => console.error("Error loading CSV file:", error));

function loadQuestionsFromCSV(csv) {
  const lines = csv.split("\n");
  lines.shift(); // Remove the header line
  lines.forEach((line) => {
    const parts = line.split(",");
    if (parts.length >= 2) {
      const [qid, value] = parts;
      const category = qid.charAt(0);
      questions.push({ qid, value: value.trim(), category });
    }
  });

  console.log("Loaded questions:", questions);
}

function createQuestion(question, index) {
  const questionDiv = document.createElement("div");
  questionDiv.className = "question";
  questionDiv.id = `question-${index}`; // Add unique ID to each question container
  questionDiv.innerHTML = `
    <p>${question.value}</p>
    <div class="options">
      <button class="option-btn" data-value="1">Strongly Disagree</button> <br/>
      <button class="option-btn" data-value="2">Disagree</button><br/>
      <button class="option-btn" data-value="3">Neutral</button><br/>
      <button class="option-btn" data-value="4">Agree</button><br/>
      <button class="option-btn" data-value="5">Strongly Agree</button><br/>
    </div>
  `;
  quizContainer.innerHTML = "";
  quizContainer.appendChild(questionDiv);

  const optionButtons = questionDiv.querySelectorAll(".option-btn");
  optionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      optionButtons.forEach((btn) => {
        btn.classList.remove("selected");
      });
      button.classList.add("selected");

      nextButton.disabled = false;

      // Increment the corresponding score when an option is selected
      const value = parseInt(button.getAttribute("data-value"));
      switch (question.qid.charAt(0)) {
        case "E":
          score.E += value;
          break;
        case "N":
          score.N += value;
          break;
        case "A":
          score.A += value;
          break;
        case "C":
          score.C += value;
          break;
        case "O":
          score.O += value;
          break;
        default:
          break;
      }

      console.log("Updated score:", score); // Add this line for debugging
    });
  });

  const selectedOption = document.querySelector(".options .selected");
  if (selectedOption) {
    optionButtons.forEach((button) => {
      if (
        button.getAttribute("data-value") ===
        selectedOption.getAttribute("data-value")
      ) {
        button.classList.add("selected");
      }
    });
  }

  nextButton.disabled = false;
}

const startButton = document.getElementById("start-btn");
startButton.addEventListener("click", () => {
  startButton.style.display = "none";
  document.getElementById("prev-btn").style.display = "inline-block";
  document.getElementById("next-btn").style.display = "inline-block";
  createQuestion(questions[0], 0);
});

function showScore() {
  quizContainer.style.display = "none";
  progressBar.style.display = "none";

  let maxScorePerCategory = 5 * questions.length; // Assuming each question has a maximum score of 5
  let scores = { ...score }; // Copy the current scores

  console.log("Scores:", scores);

  // Scale the raw scores for each category to a range between 1 and 10
  const scaledScores = {
    E: (scores.E / maxScorePerCategory) * 9 + 1,
    N: (scores.N / maxScorePerCategory) * 9 + 1,
    A: (scores.A / maxScorePerCategory) * 9 + 1,
    C: (scores.C / maxScorePerCategory) * 9 + 1,
    O: (scores.O / maxScorePerCategory) * 9 + 1,
  };

  let score1=scaledScores.O.toFixed(2);
  let score2=scaledScores.C.toFixed(2);
  let score3=scaledScores.E.toFixed(2);
  let score4=scaledScores.A.toFixed(2);
  let score5=scaledScores.N.toFixed(2);

  // Display the individual scores
  scoreContainer.innerHTML = `
    <p>Your score for Extraversion (E) is: ${scaledScores.E.toFixed(2)}</p>
    <p>Your score for Neuroticism (N) is: ${scaledScores.N.toFixed(2)}</p>
    <p>Your score for Agreeableness (A) is: ${scaledScores.A.toFixed(2)}</p>
    <p>Your score for Conscientiousness (C) is: ${scaledScores.C.toFixed(2)}</p>
    <p>Your score for Openness to Experience (O) is: ${scaledScores.O.toFixed(2)}</p>
  `;

  scoreContainer.style.display = "block";
  document.getElementById("prev-btn").style.display = "none";
  document.getElementById("next-btn").style.display = "none";

  console.log("Final scores:", scaledScores); // Final scores for each letter
}

prevButton.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    createQuestion(questions[currentQuestionIndex], currentQuestionIndex);
    progressBar.style.width = `${
      ((currentQuestionIndex + 1) / questions.length) * 100
    }%`;

    const selectedOption = document.querySelector(".options .selected");
    if (selectedOption) {
      const value = parseInt(selectedOption.getAttribute("data-value"));
      score[questions[currentQuestionIndex].category] -= value; // Subtract the selected option's value from the score
    }
  }
});

nextButton.addEventListener("click", () => {
  const selectedOption =
    document.querySelector(".options .selected") ||
    document.getElementById(`answer-${currentQuestionIndex}`);
  if (selectedOption) {
    const value = parseInt(selectedOption.getAttribute("data-value"));
    score[questions[currentQuestionIndex].category] += value; // Add the selected option's value to the score
    progressBar.style.width = `${
      ((currentQuestionIndex + 1) / questions.length) * 100
    }%`;

    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      createQuestion(questions[currentQuestionIndex], currentQuestionIndex);
    } else {
      showScore();
    }
  } else {
    alert("Please select an option before proceeding to the next question.");
  }
});

nextButton.disabled = true;
