import { aiApi } from "./aiClient";

export const analyzeExpenses = (expenses) =>
  aiApi.post("/analyze-expenses/", expenses);

export const classifyReceiptImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return aiApi.post("/classify-image/", formData);
};
