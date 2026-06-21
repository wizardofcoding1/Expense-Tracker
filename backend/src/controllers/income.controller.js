import * as incomeService from "../service/income.service.js";

export async function addIncome(req, res) {
      try {
            const { amount, source, description, date } = req.body || {};
            const income = await incomeService.addIncome({
                  userId: req.userId,
                  amount,
                  source,
                  description,
                  date
            });

            return res.status(201).json({
                  success: true,
                  message: "Income added successfully",
                  data: income
            });
      } catch (error) {
            console.error("Add Income Error Details:", error);
            return res.status(400).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function getIncomes(req, res) {
      try {
            const { startDate, endDate, source } = req.query || {};
            const incomes = await incomeService.getIncomes(req.userId, { startDate, endDate, source });
            return res.status(200).json({
                  success: true,
                  data: incomes
            });
      } catch (error) {
            console.error("Get Incomes Error Details:", error);
            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function getIncomeDetails(req, res) {
      try {
            const { id } = req.params;
            const income = await incomeService.getIncomeDetails(id, req.userId);
            return res.status(200).json({
                  success: true,
                  data: income
            });
      } catch (error) {
            console.error("Get Income Details Error Details:", error);
            return res.status(404).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function editIncome(req, res) {
      try {
            const { id } = req.params;
            const { amount, source, description, date } = req.body || {};
            const updatedIncome = await incomeService.editIncome(id, req.userId, {
                  amount,
                  source,
                  description,
                  date
            });

            return res.status(200).json({
                  success: true,
                  message: "Income updated successfully",
                  data: updatedIncome
            });
      } catch (error) {
            console.error("Edit Income Error Details:", error);
            return res.status(400).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function removeIncome(req, res) {
      try {
            const { id } = req.params;
            const deletedIncome = await incomeService.removeIncome(id, req.userId);

            return res.status(200).json({
                  success: true,
                  message: "Income deleted successfully",
                  data: deletedIncome
            });
      } catch (error) {
            console.error("Remove Income Error Details:", error);
            return res.status(400).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function addIncomesBulk(req, res) {
      try {
            const { incomes } = req.body || {};
            const insertedIncomes = await incomeService.addIncomesBulk(req.userId, incomes);

            return res.status(201).json({
                  success: true,
                  message: "Incomes synced successfully",
                  data: insertedIncomes
            });
      } catch (error) {
            console.error("Bulk Add Incomes Error Details:", error);
            return res.status(400).json({
                  success: false,
                  message: error.message
            });
      }
}
