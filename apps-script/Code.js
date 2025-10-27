// ========================================
// Atlas Logged Roadmap API
// Complete script with setup function
// ========================================

// CONFIGURATION
const SHEET_NAME = 'Features';
const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;
const VOTE_COOLDOWN_HOURS = 24;
const SUBMIT_COOLDOWN_HOURS = 1;

// ========================================
// ONE-TIME SETUP FUNCTION
// Run this ONCE after deploying to populate sheet
// ========================================

function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  } else {
    // Clear existing data
    sheet.clear();
  }

  // Set up headers
  const headers = ['ID', 'Title', 'Description', 'Votes', 'Status', 'Submitted', 'Email'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Format headers
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#4A90E2')
    .setFontColor('#FFFFFF');

  // Freeze header row
  sheet.setFrozenRows(1);

  // Set column widths
  sheet.setColumnWidth(1, 50);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 350);
  sheet.setColumnWidth(4, 80);
  sheet.setColumnWidth(5, 120);
  sheet.setColumnWidth(6, 150);
  sheet.setColumnWidth(7, 200);

  // Add data validation for Status column
  const statusValues = [
    'Under Review',
    'Prioritising',
    'Planned',
    'In Progress',
    'Completed',
    'Exploring',
    'Declined'
  ];

  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(statusValues)
    .build();

  sheet.getRange('E:E').setDataValidation(statusRule);

  // Populate with existing roadmap data
  const features = [
    [1, 'Dark Mode', 'Add a dark theme option for better viewing at night and reduced eye strain', 42, 'Under Review', new Date('2025-01-15'), 'Anonymous'],
    [2, 'Custom Tags', 'Let users add custom tags to locations like business trip or vacation', 38, 'Under Review', new Date('2025-01-14'), 'Anonymous'],
    [3, 'Export to CSV', 'Export all location data as CSV file for analysis in Excel or Numbers', 29, 'Under Review', new Date('2025-01-13'), 'Anonymous'],
    [4, 'Smart Notifications', 'Get notified when you visit a new country or city for the first time', 15, 'Under Review', new Date('2025-01-12'), 'Anonymous'],
    [5, 'Custom Map Styles', 'Choose different map visual styles like satellite terrain or vintage', 12, 'Under Review', new Date('2025-01-11'), 'Anonymous'],
    [6, 'Year in Review', 'Beautiful annual summary of your travels with stats and highlights', 156, 'Prioritising', new Date('2025-01-10'), 'Anonymous'],
    [7, 'Travel Goals', 'Set goals like visit 50 countries and track progress', 89, 'Prioritising', new Date('2025-01-09'), 'Anonymous'],
    [8, 'Timeline View', 'View your travel history as an interactive timeline', 67, 'Prioritising', new Date('2025-01-08'), 'Anonymous'],
    [9, 'Smart Predictions', 'AI-powered predictions of your next destination based on travel patterns', 234, 'Planned', new Date('2025-01-07'), 'Anonymous'],
    [10, 'Visa Tracking', 'Never overstay! Get warnings before reaching visa time limits', 189, 'Planned', new Date('2025-01-06'), 'Anonymous'],
    [11, 'Premium Features', 'Early access to new features before general release', 145, 'Planned', new Date('2025-01-05'), 'Anonymous'],
    [12, 'Advanced Notes', 'Rich notes with timestamps for each location and journey', 98, 'Planned', new Date('2025-01-04'), 'Anonymous'],
    [13, 'Photo Integration', 'Import your travel history from photo metadata in your camera roll', 312, 'In Progress', new Date('2024-12-20'), 'Anonymous'],
    [14, 'Performance Boost', 'Faster app launch and smoother scrolling even with years of data', 267, 'In Progress', new Date('2024-12-19'), 'Anonymous'],
    [15, 'Enhanced Stats', 'More detailed insights into your travel patterns and history', 201, 'In Progress', new Date('2024-12-18'), 'Anonymous'],
    [16, 'Mac App', 'Full-featured desktop companion for macOS', 567, 'Exploring', new Date('2024-12-15'), 'Anonymous'],
    [17, 'Family Sharing', 'Share and coordinate travels with family members', 234, 'Exploring', new Date('2024-12-14'), 'Anonymous'],
    [18, 'Third-Party Integrations', 'Connect with calendar expense and health apps', 178, 'Exploring', new Date('2024-12-13'), 'Anonymous'],
    [19, 'Web Dashboard', 'View your travel history from any browser', 445, 'Exploring', new Date('2024-12-12'), 'Anonymous'],
    [20, 'Travel Planner', 'Plan your future travels and visualize upcoming journeys', 445, 'Completed', new Date('2024-11-15'), 'Anonymous'],
    [21, 'iCloud Sync', 'Free file-based sync and premium automatic CloudKit sync', 389, 'Completed', new Date('2024-11-14'), 'Anonymous'],
    [22, 'Arabic Support', 'Complete right-to-left interface for Arabic speakers', 156, 'Completed', new Date('2024-10-20'), 'Anonymous'],
    [23, 'Map View', 'Visualize your travels on an interactive map', 523, 'Completed', new Date('2024-09-15'), 'Anonymous']
  ];

  // Add all features to sheet
  if (features.length > 0) {
    sheet.getRange(2, 1, features.length, 7).setValues(features);
  }

  // Format votes column as numbers
  sheet.getRange('D:D').setNumberFormat('#,##0');

  // Format date column
  sheet.getRange('F:F').setNumberFormat('yyyy-mm-dd hh:mm:ss');

  // Add alternating row colors for readability
  const dataRange = sheet.getRange(2, 1, features.length, 7);
  dataRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);

  Logger.log('Sheet setup complete! Added ' + features.length + ' features.');
}

// ========================================
// API ENDPOINTS
// ========================================

// Handle CORS preflight requests
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type')
    .setHeader('Access-Control-Max-Age', '86400');
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (!data.title || !data.description) {
      return createResponse(false, 'Title and description are required');
    }

    if (data.title.length > MAX_TITLE_LENGTH) {
      return createResponse(false, 'Title must be less than ' + MAX_TITLE_LENGTH + ' characters');
    }

    if (data.description.length > MAX_DESCRIPTION_LENGTH) {
      return createResponse(false, 'Description must be less than ' + MAX_DESCRIPTION_LENGTH + ' characters');
    }

    const userHash = getUserHash(e);
    const cache = CacheService.getScriptCache();

    if (cache.get('submit_' + userHash)) {
      return createResponse(false, 'Please wait before submitting another feature');
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const lastRow = sheet.getLastRow();
    const newId = lastRow;

    sheet.appendRow([
      newId,
      data.title,
      data.description,
      0,
      'Under Review',
      new Date(),
      data.email || 'Anonymous'
    ]);

    cache.put('submit_' + userHash, 'true', SUBMIT_COOLDOWN_HOURS * 3600);

    // Invalidate feature list cache since we added a new feature
    cache.remove('feature_list');
    Logger.log('Cache invalidated after new submission');

    return createResponse(true, 'Feature submitted successfully!', { id: newId });

  } catch (error) {
    Logger.log('Error in doPost: ' + error);
    return createResponse(false, 'An error occurred. Please try again.');
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;

    if (action === 'vote') {
      return handleVote(e);
    }

    if (action === 'unvote') {
      return handleUnvote(e);
    }

    // Try to get cached feature list
    const cache = CacheService.getScriptCache();
    const cachedData = cache.get('feature_list');

    if (cachedData) {
      Logger.log('Returning cached feature list');
      return ContentService
        .createTextOutput(cachedData)
        .setMimeType(ContentService.MimeType.JSON)
        .setHeader('Access-Control-Allow-Origin', '*')
        .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        .setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }

    // Cache miss - fetch from sheet
    Logger.log('Cache miss - fetching from sheet');
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      return createResponse(true, 'No features yet', []);
    }

    const rows = data.slice(1);

    const features = rows.map(function(row) {
      return {
        id: row[0],
        title: row[1],
        description: row[2],
        votes: row[3] || 0,
        status: row[4],
        submitted: row[5],
        email: row[6]
      };
    })
    .filter(function(f) {
      return f.status !== 'Declined';
    })
    .sort(function(a, b) {
      return b.votes - a.votes;
    });

    // Cache for 5 minutes (300 seconds)
    const response = createResponse(true, 'Features retrieved', features);
    const responseText = response.getContent();
    cache.put('feature_list', responseText, 300);

    return response;

  } catch (error) {
    Logger.log('Error in doGet: ' + error);
    return createResponse(false, 'An error occurred');
  }
}

function handleVote(e) {
  try {
    const featureId = parseInt(e.parameter.id);

    if (!featureId) {
      return createResponse(false, 'Invalid feature ID');
    }

    const userHash = getUserHash(e);
    const voteKey = 'vote_' + userHash + '_' + featureId;
    const cache = CacheService.getScriptCache();

    if (cache.get(voteKey)) {
      return createResponse(false, 'You already voted for this feature');
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === featureId) {
        const currentVotes = data[i][3] || 0;
        const newVotes = currentVotes + 1;

        sheet.getRange(i + 1, 4).setValue(newVotes);

        cache.put(voteKey, 'true', VOTE_COOLDOWN_HOURS * 3600);

        // Invalidate feature list cache since vote count changed
        cache.remove('feature_list');
        Logger.log('Cache invalidated after vote');

        return createResponse(true, 'Vote recorded!', {
          featureId: featureId,
          newVotes: newVotes
        });
      }
    }

    return createResponse(false, 'Feature not found');

  } catch (error) {
    Logger.log('Error in handleVote: ' + error);
    return createResponse(false, 'Voting error');
  }
}

function handleUnvote(e) {
  try {
    const featureId = parseInt(e.parameter.id);

    if (!featureId) {
      return createResponse(false, 'Invalid feature ID');
    }

    const userHash = getUserHash(e);
    const voteKey = 'vote_' + userHash + '_' + featureId;
    const cache = CacheService.getScriptCache();

    if (!cache.get(voteKey)) {
      return createResponse(false, 'You have not voted for this feature');
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === featureId) {
        const currentVotes = data[i][3] || 0;
        const newVotes = Math.max(0, currentVotes - 1);

        sheet.getRange(i + 1, 4).setValue(newVotes);

        cache.remove(voteKey);

        // Invalidate feature list cache since vote count changed
        cache.remove('feature_list');
        Logger.log('Cache invalidated after unvote');

        return createResponse(true, 'Vote removed!', {
          featureId: featureId,
          newVotes: newVotes
        });
      }
    }

    return createResponse(false, 'Feature not found');

  } catch (error) {
    Logger.log('Error in handleUnvote: ' + error);
    return createResponse(false, 'Unvoting error');
  }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function getUserHash(e) {
  const userAgent = e.parameter.userAgent || 'unknown';
  const ipAddress = e.parameter.ipAddress || 'unknown';

  const hash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.MD5,
    userAgent + ipAddress
  );

  return hash.map(function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}

function createResponse(success, message, data) {
  const response = {
    success: success,
    message: message
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
