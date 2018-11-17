var chart_container = $(".chart-container");
var x_category_dropdown = $("#x_axis_category");
var y_category_dropdown = $("#y_axis_category");
var group_dropdown = $("#group_dropdown");

$( document ).ready(function() {
    chart_container.css('flex-direction', 'row');
    chart_container.css('justify-content', 'center');
    chart_container.css('align-items', 'stretch');

    $("span.x-category-description").text(getDataCategoryText(x_category_dropdown.val()));
    $("span.x-type-description").text(getDataTypeText($("#x_axis_" + x_category_dropdown.val() + "_dropdown").val()));
    $("span.y-category-description").text(getDataCategoryText(y_category_dropdown.val()));
    $("span.y-type-description").text(getDataTypeText($("#y_axis_" + y_category_dropdown.val() + "_dropdown").val()));
    $("span.group-description").text(getGroupText(group_dropdown.val()));

    drawScatterPlot();
    $("#x_axis_category, #y_axis_category, .x_axis_dropdown, .y_axis_dropdown, #group_dropdown").change(function() {
        $("#loading").css('display', 'flex');
        drawScatterPlot();
    });
    x_category_dropdown.change(function() {
        $(".data-dropdown-container.x_axis").css("display", "none");
        $("#x_axis_" + x_category_dropdown.val() + "_container").css("display", "flex");
        const x_category = x_category_dropdown.val();
        $("span.x-category-description").text(getDataCategoryText(x_category));
        const x_dataType = $("#x_axis_" + x_category_dropdown.val() + "_dropdown").val();
        $("span.x-type-description").text(getDataTypeText(x_dataType));
    });
    y_category_dropdown.change(function() {
        $(".data-dropdown-container.y_axis").css("display", "none");
        $("#y_axis_" + y_category_dropdown.val() + "_container").css("display", "flex");
        const y_category = y_category_dropdown.val();
        $("span.y-category-description").text(getDataCategoryText(y_category));
        const y_dataType = $("#y_axis_" + y_category_dropdown.val() + "_dropdown").val();
        $("span.y-type-description").text(getDataTypeText(y_dataType));
    });
    $(".x_axis_dropdown").change(function() {
        const x_dataType = $("#x_axis_" + x_category_dropdown.val() + "_dropdown").val();
        $("span.x-type-description").text(getDataTypeText(x_dataType));
    });
    $(".y_axis_dropdown").change(function() {
        const y_dataType = $("#y_axis_" + y_category_dropdown.val() + "_dropdown").val();
        $("span.y-type-description").text(getDataTypeText(y_dataType));
    });
    group_dropdown.change(function() {
        const group = group_dropdown.val();
        $("span.group-description").text(getGroupText(group));
    });
});

function drawScatterPlot() {
    $.ajax({
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
        if (isTwoHands(x_type) || isTwoHands(y_type)) {
            $("#chart2").show();

            const columns_left = [];
            const columns_right = [];
            const xs = {};
            for (const subgroup in group_data) {
                const subgroup_data = group_data[subgroup];
                const x_data_left  = subgroup_data['x']['left'];
                const x_data_right = subgroup_data['x']['right'];
                const y_data_left  = subgroup_data['y']['left'];
                const y_data_right = subgroup_data['y']['right'];
                columns_left.push([subgroup + '_x'].concat(x_data_left));
                columns_left.push([subgroup + " (n = " + group_sizes[subgroup] + ")"].concat(y_data_left));
                columns_right.push([subgroup + '_x'].concat(x_data_right));
                columns_right.push([subgroup + " (n = " + group_sizes[subgroup] + ")"].concat(y_data_right));
                xs[subgroup + " (n = " + group_sizes[subgroup] + ")"] = subgroup + '_x';
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
            for (const subgroup in group_data) {
                const subgroup_data = group_data[subgroup];
                const x_data = subgroup_data['x'];
                const y_data = subgroup_data['y'];
                columns.push([subgroup + '_x'].concat(x_data));
                columns.push([subgroup + " (n = " + group_sizes[subgroup] + ")"].concat(y_data));
                xs[subgroup + " (n = " + group_sizes[subgroup] + ")"] = subgroup + '_x';
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
    if (dataType === "Accelerometer") {
        return "Vector Magnitude of Motion";
    } else if (dataType === "Heart Rate") {
        return "Heart Rate (BPM)";
    } else if (dataType === "Motion") {
        return "Fraction of Time in Motion";
    } else if (dataType === "Temperature") {
        return "Temperature (°C)";
    } else if (dataType === "EDA Mean Difference") {
        return "Microsiemens (µS)";
    } else if (dataType === "EDA Mean") {
        return "Microsiemens (µS)";
    } else if (dataType === "Skin Conductance Response") {
        return "# of SCRs";
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


function getTitle(x_type, y_type) {
    return x_type + " vs " + y_type;
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
