import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import remarkGfm from "remark-gfm";

// Format date helper function
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Get blog post by slug
async function getBlogPost(slug: string) {
  const filePath = path.join(process.cwd(), `content/blog/${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data: metadata, content } = matter(fileContent);
  return { metadata, content };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  // Read the file content with gray-matter
  const { metadata, content } = await getBlogPost(slug);
  
  // Format the date
  const formattedDate = formatDate(metadata.publishedAt);
  
  return (
    <div>
      <article>
        <header className="mb-6">
          <h1 className="text-3xl font-bold">{metadata.title}</h1>
          <span className="text-muted-foreground text-sm">{formattedDate}</span>
        </header>
        <div className="prose max-w-none">
          <MDXRemote
            source={content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkMath, remarkGfm],
                rehypePlugins: [rehypeKatex],
              },
            }}
          />
        </div>
      </article>
    </div>
  );
}

// This generates the static paths at build time
export async function generateStaticParams() {
  const blogDirectory = path.join(process.cwd(), "content/blog");
  const filenames = fs.readdirSync(blogDirectory);
  const slugs = filenames
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => filename.replace(/\.mdx$/, ""));
    
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;