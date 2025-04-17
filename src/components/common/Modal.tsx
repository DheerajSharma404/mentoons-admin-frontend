import { FaTimes } from "react-icons/fa";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 w-full" onClick={onClose}></div>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 w-1/2">
                <div className="flex justify-end">
                    <button className=" text-black p-2 rounded-full hover:bg-blue-600" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
                {children}
            </div>
        </>
    );
};

export default Modal;
