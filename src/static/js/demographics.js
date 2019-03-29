var category_dropdown = $("#category_dropdown");
var last_request;
const description = $("span#description-text");

$( document ).ready(function() {
    var category = category_dropdown.val();
    if (category === "Mental Health") {
       drawMentalHealthCharts();
    } else if (category === "Ethnicity and Race") {
       drawRaceEthnicityCharts();
    } else if (category === "Age and Sex") {
        drawAgeSexCharts();
    }
    category_dropdown.change(function() {
        category = category_dropdown.val();
        $("#loading").css("display", "flex");
        resetDescriptionText(description);
        if (category === "Mental Health") {
           drawMentalHealthCharts();
        } else if (category === "Ethnicity and Race") {
           drawRaceEthnicityCharts();
        } else if (category === "Age and Sex") {
           drawAgeSexCharts();
        }
    });

    $(".category-description").click(
        function() {
            description.text(dataCategoryText[category]);
            description.css("font-style", "normal");
            description.css("color", "black");
        }
    );
});

function drawMentalHealthCharts() {
    if (last_request && last_request.readyState !== 4) {
        last_request.abort();
    }
    last_request = $.ajax( {
        url: "/get-demographics-data/",
        data: {
            category: category_dropdown.val(),
        },
        dataType: "json"
    }).done(function(data) {
        const psycho_data = data.data.psychotherapy;
        const num_trials_data = data.data.trials;
        const length_data = data.data.treatment_length;
        const group_data = data.data.study_group;

        const colors = ['#1b4e7d', '#a81b1d', chart_colors[7]];
        const traces = [];

        const group_labels = ['Healthy Control', 'Major Depressive Disorder', 'Missing Data'];
        const group_values = [group_data['HC'], group_data['MDD'], group_data['missing']];
        traces.push({
            values: group_values,
            labels: group_labels,
            type: 'pie',
            domain: {
                x: [0, 0.5],
                y: [0.55, 0.98]
            },
            marker: {
                colors: colors,
            },
            textinfo: 'value',
            textfont: {
                size: 16
            },
            hoverinfo: 'label',
            hoverlabel: {
                font: {
                    size: 16
                }
            },
            outsidetextfont: {
                color: 'white'
            }
        });

        const psycho_labels = ['Yes', 'No', 'Missing Data'];
        const psycho_values = [psycho_data[true], psycho_data[false], psycho_data['missing']];
        traces.push({
            values: psycho_values,
            labels: psycho_labels,
            type: 'pie',
            domain: {
                x: [0.5, 1],
                y: [0.55, 0.98]
            },
            marker: {
                colors: colors,
            },
            textinfo: 'value',
            textfont: {
                size: 16
            },
            hoverinfo: 'label',
            hoverlabel: {
                font: {
                    size: 16
                }
            },
            outsidetextfont: {
                color: 'white'
            }
        });

        traces.push({
            x: num_trials_data,
            type: 'histogram',
            xaxis: 'x3',
            yaxis: 'y3',
            marker: {
                color: '#6d4a90'
            },
            hoverinfo: 'x+y'
        });

        traces.push({
            x: length_data,
            type: 'histogram',
            xaxis: 'x4',
            yaxis: 'y4',
            marker: {
                color: '#6d4a90'
            },
            hoverinfo: 'x+y'
        });

        const layout = {
            grid: {rows: 2, columns: 2, pattern: 'independent'},
            showlegend: false,
            xaxis3: {
                title: "Number of trials (-1 if unknown)",
                titlefont: {
                    size: 16
                },
                ticks: "outside",
            },
            yaxis3: {
                title: "Number of participants",
                titlefont: {
                    size: 16
                },
                ticks: "outside"
            },
            xaxis4: {
                title: "Length of episode (months)",
                titlefont: {
                    size: 16
                },
                ticks: "outside"
            },
            yaxis4: {
                title: "Number of participants",
                titlefont: {
                    size: 16
                },
                ticks: "outside"
            },
            annotations: [
                {
                    xref: 'paper',
                    yref: 'paper',
                    x: 0.25,
                    xanchor: 'center',
                    y: 1,
                    yanchor: 'bottom',
                    text: 'Study Group',
                    showarrow: false,
                    font: {
                        size: 20
                    }
                },
                {
                    xref: 'paper',
                    yref: 'paper',
                    x: 0.75,
                    xanchor: 'center',
                    y: 1,
                    yanchor: 'bottom',
                    text: 'Currently in Psychotherapy',
                    showarrow: false,
                    font: {
                        size: 20
                    }
                },
                {
                    xref: 'paper',
                    yref: 'paper',
                    x: 0.25,
                    xanchor: 'center',
                    y: 0.42,
                    yanchor: 'bottom',
                    text: 'Number of Medical Trials',
                    showarrow: false,
                    font: {
                        size: 20
                    }
                },
                {
                    xref: 'paper',
                    yref: 'paper',
                    x: 0.75,
                    xanchor: 'center',
                    y: 0.42,
                    yanchor: 'bottom',
                    text: 'Length of Current Episode',
                    showarrow: false,
                    font: {
                        size: 20
                    }
                }
            ]
        };

        Plotly.newPlot("chart1", traces, layout, {displayModeBar: false, responsive: true});
        $("#loading").css("display", "none");
    });
}


function drawRaceEthnicityCharts() {
    if (last_request && last_request.readyState !== 4) {
        last_request.abort();
    }
    last_request = $.ajax( {
        url: "/get-demographics-data/",
        data: {
            category: category_dropdown.val(),
        },
        dataType: "json"
    }).done(function(data) {
        const ethnicity = data.data.ethnicity;
        const white = data.data.white;
        const black = data.data.black;
        const asian = data.data.asian;
        const pacific = data.data.pacific;
        const native = data.data.native;
        const other = data.data.other;

        const colors = ['#1b4e7d', '#a81b1d'];
        const traces = [];

        traces.push({
            values: [ethnicity['Hispanic or Latino'], ethnicity['Non-Hispanic or Latino']],
            labels: ['Hispanic or Latino', 'Non-Hispanic or Latino'],
            type: 'pie',
            domain: {
                x: [0, 0.25],
                y: [0.55, 0.98]
            },
            marker: {
                colors: colors,
            },
            textinfo: 'value',
            textfont: {
                size: 16
            },
            hoverinfo: 'label',
            hoverlabel: {
                font: {
                    size: 16
                }
            },
            outsidetextfont: {
                color: 'white'
            }
        });

        traces.push({
            values: [white[true], white[false]],
            labels: ['Yes', 'No'],
            type: 'pie',
            domain: {
                x: [0.25, 0.5],
                y: [0.55, 0.98]
            },
            marker: {
                colors: colors,
            },
            textinfo: 'value',
            textfont: {
                size: 16
            },
            hoverinfo: 'label',
            hoverlabel: {
                font: {
                    size: 16
                }
            },
            outsidetextfont: {
                color: 'white'
            }
        });

        traces.push({
            values: [black[true], black[false]],
            labels: ['Yes', 'No'],
            type: 'pie',
            domain: {
                x: [0.5, 0.75],
                y: [0.55, 0.98]
            },
            marker: {
                colors: colors,
            },
            textinfo: 'value',
            textfont: {
                size: 16
            },
            hoverinfo: 'label',
            hoverlabel: {
                font: {
                    size: 16
                }
            },
            outsidetextfont: {
                color: 'white'
            }
        });

        traces.push({
            values: [asian[true], asian[false]],
            labels: ['Yes', 'No'],
            type: 'pie',
            domain: {
                x: [0.75, 1],
                y: [0.55, 0.98]
            },
            marker: {
                colors: colors,
            },
            textinfo: 'value',
            textfont: {
                size: 16
            },
            hoverinfo: 'label',
            hoverlabel: {
                font: {
                    size: 16
                }
            },
            outsidetextfont: {
                color: 'white'
            }
        });

        traces.push({
            values: [pacific[true], pacific[false]],
            labels: ['Yes', 'No'],
            type: 'pie',
            domain: {
                x: [.125, 0.375],
                y: [0, 0.43]
            },
            marker: {
                colors: colors,
            },
            textinfo: 'value',
            textfont: {
                size: 16
            },
            hoverinfo: 'label',
            hoverlabel: {
                font: {
                    size: 16
                }
            },
            outsidetextfont: {
                color: 'white'
            }
        });

        traces.push({
            values: [native[true], native[false]],
            labels: ['Yes', 'No'],
            type: 'pie',
            domain: {
                x: [.375, 0.625],
                y: [0, 0.43]
            },
            marker: {
                colors: colors,
            },
            textinfo: 'value',
            textfont: {
                size: 16
            },
            hoverinfo: 'label',
            hoverlabel: {
                font: {
                    size: 16
                }
            },
            outsidetextfont: {
                color: 'white'
            }
        });

        traces.push({
            values: [other[true], other[false]],
            labels: ['Yes', 'No'],
            type: 'pie',
            domain: {
                x: [.625, 0.875],
                y: [0, 0.43]
            },
            marker: {
                colors: colors,
            },
            textinfo: 'value',
            textfont: {
                size: 16
            },
            hoverinfo: 'label',
            hoverlabel: {
                font: {
                    size: 16
                }
            },
            outsidetextfont: {
                color: 'white'
            }
        });

        const layout = {
            showlegend: false,
            annotations: [
                {
                    xref: 'paper',
                    yref: 'paper',
                    x: 0.125,
                    xanchor: 'center',
                    y: 1,
                    yanchor: 'bottom',
                    text: 'Ethnicity',
                    showarrow: false,
                    font: {
                        size: 20
                    }
                },
                {
                    xref: 'paper',
                    yref: 'paper',
                    x: 0.375,
                    xanchor: 'center',
                    y: 1,
                    yanchor: 'bottom',
                    text: 'Race: White',
                    showarrow: false,
                    font: {
                        size: 20
                    }
                },
                {
                    xref: 'paper',
                    yref: 'paper',
                    x: 0.625,
                    xanchor: 'center',
                    y: 1,
                    yanchor: 'bottom',
                    text: 'Race: Black/African American',
                    showarrow: false,
                    font: {
                        size: 20
                    }
                },
                {
                    xref: 'paper',
                    yref: 'paper',
                    x: 0.875,
                    xanchor: 'center',
                    y: 1,
                    yanchor: 'bottom',
                    text: 'Race: Asian',
                    showarrow: false,
                    font: {
                        size: 20
                    }
                },
                {
                    xref: 'paper',
                    yref: 'paper',
                    x: 0.25,
                    xanchor: 'center',
                    y: 0.45,
                    yanchor: 'bottom',
                    text: 'Race: Hawaiian/Pacific Islander',
                    showarrow: false,
                    font: {
                        size: 20
                    }
                },
                {
                    xref: 'paper',
                    yref: 'paper',
                    x: 0.5,
                    xanchor: 'center',
                    y: 0.45,
                    yanchor: 'bottom',
                    text: 'Race: American Indian/Alaskan Native',
                    showarrow: false,
                    font: {
                        size: 20
                    }
                },
                {
                    xref: 'paper',
                    yref: 'paper',
                    x: 0.75,
                    xanchor: 'center',
                    y: 0.45,
                    yanchor: 'bottom',
                    text: 'Race: Other',
                    showarrow: false,
                    font: {
                        size: 20
                    }
                }
            ]
        };

        Plotly.newPlot("chart1", traces, layout, {displayModeBar: false, responsive: true});
        $("#loading").css("display", "none");
    });
}


function drawAgeSexCharts() {
    if (last_request && last_request.readyState !== 4) {
        last_request.abort();
    }
    last_request = $.ajax( {
        url: "/get-demographics-data/",
        data: {
            category: category_dropdown.val(),
        },
        dataType: "json"
    }).done(function(data) {
        const age = data.data.age;
        const sex = data.data.sex;

        const colors = ['#1b4e7d', '#a81b1d', chart_colors[7]];
        const traces = [];

        traces.push({
            x: age,
            type: 'histogram',
            marker: {
                color: '#6d4a90'
            },
            hoverinfo: 'x+y'
        });

        traces.push({
            values: [sex['Male'], sex['Female'], sex['missing']],
            labels: ['Male', 'Female', 'Missing Data'],
            type: 'pie',
            domain: {
                x: [0.5, 1],
                y: [0, 0.95]
            },
            marker: {
                colors: colors,
            },
            textinfo: 'value',
            textfont: {
                size: 16
            },
            hoverinfo: 'label',
            hoverlabel: {
                font: {
                    size: 16
                }
            },
            outsidetextfont: {
                color: 'white'
            }
        });

        const layout = {
            grid: {rows: 1, columns: 2, pattern: 'independent'},
            showlegend: false,
            xaxis: {
                title: "Age (years)",
                titlefont: {
                    size: 16
                },
                ticks: "outside",
            },
            yaxis: {
                title: "Number of participants",
                titlefont: {
                    size: 16
                },
                ticks: "outside"
            },
            annotations: [
                {
                    xref: 'paper',
                    yref: 'paper',
                    x: 0.25,
                    xanchor: 'center',
                    y: 1,
                    yanchor: 'bottom',
                    text: 'Age',
                    showarrow: false,
                    font: {
                        size: 20
                    }
                },
                {
                    xref: 'paper',
                    yref: 'paper',
                    x: 0.75,
                    xanchor: 'center',
                    y: 1,
                    yanchor: 'bottom',
                    text: 'Sex',
                    showarrow: false,
                    font: {
                        size: 20
                    }
                }
            ]
        };

        Plotly.newPlot("chart1", traces, layout, {displayModeBar: false, responsive: true});
        $("#loading").css("display", "none");
    });
}
