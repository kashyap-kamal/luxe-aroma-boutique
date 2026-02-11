# Email Template Fields Usage

This document shows which Supabase template variables are used in each email template.

## ✅ Confirm Signup (`confirm-signup.html`)

**Available Fields:**
- ✅ `{{ .ConfirmationURL }}` - Used for confirmation button and link
- ✅ `{{ .Token }}` - Used as alternative OTP code display
- ✅ `{{ .TokenHash }}` - Available but not needed (ConfirmationURL already contains it)
- ✅ `{{ .SiteURL }}` - Used in footer links
- ✅ `{{ .Email }}` - Used for personalization
- ✅ `{{ .Data }}` - Used for `full_name` personalization
- ✅ `{{ .RedirectTo }}` - Used to show redirect destination

**Fields Used:** All 7 fields

---

## ✅ Reset Password (`reset-password.html`)

**Available Fields:**
- ✅ `{{ .ConfirmationURL }}` - Used for reset button and link
- ✅ `{{ .Token }}` - Used as alternative OTP code display
- ✅ `{{ .TokenHash }}` - Available but not needed (ConfirmationURL already contains it)
- ✅ `{{ .SiteURL }}` - Used in help text and footer links
- ✅ `{{ .Email }}` - Used for personalization and help text
- ✅ `{{ .Data }}` - Used for `full_name` display
- ✅ `{{ .RedirectTo }}` - Used to show redirect destination

**Fields Used:** All 7 fields

---

## ✅ Magic Link (`magic-link.html`)

**Available Fields:**
- ✅ `{{ .ConfirmationURL }}` - Used for sign-in button and link
- ✅ `{{ .Token }}` - Used as alternative OTP code display
- ✅ `{{ .TokenHash }}` - Available but not needed (ConfirmationURL already contains it)
- ✅ `{{ .SiteURL }}` - Used in footer links
- ✅ `{{ .Email }}` - Used for personalization
- ✅ `{{ .Data }}` - Used for `full_name` personalization
- ✅ `{{ .RedirectTo }}` - Used to show redirect destination

**Fields Used:** All 7 fields

---

## ✅ Invite User (`invite-user.html`)

**Available Fields:**
- ✅ `{{ .ConfirmationURL }}` - Used for accept invitation button and link
- ✅ `{{ .Token }}` - Used as alternative OTP code display
- ✅ `{{ .TokenHash }}` - Available but not needed (ConfirmationURL already contains it)
- ✅ `{{ .SiteURL }}` - Used in footer links
- ✅ `{{ .Email }}` - Used for personalization
- ✅ `{{ .Data }}` - Used for `invited_by`, `role`, and other metadata
- ✅ `{{ .RedirectTo }}` - Used to show redirect destination

**Fields Used:** All 7 fields

---

## ✅ Change Email (`change-email.html`)

**Available Fields:**
- ✅ `{{ .ConfirmationURL }}` - Used for confirm button and link
- ✅ `{{ .Token }}` - Used as alternative OTP code display
- ✅ `{{ .TokenHash }}` - Available but not needed (ConfirmationURL already contains it)
- ✅ `{{ .SiteURL }}` - Used in footer links
- ✅ `{{ .Email }}` - Used to show current email address
- ✅ `{{ .NewEmail }}` - Used to show new email address
- ✅ `{{ .Data }}` - Used for `full_name` display
- ✅ `{{ .RedirectTo }}` - Used to show redirect destination

**Fields Used:** All 8 fields (including NewEmail)

---

## ✅ Reauthentication (`reauthentication.html`)

**Available Fields:**
- ✅ `{{ .Token }}` - Used as primary 6-digit OTP code (prominently displayed)
- ✅ `{{ .SiteURL }}` - Used in help text and footer links
- ✅ `{{ .Email }}` - Used for personalization
- ✅ `{{ .Data }}` - Used for `full_name` and `action` metadata

**Fields Used:** All 4 available fields

**Note:** Reauthentication template does NOT use `ConfirmationURL`, `TokenHash`, or `RedirectTo` as it only uses OTP codes.

---

## Summary

| Template | ConfirmationURL | Token | TokenHash | SiteURL | Email | NewEmail | Data | RedirectTo | Total |
|----------|----------------|-------|-----------|---------|-------|----------|------|------------|-------|
| Confirm Signup | ✅ | ✅ | ⚠️ | ✅ | ✅ | - | ✅ | ✅ | 7/7 |
| Reset Password | ✅ | ✅ | ⚠️ | ✅ | ✅ | - | ✅ | ✅ | 7/7 |
| Magic Link | ✅ | ✅ | ⚠️ | ✅ | ✅ | - | ✅ | ✅ | 7/7 |
| Invite User | ✅ | ✅ | ⚠️ | ✅ | ✅ | - | ✅ | ✅ | 7/7 |
| Change Email | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ | ✅ | ✅ | 8/8 |
| Reauthentication | - | ✅ | - | ✅ | ✅ | - | ✅ | - | 4/4 |

**Legend:**
- ✅ = Used in template
- ⚠️ = Available but not needed (ConfirmationURL already contains TokenHash)
- - = Not available for this template type

## Notes

1. **TokenHash**: Not directly used because `ConfirmationURL` already contains the hashed token. Only needed if building custom confirmation URLs.

2. **Conditional Rendering**: All templates use Go template conditionals (`{{ if .Field }}`) to gracefully handle missing optional fields.

3. **Personalization**: Templates use `{{ .Data.full_name }}` and `{{ .Email }}` for personalized greetings when available.

4. **Alternative Methods**: All templates (except Reauthentication) provide both:
   - Clickable button/link using `{{ .ConfirmationURL }}`
   - OTP code display using `{{ .Token }}`

5. **Year Field**: Removed `{{ .Year }}` (doesn't exist) and replaced with hardcoded "2025" in copyright footer.

