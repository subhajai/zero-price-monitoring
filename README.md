# Zero Price Products Monitor

Welcome to the Zero Price Products Monitor! This tool helps the App Support team find and monitor products in our Algolia catalog that have a price or final price of `0`.

It is designed to be lightweight, easy to run on your local laptop, and completely safe to use.

## Prerequisites

Before you begin, make sure you have the following installed on your laptop:

1. **Node.js**: You can download and install it from [https://nodejs.org/](https://nodejs.org/). (The LTS version is recommended.)
2. **Git**: You can download and install it from [https://git-scm.com/](https://git-scm.com/).

## Getting Started (Step-by-Step)

### Step 1: Download the code
Open your terminal (Command Prompt on Windows, or Terminal on Mac) and run this command to download the code to your laptop:
```bash
git clone https://github.com/subhajai/zero-price-monitoring.git
```

### Step 2: Open the folder
Change into the directory you just downloaded:
```bash
cd zero-price-monitoring
```

### Step 3: Install dependencies
Run this command to install the required libraries that the application needs to run:
```bash
npm install
```

### Step 4: Configure the Application
The application needs to know *which* Algolia environment to connect to. For security reasons, the keys are not saved in the code.

1. Find the file named `.env.example` in the folder.
2. Make a copy of that file and name the new file `.env` (make sure it starts with a dot).
3. Open the new `.env` file in any text editor (like Notepad, VS Code, or TextEdit).
4. Fill in the empty values with the correct Algolia credentials provided by your manager.

Your `.env` file should look something like this when you are done:
```env
ALGOLIA_APP_ID=YOUR_APP_ID_HERE
ALGOLIA_API_KEY=YOUR_API_KEY_HERE
ALGOLIA_INDEX_NAME=twd_cds_th_products
PORT=8888
```
*(Save and close the file after editing)*

### Step 5: Start the application
Now you are ready to run the monitor! Type this into your terminal:
```bash
npm start
```

### Step 6: View the Dashboard
Once the terminal says "Zero Price Monitor running at http://localhost:8888", open your web browser (Chrome, Edge, Safari, etc.) and go to this address:

👉 **http://localhost:8888**

## How it works

- **Searching:** You can use the search bar at the top of the table to instantly filter the products currently shown on the page by SKU.
- **Data Refresh:** The dashboard fetches data from Algolia when the server starts and stores it temporarily (caching it). It will automatically refresh its cache every 5 minutes to save on API costs, or you can force a refresh by clicking the "Refresh" button on the web page.

## Troubleshooting

- **Error: "Cannot find module" or similar when starting:** You probably skipped Step 3. Run `npm install` again.
- **Error: "Algolia credentials missing" or empty dashboard:** Double-check your `.env` file from Step 4. Make sure it is named exactly `.env` (not `.env.txt`) and that there are no spaces around the equal signs.
