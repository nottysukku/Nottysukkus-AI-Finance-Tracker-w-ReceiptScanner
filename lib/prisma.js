import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

let db;

if (process.env.VERCEL || process.env.NODE_ENV === "production") {
  const dbPath = path.join("/tmp", "dev.db");
  const templatePath = path.join(process.cwd(), "prisma", "dev.db");

  try {
    if (!fs.existsSync(dbPath)) {
      console.log(`Copying database template from ${templatePath} to ${dbPath}`);
      // Ensure /tmp directory exists
      if (!fs.existsSync("/tmp")) {
        fs.mkdirSync("/tmp", { recursive: true });
      }
      fs.copyFileSync(templatePath, dbPath);
    }
  } catch (err) {
    console.error("Failed to copy SQLite database template to /tmp:", err);
  }

  db = new PrismaClient({
    datasources: {
      db: {
        url: `file:${dbPath}`,
      },
    },
  });
} else {
  db = globalThis.prisma || new PrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
  }
}

export { db };

