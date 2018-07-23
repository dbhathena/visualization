$( document ).ready(function() {
    drawStudyTrendsGroup();
    $("#names_dropdown, #type_dropdown, #aggregation_dropdown, #group_dropdown").change(function() {
        if ($("#aggregation_dropdown").val() == "None") {
            $("#group_dropdown").hide();
            $("#names_dropdown").show();
            drawStudyTrendsIndividual();
        } else {
            $("#names_dropdown").hide();
            $("#group_dropdown").show();
            drawStudyTrendsGroup();
        }
    });
});

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
        const type = $('#type_dropdown').val();

        const subject_data = data.subject_data;

        const dates = ['x'];
        const measurements = [$("#names_dropdown").val()]
        subject_data["dates"].forEach(function(d) {
            dates.push(new Date(d));
        });
        subject_data["measurements"].forEach(function(d) {
            measurements.push(+d);
        });

        var chart = c3.generate({
            bindto: '.chart-container',
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
                        position: 'outer-middle'
                    },
                    type: 'timeseries',
                    tick: {
                        format: '%Y-%m-%d'
                    }
                },
                y: {
                    label: {
                        text: getUnits(type),
                        position: 'outer-middle'
                    }
                }
            }
        });
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
        const type = $("#type_dropdown").val();

        const group_data = data.aggregate_data;

        const columns = [];
        for (var subgroup in group_data) {
            const subgroup_data = group_data[subgroup];
            const filtered_data = [subgroup];
            subgroup_data.forEach(function(d) {
                filtered_data.push(+d);
            });
            columns.push(filtered_data);
        }

        var chart = c3.generate({
            bindto: '.chart-container',
            data: {
                columns: columns
            },
            axis: {
                x: {
                    label: {
                        text: "Day in Study",
                        position: 'outer-middle'
                    }
                },
                y: {
                    label: {
                        text: getUnits(type),
                        position: 'outer-top'
                    }
                }
            },
            title: {
                text: getTitle(type)
            }
        });
    });
}

function getUnits(dataType) {
    if (dataType == "Accelerometer") {
        return "";
    } else if (dataType == "Heart Rate") {
        return "BPM";
    } else if (dataType == "Motion") {
        return "";
    } else if (dataType == "Temperature") {
        return "°Celsius";
    }
}

function getTitle(dataType) {
    if (dataType == "Accelerometer") {
        return "Vector Magnitude of Motion";
    } else if (dataType == "Heart Rate") {
        return "Heart Rate";
    } else if (dataType == "Motion") {
        return "Fraction of Time in Motion";
    } else if (dataType == "Temperature") {
        return "Temperature";
    }
}
