import { MOCK_PRODUCTS } from "@/data/products";
import Image from "next/image";
import React from "react";

interface ProductCardProps {
    sku: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ sku }) => {
    const product = MOCK_PRODUCTS.find((item) => item.sku === sku);

    if (!product) return null;

    return (
        <div className="min-w-[16rem] max-w-[16rem] flex-none p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            {/* Product Image */}
            <div className="relative w-full h-48 sm:h-56 mb-4 rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                <Image
                    unoptimized
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                />
            </div>

            {/* Product Info */}
            <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {product.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    SKU: <span className="font-medium">{product.sku}</span>
                </p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {product.price}
                </p>
            </div>
        </div>
    );
};

export default ProductCard;
