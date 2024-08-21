/* eslint-disable react/prop-types */
function FormField({
  children,
  htmlFor,
  id,
  type,
  placeholder,
  name,
  value = "",
  onChange,
  maxLength,
  minLength,
}) {
  const className = `appearance-none border w-full rounded-md border-gray-300 focus:border-black/50 focus:ring-2 focus:ring-black/50 py-2 px-3 text-gray-700 leading-tight focus:outline-none`;
  return (
    <div className="mb-4 w-full">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={htmlFor}
      >
        {children}
      </label>
      {type === "textarea" ? (
        <textarea
          className={className}
          id={id}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          className={className}
          id={id}
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          maxLength={maxLength || undefined}
          minLength={minLength || undefined}
        />
      )}
    </div>
  );
}

export default FormField;
