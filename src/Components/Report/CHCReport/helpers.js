// ─── Pure helpers extracted from CHCReport ────────────────────────────────────
// These do not use React state directly; any state they need is passed in as
// an argument by the caller, so behavior is unchanged from the original inline
// versions.

// ─── Tiny concurrency limiter (no npm package needed) ─────────────────────────
export const pLimit = (concurrency) => {
  let active = 0;
  const queue = [];
  const next = () => {
    if (active >= concurrency || !queue.length) return;
    active++;
    const { fn, resolve, reject } = queue.shift();
    fn()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        active--;
        next();
      });
  };
  return (fn) =>
    new Promise((res, rej) => {
      queue.push({ fn, resolve: res, reject: rej });
      next();
    });
};

export const isPrintAndMailEnabled = (status) =>
  status === "Approved" ||
  status === "Partially Approved" ||
  status === "Dispatched";

export const getBadgeColor = (status) => {
  switch (status) {
    case "Approved":
      return "#69b444ff";
    case "Pending":
      return "#FFBB33";
    default:
      return "#0f999eff";
  }
};

// bc = barcode; investigationStatuses = the map keyed by barcode (component state)
export const hasPendingInvestigations = (investigationStatuses, bc) => {
  const data = investigationStatuses[bc];
  if (!data) return false;
  if (data.lab_approval?.toLowerCase() === "pending") return true;
  // Trust chc_investigation_status from API directly
  if (data.chc_investigation_status === "All Approved") return false;
  const chcTests = data.chc_tests || [];
  if (chcTests.length === 0) return false;
  return chcTests.some((t) => t.status?.toLowerCase() !== "approved");
};

export const getPendingInvestigations = (statusData) => {
  if (!statusData) return <span className="all-approved">All Approved</span>;
  const labPending = statusData.lab_approval?.toLowerCase() === "pending";
  const chcTests = statusData.chc_tests || [];

  // Trust chc_investigation_status from API as the primary source
  const chcAllDone = statusData.chc_investigation_status === "All Approved";

  if (!labPending && chcAllDone)
    return <span className="all-approved">All Approved</span>;

  if (chcTests.length === 0 && !labPending)
    return <span className="all-approved">No CHC Tests</span>;

  return (
    <>
      {labPending && (
        <div>
          Lab Tests<span className="pending-label">Pending</span>
        </div>
      )}
      {!chcAllDone &&
        chcTests.map((test, index) => {
          // Only show pending ones — trust status from API, not has_file/has_report
          if (test.status?.toLowerCase() === "approved") return null;
          return (
            <div key={index}>
              {test.testname}
              <span className="pending-label">Pending</span>
            </div>
          );
        })}
    </>
  );
};

// ─── mergeInvestigationData ───────────────────────────────────────────────────
export const mergeInvestigationData = (patientDetails, invStatus) => {
  if (!invStatus) return patientDetails;
  const merged = { ...patientDetails };

  const rawVitals = invStatus.vitals || {};
  if (Object.keys(rawVitals).length > 0) {
    const pick = (...keys) => {
      for (const k of keys) {
        const v = rawVitals[k];
        if (v && String(v).trim() && String(v).trim() !== "0") return v;
      }
      return null;
    };
    const normalisedVitals = {};
    const h = pick("height_cm", "height");
    if (h) normalisedVitals.height = h;
    const w = pick("weight_kg", "weight");
    if (w) normalisedVitals.weight = w;
    const bmi = pick("bmi");
    if (bmi) normalisedVitals.bmi = bmi;
    const bp = pick("blood_pressure");
    if (bp) normalisedVitals.blood_pressure = bp;
    const pulse = pick("pulse", "spo2");
    if (pulse) normalisedVitals.spo2 = pulse;
    if (Object.keys(normalisedVitals).length > 0)
      merged.vitals = { ...(merged.vitals || {}), ...normalisedVitals };
  }

  const history = invStatus.patient_history;
  if (history && history.trim())
    merged.medical_history = {
      ...(merged.medical_history || {}),
      patient_history: history,
    };

  const chcTests = invStatus.chc_tests || [];
  if (chcTests.length > 0) {
    const notesMap = {
      ECG: "ecg_notes",
      PFT: "pft_notes",
      Spirometry: "pft_notes",
      "Pulmonary Function Test": "pft_notes",
      "X-Ray Chest": "xray_notes",
      "Chest - XRay": "xray_notes",
      "X-Ray": "xray_notes",
      Audiometry: "audiometry_notes",
    };
    const reportMap = {
      "X-Ray Chest": "xray_report",
      "Chest - XRay": "xray_report",
      "X-Ray": "xray_report",
    };
    const existingNotes = { ...(merged.investigation_notes || {}) };
    chcTests.forEach((test) => {
      const name = test.testname || "";
      const notesKey = notesMap[name];
      if (notesKey && test.notes?.trim() && !existingNotes[notesKey])
        existingNotes[notesKey] = test.notes;
      const reportKey = reportMap[name];
      if (reportKey && test.report?.trim() && !existingNotes[reportKey])
        existingNotes[reportKey] = test.report;
      if (
        reportKey === "xray_report" &&
        test.report?.trim() &&
        !existingNotes["xray_notes"]
      ) {
        const firstSentence = test.report.split(/\.(?=\s|$)/)[0].trim();
        if (firstSentence)
          existingNotes["xray_notes"] = firstSentence.endsWith(".")
            ? firstSentence
            : firstSentence + ".";
      }
    });
    if (Object.keys(existingNotes).length > 0)
      merged.investigation_notes = existingNotes;
  }

  const ophthalTest = chcTests.find(
    (t) =>
      t.test_id === "CHCT001" ||
      (t.testname || "").toLowerCase().includes("eye") ||
      (t.testname || "").toLowerCase().includes("ophthal"),
  );
  if (ophthalTest?.report?.trim()) {
    try {
      const parsed = JSON.parse(ophthalTest.report);
      if (
        parsed &&
        (parsed.distance || parsed.nearVision || parsed.colourVision)
      ) {
        merged.chc_ophthalmology = {
          distance: parsed.distance || {},
          nearVision: parsed.nearVision || {},
          colourVision: parsed.colourVision || {},
          ocularmovement: parsed.ocularmovement || {},
          complaints: ophthalTest.notes?.trim() || parsed.complaints || "",
          remarks: parsed.remarks || "",
        };
      }
    } catch (e) {
      /* plain text — leave chc_ophthalmology unset */
    }
  }

  return merged;
};
