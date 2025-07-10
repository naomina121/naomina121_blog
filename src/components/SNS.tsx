
import { PageType } from '@/types';
import React, { FC } from 'react';

import {
	TwitterShareButton,
	FacebookShareButton,
	HatenaShareButton,
	XIcon,
	FacebookIcon,
	HatenaIcon,
} from 'react-share';
import { siteConfig } from '../../site.config';
import { postCategory, postTitle, slug } from '@/utils/data';

type ContentBottomProps = {
    page: PageType;
}

const SNS:FC<ContentBottomProps> = (page) => {
	const snsUrl =
		siteConfig.siteUrl +

		postCategory(page.page) +
		'/' +
		slug(page.page);

	const snsTitle = postTitle(page.page);

	return (
		<div className="flex flex-wrap justify-between">
			<div className="sns-button x">
				<TwitterShareButton url={snsUrl} title={snsTitle}>
					<XIcon size={45} round={false} />
					<span className="xl:hidden">エックス</span>
				</TwitterShareButton>
			</div>
			<div className="sns-button facebook">
				<FacebookShareButton url={snsUrl} title={snsTitle}>
					<FacebookIcon size={45} round={false} />
					<span className="xl:hidden">FaceBook</span>
				</FacebookShareButton>
			</div>
			<div className="sns-button hatena">
				<HatenaShareButton url={snsUrl} title={snsTitle}>
					<HatenaIcon size={45} round={false} />
					<span className="xl:hidden">Hatena</span>
				</HatenaShareButton>
			</div>
		</div>
	);
};

export default SNS;
