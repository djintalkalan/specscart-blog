import AllPosts from "@/components/AllPosts";

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: any) {

  const page = Number((await searchParams)?.page || 1)

  return (
    <main className="flex flex-1 flex-col max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Latest Blog Posts</h1>
      <AllPosts page={page} />
    </main>
  );
}
