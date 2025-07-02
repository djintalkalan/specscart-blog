import AllPosts from "@/components/AllPosts";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function HomePage({ searchParams }: any) {

    const page = Number((await searchParams)?.page || 1)

    const session = await getServerSession(authOptions);


    // @ts-ignore
    const userId = session?.user?.id
    if (!userId) {
        redirect('/')
    }

    return (
        <main className="flex flex-1 flex-col max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">My Blog Posts</h1>
            <AllPosts userId={userId} page={page} />
        </main>
    );
}
