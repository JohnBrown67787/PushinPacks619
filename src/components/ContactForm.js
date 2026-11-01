'use client';

import { useState } from 'react';
import { Button, Input, Card, Badge } from './ui';
import { useForm, VALIDATORS, combineValidators } from '../hooks/useForm';
import { IconCheck, IconAlertCircle } from './Icons';
import styles from './ContactForm.module.css';

/**
 * Reusable contact/inquiry form component
 * Demonstrates new form validation system and UI components
 */
export default function ContactForm({
  title = 'Send Inquiry',
  subtitle = 'Get in touch with our team',
  onSuccess = () => {},
  onError = () => {},
  fields = ['name', 'email', 'phone', 'message'],
}) {
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [submitMessage, setSubmitMessage] = useState('');

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, resetForm } = useForm(
    {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
    async (formData) => {
      try {
        // Simulate API call
        const response = await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to send inquiry');
        }

        setSubmitStatus('success');
        setSubmitMessage('Thank you! Your inquiry has been received. We will respond shortly.');
        resetForm();
        onSuccess(formData);

        // Clear success message after 5 seconds
        setTimeout(() => setSubmitStatus(null), 5000);
      } catch (error) {
        setSubmitStatus('error');
        setSubmitMessage(error.message || 'Failed to send inquiry. Please try again.');
        onError(error);

        // Clear error message after 5 seconds
        setTimeout(() => setSubmitStatus(null), 5000);
      }
    },
    {
      name: VALIDATORS.required,
      email: VALIDATORS.email,
      phone: combineValidators(
        VALIDATORS.required,
        VALIDATORS.phone
      ),
      message: combineValidators(
        VALIDATORS.required,
        VALIDATORS.minLength(10)
      ),
    }
  );

  return (
    <Card variant="elevated" className={styles.form}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <Badge variant="info">Form</Badge>
      </div>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className={styles.successMessage}>
          <IconCheck size={20} color="#10b981" />
          <span>{submitMessage}</span>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className={styles.errorMessage}>
          <IconAlertCircle size={20} color="#ef4444" />
          <span>{submitMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.formContent}>
        {/* Name Field */}
        {fields.includes('name') && (
          <Input
            label="Full Name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name ? errors.name : ''}
            required
          />
        )}

        {/* Email Field */}
        {fields.includes('email') && (
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="john@example.com"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email ? errors.email : ''}
            hint="We'll never share your email"
            required
          />
        )}

        {/* Phone Field */}
        {fields.includes('phone') && (
          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            placeholder="+1 (555) 123-4567"
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.phone ? errors.phone : ''}
            hint="Include country code for international numbers"
            required
          />
        )}

        {/* Message Field */}
        {fields.includes('message') && (
          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>
              Message
              <span className={styles.required}>*</span>
            </label>
            <textarea
              id="message"
              name="message"
              className={styles.textarea}
              placeholder="Tell us about your inquiry..."
              value={values.message}
              onChange={handleChange}
              onBlur={handleBlur}
              rows="5"
              required
            />
            {touched.message && errors.message && (
              <span className={styles.errorText}>{errors.message}</span>
            )}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? 'Sending...' : 'Send Inquiry'}
        </Button>
      </form>

      {/* Footer Info */}
      <p className={styles.footerText}>
        Response typically within 24-48 hours. For urgent inquiries, contact us via WhatsApp.
      </p>
    </Card>
  );
}
