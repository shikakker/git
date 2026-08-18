# git — Partner Gallery / Supabase Roadmap

The repository contains an `app/`, SQL schema and Supabase configuration; the workspace filename suggests a partner-gallery example. The generic repository name should be replaced by evidence-based product framing.

## 10 tasks

1. Trace the `app/` implementation and README to establish the exact gallery/product behavior and starter provenance.
2. Review `schema.sql` and Supabase migrations/config for tables, constraints, indexes and row-level security requirements.
3. Ensure all user-accessible tables have explicit RLS policies appropriate to read/write behavior.
4. Validate all write inputs and enforce authorization both in application code and database policies.
5. Add loading, empty, unauthorized and database failure states to gallery/data views.
6. Add tests for data mapping and permission-sensitive flows.
7. Add a reproducible local Supabase setup/migration workflow and document reset/seed steps if supported.
8. Add CI for application checks plus SQL/migration validation where practical.
9. Rename/document the repository around its actual product rather than the ambiguous name `git` if it remains portfolio-visible.
10. Create a case study explaining the verified app + Supabase architecture, data model and original contribution without attributing starter/example code as original work.

## Portfolio value

Potentially strong as a small full-stack/Supabase artifact because database policies and application behavior can demonstrate more than frontend-only work.