# Roadmap API Testing Implementation Plan

## Overview
Automated testing suite for the Atlas Logged roadmap system to validate API performance optimizations and ensure correct functionality.

## Implementation Checklist

### Phase 1: API Functional Tests (Priority 1)
- [x] Create test folder structure
- [ ] Set up Jest testing framework
- [ ] Create API test helpers (`test/api/helpers.js`)
- [ ] Test voting functionality
  - [ ] Vote increments count
  - [ ] Prevent duplicate votes (24h cooldown)
  - [ ] Sync localStorage on "already voted" error
  - [ ] Unvote decrements count
  - [ ] Votes never go negative
- [ ] Test caching behavior
  - [ ] Return cached data on second request
  - [ ] Update cache on vote (not invalidate)
  - [ ] Cache row lookups for 1 hour
- [ ] Test feature submission
  - [ ] Add feature to sheet successfully
  - [ ] Enforce rate limiting (1/hour)
  - [ ] Validate title length (<100 chars)
  - [ ] Validate description length (<500 chars)
- [ ] Run tests and validate all pass

**Estimated Time:** 2-3 hours

### Phase 2: Performance Benchmarks (Priority 1)
- [ ] Create benchmark script (`test/benchmark/benchmark-api.js`)
- [ ] Implement timing measurements
  - [ ] Cold start (first request after 20 min idle)
  - [ ] Warm container (immediate follow-up)
  - [ ] Vote on feature (first time)
  - [ ] Vote on feature (cached row)
  - [ ] Get feature list (cache hit)
  - [ ] Get feature list (cache miss)
- [ ] Create results comparison tool
- [ ] Generate baseline metrics
- [ ] Validate optimizations show improvement
  - [ ] First vote: ~33% faster
  - [ ] Warm vote: ~50% faster
  - [ ] Cached row: ~67% faster
  - [ ] Feature list after vote: ~90% faster

**Estimated Time:** 1-2 hours

### Phase 3: E2E Tests (Priority 2)
- [ ] Set up Playwright
- [ ] Test voting flow end-to-end
  - [ ] Instant feedback when voting
  - [ ] Handle "already voted" gracefully
  - [ ] Show subtle inline errors
- [ ] Test feature submission flow
  - [ ] Submit feature with badge
- [ ] Test performance
  - [ ] Page loads in <3 seconds
  - [ ] Voting feels responsive (<500ms UI feedback)

**Estimated Time:** 2-3 hours

### Phase 4: Load Testing (Priority 3)
- [ ] Set up k6 load testing tool
- [ ] Create spike test scenario
- [ ] Create sustained load scenario
- [ ] Validate API handles 50 concurrent users
- [ ] Document breaking points

**Estimated Time:** 1 hour

### Phase 5: CI/CD Integration (Priority 3)
- [ ] Create GitHub Actions workflow
- [ ] Run API tests on every PR
- [ ] Run benchmarks daily
- [ ] Alert on performance regressions
- [ ] Block deployment if tests fail

**Estimated Time:** 1 hour

---

## Test Scenarios

### API Functional Tests

#### Voting API
```javascript
describe('Voting API', () => {
  // Vote increments count
  // Prevent duplicate votes
  // Sync localStorage on server rejection
  // Unvote decrements count
  // Votes never go negative
});
```

#### Caching
```javascript
describe('Cache Behavior', () => {
  // Return cached data on second request
  // Update cache on vote (don't invalidate)
  // Cache row lookups for 1 hour
});
```

#### Feature Submission
```javascript
describe('Feature Submission', () => {
  // Add feature to sheet
  // Rate limiting (1/hour)
  // Validate title length
  // Validate description length
});
```

### Performance Benchmarks

**Metrics to track:**
- Time to First Byte (TTFB)
- Total request time
- Cache hit/miss rates

**Scenarios:**
1. Cold start - first request after 20 min idle
2. Warm container - immediate follow-up request
3. Vote on feature (first time)
4. Vote on feature (cached row)
5. Get feature list (cache hit)
6. Get feature list (cache miss)
7. Submit new feature

**Expected Results:**
```
┌─────────────────────────────────┬──────────┬──────────┬──────────┐
│ Scenario                        │ Min      │ Avg      │ Max      │
├─────────────────────────────────┼──────────┼──────────┼──────────┤
│ Cold start                      │ 1247ms   │ 1856ms   │ 2943ms   │
│ Warm container                  │ 456ms    │ 623ms    │ 891ms    │
│ Vote (first time)               │ 678ms    │ 734ms    │ 856ms    │
│ Vote (cached row)               │ 289ms    │ 412ms    │ 567ms    │
│ Get features (cache hit)        │ 67ms     │ 89ms     │ 134ms    │
│ Get features (cache miss)       │ 745ms    │ 823ms    │ 945ms    │
└─────────────────────────────────┴──────────┴──────────┴──────────┘
```

---

## File Structure

```
test/
├── TESTING-PLAN.md              # This file
├── api/
│   ├── voting.test.js          # Voting tests
│   ├── caching.test.js         # Cache tests
│   ├── feature-submission.test.js  # Submission tests
│   └── helpers.js              # Test utilities
├── benchmark/
│   ├── benchmark-api.js        # Main benchmark script
│   ├── compare-benchmarks.js   # Results comparison
│   └── check-regression.js     # Regression detector
├── e2e/                         # (Phase 3)
│   ├── voting.spec.js
│   ├── feature-submission.spec.js
│   └── performance.spec.js
├── load/                        # (Phase 4)
│   ├── voting-spike.js
│   └── sustained-load.js
└── results/
    ├── baseline.json           # Initial benchmark
    └── benchmark-YYYY-MM-DD.json  # Historical data
```

---

## Running Tests

### API Functional Tests
```bash
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm test -- --coverage     # Coverage report
npm test voting            # Run specific test
```

### Performance Benchmarks
```bash
npm run benchmark          # Run benchmark suite
npm run benchmark:compare  # Compare with baseline
```

### E2E Tests (Phase 3)
```bash
npx playwright test
npx playwright test --ui
```

### Load Tests (Phase 4)
```bash
k6 run test/load/voting-spike.js
```

---

## Success Criteria

### API Tests (Phase 1)
- ✅ All tests pass
- ✅ 80%+ code coverage
- ✅ Tests complete in <30 seconds

### Benchmarks (Phase 2)
- ✅ Baseline metrics established
- ✅ Optimizations show expected improvements:
  - First vote: 33% faster
  - Warm vote: 50% faster
  - Cached row: 67% faster
  - Feature list after vote: 90% faster

### E2E Tests (Phase 3)
- ✅ Critical user paths tested
- ✅ Tests run on Chrome, Firefox, Safari
- ✅ Visual regression detection working

### Load Tests (Phase 4)
- ✅ System handles 50 concurrent users
- ✅ 95% of requests complete in <2s
- ✅ <10% failure rate

---

## Next Steps

1. ✅ Create test folder structure
2. ⏳ Implement Phase 1: API Functional Tests
3. ⏳ Implement Phase 2: Performance Benchmarks
4. ⏳ Validate tests work correctly
5. ⏸️ Move to Phase 3 when Phase 1 & 2 complete
