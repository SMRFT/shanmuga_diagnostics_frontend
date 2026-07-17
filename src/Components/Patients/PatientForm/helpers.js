// Pure utility/formatting functions extracted from the PatientForm
// component. Extracted verbatim - behavior is unchanged, they just take
// explicit arguments instead of closing over component state.

export const getCurrentDateWithTime = () => {
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, "0")
  const day = String(currentDate.getDate()).padStart(2, "0")
  const hours = String(currentDate.getHours()).padStart(2, "0")
  const minutes = String(currentDate.getMinutes()).padStart(2, "0")
  const seconds = String(currentDate.getSeconds()).padStart(2, "0")
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export const getTitleFromName = (name) => {
  const prefixMatch = name.match(/^(MR\.?|MRS\.?|MS\.?|MASTER\.?|MISS\.?|DR\.?|BABY\.?|BABY OF\.?)\s+/i)
  if (prefixMatch) {
    const prefix = prefixMatch[1].toUpperCase().replace(/\.$/, "")
    const titleMap = {
      MR: "Mr.",
      MRS: "Mrs.",
      MS: "Ms.",
      MASTER: "Master.",
      MISS: "Miss.",
      DR: "Dr.",
      BABY: "Baby.",
      "BABY OF": "Baby of.",
    }
    return titleMap[prefix] || "Mr."
  }
  return "Mr."
}

export const formatAddress = (address) => {
  if (!address) return "N/A"

  let addressObj = address

  if (typeof address === "string") {
    try {
      addressObj = JSON.parse(address)
    } catch (e) {
      console.error("Error parsing address:", e)
      return address || "N/A"
    }
  }

  if (typeof addressObj === "object") {
    const area = addressObj.area || ""
    const pincode = addressObj.pincode || ""

    if (!area && !pincode) return "N/A"
    if (!area) return pincode
    if (!pincode) return area

    return `${area}, ${pincode}`
  }

  return "N/A"
}

// Pure version of the original inline `getFilteredRefBys` - takes the
// referrers list and search value explicitly instead of closing over state.
export const filterReferrers = (referrers, refBySearchValue) => {
  if (!refBySearchValue) return referrers
  return referrers.filter((refby) =>
    refby.name.toLowerCase().includes(refBySearchValue.toLowerCase()),
  )
}

// Pure version of the original inline `getFilteredClinicalNames`.
export const filterClinicalNames = (clinicalNames, clinicalSearchValue) => {
  if (!clinicalSearchValue) return clinicalNames
  return clinicalNames.filter((clinical) =>
    clinical.clinicalname.toLowerCase().includes(clinicalSearchValue.toLowerCase()),
  )
}

// Pure version of the original inline `validateRequiredFields` - takes
// formData/isB2BEnabled/isHomeCollectionEnabled explicitly.
export const validateRequiredFields = (formData, isB2BEnabled, isHomeCollectionEnabled) => {
  const errors = []

  if (!formData.patientname.trim()) errors.push("Patient Name is required")
  if (!formData.age) errors.push("Age is required")
  if (!formData.refby.trim()) errors.push("Ref By is required")
  if (!formData.sample_collector.trim()) errors.push("Sample Collector is required")
  if (!formData.branch.trim()) errors.push("Branch is required")

  if (isB2BEnabled && !formData.B2B.trim()) {
    errors.push("Clinical Name is required when B2B is enabled")
  }

  if (isHomeCollectionEnabled) {
    if (!formData.phone.trim()) errors.push("Phone Number is required for Home Collection")
    if (!formData.email.trim()) errors.push("Email ID is required for Home Collection")
    if (!formData.address.area.trim()) errors.push("Area is required for Home Collection")
    if (!formData.address.pincode.trim()) errors.push("Pin Code is required for Home Collection")
  }

  return errors
}
