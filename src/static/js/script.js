$( document ).ready(function() {
    $("#names_dropdown").hide();
    drawStudyTrends();
    $("#names_dropdown, #type_dropdown, #aggregation_dropdown, #group_dropdown").change(function() {
        if ($("#aggregation_dropdown").val() == "None") {
            $("#group_dropdown").hide();
            $("#names_dropdown").show();
        } else {
            $("#names_dropdown").hide();
            $("#group_dropdown").show();
        }
        $(".chart").remove();
        drawStudyTrends();
    });
});


function drawStudyTrends() {
    $.ajax({
        url: "/viz_app/get-study-trends-data/",
        data: {
            type: $("#type_dropdown").val(),
            aggregation: $("#aggregation_dropdown").val(),
            group: $("#group_dropdown").val(),
            name: $("#names_dropdown").val(),
        },
        dataType: "json"
    }).done(function(data) {
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = window.innerWidth*0.9 - margin.left - margin.right,
            height = window.innerHeight*0.7 - margin.top - margin.bottom;

        if ($("#aggregation_dropdown").val() == "None") {
            var final_data = data.subject_data;
            final_data.forEach(function(d) {
                d.date = new Date(d.date);
                d.measurement = +d.measurement;
            });

            var x = d3.scaleTime().range([0, width]);
            var y = d3.scaleLinear().range([height, 0]);

        } else {
            var final_data = data.aggregate_data;
            final_data.forEach(function(d) {
                d.date = +d.date;
                d.measurement = +d.measurement;
            });

            var x = d3.scaleLinear().range([0, width]);
            var y = d3.scaleLinear().range([height, 0]);
        }

        var valueline = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.measurement); });

        var svg = d3.select(".chart-container").append("svg")
            .attr("class", "chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        final_data.sort(function(a, b) {
            return a["date"]-b["date"];
        });

        x.domain(d3.extent(final_data, function(d) {return d.date; }));
        y.domain([0, d3.max(final_data, function(d) { return d.measurement; })])

        svg.append("path")
            .data([final_data])
            .attr("class", "line")
            .attr("d", valueline);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));

//            for (var i=0; i<subject_data.length; i++) {
//                subject_data[i][0] = new Date(subject_data[i][0]);
//                const date = subject_data[i][0];
//                const point = subject_data[i][1];
//                console.log(subject_data[i]);
//                $("<div>" + subject_data[i][1] + "</div>").insertAfter("#title");
//            }
    });
}