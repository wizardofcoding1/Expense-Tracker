import * as expenseService from "../service/expense.service.js";

export async function addExpense(req, res) {
      try {
            const { amount, category, description, date } = req.body || {};
            const expense = await expenseService.addExpense({
                  userId: req.userId,
                  amount,
                  category,
                  description,
                  date
            });

            return res.status(201).json({
                  success: true,
                  message: "Expense added successfully",
                  data: expense
            });
      } catch (error) {
            console.error("Add Expense Error Details:", error);
            return res.status(400).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function getExpenses(req, res) {
      try {
            const { startDate, endDate, category } = req.query || {};
            const expenses = await expenseService.getExpenses(req.userId, { startDate, endDate, category });
            return res.status(200).json({
                  success: true,
                  data: expenses
            });
      } catch (error) {
            console.error("Get Expenses Error Details:", error);
            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function getExpenseDetails(req, res) {
      try {
            const { id } = req.params;
            const expense = await expenseService.getExpenseDetails(id, req.userId);
            return res.status(200).json({
                  success: true,
                  data: expense
            });
      } catch (error) {
            console.error("Get Expense Details Error Details:", error);
            return res.status(404).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function editExpense(req, res) {
      try {
            const { id } = req.params;
            const { amount, category, description, date } = req.body || {};
            const updatedExpense = await expenseService.editExpense(id, req.userId, {
                  amount,
                  category,
                  description,
                  date
            });

            return res.status(200).json({
                  success: true,
                  message: "Expense updated successfully",
                  data: updatedExpense
            });
      } catch (error) {
            console.error("Edit Expense Error Details:", error);
            return res.status(400).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function removeExpense(req, res) {
      try {
            const { id } = req.params;
            const deletedExpense = await expenseService.removeExpense(id, req.userId);

            return res.status(200).json({
                  success: true,
                  message: "Expense deleted successfully",
                  data: deletedExpense
            });
      } catch (error) {
            console.error("Remove Expense Error Details:", error);
            return res.status(400).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function getCategoryTotals(req, res) {
      try {
            const totals = await expenseService.getCategoryTotals(req.userId);
            return res.status(200).json({
                  success: true,
                  data: totals
            });
      } catch (error) {
            console.error("Get Category Totals Error Details:", error);
            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function addExpensesBulk(req, res) {
      try {
            const { expenses } = req.body || {};
            const insertedExpenses = await expenseService.addExpensesBulk(req.userId, expenses);

            return res.status(201).json({
                  success: true,
                  message: "Expenses synced successfully",
                  data: insertedExpenses
            });
      } catch (error) {
            console.error("Bulk Add Expenses Error Details:", error);
            return res.status(400).json({
                  success: false,
                  message: error.message
            });
      }
}
