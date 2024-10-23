import React from 'react';

const InputField = ({field, type = "text", placeholder, error}) => {
    return (
        <input
            {...field}
            type={type}
            className={`grow form-control ${error ? 'is-invalid' : ''}`}
            placeholder={placeholder}
        />
    );
};

export default InputField;
