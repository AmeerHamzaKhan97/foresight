# Basic Setup 2: Tasks 5-8 (Ingestion & Frontend Features)

## Scope
This document covers the implementation of the core ingestion logic (Task 5), frontend foundation (Task 6), and the initial user-facing features for creator search and addition (Tasks 7 & 8).

---

## Task 5: Ingestion Worker Logic
**Objective**: precise implementation of the Twitter scraping and creator validation workflow.

### Detailed Steps
1.  **Scraper Service (`server/services/twitter.js`)**:
    -   **Library**: `agent-twitter-client` (or fallback to Puppeteer if needed).
    -   **Authentication**:
        -   Need valid Twitter cookies/auth string.
        -   *Strategy*: Load cookies from ENV or a secure file.
    -   **Methods**:
        -   `getProfile(handle)`: Returns profile metadata (followers, avatar).
        -   `getTweets(handle, count)`: Returns array of tweet objects.
2.  **Worker Processor (`server/workers/ingestion.js`)**:
    -   **Job Name**: `validate-creator`.
    -   **Process**:
        1.  Receive `handle`.
        2.  Call `Scraper.getProfile(handle)`.
        3.  If 404/Error -> Update Creator DB status to `ERROR`.
        4.  If Success -> Update Creator DB status to `ACTIVE`, update Metadata.
        5.  *Trigger*: Enqueue `fetch-content` job (next phase).
    -   **Concurrency**: Set to 1 or 2 initially to avoid rate limits.

### Future Impact Questions
> [!QUESTION] **Cookie Rotation Strategy**
> One account/cookie string will hit rate limits quickly (approx 50-100 requests/15 mins for some endpoints).
> *Question*: Do we need a pool of accounts now, or strictly one for MVP?
> *Impact*: A pool requires a more complex "Account Manager" service.

> [!QUESTION] **Proxy Usage**
> Scraping from a datacenter IP (like AWS/DigitalOcean) often triggers instant blocks.
> *Question*: Will we use residential proxies?
> *Impact*: Budget implication.

---

## Task 6: Frontend Foundation
**Objective**: Set up the React application shell.

### Detailed Steps
1.  **Framework config**:
    -   Vite + React.
    -   `jsconfig.json` or `tsconfig.json` paths `@/*` mapped to `src/*`.
    -   Tailwind CSS configured in `App.css`.
2.  **API Client (`client/src/lib/api.js`)**:
    -   Axios instance with `baseURL` from ENV.
    -   Global error interceptor (toast notification on 500/400 errors).
3.  **Layout Component**:
    -   Navbar: Logo (Foresight), Search Icon, "Add Creator" Button.
    -   Footer: Simple copyright/links.
    -   Main Content Wrapper: `max-w-7xl mx-auto`.

### Future Impact Questions
> [!QUESTION] **State Management**
> For MVP, React Context + React Query is sufficient.
> *Question*: Do we foresee complex global state (like user session management across many modules) that needs Redux/Zustand?
> *Recommendation*: Stick to React Query for server state.

---

## Task 7: Feature: Creator Search
**Objective**: Build the search interface (User Story 1.1).

### Detailed Steps
1.  **Search Component (`SearchBar.jsx`)**:
    -   Input field with debounce (300ms).
    -   On type: Cleanse input (remove `@`, spaces).
2.  **Results Page/Dropdown**:
    -   If valid handle found in DB: Show "View Profile" card.
    -   If NOT found: Show "Creator not found in our database. [Add them now]" prompt.
3.  **Routing**:
    -   `/search?q=...`
    -   Clicking result goes to `/creator/:handle`.

### Future Impact Questions
> [!QUESTION] **Search UX**
> Should we allow searching by partial name (regex search) or strict handle match?
> *Impact*: Partial search is expensive on MongoDB without specific text indexes (Atlas Search). Strict handle match is O(1) fast.

---

## Task 8: Feature: Add Creator
**Objective**: Build the creation flow (User Story 1.2).

### Detailed Steps
1.  **Add Creator Modal/Page**:
    -   Input: URL or Handle.
    -   Validation: Regex for twitter URL `^https?://(www\.)?x\.com/([a-zA-Z0-9_]+)`.
2.  **Submission Logic**:
    -   `POST /api/creators`.
    -   On Success (200 OK): Redirect user to `/creator/:handle` which should show a "Scanning in progress..." skeleton state.
3.  **Polling/Real-time**:
    -   The UI needs to know when the background worker finishes validation.
    -   *MVP*: Poll `GET /api/creators/:handle` every 5 seconds until status changes from `PENDING` to `ACTIVE` or `ERROR`.

### Future Impact Questions
> [!QUESTION] **Websockets vs Polling**
> *Question*: Should we implement Socket.io now for real-time updates?
> *Recommendation*: For MVP, Polling is simpler and robust enough. Websockets add deployment complexity (sticky sessions).

