# Aerotrek UI primitives

Shared presentational components for the AeroTrek storefront. Import from `@/components/ui` or individual files.

## Tokens (`src/lib/ui`)

| File | Purpose |
|------|---------|
| `glass-panel.ts` | Glass panel + radius classes for `Container` |
| `content-shell.ts` | 80vw page column (`CONTENT_SHELL_CLASS`) |
| `button.ts` | Button variant/size class helpers |
| `input.ts` | Input/textarea variant classes |
| `form.ts` | Label variants, field spacing |

## Components

### Surfaces

- **`Container`** — frosted glass panel (footer, shop, cart, login, PDP detail, hero-adjacent sections). Use `className="!p-0"` when children manage padding.
- **`Card`** — solid white panel for account sections, reviews, auth recovery. Variants: `solid`, `muted`, `dashed`.

### Forms

- **`Button`** — variants: `primary`, `secondary`, `ghost`, `danger`, `auth`, `pill`, `accountSubmit`, `pdp`, `pdpMuted`, `checkoutPrimary`, `checkoutSecondary`, `wishlistDanger`, `wishlistGhost`
- **`Input`** — variants: `storefront`, `auth`, `review`, `checkout`
- **`Textarea`** — same variants as `Input` (default `review`)
- **`Label`** — variants: `storefront`, `auth`, `checkout`
- **`Field`** — label + control wrapper with optional hint/error
- **`ErrorMessage`** — inline alert for form/checkout errors

### Other

- **`Badge`** — pills/tags; use `statusBadgeVariant()` / `precheckBadgeVariant()` for orders
- **`IconButton`** — header hamburger / icon actions
- **`RadioIndicator`** + **`selectionCardClass`** — checkout shipping/payment selectors
- **`SelectionCard`** — selectable card button (checkout)
- **`AccordionItem`** — collapsible PDP sections
- **`PageSpinner`** — full-page loading overlay

## When to use what

| Use case | Component |
|----------|-----------|
| Shop/cart/footer glass sections | `Container` |
| Account accordion / address rows | `Card` |
| Login / account / PDP forms | `Field` + `Input` / `Button` |
| Checkout wizard | `Button` checkout variants + `Input` checkout variant |
| Order status chips | `Badge` + helper functions |

## Adding a new primitive

1. Add shared class strings to `src/lib/ui/` if reused.
2. Create the component under `src/components/ui/`.
3. Export from `src/components/ui/index.ts`.
4. Migrate one feature vertical slice first, then roll out.
