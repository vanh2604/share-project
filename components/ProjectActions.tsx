
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {useSession} from "next-auth/react";
import {deleteProject} from "../lib/apollo-client";
import {toast} from "react-toastify";


interface Props {
    projectId: string,
    handleOpenModal: () => void
}

const ProjectActions = ({ projectId, handleOpenModal }: Props) => {
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const router = useRouter()
    const {data: session} = useSession()


    const handleDeleteProject = async () => {
        setIsDeleting(true)
        try {
            //@ts-ignore
            await deleteProject(projectId, session.accessToken);
            toast.success("Delete project success!")
            router.push("/");
        } catch (error) {
            toast.error("Some thing wrong")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <Link href={`/edit-project/${projectId}`} className="flexCenter edit-action_btn">
                <Image src="/pencile.svg" width={15} height={15} alt="edit" />
            </Link>

            <button
                type="button"
                disabled={isDeleting}
                className={`flexCenter delete-action_btn ${isDeleting ? "bg-gray" : "bg-primary-purple"}`}
                onClick={handleOpenModal}
            >
                <Image src="/trash.svg" width={15} height={15} alt="delete" />
            </button>
        </>
    )
}

export default ProjectActions
