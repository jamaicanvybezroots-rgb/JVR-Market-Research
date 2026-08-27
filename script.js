/*
  JAMAICAN VYBEZ ROOTS
  PRODUCT TASTE EVALUATION
*/


/* ================================
   BASIC SETUP
================================ */

const ageScreen = document.getElementById("ageScreen");
const underageScreen = document.getElementById("underageScreen");
const welcomeScreen = document.getElementById("welcomeScreen");
const surveyScreen = document.getElementById("surveyScreen");
const thankYouScreen = document.getElementById("thankYouScreen");

const ageYes = document.getElementById("ageYes");
const ageNo = document.getElementById("ageNo");

const startBtn = document.getElementById("startBtn");

const surveyForm = document.getElementById("surveyForm");

const questions = Array.from(
  document.querySelectorAll(".question")
);

const progressFill =
  document.getElementById("progressFill");

const progressText =
  document.getElementById("progressText");

const progressPercent =
  document.getElementById("progressPercent");

const finalScore =
  document.getElementById("finalScore");

const improvements =
  document.getElementById("improvements");

const characterCount =
  document.getElementById("characterCount");

let currentQuestion = 0;


/* ================================
   YEAR
================================ */

document.getElementById("year").textContent =
  new Date().getFullYear();


/* ================================
   SCREEN FUNCTION
================================ */

function showScreen(screen) {

  document
    .querySelectorAll(".screen")
    .forEach(item => {
      item.classList.remove("active");
    });

  screen.classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* ================================
   AGE CONFIRMATION
================================ */

ageYes.addEventListener("click", function () {

  showScreen(welcomeScreen);

});


ageNo.addEventListener("click", function () {

  showScreen(underageScreen);

});


/* ================================
   START SURVEY
================================ */

startBtn.addEventListener("click", function () {

  currentQuestion = 0;

  showScreen(surveyScreen);

  updateQuestion();

});


/* ================================
   CHECK QUESTION ANSWER
================================ */

function hasAnswer(questionElement) {

  const inputs =
    questionElement.querySelectorAll(
      "input[type='radio']"
    );

  if (inputs.length > 0) {

    return Array.from(inputs)
      .some(input => input.checked);

  }

  const textarea =
    questionElement.querySelector("textarea");

  if (textarea) {

    return textarea.value.trim().length > 0;

  }

  return true;
}


/* ================================
   NEXT BUTTONS
================================ */

document
  .querySelectorAll(".next-btn")
  .forEach(button => {

    button.addEventListener("click", function () {

      const current =
        questions[currentQuestion];

      if (!hasAnswer(current)) {

        alert(
          "Please select an answer before continuing."
        );

        return;

      }

      currentQuestion++;

      updateQuestion();

    });

  });


/* ================================
   UPDATE QUESTION
================================ */

function updateQuestion() {

  questions.forEach(
    question => question.classList.remove(
      "active-question"
    )
  );

  if (currentQuestion >= questions.length) {

    return;

  }

  questions[currentQuestion]
    .classList.add("active-question");


  const visibleQuestionNumber =
    currentQuestion + 1;

  const totalQuestions =
    questions.length;


  const percent =
    Math.round(
      (visibleQuestionNumber /
        totalQuestions) * 100
    );


  progressText.textContent =
    `Question ${visibleQuestionNumber} of ${totalQuestions}`;

  progressPercent.textContent =
    `${percent}%`;

  progressFill.style.width =
    `${percent}%`;

}


/* ================================
   CHARACTER COUNT
================================ */

if (improvements) {

  improvements.addEventListener(
    "input",
    function () {

      characterCount.textContent =
        improvements.value.length;

    }
  );

}


/* ================================
   GET FORM DATA
================================ */

function getFormData() {

  const formData =
    new FormData(surveyForm);

  const data = {};

  for (const [key, value] of formData.entries()) {

    data[key] = value;

  }

  return data;

}


/* ================================
   SAVE LOCALLY
================================ */

function saveEvaluation(data) {

  const existing =
    JSON.parse(
      localStorage.getItem(
        "jvrEvaluations"
      ) || "[]"
    );


  data.id =
    "JVR-" +
    Date.now();


  data.timestamp =
    new Date().toISOString();


  existing.push(data);


  localStorage.setItem(
    "jvrEvaluations",
    JSON.stringify(existing)
  );

}


/* ================================
   SUBMIT
================================ */

surveyForm.addEventListener(
  "submit",
  function (event) {

    event.preventDefault();


    const finalQuestion =
      questions[currentQuestion];


    if (!hasAnswer(finalQuestion)) {

      alert(
        "Please enter your feedback before submitting."
      );

      return;

    }


    const data =
      getFormData();


    /*
      Save the evaluation in the browser
      for now.
    */

    saveEvaluation(data);


    /*
      Show score on thank-you page.
    */

    finalScore.textContent =
      data.overallScore || "—";


    showScreen(thankYouScreen);


    /*
      This is where we will eventually
      send the evaluation to a real
      online database.
    */

    console.log(
      "JVR Evaluation:",
      data
    );

  }
);
