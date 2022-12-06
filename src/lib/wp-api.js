const WP_API_URL = "http://crash-dummy-site.local/graphql";

async function fetchAPI(query) {
    const headers = {'Content-Type': 'application/json'};
    const response = await fetch(WP_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query: query }),
    });
    const json = await response.json();
    if (json.errors) { console.log(json.errors); throw new Error('Failed to fetch API'); }
    return json.data;
}


export async function getAllPostsForList() {
    const data = await fetchAPI(`
    {
        posts {
            nodes {
                slug
                content
                title
                featuredImage {
                    node {
                        altText
                        mediaItemUrl
                    }
                }
                excerpt
            }
        }
    }`);
    return data;
}

// Get all slugs for getStaticPaths()
export async function getAllSlugs() {
    const data = await fetchAPI(
    `{
        posts {
            nodes {
                slug
            }
        }
        pages {
            nodes {
                slug
            }
        }
    }`);
    return data;
}

// Get content from slug to render in a page
export async function getNodeBySlug(slug) {
    const data = await fetchAPI(`
    {
        nodeByUri(uri: "${slug}") {
            __typename
            ... on Post {
                content
                title
            }
            ... on Page {
                content
                title
            }
        }
    }`);
    return data;
}




