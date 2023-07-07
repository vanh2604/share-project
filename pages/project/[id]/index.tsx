import {useRouter} from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Modal from "../../../components/Modal";
import Link from "next/link";
import Image from "next/image";
import {useSession} from "next-auth/react";
import {deleteProject, fetchAllProjects, getProjectDetails} from "../../../lib/apollo-client";
import {ProjectInterface} from "../../../common.types";
import {GetServerSideProps} from "next";
import RelatedProjects from "../../../components/RelatedProject";
import ProjectActions from "../../../components/ProjectActions";
import ConfirmModal from "../../../components/ConfirmModal";
import {useState} from "react";
import {toast} from "react-toastify";

export const getServerSideProps : GetServerSideProps = async (context) => {
    const {data} = await getProjectDetails(context.params.id as string)
    return { props: { data } }
}

const ProjectDetail = ({data : result} : {data : {project: ProjectInterface}}) => {
    const {data: session} = useSession()
    const [isVisible, setIsVisible] = useState(false)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const router = useRouter()

    if (!result?.project) return (
        <p className="no-result-text">Failed to fetch project info</p>
    )
    const projectDetails = result?.project

    const renderLink = () => `/profile/${projectDetails?.createdBy?.id}`

    const handleDeleteProject = async () => {
        setIsDeleting(true)
        try {
            //@ts-ignore
            await deleteProject(projectDetails?.id, session.accessToken);
            toast.success("Delete project success!")
            router.push("/");
        } catch (error) {
            toast.error("Some thing wrong")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Modal>
            <section className="flexBetween gap-y-8 max-w-4xl max-xs:flex-col w-full">
                <div className="flex-1 flex items-start gap-5 w-full max-xs:flex-col">
                    <Link href={renderLink()}>
                        <Image
                            src={projectDetails?.createdBy?.avatarUrl}
                            width={50}
                            height={50}
                            alt="profile"
                            className="rounded-full"
                        />
                    </Link>

                    <div className="flex-1 flexStart flex-col gap-1">
                        <p className="self-start text-lg font-semibold">
                            {projectDetails?.title}
                        </p>
                        <div className="user-info">
                            <Link href={renderLink()}>
                                {projectDetails?.createdBy?.name}
                            </Link>
                            <Image src="/dot.svg" width={4} height={4} alt="dot" />
                            <Link href={`/?category=${projectDetails.category}`} className="text-primary-purple font-semibold">
                                {projectDetails?.category}
                            </Link>
                        </div>
                    </div>
                </div>

                {session?.user?.email === projectDetails?.createdBy?.email && (
                    <div className="flex justify-end items-center gap-2">
                            <Link href={`/edit-project/${projectDetails?.id}`} className="flexCenter edit-action_btn">
                                <Image src="/pencile.svg" width={15} height={15} alt="edit" />
                            </Link>

                            <button
                                type="button"
                                disabled={isDeleting}
                                className={`flexCenter delete-action_btn ${isDeleting ? "bg-gray" : "bg-primary-purple"}`}
                                onClick={() => setIsVisible(true)}
                            >
                                <Image src="/trash.svg" width={15} height={15} alt="delete" />
                            </button>
                    </div>
                )}
            </section>

            <section className="mt-14">
                <Image
                    src={`${projectDetails?.image}`}
                    className="object-cover rounded-2xl"
                    width={1064}
                    height={798}
                    alt="poster"
                />
            </section>

            <section className="flexCenter flex-col mt-20">
                <p className="max-w-5xl text-xl font-normal">
                    {projectDetails?.description}
                </p>

                <div className="flex flex-wrap mt-5 gap-5">
                    <Link href={projectDetails?.githubUrl} target="_blank" rel="noreferrer" className="flexCenter gap-2 tex-sm font-medium text-primary-purple">
                        🖥 <span className="underline">Github</span>
                    </Link>
                    <Image src="/dot.svg" width={4} height={4} alt="dot" />
                    <Link href={projectDetails?.liveSiteUrl} target="_blank" rel="noreferrer" className="flexCenter gap-2 tex-sm font-medium text-primary-purple">
                        🚀 <span className="underline">Live Site</span>
                    </Link>
                </div>
            </section>

            <section className="flexCenter w-full gap-8 mt-28">
                <span className="w-full h-0.5 bg-light-white-200" />
                <Link href={renderLink()} className="min-w-[82px] h-[82px]">
                    <Image
                        src={projectDetails?.createdBy?.avatarUrl}
                        className="rounded-full"
                        width={82}
                        height={82}
                        alt="profile image"
                    />
                </Link>
                <span className="w-full h-0.5 bg-light-white-200" />
            </section>

            <RelatedProjects userId={projectDetails?.createdBy?.id} projectId={projectDetails?.id} />
            <ConfirmModal
                title="Delete project!"
                description="Are you sure you want delete this project?"
                isVisible={isVisible} onClose={() => setIsVisible(false)}
                handleConfirm={handleDeleteProject}
            />
        </Modal>
    )
};


export default ProjectDetail

ProjectDetail.getLayout = function getLayout(page) {
    return <div>
        <Navbar></Navbar>
        {page}
        <Footer></Footer>
    </div>
}
