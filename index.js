const express = require('express');
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
require('dotenv').config();
const itemsPool = require('./DBConfig'); // Change the path accordingly

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/addDataForm', (req, res) => {
    res.render('form');
});

app.post('/addData', async (req, res) => {
    try {
        const { sno, date, particular, amt, dataType } = req.body;
        const tableName = dataType === 'expense' ? 'expense' : 'income';
        const insertQuery = `INSERT INTO ${tableName} (sno, date, particular, amt) VALUES ($1, $2, $3, $4)`;
        await itemsPool.query(insertQuery, [sno, date, particular, amt]);

        res.redirect('/');
    } catch (error) {
        console.error('Error adding data to the database:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Display the data
app.get('/', async (req, res) => {
    try {
        const expenseQuery = 'SELECT * FROM expense';
        const expenseResult = await itemsPool.query(expenseQuery);
        const expenseData = expenseResult.rows;

        const incomeQuery = 'SELECT * FROM income';
        const incomeResult = await itemsPool.query(incomeQuery);
        const incomeData = incomeResult.rows;

        res.render('index', { expenseData, incomeData });
    } catch (error) {
        console.error('Error fetching data from the database:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/analytics', async (req, res) => {
    try {
        const expenseTotalAmt = await itemsPool.query("SELECT amt FROM expense");
        const expenseData = expenseTotalAmt.rows.map(row => row.amt);

        const sumOfExpense = expenseData.reduce((total, value) => total + value, 0);

        const incomeTotalAmt = await itemsPool.query("SELECT amt FROM income");
        const incomeData = incomeTotalAmt.rows.map(row => row.amt);

        const sumOfIncome = incomeData.reduce((total, value) => total + value, 0);

        const totalProfit = Math.max(sumOfIncome - sumOfExpense, 0);
        const totalLoss = Math.max(sumOfExpense - sumOfIncome, 0);

        res.render('analytics.ejs', {
            expenseData,
            incomeData,
            totalProfit,
            totalLoss,
            sumOfExpense,
            sumOfIncome,
        });
    } catch (error) {
        console.error('Error fetching data from the database:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/downloadPDF', async (req, res) => {
    try {
        // Fetch the data needed for the PDF
        const expenseTotalAmt = await itemsPool.query("SELECT amt FROM expense");
        const expenseData = expenseTotalAmt.rows.map(row => row.amt);

        const sumOfExpense = expenseData.reduce((total, value) => total + value, 0);

        const incomeTotalAmt = await itemsPool.query("SELECT amt FROM income");
        const incomeData = incomeTotalAmt.rows.map(row => row.amt);

        const sumOfIncome = incomeData.reduce((total, value) => total + value, 0);

        const totalProfit = Math.max(sumOfIncome - sumOfExpense, 0);
        const totalLoss = Math.max(sumOfExpense - sumOfIncome, 0);

        // Generate a dynamic filename based on the current date and time
        const filename = `analytics_${moment().format('YYYYMMDD')}.pdf`;

        // Create a new PDF document
        const pdfDoc = new PDFDocument();

        // Add content to the PDF
        pdfDoc.fontSize(20).text('NASAR ALOTIABI PVT LTD', { align: 'center' });

        pdfDoc.fontSize(15).text('Expense and Income Analytics', { align: 'center' });

        const currentDate = moment().format('MMMM DD, YYYY [at] h:mm A');
        pdfDoc.fontSize(12).text(`Date and Time: ${currentDate}`, { align: 'center' });

        pdfDoc.moveDown(); // Move the cursor down for additional content

        // Extract content from cards
        const cardContent = [
            { title: 'Total Expense', value: sumOfExpense },
            { title: 'Total Income', value: sumOfIncome },
            { title: 'Total Profit', value: totalProfit },
            { title: 'Total Loss', value: totalLoss },
        ];

        cardContent.forEach(content => {
            pdfDoc.text(content.title + ': ' + content.value, { align: 'center' });
        });

        // Set response headers for the download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

        // Create a readable stream from the PDF content and pipe it to the response
        const pdfStream = pdfDoc.pipe(res);
        pdfDoc.end();

        // Wait for the PDF stream to finish
        pdfStream.on('finish', () => {
            console.log('PDF stream finished');
        });

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/removeExpense', async (req, res) => {
    try {
        const { sno } = req.body;
        const deleteQuery = 'DELETE FROM expense WHERE sno = $1';
        await itemsPool.query(deleteQuery, [sno]);
        res.redirect('/');
    } catch (error) {
        console.error('Error removing expense:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/removeIncome', async (req, res) => {
    try {
        const { sno } = req.body;
        const deleteQuery = 'DELETE FROM income WHERE sno = $1';
        await itemsPool.query(deleteQuery, [sno]);
        res.redirect('/');
    } catch (error) {
        console.error('Error removing income:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});
