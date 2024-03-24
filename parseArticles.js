const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const articlesCsvDir = path.join(__dirname, "src", "articlesCsv");
const articlesDir = path.join(__dirname, "src", "articles");

// Ensure the articles directory exists
if (!fs.existsSync(articlesDir)) {
  fs.mkdirSync(articlesDir, { recursive: true });
}

// Function to create a Markdown file for each article
const createMarkdownFile = (title, bodyMarkdown, slug, meta, length, image) => {
  const filePath = path.join(articlesDir, `${slug}.md`);
  const date = new Date().toISOString().split("T")[0];

  const content = `---
title: "${title}"
date: "${date}"
description: "${meta}"
length: "${length}"
image: "${image}"
---

${bodyMarkdown}
`;

  fs.writeFileSync(filePath, content);
  console.log(`Article saved: ${filePath}`);
};

// Get all CSV files in the directory
const csvFiles = fs
  .readdirSync(articlesCsvDir)
  .filter((file) => path.extname(file).toLowerCase() === ".csv");

// Read and process each CSV file
csvFiles.forEach((file) => {
  const csvFilePath = path.join(articlesCsvDir, file);

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
      const title = row["Title"];
      const bodyMarkdown = row["Body (Markdown)"];
      const slug = row["URL Slug"];
      const meta = row["Meta"];
      const length = row["Length - Target"];
      const image = row["Image - Assets"];

      createMarkdownFile(title, bodyMarkdown, slug, meta, length, image);
    })
    .on("end", () => {
      console.log(`CSV file ${file} has been processed.`);
    });
});
