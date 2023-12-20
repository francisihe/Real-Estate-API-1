import dotenv from 'dotenv';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { BLOG_URL } from '../utils/variables.js';
dotenv.config();

// const credentials = btoa(`${process.env.BLOG_USERNAME}:${process.env.BLOG_PASSWORD}`);

const formatDate = (dateString) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

const fetchAuthorName = async (authorLink) => {
    try {
        const response = await fetch(authorLink);
        const data = await response.json();
        return data ? data.name : null;
    } catch (error) {
        console.error(`Error fetching Author Name:`, error);
        return null;
    }
};

const fetchImage = async (featuredImageUrl) => {
    try {
        const response = await fetch(featuredImageUrl);
        const data = await response.json();
        return data ? data.guid.rendered : null;
    } catch (error) {
        console.error(`Error fetching Featured Image:`, error);
        return null;
    }
};

const sanitizeHTML = (html) => {
    // Cleanse HTML Content
    const window = new JSDOM('').window;
    const purify = DOMPurify(window)
    const clean = purify.sanitize(html)
    return clean
};

export const getAllBlogs = async (req, res, next) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const minLimit = parseInt(req.query.limit) || 15;
        const maxLimit = 100;
        const limit = Math.min(minLimit, maxLimit);

        // Calculate the skip value based on the page and limit
        const skip = (page - 1) * limit;

        // Fetch only published blogs from Wordpress with pagination parameters
        const data = await fetch(`${BLOG_URL}/wp-json/wp/v2/posts?per_page=${limit}&page=${page}&status=publish`);
        const blogs = await data.json();

        const publishedBlogs = await Promise.all(blogs.map(async (blog) => {
            const featuredImageUrl = blog._links['wp:featuredmedia'] ? blog._links['wp:featuredmedia'][0].href : null;

            return {
                id: blog.id,
                date: formatDate(blog.date),
                slug: blog.slug,
                link: blog.link,
                title: blog.title.rendered,
                excerpt: sanitizeHTML(blog.excerpt.rendered),
                featuredImage: blog.jetpack_featured_media_url || null
                // featuredImage: blog ? blog.jetpack_featured_media_url : (await fetchImage(featuredImageUrl)) || null,
                //featuredImage: featuredImageUrl ? await fetchImage(featuredImageUrl) : null,
            };
        }));

        res.status(200).json({ blogs: publishedBlogs, totalBlogs: publishedBlogs.length });
    } catch (error) {
        next(error);
    }
};


export const getLatestBlogs = async (req, res, next) => {
    try {
        // Fetch the 6 most recent published blogs from WordPress
        const data = await fetch(`${BLOG_URL}/wp-json/wp/v2/posts?per_page=6&status=publish&orderby=date&order=desc`);
        const blogs = await data.json();

        const recentBlogs = await Promise.all(
            blogs.map(async (blog) => {
                // const featuredImageUrl = blog._links['wp:featuredmedia']
                //     ? blog._links['wp:featuredmedia'][0].href
                //     : null;

                const eachBlog = {
                    id: blog.id,
                    date: formatDate(blog.date),
                    slug: blog.slug,
                    link: blog.link,
                    title: blog.title.rendered,
                    excerpt: sanitizeHTML(blog.excerpt.rendered),
                    featuredImage: blog.jetpack_featured_media_url || null
                    // featuredImage: blog ? blog.jetpack_featured_media_url : (await fetchImage(featuredImageUrl)) || null,
                    //featuredImage: featuredImageUrl
                        // ? await fetchImage(featuredImageUrl)
                        // : null,
                };

                return eachBlog;
            })
        );

        res.status(200).json({ blogs: recentBlogs, totalBlogs: recentBlogs.length });
    } catch (error) {
        next(error);
    }
};

export const getBlogById = async (req, res, next) => {
    try {
        const blogSlug = req.params.slug; // Assuming your route has a parameter for the blog slug

        // Fetch a single blog post by slug from WordPress
        const data = await fetch(`${BLOG_URL}/wp-json/wp/v2/posts?slug=${blogSlug}&status=publish`);
        const blogs = await data.json();

        if (!blogs || blogs.length === 0) {
            // If no blog is found with the provided slug, return a 404 response
            res.status(404).json({ message: 'Blog not found' });
            return;
        }

        const blog = blogs[0];

        const authorLink = blog._links.author ? blog._links.author[0].href : null;
        const featuredImageUrl = blog._links['wp:featuredmedia'] ? blog._links['wp:featuredmedia'][0].href : null;

        // Map the retrieved blog to the desired structure
        const mappedBlog = {
            id: blog.id,
            date: formatDate(blog.date),
            slug: blog.slug,
            link: blog.link,
            title: blog.title.rendered,
            content: sanitizeHTML(blog.content.rendered),
            author: authorLink ? await fetchAuthorName(authorLink) : null,
            featuredImage: blog.jetpack_featured_media_url || null
            // featuredImage: blog ? blog.jetpack_featured_media_url : (await fetchImage(featuredImageUrl)) || null,
            //featuredImage: featuredImageUrl ? await fetchImage(featuredImageUrl) : null,
        };

        res.status(200).json(mappedBlog);
    } catch (error) {
        next(error);
    }
};


