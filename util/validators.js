module.exports.validateStudentInput = (name, email, phone, date_of_birth) => {
  const errors = {}
  if (name.trim() === '') {
    errors.name = 'Name must not be empty'
  }
  if (email.trim() === '') {
    errors.name = 'email must not be empty'
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/
    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address'
    }
  }
  if (phone.trim() === '') {
    errors.name = 'phone must not be empty'
  } else {
    const regEx2 = /^(?:\+88|88)?(01[3-9]\d{8})$/
    if (!phone.match(regEx2)) {
      errors.phone = 'Phone must be a valid mobile number'
    }
  }
  if (date_of_birth === '') {
    errors.name = 'date of birth must not be empty'
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}
