$(document).ready(function () {

    checkIfLogged(function (data) {
        isAdmin = data.admin;

        if (data.status) {
            navigate("loginPage", "coursePage");
        } else {
            navigate("coursePage", "loginPage");
        }
    });


    $('#login').click(loginValidation);

    $('#register').click(goToRegister);

    $('#registerNewUser').click(registerValidation);

    $('#goToLogin').click(goToLogin);

    $('#enterCourse').click(courseValidation);


    $('#loginPage').keydown(function (e) {
        if (e.keyCode == 13) {
            loginValidation();
        }
    });

    $('#registerPage').keydown(function (e) {
        if (e.keyCode == 13) {
            registerValidation();
        }
    });

    $('#coursePage').keydown(function (e) {
        if (e.keyCode == 13) {
            courseValidation();
        }
    });


});


function loginValidation() {

    var username = $('#username').val();
    var password = $('#password').val();

    if (username === '' || password === '') {
        alert("Please fill all required details");
    } else {
        ajaxLogin(username, password, function (err, data) {
            if (err) {
                alert("wrong password or username");
            } else {
                navigate("loginPage", "coursePage");
                $('#username').val("");
                $('#password').val("");
            }
        });
    }
}


function registerValidation() {
    var newUsername = $('#newUsername').val();
    var newFullName = $('#newFullName').val();
    var newPassword = $('#newPassword').val();
    var newConfirmPassword = $('#newConfirmPassword').val();
    var email = $('#newEmail').val();
    var newAdminKey = $('#newAdminKey').val();

    if (newUsername === '' || newFullName === '' || newPassword === '' || newConfirmPassword === '' || email === '') {
        alert("please fill all fields");
    } else if (newPassword != newConfirmPassword) {
        $('#newPassword').val("");
        $('#newConfirmPassword').val("");
        alert("Please enter the same password");
    } else {
        ajaxRegister(newUsername, newFullName, newPassword, email, newAdminKey, function (err, data) {
            if (err) {
                alert("Username already exist");
            } else {
                navigate("registerPage", "coursePage");
                $('#newUsername').val("");
                $('#newPassword').val("");
                $('#newFullName').val("");
                $('#newConfirmPassword').val("");
                $('#newEmail').val("");
                $('#newAdminKey').val("");
            }
        })
    }

}

function courseValidation() {
    var courseNumber = $('#courseNumber').val();
    if (courseNumber === '') {
        alert("Please enter course number");
    } else {

        ajaxCourseNumber(courseNumber, function (err, data) {
            if (err) {
                //no such course and not admin
                alert("No such course number");
            } else { //course exists or created by admin
                currentCourseNumber = courseNumber;
                liveLecture();
                startTimer();
                $("#courseTitle").text("Course number : " + currentCourseNumber.toString());
                navigate("coursePage", "lecturePage");
            }
        })
    }

}


function goToRegister() {
    navigate("loginPage", "registerPage");
    $('#username').val("");
    $('#password').val("");
}

function goToLogin() {
    navigate("registerPage", "loginPage");
    $('#newUsername').val("");
    $('#newPassword').val("");
    $('#newFullName').val("");
    $('#newConfirmPassword').val("");
    $('#newEmail').val("");
    $('#newAdminKey').val("");
}


//-------------------------------------------------ajax request------------------------------------------------------


function ajaxLogin(username, password, callback) {
    $.ajax({
        url: '/backend/login',
        type: 'post',
        data: {
            username: username,
            password: password
        },
        success: function (data) {
            isAdmin = data.admin;
            callback(null, data);
        },
        error: function () {
            callback("wrong");
        }
    });
}

function ajaxRegister(newUsername, newFullName, newPassword, email, newAdminKey, callback) {
    $.ajax({
        url: '/backend/register',
        type: 'post',
        data: {
            email: email,
            username: newUsername,
            password: newPassword,
            name: newFullName,
            adminId: newAdminKey
        },
        success: function (data) {
            if (data.admin) {
                isAdmin = true;
            }
            callback(null, data)
        },
        error: function () {
            callback("Wrong");
        }

    })
}


function ajaxCourseNumber(courseNumber, callback) {

    $.ajax({
        url: '/backend/session/join',
        type: 'post',
        data: {
            sessionId: courseNumber
        },
        success: function (data) {
            callback(null, data);
        },
        error: function () {
            callback("wrong");
        }


    })
}


function checkIfLogged(callback) {
    $.ajax({
        url: '/backend/logged',
        type: 'get',
        data: {},
        success: function (data) {
            callback(data);
        }
    })
}
