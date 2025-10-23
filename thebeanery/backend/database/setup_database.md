# Database Setup Instructions

This guide will help you set up the `beanery` database for The Beanery application.

## Prerequisites

- XAMPP installed (includes MySQL/MariaDB and phpMyAdmin)
- XAMPP Apache and MySQL services running

## Method 1: Using phpMyAdmin (Recommended)

### Step 1: Start XAMPP Services
1. Open XAMPP Control Panel
2. Start **Apache** service
3. Start **MySQL** service

### Step 2: Access phpMyAdmin
1. Open your web browser
2. Navigate to: `http://localhost/phpmyadmin`

### Step 3: Import Database
1. Click on **"New"** in the left sidebar or the **"Databases"** tab
2. Create a new database:
   - Database name: `beanery`
   - Collation: `utf8mb4_general_ci`
   - Click **"Create"**

3. Select the `beanery` database from the left sidebar

4. Click on the **"Import"** tab at the top

5. Click **"Choose File"** and select:
   ```
   thebeanery/backend/database/beanery.sql
   ```

6. Scroll down and click **"Import"**

7. You should see a success message: "Import has been successfully finished"

### Step 4: Verify Installation
1. Click on the `feedback` table in the left sidebar
2. Click the **"Browse"** tab
3. You should see 5 sample feedback entries

## Method 2: Using MySQL Command Line

### Step 1: Open MySQL Command Line
1. Open XAMPP Control Panel
2. Click **"Shell"** button to open terminal

### Step 2: Login to MySQL
```bash
mysql -u root -p
```
(Press Enter when prompted for password if you haven't set one)

### Step 3: Create and Import Database
```sql
CREATE DATABASE IF NOT EXISTS beanery;
USE beanery;
SOURCE C:/xampp/htdocs/BarilMidterAct2/thebeanery/backend/database/beanery.sql;
```

### Step 4: Verify Installation
```sql
SHOW TABLES;
SELECT * FROM feedback;
```

You should see the feedback table with 5 entries.

## Database Configuration

The backend server is already configured to connect to:
- **Host**: localhost (127.0.0.1)
- **User**: root
- **Password**: (empty)
- **Database**: beanery

If you need to change these settings, edit `backend/server.js`:

```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Add your password here if needed
  database: 'beanery'
};
```

## Testing the Connection

### Step 1: Start the Backend Server
```bash
cd backend
npm install
npm start
```

You should see:
```
Database initialized successfully
Server is running on http://localhost:3001
```

### Step 2: Test API Endpoints

**Health Check:**
Open browser and visit: `http://localhost:3001/api/health`

Should return:
```json
{"status":"ok","message":"Server is running"}
```

**Get All Feedback:**
Visit: `http://localhost:3001/api/feedback`

Should return all feedback entries from the database.

**Get Feedback Statistics:**
Visit: `http://localhost:3001/api/feedback/stats`

Should return statistics about the feedback.

## Troubleshooting

### Error: "Cannot connect to database"
- Make sure MySQL service is running in XAMPP
- Check database credentials in `server.js`
- Verify database name is exactly `beanery`

### Error: "Table 'beanery.feedback' doesn't exist"
- Re-import the SQL file
- Make sure you selected the correct database before importing

### Error: "Access denied for user 'root'@'localhost'"
- Check if you have a password set for MySQL root user
- Update the password in `backend/server.js`

### Port 3001 already in use
- Change the PORT in `backend/server.js` to a different number (e.g., 3002)
- Update the API URL in `src/Menu.tsx` to match the new port

## Sample Data Included

The database comes with 5 sample feedback entries:
1. Rating 4: "Tastes good!"
2. Rating 2: "I couldn't taste the lemon on the lemon cake but the affogato was buzzin'"
3. Rating 1: "I wish they would add frappe more"
4. Rating 5: "The pound cake was really good. I'll come again."
5. Rating 3: "Flat white was 50/50 but glad, my partner likes it"

## Next Steps

After setting up the database:
1. Start the backend server: `npm start` (in backend folder)
2. Start the React app: `npm run dev` (in main folder)
3. Navigate to Menu page and test the feedback form
4. Submit new feedback and verify it's saved to the database

---

**Database Setup Complete!** 🎉

