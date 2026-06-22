import * as groupService from "../service/group.service.js";

export async function createGroup(req, res) {
      try {
            const { name, description } = req.body || {};
            const group = await groupService.createGroup(name, description, req.userId);
            
            return res.status(201).json({
                  success: true,
                  message: "Group created successfully",
                  data: group
            });
      } catch (error) {
            console.error("Create Group Error Details:", error);
            return res.status(400).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function getGroups(req, res) {
      try {
            const groups = await groupService.getGroups(req.userId);
            return res.status(200).json({
                  success: true,
                  data: groups
            });
      } catch (error) {
            console.error("Get Groups Error Details:", error);
            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function addMember(req, res) {
      try {
            const { id: groupId } = req.params;
            const { email, name } = req.body || {};

            const member = await groupService.addMember(groupId, { email, name });
            return res.status(200).json({
                  success: true,
                  message: "Member added successfully",
                  data: member
            });
      } catch (error) {
            console.error("Add Member Error Details:", error);
            return res.status(400).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function logExpense(req, res) {
      try {
            const { id: groupId } = req.params;
            const { amount, description, splitType, splits, date, paidBy } = req.body || {};

            const expense = await groupService.logGroupExpense({
                  groupId,
                  paidBy: paidBy || req.userId,
                  amount,
                  description,
                  splitType,
                  splits,
                  date
            });

            return res.status(201).json({
                  success: true,
                  message: "Group expense logged successfully",
                  data: expense
            });
      } catch (error) {
            console.error("Log Group Expense Error Details:", error);
            return res.status(400).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function getExpenses(req, res) {
      try {
            const { id: groupId } = req.params;
            const expenses = await groupService.getExpenses(groupId);
            
            return res.status(200).json({
                  success: true,
                  data: expenses
            });
      } catch (error) {
            console.error("Get Group Expenses Error Details:", error);
            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function getBalances(req, res) {
      try {
            const { id: groupId } = req.params;
            const result = await groupService.getGroupBalancesAndSettlements(groupId);
            
            return res.status(200).json({
                  success: true,
                  data: result
            });
      } catch (error) {
            console.error("Get Group Balances Error Details:", error);
            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function deleteGroup(req, res) {
      try {
            const { id: groupId } = req.params;
            await groupService.deleteGroup(groupId, req.userId);
            
            return res.status(200).json({
                  success: true,
                  message: "Group deleted successfully"
            });
      } catch (error) {
            console.error("Delete Group Error Details:", error);
            return res.status(400).json({
                  success: false,
                  message: error.message
            });
      }
}
