/**
 * 서버컴포넌트에서는 세션을 바로 당겨서 쓰면되는데
 * 클라이언트컴포넌트(cc)에서는 그럴수 없어서 high order components 방식으로
 * 자식 cc들에게 세션을 넘겨주기 위해 작성하는 Wrapper
 */

'use client';

import { type PropsWithChildren } from "react";
import { Session } from 'next-auth';
import { SessionProvider } from "next-auth/react";

type SessionProviderWrapperProps = PropsWithChildren<{
	session: Session | null;
}>;

function SessionProviderWrapper(props: SessionProviderWrapperProps) {
	const { session, children } = props;

	return <SessionProvider session={session}>{children}</SessionProvider>;
}

export default SessionProviderWrapper;

