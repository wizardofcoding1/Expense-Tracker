import * as analyticsModel from "../models/analytics.model.js";

export async function getMonthlySummary(userId, month, year) {
      if (!month || isNaN(month) || Number(month) < 1 || Number(month) > 12) {
            throw new Error("Month must be a number between 1 and 12");
      }
      if (!year || isNaN(year) || Number(year) < 1000 || Number(year) > 9999) {
            throw new Error("Year must be a valid 4-digit number");
      }

      const summary = await analyticsModel.getMonthlySummaryQuery(userId, Number(month), Number(year));
      
      const totalIncome = Number(summary.total_income);
      const totalExpense = Number(summary.total_expense);
      const netSavings = totalIncome - totalExpense;

      return {
            totalIncome,
            totalExpense,
            netSavings
      };
}
