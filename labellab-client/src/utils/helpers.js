export const isEmptyObject = obj => Object.keys(obj).length === 0

export const isEmpty = obj => obj === '' || obj === null || obj === 0

export const isLengthBetween = (obj, range) =>
  obj.length >= range.min && obj.length <= range.max

export const isEmail = email =>
  /^[a-zA-Z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)

export const isMobilePhone = phone => /^(\+?91|0)?[789]\d{9}$/.test(phone)

export const validateForm = ({ errors, ...rest }) => {
  let valid = true

  // validate errors being empty
  Object.values(errors).forEach(val => {
    val.length && (valid = false)
  })

  // validate if form is empty
  Object.values(rest).forEach(val => {
    typeof val !== 'boolean' && !val.length && (valid = false)
  })

  return valid
}
