import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

const DelButton = ({ studentId }) => {
  const [errors, setErrors] = useState({})
  const [delStud, { data, loading, error } = {}] = useMutation(DELETE_STUDENT)
  const onDelete = async (e) => {
    e.preventDefault()
    try {
      const res = await delStud({
        variables: {
          studentId,
        },
      })
      window.location.assign('/')
    } catch (err) {
      setErrors(err)
    }
  }
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <Button variant='danger' onClick={handleShow}>
        Delete Student
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button variant='primary' onClick={onDelete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
const DELETE_STUDENT = gql`
  mutation deleteStudent($studentId: ID!) {
    deleteStudent(studentId: $studentId)
  }
`
export default DelButton
