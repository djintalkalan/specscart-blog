import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import React from "react";

interface ProductBlockProps {
    name?: string;
    image?: string;
    products: string[];
}

const ProductBlock: React.FC<ProductBlockProps> = ({ name, image, products }) => {
    return (
        <div className="my-8 flex flex-col md:flex-row gap-6 p-4 border rounded-lg shadow-sm dark:bg-gray-900 bg-white">
            {/* Left Image */}
            {image && (
                <div className="self-center w-full md:w-1/2 max-w-[100%] md:max-w-[50%] h-[500px] relative overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                    <Image
                        unoptimized
                        src={image}
                        alt={name || "Block image"}
                        fill
                        className="object-contain p-4"
                    />
                </div>
            )}

            {/* Right Content */}
            <div className="flex-1 flex flex-col justify-start gap-6 overflow-x-scroll">
                {/* Title */}
                {name && (
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {name}
                    </h2>
                )}

                <div className="flex flex-nowrap gap-4 pb-2">
                    {products.map((sku, i) => (
                        <ProductCard key={sku + i} sku={sku} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductBlock;
