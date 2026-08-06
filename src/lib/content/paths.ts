import path from "path";

export const CONTENT_ROOT = path.join(process.cwd(), "content");
export const FICHES_DIR = path.join(CONTENT_ROOT, "fiches");
export const QUIZZES_DIR = path.join(CONTENT_ROOT, "quizzes");
export const FAQS_DIR = path.join(CONTENT_ROOT, "faqs");
export const PRODUCTS_FILE = path.join(CONTENT_ROOT, "products.json");
export const COMPARISONS_FILE = path.join(CONTENT_ROOT, "comparisons.json");
