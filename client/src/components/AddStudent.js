import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

const AddStudent = () => {
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

  const [addStudent, { data, loading, error } = {}] =
    useMutation(CREATE_STUDENT)
  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await addStudent({
        variables: {
          name,
          email,
          phone,
          date_of_birth,
        },
      })
      setErrors({})
      window.location.assign('/')
    } catch (err) {
      setErrors(err.graphQLErrors[0].extensions.errors)
    }
  }

  return (
    <>
      <Button variant='primary' onClick={handleShow}>
        Add Student
      </Button>

      <Modal show={show} onHide={handleClose}>
        <form onSubmit={onSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Add Student</Modal.Title>
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
                placeholder='Enter your name'
                onChange={(e) => setName(e.target.value)}
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
                placeholder='Enter your email'
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
                placeholder='Enter your mobile number'
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
const CREATE_STUDENT = gql`
  mutation createStudent(
    $name: String!
    $email: String!
    $phone: String!
    $date_of_birth: String!
  ) {
    createStudent(
      studentInput: {
        name: $name
        email: $email
        phone: $phone
        date_of_birth: $date_of_birth
      }
    ) {
      id
      name
      email
      phone
      date_of_birth
    }
  }
`
export default AddStudent
