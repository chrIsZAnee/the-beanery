# React Router DOM - Complete Implementation Guide

## 🎯 What is React Router DOM?

React Router DOM is the standard routing library for React applications. It enables navigation between different components/pages without reloading the browser, creating a true Single Page Application (SPA) experience.

---

## 📦 Installation

```bash
npm install react-router-dom
```

**Package installed in:** `package.json`

---

## 🗺️ Complete Route Structure

```
The Beanery App Routes:
┌─ / (Layout - with Header)
│  ├─ / (Home)
│  ├─ /menu (Menu)
│  ├─ /about (About)
│  ├─ /contact (Contact)
│  ├─ /gallery (Gallery)
│  └─ /coffee/:id (Coffee Details) ← Dynamic Route
│
├─ /admin (Protected Layout)
│  └─ /admin (Admin Dashboard) ← Protected Route
│
└─ /* (404 Not Found) ← Catch-all Route
```

---

## 🔧 Core Components Used

### 1. BrowserRouter (Router)
**File:** `App.tsx`

Wraps the entire application to enable routing.

```tsx
import { BrowserRouter as Router } from 'react-router-dom'

function App() {
  return (
    <Router>
      {/* All routes go here */}
    </Router>
  )
}
```

---

### 2. Routes & Route
**File:** `App.tsx`

Defines all available routes in the application.

```tsx
import { Routes, Route } from 'react-router-dom'

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/menu" element={<Menu />} />
  <Route path="/about" element={<About />} />
</Routes>
```

**Parameters:**
- `path`: URL path
- `element`: Component to render
- `index`: Makes it the default child route

---

### 3. Link
**File:** `Header.tsx`

Creates navigation links that DON'T reload the page.

```tsx
import { Link } from 'react-router-dom'

<Link to="/">Home</Link>
<Link to="/menu">Menu</Link>
<Link to="/about">About</Link>
```

**Why not `<a href>`?**
- `<a href>` reloads the entire page
- `<Link to>` only updates the component (SPA behavior)

---

### 4. Outlet
**File:** `Layout.tsx`

Renders child routes inside parent routes (nested routing).

```tsx
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <>
      <Header />
      <Outlet />  {/* Child routes appear here */}
    </>
  )
}
```

**How it works:**
```
Layout (Header + Outlet)
  ↓
Outlet renders → Home | Menu | About | Contact | etc.
```

---

### 5. useNavigate Hook
**Files:** `Home.tsx`, `CoffeeDetails.tsx`, `NotFound.tsx`, `Admin.tsx`

Programmatically navigate to different routes.

```tsx
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  
  const goToMenu = () => {
    navigate('/menu')
  }
  
  const goBack = () => {
    navigate(-1)  // Go back one page
  }
  
  return (
    <button onClick={goToMenu}>View Menu</button>
  )
}
```

**Use cases:**
- Navigate after form submission
- Navigate on button click
- Navigate after authentication
- Go back in history

---

### 6. useParams Hook
**File:** `CoffeeDetails.tsx`

Extract parameters from dynamic URLs.

```tsx
import { useParams } from 'react-router-dom'

function CoffeeDetails() {
  const { id } = useParams<{ id: string }>()
  
  // URL: /coffee/1  → id = "1"
  // URL: /coffee/2  → id = "2"
  
  return <h1>Coffee ID: {id}</h1>
}
```

**Route definition:**
```tsx
<Route path="/coffee/:id" element={<CoffeeDetails />} />
```

---

### 7. Navigate Component
**File:** `ProtectedRoute.tsx`

Redirect users to different routes.

```tsx
import { Navigate } from 'react-router-dom'

if (!isAuthenticated) {
  return <Navigate to="/" replace />
}
```

**Parameters:**
- `to`: Destination path
- `replace`: Replace current history entry (can't go back)

---

## 🎨 Routing Patterns Implemented

### 1. Basic Routing ✅
**Simple page navigation**

```tsx
// App.tsx
<Route path="/" element={<Home />} />
<Route path="/menu" element={<Menu />} />
<Route path="/about" element={<About />} />
```

**URLs:**
- `http://localhost:5173/` → Home
- `http://localhost:5173/menu` → Menu
- `http://localhost:5173/about` → About

---

### 2. Nested Routing ✅
**Parent route with shared layout**

```tsx
// App.tsx
<Route path="/" element={<Layout />}>
  <Route index element={<Home />} />
  <Route path="menu" element={<Menu />} />
  <Route path="about" element={<About />} />
</Route>
```

**Benefits:**
- Header stays visible on all pages
- No duplicate header code
- Cleaner component structure

```tsx
// Layout.tsx
function Layout() {
  return (
    <>
      <Header />      {/* Always visible */}
      <Outlet />      {/* Changes based on route */}
    </>
  )
}
```

---

### 3. Dynamic Routing ✅
**Routes with parameters**

```tsx
// App.tsx
<Route path="/coffee/:id" element={<CoffeeDetails />} />

// CoffeeDetails.tsx
const { id } = useParams()
// Access coffee details using the id
```

**Example URLs:**
- `/coffee/1` → Shows Cappuccino
- `/coffee/2` → Shows Latte
- `/coffee/3` → Shows Espresso

**Common use cases:**
- Product details pages
- User profiles
- Blog posts
- Any content with unique IDs

---

### 4. Protected Routing ✅
**Routes requiring authentication**

```tsx
// App.tsx
<Route 
  path="/admin" 
  element={
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  }
>
  <Route index element={<Admin />} />
</Route>

// ProtectedRoute.tsx
function ProtectedRoute({ children }) {
  const isAuth = checkAuth()
  
  if (!isAuth) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}
```

**How it works:**
1. User visits `/admin`
2. `ProtectedRoute` checks authentication
3. If not authenticated → prompt for password
4. If wrong password → redirect to home
5. If correct → show admin page

**Test:**
- Password: `admin123`

---

### 5. Catch-All Routing (404) ✅
**Handle unknown URLs**

```tsx
// App.tsx
<Route path="*" element={<NotFound />} />
```

**When it activates:**
- `/nonexistent` → 404 page
- `/random-url` → 404 page
- Any URL not defined → 404 page

**Must be last route** to catch all unmatched paths!

---

## 🔄 Navigation Methods

### Method 1: Link Component
**Best for:** Menu links, navigation bars

```tsx
import { Link } from 'react-router-dom'

<Link to="/menu">Menu</Link>
<Link to="/about">About</Link>
```

---

### Method 2: useNavigate Hook
**Best for:** Programmatic navigation, buttons, form submissions

```tsx
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()

// Navigate forward
navigate('/menu')

// Navigate with state
navigate('/menu', { state: { from: 'home' } })

// Navigate backward
navigate(-1)

// Navigate forward
navigate(1)
```

---

### Method 3: Navigate Component
**Best for:** Redirects, conditional navigation

```tsx
import { Navigate } from 'react-router-dom'

if (condition) {
  return <Navigate to="/login" />
}
```

---

## 📊 Comparison: Before vs After React Router

### Before (State-based navigation) ❌
```tsx
const [currentPage, setCurrentPage] = useState('home')

if (currentPage === 'menu') return <Menu />
if (currentPage === 'about') return <About />

<a onClick={() => setCurrentPage('menu')}>Menu</a>
```

**Problems:**
- ❌ No URL changes
- ❌ Can't share specific page URLs
- ❌ Browser back button doesn't work
- ❌ No bookmark support
- ❌ Not SEO friendly

---

### After (React Router) ✅
```tsx
<Router>
  <Routes>
    <Route path="/menu" element={<Menu />} />
    <Route path="/about" element={<About />} />
  </Routes>
</Router>

<Link to="/menu">Menu</Link>
```

**Benefits:**
- ✅ URL changes reflect current page
- ✅ Can share specific URLs
- ✅ Browser back/forward works
- ✅ Bookmarks work
- ✅ Better UX

---

## 🎯 Key Features Demonstrated

| Feature | Implementation | File | Status |
|---------|---------------|------|--------|
| Basic Routes | Multiple pages | App.tsx | ✅ |
| Nested Routes | Layout + Outlet | Layout.tsx | ✅ |
| Dynamic Routes | /coffee/:id | CoffeeDetails.tsx | ✅ |
| Protected Routes | Admin authentication | ProtectedRoute.tsx | ✅ |
| 404 Handling | Catch-all route | NotFound.tsx | ✅ |
| Link Navigation | Header links | Header.tsx | ✅ |
| Programmatic Nav | Button clicks | Home.tsx | ✅ |
| URL Parameters | useParams hook | CoffeeDetails.tsx | ✅ |
| Redirects | Navigate component | ProtectedRoute.tsx | ✅ |
| History API | Browser buttons | All pages | ✅ |

---

## 🧪 Testing Your Routes

### Test 1: Basic Navigation
1. Click links in header
2. Verify URL changes
3. Verify no page reload
4. Check browser back/forward buttons

### Test 2: Direct URL Access
1. Type URL in browser: `http://localhost:5173/menu`
2. Should load Menu page directly
3. Type: `http://localhost:5173/coffee/1`
4. Should load Coffee Details

### Test 3: Dynamic Routes
1. Go to Home page
2. Click on a coffee card
3. URL should change to `/coffee/1` (or 2, 3)
4. Correct details should display

### Test 4: Protected Routes
1. Go to: `http://localhost:5173/admin`
2. Should prompt for password
3. Enter: `admin123`
4. Should show admin dashboard

### Test 5: 404 Handling
1. Go to: `http://localhost:5173/nonexistent`
2. Should show 404 page
3. Click "Back to Home"
4. Should navigate to home

---

## 📁 File Organization

```
src/
├── components/           # Reusable components
│   ├── Header.tsx       # Navigation (uses Link)
│   ├── Layout.tsx       # Nested route wrapper (uses Outlet)
│   └── ProtectedRoute.tsx # Route protection (uses Navigate)
│
├── pages/               # Page components
│   ├── Home.tsx         # Landing page (uses useNavigate)
│   ├── Gallery.tsx      # 5th required page
│   ├── CoffeeDetails.tsx # Dynamic route (uses useParams)
│   ├── Admin.tsx        # Protected page
│   └── NotFound.tsx     # 404 page
│
├── Menu.tsx             # Menu page
├── About.tsx            # About page
├── Contact.tsx          # Contact page
│
└── App.tsx              # Router configuration
```

---

## 🎓 Learning Resources

### Official Documentation
- [React Router v6 Docs](https://reactrouter.com/)
- [Tutorial](https://reactrouter.com/en/main/start/tutorial)

### Key Concepts
1. **SPA (Single Page Application)**: One HTML file, JavaScript changes content
2. **Client-side Routing**: Navigation handled by JavaScript, not server
3. **History API**: Browser API that React Router uses
4. **Route Matching**: How React Router determines which component to show

---

## 🎉 Summary

Your Coffee Shop application now has a complete React Router DOM implementation with:

✅ **8 Routes** (exceeds 5 requirement)
✅ **Nested Routing** (Layout with Outlet)
✅ **Dynamic Routing** (/coffee/:id)
✅ **Protected Routing** (/admin with auth)
✅ **404 Handling** (Catch-all route)
✅ **Programmatic Navigation** (useNavigate)
✅ **URL Parameters** (useParams)
✅ **No Page Reloads** (True SPA)

**Perfect for learning and demonstrating React Router DOM concepts!** 🚀


