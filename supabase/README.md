# Inganathi K53 dashboard backend

This directory is reserved for the Supabase schema and lifecycle policies.

Prototype defaults agreed for planning:
- Learner access period: 21 days (admin may extend).
- Store a result when a practice test is completed.
- Learners may read only their own profile and results.
- Admin users may view learner accounts and results.
- After account expiry, disable learner access; retain records for a 30-day grace period before scheduled deletion, subject to academy policy.

No Supabase project credentials are included in this repository. Do not commit a service-role key, database password, or private secret. This preview currently uses sample data only. The real schema, authentication, row-level security, and cleanup job should be added after the project is created and access rules are reviewed.
