import React, { createRef } from "react";
import '../assets/demo/home.css'

import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import InputMask from 'react-input-mask'
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    FormGroup,
    Form,
    Input,
    Row,
    Col
} from "reactstrap";

class FormFirld extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            lastname: '',
            id: '',
            tel: '',
            email: '',
            address: '',
            note: '',
            toggleMap: false,
            markers: [{
                name: "Current position",
                position: { lat: 7.3563906, lng: 99.5197931 }
            }],
            nameCheck: '',
            lastnameCheck: '',
            addressCheck: '',
            idCheck: '',
            telCheck: ''
        }
        this.currentPosition = { lat: 7.3563906, lng: 99.5197931 }
        this.scrollDiv = createRef();
    }


    onFormSubmit(e) {
        e.preventDefault()

        if (!this.state.toggleMap) {
            this.currentPosition.lat = 0
            this.currentPosition.lng = 0
        }

        //console.log("id |" + this.state.id.replace(/[_-]/g, '').length)
        //console.log("tel |" + this.state.tel.replace(/[_-]/g, '').length)
        if (this.state.name.length === 0) {
            this.setState({ nameCheck: false })
        }

        if (this.state.lastname.length === 0) {
            this.setState({ lastnameCheck: false }) 
        }

        if (this.state.address.length === 0) {
            this.setState({ addressCheck: false }) 
        }

        if (this.state.id.length === 0) {
            this.setState({ idCheck: false })
        }

        if (this.state.tel.length === 0) {
            this.setState({ telCheck: false }) 
        }


        const newValue = {
            "name": this.state.name,
            "lastname": this.state.lastname,
            "id": this.state.id,
            "tel": this.state.tel,
            "email": this.state.email,
            "address": this.state.address,
            "location": this.state.toggleMap,
            "lat": this.currentPosition.lat,
            "lng": this.currentPosition.lng,
            "date": this.getCurrentDate()
        }

        console.log(this.state.nameCheck)
        console.log(this.state.lastnameCheck)
        console.log(this.state.addressCheck)
        console.log(this.state.idCheck)
        console.log(this.state.telCheck)

        if (this.state.nameCheck && this.state.lastnameCheck && this.state.addressCheck && this.state.idCheck && this.state.telCheck) {
            console.log(newValue)
        }
        else {
            console.log("shit")
            this.scrollDiv.current.scrollIntoView({ behavior: 'smooth' });
        }

    }

    getCurrentDate() {
        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear() + 543;
        return `${date}/${month < 10 ? `0${month}` : `${month}`}/${year}`
    }

    onNameChange = (e) => {
        this.setState({ name: e.target.value })
        //console.log(e.target.value.length)
        if (e.target.value.length === 0) {
            this.setState({ nameCheck: false })
        } else {
            this.setState({ nameCheck: true })
        }
    }

    onLastnameChange = (e) => {
        this.setState({ lastname: e.target.value })
        //console.log(e.target.value)
        if (e.target.value.length === 0) {
            this.setState({ lastnameCheck: false })
        } else {
            this.setState({ lastnameCheck: true })
        }
    }

    onAddressChange = (e) => {
        this.setState({ address: e.target.value })
        //console.log(e.target.value)
        if (e.target.value.length === 0) {
            this.setState({ addressCheck: false })
        } else {
            this.setState({ addressCheck: true })
        }
    }

    onIdChange = (e) => {
        this.setState({ id: e.target.value })
        //console.log((e.target.value.replace(/[_-]/g, '').length) +"|"+ this.state.id)
        if (e.target.value.replace(/[_-]/g, '').length >= 13) {
            this.setState({ idCheck: true })
            //console.log("if |" + this.state.idCheck)
        } else {
            this.setState({ idCheck: false })
            //console.log("else |" + this.state.idCheck)
        }
    }

    onTelChange = (e) => {
        this.setState({ tel: e.target.value })
        //console.log((this.state.tel.replace(/[_-]/g, '').length + 1) +"|"+ this.state.tel)
        if (e.target.value.replace(/[_-]/g, '').length >= 10) {
            this.setState({ telCheck: true })
            //console.log(this.state.telCheck)
        } else {
            this.setState({ telCheck: false })
            this.scrollDiv.current.scrollIntoView({ behavior: 'smooth' });
            //console.log(this.state.telCheck)
        }
    }

    onMarkerClick = (props, marker, e) => {
        const position = marker.getPosition();
        var lat = position.lat()
        var lng = position.lng()
        this.currentPosition = { lat: lat, lng: lng }

        console.log(this.currentPosition)
    }

    onMouseoverMarker = (props, marker, e) => {
        const position = marker.getPosition();
        var lat = position.lat()
        var lng = position.lng()
        this.currentPosition = { lat: lat, lng: lng }

        //console.log(this.currentPosition)
    }

    onMarkerDragEnd = (coord, index) => {
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();

        this.setState(prevState => {
            const markers = [...this.state.markers];
            markers[index] = { ...markers[index], position: { lat, lng } };
            return { markers };
        });
    };

    render() {
        return (
            <div ref={this.scrollDiv}>
                <Col md="12">
                    <Card className="card-user">
                        <CardHeader>
                            <CardTitle tag="h3">แบบฟอร์มขอรับน้ำสะอาดเพื่ออุปโภคและบริโภค</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Form onSubmit={this.onFormSubmit.bind(this)}>
                                <Row>
                                    <Col className="pr-1" md="6" sm="12">
                                        <FormGroup>
                                            <label style={{ fontSize: "23px", color: "black" }}>ชื่อ</label>
                                            <Input
                                                type="text"
                                                className="regular-th"
                                                style={{ fontSize: "23px" }}
                                                name="name"
                                                value={this.state.name}
                                                onChange={this.onNameChange.bind(this)}

                                            />
                                        </FormGroup>
                                        {this.state.nameCheck === false ?
                                            <span style={{ fontSize: '18px', color: 'red' }}>
                                                <i className="nc-icon nc-alert-circle-i" style={{ fontSize: "14px" }}></i>
                                                &nbsp;กรุณากรอกชื่อของท่านให้ครบถ้วน
                                            </span>
                                            : null
                                        }
                                    </Col>
                                    <Col className="pl-1" md="6" sm="12">
                                        <FormGroup>
                                            <label style={{ fontSize: "23px", color: "black" }}>นามสกุล</label>
                                            <Input
                                                type="text"
                                                style={{ fontSize: "23px" }}
                                                className="regular-th"
                                                name="lastname"
                                                onChange={this.onLastnameChange.bind(this)}

                                            />
                                        </FormGroup>
                                        {this.state.lastnameCheck === false ?
                                            <span style={{ fontSize: '18px', color: 'red' }}>
                                                <i className="nc-icon nc-alert-circle-i" style={{ fontSize: "14px" }}></i>
                                                &nbsp;กรุณากรอกนามสกุลของท่านให้ครบถ้วน
                                            </span>
                                            : null
                                        }
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="pr-1" md="5" sm="12">
                                        <FormGroup>
                                            <label style={{ fontSize: "23px", color: "black" }}>เลขประจำตัวประชาชน</label>
                                            <br />
                                            <InputMask
                                                type="text"
                                                mask="9-9999-99999-99-9"
                                                className="regular-th"
                                                style={{ fontSize: "23px", color: '#6e6a64', width: "100%", height: '52.5px', border: '1px solid #dddddd', borderRadius: '4px', paddingLeft: '10px' }}
                                                name="id"
                                                onChange={this.onIdChange.bind(this)}

                                            />
                                        </FormGroup>
                                        {this.state.idCheck === false ?
                                            <span style={{ fontSize: '18px', color: 'red' }}>
                                                <i className="nc-icon nc-alert-circle-i" style={{ fontSize: "14px" }}></i>
                                                &nbsp;กรุณากรอกเลขประจำตัวประชาชนให้ครบถ้วน
                                            </span>
                                            : null
                                        }
                                    </Col>

                                    <Col className="px-1" md="3" sm="12">
                                        <FormGroup>
                                            <label style={{ fontSize: "23px", color: "black" }}>เบอร์โทรติดต่อ</label>
                                            <InputMask
                                                type="text"
                                                mask="999-999-9999"
                                                className="regular-th"
                                                style={{ fontSize: "23px", color: '#6e6a64', width: "100%", height: '52.5px', border: '1px solid #dddddd', borderRadius: '4px', paddingLeft: '10px' }}
                                                name="tel"
                                                onChange={this.onTelChange.bind(this)}

                                            />
                                        </FormGroup>
                                        {this.state.telCheck === false ?
                                            <span style={{ fontSize: '18px', color: 'red' }}>
                                                <i className="nc-icon nc-alert-circle-i" style={{ fontSize: "14px" }}></i>
                                                &nbsp;กรุณากรอกเบอร์โทรติดต่อให้ครบถ้วน
                                            </span>
                                            : null
                                        }
                                    </Col>
                                    <Col className="pl-1" md="4" sm="12">
                                        <FormGroup>
                                            <label htmlFor="exampleInputEmail1" style={{ fontSize: "23px", color: "black" }}>
                                                อีเมลติดต่อ (ถ้ามี)
                                            </label>
                                            <Input
                                                type="email"
                                                style={{ fontSize: "23px" }}
                                                className="regular-th"
                                                name="email"
                                                onChange={e => this.setState({ email: e.target.value })}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="12">
                                        <FormGroup>
                                            <label style={{ fontSize: "23px", color: "black" }}>ที่อยู่</label>
                                            <Input
                                                className="regular-th"
                                                style={{ fontSize: "23px" }}
                                                type="text"
                                                name="address"
                                                onChange={this.onAddressChange.bind(this)}

                                            />
                                        </FormGroup>
                                        {this.state.addressCheck === false ?
                                            <span style={{ fontSize: '18px', color: 'red' }}>
                                                <i className="nc-icon nc-alert-circle-i" style={{ fontSize: "14px" }}></i>
                                                &nbsp;กรุณากรอกที่อยู่ของท่านให้ครบถ้วน</span>
                                            : null
                                        }
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="pr-1" md="4" sm="12">
                                        <FormGroup>
                                            <label style={{ fontSize: "23px", color: "black" }}>ตำบล</label>
                                            <Input
                                                disabled
                                                className="regular-th"
                                                style={{ fontSize: "23px" }}
                                                defaultValue="กันตังใต้"
                                                type="text"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col className="px-1" md="4" sm="12">
                                        <FormGroup>
                                            <label style={{ fontSize: "23px", color: "black" }}>อำเภอ</label>
                                            <Input
                                                disabled
                                                className="regular-th"
                                                style={{ fontSize: "23px" }}
                                                defaultValue="กันตัง"
                                                type="text"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col className="pl-1" md="4" sm="12">
                                        <FormGroup>
                                            <label style={{ fontSize: "23px", color: "black" }}>จังหวัด</label>
                                            <Input
                                                disabled
                                                className="regular-th"
                                                style={{ fontSize: "23px" }}
                                                defaultValue="ตรัง"
                                                type="text"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="pl-1" md="12" sm="12">
                                        <div style={{ textAlign: "center" }}>
                                            <Button
                                                className="regular-th btn-round"
                                                style={{ fontWeight: 'normal', fontSize: "23px" }}
                                                outline color={this.state.toggleMap === false ? "info" : "danger"}
                                                size="sm"
                                                onClick={() => this.setState({ toggleMap: !this.state.toggleMap })}
                                            >
                                                {this.state.toggleMap === false ? "ระบุที่อยู่เพิ่มเติมบน Google Map" : "ปิด Google Map"}
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>

                                {this.state.toggleMap &&
                                    <Row>
                                        <Col md="12">
                                            <label style={{ fontSize: "23px", color: "black" }}>
                                                ระบุตำแหน่งที่อยู่ของท่านบน Google Map
                                                <p style={{ fontSize: "20px" }}>" โดยการเลื่อน<span style={{ color: '#fd5559' }}><i className="nc-icon nc-pin-3"></i>หมุดสีแดง</span> ให้ตรงกับบริเวณบ้านของท่าน เพื่อความสะดวกของเจ้าหน้าที่ในการค้นหาตำแหน่งที่อยู่ของท่าน "</p>
                                            </label>
                                            <Map
                                                google={this.props.google}
                                                style={{
                                                    width: "96%",
                                                    height: "500px",
                                                }}
                                                zoom={16}
                                                initialCenter={{ lat: 7.3563906, lng: 99.5197931 }}
                                                onClick={this.handleMapClick}
                                            >
                                                {this.state.markers.map((marker, index) => (
                                                    <Marker
                                                        key={Math.random()}
                                                        position={marker.position}
                                                        draggable={true}
                                                        onDragend={(t, map, coord) => this.onMarkerDragEnd(coord, index)}
                                                        name={marker.name}

                                                        onClick={this.onMarkerClick}
                                                        onMouseover={this.onMouseoverMarker}
                                                    />
                                                ))}
                                            </Map >

                                            <div style={{ marginTop: "510px" }}>
                                                <p >ตำแหน่ง : [ {this.currentPosition.lat + " " + this.currentPosition.lng} ]</p>
                                            </div>
                                        </Col>
                                    </Row>
                                }

                                <Row>
                                    <Col md="12">
                                        <FormGroup>
                                            <label style={{ fontSize: "23px", color: "black" }}>รายละเอียดเพิ่มเติม (ถ้ามี)</label>
                                            <Input
                                                className="regular-th"
                                                style={{ fontSize: "23px" }}
                                                type="textarea"
                                                name="note"
                                                onChange={e => this.setState({ note: e.target.value })}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <div className="update ml-auto mr-auto">
                                        <Button
                                            className="btn-round"
                                            color="primary"
                                            type="submit"
                                        >
                                            <span className="regular-th" style={{ fontSize: "25px", fontWeight: 'normal' }}>
                                                &nbsp;&nbsp;&nbsp;&nbsp;ยื&nbsp;น&nbsp;ยั&nbsp;น&nbsp;&nbsp;&nbsp;&nbsp;
                                            </span>
                                        </Button>
                                    </div>
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: ('')
})(FormFirld)