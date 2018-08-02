$( document ).ready(function() {
    $(".chart-container").css('flex-direction', 'row');
    $(".chart-container").css('justify-content', 'center');
    $(".chart-container").css('align-items', 'stretch');
    drawScatterPlot();
    $("#x_axis_dropdown, #y_axis_dropdown, #group_dropdown").change(function() {
        $("#loading").css('display', 'flex');
        drawScatterPlot();
    })
});

function drawScatterPlot() {
    $.ajax({
        url: "/viz_app/get-scatter-plot-data/",
        data: {
            x_axis: $("#x_axis_dropdown").val(),
            y_axis: $("#y_axis_dropdown").val(),
            group: $("#group_dropdown").val()
        },
        dataType: "json"
    }).done(function(data) {
        const x_type = $('#x_axis_dropdown').val();
        const y_type = $('#y_axis_dropdown').val();
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
    }
}

function getTitle(x_type, y_type) {
    return x_type + " vs " + y_type;
}
