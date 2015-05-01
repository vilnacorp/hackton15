var questions = [];
var answeredQuestions = [];

function compareByVotes(first, second) {
    if (first.ranking > second.ranking) {
        return -1;
    }
    if (first.ranking < second.ranking) {
        return 1;
    }
    // first must be equal to second
    return 0;
}

function compareByTime(first, second) {
    if (first.time > second.time) {
        return -1;
    }
    if (first.time < second.time) {
        return 1;
    }
    // first must be equal to second
    return 0;
}

function updateList(data) {
    questions = [];
    answeredQuestions = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].answered) {
            answeredQuestions.push(data[i]);
        } else {
            questions.push(data[i]);
        }
    }
    answeredQuestions.sort(compareByTime);
}