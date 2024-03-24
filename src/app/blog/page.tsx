import Seo from "@/components/Seo";
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { Fragment } from "react";

export type ArticleMeta = {
  title: string;
  description: string;
  image: string;
  length: string;
};

export default function Page() {
  const postsDirectory = path.join(process.cwd(), "src/articles");
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data: meta } = matter(fileContents);

      return {
        slug,
        meta: meta as ArticleMeta,
      };
    })
    .slice(0, 6);

  return (
    <Fragment>
      <Seo
        title="Articles"
        description="Learn how to start a business on Telegram, how to grow your audience, and how to make money on Telegram."
      />
      <div className="max-w-md mx-auto my-16">
        <h1 className="text-3xl mb-12 thick-underline">Articles</h1>
        <section className="py-4 mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
          {posts.map(({ slug, meta }) => (
            <a
              key={slug}
              href={`/blog/${slug}`}
              className="border border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-md p-4 block text-sm font-semibold  transition-colors duration-200"
            >
              <img src={meta.image} alt={meta.title} />
              {meta.title}
            </a>
          ))}
        </section>
      </div>
    </Fragment>
  );
}
