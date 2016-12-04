var state = {
questions: [
{
	text: "How many players are on the field for the team on defense?",
	choices: ["7", "8", "9", "10"],
	answerIndex: 2
},
{
	text: "How many strikes does it take to get a strikeout?",
	choices: ["1", "2", "3", "4"],
	answerIndex: 2
},
{
	text: "How many balls does it take to get a walk?",
	choices: ["2", "3", "4", "5"],
	answerIndex: 2
},
{
	text: "How many innings are there in a major league game?",
	choices: ["8", "9", "10", "11"],
	answerIndex: 1
},
{
	text: "How many games does a major league season consist of?",
	choices: ["150",  "181",  "162", "170"],
	answerIndex: 2
}
],

good: [
		"Nice job!",
		"Way to go!"],

bad: [	
		"Not even close.",
		"What are you doing!"],

score: 0, // track score
currentQuestionIndex: 0, //track current question
path: 'start', // will be used to go from page to page
lastAnswerCorrect: false, // used in our functions for answering questions
feedbackRandom: 0,

};

// state stuff

function setPath(state, path) { 
	// this is used to traverse the different pages
	state.path = path;
};

function resetGame(state) {
	state.score = 0;
	state.currentQuestionIndex = 0;
	setPath(state, 'start');
};

function answerQuestion(state, answer) {
	// this will shoot back good or back feedback after answers
	var currentQuestion = state.questions[state.currentQuestionIndex];
	state.lastAnswerCorrect = currentQuestion.answerIndex === answer;
	if (state.lastAnswerCorrect) {
		state.score++;
	}
	selectFeedback(state);
	setPath(state, 'answer-feedback');
};

function selectFeedback(state) {
	state.feedbackRandom = Math.random();
};

function advance(state) {
	// this will determine if quiz is over, if not it will continue
	state.currentQuestionIndex++;
	if(state.currentQuestionIndex === state.questions.length) {
		setPath(state, 'final-feedback');
	}

	else {
		setPath(state, 'question');
	}
};

// Render Functions

	
// this is the big funciton we will call that will display quiz
function renderQuiz(state, elements) {
	Object.keys(elements).forEach(function(path) {
	// this will hide all the pages then display current page using the path(hopefully)
	elements[path].hide();
	});

	elements[state.path].show();

	if (state.path === 'start') {
		renderStartPage(state, elements[state.path]);// starter page but is already loaded
	}

	else if (state.path === 'question') {
		renderQuestionPage(state, elements[state.path]); // sets path to quesiton page
	}

	else if (state.path === 'answer-feedback') {
		renderAnswerFeedbackPage(state, elements[state.path]); // sets path to feedback page
	}

	else if (state.path === 'final-feedback') {
		renderFinalFeedbackPage(state, elements[state.path]); // sets path to final feedback page
	}
};


function renderStartPage(state, element) {
	// i dont think we need to do anything here
	// i think we just need it to be accounted for in function above
};

function renderQuestionPage(state, element) {
	// this will display question page
	renderQuestionCount(state,  element.find('.question-count'));
	renderQuestionText(state, element.find('.question-text'));
	renderChoices(state,  element.find('.choices'));
};

function renderAnswerFeedbackPage(state, element) {
	//  this will display feedback after every question and contain 'next' button
	renderAnswerFeedbackHeader(state, element.find('.feedback-header'));
	renderAnswerFeedbackText(state, element.find('.feedback-text'));
	renderNextButtonText(state, element.find('.see-next'));
};

function renderFinalFeedbackPage(state, element) {
	// this will display final feedback at the end of quiz.
	renderFinalFeedbackText(state, element.find('.results-text'));
};

function renderQuestionCount(state, element) {
	var text = (state.currentQuestionIndex + 1) + "/" + state.questions.length;

	element.text(text);
};

function renderQuestionText(state, element) {
	// this will render the question
	var currentQuestion = state.questions[state.currentQuestionIndex];
	element.text(currentQuestion.text);
};

function renderChoices(state, element){
	// this will render choices
	var currentQuestion = state.questions[state.currentQuestionIndex];
	var choices = currentQuestion.choices.map(function(choice, index) {
		return (
			'<li>' +
			'<input type="radio" name="user-answer" value="' + index + '" required>' +
			'<label>' + choice + '</label>' +
			'</li>'
		);	
	});

	element.html(choices);
};

function renderAnswerFeedbackHeader(state, element) {
	var html = state.lastAnswerCorrect ?
	"<h5 class='user-was-correct'>correct</h5>" :
	"<h4 class='user-was-incorrect'>Wrong!</>";

	element.html(html);
};

function renderAnswerFeedbackText(state, element) {
	var choices = state.lastAnswerCorrect ? state.good : state.bad;
	var text = choices[Math.floor(state.feedbackRandom * choices.length)];

	element.text(text);
};

function renderNextButtonText(state, element) {
	var text = state.currentQuestionIndex < state.questions.length - 1 ? 
	"Next" : "How did I do?";

	element.text(text);
};

function renderFinalFeedbackText(state,  element) {
	// will display when you complete quiz
	var text = "You got " + state.score + " out of " + state.questions.length + " questions right.";

	element.text(text);
};


// Event handlers

var PAGE_ELEMENTS = {
	'start': $('.start-page'),
	'question': $('.questions-page'),
	'answer-feedback': $('.answer-feedback-page'),
	'final-feedback': $('.final-feedback-page'),
};


$(".game-start").submit(function(event) {
	// handler to start quiz and go to first question
	event.preventDefault();
	setPath(state, 'question');
	renderQuiz(state, PAGE_ELEMENTS);
});

$('.restart-game').click(function(event) {
	// restarts quiz
	event.preventDefault();
	resetGame(state);
	renderQuiz(state, PAGE_ELEMENTS);
});

$("form[name='current-question']").submit(function(event) {
	// this is recieiving the selections from user
	event.preventDefault();
	var answer = $("input[name='user-answer']:checked").val();
	answer = parseInt(answer, 10);
	answerQuestion(state, answer);
	renderQuiz(state, PAGE_ELEMENTS);
});

$('.see-next').click(function(event) {
	advance(state);
	renderQuiz(state, PAGE_ELEMENTS);
});


$(function() {
	renderQuiz(state, PAGE_ELEMENTS);
});


//nothing





