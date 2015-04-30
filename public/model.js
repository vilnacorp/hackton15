var questions = [];

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
        return 1;
    }
    if (first.time < second.time) {
        return -1;
    }
    // first must be equal to second
    return 0;
}