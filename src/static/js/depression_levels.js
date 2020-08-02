var category_dropdown = $("#category_dropdown");
var group_dropdown = $("#group_dropdown");
var aggregation_dropdown = $("#aggregation_dropdown");
var names_dropdown = $("#names_dropdown");
var last_request;
const description = $("span#description-text");
var user_type;
var study = $("#study").data("value");

$( document ).ready(function() {
    var category = category_dropdown.val();
    var dataType = $("#" + category_dropdown.val() + "_dropdown").val();
    var group = group_dropdown.val();
    var aggregation = aggregation_dropdown.val();
    var name = names_dropdown.val();
    $('#PHQ9-colors').css('width', 'calc(100% - 241px)');
    $('#HDRS-colors').css('width', 'calc(100% - 241px)');
    $.ajax({
        url: "/get-user-type/",
        dataType: "json"
    }).done(function(data) {
        user_type = data.user;
        if (group_dropdown.val() === "None") {
            drawDepTrendsIndividual();
        } else {
            drawDepTrendsGroup();
        }
    });
    $("#PHQ9-colors").css('display', 'none');
    $("#HDRS-colors").css('display', 'block');
    $("#depression-legend-PHQ9").css('display', 'none');
    $("#depression-legend-HDRS").css('display', 'block');
    $(".surrounding-chart-container").css('width', '84%');
    $("#names_dropdown, .type_dropdown, #aggregation_dropdown, #group_dropdown, #category_dropdown").change(function() {
        $("#loading").css("display","flex");
        resetDescriptionText(description);
        if (group_dropdown.val() === "None") {
            if (user_type !== "participant") {
                $("#aggregation_container").css("display", "none");
                $("#names_container").css("display", "flex");
                $("div.aggregation-description").css("display", "none");
                $("div.individual-description").css("display", "block");
            }
            drawDepTrendsIndividual();
        } else {
            $("#names_container").css("display", "none");
            $("#aggregation_container").css("display", "flex");
            $("div.individual-description").css("display", "none");
            $("div.aggregation-description").css("display", "block");
            drawDepTrendsGroup();
        }
    });

    category_dropdown.change(function() {
        category = category_dropdown.val();
        dataType = $("#" + category_dropdown.val() + "_dropdown").val();
        $(".data-dropdown-container").css("display", "none");
        $("#" + category + "_dropdown_container").css("display", "flex");
        console.log('no.')
    });
    $(".type_dropdown").change(function () {
        dataType = $("#" + category_dropdown.val() + "_dropdown").val();
        if (dataType === "Daily (PHQ-9)") {
          $("#PHQ9-colors").css('display', 'block');
          $("#HDRS-colors").css('display', 'none');
          $("#depression-legend-PHQ9").css('display', 'block');
          $("#depression-legend-HDRS").css('display', 'none');
        } else if ( dataType === 'Weekly (HDRS)') {
          $("#PHQ9-colors").css('display', 'none');
          $("#HDRS-colors").css('display', 'block');
          $("#depression-legend-PHQ9").css('display', 'none');
          $("#depression-legend-HDRS").css('display', 'block');
        }
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

    $(".category-description").click(
        function() {
            console.log(category)
            description.text(dataCategoryText[category]);
            description.css("font-style", "normal");
            description.css("color", "black");
        }
    );
    $(".type-description").click(
        function() {
            console.log(dataType)
            description.text(dataTypeTextDaily[dataType]);
            description.css("font-style", "normal");
            description.css("color", "black");
        }
    );
    $(".preprocess-description").click(
        function() {
            description.text(preprocessTextDaily[dataType] || preprocessTextDefault);
            description.css("font-style", "normal");
            description.css("color", "black");
        }
    );
    $(".group-description").click(
        function() {
            description.text(groupText[group]);
            description.css("font-style", "normal");
            description.css("color", "black");
        }
    );
    $(".aggregation-description").click(
        function() {
            description.text(aggregationTextDaily[aggregation]);
            description.css("font-style", "normal");
            description.css("color", "black");
        }
    );
    $(".individual-description").click(
        function() {
            description.text(getIndividualText(name));
            description.css("font-style", "normal");
            description.css("color", "black");
        }
    );
});

function drawDepTrendsIndividual() {
    if (last_request && last_request.readyState !== 4) {
        last_request.abort();
    }
    last_request = $.ajax({
        url: "/get-depression-scale-data/",
        data: {
            type: $("#" + category_dropdown.val() + "_dropdown").val(),
            aggregation: aggregation_dropdown.val(),
            group: group_dropdown.val(),
            name: names_dropdown.val(),
            number: study,
        },
        dataType: "json"
    }).done(function(data) {
        $('#PHQ9-colors').css('width', 'calc(100% - 241px)');
        $('#HDRS-colors').css('width', 'calc(100% - 241px)');
        const type = $("#" + category_dropdown.val() + "_dropdown").val();
        let unitRange;
        if (type === 'Daily (PHQ-9)'){
          unitRange = [0,28]
        } else {
          unitRange = [0,45]
        }
        // console.log(type);
        const name = names_dropdown.val();
        const subject_data = data.subject_data[null];
        // console.log(subject_data);
        const dates = [];
        //Dates after raw data conversion are in Unix Time format.

        const weekdayArray = ['Sunday, ', 'Monday, ', 'Tuesday, ', 'Wednesday, ', 'Thursday, ', 'Friday, ', 'Saturday, ']
        var weekdaysOfDates = []
        let currentWeekday
        subject_data["dates"].forEach(function(d) {
            currentWeekday = weekdayArray[new Date(d).getDay()]
            weekdaysOfDates.push(currentWeekday)
            dates.push((new Date(d)));
        });
        const measurements = subject_data["measurements"];

        const individual_trace = {
            x: dates,
            y: measurements,
            mode: 'lines+markers',
            hovertemplate: '%{y}<extra>%{text}%{x}</extra>',
            text: weekdaysOfDates,
            hoverinfo: "skip",
            name: name,
            line: {
                width: 1.5
            }
        };

        const layout = {
            title: "<b>" + titleForTypeDaily[type] + "</b>",
            font: {
                family: "Helvetica Neue, Helvetica, Arial, sans-serif",
                size: 16
            },
            titlefont: {
                size: 28
            },
            xaxis: {
                title: "Date",
                showline: true,
                zeroline: false,
                titlefont: {
                    size: 20
                }
            },
            yaxis: {
                title: unitsDaily[type],
                showline: true,
                zeroline: false,
                titlefont: {
                    size: 20
                },
                fixedrange: true,
                tickprefix: "   ",
                automargin: true,
                range: unitRange
            },
            showlegend: false,
            legend: {
                x: 1,
                y: 0.5
            },
            dragmode: "pan",
            plot_bgcolor: "rgba(0,0,0,0)",
            paper_bgcolor: 'rgba(0,0,0,0)',
            hovermode: 'closest',
        };

        Plotly.newPlot("chart1", [individual_trace], layout, {displayModeBar: false, responsive: true, scrollZoom: true});
        $("#loading").css("display", "none");
    });
}

function drawDepTrendsGroup() {
    if (last_request && last_request.readyState !== 4) {
        last_request.abort();
    }
    last_request = $.ajax({
        url: "/get-depression-scale-data/",
        data: {
            type: $("#" + category_dropdown.val() + "_dropdown").val(),
            aggregation: aggregation_dropdown.val(),
            group: group_dropdown.val(),
            name: names_dropdown.val(),
            number: study,
        },
        dataType: "json"
    }).done(function(data) {
        const type = $("#" + category_dropdown.val() + "_dropdown").val();
        let unitRange;
        if (type === 'Daily (PHQ-9)'){
          unitRange = [0,28]
        } else {
          unitRange = [0,45]
        }
        const group_sizes = data.group_sizes;
        console.log(group_sizes)
        $.each(group_sizes, function(key, value) {
          if (key === 'Yes'){
            $('#PHQ9-colors').css('width', 'calc(100% - 264px)');
            $('#HDRS-colors').css('width', 'calc(100% - 264px)');
          } else if (key === 'All') {
            $('#PHQ9-colors').css('width', 'calc(100% - 257px)');
            $('#HDRS-colors').css('width', 'calc(100% - 257px)');
          } else if (key === 'HC'){
            $('#PHQ9-colors').css('width', 'calc(100% - 276px)');
            $('#HDRS-colors').css('width', 'calc(100% - 276px)');
          } else if (key === 'Female'){
            $('#PHQ9-colors').css('width', 'calc(100% - 291px)');
            $('#HDRS-colors').css('width', 'calc(100% - 291px)');
          } else if (key === 'Married'){
            $('#PHQ9-colors').css('width', 'calc(100% - 303px)');
            $('#HDRS-colors').css('width', 'calc(100% - 303px)');
          } else if (key === 'Student'){
            $('#PHQ9-colors').css('width', 'calc(100% - 427px)');
            $('#HDRS-colors').css('width', 'calc(100% - 427px)');
          } else if (key === '[18, 25]'){
            $('#PHQ9-colors').css('width', 'calc(100% - 292px)');
            $('#HDRS-colors').css('width', 'calc(100% - 292px)');
          } else if (key === '[0]'){
            $('#PHQ9-colors').css('width', 'calc(100% - 309px)');
            $('#HDRS-colors').css('width', 'calc(100% - 309px)');
          } else if (key === 'Recurrent'){
            $('#PHQ9-colors').css('width', 'calc(100% - 309px)');
            $('#HDRS-colors').css('width', 'calc(100% - 309px)');
          }
        });
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
                hoverinfo: "x"
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
                bgcolor: 'rgba(100,100,100 0.5)',
                bordercolor: 'transparent'
            }
        ];

        const layout = {
            title: "<b>" + titleForTypeDaily[type] + "</b>",
            font: {
                family: "Helvetica Neue, Helvetica, Arial, sans-serif",
                size: 16
            },
            titlefont: {
                size: 28
            },
            updatemenus: updatemenus,
            xaxis: {
                title: "Day in Study",
                showline: true,
                zeroline: false,
                titlefont: {
                    size: 20
                }
            },
            yaxis: {
                title: unitsDaily[type],
                showline: true,
                zeroline: false,
                titlefont: {
                    size: 20
                },
                fixedrange: true,
                tickprefix: "   ",
                automargin: true,
                range: unitRange
            },
            showlegend: true,
            legend: {
                x: 1,
                y: 0.5
            },
            dragmode: "pan",
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
        };

        Plotly.newPlot("chart1", traces, layout, {displayModeBar: false, responsive: true, scrollZoom: true});
        chart.on('plotly_buttonclicked', toggleErrorShading);
        chart.on('plotly_legendclick', function(clickData) {
            if (errorIsVisible && clickData.data[clickData.curveNumber].visible === 'legendonly') {
                chart.data[clickData.curveNumber+1].visible = true;
                if (isTwoHands.has(type)) {
                    chart.data[clickData.curveNumber+3].visible = true;
                }
            }
        });
        chart.on('plotly_legenddoubleclick', function() {return false;});
        $("#loading").css("display", "none");
    });
}
