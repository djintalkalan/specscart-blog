import Post from "@/models/Post";

export async function generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")        // Remove non-word characters
        .replace(/[\s_-]+/g, "-")        // Replace spaces/underscores with dashes
        .replace(/^-+|-+$/g, "");        // Trim dashes from start/end

    const regex = new RegExp(`^${baseSlug}(?:-(\\d+))?$`, "i");

    const existingSlugs = await Post.find({ slug: regex }).select("slug");

    if (existingSlugs.length === 0) {
        return baseSlug;
    }

    const suffixes = existingSlugs.map((doc) => {
        const match = doc.slug.match(new RegExp(`^${baseSlug}-(\\d+)$`));
        return match ? parseInt(match[1], 10) : 0;
    });

    const maxSuffix = Math.max(...suffixes);
    return `${baseSlug}-${maxSuffix + 1}`;
}