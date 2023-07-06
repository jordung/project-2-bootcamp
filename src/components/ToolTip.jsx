function ToolTip({ show, text }) {
  if (!show) {
    return null;
  }
  return (
    <div className="absolute z-50 inline-block px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-sm mt-[4.5rem] md:mt-[6.5rem]">
      {text}
    </div>
  );
}

export default ToolTip;
