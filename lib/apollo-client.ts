import {ApolloClient, InMemoryCache, gql, createHttpLink, DefaultOptions} from "@apollo/client";
import {
    createProjectMutation,
    createUserMutation, deleteProjectMutation,
    getProjectByIdQuery,
    getProjectsOfUserQuery,
    getUserQuery,
    projectsQuery, projectsQueryBefore, updateProjectMutation
} from "../grapql";
import {setContext} from "@apollo/client/link/context";
import {IProjectForm} from "../common.types";

const isProduction = process.env.NODE_ENV === 'production';

const apiUrl = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || '' : 'http://127.0.0.1:4000/graphql';
const apiKey = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || '' : 'letmein';
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000';

const httpLink = createHttpLink({
    uri: apiUrl,
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            'x-api-key': apiKey
        }
    }
});

const defaultOptions: DefaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
}

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions,
});

export const makeGraphQlRequest = async (query : string, variable = {},token?) => {
    try {
        return await client.query({
            query: gql`${query}`,
            variables: variable,
            context: {
                headers: {
                    Authorization: token ? `Bearer ${token}` : ''
                }
            },
        })
    } catch (e) {
        throw e
    }
}
export  const makeGraphQLMutation = async (query: string, variable = {}, token?) => {
    try {
        return await client.mutate({
            mutation: gql`${query}`,
            variables: variable,
            context: {
                headers: {
                    Authorization: token ? `Bearer ${token}` : ''
                }
            }
        })
    } catch (e) {
        throw e
    }
}
export const getUser = (email: string) => {
    return makeGraphQlRequest(getUserQuery,{ email })
}

export const createUser = (name : string, email: string, avatarUrl : string) => {
    const variables = {
        input: {
            name,
            email,
            avatarUrl
        }
    }
    return makeGraphQLMutation(createUserMutation,variables)
}

export const uploadImage = async (imagePath: string) => {
    try {
        const response = await fetch(`${serverUrl}/api/upload`, {
            method: "POST",
            body: JSON.stringify({
                path: imagePath,
            }),
        });
        return response.json();
    } catch (err) {
        throw err;
    }
};

export const createNewProject = async (form: IProjectForm, creatorId: string, token: string) => {
    const imageUrl = await uploadImage(form.image);

    if (imageUrl.url) {

        const variables = {
            input: {
                ...form,
                image: imageUrl.url,
                createdBy: {
                    link: creatorId
                }
            }
        };

        return makeGraphQLMutation(createProjectMutation, variables,token);
    }
};

export const fetchAllProjects = (category?: string | null, endcursor?: string | null, startcursor?: string | null) => {
    if(startcursor) {
        return makeGraphQlRequest(projectsQueryBefore,{category,startcursor})
    }
    return makeGraphQlRequest(projectsQuery, { category, endcursor });
};

export const getUserProjects = (id: string, last?: number) => {
    return makeGraphQlRequest(getProjectsOfUserQuery, { id, last });
};

export const getProjectDetails = (id: string) => {
    return makeGraphQlRequest(getProjectByIdQuery, { id });
};


export const deleteProject = (id: string, token: string) => {
    return makeGraphQLMutation(deleteProjectMutation, { id }, token);
};


export const updateProject = async (form: IProjectForm, projectId: string, token: string) => {
    function isBase64DataURL(value: string) {
        const base64Regex = /^data:image\/[a-z]+;base64,/;
        return base64Regex.test(value);
    }

    let updatedForm = { ...form };

    const isUploadingNewImage = isBase64DataURL(form.image);

    if (isUploadingNewImage) {
        const imageUrl = await uploadImage(form.image);

        if (imageUrl.url) {
            updatedForm = { ...updatedForm, image: imageUrl.url };
        }
    }

    const variables = {
        id: projectId,
        input: updatedForm,
    };

    return makeGraphQLMutation(updateProjectMutation, variables,token);
};