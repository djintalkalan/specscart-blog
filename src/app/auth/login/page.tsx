"use client";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const session = useSession()

    useEffect(() => {
        if (session?.status === 'authenticated') {
            router.replace('/')
        }
    }, [session?.status])

    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    const errorMessage =
        error === "CredentialsSignin" ? "Invalid email or password" :
            error === "Callback" ? "Something went wrong during login" :
                error;

    useEffect(() => {
        if (errorMessage) {
            alert(errorMessage)
        }
    }, [errorMessage])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.ok) {
            router.push("/");
            toast.success("Login successful!");
        } else {
            toast.error(res?.error || 'Login failed')
        }
    };

    const { data, status, update } = useSession();

    useEffect(() => {
        if (status == 'authenticated') {
            router.push("/");
        }

    }, [status])

    if (status != 'unauthenticated') {
        return null
    }
    return (
        <div className="flex items-center justify-center px-4 py-20 bg-white dark:bg-zinc-900">
            <div className="w-full max-w-md p-10 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
                    Sign In
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:ring-2 focus:ring-[#391749] focus:outline-none bg-white dark:bg-zinc-700 dark:text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:ring-2 focus:ring-[#391749] focus:outline-none bg-white dark:bg-zinc-700 dark:text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-[#391749] dark:bg-zinc-700 text-white font-semibold rounded-md hover:bg-[#2e123d] transition"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/register" className="text-[#391749] dark:text-white hover:underline font-medium">
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
}
