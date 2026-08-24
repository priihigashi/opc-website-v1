#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================
user_problem_statement: >
  OPC website launch-today package on repo priihigashi/opc-website-v1, base
  feat/services-headline-2026-08-23 @ d3ccb1d. Working branch
  launch/opc-launch-today-2026-08-24. 10 items: entry-point collapse, 3D
  first-frame startup gate, homepage glitch proof, selective portfolio t204
  reconciliation (13 verified projects), portfolio truth (Opa Locka=CONCRETE),
  portfolio mobile/image presentation, privacy/rate-limit digest fix, full
  release audit, one Vercel preview, stop before production.

backend:
  - task: "Contact API rate limiter keys on IP digest, not raw IP (api/enquiries.mjs)"
    implemented: true
    working: true
    file: "frontend/api/enquiries.mjs"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "rateLimited(ip) -> rateLimited(tag); tag is the salted SHA-256 4-byte digest already computed. All 49 node:test API tests pass (yarn test:api). NOTE: the API is Vercel serverless (frontend/api/*.mjs, tested via node --test), NOT the FastAPI stub in /app/backend. There is no running /api server in this dev environment."
      - working: true
        agent: "testing"
        comment: "VERIFIED: All 49 API tests pass. All 10 contract tests pass. Behavioral verification confirms: (1) Same IP allows 5 POSTs then 429s the 6th with code 'rate_limited', (2) Different IPs have isolated buckets, (3) Console.warn logs contain 8-hex-char digest (e.g., ip=bae90e5c) and NEVER the raw IP string. No hardcoded secrets found - only .env.example with empty values. Rate limiter correctly keys on salted SHA-256 digest matching privacy disclosure."

frontend:
  - task: "Entry-point collapse: index.js -> AppV3 only; orphan App.js/AppV2.js deleted"
    implemented: true
    working: true
    file: "frontend/src/index.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "10/10 contract tests pass; all routes preserved."
  - task: "3D startup gate: first-real-render-frame readiness + 15s failsafe (DeferredHouseStageV5)"
    implemented: true
    working: true
    file: "frontend/src/components/DeferredHouseStageV5.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Intro-timer condition removed. Reveal ~1s after first real frame (window.__dbg from HouseModel useFrame, 2 rAF confirmations). Verified: desktop, mobile 390px, reduced-motion (static only, no canvas), WebGL-failure (static stays, no crash), no overflow, no glitch through first scroll."
      - working: true
        agent: "testing"
        comment: "VERIFIED: Static fallback bug fix working correctly. All 6 scenarios tested: (1) Desktop normal load: Static (scale 0.56, shifted right) replaced by 3D in ~2s, opacity transition correct. (2) Mobile normal load: Static (scale 0.82, centered below headline) replaced by 3D successfully. (3) Reduced motion desktop: Static permanent with data-static-reason='prefers-static', house NOT zoomed full-screen, headline 'ONE TEAM / Every detail' fully visible, correct scale 0.56. (4) Reduced motion mobile: Static centered below headline, scale 0.82, no horizontal overflow. (5) WebGL failure: Static remains visible, data-static-reason correctly changes to 'webgl-failed' after 15s failsafe, page content intact. React dev error overlay appears (expected in dev mode only, not in production). (6) No console page errors except expected WebGL context error in test 5. Bug fix CONFIRMED: Static image no longer zoomed full-screen, properly scaled and positioned to match 3D hero."
  - task: "Portfolio: 13 verified projects, PortfolioPicture AVIF/WebP/JPEG, portrait-safe, phase chips, Opa Locka=CONCRETE"
    implemented: true
    working: true
    file: "frontend/src/pages/PortfolioV7.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "948 media derivatives verified on disk (0 missing). Fixed live-chain crash: seoSchemasV1.js allProjectImages still destructured old [src,alt] tuples. Sitemap regenerated (25 urls), vercel.json rewrites rebuilt for 13 project SEO pages, collection routes 301->/portfolio. Hero montage v5 + headline style preserved."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 1
  run_ui: false

test_plan:
  current_focus:
    - "Contact API rate limiter keys on IP digest, not raw IP (api/enquiries.mjs)"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: >
      Backend scope is ONLY the Vercel serverless function frontend/api/enquiries.mjs
      and its libs, tested with 'cd /app/frontend && node --test api/_tests/*.test.mjs'.
      Do NOT test the FastAPI stub in /app/backend (not part of the site) and do not
      curl localhost:8001. Verify the digest rate-limit change behaviorally by importing
      the handler in a node test harness: same client IP allows 5 POSTs then 429s the
      6th, log lines contain the 8-hex-char digest and never the raw IP, and validation/
      spam/config_pending/mail-fallback paths still behave (already covered by the 49
      existing tests). Also run 'node --test src/__contract__/*.test.mjs'.
  - agent: "testing"
    message: >
      TESTING COMPLETE - ALL PASS. Verified rate limiter privacy fix: (1) 49 API tests pass,
      (2) 10 contract tests pass, (3) Behavioral tests confirm rate limiting works correctly
      with IP digest keys (5 allowed, 6th is 429), (4) Logs show only 8-hex digest, never
      raw IP, (5) No hardcoded secrets in codebase. Implementation correctly matches privacy
      disclosure. Ready for main agent to summarize and finish.
  - agent: "testing"
    message: >
      LAUNCH VERIFICATION COMPLETE (8 comprehensive tests executed). ALL TESTS PASS:
      ✓ T-258 Chapter panel choreography: All 5 chapters show correct opacity transitions at exact scroll positions, panels positioned beside house without overlap.
      ✓ T-230 Shell bones: 3D house correctly renders structural bones (grey piers with voids, lime columns/beams, visible slabs) - NOT a solid block.
      ✓ T-196 Grill/white-top regression: No floating white countertop/grill artifacts at p=0.76 or p=0.80 during outdoor element retraction.
      ✓ T-197 Hero overlay: Hero house clearly visible (interactive gate opacity=1), headline text visible, no heavy dark overlay blocking view.
      ✓ First-frame gate: Interactive 3D house loads and reaches opacity-100 (verified on desktop 1440x900 and mobile 390x844), no blank page, no horizontal overflow, no console errors.
      ✓ T-259 Portfolio grid: All filters correct (FULL HOME REMODELS: 2 std cards equal width, SHELL+NEW BUILD: 1 wide+2 std, CONCRETE: 3 cards including opa-locka-airport, ADDITIONS: 1 single centered ~900px, ALL: 13 cards no orphan). Mobile: all single column 4:3 aspect, no horizontal overflow.
      ✓ T-188 Services flash: Navigation to service detail works, no blocking issues detected.
      ✓ Project gallery: Images load correctly, phase chips visible (26 found), no horizontal overflow on mobile 390x844.
      Site is launch-ready. All critical 3D choreography, portfolio presentation, and first-load performance requirements verified.
  - agent: "testing"
    message: >
      STATIC FALLBACK BUG FIX VERIFICATION COMPLETE. User-reported bug "static image shows very zoomed in and can't be deactivated" is FIXED. All 6 test scenarios PASS: (1) Desktop normal: Static replaced by 3D in 2s with correct opacity transitions. (2) Mobile normal: Static replaced by 3D successfully. (3) Reduced motion desktop: Static permanent (data-static-reason='prefers-static'), house at scale 0.56 positioned right-center, NOT full-screen zoomed, headline fully visible. (4) Reduced motion mobile: Static at scale 0.82 centered below headline, no overflow. (5) WebGL failure: Static remains visible, data-static-reason='webgl-failed' after 15s, page functional (React dev error overlay appears in dev mode only, not production). (6) No console errors except expected WebGL context error in test 5. Fix confirmed working as designed.

frontend:
  - task: "T-261 batch: T-230 shell bones, T-258 panel choreography, T-259 grid balance, T-234 first-frame gate, static-fallback zoom fix"
    implemented: true
    working: true
    file: "frontend/src/three/parts/Shell.jsx, frontend/src/components/ChapterV3.jsx, frontend/src/pages/PortfolioV7.jsx, frontend/src/components/DeferredHouseStageV5.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "testing"
        comment: "All 8 T-261 acceptance tests pass (panels windows on 5 chapters, shell bones, T-196/T-197/T-188 reverified, first-frame gate desktop+mobile, portfolio grid rules all filters+mobile, victoria gallery). User-reported zoomed static fallback fixed and verified in 6 scenarios incl. reduced-motion, WebGL failure, normal loads."
