$(document).ready(function () {

    let currentCourse = "";
    let totalLessons = {
        pythonCourse: 6,
        cppCourse: 6,
        htmlCourse: 4,
        tkinterCourse: 3,
        jsCourse: 3,
        jqueryCourse: 2,
        bootstrapCourse: 2
    };

    function hideAllCourses() {
        $(".course_container").hide();
    }

    function resetCourse(courseId) {
        $("#" + courseId + " .lesson, #" + courseId + " .quiz").hide();
        $("#" + courseId + " .lesson[data-index='0']").show();
    }

    function loadProgress(courseId) {
        let key = `progress_${courseId}_${user}`;
        let index = localStorage.getItem(key);

        if (index !== null) {
            hideAllCourses();
            $("#" + courseId).show();
            $("#" + courseId + " .lesson, #" + courseId + " .quiz").hide();

            if (index < totalLessons[courseId] - 1) {
                $(`#${courseId} .lesson[data-index='${index}']`).show();
            } else {
                $(`#${courseId} .quiz`).show();
            }
        }
    }

    function saveProgress(courseId, index) {
        let key = `progress_${courseId}_${user}`;
        localStorage.setItem(key, index);
    }

    // Hide popup if clicking outside
    $(document).click(function(e) {
        if ($(e.target).closest(".enroll_popup, #enroll").length === 0) {
            $(".enroll_popup").hide();
            $("body").css("overflow", "auto");
        }
    });

    // Show enrollment popup
    $("#enroll").click(function () {
        $(".enroll_popup").css("display", "flex");
        $("body").css("overflow", "hidden");
    });

    // Next lesson button
    $(".next-btn").click(function () {
        let courseId = $(this).closest(".course_container").attr("id");
        let index = parseInt($(this).closest(".lesson").attr("data-index"));
        let next = index + 1;

        if (next < totalLessons[courseId] ) {
            $(this).closest(".lesson").hide();
            $(`#${courseId} .lesson[data-index='${next}']`).show();
            saveProgress(courseId, next);
        } else {
            $(this).closest(".lesson").hide();
            $(`#${courseId} .quiz`).show();
            saveProgress(courseId, totalLessons[courseId] - 1);
        }
    });

    // Submit quiz
    let countKey = `completed_course_count_${user}`;
    let completed_course_count=Number(localStorage.getItem(countKey))||0
    $(".submitQuiz").click(function () {
        let correct = true;

        $(this).closest(".quiz").find("input[type='radio']").each(function () {
            let name = $(this).attr("name");
            if ($(`input[name='${name}']:checked`).val() !== "correct") {
                correct = false;
            }
        });

        let summary = $(this).siblings(".summary");

        if (correct) {
            summary.text("Quiz Passed!");
            
            console.log(countKey)
            completed_course_count++;
            localStorage.setItem(countKey,completed_course_count);
        } else {
            summary.text("Some answers are wrong. Try again.");
        }
    });

    // Enroll and open course
    // Enroll and open course, always start at index 0
$(".enroll_popup ul li").click(function () {
    let id = $(this).attr("id");
    let courseMap = {
        open_python_course: "pythonCourse",
        open_cpp_course: "cppCourse",
        open_html_course: "htmlCourse",
        open_tkinter_course: "tkinterCourse",
        open_js_course: "jsCourse",
        open_jquery_course: "jqueryCourse",
        open_bootstrap_course: "bootstrapCourse"
    };

    currentCourse = courseMap[id];
    hideAllCourses();
    $(".enroll_popup").hide();
    $("body").css("overflow", "auto");

    // Always start at lesson 0
    $("#" + currentCourse + " .lesson, #" + currentCourse + " .quiz").hide();
    $(`#${currentCourse} .lesson[data-index='0']`).show();
    $("#" + currentCourse).show();

    // Optionally reset progress in localStorage
    saveProgress(currentCourse, 0);
});



});
