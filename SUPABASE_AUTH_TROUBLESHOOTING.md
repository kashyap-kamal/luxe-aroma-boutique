# Supabase Auth Troubleshooting Guide

## Critical Error: "missing destination name oauth_client_id in *models.Session"

### Symptoms
- Application crashes or fails to load.
- Browser console shows `AuthRetryableFetchError` or `TypeError: Failed to fetch`.
- Supabase server logs (viewable via MCP) show `500: missing destination name oauth_client_id in *models.Session`.
- Authentication refresh fails repeatedly.

### Root Cause
This error indicates a **version mismatch** between the Supabase Auth service (GoTrue) and the internal database schema.
- The database table `auth.sessions` contains a column `oauth_client_id`.
- The running version of the Auth service (e.g., v2.183.0) does not expect this column in its internal data model.
- When the service queries the database, it receives the extra column and fails to map it, causing a 500 Internal Server Error.

This usually happens when:
1. The Supabase project was paused and restored.
2. A database migration modified the `auth` schema (which is managed by Supabase) but the service didn't update.
3. There was a partial platform update.

### Solution

#### 1. Restart the Supabase Project (Recommended)
This is the most reliable fix as it forces the Supabase infrastructure to realign the service versions with the database schema.

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/bzqwezglotpkzxghjxvc).
2. Navigate to **Settings** -> **Infrastructure**.
3. Click **Restart Project**.
4. Wait for a few minutes for the services to come back online.

#### 2. Clear Browser Local Storage
To stop the immediate crash loop on your local machine:

1. Open your browser's Developer Tools (F12 or Cmd+Option+I).
2. Go to the **Application** tab.
3. Select **Local Storage** from the sidebar.
4. Right-click your domain (`localhost:3000` or production URL) and click **Clear**.
5. Reload the page. You will be logged out, but the app should load.

#### 3. Verify Fix
After restarting:
1. Log in again.
2. Check the browser console logs. The errors should be gone.
3. Check Supabase logs via MCP to ensure no 500 errors are occurring.

### Prevention
- Avoid manually modifying the `auth` schema.
- Keep your Supabase project active (avoid long pauses).
- Regularly check Supabase advisories via MCP: `mcp_supabase_get_advisors`.

