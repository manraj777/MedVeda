# 🌿 MedVeda – Holistic Remedy Hub

**MedVeda** is a modern web application for discovering, contributing, and saving natural home remedies and ayurvedic solutions. Built with a full-stack architecture, MedVeda empowers users to explore effective, natural alternatives to conventional treatments—powered by community insight and enhanced (soon) by AI-driven content cleaning.

[🔗 GitHub Repo](https://github.com/suryansh-it/MedVeda)

---

## 🛠️ Tech Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Frontend    | **Next.js** (App Router), **Tailwind CSS** |
| Backend     | **Django**, **Django REST Framework**     |
| Database    | **PostgreSQL**                |
| Caching     | **Redis**                     |
| Async Tasks | **Celery + Redis**            |
| Auth        | **JWT-based login/signup**    |
| Deployment  | **Docker**, `.env` support    |
| Future      | Algolia (search), AI cleaners |

---

## ✨ Features (MVP Complete ✅)

### 🔍 Remedy Search & Discovery
- Full-text remedy search with filters (category, rating)
- Browse by query or explore curated remedies
- Detailed remedy pages with ingredients, benefits & steps

### 📥 Remedy Submission System
- Logged-in users can submit remedies via form
- Supports **raw** or **AI-previewed** submissions
- Auto slug generation & category handling
- Admin dashboard to review and approve submissions

### 💾 Save Your Remedies
- Users can **save/unsave** remedies to their account
- Access saved remedies from the **Account Page**
- Protected routes using session/JWT logic

### ✍️ Reviews & Ratings
- Leave feedback and ratings for any remedy
- Star-based average rating updated in real-time
- Review deletion support for authors

### 📊 Admin Dashboard (In Progress)
- View total, approved, and pending submissions
- Approve, delete, or moderate remedies
- Compact dashboard with minimal controls

### 🔗 Shareable Pages
- Each remedy has a clean URL like `/remedies/turmeric-milk`
- Share button **automatically copies** the link to clipboard
- Easy sharing via social platforms (coming soon)

---

## 🧠 AI Enhancement (WIP 🚧)
- Early integration of AI for **auto-cleaning submissions**
- Structured extraction of title, ingredients, benefits, etc.
- Users can **preview cleaned output before final submit**
- Currently under testing — will improve moderation flow

---

## 🔐 Auth System
- JWT-based login & signup
- AuthContext stores and syncs user data
- Conditional UI elements based on role (`admin`, `user`)
- Auto redirect to login for protected actions

---

## 🧪 Roadmap

 🔎 Algolia-based real-time remedy search

 🧠 Fully-integrated AI cleansing (Gemini, OpenAI, etc.)

 📱 PWA support for offline remedies

 🔄 User contributions leaderboard

 🧑‍⚕️ Expert verified tags for trusted remedies


# Backend (Django)
cd backend/
pip install -r requirements.txt
python manage.py runserver

# Frontend (Next.js)
cd frontend/
npm install
npm run dev
