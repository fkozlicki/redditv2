import { Meta, StoryObj } from '@storybook/react';
import CommentsSection from './CommentsSection';
import '../../app/globals.css';

const meta: Meta<typeof CommentsSection> = {
	title: 'CommentsSection',
	component: CommentsSection,
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CommentsSection>;

export const Default: Story = {
	args: {
		initialComments: [],
		postId: '1',
	},
	parameters: {
		nextjs: {
			appDirectory: true,
		},
	},
};

export const WithComments: Story = {
	args: {
		initialComments: [
			{
				id: '1',
				author: {
					name: 'John Doe',
				},
				content: 'Lorem ipsum dolor sit amet.',
				createdAt: new Date(),
				replies: [],
				votes: [],
			},
			{
				id: '2',
				author: {
					name: 'Anne Doe',
				},
				content: 'Lorem ipsum dolor sit amet.',
				createdAt: new Date(),
				replies: [
					{
						author: {
							name: 'John Doe',
						},
						content: '123',
						createdAt: new Date(),
						id: '4',
						votes: [],
					},
				],
				votes: [],
			},
		],
		postId: '1',
	},
	parameters: {
		nextjs: {
			appDirectory: true,
		},
		nextAuthMock: {
			session: {
				data: {
					user: {
						id: '123',
						email: 'johndoe@gmail.ocm',
						name: 'John Doe',
					},
				},
				status: 'unauthenticated',
			},
		},
	},
};
