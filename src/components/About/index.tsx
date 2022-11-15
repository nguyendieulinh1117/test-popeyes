import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { useSelectorTyped } from "@hooks/useSelectorType";
import { paths } from "@constants";

import CachedImage from "@@@CachedImage";
import Breadcrumbs from "@@@Breadcrumbs";

import styles from "./index.module.scss";

const breadcrumbsData = [
    {
        label: "Trang chủ",
        url: "/",
        active: false,
    },
    {
        label: "Về chúng tôi",
        active: true,
    },
];

const About = () => {

    return (
        <div className={styles.about}>
            <Breadcrumbs breadcrumbs={breadcrumbsData} />
            <div className="container">
                <div className={styles.box}>
                    <div className={styles.title}>
                        <h3>FMSTYLE SAIGON ĐỔI THÀNH VM STYLE </h3>
                    </div>
                    <div className={styles.content}>
                        <article>Sau 6 năm hoạt động trong lĩnh vực thời trang, với mong muốn mang đến cho khách hàng những sản phẩm chất lượng hơn, thương hiệu FMStyle SaiGon chính thức đổi tên thành VM STYLE vào ngày 01/12/2021</article>
                        <figure> <CachedImage src="/images/about/content-1.webp" alt="about" /> </figure>
                        <h3>1. Giới thiệu về thương hiệu VM STYLE</h3>
                        <article>
                            VM STYLE trước đây là FMStyle Saigon - một trong những thương hiệu thời trang được giới trẻ yêu thích nhất hiện nay. Sau 6 năm hình thành và phát triển, ngày 01/12 thương hiệu FMSTyle SaiGon sẽ chính thức đổi tên thành VM STYLE. Từ một cửa hàng nhỏ tại quận Tân Bình cho đến hiện tại với 24 chi nhánh ở TP HCM, các tỉnh Đông Nam Bộ và miền Tây; VM STYLE tự hào khi đã có mặt tại các tuyến phố thời trang lớn của các tỉnh thành như TP.HCM (Nguyễn Trãi, Quang Trung, Lê Văn Sỹ, Sư Vạn Hạnh,…..), Cần Thơ, Vũng Tàu, Kiên Giang, Long Xuyên, Bình Dương, Phan Thiết….
                            <br />
                            <br />
                            Hiện nay, VM STYLE đã có những kênh thương mại như Facebook, Instagram, và Website riêng để phục vụ cho khách hàng có nhu cầu mua sắm online nhanh nhất.
                        </article>
                        <h3>2. Thương hiệu thời trang VM STYLE luôn được khách hàng yêu thích và tin tưởng</h3>
                        <article>
                            Ngay từ khi ra đời VM STYLE đã nhận được sự chào đón, ủng hộ và đồng hành của đông đảo các bạn trẻ. Xuất phát từ mong muốn mang lại một nơi mua sắm đáp ứng được nhu cầu của khách hàng, về sự đa dạng sản phẩm, chất lượng dịch vụ tốt và bên cạnh đó giá cả phải phù hợp. Những năm gần đây, thị trường thời trang trong nước bị ảnh hưởng nhiều bởi những thương hiệu nổi tiếng nước ngoài và các sàn thương mại điện tử, nhưng VM STYLE vẫn phát triển vô cùng mạnh mẽ, bởi VM STYLE luôn bám sát những mục tiêu ban đầu của mình cùng với việc cải tiến không ngừng để nâng cao chất lượng sản phẩm và dịch vụ.
                            <br />
                            <br />
                            Hiện tại, tất cả các cửa hàng của VM STYLE đang được nâng cấp về không gian mua sắm. Chúng ta có thể nhìn thấy rõ ở tất cả các chi nhánh của VM STYLE cực kỳ rộng rãi, thoáng mát, nằm ngay các tuyến phố trung tâm và rải đều tất cả các quận tạo sự thuận tiện cho việc đi lại.
                            <br />
                            <br />
                            Sản phẩm bày bán ở cửa hàng được nghiên cứu kỹ lưỡng về trend, tính ứng dụng, mùa vụ, luôn cập nhập xu hướng mới nhất, đa dạng nhất, mang màu sắc trẻ trung, năng động và đầy cá tính cho các bạn trẻ Việt.
                            <br />
                            <br />
                            Song song với việc phát triển hàng hoá, VM STYLE thường xuyên tung ra các chương trình khuyến mãi cũng như chính sách hậu mãi cho khách hàng, thẻ thành viên và chính sách đổi trả hàng linh hoạt. Đặc biệt, VM STYLE rất chú trọng trong việc đầu tư hình ảnh, với mong muốn mang đến cho các khách hàng cái nhìn chân thật và khách quan nhất về sản phẩm, từ đó có thể đưa ra những lựa chọn chính xác và phù hợp nhất với nhu cầu của mình. Trải qua hơn 6 năm, đi qua rất nhiều cột mốc quan trọng, VM STYLE đã luôn chứng tỏ được mình và trở thành một thương hiệu được đông đảo các bạn trẻ lựa chọn.
                        </article>
                        <figure> <CachedImage src="/images/about/content-2.webp" alt="about" /> </figure>
                        <h3>3. Lý do FMStyle Saigon đổi tên thành VM STYLE</h3>
                        <article>Đại dịch vẫn đang diễn ra, chúng ta có nhiều sự lựa chọn khác nhau để bảo vệ và phát triển doanh nghiệp của mình. VM STYLE mong muốn mang đến cho tất cả khách hàng một thông điệp về Sự Thay Đổi để thích nghi với "Bình Thường Mới" đó là một sức khỏe tốt, một tinh thần tốt và một lối sống tích cực nhất. Đại dịch giúp chúng ta nhìn ra những khó khăn, thử thách và cả nhưng cơ hội cho chính mình, vì vậy VM STYLE chọn một nhận diện mới để khẳng định lại thương hiệu; VM STYLE cam kết sẽ mang lại cho khách hàng một trải nghiệm tốt nhất về sản phẩm và dịch vụ, đó cũng chính là mục tiêu cho sự thay đổi lần này. Đối với VM STYLE, thời trang không chỉ là bộ quần áo bạn mặc trên người, mà nó còn thể hiện phong cách sống của bạn. </article>
                        <figure> <CachedImage src="/images/about/content-3.webp" alt="about" /> </figure>
                        <article>
                            Logo thương hiệu là sự kết hợp giữa hai từ V và M với ý nghĩa tự hào thương hiệu Việt : V là đầu và M là cuối của cụm từ Việt Nam. Với mong muốn mang đến cho khách hàng những trải nghiệm tốt nhất về chất lượng sản phẩm và dịch vụ, VM STYLE luôn chào đón và đồng hành cùng quý khách hàng trên mọi chặng đường phía trước.
                            <br />
                            <br />
                            Đây cũng chính là lời khẳng định mạnh mẽ trong chiến dịch làn này "THE NEW ME - TÔI THAY ĐỔI, BẠN THÌ SAO" – thay đổi để phát triển hơn và mạnh mẽ hơn.
                        </article>
                        <figure> <CachedImage src="/images/about/content-4.webp" alt="about" /></figure>
                        <h3>4. Quyền lợi của khách hàng</h3>
                        <article>Quyền lợi của khách hàng vẫn được giữ nguyên: khách hàng sẽ không cần phải đăng ký lại thẻ thành viên cũng như toàn bộ số điểm đã và đang tích lũy sẽ được bảo toàn tối đa. Trong thời gian tới, VM STYLE đang từng bước nâng cao chất lượng sản phẩm, dịch vụ cùng nhiều ưu đãi hấp dẫn đi kèm, hướng đến nhiều lợi ích cho khách hàng hơn khi mua sắm tại các chuỗi hệ thống.</article>
                        <figure> <CachedImage src="/images/about/content-5.webp" alt="about" /></figure>
                        <article>Cùng với việc đổi tên và nhận diện thương hiệu, VM STYLE sẽ mang tới nhiều ưu đãi lên đến 70% từ ngày 01.12, áp dụng toàn bộ 24 hệ thống trực thuộc. Đối với các khu vực còn ảnh hưởng của dịch covid-19 sẽ được áp dụng giao hàng tận nơi. Chương trình này cũng như lời cảm ơn, tri ân dành cho khách hàng vì đã luôn quan tâm và tin tưởng VM STYLE khi còn là FMStyle Saigon. </article>
                        <br />
                        <br />
                        <label >CHƯƠNG TRÌNH KHUYẾN MÃI CỦA CHÚNG TÔI </label>
                        <br />
                        <h3>1. MUA CÀNG NHIỀU - GIẢM CÀNG SÂU</h3>
                        <p>- Đánh dấu cột mốc quan trọng trong lần thay đổi, sale sôi nổi toàn bộ 24 chi nhánh cửa hàng</p>
                        <ul>
                            <li>Giảm <span>20%</span> SP thứ 2 có giá thấp nhất</li>
                            <li>Giảm <span>50%</span> SP thứ 3 có giá thấp nhất</li>
                            <li>Giảm <span>70%</span> SP thứ 4 có giá thấp nhất</li>
                        </ul>
                        <p>- Hơn 4000 sản phẩm được bán với giá sốc chỉ <span>9K</span></p>
                        <figure> <CachedImage src="/images/about/content-6.webp" alt="about" /></figure>
                        <h3>2. TẶNG QUÀ VỚI HÓA ĐƠN TỪ 299K</h3>

                        <article>Với hóa đơn từ 299k, bạn sẽ nhận ngay lượt bốc thăm trúng các phần quà hấp dẫn</article>
                        <ul>
                            <li>Voucher mua hàng trị giá <span>50k</span></li>
                            <li>Nón thương hiệu <b>VM - The New Me</b></li>
                            <li>Túi tote thương hiệu <b>VM - The New Me</b></li>
                        </ul>
                        <article>Với hóa đơn từ 499k, bạn sẽ nhận ngay lượt buốc thăm trúng các phần quà hấp dẫn</article>
                        <ul>
                            <li>Voucher mua hàng trị giá <span>100k</span></li>
                            <li>Bộ quà tặng túi tote + nón thương hiệu <b>VM - The New Me</b></li>
                            <li>Áo thun thương hiệu <b>VM - The New Me</b></li>
                        </ul>
                        <figure> <CachedImage src="/images/about/content-7.webp" alt="about" /></figure>
                        <h3>3. BÃO HÀNG MỚI - ĐÓN NOEL</h3>
                        <ul>
                            <li> Hơn <span>10.000</span> sản phẩm bán đồng giá chỉ từ <span>49K</span> </li>
                            <li>Hàng mới về liên tục, váy đầm, áo kiểu, áo len, áo khoác,... bán giá cực ưu đãi </li>
                        </ul>
                        <br />
                        <br />
                        <label >
                            <Link href={paths?.store} passHref>
                                HỆ THỐNG CỬA HÀNG CỦA CHÚNG TÔI
                            </Link>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
