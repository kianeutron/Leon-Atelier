# Léon Atelier

A classic-modern menswear e-commerce stack:

- Frontend: Next.js 14 (App Router) + TypeScript + TailwindCSS + Zustand + TanStack Query + Framer Motion
- Backend: .NET 8 Web API + EF Core (Npgsql) + OData v8 + DTOs + AutoMapper + FluentValidation + Serilog
- Database: Supabase Postgres (you already created it)

## Prerequisites

- Node.js 18+
- PNPM or NPM (examples use npm)
- .NET SDK 8.0+

## Environment

Backend connection string (password contains `#`; key/value format recommended):

```
ConnectionStrings__Default=Host=db.slsevcugnkblovytrxjg.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=Menswear111666#;SSL Mode=Require;Trust Server Certificate=true
```

Frontend env (copy `.env.example`):

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5252
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

## Run locally

Backend:

```
cd "menswear-api"
dotnet restore
dotnet build
dotnet run
```

Frontend:

```
cd "menswear-web"
npm install
npm run dev
```

- API: http://localhost:5252/odata
- Web: http://localhost:3000

## Notes

- OData: try `GET /odata/Products?$top=12&$filter=active eq true&$orderby=created_at desc`
- Theme: cream/brown palette baked into Tailwind config.
- Cart: Zustand local store (guest). Server cart to be wired after auth.

## Next

- Add more OData sets (Categories, Brands, Variants, Prices, Cart, Orders)
- Stripe payments (optional)
- Admin dashboard (optional)
