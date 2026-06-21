import * as budgetService from "../service/budget.service.js";

export async function setBudget(req, res) {
      try {
            const { category, limitAmount, month, year } = req.body || {};
            const budget = await budgetService.setBudget({
                  userId: req.userId,
                  category,
                  limitAmount,
                  month,
                  year
            });

            return res.status(200).json({
                  success: true,
                  message: "Budget limit set successfully",
                  data: budget
            });
      } catch (error) {
            console.error("Set Budget Error Details:", error);
            return res.status(400).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function getBudgets(req, res) {
      try {
            const { month, year } = req.query || {};
            const budgets = await budgetService.getBudgets(req.userId, month, year);
            return res.status(200).json({
                  success: true,
                  data: budgets
            });
      } catch (error) {
            console.error("Get Budgets Error Details:", error);
            return res.status(400).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function getBudgetStatus(req, res) {
      try {
            const { month, year } = req.query || {};
            const budgetStatus = await budgetService.getBudgetStatus(req.userId, month, year);
            return res.status(200).json({
                  success: true,
                  data: budgetStatus
            });
      } catch (error) {
            console.error("Get Budget Status Error Details:", error);
            return res.status(400).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function compareBudgets(req, res) {
      try {
            const { spentMonth, spentYear, compareMonth, compareYear } = req.query || {};
            const comparison = await budgetService.compareExpensesToBudget(req.userId, {
                  spentMonth,
                  spentYear,
                  compareMonth,
                  compareYear
            });

            return res.status(200).json({
                  success: true,
                  data: comparison
            });
      } catch (error) {
            console.error("Compare Budgets Error Details:", error);
            return res.status(400).json({
                  success: false,
                  message: error.message
            });
      }
}
