import { gql } from '@apollo/client';
import HomeScreen from '@/components/HomeScreen/HomeScreen';

const TOP_POSTS_QUERY = gql`
	query topPosts($offset: Int, $limit: Int) {
		posts(offset: $offset, limit: $limit, sort: top) {
			id
			title
			content
			createdAt
			comments {
				id
			}
			votes {
				userId
				value
			}
			author {
				name
			}
			community {
				name
			}
		}
	}
`;

export default function Top() {
	return <HomeScreen query={TOP_POSTS_QUERY} highlighted="top" />;
}
