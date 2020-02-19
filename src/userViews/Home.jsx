import React from "react";
import '../assets/demo/home.css'
import { Link, withRouter } from 'react-router-dom';

export default class Home extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            
        }
    }
   
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
                <header id="js-header">
                    <div className="container clearfix">
                        <h1 id="logo">
                            <img id="logo-img" src={require('../assets/img/logo.png')} />
                            <img id="logo-name-1" src={require('../assets/img/SAO-logo.png')} />
                            <img id="logo-name-2" src={require('../assets/img/SAO-logo-2.png')} />
                        </h1>
                        <nav className="regular-th" style={{fontSize: '25px'}}>
                            <a href="#">หน้าหลัก</a>
                            <a href="https://www.kantangtai.go.th/index.php" target="_blank">เว็บไซต์หลัก</a>
                            <Link to="/login">ลงชื่อเข้าใช้</Link>  
                        </nav>
                    </div>
                </header>

                <div id="main" className="regular-th">
                    <div id="content">
                        <section>
                            <div className="container">
                                <h1>อธิบายรายละเอียด บราๆๆๆ ....</h1>
                                <p>
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
                                <h3>แบบฟอร์มขอรับน้ำสะอาดเพื่ออุปโภคและบริโภค</h3>
                                
                                <p>
                                    Bender, you risked your life to save me! Good news, everyone!
                                    I've taught the toaster to feel love! I can explain. It's very
                                    valuable. Can we have Bender Burgers again? For the last time,
                                    I don't like lilacs! Your 'first' wife was the one who liked
                                    lilacs! You seem malnourished. Are you suffering from
                                    intestinal parasites? Say what? Now, now. Perfectly
                                    symmetrical violence never solved anything. Eeeee! Now say
                                    "nuclear wessels"! Ugh, it's filthy! Why not create a National
                                    Endowment for Strip Clubs while we're at it? I suppose I could
                                    part with 'one' and still be feared… Noooooo! Have you ever
                                    tried just turning off the TV, sitting down with your
                                    children, and hitting them? Isn't it true that you have been
                                    paid for your testimony? All I want is to be a monkey of
                                    moderate intelligence who wears a suit… that's why I'm
                                    transferring to business school! We'll need to have a look
                                    inside you with this camera. Really?!
                                </p>
                                <p>Bacon ipsum dolor sit amet pig biltong filet mignon, kiel</p>
                            </div>
                        </section>
                        
                    </div>
                </div>
                <footer>
                    <div className="container clearfix">
                        <div className="col" id="col-1">
                            <ul>
                                <li>APPLES</li>
                                <li>
                                    <a href="#0">Home</a>
                                </li>
                                <li>
                                    <a href="#0">Services</a>
                                </li>
                                <li>
                                    <a href="#0">Contact</a>
                                </li>
                                <li>
                                    <a href="#0">Sitemap</a>
                                </li>
                            </ul>
                        </div>
                        <div className="col" id="col-2">
                            <ul>
                                <li>SOCIAL</li>
                                <li>
                                    <a href="#0">Facebook</a>
                                </li>
                                <li>
                                    <a href="#0">Twitter</a>
                                </li>
                                <li>
                                    <a href="#0">LinkedIn</a>
                                </li>
                            </ul>
                        </div>
                        <div className="col" id="col-3">
                            <ul>
                                <li>SERVICES</li>
                                <li>
                                    <a href="#0">Bacon</a>
                                </li>
                                <li>
                                    <a href="#0">Sausage Services</a>
                                </li>
                                <li>
                                    <a href="#0">Cheese</a>
                                </li>
                                <li>
                                    <a href="#0">Cider Apples</a>
                                </li>
                            </ul>
                        </div>
                        <div id="copy">
                            &#xa9; Designed and built by{" "}
                            <a href="https://twitter.com/lilianakastilio">@liianakastilio</a>{" "}
                            2013 - 2014
            </div>
                    </div>
                </footer>
            </div>
        );
    }
}
