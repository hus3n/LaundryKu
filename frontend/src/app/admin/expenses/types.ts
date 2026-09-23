export interface Expense {
  id: string;
  category: string;
  amount: string | number;
  date: string;
  description?: string;
  createdAt: string;
}

export interface ExpenseFormData {
  category: string;
  amount: string;
  date: string;
  description: string;
}
