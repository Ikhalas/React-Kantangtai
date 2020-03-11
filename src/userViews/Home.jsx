import React from "react";
import Header from "./Header";
import FormFirld from "./FormFirld";
import Credit from "./Credit";
import "assets/demo/home.css";

export default class Home extends React.Component {
  componentDidMount() {
    window.addEventListener("scroll", this.resizeHeaderOnScroll);
  }
  resizeHeaderOnScroll() {
    const distanceY = window.pageYOffset || document.documentElement.scrollTop,
      shrinkOn = 200,
      headerEl = document.getElementById("js-header");

    if (distanceY > shrinkOn) {
      headerEl && headerEl.classList.add("smaller");
    } else {
      headerEl && headerEl.classList.remove("smaller");
    }
  }
  render() {
    return (
      <div id="wrapper">
        <Header />
        <div id="main" className="regular-th">
          <div id="content">
            <section>
              <div className="container">
                <h2 style={{ color: "#66615b" }}>
                  ยื่นคำร้องขอรับน้ำสะอาดเพื่อการอุปโภค-บริโภค
                </h2>
                <hr />
                <p style={{ fontSize: "23px" }}>
                  <span style={{ fontSize: "25px", fontWeight: "bold" }}>
                    รายละเอียดและเงื่อนไข
                  </span>{" "}
                  <br />
                  1. ท่านต้องมีภูมิลำเนาอยู่ตำบลกันตังใต้
                  ในเขตรับผิดชอบขององค์การบริหารส่วนตำบลกันตังใต้ อำเภอกันตัง
                  จังหวัดตรัง <br />
                  2. กรอกข้อมูลที่จำเป็นให้ถูกต้องและครบถ้วน <br />
                  3. รอการติดต่อกลับจากเจ้าหน้าที่ภายใน 1-2 สัปดาห์
                </p>

                <p style={{ fontSize: "21px" }}>
                 
                  ติดต่อสอบถาม :{" "}
                  <b style={{ fontSize: "23px", fontWeight: "bold" }}>
                    0-7520-4625
                  </b>
                </p>
              </div>
            </section>
            <section className="color">
              <div className="container">
                <FormFirld />
              </div>
            </section>
          </div>
        </div>
        <Credit />
      </div>
    );
  }
}
