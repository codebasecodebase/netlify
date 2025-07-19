import Link from "next/link";
import Image from "next/image";

interface Post {
    id: string
    name: string
    createdAt: string
    avatar: string
}

// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
export const revalidate = 100

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true // or false, to 404 on unknown paths

export async function generateStaticParams() {
    const posts: Post[] = await fetch('https://68206faf259dad2655ac8cff.mockapi.io/posts', {
        next: { revalidate: 100 } // Кэшируем на 1 час
    }).then(res => res.json());

    return posts.map(post => ({
        id: post.id.toString(),
    }));
}

export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ page?: string }>
}) {
    const { id } = await params
    const { page } = await searchParams
    const postsPerPage = 10
    // Получаем все посты для навигации
    const allPosts: Post[] = await fetch('https://68206faf259dad2655ac8cff.mockapi.io/posts').then(
        (res) => res.json()
    )
    const currentPage = Math.ceil((allPosts.findIndex(p => p.id === id) + 1) / postsPerPage)
    const post: Post = await fetch(`https://68206faf259dad2655ac8cff.mockapi.io/posts/${id}`).then(
        (res) => res.json()
    )


    // Находим текущий индекс поста
    const currentIndex = allPosts.findIndex(p => p.id === id)
    const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
    const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

    return (
        <div className="min-h-screen p-8 bg-gray-900">
            <div className="container">
                <nav className="flex items-center text-sm mb-8">
                    <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                        Блог
                    </Link>
                    <span className="mx-2 text-gray-500">/</span>
                    <Link href={`/blog?page=${currentPage}`} className="text-gray-400 hover:text-white transition-colors">
                        Страница {currentPage}
                    </Link>
                    <span className="mx-2 text-gray-500">/</span>
                    <span className="text-white">{post.name}</span>
                </nav>
                <article className="bg-white/5 p-8 rounded-xl backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-4 mb-6">
                        <Image
                            src={post.avatar}
                            alt="Аватар автора"
                            width={64}
                            height={64}
                            className="rounded-full object-cover border-2 border-white/20 shadow-lg"
                            loading="lazy"
                        />
                        <h1 className="text-3xl font-bold text-white">
                            {post.name}
                        </h1>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                        {post.createdAt}
                    </p>
                </article>
                <div className="mt-12 flex justify-between">
                    {prevPost ? (
                        <Link
                            href={`/blog/${prevPost.id}?page=${Math.ceil((allPosts.findIndex(p => p.id === prevPost.id) + 1) / postsPerPage)}`}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            ← {prevPost.name}
                        </Link>
                    ) : <div></div>}

                    {nextPost ? (
                        <Link
                            href={`/blog/${nextPost.id}?page=${Math.ceil((allPosts.findIndex(p => p.id === nextPost.id) + 1) / postsPerPage)}`}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            {nextPost.name} →
                        </Link>
                    ) : <div></div>}
                </div>
            </div>
        </div>
    )
}