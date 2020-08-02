var x_category_dropdown = $("#x_axis_category");
var y_category_dropdown = $("#y_axis_category");
var group_dropdown = $("#group_dropdown");
var last_request;
const description = $("span#description-text");
var user_type;

$( document ).ready(function() {

    var x_category = x_category_dropdown.val();
    var y_category = y_category_dropdown.val();
    var x_dataType = $("#x_axis_" + x_category_dropdown.val() + "_dropdown").val();
    var y_dataType = $("#y_axis_" + y_category_dropdown.val() + "_dropdown").val();
    var group = group_dropdown.val();
    $.ajax({
        url: "/get-user-type/",
        dataType: "json"
    }).done(function(data) {
        user_type = data.user;
        drawScatterPlot();
    });
    $("#PHQ9-colors").css('display', 'none');
    $("#HDRS-colors").css('display', 'none');
    $("#depression-legend-PHQ9").css('display', 'none');
    $("#depression-legend-HDRS").css('display', 'none');
    $(".surrounding-chart-container").css('width', '100%');
    $("#x_axis_category, #y_axis_category, .x_axis_dropdown, .y_axis_dropdown, #group_dropdown").change(function() {
        $("#loading").css('display', 'flex');
        resetDescriptionText(description);
        drawScatterPlot();
    });
    x_category_dropdown.change(function() {
        $(".data-dropdown-container.x_axis").css("display", "none");
        $("#x_axis_" + x_category_dropdown.val() + "_container").css("display", "flex");
        x_category = x_category_dropdown.val();
        x_dataType = $("#x_axis_" + x_category_dropdown.val() + "_dropdown").val();
    });
    y_category_dropdown.change(function() {
        $(".data-dropdown-container.y_axis").css("display", "none");
        $("#y_axis_" + y_category_dropdown.val() + "_container").css("display", "flex");
        y_category = y_category_dropdown.val();
        y_dataType = $("#y_axis_" + y_category_dropdown.val() + "_dropdown").val();
    });
    $(".x_axis_dropdown").change(function() {
        x_dataType = $("#x_axis_" + x_category_dropdown.val() + "_dropdown").val();
    });
    $(".y_axis_dropdown").change(function() {
        y_dataType = $("#y_axis_" + y_category_dropdown.val() + "_dropdown").val();
    });
    group_dropdown.change(function() {
        group = group_dropdown.val();
    });

    $(".x-category-description").click(
        function () {
            description.text(dataCategoryText[x_category]);
            description.css("font-style", "normal");
            description.css("color", "black");
        }
    );
    $(".y-category-description").click(
        function () {
            description.text(dataCategoryText[y_category]);
            description.css("font-style", "normal");
            description.css("color", "black");
        }
    );
    $(".x-type-description").click(
        function () {
            description.text(dataTypeTextDaily[x_dataType]);
            description.css("font-style", "normal");
            description.css("color", "black");
        }
    );
    $(".y-type-description").click(
        function () {
            description.text(dataTypeTextDaily[y_dataType]);
            description.css("font-style", "normal");
            description.css("color", "black");
        }
    );
    $(".x-type-preprocessing").click(
        function () {
            description.text(preprocessTextDaily[x_dataType] || preprocessTextDefault);
            description.css("font-style", "normal");
            description.css("color", "black");
        }
    );
    $(".y-type-preprocessing").click(
        function () {
            description.text(preprocessTextDaily[y_dataType] || preprocessTextDefault);
            description.css("font-style", "normal");
            description.css("color", "black");
        }
    );
    $(".group-description").click(
        function () {
            description.text(groupText[group]);
            description.css("font-style", "normal");
            description.css("color", "black");
        }
    );
});


function drawScatterPlot() {
    if (user_type === "participant") {
        drawScatterPlotIndividual();
    } else {
        drawScatterPlotGroup();
    }
}


function drawScatterPlotIndividual() {
    if (last_request && last_request.readyState !== 4) {
        last_request.abort();
    }
    last_request = $.ajax({
        url: "/get-scatter-plot-data/",
        data: {
            x_axis: $("#x_axis_" + x_category_dropdown.val() + "_dropdown").val(),
            y_axis: $("#y_axis_" + y_category_dropdown.val() + "_dropdown").val(),
            group: group_dropdown.val()
        },
        dataType: "json"
    }).done(function(data) {
        const x_type = $("#x_axis_" + x_category_dropdown.val() + "_dropdown").val();
        const y_type = $("#y_axis_" + y_category_dropdown.val() + "_dropdown").val();
        const individual_data = data.scatter_data;
        const name = data.name;
        if (isTwoHands.has(x_type) || isTwoHands.has(y_type)) {
            const trace_left = {
                x: individual_data['x']['left'],
                y: individual_data['y']['left'],
                xaxis: 'x',
                mode: 'markers',
                name: name + " - Left Hand",
                marker: {
                    size: 4
                }
            };

            const trace_right = {
                x: individual_data['x']['right'],
                y: individual_data['y']['right'],
                xaxis: 'x2',
                mode: 'markers',
                name: name + " - Right Hand",
                marker: {
                    size: 4
                }
            };

            const layout = {
                title: "<b>" + getScatterTitle(x_type, y_type) + "</b>",
                font: {
                    family: "Helvetica Neue, Helvetica, Arial, sans-serif",
                    size: 16
                },
                titlefont: {
                    size: 28
                },
                xaxis: {
                    title: unitsDaily[x_type] + '<br>(Left)',
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    },
                    domain: [0, 0.47]
                },
                xaxis2: {
                    title: unitsDaily[x_type] + '<br>(Right)',
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    },
                    domain: [0.53, 1]
                },
                yaxis: {
                    title: unitsDaily[y_type],
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    }
                },
                showlegend: false,
                legend: {
                    x: 1,
                    y: 0.5
                },
                dragmode: "pan",
                hovermode: "closest",
                grid: {
                    subplots: [['xy', 'x2y']]
                },
                shapes: [{
                    type: 'line',
                    xref: 'paper',
                    yref: 'paper',
                    x0: 0.5,
                    x1: 0.5,
                    y0: 0,
                    y1: 1,
                    line: {
                        width: 1
                    },
                plot_bgcolor: "rgba(0,0,0,0)",
                paper_bgcolor: 'rgba(0,0,0,0)',
                }]
            };
            Plotly.newPlot("chart1", [trace_left, trace_right], layout, {displayModeBar: false, responsive: true, scrollZoom: true})
        } else {
            const trace = {
                x: individual_data['x'],
                y: individual_data['y'],
                mode: 'markers',
                name: name,
                marker: {
                    size: 4
                }
            };

            const layout = {
                title: "<b>" + getScatterTitle(x_type, y_type) + "</b>",
                font: {
                    family: "Helvetica Neue, Helvetica, Arial, sans-serif",
                    size: 16
                },
                titlefont: {
                    size: 28
                },
                xaxis: {
                    title: unitsDaily[x_type],
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    }
                },
                yaxis: {
                    title: unitsDaily[y_type],
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    }
                },
                showlegend: false,
                legend: {
                    x: 1,
                    y: 0.5
                },
                dragmode: "pan",
                hovermode: "closest",
                plot_bgcolor: "rgba(0,0,0,0)",
                paper_bgcolor: 'rgba(0,0,0,0)',
            };

            Plotly.newPlot("chart1", [trace], layout, {displayModeBar: false, responsive: true, scrollZoom: true})
        }
        $('#loading').css('display', 'none')
    });
}


function drawScatterPlotGroup() {
    if (last_request && last_request.readyState !== 4) {
        last_request.abort();
    }
    last_request = $.ajax({
        url: "/get-scatter-plot-data/",
        data: {
            x_axis: $("#x_axis_" + x_category_dropdown.val() + "_dropdown").val(),
            y_axis: $("#y_axis_" + y_category_dropdown.val() + "_dropdown").val(),
            group: group_dropdown.val()
        },
        dataType: "json"
    }).done(function(data) {
        const x_type = $("#x_axis_" + x_category_dropdown.val() + "_dropdown").val();
        const y_type = $("#y_axis_" + y_category_dropdown.val() + "_dropdown").val();
        const group_data = data.scatter_data;
        const group_sizes = data.group_sizes;
        if (isTwoHands.has(x_type) || isTwoHands.has(y_type)) {
            const traces_left = [];
            const traces_right = [];
            var color_index = 0;
            for (const subgroup in group_data) {
                const group_size = group_sizes[subgroup];
                const subgroup_data = group_data[subgroup];
                const x_data_left  = subgroup_data['x']['left'];
                const x_data_right = subgroup_data['x']['right'];
                const y_data_left  = subgroup_data['y']['left'];
                const y_data_right = subgroup_data['y']['right'];
                traces_left.push({
                    x: x_data_left,
                    y: y_data_left,
                    xaxis: 'x',
                    mode: 'markers',
                    name: subgroup + " (" + group_size + ") - Left Hand",
                    marker: {
                        color: chart_colors[color_index],
                        size: 4
                    }
                });
                traces_right.push({
                    x: x_data_right,
                    y: y_data_right,
                    xaxis: 'x2',
                    mode: 'markers',
                    name: subgroup + " (" + group_size + ") - Right Hand",
                    marker: {
                        color: chart_colors[color_index],
                        size: 4
                    }
                });
                color_index = (color_index + 1)%10;
            }
            const traces = traces_left.concat(traces_right);

            const layout = {
                title: "<b>" + getScatterTitle(x_type, y_type) + "</b>",
                font: {
                    family: "Helvetica Neue, Helvetica, Arial, sans-serif",
                    size: 16
                },
                titlefont: {
                    size: 28
                },
                xaxis: {
                    title: unitsDaily[x_type] + '<br>(Left)',
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    },
                    domain: [0, 0.47]
                },
                xaxis2: {
                    title: unitsDaily[x_type] + '<br>(Right)',
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    },
                    domain: [0.53, 1]
                },
                yaxis: {
                    title: unitsDaily[y_type],
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    }
                },
                showlegend: true,
                legend: {
                    x: 1,
                    y: 0.5
                },
                dragmode: "pan",
                hovermode: "closest",
                grid: {
                    subplots: [['xy', 'x2y']]
                },
                shapes: [{
                    type: 'line',
                    xref: 'paper',
                    yref: 'paper',
                    x0: 0.5,
                    x1: 0.5,
                    y0: 0,
                    y1: 1,
                    line: {
                        width: 1
                    },
                  plot_bgcolor: "rgba(0,0,0,0)",
                  paper_bgcolor: 'rgba(0,0,0,0)',
                }]
            };

            Plotly.newPlot("chart1", traces, layout, {displayModeBar: false, responsive: true, scrollZoom: true});
        } else {
            const traces = [];
            var color_index = 0;
            for (const subgroup in group_data) {
                const group_size = group_sizes[subgroup];
                traces.push({
                    x: group_data[subgroup]['x'],
                    y: group_data[subgroup]['y'],
                    mode: 'markers',
                    name: subgroup + " (" + group_size + ")",
                    marker: {
                        color: chart_colors[color_index],
                        size: 4
                    }
                });
                color_index = (color_index + 1)%10
            }

            const layout = {
                title: "<b>" + getScatterTitle(x_type, y_type) + "</b>",
                font: {
                    family: "Helvetica Neue, Helvetica, Arial, sans-serif",
                    size: 16
                },
                titlefont: {
                    size: 28
                },
                xaxis: {
                    title: unitsDaily[x_type],
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    }
                },
                yaxis: {
                    title: unitsDaily[y_type],
                    showline: true,
                    zeroline: false,
                    titlefont: {
                        size: 20
                    }
                },
                showlegend: true,
                legend: {
                    x: 1,
                    y: 0.5
                },
                dragmode: "pan",
                hovermode: "closest",
                plot_bgcolor: "rgba(0,0,0,0)",
                paper_bgcolor: 'rgba(0,0,0,0)',
            };

            Plotly.newPlot("chart1", traces, layout, {displayModeBar: false, responsive: true, scrollZoom: true});
        }
        $('#loading').css('display', 'none');
    });
}
