$(document).ready(function () {
    let total_course = 7;

    // List of course IDs
    const courses = [
        'pythonCourse',
        'cppCourse',
        'htmlCourse',
        'tkinterCourse',
        'jsCourse',
        'jqueryCourse',
        'bootstrapCourse'
    ];

    let countKey = `completed_course_count_${user}`;
    let completed_course_count = Number(localStorage.getItem(countKey))||0;
    let incompleted_course_count = total_course - completed_course_count;
    console.log(user)
    console.log(completed_course_count)
    console.log(incompleted_course_count)

    // Update Pie Chart
    const ctx = $('#pie');
    window.pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Incompleted courses', 'Completed courses'],
            datasets: [{
                data: [incompleted_course_count, completed_course_count],
                backgroundColor: ['#d643ffff', '#0027c3ff']
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function (context) {
                            const total = incompleted_course_count + completed_course_count;
                            const value = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${value}%`;
                        }
                    }
                }
            }
        }
    });

    // Update DOM counters
    $("#info1 h1:contains('Completed Courses')").text(`Completed Courses: ${completed_course_count}`);
    $("#info1 h1:contains('Incompleted Courses')").text(`Incompleted Courses: ${incompleted_course_count}`);
});
