import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Modal, Button } from 'react-bootstrap'

const AddCourse = ({ studentId }) => {
  const [show, setShow] = useState(false)
  const [subjects, setSubjects] = useState({})

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const [errors, setErrors] = useState({})

  const {
    loading: { checkEnrollmentsLoading },
    data: { checkAllEnrollment: enrollments } = {},
    error,
  } = useQuery(CHECK_ENROLLMENT, {
    variables: { studentId },
  })

  const [
    addSubject,
    {
      loading: { enrollLoading },
      data: { enrollSubject: enrollMsg } = {},
    },
  ] = useMutation(ENROLL_SUBJECT)

  const [
    delSubject,
    {
      loading: { unenrollLoading },
      data: { unEnrollSubject: unenrollMsg } = {},
    },
  ] = useMutation(UNENROLL_SUBJECT)

  const onAdd = async (e) => {
    e.preventDefault()
    try {
      if (enrollments) console.log(enrollments)

      setErrors({})
      // window.location.assign("/");
    } catch (err) {
      console.log(err)
      // setErrors(err.graphQLErrors[0].extensions.errors);
    }
  }

  const onEnroll = async (subjectToEnroll) => {
    try {
      await addSubject({
        variables: { studentId, subjectName: subjectToEnroll },
      })
      window.location.assign('/')
    } catch (err) {
      console.log(err)
    }
  }

  const onUnEnroll = async (subjectToUnEnroll) => {
    try {
      await delSubject({
        variables: { studentId, subjectName: subjectToUnEnroll },
      })
      window.location.assign('/')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <Button
        variant='primary'
        onClick={(e) => {
          handleShow()
          onAdd(e)
        }}
      >
        Add Subjects
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {enrollments && (
            <div>
              <ul>
                <li className='pt-3'>
                  <span>Bangla</span>
                  <button
                    onClick={() => {
                      enrollments.Bangla
                        ? onUnEnroll('Bangla')
                        : onEnroll('Bangla')
                    }}
                    className={`btn ${
                      enrollments.Bangla ? 'btn-secondary' : 'btn-primary'
                    } ms-5`}
                  >
                    {enrollments.Bangla ? 'Unenroll' : 'Enroll'}
                  </button>
                </li>
                <li className='pt-3'>
                  <span>English</span>
                  <button
                    onClick={() => {
                      enrollments.English
                        ? onUnEnroll('English')
                        : onEnroll('English')
                    }}
                    className={`btn ${
                      enrollments.English ? 'btn-secondary' : 'btn-primary'
                    } ms-5`}
                  >
                    {enrollments.English ? 'Unenroll' : 'Enroll'}
                  </button>
                </li>
                <li className='pt-3'>
                  <span>Physics</span>
                  <button
                    onClick={() => {
                      enrollments.Physics
                        ? onUnEnroll('Physics')
                        : onEnroll('Physics')
                    }}
                    className={`btn ${
                      enrollments.Physics ? 'btn-secondary' : 'btn-primary'
                    } ms-5`}
                  >
                    {enrollments.Physics ? 'Unenroll' : 'Enroll'}
                  </button>
                </li>
                <li className='pt-3'>
                  <span>Maths</span>
                  <button
                    onClick={() => {
                      enrollments.Maths
                        ? onUnEnroll('Maths')
                        : onEnroll('Maths')
                    }}
                    className={`btn ${
                      enrollments.Maths ? 'btn-secondary' : 'btn-primary'
                    } ms-5`}
                  >
                    {enrollments.Maths ? 'Unenroll' : 'Enroll'}
                  </button>
                </li>
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button variant='primary'>Understood</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

const CHECK_ENROLLMENT = gql`
  query CheckEnrollments($studentId: ID!) {
    checkAllEnrollment(studentId: $studentId) {
      Bangla
      English
      Physics
      Maths
    }
  }
`

const ENROLL_SUBJECT = gql`
  mutation EnrollSubject($studentId: ID!, $subjectName: String!) {
    enrollSubject(studentId: $studentId, subjectName: $subjectName)
  }
`

const UNENROLL_SUBJECT = gql`
  mutation UnenrollSubject($studentId: ID!, $subjectName: String!) {
    unEnrollSubject(studentId: $studentId, subjectName: $subjectName)
  }
`

export default AddCourse
