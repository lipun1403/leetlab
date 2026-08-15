# LeetLab

**LeetLab** is a full-stack online coding platform inspired by LeetCode, where users can solve programming problems, execute code, and submit solutions against test cases.

## ✨ Features

* 🔐 **Authentication**

  * User registration and login
  * JWT-based authentication
  * Protected routes

* 🧩 **Problem Solving**

  * Browse coding problems
  * View problem descriptions, constraints, examples, and test cases
  * Write solutions directly in the browser

* 💻 **Online Code Execution**

  * Execute code directly from the platform
  * Supports multiple programming languages
  * Custom/sample input execution

* 🧪 **Code Submission**

  * Submit solutions against test cases
  * Automatic output comparison
  * Submission status and execution results

* ⚡ **Judge0 Integration**

  * Secure remote code execution through Judge0
  * Handles compilation and execution of submitted programs

* 📊 **Submission Tracking**

  * View previous submissions
  * Track accepted and failed solutions
  * Store execution results

* 📝 **Problem Management**

  * Create coding problems
  * Add descriptions, constraints, examples, test cases, and reference solutions

* 🚀 **Redis Caching**

  * Caching support for frequently accessed data
  * Helps reduce unnecessary database queries

* 🎨 **Modern Frontend**

  * Interactive React-based interface
  * Zustand for client-side state management
  * Responsive coding experience

## 🛠️ Tech Stack

| Category         | Technologies                 |
| ---------------- | ---------------------------- |
| Frontend         | React.js, Vite, Tailwind CSS |
| State Management | Zustand                      |
| Backend          | Node.js, Express.js          |
| Database         | PostgreSQL                   |
| ORM              | Prisma                       |
| Authentication   | JWT                          |
| Cache            | Redis                        |
| Code Execution   | Judge0                       |
| Containerization | Docker                       |

## 🏗️ Architecture

```text
                    ┌─────────────────┐
                    │     React UI    │
                    │   Code Editor   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Express API    │
                    │     Server      │
                    └───────┬─┬───────┘
                            │ │
                 ┌──────────┘ └──────────┐
                 ▼                       ▼
        ┌─────────────────┐     ┌─────────────────┐
        │   PostgreSQL    │     │      Redis      │
        │     + Prisma    │     │     Cache       │
        └─────────────────┘     └─────────────────┘
                            │
                            ▼
                    ┌─────────────────┐
                    │     Judge0      │
                    │ Code Execution  │
                    └─────────────────┘
```

## 🔄 Code Execution Flow

### Run Code

```text
User Code
    ↓
React Frontend
    ↓
Express API
    ↓
Judge0
    ↓
Execution Result
    ↓
Frontend
```

### Submit Solution

```text
User Code
    ↓
Express API
    ↓
Test Cases
    ↓
Judge0
    ↓
Output Comparison
    ↓
Submission Result
```

## 🗄️ Core Data Model

```text
User
 ├── Submissions
 └── Problems Created

Problem
 ├── Examples
 ├── Test Cases
 ├── Reference Solution
 └── Submissions

Submission
 ├── User
 └── Problem
```

## 🎯 Project Highlights

* Built a complete **full-stack coding platform** from scratch.
* Integrated **Judge0** for program compilation and execution.
* Implemented **JWT authentication and protected APIs**.
* Designed a relational data model using **PostgreSQL and Prisma**.
* Used **Redis** for caching and performance optimization.
* Implemented separate **Run** and **Submit** workflows for sample and hidden test cases.
* Built reusable React components and centralized application state using **Zustand**.

## 📸 Screenshots

*Add screenshots of the problem page, code editor, submissions, and dashboard here.*

## 🚧 Future Improvements

* Contest system
* Leaderboards
* Coding streaks
* Problem filtering and search
* User profiles
* Discussion system
* Submission analytics
* Difficulty-based recommendations
* More language support

## 👨‍💻 Author

**Pradyumna**
