import React, { useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import axios from "axios";
import apiRequest from "../Auth/apiRequest";

// ---------------------------------------------------------------------
// NOTE ON ASSUMPTIONS (please adjust to match your actual project setup):
// 1. `apiRequest(url, method, body, isMultipart)` is assumed to exist at
//    ../utils/apiRequest and to treat the FULL 2xx range as success
//    (not just 200) — this mirrors the fix needed elsewhere in the app.
// 2. GET /logistics_by_collector/ is assumed to return an array of
//    collector objects. This component reads `collector.name` (falling
//    back to `collector.username`/`collector.assignedby` or the raw
//    string) — tweak `getCollectorLabel()` below if the real shape
//    differs.
// 3. `bustphoto` is captured via an "Upload Photo" or "Use Camera" button
//    (native <input type="file" capture="environment">), sent as
//    multipart/form-data, stored server-side in GridFS, and displayed
//    from GET /bus_fare_photo/?file_id=<file_id> — make sure that URL is
//    wired up in urls.py (defined in logistic.py per your routing).
// 4. All endpoints are prefixed with Labbaseurl, read from
//    process.env.REACT_APP_BACKEND_LAB_BASE_URL — make sure that env
//    var is set (e.g. in .env / .env.local) and does NOT end in a
//    trailing slash, since it's concatenated directly onto "/bus_fare/".
//
// RESPONSIVENESS NOTES (added):
// - Breakpoints: >=1024px desktop, 768-1023px tablet, <768px phone,
//   <420px small phone (fine-tuned paddings/font-sizes only).
// - The results table becomes a stacked "card" list below 768px using
//   the `data-label` attribute on each <td> + CSS ::before, so no columns
//   get clipped or require horizontal scrolling on a phone.
// - The Add-Bus-Fare modal becomes a full-height bottom sheet on phones
//   instead of a centered fixed-width box.
// ---------------------------------------------------------------------

const TEAL_DARK = "#7c5cc4";
const TEAL = "#9f7ae6";

const Wrapper = styled.div`
  padding: 24px;
  font-family: "Segoe UI", Arial, sans-serif;

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 420px) {
    padding: 12px;
  }
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
`;

const Title = styled.h2`
  color: ${TEAL_DARK};
  margin: 0;
  grid-column: 2;
  text-align: center;
  font-size: 22px;

  @media (max-width: 640px) {
    grid-column: 1;
    font-size: 19px;
  }
`;

const AddButton = styled.button`
  grid-column: 3;
  justify-self: end;
  background: ${TEAL};
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${TEAL_DARK};
  }

  @media (max-width: 640px) {
    grid-column: 1;
    justify-self: stretch;
    width: 100%;
    padding: 12px 18px;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    overflow-x: visible;
    box-shadow: none;
    border-radius: 0;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;

  th,
  td {
    padding: 12px 14px;
    text-align: left;
    font-size: 14px;
    border-bottom: 1px solid #eef2f2;
    white-space: nowrap;
  }

  th {
    background: ${TEAL_DARK};
    color: #fff;
    position: sticky;
    top: 0;
  }

  tbody tr:hover {
    background: #f2fbfb;
  }

  /* --- Phone: convert table to stacked cards --- */
  @media (max-width: 768px) {
    thead {
      display: none;
    }

    tbody,
    tr,
    td {
      display: block;
      width: 100%;
    }

    tr {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
      margin-bottom: 14px;
      padding: 6px 4px;
    }

    td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      white-space: normal;
      text-align: right;
      border-bottom: 1px solid #f4f7f7;
      padding: 10px 12px;
    }

    td:last-child {
      border-bottom: none;
    }

    td::before {
      content: attr(data-label);
      font-weight: 600;
      color: ${TEAL_DARK};
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      flex-shrink: 0;
    }
  }
`;

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: #7a8a8a;

  @media (max-width: 480px) {
    padding: 28px 16px;
    font-size: 14px;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  @media (max-width: 640px) {
    align-items: flex-end;
  }
`;

const ModalBox = styled.div`
  background: #fff;
  width: 460px;
  max-width: 92vw;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  @media (max-width: 640px) {
    width: 100%;
    max-width: 100%;
    max-height: 92vh;
    border-radius: 14px 14px 0 0;
    padding: 20px 16px calc(16px + env(safe-area-inset-bottom, 0px));
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`;

const ModalTitle = styled.h3`
  color: ${TEAL_DARK};
  margin: 0;
  font-size: 18px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 22px;
  line-height: 1;
  color: #7a8a8a;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: #eef2f2;
    color: ${TEAL_DARK};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #444;
  margin-bottom: 6px;
`;

const Input = styled.input`
  padding: 9px 10px;
  border: 1px solid #d5dede;
  border-radius: 6px;
  font-size: 16px; /* 16px+ prevents iOS Safari auto-zoom on focus */

  &:focus {
    outline: none;
    border-color: ${TEAL};
  }

  @media (min-width: 641px) {
    font-size: 14px;
  }
`;

const Select = styled.select`
  padding: 9px 10px;
  border: 1px solid #d5dede;
  border-radius: 6px;
  font-size: 16px; /* 16px+ prevents iOS Safari auto-zoom on focus */
  background: #fff;

  &:focus {
    outline: none;
    border-color: ${TEAL};
  }

  @media (min-width: 641px) {
    font-size: 14px;
  }
`;

const ErrorText = styled.span`
  color: #c0392b;
  font-size: 12px;
  margin-top: 4px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;

  @media (max-width: 480px) {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
`;

const CancelBtn = styled.button`
  background: #eef2f2;
  color: #333;
  border: none;
  padding: 9px 16px;
  border-radius: 6px;
  cursor: pointer;

  @media (max-width: 480px) {
    padding: 12px 16px;
  }
`;

const SaveBtn = styled.button`
  background: ${TEAL};
  color: #fff;
  border: none;
  padding: 9px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: ${TEAL_DARK};
  }

  @media (max-width: 480px) {
    padding: 12px 18px;
  }
`;

const TimeRow = styled.div`
  display: flex;
  gap: 8px;

  select {
    flex: 1;
    min-width: 0;
  }
`;

const RowSelect = styled.select`
  padding: 6px 8px;
  border: 1px solid #d5dede;
  border-radius: 6px;
  font-size: 13px;
  background: #fff;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: ${TEAL};
  }

  @media (max-width: 768px) {
    min-width: 0;
    width: 100%;
    max-width: 190px;
    font-size: 16px; /* avoid iOS zoom */
    padding: 8px;
  }
`;

const PhotoActions = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 420px) {
    flex-direction: column;
  }
`;

const PhotoButton = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #eef2f2;
  color: ${TEAL_DARK};
  border: 1px solid #d5dede;
  padding: 9px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
  flex: 1;

  &:hover {
    background: #e2ecec;
  }

  @media (max-width: 420px) {
    padding: 12px 14px;
  }
`;

const PhotoPreview = styled.img`
  margin-top: 12px;
  width: 100%;
  max-height: 180px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #d5dede;
`;

const PhotoThumb = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #d5dede;
  cursor: pointer;
`;

const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

const getTodayDate = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const emptyForm = {
  date: getTodayDate(),
  location: "",
  amount: "",
  collectedby: "",
  pickuptime: "",
  busreachedtime: "",
  bustphoto: null,
};

const getCollectorLabel = (collector) =>
  collector?.employeeName ||
  collector?.name ||
  collector?.username ||
  (typeof collector === "string" ? collector : "");

const getCollectorValue = (collector) =>
  collector?.employeeId ||
  collector?.employeeName ||
  (typeof collector === "string" ? collector : "");

const getCollectorNameById = (collectors, id) => {
  if (!id) return "-";
  const match = (Array.isArray(collectors) ? collectors : []).find(
    (c) => getCollectorValue(c) === id
  );
  return match ? getCollectorLabel(match) : id;
};

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

const isCompleteTime = (value) => /^\d{2}:\d{2}$/.test(value || "");

function TimeSelect({ value, onChange }) {
  const [h = "", m = ""] = (value || "").split(":");

  const update = (part, newVal) => {
    const nextH = part === "h" ? newVal : h;
    const nextM = part === "m" ? newVal : m;
    onChange(`${nextH || "00"}:${nextM || "00"}`);
  };

  return (
    <TimeRow>
      <Select value={h} onChange={(e) => update("h", e.target.value)}>
        <option value="">HH</option>
        {HOURS.map((hh) => (
          <option key={hh} value={hh}>
            {hh}
          </option>
        ))}
      </Select>
      <Select value={m} onChange={(e) => update("m", e.target.value)}>
        <option value="">MM</option>
        {MINUTES.map((mm) => (
          <option key={mm} value={mm}>
            {mm}
          </option>
        ))}
      </Select>
    </TimeRow>
  );
}

function Busfare() {
  const [busfares, setBusfares] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [pickingUpId, setPickingUpId] = useState(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);

  const loadBusfares = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`${Labbaseurl}bus_fare/`, "GET");
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.results)
        ? res.results
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data?.results)
        ? res.data.results
        : [];
      setBusfares(list);
    } catch (err) {
      console.error("Failed to load bus fares:", err);
      setBusfares([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCollectors = useCallback(async () => {
    try {
      const res = await apiRequest(`${Labbaseurl}get_b2b_employees/`, "GET");
      console.log("get_b2b_employees raw response:", res);
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.results)
        ? res.results
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data?.results)
        ? res.data.results
        : [];
      console.log("collectors list resolved to:", list);
      setCollectors(list);
    } catch (err) {
      console.error("Failed to load collectors:", err);
      setCollectors([]);
    }
  }, []);

  useEffect(() => {
    loadBusfares();
    loadCollectors();
  }, [loadBusfares, loadCollectors]);

  const openModal = () => {
    setFormData({ ...emptyForm, date: getTodayDate() });
    setErrors({});
    setPhotoPreviewUrl(null);
    setShowModal(true);
  };

  const closeModal = () => {
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoPreviewUrl(null);
    setShowModal(false);
  };

  const handleChange = (field) => (e) => {
    const value = field === "bustphoto" ? e.target.files?.[0] || null : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, bustphoto: file }));

    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);

    if (file) {
      setPhotoPreviewUrl(URL.createObjectURL(file));
    } else {
      setPhotoPreviewUrl(null);
    }

    // Allow re-selecting the same file (upload then camera, or vice versa)
    e.target.value = "";
  };

  const handleTimeChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.amount || Number(formData.amount) <= 0)
      newErrors.amount = "Enter a valid amount";
    if (!formData.collectedby) newErrors.collectedby = "Please select who collected this";
    if (!isCompleteTime(formData.pickuptime))
      newErrors.pickuptime = "Pickup time is required";
    if (!isCompleteTime(formData.busreachedtime))
      newErrors.busreachedtime = "Bus reached time is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const cleanAmount = Number(formData.amount).toFixed(2);
      const baseData = { ...formData, amount: cleanAmount };

      console.log("handleSave: formData.bustphoto =", formData.bustphoto);

      if (baseData.bustphoto) {
        // ── Multipart branch ────────────────────────────────────────
        // apiRequest hardcodes "Content-Type: application/json" on every
        // request and has no way to opt out of that, which breaks file
        // uploads (axios needs to set its own multipart/form-data header
        // with a boundary — a manually-set Content-Type here, JSON or
        // otherwise, prevents that and the backend sees an empty
        // request.FILES). So this one call goes straight through axios
        // instead of apiRequest, reusing the same auth/branch headers.
        const payload = new FormData();
        Object.entries(baseData).forEach(([key, value]) => {
          if (value !== null && value !== "") payload.append(key, value);
        });
        console.log(
          "handleSave: sending multipart, bustphoto entry =",
          payload.get("bustphoto")
        );

        const token = localStorage.getItem("access_token");
        const branch = localStorage.getItem("selected_branch");

        const response = await axios.post(`${Labbaseurl}bus_fare/`, payload, {
          headers: {
            Authorization: token,
            "Branch-Code": branch,
            // Intentionally NOT setting Content-Type — axios must set it
            // itself (multipart/form-data; boundary=...) for FormData.
          },
          validateStatus: () => true,
        });

        if (response.status < 200 || response.status >= 300) {
          console.error("Failed to save bus fare:", response.data);
          return;
        }
      } else {
        // No photo selected — plain JSON, apiRequest handles this fine.
        const { bustphoto, ...rest } = baseData;
        console.log("handleSave: no photo selected, sending JSON without bustphoto");
        await apiRequest(`${Labbaseurl}bus_fare/`, "POST", rest);
      }

      closeModal();
      loadBusfares();
    } catch (err) {
      console.error("Failed to save bus fare:", err);
    } finally {
      setSaving(false);
    }
  };

  const handlePickedUpChange = async (busfareId, pickedupby) => {
    setPickingUpId(busfareId);

    // Optimistic update so the dropdown reflects the choice immediately.
    setBusfares((prev) =>
      prev.map((row) =>
        row.busfare_id === busfareId ? { ...row, pickedupby } : row
      )
    );

    try {
      await apiRequest(`${Labbaseurl}bus_fare/`, "PATCH", {
        busfare_id: busfareId,
        pickedupby,
      });
      loadBusfares();
    } catch (err) {
      console.error("Failed to update pickedupby:", err);
      loadBusfares(); // revert to server state on failure
    } finally {
      setPickingUpId(null);
    }
  };

  return (
    <Wrapper>
      <Header>
        <Title>Bus Sample Tracker</Title>
        <AddButton onClick={openModal}>+ Add Bus Fare</AddButton>
      </Header>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Location</th>
              <th>Amount</th>
              <th>Collected By</th>
              <th>Pickup Time</th>
              <th>Bus Reached Time</th>
              <th>Picked Up By</th>
              <th>Photo</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(busfares) ? busfares : []).map((row) => (
              <tr key={row.busfare_id || row.id}>
                <td data-label="Date">{row.date}</td>
                <td data-label="Location">{row.location}</td>
                <td data-label="Amount">{row.amount}</td>
                <td data-label="Collected By">
                  {getCollectorNameById(collectors, row.collectedby)}
                </td>
                <td data-label="Pickup Time">{row.pickuptime}</td>
                <td data-label="Bus Reached">{row.busreachedtime}</td>
                <td data-label="Picked Up By">
                  <RowSelect
                    value={row.pickedupby || ""}
                    onChange={(e) => handlePickedUpChange(row.busfare_id, e.target.value)}
                    disabled={pickingUpId === row.busfare_id}
                  >
                    <option value="">Select collector</option>
                    {(Array.isArray(collectors) ? collectors : []).map((collector, idx) => (
                      <option key={idx} value={getCollectorValue(collector)}>
                        {getCollectorLabel(collector)}
                      </option>
                    ))}
                  </RowSelect>
                </td>
                <td data-label="Photo">
                  {row.bustphoto ? (
                    <a
                      href={`${Labbaseurl}bus_fare_photo/?file_id=${row.bustphoto}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <PhotoThumb
                        src={`${Labbaseurl}bus_fare_photo/?file_id=${row.bustphoto}`}
                        alt="Bus photo"
                      />
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {!loading && (!Array.isArray(busfares) || busfares.length === 0) && (
          <EmptyState>No bus fare entries yet. Add one to get started.</EmptyState>
        )}
        {loading && <EmptyState>Loading...</EmptyState>}
      </TableWrapper>

      {showModal &&
        ReactDOM.createPortal(
          <Overlay onClick={closeModal}>
            <ModalBox onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>Add Bus Fare</ModalTitle>
                <CloseButton onClick={closeModal} aria-label="Close">
                  ×
                </CloseButton>
              </ModalHeader>

              <FormGroup>
                <Label>Date</Label>
                <Input type="date" value={formData.date} onChange={handleChange("date")} />
                {errors.date && <ErrorText>{errors.date}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>Location</Label>
                <Input
                  type="text"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={handleChange("location")}
                />
                {errors.location && <ErrorText>{errors.location}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange("amount")}
                />
                {errors.amount && <ErrorText>{errors.amount}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>Collected By</Label>
                <Select value={formData.collectedby} onChange={handleChange("collectedby")}>
                  <option value="">Select collector</option>
                  {(Array.isArray(collectors) ? collectors : []).map((collector, idx) => (
                    <option key={idx} value={getCollectorValue(collector)}>
                      {getCollectorLabel(collector)}
                    </option>
                  ))}
                </Select>
                {errors.collectedby && <ErrorText>{errors.collectedby}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>Pickup Time</Label>
                <TimeSelect
                  value={formData.pickuptime}
                  onChange={handleTimeChange("pickuptime")}
                />
                {errors.pickuptime && <ErrorText>{errors.pickuptime}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>Bus Reached Time</Label>
                <TimeSelect
                  value={formData.busreachedtime}
                  onChange={handleTimeChange("busreachedtime")}
                />
                {errors.busreachedtime && <ErrorText>{errors.busreachedtime}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>Bus Photo (optional)</Label>
                <PhotoActions>
                  <PhotoButton htmlFor="bustphoto-upload">
                    Upload Photo
                    <input
                      id="bustphoto-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handlePhotoChange}
                    />
                  </PhotoButton>
                  <PhotoButton htmlFor="bustphoto-camera">
                    Use Camera
                    <input
                      id="bustphoto-camera"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      style={{ display: "none" }}
                      onChange={handlePhotoChange}
                    />
                  </PhotoButton>
                </PhotoActions>
                {photoPreviewUrl && (
                  <PhotoPreview src={photoPreviewUrl} alt="Bus photo preview" />
                )}
              </FormGroup>

              <ModalActions>
                <CancelBtn onClick={closeModal}>Cancel</CancelBtn>
                <SaveBtn onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </SaveBtn>
              </ModalActions>
            </ModalBox>
          </Overlay>,
          document.body
        )}
    </Wrapper>
  );
}

export default Busfare;