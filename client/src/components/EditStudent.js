import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import gql from 'graphql-tag'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import { set } from 'mongoose'

const EditStudent = ({
  studentId,
  studentName,
  studentEmail,
  studentPhone,
  studentDOB,
}) => {
  const [studentData, setStudentData] = useState({})
  const [name, setName] = useState(studentName)
  const [email, setEmail] = useState(studentEmail)
  const [phone, setPhone] = useState(studentPhone)
  const [date, setDate] = useState(studentDOB)
  const [errors, setErrors] = useState({})
  const [show, setShow] = useState(false)

  const handleClose = () => {
    setShow(false)
    setErrors({})
  }
  const handleShow = () => setShow(true)

  const [
    editStudent,
    {
      data: { updateStudent: updateMsg } = {},
      loading: { editLoading },
      error,
    } = {},
  ] = useMutation(EDIT_STUDENT)

  const [
    retrieveStudent,
    {
      loading: { studentLoading },
      data: { getStudent: student } = {},
    },
  ] = useLazyQuery(GET_STUDENT)

  const handleStudent = async () => {
    try {
      await retrieveStudent({
        variables: { studentId },
      })
    } catch (err) {
      console.log(err)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await editStudent({
        variables: {
          id: studentId,
          name,
          email,
          phone,
          date_of_birth: date,
        },
      })
      setErrors({})
      window.location.assign('/')
    } catch (err) {
      setErrors(err.graphQLErrors[0].extensions.errors)
    }
  }

  return (
    <div className='text-start'>
      <Button
        variant='info'
        onClick={() => {
          handleShow()
          handleStudent()
        }}
      >
        Update
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
                placeholder='Enter your name'
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
                placeholder='Enter your email'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
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
                value={phone}
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
                value={date}
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
    </div>
  )
}

const GET_STUDENT = gql`
  query GetStudent($studentId: ID!) {
    getStudent(studentId: $studentId) {
      name
      email
      phone
      date_of_birth
    }
  }
`

const EDIT_STUDENT = gql`
  mutation UpdateStudent(
    $id: ID!
    $name: String!
    $email: String!
    $phone: String!
    $date_of_birth: String!
  ) {
    updateStudent(
      updateInput: {
        id: $id
        name: $name
        email: $email
        phone: $phone
        date_of_birth: $date_of_birth
      }
    )
  }
`
export default EditStudent
