import Image from "next/image";
import Link from "next/link";

const Footer = () => {
    return (
        <div className="px-5 lg:px-10 mt-12 py-5 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12
                    bg-white text-gray-700
                    dark:bg-gray-900 dark:text-gray-400"
        >
            <div className="flex-1 flex flex-col gap-4 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                    <Image src="/logo.svg" alt="Specscart blog" width={150} height={50} />
                    <h1 className="text-2xl font-bold text-black dark:text-white">Specscart blogs</h1>
                </div>
                <p className="font-light">
                    Discover expert insights on eyewear trends, eye health, and lifestyle tips. Specscart Blogs brings you vision-focused stories, guides, and inspiration — all in one place.
                </p>
                <div className="flex justify-center lg:justify-start gap-3 mt-2">
                    <a href="https://www.facebook.com/specscart/" target="_blank" rel="noopener noreferrer">
                        <Image src="/facebook.png" alt="facebook" width={18} height={18} />
                    </a>

                    <a href="https://www.instagram.com/specscart/" target="_blank" rel="noopener noreferrer">
                        <Image src="/instagram.png" alt="instagram" width={18} height={18} />
                    </a>
                </div>
            </div>

            <div className="flex-1 flex flex-row justify-between gap-20 sm:gap-20 text-sm">
                <div className="flex flex-col gap-2 font-light">
                    <span className="font-semibold text-black dark:text-white">Links</span>
                    <Link href="https://specscart.co.uk/">Our Website</Link>
                    <Link href="/">Blog</Link>
                </div>

                <div className="flex flex-col gap-2 font-light">
                    <span className="font-semibold text-black dark:text-white">Social</span>
                    <Link target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/specscart/">Facebook</Link>
                    <Link target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/specscart/">Instagram</Link>
                </div>
            </div>
        </div>
    );
};

export default Footer;
