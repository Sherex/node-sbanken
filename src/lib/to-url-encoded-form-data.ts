interface FormDataObject {
  [key: string]: string
}

export default function toUrlEncodedFormData (obj: FormDataObject): URLSearchParams {
  const params = new URLSearchParams()
  Object.entries(obj).forEach(([key, value]) => params.append(key, value))
  return params
}
