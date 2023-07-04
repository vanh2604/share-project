import Head from 'next/head'
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
      <section className="flexStart flex-col paddings mb-16">
          <h1>nav bar</h1>
          <h2>posts</h2>
          <h1>footer</h1>
      </section>
  )
}

Home.getLayout = function getLayout(page) {
    return <div>
        <Navbar></Navbar>
            {page}
        <Footer></Footer>
    </div>
}