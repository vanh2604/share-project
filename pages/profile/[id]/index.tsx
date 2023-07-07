import {getUserProjects} from "../../../lib/apollo-client";
import ProfilePage from "../../../components/UserProfile";
import {GetServerSideProps} from "next";
import {UserProfile} from "../../../common.types";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Home from "../../index";

export const getServerSideProps : GetServerSideProps = async (context) => {
    const {data} = await getUserProjects(context.params.id as string,8)
    return { props: { data } }
}


const UserProfilePage = ({data : result} : {data : {user : UserProfile}}) => {

    if (!result?.user) return (
        <p className="no-result-text">Failed to fetch user info</p>
    )

    return <ProfilePage user={result?.user}  />
}

export default UserProfilePage

UserProfilePage.getLayout = function getLayout(page) {
    return <div>
        <Navbar></Navbar>
        {page}
        <Footer></Footer>
    </div>
}
