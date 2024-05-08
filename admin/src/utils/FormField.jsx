/* eslint-disable react/prop-types */
function FormField({
  children,
  htmlFor,
  id,
  type,
  placeholder,
  name,
  value,
  onChange,
}) {
  const className = `shadow appearance-none border w-full rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`;
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
          required
          id={id}
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          className={className}
          required
          id={id}
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
}

export default FormField;
