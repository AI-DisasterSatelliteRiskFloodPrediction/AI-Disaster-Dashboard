/*
 * Flood Intelligence + Action Recommendation Engine
 * Version 2.2 — transparent, rule-based prototype.
 * No live data, trained AI model, probability, or public alert is produced.
 */
(() => {
  "use strict";
  const form = document.getElementById("flood-assessment-form");
  if (!form) return;

  const result = document.getElementById("assessment-result");
  const citizenList = document.getElementById("citizen-actions");
  const authorityList = document.getElementById("authority-actions");

  const citizenGuidance = {
    baseline: [
      "Monitor official weather and emergency-management updates for your area.",
      "Never walk, swim, or drive through floodwater; move away from rising water and drains.",
      "Keep essential medicines, drinking water, identification, and a charged phone ready.",
      "If authorities instruct evacuation, follow their directions and use only routes they confirm as safe."
    ],
    urgent: [
      "Move away from floodwater, riverbanks, drainage channels, and low-lying areas; do not approach to take photos.",
      "If water is entering your home or authorities advise evacuation, move to safer ground early and follow official instructions.",
      "Keep children and people needing assistance away from water and electrical hazards.",
      "Do not re-enter flooded or damaged buildings until authorities say it is safe."
    ]
  };
  const authorityGuidance = {
    baseline: [
      "Verify each observation with a timestamp, location, named source, and a second source where possible.",
      "Check rainfall, river or drainage conditions, field reports, and satellite observations as separate evidence streams.",
      "Map potentially exposed people and critical facilities using authoritative local datasets.",
      "Do not publish risk probabilities, evacuation routes, shelter status, or public alerts from this prototype."
    ],
    urgent: [
      "Escalate the report to the responsible disaster-management and local emergency teams for immediate verification.",
      "Seek rapid field confirmation of water extent, flow, affected roads, settlements, and critical facilities.",
      "Use authorized channels for protective messaging; include the affected area, issue time, source, and next update time.",
      "Confirm shelters, safe access routes, and evacuation instructions with competent authorities before publication.",
      "Maintain an auditable log of evidence, uncertainty, reviewer, decisions, and subsequent updates."
    ]
  };

  function fillList(element, items) {
    element.replaceChildren();
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      element.appendChild(li);
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const rainfall = document.getElementById("rainfall-condition").value;
    const water = document.getElementById("water-trend").value;
    const observed = document.getElementById("flood-observed").value;
    const exposure = document.getElementById("exposure-known").value;
    const location = document.getElementById("assessment-location").value.trim();
    const source = document.getElementById("observation-source").value.trim();

    const directFloodEvidence = observed === "yes" || water === "overflow";
    const combinedSignals = rainfall === "heavy" && water === "rising";
    const incomplete = [rainfall, water, observed, exposure].some(v => v === "unknown");
    let label = "INSUFFICIENT INFORMATION";
    let statusClass = "";
    let explanation = "The entered information is incomplete or does not establish a flood condition. This is not a low-risk finding.";
    let actions = citizenGuidance.baseline;
    let authorityActions = authorityGuidance.baseline;

    if (directFloodEvidence) {
      label = "URGENT VERIFICATION REQUIRED";
      statusClass = "urgent";
      explanation = "Flooding or overflow has been reported in the entered observations. Treat this as a report requiring prompt verification by responsible local authorities; this tool does not confirm the incident.";
      actions = citizenGuidance.urgent;
      authorityActions = authorityGuidance.urgent;
    } else if (combinedSignals || (water === "rising" && exposure === "yes")) {
      label = "ELEVATED INDICATORS — VERIFY";
      statusClass = "attention";
      explanation = "The entered observations include a combination of concerning indicators. Seek timely field verification and consult official information; no probability or formal risk level is calculated.";
      actions = citizenGuidance.urgent;
      authorityActions = authorityGuidance.urgent;
    } else if (!incomplete && rainfall === "normal" && water === "stable" && observed === "no") {
      label = "NO FLOOD INDICATORS REPORTED IN THIS ENTRY";
      explanation = "The entered observations do not report flood indicators. This is not proof of safety and must not be interpreted as a low-risk classification.";
    }

    const heading = document.createElement("h3");
    heading.textContent = "Assessment summary";
    const badge = document.createElement("span");
    badge.className = "result-status " + statusClass;
    badge.textContent = label;
    const summary = document.createElement("p");
    summary.textContent = explanation;
    const meta = document.createElement("p");
    meta.className = "result-placeholder";
    const details = [location ? "Area: " + location : "Area: not specified", source ? "Source: " + source : "Source: not specified", "Generated: " + new Date().toLocaleString()];
    meta.textContent = details.join(" · ");
    const evidence = document.createElement("p");
    evidence.className = "result-placeholder";
    const selectedText = (id) => {
      const control = document.getElementById(id);
      return control && control.selectedIndex >= 0
        ? control.options[control.selectedIndex].textContent.trim()
        : "Not recorded";
    };
    evidence.textContent = [
      "Entered observations: Rainfall — " + selectedText("rainfall-condition"),
      "Water trend — " + selectedText("water-trend"),
      "Ground flooding — " + selectedText("flood-observed"),
      "Potential exposure — " + selectedText("exposure-known")
    ].join(" · ");
    const limitation = document.createElement("p");
    limitation.className = "engine-footnote";
    limitation.textContent = "Screening output only. Inputs are user-entered and have not been independently verified by this website. No live satellite feed, trained AI, calibrated thresholds, or automatic alert is connected.";
    result.replaceChildren(heading, badge, summary, meta, evidence, limitation);
    fillList(citizenList, actions);
    fillList(authorityList, authorityActions);
  });

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      result.replaceChildren();
      const heading = document.createElement("h3");
      heading.textContent = "Assessment summary";
      const placeholder = document.createElement("p");
      placeholder.className = "result-placeholder";
      placeholder.textContent = "No assessment has been run. Enter observations above to generate a screening summary.";
      result.append(heading, placeholder);
      fillList(citizenList, citizenGuidance.baseline);
      fillList(authorityList, authorityGuidance.baseline);
    }, 0);
  });
})();
