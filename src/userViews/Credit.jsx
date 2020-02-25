import React from "react";
import { Link } from 'react-router-dom';
import 'assets/demo/home.css'

export default class Credit extends React.Component {
    render() {
        return (
            <footer className="regular-th">
                <div className="container clearfix">
                    <div className="col" id="col-1">
                        <ul>
                            <li>อบต.กันตังใต้</li>                        
                            <li>
                                <a href="https://www.kantangtai.go.th/index.php" target="_blank" rel="noopener noreferrer">เว็บไซต์หลัก</a>
                            </li>
                            <li>
                                <Link to="/login">สำหรับเจ้าหน้าที่</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col" id="col-2">
                        <ul>
                            <li>ติดต่อผู้ดูแลระบบ</li>
                            <li>
                                <a href="https://www.facebook.com/iinut.kantangtaicassic" target="_blank" rel="noopener noreferrer">Facebook</a>
                            </li>
                            <li>
                                <a href="https://www.facebook.com/iinut.kantangtaicassic" target="_blank" rel="noopener noreferrer">Line</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col" id="col-3">
                        <ul>
                            <li>บริการอื่น ๆ</li>
                            <li>
                                <a href="https://www.kantangtai.go.th/news.php?cat_id=2" target="_blank" rel="noopener noreferrer">ข่าวประชาสัมพันธ์</a>
                            </li>
                            <li>
                                <a href="https://kantangtai.go.th/contact/view.php" target="_blank" rel="noopener noreferrer">ติดต่อสอบถาม</a>
                            </li>
                        </ul>
                    </div>
                    <div id="copy">
                        &#xa9; ออกแบบและพัฒนาโดย{" "}
                        <a href="https://www.facebook.com/iinut.kantangtaicassic" target="_blank" rel="noopener noreferrer">นายกันตภณ จำนงค์ทอง</a>{" "}
                        2019 - 2020
                        <p style={{fontSize:"30px"}}>นักศึกษาระดับ ปวส.2 สาขาคอมพิวเตอร์ธุรกิจ วิทยาลัยอาชีวศึกษาโปลีเทคนิคตรัง</p>
                    </div>
                </div>
            </footer>
        )
    }
}