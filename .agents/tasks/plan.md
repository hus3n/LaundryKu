# Implementation Plan: Universal AI WhatsApp Bot

## Overview
Implement a centralized AI WhatsApp Bot feature where the Superadmin manages a global, round-robin API key system. Store Admins can subscribe to use the AI bot without managing their own keys. The system includes strict daily quota limits per Admin, lazy quota resets, backend verification of subscriptions, and seamless fallback to manual replies via WhatsApp when quotas are exhausted.

## Architecture Decisions
1. **Schema Updates (MongoDB Setup)**
   - Instead of breaking PostgreSQL schema, we will add quota tracking fields to the existing MongoDB `BotConfig` schema: `isAiEnabledBySuperadmin`, `aiDailyLimit`, `aiUsageToday`, `aiLastUsedDate`.
   - Create a new MongoDB model, `SuperadminConfig`, to securely store the pool of API Keys (`apiKeys` array), current index for round-robin (`currentApiKeyIndex`), and default provider.
2. **Lazy Token Resets**
   - No cron jobs required. Upon receiving an inbound WhatsApp message, the webhook will check `aiLastUsedDate`. If the date is older than today, it resets `aiUsageToday` to 0. 
3. **Usage Enforcement & Fallback**
   - If an Admin is not authorized (`isAiEnabledBySuperadmin = false`) or quota is exceeded (`aiUsageToday >= aiDailyLimit`), the AI module will instantly abort, and the message will gracefully fall back to the store's normal flow (wait for manual reply or static greeting).
4. **Context Engineering & Store Personality (Dynamic Prompting)**
   - Even though the API Key is global, **the "brain" of the AI is intensely localized for each store**. 
   - **How it works:** When a WhatsApp message arrives, the Webhook fetches the corresponding Admin's profile from PostgreSQL (Store Name, Address, Operating Hours) and their Services/Packages (List of Prices).
   - This dynamic data is appended seamlessly behind the scenes to the `BotConfig.aiSystemPrompt` (which the admin can customize, e.g., *"Gunakan bahasa gaul Jakarta"*).
   - The final injected prompt passed to the LLM ensures the AI completely adopts the specific context, identity, pricing, and personality of that exact branch without hallucinating global data.

## Task List

### Phase 1: Database & Core Models
- [ ] Task 1: Create MongoDB Model `SuperadminConfig` for storing global API keys and Provider info.
- [ ] Task 2: Extend MongoDB Model `BotConfig` to add fields: `isAiEnabledBySuperadmin` (boolean), `aiDailyLimit` (number, default 100), `aiUsageToday` (number, default 0), and `aiLastUsedDate` (date).

### Checkpoint: Database Models
- [ ] Mongoose schema changes compile and do not break the existing WhatsApp MongoDB integration.

### Phase 2: Backend Controllers & APIs
- [ ] Task 3: Build backend endpoints (`GET` / `POST` / `PUT`) for Superadmin to manage the Global API Keys pool.
- [ ] Task 4: Build backend endpoints (`GET` / `PUT`) for Superadmin to list all Store Admins and toggle their `isAiEnabledBySuperadmin` status & update `aiDailyLimit`.
- [ ] Task 5: Refactor the AI message handler (likely within `backend/src/whatsapp/`) to execute the new logic:
  - Check toggle permissions.
  - Apply the lazy reset algorithm (`aiLastUsedDate` check).
  - Assert `aiUsageToday < aiDailyLimit`.
  - Fetch API Key via Round-Robin from `SuperadminConfig` and rotate index.
  - Increment `aiUsageToday`.
  - Safely fallback on any error/limit.

### Checkpoint: Backend Functionality
- [ ] Superadmin settings can be configured via REST APIs.
- [ ] AI message handling correctly enforces limits and increments quotas.

### Phase 3: Frontend UIs (Superadmin)
- [ ] Task 6: Create or update a UI in `/superadmin/bot-settings` (or a global settings view) for managing Global API Keys and Providers.
- [ ] Task 7: Create a UI page `/superadmin/ai-subscriptions` to list all Store Admins, toggle their AI access, and define their daily limit.

### Phase 4: Frontend UI Updates (Admin Dashboard)
- [ ] Task 8: Update Admin's AI configuration page (`/admin/bot-settings`) to remove forms for "Input API Key" if this is now completely handled by Superadmin, and replace it with a read-only widget showing "Your Daily Quota Usage: XX / YY" or "Upgrade Plan to Activate AI".

### Checkpoint: Complete Setup
- [ ] End-to-end user flow operates correctly: API limits reset daily, Admins view quotas flawlessly, and WhatsApp responds according to the global round-robin keys.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Rate Limits from AI Provider | High | Implement Round-Robin via the `SuperadminConfig.apiKeys` array to split load across keys. |
| Timezone discrepancies for daily resets | Medium | standardize the date check in UTC format and check if the Day/Month/Year components differ from current Date. |
| Malicious spam causing token exhaustion | High | Daily quotas (`aiDailyLimit`) protect the Superadmin from excessive charges. Limit resets only once every 24h. |

## Open Questions
- Do we allow Admin users to see their entire AI conversation logs to justify token deductions, or rely simply on the WhatsApp chat history? *(Currently relying on WhatsApp chat logs is standard)*.