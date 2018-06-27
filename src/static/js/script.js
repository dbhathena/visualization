$( document ).ready(function() {
    console.log("I'm working");
    $("#names_dropdown").change(function() {
//        alert("Oops!");
        $.ajax({
            url: "/viz_app/test/",
            data: { name: $("#names_dropdown").val() },
            dataType: "json"
        }).done(function(data) {
            var subject_data = data.subject_data;
            for (var i=0; i<subject_data.length; i++) {
                subject_data[i][0] = new Date(subject_data[i][0]);
                console.log(subject_data[i]);
//                $("<div>" + subject_data[i][1] + "</div>").insertAfter("#title");
            }
        });
    });
});

