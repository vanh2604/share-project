import '../styles/globals.css'
import { SessionProvider } from "next-auth/react"
import {ApolloProvider} from "@apollo/client";
import {client} from "../lib/apollo-client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function MyApp({ Component, pageProps : {
    session,
    ...pageProps
} }) {
  const getLayout = Component.getLayout || ((page) => page)

    return (
   <ApolloProvider client={client}>
    <SessionProvider session={session}>
        {getLayout(
            <Component {...pageProps} />
        )}
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
    </SessionProvider>
   </ApolloProvider>
    )
}

export default MyApp
