var displayTab = "HOT";
var currentCourseNumber = "";


$(document).ready(function () {

    $('#hotQuestions').click(function () {
        displayTab = "HOT";
        liveLecture();
    });

    $('#recentQuestions').click(function () {
        displayTab = "RECENT";
        liveLecture();
    });

    $('#sendQuestion').click(function () {
        var text = $('#newQuestion').val();
        if (text === "Enter your Question" || text === "") {
            alert("Enter your question before submit");
        } else {
            newQuestion(text, $('#withName').is(':checked'), function () {
                liveLecture();
            })
        }
    });

    $(document).on('change', '.questionLike', updateSingleQuestions);

});
function startTimer() {
    setInterval(liveLecture, 10000);
}

function liveLecture() {


    updateQuestions(function (data) {
        questions = data;
        switch (displayTab) {
            case "HOT":
                questions.sort(compareByVotes);
                break;
            case "RECENT":
                questions.sort(compareByTime);
                break;
        }
        var questionsToInject = createQuestionHtml();

        $('#questionsArea').children("ul").remove();
        $('#questionsArea').append(questionsToInject);
    });

}


function createQuestionHtml() {
    var template = '<ul>';
    var isCheck = '';
    for (var i = 0; i < questions.length; i++) {
        var question = questions[i];
        if (question.voted) {
            isCheck = 'checked';
        } else {
            isCheck = '';
        }
        template
            += '<li class="singleQuestion">'
            + '<span class="questionTime">' + question.time + '</span>'
            + '<span class="questionName">' + question['sender'] + '</span>'
            + '<span class="questionTitle">' + question.questionTitle + '</span>'
            + '<input type="checkbox" class="questionLike" id="like' + question.questionId.toString() + '" ' + isCheck +
            '>'
            + '<span class="questionRanking">' + question.ranking + '</span>'
            + '</li>';
        $('#like' + question.questionId.toString()).change(updateSingleQuestions)

    }

    template += '</ul>';
    return template;
}

function updateSingleQuestions() {

    var questionId = $(this).attr("id");
    var isLike = $(this).is(':checked');
    questionId = questionId.substring(4);
    updateSingleRank(questionId, isLike, function () {
        liveLecture();
    });

}

//-------------------------------------------------ajax request------------------------------------------------------


function updateQuestions(callback) {
    $.ajax({
        url: '/backend/session/' + currentCourseNumber,
        type: 'get',
        data: {},
        success: function (data) {
            callback(data);
        }
    })
}


function updateSingleRank(questionId, isLike, callback) {

    $.ajax({
        url: '/backend/session/' + currentCourseNumber + '/question/' + questionId + '/vote',
        type: 'put',
        data: {type: isLike},
        success: function (data) {
            callback(data);
        }

    })

}


function newQuestion(text, anonymous, callback) {

    $.ajax({
        url: '/backend/session/' + currentCourseNumber + '/question',
        type: 'post',
        data: {
            questionTitle: text,
            anonymous: anonymous
        },
        success: function (data) {
            callback();
        }
    });

}