import dynamic from 'next/dynamic';

const QuillNoSSRWrapper = dynamic(
    import('react-quill'),
    {
        ssr: false,
        loading: () => <div>Loading...</div>,
    }
);

export default QuillNoSSRWrapper;