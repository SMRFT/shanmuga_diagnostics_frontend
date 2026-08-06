import { useState, useEffect, useMemo } from "react";
import styled, { createGlobalStyle, keyframes, css } from "styled-components";
import {
  Package, Search, RefreshCw, Eye, ChevronLeft, ChevronRight,
  CheckCircle, XCircle, Clock, X, User, DollarSign, TestTube, Calendar
} from "lucide-react";
import apiRequest from "../Auth/apiRequest";

/* ─────────────────── Global ─────────────────── */
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  :root {
    --primary:      #4361ee;
    --primary-dk:   #3a0ca3;
    --success:      #06d6a0;
    --danger:       #ef233c;
    --warning:      #f9c74f;
    --gray:         #6c757d;
    --gray-lt:      #e9ecef;
    --light:        #f8f9fa;
    --dark:         #1a1a2e;
    --radius:       10px;
    --shadow:       0 4px 20px rgba(0,0,0,.07);
    --trans:        all .2s ease;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #f0f2f5; color: var(--dark); }
`;

/* ─────────────────── Layout ─────────────────── */
const Wrap       = styled.div`max-width:1400px;margin:0 auto;padding:2rem;@media(max-width:768px){padding:1rem}`;
const PageHeader = styled.div`display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.75rem`;
const TitleRow   = styled.div`display:flex;align-items:center;gap:.9rem`;
const TitleIcon  = styled.div`
  width:50px;height:50px;border-radius:14px;
  background:linear-gradient(135deg,var(--primary),var(--primary-dk));
  display:flex;align-items:center;justify-content:center;color:#fff;
  box-shadow:0 6px 16px rgba(67,97,238,.35);flex-shrink:0
`;
const Title      = styled.h1`font-size:1.5rem;font-weight:700;letter-spacing:-.02em`;
const Sub        = styled.p`font-size:.82rem;color:var(--gray);margin-top:2px`;

/* ─────────────────── Stats ─────────────────── */
const StatsGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1rem;margin-bottom:1.5rem`;
const Stat = styled.div`
  background:#fff;border-radius:var(--radius);padding:1.1rem 1.25rem;
  box-shadow:var(--shadow);border-left:4px solid ${p=>p.c||'var(--primary)'};
`;
const StatNum   = styled.div`font-size:1.9rem;font-weight:700;color:${p=>p.c||'var(--dark)'};line-height:1`;
const StatLabel = styled.div`font-size:.75rem;color:var(--gray);font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-top:3px`;

/* ─────────────────── Controls ─────────────────── */
const Controls = styled.div`display:flex;gap:.75rem;margin-bottom:1.25rem;flex-wrap:wrap;align-items:center`;
const SearchBox = styled.div`
  display:flex;align-items:center;gap:.5rem;flex:1;min-width:220px;
  background:#fff;border:1.5px solid var(--gray-lt);border-radius:9px;padding:.55rem 1rem;
  color:var(--gray);transition:var(--trans);
  &:focus-within{border-color:var(--primary);color:var(--primary)}
  input{border:none;outline:none;flex:1;font-size:.875rem;color:var(--dark);background:transparent;font-family:inherit;&::placeholder{color:var(--gray)}}
`;
const Select = styled.select`
  padding:.55rem .9rem;border:1.5px solid var(--gray-lt);border-radius:9px;
  background:#fff;font-size:.85rem;font-family:inherit;color:var(--dark);cursor:pointer;
  &:focus{outline:none;border-color:var(--primary)}
`;
const IconBtn = styled.button`
  display:inline-flex;align-items:center;gap:.45rem;padding:.55rem 1.1rem;
  border:1.5px solid var(--gray-lt);border-radius:9px;background:#fff;
  color:var(--gray);font-size:.85rem;font-weight:500;cursor:pointer;transition:var(--trans);
  &:hover{border-color:var(--primary);color:var(--primary)}
  &:disabled{opacity:.6;cursor:default}
`;

/* ─────────────────── Table ─────────────────── */
const TableWrap = styled.div`width:100%;overflow-x:auto;border-radius:var(--radius);box-shadow:var(--shadow);`;
const Table     = styled.table`width:100%;border-collapse:collapse;background:#fff;min-width:820px`;
const THead     = styled.thead`background:linear-gradient(135deg,#3f37c9,var(--primary-dk));color:#fff`;
const TH        = styled.th`
  padding:1rem 1.1rem;text-align:left;font-size:.78rem;font-weight:600;
  text-transform:uppercase;letter-spacing:.5px;white-space:nowrap
`;
const TBody     = styled.tbody``;

const fadeRow = keyframes`from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}`;
const TR = styled.tr`
  animation:${fadeRow} .25s ease both;
  animation-delay:${p=>p.i*.04}s;
  border-bottom:1px solid var(--gray-lt);
  transition:background .15s ease;
  &:hover{background:rgba(67,97,238,.04)}
  &:last-child{border-bottom:none}
`;
const TD = styled.td`padding:.85rem 1.1rem;font-size:.875rem;vertical-align:middle`;

/* ─────────────────── Badges ─────────────────── */
const Badge = styled.span`
  display:inline-flex;align-items:center;gap:.3rem;padding:.27rem .7rem;
  border-radius:999px;font-size:.72rem;font-weight:700;white-space:nowrap;
  ${p=>p.s==='Approved'&&`background:rgba(6,214,160,.12);color:#059669;border:1px solid rgba(6,214,160,.3)`}
  ${p=>p.s==='Rejected'&&`background:rgba(239,35,60,.09);color:var(--danger);border:1px solid rgba(239,35,60,.22)`}
  ${p=>(!p.s||p.s==='pending')&&`background:rgba(249,199,79,.18);color:#b45309;border:1px solid rgba(249,199,79,.4)`}
`;

/* ─────────────────── Action btn ─────────────────── */
const ViewBtn = styled.button`
  display:inline-flex;align-items:center;gap:.35rem;
  padding:.38rem .8rem;border:1.5px solid var(--primary);border-radius:7px;
  background:transparent;color:var(--primary);font-size:.8rem;font-weight:600;cursor:pointer;
  transition:var(--trans);
  &:hover{background:var(--primary);color:#fff}
`;

/* ─────────────────── Pagination ─────────────────── */
const PaginationBar = styled.div`
  display:flex;align-items:center;justify-content:space-between;
  flex-wrap:wrap;gap:.75rem;margin-top:1.25rem;
`;
const PgInfo = styled.span`font-size:.82rem;color:var(--gray)`;
const PgBtns = styled.div`display:flex;gap:.4rem;align-items:center;flex-wrap:wrap`;
const PgBtn  = styled.button`
  min-width:34px;height:34px;padding:0 .6rem;border-radius:7px;
  border:1.5px solid ${p=>p.active?'var(--primary)':'var(--gray-lt)'};
  background:${p=>p.active?'var(--primary)':'#fff'};
  color:${p=>p.active?'#fff':'var(--dark)'};
  font-size:.82rem;font-weight:600;cursor:${p=>p.disabled?'default':'pointer'};
  opacity:${p=>p.disabled?.45:1};transition:var(--trans);
  &:hover:not(:disabled){background:${p=>p.active?'var(--primary-dk)':'var(--gray-lt)'}};
`;

/* ─────────────────── Modal ─────────────────── */
const Overlay = styled.div`
  position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:1000;
  display:flex;align-items:center;justify-content:center;padding:1rem;
`;
const ModalBox = styled.div`
  background:#fff;border-radius:16px;width:100%;max-width:640px;
  max-height:90vh;display:flex;flex-direction:column;
  box-shadow:0 20px 60px rgba(0,0,0,.2);overflow:hidden;
`;
const ModalHead = styled.div`
  padding:1.25rem 1.5rem;border-bottom:1px solid var(--gray-lt);
  display:flex;align-items:center;justify-content:space-between;
  background:linear-gradient(135deg,rgba(67,97,238,.06),transparent);
`;
const ModalTitle = styled.h2`font-size:1.1rem;font-weight:700;color:var(--primary-dk)`;
const CloseBtn = styled.button`
  background:none;border:none;color:var(--gray);cursor:pointer;
  display:flex;align-items:center;padding:.3rem;border-radius:6px;
  &:hover{background:var(--gray-lt);color:var(--dark)}
`;
const ModalBody = styled.div`overflow-y:auto;padding:1.5rem;display:flex;flex-direction:column;gap:1.25rem`;

const Section = styled.div``;
const SectionTitle = styled.div`
  display:flex;align-items:center;gap:.5rem;font-size:.8rem;font-weight:600;
  text-transform:uppercase;letter-spacing:.5px;color:var(--primary);margin-bottom:.6rem
`;
const InfoGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:.6rem;@media(max-width:480px){grid-template-columns:1fr}`;
const InfoCell = styled.div`background:var(--light);border-radius:8px;padding:.7rem 1rem`;
const InfoCellLabel = styled.div`font-size:.7rem;color:var(--gray);font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px`;
const InfoCellValue = styled.div`font-size:.9rem;font-weight:600;color:var(--dark)`;

const RateRow = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:.6rem`;
const RateBox = styled.div`background:var(--light);border-radius:8px;padding:.7rem;text-align:center;border:1px solid var(--gray-lt)`;
const RateLabel = styled.div`font-size:.68rem;color:var(--gray);font-weight:600;text-transform:uppercase;letter-spacing:.3px;margin-bottom:2px`;
const RateVal   = styled.div`font-size:.95rem;font-weight:700;color:var(--primary-dk)`;

const TestUl = styled.div`
  display:flex;flex-direction:column;gap:0;border:1px solid var(--gray-lt);
  border-radius:8px;overflow:hidden;max-height:200px;overflow-y:auto;
  &::-webkit-scrollbar{width:4px}
  &::-webkit-scrollbar-thumb{background:var(--gray-lt);border-radius:4px}
`;
const TestLi = styled.div`
  padding:.55rem 1rem;font-size:.82rem;color:var(--dark);
  border-bottom:1px solid var(--gray-lt);
  display:flex;align-items:center;gap:.5rem;
  &:last-child{border-bottom:none}
  &:nth-child(even){background:rgba(248,249,250,.7)}
  &::before{content:'•';color:var(--primary);font-size:1.1rem;flex-shrink:0}
`;

const AuditBanner = styled.div`
  padding:.75rem 1rem;border-radius:8px;font-size:.8rem;
  ${p=>p.v==='Approved'&&`background:rgba(6,214,160,.08);border:1px solid rgba(6,214,160,.25);color:#065f46`}
  ${p=>p.v==='Rejected'&&`background:rgba(239,35,60,.07);border:1px solid rgba(239,35,60,.2);color:#9f1239`}
`;

const EmptyRow = styled.tr``;
const EmptyTd  = styled.td`
  text-align:center;padding:4rem 2rem;color:var(--gray);
  h3{margin-bottom:.4rem;font-size:1.1rem}
  p{font-size:.875rem}
`;

/* ─────────────────── Shimmer skeleton ─────────────────── */
const shimmer = keyframes`0%{background-position:-200% 0}100%{background-position:200% 0}`;
const spinKf  = keyframes`to{transform:rotate(360deg)}`;

const SkeletonCell = styled.div`
  height: 14px;
  border-radius: 6px;
  width: ${p => p.w || '70%'};
  background: linear-gradient(90deg, #f0f0f0 25%, #e4e4e4 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${css`${shimmer}`} 1.5s infinite;
`;

const SpinIcon = styled.span`
  display: inline-flex;
  animation: ${p => p.active ? css`${spinKf} 1s linear infinite` : 'none'};
`;

const SkeletonRow = () => (
  <TR>
    {[1,2,3,4,5,6].map(i=>(
      <TD key={i}>
        <SkeletonCell w={i===1?'60%':i===6?'80px':'70%'} />
      </TD>
    ))}
  </TR>
);

const PAGE_SIZES = [10, 20, 50];

/* ─────────────────── Component ─────────────────── */
const B2BPackageList = () => {
  const [packages,    setPackages]    = useState([]);
  const [testDetails, setTestDetails] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [search,      setSearch]      = useState("");
  const [statusFlt,   setStatusFlt]   = useState("all");
  const [viewPkg,     setViewPkg]     = useState(null);   // modal
  const [page,        setPage]        = useState(1);
  const [pageSize,    setPageSize]    = useState(10);
  const [clinicalMap, setClinicalMap] = useState({});
  const [userMap,     setUserMap]     = useState({});

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  /* ── fetch ── */
  const fetchPackages = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const r = await apiRequest(`${Labbaseurl}b2b_packages/`, "GET");
      if (r.success) {
        const data = Array.isArray(r.data) ? r.data : r.data?.data || [];
        setPackages(data);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  };

  const fetchTestDetails = async () => {
    try {
      const r = await apiRequest(`${Labbaseurl}testdetails/`, "GET");
      if (r.success)
        setTestDetails(Array.isArray(r.data) ? r.data : r.data?.data || []);
    } catch (e) { console.error(e); }
  };

  const fetchMetadata = async () => {
    try {
      const [clinicalRes, collectorRes, salesRes] = await Promise.all([
        apiRequest(`${Labbaseurl}clinical_name/`, "GET"),
        apiRequest(`${Labbaseurl}sample-collector/`, "GET"),
        apiRequest(`${Labbaseurl}get_sales_executives/`, "GET"),
      ]);

      const cMap = {};
      if (clinicalRes?.success && Array.isArray(clinicalRes.data)) {
        clinicalRes.data.forEach((c) => {
          const code = c.referrerCode || c.referrer_code || c.code;
          const name = c.clinicalname || c.clinical_name || c.name;
          if (code && name) cMap[String(code).trim()] = name;
        });
      }
      setClinicalMap(cMap);

      const uMap = {};
      if (collectorRes?.success && Array.isArray(collectorRes.data)) {
        collectorRes.data.forEach((emp) => {
          const id = emp.employeeId || emp.employee_id || emp.id;
          const name = emp.employeeName || emp.name;
          if (id && name) uMap[String(id).trim()] = name;
        });
      }
      if (salesRes?.success && Array.isArray(salesRes.data)) {
        salesRes.data.forEach((s) => {
          const id = s.employeeId || s.id || s.user_id;
          const name = s.employeeName || s.name || s.username;
          if (id && name) uMap[String(id).trim()] = name;
        });
      }
      const curId = localStorage.getItem("employeeId") || localStorage.getItem("auth-user-id");
      const curName = localStorage.getItem("name") || localStorage.getItem("username");
      if (curId && curName) {
        uMap[String(curId).trim()] = curName;
      }
      setUserMap(uMap);
    } catch (err) {
      console.error("Error loading metadata maps:", err);
    }
  };

  useEffect(() => {
    if (Labbaseurl) {
      fetchPackages();
      fetchTestDetails();
      fetchMetadata();
    }
  }, [Labbaseurl]);

  /* ── helpers ── */
  const getLabName = (pkg) => {
    if (!pkg) return "—";
    if (pkg.clinicalname && pkg.clinicalname !== pkg.referrerCode) {
      return pkg.clinicalname;
    }
    const code = pkg.referrerCode ? String(pkg.referrerCode).trim() : "";
    if (code && clinicalMap[code]) {
      return clinicalMap[code];
    }
    return pkg.clinicalname || pkg.referrerCode || "—";
  };

  const getUserName = (val) => {
    if (!val || val === "System") return val || "—";
    const strVal = String(val).trim();
    if (userMap[strVal]) {
      return userMap[strVal];
    }
    const curId = localStorage.getItem("employeeId");
    const curName = localStorage.getItem("name");
    if (curId && strVal === String(curId).trim() && curName) {
      return curName;
    }
    return val;
  };

  const getTestName = (item) => {
    try {
      const id = typeof item === "object" && item ? item.test_id ?? item.testId : item;
      const t  = testDetails.find(t =>
        (t._id && t._id.$oid === String(id)) ||
        String(t.id) === String(id) ||
        String(t.test_id) === String(id)
      );
      const name = t ? t.test_name || t.name : null;
      return name && typeof name !== "object" ? String(name) : `ID: ${id}`;
    } catch { return "Unknown"; }
  };

  const parseTests = (d) => {
    try {
      if (Array.isArray(d)) return d;
      if (typeof d === "string") return JSON.parse(d);
      return [];
    } catch { return []; }
  };

  const fmtRate = (r) => {
    if (r?.$numberDecimal) return `₹${parseFloat(r.$numberDecimal).toFixed(2)}`;
    return `₹${parseFloat(r || 0).toFixed(2)}`;
  };

  const fmtDate = (d, full = false) => {
    try {
      const raw = d?.$date || d;
      if (!raw) return "—";
      return new Date(raw).toLocaleDateString("en-IN", full
        ? { year:"numeric", month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" }
        : { year:"numeric", month:"short", day:"numeric" }
      );
    } catch { return "—"; }
  };

  const statusIcon = (s) =>
    s === "Approved" ? <CheckCircle size={11}/> :
    s === "Rejected" ? <XCircle size={11}/> : <Clock size={11}/>;

  /* ── filter & pagination ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return packages.filter(p => {
      const s = (p.status || "pending").toLowerCase();
      const labName = getLabName(p).toLowerCase();
      const matchQ = !q ||
        (p.packageName||"").toLowerCase().includes(q) ||
        (p.referrerCode||"").toLowerCase().includes(q) ||
        labName.includes(q);
      const matchS = statusFlt === "all" || s === statusFlt.toLowerCase();
      return matchQ && matchS;
    });
  }, [packages, search, statusFlt, clinicalMap]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safeP      = Math.min(page, totalPages);
  const pageData   = filtered.slice((safeP - 1) * pageSize, safeP * pageSize);

  /* reset page when filter changes */
  useEffect(() => setPage(1), [search, statusFlt, pageSize]);

  const stats = {
    total:    packages.length,
    pending:  packages.filter(p => (p.status||"pending") === "pending").length,
    approved: packages.filter(p => p.status === "Approved").length,
    rejected: packages.filter(p => p.status === "Rejected").length,
  };

  /* ── page range for buttons ── */
  const pageRange = () => {
    const d = 2, lo = Math.max(1, safeP - d), hi = Math.min(totalPages, safeP + d);
    return Array.from({length: hi - lo + 1}, (_, i) => lo + i);
  };

  /* ═══════════ Render ═══════════ */
  return (
    <>
      <GlobalStyle />
      <Wrap>
        {/* Header */}
        <PageHeader>
          <TitleRow>
            <TitleIcon><Package size={24}/></TitleIcon>
            <div>
              <Title>B2B Package List</Title>
              <Sub>{packages.length} packages in total</Sub>
            </div>
          </TitleRow>
          <IconBtn onClick={() => fetchPackages(true)} disabled={refreshing}>
            <SpinIcon active={refreshing}>
              <RefreshCw size={14}/>
            </SpinIcon>
            {refreshing ? "Refreshing..." : "Refresh"}
          </IconBtn>
        </PageHeader>

        {/* Stats */}
        <StatsGrid>
          <Stat c="var(--primary)">  <StatNum c="var(--primary)">{stats.total}</StatNum>    <StatLabel>Total</StatLabel>     </Stat>
          <Stat c="var(--warning)">  <StatNum c="#b45309"        >{stats.pending}</StatNum>  <StatLabel>Pending</StatLabel>   </Stat>
          <Stat c="var(--success)">  <StatNum c="#059669"        >{stats.approved}</StatNum> <StatLabel>Approved</StatLabel>  </Stat>
          <Stat c="var(--danger)">   <StatNum c="var(--danger)"  >{stats.rejected}</StatNum> <StatLabel>Rejected</StatLabel>  </Stat>
        </StatsGrid>

        {/* Controls */}
        <Controls>
          <SearchBox>
            <Search size={15}/>
            <input
              placeholder="Search by package name or referrer code…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </SearchBox>
          <Select value={statusFlt} onChange={e => setStatusFlt(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </Select>
          <Select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
            {PAGE_SIZES.map(n => <option key={n} value={n}>{n} / page</option>)}
          </Select>
        </Controls>

        {/* Table */}
        <TableWrap>
          <Table>
            <THead>
              <tr>
                <TH>#</TH>
                <TH>Package Name</TH>
                <TH>Lab Name</TH>
                <TH>Tests</TH>
                <TH>Rate (₹)</TH>
                <TH>Status</TH>
                <TH>Created</TH>
                <TH>Action</TH>
              </tr>
            </THead>
            <TBody>
              {loading ? (
                Array.from({length: pageSize < 6 ? pageSize : 6}).map((_,i) => <SkeletonRow key={i}/>)
              ) : pageData.length === 0 ? (
                <EmptyRow>
                  <EmptyTd colSpan={8}>
                    <div style={{fontSize:"3rem", marginBottom:".75rem"}}>📦</div>
                    <h3>No packages found</h3>
                    <p>Try adjusting your search or filter.</p>
                  </EmptyTd>
                </EmptyRow>
              ) : (
                pageData.map((pkg, i) => {
                  const tests  = parseTests(pkg.testNames);
                  const status = pkg.status || "pending";
                  return (
                    <TR key={pkg.package_id || i} i={i}>
                      <TD style={{color:"var(--gray)", fontWeight:600}}>{(safeP-1)*pageSize + i + 1}</TD>
                      <TD>
                        <div style={{fontWeight:600, color:"var(--dark)"}}>{pkg.packageName}</div>
                        <div style={{fontSize:".74rem", color:"var(--gray)"}}>#{pkg.package_id}</div>
                      </TD>
                      <TD style={{fontWeight:600, color:"var(--dark)", fontSize:".85rem"}}>{getLabName(pkg)}</TD>
                      <TD>
                        <span style={{
                          display:"inline-block", background:"rgba(67,97,238,.08)",
                          color:"var(--primary)", borderRadius:"999px",
                          padding:".2rem .65rem", fontSize:".78rem", fontWeight:600
                        }}>
                          {tests.length} test{tests.length !== 1 ? "s" : ""}
                        </span>
                      </TD>
                      <TD style={{fontWeight:600}}>{fmtRate(pkg.rate)}</TD>
                      <TD>
                        <Badge s={status}>{statusIcon(status)} {status.charAt(0).toUpperCase()+status.slice(1)}</Badge>
                      </TD>
                      <TD style={{color:"var(--gray)", fontSize:".82rem"}}>{fmtDate(pkg.created_date)}</TD>
                      <TD>
                        <ViewBtn onClick={() => setViewPkg(pkg)}>
                          <Eye size={13}/> View
                        </ViewBtn>
                      </TD>
                    </TR>
                  );
                })
              )}
            </TBody>
          </Table>
        </TableWrap>

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <PaginationBar>
            <PgInfo>
              Showing {Math.min((safeP-1)*pageSize+1, filtered.length)}–{Math.min(safeP*pageSize, filtered.length)} of {filtered.length} packages
            </PgInfo>
            <PgBtns>
              <PgBtn onClick={() => setPage(p=>Math.max(1,p-1))} disabled={safeP===1}>
                <ChevronLeft size={15}/>
              </PgBtn>
              {safeP > 3 && <><PgBtn onClick={()=>setPage(1)}>1</PgBtn><span style={{color:"var(--gray)"}}>…</span></>}
              {pageRange().map(n => (
                <PgBtn key={n} active={n===safeP} onClick={()=>setPage(n)}>{n}</PgBtn>
              ))}
              {safeP < totalPages - 2 && <><span style={{color:"var(--gray)"}}>…</span><PgBtn onClick={()=>setPage(totalPages)}>{totalPages}</PgBtn></>}
              <PgBtn onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={safeP===totalPages}>
                <ChevronRight size={15}/>
              </PgBtn>
            </PgBtns>
          </PaginationBar>
        )}
      </Wrap>

      {/* ── View Modal ── */}
      {viewPkg && (() => {
        const tests  = parseTests(viewPkg.testNames);
        const status = viewPkg.status || "pending";
        return (
          <Overlay onClick={() => setViewPkg(null)}>
            <ModalBox onClick={e => e.stopPropagation()}>
              <ModalHead>
                <div>
                  <ModalTitle>{viewPkg.packageName}</ModalTitle>
                  <div style={{fontSize:".76rem", color:"var(--gray)", marginTop:"2px"}}>
                    Package #{viewPkg.package_id} &nbsp;·&nbsp;
                    <Badge s={status} style={{verticalAlign:"middle"}}>
                      {statusIcon(status)} {status.charAt(0).toUpperCase()+status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <CloseBtn onClick={() => setViewPkg(null)}><X size={20}/></CloseBtn>
              </ModalHead>

              <ModalBody>
                {/* Lab / Clinical Info */}
                <Section>
                  <SectionTitle><User size={14}/> Lab Information</SectionTitle>
                  <InfoGrid>
                    <InfoCell>
                      <InfoCellLabel>Referrer Code</InfoCellLabel>
                      <InfoCellValue style={{fontFamily:"monospace"}}>{viewPkg.referrerCode || "N/A"}</InfoCellValue>
                    </InfoCell>
                    <InfoCell>
                      <InfoCellLabel>Lab / Clinical Name</InfoCellLabel>
                      <InfoCellValue>{getLabName(viewPkg)}</InfoCellValue>
                    </InfoCell>
                    <InfoCell>
                      <InfoCellLabel>Created By</InfoCellLabel>
                      <InfoCellValue>{getUserName(viewPkg.created_by)}</InfoCellValue>
                    </InfoCell>
                    <InfoCell>
                      <InfoCellLabel>Created Date</InfoCellLabel>
                      <InfoCellValue>{fmtDate(viewPkg.created_date, true)}</InfoCellValue>
                    </InfoCell>
                  </InfoGrid>
                </Section>

                {/* Rates */}
                <Section>
                  <SectionTitle><DollarSign size={14}/> Rate Breakdown</SectionTitle>
                  <RateRow>
                    <RateBox><RateLabel>MRP Total</RateLabel><RateVal>{fmtRate(viewPkg.mrptotal)}</RateVal></RateBox>
                    <RateBox><RateLabel>L2L Total</RateLabel><RateVal>{fmtRate(viewPkg.l2ltotal)}</RateVal></RateBox>
                    <RateBox style={{background:"rgba(67,97,238,.06)", borderColor:"rgba(67,97,238,.2)"}}>
                      <RateLabel>Package Rate</RateLabel>
                      <RateVal style={{color:"var(--primary)"}}>{fmtRate(viewPkg.rate)}</RateVal>
                    </RateBox>
                  </RateRow>
                </Section>

                {/* Tests */}
                <Section>
                  <SectionTitle><TestTube size={14}/> Tests ({tests.length})</SectionTitle>
                  {tests.length === 0
                    ? <p style={{color:"var(--gray)", fontSize:".85rem"}}>No tests added.</p>
                    : (
                      <TestUl>
                        {tests.map((t,i) => <TestLi key={i}>{getTestName(t)}</TestLi>)}
                      </TestUl>
                    )
                  }
                </Section>

                {/* Approval/Rejection audit */}
                {status === "Approved" && (
                  <AuditBanner v="Approved">
                    <strong>✓ Approved</strong>
                    {viewPkg.approved_by && ` by ${getUserName(viewPkg.approved_by)}`}
                    {viewPkg.approved_date && ` on ${fmtDate(viewPkg.approved_date, true)}`}
                  </AuditBanner>
                )}
                {status === "Rejected" && (
                  <AuditBanner v="Rejected">
                    <strong>✗ Rejected</strong>
                    {viewPkg.rejected_by && ` by ${getUserName(viewPkg.rejected_by)}`}
                    {viewPkg.rejected_date && ` on ${fmtDate(viewPkg.rejected_date, true)}`}
                    {viewPkg.rejected_Reason && (
                      <div style={{marginTop:".4rem", fontStyle:"italic"}}>"{viewPkg.rejected_Reason}"</div>
                    )}
                  </AuditBanner>
                )}
              </ModalBody>
            </ModalBox>
          </Overlay>
        );
      })()}
    </>
  );
};

export default B2BPackageList;
