"use client"

import { Helmet } from "react-helmet"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchUserInfo, logout } from "../lib/authSlice" // Import the action

//? CSS
import "../components/css/sidebar.css"
import "../index.css"

//? Components
import SideBar from "../components/sideBar"
import Card from "../components/card"
import Footer from "../components/footer"
import Review from "../components/review"

//? Icons
import AccLogo from "../images/conta-logo.png"
import Star1 from "../images/star1.svg"
import Star2 from "../images/star2.svg"
import EditIco from "../images/edit-account.svg"
import ProposalsIco from "../images/proposals.svg"
import LogoutIco from "../images/logout.svg"

const Account = () => {
  // Estado para controlar o modal
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/")
      return
    }

    dispatch(fetchUserInfo()) // Fetch user info on page load
  }, [isAuthenticated, dispatch, navigate])

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include", // Ensures cookies are sent and removed
      })

      if (response.ok) {
        dispatch(logout()) // Log the user out in Redux store
        navigate("/") // Redirect to the home page
      } else {
        console.error("Failed to log out")
      }
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Helmet>
        <title>Conta</title>
      </Helmet>
      <div className="md:sticky md:top-0 md:h-screen">
        <SideBar />
      </div>
      <div className="App w-full overflow-x-hidden flex flex-col flex-grow">
        <div className="left mx-2 md:ml-10 lg:ml-20 mt-6 md:mt-10 flex flex-col px-4 md:px-6">
          <p className="text-2xl md:text-3xl text-[#73802A]">Conta</p>
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="account mt-6 md:mt-10 flex flex-col md:flex-row">
              <img
                src={AccLogo || "/placeholder.svg"}
                className="rounded-full w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-[182px] xl:h-[182px] object-cover mx-auto md:mx-0"
                alt="account-logo"
              />
              <div className="info mt-4 md:mt-0 md:ml-4 lg:ml-10 flex flex-col justify-center text-center md:text-left">
                <p className="text-xl md:text-2xl lg:text-3xl text-[#73802A]">{user?.message.Nome}</p>
                <p className="md:ml-2 lg:ml-5 text-sm md:text-base">{user?.message.Email}</p>
              </div>

              <div className="rating mt-4 md:mt-0 md:ml-6 lg:ml-20 xl:ml-60 flex flex-col items-center md:items-start">
                <div className="flex flex-row items-center justify-center md:justify-start gap-1 md:gap-2">
                  <img
                    src={Star1 || "/placeholder.svg"}
                    className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-[29px] xl:h-[29px]"
                    alt=""
                  />
                  <img
                    src={Star1 || "/placeholder.svg"}
                    className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-[29px] xl:h-[29px]"
                    alt=""
                  />
                  <img
                    src={Star1 || "/placeholder.svg"}
                    className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-[29px] xl:h-[29px]"
                    alt=""
                  />
                  <img
                    src={Star2 || "/placeholder.svg"}
                    className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-[29px] xl:h-[29px]"
                    alt=""
                  />
                  <img
                    src={Star2 || "/placeholder.svg"}
                    className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-[29px] xl:h-[29px]"
                    alt=""
                  />
                </div>
                <button onClick={openModal} className="text-xs md:text-sm mt-1 hover:underline cursor-pointer">
                  X avaliações
                </button>
              </div>

              <div className="icons mt-6 md:mt-0 md:ml-6 lg:ml-10 xl:ml-20 flex flex-row md:flex-col justify-center gap-4 md:gap-3">
                <div className="edit flex flex-row items-center cursor-pointer">
                  <img
                    src={EditIco || "/placeholder.svg"}
                    className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-[35px] xl:h-[35px]"
                    alt=""
                  />
                  <span className="ml-2 text-sm md:text-base">Editar</span>
                </div>
                <div className="proposals flex flex-row items-center cursor-pointer">
                  <img
                    src={ProposalsIco || "/placeholder.svg"}
                    className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-[35px] xl:h-[35px]"
                    alt=""
                  />
                  <span className="ml-2 text-sm md:text-base">Propostas</span>
                </div>
                <div onClick={handleLogout} className="logout flex flex-row items-center cursor-pointer">
                  <img
                    src={LogoutIco || "/placeholder.svg"}
                    className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-[35px] xl:h-[35px]"
                    alt=""
                  />
                  <span className="ml-2 text-sm md:text-base">Sair</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content mt-10 md:mt-20 px-4 md:px-6 lg:px-10 xl:px-20 text-[#73802A] flex-grow">
          <p className="text-xl md:text-2xl">O que tem para o vizinho:</p>
          <div className="items mt-4 md:mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-10">
            <Card name="Camisola dourada" size="S" value="10,50" />
            <Card name="Camisola vermelha" size="M" value="15,00" />
          </div>
        </div>
        <div className="mt-auto w-full">
          <Footer />
        </div>
      </div>
      {isModalOpen && <Review closeModal={() => setIsModalOpen(false)} />}
    </div>
  )
}

export default Account

