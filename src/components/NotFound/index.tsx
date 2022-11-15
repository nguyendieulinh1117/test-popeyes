import React from "react";
import Link from "next/link";

import Button from "@@@Form/Button";
import { paths } from "@constants";

import styles from './index.module.scss';

const NotFound = () => {
	return (
		<div className={styles.notFound}>
			<div className="container">
				<div className={styles.box}>
					<figure>
						<img src="/images/404.png" alt="404" />
						<figcaption>
							Không tìm thấy trang mà bạn yêu cầu, vui lòng quay trở lại trang chủ.
						</figcaption>
					</figure>
					<Link href={paths.home}>
						<Button buttonStyle="secondary"> Quay trở lại trang chủ </Button>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default NotFound;