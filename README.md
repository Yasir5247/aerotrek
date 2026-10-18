# AeroTrek storefront

Next.js 15 App Router storefront for AeroTrek Maldives. Catalog, auth, and checkout talk to Aiminaabee via `@aiminaabeejs/js-sdk`. Cart, wishlist, and compare stay in Redux until place-order.

## Develop

From the monorepo root:

```bash
yarn install
yarn workspace aerotrek dev
```

The app runs on [http://localhost:3003](http://localhost:3003).

Required env (see `.env.local`):

- `NEXT_PUBLIC_AIMINAABEE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_DEFAULT_STORE_CODE`
- `AIMINAABEE_BACKEND_URL` (defaults to `http://localhost:3000`)
- `NEXT_PUBLIC_DEFAULT_REGION` (defaults to `mv`)
- `NEXT_PUBLIC_BASE_URL`

## Scripts

- `yarn workspace aerotrek dev` — development server
- `yarn workspace aerotrek build` — production build
- `yarn workspace aerotrek start` — serve the production build
