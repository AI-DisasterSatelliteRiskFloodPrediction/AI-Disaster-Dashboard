/*
AI Disaster Risk Dashboard
Dashboard Dynamic Functions

Prototype Version 1
*/


// ===============================
// Update Dashboard Date
// ===============================

const currentDate = new Date();

const dateElement = document.getElementById("date");


if (dateElement) {

    dateElement.innerHTML =
    currentDate.toDateString();

}



// ===============================
// AI Disaster Prediction Data
// ===============================


const disasterPrediction = {


    location:
    "Northern Province, Rwanda",


    hazard:
    "Flood",


    probability:
    78,


    riskLevel:
    "HIGH",


    confidence:
    89,


    model:
    "Random Forest + Sentinel-2"


};




// ===============================
// Display AI Analysis in Console
// ===============================


console.log(
"AI Disaster Prediction Results",
disasterPrediction
);




// ===============================
// Future Data Integration Structure
// ===============================


const satelliteData = {


    source:
    "Sentinel-1 / Sentinel-2",


    platform:
    "Google Earth Engine",


    monitoring:
    "Active"


};



console.log(
"Satellite Monitoring:",
satelliteData
);




// ===============================
// Risk Classification Function
// ===============================


function classifyRisk(probability){


    if(probability >= 70){

        return "HIGH";

    }


    else if(probability >= 40){

        return "MEDIUM";

    }


    else {

        return "LOW";

    }


}




const currentRisk =
classifyRisk(
disasterPrediction.probability
);



console.log(
"Current Risk Level:",
currentRisk
);




// ===============================
// Future AI Alert System
// ===============================


function generateAlert(risk){


    if(risk === "HIGH"){


        return "⚠️ Flood risk detected. Activate early warning procedures.";

    }


    else if(risk === "MEDIUM"){


        return "Monitoring required. Increase preparedness.";

    }


    else {


        return "No immediate risk detected.";

    }


}



console.log(
generateAlert(currentRisk)
);




// ===============================
// Future Integration Points
// ===============================
//
// 1. Google Earth Engine API
// 2. Sentinel Satellite Processing
// 3. Machine Learning Prediction API
// 4. Real-time Weather Data
// 5. Disaster Alert Notification System
