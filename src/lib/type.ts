export interface Post {
    _id?: string;
    title: string;
    description: string;
    tags: string[];
    createdAt?: string;
    githubUrl: string;
    owner?: {
        username?: string;
        fullName?: string
    };
}

export interface CollabPost {
    _id: string;
    title: string;
    description: string;
    requiredSkills: string[];
    createdAt: string;
    creator?: {
        fullName?: string;
        username?: string;

    };
}