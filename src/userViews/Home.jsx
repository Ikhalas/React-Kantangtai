import React from "react";
import Header from './Header'
import FormFirld from './FormFirld'
import Credit from './Credit'
import 'assets/demo/home.css'

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
                <Header/>
                <div id="main" className="regular-th">
                    <div id="content">
                        <section>
                            <div className="container">
                                <h2 style={{color:'#66615b'}}>ยื่นคำร้องขอรับน้ำสะอาดเพื่อการอุปโภค-บริโภค</h2>
                                
                                <p>
                                    <span style={{fontSize:'25px', fontWeight:'bold'}}>รายละเอียดและเงื่อนไข</span> <br/>
                                    Aww, it's true. I've been hiding it for so long. Perhaps, but
                                    perhaps your civilization is merely the sewer of an even
                                    greater society above you! You guys go on without me! I'm
                                    going to go… look for more stuff to steal! When I was first
                                    asked to make a film about my nephew, Hubert Farnsworth, I
                                    thought "Why should I?" Then later, Leela made the film. But
                                    if I did make it, you can bet there would have been more
                                    topless women on motorcycles. Roll film! So I really am
                                    important? How I feel when I'm drunk is correct? Is the Space
                                    Pope reptilian!?
                                </p>
                                <p>Bacon atball corned beef strip steak andouille.</p>
                            </div>
                        </section>
                        <section className="color">
                            <div className="container">
                                <FormFirld/>
                            </div>
                           
                 
                        </section>
                        
                    </div>
                </div>
                <Credit/>
            </div>
        );
    }
}
