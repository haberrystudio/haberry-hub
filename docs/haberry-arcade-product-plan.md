# Haberry Arcade SaaS product plan

See the [implementation and architecture plan](./haberry-arcade-implementation-plan.md) for the current platform admin, multi-location, Windows, and deployment scope. It takes precedence for those areas.

Haberry Arcade helps local gaming centers track who is playing, what each session costs, which payments were received, and whether the till balances at the end of a shift. A Windows counter app runs daily operations. An authenticated website gives owners and managers remote visibility, settings, and reports. A public website explains the product and collects demo enquiries.

**Working name:** Haberry Arcade. Haberry Hub remains an option if the product expands beyond gaming centers.  
**Initial market assumption:** Indian gaming centers with a staffed counter, hourly PC or console stations, and cash or UPI payments.  
**Pilot scope assumption:** Two or three venues, one location and one active counter device per venue. The data model supports multiple locations from the start.  
**Repository baseline:** `frontend/` contains a Next.js starter and `backend/` contains a NestJS starter. Add `desktop/` when desktop implementation starts.

## 1. Product scope

| Surface | MVP | Later |
| --- | --- | --- |
| Windows counter app | Station board, session timer, price preview, checkout, receipts, shift close, offline queue | Multiple counters, supported receipt printers, optional player-PC agent |
| Owner web dashboard | Live station and sync status, sales, payment ledger, shift reconciliation, CSV export, staff and venue settings | Location comparisons, advanced analytics, remote operating controls |
| Public website | Product overview, demo request, dashboard sign-in, approved installer access | Self-serve signup, pricing experiments, help center |
| Customer payments | Record cash, UPI, and card payments already collected by venue staff, including split tenders | Gateway checkout, verified payment notifications, automated refunds |
| Haberry subscription | Manually provision pilot venues and track plan entitlement | Self-serve subscriptions, renewals, and billing portal |
| Additional venue workflows | Metered sessions with a price snapshot and a generic station type | Memberships, prepaid wallets, bookings, café inventory, tournaments, scheduled packages |

The desktop app initially runs on the cashier’s PC. Station timers are operational records managed from the counter. Automatic workstation locking, player logins, and game launching require a separate player-PC agent and their own rollout.

## 2. Roles and responsibilities

| Role | Allowed actions |
| --- | --- |
| Owner | Manage organization, venues, devices, staff roles, pricing, all venue reports, and exports |
| Manager | Manage assigned venue stations and shifts, review discrepancies, and approve voids or refunds with a reason |
| Cashier | Open a shift, start and end sessions, record tenders, issue receipts, and submit a till count at assigned venues |
| Haberry support | Manage SaaS provisioning and device diagnostics. Any access to venue records requires an explicit, time-limited, audited support grant |

Enforce role and location permissions in the API and in offline desktop actions. Require individual staff accounts so shifts and adjustments have a clear actor.

## 3. Core operating workflows

1. **Set up a venue.** Create the organization and location, set timezone and currency, add station types and stations, publish rates, invite staff, and pair the Windows counter from a short-lived code. Save configuration locally after first online sign-in.
2. **Open a shift.** The cashier enters opening cash. The station board shows ready, in-use, checkout-due, and out-of-service states. Show open shifts and unsynced work on app launch.
3. **Start play.** Select a ready station and create a session with its start timestamp and current rate snapshot. Display elapsed time and estimated charge. Recover sessions after an app restart and block a second active session on the same station.
4. **End and settle.** Freeze elapsed time, show the itemized charge, and collect one or more tenders. An ended unpaid session stays visible in the checkout queue. Mark it settled only when recorded tenders cover the amount due. Generate a receipt with a stable reference that can be printed or reissued.
5. **Correct a transaction.** A manager gives a reason for a void or refund. A refund references the original tender and records the amount actually returned by the venue. Manual payment confirmation captures the operator and optional reference without showing gateway verification.
6. **Close a shift.** Compare counted cash with expected cash from opening float, cash collections, cash refunds, and logged cash movements. Show UPI and card totals separately. Record a variance and reason, and flag unsettled sessions or unresolved sync items for the manager.
7. **Review remotely.** Owners see gross sales, refunds, net sales, collections by tender, unpaid balances, and shift variances. Filter by venue and business date, drill down to receipts and adjustments, and export the filtered results. Display the counter’s last sync time beside live status.

## 4. Pricing and reporting rules

- Store monetary amounts as integer minor units. Define each MVP rate by station type, amount per time block, block size, and minimum billable blocks. A suggested rule is to round elapsed time up to a whole block and apply the configured minimum. Test exact block boundaries and display the rule before starting play.
- Store immutable rate snapshots on sessions. Pricing updates take effect for newly started sessions once received by the counter. Persist charge line items to keep historical receipts reproducible.
- Keep charges, payments, refunds, and cash movements as separate records. A ₹300 charge paid with ₹100 cash and ₹200 UPI contributes ₹300 to sales and collections, and ₹100 to expected till cash. A subsequent ₹50 cash refund reduces net sales and till cash by ₹50 if it reverses ₹50 of the sale.
- Attribute sales to the business date of finalization and collections and refunds to their recording dates. Set venue timezone explicitly and validate how pilot venues want sessions after midnight and overnight shifts to appear. Show the reporting basis on dashboards and exports.
- Keep Haberry’s SaaS subscription ledger separate from venue customer transactions. Validate tax treatment, invoice numbering, required receipt fields, and retention requirements with a local accountant before paid rollout.

## 5. Architecture and ownership

| Layer | Proposed implementation |
| --- | --- |
| Web | Existing Next.js app for marketing pages and responsive owner dashboard |
| Desktop | Electron with TypeScript, a restricted preload bridge, and SQLite for cached configuration, local transactions, and durable outbound events |
| Cloud API | Existing NestJS app as a modular monolith for identity, venues, stations, pricing, sessions, checkout, shifts, reporting, device sync, and subscriptions |
| Cloud database | PostgreSQL with migrations, tenant-scoped queries and constraints, transactional writes, and managed backups |
| Shared rules | Versioned API contracts and shared TypeScript validation and rate calculation once both apps use them |
| Distribution | Signed Windows installer, release channels for pilot and stable builds, version compatibility checks, and staged updates |

Use the cloud as the consolidated reporting record. Cache a location’s working data on its registered counter so sessions and checkout continue when connectivity drops. Start the dashboard with polling and timestamps. Measure latency before adding a push transport.

### Offline behavior and recovery

- Pair and authorize each device online. Allow only previously authorized staff to operate offline during a configurable grace window. Pairing, role changes, and pricing edits require cloud access. Show the grace deadline and give the venue a documented fallback when access expires.
- Commit each local action and its outbound event in the same SQLite transaction. Assign client-generated IDs and persist pending events across restarts. Submit batches in device order after reconnection and deduplicate by organization, device, and event ID in the API.
- Limit write ownership to the active counter per venue for pilot operations. Pair replacements online and reconcile pending work before handover. Surface device conflicts, rejected events, and unpublished transactions to managers for repair with audit history. Keep refund and void approval online for the pilot.
- Store UTC timestamps, use elapsed-time tracking during active sessions, and surface suspicious clock changes or recovery discrepancies for review. Display pending event count, last successful sync, and any reconciliation issue on the counter and web dashboard.

### Data and API boundaries

| Domain | Core records and constraints |
| --- | --- |
| Identity and tenancy | `Organization`, `Location`, `User`, `Membership`, `Device`. Operational records belong to an organization and location where applicable. Device credentials can be revoked. |
| Operations | `Station`, `RatePlan`, `Shift`, `Session`. Enforce one active session per station and one open shift per active counter. |
| Money | `Sale`, `SaleLine`, `Payment`, `Refund`, `CashMovement`, `Receipt`. Retried writes preserve IDs, and cumulative refunds cannot exceed the tender amount. |
| Reliability and commercial | `SyncEvent`, `AuditEvent`, `Subscription`. Record event processing outcomes and entitlement separately from venue takings. |

Use versioned endpoints for device pairing and sync, venue configuration, staff administration, ledger and report reads, and manager adjustments. Derive tenant access from the authenticated user or paired device, then validate every referenced record belongs to the permitted scope. Commit a settlement, its tenders, and its receipt atomically. Keep audit history for rate edits, privileged access, device changes, and money adjustments.

## 6. Build sequence

The week ranges are illustrative for a small team and assume pilot venues are available for feedback. Offline recovery and financial reconciliation determine pilot readiness.

| Phase | Deliverables | Exit condition |
| --- | --- | --- |
| Discovery, week 1 | Observe cashier workflows and shift closes at two venues. Confirm the station mix, rate rules, UPI process, opening hours, connectivity, and printer needs. Sketch the station board and owner reports. | Each venue walks through and approves its main checkout and shift scenarios. |
| Foundation, weeks 2–3 | PostgreSQL schema, tenant and role model, venue configuration, Next.js dashboard shell, NestJS API, desktop skeleton, first Windows installer | A pilot owner can set up a venue and pair its counter. Automated checks verify cross-venue access rules. |
| Counter operations, weeks 4–5 | Station board, persisted timers, rate calculation, checkout, split tenders, receipt, till counts | Cashier completes an example shift and reconciles receipts against cash and digital payments. |
| Offline and reporting, weeks 6–7 | Local queue and replay, conflict handling, owner ledger, adjustments, CSV exports, last-sync status | Restart and reconnect scenarios preserve session and payment totals. The dashboard reconciles against receipt and shift records. |
| Pilot, weeks 8–9 | Signed installer, hosted staging and production, release and rollback process, diagnostic runbook, real venue onboarding | Each pilot venue completes at least one full week of live shifts with no unexplained payment discrepancy or lost transaction. |
| Paid launch, after pilot | Confirm packaging, support targets, data policies, pricing, billing process, and onboarding | Billing and support procedures are exercised and pilot findings are resolved or accepted with owners. |

## 7. Verification and operational readiness

| Check | Pilot acceptance |
| --- | --- |
| Cashier workflow | A cashier can start, end, and settle a session and reissue its receipt without assistance after onboarding. |
| Payment integrity | Split tenders, partial payment, refunds, duplicate clicks, process crashes, and repeated sync all reconcile with ledger and shift totals. |
| Offline recovery | Disconnect through an entire test shift, restart the app mid-session, then reconnect. Session, receipt, and payment counts match on desktop and web. |
| Access control | Direct API requests cannot read or mutate another venue’s data. Permission changes and device revocations take effect online and offline access expires as designed. |
| Windows release | Clean install, update with queued work, interrupted update recovery, and receipt output pass on representative pilot PCs. |
| Data recovery | Restore a backup into staging and reconcile representative transaction and shift totals. Document the expected recovery window and escalation owner. |

Use separate staging and production deployments, automated migrations with recovery procedures, encrypted transport and storage, and scoped staff and device credentials. Keep payment credentials and sensitive customer identifiers out of logs. Track failed sync batches, oldest pending queue age, API errors, desktop crashes, and shift discrepancies. Document onboarding, replacing a counter, checking sync, rolling back an installer, and supporting a venue during an internet outage.

## 8. Commercial pilot and decisions

- Test a monthly per-location subscription with station-count bands. Compare it with a flat venue fee during interviews and set pricing after assessing willingness to pay, hosting and support costs, and real station counts.
- Track time to first completed shift, checkout time, shift-close time, unexplained variance, oldest unsynced event, and weekly dashboard use. Capture current manual-process baselines at onboarding and agree on improvement targets after observation.
- Determine the launch name, supported Windows versions, receipt format, paper/printer models, business-day cutoff, and how long staff may operate offline during discovery. Decide whether venues with multiple simultaneous counters are essential for launch before changing sync ownership.
- Start implementation with the venue setup → device pairing → timed session → settlement → owner ledger flow. Use one pilot venue’s real rate card and sample shift to verify that both apps tell the same financial story.
