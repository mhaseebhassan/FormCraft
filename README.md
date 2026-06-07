# FormCraft

```
███████╗ ██████╗ ██████╗ ███╗   ███╗ ██████╗██████╗  █████╗ ███████╗████████╗
██╔════╝██╔═══██╗██╔══██╗████╗ ████║██╔════╝██╔══██╗██╔══██╗██╔════╝╚══██╔══╝
█████╗  ██║   ██║██████╔╝██╔████╔██║██║     ██████╔╝███████║█████╗     ██║
██╔══╝  ██║   ██║██╔══██╗██║╚██╔╝██║██║     ██╔══██╗██╔══██║██╔══╝     ██║
██║     ╚██████╔╝██║  ██║██║ ╚═╝ ██║╚██████╗██║  ██║██║  ██║██║        ██║
╚═╝      ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝        ╚═╝
```

Production-grade no-code form builder SaaS similar to Typeform and Jotform.

## Screenshots

| Builder | Classic Form | Conversational Form | Dashboard | Responses | Analytics |
| --- | --- | --- | --- | --- | --- |
| Add and reorder fields | Public form renderer | One-question flow | Stats and activity | Table and drawer | Charts by field |

## Features

- Complete auth with credentials, Google OAuth, JWT sessions, and protected app routes
- Drag-and-drop builder with 12 field types, field settings, validation controls, autosave, preview, share, and publish
- Public classic and conversational renderers with required validation and themed styling
- Forms list with templates, search, filters, duplicate, share, close/reopen, and delete
- Responses table with search, mobile cards, detail drawer, bulk delete, and CSV export
- Per-question analytics using Recharts
- Settings page for profile, password, subscription, and account deletion
- HTML email templates for owner notifications and respondent confirmations
- Seed script with demo users, forms, and realistic responses

## Tech Stack

| Layer | Choice |
| --- | --- |
| App | Next.js 16 App Router, React 19, TypeScript strict |
| Data | MongoDB Atlas, Mongoose |
| Auth | NextAuth v4, bcrypt credentials, Google OAuth |
| UI | Tailwind CSS v4, Framer Motion, lucide-react |
| Builder | dnd-kit |
| Charts | Recharts |
| Email | Resend |

## Local Setup

1. Copy `.env.local.example` to `.env.local` and fill values.
2. Install dependencies with `npm install`.
3. Run MongoDB locally or configure `MONGODB_URI` for Atlas.
4. Seed demo data with `npm run seed`.
5. Start the app with `npm run dev`.

Demo accounts:

- `demo@formcraft.test` / `FormCraft123!`
- `pro@formcraft.test` / `FormCraft123!`
- `agency@formcraft.test` / `FormCraft123!`

## Embed Example

```html
<iframe src="https://your-domain.com/f/FORM_SLUG" style="width:100%;border:0;min-height:640px" loading="lazy"></iframe>
```

Resend requires a verified sending domain for production email delivery.

Live Vercel URL: configure after deployment.
