import * as incomeModel from "../models/income.model.js";

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

// Add Income Service 
export async function addIncome(data){
      if(!data.amount || isNaN(data.amount) || Number(data.amount) <= 0){
            throw new Error("Amount must be a Positive number");
      }
      if(!data.source || data.source.trim()===""){
            throw new Error("Source Is Required");
      }

      const validatedDate = validateAndFormatDate(data.date);

      return await incomeModel.createIncome({
            userId: data.userId,
            amount: Number(data.amount),
            source: data.source.trim(),
            description: data.description ? data.description.trim() : null,
            date: validatedDate
      });
}

// Get Income Services

export async function getIncomes(userId, filters){
      return await incomeModel.getIncomesByUserId(userId, filters);
}

// Get Income Details 
export async function getIncomeDetails(id, userId){
      const income = await incomeModel.getIncomeById(id, userId);
      if(!income){
            throw new Error("income record not found");
      }
      return income;
}

// Update Income 
export async function editIncome(id, userId, data){
      if(data.amount !== undefined && (isNaN(data.amount) || Number(data.amount)<=0)){
            throw new Error("Amount must be a Positive number");
      }

      if(data.source !== undefined && data.source.trim() === ""){
            throw new Error("Source Cannot Be Empty");
      }

      const validatedDate = data.date !== undefined ? validateAndFormatDate(data.date) : undefined;

      const updated = await incomeModel.updateIncome(id, userId, {
            amount: data.amount !== undefined ? Number(data.amount) : undefined,
            source: data.source ? data.source.trim() : undefined,
            description: data.description !== undefined ? (data.description ? data.description.trim() : null) : undefined,
            date: validatedDate
      });
      
      if(!updated){
            throw new Error("Income record not found or unauthorized");
      }
      return updated;
}


// Delete Income Service
export async function removeIncome(id, userId){
      const deleted = await incomeModel.deleteIncome(id, userId);

      if(!deleted){
            throw new Error("Income Record Not Found");
      }

      return deleted;
}

// Bulk Add Incomes Service
export async function addIncomesBulk(userId, incomesArray) {
      if (!Array.isArray(incomesArray) || incomesArray.length === 0) {
            throw new Error("Incomes list must be a non-empty array");
      }

      // Validate all items before inserting to maintain atomic transactions
      const validatedIncomes = incomesArray.map((item, index) => {
            if (!item.amount || isNaN(item.amount) || Number(item.amount) <= 0) {
                  throw new Error(`Item at index ${index}: Amount must be a positive number`);
            }
            if (!item.source || item.source.trim() === "") {
                  throw new Error(`Item at index ${index}: Source is required`);
            }
            let validatedDate;
            try {
                  validatedDate = validateAndFormatDate(item.date);
            } catch (err) {
                  throw new Error(`Item at index ${index}: ${err.message}`);
            }
            return {
                  amount: Number(item.amount),
                  source: item.source.trim(),
                  description: item.description ? item.description.trim() : null,
                  date: validatedDate
            };
      });

      return await incomeModel.createIncomesBulk(userId, validatedIncomes);
}