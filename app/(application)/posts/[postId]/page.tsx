import PostViewPage from "@/components/pages/PostViewPage";

import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { preparedPostQuery } from "@/database/preparedQueries/post";
import SessionProviderWrapper from "@/components/base/SessionProviderWrapper";
import authOptions from "@/lib/authOptions";

interface PageProps {
	params: Promise<{ postId: string }>;
}

async function Page(props: PageProps) {
	const session = await getServerSession(authOptions);

	const { params } = props;
	const postId = Number((await params).postId);

	const post = await preparedPostQuery(postId);

	if (!post) {
		return notFound();
	}

	return (
		<SessionProviderWrapper session={session}>
			<PostViewPage post={post} />
		</SessionProviderWrapper>
	);
}
export default Page;