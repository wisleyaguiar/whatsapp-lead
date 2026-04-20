---

description: "Task list for Widget de Qualificacao de Leads WhatsApp Tray"
---

# Tasks: Widget de Qualificacao de Leads WhatsApp Tray

**Input**: Design documents from `/specs/001-whatsapp-lead-widget/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Required for constitution-critical behavior: phone mask, LGPD consent,
honeypot, payload shape, GTM events, webhook success/failure fallback, WhatsApp redirect
and pure business logic.

**Organization**: Tasks are grouped by user story so each story can be implemented and
tested independently.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Source code: `src/`
- Unit tests: `tests/unit/`
- Integration tests: `tests/integration/`
- Feature docs: `specs/001-whatsapp-lead-widget/`

## Phase 1: Setup

**Purpose**: Initialize the frontend widget project and test tooling.

- [ ] T001 Create package scripts and dev dependencies in package.json
- [ ] T002 Create Vite configuration for embeddable build in vite.config.js
- [ ] T003 Create Vitest configuration in vitest.config.js
- [ ] T004 Create Playwright configuration in playwright.config.js
- [ ] T005 [P] Create source directory placeholder in src/index.js
- [ ] T006 [P] Create stylesheet placeholder in src/styles.css

---

## Phase 2: Foundational

**Purpose**: Build shared modules required by all user stories.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T007 Create centralized widget configuration in src/config.js
- [ ] T008 [P] Implement phone normalization and display mask helpers in src/core/phone.js
- [ ] T009 [P] Implement lead validation helpers for name, WhatsApp, LGPD and honeypot in src/core/validation.js
- [ ] T010 [P] Implement product/global context reader without scraping in src/core/context.js
- [ ] T011 [P] Implement lead payload builder matching contracts/lead-payload.schema.json in src/core/payload.js
- [ ] T012 [P] Implement WhatsApp message and URL builder in src/core/whatsapp.js
- [ ] T013 [P] Implement safe GTM dataLayer dispatch in src/integrations/gtm.js
- [ ] T014 [P] Implement webhook client with timeout and handled fallback result in src/integrations/webhook.js
- [ ] T015 Create shared widget DOM template helpers in src/ui/template.js

**Checkpoint**: Shared configuration, validation, payload, integrations and template
helpers are ready for user stories.

---

## Phase 3: User Story 1 - Visitante inicia atendimento pelo widget global (Priority: P1)

**Goal**: Let visitors open the global floating widget, choose a support subject, submit
valid data and reach WhatsApp.

**Independent Test**: On a non-product page, open the floating button, submit a valid
lead with a global subject and verify payload, GTM events and WhatsApp message.

### Tests for User Story 1

- [ ] T016 [P] [US1] Add unit tests for phone mask and normalization in tests/unit/phone.test.js
- [ ] T017 [P] [US1] Add unit tests for global-flow validation and LGPD blocking in tests/unit/validation.test.js
- [ ] T018 [P] [US1] Add unit tests for global lead payload and WhatsApp message in tests/unit/payload.test.js
- [ ] T019 [P] [US1] Add integration test for global widget open, close and icon toggle in tests/integration/global-widget.spec.js
- [ ] T020 [P] [US1] Add integration test for valid global submission and GTM events in tests/integration/global-widget.spec.js

### Implementation for User Story 1

- [ ] T021 [US1] Implement floating widget mount and open/close state in src/ui/widget.js
- [ ] T022 [US1] Implement global subject menu and form rendering in src/ui/widget.js
- [ ] T023 [US1] Wire input masking, validation states and LGPD blocking in src/ui/widget.js
- [ ] T024 [US1] Wire global submission to payload, webhook, GTM and WhatsApp redirect in src/index.js
- [ ] T025 [US1] Add WhatsApp visual styling, slide-up and fade-in transitions in src/styles.css

**Checkpoint**: Global widget flow is complete, testable and useful as MVP.

---

## Phase 4: User Story 2 - Visitante inicia atendimento a partir de produto (Priority: P2)

**Goal**: Let visitors open the same qualification flow from a product snippet with the
current product preselected.

**Independent Test**: On a product page with `data-product-name` and `data-product-id`,
open the snippet and verify product context appears in question, payload and WhatsApp
message.

### Tests for User Story 2

- [ ] T026 [P] [US2] Add unit tests for product context extraction and global fallback in tests/unit/context.test.js
- [ ] T027 [P] [US2] Add unit tests for product payload fields in tests/unit/payload.test.js
- [ ] T028 [P] [US2] Add integration test for product snippet preselection in tests/integration/product-widget.spec.js
- [ ] T029 [P] [US2] Add integration test for missing product attributes fallback in tests/integration/product-widget.spec.js

### Implementation for User Story 2

- [ ] T030 [P] [US2] Create Tray product snippet markup in src/snippet.html
- [ ] T031 [US2] Implement product trigger discovery and click handling in src/index.js
- [ ] T032 [US2] Render product confirmation state using ContextoProduto in src/ui/widget.js
- [ ] T033 [US2] Include product name and product ID in submission flow in src/core/payload.js
- [ ] T034 [US2] Update product-flow styling and responsive spacing in src/styles.css

**Checkpoint**: Product flow works independently and falls back safely when context is
missing.

---

## Phase 5: User Story 3 - Loja registra e mede leads sem perder atendimento (Priority: P3)

**Goal**: Ensure valid leads are registered and measured when possible, while WhatsApp
still opens on handled webhook failures.

**Independent Test**: Submit one successful lead, one webhook failure, one timeout and
one honeypot submission; verify the correct registration, event and redirect behavior.

### Tests for User Story 3

- [ ] T035 [P] [US3] Add unit tests for webhook success, failure and timeout result mapping in tests/unit/webhook.test.js
- [ ] T036 [P] [US3] Add unit tests for safe GTM dispatch without dataLayer in tests/unit/gtm.test.js
- [ ] T037 [P] [US3] Add integration test for webhook success before redirect in tests/integration/webhook-fallback.spec.js
- [ ] T038 [P] [US3] Add integration test for webhook error and timeout fallback redirect in tests/integration/webhook-fallback.spec.js
- [ ] T039 [P] [US3] Add integration test for honeypot abort in tests/integration/webhook-fallback.spec.js

### Implementation for User Story 3

- [ ] T040 [US3] Enforce webhook timeout and fallback redirect orchestration in src/index.js
- [ ] T041 [US3] Prevent conclusion event and redirect for honeypot aborts in src/index.js
- [ ] T042 [US3] Add registration status handling for success, handled failure and abort in src/integrations/webhook.js
- [ ] T043 [US3] Ensure GTM start and conclusion events include context fields in src/integrations/gtm.js
- [ ] T044 [US3] Show user-friendly validation and external-failure states in src/ui/widget.js

**Checkpoint**: Registration, measurement and commercial fallback behavior are complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening, documentation and release readiness.

- [ ] T045 [P] Document configuration and Tray installation steps in README.md
- [ ] T046 [P] Document validation scenarios from quickstart.md in docs/quickstart.md
- [ ] T047 Run lint and fix style issues in src/index.js
- [ ] T048 Run unit tests and fix regressions in tests/unit/phone.test.js
- [ ] T049 Run integration tests and fix regressions in tests/integration/global-widget.spec.js
- [ ] T050 Validate contract examples against implementation in specs/001-whatsapp-lead-widget/contracts/lead-payload.schema.json
- [ ] T051 Validate mobile usability at 360px and adjust responsive CSS in src/styles.css
- [ ] T052 Build the distributable widget bundle and verify output configuration in dist/

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational; recommended MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational and can start after shared widget
  state exists from US1.
- **User Story 3 (Phase 5)**: Depends on Foundational and submission orchestration from
  US1.
- **Polish (Phase 6)**: Depends on selected stories being complete.

### User Story Dependencies

- **US1**: Delivers MVP global lead capture.
- **US2**: Adds product context; reuses widget and payload modules.
- **US3**: Hardens registration, measurement and fallback; reuses submission flow.

### Within Each User Story

- Tests MUST be written and fail before implementation.
- Unit tests for pure logic can run before integration tests.
- UI implementation comes before final integration wiring.
- Story checkpoint must pass before moving to the next priority.

### Parallel Opportunities

- T005 and T006 can run in parallel.
- T008 through T014 can run in parallel after T007.
- Test tasks within each story can run in parallel when they touch different files.
- US2 context tests and snippet markup can proceed while US1 styling is refined.
- Documentation tasks T045 and T046 can run in parallel during polish.

---

## Parallel Example: User Story 1

```bash
# Unit tests can be created together:
Task: "T016 Add unit tests for phone mask and normalization in tests/unit/phone.test.js"
Task: "T017 Add unit tests for global-flow validation and LGPD blocking in tests/unit/validation.test.js"
Task: "T018 Add unit tests for global lead payload and WhatsApp message in tests/unit/payload.test.js"

# Integration tests can be created together:
Task: "T019 Add integration test for global widget open, close and icon toggle in tests/integration/global-widget.spec.js"
Task: "T020 Add integration test for valid global submission and GTM events in tests/integration/global-widget.spec.js"
```

## Parallel Example: User Story 2

```bash
Task: "T026 Add unit tests for product context extraction and global fallback in tests/unit/context.test.js"
Task: "T030 Create Tray product snippet markup in src/snippet.html"
```

## Parallel Example: User Story 3

```bash
Task: "T035 Add unit tests for webhook success, failure and timeout result mapping in tests/unit/webhook.test.js"
Task: "T036 Add unit tests for safe GTM dispatch without dataLayer in tests/unit/gtm.test.js"
```

---

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 only.
3. Validate global widget capture, LGPD blocking, payload, GTM start/conclusion and
   WhatsApp redirect.
4. Demo the global flow before product-specific enhancements.

### Incremental Delivery

1. Deliver US1 for site-wide lead capture.
2. Add US2 for product-context leads.
3. Add US3 fallback hardening and measurement completeness.
4. Finish polish and documentation.

### Validation Gates

- All tasks follow checkbox, ID, optional [P], optional [USx] and file path format.
- Each user story has tests before implementation.
- Each user story has an independent test criterion.
- Constitution-critical behaviors are covered by explicit tasks.
