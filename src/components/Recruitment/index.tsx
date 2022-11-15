import React, { useState } from "react";
import Link from "next/link";

import { paths } from "@constants";

import CachedImage from "@@@CachedImage";
import Breadcrumbs from "@@@Breadcrumbs";

import styles from "./index.module.scss";
import classNames from "classnames";
import Button from "@components/Common/Form/Button";

const breadcrumbsData = [
    {
        label: "Trang chủ",
        url: "/",
        active: false,
    },
    {
        label: "Tuyển dụng",
        active: true,
    },
];

const data = [
    {
        name: "BỘ PHẬN KINH DOANH OFFLINE",
        content: `✅ Quản lý Cửa hàng: <a href="https://tinyurl.com/2p8ww6ju">https://tinyurl.com/2p8ww6ju</a><br />✅ Chuyên viên Giám sát Chuỗi cửa hàng: <a href="https://tinyurl.com/36kt9kr3">https://tinyurl.com/36kt9kr3</a><br />✅ Trưởng nhóm Trưng bày:`,
        image: "/images/recruitment/6.png",
    },
    {
        name: "BỘ PHẬN KINH DOANH Online",
        content: `✅ Nhân viên Sale Online: <a href="https://tinyurl.com/38fjuf2f">https://tinyurl.com/38fjuf2f</a><br />
        ✅ Nhân viên Sale sàn Lazada: <a href="https://tinyurl.com/mr487zrt">https://tinyurl.com/mr487zrt</a><br />
        ✅ Nhân viên Sale sàn Shopee: <a href="https://tinyurl.com/2p8fzvwv">https://tinyurl.com/2p8fzvwv</a><br />
        ✅ Nhân viên Sale sàn Tiktokshop: <a href="https://tinyurl.com/yc4v9b7e">https://tinyurl.com/yc4v9b7e</a><br />
        ✅ Nhân viên Vận hành Livestream: <a href="https://tinyurl.com/bddujahb">https://tinyurl.com/bddujahb</a> `,
        image: "/images/recruitment/7.png",
    },
    {
        name: "Bộ phận Chăm sóc khách hàng & Trải nghiệm khách hàng",
        content: `✅ Trưởng Bộ phận CSKH & Trải nghiệm khách hàng: <a href="https://tinyurl.com/2p98fdww">https://tinyurl.com/2p98fdww</a>`,
        image: "/images/recruitment/10.png",
    },
    {
        name: "BỘ PHẬN Marketing",
        content: `✅ Junior Marketing: <a href="https://tinyurl.com/5b7rxdc8">https://tinyurl.com/5b7rxdc8</a><br />
        ✅ Photographer: <a href="https://tinyurl.com/4n9spzh6">https://tinyurl.com/4n9spzh6</a>`,
        image: "/images/recruitment/8.png",
    },
    {
        name: "BỘ PHẬN Digital Marketing",
        content: `✅ Chuyên viên Facebook & E-commerce Ads: <a href="https://tinyurl.com/3v8tz6pa">https://tinyurl.com/3v8tz6pa</a>`,
        image: "/images/recruitment/9.png",
    },
    {
        name: "BỘ PHẬN Đào tạo & truyền thông nội bộ",
        content: `✅ Chuyên viên Đào tạo: <a href="https://tinyurl.com/nk95e8k8">https://tinyurl.com/nk95e8k8</a>`,
        image: "/images/recruitment/5.png",
    },
    {
        name: "Phòng hành chính - Nhân sự",
        content: `✅ Nhân viên Hành chính - Nhân sự: <a href="https://tinyurl.com/4jft9xjt">https://tinyurl.com/4jft9xjt</a>`,
        image: "/images/recruitment/1.png",
    },
    {
        name: "Phòng kế toán",
        content: `✅ Kế toán Đối soát: <a href="https://tinyurl.com/45548y7m">https://tinyurl.com/45548y7m</a><br />
        ✅ Kế toán Kiểm kê: <a href="https://tinyurl.com/mr4xwpey">https://tinyurl.com/mr4xwpey</a><br />
        ✅ Kế toán Kho: <a href="https://tinyurl.com/5aan58pz">https://tinyurl.com/5aan58pz</a><br />
        ✅ Kế toán Tổng hợp: <a href="https://tinyurl.com/yc6bcrrj">https://tinyurl.com/yc6bcrrj</a>`,
        image: "/images/recruitment/2.png",
    },
    {
        name: "Phòng công nghệ thông tin",
        content: `✅ Business Analyst (BA): <a href="https://tinyurl.com/bdeeeavy">https://tinyurl.com/bdeeeavy</a>`,
        image: "/images/recruitment/3.png",
    },
    {
        name: "Phòng phát triển sản phẩm",
        content: `✅ Nhân viên Thiết kế thời trang Nam: <a href="https://tinyurl.com/2afb4px4">https://tinyurl.com/2afb4px4</a><br />
        ✅ Nhân viên Thiết kế họa tiết: <a href="https://tinyurl.com/yckph5r7">https://tinyurl.com/yckph5r7</a>`,
        image: "/images/recruitment/4.png",
    },
];

const Recruitment = () => {
    const [load, setLoad] = useState<number>(3);

    const data1 = [...data];
    const data2 = [...data];
    const data3 = [...data];
    const data4 = [...data];

    return (
        <div className={styles.recruitment}>
            <Breadcrumbs breadcrumbs={breadcrumbsData} />
            <div className="container">
                <div className={styles.box}>
                    <div className={styles.title}>
                        <h3>GÓC TUYỂN DỤNG VM STYLE</h3>
                    </div>
                    <div className={styles.wrap}>
                        <div className={classNames(styles.big, styles.list)}>
                            <figure>
                                <CachedImage src={"/images/recruitment/recruitment.webp"} alt="" />
                            </figure>
                            <div className={styles.content}>
                                <h3>💥 CÁCH THỨC ỨNG TUYỂN:</h3>
                                <p>
                                    📧 Gửi CV ứng tuyển qua email: <span>tuyendung@vmshop.vn</span>{" "}
                                    với tiêu đề: Họ và tên - Vị trí ứng tuyển
                                </p>
                                <p>
                                    📞 Mọi thắc mắc vui lòng liên hệ: <span>0935.150.909</span> hoặc
                                    inbox fanpage VM STYLE TUYỂN DỤNG và VIỆC LÀM VM STYLE để được
                                    tư vấn và hỗ trợ
                                </p>
                            </div>
                            <article>
                                ❓ Bạn muốn làm việc trong môi trường trẻ trung và năng động?
                                <br />
                                ❓ Bạn muốn nhận được thu nhập tương xứng với năng lực của bản thân?
                                <br />❓ Bạn muốn có cơ hội thăng tiến rõ ràng trên lộ trình nghề
                                nghiệp?
                            </article>

                            <p>
                                👉 Vậy thì bạn còn chần chờ gì mà không ứng tuyển ngay các vị trí từ
                                VM STYLE!
                            </p>
                            <p>Cùng xem các vị trí VM STYLE đang tuyển dụng ngay bên dưới nhé 👇</p>
                        </div>
                        <div className={styles.small}>
                            {data1?.splice(0, 3)?.map((value: any, key: number) => (
                                <div key={key} className={styles.smallItem}>
                                    <figure>
                                        <CachedImage src={value?.image} alt={value?.name} />
                                    </figure>
                                    <div>
                                        <h3>{value?.name}</h3>
                                        <article
                                            dangerouslySetInnerHTML={{ __html: value.content }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.list}>
                        <div className={styles.title}>
                            <h3>Các Bài tuyển dụng khác</h3>
                        </div>
                        <div className={styles.listBox}>
                            {data2.splice(4, load).map((value, key) => (
                                <div
                                    className={classNames(styles.newsCol, styles.listCol)}
                                    key={key}
                                >
                                    <div className={styles.newsItem}>
                                        <div className={styles.img}>
                                            <figure>
                                                <CachedImage src={value.image} alt="recruitment" />
                                            </figure>
                                        </div>
                                        <div className={styles.text}>
                                            <h3>{value.name}</h3>

                                            <article
                                                dangerouslySetInnerHTML={{ __html: value.content }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {data3.splice(4, load).length < data4.splice(4, data4.length).length && (
                            <div className={styles.btn}>
                                <Button onClick={() => setLoad(load + 6)}>Xem thêm</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recruitment;
