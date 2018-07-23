$( document ).ready(function() {
    // drawStudyTrendsGroup();
    drawStudyTrendsGroupNew();
    $("#names_dropdown, #type_dropdown, #aggregation_dropdown, #group_dropdown").change(function() {
        $(".chart").remove();
        if ($("#aggregation_dropdown").val() == "None") {
            $("#group_dropdown").hide();
            $("#names_dropdown").show();
            // drawStudyTrendsIndividual();
        } else {
            $("#names_dropdown").hide();
            $("#group_dropdown").show();
            // drawStudyTrendsGroup();
        }
    });
});

function drawStudyTrendsGroupNew() {
    var chart = c3.generate({
        bindto: d3.select('.chart-container'),
        data: {
            columns: [
                ['data1', 10, 20, 30, 20, 10, 15],
                ['data2', 52, 23, 27, 74, 14, 73]
            ]
        }
    });
}


function drawStudyTrendsIndividual() {
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
        const margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = window.innerWidth*0.9 - margin.left - margin.right,
            height = window.innerHeight*0.7 - margin.top - margin.bottom;

        const subject_data = data.subject_data;

        subject_data.forEach(function(d) {
            d.date = new Date(d.date);
            d.measurement = +d.measurement;
        });

        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        const valueline = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.measurement); });

        const svg = d3.select(".chart-container").append("svg")
            .attr("class", "chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


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
    });
}

function drawStudyTrendsGroup() {
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
        const margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = window.innerWidth*0.9 - margin.left - margin.right,
            height = window.innerHeight*0.7 - margin.top - margin.bottom;

        const group_data = data.aggregate_data;

        const x = d3.scaleLinear().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        const svg = d3.select(".chart-container").append("svg")
            .attr("class", "chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var maxY=0;
        for (var subgroup in group_data) {
            const subgroup_data = group_data[subgroup];
            console.log(subgroup);
            console.log(subgroup_data);
            subgroup_data.forEach(function(d) {
                d.date = +d.date;
                d.measurement = +d.measurement
            });
            const valueline = d3.line()
                .x(function(d) { return x(d.date); })
                .y(function(d) {
                    console.log(d.measurement);
                    return y(d.measurement);
                 });

            subgroup_data.sort(function(a, b) {
                return a["date"]-b["date"];
            });

            svg.append("path")
                .data([subgroup_data])
                .attr("class", "line")
                .attr("d", valueline);

            const currentMax = d3.max(subgroup_data, function(d) { return d.measurement});
            if (currentMax > maxY) {
                maxY = currentMax;
            }
        }
        console.log(maxY);
        x.domain([0, 55]);
        y.domain([0, maxY]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));
    });
}
