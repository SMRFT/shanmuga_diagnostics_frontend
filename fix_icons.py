import re
import sys

file_path = 'src/Components/Navbar/Sidebar.js'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# First, update imports
fa_import_pattern = re.compile(r'(import \{[^}]*?)(?=\} from "react-icons/fa";)', re.DOTALL)

new_icons = [
    'FaTruck', 'FaRoute', 'FaChartLine', 'FaNotesMedical', 'FaMoneyBillWave',
    'FaFileMedicalAlt', 'FaBuilding', 'FaCalculator', 'FaVials', 'FaHandHoldingUsd',
    'FaCoins', 'FaCheckDouble', 'FaMapMarkedAlt', 'FaHistory', 'FaBook'
]

def update_imports(match):
    existing = match.group(1)
    for icon in new_icons:
        if icon not in existing:
            existing += f',\n  {icon}'
    return existing + '\n'

text = fa_import_pattern.sub(update_imports, text)

# Define replacements (Label, OldIcon, NewIcon)
replacements = [
    ('Logistics', 'FaWpforms', 'FaTruck'),
    ('Route Master', 'FaMap', 'FaRoute'),
    ('Report Dashboard', 'GrOverview', 'FaChartLine'),
    ('Patient Summary', 'DollarSign', 'FaNotesMedical'),
    ('Payment Dashboard', 'DollarSign', 'FaMoneyBillWave'),
    ('Billing Dashboard', 'GrOverview', 'FaFileInvoiceDollar'),
    ('Test Edit', 'GrOverview', 'FaEdit'),
    ('MIS Report', 'GrOverview', 'FaFileMedicalAlt'),
    ('MIS', 'GrOverview', 'FaFileMedicalAlt'),
    ('B2B Test Count', 'GrOverview', 'FaVials'),
    ('HMS Test Count', 'GrOverview', 'FaVials'),
    ('Sales', 'TbReport', 'FaHandHoldingUsd'),
    ('Finance', 'FaFileInvoiceDollar', 'FaCoins'),
    ('B2B Master', 'GrOverview', 'FaBuilding'),
    ('Corporate Report Approval', 'GrOverview', 'FaCheckDouble'),
    ('Tracking History', 'FaMapMarkerAlt', 'FaHistory'),
    ('Logistics Tracking', 'FaMapMarkerAlt', 'FaMapMarkedAlt'),
    ('Bill Estimate', 'FaDollarSign', 'FaCalculator'),
    ('Ledger Balance', 'GrOverview', 'FaBook')
]

for label, old_icon, new_icon in replacements:
    # We want to replace <OldIcon /> followed by the exact label
    # Use a regex that allows variable whitespace and newlines
    pattern_str = r'(<IconWrapper>\s*)<' + old_icon + r'(\s*/>\s*</IconWrapper>\s*)' + re.escape(label)
    
    def replacer(m):
        return m.group(1) + '<' + new_icon + m.group(2) + label
        
    text = re.sub(pattern_str, replacer, text)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Icons replaced successfully")
