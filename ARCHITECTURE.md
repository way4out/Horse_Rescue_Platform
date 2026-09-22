# Production architecture

The public GitHub Pages deployment is the presentation and field-PWA layer. LocalStorage is deliberately treated as prototype-only.

Production target:
1. Supabase Auth for staff accounts and role-based access.
2. Postgres tables for horses, care events, tasks, help requests, sponsorships, transport, inventory and media metadata.
3. Supabase Storage for horse photos and care documents.
4. Row Level Security so public users can submit approved public forms but cannot read private rescue records.
5. Audit history for material record changes.
6. Separate public adoption views from private medical/adopter information.
7. Donation and sponsorship provider integration without storing payment-card data.
8. Offline-first field queue that synchronizes when connectivity returns.

The included schema is the foundation. It intentionally does not ship fake credentials or an insecure privileged API key.
