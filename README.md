# mini-trello

## Run code
1. Setup `.env` for `fe/` and `be/` (files included in email)
2. Install deps (root):
```
npm run install:all
```
3. Build both FE + BE:
```
npm run build:all
```
4. Start both FE + BE:
```
npm run start:all
```

Dev mode (hot reload):
```
npm run dev:all
```

## Architecture

```
mini-trello/
├─ be/
│  ├─ config/
│  ├─ src/
│  │  ├─ common/
│  │  │  ├─ constants/
│  │  │  └─ utils/
│  │  ├─ config/
│  │  ├─ controllers/
│  │  ├─ middleware/
│  │  ├─ models/
│  │  ├─ repos/
│  │  ├─ routes/
│  │  ├─ services/
│  │  └─ utils/
│  ├─ tests/
│  │  ├─ common/
│  │  └─ support/
│  └─ dist/
├─ fe/
│  ├─ app/
│  │  ├─ auth/
│  │  │  └─ github/
│  │  ├─ boards/
│  │  │  └─ [id]/
│  │  └─ dashboard/
│  ├─ public/
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ common/
│  │  │  ├─ layout/
│  │  │  └─ ui/
│  │  ├─ config/
│  │  ├─ features/
│  │  │  ├─ auth/
│  │  │  ├─ board/
│  │  │  ├─ dashboard/
│  │  │  └─ dnd/
│  │  ├─ hooks/
│  │  │  ├─ auth/
│  │  │  ├─ board/
│  │  │  └─ dashboard/
│  │  ├─ lib/
│  │  │  ├─ api/
│  │  │  ├─ query/
│  │  │  ├─ utils/
│  │  │  └─ validation/
│  │  ├─ services/
│  │  │  ├─ auth/
│  │  │  ├─ card/
│  │  │  ├─ dashboard/
│  │  │  └─ task/
│  │  └─ stores/
│  │     └─ auth/
│  └─ dist/
└─ shared/
   └─ types/
```
