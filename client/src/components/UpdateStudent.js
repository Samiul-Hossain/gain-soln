import React, { useState, useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'

const UpdateStudent = ({ studentId }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [date_of_birth, setDate] = useState('')
  const [errors, setErrors] = useState({})
  const [show, setShow] = useState(false)

  const handleClose = () => {
    setShow(false)
    setErrors({})
  }
  const handleShow = () => setShow(true)

  const {
    loading: { getStudentLoading },
    data: { getStudent: student } = {},
    error,
  } = useQuery(GET_STUDENT, {
    variables: { studentId },
  })

  useEffect(() => {
    if (student) {
      setName(student.name)
      setEmail(student.email)
      setPhone(student.phone)
      setDate(student.date_of_birth)
    }
  }, [studentId])

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      // await updateStudent({
      //   variables: {
      //     name,
      //     email,
      //     phone,
      //     date_of_birth: date_of_birth,
      //   },
      // })
      setErrors({})
      window.location.assign('/')
    } catch (err) {
      setErrors(err.graphQLErrors[0].extensions.errors)
    }
  }

  return (
    <>
      <Button variant='primary' onClick={handleShow}>
        Update Student
      </Button>

      <Modal show={show} onHide={handleClose}>
        <form onSubmit={onSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Update Student</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className='mb-3'>
              <label htmlFor='name' className='col-form-label'>
                Name:
              </label>
              <input
                type='text'
                className='form-control'
                id='name'
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='email' className='col-form-label'>
                Email:
              </label>
              <input
                type='email'
                className='form-control'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='phone' className='col-form-label'>
                Phone:
              </label>
              <input
                type='text'
                className='form-control'
                id='phone'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='date_of_birth' className='col-form-label'>
                Date of Birth:
              </label>
              <input
                type='date'
                className='form-control'
                id='date_of_birth'
                onChange={(e) => setDate(e.target.value)}
                value={date_of_birth}
                required
              />
            </div>
            {Object.keys(errors).length > 0 && (
              <div>
                <ul>
                  {Object.values(errors).map((value) => (
                    <li className='text-danger pt-3' key={value}>
                      {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              Close
            </Button>
            <Button type='submit' variant='primary'>
              Confirm
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}
const GET_STUDENT = gql`
  query getStudent($studentId: ID!) {
    getStudent(studentId: $studentId) {
      name
      email
      phone
      date_of_birth
    }
  }
`
export default UpdateStudent
