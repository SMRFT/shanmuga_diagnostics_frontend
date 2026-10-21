export const DEPARTMENT_ORDER = [
  "Haematology",
  "Coagulation",
  "Biochemistry",
  "Immunology",
  "Immunoassay",
  "Serology",
  "Clinical Pathology",
  "Clinical Chemistry",
  "Cytology",
  "Genetics",
  "Histopathology",
  "Immunohistochemistry",
  "Microbiology",
  "Molecular Biology",
];

/**
 * Parses order_id such as 'T1', 'T2', 'G1', 'G4', etc.
 * Supports letter prefix (optional) and integer number.
 */
export const parseOrderId = (orderId) => {
  if (!orderId || typeof orderId !== "string") return null;
  const match = orderId.trim().match(/^([A-Za-z]*)[\s_-]*(\d+)$/);
  if (!match) return null;
  return {
    prefix: match[1].toUpperCase(),
    num: parseInt(match[2], 10),
  };
};

/**
 * Compares two tests by order_id:
 * If both share the same first letter/prefix (e.g. 'T' for T1, T2, T3; 'G' for G1, G2, G4):
 *   Arranges them in numeric sequence 1, 2, 3...
 * If both have order_id but different prefixes:
 *   Sorts alphabetically by prefix.
 * If one has order_id and the other does not:
 *   The test with order_id comes first.
 * If neither has order_id:
 *   Retains their existing relative order (returns 0).
 */
export const compareTestsByOrderId = (a, b) => {
  const orderA = parseOrderId(a?.order_id || a?.orderId);
  const orderB = parseOrderId(b?.order_id || b?.orderId);

  if (orderA && orderB) {
    if (orderA.prefix === orderB.prefix) {
      return orderA.num - orderB.num;
    }
    return orderA.prefix.localeCompare(orderB.prefix);
  }
  if (orderA && !orderB) return -1;
  if (!orderA && orderB) return 1;
  return 0;
};

/**
 * Sorts a list of tests by department order first, then within each department by order_id.
 */
export const sortTestsWithDepartmentAndOrder = (testsList, deptOrder = DEPARTMENT_ORDER) => {
  if (!Array.isArray(testsList)) return [];
  return [...testsList].sort((a, b) => {
    const deptA = a?.department || "";
    const deptB = b?.department || "";
    if (deptA !== deptB) {
      const idxA = deptOrder.indexOf(deptA);
      const idxB = deptOrder.indexOf(deptB);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return deptA.localeCompare(deptB);
    }
    return compareTestsByOrderId(a, b);
  });
};
