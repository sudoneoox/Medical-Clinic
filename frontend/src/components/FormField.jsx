import React from "react";

// Component for rendering a form field, depending on its type
const FormField = ({ field, value, onChange }) => (
    <div key={field.name}>
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
        {field.label}
      </label>
      {field.type === "select" ? (
        <select
          name={field.name}
          id={field.name}
          value={value}
          onChange={onChange}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">Select {field.label}</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={field.type}
          name={field.name}
          id={field.name}
          value={value}
          onChange={onChange}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          pattern={field.pattern}
          title={field.title}
          required={field.required}
        />
      )}
    </div>
  );

  export default FormField