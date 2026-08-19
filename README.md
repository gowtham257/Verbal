# Verbal — HR Office Headcount Tracker

React (Vite) frontend and Express/MongoDB backend for adding, editing, and
managing employee records (Emp Id, Name, Designation, Salary, Experience,
Address, Mobile, Join Date).

## Prerequisites

- Node.js
- MongoDB running locally (default: `mongodb://127.0.0.1:27017/hr_tracker`)

## Running locally

**Backend** (default port `5000`):

```
cd server
npm install
cp .env.example .env   # then fill in ADMIN_PASSWORD_HASH and JWT_SECRET
npm run dev   # or: node server.js
```

Generate `ADMIN_PASSWORD_HASH` for your chosen password:

```
node -e "console.log(require('bcryptjs').hashSync('yourpassword', 10))"
```

`JWT_SECRET` can be any random string, e.g.:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Frontend** (default port `5173`; Vite picks the next free port if busy —
e.g. `http://localhost:5174`):

```
cd client
npm install
npm run dev
```

Open the frontend URL printed in the terminal in your browser (for example,
[http://localhost:5174](http://localhost:5174)). The Vite dev server proxies
`/api` requests to `http://localhost:5000`.

## API Endpoints

`/api/employees` routes require a login — send the token from
`/api/auth/login` as `Authorization: Bearer <token>`.

| Method | Path                  | Description              |
| ------ | ---------------------- | ------------------------ |
| POST   | `/api/auth/login`      | Log in, returns `{ token, username }` |
| GET    | `/api/employees`       | List all employees       |
| GET    | `/api/employees/:id`   | Get a single employee    |
| POST   | `/api/employees`       | Create a new employee    |
| PUT    | `/api/employees/:id`   | Update an existing employee |
| DELETE | `/api/employees/:id`   | Delete an employee       |
| GET    | `/api/health`          | Health check (no auth)   |

## Repository

Public on GitHub: [gowtham257/Verbal](https://github.com/gowtham257/Verbal).
The `master` branch tracks `origin/master`. `node_modules/` and `.env` are
excluded via `.gitignore`.

To publish future changes:

```
git add -A
git commit -m "..."
git push
```

## Possible next steps

- Export employee directory to CSV
- Chart of headcount over time
