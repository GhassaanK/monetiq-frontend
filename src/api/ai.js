import { aiApi } from "./aiClient";

export const analyzeExpenses = async (expenses) => {
  if (!expenses || !Array.isArray(expenses)) {
    throw new Error("Expenses must be an array");
  }
  return aiApi.post("/analyze-expenses/", expenses);
};

export const classifyReceiptImage = async (file) => {
  if (!file) {
    throw new Error("File is required");
  }
  const formData = new FormData();
  formData.append("file", file);
  return aiApi.post("/classify-image/", formData);
};
