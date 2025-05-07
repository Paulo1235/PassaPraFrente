import React from 'react'

import Sidebar from '../components/sideBar';
import Footer from '../components/footer';

//! Nao podemos fazer um layout pois temos a sidebar com props diferentes em cada pagina
const Layout = () => {
  return (
    <>
      <Sidebar />
      <div>
        <h1>Welcome to the main content area!</h1>
        {/* You can add more components or content here */}
      </div>
      <Footer />
    </>
  )
}

export default Layout;