import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {GetServerSideProps} from "next";
import {fetchAllProjects} from "../lib/apollo-client";
import {ProjectInterface} from "../common.types";
import ProjectCard from "../components/ProjectCard";
import Categories from "../components/Categories";
import LoadMore from "../components/LoadMore";


type ProjectSearch = {
    projectSearch: {
        edges: { node: ProjectInterface }[];
        pageInfo: {
            hasPreviousPage: boolean;
            hasNextPage: boolean;
            startCursor: string;
            endCursor: string;
        };
    },
}
export const getServerSideProps : GetServerSideProps = async (context) => {
    const {data} = await fetchAllProjects(context.query.category as string,context.query.endcursor as string,context.query.startcursor as string)
    return { props: { data } }
}

export default function Home({data} : {data : ProjectSearch}) {
    const projectsToDisplay = data?.projectSearch?.edges || [];
    if (projectsToDisplay.length === 0) {
        return (
            <section className="flexStart flex-col paddings lg:min-h-[300px]">
                <Categories />
                <p className="no-result-text text-center">No projects found, go create some first.</p>
            </section>
        )
    }
    return (
        <section className="flexStart flex-col paddings mb-16">
            <Categories />
            <section className="projects-grid">
                {projectsToDisplay.map(({ node }: { node: ProjectInterface }) => (
                    <ProjectCard
                        key={`${node?.id}`}
                        id={node?.id}
                        image={node?.image}
                        title={node?.title}
                        name={node?.createdBy.name}
                        avatarUrl={node?.createdBy.avatarUrl}
                        userId={node?.createdBy.id}
                    />
                ))}
            </section>
            <LoadMore
                startCursor={data?.projectSearch?.pageInfo?.startCursor}
                endCursor={data?.projectSearch?.pageInfo?.endCursor}
                hasPreviousPage={data?.projectSearch?.pageInfo?.hasPreviousPage}
                hasNextPage={data?.projectSearch?.pageInfo.hasNextPage}
            />
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