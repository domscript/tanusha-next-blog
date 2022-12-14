import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";
import CategoryLabel from "@/components/CategoryLabel";
import dateFormatter from "@/utils/dateFormatter";
import Canvas from "@/components/Canvas";
import { GetStaticProps, GetStaticPaths } from "next";
import { dateRu } from "@/utils/dateFormatter";

interface PostPageint {
  title: string;
  date: string;
  excerpt: string;
  cover_image: string;
  category: string;
  author: string;
  author_image: string;
}

export default function PostPage({
  frontmatter: { title, category, date, cover_image, author, author_image },
  content,
  slug,
}: {
  frontmatter: PostPageint;
  content: string;
  slug: string;
}) {
  return (
    <Layout title={title}>
      <p className="ml-5">
        <Link href="/blog">Вернуться</Link>
      </p>

      <div className="w-full px-4 py-3 md:px-10 md:py-6 bg-white rounded-lg shadow-md mt-6">
        <div className="sm:flex-row flex flex-col justify-between items-center mt-4">
          <h1 className="text-4xl text-gray-700 mb-7">{title}</h1>
          <CategoryLabel>{category}</CategoryLabel>
        </div>
        <Image
          src={cover_image}
          alt=""
          width={1500}
          height={1100}
          className="w-full rounded"
        />

        <div className="flex justify-between items-center bg-gray-50 p-2 my-8">
          <div className="flex items-center">
            <Canvas width={30} height={30} className="mx-2">
              <Image
                src={author_image}
                alt={author}
                width={20}
                height={20}
                className="mx-4 w-10 h-10 object-cover rounded hidden sm:block"
              />
            </Canvas>
            <h4>{author}</h4>
          </div>
          <div className="mr-4">{dateRu(date)}</div>
        </div>

        <div className="blog-text text-gray-800 mt-2 text-justify indent-6">
          <div
            dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
          ></div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync(path.join("posts"));

  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace(".md", ""),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context: {
  params?: { slug: string };
  locales: any;
  locale: any;
  defaultLocale: any;
}) => {
  if (!context.params) return;
  const { slug } = context.params;
  const markdownWithMeta = fs.readFileSync(
    path.join("posts", slug + ".md"),
    "utf-8"
  );

  const { data: data, content } = matter(markdownWithMeta);
  const frontmatter = {
    ...data,
    date: dateFormatter.format(new Date(data.date)),
  };
  return {
    props: {
      frontmatter,
      content,
      slug,
    },
  };
};
