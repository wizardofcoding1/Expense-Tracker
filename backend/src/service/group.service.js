import * as groupModel from "../models/group.model.js";
import { getUserByEmail } from "../models/user.model.js";

export async function createGroup(name, description, creatorId) {
      if (!name || name.trim() === "") {
            throw new Error("Group name is required");
      }
      return await groupModel.createGroup(name.trim(), description, creatorId);
}

export async function getGroups(userId) {
      return await groupModel.getGroupsByUserId(userId);
}

export async function addMemberByEmail(groupId, email) {
      if (!email || email.trim() === "") {
            throw new Error("Email is required");
      }

      const user = await getUserByEmail(email.trim());
      if (!user) {
            throw new Error(`User with email "${email}" not found`);
      }

      // Check if user is already a member
      const members = await groupModel.getGroupMembers(groupId);
      const isMember = members.some(m => m.id === user.id);
      if (isMember) {
            throw new Error("User is already a member of this group");
      }

      return await groupModel.addMemberToGroup(groupId, user.id);
}

export async function logGroupExpense(data) {
      const { groupId, paidBy, amount, description, splitType, splits, date } = data;

      if (!amount || isNaN(amount) || Number(amount) <= 0) {
            throw new Error("Expense amount must be a positive number");
      }
      if (!description || description.trim() === "") {
            throw new Error("Expense description is required");
      }

      const members = await groupModel.getGroupMembers(groupId);
      if (members.length === 0) {
            throw new Error("Cannot add an expense to a group with no members");
      }

      // 1. Create the Group Expense
      const expense = await groupModel.createGroupExpense({
            groupId,
            paidBy,
            amount: Number(amount),
            description: description.trim(),
            date: date || null
      });

      // 2. Distribute splits
      if (splitType === "custom") {
            if (!Array.isArray(splits) || splits.length === 0) {
                  throw new Error("Custom splits details are required");
            }
            // Check that the custom splits sum equals the total amount
            const sumOfSplits = splits.reduce((acc, curr) => acc + Number(curr.owedAmount), 0);
            if (Math.abs(sumOfSplits - Number(amount)) > 0.02) {
                  throw new Error(`Sum of custom splits (${sumOfSplits}) must match total amount (${amount})`);
            }

            for (const item of splits) {
                  await groupModel.createExpenseSplit(expense.id, item.userId, Number(item.owedAmount));
            }
      } else {
            // Equal Split
            const memberCount = members.length;
            
            // Financial round division:
            // Calculate base amount in cents, distribute remainder to the first member
            const totalCents = Math.round(Number(amount) * 100);
            const baseCents = Math.floor(totalCents / memberCount);
            let remainderCents = totalCents % memberCount;

            for (let i = 0; i < memberCount; i++) {
                  let userShareCents = baseCents;
                  if (remainderCents > 0) {
                        userShareCents += 1;
                        remainderCents -= 1;
                  }
                  const userShare = userShareCents / 100;
                  await groupModel.createExpenseSplit(expense.id, members[i].id, userShare);
            }
      }

      return expense;
}

export async function getExpenses(groupId) {
      return await groupModel.getGroupExpenses(groupId);
}

export async function getGroupBalancesAndSettlements(groupId) {
      const balances = await groupModel.getGroupNetBalances(groupId);

      // Settle Debts Simplification algorithm (Greedy Cash Flow Minimization)
      const debtors = [];
      const creditors = [];

      for (const row of balances) {
            const balanceVal = Number(row.net_balance);
            if (balanceVal < -0.01) {
                  debtors.push({
                        userId: row.user_id,
                        name: `${row.first_name} ${row.last_name}`,
                        balance: balanceVal
                  });
            } else if (balanceVal > 0.01) {
                  creditors.push({
                        userId: row.user_id,
                        name: `${row.first_name} ${row.last_name}`,
                        balance: balanceVal
                  });
            }
      }

      const settlements = [];

      // Settle debts greedily matching largest debtor with largest creditor
      let dIdx = 0;
      let cIdx = 0;

      while (dIdx < debtors.length && cIdx < creditors.length) {
            const debtor = debtors[dIdx];
            const creditor = creditors[cIdx];

            const oweAmount = -debtor.balance;
            const creditAmount = creditor.balance;

            const payment = Math.min(oweAmount, creditAmount);

            settlements.push({
                  from: debtor.userId,
                  fromName: debtor.name,
                  to: creditor.userId,
                  toName: creditor.name,
                  amount: Number(payment.toFixed(2))
            });

            debtor.balance += payment;
            creditor.balance -= payment;

            if (Math.abs(debtor.balance) < 0.01) {
                  dIdx++;
            }
            if (Math.abs(creditor.balance) < 0.01) {
                  cIdx++;
            }
      }

      return {
            balances,
            settlements
      };
}
