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
            drawSleepDataIndividual();
        } else {
            drawSleepDataGroup();
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
            drawSleepDataIndividual();
        } else {
            $("#names_container").css("display", "none");
            $("div.individual-description").css("display", "none")
            drawSleepDataGroup();
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
            },
            legendgroup: "reported"
        };
        const recorded_trace = {
            x: recorded_data["x"],
            y: recorded_data["y"],
            mode: 'markers',
            name: 'Recorded asleep',
            marker: {
                size: 4,
                color: '#90d8cf'
            },
            legendgroup: "recorded"
        };
        const reported_trace_none = {
            x: self_reported_data_none["x"],
            y: self_reported_data_none["y"],
            mode: 'markers',
            name: 'No self-reported data',
            marker: {
                symbol: 'circle-open',
                size: 6,
                color: '#999',
                line: {
                    width: 2
                }
            },
            legendgroup: "reported"
        };
        const recorded_trace_none = {
            x: recorded_data_none["x"],
            y: recorded_data_none["y"],
            mode: 'markers',
            name: 'No recorded data',
            marker: {
                size: 4,
                color: '#AAA'
            },
            legendgroup: "recorded"
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


function drawSleepDataGroup() {
    if (last_request && last_request.readyState !== 4) {
        last_request.abort();
    }
    last_request = $.ajax( {
        url: "/get-sleep-data/",
        data: {
            group: group_dropdown.val(),
        },
        dataType: "json"
    }).done(function(data) {
        const recorded_x = data.recorded_x;
        const recorded_y = data.recorded_y;
        const recorded_error = data.recorded_error;
        const reported_x = data.reported_x;
        const reported_y = data.reported_y;
        const reported_error = data.reported_error;

        var errorIsVisible = false;
        var chart = document.getElementById('chart1');
        function toggleErrorShading() {
            const traceIndices = [];
            for (var i=0; i < chart.data.length; i++) {
                if (errorIsVisible && chart.data[i].name.includes("error")) {
                    traceIndices.push(i);
                }
                if (!errorIsVisible && chart.data[i].name.includes("error") && chart.data[i-1].visible === true) {
                    traceIndices.push(i);
                }
            }

            var button_label;
            if (errorIsVisible) {
                button_label = "Show Error Shading";
            } else {
                button_label = "Hide Error Shading";
            }

            const data_update = {
                visible: !errorIsVisible
            };

            const layout_update = {
                'updatemenus[0].buttons[0].label': button_label
            };

            if (traceIndices.length > 0) {
                Plotly.update('chart1', data_update, layout_update, traceIndices);
            } else {
                Plotly.relayout('chart1', layout_update);
            }

            errorIsVisible = !errorIsVisible;
        }

        const traces = [];
        let color_index = 0;
        for (const subgroup in recorded_x) {
            traces.push({
                x: recorded_x[subgroup],
                y: recorded_y[subgroup],
                yaxis: 'y',
                mode: 'lines',
                name: subgroup,
                line: {
                    color: chart_colors[color_index],
                    width: 1.5
                },
                legendgroup: subgroup,
                visible: true,
                text: "Recorded Sleep",
                hoverinfo: "y+text"
            });
            traces.push({
                x: recorded_error[subgroup]['x'],
                y: recorded_error[subgroup]['y'],
                fill: 'toself',
                fillcolor: error_colors[color_index],
                line: {
                    color: "transparent"
                },
                name: subgroup + " error recorded",
                showlegend: false,
                type: "scatter",
                legendgroup: subgroup,
                visible: errorIsVisible,
                hoverinfo: "x"
            });
            traces.push({
                x: reported_x[subgroup],
                y: reported_y[subgroup],
                yaxis: 'y2',
                mode: 'lines',
                name: subgroup + " Reported",
                line: {
                    color: chart_colors[color_index],
                    width: 1.5
                },
                legendgroup: subgroup,
                showlegend: false,
                visible: true,
                text: "Right Hand",
                hoverinfo: "y+text"
            });
            traces.push({
                x: reported_error[subgroup]['x'],
                y: reported_error[subgroup]['y'],
                yaxis: 'y2',
                fill: 'toself',
                fillcolor: error_colors[color_index],
                line: {
                    color: "transparent"
                },
                name: subgroup + " error reported",
                showlegend: false,
                type: "scatter",
                legendgroup: subgroup,
                visible: errorIsVisible,
                hoverinfo: "x"
            });
            color_index = (color_index + 1)%10;
        }

        const updatemenus = [
            {
                buttons: [
                    {
                        label: 'Show Error Shading',
                        method: 'skip'
                    },
                ],
                direction: 'right',
                showactive: false,
                type: 'buttons',
                x: 1.1,
                xanchor: 'right',
                y: 1.1,
                yanchor: 'top',
                bgcolor: 'rgba(76, 175, 80, 0.5)',
                bordercolor: 'transparent'
            }
        ];

        const layout = {
            title: "<b>Sleep Trends</b>",
            margin: {
                pad: 4
            },
            font: {
                family: "Helvetica Neue, Helvetica, Arial, sans-serif",
                size: 16
            },
            titlefont: {
                size: 28
            },
            updatemenus: updatemenus,
            xaxis: {
                title: "Hour of Day",
                showline: true,
                zeroline: false,
                titlefont: {
                    size: 20
                },
                tickvals: [0,6,12,18,24]
            },
            yaxis: {
                title: "Fraction asleep",
                showline: true,
                zeroline: false,
                titlefont: {
                    size: 20
                },
                fixedrange: true,
                domain: [0.53, 1],
            },
            yaxis2: {
                title: "Fraction asleep",
                showline: true,
                zeroline: false,
                titlefont: {
                    size: 20
                },
                fixedrange: true,
                domain: [0, 0.47],
            },
            showlegend: true,
            legend: {
                x: 1,
                y: 0.5
            },
            dragmode: "pan",
            grid: {
                subplots: [['xy'], ['xy2']]
            },
            shapes: [{
                type: 'line',
                xref: 'paper',
                yref: 'paper',
                x0: 0,
                x1: 1,
                y0: 0.5,
                y1: 0.5,
                line: {
                    width: 1
                }
            }]
        };

        Plotly.newPlot("chart1", traces, layout, {displayModeBar: false, responsive: true, scrollZoom: true});
        chart.on('plotly_buttonclicked', toggleErrorShading);
        chart.on('plotly_legendclick', function(clickData) {
            if (errorIsVisible && clickData.data[clickData.curveNumber].visible === 'legendonly') {
                chart.data[clickData.curveNumber+1].visible = true;
                chart.data[clickData.curveNumber+3].visible = true;
            }
        });
        chart.on('plotly_legenddoubleclick', function() {return false;});
        $("#loading").css("display", "none");
    });
}
