# Testing Guide

This document provides step-by-step instructions to test key features of the Catalog Management System.

## 1. Testing Duplicate Import Handling

To verify that the system correctly handles duplicate products during import (Update vs. Skip vs. Add), follow these steps:

### Step 1: Prepare Test Data
1.  **Export your current catalog** from the **Settings** tab to have a backup.
2.  Create a new file named `test_import.json` on your computer.
3.  Paste the following JSON content into it. This data assumes you have at least one product. **Replace `"EXISTING_ID_HERE"` with a real ID from your exported catalog** to test the "Update" feature.

```json
[
  {
    "id": "EXISTING_ID_HERE",
    "name": "Updated Existing Product",
    "category": "Electronics",
    "buyPrice": 5000,
    "sellPrice": 8000,
    "description": "This product's price and name should be updated."
  },
  {
    "id": "new_id_123",
    "name": "New Unique Product",
    "category": "Accessories",
    "buyPrice": 100,
    "sellPrice": 200,
    "description": "This is a completely new product."
  },
  {
    "id": "different_id_456",
    "name": "Existing Product Name", 
    "category": "Test",
    "buyPrice": 10,
    "sellPrice": 20,
    "description": "This should be SKIPPED if a product with the name 'Existing Product Name' already exists."
  }
]
```

*Note: To test the "Skip" functionality, ensure you already have a product named "Existing Product Name" in your catalog, or change the name in the JSON to match one of your existing products.*

### Step 2: Perform Import
1.  Navigate to the **Settings** tab.
2.  Scroll to **Import Catalog**.
3.  Click **Upload File** and select your `test_import.json`.
4.  Confirm the import dialog.

### Step 3: Verify Results
1.  **Check the Alert**: You should see a summary popup like:
    ```
    Import successful!
    Added: 1
    Updated: 1
    Skipped (Duplicate Name): 1
    ```
2.  **Check the Products Tab**:
    -   **Updated**: The product with `EXISTING_ID_HERE` should now be named "Updated Existing Product" and have a price of 8000.
    -   **Added**: "New Unique Product" should appear in the list.
    -   **Skipped**: There should NOT be a duplicate entry for the product with the matching name.

## 2. Testing PDF Export

1.  Go to the **Products** tab.
2.  Select a few products using the checkboxes.
3.  Click the **PDF** button.
4.  In the popup modal:
    -   Uncheck "Sell Price" and "Description".
    -   Check "Image", "Name", "Buy Price".
5.  Click **Export PDF**.
6.  Open the downloaded PDF and verify it only shows the selected fields.

## 3. Testing Bill Management

1.  **Navigate to Bills**: Click on the "Bills" link in the sidebar.
2.  **Add a Bill**:
    -   Enter Store Name: "Test Store".
    -   Select Date: Today.
    -   Enter Amount: 500.
    -   (Optional) Upload an image.
    -   Click "Save Bill".
3.  **Verify List**:
    -   The bill should appear in the list below.
    -   Status should be "Pending" (clock icon).
4.  **Toggle Status**:
    -   Click the status badge. It should change to "Paid" (green check).
5.  **Calendar Integration**:
    -   Go to the **Calendar** tab.
    -   Click on today's date.
    -   You should see the bill listed under "Bills" (e.g., "Test Store - ₹500").
6.  **Reports**:
    -   Go back to **Bills**.
    -   Click **PDF Report** to download a PDF summary.
    -   Click **JSON** to download the raw data.
