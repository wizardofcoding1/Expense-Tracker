import * as savingsService from "../service/savings.service.js";

export async function addGoal(req, res) {
      try {
            const { name, targetAmount, deadline } = req.body || {};
            const goal = await savingsService.addGoal({
                  userId: req.userId,
                  name,
                  targetAmount,
                  deadline
            });

            return res.status(201).json({
                  success: true,
                  message: "Savings goal created successfully",
                  data: goal
            });
      } catch (error) {
            console.error("Create Goal Error Details:", error);
            return res.status(400).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function getGoals(req, res) {
      try {
            const goals = await savingsService.getGoals(req.userId);
            return res.status(200).json({
                  success: true,
                  data: goals
            });
      } catch (error) {
            console.error("Get Goals Error Details:", error);
            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function getGoalDetails(req, res) {
      try {
            const { id } = req.params;
            const goal = await savingsService.getGoalDetails(id, req.userId);
            return res.status(200).json({
                  success: true,
                  data: goal
            });
      } catch (error) {
            console.error("Get Goal Details Error Details:", error);
            return res.status(404).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function contributeToGoal(req, res) {
      try {
            const { id } = req.params;
            const { amount } = req.body || {};
            const updatedGoal = await savingsService.contributeToGoal(id, req.userId, amount);

            return res.status(200).json({
                  success: true,
                  message: "Contribution recorded successfully",
                  data: updatedGoal
            });
      } catch (error) {
            console.error("Contribute Goal Error Details:", error);
            return res.status(400).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function editGoal(req, res) {
      try {
            const { id } = req.params;
            const { name, targetAmount, currentAmount, deadline } = req.body || {};
            const updatedGoal = await savingsService.editGoal(id, req.userId, {
                  name,
                  targetAmount,
                  currentAmount,
                  deadline
            });

            return res.status(200).json({
                  success: true,
                  message: "Savings goal updated successfully",
                  data: updatedGoal
            });
      } catch (error) {
            console.error("Edit Goal Error Details:", error);
            return res.status(400).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function removeGoal(req, res) {
      try {
            const { id } = req.params;
            const deletedGoal = await savingsService.removeGoal(id, req.userId);

            return res.status(200).json({
                  success: true,
                  message: "Savings goal deleted successfully",
                  data: deletedGoal
            });
      } catch (error) {
            console.error("Remove Goal Error Details:", error);
            return res.status(400).json({
                  success: false,
                  message: error.message
            });
      }
}
