# Catalog Management System - Project Documentation

## 1. Project Overview
The **Catalog Management System** is a modern web application designed to help businesses manage their product catalogs, track sales, and monitor business performance. It features a responsive dashboard, product CRUD operations, sales tracking, and secure authentication.

### Tech Stack
- **Frontend Framework**: React 19 (via Vite)
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v7
- **State Management**: React Context API (Product, Sales, Auth)
- **Persistence**: LocalForage (IndexedDB wrapper) for client-side data storage
- **Icons**: Lucide React

## 2. Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation Steps
1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd catalog-management-system
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Start the development server**:
    ```bash
    npm run dev
    ```
4.  **Build for production**:
    ```bash
    npm run build
    ```

## 3. Key Features

### 3.1 Authentication & Security
- **Login System**: Secure login page restricting access to the application.
- **Default Credentials**:
    - **Username**: `admin`
    - **Password**: `admin123`
- **Session Timeout**: Automatic logout after **5 minutes** of inactivity (no mouse movement, clicks, or keystrokes).
- **Access Logs**: Tracks all login, logout, and sensitive access events with timestamps.
- **Protected Routes**: Prevents unauthorized access to internal pages.

### 3.2 Dashboard
- **Overview Cards**: Displays Total Products, Total Value, Low Stock items, and Categories.
- **Recent Activity**: Shows the latest product additions or updates.
- **Quick Actions**: Shortcuts to common tasks like adding products or viewing sales.

### 3.3 Product Management
- **Product List**: View all products with search and filter capabilities.
- **Add/Edit Product**: Comprehensive form to manage product details including:
    - Name, SKU, Category, Price (INR ₹), Stock Level.
    - **Multiple Images**: Support for adding multiple product images.
    - **Rich Description**: Detailed product descriptions.
- **Product Details**: View individual product specifications and stock status.

### 3.4 Sales Management
- **Sales Entry**: Record daily sales data.
- **Sales History**: View past sales records.
- **Currency**: All financial figures are displayed in Indian Rupees (₹).

### 3.5 Calendar
- **Event Tracking**: Manage business events, deadlines, or sales periods.

### 3.6 Settings
- **Configuration**: Manage application settings (e.g., profit margins, expense thresholds).

## 4. User Guide

### Logging In
1.  Open the application.
2.  Enter `admin` as the username.
3.  Enter `admin123` as the password.
4.  Click "Sign in".

### Managing Products
- **To Add**: Navigate to "Add Product" from the sidebar. Fill in the details and click "Save Product".
- **To Edit**: Go to "Products", click on a product, and select "Edit".
- **To Delete**: Go to "Products", click on a product, and select "Delete".

### Viewing Access Logs
1.  Navigate to **Access Logs** in the sidebar.
2.  Review the list of login/logout events and access timestamps.
3.  This is useful for auditing who accessed the system and when.

### Session Security
- If you leave the application open and walk away, the system will automatically log you out after 10 minutes to protect your data.
- You will need to log in again to continue working.

## 5. Directory Structure
```
src/
├── components/     # Reusable UI components (Layout, Sidebar, Cards, etc.)
├── context/        # Global state (Auth, Product, Sales)
├── pages/          # Page components (Dashboard, Login, ProductList, etc.)
├── utils/          # Utility functions (Database helpers)
├── App.jsx         # Main application component with Routing
└── main.jsx        # Entry point
```

## 6. Future Roadmap
- **Backend Integration**: Replace LocalForage with a real backend (Node.js/Express + MongoDB/PostgreSQL).
- **Role-Based Access Control (RBAC)**: Add support for multiple user roles (Manager, Staff).
- **Advanced Reporting**: Generate PDF/Excel reports for sales and inventory.
