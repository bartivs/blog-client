import rss from '@astrojs/rss';
import { getPosts } from '../lib/strapi';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function get(context) {
	const posts = await getPosts();
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			title: post.title,
			description: post.title,
			pubDate: new Date(post.publication_date),
			link: `/posts/${post.documentId}/`,
		})),
	});
}
