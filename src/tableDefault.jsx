import { useState } from 'react'

export function TableDefault({ data, months }) {
  const [view, setView] = useState('План')

  const toggleView = () => {
    setView(view === 'План' ? 'Факт' : 'План')
  }

  return (
    <div>
      {/* eslint-disable-next-line react/button-has-type */}
      <button onClick={toggleView}>
        Switch to
        {view === 'План' ? 'Fact' : 'Plan'}
      </button>
      <table border="1">
        <thead>
          <tr>
            <th>City</th>
            <th>Category</th>
            {months.map(month => (
              <th key={month}>{month}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([city, categories]) =>
            Object.entries(categories).map(([category, values], index) => (
              <tr key={`${city}-${category}`}>
                {index === 0 && <td rowSpan={Object.keys(categories).length}>{city}</td>}
                <td>{category}</td>
                {months.map(month => (
                  <td key={month}>{values[view][month]}</td>
                ))}
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  )
}
