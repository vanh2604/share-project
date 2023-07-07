import {ChangeEvent, FormEvent, useState} from "react";
import {FormState, ProjectInterface} from "../common.types";
import Image from "next/image";
import FormField from "./FormField";
import CustomMenu from "./CustomMenu";
import {categoryFilters} from "../constant";
import Button from "./Button";
import {createNewProject, updateProject} from "../lib/apollo-client";
import {useRouter as pushRouter} from "next/navigation";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {toast} from "react-toastify";
interface Props {
    type: String,
    project?: ProjectInterface
}
const ProjectForm = ({type,project} : Props) => {
    const [form, setForm] = useState<FormState>({
        title: project?.title || "",
        description: project?.description || "",
        image: project?.image || "",
        liveSiteUrl: project?.liveSiteUrl || "",
        githubUrl: project?.githubUrl || "",
        category: project?.category || ""
    })
    const [submitting, setSubmitting] = useState(false)
    const router = pushRouter()
    const routerParam = useRouter()
    const {data : session} = useSession()

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setSubmitting(true)
        try {
            if (type === "create") {
                //@ts-ignore
                await createNewProject(form, session?.user?.id, session.accessToken)
                toast.success('Create project successfully!')

                router.push("/")
            }
            if(type === "edit") {
                //@ts-ignore
                await updateProject(form,routerParam.query.id)
                router.push(`/project/${routerParam.query.id}`)
                toast.success('Edit project successfully!')
            }

        } catch (error) {
            toast.error("some thing wrong")
        } finally {
            setSubmitting(false)
        }
    }

    const handleChangeImage = async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.includes('image')) {
            alert('Please upload an image!');

            return;
        }

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
            const result = reader.result as string;

            handleStateChange("image", result)
        };
    }
    const handleStateChange = (fieldName: keyof FormState, value: string) => {
        setForm((prevForm) => ({...prevForm, [fieldName]: value}))
    }
    return (
        <form
            onSubmit={handleFormSubmit}
            className="flexStart form">
            <div className="flexStart form_image-container">
                <label htmlFor="poster" className="flexCenter form_image-label">
                    {!form.image && 'Choose a poster for your project'}
                </label>
                <input
                    id="image"
                    type="file"
                    accept='image/*'
                    required={type === "create"}
                    className="form_image-input"
                    onChange={(e) => handleChangeImage(e)}
                />
                {form.image && (
                    <Image
                        src={form?.image}
                        className="sm:p-10 object-contain z-20" alt="image"
                        fill
                    />
                )}
            </div>

            <FormField
                title="Title"
                state={form.title}
                placeholder="Flexibble"
                setState={(value) => handleStateChange('title', value)}
            />

            <FormField
                title='Description'
                state={form.description}
                placeholder="Showcase and discover remarkable developer projects."
                isTextArea
                setState={(value) => handleStateChange('description', value)}
            />

            <FormField
                type="url"
                title="Website URL"
                state={form.liveSiteUrl}
                placeholder="https://github.com/vanh2604"
                setState={(value) => handleStateChange('liveSiteUrl', value)}
            />

            <FormField
                type="url"
                title="GitHub URL"
                state={form.githubUrl}
                placeholder="https://github.com/vanh2604"
                setState={(value) => handleStateChange('githubUrl', value)}
            />

            <CustomMenu
                title="Category"
                state={form.category}
                filters={categoryFilters}
                setState={(value) => handleStateChange('category', value)}
            />

            <div className="flexStart w-full">
                <Button
                    title={submitting ? `${type === "create" ? "Creating" : "Editing"}` : `${type === "create" ? "Create" : "Edit"}`}
                    type="submit"
                    leftIcon={submitting ? "" : "/plus.svg"}
                    submitting={submitting}
                />
            </div>
        </form>
    );
};


export default ProjectForm