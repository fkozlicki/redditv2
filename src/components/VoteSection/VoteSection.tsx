'use client';

import { useModalsContext } from '@/contexts/ModalsContext';
import { gql, useMutation } from '@apollo/client';
import {
	ArrowDownCircleIcon,
	ArrowUpCircleIcon,
} from '@heroicons/react/24/outline';
import { CommentVote, Vote } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

type VoteSectionProps = {
	direction: 'row' | 'column';
	initialKarma: number;
} & (
	| { type: 'post'; postId: string; initialVote?: Vote }
	| { type: 'comment'; commentId: string; initialVote?: CommentVote }
);

type VoteMutationValues = {
	value: 1 | -1;
	postId: string;
};

type CommentVoteMutationValues = {
	value: 1 | -1;
	commentId: string;
};

type VoteMutationResponse = {
	makeVote: Vote;
};

type CommentVoteMutationResponse = {
	makeCommentVote: CommentVote;
};

export const voteMutation = gql`
	mutation ($value: Int!, $postId: String!) {
		makeVote(value: $value, postId: $postId) {
			id
			value
			userId
			postId
		}
	}
`;

export const commentVoteMutation = gql`
	mutation ($value: Int!, $commentId: String!) {
		makeCommentVote(value: $value, commentId: $commentId) {
			id
			value
			userId
			commentId
		}
	}
`;

const VoteSection = (props: VoteSectionProps) => {
	const { data: session } = useSession();
	const [, dispatch] = useModalsContext();
	const { direction, initialKarma, type, initialVote } = props;
	const [userVote, setUserVote] = useState<Vote | CommentVote | undefined>(
		initialVote
	);
	const [karma, setKarma] = useState(initialKarma);
	const [vote] = useMutation<
		VoteMutationResponse | CommentVoteMutationResponse,
		VoteMutationValues | CommentVoteMutationValues
	>(type === 'post' ? voteMutation : commentVoteMutation, {
		onError() {
			toast("Couldn't vote");
		},
	});

	useEffect(() => {
		setUserVote(initialVote);
	}, [initialVote]);

	const openSignIn = () => {
		dispatch({ type: 'openSignIn' });
	};

	const handleVote = async (value: 1 | -1) => {
		const variables =
			type === 'post'
				? { value, postId: props.postId }
				: { value, commentId: props.commentId };

		const { data } = await vote({
			variables,
		});
		if (data) {
			if (userVote?.value === value) {
				setKarma((prev) => prev - userVote.value);
				setUserVote(undefined);
			} else {
				if ('makeVote' in data) {
					setUserVote(data.makeVote);
				} else {
					setUserVote(data.makeCommentVote);
				}
				setKarma((prev) => prev + value * (userVote ? 2 : 1));
			}
		}
	};

	return (
		<div
			className={`flex items-center gap-1 ${
				direction === 'column' ? 'flex-col' : ''
			}`}
		>
			<button
				aria-label="Up Vote"
				onClick={session ? () => handleVote(1) : openSignIn}
				className="rounded-sm hover:bg-button-hover group p-px outline-none"
			>
				<ArrowUpCircleIcon
					className={`w-6 group-hover:text-danger ${
						userVote?.value === 1 ? 'text-danger' : 'text-text-gray'
					}`}
				/>
			</button>
			<div className="text-[12px] font-semibold">{karma}</div>
			<button
				aria-label="Down Vote"
				onClick={session ? () => handleVote(-1) : openSignIn}
				className="rounded-sm hover:bg-button-hover group p-px outline-none"
			>
				<ArrowDownCircleIcon
					className={`w-6 group-hover:text-primary ${
						userVote?.value === -1 ? 'text-primary' : 'text-text-gray'
					}`}
				/>
			</button>
		</div>
	);
};

export default VoteSection;
