import Link from "next/link";

interface Post {
  id: string
  name: string
  createdAt: string
}

export async function generateStaticParams() {
  const posts: Post[] = await fetch('https://68206faf259dad2655ac8cff.mockapi.io/posts').then(res => res.json());
  
  // Генерируем параметры для всех страниц пагинации
  const totalPages = Math.ceil(posts.length / 10);
  return Array.from({length: totalPages}, (_, i) => ({
    page: (i + 1).toString()
  }));
}

export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  
  // Загружаем все посты один раз при сборке
  const posts: Post[] = await fetch('https://68206faf259dad2655ac8cff.mockapi.io/posts', {
    next: { tags: ['posts'], revalidate: 100} // Ревалидация раз в час
  }).then((res) => res.json());
  
  const postsPerPage = 10;
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = posts.slice(startIndex, startIndex + postsPerPage);

  return (
    <div className="p-8 bg-gray-900">
      <div className="container">
        <nav className="flex items-center text-sm mb-8">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            Главная
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-white">Страница блога</span>
        </nav>
        <h1 className="text-3xl font-bold mb-8 text-white text-center">Блог</h1>
        
        <div className="space-y-6 mb-12">
          {paginatedPosts.map((post) => (
            <Link 
              key={post.id} 
              href={`/blog/${post.id}?page=${currentPage}`}
              className="block bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
            >
              <h2 className="text-xl font-semibold text-white mb-2">{post.name}</h2>
              <p className="text-gray-300 line-clamp-2">{post.createdAt}</p>
            </Link>
          ))}
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <Link 
            href={`?page=1`} 
            className={`px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
            aria-disabled={currentPage === 1}
          >
            В начало
          </Link>
          <Link 
            href={`?page=${currentPage - 1}`} 
            className={`px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
            aria-disabled={currentPage === 1}
          >
            Назад
          </Link>
          
          <span className="px-4 py-2 text-white">
            Страница {currentPage} из {totalPages}
          </span>
          
          <Link 
            href={`?page=${Math.min(currentPage + 1, totalPages)}`}
            className={`px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
            aria-disabled={currentPage === totalPages}
          >
            Вперед
          </Link>
          <Link 
            href={`?page=${totalPages}`} 
            className={`px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
            aria-disabled={currentPage === totalPages}
          >
            В конец
          </Link>
        </div>
      </div>
    </div>
  )
}