import * as expenseModel from "../models/expense.model.js";

function validateAndFormatDate(dateInput) {
      if (!dateInput) return null;
      
      const dateStr = String(dateInput).trim();
      const yyyymmddRegex = /^\d{4}-\d{2}-\d{2}$/;
      
      if (yyyymmddRegex.test(dateStr)) {
            const parts = dateStr.split('-');
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);
            const day = parseInt(parts[2], 10);
            
            if (month < 1 || month > 12) {
                  throw new Error(`Invalid month in date: ${dateStr}`);
            }
            const daysInMonth = new Date(year, month, 0).getDate();
            if (day < 1 || day > daysInMonth) {
                  throw new Error(`Invalid day in date: ${dateStr}`);
            }
            return dateStr;
      }
      
      const parsed = new Date(dateStr);
      if (isNaN(parsed.getTime())) {
            throw new Error(`Invalid date format: ${dateStr}`);
      }
      
      const year = parsed.getFullYear();
      const month = String(parsed.getMonth() + 1).padStart(2, '0');
      const day = String(parsed.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
}

// Add Expense Service
export async function addExpense(data) {
      if (!data.amount || isNaN(data.amount) || Number(data.amount) <= 0) {
            throw new Error("Amount must be a positive number");
      }
      if (!data.category || data.category.trim() === "") {
            throw new Error("Category is required");
      }

      const validatedDate = validateAndFormatDate(data.date);

      return await expenseModel.createExpense({
            userId: data.userId,
            amount: Number(data.amount),
            category: data.category.trim(),
            description: data.description ? data.description.trim() : null,
            date: validatedDate
      });
}

// Get Expenses Service
export async function getExpenses(userId, filters) {
      return await expenseModel.getExpensesByUserId(userId, filters);
}

// Get Expense Details Service
export async function getExpenseDetails(id, userId) {
      const expense = await expenseModel.getExpenseById(id, userId);
      if (!expense) {
            throw new Error("Expense record not found");
      }
      return expense;
}

// Edit Expense Service
export async function editExpense(id, userId, data) {
      if (data.amount !== undefined && (isNaN(data.amount) || Number(data.amount) <= 0)) {
            throw new Error("Amount must be a positive number");
      }
      if (data.category !== undefined && data.category.trim() === "") {
            throw new Error("Category cannot be empty");
      }

      const validatedDate = data.date !== undefined ? validateAndFormatDate(data.date) : undefined;

      const updated = await expenseModel.updateExpense(id, userId, {
            amount: data.amount !== undefined ? Number(data.amount) : undefined,
            category: data.category ? data.category.trim() : undefined,
            description: data.description !== undefined ? (data.description ? data.description.trim() : null) : undefined,
            date: validatedDate
      });

      if (!updated) {
            throw new Error("Expense record not found or unauthorized to edit");
      }
      return updated;
}

// Delete Expense Service
export async function removeExpense(id, userId) {
      const deleted = await expenseModel.deleteExpense(id, userId);
      if (!deleted) {
            throw new Error("Expense record not found or unauthorized to delete");
      }
      return deleted;
}

// Get Expense Category Totals Service
export async function getCategoryTotals(userId) {
      return await expenseModel.getExpenseCategoryTotals(userId);
}

// Bulk Add Expenses Service
export async function addExpensesBulk(userId, expensesArray) {
      if (!Array.isArray(expensesArray) || expensesArray.length === 0) {
            throw new Error("Expenses list must be a non-empty array");
      }

      // Validate all items before inserting to maintain atomic transactions
      const validatedExpenses = expensesArray.map((item, index) => {
            if (!item.amount || isNaN(item.amount) || Number(item.amount) <= 0) {
                  throw new Error(`Item at index ${index}: Amount must be a positive number`);
            }
            if (!item.category || item.category.trim() === "") {
                  throw new Error(`Item at index ${index}: Category is required`);
            }
            let validatedDate;
            try {
                  validatedDate = validateAndFormatDate(item.date);
            } catch (err) {
                  throw new Error(`Item at index ${index}: ${err.message}`);
            }
            return {
                  amount: Number(item.amount),
                  category: item.category.trim(),
                  description: item.description ? item.description.trim() : null,
                  date: validatedDate
            };
      });

      return await expenseModel.createExpensesBulk(userId, validatedExpenses);
}
