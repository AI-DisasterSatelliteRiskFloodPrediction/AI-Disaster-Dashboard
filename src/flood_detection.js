/*
AI Disaster Risk Dashboard
Leaflet Interactive Flood Risk Map

Version: 1.0
*/


// ===============================
// Create Rwanda Map
// ===============================


const disasterMap = L.map('map').setView(

    [-1.9403, 29.8739],

    8

);




// ===============================
// Add OpenStreetMap Layer
// ===============================


L.tileLayer(

    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',

    {

        attribution:
        '© OpenStreetMap contributors'

    }

).addTo(disasterMap);




// ===============================
// Risk Layer Groups
// ===============================


const highRisk =
L.layerGroup();


const mediumRisk =
L.layerGroup();


const lowRisk =
L.layerGroup();





// ===============================
// High Risk Areas
// ===============================


L.marker([-1.5000, 29.7000])

.bindPopup(

    `
    <b>🔴 HIGH FLOOD RISK</b>
    <br>
    Northern Province
    <br>
    Probability: 78%
    `

)

.addTo(highRisk);





// ===============================
// Medium Risk Areas
// ===============================


L.marker([-2.0000, 30.5000])

.bindPopup(

    `
    <b>🟠 MEDIUM FLOOD RISK</b>
    <br>
    Eastern Province
    <br>
    Monitoring Required
    `

)

.addTo(mediumRisk);





// ===============================
// Low Risk Areas
// ===============================


L.marker([-1.8000, 29.2000])

.bindPopup(

    `
    <b>🟢 LOW RISK</b>
    <br>
    Stable Area
    <br>
    Normal Conditions
    `

)

.addTo(lowRisk);






// ===============================
// Display Layers
// ===============================


highRisk.addTo(disasterMap);


mediumRisk.addTo(disasterMap);


lowRisk.addTo(disasterMap);






// ===============================
// Layer Control
// ===============================


L.control.layers(

    null,

    {

        "🔴 High Risk Zones":
        highRisk,


        "🟠 Medium Risk Zones":
        mediumRisk,


        "🟢 Low Risk Zones":
        lowRisk

    }

)

.addTo(disasterMap);






// ===============================
// Future Integration
// ===============================
//
// - Rwanda District GeoJSON
// - Sentinel-1 Flood Mapping
// - Sentinel-2 Image Analysis
// - Google Earth Engine Output
// - AI Prediction API
//



console.log(

"AI Disaster Risk Map Loaded Successfully"

);
