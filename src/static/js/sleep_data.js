var group_dropdown = $("#group_dropdown");
var names_dropdown = $("#names_dropdown");
var last_request;
const description = $("span#description-text");
var user_type;

$( document ).ready(function() {
    var group = group_dropdown.val();
    var name = names_dropdown.val();
    $.ajax( {
        url: "/get-user-type/",
        dataType: "json"
    }).done(function(data) {
        user_type = data.user;
        if (group_dropdown.val() === "None") {
            drawSleepDataIndividual()
        } else {
        //    TODO: drawSleepTrendsGroup
        }
    });
    $("#group_dropdown, #names_dropdown").change(function() {
        $("#loading").css("display", "flex");
        resetDescriptionText(description);
        if (group_dropdown.val() === "None") {
            if (user_type !== "participant") {
                $("#names_container").css("display", "flex");
                $("div.individual-description").css("display", "block");
            }
        drawSleepDataIndividual()
        } else {
            $("#names_container").css("display", "none");
            $("div.individual-description").css("display", "none")
        //    TODO: drawSleepTrendsGroup
        }
    });

    group_dropdown.change(function() {
        group = group_dropdown.val();
    });
    names_dropdown.change(function() {
        name = names_dropdown.val();
    });

    $(".preprocess-description").click(
        function() {
        //    TODO: add preprocess text
            description.css("font-style", "normal");
            description.css("color", "black");
        }
    );
    $(".group-description").click(
        function() {
            description.text(groupText[group]);
            description.css("font-style", "normal");
            description.css("color", "black");
        }
    );
    $(".individual-description").click(
        function() {
            description.text(getIndividualText(name));
            description.css("font-style", "normal");
            description.css("color", "black");
        }
    );
});

function drawSleepDataIndividual() {
    if (last_request && last_request.readyState !== 4) {
        last_request.abort();
    }
    last_request = $.ajax( {
        url: "/get-sleep-data/",
        data: {
            group: group_dropdown.val(),
            name: names_dropdown.val(),
        },
        dataType: "json"
    }).done(function(data) {
        const name = names_dropdown.val();
        const self_reported_data = data.self_reported_data;
        const recorded_data = data.recorded_data;
        const self_reported_data_none = data.self_reported_data_none;
        const recorded_data_none = data.recorded_data_none;

        const reported_trace = {
            x: self_reported_data["x"],
            y: self_reported_data["y"],
            mode: 'markers',
            name: 'Self-reported asleep',
            marker: {
                symbol: 'circle-open',
                size: 6,
                color: '#308491',
                line: {
                    width: 2
                }
            }
        };
        const recorded_trace = {
            x: recorded_data["x"],
            y: recorded_data["y"],
            mode: 'markers',
            name: 'Recorded asleep',
            marker: {
                size: 4,
                color: '#90d8cf'
            }
        };
        const reported_trace_none = {
            x: self_reported_data_none["x"],
            y: self_reported_data_none["y"],
            mode: 'markers',
            name: 'Self-reported asleep',
            marker: {
                symbol: 'circle-open',
                size: 6,
                color: '#999',
                line: {
                    width: 2
                }
            }
        };
        const recorded_trace_none = {
            x: recorded_data_none["x"],
            y: recorded_data_none["y"],
            mode: 'markers',
            name: 'Recorded asleep',
            marker: {
                size: 4,
                color: '#AAA'
            }
        };
        traces = [reported_trace, recorded_trace, reported_trace_none, recorded_trace_none];

        const layout = {
            title: "<b>Sleep trends for " + name + " </b>",
            font: {
                family: "Helvetica Neue, Helvetica, Arial, sans-serif",
                size: 16
            },
            titlefont: {
                size: 28
            },
            xaxis: {
                title: "Hour of Day",
                showline: false,
                zeroline: false,
                titlefont: {
                    size: 20
                },
                tickvals: [0,6,12,18,24]
            },
            yaxis: {
                title: "Day in Study",
                showline: true,
                autorange: 'reversed',
                zeroline: false,
                titlefont: {
                    size: 20
                },
                tickvals: [0,7,14,21,28,35,42,49,56]
            },
            showlegend: true,
            legend: {
                x: 1,
                y: 0.5
            },
            hovermode: false,
            // dragmode: false
        };

        Plotly.newPlot("chart1", traces, layout, {displayModeBar: false, responsive: true});
        $("#loading").css("display", "none");
    });
}