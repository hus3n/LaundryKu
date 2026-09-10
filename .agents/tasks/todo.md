## Task 1: Create MongoDB Model `SuperadminConfig`
**Description:** Define a Mongoose schema for `SuperadminConfig` to store global API keys, current index for round-robin rotation, and preferred AI provider.
**Acceptance criteria:**
- [ ] File `backend/src/models-nosql/superadminConfig.model.ts` created.
- [ ] Schema contains `apiKeys` (array of strings), `currentKeyIndex` (number), `provider` (string), and standard timestamps.

## Task 2: Extend MongoDB Model `BotConfig`
**Description:** Add daily limit and tracking fields to the existing `BotConfig` model so quotas can be measured per Admin store.
**Acceptance criteria:**
- [ ] Add `isAiEnabledBySuperadmin` with default `false`.
- [ ] Add `aiDailyLimit` with default `100`.
- [ ] Add `aiUsageToday` with default `0`.
- [ ] Add `aiLastUsedDate` as a Date type.

## Checkpoint: Database Models
- [ ] Mongoose schema changes compile and do not break the existing WhatsApp MongoDB integration.

## Task 3: Build APIs for Global API Keys
**Description:** Create CRUD endpoints for Superadmins to manage their pool of AI API Keys.
**Acceptance criteria:**
- [ ] Route `GET /api/superadmin/bot-config` to fetch keys (exclude sensitive parts if necessary, or just restrict route).
- [ ] Route `POST /api/superadmin/bot-config` to update or insert keys into `SuperadminConfig`.
- [ ] Superadmin middleware applied.

## Task 4: Build APIs for AI Subscription Management
**Description:** Endpoints that allow Superadmin to view all Admins' Stores and modify their AI allowances.
**Acceptance criteria:**
- [ ] Endpoint lists all items in `BotConfig` merged with their Admin store details.
- [ ] Endpoint `PUT /api/superadmin/bot-config/admin/:adminId` allows toggling `isAiEnabledBySuperadmin` and setting `aiDailyLimit`.

## Task 5: Refactor WhatsApp Webhook AI Logic (Personality & Context Injection)
**Description:** Modify the background task handling WhatsApp messages to utilize the new centralized keys while injecting deep, store-specific personas.
**Acceptance criteria:**
- [ ] Implement checks: `isAiEnabledBySuperadmin`, lazy reset of `aiUsageToday`, limit boundaries.
- [ ] Fetch the current Admin store's dynamic data (Store Name, Active Packages/Prices, and `BotConfig.aiSystemPrompt` for custom persona).
- [ ] Construct a final `SystemPrompt` that perfectly marries the store's dynamic data with the admin's chosen personality.
- [ ] Retrieve global API Key using round-robin from `SuperadminConfig`.
- [ ] Query the LLM, respond via WhatsApp, and increment `aiUsageToday` post-completion.

## Checkpoint: Backend Functionality
- [ ] Superadmin settings can be configured via REST APIs.
- [ ] AI message handling correctly enforces limits and increments quotas.

## Task 6: Superadmin Global Config UI
**Description:** A dashboard tab for Superadmin to add/remove OpenAI/Gemini keys.
**Acceptance criteria:**
- [ ] Form in frontend `/superadmin/bot-settings` accepts multiple keys.
- [ ] Displays current active provider.

## Task 7: Superadmin Subscriptions List UI
**Description:** A dashboard page/table for Superadmin to manage Admin quotas.
**Acceptance criteria:**
- [ ] Page `/superadmin/ai-subscriptions` created.
- [ ] Lists all registered Admin stores.
- [ ] Toggle button for `isAiEnabledBySuperadmin` and numeric input for Daily Quota limits.

## Task 8: Refactor Admin Bot Settings UI
**Description:** Remove direct API Key inputs for standard Admins to match the new architecture, replacing it with a Usage widget.
**Acceptance criteria:**
- [ ] `/admin/bot-settings` updated.
- [ ] "Masukkan API Key Anda" section removed.
- [ ] Visual indicator shows "Sistem AI diatur oleh Pusat" and displays "Sisa Kuota: XX / YY limit".

## Checkpoint: Complete Setup
- [ ] End-to-end user flow operates correctly: API limits reset daily, Admins view quotas flawlessly, and WhatsApp responds according to the global round-robin keys.
