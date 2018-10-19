$( document ).ready(function() {
    $(".chart-container").css('flex-direction', 'row');
    $(".chart-container").css('justify-content', 'center');
    $(".chart-container").css('align-items', 'stretch');
    drawScatterPlot();
    $("#x_axis_category, #y_axis_category, .x_axis_dropdown, .y_axis_dropdown, #group_dropdown").change(function() {
        $("#loading").css('display', 'flex');
        drawScatterPlot();
    });
    $("#x_axis_category").change(function() {
        $(".data-dropdown-container.x_axis").css("display", "none");
        $("#x_axis_" + $("#x_axis_category").val() + "_container").css("display", "flex");
    });
    $("#y_axis_category").change(function() {
        $(".data-dropdown-container.y_axis").css("display", "none");
        $("#y_axis_" + $("#y_axis_category").val() + "_container").css("display", "flex");
    });
});

function drawScatterPlot() {
    $.ajax({
        url: "/get-scatter-plot-data/",
        data: {
            x_axis: $("#x_axis_" + $("#x_axis_category").val() + "_dropdown").val(),
            y_axis: $("#y_axis_" + $("#y_axis_category").val() + "_dropdown").val(),
            group: $("#group_dropdown").val()
        },
        dataType: "json"
    }).done(function(data) {
        const x_type = $("#x_axis_" + $("#x_axis_category").val() + "_dropdown").val();
        const y_type = $("#y_axis_" + $("#y_axis_category").val() + "_dropdown").val();
        const group_data = data.scatter_data;
        if (x_type == "Temperature" || y_type == "Temperature") {
            $("#chart2").show();

            const columns_left = [];
            const columns_right = [];
            const xs = {};
            for (var subgroup in group_data) {
                const subgroup_data = group_data[subgroup];
                const x_data_left  = subgroup_data['x']['left'];
                const x_data_right = subgroup_data['x']['right'];
                const y_data_left  = subgroup_data['y']['left'];
                const y_data_right = subgroup_data['y']['right'];
                columns_left.push([subgroup + '_x'].concat(x_data_left));
                columns_left.push([subgroup].concat(y_data_left));
                columns_right.push([subgroup + '_x'].concat(x_data_right));
                columns_right.push([subgroup].concat(y_data_right));
                xs[subgroup] = subgroup + '_x';
            }

            var chart_left = c3.generate({
                bindto: '.chart-container #chart1',
                data: {
                    xs: xs,
                    columns: columns_left,
                    type: 'scatter'
                },
                axis: {
                    x: {
                        label: {
                            text: getUnits(x_type),
                            position: 'outer-center'
                        },
                        tick: {
                            fit: false,
                            format: d3.format('.3r')
                        }
                    },
                    y: {
                        label: {
                            text: getUnits(y_type),
                            position: 'outer-middle'
                        },
                        tick: {
                            format: d3.format('.3r')
                        }
                    }
                },
                title: {
                    text: getTitle(x_type, y_type) + " - Left Hand"
                },
                legend: {
                    position: 'right'
                },
                padding: {
                    bottom: 20,
                    top: 20
                },
                zoom: {
                    enabled: true
                }
            });

            var chart_right = c3.generate({
                bindto: '.chart-container #chart2',
                data: {
                    xs: xs,
                    columns: columns_right,
                    type: 'scatter'
                },
                axis: {
                    x: {
                        label: {
                            text: getUnits(x_type),
                            position: 'outer-center'
                        },
                        tick: {
                            fit: false,
                            format: d3.format('.3r')
                        }
                    },
                    y: {
                        label: {
                            text: getUnits(y_type),
                            position: 'outer-middle'
                        },
                        tick: {
                            format: d3.format('.3r')
                        }
                    }
                },
                title: {
                    text: getTitle(x_type, y_type) + " - Right Hand"
                },
                legend: {
                    position: 'right'
                },
                padding: {
                    bottom: 20,
                    top: 20
                },
                zoom: {
                    enabled: true
                }
            });
        } else {
            $("#chart2").hide();
            const columns = [];
            const xs = {};
            for (var subgroup in group_data) {
                const subgroup_data = group_data[subgroup];
                const x_data = subgroup_data['x'];
                const y_data = subgroup_data['y'];
                columns.push([subgroup + '_x'].concat(x_data));
                columns.push([subgroup].concat(y_data));
                xs[subgroup] = subgroup + '_x';
            }

            var chart = c3.generate({
                bindto: '.chart-container #chart1',
                data: {
                    xs: xs,
                    columns: columns,
                    type: 'scatter'
                },
                axis: {
                    x: {
                        label: {
                            text: getUnits(x_type),
                            position: 'outer-center'
                        },
                        tick: {
                            fit: false,
                            format: d3.format('.3r')
                        }
                    },
                    y: {
                        label: {
                            text: getUnits(y_type),
                            position: 'outer-middle'
                        },
                        tick: {
                            format: d3.format('.3r')
                        }
                    }
                },
                title: {
                    text: getTitle(x_type, y_type)
                },
                legend: {
                    position: 'right'
                },
                padding: {
                    bottom: 20,
                    top: 20
                },
                zoom: {
                    enabled: true
                }
            });
        }
        $('#loading').css('display', 'none');
    });
}

function getUnits(dataType) {
    if (dataType == "Accelerometer") {
        return "Vector Magnitude of Motion";
    } else if (dataType == "Heart Rate") {
        return "Heart Rate (BPM)";
    } else if (dataType == "Motion") {
        return "Fraction of Time in Motion";
    } else if (dataType == "Temperature") {
        return "Temperature (°C)";
    } else if (dataType == "Incoming Call Count") {
        return "Number of Calls"
    } else if (dataType == "Outgoing Call Count") {
        return "Number of Calls"
    } else if (dataType == "Incoming Call Mean Duration") {
        return "Seconds"
    } else if (dataType == "Outgoing Call Mean Duration") {
        return "Seconds"
    } else if (dataType == "Incoming Call Median Duration") {
        return "Seconds"
    } else if (dataType == "Outgoing Call Median Duration") {
        return "Seconds"
    } else if (dataType == "Incoming Call Std Duration") {
        return "Seconds"
    } else if (dataType == "Outgoing Call Std Duration") {
        return "Seconds"
    }
}

function getTitle(x_type, y_type) {
    return x_type + " vs " + y_type;
}
