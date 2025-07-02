"use client";
import { callPostApi } from "@/lib/api";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function RegisterPage() {

    const router = useRouter();

    const session = useSession();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        image: "",
    });

    useEffect(() => {
        if (session?.status === 'authenticated') {
            router.replace('/')
        }
    }, [session?.status])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password || !formData.name) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {

            console.log("Formdata", formData);

            const res = await callPostApi("/api/auth/register", formData)

            if (res?.status === 201) {
                const loginRes = await signIn("credentials", {
                    redirect: false,
                    email: formData?.email,
                    password: formData?.password,
                });

                if (loginRes?.ok) {
                    router.push("/");
                    toast.success("Registration successful! You are now logged in.");
                } else {
                    toast.error(loginRes?.error || 'Login failed')
                }
            }
        } catch (error: any) {
            console.log("error", error)
            const errorMessage = error?.response?.data?.error || 'Registration failed';
            toast.error(errorMessage)
        };
    };

    return (
        <div className="flex items-center justify-center px-4 py-20 bg-white dark:bg-zinc-900">
            <div className="w-full max-w-md p-10 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
                    Create an Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:ring-2 focus:ring-[#391749] focus:outline-none bg-white dark:bg-zinc-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:ring-2 focus:ring-[#391749] focus:outline-none bg-white dark:bg-zinc-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:ring-2 focus:ring-[#391749] focus:outline-none bg-white dark:bg-zinc-700 dark:text-white"
                        />
                    </div>

                    {/* Profile Upload Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Profile Picture (optional)
                        </label>

                        <div className="flex items-center gap-4">
                            <label
                                htmlFor="image"
                                className="cursor-pointer inline-block px-4 py-2 text-sm font-medium text-white bg-[#391749] rounded-md hover:bg-[#2e123d] dark:bg-zinc-700 dark:hover:bg-zinc-600 transition"
                            >
                                Upload Image
                            </label>

                            {formData.image && (
                                <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-300 dark:border-zinc-500 shadow">
                                    <Image
                                        src={formData.image}
                                        alt="Profile preview"
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-[#391749] dark:bg-zinc-700 text-white font-semibold rounded-md hover:bg-[#2e123d] transition"
                    >
                        Register
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-[#391749] dark:text-white hover:underline font-medium">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
}
