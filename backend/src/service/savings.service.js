import * as savingsModel from "../models/savings.model.js";

export async function addGoal(data) {
      if (!data.name || data.name.trim() === "") {
            throw new Error("Goal name is required");
      }
      if (!data.targetAmount || isNaN(data.targetAmount) || Number(data.targetAmount) <= 0) {
            throw new Error("Target amount must be a positive number");
      }

      return await savingsModel.createGoal({
            userId: data.userId,
            name: data.name.trim(),
            targetAmount: Number(data.targetAmount),
            deadline: data.deadline || null
      });
}

export async function getGoals(userId) {
      return await savingsModel.getGoalsByUserId(userId);
}

export async function getGoalDetails(id, userId) {
      const goal = await savingsModel.getGoalById(id, userId);
      if (!goal) {
            throw new Error("Savings goal not found");
      }
      return goal;
}

export async function contributeToGoal(id, userId, contributionAmount) {
      if (!contributionAmount || isNaN(contributionAmount) || Number(contributionAmount) <= 0) {
            throw new Error("Contribution amount must be a positive number");
      }

      const goal = await savingsModel.getGoalById(id, userId);
      if (!goal) {
            throw new Error("Savings goal not found");
      }

      const newCurrentAmount = Number(goal.current_amount) + Number(contributionAmount);

      return await savingsModel.updateGoal(id, userId, {
            name: undefined,
            targetAmount: undefined,
            currentAmount: newCurrentAmount,
            deadline: undefined
      });
}

export async function editGoal(id, userId, data) {
      if (data.targetAmount !== undefined && (isNaN(data.targetAmount) || Number(data.targetAmount) <= 0)) {
            throw new Error("Target amount must be a positive number");
      }
      if (data.currentAmount !== undefined && (isNaN(data.currentAmount) || Number(data.currentAmount) < 0)) {
            throw new Error("Current saved amount cannot be negative");
      }
      if (data.name !== undefined && data.name.trim() === "") {
            throw new Error("Goal name cannot be empty");
      }

      const updated = await savingsModel.updateGoal(id, userId, {
            name: data.name ? data.name.trim() : undefined,
            targetAmount: data.targetAmount !== undefined ? Number(data.targetAmount) : undefined,
            currentAmount: data.currentAmount !== undefined ? Number(data.currentAmount) : undefined,
            deadline: data.deadline || undefined
      });

      if (!updated) {
            throw new Error("Savings goal not found or unauthorized to edit");
      }
      return updated;
}

export async function removeGoal(id, userId) {
      const deleted = await savingsModel.deleteGoal(id, userId);
      if (!deleted) {
            throw new Error("Savings goal not found or unauthorized to delete");
      }
      return deleted;
}
