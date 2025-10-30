# CIA World Factbook Data Coverage

This document details exactly what data fields from the CIA World Factbook are included and excluded in our location intelligence database.

## Data Source

- **Source**: CIA World Factbook (via [factbook.json](https://github.com/factbook/factbook.json))
- **Update Frequency**: Weekly (from upstream repository)
- **Countries Covered**: 235+ sovereign nations and territories
- **Extraction Script**: `scripts/04_extract_factbook_iso.py`

---

## ✅ Included Fields

### Geography Section

| Field | Example (United States) | Notes |
|-------|------------------------|-------|
| **Location** | "North America, bordering both the North Atlantic Ocean and the North Pacific Ocean, between Canada and Mexico" | Descriptive text |
| **Coordinates** | "38 00 N, 97 00 W" | Geographic center point |
| **Total Area** | 9,833,517 km² | Total land + water area |
| **Land Area** | 9,147,593 km² | Land area only |
| **Water Area** | 685,924 km² | Water area only |
| **Climate** | "mostly temperate, but tropical in Hawaii and Florida, arctic in Alaska..." | Detailed climate description |
| **Terrain** | "vast central plain, mountains in west, hills and low mountains in east..." | Landscape description |
| **Highest Point** | "Mount McKinley 6,190 m" | Elevation with name |
| **Lowest Point** | "Death Valley -86 m" | Elevation with name |
| **Mean Elevation** | "760 m" | Average elevation |
| **Natural Resources** | "coal, copper, lead, molybdenum, phosphates, rare earth elements..." | Text list |

### People & Society Section

| Field | Example (United States) | Notes |
|-------|------------------------|-------|
| **Total Population** | 341,963,408 | Current estimate |
| **Male Population** | 168,598,780 | Gender breakdown |
| **Female Population** | 173,364,628 | Gender breakdown |
| **Nationality** | "American(s)" | Noun form |
| **Languages** | "English only (official) 78.2%, Spanish 13.4%, Chinese 1.1%, other 7.3% (2017 est.)" | With percentages |
| **Religions** | "Protestant 46.5%, Roman Catholic 20.8%, Jewish 1.9%, Church of Jesus Christ 1.6%..." | With percentages |

### Government Section

| Field | Example (United States) | Notes |
|-------|------------------------|-------|
| **Country Name** | "United States of America" | Conventional long form |
| **Government Type** | "constitutional federal republic" | Classification |
| **Capital Name** | "Washington, D.C." | City name |
| **Capital Coordinates** | "38 53 N, 77 02 W" | Lat/lon |
| **Capital Time Difference** | "UTC-5" | Timezone offset |
| **Independence Date** | "4 July 1776 (declared independence from Great Britain)" | With context |
| **National Holiday** | "Independence Day, 4 July (1776)" | Name and date |

### Economy Section

| Field | Example (United States) | Notes |
|-------|------------------------|-------|
| **GDP (PPP)** | $25,035,000,000,000 | Real GDP purchasing power parity |
| **GDP per Capita** | $73,143 | Per person |
| **Currency Name** | "US dollar" | Official currency |
| **Currency Code** | "USD" | ISO 4217 code |
| **Currency Symbol** | "$" | Symbol |
| **Industries** | "highly diversified, world leading, high-technology innovator..." | Text description |

---

## ❌ Excluded Fields

### Geography (Not Included)

- ❌ Land boundaries (km with neighbor countries)
- ❌ Coastline length
- ❌ Maritime claims (territorial sea, contiguous zone, EEZ)
- ❌ Land use breakdown (agricultural land %, forest %, other %)
- ❌ Irrigated land area
- ❌ Natural hazards (earthquakes, typhoons, etc.)
- ❌ Current environment issues
- ❌ International environment agreements
- ❌ Geographic notes

**Reason for exclusion**: Technical/specialized data less relevant for general audience.

### People & Society (Not Included)

- ❌ Age structure (0-14, 15-24, 25-54, 55-64, 65+ years)
- ❌ Dependency ratios
- ❌ Median age
- ❌ Birth rate (births/1,000 population)
- ❌ Death rate (deaths/1,000 population)
- ❌ Net migration rate
- ❌ Population distribution
- ❌ Urbanization rate and major cities
- ❌ Sex ratio (by age group)
- ❌ Mother's mean age at first birth
- ❌ Maternal mortality rate
- ❌ Infant mortality rate
- ❌ Life expectancy at birth
- ❌ Total fertility rate
- ❌ Contraceptive prevalence rate
- ❌ Drinking water source
- ❌ Health expenditures (% of GDP)
- ❌ Physicians density
- ❌ Hospital bed density
- ❌ Sanitation facility access
- ❌ HIV/AIDS prevalence
- ❌ Obesity rate
- ❌ Alcohol consumption
- ❌ Tobacco use
- ❌ Children under 5 underweight
- ❌ Education expenditures (% of GDP)
- ❌ Literacy rate
- ❌ School life expectancy
- ❌ Ethnic groups breakdown

**Reason for exclusion**: Detailed demographic statistics better suited for specialized databases.

### Government (Not Included)

- ❌ Administrative divisions (states, provinces, etc.)
- ❌ Dependent areas
- ❌ Legal system description
- ❌ International law organization participation
- ❌ Citizenship requirements
- ❌ Suffrage age and type
- ❌ Executive branch (chief of state, head of government, cabinet)
- ❌ Legislative branch (structure, election dates)
- ❌ Judicial branch (highest courts, judge selection)
- ❌ Political parties and leaders
- ❌ International organization participation
- ❌ Diplomatic representation
- ❌ Flag description
- ❌ National symbols (animal, colors)
- ❌ National anthem

**Reason for exclusion**: Detailed political/administrative data that changes frequently and is less relevant for geographic visualization.

### Economy (Not Included)

- ❌ GDP growth rate
- ❌ GDP composition by sector (agriculture, industry, services)
- ❌ GDP composition by end use
- ❌ Agriculture products
- ❌ Labor force size
- ❌ Labor force by occupation
- ❌ Unemployment rate
- ❌ Youth unemployment rate
- ❌ Population below poverty line
- ❌ Gini index (income inequality)
- ❌ Household income distribution
- ❌ Budget (revenues and expenditures)
- ❌ Taxes and other revenues (% of GDP)
- ❌ Budget surplus/deficit
- ❌ Public debt (% of GDP)
- ❌ Fiscal year
- ❌ Current account balance
- ❌ Inflation rate
- ❌ Credit ratings
- ❌ Central bank discount rate
- ❌ Commercial bank prime lending rate
- ❌ Stock of narrow/broad money
- ❌ Stock of domestic credit
- ❌ Market value of publicly traded shares
- ❌ Exports (value, partners, commodities)
- ❌ Imports (value, partners, commodities)
- ❌ Reserves of foreign exchange and gold
- ❌ Debt - external
- ❌ Stock of direct foreign investment

**Reason for exclusion**: Complex economic indicators that require context and frequent updates; better suited for financial/economic databases.

### Energy (Completely Omitted)

- ❌ Electricity access
- ❌ Electricity production/consumption
- ❌ Electricity generation by source (fossil, nuclear, hydro, solar, wind)
- ❌ Crude oil production/exports/imports/reserves
- ❌ Refined petroleum production/consumption/exports/imports
- ❌ Natural gas production/consumption/exports/imports/reserves
- ❌ Carbon dioxide emissions

**Reason for exclusion**: Specialized energy data better suited for environmental/energy databases.

### Communications (Completely Omitted)

- ❌ Telephones - fixed lines
- ❌ Telephones - mobile cellular
- ❌ Telephone system description
- ❌ Broadcast media
- ❌ Internet country code
- ❌ Internet users
- ❌ Broadband subscriptions

**Reason for exclusion**: Rapidly changing telecommunications data; not relevant for geographic visualization.

### Transportation (Completely Omitted)

- ❌ National air transport system
- ❌ Civil aircraft registration
- ❌ Airports (total count and breakdown by type)
- ❌ Heliports
- ❌ Pipelines
- ❌ Railways (total km, standard/narrow/broad gauge)
- ❌ Roadways (total km, paved/unpaved)
- ❌ Waterways
- ❌ Merchant marine (ships by type)
- ❌ Ports and terminals

**Reason for exclusion**: Infrastructure data that overlaps with our airports dataset; other transport data less relevant for general audience.

### Military & Security (Completely Omitted)

- ❌ Military and security forces
- ❌ Military expenditures (% of GDP)
- ❌ Military and security service personnel strengths
- ❌ Military equipment inventories and acquisitions
- ❌ Military service age and obligation
- ❌ Military deployments
- ❌ Military - note

**Reason for exclusion**: Sensitive security data not appropriate for general geographic visualization tool.

### Transnational Issues (Completely Omitted)

- ❌ Disputes - international
- ❌ Refugees and internally displaced persons
- ❌ Trafficking in persons
- ❌ Illicit drugs

**Reason for exclusion**: Sensitive political/social issues requiring careful context and frequent updates.

### Terrorism (Completely Omitted)

- ❌ Terrorist groups
- ❌ Terrorist group activities

**Reason for exclusion**: Sensitive security information not appropriate for this application.

---

## Data Processing Notes

### FIPS to ISO Code Mapping
The CIA Factbook uses FIPS country codes (obsolete), so we convert to modern ISO 3166-1 alpha-2 codes:
- **UK (FIPS)** → **GB (ISO)** = United Kingdom
- **GM (FIPS)** → **DE (ISO)** = Germany
- **JA (FIPS)** → **JP (ISO)** = Japan

### HTML Tag Stripping
All text fields have HTML tags removed (e.g., `<strong>`, `<em>`) for clean display.

### Number Parsing
Numeric values are extracted from text where possible:
- "9,833,517 sq km" → `9833517`
- "$25.035 trillion" → `25035000000000`

### Missing Data
When data is unavailable for a field, it's stored as:
- `null` for single values
- `None` in Python processing
- `'N/A'` in UI display

---

## Coverage Statistics

**Total Data Included**: ~30% of CIA Factbook

**Fields per Country**:
- Geography: 11 fields
- People & Society: 6 fields
- Government: 7 fields
- Economy: 6 fields

**Total**: 30 fields per country

---

## Future Expansion Possibilities

Fields that could be added if needed:

**High Priority** (useful for general audience):
- Major cities and urban areas
- Time zones
- Ethnic groups breakdown
- Age structure (basic)

**Medium Priority** (some user interest):
- Land boundaries with neighbors
- Coastline length
- Life expectancy
- Literacy rate

**Low Priority** (specialized interest):
- Environment issues
- Natural hazards
- Administrative divisions

---

## Data Quality Notes

### Known Limitations

1. **Update Lag**: Data is updated weekly from CIA Factbook, but original CIA data may lag behind real-time events
2. **GDP Values**: Many countries show `null` for GDP due to inconsistent formatting in source data
3. **Currency Data**: Currency names often incomplete in source data
4. **Null Bytes**: Some text fields contain null bytes from fixed-width string padding in Natural Earth data (cleaned during processing)

### Validation

All extracted data is validated against:
- ISO 3166-1 alpha-2 country codes (242 countries)
- FIPS to ISO mapping (ensures correct country identification)
- Natural Earth boundaries (ensures geographic match)

---

## Example: Full Country Data Structure

```json
{
  "US": {
    "code": "US",
    "iso_a3": "USA",
    "name": "United States of America",
    "flag": "🇺🇸",
    "geography": {
      "continent": "North America",
      "region": "Americas",
      "subregion": "Northern America",
      "location": "North America, bordering both the North Atlantic Ocean...",
      "coordinates": "38 00 N, 97 00 W",
      "area": {
        "total_sq_km": 9833517,
        "land_sq_km": 9147593,
        "water_sq_km": 685924,
        "note": "includes only the 50 states and District of Columbia..."
      },
      "climate": "mostly temperate, but tropical in Hawaii and Florida...",
      "terrain": "vast central plain, mountains in west, hills and low...",
      "elevation": {
        "highest_point": "Mount McKinley 6,190 m",
        "lowest_point": "Death Valley -86 m",
        "mean_elevation": "760 m"
      },
      "natural_resources": "coal, copper, lead, molybdenum, phosphates..."
    },
    "people": {
      "population": {
        "total": 341963408,
        "male": 168598780,
        "female": 173364628
      },
      "nationality": "American(s)",
      "languages": "English only (official) 78.2%, Spanish 13.4%...",
      "religions": "Protestant 46.5%, Roman Catholic 20.8%..."
    },
    "government": {
      "name": "United States of America",
      "type": "constitutional federal republic",
      "capital": {
        "name": "Washington, D.C.",
        "coordinates": "38 53 N, 77 02 W",
        "time_difference": "UTC-5"
      },
      "independence": "4 July 1776 (declared independence from Great Britain)",
      "national_holiday": "Independence Day, 4 July (1776)"
    },
    "economy": {
      "gdp": {
        "value": null,
        "note": "data in 2021 dollars"
      },
      "gdp_per_capita": null,
      "currency": {
        "name": null,
        "code": null,
        "symbol": null
      },
      "industries": "highly diversified, world leading..."
    },
    "regions": [
      {"code": "US-CA", "name": "California", "flag": "🏴"},
      {"code": "US-TX", "name": "Texas", "flag": "🏴"},
      ...
    ],
    "airports": [
      {"iata": "JFK", "icao": "KJFK", "name": "John F. Kennedy International Airport", "city": "New York"},
      ...
    ],
    "metadata": {
      "has_factbook": true,
      "has_boundary": true,
      "has_regions": true,
      "airport_count": 10
    }
  }
}
```

---

## Related Documentation

- [DATA_SOURCES.md](DATA_SOURCES.md) - Complete attribution and licensing
- [ATTRIBUTIONS.md](ATTRIBUTIONS.md) - Full credits for all data sources
- [README.md](../README.md) - Project overview and setup
- [MASTER_PLAN.md](MASTER_PLAN.md) - Overall project architecture

---

*Last Updated: October 2025*
*Data Version: CIA World Factbook (via factbook.json, updated weekly)*
