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

    drawStudyTrendsGroup();
    $("#names_dropdown, .type_dropdown, #aggregation_dropdown, #group_dropdown, #category_dropdown").change(function() {
        $("#loading").css("display","flex");
        if (group_dropdown.val() === "None") {
            $("#aggregation_container").css("display", "none");
            $("#names_container").css("display", "flex");
            $("p.aggregation-description").css("display", "none");
            $("p.individual-description").css("display", "block");
            drawStudyTrendsIndividual();
        } else {
            $("#names_container").css("display", "none");
            $("#aggregation_container").css("display", "flex");
            $("p.individual-description").css("display", "none");
            $("p.aggregation-description").css("display", "block");
            drawStudyTrendsGroup();
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
    group_dropdown.change(function () {
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
        if (isTwoHands(type)) {
            $("#chart2").show();

            subject_data_left = data.subject_data["left"];
            subject_data_right = data.subject_data["right"];

            const dates_left = ["x"];
            const dates_right = ["x"];
            subject_data_left["dates"].forEach(function(d) {
                dates_left.push(new Date(d));
            });
            subject_data_right["dates"].forEach(function(d) {
                dates_right.push(new Date(d));
            });

            const measurements_left = [name].concat(subject_data_left["measurements"]);
            const measurements_right = [name].concat(subject_data_right["measurements"]);

            var chart_left = c3.generate({
                bindto: ".chart-container #chart1",
                data: {
                    x: "x",
                    columns: [
                        dates_left,
                        measurements_left
                    ]
                },
                axis: {
                    x: {
                        label: {
                            text: "Date",
                            position: "outer-center"
                        },
                        type: "timeseries",
                        tick: {
                            count: 6,
                            format: "%Y-%m-%d"
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
                    x: "x",
                    columns: [
                        dates_right,
                        measurements_right
                    ]
                },
                axis: {
                    x: {
                        label: {
                            text: "Date",
                            position: "outer-center"
                        },
                        type: "timeseries",
                        tick: {
                            count: 6,
                            format: "%Y-%m-%d"
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

            var subject_data = data.subject_data[null];
            const dates = ["x"];
            const measurements = [name].concat(subject_data["measurements"]);
            subject_data["dates"].forEach(function(d) {
                dates.push(new Date(d));
            });

            var chart = c3.generate({
                bindto: ".chart-container #chart1",
                data: {
                    x: "x",
                    columns: [
                        dates,
                        measurements
                    ]
                },
                axis: {
                    x: {
                        label: {
                            text: "Date",
                            position: "outer-center"
                        },
                        type: "timeseries",
                        tick: {
                            count: 6,
                            format: "%Y-%m-%d"
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
                columns_right.push([subgroup + " (n = " + group_sizes[subgroup] + ")"].concat(subgroup_data_right));
            }

            var chart_left = c3.generate({
                bindto: ".chart-container #chart1",
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
                            text: "Day in Study",
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
                            text: "Day in Study",
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
        $("#loading").css("display", "none");
    });
}

function getUnits(dataType) {
    if (dataType === "Accelerometer") {
        return "Vector Magnitude of Motion";
    } else if (dataType === "Heart Rate") {
        return "BPM";
    } else if (dataType === "Motion") {
        return "Fraction of Time in Motion";
    } else if (dataType === "Temperature") {
        return "°Celsius";
    } else if (dataType === "EDA Mean Difference") {
        return "Microsiemens (µS)";
    } else if (dataType === "EDA Mean") {
        return "Microsiemens (µS)";
    } else if (dataType === "Skin Conductance Response") {
        return "Number of SCRs";
    } else if (dataType === "Incoming Call Count") {
        return "Number of Calls";
    } else if (dataType === "Incoming Call Mean Duration") {
        return "Seconds";
    } else if (dataType === "Incoming Call Median Duration") {
        return "Seconds";
    } else if (dataType === "Incoming Call Std Duration") {
        return "Seconds";
    } else if (dataType === "Incoming Call Sum Duration") {
        return "Seconds";
    } else if (dataType === "Outgoing Call Count") {
        return "Number of Calls";
    } else if (dataType === "Outgoing Call Mean Duration") {
        return "Seconds";
    } else if (dataType === "Outgoing Call Median Duration") {
        return "Seconds";
    } else if (dataType === "Outgoing Call Std Duration") {
        return "Seconds";
    } else if (dataType === "Outgoing Call Sum Duration") {
        return "Seconds";
    } else if (dataType === "Screen On Count") {
        return "Number of Times On"
    } else if (dataType === "Screen On Mean Duration") {
        return ("Seconds")
    } else if (dataType === "Screen On Median Duration") {
        return ("Seconds")
    } else if (dataType === "Screen On Std Duration") {
        return ("Seconds")
    } else if (dataType === "Screen On Sum Duration") {
        return ("Seconds")
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
        return "Skin Conductance Responses per Day in Study";
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
        return ("Mean Duration of Screen Time")
    } else if (dataType === "Screen On Median Duration") {
        return ("Median Duration of Screen Time")
    } else if (dataType === "Screen On Std Duration") {
        return ("Std Dev of Duration of Screen Time")
    } else if (dataType === "Screen On Sum Duration") {
        return ("Sum of Duration of Screen Time")
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
        return "The daily average of the magnitude of motion vectors combining 3-axis accelerometer measurements";
    } else if (type === "Heart Rate") {
        return "The daily average heart rate, measured in beats per minute";
    } else if (type === "Motion") {
        return "The decimal percentage of the day when the individual was in motion (estimated using actigraphy)";
    } else if (type === "Temperature") {
        return "The daily average skin temperature measured from each hand";
    } else if (type === "EDA Mean Difference") {
        return "The daily average of the difference between right and left hand Skin Conductance Level signals (Right - Left)";
    } else if (type === "EDA Mean") {
        return "The daily average amplitude of Skin Conductance Response measured from each hand";
    } else if (type === "Skin Conductance Response") {
        return "The number of Skin Conductance Responses (peaks) accumulated over the course of a day measured from each hand";
    } else if (type === "Incoming Call Count") {
        return "The number of incoming phone calls accumulated over the course of a day";
    } else if (type === "Incoming Call Mean Duration") {
        return "The average duration of all incoming phone calls over the course of a day";
    } else if (type === "Incoming Call Median Duration") {
        return "The median duration of all incoming phone calls over the course of a day";
    } else if (type === "Incoming Call Std Duration") {
        return "The standard deviation of the duration of all incoming phone calls over the course of a day";
    } else if (type === "Incoming Call Sum Duration") {
        return "The sum of the duration of all incoming phone calls over the course of a day";
    } else if (type === "Outgoing Call Count") {
        return "The number of outgoing phone calls accumulated over the course of a day";
    } else if (type === "Outgoing Call Mean Duration") {
        return "The average duration of all outgoing phone calls over the course of a day";
    } else if (type === "Outgoing Call Median Duration") {
        return "The median duration of all outgoing phone calls over the course of a day";
    } else if (type === "Outgoing Call Std Duration") {
        return "The standard deviation of the duration of all outgoing phone calls over the course of a day";
    } else if (type === "Outgoing Call Sum Duration") {
        return "The sum of the duration of all outgoing phone calls over the course of a day";
    } else if (type === "Screen On Count") {
        return "The number of times an individual's phone display was turned on over the course of a day"
    } else if (type === "Screen On Mean Duration") {
        return ("Average duration for which an individual's phone display was on over the course of a day")
    } else if (type === "Screen On Median Duration") {
        return ("Median duration for which an individual's phone display was on over the course of a day")
    } else if (type === "Screen On Std Duration") {
        return ("Standard deviation of duration for which an individual's phone display was on over the course of a day")
    } else if (type === "Screen On Sum Duration") {
        return ("Total amount of time an individual's phone display was on over the course of a day")
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
    } else if (group === "New Medication") {
        return "Group and aggregate over participants based on whether they plan on taking additional medication or not";
    } else if (group === "None") {
        return "Show an individual's data";
    } else {
        throw new Error("Invalid group value: " + group);
    }
}

function getAggregationText(aggregation) {
    if (aggregation === "Mean") {
        return "Calculate the arithmetic mean over the participants in each group for every day - if a participant has no data point for a particular day, he/she is not included in calculating the mean";
    } else if (aggregation === "Median") {
        return "Find the median measurement over the participants in each group for every day - if a participant has no data point for a particular day, he/she is not included in finding the median";
    } else if (aggregation === "Max") {
        return "Find the maximum measurement over the participants in each group for every day - if a participant has no data point for a particular day, he/she is not included in finding the max";
    } else if (aggregation === "Min") {
        return "Find the minimum measurement over the participants in each group for every day - if a participant has no data point for a particular day, he/she is not included in finding the min";
    } else if (aggregation === "Std Dev") {
        return "Calculate the standard deviation over the participants in each group for every day - if a participant has no data point for a particular day, he/she is not included in calculating the standard deviation";
    } else {
        throw new Error("Invalid aggregation value: " + aggregation);
    }
}

function getIndividualText(individual) {
    ind_num = parseInt(individual.slice(1));
    return "Individual " + ind_num + " of the study";
}

