interface FormDataObject {
  [key: string]: string | undefined
}

export default function toUrlEncodedFormData (obj: FormDataObject): URLSearchParams {
  const params = new URLSearchParams()
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value !== 'string') return
    params.append(key, value)
  })
  return params
}
