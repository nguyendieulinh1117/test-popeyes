import React from "react";
import Link from "next/link";

import CachedImage from '@@@CachedImage';
import { commonKeys, paths, socialLink } from '@constants';
import useDynamicContent from "@hooks/useDynamicContent";

import IconFace from "@assets/icons/social-face.svg";
import IconIns from "@assets/icons/social-ins.svg";
import IconYoutube from "@assets/icons/social-youtube.svg";
import IconTikTok from "@assets/icons/social-tiktok.svg";
import IconGHN from "@assets/icons/giao-hang-nhanh.png";
import IconSPS from "@assets/icons/super-ship.png";
import IconCOD from "@assets/icons/payment-cod.png";
import IconMomo from "@assets/icons/payment-momo.png";
import IconBCT from "@assets/icons/logoSaleNoti.png";
// import IconShopee from "@assets/icons/social-shopee.svg";
// import IconLazada from "@assets/icons/social-lazada.svg";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
import { replaceAll } from "@utils";

const brandData = [
    {
        name: 'Về chúng tôi',
        link: paths.about
    },
    {
        name: 'Tin tức',
        link: paths.blog
    },
    {
        name: 'Tuyển dụng',
        link: paths.recruitment,
    },
    // {
    //     name: 'Bài viết',
    //     link: '/blog'
    // },
    // {
    //     name: 'Hợp tác',
    //     link: '/'
    // },
]

const supportData = [
    // {
    //     name: 'Hỏi đáp',
    //     link: '/'
    // },
    // {
    //     name: 'Hướng dẫn chọn size',
    //     link: '/'
    // },
    {
        name: 'Chính sách thanh toán',
        link: paths.policyPayment,
    },
    {
        name: 'Chính sách bảo hành, đổi trả',
        link: paths.policyReturn,
    },
    {
        name: 'Chính sách giao, nhận hàng và kiếm hàng',
        link: paths.policyShipping,
    },
    {
        name: 'Chính sách bảo mật thông tin',
        link: paths.policySecret 
    },
    {
        name: 'Chính sách mua hàng',
        link: paths.policyPurchase,
    }
]
const Footer = () => {
    const { contenValue } = useDynamicContent(commonKeys.COMMON_HEADER_FOOTER_CONTENTS);

    const { push } = useRouter();

    const onPushLink = (link: string) => {
        push(link);
    }

    return (
        <div className={styles.footer}>
            <div className="container">
                <div className={styles.box}>
                    <div className={styles.social}>
                        <div>
                            <Link href={paths.home}  passHref>
                                <div className={styles.logo}>
                                    <CachedImage src={"/images/logo-footer.png"} alt={"logo footer"} />
                                </div>
                            </Link>
                        </div>
                        <div style={{ alignSelf: 'center' }}>
                            <Link href={"http://online.gov.vn/Home/WebDetails/99075"}  passHref>
                                <a target="_blank"><img src={IconBCT.src} style={{ marginLeft: '-30px', height: '3.2em', paddingLeft: '15px' }} /></a>
                            </Link>
                        </div>
                    </div>
                    <div className={styles.company}>
                        <div className={styles.info}>
                            <ul>
                                <li>{contenValue?.title}</li>
                                <li>Mã số thuế: 0315570853 do Sở Kế Hoạch & Đầu Tư TP Hồ Chí Minh cấp ngày 18/03/2019</li>
                                <li>Địa chỉ: {contenValue?.address}</li>
                                <li>Mua hàng online: 
                                    <Link href={`tel:${replaceAll(contenValue?.hotLine, '.', '')}`} passHref>
                                        <span> {contenValue?.hotLine}{' '}(Phím 3)</span>
                                    </Link>    
                                </li>
                                <li>CSKH: 
                                    <Link href={`tel:${replaceAll(contenValue?.hotLine, '.', '')}`} passHref>
                                        <span> {contenValue?.phoneTakeCare }{' '}(Phím 9)</span>
                                    </Link>
                                </li>
                                <li>Góp ý khiếu nại: 
                                    <Link href={`tel:0333.79.11.11`} passHref>
                                        <span> 0333.79.11.11</span>
                                    </Link>
                                </li>
                                <li>Email: 
                                    <Link href={`mailto:cskh@vmshop.vn`} passHref>
                                        <span> cskh@vmshop.vn</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={styles.brand}>
                        <ul>
                            {brandData?.map((value: any, key: number) => (
                                <Link href={value?.link} key={key} passHref>
                                    <li>{value?.name}</li>
                                </Link>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.brand}>
                        <ul>
                            {supportData?.map((value: any, key: number) => (
                                <Link href={value?.link} key={key} passHref>
                                    <li>{value?.name}</li>
                                </Link>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.social}>
                        <div>
                            <div className={styles.title}>
                                <h3>Thanh toán</h3>
                            </div>
                            <ul>
                                <div>
                                    <li><img src={IconCOD.src} /></li>
                                </div>
                                <div>
                                    <li><img src={IconMomo.src} /></li>
                                </div>
                            </ul>
                        </div>
                        <div>
                            <div className={styles.titleCustom}>
                                <h3>Đơn vị vận chuyển</h3>
                            </div>
                            <ul>
                                <div>
                                    <li><img src={IconGHN.src} /></li>
                                </div>
                                <div>
                                    <li><img src={IconSPS.src} /></li>
                                </div>
                            </ul>
                        </div>
                    </div>
                    <div className={styles.social}>
                        <div>
                            <div className={styles.title}>
                                <h3>Kết nối với chúng tôi</h3>
                            </div>
                            <ul>
                                <div>
                                    <Link href={socialLink.facebook}>
                                        <a target="_blank"><li><IconFace /></li></a>
                                    </Link>
                                </div>
                                <div>
                                    <Link href={socialLink.instagram}>
                                        <a target="_blank"><li><IconIns /></li></a>
                                    </Link>
                                </div>
                                <div>
                                    <Link href={socialLink.tiktok}>
                                        <a target="_blank"><li><IconTikTok /></li></a>
                                    </Link>
                                </div>
                            </ul>
                        </div>
                        {/* <div>
                            <div className={styles.titleCustom} >
                                <h3>shopping</h3>
                            </div>
                            <ul>
                                <div onClick={()=>onPushLink(socialLink.shopee)}>
                                    <li><IconShopee /></li>
                                </div>
                                <div onClick={()=>onPushLink(socialLink.lazada)}>
                                    <li><IconLazada /></li>
                                </div>
                            </ul>
                        </div> */}
                    </div>
                </div>
            </div>
        </div >
    )
}
export default Footer;
