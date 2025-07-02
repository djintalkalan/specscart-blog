"use client";

import { ThemeContext } from "@/context/ThemeContext";
import { callGetApi } from "@/lib/api";
import { User } from "@/models/User";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

const Header = () => {
    const { theme, toggle } = useContext(ThemeContext);
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const [userInfo, setUserInfo] = useState<User>();

    // @ts-ignore
    const userId = session?.user?.id

    useEffect(() => {
        if (userId) {
            callGetApi(`/api/user/${userId}`).then((res) => {
                if (res?.data?.user) {
                    setUserInfo(res?.data?.user)
                }
            }).catch((c) => {

            })
        }
    }, [userId])

    const hideLoginButton = pathname === "/auth/login" || pathname === "/auth/register";

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="w-full px-5 py-4 flex justify-between items-center bg-white dark:bg-gray-900 shadow-sm">
            {/* Left: Logo */}
            <Link href="/" className="text-sm md:text-xl font-bold text-gray-900 dark:text-white text-center flex flex-col md:flex-row items-center gap-2">
                <Image src="/logo.svg" alt="Specscart blog" width={150} height={150} />
                Specscart Blogs
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-4 relative">
                {/* Theme Toggle */}
                <button
                    onClick={toggle}
                    className="px-[6px] md:px-3 py-2 md:py-2 text-xs md:text-sm text-center rounded bg-gray-800 text-white hover:bg-gray-900 dark:bg-[#00b3a3] dark:text-black dark:hover:bg-[#00b3a380]"
                >
                    {theme === "light" ? "Dark Mode" : "Light Mode"}
                </button>

                {status === "loading" ? null : userId ? (
                    <div className="relative" ref={menuRef}>
                        {/* Profile Picture */}
                        <button onClick={() => setMenuOpen(!menuOpen)}>
                            <Image
                                src={userInfo?.image || "/default-avatar.png"}
                                alt="Profile"
                                width={36}
                                height={36}
                                className="rounded-full border"
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 z-50">
                                <Link
                                    href="/post/create"
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Create New Post
                                </Link>
                                <Link
                                    href="/my-posts"
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    My Blogs
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                ) : !hideLoginButton ? (
                    <Link
                        href="/auth/login"
                        className="px-3 py-2 text-sm rounded bg-[#391749] text-white hover:bg-blue-700"
                    >
                        Sign In
                    </Link>
                ) : (
                    <Link
                        href="/"
                        className="px-3 py-2 text-sm rounded bg-[#391749] text-white hover:bg-blue-700"
                    >
                        Blogs
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;
