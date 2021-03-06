import React, { Component } from 'react';

interface MyState {
    currentColor: ColorData;
    toggle: boolean;
    clickedOutside: boolean;
    prevColorsArr: ColorData[];
}

interface ColorData {
    Red: number;
    Green: number;
    Blue: number;
    Sat: number;
    Hue: number;
    Bright: number,
    Alpha: number;
    Hex: string;
    [key: string]: string | any;
}

interface MyProps {
    data: {
        r: number,
        g: number,
        b: number,
        a: number,
        id: number,
        display: string
    };
    prevColors: any;
}


class ColorBox extends Component<MyProps, MyState>{
    myCan = React.createRef<HTMLCanvasElement>();
    myCan2 = React.createRef<HTMLCanvasElement>();
    constructor(props: MyProps) {
        super(props);
        this.state = {
            toggle: false,
            currentColor: {
                Red: props.data.r,
                Green: props.data.g,
                Blue: props.data.b,
                Alpha: 1,
                Sat: this.rgbToHSB(props.data.r, props.data.g, props.data.b).Sat,
                Hue: this.rgbToHSB(props.data.r, props.data.g, props.data.b).Hue,
                Bright: this.rgbToHSB(props.data.r, props.data.g, props.data.b).Bright,
                Hex: this.rgbToHex(props.data.r, props.data.g, props.data.b)
            },
            clickedOutside: false,
            prevColorsArr: this.props.prevColors
        }
    }
    myRef: any = React.createRef();
    componentDidUpdate() {

    }
    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
        let c: any = this.myCan.current;
        let c2: any = this.myCan2.current;
        c.width = 200;
        c.height = 100;
        c2.width = 200;
        c2.height = 100;
        const ctx: any = c.getContext("2d");
        let grad = ctx.createLinearGradient(10, 10, 195, 0);
        grad.addColorStop(0, "black");
        grad.addColorStop(0.5, this.state.currentColor.Hex);
        grad.addColorStop(1, "white");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 200, 150);
    }
    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }
    handleClickOutside = (e: any) => {
        if (this.myRef.current != null)
            if (!this.myRef.current.contains(e.target)) {
                this.setState({ clickedOutside: true, toggle: false });
            }
    };
    getProp = (): ColorData => {
        return {
            Red: this.props.data.r,
            Green: this.props.data.g,
            Blue: this.props.data.b,
            Alpha: 1,
            Sat: this.rgbToHSB(this.props.data.r, this.props.data.g, this.props.data.b).Sat,
            Hue: this.rgbToHSB(this.props.data.r, this.props.data.g, this.props.data.b).Hue,
            Bright: this.rgbToHSB(this.props.data.r, this.props.data.g, this.props.data.b).Bright,
            Hex: this.rgbToHex(this.props.data.r, this.props.data.g, this.props.data.b)
        }
    }

    rgbToHex = (r: number, g: number, b: number) => {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16)
            return hex.length === 1 ? '0' + hex : hex
        }).join('')
    }

    getCursorPosition = (e: any) => {
        const canvas: any = this.myCan2.current;
        const { top, left } = canvas.getBoundingClientRect();
        return {
            "left": e.clientX - left - scrollX,
            "top": e.clientY - top - scrollY
        }
    }

    hexToRgb = (hex: string) => {
        let r = 255;
        let b = 255;
        let g = 255;
        if (hex.length == 4 || hex.length == 7) {
            if (hex.length == 4) {
                let r1 = hex[1];
                let g1 = hex[2];
                let b1 = hex[3];
                hex = '#' + r1 + r1 + g1 + g1 + b1 + b1
            }
            hex = hex.substring(1);
            let bigint = parseInt(hex, 16);
            r = (bigint >> 16) & 255;
            g = (bigint >> 8) & 255;
            b = bigint & 255;
        }
        return { Red: r, Green: g, Blue: b };
    }

    rgbToHSB(r: number, g: number, b: number) {
        let r1 = r / 255;
        let g1 = g / 255;
        let b1 = b / 255;

        let maxColor = Math.max(r1, g1, b1);
        let minColor = Math.min(r1, g1, b1);
        let B = (maxColor + minColor) / 2;
        let S = 0;
        let H = 0;
        if (maxColor != minColor) {
            if (B < 0.5) {
                S = (maxColor - minColor) / (maxColor + minColor);
            } else {
                S = (maxColor - minColor) / (2.0 - maxColor - minColor);
            }
            if (r1 == maxColor) {
                H = (g1 - b1) / (maxColor - minColor);
            } else if (g1 == maxColor) {
                H = 2.0 + (b1 - r1) / (maxColor - minColor);
            } else {
                H = 4.0 + (r1 - g1) / (maxColor - minColor);
            }
        }

        B = B * 100;
        B = Math.round(B * 10) / 10
        S = S * 100;
        S = Math.round(S * 10) / 10
        H = H * 60;
        if (H < 0) {
            H += 360;
        }
        return {
            Hue: Math.round(H),
            Sat: S,
            Bright: B
        };
    }
    hslToRgb(Hue: number, Sat: number, Bright: number) {
        let r, g, b;
        let h = Hue * (1 / 360);
        let s = Sat * (1 / 100);
        let l = Bright * (1 / 100);
        if (s == 0) {
            r = g = b = l;
        } else {
            let hue2rgb = function hue2rgb(p: number, q: number, t: number) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return { Red: Math.round(r * 255), Green: Math.round(g * 255), Blue: Math.round(b * 255) };
    }

    handleClick = () => {
        console.log("Clicked")
        this.setState(prev => {
            return {
                toggle: true,
            }
        })
    }

    handleDivClick = (event: any) => {
        const id = event.target.id
        if (id == 'second') {
            this.setState({
                currentColor: this.getProp()
            })
        }
        let isHexCorrect = /^#[0-9A-F]{3}([0-9A-F]{3})?$/i.test(this.getProp().Hex);
        if (isHexCorrect) {
            let c: any = this.myCan.current;
            let ctx: any = c.getContext("2d");
            let grad = ctx.createLinearGradient(10, 10, 195, 0);
            grad.addColorStop(0, "black");
            grad.addColorStop(0.5, this.getProp().Hex);
            grad.addColorStop(1, "white");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 200, 150);
        }
    }
    handleChange = (event: any) => {
        const { id, value } = event.currentTarget;
        const key: string = id;
        let temp: any = this.state.currentColor;
        event.currentTarget.value = value;
        temp[key] = +value;
        if (key == "Hex") {
            temp[key] = value;
            temp.Red = this.hexToRgb(value).Red;
            temp.Blue = this.hexToRgb(value).Blue;
            temp.Green = this.hexToRgb(value).Green;
            temp.Hue = this.rgbToHSB(temp.Red, temp.Green, temp.Blue).Hue;
            temp.Sat = this.rgbToHSB(temp.Red, temp.Green, temp.Blue).Sat;
            temp.Bright = this.rgbToHSB(temp.Red, temp.Green, temp.Blue).Bright;
        }
        else {
            if (key == "Red" || key == "Green" || key == "Blue") {
                temp.Hue = this.rgbToHSB(temp.Red, temp.Green, temp.Blue).Hue;
                temp.Sat = this.rgbToHSB(temp.Red, temp.Green, temp.Blue).Sat;
                temp.Bright = this.rgbToHSB(temp.Red, temp.Green, temp.Blue).Bright;
            }
            else if (key == "Hue" || key == "Sat" || key == "Bright") {
                temp.Red = this.hslToRgb(temp.Hue, temp.Sat, temp.Bright).Red;
                temp.Green = this.hslToRgb(temp.Hue, temp.Sat, temp.Bright).Green;
                temp.Blue = this.hslToRgb(temp.Hue, temp.Sat, temp.Bright).Blue;
            }
            temp.Hex = this.rgbToHex(temp.Red, temp.Green, temp.Blue);
        }
        this.setState({
            currentColor: temp
        })
        let isHexCorrect = /^#[0-9A-F]{3}([0-9A-F]{3})?$/i.test(temp.Hex);
        if (isHexCorrect) {
            let c: any = this.myCan.current;
            let ctx: any = c.getContext("2d");
            let grad = ctx.createLinearGradient(10, 10, 195, 0);
            grad.addColorStop(0, "black");
            grad.addColorStop(0.5, temp.Hex);
            grad.addColorStop(1, "white");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 200, 150);
        }
    }
    handleCanvasClick = (e: any) => {
        let c: any = this.myCan2.current;
        let ctx: any = c.getContext("2d");
        let cb: any = this.myCan.current;
        let ctxb: any = cb.getContext("2d");
        let pos = this.getCursorPosition(e);
        let p = ctxb.getImageData(pos.left, pos.top, 1, 1).data;
        console.log(p)
        let temp = this.state.currentColor;
        temp.Red = p[0];
        temp.Green = p[1];
        temp.Blue = p[2];
        temp.Hex = this.rgbToHex(temp.Red, temp.Green, temp.Blue);
        temp.Hue = this.rgbToHSB(temp.Red, temp.Green, temp.Blue).Hue;
        temp.Sat = this.rgbToHSB(temp.Red, temp.Green, temp.Blue).Sat;
        temp.Bright = this.rgbToHSB(temp.Red, temp.Green, temp.Blue).Bright;
        this.setState({
            currentColor: temp
        })
        this.drawCanvasPointer(ctx, pos);
    }

    drawCanvasPointer = (ctx: any, pos: any) => {
        ctx.clearRect(0, 0, 1800, 1000);
        ctx.beginPath();
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 2;
        ctx.arc(pos.left, pos.top, 3, 0, 2 * Math.PI);
        ctx.stroke();
    }

    getRGB = (data: ColorData): string => {
        return 'rgba(' + data.Red + ',' + data.Green + ',' + data.Blue + ',' + data.Alpha + ')'
    }
    handleAccept = () => {
        const data = { ...this.state.currentColor };
        this.props.data.r = data.Red;
        this.props.data.g = data.Green;
        this.props.data.b = data.Blue;
        this.props.data.a = data.Alpha;
        let pom = false;
        let arr = this.state.prevColorsArr
        if (arr.length > 10) arr.shift();
        this.props.prevColors.forEach((color: ColorData) => {
            if (color.Red == data.Red && color.Green == data.Green && color.Blue == data.Blue) {
                pom = true;
            }
        })
        if (!pom)
            arr.push(data);
        this.setState({
            toggle: false,
            prevColorsArr: arr
        })

    }
    handleCancel = () => {
        this.setState({
            currentColor: this.getProp(),
            toggle: false
        })
    }
    handleSlider = (event: any) => {
        let data = this.state.currentColor;
        data.Hue = event.target.value;
        data.Sat = 100;
        data.Bright = 50;
        data.Red = this.hslToRgb(data.Hue, data.Sat, data.Bright).Red;
        data.Green = this.hslToRgb(data.Hue, data.Sat, data.Bright).Green;
        data.Blue = this.hslToRgb(data.Hue, data.Sat, data.Bright).Blue;
        data.Hex = this.rgbToHex(data.Red, data.Green, data.Blue);
        this.setState({
            currentColor: data
        })
        let c: any = this.myCan.current;
        let ctx: any = c.getContext("2d");
        let grad = ctx.createLinearGradient(10, 10, 195, 0);
        grad.addColorStop(0, "black");
        grad.addColorStop(0.5, data.Hex);
        grad.addColorStop(1, "white");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 200, 150);
    }
    handlePrevColor = (color: ColorData) => {
        const data = { ...color };
        this.setState({
            currentColor: data
        })
        let isHexCorrect = /^#[0-9A-F]{3}([0-9A-F]{3})?$/i.test(data.Hex);
        if (isHexCorrect) {
            let c: any = this.myCan.current;
            let ctx: any = c.getContext("2d");
            let grad = ctx.createLinearGradient(10, 10, 195, 0);
            grad.addColorStop(0, "black");
            grad.addColorStop(0.5, data.Hex);
            grad.addColorStop(1, "white");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 200, 150);
        }
    }
    render = () => {
        const display = (this.state.toggle) ? this.props.data.display : 'none';
        const btn = <td><button className='PrevColorButton'></button></td>
        let btns: any = [];
        for (let i = 0; i < 10; i++) {
            btns.push(btn);
        }
        this.state.prevColorsArr.forEach(color => {
            btns.shift();
            btns.push(
                <td><button onClick={() => this.handlePrevColor(color)} style={{ backgroundColor: color.Hex }} className='PrevColorButton'></button></td>
            )
        })
        return (
            <div className='wrap'>
                <div>

                    <button className={'colorButton'} style={{ backgroundColor: this.getRGB(this.getProp()) }} onClick={this.handleClick}>{this.getRGB(this.getProp())}</button>
                    <div ref={this.myRef} id='box' className='popup' style={{ display: display }}>


                        <div className='colorLabelBackground'></div>
                        <div id='first' className='colorLabel' style={{
                            backgroundColor: this.getRGB(this.state.currentColor)
                        }}>
                            <label className='colorLabel' style={{
                                backgroundColor: this.getRGB(this.state.currentColor)
                            }}>{this.getRGB(this.state.currentColor)}</label>
                        </div>
                        <div className='colorLabelBackground'></div>
                        <div id='second' className='colorLabel' >
                            <label id='second' onClick={this.handleDivClick} className='colorLabel' style={{
                                backgroundColor: this.getRGB(this.getProp())
                            }}>
                                {this.getRGB(this.getProp())}</label>
                        </div>
                        <canvas ref={this.myCan2} id={'myCanvas2' + this.props.data.id} onMouseDown={this.handleCanvasClick} style={{ position: 'absolute', zIndex: 2000 }}></canvas>
                        <canvas ref={this.myCan} id={'myCanvas' + this.props.data.id} onMouseDown={this.handleCanvasClick}></canvas>

                        <div style={{ float: "right" }}>
                            <table className='tableData'>
                                <tbody>
                                    <InputBox onChange={this.handleChange} name={'Red'}
                                        value={this.state.currentColor.Red} min={0} max={255} />
                                    <InputBox onChange={this.handleChange} name={'Green'}
                                        value={this.state.currentColor.Green} min={0} max={255} />
                                    <InputBox onChange={this.handleChange} name={'Blue'}
                                        value={this.state.currentColor.Blue} min={0} max={255} />
                                    <InputBox onChange={this.handleChange} name={'Hue'}
                                        value={this.state.currentColor.Hue} min={0} max={360} />
                                    <InputBox onChange={this.handleChange} name={'Sat'}
                                        value={this.state.currentColor.Sat} min={0} max={100} step={0.1} />
                                    <InputBox onChange={this.handleChange} name={'Bright'}
                                        value={this.state.currentColor.Bright} min={0} max={100} step={0.1} />
                                </tbody>
                            </table>
                        </div>
                        <div id="HexDiv">
                            <label>Hex:</label>
                            <input id="Hex" onChange={this.handleChange} type="text"
                                placeholder={this.state.currentColor.Hex} value={this.state.currentColor.Hex}></input>
                            <label>Alpha:</label>
                            <input id="Alpha" onChange={this.handleChange} type="number"
                                placeholder={this.state.currentColor.Alpha + ""} value={this.state.currentColor.Alpha}
                                min={0} max={1} step={0.1}></input>
                        </div>
                        <input onChange={this.handleSlider} type="range" min="0" max="360"></input>
                        <table className='PrevColorTable'>
                            <tbody>
                                <tr>
                                    {btns.reverse()}
                                </tr>
                            </tbody>
                        </table>
                        <table className="buttonTable">
                            <tbody>
                                <tr>
                                    <td><button onClick={this.handleAccept} className='BotButton'>Accept</button></td>
                                    <td><button onClick={this.handleCancel} className='BotButton'>Cancel</button></td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>
            </div >
        )
    }


}
function InputBox(props: any) {
    return (
        <tr><td>
            <label>{props.name}</label>
        </td>
            <td>
                <input onChange={props.onChange} id={props.name}
                    type="number" placeholder={props.value} value={props.value}
                    min={props.min} max={props.max} step={props.step}></input>
            </td></tr>
    )
}

export default ColorBox;