// ========================================
// Atlas Logged Roadmap API Integration
// Connects roadmap.html to Google Sheets
// ========================================

const API_URL = 'https://script.google.com/macros/s/AKfycbxTt6OqQBMj5DeSmQ-yMMUrnAvcuKQJa-pNx7h8KNgAp37PR8GsfaCkQIqOH3vWhWQ-/exec';

// Emoji mapping for feature titles
const EMOJI_MAP = {
    'Dark Mode': '🌙',
    'Custom Tags': '🏷️',
    'Export to CSV': '📤',
    'Smart Notifications': '🔔',
    'Custom Map Styles': '🎨',
    'Year in Review': '📊',
    'Travel Goals': '🎯',
    'Timeline View': '🗓️',
    'Smart Predictions': '🤖',
    'Visa Tracking': '✈️',
    'Premium Features': '💰',
    'Advanced Notes': '📝',
    'Photo Integration': '📸',
    'Performance Boost': '⚡',
    'Enhanced Stats': '📊',
    'Mac App': '🖥️',
    'Family Sharing': '👪',
    'Third-Party Integrations': '🔌',
    'Web Dashboard': '🌐',
    'Travel Planner': '📅',
    'iCloud Sync': '☁️',
    'Arabic Support': '🌍',
    'Map View': '🗺️'
};

// Status to column mapping
const STATUS_COLUMNS = {
    'Under Review': 'community-requests',
    'Prioritising': 'prioritising',
    'Planned': 'planned',
    'In Progress': 'building',
    'Completed': 'completed',
    'Exploring': 'exploring'
};

// ========================================
// FETCH FEATURES FROM API
// ========================================

async function loadRoadmapFeatures() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (!result.success) {
            console.error('API error:', result.message);
            return;
        }

        const features = result.data;
        console.log('Loaded', features.length, 'features from API');

        // Clear existing static content
        clearStaticFeatures();

        // Group features by status
        const grouped = groupFeaturesByStatus(features);

        // Render each column
        renderColumn('community-requests', grouped['Under Review'] || []);
        renderColumn('prioritising', grouped['Prioritising'] || []);
        renderColumn('planned', grouped['Planned'] || []);
        renderColumn('building', grouped['In Progress'] || []);
        renderColumn('exploring', grouped['Exploring'] || []);

        // Render delivered timeline
        renderDeliveredTimeline(grouped['Completed'] || []);

        // Restore voted state
        if (typeof restoreVotedState === 'function') {
            restoreVotedState();
        }

    } catch (error) {
        console.error('Error loading features:', error);
    }
}

// ========================================
// GROUP FEATURES BY STATUS
// ========================================

function groupFeaturesByStatus(features) {
    const grouped = {};

    features.forEach(feature => {
        const status = feature.status;
        if (!grouped[status]) {
            grouped[status] = [];
        }
        grouped[status].push(feature);
    });

    return grouped;
}

// ========================================
// CLEAR STATIC FEATURES
// ========================================

function clearStaticFeatures() {
    const columns = [
        'community-requests',
        'prioritising',
        'planned',
        'building',
        'exploring'
    ];

    columns.forEach(columnId => {
        const container = document.querySelector(`[data-column="${columnId}"] .feature-cards`);
        if (container) {
            container.innerHTML = '';
        }
    });
}

// ========================================
// RENDER COLUMN
// ========================================

function renderColumn(columnId, features) {
    const container = document.querySelector(`[data-column="${columnId}"] .feature-cards`);
    if (!container) {
        console.warn('Column not found:', columnId);
        return;
    }

    // Update count
    const countElem = document.querySelector(`[data-column="${columnId}"] .column-count`);
    if (countElem) {
        countElem.textContent = features.length + ' ' + (features.length === 1 ? 'feature' : 'features');
    }

    // Render cards
    features.forEach(feature => {
        const card = createFeatureCard(feature, columnId);
        container.appendChild(card);
    });
}

// ========================================
// CREATE FEATURE CARD
// ========================================

function createFeatureCard(feature, columnId) {
    const card = document.createElement('div');
    card.className = 'feature-card';
    card.dataset.featureId = feature.id;

    const emoji = EMOJI_MAP[feature.title] || '✨';
    const isFrozen = feature.status === 'In Progress' || feature.status === 'Completed';

    card.innerHTML = `
        <h4>${emoji} ${feature.title}</h4>
        <p>${feature.description}</p>
        <div class="vote-section">
            <button class="vote-button ${isFrozen ? 'frozen' : ''}"
                    ${isFrozen ? 'disabled' : ''}
                    onclick="voteForFeature(${feature.id}, this)">
                ${isFrozen ? '🔒 Frozen' : '⬆️ Vote'}
            </button>
            <span class="vote-count">${feature.votes} votes</span>
        </div>
    `;

    return card;
}

// ========================================
// RENDER DELIVERED TIMELINE
// ========================================

function renderDeliveredTimeline(completedFeatures) {
    const timeline = document.querySelector('.delivered-timeline');
    if (!timeline) return;

    // Clear existing content except the changelog link
    const changelogLink = timeline.querySelector('.view-changelog-link');
    timeline.innerHTML = '';

    // Group by version (we'll just group by month for now)
    const byMonth = {};

    completedFeatures.forEach(feature => {
        const date = new Date(feature.submitted);
        const monthKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        if (!byMonth[monthKey]) {
            byMonth[monthKey] = {
                date: date,
                features: []
            };
        }
        byMonth[monthKey].features.push(feature);
    });

    // Sort by date (newest first)
    const sortedMonths = Object.entries(byMonth).sort((a, b) => b[1].date - a[1].date);

    // Render each release group
    sortedMonths.forEach(([monthKey, data], index) => {
        const releaseGroup = document.createElement('div');
        releaseGroup.className = 'release-group';

        const header = document.createElement('div');
        header.className = 'release-header';
        header.innerHTML = `
            <h3 class="release-version">Released ${monthKey}</h3>
            <p class="release-date">${data.features.length} feature${data.features.length !== 1 ? 's' : ''}</p>
        `;
        releaseGroup.appendChild(header);

        const featuresContainer = document.createElement('div');
        featuresContainer.className = 'release-features';

        data.features.forEach(feature => {
            const emoji = EMOJI_MAP[feature.title] || '✨';
            const card = document.createElement('div');
            card.className = 'delivered-card';
            card.innerHTML = `
                <h4>${emoji} ${feature.title}</h4>
                <p>${feature.description}</p>
                <div class="final-votes">
                    ✅ ${feature.votes} community votes
                </div>
            `;
            featuresContainer.appendChild(card);
        });

        releaseGroup.appendChild(featuresContainer);
        timeline.appendChild(releaseGroup);
    });

    // Re-add changelog link
    if (changelogLink) {
        const linkWrapper = document.createElement('div');
        linkWrapper.style.textAlign = 'center';
        linkWrapper.style.marginTop = '3rem';
        linkWrapper.appendChild(changelogLink.cloneNode(true));
        timeline.appendChild(linkWrapper);
    } else {
        const linkWrapper = document.createElement('div');
        linkWrapper.style.textAlign = 'center';
        linkWrapper.style.marginTop = '3rem';
        linkWrapper.innerHTML = `
            <a href="changelog.html" class="view-changelog-link">
                View Full Changelog →
            </a>
        `;
        timeline.appendChild(linkWrapper);
    }
}

// ========================================
// VOTE FOR FEATURE (REAL API CALL)
// ========================================

async function voteForFeature(featureId, button) {
    // Ignore frozen buttons
    if (button.disabled || button.classList.contains('frozen')) {
        return;
    }

    const votedFeatures = getVotedFeatures();
    const isVoted = button.classList.contains('voted');

    try {
        if (isVoted) {
            // UNVOTE - Remove vote
            const response = await fetch(`${API_URL}?action=unvote&id=${featureId}&userAgent=${navigator.userAgent}&ipAddress=unknown`);
            const result = await response.json();

            if (result.success) {
                // Remove from localStorage
                const index = votedFeatures.indexOf(featureId);
                if (index > -1) {
                    votedFeatures.splice(index, 1);
                    saveVotedFeatures(votedFeatures);
                }

                // Update button
                button.classList.remove('voted');
                button.innerHTML = '⬆️ Vote';

                // Update vote count
                const voteCount = button.parentElement.querySelector('.vote-count');
                if (voteCount) {
                    voteCount.textContent = result.data.newVotes + ' votes';
                }

                console.log('Vote removed:', result.data);
            } else {
                alert(result.message);
            }
        } else {
            // VOTE - Add vote
            const response = await fetch(`${API_URL}?action=vote&id=${featureId}&userAgent=${navigator.userAgent}&ipAddress=unknown`);
            const result = await response.json();

            if (result.success) {
                // Update localStorage
                votedFeatures.push(featureId);
                saveVotedFeatures(votedFeatures);

                // Update button
                button.classList.add('voted');
                button.innerHTML = '✅ Voted';

                // Update vote count
                const voteCount = button.parentElement.querySelector('.vote-count');
                if (voteCount) {
                    voteCount.textContent = result.data.newVotes + ' votes';
                }

                console.log('Vote recorded:', result.data);
            } else {
                alert(result.message);
            }
        }
    } catch (error) {
        console.error('Error voting:', error);
        alert('Voting failed. Please try again.');
    }
}

// ========================================
// SUBMIT NEW FEATURE (REAL API CALL)
// ========================================

async function submitFeature(title, description, email) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description,
                email: email || 'Anonymous'
            })
        });

        const result = await response.json();

        if (result.success) {
            console.log('Feature submitted:', result.data);
            // Reload features to show new submission
            setTimeout(() => loadRoadmapFeatures(), 1000);
            return true;
        } else {
            alert(result.message);
            return false;
        }
    } catch (error) {
        console.error('Error submitting feature:', error);
        alert('Submission failed. Please try again.');
        return false;
    }
}

// ========================================
// LOAD ON PAGE READY
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    loadRoadmapFeatures();
});
