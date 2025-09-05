const fs = require('fs');

// Categories and subcategories matching project defaults
const categories = {
  Portfolio: ['Stocks', 'Bonds', 'ETFs', 'Mutual Funds', 'Real Estate', 'Crypto', '401k', 'IRA', 'Emergency Fund', 'Index Funds', 'Investment Account', 'Trading', 'Savings'],
  Income: ['Salary', 'Bonus', 'Freelance', 'Side Hustle', 'Consulting', 'Commission', 'Tips', 'Business Income', 'Rental Income', 'Interest', 'Refund'],
  Mortgage: ['Monthly Payment', 'Extra Principal', 'Interest', 'PMI', 'Property Tax', 'Home Insurance', 'Escrow', 'Refinancing', 'Down Payment'],
  'Mortgage Rate': ['Rate Change', 'Refinance Rate', 'ARM Adjustment', 'Rate Lock', 'Points Payment', 'Rate Shopping', 'Fixed Rate', 'Variable Rate'],
  Cotisation: ['Pension Fund', 'Social Security', 'Retirement Plan', 'Employee Benefits', 'Union Dues', 'Professional Fees', 'Membership', 'Contribution'],
  Dividend: ['Stock Dividend', 'ETF Distribution', 'REIT Payment', 'Mutual Fund', 'Bond Interest', 'Preferred Stock', 'Reinvestment', 'Cash Payment'],
  'House Expenses': ['Utilities', 'Maintenance', 'Repairs', 'Property Tax', 'Insurance', 'HOA Fees', 'Landscaping', 'Security', 'Cleaning', 'Upgrades'],
  Expenses: ['Groceries', 'Gas', 'Shopping', 'Dining Out', 'Entertainment', 'Healthcare', 'Transportation', 'Personal Care', 'Subscriptions', 'Miscellaneous'],
  Debt: ['Credit Card', 'Student Loan', 'Car Loan', 'Personal Loan', 'Line of Credit', 'Medical Debt', 'Business Loan', 'Family Loan'],
  Generic: ['Miscellaneous', 'Other', 'Uncategorized', 'Transfer', 'Adjustment', 'Correction', 'Placeholder', 'Various', 'Mixed']
};

// Value expressions for mathjs testing
const mathExpressions = [
  '1200+300', '2500-200', '500*2', '3000/2', '1500+500', '2000-100', '750*2', '4000/4',
  '600+400', '1800-300', '900*1.5', '2400/3', '800+200', '1600-400', '550*3', '3300/6'
];

// Generate random date between start and end
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Format date as YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Generate random value
function randomValue(min = 5, max = 25000) {
  if (Math.random() < 0.05) { // 5% chance of math expression
    return mathExpressions[Math.floor(Math.random() * mathExpressions.length)];
  }
  return (Math.random() * (max - min) + min).toFixed(2);
}

// Generate extra descriptions matching project categories
const extraDescriptions = {
  Portfolio: ['Investment contribution', 'Asset purchase', 'Portfolio rebalancing', 'Retirement savings', 'Emergency fund', 'Growth investment', 'Dividend reinvestment'],
  Income: ['Monthly salary', 'Performance bonus', 'Client project', 'Side project', 'Consulting work', 'Freelance payment', 'Business revenue'],
  Mortgage: ['Monthly payment', 'Extra principal', 'Interest payment', 'Refinancing cost', 'Property tax escrow', 'Insurance escrow'],
  'Mortgage Rate': ['Rate adjustment', 'Refinancing', 'Rate lock fee', 'Point payment', 'Rate comparison', 'Market rate change'],
  Cotisation: ['Pension contribution', 'Retirement plan', 'Social security', 'Employee benefit', 'Union dues', 'Professional membership'],
  Dividend: ['Stock dividend', 'ETF distribution', 'REIT payment', 'Bond interest', 'Mutual fund payout', 'Dividend reinvestment'],
  'House Expenses': ['Utility bill', 'Maintenance work', 'Repair service', 'Property tax', 'Home insurance', 'HOA payment', 'Landscaping'],
  Expenses: ['Weekly shopping', 'Monthly subscription', 'Dining out', 'Entertainment', 'Healthcare', 'Transportation', 'Personal care'],
  Debt: ['Monthly payment', 'Extra principal', 'Interest charge', 'Minimum payment', 'Debt consolidation', 'Late fee'],
  Generic: ['Miscellaneous expense', 'Other income', 'Uncategorized', 'Transfer', 'Adjustment', 'Correction', 'Various expenses']
};

function generateCSV() {
  const startDate = new Date('2023-01-01');
  const endDate = new Date('2025-12-31');
  
  let csv = 'Category,Subcategory,Value,TimeStamp,Extra\n';
  
  const categoryKeys = Object.keys(categories);
  
  for (let i = 0; i < 2000; i++) {
    const category = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    const subcategoryList = categories[category];
    const subcategory = subcategoryList[Math.floor(Math.random() * subcategoryList.length)];
    
    let value = randomValue();
    
    // Make some values negative for expenses/debt
    if (['Expenses', 'Debt', 'House Expenses'].includes(category) && Math.random() < 0.3) {
      if (typeof value === 'string' && value.includes('+')) {
        // Don't make math expressions negative
      } else {
        value = '-' + Math.abs(parseFloat(value)).toFixed(2);
      }
    }
    
    const timestamp = formatDate(randomDate(startDate, endDate));
    
    const extraList = extraDescriptions[category];
    const extra = extraList[Math.floor(Math.random() * extraList.length)];
    
    // Handle commas in descriptions by quoting
    const quotedExtra = extra.includes(',') ? `"${extra}"` : extra;
    const quotedSubcategory = subcategory.includes(',') ? `"${subcategory}"` : subcategory;
    
    csv += `${category},${quotedSubcategory},${value},${timestamp},${quotedExtra}\n`;
  }
  
  return csv;
}

// Generate and save the CSV
const csvData = generateCSV();
fs.writeFileSync('tests/test-data.csv', csvData);
console.log('Generated tests/test-data.csv with 2000 entries');