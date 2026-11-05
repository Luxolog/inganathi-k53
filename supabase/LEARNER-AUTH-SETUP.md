# Learner authentication setup

1. Run `supabase/learner-registration-trigger.sql` in the Supabase SQL Editor.
2. Confirm the academy administrator profile remains `role = 'admin'` and `is_active = true`.
3. Configure Supabase Auth site URL and allowed redirect URLs for GitHub Pages.
4. Test a fresh learner signup, email confirmation if enabled, login, and expiry.

## Hosting limitation
GitHub Pages serves static files publicly. The browser guard redirects signed-out or expired users, but does not make HTML, JavaScript, JSON, or public assets confidential. Supabase RLS protects database rows, not static files. To keep study material private, it must be served from authenticated storage or a server/API that validates the learner session and access window. Never place a Supabase secret/service-role key in the public repository.

The signup trigger provisions learner profiles for 21 days. Database and server endpoints must enforce access independently of the browser guard.