# 🚀 Quick Database Setup Guide

Follow these simple steps to set up the database for The Beanery application.

## ⚡ Quick Steps

### 1. Start XAMPP
- Open **XAMPP Control Panel**
- Click **Start** on both **Apache** and **MySQL**
- Wait for them to turn green

### 2. Import Database
- Open your browser and go to: **http://localhost/phpmyadmin**
- Click **"New"** in the left sidebar
- Database name: `beanery`
- Click **"Create"**
- Click on `beanery` database in the left sidebar
- Click **"Import"** tab at the top
- Click **"Choose File"** and select: `backend/database/beanery.sql`
- Click **"Import"** at the bottom
- ✅ Done! You should see "Import has been successfully finished"

### 3. Start Backend Server
Open a terminal in the backend folder:
```bash
cd backend
npm install
npm start
```

You should see:
```
Database "beanery" found!
Table "feedback" found with 5 entries!
Database initialized successfully ✓
Server is running on http://localhost:3001
```

### 4. Start Frontend
Open another terminal in the main folder:
```bash
npm install
npm run dev
```

### 5. Test It!
- Open http://localhost:5173
- Click **"Menu"**
- Scroll down to the feedback form
- Submit feedback and it will be saved to your database!

## ✅ Verify Database Setup

After importing, verify in phpMyAdmin:
1. Click on `beanery` database
2. Click on `feedback` table
3. Click **"Browse"** tab
4. You should see 5 sample feedback entries

## 🎯 What's Included

Your database includes sample feedback:
- ⭐⭐⭐⭐ "Tastes good!"
- ⭐⭐ "I couldn't taste the lemon on the lemon cake but the affogato was buzzin'"
- ⭐ "I wish they would add frappe more"
- ⭐⭐⭐⭐⭐ "The pound cake was really good. I'll come again."
- ⭐⭐⭐ "Flat white was 50/50 but glad, my partner likes it"

## ❓ Troubleshooting

**MySQL won't start in XAMPP?**
- Port 3306 might be in use
- Close any other MySQL/database programs
- Restart XAMPP

**Can't access phpMyAdmin?**
- Make sure Apache is running (not just MySQL)
- Try: http://127.0.0.1/phpmyadmin

**Backend shows "Database not found"?**
- Make sure you imported the SQL file
- Check database name is exactly `beanery` (lowercase)

**Frontend can't connect to backend?**
- Make sure backend server is running on port 3001
- Check for error messages in the terminal

---

**That's it! Your database is ready!** ☕✨

For detailed instructions, see: `backend/database/setup_database.md`

