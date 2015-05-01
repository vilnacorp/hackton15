var displayTab = "HOT";
var currentCourseNumber = "";


$(document).ready(function () {

    $('#hotQuestions').click(function () {
        displayTab = "HOT";
        $(".questionLike").show();
        $(".questionAnswered").show();
        liveLecture();
    });

    $('#recentQuestions').click(function () {
        displayTab = "RECENT";
        $(".questionLike").show();
        $(".questionAnswered").show();
        liveLecture();
    });

    $("#answeredQuestions").click(function () {
        displayTab = "ANSWERED";
        $(".questionLike").hide();
        $(".questionAnswered").hide();
        liveLecture();
    });

    $("#backToCourse").click(function () {
        $("#courseNumber").val("");
        navigate("lecturePage", "coursePage");
    });

    $('#sendQuestion').click(function () {
        var text = $('#newQuestion').val();
        $('#newQuestion').val("Enter your Question");
        if (text === "Enter your Question" || text === "") {
            alert("Enter your question before submit");
        } else {
            newQuestion(text, $('#withName').is(':checked'), function () {
                liveLecture();
            })
        }
    });

    $(document).on('change', '.questionLike', updateSingleQuestions);
    $(document).on('change', '.questionAnswered', updateSingleQuestions);

});
function startTimer() {
    setInterval(liveLecture, 10000);
}

function liveLecture() {

    updateQuestions(function (data) {

        var questionsToInject;

        updateList(data);
        switch (displayTab) {
            case "HOT":
                questions.sort(compareByVotes);
                questionsToInject = createQuestionHtml(questions);
                break;
            case "RECENT":
                questions.sort(compareByTime);
                questionsToInject = createQuestionHtml(questions);
                break;
            case "ANSWERED":
                questionsToInject = createQuestionHtml(answeredQuestions);
                break;
        }

        var $questionsArea = $('#questionsArea');
        $questionsArea.children(".questionsList").remove();
        $questionsArea.append(questionsToInject);
    });

}


function createQuestionHtml(questions) {
    var checkBoxClass = '';
    if (isAdmin) {
        checkBoxClass = "questionAnswered";
    } else {
        checkBoxClass = "questionLike";
    }
    var template = '<div class="questionsList" align="center">';
    var isCheck = '';
    for (var i = 0; i < questions.length; i++) {
        var question = questions[i];

        var res = isAdmin ? question.answered : question.voted;

        if (res) {
            isCheck = 'checked';
        } else {
            isCheck = '';
        }

        var checkbox = "";
        if (displayTab !== 'ANSWERED') {
            checkbox = '<span class="' + checkBoxClass + '">' + '<input type="checkbox" class="' + checkBoxClass +
                '" id="like' +
                question.questionId.toString() + '" ' +
                isCheck + '>' + '</span>';
        }

        template += '<div class="row">' +
            ' <div class="col s12 m6">' +
            '<div class="card blue-grey darken-1">' +
            '<div class="card-content white-text">' +
            '<span class="card-title"></span>' +
            '<p>' + question.questionTitle + '</p>' +
            '</div>' +
            '<div class="card-action">' +
            '<span class="questionTime white-text">' + question.time + '</span>  ' +
            '<span class="questionName white-text">' + question.sender + '</span>' +
            '<span class="questionRanking white-text">' + question.ranking + '</span>' +
            checkbox +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        //template
        //    += '<tr class="singleQuestion">'
        //    + '<td class="questionTime">' + question.time + '</td>'
        //    + '<td class="questionName">' + question.sender + '</td>'
        //    + '<td class="questionTitle">' + question.questionTitle + '</td>'
        //    + '<td class="questionLike"><input type="checkbox" class="' + checkBoxClass + '" id="like' +
        //    question.questionId.toString() + '" ' +
        //    isCheck + '></td>'
        //    + '<td class="questionRanking">' + question.ranking + '</td>'
        //    + '</tr>';
        $('#like' + question.questionId.toString()).change(updateSingleQuestions)

    }

    template += '</div>';
    return template;
}

function updateSingleQuestions() {

    var questionId = $(this).attr("id");
    var isLike = $(this).is(':checked');
    if (!questionId) {
        return;
    }
    questionId = questionId.substring(4);
    if (isAdmin) {
        moveToAnswered(questionId, function () {
            liveLecture();
        });
    } else {
        updateSingleRank(questionId, isLike, function () {
            liveLecture();
        });
    }

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

function moveToAnswered(questionId, callback) {
    $.ajax({
        url: '/backend/session/' + currentCourseNumber + '/question/' + questionId + '/answer',
        type: 'put',
        data: {},
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