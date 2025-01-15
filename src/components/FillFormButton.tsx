interface IFillFormButtonProps {
  onClick: () => void;
  isAutofillActive: boolean;
}

export default function FillFormButton({
  onClick,
  isAutofillActive,
}: IFillFormButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
    >
      {isAutofillActive ? "Deactivate" : "Activate"} Autofill
    </button>
  );
}
