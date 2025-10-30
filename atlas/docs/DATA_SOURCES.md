# Data Sources & Licenses

**Last Updated:** October 30, 2025

This document tracks all external data sources used in the Location Intelligence System, their licenses, attribution requirements, and update schedules.

---

## 1. Natural Earth Data

### Overview
- **Provider**: Natural Earth
- **Website**: https://www.naturalearthdata.com/
- **Description**: Public domain map dataset available at 1:10m, 1:50m, and 1:110m scales
- **License**: **Public Domain** (no restrictions)
- **Attribution**: Not required but appreciated

### Files We Use

#### Countries (50m scale)
- **URL**: https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/50m/cultural/ne_50m_admin_0_countries.zip
- **Version**: 5.1.2 (current)
- **File**: `ne_50m_admin_0_countries.shp` + supporting files
- **Size**: 23.6 MB (unzipped)
- **Coverage**: 247 countries with ISO codes
- **Use**: Country-level boundary detection

#### Sovereignty (50m scale)
- **URL**: https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/50m/cultural/ne_50m_admin_0_sovereignty.zip
- **Version**: 5.1.2
- **File**: `ne_50m_admin_0_sovereignty.shp`
- **Size**: 21.4 MB
- **Coverage**: Sovereign states (handles UK as single entity)
- **Use**: Understanding sovereign state relationships

#### States/Provinces (10m scale)
- **URL**: https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_1_states_provinces.zip
- **Version**: 5.1.2
- **File**: `ne_10m_admin_1_states_provinces.shp`
- **Size**: 53.2 MB
- **Coverage**: Sub-national regions (states, provinces, etc.)
- **Use**: Region detection (Wales, Scotland, Catalonia, etc.)

### License Text
```
All versions of Natural Earth raster + vector map data found on this website
are in the public domain. You may use the maps in any manner, including modifying
the content and design, electronic dissemination, and offset printing. The authors
provide no warranty for any use of the data, but if you encounter any errors or
omissions please report them to naturalearth@googlegroups.com
```

### Update Frequency
- **Natural Earth releases**: Annually (typically March/April)
- **Our update schedule**: With major app versions or as needed
- **Last checked**: October 30, 2025

---

## 2. Airport Database (mwgg/Airports)

### Overview
- **Provider**: mwgg (GitHub)
- **Repository**: https://github.com/mwgg/Airports
- **Description**: JSON database of 28k+ airports with ICAO/IATA codes
- **License**: **MIT License**
- **Attribution**: Not required but encouraged

### Files We Use

#### Main Airport Database
- **URL**: https://raw.githubusercontent.com/mwgg/Airports/master/airports.json
- **Current Version**: v2025.10.27 (October 27, 2025)
- **Size**: 5.8 MB
- **Format**: JSON (ICAO code keys)
- **Coverage**: 28,853 airports worldwide
  - ~11,000 with IATA codes (commercial airports)
  - ~18,000 ICAO-only (small/private/military)

### Data Fields
```json
{
  "ICAO": {
    "icao": "EGLL",
    "iata": "LHR",
    "name": "London Heathrow Airport",
    "city": "London",
    "state": "England",
    "country": "GB",
    "elevation": 83,
    "lat": 51.4706,
    "lon": -0.461941,
    "tz": "Europe/London"
  }
}
```

### MIT License
```
Copyright (c) mwgg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

### Data Sources (Upstream)
- **Timezone data**: TimeAPI (https://timeapi.io)
- **Airport data**: Various open sources, curated by community
- **Contributors**: 43 contributors on GitHub

### Update Frequency
- **Repository updates**: Monthly (tagged releases)
- **Our update schedule**: Quarterly or with app updates
- **Last synced**: October 30, 2025 (v2025.10.27)

---

## 3. CIA World Factbook

### Overview
- **Provider**: Central Intelligence Agency (US Government)
- **Website**: https://www.cia.gov/the-world-factbook/
- **Description**: Comprehensive country profiles with geography, demographics, government, economy
- **License**: **Public Domain** (US Government work)
- **Attribution**: Not required

### Data We Extract

#### Categories
1. **Geography**
   - Area (land, water, total)
   - Climate description
   - Terrain description
   - Elevation extremes
   - Natural resources

2. **People & Society**
   - Population
   - Languages
   - Religions
   - Life expectancy
   - Literacy rate

3. **Government**
   - Government type
   - Capital city
   - Independence date
   - National holidays
   - Legal system

4. **Economy**
   - GDP
   - Currency
   - Major industries
   - Exports/imports

### Access Method
- **Option 1**: Manual extraction from website (free, always current)
- **Option 2**: JSON dumps from third parties (may be outdated)
- **Recommended**: Use https://github.com/factbook/factbook.json (community maintained)

### Factbook.json Repository
- **URL**: https://github.com/factbook/factbook.json
- **License**: Public Domain
- **Format**: JSON files per country
- **Last Updated**: 2021 (Note: Outdated, may need manual updates)
- **Coverage**: ~260 countries/territories

### Update Frequency
- **CIA publishes**: Weekly (web updates)
- **factbook.json**: Sporadic (last 2021)
- **Our approach**: Extract fresh data manually for major countries, use 2021 data as baseline
- **Update schedule**: Annually or as needed

### Attribution
Not required, but ethical to note:
```
Data sourced from CIA World Factbook (Public Domain)
https://www.cia.gov/the-world-factbook/
```

---

## 4. Existing Atlas Logged Data

### Overview
- **Source**: Internal (`Atlas Logged/Utilities/CountryDetails.swift`)
- **License**: Internal/Proprietary
- **Coverage**: 247 countries
- **Purpose**: Migration baseline and validation

### Current Data Structure
```swift
let countryDetails: [String: (
    flag: String,
    name: String,
    capital: String,
    latitude: Double,
    longitude: Double,
    airport: String,
    iataCode: String,
    airportLatitude: Double,
    airportLongitude: Double,
    altitude: Double
)]
```

### What We'll Preserve
- ✅ All country ISO codes
- ✅ Capital city coordinates (validated)
- ✅ Primary airport per country
- ✅ Emoji flags
- ✅ Country names (English)

### What We'll Enhance
- ➕ Add sub-regions (Wales, Scotland, etc.)
- ➕ Add multiple airports per country
- ➕ Add rich metadata (CIA Factbook)
- ➕ Add travel advice
- ➕ Add boundary polygons

---

## 5. Future Data Sources (Planned)

### OurAirports
- **URL**: https://ourairports.com/data/
- **License**: Public Domain (CC0)
- **Coverage**: 76,000+ airports
- **Use**: Supplement mwgg/Airports with heliports, seaplane bases
- **Status**: Optional enhancement

### UN M49 Country Codes
- **URL**: https://unstats.un.org/unsd/methodology/m49/
- **License**: Public Domain
- **Use**: Additional country code validation
- **Status**: Reference only

### Travel.State.Gov (US State Department)
- **URL**: https://travel.state.gov/
- **License**: Public Domain (US Government)
- **Use**: Safety warnings, travel advisories
- **Status**: Future integration (API available)

---

## Attribution in App

### "About" Screen Text (Proposed)

```
Geographic Data Sources:

Natural Earth (Public Domain)
https://www.naturalearthdata.com/
Country and region boundary data

mwgg/Airports (MIT License)
https://github.com/mwgg/Airports
Comprehensive airport database

CIA World Factbook (Public Domain)
https://www.cia.gov/the-world-factbook/
Country demographics and statistics

All data processed and curated by Atlas Logged
```

---

## Data Quality & Validation

### Known Issues

#### Natural Earth
- ✅ Disputed territories handled neutrally
- ⚠️ Some small islands may be missing at 50m scale
- ⚠️ Borders reflect de facto control, not political claims

#### mwgg/Airports
- ✅ Actively maintained, high quality
- ⚠️ Small airports may have inaccurate coordinates
- ⚠️ Some IATA codes may be historical/inactive

#### CIA Factbook
- ✅ Authoritative for most data
- ⚠️ Political bias (US Government source)
- ⚠️ Some population estimates may be outdated

### Our Validation Process
1. Cross-reference country codes across all sources
2. Validate coordinates (capitals, airports within country boundaries)
3. Check for duplicates and conflicts
4. Manual spot-checks for major cities
5. Automated tests for data integrity

---

## Legal Compliance

### Privacy
- ✅ No personal data collected
- ✅ No user tracking
- ✅ All data is public domain or openly licensed
- ✅ Offline-first (no data sent to servers)

### Export Restrictions
- ✅ Geographic data: No restrictions
- ✅ App distribution: Worldwide (no ITAR concerns)

### GDPR/Privacy Laws
- ✅ No data processing of EU citizens
- ✅ No cookies or tracking
- ✅ User data stays on device

---

## Maintenance Schedule

### Monthly
- [ ] Check mwgg/Airports for updates

### Quarterly
- [ ] Review Natural Earth for new releases
- [ ] Update major airport list if needed

### Annually
- [ ] Full data refresh from all sources
- [ ] Validate all coordinates and metadata
- [ ] Update CIA Factbook data for major countries

### As Needed
- [ ] New country formations (Kosovo, South Sudan, etc.)
- [ ] Disputed territory changes
- [ ] Major airport openings/closures

---

## Contact & Support

### Natural Earth
- **Email**: naturalearth@googlegroups.com
- **Forum**: Google Groups
- **Issues**: Report data errors to mailing list

### mwgg/Airports
- **GitHub**: https://github.com/mwgg/Airports/issues
- **Maintainer**: Active on GitHub

### CIA Factbook
- **No direct support**: Public information
- **Errors**: Report via website feedback form

---

**Last Review:** October 30, 2025
**Next Review:** January 30, 2026
**Maintained By:** Atlas Logged Development Team
