import fs from "fs";
import path from "path";
import { cn } from "@/lib/utils";
import matter from "gray-matter";
import Link from "next/link";

// Format date helper function
function formatDate(dateString: string) {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

// Type for blog post metadata
type PostMetadata = {
	title: string;
	publishedAt: string;
	summary: string;
	slug: string;
};

// Function to get all blog posts
function getBlogPosts(): PostMetadata[] {
	// Get all files from the blog directory
	const blogDirectory = path.join(process.cwd(), "content/blog");
	const filenames = fs.readdirSync(blogDirectory);

	// Get the frontmatter from each file
	const posts = filenames
		.filter((filename) => filename.endsWith(".mdx"))
		.map((filename) => {
			const filePath = path.join(blogDirectory, filename);
			const fileContent = fs.readFileSync(filePath, "utf8");
			const { data } = matter(fileContent);
			return {
				title: data.title,
				publishedAt: data.publishedAt,
				summary: data.summary,
				slug: filename.replace(/\.mdx$/, ""),
			};
		});

	return posts.sort(
		(a, b) =>
			new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
	);
}

export default function BlogPage() {
	const posts = getBlogPosts();

	return (
		<div>
			<h1 className="text-3xl font-bold">Blog</h1>
			<div className="space-y-10 mt-2">
				{posts.map((post, i) => (
					<article
						key={post.slug}
						className={cn("border-b pb-8", {
							"border-0 pb-0": i === posts.length - 1,
						})}
					>
						<Link href={`/blog/${post.slug}`} className="block group">
							<h2 className="text-2xl font-semibold group-hover:text-cyan-500 transition-colors mb-0!">
								{post.title}
							</h2>
							<time className="text-sm text-muted-foreground block mt-2">
								{formatDate(post.publishedAt)}
							</time>

							<p className="mt-4 text-sm line-clamp-3 text-muted-foreground">
								{post.summary}
							</p>
						</Link>
					</article>
				))}
			</div>
		</div>
	);
}
