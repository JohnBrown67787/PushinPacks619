import { useState, useCallback } from 'react';
import { isValidEmail, isValidPhone, isValidPostalCode } from '../lib/utils';
import { VALIDATION_MESSAGES } from '../lib/constants';

export function useForm(initialValues, onSubmit, validators = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback((fieldName, fieldValue) => {
    if (validators[fieldName]) {
      const error = validators[fieldName](fieldValue);
      return error || '';
    }
    return '';
  }, [validators]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validate(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, [validate]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Validate all fields
      const newErrors = {};
      Object.keys(values).forEach((fieldName) => {
        const error = validate(fieldName, values[fieldName]);
        if (error) {
          newErrors[fieldName] = error;
        }
      });

      setErrors(newErrors);
      setTouched(
        Object.keys(values).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {})
      );

      if (Object.keys(newErrors).length === 0) {
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Form submission error:', error);
        }
      }

      setIsSubmitting(false);
    },
    [values, validate, onSubmit]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
  };
}

// Preset validators
export const VALIDATORS = {
  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return VALIDATION_MESSAGES.required;
    }
    return '';
  },

  email: (value) => {
    if (!value) return VALIDATION_MESSAGES.required;
    if (!isValidEmail(value)) {
      return VALIDATION_MESSAGES.email;
    }
    return '';
  },

  phone: (value) => {
    if (!value) return VALIDATION_MESSAGES.required;
    if (!isValidPhone(value)) {
      return VALIDATION_MESSAGES.phone;
    }
    return '';
  },

  postalCode: (value) => {
    if (!value) return VALIDATION_MESSAGES.required;
    if (!isValidPostalCode(value)) {
      return 'Please enter a valid postal code';
    }
    return '';
  },

  minLength: (min) => (value) => {
    if (!value) return VALIDATION_MESSAGES.required;
    if (value.length < min) {
      return VALIDATION_MESSAGES.minLength(min);
    }
    return '';
  },

  maxLength: (max) => (value) => {
    if (value && value.length > max) {
      return VALIDATION_MESSAGES.maxLength(max);
    }
    return '';
  },

  match: (otherValue, fieldName = 'field') => (value) => {
    if (value !== otherValue) {
      return `${fieldName} does not match`;
    }
    return '';
  },

  custom: (validatorFn) => validatorFn,
};

// Combine validators for a field
export function combineValidators(...validators) {
  return (value) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return '';
  };
}
