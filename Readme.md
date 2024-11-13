# Nasar AlOtaibi Pvt Ltd - Expense Tracker

## Overview
This web application, developed for Nasar AlOtaibi Pvt Ltd, serves as an Expense Tracker to manage and analyze financial data. It allows users to add and view expense and income data, provides analytics on total expenses, income, profit, and loss.

## Features
- **Add Data:** Easily add new expense or income data through a user-friendly form.
- **View Data:** Visualize your expense and income data in organized tables.
- **Analytics:** Gain insights into your financial situation with analytics on total expense, income, profit, and loss.
- **Remove Data:** Remove specific entries from the expense and income tables.

## Getting Started
### Clone the Repository:
```bash
git clone https://github.com/your-username/your-repo.git
```

### Install Dependencies:
```bash
cd your-repo
npm install
```

### Set Up PostgreSQL Locally:
1. Create a PostgreSQL database locally named 'world'.
2. Update PostgreSQL connection details in the `index.js` file.

### Set Up PostgreSQL on Render:
1. Create a PostgreSQL database on Render.
2. Add the external connection string to `.env` file:
    ```env
    DBConnLink=your-connection-string
    ```

### Import Sample Data:
1. Navigate to the 'data' folder.
2. Two CSV files, `income.csv` and `expense.csv`, are provided.
3. Import these files into your PostgreSQL database to create two tables, 'expense' and 'income':
    ```bash
    psql -h your-render-db-host -U your-render-db-user -d your-render-db-name -a -f expense.csv
    psql -h your-render-db-host -U your-render-db-user -d your-render-db-name -a -f income.csv
    ```

### Run the Application Locally:
```bash
node index.js
Access the Application: Open your browser and navigate to http://localhost:3000.
```

## Dependencies
- Express
- Body-parser
- pg (PostgreSQL client for Node.js)
- EJS (Embedded JavaScript templates)

## Contributing
Feel free to contribute to the development of this project. Submit bug reports, suggest new features, or create pull requests.
```

Make sure to replace placeholders like `your-username`, `your-repo`, and `your-connection-string` with the actual values.
