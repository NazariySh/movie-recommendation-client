# MovieMatch Client

**MovieMatch Client** is the Angular single-page application for the MovieMatch movie/series recommendation platform, backed by the [MovieMatch API](../movie-recommendation-api/README.md).

It's organized into lazy-loaded feature modules, each mapped to a route:

| Feature | Route | What it does |
|---|---|---|
| Discover | `/` | Personalized "for you" / trending / cold-start recommendation feed |
| Movies | `/movies`, `/movies/:id`, `/movies/genres` | Catalog browsing, filters, movie/series detail pages, reviews |
| Search | `/search` | Search results, plus an inline search bar in the header |
| Artists | `/artists` | Actor/director listing and detail pages |
| Auth | `/auth` | Login, register, email verification, forgot/reset password, Google Sign-In |
| Onboarding | `/onboarding` | First-run taste survey used to bootstrap recommendations for new users |
| Profile | `/profile` | Account settings, ratings, reviews, watchlist |
| Admin | `/admin` | Movie/artist/user management and ML model dashboard (Admin/Moderator only) |
| Rules | `/rules` | Static community rules page |

The app is dark-themed only, supports English and Ukrainian via `ngx-translate`, and authenticates against the API with a JWT kept in memory (mirrored to `localStorage`) plus an HttpOnly refresh-token cookie handled transparently by an HTTP interceptor chain.

---

## 🚀 Technologies Used

- **Angular 18** (NgModule-based, not standalone-first) – Core SPA framework, with lazy-loaded feature modules per route.
- **Angular Material + CDK** – UI component library, themed dark-only via CSS custom properties.
- **@ngx-translate** – i18n (English + Ukrainian), with translations loaded from `public/i18n/`.
- **@swimlane/ngx-charts + d3-shape** – Charts for the admin dashboard.
- **RxJS** – Reactive state (auth, filters, language) and HTTP composition via functional interceptors.
- **ESLint + Prettier + Husky/lint-staged** – Linting, formatting, and pre-commit checks.
- **Karma + Jasmine** – Test runner (no spec files currently required per project convention).

---

## 🛠 Setup Instructions

### 1. Prerequisites

- **[Node.js](https://nodejs.org/)** (LTS) and **npm**
- **[Angular CLI](https://angular.dev/tools/cli)** (`npm install -g @angular/cli`), or use the local `ng` via `npx`
- A running instance of the [MovieMatch API](../movie-recommendation-api/README.md) (defaults to `https://localhost:7170/api` in dev)

### 2. Clone the Repository

```bash
git clone <repository-url>
cd movie-recommendation/movie-recommendation-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure the API URL (if needed)

The dev environment already points at the local API by default in `src/environments/environment.development.ts`:

```ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7170/api',
  appUrl: 'http://localhost:4200',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'uk'],
  googleClientId: '...',
};
```

Update `apiUrl`/`googleClientId` if your backend runs elsewhere or you're using your own Google OAuth client.

### 5. Run the Application

```bash
npm start
```

The application will be available at:
➡️ http://localhost:4200

### 6. Other Commands

```bash
npm run build        # Production build → dist/movie-recommendation-client/
npm run watch         # Development build with watch
npm test              # Run tests via Karma/Jasmine
npm run lint           # ESLint (TypeScript + Angular templates)
npm run lint:fix       # ESLint with auto-fix
npm run format          # Prettier format all src files
npm run format:check     # Check formatting without writing
```
