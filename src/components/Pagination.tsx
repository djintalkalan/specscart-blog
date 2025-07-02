"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface PaginationProps {
  page: number;
  hasPrev: boolean;
  hasNext: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ page, hasPrev, hasNext }) => {
  const router = useRouter();

  return (
    <div className="flex justify-between">
      <button
        disabled={!hasPrev}
        onClick={() => router.push(`?page=${page - 1}`)}
        className="w-[100px] px-4 py-4 border-none bg-red-700 text-white cursor-pointer
                   disabled:bg-red-700/50 disabled:cursor-not-allowed
                   dark:bg-red-600 dark:disabled:bg-red-600/50"
      >
        Previous
      </button>

      <button
        disabled={!hasNext}
        onClick={() => router.push(`?page=${page + 1}`)}
        className="w-[100px] px-4 py-4 border-none bg-red-700 text-white cursor-pointer
                   disabled:bg-red-700/50 disabled:cursor-not-allowed
                   dark:bg-red-600 dark:disabled:bg-red-600/50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
