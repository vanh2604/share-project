import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Modal from "../../components/Modal";
import ProjectForm from "../../components/ProjectForm";
import {GetServerSideProps} from "next";
import {authOptions, getCurrentUser} from "../../lib/session";
import {getServerSession} from "next-auth/next";

export const getServerSideProps : GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions)
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    return { props: { appSession: session } }
}
const CreateProject = (props) => {
    return (
        <Modal>
            <h1 className="text-4xl font-bold">Create a new project</h1>
            <ProjectForm type="create" />
        </Modal>
    );
};

export default CreateProject

CreateProject.getLayout = function getLayout(page) {
    return <div>
        <Navbar></Navbar>
        {page}
        <Footer></Footer>
    </div>
}
