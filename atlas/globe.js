// Location Intelligence Globe Viewer
class GlobeViewer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.globe = null;
        this.countries = {};
        this.airports = {};
        this.boundaries = null;
        this.regions = null;

        this.meshes = {
            countryBoundaries: [],
            regionBoundaries: [],
            airports: [],
            capitals: []
        };

        this.settings = {
            showCountryBoundaries: true,
            showRegionBoundaries: true,
            showAirports: true,
            showCapitals: true,
            autoRotate: false
        };

        this.selectedObject = null;  // Track selected country/region

        this.init();
    }

    async init() {
        this.setupScene();
        this.createGlobe();
        this.setupEventListeners();
        this.animate();

        // Start loading data and rendering progressively
        await this.loadData();
        // Progressive rendering happens in loadData, which handles hiding the loading screen
    }

    setupScene() {
        const canvas = document.getElementById('globe');
        const container = document.getElementById('container');

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = null;

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 300;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.rotateSpeed = 0.5;
        this.controls.zoomSpeed = 0.6;
        this.controls.minDistance = 120;
        this.controls.maxDistance = 500;
        this.controls.enablePan = false;  // Disable panning for cleaner interaction

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(5, 3, 5);
        this.scene.add(directionalLight);

        // Handle resize
        window.addEventListener('resize', () => {
            const container = document.getElementById('container');
            this.camera.aspect = container.clientWidth / container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }

    createGlobe() {
        // Globe sphere
        const geometry = new THREE.SphereGeometry(100, 64, 64);
        const material = new THREE.MeshPhongMaterial({
            color: 0x2233ff,
            emissive: 0x112244,
            specular: 0x333333,
            shininess: 15,
            transparent: true,
            opacity: 0.8
        });

        this.globe = new THREE.Mesh(geometry, material);
        this.scene.add(this.globe);

        // Add atmosphere glow
        const glowGeometry = new THREE.SphereGeometry(102, 64, 64);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x3344ff,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.scene.add(glow);
    }

    updateLoadingProgress(message, progress) {
        const loadingDiv = document.getElementById('loading');
        const loadingText = loadingDiv.querySelector('div:last-child');
        const spinner = loadingDiv.querySelector('.spinner');

        if (loadingText) {
            loadingText.innerHTML = `
                <div style="margin-bottom: 8px;">${message}</div>
                <div style="font-size: 12px; opacity: 0.7;">
                    <div style="background: rgba(255,255,255,0.1); height: 4px; border-radius: 2px; overflow: hidden; margin-top: 8px;">
                        <div style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; width: ${progress}%; transition: width 0.3s;"></div>
                    </div>
                    <div style="margin-top: 4px;">${progress}% complete</div>
                </div>
            `;
        }
    }

    async loadData() {
        try {
            this.updateLoadingProgress('Loading geographic data...', 0);

            // Define all data sources with metadata
            const dataSources = [
                {
                    name: 'Countries Database',
                    url: 'resources/countries_v2.json',
                    size: '835 KB',
                    key: 'countries'
                },
                {
                    name: 'Country Boundaries',
                    url: 'resources/countries_50m.geojson',
                    size: '9.7 MB',
                    key: 'boundaries'
                },
                {
                    name: 'Regional Boundaries',
                    url: 'resources/regions_10m.geojson',
                    size: '25 MB',
                    key: 'regions'
                },
                {
                    name: 'Airports Database',
                    url: 'resources/airports_iata.json',
                    size: '2.1 MB',
                    key: 'airports'
                }
            ];

            // Load all files in parallel with progress tracking
            let completed = 0;
            const results = await Promise.all(
                dataSources.map(async (source) => {
                    this.updateLoadingProgress(`Loading ${source.name} (${source.size})...`, Math.round((completed / dataSources.length) * 100));

                    const response = await fetch(source.url);
                    const data = await response.json();

                    completed++;
                    this.updateLoadingProgress(`Loaded ${source.name}`, Math.round((completed / dataSources.length) * 100));

                    return { key: source.key, data, name: source.name };
                })
            );

            // Process loaded data
            this.updateLoadingProgress('Processing data...', 100);

            results.forEach(result => {
                switch(result.key) {
                    case 'countries':
                        this.countries = result.data.entities;
                        console.log(`✅ Loaded ${Object.keys(this.countries).length} countries`);
                        break;
                    case 'boundaries':
                        this.boundaries = result.data;
                        console.log(`✅ Loaded ${this.boundaries.features.length} country boundaries`);
                        break;
                    case 'regions':
                        this.regions = result.data;
                        console.log(`✅ Loaded ${this.regions.features.length} regional boundaries`);
                        break;
                    case 'airports':
                        this.airports = result.data.airports;
                        console.log(`✅ Loaded ${Object.keys(this.airports).length} airports`);
                        break;
                }
            });

            // Make loading screen transparent to see rendering behind it
            document.getElementById('loading').classList.add('transparent');

            // Render data progressively with delays for visual effect
            await this.renderProgressively();

        } catch (error) {
            console.error('Error loading data:', error);
            this.updateLoadingProgress(`Error: ${error.message}`, 0);
        }
    }

    async renderProgressively() {
        // Progressive rendering with aesthetic order: structure → detail

        // Step 1: Country boundaries (establish world map)
        this.updateLoadingProgress('Rendering country boundaries (242)...', 100);
        await this.delay(300);
        this.renderCountryBoundaries();

        // Step 2: Regional boundaries (add detail)
        this.updateLoadingProgress('Rendering regional boundaries (493)...', 100);
        await this.delay(500);
        this.renderRegionBoundaries();

        // Step 3: Capital cities (major landmarks)
        this.updateLoadingProgress('Rendering capital cities (235)...', 100);
        await this.delay(400);
        this.renderCapitals();

        // Step 4: Airports (final layer of detail)
        this.updateLoadingProgress('Rendering airports (7,793)...', 100);
        await this.delay(400);
        this.renderAirports();

        // Update stats
        this.updateStats();

        // Hide loading screen
        this.updateLoadingProgress('Complete!', 100);
        await this.delay(500);
        document.getElementById('loading').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
        }, 500);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    renderCountryBoundaries() {
        console.log('Rendering country boundaries...');

        for (const feature of this.boundaries.features) {
            if (feature.geometry.type !== 'Polygon' && feature.geometry.type !== 'MultiPolygon') {
                continue;
            }

            const coordinates = feature.geometry.type === 'Polygon'
                ? [feature.geometry.coordinates]
                : feature.geometry.coordinates;

            for (const polygon of coordinates) {
                const outerRing = polygon[0];
                if (outerRing.length < 3) continue;

                const points = outerRing.map(([lon, lat]) => this.latLonToVector3(lat, lon, 100.3));

                // Create triangulated filled mesh using ConvexGeometry approximation
                // For simplicity, use a triangle fan from centroid
                const centroid = new THREE.Vector3();
                points.forEach(p => centroid.add(p));
                centroid.divideScalar(points.length);

                const vertices = [];
                const indices = [];

                // Add centroid as first vertex
                vertices.push(centroid.x, centroid.y, centroid.z);

                // Add all boundary points
                points.forEach(p => {
                    vertices.push(p.x, p.y, p.z);
                });

                // Create triangle fan indices
                for (let i = 1; i < points.length; i++) {
                    indices.push(0, i, i + 1);
                }
                // Close the fan
                indices.push(0, points.length, 1);

                const geometry = new THREE.BufferGeometry();
                geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                geometry.setIndex(indices);
                geometry.computeVertexNormals();

                const fillMaterial = new THREE.MeshBasicMaterial({
                    color: 0x1a3a4a,  // Dark blue-gray fill
                    transparent: true,
                    opacity: 0.4,
                    side: THREE.DoubleSide
                });

                const fillMesh = new THREE.Mesh(geometry, fillMaterial);
                fillMesh.userData = {
                    type: 'country-boundary',
                    properties: feature.properties,
                    originalColor: 0x1a3a4a,
                    originalOpacity: 0.4
                };
                this.meshes.countryBoundaries.push(fillMesh);
                this.globe.add(fillMesh);

                // 2. Outline for visual definition
                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0x00ffff,  // Cyan outline
                    transparent: true,
                    opacity: 0.8,
                    linewidth: 2
                });

                const line = new THREE.Line(lineGeometry, lineMaterial);
                line.userData = { type: 'country-outline', properties: feature.properties };
                this.globe.add(line);
            }
        }

        console.log(`Rendered ${this.meshes.countryBoundaries.length} country boundary meshes`);
    }

    renderRegionBoundaries() {
        console.log('Rendering regional boundaries...');

        for (const feature of this.regions.features) {
            if (feature.geometry.type !== 'Polygon' && feature.geometry.type !== 'MultiPolygon') {
                continue;
            }

            const coordinates = feature.geometry.type === 'Polygon'
                ? [feature.geometry.coordinates]
                : feature.geometry.coordinates;

            for (const polygon of coordinates) {
                const outerRing = polygon[0];
                if (outerRing.length < 3) continue;

                const points = outerRing.map(([lon, lat]) => this.latLonToVector3(lat, lon, 100.2));

                // Create triangulated filled mesh
                const centroid = new THREE.Vector3();
                points.forEach(p => centroid.add(p));
                centroid.divideScalar(points.length);

                const vertices = [];
                const indices = [];

                vertices.push(centroid.x, centroid.y, centroid.z);
                points.forEach(p => {
                    vertices.push(p.x, p.y, p.z);
                });

                for (let i = 1; i < points.length; i++) {
                    indices.push(0, i, i + 1);
                }
                indices.push(0, points.length, 1);

                const geometry = new THREE.BufferGeometry();
                geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                geometry.setIndex(indices);
                geometry.computeVertexNormals();

                const fillMaterial = new THREE.MeshBasicMaterial({
                    color: 0x0a2a1a,  // Dark green fill
                    transparent: true,
                    opacity: 0.3,
                    side: THREE.DoubleSide
                });

                const fillMesh = new THREE.Mesh(geometry, fillMaterial);
                fillMesh.userData = {
                    type: 'region-boundary',
                    properties: feature.properties,
                    originalColor: 0x0a2a1a,
                    originalOpacity: 0.3
                };
                this.meshes.regionBoundaries.push(fillMesh);
                this.globe.add(fillMesh);

                // Outline
                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0x00ff00,  // Green outline
                    transparent: true,
                    opacity: 0.6,
                    linewidth: 1
                });

                const line = new THREE.Line(lineGeometry, lineMaterial);
                line.userData = { type: 'region-outline', properties: feature.properties };
                this.globe.add(line);
            }
        }

        console.log(`Rendered ${this.meshes.regionBoundaries.length} regional boundary meshes`);
    }

    renderAirports() {
        console.log('Rendering airports...');

        let count = 0;
        for (const [icao, airport] of Object.entries(this.airports)) {
            if (!airport.lat || !airport.lon) continue;

            const position = this.latLonToVector3(airport.lat, airport.lon, 100.5);

            const geometry = new THREE.SphereGeometry(0.4, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: 0xffaa00,
                transparent: true,
                opacity: 1.0
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(position);
            mesh.userData = { type: 'airport', airport };

            this.meshes.airports.push(mesh);
            this.globe.add(mesh);
            count++;
        }

        console.log(`Rendered ${count} airports`);
    }

    renderCapitals() {
        console.log('Rendering capitals...');

        let count = 0;
        for (const [code, country] of Object.entries(this.countries)) {
            const capital = country.government?.capital;
            if (!capital?.coordinates) continue;

            const { lat, lon } = capital.coordinates;
            if (!lat || !lon) continue;

            const position = this.latLonToVector3(lat, lon, 100.8);

            const geometry = new THREE.SphereGeometry(0.6, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: 0xff00ff,  // Bright magenta for capitals
                transparent: true,
                opacity: 1.0
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(position);
            mesh.userData = { type: 'capital', country, capital: capital.name };

            this.meshes.capitals.push(mesh);
            this.globe.add(mesh);
            count++;
        }

        console.log(`Rendered ${count} capitals`);
    }

    latLonToVector3(lat, lon, radius) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);

        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        return new THREE.Vector3(x, y, z);
    }

    setupEventListeners() {
        const canvas = document.getElementById('globe');
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        canvas.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, this.camera);

            // Check all meshes
            const allMeshes = [
                ...this.meshes.countryBoundaries,
                ...this.meshes.regionBoundaries,
                ...this.meshes.airports,
                ...this.meshes.capitals
            ];

            const intersects = raycaster.intersectObjects(allMeshes);

            if (intersects.length > 0) {
                const object = intersects[0].object;
                this.handleClick(object);
            } else {
                // Check if clicking on the ocean (globe itself)
                const globeIntersects = raycaster.intersectObject(this.globe);
                if (globeIntersects.length > 0) {
                    this.clearSelection();
                }
            }
        });
    }

    highlightObject(object) {
        // Clear previous selection
        if (this.selectedObject) {
            // Restore original color and opacity from userData
            const original = this.selectedObject.userData;
            if (original.originalColor !== undefined) {
                this.selectedObject.material.color.setHex(original.originalColor);
            }
            if (original.originalOpacity !== undefined) {
                this.selectedObject.material.opacity = original.originalOpacity;
            }
        }

        // Highlight new selection
        if (object) {
            this.selectedObject = object;
            // Store originals if not already stored
            if (object.userData.originalColor === undefined) {
                object.userData.originalColor = object.material.color.getHex();
            }
            if (object.userData.originalOpacity === undefined) {
                object.userData.originalOpacity = object.material.opacity;
            }
            // Apply highlight
            object.material.opacity = 0.8;
            object.material.color.setHex(0xffff00);  // Yellow highlight
        }
    }

    clearSelection() {
        // Clear highlighted object
        if (this.selectedObject) {
            const original = this.selectedObject.userData;
            if (original.originalColor !== undefined) {
                this.selectedObject.material.color.setHex(original.originalColor);
            }
            if (original.originalOpacity !== undefined) {
                this.selectedObject.material.opacity = original.originalOpacity;
            }
            this.selectedObject = null;
        }

        // Hide info panel
        const panel = document.getElementById('infoPanel');
        panel.classList.remove('visible');
    }

    handleClick(object) {
        const userData = object.userData;

        // Highlight the clicked boundary
        if (userData.type === 'country-boundary' || userData.type === 'region-boundary') {
            this.highlightObject(object);
        }

        if (userData.type === 'country-boundary') {
            const iso = (userData.properties.iso_a2 || '').replace(/\x00/g, '').trim();
            if (iso && this.countries[iso]) {
                this.showCountryInfo(iso);
            }
        } else if (userData.type === 'region-boundary') {
            const iso = (userData.properties.iso_a2 || '').replace(/\x00/g, '').trim();
            const regionCode = (userData.properties.iso_3166_2 || '').replace(/\x00/g, '').trim();
            const regionName = (userData.properties.name || '').replace(/\x00/g, '').trim();
            console.log(`Clicked region: ${regionCode} (${regionName})`);
            // Try to show parent country info with region highlighted
            if (iso && this.countries[iso]) {
                this.showCountryInfo(iso, null, regionName);
            }
        } else if (userData.type === 'airport') {
            this.showAirportInfo(userData.airport);
        } else if (userData.type === 'capital') {
            this.showCountryInfo(userData.country.code, userData.capital);
        }
    }

    showCountryInfo(isoCode, highlightCapital = null, highlightRegion = null) {
        const country = this.countries[isoCode];
        if (!country) return;

        const panel = document.getElementById('infoPanel');

        // Helper to format numbers
        const fmt = (num) => num ? num.toLocaleString() : 'N/A';

        // Population
        const pop = country.people?.population?.total;
        const popStr = fmt(pop);
        const medianAge = country.people?.median_age || null;

        // Capital
        const capitalName = country.government?.capital?.name || 'N/A';
        const capitalStyle = highlightCapital ? 'background: rgba(255, 0, 255, 0.3); padding: 2px 6px; border-radius: 4px; font-weight: bold;' : '';

        // Area
        const area = country.geography?.area;
        const totalArea = area?.total_sq_km ? `${fmt(area.total_sq_km)} km²` : 'N/A';
        const landArea = area?.land_sq_km ? `${fmt(area.land_sq_km)} km²` : null;

        // Terrain and elevation
        const terrain = country.geography?.terrain || 'N/A';
        const naturalHazards = country.geography?.natural_hazards || null;
        const environmentIssues = country.geography?.environment_issues || null;
        const elevation = country.geography?.elevation;
        const highPoint = elevation?.highest_point ? `${elevation.highest_point.name} (${fmt(elevation.highest_point.elevation_m)}m)` : null;
        const lowPoint = elevation?.lowest_point ? `${elevation.lowest_point.name} (${fmt(elevation.lowest_point.elevation_m)}m)` : null;

        // Economy
        const gdp = country.economy?.gdp?.value ? `$${fmt(country.economy.gdp.value)}` : null;
        const gdpPerCapita = country.economy?.gdp_per_capita?.value ? `$${fmt(country.economy.gdp_per_capita.value)}` : null;
        const currency = country.economy?.currency?.name || null;

        // Religions
        const religions = country.people?.religions || null;
        const nationality = country.people?.nationality || null;

        // Regions section
        let regionsHTML = '';
        if (country.regions && country.regions.length > 0) {
            regionsHTML = `
                <div class="section">
                    <div class="section-title">Subdivisions (${country.regions.length})</div>
                    <div class="regions-grid">
                        ${country.regions.map(r => `
                            <div class="region-chip">
                                <span>${r.flag}</span>
                                <span>${r.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Airports section
        let airportsHTML = '';
        if (country.airports && country.airports.length > 0) {
            airportsHTML = `
                <div class="section">
                    <div class="section-title">Major Airports (${country.airports.length})</div>
                    <div class="airports-list">
                        ${country.airports.map(a => `
                            <div class="airport-chip" title="${a.name}">${a.iata}</div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        panel.innerHTML = `
            <div class="country-header">
                <div class="country-flag">${country.flag}</div>
                <div class="country-name">
                    <h2>${country.name}</h2>
                    <div class="country-code">${country.code} • ${country.iso_a3}</div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">Geography</div>
                <div class="data-row">
                    <div class="data-label">Continent</div>
                    <div class="data-value">${country.geography?.continent || 'N/A'}</div>
                </div>
                <div class="data-row">
                    <div class="data-label">Region</div>
                    <div class="data-value">${country.geography?.region || 'N/A'}</div>
                </div>
                <div class="data-row">
                    <div class="data-label">Subregion</div>
                    <div class="data-value">${country.geography?.subregion || 'N/A'}</div>
                </div>
                <div class="data-row">
                    <div class="data-label">Total Area</div>
                    <div class="data-value">${totalArea}</div>
                </div>
                ${landArea ? `<div class="data-row">
                    <div class="data-label">Land Area</div>
                    <div class="data-value">${landArea}</div>
                </div>` : ''}
                <div class="data-row">
                    <div class="data-label">Climate</div>
                    <div class="data-value">${country.geography?.climate || 'N/A'}</div>
                </div>
                <div class="data-row">
                    <div class="data-label">Terrain</div>
                    <div class="data-value">${terrain}</div>
                </div>
                ${highPoint ? `<div class="data-row">
                    <div class="data-label">Highest Point</div>
                    <div class="data-value">${highPoint}</div>
                </div>` : ''}
                ${lowPoint ? `<div class="data-row">
                    <div class="data-label">Lowest Point</div>
                    <div class="data-value">${lowPoint}</div>
                </div>` : ''}
                ${naturalHazards ? `<div class="data-row">
                    <div class="data-label">Natural Hazards</div>
                    <div class="data-value">${naturalHazards}</div>
                </div>` : ''}
                ${environmentIssues ? `<div class="data-row">
                    <div class="data-label">Environment Issues</div>
                    <div class="data-value">${environmentIssues}</div>
                </div>` : ''}
            </div>

            <div class="section">
                <div class="section-title">People & Society</div>
                <div class="data-row">
                    <div class="data-label">Population</div>
                    <div class="data-value">${popStr}</div>
                </div>
                ${medianAge ? `<div class="data-row">
                    <div class="data-label">Median Age</div>
                    <div class="data-value">${medianAge} years</div>
                </div>` : ''}
                ${nationality ? `<div class="data-row">
                    <div class="data-label">Nationality</div>
                    <div class="data-value">${nationality}</div>
                </div>` : ''}
                <div class="data-row">
                    <div class="data-label">Languages</div>
                    <div class="data-value">${country.people?.languages || 'N/A'}</div>
                </div>
                ${religions ? `<div class="data-row">
                    <div class="data-label">Religions</div>
                    <div class="data-value">${religions}</div>
                </div>` : ''}
            </div>

            <div class="section">
                <div class="section-title">Government</div>
                <div class="data-row">
                    <div class="data-label">Capital</div>
                    <div class="data-value"><span style="${capitalStyle}">${capitalName}</span></div>
                </div>
                <div class="data-row">
                    <div class="data-label">Type</div>
                    <div class="data-value">${country.government?.type || 'N/A'}</div>
                </div>
                ${country.government?.administrative_divisions ? `<div class="data-row">
                    <div class="data-label">Administrative Divisions</div>
                    <div class="data-value">${country.government.administrative_divisions}</div>
                </div>` : ''}
            </div>

            ${gdp || gdpPerCapita || currency ? `
            <div class="section">
                <div class="section-title">Economy</div>
                ${gdp ? `<div class="data-row">
                    <div class="data-label">GDP</div>
                    <div class="data-value">${gdp}</div>
                </div>` : ''}
                ${gdpPerCapita ? `<div class="data-row">
                    <div class="data-label">GDP per Capita</div>
                    <div class="data-value">${gdpPerCapita}</div>
                </div>` : ''}
                ${currency ? `<div class="data-row">
                    <div class="data-label">Currency</div>
                    <div class="data-value">${currency}</div>
                </div>` : ''}
            </div>` : ''}

            ${regionsHTML}
            ${airportsHTML}
        `;

        panel.classList.add('visible');
    }

    showAirportInfo(airport) {
        const panel = document.getElementById('infoPanel');

        panel.innerHTML = `
            <div class="country-header">
                <div class="country-flag">✈️</div>
                <div class="country-name">
                    <h2>${airport.name}</h2>
                    <div class="country-code">${airport.iata} • ${airport.icao}</div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">Location</div>
                <div class="data-row">
                    <div class="data-label">City</div>
                    <div class="data-value">${airport.city || 'N/A'}</div>
                </div>
                <div class="data-row">
                    <div class="data-label">Country</div>
                    <div class="data-value">${airport.country || 'N/A'}</div>
                </div>
                <div class="data-row">
                    <div class="data-label">Coordinates</div>
                    <div class="data-value">${airport.lat.toFixed(4)}, ${airport.lon.toFixed(4)}</div>
                </div>
                <div class="data-row">
                    <div class="data-label">Elevation</div>
                    <div class="data-value">${airport.elevation ? airport.elevation + ' m' : 'N/A'}</div>
                </div>
            </div>
        `;

        panel.classList.add('visible');
    }

    updateStats() {
        const countryCount = Object.keys(this.countries).length;
        const airportCount = Object.keys(this.airports).length;
        const regionCount = Object.values(this.countries).reduce((sum, c) => sum + (c.regions?.length || 0), 0);
        const population = Object.values(this.countries).reduce((sum, c) => {
            const pop = c.people?.population?.total;
            return sum + (pop || 0);
        }, 0);

        document.getElementById('countryCount').textContent = countryCount.toLocaleString();
        document.getElementById('airportCount').textContent = airportCount.toLocaleString();
        document.getElementById('regionCount').textContent = regionCount.toLocaleString();
        document.getElementById('populationCount').textContent = (population / 1e9).toFixed(1) + 'B';
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.settings.autoRotate) {
            this.globe.rotation.y += 0.001;
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Control functions
function toggleBoundaries() {
    const btn = document.getElementById('toggleBoundaries');
    viewer.settings.showCountryBoundaries = !viewer.settings.showCountryBoundaries;
    viewer.settings.showRegionBoundaries = viewer.settings.showCountryBoundaries;

    viewer.meshes.countryBoundaries.forEach(mesh => {
        mesh.visible = viewer.settings.showCountryBoundaries;
    });
    viewer.meshes.regionBoundaries.forEach(mesh => {
        mesh.visible = viewer.settings.showRegionBoundaries;
    });

    btn.classList.toggle('active');
}

function toggleAirports() {
    const btn = document.getElementById('toggleAirports');
    viewer.settings.showAirports = !viewer.settings.showAirports;
    viewer.settings.showCapitals = viewer.settings.showAirports;

    viewer.meshes.airports.forEach(mesh => {
        mesh.visible = viewer.settings.showAirports;
    });
    viewer.meshes.capitals.forEach(mesh => {
        mesh.visible = viewer.settings.showCapitals;
    });

    btn.classList.toggle('active');
}

function toggleRotation() {
    const btn = document.getElementById('toggleRotation');
    viewer.settings.autoRotate = !viewer.settings.autoRotate;
    btn.classList.toggle('active');
}

// Initialize
let viewer;
window.addEventListener('DOMContentLoaded', () => {
    viewer = new GlobeViewer();
});
