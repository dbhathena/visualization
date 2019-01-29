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

    drawDailyTrendsGroup();
    $("#names_dropdown, .type_dropdown, #aggregation_dropdown, #group_dropdown, #category_dropdown").change(function() {
        $("#loading").css("display","flex");
        if (group_dropdown.val() === "None") {
            $("#aggregation_container").css("display", "none");
            $("#names_container").css("display", "flex");
            $("div.aggregation-description").css("display", "none");
            $("div.individual-description").css("display", "block");
            drawDailyTrendsIndividual();
        } else {
            $("#names_container").css("display", "none");
            $("#aggregation_container").css("display", "flex");
            $("div.individual-description").css("display", "none");
            $("div.aggregation-description").css("display", "block");
            drawDailyTrendsGroup();
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
    group_dropdown.change(function() {
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
            description.text(getDataCategoryText(category));
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
            description.text(getDataTypeText(dataType));
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
            description.text(getPreprocessText(dataType));
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
            description.text(getGroupText(group));
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
            description.text(getAggregationText(aggregation));
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

function drawDailyTrendsIndividual() {
    $.ajax({
        url: "/get-daily-trends-data/",
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
        if (isTwoHands(type)) {
            const subject_data_left = data.subject_data["left"];
            const subject_data_right = data.subject_data["right"];

            const left_trace = {
                y: subject_data_left,
                yaxis: 'y',
                mode: 'lines',
                name: name + " - Left Hand",
                line: {
                    width: 1.5
                }
            };

            const right_trace = {
                y: subject_data_right,
                yaxis: 'y2',
                mode: 'lines',
                name: name + " - Right Hand",
                line: {
                    width: 1.5
                }
            };

            const layout = {
                title: "<b>" + getTitle(type) + "</b>",
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
                    title: "Hour of Day",
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    }
                },
                yaxis: {
                    title: getUnits(type),
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    },
                    fixedrange: true,
                    domain: [0.5, 1]
                },
                yaxis2: {
                    title: getUnits(type),
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    },
                    fixedrange: true,
                    domain: [0, 0.5]
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
            const subject_data = data.subject_data["both"];

            const individual_trace = {
                y: subject_data,
                mode: 'lines',
                name: name,
                line: {
                    width: 1.5
                }
            };

            const layout = {
                title: "<b>" + getTitle(type) + "</b>",
                font: {
                    family: "Helvetica Neue, Helvetica, Arial, sans-serif",
                    size: 16
                },
                titlefont: {
                    size: 28
                },
                xaxis: {
                    title: "Hour of Day",
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    }
                },
                yaxis: {
                    title: getUnits(type),
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
        $("#loading").css("display","none");
    });
}

function drawDailyTrendsGroup() {
    $.ajax({
        url: "/get-daily-trends-data/",
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

        if (isTwoHands(type)) {
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
                    hoverinfo: "x+y"
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
                    legendgroup: subgroup,
                    visible: errorIsVisible,
                    hoverinfo: "none"
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
                    hoverinfo: "x+y"
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
                    hoverinfo: "none"
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
                title: "<b>" + getTitle(type) + "</b>",
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
                    }
                },
                yaxis: {
                    title: getUnits(type),
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    },
                    fixedrange: true,
                    domain: [0.5, 1]
                },
                yaxis2: {
                    title: getUnits(type),
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    },
                    fixedrange: true,
                    domain: [0, 0.5]
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
                    hoverinfo: "none"
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
                title: "<b>" + getTitle(type) + "</b>",
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
                    }
                },
                yaxis: {
                    title: getUnits(type),
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
                if (isTwoHands(type)) {
                    chart.data[clickData.curveNumber+3].visible = true;
                }
            }
        });
        chart.on('plotly_legenddoubleclick', function() {return false;});
        $("#loading").css("display","none");
    });
}

function getUnits(dataType) {
    if (dataType === "Accelerometer") {
        return "Vector Magnitude of Motion";
    } else if (dataType === "Heart Rate") {
        return "BPM";
    } else if (dataType === "Motion") {
        return "Fraction of Hour in Motion";
    } else if (dataType === "Temperature") {
        return "°Celsius";
    } else if (dataType === "EDA Mean Difference" ||
                dataType === "EDA Mean") {
        return "Microsiemens (µS)";
    } else if (dataType === "Skin Conductance Response") {
        return "Number of SCRs";
    } else if (dataType === "Incoming Call Count" ||
                dataType === "Outgoing Call Count") {
        return "Number of Calls";
    } else if (dataType === "Incoming Call Mean Duration" ||
                dataType === "Incoming Call Median Duration" ||
                dataType === "Incoming Call Std Duration" ||
                dataType === "Incoming Call Sum Duration" ||
                dataType === "Outgoing Call Mean Duration" ||
                dataType === "Outgoing Call Median Duration" ||
                dataType === "Outgoing Call Std Duration" ||
                dataType === "Outgoing Call Sum Duration" ||
                dataType === "Screen On Mean Duration" ||
                dataType === "Screen On Median Duration" ||
                dataType === "Screen On Std Duration" ||
                dataType === "Screen On Sum Duration") {
        return "Seconds";
    } else if (dataType === "Screen On Count") {
        return "Number of Times On";
    } else if (dataType === "Incoming SMS Mean Length" ||
                dataType === "Incoming SMS Median Length" ||
                dataType === "Incoming SMS Std Length" ||
                dataType === "Incoming SMS Sum Length" ||
                dataType === "Outgoing SMS Mean Length" ||
                dataType === "Outgoing SMS Median Length" ||
                dataType === "Outgoing SMS Std Length" ||
                dataType === "Outgoing SMS Sum Length"
                ) {
        return "Characters";
    } else if (dataType === "Incoming SMS Count" ||
                dataType === "Outgoing SMS Count") {
        return "Number of Messages";
    } else if (dataType === "Latitude Std" ||
                dataType === "Latitude Stationary Std" ||
                dataType === "Longitude Std" ||
                dataType === "Longitude Stationary Std" ||
                dataType === "Average Location Std" ||
                dataType === "Average Stationary Std") {
        return "Degrees"
    } else if (dataType === "Home Stay" ||
                dataType === "Transition Time") {
        return "Percentage of Hour"
    } else if (dataType === "Total Distance") {
        return "Meters"
    }
}

function getTitle(dataType) {
    if (dataType === "Accelerometer") {
        return "Acceleration";
    } else if (dataType === "Heart Rate") {
        return "Heart Rate";
    } else if (dataType === "Motion") {
        return "Motion";
    } else if (dataType === "Temperature") {
        return "Temperature";
    } else if (dataType === "EDA Mean Difference") {
        return "EDA: Mean Difference";
    } else if (dataType === "EDA Mean") {
        return "EDA: Mean";
    } else if (dataType === "Skin Conductance Response") {
        return "Skin Conductance Responses per Hour of Day";
    } else if (dataType === "Incoming Call Count") {
        return "Number of Incoming Calls";
    } else if (dataType === "Incoming Call Mean Duration") {
        return "Mean Duration of Incoming Calls";
    } else if (dataType === "Incoming Call Median Duration") {
        return "Median Duration of Incoming Calls";
    } else if (dataType === "Incoming Call Std Duration") {
        return "Std Dev of Duration of Incoming Calls";
    } else if (dataType === "Incoming Call Sum Duration") {
        return "Sum of Duration of Incoming Calls";
    } else if (dataType === "Outgoing Call Count") {
        return "Number of Outgoing Calls";
    } else if (dataType === "Outgoing Call Mean Duration") {
        return "Mean Duration of Outgoing Calls";
    } else if (dataType === "Outgoing Call Median Duration") {
        return "Median Duration of Outgoing Calls";
    } else if (dataType === "Outgoing Call Std Duration") {
        return "Std Dev of Duration of Outgoing Calls";
    } else if (dataType === "Outgoing Call Sum Duration") {
        return "Sum of Duration of Outgoing Calls";
    } else if (dataType === "Screen On Count") {
        return "Number of Times Screen Turned On"
    } else if (dataType === "Screen On Mean Duration") {
        return "Mean Duration of Screen Time";
    } else if (dataType === "Screen On Median Duration") {
        return "Median Duration of Screen Time";
    } else if (dataType === "Screen On Std Duration") {
        return "Std Dev of Duration of Screen Time";
    } else if (dataType === "Screen On Sum Duration") {
        return "Sum of Duration of Screen Time";
    } else if (dataType === "Incoming SMS Count") {
        return "Number of Incoming SMSs";
    } else if (dataType === "Incoming SMS Mean Length") {
        return "Mean Length of Incoming SMSs";
    } else if (dataType === "Incoming SMS Median Length") {
        return "Median Length of Incoming SMSs";
    } else if (dataType === "Incoming SMS Std Length") {
        return "Std Dev of Length of Incoming SMSs";
    } else if (dataType === "Incoming SMS Sum Length") {
        return "Sum of Length of Incoming SMSs";
    } else if (dataType === "Outgoing SMS Count") {
        return "Number of Outgoing SMSs";
    } else if (dataType === "Outgoing SMS Mean Length") {
        return "Mean Length of Outgoing SMSs";
    } else if (dataType === "Outgoing SMS Median Length") {
        return "Median Length of Outgoing SMSs";
    } else if (dataType === "Outgoing SMS Std Length") {
        return "Std Dev of Length of Outgoing SMSs";
    } else if (dataType === "Outgoing SMS Sum Length") {
        return "Sum of Length of Outgoing SMSs";
    } else if (dataType === "Latitude Std") {
        return "Std Dev of Latitude";
    } else if (dataType === "Latitude Stationary Std") {
        return "Std Dev of Latitude while Stationary";
    } else if (dataType === "Longitude Std") {
        return "Std Dev of Longitude";
    } else if (dataType === "Longitude Stationary Std") {
        return "Std Dev of Longitude while Stationary";
    } else if (dataType === "Average Location Std") {
        return "Std Dev of Average Location";
    } else if (dataType === "Average Stationary Std") {
        return "Std Dev of Average Location while Stationary";
    } else if (dataType === "Home Stay") {
        return "Percentage of Time at Home";
    } else if (dataType === "Total Distance") {
        return "Total Distance Traveled";
    } else if (dataType === "Transition Time") {
        return "Time Spent in Transition";
    }
}


function isTwoHands(type) {
    return type === "Temperature" || type === "EDA Mean" || type === "Skin Conductance Response";
}


function getDataCategoryText(category) {
    if (category === "Activity") {
        return "Activity data collected from mobile phones and E4 measurements";
    } else if (category === "Phone_Usage") {
        return "Phone Usage data collected from Movisens Android application";
    } else if (category === "Physiology") {
        return "Physiology data collected from E4 measurements";
    } else {
        throw new Error("Invalid category value: " + category);
    }
}

function getDataTypeText(type) {
    if (type === "Accelerometer") {
        return "The hourly average of the magnitude of motion vectors combining 3-axis accelerometer measurements";
    } else if (type === "Heart Rate") {
        return "The hourly average heart rate, measured in beats per minute";
    } else if (type === "Motion") {
        return "The decimal percentage of the hour when the individual was in motion (estimated using actigraphy)";
    } else if (type === "Temperature") {
        return "The hourly average skin temperature measured from each hand";
    } else if (type === "EDA Mean Difference") {
        return "The hourly average of the difference between right and left hand Skin Conductance Level signals (Right - Left)";
    } else if (type === "EDA Mean") {
        return "The hourly average amplitude of Skin Conductance Response measured from each hand";
    } else if (type === "Skin Conductance Response") {
        return "The number of Skin Conductance Responses (peaks) accumulated over the course of an hour measured from each hand";
    } else if (type === "Incoming Call Count") {
        return "The number of incoming phone calls accumulated over the course of an hour";
    } else if (type === "Incoming Call Mean Duration") {
        return "The average duration of all incoming phone calls over the course of an hour";
    } else if (type === "Incoming Call Median Duration") {
        return "The median duration of all incoming phone calls over the course of an hour";
    } else if (type === "Incoming Call Std Duration") {
        return "The standard deviation of the duration of all incoming phone calls over the course of an hour";
    } else if (type === "Incoming Call Sum Duration") {
        return "The sum of the durations of all incoming phone calls over the course of an hour";
    } else if (type === "Outgoing Call Count") {
        return "The number of outgoing phone calls accumulated over the course of an hour";
    } else if (type === "Outgoing Call Mean Duration") {
        return "The average duration of all outgoing phone calls over the course of an hour";
    } else if (type === "Outgoing Call Median Duration") {
        return "The median duration of all outgoing phone calls over the course of an hour";
    } else if (type === "Outgoing Call Std Duration") {
        return "The standard deviation of the duration of all outgoing phone calls over the course of an hour";
    } else if (type === "Outgoing Call Sum Duration") {
        return "The sum of the durations of all outgoing phone calls over the course of an hour";
    } else if (type === "Screen On Count") {
        return "The number of times an individual's phone display was turned on over the course of an hour"
    } else if (type === "Screen On Mean Duration") {
        return "Average duration for which an individual's phone display was on over the course of an hour";
    } else if (type === "Screen On Median Duration") {
        return "Median duration for which an individual's phone display was on over the course of an hour";
    } else if (type === "Screen On Std Duration") {
        return "Standard deviation of duration for which an individual's phone display was on over the course of an hour";
    } else if (type === "Screen On Sum Duration") {
        return "Total amount of time an individual's phone display was on over the course of an hour";
    } else if (type === "Incoming SMS Count") {
        return "The number of incoming SMS messages accumulated over the course of an hour";
    } else if (type === "Incoming SMS Mean Length") {
        return "The average length of all incoming SMS messages over the course of an hour";
    } else if (type === "Incoming SMS Median Length") {
        return "The median length of all incoming SMS messages over the course of an hour";
    } else if (type === "Incoming SMS Std Length") {
        return "The standard deviation of the length of all incoming SMS messages over the course of an hour";
    } else if (type === "Incoming SMS Sum Length") {
        return "The sum of the lengths of all incoming SMS messages over the course of an hour";
    } else if (type === "Outgoing SMS Count") {
        return "The number of outgoing SMS messages accumulated over the course of an hour";
    } else if (type === "Outgoing SMS Mean Length") {
        return "The average length of all outgoing SMS messages over the course of an hour";
    } else if (type === "Outgoing SMS Median Length") {
        return "The median length of all outgoing SMS messages over the course of an hour";
    } else if (type === "Outgoing SMS Std Length") {
        return "The standard deviation of the length of all outgoing SMS messages over the course of an hour";
    } else if (type === "Outgoing SMS Sum Length") {
        return "The sum of the lengths of all incoming SMS messages over the course of an hour";
    } else if (type === "Latitude Std") {
        return "The standard deviation of an individual's latitude over the course of an hour";
    } else if (type === "Latitude Stationary Std") {
        return "The standard deviation of an individual's latitude while stationary over the course of an hour (stationary is defined as a moving speed of less than 0.3 m/s)";
    } else if (type === "Longitude Std") {
        return "The standard deviation of an individual's longitude over the course of an hour";
    } else if (type === "Longitude Stationary Std") {
        return "The standard deviation of an individual's longitude while stationary over the course of an hour (stationary is defined as a moving speed of less than 0.3 m/s)";
    } else if (type === "Average Location Std") {
        return "The average of the standard deviation of an individual's latitude and longitude over the course of an hour";
    } else if (type === "Average Stationary Std") {
        return "The average of the standard deviation of an individual's latitude and longitude while stationary over the course of an hour (stationary is defined as a moving speed of less than 0.3 m/s)";
    } else if (type === "Home Stay") {
        return "The percentage of time spent at home throughout an hour (home location is estimated based on median of stationary locations)";
    } else if (type === "Total Distance") {
        return "The sum total distance traveled throughout an hour";
    } else if (type === "Transition Time") {
        return "The percentage of time spent in transition throughout an hour";
    } else {
        throw new Error("Invalid type value: " + type);
    }
}

function getPreprocessText(dataType) {
    if (dataType === "Accelerometer") {
        return "To calculate the instantaneous motion vector, the 3-axis raw acceleration was first rescaled to the " +
            "range [-2g; 2g]. Then, each second (32 samples) the acceleration data is summarized using the following " +
            "method: sum+= max3(abs(buffX[i] - prevX), abs(buffY[i] - prevY), abs(buffZ[i] - prevZ)). " +
            "The output is then filtered: avg=avg*0.9+(sum/32)*0.1. Finally the mean over 1 hour is calculated."
    } else if (dataType === "Motion") {
        return "To estimate the time when a person is in motion, the value of the motion vector magnitude is compared" +
            " to a predefined threshold. To calculate the instantaneous motion vector, the 3-axis raw acceleration was" +
            " first rescaled to the range [-2g; 2g]. Then, each second (32 samples) the acceleration data is " +
            "summarized using the following method: " +
            "sum+= max3(abs(buffX[i] - prevX), abs(buffY[i] - prevY), abs(buffZ[i] - prevZ)). " +
            "The output is then filtered: avg=avg*0.9+(sum/32)*0.1. Finally, the instances when the obtained value is" +
            " greater than 0.05 (motion threshold), are counted and divided by the number of accelerometer samples in" +
            " a day to estimate the fraction time when a participant was in motion."
    } else if (dataType === "EDA Mean") {
        return "The EDA signal is first selected when the measured skin temperature > 30 degree Celsius (sensor is " +
            "worn on the wrist). Then the EDA signal when the participant is in motion (based on the accelerometer" +
            " data) is filtered out. Next, the low-pass Butterworth filter (1Hz cutoff) is applied. Finally the " +
            "average of the EDA signal is calculated over 1 hour."
    } else if (dataType === "Skin Conductance Response") {
        return "The EDA signal is first selected when the measured skin temperature > 30 degree Celsius (sensor is " +
            "worn on the wrist). Then the EDA signal when the participant is in motion (based on the accelerometer " +
            "data) is filtered out. Next, the low-pass Butterworth filter (1Hz cutoff) is applied. Finally the " +
            "average number of EDA peaks (SCRs) is calculated over 1 hour."
    } else if (dataType === "EDA Mean Difference") {
        return "The EDA signal is first selected when the measured skin temperature > 30 degree Celsius (sensor is " +
            "worn on the wrist). Then the EDA signal when the participant is in motion (based on the accelerometer " +
            "data) is filtered out. Next, the low-pass Butterworth filter (1Hz cutoff) is applied. Finally the " +
            "difference between the averages of the EDA signals from the right and left wrists (right minus left) is" +
            " calculated over 1 hour."
    } else if (dataType === "Heart Rate") {
        return "Heart rate is computed by detecting peaks (beats) from the PPG and computing the lengths of the" +
            " intervals between adjacent beats.  The inter-beat-interval (IBI) timing is used to estimate the" +
            " instantaneous heart rate. The average of the instantaneous HR is calculated over 1 hour."
    } else {
        return "There is no additional preprocessing for this data type"
    }
}

function getGroupText(group) {
    if (group === "All") {
        return "All participants in the study"
    } else if (group === "Depression") {
        return "Group and aggregate over participants by their depression status: Major Depressive Disorder or Healthy Control";
    } else if (group === "Gender") {
        return "Group and aggregate over participants by their preferred gender";
    } else if (group === "Marital") {
        return "Group and aggregate over participants by their marital status";
    } else if (group === "Employment") {
        return "Group and aggregate over participants by their employment status";
    } else if (group === "Age") {
        return "Group and aggregate over participants by their age in years";
    } else if (group === "Psychotherapy") {
        return "Group and aggregate over participants based on whether they are currently undergoing psychotherapy or not";
    } else if (group === "Episode Length") {
        return "Group and aggregate over participants based on their current episode length in months";
    } else if (group === "Episode Type") {
        return "Group and aggregate over participants based on their current episode type";
    } else if (group === "Phobia") {
        return "Group and aggregate over participants based on whether they have social phobia or not";
    } else if (group === "Anxiety") {
        return "Group and aggregate over participants based on whether they have General Anxiety Disorder or not";
    } else if (group === "Current Medication") {
        return "Group and aggregate over participants based on whether they are currently taking medication or not";
    } else if (group === "None") {
        return "Show an individual's data";
    } else {
        throw new Error("Invalid group value: " + group);
    }
}

function getAggregationText(aggregation) {
    if (aggregation === "Mean") {
        return "Calculate the arithmetic mean over the participants in each group for every hour - missing data points for any particular hour are not included in calculating the mean";
    } else if (aggregation === "Median") {
        return "Find the median measurement over the participants in each group for every hour -  missing data points for any particular hour are not included in finding the median";
    } else if (aggregation === "Max") {
        return "Find the maximum measurement over the participants in each group for every hour - missing data points for any particular hour are not included in finding the max";
    } else if (aggregation === "Min") {
        return "Find the minimum measurement over the participants in each group for every hour - missing data points for any particular hour are not included in finding the min";
    } else if (aggregation === "Std Dev") {
        return "Calculate the standard deviation over the participants in each group for every hour - missing data points for any particular hour are not included in calculating the standard deviation";
    } else {
        throw new Error("Invalid aggregation value: " + aggregation);
    }
}

function getIndividualText(individual) {
    ind_num = parseInt(individual.slice(1));
    return "Individual " + ind_num + " of the study";
}
