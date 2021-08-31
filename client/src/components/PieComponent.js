import React, { useState, useEffect } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { Pie } from 'react-chartjs-2'

const PieComponent = () => {
  const [pieData, setPieData] = useState({})
  const { loading, data } = useQuery(FETCH_PIE)
  useEffect(() => {
    try {
      if (data) {
        const { getSubjectsPie } = data
        setPieData(getSubjectsPie)
      }
    } catch (err) {
      console.log(err)
    }
  }, [data])
  return (
    <div>
      <Pie
        responsive={false}
        options={{
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Subjects',
              font: { size: 28 },
            },
          },
        }}
        height={300}
        data={{
          labels: ['English', 'Bangla', 'Maths', 'Physics'],
          datasets: [
            {
              label: 'My First Dataset',
              data: [
                pieData.english,
                pieData.bangla,
                pieData.maths,
                pieData.physics,
              ],
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(0,128,0)',
              ],
              hoverOffset: 4,
            },
          ],
        }}
      />
    </div>
  )
}

const FETCH_PIE = gql`
  {
    getSubjectsPie {
      bangla
      english
      physics
      maths
    }
  }
`

export default PieComponent
