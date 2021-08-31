const { ApolloServer } = require('apollo-server')
const gql = require('graphql-tag')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const dayjs = require('dayjs')
const { GraphQLScalarType, Kind } = require('graphql')
const { UserInputError } = require('apollo-server')

//Models
const Subject = require('./models/Subject')
const Student = require('./models/Student')

//Validators
const { validateStudentInput } = require('./util/validators')

//Accessing .env file
dotenv.config()

//GraphQL typedefs
const typeDefs = gql`
  scalar Date
  type Student {
    id: ID!
    name: String!
    email: String!
    phone: String!
    date_of_birth: String!
  }

  type StudentWithSubjects {
    id: ID!
    name: String!
    email: String!
    phone: String!
    date_of_birth: String!
    subjects: [Subject]
  }

  type Subject {
    id: ID!
    name: String!
    enrolled: [String]
  }

  type SubjectWithStudents {
    id: ID!
    name: String!
    students: [Student]
  }

  type EnrolledSubjects {
    Bangla: Boolean!
    English: Boolean!
    Physics: Boolean!
    Maths: Boolean!
  }

  type Pie {
    bangla: Int!
    english: Int!
    physics: Int!
    maths: Int!
  }

  input StudentInput {
    name: String!
    email: String!
    phone: String!
    date_of_birth: String!
  }

  input UpdateInput {
    id: ID!
    name: String!
    email: String!
    phone: String!
    date_of_birth: String!
  }

  type Query {
    getStudent(studentId: ID!): Student!
    getStudents: [Student]
    getStudentsWithSubjects: [StudentWithSubjects]

    getSubject(subjectId: ID!): Subject!
    getSubjects: [Subject]
    getSubjectsWithStudents: [SubjectWithStudents]

    checkEnrollment(studentId: ID!, subjectName: String!): Boolean!
    checkAllEnrollment(studentId: ID!): EnrolledSubjects

    getSubjectsPie: Pie
  }

  type Mutation {
    createStudent(studentInput: StudentInput!): Student!
    deleteStudent(studentId: ID!): String!
    updateStudent(updateInput: UpdateInput!): String!

    enrollSubject(studentId: ID!, subjectName: String!): String!
    unEnrollSubject(studentId: ID!, subjectName: String!): String!
  }
`
//GraphQL resolvers
const resolvers = {
  Query: {
    async getStudent(_, { studentId }) {
      try {
        const student = await Student.findOne({ studentId })
        return student
      } catch (err) {
        console.log('Error Getting a Student', err)
      }
    },

    async getStudents() {
      try {
        const students = await Student.find()
        return students
      } catch (err) {
        console.log('Error Getting Students', err)
      }
    },

    async getStudentsWithSubjects() {
      try {
        const res = await Student.aggregate([
          { $addFields: { stu_id: { $toString: '$_id' } } },
          {
            $lookup: {
              from: 'subjects',
              localField: 'stu_id',
              foreignField: 'enrolled',
              as: 'subjects',
            },
          },
          {
            $project: {
              id: '$stu_id',
              name: '$name',
              email: '$email',
              phone: '$phone',
              date_of_birth: '$date_of_birth',
              subjects: '$subjects',
            },
          },
        ])
        return res
      } catch (err) {
        console.log('Error Getting Students with Subjects', err)
      }
    },
    async getSubject(_, { subjectId }) {
      try {
        const subject = await Subject.findOne({ subjectId })
        return subject
      } catch (err) {
        console.log('Error Getting a Subject', err)
      }
    },

    async getSubjects() {
      try {
        const subjects = await Subject.find()
        return subjects
      } catch (err) {
        console.log('Error Getting Subjects', err)
      }
    },

    async getSubjectsWithStudents() {
      try {
        const res = await Subject.aggregate([
          {
            $addFields: {
              stu_id: {
                $map: {
                  input: '$enrolled',
                  as: 'ids',
                  in: { $toObjectId: '$$ids' },
                },
              },
              sub_id: {
                $toString: '$_id',
              },
            },
          },
          {
            $lookup: {
              from: 'students',
              localField: 'stu_id',
              foreignField: '_id',
              as: 'students',
            },
          },
          {
            $project: {
              id: '$sub_id',
              name: '$name',
              students: '$students',
            },
          },
        ])
        return res
      } catch (err) {
        console.log('Error Getting Subjects with Students', err)
      }
    },
    async checkEnrollment(_, { studentId, subjectName }) {
      try {
        const subject = await Subject.find({
          name: subjectName,
          enrolled: { $in: studentId },
        })
        if (subject.length !== 0) {
          return true
        } else {
          return false
        }
      } catch (err) {
        console.log(err)
      }
    },
    async checkAllEnrollment(_, { studentId }) {
      const res = await Subject.aggregate([
        {
          $match: { enrolled: studentId },
        },
      ])
      enrolledSubjects = {
        Bangla: false,
        English: false,
        Physics: false,
        Maths: false,
      }

      res.forEach((subject) => {
        enrolledSubjects[subject.name] = true
      })

      return enrolledSubjects
    },
    async getSubjectsPie() {
      let bangla = await Subject.aggregate([
        { $match: { name: 'Bangla' } },
        {
          $project: {
            number: {
              $cond: {
                if: { $isArray: '$enrolled' },
                then: { $size: '$enrolled' },
                else: 0,
              },
            },
          },
        },
      ])
      bangla = bangla[0].number
      let english = await Subject.aggregate([
        { $match: { name: 'English' } },
        {
          $project: {
            number: {
              $cond: {
                if: { $isArray: '$enrolled' },
                then: { $size: '$enrolled' },
                else: 0,
              },
            },
          },
        },
      ])
      english = english[0].number
      let physics = await Subject.aggregate([
        { $match: { name: 'Physics' } },
        {
          $project: {
            number: {
              $cond: {
                if: { $isArray: '$enrolled' },
                then: { $size: '$enrolled' },
                else: 0,
              },
            },
          },
        },
      ])
      physics = physics[0].number
      let maths = await Subject.aggregate([
        { $match: { name: 'Maths' } },
        {
          $project: {
            number: {
              $cond: {
                if: { $isArray: '$enrolled' },
                then: { $size: '$enrolled' },
                else: 0,
              },
            },
          },
        },
      ])
      maths = maths[0].number
      const pie = {
        bangla,
        english,
        physics,
        maths,
      }
      return pie
    },
  },
  Mutation: {
    async createStudent(
      _,
      { studentInput: { name, email, phone, date_of_birth } }
    ) {
      //validate data
      const { valid, errors } = validateStudentInput(
        name,
        email,
        phone,
        date_of_birth
      )
      if (!valid) throw new UserInputError('Errors', { errors })
      //check if email is taken
      const checkEmail = await Student.findOne({ email })
      if (checkEmail) {
        throw new UserInputError('Email is taken', {
          errors: {
            email: 'This email is taken',
          },
        })
      }
      const newStudent = new Student({
        name,
        email,
        phone,
        date_of_birth,
      })
      const res = await newStudent.save()
      return res
    },
    async deleteStudent(_, { studentId }) {
      try {
        const studentToDelete = await Student.findById(studentId)
        const idsToPull = await Subject.updateMany(
          { enrolled: studentId },
          {
            $pull: {
              enrolled: studentId,
            },
          }
        )
        if (studentToDelete && idsToPull) {
          await studentToDelete.delete()
          console.log(`Student with ID: ${studentId} deleted`)
          return `Student with ID: ${studentId} deleted`
        } else {
          console.log(`Student with ID: ${studentId} does not exist`)
          return `Student with ID: ${studentId} does not exist`
        }
      } catch (err) {
        throw new Error(err)
      }
    },
    async updateStudent(
      _,
      { updateInput: { id, name, email, phone, date_of_birth } }
    ) {
      try {
        const studentToUpdate = await Student.findById(id)
        if (studentToUpdate) {
          const { valid, errors } = validateStudentInput(
            name,
            email,
            phone,
            date_of_birth
          )
          if (!valid) throw new UserInputError('Errors', { errors })
          await Student.updateOne(
            { _id: id },
            {
              $set: {
                name: name,
                email: email,
                phone: phone,
                date_of_birth: date_of_birth,
              },
            }
          )
          return `Details updated for student with the ID: ${id}`
        } else {
          console.log(`Student with ID: ${id} does not exist`)
          return `Student with ID: ${id} does not exist`
        }
      } catch (err) {
        console.log('Error updating student', err)
        return `Error updating details for student with the ID: ${id}`
      }
    },
    async enrollSubject(_, { studentId, subjectName }) {
      try {
        const subject = await Subject.find({ name: subjectName })
        if (subject) {
          await Subject.updateOne(
            { name: subjectName },
            {
              $push: {
                enrolled: studentId,
              },
            }
          )
        }
        return `Enrolled!`
      } catch (err) {
        console.log(err)
      }
    },
    async unEnrollSubject(_, { studentId, subjectName }) {
      try {
        const subject = await Subject.find({ name: subjectName })
        if (subject) {
          await Subject.updateOne(
            { name: subjectName },
            {
              $pull: {
                enrolled: studentId,
              },
            }
          )
        }
        return `Unenrolled!`
      } catch (err) {
        console.log(err)
      }
    },
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
      return dayjs(value).format('MM-DD-YYYY') // Convert outgoing Date to integer for JSON
    },
    parseValue(value) {
      return dayjs(value) // Convert incoming integer to Date
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return dayjs(ast.value) // Convert hard-coded AST string to integer and then to Date
      }
      return null // Invalid hard-coded value (not an integer)
    },
  }),
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
})

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }).then(() => {
  return server.listen({ port: 5000 }).then((res) => {
    console.log('MongoDB connected')
    console.log(`Server running at ${res.url}`)
  })
})
