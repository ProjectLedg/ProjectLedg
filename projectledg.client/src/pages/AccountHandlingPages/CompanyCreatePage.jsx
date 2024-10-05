import React from 'react'
import { useLocation } from 'react-router-dom'

export default function CompanyCreatePage() {
    const location = useLocation()
    const email = location.state?.email

     return (
    <div>
      <h1>Welcome!</h1>
      <p>Your email: {email}</p>
    </div>
  )

}