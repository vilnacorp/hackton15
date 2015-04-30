var isAdmin = false;

function navigate(formerPage, nextPage) {
    $('#' + formerPage).hide();
    $('#' + nextPage).fadeIn();
}

function RemoveText(obj) {
    obj.value = '';
}


