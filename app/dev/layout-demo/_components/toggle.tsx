export default function Toggle(props: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
    const { isOpen, setIsOpen } = props;

    return (
        <button
            className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
            onClick={() => setIsOpen(!isOpen)}
        >
            {isOpen ? "Show Less" : "Show More"}
        </button>
    );
}
