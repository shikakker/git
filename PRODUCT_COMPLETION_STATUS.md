# PRODUCT_COMPLETION_STATUS

## Product family
Supabase Partner Gallery example

- Canonical repo: `shikakker/git`
- Branch: `portfolio-improvements-2026-08`
- Draft PR: #1
- Product boundary: imported/adapted Supabase partner-gallery example; not a generic Git product
- Current state: PARTIAL

## T01–T10 core tasks
- T01 DONE — identify actual product/provenance and current public gallery flows.
- T02 DONE — reproduce direct browser insert of partnership-contact PII into `partner_contacts`.
- T03 DONE — move contact submission behind `/api/partner-contact`.
- T04 DONE — validate/normalize bounded contact payloads server-side.
- T05 DONE — return explicit 400/403/405/415/502/503 semantics and `private, no-store`.
- T06 DONE — stop UI from showing success when persistence fails; provide retryable error feedback.
- T07 DONE — add server-only `SUPABASE_SERVICE_ROLE_KEY` env boundary without exposing it as `NEXT_PUBLIC_*`.
- T08 DONE — add Supabase migration revoking browser-role access to `partner_contacts`.
- T09 DONE — commit reproducible npm lockfile and verify exact-head clean install/audit/tests/typecheck/build.
- T10 BLOCKED — exact-head Vercel preview + real Supabase-backed form/read smoke after provider config and deployment capacity are available.

## I01–I10 improvements
- I01 DONE — sensitive write no longer originates from the browser Supabase client.
- I02 DONE — server validation for type/name/email/company-size/text lengths.
- I03 DONE — normalized upstream DB errors; no raw database failure is returned to the browser.
- I04 DONE — no-store response boundary for contact submission.
- I05 DONE — form has visible recovery state instead of silent failure/false success.
- I06 DONE — privacy and dependency regression contracts added.
- I07 DONE — permanent read-only Release Quality CI runs frozen install, production audit, tests, TypeScript and build.
- I08 DONE — `.env.local.example` documents server-only credential requirement without secrets.
- I09 DONE — Next 12.1.4 → 15.5.24, React 18.2, patched PostCSS, Swiper 14.2 and committed lockfile; deprecated React-17-only `@supabase/ui` removed.
- I10 DONE — contact write endpoint rejects cross-site/fetch-site and non-JSON requests before validation/service-role initialization.

## F01–F10 product features
- F01 DONE — public approved partner gallery retained.
- F02 DONE — integrations search retained with loading/error recovery.
- F03 DONE — expert/integration detail routes retained.
- F04 DONE — partnership application retained with server persistence and same-origin JSON write policy.
- F05 DONE — submission recovery/error state and accessible native form controls.
- F06 DEFERRED — distributed anti-spam/rate limiting after real hosted traffic model is known.
- F07 DEFERRED — authenticated partner application review/admin workflow.
- F08 DEFERRED — application status tracking/notifications.
- F09 DEFERRED — moderated partner self-service editing.
- F10 DEFERRED — analytics/observability after canonical production deployment is established.

## Verification

### Latest cross-site write-abuse slice

The service-role contact endpoint previously accepted any POST content type/origin. Because the browser form is a public PII write surface, a cross-site form-style request could reach validation and the privileged database path.

- `8ca69b0c1845c3529da49556d06d4edd79c212c1` — regression first: same-origin/fetch-site and JSON checks must execute before contact validation and service-role config.
- `5e52fec578ca8063dfdb183e91d32b4807b0fff1` — adds `Sec-Fetch-Site` + `Origin`/forwarded-host validation and strict `application/json` media-type enforcement. Existing client already submits same-origin JSON.
- Source-contract Quality run `35281932715`: **PASS**.
- Release Quality run `35281932884`, job `105405602448`: **PASS** with real executed steps:
  - frozen install: PASS;
  - production dependency audit: PASS;
  - regression contracts: PASS;
  - TypeScript: PASS;
  - Next.js production build: PASS.

This is a cross-site write-abuse guard, not authentication or distributed bot/rate-limit protection.

### Previously verified migration baseline

The branch already verified the Next 15.5.24 / React 18.2 / Swiper 14.2 / PostCSS runtime and committed deterministic `app/package-lock.json` through guarded release verification. Public Supabase client initialization is optional at build time so absent provider env produces safe unavailable states instead of failing SSG/build.

## Hosted/provider state

Vercel exact runtime-head status for `5e52fec...` is still **Deployment rate limited** before application build. Earlier hardening previews do not replace exact-head browser evidence.

Supabase:
- access-control migration is committed in repository only;
- target production database application is NOT claimed;
- real partner submission/read smoke requires intended Supabase URL/anon/service-role configuration.

## Remaining blockers

`BLOCKED ONLY BY:`
1. Vercel accepting an exact-current-head preview after Hobby build capacity clears;
2. intended Supabase provider configuration + deliberate migration application for real form submission/read smoke;
3. interactive 375/768/1024/1440 browser QA after exact preview exists.

## Project checkpoint

**PROJECT:** `shikakker/git` / Partner Gallery  
**Fixed this pass:** cross-site/non-JSON requests no longer reach the server-owned PII persistence path.  
**Verification:** source contracts PASS; exact-head Release Quality **PASS**; Vercel exact head = RATE-LIMITED; Supabase migration/provider E2E = NOT VERIFIED.  
**Git:** `portfolio-improvements-2026-08`, Draft PR #1; verified runtime head `5e52fec...`.  
**Status:** **PARTIAL**.

No production database, secret, domain, billing, merge or production promotion action has been performed automatically.
