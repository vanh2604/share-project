import {GetServerSideProps} from "next";
import {getProjectDetails} from "../../../lib/apollo-client";
import {ProjectInterface} from "../../../common.types";
import {getServerSession} from "next-auth/next";
import {authOptions} from "../../../lib/session";
import Modal from "../../../components/Modal";
import ProjectForm from "../../../components/ProjectForm";

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
    const {data} = await getProjectDetails(context.params.id as string)
    return { props: { data } }
}

export const EditProject = ({data : result} : {data : {project : ProjectInterface}}) => {

    if (!result?.project) return (
        <p className="no-result-text">Failed to fetch project info</p>
    )

    return (
        <Modal>
            <h3 className="modal-head-text">Edit Project</h3>

            <ProjectForm type="edit" project={result?.project} />
        </Modal>
    );
};


export default EditProject