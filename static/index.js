//ocean
function oceanScore() {
    quizContainer.style.display = "none";
    progressBar.style.display = "none";
  
    var maxScorePerCategory = 5 * questions.length; // Assuming each question has a maximum score of 5
    var scores = { ...score }; // Copy the current scores
  
    console.log("Scores:", scores);
  
    // Scale the raw scores for each category to a range between 1 and 10
    const scaledScores = {
      E: (scores.E / maxScorePerCategory) * 9 + 1,
      N: (scores.N / maxScorePerCategory) * 9 + 1,
      A: (scores.A / maxScorePerCategory) * 9 + 1,
      C: (scores.C / maxScorePerCategory) * 9 + 1,
      O: (scores.O / maxScorePerCategory) * 9 + 1,
    };
  
    var score1=scaledScores.O.toFixed(2);
    var score2=scaledScores.C.toFixed(2);
    var score3=scaledScores.E.toFixed(2);
    var score4=scaledScores.A.toFixed(2);
    var score5=scaledScores.N.toFixed(2);
  
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
  
    console.log("Final scores:", scaledScores); // Final scores for each varter
  }
  //perceptual
  function perceptualScore() {
      const perscore = (score / questions.length) * 100;
      const normalized_score = ((perscore - 0) * (10 - 1)) / (100 - 0) + 1;
      document.getElementById("score-container").textContent =
        "Your score: " + parseFloat(normalized_score.toFixed(2));
      document.getElementById("submit-btn").style.display = "none"; // Hide the submit button
      var score8=normalized_score.toFixed(2);
    }
    //verbal
    function verbalScore() {
      const perscore = (score / questions.length) * 100;
      const normalized_score = ((perscore - 0) * (10 - 1)) / (100 - 0) + 1;
      document.getElementById("score-container").textContent =
        "Your score: " + parseFloat(normalized_score.toFixed(2));
      document.getElementById("submit-btn").style.display = "none"; // Hide the submit button
      var score10=normalized_score.toFixed(2);
      
    }
    //spatial
    function spatialScore() {
    var score = 0;
    const answers = ['a', 'a', 'd', 'b', 'd','d','a'];
    const form = document.getElementById('spatialTestForm');
    const formData = new FormData(form);
  
    for (var i = 1; i <= 7; i++) {
        const selectedAnswer = formData.get('q' + i);
        if (selectedAnswer === answers[i - 1]) {
            score += 1; // Increase score by 2 for each correct answer
        }
    }
    var perscore=0;
    perscore=(score/7)*100;
    var normalized_score=0;
    normalized_score=((perscore-0)*(10-1)/(100-0))+1;
    normalized_score = parseFloat(normalized_score.toFixed(2)); 
    var score7=normalized_score;
    document.getElementById('score').textContent = 'Your score: ' + normalized_score;
  }
  //numerical
  function numericalScore() {
    var score = 0;
    const answers = ['b', 'b', 'b', 'c', 'b','b','a'];
    const form = document.getElementById('numericalTestForm');
    const formData = new FormData(form);
  
    for (var i = 1; i <= 7; i++) {
        const selectedAnswer = formData.get('q' + i);
        if (selectedAnswer === answers[i - 1]) {
            score += 1; // Increase score by 2 for each correct answer
        }
    }
    var perscore=0;
    perscore=(score/7)*100;
    var normalized_score=0;
    normalized_score=((perscore-0)*(10-1)/(100-0))+1;
    normalized_score = parseFloat(normalized_score.toFixed(2)); 
     score6=normalized_score;
    document.getElementById('score').textContent = 'Your score: ' + normalized_score;
  }
  
  //abstract
  function abstractScore() {
      const perscore = (score / questions.length) * 100;
      const normalized_score = ((perscore - 0) * (10 - 1)) / (100 - 0) + 1;
      document.getElementById("score-container").textContent =
        "Your score: " + parseFloat(normalized_score.toFixed(2));
      document.getElementById("submit-btn").style.display = "none"; // Hide the submit button
    }




   