// Use appropriate imports for file system operations, Markdown parsing, and types
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

type Props = {
  params: {
    slug: string;
  };
};

// The page component that renders the blog post
const Page = ({ params }: Props) => {
  // Derive the path to the Markdown file from the slug
  const postsDirectory = path.join(process.cwd(), "src/articles");
  const fullPath = path.join(postsDirectory, `${params.slug}.md`);

  // Synchronously read and parse the Markdown file
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data: metaData, content } = matter(fileContents);
  const processedContent = remark().use(html).processSync(content);
  const contentHtml = processedContent.toString();

  return (
    <article
      title={metaData.title}
      className="prose prose-lg max-w-4xl mx-auto my-12 px-4 sm:px-6 lg:px-8"
    >
      <div
        className="markdown"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </article>
  );
};

export default Page;
