var category_dropdown = $("#category_dropdown");
var group_dropdown = $("#group_dropdown");
var aggregation_dropdown = $("#aggregation_dropdown");
var names_dropdown = $("#names_dropdown");

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
                dataType === "Screen On Sum Duration" ||
                dataType === "Insolation Seconds") {
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
        return "Degrees";
    } else if (dataType === "Home Stay" ||
                dataType === "Transition Time") {
        return "Percentage of Day";
    } else if (dataType === "Total Distance") {
        return "Meters";
    } else if (dataType === "Precipitation Intensity") {
        return "Inches per Hour";
    } else if (dataType === "Apparent Temperature High") {
        return "°Fahrenheit";
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
        return "Number of Times Screen Turned On";
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
    } else if (dataType === "Insolation Seconds") {
        return "Length of Day";
    } else if (dataType === "Precipitation Intensity") {
        return "Precipitation Intensity";
    } else if (dataType === "Apparent Temperature High") {
        return "Apparent Temperature High";
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
    } else if (category === "Location") {
        return "Location data collected from phone GPS measurements";
    } else if (category === "Weather") {
        return "Weather data collected from Dark Sky API database";
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
        return "The sum of the durations of all incoming phone calls over the course of a day";
    } else if (type === "Outgoing Call Count") {
        return "The number of outgoing phone calls accumulated over the course of a day";
    } else if (type === "Outgoing Call Mean Duration") {
        return "The average duration of all outgoing phone calls over the course of a day";
    } else if (type === "Outgoing Call Median Duration") {
        return "The median duration of all outgoing phone calls over the course of a day";
    } else if (type === "Outgoing Call Std Duration") {
        return "The standard deviation of the duration of all outgoing phone calls over the course of a day";
    } else if (type === "Outgoing Call Sum Duration") {
        return "The sum of the durations of all outgoing phone calls over the course of a day";
    } else if (type === "Screen On Count") {
        return "The number of times an individual's phone display was turned on over the course of a day";
    } else if (type === "Screen On Mean Duration") {
        return "Average duration for which an individual's phone display was on over the course of a day";
    } else if (type === "Screen On Median Duration") {
        return "Median duration for which an individual's phone display was on over the course of a day";
    } else if (type === "Screen On Std Duration") {
        return "Standard deviation of duration for which an individual's phone display was on over the course of a day";
    } else if (type === "Screen On Sum Duration") {
        return "Total amount of time an individual's phone display was on over the course of a day";
    } else if (type === "Incoming SMS Count") {
        return "The number of incoming SMS messages accumulated over the course of a day";
    } else if (type === "Incoming SMS Mean Length") {
        return "The average length of all incoming SMS messages over the course of a day";
    } else if (type === "Incoming SMS Median Length") {
        return "The median length of all incoming SMS messages over the course of a day";
    } else if (type === "Incoming SMS Std Length") {
        return "The standard deviation of the length of all incoming SMS messages over the course of a day";
    } else if (type === "Incoming SMS Sum Length") {
        return "The sum of the lengths of all incoming SMS messages over the course of a day";
    } else if (type === "Outgoing SMS Count") {
        return "The number of outgoing SMS messages accumulated over the course of a day";
    } else if (type === "Outgoing SMS Mean Length") {
        return "The average length of all outgoing SMS messages over the course of a day";
    } else if (type === "Outgoing SMS Median Length") {
        return "The median length of all outgoing SMS messages over the course of a day";
    } else if (type === "Outgoing SMS Std Length") {
        return "The standard deviation of the length of all outgoing SMS messages over the course of a day";
    } else if (type === "Outgoing SMS Sum Length") {
        return "The sum of the lengths of all incoming SMS messages over the course of a day";
    } else if (type === "Latitude Std") {
        return "The standard deviation of an individual's latitude over the course of a day";
    } else if (type === "Latitude Stationary Std") {
        return "The standard deviation of an individual's latitude while stationary over the course of a day (stationary is defined as a moving speed of less than 0.3 m/s)";
    } else if (type === "Longitude Std") {
        return "The standard deviation of an individual's longitude over the course of a day";
    } else if (type === "Longitude Stationary Std") {
        return "The standard deviation of an individual's longitude while stationary over the course of a day (stationary is defined as a moving speed of less than 0.3 m/s)";
    } else if (type === "Average Location Std") {
        return "The average of the standard deviation of an individual's latitude and longitude over the course of a day";
    } else if (type === "Average Stationary Std") {
        return "The average of the standard deviation of an individual's latitude and longitude while stationary over the course of a day (stationary is defined as a moving speed of less than 0.3 m/s)";
    } else if (type === "Home Stay") {
        return "The percentage of time spent at home throughout the day (home location is estimated based on median of stationary locations)";
    } else if (type === "Total Distance") {
        return "The sum total distance traveled throughout the day";
    } else if (type === "Transition Time") {
        return "The percentage of time spent in transition throughout the day";
    } else if (type === "Insolation Seconds") {
        return "The total elapsed time between sunrise and sunset for a given day";
    } else if (type === "Precipitation Intensity") {
        return "The average intensity of precipitation over the course of a day";
    } else if (type === "Apparent Temperature High") {
        return "The daytime high apparent temperature";
    } else {
        throw new Error("Invalid type value: " + type);
    }
}

function getPreprocessText(dataType) {
    if (dataType === "Accelerometer") {
        return "To calculate the instantaneous motion vector, the 3-axis raw acceleration was first rescaled to the " +
            "range [-2g; 2g]. Then, each second (32 samples) the acceleration data is summarized using the following " +
            "method: sum+= max3(abs(buffX[i] - prevX), abs(buffY[i] - prevY), abs(buffZ[i] - prevZ)). " +
            "The output is then filtered: avg=avg*0.9+(sum/32)*0.1. Finally the mean over 1 day is calculated."
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
            "average of the EDA signal is calculated over 1 day."
    } else if (dataType === "Skin Conductance Response") {
        return "The EDA signal is first selected when the measured skin temperature > 30 degree Celsius (sensor is " +
            "worn on the wrist). Then the EDA signal when the participant is in motion (based on the accelerometer " +
            "data) is filtered out. Next, the low-pass Butterworth filter (1Hz cutoff) is applied. Finally the " +
            "average number of EDA peaks (SCRs) is calculated over 1 day."
    } else if (dataType === "EDA Mean Difference") {
        return "The EDA signal is first selected when the measured skin temperature > 30 degree Celsius (sensor is " +
            "worn on the wrist). Then the EDA signal when the participant is in motion (based on the accelerometer " +
            "data) is filtered out. Next, the low-pass Butterworth filter (1Hz cutoff) is applied. Finally the " +
            "difference between the averages of the EDA signals from the right and left wrists (right minus left) is" +
            " calculated over 1 day."
    } else if (dataType === "Heart Rate") {
        return "Heart rate is computed by detecting peaks (beats) from the PPG and computing the lengths of the" +
            " intervals between adjacent beats.  The inter-beat-interval (IBI) timing is used to estimate the" +
            " instantaneous heart rate. The average of the instantaneous HR is calculated over 1 day."
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

