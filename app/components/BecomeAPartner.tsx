import type { FormEvent } from 'react'
import { useState } from 'react'
import countries from '~/data/Countries.json'

type PartnerForm = {
  type: 'expert' | 'technology'
  first: string
  last: string
  company: string
  size: string
  title: string
  email: string
  phone: string
  country: string
  details: string
}

type FieldErrors = Partial<Record<'first' | 'last' | 'email', string>>

const INITIAL_VALUES: PartnerForm = {
  type: 'expert',
  first: '',
  last: '',
  company: '',
  size: '',
  title: '',
  email: '',
  phone: '',
  country: 'US',
  details: '',
}

const inputClass =
  'mt-2 w-full rounded-md border border-scale-500 bg-scale-100 px-3 py-2 text-scale-1200 shadow-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/30'

function validate(values: PartnerForm): FieldErrors {
  const errors: FieldErrors = {}
  if (!values.first.trim()) errors.first = 'First name is required.'
  if (!values.last.trim()) errors.last = 'Last name is required.'
  if (!values.email.trim()) {
    errors.email = 'Business email is required.'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  return errors
}

export default function BecomeAPartner(_props: { supabase?: unknown }) {
  const [values, setValues] = useState<PartnerForm>(INITIAL_VALUES)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const update = <K extends keyof PartnerForm>(key: K, value: PartnerForm[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch('/api/partner-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error('Partner application request failed')

      setFormSubmitted(true)
      setValues(INITIAL_VALUES)
    } catch {
      setSubmitError('We could not submit your application. Please review your details and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="border-t">
      <div id="become-a-partner" className="mx-auto max-w-2xl space-y-12 px-6 py-12">
        <div>
          <h2 className="h2">Become a Partner</h2>
          <p className="mt-2 text-sm text-scale-900">
            Share your business details. Required fields are marked with an asterisk.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="text-sm font-medium text-scale-1100">What type of partner are you?</span>
            <select
              id="type"
              name="type"
              className={inputClass}
              value={values.type}
              onChange={(event) => update('type', event.target.value as PartnerForm['type'])}
            >
              <option value="expert">Expert (Agency &amp; Consulting)</option>
              <option value="technology">Technology</option>
            </select>
          </label>

          <label>
            <span className="text-sm font-medium text-scale-1100">First Name *</span>
            <input
              id="first"
              name="first"
              className={inputClass}
              value={values.first}
              maxLength={80}
              autoComplete="given-name"
              onChange={(event) => update('first', event.target.value)}
              aria-invalid={Boolean(errors.first)}
              aria-describedby={errors.first ? 'first-error' : undefined}
            />
            {errors.first && <span id="first-error" className="mt-1 block text-sm text-red-600">{errors.first}</span>}
          </label>

          <label>
            <span className="text-sm font-medium text-scale-1100">Last Name *</span>
            <input
              id="last"
              name="last"
              className={inputClass}
              value={values.last}
              maxLength={80}
              autoComplete="family-name"
              onChange={(event) => update('last', event.target.value)}
              aria-invalid={Boolean(errors.last)}
              aria-describedby={errors.last ? 'last-error' : undefined}
            />
            {errors.last && <span id="last-error" className="mt-1 block text-sm text-red-600">{errors.last}</span>}
          </label>

          <label>
            <span className="text-sm font-medium text-scale-1100">Company Name</span>
            <input id="company" name="company" className={inputClass} value={values.company} maxLength={160} autoComplete="organization" onChange={(event) => update('company', event.target.value)} />
          </label>

          <label>
            <span className="text-sm font-medium text-scale-1100">Company Size</span>
            <input id="size" name="size" type="number" min={1} max={1000000} className={inputClass} value={values.size} onChange={(event) => update('size', event.target.value)} />
          </label>

          <label>
            <span className="text-sm font-medium text-scale-1100">Job Title</span>
            <input id="title" name="title" className={inputClass} value={values.title} maxLength={120} autoComplete="organization-title" onChange={(event) => update('title', event.target.value)} />
          </label>

          <label>
            <span className="text-sm font-medium text-scale-1100">Business email *</span>
            <input
              id="email"
              name="email"
              type="email"
              className={inputClass}
              value={values.email}
              maxLength={254}
              autoComplete="email"
              onChange={(event) => update('email', event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <span id="email-error" className="mt-1 block text-sm text-red-600">{errors.email}</span>}
          </label>

          <label>
            <span className="text-sm font-medium text-scale-1100">Phone Number</span>
            <input id="phone" name="phone" type="tel" className={inputClass} value={values.phone} maxLength={40} autoComplete="tel" onChange={(event) => update('phone', event.target.value)} />
          </label>

          <label>
            <span className="text-sm font-medium text-scale-1100">Country / Main Timezone</span>
            <select id="country" name="country" className={inputClass} value={values.country} onChange={(event) => update('country', event.target.value)}>
              {countries.map(({ code, name }) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </label>

          <label className="sm:col-span-2">
            <span className="text-sm font-medium text-scale-1100">Additional Details</span>
            <textarea
              id="details"
              name="details"
              rows={8}
              maxLength={4000}
              className={inputClass}
              value={values.details}
              onChange={(event) => update('details', event.target.value)}
              placeholder="Tell us about your projects, clients, and technology..."
            />
          </label>

          {submitError && (
            <div className="sm:col-span-2 rounded-md border border-red-300 bg-red-50 p-3" role="alert">
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          <div className="flex justify-end sm:col-span-2">
            <button
              type="submit"
              disabled={formSubmitted || isSubmitting}
              className="min-h-[44px] rounded-md bg-brand-600 px-5 py-2 font-medium text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Sending…' : formSubmitted ? 'Sent' : 'Send'}
            </button>
          </div>
        </form>

        {formSubmitted && (
          <h3 className="h3" role="status">Thanks, we'll reach out to you shortly.</h3>
        )}
      </div>
    </div>
  )
}
