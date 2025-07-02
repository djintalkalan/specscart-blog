module.exports = {
    darkMode: "class",  // <-- important, not "media"
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#391749",
            },
        },
    },
    plugins: [],
};
