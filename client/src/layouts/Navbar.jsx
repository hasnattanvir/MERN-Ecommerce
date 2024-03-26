import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return <nav className='nav_div'>
          <NavLink to="/" className="nav_link">Home</NavLink>
          <NavLink to="/register" className="nav_link">Register</NavLink>
          <NavLink to="/cart" className="nav_link">Cart</NavLink>
          <NavLink to="/error" className="nav_link">Error</NavLink>
          <NavLink to="/login" className="nav_link">Login</NavLink>
          <NavLink to="/logout" className="nav_link">Logout</NavLink>
        </nav>
}

export default Navbar