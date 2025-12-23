const Input = ({
  type,
  name,
  value,
  onChange,
  readOnly = false,
  required = false,
  placeholder,
  className = "",
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value} // ← binding value dari state
      onChange={onChange} // ← update state saat user mengetik
      readOnly={readOnly}
      required={required}
      placeholder={placeholder}
      className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${className}`}
    />
  );
};

export default Input; 