
/*
 * Flood Intelligence + Action Recommendation Engine
 * Version 2.3 — transparent, rule-based screening prototype.
 * No live data, trained AI model, probability, or public alert is produced.
 */
(() => {
  "use strict";

  const form = document.getElementById("flood-assessment-form");
  if (!form) return;

  const result = document.getElementById("assessment-result");
  const citizenList = document.getElementById("citizen-actions");
  const authorityList = document.getElementById("authority-actions");
  let latestReport = null;

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
    if (!element) return;
    element.replaceChildren();
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      element.appendChild(li);
    });
  }

  function selectedText(id) {
    const control = document.getElementById(id);
    return control && control.selectedIndex >= 0
      ? control.options[control.selectedIndex].textContent.trim()
      : "Not recorded";
  }

  function makeReportText(report) {
    return [
      "RWANDA DISASTER MONITORING DASHBOARD",
      "FLOOD OBSERVATION SCREENING REPORT",
      "Version: 2.3",
      "",
      "ASSESSMENT SUMMARY",
      "Result: " + report.result,
      "Explanation: " + report.explanation,
      "Area: " + report.area,
      "Observation source: " + report.source,
      "Generated: " + report.generated,
      "",
      "ENTERED OBSERVATIONS",
      "Rainfall: " + report.observations.rainfall,
      "Water trend: " + report.observations.waterTrend,
      "Ground flooding: " + report.observations.flooding,
      "Potential exposure: " + report.observations.exposure,
      "",
      "CITIZEN SAFETY GUIDANCE",
      ...report.citizenGuidance.map((item, index) => (index + 1) + ". " + item),
      "",
      "AUTHORITY VERIFICATION GUIDANCE",
      ...report.authorityGuidance.map((item, index) => (index + 1) + ". " + item),
      "",
      "IMPORTANT LIMITATIONS",
      report.limitation,
      "This report records user-entered observations. It is not an official warning, verified incident report, probability estimate, or formal risk classification."
    ].join("\n");
  }

  function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function safeFilename(value) {
    return (value || "assessment")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "assessment";
  }

  function addReportActions(report) {
    const toolbar = document.createElement("div");
    toolbar.className = "report-actions";
    toolbar.style.cssText = "display:flex;flex-wrap:wrap;gap:10px;margin-top:18px;";

    const actions = [
      {
        label: "Download Report (.txt)",
        run: () => downloadFile(
          "flood-assessment-" + safeFilename(report.area) + ".txt",
          makeReportText(report),
          "text/plain;charset=utf-8"
        )
      },
      {
        label: "Download Data (.json)",
        run: () => downloadFile(
          "flood-assessment-" + safeFilename(report.area) + ".json",
          JSON.stringify(report, null, 2),
          "application/json;charset=utf-8"
        )
      },
      {
        label: "Print / Save as PDF",
        run: () => {
          const printWindow = window.open("", "_blank");
          if (!printWindow) {
            window.alert("Please allow pop-ups for this site to print or save the report as PDF.");
            return;
          }
          const escaped = makeReportText(report)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
          printWindow.document.open();
          printWindow.document.write(
            "<!DOCTYPE html><html><head><title>Flood Assessment Report</title>" +
            "<meta charset='utf-8'><style>body{font:14px/1.6 Arial,sans-serif;max-width:850px;margin:35px auto;padding:0 20px;color:#172033}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}h1{font-size:21px}</style>" +
            "</head><body><h1>Flood Observation Screening Report</h1><pre>" + escaped + "</pre></body></html>"
          );
          printWindow.document.close();
          printWindow.focus();
          printWindow.setTimeout(() => printWindow.print(), 250);
        }
      }
    ];

    actions.forEach(({ label, run }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.style.cssText = "padding:11px 15px;border:0;border-radius:7px;background:#0b3d91;color:#fff;font-weight:600;cursor:pointer;";
      button.addEventListener("click", run);
      toolbar.appendChild(button);
    });

    result.appendChild(toolbar);
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

    const generated = new Date().toLocaleString();
    const limitation = "Screening output only. Inputs are user-entered and have not been independently verified by this website. No live satellite feed, trained AI, calibrated thresholds, or automatic alert is connected.";

    latestReport = {
      reportTitle: "Flood Observation Screening Report",
      version: "2.3",
      result: label,
      explanation,
      area: location || "Not specified",
      source: source || "Not specified",
      generated,
      observations: {
        rainfall: selectedText("rainfall-condition"),
        waterTrend: selectedText("water-trend"),
        flooding: selectedText("flood-observed"),
        exposure: selectedText("exposure-known")
      },
      citizenGuidance: [...actions],
      authorityGuidance: [...authorityActions],
      limitation
    };

    const heading = document.createElement("h3");
    heading.textContent = "Assessment summary";
    const badge = document.createElement("span");
    badge.className = "result-status " + statusClass;
    badge.textContent = label;
    const summary = document.createElement("p");
    summary.textContent = explanation;
    const meta = document.createElement("p");
    meta.className = "result-placeholder";
    meta.textContent = "Area: " + latestReport.area + " · Source: " + latestReport.source + " · Generated: " + generated;
    const evidence = document.createElement("p");
    evidence.className = "result-placeholder";
    evidence.textContent = [
      "Entered observations: Rainfall — " + latestReport.observations.rainfall,
      "Water trend — " + latestReport.observations.waterTrend,
      "Ground flooding — " + latestReport.observations.flooding,
      "Potential exposure — " + latestReport.observations.exposure
    ].join(" · ");
    const note = document.createElement("p");
    note.className = "engine-footnote";
    note.textContent = limitation;

    result.replaceChildren(heading, badge, summary, meta, evidence, note);
    fillList(citizenList, actions);
    fillList(authorityList, authorityActions);
    addReportActions(latestReport);
  });

  form.addEventListener("reset", () => {
    latestReport = null;
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
