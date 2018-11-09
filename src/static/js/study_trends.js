$( document ).ready(function() {
    $(".data-dropdown-container").css("display", "none");
    $("#" + $("#category_dropdown").val() + "_dropdown_container").css("display", "flex");
    drawStudyTrendsGroup();
    $("#names_dropdown, .type_dropdown, #aggregation_dropdown, #group_dropdown, #category_dropdown").change(function() {
        $("#loading").css('display','flex');
        if ($("#group_dropdown").val() == "None") {
            $("#aggregation_container").css("display", "none");
            $("#names_container").css("display", "flex");
            drawStudyTrendsIndividual();
        } else {
            $("#names_container").css("display", "none");
            $("#aggregation_container").css("display", "flex");
            drawStudyTrendsGroup();
        }
    });
    $("#category_dropdown").change(function() {
        $(".data-dropdown-container").css("display", "none");
        $("#" + $("#category_dropdown").val() + "_dropdown_container").css("display", "flex");
    });
});

function drawStudyTrendsIndividual() {
    $.ajax({
        url: "/get-study-trends-data/",
        data: {
            type: $("#" + $("#category_dropdown").val() + "_dropdown").val(),
            aggregation: $("#aggregation_dropdown").val(),
            group: $("#group_dropdown").val(),
            name: $("#names_dropdown").val(),
        },
        dataType: "json"
    }).done(function(data) {
        const type = $("#" + $("#category_dropdown").val() + "_dropdown").val();
        const name = $("#names_dropdown").val();
        if (isTwoHands(type)) {
            $("#chart2").show();

            subject_data_left = data.subject_data["left"];
            subject_data_right = data.subject_data["right"];

            const dates_left = ['x'];
            const dates_right = ['x'];
            subject_data_left["dates"].forEach(function(d) {
                dates_left.push(new Date(d));
            });
            subject_data_right["dates"].forEach(function(d) {
                dates_right.push(new Date(d));
            });

            const measurements_left = [name].concat(subject_data_left["measurements"]);
            const measurements_right = [name].concat(subject_data_right["measurements"]);

            var chart_left = c3.generate({
                bindto: '.chart-container #chart1',
                data: {
                    x: 'x',
                    columns: [
                        dates_left,
                        measurements_left
                    ]
                },
                axis: {
                    x: {
                        label: {
                            text: "Date",
                            position: 'outer-center'
                        },
                        type: 'timeseries',
                        tick: {
                            count: 6,
                            format: '%Y-%m-%d'
                        }
                    },
                    y: {
                        label: {
                            text: getUnits(type),
                            position: 'outer-middle'
                        },
                        tick: {
                            count: 8,
                            format: d3.format('.3r')
                        }
                    }
                },
                title: {
                    text: getTitle(type) + " - Left Hand"
                },
                color: {
                    pattern: ['steelblue']
                },
                legend: {
                    position: 'right'
                },
                padding: {
                    bottom: 20
                },
                zoom: {
                    enabled: true
                }
            });

            var chart_right = c3.generate({
                bindto: '.chart-container #chart2',
                data: {
                    x: 'x',
                    columns: [
                        dates_right,
                        measurements_right
                    ]
                },
                axis: {
                    x: {
                        label: {
                            text: "Date",
                            position: 'outer-center'
                        },
                        type: 'timeseries',
                        tick: {
                            count: 6,
                            format: '%Y-%m-%d'
                        }
                    },
                    y: {
                        label: {
                            text: getUnits(type),
                            position: 'outer-middle'
                        },
                        tick: {
                            count: 8,
                            format: d3.format('.3r')
                        }
                    }
                },
                title: {
                    text: getTitle(type) + " - Right Hand"
                },
                color: {
                    pattern: ['orangered']
                },
                legend: {
                    position: 'right'
                },
                padding: {
                    bottom: 20
                },
                zoom: {
                    enabled: true
                }
            });
        } else {
            $("#chart2").hide();

            var subject_data = data.subject_data[null];
            const dates = ['x'];
            const measurements = [$("#names_dropdown").val()].concat(subject_data["measurements"]);
            subject_data["dates"].forEach(function(d) {
                dates.push(new Date(d));
            });

            var chart = c3.generate({
                bindto: '.chart-container #chart1',
                data: {
                    x: 'x',
                    columns: [
                        dates,
                        measurements
                    ]
                },
                axis: {
                    x: {
                        label: {
                            text: "Date",
                            position: 'outer-center'
                        },
                        type: 'timeseries',
                        tick: {
                            count: 6,
                            format: '%Y-%m-%d'
                        }
                    },
                    y: {
                        label: {
                            text: getUnits(type),
                            position: 'outer-middle'
                        },
                        tick: {
                            format: d3.format('.3r')
                        }
                    }
                },
                title: {
                    text: getTitle(type)
                },
                legend: {
                    position: 'right'
                },
                padding: {
                    bottom: 20
                },
                zoom: {
                    enabled: true
                }
            });
        }
        $("#loading").css('display', 'none');
    });
}

function drawStudyTrendsGroup() {
    $.ajax({
        url: "/get-study-trends-data/",
        data: {
            type: $("#" + $("#category_dropdown").val() + "_dropdown").val(),
            aggregation: $("#aggregation_dropdown").val(),
            group: $("#group_dropdown").val(),
            name: $("#names_dropdown").val(),
        },
        dataType: "json"
    }).done(function(data) {
        const type = $("#" + $("#category_dropdown").val() + "_dropdown").val();
        const group_sizes = data.group_sizes;

        if (isTwoHands(type)) {
            $("#chart2").show();

            const group_data_left = data.aggregate_data["left"];
            const group_data_right = data.aggregate_data["right"];

            const columns_left = [];
            const columns_right = [];
            for (var subgroup in group_data_left) {
                const subgroup_data_left = group_data_left[subgroup];
                const subgroup_data_right = group_data_right[subgroup];
                columns_left.push([subgroup + " (n = " + group_sizes[subgroup] + ")"].concat(subgroup_data_left));
                columns_right.push([subgroup + " (n = " + group_sizes[subgroup] + ")"].concat(subgroup_data_right));
            }

            var chart_left = c3.generate({
                bindto: '.chart-container #chart1',
                data: {
                    columns: columns_left
                },
                axis: {
                    x: {
                        label: {
                            text: "Day in Study",
                            position: "outer-center"
                        }
                    },
                    y: {
                        label: {
                            text: getUnits(type),
                            position: 'outer-middle'
                        },
                        tick: {
                            count: 8,
                            format: d3.format('.3r')
                        }
                    }
                },
                title: {
                    text: getTitle(type) + " - Left Hand"
                },
                legend: {
                    position: 'right'
                },
                padding: {
                    bottom: 20
                },
                zoom: {
                    enabled: true
                }
            });

            var chart_right = c3.generate({
                bindto: '.chart-container #chart2',
                data: {
                    columns: columns_right
                },
                axis: {
                    x: {
                        label: {
                            text: "Day in Study",
                            position: 'outer-center'
                        }
                    },
                    y: {
                        label: {
                            text: getUnits(type),
                            position: 'outer-middle'
                        },
                        tick: {
                            count: 8,
                            format: d3.format('.3r')
                        }
                    }
                },
                title: {
                    text: getTitle(type) + " - Right Hand"
                },
                legend: {
                    position: 'right'
                },
                padding: {
                    bottom: 20
                },
                zoom: {
                    enabled: true
                }
            });
        } else {
            $("#chart2").hide();
            const group_data = data.aggregate_data;

            const columns = [];
            for (var subgroup in group_data) {
                const subgroup_data = group_data[subgroup];
                columns.push([subgroup + " (n = " + group_sizes[subgroup] + ")"].concat(subgroup_data));
            }

            var chart = c3.generate({
                bindto: '.chart-container #chart1',
                data: {
                    columns: columns
                },
                axis: {
                    x: {
                        label: {
                            text: "Day in Study",
                            position: 'outer-center'
                        }
                    },
                    y: {
                        label: {
                            text: getUnits(type),
                            position: 'outer-middle'
                        },
                        tick: {
                            format: d3.format('.3r')
                        }
                    }
                },
                title: {
                    text: getTitle(type)
                },
                legend: {
                    position: 'right'
                },
                padding: {
                    bottom: 20
                },
                zoom: {
                    enabled: true
                }
            });
        }
        $("#loading").css('display', 'none');
    });
}

function getUnits(dataType) {
    if (dataType == "Accelerometer") {
        return "Vector Magnitude of Motion";
    } else if (dataType == "Heart Rate") {
        return "BPM";
    } else if (dataType == "Motion") {
        return "Fraction of Time in Motion";
    } else if (dataType == "Temperature") {
        return "°Celsius";
    } else if (dataType == "EDA Mean Difference") {
        return "Microsiemens (µS)";
    } else if (dataType == "EDA Mean") {
        return "Microsiemens (µS)";
    } else if (dataType == "Skin Conductance Response") {
        return "# of SCRs";
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

function getTitle(dataType) {
    if (dataType == "Accelerometer") {
        return "Acceleration";
    } else if (dataType == "Heart Rate") {
        return "Heart Rate";
    } else if (dataType == "Motion") {
        return "Motion";
    } else if (dataType == "Temperature") {
        return "Temperature";
    } else if (dataType == "EDA Mean Difference") {
        return "EDA: Mean Difference";
    } else if (dataType == "EDA Mean") {
        return "EDA: Mean";
    } else if (dataType == "Skin Conductance Response") {
        return "Skin Conductance Responses per Day in Study";
    } else if (dataType == "Incoming Call Count") {
        return "Number of Incoming Calls"
    } else if (dataType == "Outgoing Call Count") {
        return "Number of Outgoing Calls"
    } else if (dataType == "Incoming Call Mean Duration") {
        return "Mean Duration of Incoming Calls"
    } else if (dataType == "Outgoing Call Mean Duration") {
        return "Mean Duration of Outgoing Calls"
    } else if (dataType == "Incoming Call Median Duration") {
        return "Median Duration of Incoming Calls"
    } else if (dataType == "Outgoing Call Median Duration") {
        return "Median Duration of Outgoing Calls"
    } else if (dataType == "Incoming Call Std Duration") {
        return "Std Dev of Duration of Incoming Calls"
    } else if (dataType == "Outgoing Call Std Duration") {
        return "Std Dev of Duration of Outgoing Calls"
    }
}

function isTwoHands(type) {
    return type == "Temperature" || type == "EDA Mean" || type == "Skin Conductance Response";
}
