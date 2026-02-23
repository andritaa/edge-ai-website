# Edge AI — IAM Architecture

## The Big Picture

```
┌──────────────────────────────────────────────────────┐
│                   EDGE AI PLATFORM                    │
│              (edge-ai.space / edge-ai.space)          │
│                                                      │
│  Central Identity Provider — Single Sign-On (SSO)    │
│  ┌────────────────────────────────────────────────┐  │
│  │  Better Auth + Organization + Admin plugins    │  │
│  │  PostgreSQL on Railway                         │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  After login, users see a PRODUCT LAUNCHER:          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ HabaCasa │  │ AI Agency│  │ Product 3│  ...      │
│  │  🏠      │  │  🤖      │  │  🔧      │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                      │
│  Stephen's ADMIN DASHBOARD:                          │
│  - All users, all products, all subscriptions        │
│  - Role/permission management                        │
│  - Billing overview (Stripe/Square)                  │
│  - Device fleet management                           │
│  - System health                                     │
└──────────────────────────────────────────────────────┘
         │                           │
         ▼                           ▼
┌─────────────────────┐   ┌─────────────────────┐
│   HABACASA CLOUD    │   │   AI AGENCY CLOUD   │
│   (haba.casa)       │   │   (agency.edge-ai)  │
│                     │   │                     │
│ Cloud Dashboard:    │   │ Cloud Dashboard:    │
│ - Account mgmt     │   │ - Agent management  │
│ - Subscription      │   │ - API keys          │
│ - Device status     │   │ - Usage & billing   │
│ - Support           │   │ - Templates         │
└─────────┬───────────┘   └─────────────────────┘
          │
          ▼
┌─────────────────────┐
│  HABACASA LOCAL     │
│  (Jetson/Edge)      │
│                     │
│ Local Dashboard:    │
│ - Room/device mgmt  │
│ - Automations       │
│ - Camera feeds      │
│ - AI conversations  │
│ - 100% PRIVATE      │
│ (never leaves home) │
└─────────────────────┘
```

## Entity Model

### Users
- One account per person across all Edge AI products
- Authenticated via Better Auth (email/password, Google OAuth, magic links)
- Profile: name, email, avatar, phone (optional)

### Organizations
- Better Auth `organization` plugin
- Each customer is an "organization" (even if just 1 person)
- Organizations subscribe to products
- Members have roles within their org

### Products
- New table: `product`
- id, name, slug, description, icon, url
- Examples: "habacasa", "ai-agency", "edge-analytics"

### Product Subscriptions
- New table: `product_subscription`
- Links organization → product
- plan (free/starter/pro/enterprise), status (active/cancelled/trial)
- billing_id (Stripe/Square reference)

### Product Roles (per-product permissions)
- New table: `product_role`
- product_id, name, permissions (JSON)
- Default roles: owner, admin, member, viewer

### User Product Access
- Derived from: user → org membership → org subscriptions → products
- A user sees products their org subscribes to
- Role within org determines what they can do

## Roles & Permissions

### Platform Level (Better Auth Admin plugin)
| Role | Who | Can Do |
|------|-----|--------|
| **superadmin** | Stephen | Everything. Manage all orgs, users, products, billing |
| **admin** | Edge AI staff | Manage users, view billing, support |
| **user** | Everyone else | Access their own products |

### Organization Level (Better Auth Organization plugin)
| Role | Can Do |
|------|--------|
| **owner** | Full control of org, billing, invite/remove members |
| **admin** | Manage members, configure products |
| **member** | Use products, view dashboards |
| **viewer** | Read-only access |

### Product Level (Custom)
| Role | Example (HabaCasa) |
|------|---------------------|
| **admin** | Full control of smart home, can add users |
| **member** | Control rooms, scenes, routines |
| **guest** | Limited access (e.g., just their room's lights) |

## Authentication Flows

### 1. Sign Up (New User)
```
edge-ai.space/signup
  → Create account (email/password or Google)
  → Auto-create personal organization
  → Show product catalog / onboarding wizard
  → Subscribe to first product
  → Redirect to product dashboard
```

### 2. Sign In (Existing User)
```
edge-ai.space/login
  → Authenticate
  → If 1 product → go straight to that product's dashboard
  → If multiple products → show product launcher
```

### 3. Sign In via Product (e.g., haba.casa/login)
```
haba.casa/login
  → Redirect to edge-ai.space/login?redirect=haba.casa
  → Authenticate at Edge AI
  → Redirect back to haba.casa with session token
  → (SSO via shared auth / token exchange)
```

### 4. Local Dashboard (HabaCasa Edge Device)
```
192.168.x.x:3000 (local only)
  → Separate local auth (PIN or biometric)
  → Never touches cloud for auth
  → Links to cloud account for sync (optional)
  → All data stays on-device
```

## Stephen's Admin Dashboard

Accessible at: `edge-ai.space/admin` (superadmin only)

### Sections:
1. **Users** — All registered users, search, filter, ban/unban, impersonate
2. **Organizations** — All orgs, members, subscriptions
3. **Products** — Manage product catalog, enable/disable
4. **Subscriptions** — Active subs, revenue, churn
5. **Devices** — Fleet view of all deployed edge devices
6. **Billing** — Stripe/Square integration, invoices, refunds
7. **System** — Service health, API usage, error logs

## Implementation Plan

### Phase 1: Foundation (Current Sprint)
- [x] Better Auth with email/password + Google OAuth
- [ ] Add Organization plugin to Better Auth
- [ ] Add Admin plugin to Better Auth
- [ ] Create `product` and `product_subscription` tables
- [ ] Product launcher page after login
- [ ] Admin dashboard (superadmin)
- [ ] Set Stephen as superadmin

### Phase 2: Multi-Product SSO
- [ ] Shared session tokens across subdomains
- [ ] Product-specific login redirects
- [ ] Per-product role management
- [ ] Product onboarding wizards

### Phase 3: HabaCasa Local Auth
- [ ] Local PIN/biometric auth on edge device
- [ ] Cloud account linking (optional)
- [ ] Sync permissions from cloud → local
- [ ] Offline-first — works without cloud

### Phase 4: Advanced
- [ ] RBAC permission engine
- [ ] Audit logging (who did what, when)
- [ ] API key management (for integrations)
- [ ] Webhooks for user events
- [ ] Multi-factor auth (TOTP, SMS via Twilio)

## Database Schema (New Tables)

```sql
-- Products catalog
CREATE TABLE IF NOT EXISTS "product" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "icon" TEXT,
  "url" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Organization product subscriptions
CREATE TABLE IF NOT EXISTS "product_subscription" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "productId" TEXT NOT NULL REFERENCES "product"("id"),
  "plan" TEXT NOT NULL DEFAULT 'free',
  "status" TEXT NOT NULL DEFAULT 'active',
  "billingId" TEXT,
  "trialEndsAt" TIMESTAMP,
  "currentPeriodEnd" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("organizationId", "productId")
);

-- Product-specific roles
CREATE TABLE IF NOT EXISTS "product_role" (
  "id" TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL REFERENCES "product"("id"),
  "userId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'member',
  "permissions" JSONB DEFAULT '{}',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("productId", "userId", "organizationId")
);

-- Seed products
INSERT INTO "product" ("id", "name", "slug", "description", "icon", "url") VALUES
  ('habacasa', 'HabaCasa', 'habacasa', 'AI-native environment management for your space', '🏠', 'https://haba.casa'),
  ('ai-agency', 'AI Agency', 'ai-agency', 'Autonomous AI agents for your business', '🤖', NULL)
ON CONFLICT ("id") DO NOTHING;
```

## Agent-First Architecture

The AI agent on each page/product is the **primary interaction medium** — possibly the only one in the future. The visual dashboard is secondary, a confirmation layer.

### How It Works:
```
User speaks to Agent
  → Agent checks user's session + permissions (via Better Auth)
  → Agent calls product APIs only for actions user is authorized for
  → Agent returns result (text, voice, visual)
  → Dashboard updates reactively to show state
```

### Permission-Scoped Agent Actions:
| Product | Agent Can... (if authorized) |
|---------|------------------------------|
| HabaCasa | Control lights, heating, cameras, routines, scenes |
| AI Agency | Create/manage agents, view analytics, configure tools |
| Edge AI Platform | Manage account, view subscriptions, invite team |
| Admin (superadmin) | Manage all users, orgs, billing, system health |

### Agent Auth Flow:
1. User authenticates (login page or voice activation)
2. Session token passed to agent API on every request
3. Agent API validates token via Better Auth `getSession()`
4. Agent checks user's org membership + product roles + permissions
5. Agent executes action OR returns "you don't have permission"

### Future: Agent as Only UI
- Voice-first on edge devices (ElevenLabs TTS + Whisper STT)
- Chat-first on web (current chatbot → full agent)
- Dashboards become optional "visual mode"
- All CRUD operations go through agent API with permission checks

## Key Decisions

1. **Better Auth as the identity backbone** — Organization + Admin plugins give us 80% of what we need out of the box
2. **One auth, many products** — Users authenticate once, access all their subscriptions
3. **Local auth is separate** — HabaCasa edge devices have their own auth for privacy. Cloud linking is optional.
4. **Organizations = customers** — Even a single person is an "org of one". Simplifies billing and access.
5. **Build on Railway PostgreSQL** — Single database for platform identity. Product data lives in product-specific databases.
6. **Agents are permission-scoped** — Every agent action checks the user's session, org role, and product permissions before executing. No backdoors.
