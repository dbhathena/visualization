var category_dropdown = $("#category_dropdown");
var group_dropdown = $("#group_dropdown");
var aggregation_dropdown = $("#aggregation_dropdown");
var names_dropdown = $("#names_dropdown");

$( document ).ready(function() {
    $("span.category-description").text(getDataCategoryText(category_dropdown.val()));
    $("span.type-description").text(getDataTypeText($("#" + category_dropdown.val() + "_dropdown").val()));
    $("span.group-description").text(getGroupText(group_dropdown.val()));
    $("span.aggregation-description").text(getAggregationText(aggregation_dropdown.val()));
    $("span.individual-description").text(getIndividualText(names_dropdown.val()));

    drawDailyTrendsGroup();
    $("#names_dropdown, .type_dropdown, #aggregation_dropdown, #group_dropdown, #category_dropdown").change(function() {
        $("#loading").css("display","flex");
        if (group_dropdown.val() === "None") {
            $("#aggregation_container").css("display", "none");
            $("#names_container").css("display", "flex");
            $("p.aggregation-description").css("display", "none");
            $("p.individual-description").css("display", "block");
            drawDailyTrendsIndividual();
        } else {
            $("#names_container").css("display", "none");
            $("#aggregation_container").css("display", "flex");
            $("p.individual-description").css("display", "none");
            $("p.aggregation-description").css("display", "block");
            drawDailyTrendsGroup();
        }
    });
    category_dropdown.change(function() {
        $(".data-dropdown-container").css("display", "none");
        $("#" + category_dropdown.val() + "_dropdown_container").css("display", "flex");
        const category = category_dropdown.val();
        $("span.category-description").text(getDataCategoryText(category));
        const dataType = $("#" + category_dropdown.val() + "_dropdown").val();
        $("span.type-description").text(getDataTypeText(dataType));
    });
    $(".type_dropdown").change(function () {
        const dataType = $("#" + category_dropdown.val() + "_dropdown").val();
        $("span.type-description").text(getDataTypeText(dataType));
    });
    group_dropdown.change(function() {
        const group = group_dropdown.val();
        $("span.group-description").text(getGroupText(group));
    });
    aggregation_dropdown.change(function () {
        const aggregation = aggregation_dropdown.val();
        $("span.aggregation-description").text(getAggregationText(aggregation));
    });
    names_dropdown.change(function () {
        const name = names_dropdown.val();
        $("span.individual-description").text(getIndividualText(name));
    });
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
            $("#chart2").show();

            const subject_data_left = [name].concat(data.subject_data["left"]);
            const subject_data_right = [name].concat(data.subject_data["right"]);

            var chart_left = c3.generate({
                bindto: ".chart-container #chart1",
                data: {
                    columns: [
                        subject_data_left
                    ]
                },
                axis: {
                    x: {
                        label: {
                            text: "Hour of Day",
                            position: "outer-center"
                        }
                    },
                    y: {
                        label: {
                            text: getUnits(type),
                            position: "outer-middle"
                        },
                        tick: {
                            format: d3.format(".3r")
                        }
                    }
                },
                title: {
                    text: getTitle(type) + " - Left Hand"
                },
                color: {
                    pattern: ["steelblue"]
                },
                legend: {
                    position: "right"
                },
                padding: {
                    bottom: 20
                },
                zoom: {
                    enabled: true
                }
            });

            var chart_right = c3.generate({
                bindto: ".chart-container #chart2",
                data: {
                    columns: [
                        subject_data_right
                    ]
                },
                axis: {
                    x: {
                        label: {
                            text: "Hour of Day",
                            position: "outer-center"
                        }
                    },
                    y: {
                        label: {
                            text: getUnits(type),
                            position: "outer-middle"
                        },
                        tick: {
                            format: d3.format(".3r")
                        }
                    }
                },
                title: {
                    text: getTitle(type) + " - Right Hand"
                },
                color: {
                    pattern: ["orangered"]
                },
                legend: {
                    position: "right"
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

            const subject_data = [name].concat(data.subject_data["both"]);

            var chart = c3.generate({
                bindto: ".chart-container #chart1",
                data: {
                    columns: [
                        subject_data
                    ]
                },
                axis: {
                    x: {
                        label: {
                            text: "Hour of Day",
                            position: "outer-center"
                        }
                    },
                    y: {
                        label: {
                            text: getUnits(type),
                            position: "outer-middle"
                        },
                        tick: {
                            format: d3.format(".3r")
                        }
                    }
                },
                title: {
                    text: getTitle(type)
                },
                legend: {
                    position: "right"
                },
                padding: {
                    bottom: 20
                },
                zoom: {
                    enabled: true
                }
            });
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

        if (isTwoHands(type)) {
            $("#chart2").show();

            const group_data_left = data.aggregate_data["left"];
            const group_data_right = data.aggregate_data["right"];

            const columns_left = [];
            const columns_right = [];
            for (const subgroup in group_data_left) {
                const subgroup_data_left = group_data_left[subgroup];
                const subgroup_data_right = group_data_right[subgroup];
                columns_left.push([subgroup + " (n = " + group_sizes[subgroup] + ")"].concat(subgroup_data_left));
                columns_right.push([subgroup + " (n = " + group_sizes[subgroup] + ")"].concat(subgroup_data_right))
            }

            var chart_left = c3.generate({
                bindto: ".chart-container #chart1",
                data: {
                    columns: columns_left
                },
                axis: {
                    x: {
                        label: {
                            text: "Hour of Day",
                            position: "outer-center"
                        }
                    },
                    y: {
                        label: {
                            text: getUnits(type),
                            position: "outer-middle"
                        },
                        tick: {
                            count: 8,
                            format: d3.format(".3r")
                        }
                    }
                },
                title: {
                    text: getTitle(type) + " - Left Hand"
                },
                legend: {
                    position: "right"
                },
                padding: {
                    bottom: 20
                },
                zoom: {
                    enabled: true
                }
            });

            var chart_right = c3.generate({
                bindto: ".chart-container #chart2",
                data: {
                    columns: columns_right
                },
                axis: {
                    x: {
                        label: {
                            text: "Hour of Day",
                            position: "outer-center"
                        }
                    },
                    y: {
                        label: {
                            text: getUnits(type),
                            position: "outer-middle"
                        },
                        tick: {
                            count: 8,
                            format: d3.format(".3r")
                        }
                    }
                },
                title: {
                    text: getTitle(type) + " - Right Hand"
                },
                legend: {
                    position: "right"
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
            for (const subgroup in group_data) {
                const subgroup_data = group_data[subgroup];
                columns.push([subgroup + " (n = " + group_sizes[subgroup] + ")"].concat(subgroup_data));
            }

            var chart = c3.generate({
                bindto: ".chart-container #chart1",
                data: {
                    columns: columns
                },
                axis: {
                    x: {
                        label: {
                            text: "Hour of Day",
                            position: "outer-center"
                        }
                    },
                    y: {
                        label: {
                            text: getUnits(type),
                            position: "outer-middle"
                        },
                        tick: {
                            format: d3.format(".3r")
                        }
                    }
                },
                title: {
                    text: getTitle(type)
                },
                legend: {
                    position: "right"
                },
                padding: {
                    bottom: 20
                },
                zoom: {
                    enabled: true
                }
            });
        }
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
