$( document ).ready(function() {
    console.log("I'm working");
    $("#names_dropdown, #type_dropdown, #frequency_dropdown").change(function() {
//        alert("Oops!");
        $(".chart").remove();
        $.ajax({
            url: "/viz_app/test/",
            data: { name: $("#names_dropdown").val(), type: $("#type_dropdown").val(), frequency: $("#frequency_dropdown").val() },
            dataType: "json"
        }).done(function(data) {
            var margin = {top: 20, right: 20, bottom: 30, left: 50},
                width = 1400 - margin.left - margin.right,
                height = 700 - margin.top - margin.bottom;

            var x = d3.scaleTime().range([0, width]);
            var y = d3.scaleLinear().range([height, 0]);

            var valueline = d3.line()
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.measurement); });

            var svg = d3.select(".chart-container").append("svg")
                .attr("class", "chart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g");

            var subject_data = data.subject_data;

            subject_data.forEach(function(d) {
                d.date = new Date(d.date);
                d.measurement = +d.measurement;
            });

            console.log(subject_data);

            subject_data.sort(function(a, b) {
                return a["date"]-b["date"];
            });

            x.domain(d3.extent(subject_data, function(d) {return d.date; }));
            y.domain([0, d3.max(subject_data, function(d) { return d.measurement; })])

            svg.append("path")
                .data([subject_data])
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
    });

});


