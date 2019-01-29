var category_dropdown = $("#category_dropdown");
var group_dropdown = $("#group_dropdown");
var aggregation_dropdown = $("#aggregation_dropdown");
var names_dropdown = $("#names_dropdown");
const chart_colors = [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf'
];
const error_colors = [
    'rgba(31, 119, 180, 0.2)',
    'rgba(255, 127, 14, 0.2)',
    'rgba(44, 160, 44, 0.2)',
    'rgba(214, 39, 40, 0.2)',
    'rgba(148, 103, 189, 0.2)',
    'rgba(140, 86, 75, 0.2)',
    'rgba(227, 119, 194, 0.2)',
    'rgba(127, 127, 127, 0.2)',
    'rgba(188, 189, 34, 0.2)',
    'rgba(23, 190, 207, 0.2)'
];

$( document ).ready(function() {
    var category = category_dropdown.val();
    var dataType = $("#" + category_dropdown.val() + "_dropdown").val();
    var group = group_dropdown.val();
    var aggregation = aggregation_dropdown.val();
    var name = names_dropdown.val();

    drawStudyTrendsGroup();
    $("#names_dropdown, .type_dropdown, #aggregation_dropdown, #group_dropdown, #category_dropdown").change(function() {
        $("#loading").css("display","flex");
        if (group_dropdown.val() === "None") {
            $("#aggregation_container").css("display", "none");
            $("#names_container").css("display", "flex");
            $("div.aggregation-description").css("display", "none");
            $("div.individual-description").css("display", "block");
            drawStudyTrendsIndividual();
        } else {
            $("#names_container").css("display", "none");
            $("#aggregation_container").css("display", "flex");
            $("div.individual-description").css("display", "none");
            $("div.aggregation-description").css("display", "block");
            drawStudyTrendsGroup();
        }
    });

    category_dropdown.change(function() {
        $(".data-dropdown-container").css("display", "none");
        $("#" + category_dropdown.val() + "_dropdown_container").css("display", "flex");
        category = category_dropdown.val();
        dataType = $("#" + category_dropdown.val() + "_dropdown").val();
    });
    $(".type_dropdown").change(function () {
        dataType = $("#" + category_dropdown.val() + "_dropdown").val();
    });
    group_dropdown.change(function () {
        group = group_dropdown.val();
    });
    aggregation_dropdown.change(function () {
        aggregation = aggregation_dropdown.val();
    });
    names_dropdown.change(function () {
        name = names_dropdown.val();
    });

    $(".category-description").hover(
        function () {
            description = $("span#description-text");
            description.text(dataCategoryText[category]);
            description.css("font-style", "normal");
            description.css("color", "black");
        },
        function () {
            description = $("span#description-text");
            description.text("Hover over the options below to see more details");
            description.css("font-style", "italic");
            description.css("color", "#666");
        }
    );
    $(".type-description").hover(
        function () {
            description = $("span#description-text");
            description.text(dataTypeTextDaily[dataType]);
            description.css("font-style", "normal");
            description.css("color", "black");
        },
        function () {
            description = $("span#description-text");
            description.text("Hover over the options below to see more details");
            description.css("font-style", "italic");
            description.css("color", "#666");
        }
    );
    $(".preprocess-description").hover(
        function () {
            description = $("span#description-text");
            description.text(preprocessTextDaily[dataType] || preprocessTextDefault);
            description.css("font-style", "normal");
            description.css("color", "black");
        },
        function () {
            description = $("span#description-text");
            description.text("Hover over the options below to see more details");
            description.css("font-style", "italic");
            description.css("color", "#666");
        }
    );
    $(".group-description").hover(
        function () {
            description = $("span#description-text");
            description.text(groupText[group]);
            description.css("font-style", "normal");
            description.css("color", "black");
        },
        function () {
            description = $("span#description-text");
            description.text("Hover over the options below to see more details");
            description.css("font-style", "italic");
            description.css("color", "#666");
        }
    );
    $(".aggregation-description").hover(
        function () {
            description = $("span#description-text");
            description.text(aggregationTextDaily[aggregation]);
            description.css("font-style", "normal");
            description.css("color", "black");
        },
        function () {
            description = $("span#description-text");
            description.text("Hover over the options below to see more details");
            description.css("font-style", "italic");
            description.css("color", "#666");
        }
    );
    $(".individual-description").hover(
        function () {
            description = $("span#description-text");
            description.text(getIndividualText(name));
            description.css("font-style", "normal");
            description.css("color", "black");
        },
        function () {
            description = $("span#description-text");
            description.text("Hover over the options below to see more details");
            description.css("font-style", "italic");
            description.css("color", "#666");
        }
    );
});

function drawStudyTrendsIndividual() {
    $.ajax({
        url: "/get-study-trends-data/",
        data: {
            type: $("#" + category_dropdown.val() + "_dropdown").val(),
            aggregation: aggregation_dropdown.val(),
            group: group_dropdown.val(),
            name: names_dropdown.val(),
        },
        dataType: "json"
    }).done(function(data) {
        const type = $("#" + category_dropdown.val() + "_dropdown").val();
        const name = names_dropdown.val();
        if (isTwoHands.has(type)) {
            const subject_data_left = data.subject_data["left"];
            const subject_data_right = data.subject_data["right"];

            const dates_left = [];
            const dates_right = [];
            subject_data_left["dates"].forEach(function(d) {
                dates_left.push(new Date(new Date(d).toDateString()));
            });
            subject_data_right["dates"].forEach(function(d) {
                dates_right.push(new Date(new Date(d).toDateString()));
            });

            const measurements_left = subject_data_left["measurements"];
            const measurements_right = subject_data_right["measurements"];
            const left_trace = {
                x: dates_left,
                y: measurements_left,
                yaxis: 'y',
                mode: 'lines',
                name: name + " - Left Hand",
                line: {
                    width: 1.5
                },
                text: "Left Hand",
                hoverinfo: "x+y+text"
            };

            const right_trace = {
                x: dates_right,
                y: measurements_right,
                yaxis: 'y2',
                mode: 'lines',
                name: name + " - Right Hand",
                line: {
                    width: 1.5
                },
                text: "Right Hand",
                hoverinfo: "x+y+text"
            };

            const layout = {
                title: "<b>" + titleForTypeDaily[type] + "</b>",
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
                xaxis: {
                    title: "Date",
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    }
                },
                yaxis: {
                    title: unitsDaily[type],
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    },
                    fixedrange: true,
                    domain: [0.53, 1]
                },
                yaxis2: {
                    title: unitsDaily[type],
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    },
                    fixedrange: true,
                    domain: [0, 0.47]
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

            Plotly.newPlot("chart1", [left_trace, right_trace], layout, {displayModeBar: false, responsive: true, scrollZoom: true});

        } else {
            const subject_data = data.subject_data[null];
            const dates = [];
            subject_data["dates"].forEach(function(d) {
                dates.push(new Date(new Date(d).toDateString()));
            });
            const measurements = subject_data["measurements"];

            const individual_trace = {
                x: dates,
                y: measurements,
                mode: 'lines',
                name: name,
                line: {
                    width: 1.5
                }
            };

            const layout = {
                title: "<b>" + titleForTypeDaily[type] + "</b>",
                font: {
                    family: "Helvetica Neue, Helvetica, Arial, sans-serif",
                    size: 16
                },
                titlefont: {
                    size: 28
                },
                xaxis: {
                    title: "Date",
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    }
                },
                yaxis: {
                    title: unitsDaily[type],
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    },
                    fixedrange: true
                },
                showlegend: true,
                legend: {
                    x: 1,
                    y: 0.5
                },
                dragmode: "pan",
            };

            Plotly.newPlot("chart1", [individual_trace], layout, {displayModeBar: false, responsive: true, scrollZoom: true});
        }
        $("#loading").css("display", "none");
    });
}

function drawStudyTrendsGroup() {
    $.ajax({
        url: "/get-study-trends-data/",
        data: {
            type: $("#" + category_dropdown.val() + "_dropdown").val(),
            aggregation: aggregation_dropdown.val(),
            group: group_dropdown.val(),
            name: names_dropdown.val(),
        },
        dataType: "json"
    }).done(function(data) {
        const type = $("#" + category_dropdown.val() + "_dropdown").val();
        const group_sizes = data.group_sizes;
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

        if (isTwoHands.has(type)) {
            const group_data_left = data.aggregate_data["left"];
            const group_data_right = data.aggregate_data["right"];
            const group_error_left = data.error_traces["left"];
            const group_error_right = data.error_traces["right"];

            const traces = [];
            var color_index = 0;
            for (const subgroup in group_data_left) {
                const group_size = group_sizes[subgroup];
                traces.push({
                    y: group_data_left[subgroup],
                    yaxis: 'y',
                    mode: 'lines',
                    name: subgroup + " (" + group_size + ")",
                    line: {
                        color: chart_colors[color_index],
                        width: 1.5
                    },
                    legendgroup: subgroup,
                    visible: true,
                    text: "Left Hand",
                    hoverinfo: "x+y+text"
                });
                traces.push({
                    x: group_error_left[subgroup]['x'],
                    y: group_error_left[subgroup]['y'],
                    fill: 'toself',
                    fillcolor: error_colors[color_index],
                    line: {
                        color: "transparent"
                    },
                    name: subgroup + " error left",
                    showlegend: false,
                    type: "scatter",
                    legendgroup:subgroup,
                    visible: errorIsVisible,
                    hoverinfo: "x"
                });
                traces.push({
                    y: group_data_right[subgroup],
                    yaxis: 'y2',
                    mode: 'lines',
                    name: subgroup + " (" + group_size + ") - Right Hand",
                    showlegend: false,
                    line: {
                        color: chart_colors[color_index],
                        width: 1.5
                    },
                    legendgroup: subgroup,
                    visible: true,
                    text: "Right Hand",
                    hoverinfo: "x+y+text"
                });
                traces.push({
                    x: group_error_right[subgroup]['x'],
                    y: group_error_right[subgroup]['y'],
                    yaxis: 'y2',
                    fill: 'toself',
                    fillcolor: error_colors[color_index],
                    line: {
                        color: "transparent"
                    },
                    name: subgroup + " error right",
                    showlegend: false,
                    type: "scatter",
                    legendgroup: subgroup,
                    visible: errorIsVisible,
                    hoverinfo: "x"
                });
                color_index = (color_index + 1)%10;
            }

            var updatemenus = [
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
                title: "<b>" + titleForTypeDaily[type] + "</b>",
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
                    title: "Day in Study",
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    }
                },
                yaxis: {
                    title: unitsDaily[type],
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    },
                    fixedrange: true,
                    domain: [0.53, 1]
                },
                yaxis2: {
                    title: unitsDaily[type],
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    },
                    fixedrange: true,
                    domain: [0, 0.47]
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
        } else {
            const group_data = data.aggregate_data;
            const group_error = data.error_traces;

            const traces = [];
            var color_index = 0;
            for (const subgroup in group_data) {
                const group_size = group_sizes[subgroup];
                traces.push({
                    y: group_data[subgroup],
                    mode: 'lines',
                    name: subgroup + " (" + group_size + ")",
                    line: {
                        width: 1.5,
                        color: chart_colors[color_index]
                    },
                    legendgroup: subgroup,
                    visible: true,
                    hoverinfo: "x+y"
                });
                traces.push({
                    x: group_error[subgroup]['x'],
                    y: group_error[subgroup]['y'],
                    fill: 'toself',
                    fillcolor: error_colors[color_index],
                    line: {
                        color: "transparent"
                    },
                    name: subgroup + " error",
                    showlegend: false,
                    type: "scatter",
                    legendgroup: subgroup,
                    visible: errorIsVisible,
                    hoverinfo: "x"
                });
                color_index = (color_index+1)%10;
            }

            var updatemenus = [
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
                title: "<b>" + titleForTypeDaily[type] + "</b>",
                font: {
                    family: "Helvetica Neue, Helvetica, Arial, sans-serif",
                    size: 16
                },
                titlefont: {
                    size: 28
                },
                updatemenus: updatemenus,
                xaxis: {
                    title: "Day in Study",
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    }
                },
                yaxis: {
                    title: unitsDaily[type],
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    },
                    fixedrange: true
                },
                showlegend: true,
                legend: {
                    x: 1,
                    y: 0.5
                },
                dragmode: "pan",
            };

            Plotly.newPlot("chart1", traces, layout, {displayModeBar: false, responsive: true, scrollZoom: true});
        }
        chart.on('plotly_buttonclicked', toggleErrorShading);
        chart.on('plotly_legendclick', function(clickData) {
            if (errorIsVisible && clickData.data[clickData.curveNumber].visible === 'legendonly') {
                chart.data[clickData.curveNumber+1].visible = true;
                if (isTwoHands.has(type)) {
                    chart.data[clickData.curveNumber+3].visible = true;
                }
            }
        });
        chart.on('plotly_legenddoubleclick', function() {return false;});
        $("#loading").css("display", "none");
    });
}
