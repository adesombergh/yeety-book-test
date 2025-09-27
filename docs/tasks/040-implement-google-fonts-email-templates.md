# 040 – Implement Google Fonts in Email Templates

## Goal

Enhance email typography by implementing Bricolage Grotesque font with proper fallbacks to improve visual consistency with the main application.

## Deliverable

- Add Google Fonts import for Bricolage Grotesque to email templates
- Update font-family declarations to: `'Bricolage Grotesque', Arial, Helvetica, sans-serif`
- Implement fallback strategy for email clients that don't support web fonts
- Update both reservation confirmation and cancellation email templates
- Ensure font styling is consistent across all text elements in emails
- Test font rendering across major email clients

## Validation

- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- Email templates use Bricolage Grotesque when supported by email client
- Proper fallback fonts (Arial, Helvetica, sans-serif) render in unsupported clients
- Font styling is consistent across both email templates
- Email preview shows improved typography with custom font
- No regression in email template functionality or compatibility

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
