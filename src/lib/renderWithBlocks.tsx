import ProductBlock from "@/components/ProductBlock";
import parse, { Element, HTMLReactParserOptions } from "html-react-parser";

interface BlockAttributes {
    name?: string;
    image?: string;
    products?: string[];
}

const BLOCK_REGEX = /\{\{block\s+([^}]*)\}\}/g;

// Parse attributes from string like: name="..." products="..."
function parseAttributes(input: string): BlockAttributes {
    const regex = /(\w+)=["']([^"']+)["']/g;
    const attributes: BlockAttributes = {};
    let match;

    while ((match = regex.exec(input))) {
        const key = match[1];
        const value = match[2];

        if (key === "products") {
            attributes[key] = value.split(",").map((p) => p.trim());
        } else {
            //@ts-ignore
            attributes[key] = value;
        }
    }

    return attributes;
}

export function renderWithBlocks(content: string) {
    // Replace block placeholders with a custom tag <block-component />
    const replacedContent = content.replace(BLOCK_REGEX, (_, attrString) => {
        const attrs = parseAttributes(attrString);
        return `<block-component name="${attrs.name || ''}" image="${attrs.image || ''}" products="${(attrs.products || []).join(",")}" />`;
    });

    // Custom parser to handle <block-component /> and remove wrapping <p>
    const options: HTMLReactParserOptions = {
        replace(domNode: any) {
            if (
                domNode instanceof Element &&
                domNode.name === "p" &&
                domNode.children?.length === 1 &&
                // @ts-ignore
                domNode.children[0].name === "block-component"
            ) {
                const block = domNode.children[0];
                // @ts-ignore
                const { name, image, products } = block.attribs;
                return (
                    <ProductBlock
                        name={name}
                        image={image}
                        products={products ? products.split(",").map((p: string) => p.trim()) : []}
                    />
                );
            }

            // Direct replacement of <block-component /> (if not wrapped in <p>)
            if (domNode instanceof Element && domNode.name === "block-component") {
                const { name, image, products } = domNode.attribs;
                return (
                    <ProductBlock
                        name={name}
                        image={image}
                        products={products ? products.split(",").map((p) => p.trim()) : []}
                    />
                );
            }
        },
    };

    return parse(replacedContent, options);
}

export function removeBlockContent(content: string): string {
    // Remove all block placeholders like {{block ...}}
    let cleaned = content.replace(BLOCK_REGEX, "");

    // Remove all empty HTML tags (including ones that contain only <br>, whitespace, or &nbsp;)
    cleaned = cleaned.replace(/<(\w+)[^>]*>(\s|&nbsp;|<br\s*\/?>)*<\/\1>/gi, "");

    // console.log("cleaned", cleaned);
    return cleaned;
}
