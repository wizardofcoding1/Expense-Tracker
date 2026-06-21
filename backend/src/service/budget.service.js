import * as budgetModel from "../models/budget.model.js";

export async function setBudget(data) {
      if (!data.limitAmount || isNaN(data.limitAmount) || Number(data.limitAmount) <= 0) {
            throw new Error("Limit amount must be a positive number");
      }
      if (!data.category || data.category.trim() === "") {
            throw new Error("Category is required");
      }
      if (!data.month || isNaN(data.month) || Number(data.month) < 1 || Number(data.month) > 12) {
            throw new Error("Month must be a number between 1 and 12");
      }
      if (!data.year || isNaN(data.year) || Number(data.year) < 1000 || Number(data.year) > 9999) {
            throw new Error("Year must be a valid 4-digit number");
      }

      return await budgetModel.upsertBudget({
            userId: data.userId,
            category: data.category.trim(),
            limitAmount: Number(data.limitAmount),
            month: Number(data.month),
            year: Number(data.year)
      });
}

export async function getBudgets(userId, month, year) {
      if (!month || isNaN(month) || !year || isNaN(year)) {
            throw new Error("Month and year are required and must be valid numbers");
      }
      return await budgetModel.getBudgetsByUserId(userId, Number(month), Number(year));
}

export async function getBudgetStatus(userId, month, year) {
      if (!month || isNaN(month) || !year || isNaN(year)) {
            throw new Error("Month and year are required and must be valid numbers");
      }
      return await budgetModel.getBudgetStatusQuery(userId, Number(month), Number(year));
}

export async function compareExpensesToBudget(userId, { spentMonth, spentYear, compareMonth, compareYear }) {
      const now = new Date();
      const currentMonth = now.getMonth() + 1; // 1-12
      const currentYear = now.getFullYear();

      const finalSpentMonth = spentMonth ? Number(spentMonth) : currentMonth;
      const finalSpentYear = spentYear ? Number(spentYear) : currentYear;

      // Default comparison is with the previous month's budget
      let defaultCompareMonth;
      let defaultCompareYear;
      if (finalSpentMonth === 1) {
            defaultCompareMonth = 12;
            defaultCompareYear = finalSpentYear - 1;
      } else {
            defaultCompareMonth = finalSpentMonth - 1;
            defaultCompareYear = finalSpentYear;
      }

      const finalCompareMonth = compareMonth ? Number(compareMonth) : defaultCompareMonth;
      const finalCompareYear = compareYear ? Number(compareYear) : defaultCompareYear;

      // Validation
      if (finalSpentMonth < 1 || finalSpentMonth > 12 || finalCompareMonth < 1 || finalCompareMonth > 12) {
            throw new Error("Months must be numbers between 1 and 12");
      }
      if (finalSpentYear < 1000 || finalSpentYear > 9999 || finalCompareYear < 1000 || finalCompareYear > 9999) {
            throw new Error("Years must be valid 4-digit numbers");
      }

      return await budgetModel.compareExpensesToBudgetQuery(userId, {
            spentMonth: finalSpentMonth,
            spentYear: finalSpentYear,
            compareMonth: finalCompareMonth,
            compareYear: finalCompareYear
      });
}
