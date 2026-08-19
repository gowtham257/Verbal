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
npm run dev   # or: node server.js
```

**Frontend** (default port `5173`, Vite will pick the next free port if busy):

```
cd client
npm install
npm run dev
```

Open the frontend URL printed in the terminal in your browser. The Vite dev
server proxies `/api` requests to `http://localhost:5000`.

## API Endpoints

Base path: `/api/employees`

| Method | Path                  | Description              |
| ------ | ---------------------- | ------------------------ |
| GET    | `/api/employees`       | List all employees       |
| GET    | `/api/employees/:id`   | Get a single employee    |
| POST   | `/api/employees`       | Create a new employee    |
| PUT    | `/api/employees/:id`   | Update an existing employee |
| DELETE | `/api/employees/:id`   | Delete an employee       |
| GET    | `/api/health`          | Health check              |

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

- Authentication/login for HR staff
- Export employee directory to CSV
- Chart of headcount over time
