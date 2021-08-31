import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import PieComponent from '../components/PieComponent'
import AddStudent from '../components/AddStudent'
import AddCourse from '../components/AddCourse'
import DelButton from '../components/DelButton'
import UpdateStudent from '../components/UpdateStudent'

const Home = () => {
  //const [studentData, setStudentData] = useState([])

  const { loading, data: { getStudentsWithSubjects: students } = {} } =
    useQuery(GET_STUDENTS_WITH_SUBJECTS)
  const {
    loading: { subjectWaiting },
    data: { getSubjectsWithStudents: subjects } = {},
  } = useQuery(GET_SUBJECTS_WITH_STUDENTS)

  return (
    <div>
      <nav className='navbar navbar-light bg-light'>
        <div className='container-fluid'>
          <a className='navbar-brand' href='/'>
            <img
              src='http://gainhq.com/wp-content/uploads/2019/11/Gain-Solutions-Logo-.png'
              alt=''
              width='120'
              height='40'
              className='d-inline-block align-text-top'
            />
          </a>
        </div>
      </nav>
      <h2 className='text-center py-3'>Student Data with Subjects</h2>
      <div className='container-fluid'>
        <table className='table-striped table'>
          <thead>
            <tr>
              <th className='table-dark' scope='col'>
                Name
              </th>
              <th className='table-dark' scope='col'>
                Email
              </th>
              <th className='table-dark' scope='col'>
                Phone
              </th>
              <th className='table-dark' scope='col'>
                Date Of Birth
              </th>
              <th className='table-dark' scope='col'>
                Subjects
              </th>
              <th className='table-dark' scope='col'>
                Delete
              </th>
              <th className='table-dark' scope='col'>
                Add Subjects
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td>Loading Students</td>
              </tr>
            ) : (
              students &&
              students.map((student) => (
                <tr key={student.id}>
                  <td className='col-auto'>{student.name}</td>
                  <td className='col-auto'>{student.email}</td>
                  <td className='col-auto'>{student.phone}</td>
                  <td className='col-auto'>{student.date_of_birth}</td>
                  <td className='col-auto'>
                    {student.subjects.map((subj) => subj.name + ' ')}
                  </td>
                  <td>
                    <DelButton studentId={student.id} />
                  </td>
                  <td>
                    <AddCourse studentId={student.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className='text-center'>
          <AddStudent />
        </div>

        <h2 className='text-center py-3'>Subjects Data with Students</h2>

        <table className='table table-striped container'>
          <thead>
            <tr>
              <th className='table-dark' scope='col'>
                Name
              </th>
              <th className='table-dark' scope='col'>
                Subjects
              </th>
            </tr>
          </thead>
          <tbody>
            {subjectWaiting ? (
              <tr>
                <td>Loading subjects</td>
              </tr>
            ) : (
              subjects &&
              subjects.map((subject) => (
                <tr key={subject.id}>
                  <td className='col-sm-6'>{subject.name}</td>
                  <td className='col-sm-6'>
                    {subject.students.map((student) => student.name + ' ')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <PieComponent />
      </div>
    </div>
  )
}

const GET_STUDENTS_WITH_SUBJECTS = gql`
  {
    getStudentsWithSubjects {
      id
      name
      email
      phone
      date_of_birth
      subjects {
        name
      }
    }
  }
`

const GET_SUBJECTS_WITH_STUDENTS = gql`
  {
    getSubjectsWithStudents {
      id
      name
      students {
        name
      }
    }
  }
`

export default Home
