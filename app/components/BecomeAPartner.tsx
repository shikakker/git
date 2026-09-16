import { Button, Form, Input, InputNumber, Select } from '@supabase/ui'
import { useState } from 'react'
import countries from '~/data/Countries.json'

const INITIAL_VALUES = {
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

const validate = (values: any) => {
  const errors: any = {}

  if (!values.first?.trim()) errors.first = 'Required'
  if (!values.last?.trim()) errors.last = 'Required'

  if (!values.email?.trim()) {
    errors.email = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email.trim())) {
    errors.email = 'Invalid email address'
  }

  return errors
}

export default function BecomeAPartner(_props: { supabase?: unknown }) {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleFormSubmit = async (values: any) => {
    setSubmitError('')

    try {
      const response = await fetch('/api/partner-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: values.type,
          first: values.first,
          last: values.last,
          company: values.company,
          size: values.size,
          title: values.title,
          email: values.email,
          phone: values.phone,
          country: values.country,
          details: values.details,
        }),
      })

      if (!response.ok) {
        throw new Error('Partner application request failed')
      }

      setFormSubmitted(true)
    } catch {
      setSubmitError('We could not submit your application. Please review your details and try again.')
    }
  }

  return (
    <div className="border-t">
      <div id="become-a-partner" className="max-w-2xl mx-auto space-y-12 py-12 px-6">
        <h2 className="h2">Become a Partner</h2>

        <Form initialValues={INITIAL_VALUES} validate={validate} onSubmit={handleFormSubmit}>
          {({ isSubmitting }: any) => (
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              <div className="h-24 col-span-2">
                <Select
                  id="type"
                  name="type"
                  className="font-sans"
                  label="What type of partner are you?"
                  layout="vertical"
                >
                  <Select.Option value="expert" selected={true}>
                    Expert (Agency &amp; Consulting)
                  </Select.Option>
                  <Select.Option value="technology">Technology</Select.Option>
                </Select>
              </div>

              <div className="h-24">
                <Input label="First Name *" id="first" name="first" layout="vertical" placeholder="Jane" />
              </div>

              <div className="h-24">
                <Input label="Last Name *" id="last" name="last" layout="vertical" placeholder="Doe" />
              </div>

              <div className="h-24">
                <Input label="Company Name" id="company" name="company" layout="vertical" placeholder="Supa Inc." />
              </div>

              <div className="h-24">
                <InputNumber label="Company Size" id="size" name="size" layout="vertical" placeholder="1" />
              </div>

              <div className="h-24">
                <Input label="Job Title" id="title" name="title" layout="vertical" placeholder="CEO" />
              </div>

              <div className="h-24">
                <Input label="Business email *" id="email" name="email" layout="vertical" placeholder="janedoe@example.sg" />
              </div>

              <div className="h-24">
                <Input label="Phone Number" id="phone" name="phone" layout="vertical" placeholder="+65 1234 1234" />
              </div>

              <div className="h-24">
                <Select label="Country / Main Timezone" id="country" name="country" layout="vertical">
                  {countries.map(({ code, name }) => (
                    <Select.Option key={code} value={code}>{name}</Select.Option>
                  ))}
                </Select>
              </div>

              <div className="col-span-2">
                <Input.TextArea
                  id="details"
                  name="details"
                  label="Additional Details"
                  placeholder="Tell us about your projects, clients, and technology..."
                  rows={10}
                />
              </div>

              {submitError && (
                <div className="col-span-2 pt-4" role="alert">
                  <p className="text-sm text-red-600">{submitError}</p>
                </div>
              )}

              <div className="flex flex-row-reverse w-full col-span-2 pt-4">
                <Button
                  size="xlarge"
                  disabled={formSubmitted}
                  loading={isSubmitting}
                  htmlType="submit"
                >
                  Send
                </Button>
              </div>
            </div>
          )}
        </Form>

        {formSubmitted && (
          <h3 className="h3" role="status">Thanks, we'll reach out to you shortly 👁⚡️👁</h3>
        )}
      </div>
    </div>
  )
}
