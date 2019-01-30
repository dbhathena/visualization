var common_unit;
const unitsDaily = {
    "Accelerometer": (common_unit = "Vector Magnitude of Motion"),
    "Heart Rate": (common_unit = "BPM"),
    "Motion": (common_unit = "Fraction of Day in Motion"),
    "Temperature": (common_unit = "°Celsius"),
    "EDA Mean Difference": (common_unit = "Microsiemens (µS)"),
    "EDA Mean": common_unit,
    "Skin Conductance Response": (common_unit = "Number of SCRs"),
    "Incoming Call Count": (common_unit = "Number of Calls"),
    "Outgoing Call Count": common_unit,
    "Incoming Call Mean Duration": (common_unit = "Seconds"),
    "Incoming Call Median Duration": common_unit,
    "Incoming Call Std Duration": common_unit,
    "Incoming Call Sum Duration": common_unit,
    "Outgoing Call Mean Duration": common_unit,
    "Outgoing Call Median Duration": common_unit,
    "Outgoing Call Std Duration": common_unit,
    "Outgoing Call Sum Duration": common_unit,
    "Screen On Mean Duration": common_unit,
    "Screen On Median Duration": common_unit,
    "Screen On Std Duration": common_unit,
    "Screen On Sum Duration": common_unit,
    "Insolation Seconds": common_unit,
    "Screen On Count": (common_unit = "Number of Times On"),
    "Incoming SMS Mean Length": (common_unit = "Characters"),
    "Incoming SMS Median Length": common_unit,
    "Incoming SMS Std Length": common_unit,
    "Incoming SMS Sum Length": common_unit,
    "Outgoing SMS Mean Length": common_unit,
    "Outgoing SMS Median Length": common_unit,
    "Outgoing SMS Std Length": common_unit,
    "Outgoing SMS Sum Length": common_unit,
    "Incoming SMS Count": (common_unit = "Number of Messages"),
    "Outgoing SMS Count": common_unit,
    "Latitude Std": (common_unit = "Degrees"),
    "Latitude Stationary Std": common_unit,
    "Longitude Std": common_unit,
    "Longitude Stationary Std": common_unit,
    "Average Location Std": common_unit,
    "Average Stationary Std": common_unit,
    "Home Stay": (common_unit = "Percentage of Day"),
    "Transition Time": common_unit,
    "Total Distance": (common_unit = "Meters"),
    "Precipitation Intensity": (common_unit = "Inches per Hour"),
    "Apparent Temperature High": (common_unit = "°Fahrenheit"),
};

const unitsHourly = {
    "Accelerometer": (common_unit = "Vector Magnitude of Motion"),
    "Heart Rate": (common_unit = "BPM"),
    "Motion": (common_unit = "Fraction of Hour in Motion"),
    "Temperature": (common_unit = "°Celsius"),
    "EDA Mean Difference": (common_unit = "Microsiemens (µS)"),
    "EDA Mean": common_unit,
    "Skin Conductance Response": (common_unit = "Number of SCRs"),
    "Incoming Call Count": (common_unit = "Number of Calls"),
    "Outgoing Call Count": common_unit,
    "Incoming Call Mean Duration": (common_unit = "Seconds"),
    "Incoming Call Median Duration": common_unit,
    "Incoming Call Std Duration": common_unit,
    "Incoming Call Sum Duration": common_unit,
    "Outgoing Call Mean Duration": common_unit,
    "Outgoing Call Median Duration": common_unit,
    "Outgoing Call Std Duration": common_unit,
    "Outgoing Call Sum Duration": common_unit,
    "Screen On Mean Duration": common_unit,
    "Screen On Median Duration": common_unit,
    "Screen On Std Duration": common_unit,
    "Screen On Sum Duration": common_unit,
    "Screen On Count": (common_unit = "Number of Times On"),
    "Incoming SMS Mean Length": (common_unit = "Characters"),
    "Incoming SMS Median Length": common_unit,
    "Incoming SMS Std Length": common_unit,
    "Incoming SMS Sum Length": common_unit,
    "Outgoing SMS Mean Length": common_unit,
    "Outgoing SMS Median Length": common_unit,
    "Outgoing SMS Std Length": common_unit,
    "Outgoing SMS Sum Length": common_unit,
    "Incoming SMS Count": (common_unit = "Number of Messages"),
    "Outgoing SMS Count": common_unit,
    "Latitude Std": (common_unit = "Degrees"),
    "Latitude Stationary Std": common_unit,
    "Longitude Std": common_unit,
    "Longitude Stationary Std": common_unit,
    "Average Location Std": common_unit,
    "Average Stationary Std": common_unit,
    "Home Stay": (common_unit = "Percentage of Day"),
    "Transition Time": common_unit,
    "Total Distance": (common_unit = "Meters"),
};

const titleForTypeDaily = {
    "Accelerometer": "Acceleration",
    "Heart Rate": "Heart Rate",
    "Motion": "Motion",
    "Temperature": "Temperature",
    "EDA Mean Difference": "EDA: Mean Difference",
    "EDA Mean": "EDA: Mean",
    "Skin Conductance Response": "Skin Conductance Responses per Day in Study",
    "Incoming Call Count": "Number of Incoming Calls",
    "Incoming Call Mean Duration": "Mean Duration of Incoming Calls",
    "Incoming Call Median Duration": "Median Duration of Incoming Calls",
    "Incoming Call Std Duration": "Std Dev of Duration of Incoming Calls",
    "Incoming Call Sum Duration": "Sum of Duration of Incoming Calls",
    "Outgoing Call Count": "Number of Outgoing Calls",
    "Outgoing Call Mean Duration": "Mean Duration of Outgoing Calls",
    "Outgoing Call Median Duration": "Median Duration of Outgoing Calls",
    "Outgoing Call Std Duration": "Std Dev of Duration of Outgoing Calls",
    "Outgoing Call Sum Duration": "Sum of Duration of Outgoing Calls",
    "Screen On Count": "Number of Times Screen Turned On",
    "Screen On Mean Duration": "Mean Duration of Screen Time",
    "Screen On Median Duration": "Median Duration of Screen Time",
    "Screen On Std Duration": "Std Dev of Duration of Screen Time",
    "Screen On Sum Duration": "Sum of Duration of Screen Time",
    "Incoming SMS Count": "Number of Incoming SMSs",
    "Incoming SMS Mean Length": "Mean Length of Incoming SMSs",
    "Incoming SMS Median Length": "Median Length of Incoming SMSs",
    "Incoming SMS Std Length": "Std Dev of Length of Incoming SMSs",
    "Incoming SMS Sum Length": "Sum of Length of Incoming SMSs",
    "Outgoing SMS Count": "Number of Outgoing SMSs",
    "Outgoing SMS Mean Length": "Mean Length of Outgoing SMSs",
    "Outgoing SMS Median Length": "Median Length of Outgoing SMSs",
    "Outgoing SMS Std Length": "Std Dev of Length of Outgoing SMSs",
    "Outgoing SMS Sum Length": "Sum of Length of Outgoing SMSs",
    "Latitude Std": "Std Dev of Latitude",
    "Latitude Stationary Std": "Std Dev of Latitude while Stationary",
    "Longitude Std": "Std Dev of Longitude",
    "Longitude Stationary Std": "Std Dev of Longitude while Stationary",
    "Average Location Std": "Std Dev of Average Location",
    "Average Stationary Std": "Std Dev of Average Location while Stationary",
    "Home Stay": "Percentage of Time at Home",
    "Total Distance": "Total Distance Traveled",
    "Transition Time": "Time Spent in Transition",
    "Insolation Seconds": "Length of Day",
    "Precipitation Intensity": "Precipitation Intensity",
    "Apparent Temperature High": "Apparent Temperature High",
};

const titleForTypeHourly = {
    "Accelerometer": "Acceleration",
    "Heart Rate": "Heart Rate",
    "Motion": "Motion",
    "Temperature": "Temperature",
    "EDA Mean Difference": "EDA: Mean Difference",
    "EDA Mean": "EDA: Mean",
    "Skin Conductance Response": "Skin Conductance Responses per Hour of Day",
    "Incoming Call Count": "Number of Incoming Calls",
    "Incoming Call Mean Duration": "Mean Duration of Incoming Calls",
    "Incoming Call Median Duration": "Median Duration of Incoming Calls",
    "Incoming Call Std Duration": "Std Dev of Duration of Incoming Calls",
    "Incoming Call Sum Duration": "Sum of Duration of Incoming Calls",
    "Outgoing Call Count": "Number of Outgoing Calls",
    "Outgoing Call Mean Duration": "Mean Duration of Outgoing Calls",
    "Outgoing Call Median Duration": "Median Duration of Outgoing Calls",
    "Outgoing Call Std Duration": "Std Dev of Duration of Outgoing Calls",
    "Outgoing Call Sum Duration": "Sum of Duration of Outgoing Calls",
    "Screen On Count": "Number of Times Screen Turned On",
    "Screen On Mean Duration": "Mean Duration of Screen Time",
    "Screen On Median Duration": "Median Duration of Screen Time",
    "Screen On Std Duration": "Std Dev of Duration of Screen Time",
    "Screen On Sum Duration": "Sum of Duration of Screen Time",
    "Incoming SMS Count": "Number of Incoming SMSs",
    "Incoming SMS Mean Length": "Mean Length of Incoming SMSs",
    "Incoming SMS Median Length": "Median Length of Incoming SMSs",
    "Incoming SMS Std Length": "Std Dev of Length of Incoming SMSs",
    "Incoming SMS Sum Length": "Sum of Length of Incoming SMSs",
    "Outgoing SMS Count": "Number of Outgoing SMSs",
    "Outgoing SMS Mean Length": "Mean Length of Outgoing SMSs",
    "Outgoing SMS Median Length": "Median Length of Outgoing SMSs",
    "Outgoing SMS Std Length": "Std Dev of Length of Outgoing SMSs",
    "Outgoing SMS Sum Length": "Sum of Length of Outgoing SMSs",
    "Latitude Std": "Std Dev of Latitude",
    "Latitude Stationary Std": "Std Dev of Latitude while Stationary",
    "Longitude Std": "Std Dev of Longitude",
    "Longitude Stationary Std": "Std Dev of Longitude while Stationary",
    "Average Location Std": "Std Dev of Average Location",
    "Average Stationary Std": "Std Dev of Average Location while Stationary",
    "Home Stay": "Percentage of Time at Home",
    "Total Distance": "Total Distance Traveled",
    "Transition Time": "Time Spent in Transition",
};

const isTwoHands = new Set(["Temperature", "EDA Mean", "Skin Conductance Response"]);

const dataCategoryText = {
    "Activity": "Activity data collected from mobile phones and E4 measurements",
    "Phone_Usage": "Phone Usage data collected from Movisens Android application",
    "Physiology": "Physiology data collected from E4 measurements",
    "Location": "Location data collected from phone GPS measurements",
    "Weather": "Weather data collected from Dark Sky API database",
};

const dataTypeTextDaily = {
    "Accelerometer": "The daily average of the magnitude of motion vectors combining 3-axis accelerometer measurements",
    "Heart Rate": "The daily average heart rate, measured in beats per minute",
    "Motion": "The decimal percentage of the day when the individual was in motion (estimated using actigraphy)",
    "Temperature": "The daily average skin temperature measured from each hand",
    "EDA Mean Difference": "The daily average of the difference between right and left hand Skin Conductance Level signals (Right - Left)",
    "EDA Mean": "The daily average amplitude of Skin Conductance Response measured from each hand",
    "Skin Conductance Response": "The number of Skin Conductance Responses (peaks) accumulated over the course of a day measured from each hand",
    "Incoming Call Count": "The number of incoming phone calls accumulated over the course of a day",
    "Incoming Call Mean Duration": "The average duration of all incoming phone calls over the course of a day",
    "Incoming Call Median Duration": "The median duration of all incoming phone calls over the course of a day",
    "Incoming Call Std Duration": "The standard deviation of the duration of all incoming phone calls over the course of a day",
    "Incoming Call Sum Duration": "The sum of the durations of all incoming phone calls over the course of a day",
    "Outgoing Call Count": "The number of outgoing phone calls accumulated over the course of a day",
    "Outgoing Call Mean Duration": "The average duration of all outgoing phone calls over the course of a day",
    "Outgoing Call Median Duration": "The median duration of all outgoing phone calls over the course of a day",
    "Outgoing Call Std Duration": "The standard deviation of the duration of all outgoing phone calls over the course of a day",
    "Outgoing Call Sum Duration": "The sum of the durations of all outgoing phone calls over the course of a day",
    "Screen On Count": "The number of times an individual's phone display was turned on over the course of a day",
    "Screen On Mean Duration": "Average duration for which an individual's phone display was on over the course of a day",
    "Screen On Median Duration": "Median duration for which an individual's phone display was on over the course of a day",
    "Screen On Std Duration": "Standard deviation of duration for which an individual's phone display was on over the course of a day",
    "Screen On Sum Duration": "Total amount of time an individual's phone display was on over the course of a day",
    "Incoming SMS Count": "The number of incoming SMS messages accumulated over the course of a day",
    "Incoming SMS Mean Length": "The average length of all incoming SMS messages over the course of a day",
    "Incoming SMS Median Length": "The median length of all incoming SMS messages over the course of a day",
    "Incoming SMS Std Length": "The standard deviation of the length of all incoming SMS messages over the course of a day",
    "Incoming SMS Sum Length": "The sum of the lengths of all incoming SMS messages over the course of a day",
    "Outgoing SMS Count": "The number of outgoing SMS messages accumulated over the course of a day",
    "Outgoing SMS Mean Length": "The average length of all outgoing SMS messages over the course of a day",
    "Outgoing SMS Median Length": "The median length of all outgoing SMS messages over the course of a day",
    "Outgoing SMS Std Length": "The standard deviation of the length of all outgoing SMS messages over the course of a day",
    "Outgoing SMS Sum Length": "The sum of the lengths of all incoming SMS messages over the course of a day",
    "Latitude Std": "The standard deviation of an individual's latitude over the course of a day",
    "Latitude Stationary Std": "The standard deviation of an individual's latitude while stationary over the course of a day (stationary is defined as a moving speed of less than 0.3 m/s)",
    "Longitude Std": "The standard deviation of an individual's longitude over the course of a day",
    "Longitude Stationary Std": "The standard deviation of an individual's longitude while stationary over the course of a day (stationary is defined as a moving speed of less than 0.3 m/s)",
    "Average Location Std": "The average of the standard deviation of an individual's latitude and longitude over the course of a day",
    "Average Stationary Std": "The average of the standard deviation of an individual's latitude and longitude while stationary over the course of a day (stationary is defined as a moving speed of less than 0.3 m/s)",
    "Home Stay": "The percentage of time spent at home throughout the day (home location is estimated based on median of stationary locations)",
    "Total Distance": "The sum total distance traveled throughout the day",
    "Transition Time": "The percentage of time spent in transition throughout the day",
    "Insolation Seconds": "The total elapsed time between sunrise and sunset for a given day",
    "Precipitation Intensity": "The average intensity of precipitation over the course of a day",
    "Apparent Temperature High": "The daytime high apparent temperature",
};

const dataTypeTextHourly = {
    "Accelerometer": "The hourly average of the magnitude of motion vectors combining 3-axis accelerometer measurements",
    "Heart Rate": "The hourly average heart rate, measured in beats per minute",
    "Motion": "The decimal percentage of the hour when the individual was in motion (estimated using actigraphy)",
    "Temperature": "The hourly average skin temperature measured from each hand",
    "EDA Mean Difference": "The hourly average of the difference between right and left hand Skin Conductance Level signals (Right - Left)",
    "EDA Mean": "The hourly average amplitude of Skin Conductance Response measured from each hand",
    "Skin Conductance Response": "The number of Skin Conductance Responses (peaks) accumulated over the course of an hour measured from each hand",
    "Incoming Call Count": "The number of incoming phone calls accumulated over the course of an hour",
    "Incoming Call Mean Duration": "The average duration of all incoming phone calls over the course of an hour",
    "Incoming Call Median Duration": "The median duration of all incoming phone calls over the course of an hour",
    "Incoming Call Std Duration": "The standard deviation of the duration of all incoming phone calls over the course of an hour",
    "Incoming Call Sum Duration": "The sum of the durations of all incoming phone calls over the course of an hour",
    "Outgoing Call Count": "The number of outgoing phone calls accumulated over the course of an hour",
    "Outgoing Call Mean Duration": "The average duration of all outgoing phone calls over the course of an hour",
    "Outgoing Call Median Duration": "The median duration of all outgoing phone calls over the course of an hour",
    "Outgoing Call Std Duration": "The standard deviation of the duration of all outgoing phone calls over the course of an hour",
    "Outgoing Call Sum Duration": "The sum of the durations of all outgoing phone calls over the course of an hour",
    "Screen On Count": "The number of times an individual's phone display was turned on over the course of an hour",
    "Screen On Mean Duration": "Average duration for which an individual's phone display was on over the course of an hour",
    "Screen On Median Duration": "Median duration for which an individual's phone display was on over the course of an hour",
    "Screen On Std Duration": "Standard deviation of duration for which an individual's phone display was on over the course of an hour",
    "Screen On Sum Duration": "Total amount of time an individual's phone display was on over the course of an hour",
    "Incoming SMS Count": "The number of incoming SMS messages accumulated over the course of an hour",
    "Incoming SMS Mean Length": "The average length of all incoming SMS messages over the course of an hour",
    "Incoming SMS Median Length": "The median length of all incoming SMS messages over the course of an hour",
    "Incoming SMS Std Length": "The standard deviation of the length of all incoming SMS messages over the course of an hour",
    "Incoming SMS Sum Length": "The sum of the lengths of all incoming SMS messages over the course of an hour",
    "Outgoing SMS Count": "The number of outgoing SMS messages accumulated over the course of an hour",
    "Outgoing SMS Mean Length": "The average length of all outgoing SMS messages over the course of an hour",
    "Outgoing SMS Median Length": "The median length of all outgoing SMS messages over the course of an hour",
    "Outgoing SMS Std Length": "The standard deviation of the length of all outgoing SMS messages over the course of an hour",
    "Outgoing SMS Sum Length": "The sum of the lengths of all incoming SMS messages over the course of an hour",
    "Latitude Std": "The standard deviation of an individual's latitude over the course of an hour",
    "Latitude Stationary Std": "The standard deviation of an individual's latitude while stationary over the course of an hour (stationary is defined as a moving speed of less than 0.3 m/s)",
    "Longitude Std": "The standard deviation of an individual's longitude over the course of an hour",
    "Longitude Stationary Std": "The standard deviation of an individual's longitude while stationary over the course of an hour (stationary is defined as a moving speed of less than 0.3 m/s)",
    "Average Location Std": "The average of the standard deviation of an individual's latitude and longitude over the course of an hour",
    "Average Stationary Std": "The average of the standard deviation of an individual's latitude and longitude while stationary over the course of an hour (stationary is defined as a moving speed of less than 0.3 m/s)",
    "Home Stay": "The percentage of time spent at home throughout an hour (home location is estimated based on median of stationary locations)",
    "Total Distance": "The sum total distance traveled throughout an hour",
    "Transition Time": "The percentage of time spent in transition throughout an hour",
};

const preprocessTextDefault = "There is no additional preprocessing for this data type";

const preprocessTextDaily = {
    "Accelerometer": "To calculate the instantaneous motion vector, the 3-axis raw acceleration was first rescaled to the " +
                    "range [-2g; 2g]. Then, each second (32 samples) the acceleration data is summarized using the following " +
                    "method: sum+= max3(abs(buffX[i] - prevX), abs(buffY[i] - prevY), abs(buffZ[i] - prevZ)). " +
                    "The output is then filtered: avg=avg*0.9+(sum/32)*0.1. Finally the mean over 1 day is calculated.",
    "Motion": "To estimate the time when a person is in motion, the value of the motion vector magnitude is compared" +
            " to a predefined threshold. To calculate the instantaneous motion vector, the 3-axis raw acceleration was" +
            " first rescaled to the range [-2g; 2g]. Then, each second (32 samples) the acceleration data is " +
            "summarized using the following method: " +
            "sum+= max3(abs(buffX[i] - prevX), abs(buffY[i] - prevY), abs(buffZ[i] - prevZ)). " +
            "The output is then filtered: avg=avg*0.9+(sum/32)*0.1. Finally, the instances when the obtained value is" +
            " greater than 0.05 (motion threshold), are counted and divided by the number of accelerometer samples in" +
            " a day to estimate the fraction time when a participant was in motion.",
    "EDA Mean": "The EDA signal is first selected when the measured skin temperature > 30 degree Celsius (sensor is " +
            "worn on the wrist). Then the EDA signal when the participant is in motion (based on the accelerometer" +
            " data) is filtered out. Next, the low-pass Butterworth filter (1Hz cutoff) is applied. Finally the " +
            "average of the EDA signal is calculated over 1 day.",
    "Skin Conductance Response": "The EDA signal is first selected when the measured skin temperature > 30 degree Celsius (sensor is " +
            "worn on the wrist). Then the EDA signal when the participant is in motion (based on the accelerometer " +
            "data) is filtered out. Next, the low-pass Butterworth filter (1Hz cutoff) is applied. Finally the " +
            "average number of EDA peaks (SCRs) is calculated over 1 day.",
    "EDA Mean Difference": "The EDA signal is first selected when the measured skin temperature > 30 degree Celsius (sensor is " +
            "worn on the wrist). Then the EDA signal when the participant is in motion (based on the accelerometer " +
            "data) is filtered out. Next, the low-pass Butterworth filter (1Hz cutoff) is applied. Finally the " +
            "difference between the averages of the EDA signals from the right and left wrists (right minus left) is" +
            " calculated over 1 day.",
    "Heart Rate": "Heart rate is computed by detecting peaks (beats) from the PPG and computing the lengths of the" +
            " intervals between adjacent beats.  The inter-beat-interval (IBI) timing is used to estimate the" +
            " instantaneous heart rate. The average of the instantaneous HR is calculated over 1 day."
};

const preprocessTextHourly = {
    "Accelerometer": "To calculate the instantaneous motion vector, the 3-axis raw acceleration was first rescaled to the " +
            "range [-2g; 2g]. Then, each second (32 samples) the acceleration data is summarized using the following " +
            "method: sum+= max3(abs(buffX[i] - prevX), abs(buffY[i] - prevY), abs(buffZ[i] - prevZ)). " +
            "The output is then filtered: avg=avg*0.9+(sum/32)*0.1. Finally the mean over 1 hour is calculated.",
    "Motion": "To estimate the time when a person is in motion, the value of the motion vector magnitude is compared" +
            " to a predefined threshold. To calculate the instantaneous motion vector, the 3-axis raw acceleration was" +
            " first rescaled to the range [-2g; 2g]. Then, each second (32 samples) the acceleration data is " +
            "summarized using the following method: " +
            "sum+= max3(abs(buffX[i] - prevX), abs(buffY[i] - prevY), abs(buffZ[i] - prevZ)). " +
            "The output is then filtered: avg=avg*0.9+(sum/32)*0.1. Finally, the instances when the obtained value is" +
            " greater than 0.05 (motion threshold), are counted and divided by the number of accelerometer samples in" +
            " a day to estimate the fraction time when a participant was in motion.",
    "EDA Mean": "The EDA signal is first selected when the measured skin temperature > 30 degree Celsius (sensor is " +
            "worn on the wrist). Then the EDA signal when the participant is in motion (based on the accelerometer" +
            " data) is filtered out. Next, the low-pass Butterworth filter (1Hz cutoff) is applied. Finally the " +
            "average of the EDA signal is calculated over 1 hour.",
    "Skin Conductance Response": "The EDA signal is first selected when the measured skin temperature > 30 degree Celsius (sensor is " +
            "worn on the wrist). Then the EDA signal when the participant is in motion (based on the accelerometer " +
            "data) is filtered out. Next, the low-pass Butterworth filter (1Hz cutoff) is applied. Finally the " +
            "average number of EDA peaks (SCRs) is calculated over 1 hour.",
    "EDA Mean Difference": "The EDA signal is first selected when the measured skin temperature > 30 degree Celsius (sensor is " +
            "worn on the wrist). Then the EDA signal when the participant is in motion (based on the accelerometer " +
            "data) is filtered out. Next, the low-pass Butterworth filter (1Hz cutoff) is applied. Finally the " +
            "difference between the averages of the EDA signals from the right and left wrists (right minus left) is" +
            " calculated over 1 hour.",
    "Heart Rate": "Heart rate is computed by detecting peaks (beats) from the PPG and computing the lengths of the" +
            " intervals between adjacent beats.  The inter-beat-interval (IBI) timing is used to estimate the" +
            " instantaneous heart rate. The average of the instantaneous HR is calculated over 1 hour."
};

const groupText = {
    "All": "All participants in the study",
    "Depression": "Group and aggregate over participants by their depression status: Major Depressive Disorder or Healthy Control",
    "Gender": "Group and aggregate over participants by their preferred gender",
    "Marital": "Group and aggregate over participants by their marital status",
    "Employment": "Group and aggregate over participants by their employment status",
    "Age": "Group and aggregate over participants by their age in years",
    "Psychotherapy": "Group and aggregate over participants based on whether they are currently undergoing psychotherapy or not",
    "Episode Length": "Group and aggregate over participants based on their current episode length in months",
    "Episode Type": "Group and aggregate over participants based on their current episode type",
    "Phobia": "Group and aggregate over participants based on whether they have social phobia or not",
    "Anxiety": "Group and aggregate over participants based on whether they have General Anxiety Disorder or not",
    "Current Medication": "Group and aggregate over participants based on whether they are currently taking medication or not",
    "None": "Show an individual's data",
};

const aggregationTextDaily = {
    "Mean":"Calculate the arithmetic mean over the participants in each group for every day - if a participant has no data point for a particular day, he/she is not included in calculating the mean",
    "Median": "Find the median measurement over the participants in each group for every day - if a participant has no data point for a particular day, he/she is not included in finding the median",
    "Max": "Find the maximum measurement over the participants in each group for every day - if a participant has no data point for a particular day, he/she is not included in finding the max",
    "Min": "Find the minimum measurement over the participants in each group for every day - if a participant has no data point for a particular day, he/she is not included in finding the min",
    "Std Dev": "Calculate the standard deviation over the participants in each group for every day - if a participant has no data point for a particular day, he/she is not included in calculating the standard deviation",
};

const aggregationTextHourly = {
    "Mean": "Calculate the arithmetic mean over the participants in each group for every hour - missing data points for any particular hour are not included in calculating the mean",
    "Median": "Find the median measurement over the participants in each group for every hour -  missing data points for any particular hour are not included in finding the median",
    "Max": "Find the maximum measurement over the participants in each group for every hour - missing data points for any particular hour are not included in finding the max",
    "Min": "Find the minimum measurement over the participants in each group for every hour - missing data points for any particular hour are not included in finding the min",
    "Std Dev": "Calculate the standard deviation over the participants in each group for every hour - missing data points for any particular hour are not included in calculating the standard deviation",
};

function getIndividualText(individual) {
    ind_num = parseInt(individual.slice(1));
    return "Individual " + ind_num + " of the study";
}

function getScatterTitle(x_type, y_type) {
    return x_type + " vs " + y_type;
}

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


function constructWeekdays(start_day, number_of_days, suffix) {
    const startIndex = weekdays.indexOf(start_day);
    if (startIndex === -1) {
        throw new Error("Invalid start day!");
    }
    const days_to_return = [];
    for (var i = 0; i < number_of_days; i++) {
        if (suffix) {
            days_to_return.push(weekdays[(startIndex+i)%7] + " " + suffix);
        } else {
            days_to_return.push(weekdays[(startIndex+i)%7]);
        }
    }
    return days_to_return;
}


function constructWeekLabels(number_of_weeks) {
    const labels = [];
    for (var i=1; i <= number_of_weeks; i++) {
        labels.push("Week " + i);
    }
    return labels;
}


function constructWeekTickVals(number_of_weeks) {
    const tick_vals = [];
    var tick_index = 3;
    for (var i=0; i < number_of_weeks; i++) {
        tick_vals.push(tick_index);
        tick_index += 7;
    }
    return tick_vals;
}


function constructVerticalDividers(spacing, num_categories) {
    const shapes = [];
    for (var i=1; i < num_categories; i++) {
        shapes.push({
            type: 'line',
            yref: 'paper',
            x0: spacing*i,
            x1: spacing*i,
            y0: 0,
            y1: 1,
            line: {
                color: '#444',
                width: 1
            }
        });
    }
    return shapes;
}
