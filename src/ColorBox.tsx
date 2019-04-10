import React from 'react';

interface MyState {
    currentColor: ColorData,
    toggle: boolean
}

interface MyProps {
    data: {
        r: number,
        g: number,
        b: number,
        id: number
    }
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

class ColorBox extends React.Component<MyProps, MyState>{
    myCan: string | ((instance: HTMLCanvasElement | null) => void) | null | undefined;
    constructor(props: MyProps) {
        super(props);
        this.state = {
            toggle: false,
            currentColor: {
                Red: props.data.r,
                Green: props.data.g,
                Blue: props.data.b,
                Alpha: 1,
                Sat: 0,
                Hue: 0,
                Bright: 0,
                Hex: this.rgbToHex(props.data.r, props.data.g, props.data.b)
            }
        }
    }
    componentDidMount() {
        var c: any = document.getElementById("myCanvas" + this.props.data.id);
       var c2: any = document.getElementById("myCanvas2" + this.props.data.id);
        c.width = 200;
        c.height = 100;
        
        c2.width = 200;
        c2.height = 100;
        
        var ctx: any = c.getContext("2d");
        var grad = ctx.createLinearGradient(10, 10, 195, 0);
        grad.addColorStop(0, "black");
        grad.addColorStop(0.5, this.getRGB(this.getProp()));
        grad.addColorStop(1, "white");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 200, 150);
    }
    getProp = (): ColorData => {
        return {
            Red: this.props.data.r,
            Green: this.props.data.g,
            Blue: this.props.data.b,
            Alpha: 1,
            Sat: 0,
            Hue: 0,
            Bright: 0,
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
        const canvas: any = document.getElementById('myCanvas2' + this.props.data.id)
        const { top, left } = canvas.getBoundingClientRect();
        return {
            "left": e.clientX - left - scrollX,
            "top": e.clientY - top - scrollY
        }
    }
    hexToRgb = (hex: string) => {
        var bigint = parseInt(hex, 16);
        var r = (bigint >> 16) & 255;
        var g = (bigint >> 8) & 255;
        var b = bigint & 255;

        return r + "," + g + "," + b;
    }
    handleClick = (event: any) => {
        console.log("Clicked")
        this.setState(prev => {
            return {
                toggle: !prev.toggle
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
    }
    handleChange = (event: any) => {
        const { id, value } = event.currentTarget;
        const key: string = id;
        let temp: any = this.state.currentColor;
        event.currentTarget.value = value;
        temp[key] = +value;
        temp.Hex = this.rgbToHex(temp.Red, temp.Green, temp.Blue);
        this.setState({
            currentColor: temp
        })
    }
    handleCanvasClick = (e: any) => {
        var c: any = document.getElementById("myCanvas2" + this.props.data.id);
        var ctx: any = c.getContext("2d");
        var cb: any = document.getElementById("myCanvas" + this.props.data.id);
        var ctxb: any = cb.getContext("2d");
        var pos = this.getCursorPosition(e);
        var p = ctxb.getImageData(pos.left, pos.top, 1, 1).data;
        console.log(p)
        let temp = this.state.currentColor;
        temp.Red = p[0];
        temp.Green = p[1];
        temp.Blue = p[2];
        temp.Hex = this.rgbToHex(temp.Red, temp.Green, temp.Blue);
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
        return 'rgb(' + data.Red + ',' + data.Green + ',' + data.Blue + ')'
    }
    render = () => {
        const display = (this.state.toggle) ? 'block' : 'none';
        return (
            <div className='wrap'>
                <div>

                    <button className={'colorButton'} onClick={this.handleClick}>Click!</button>
                    <div id='box' className='popup' style={{ display: display }}>

                        <div className='colorPickerBox'></div>
                        <div id='first' className='colorLabel' style={{
                            backgroundColor: this.getRGB(this.state.currentColor)
                        }}>
                            <label className='colorLabel' style={{
                                backgroundColor: this.getRGB(this.state.currentColor)
                            }}>{this.getRGB(this.state.currentColor)}</label>
                        </div>
                        <div id='second' className='colorLabel' >
                            <label id='second' onClick={this.handleDivClick} className='colorLabel' style={{
                                backgroundColor: this.getRGB(this.getProp())
                            }}>
                                {this.getRGB(this.getProp())}</label>
                        </div>
                        <canvas id={'myCanvas2' + this.props.data.id} onMouseDown={this.handleCanvasClick} style = {{position: 'absolute', zIndex: 2000}}></canvas>
                        <canvas id={'myCanvas' + this.props.data.id} onMouseDown={this.handleCanvasClick}></canvas>
                        
                        <div style={{ float: "right" }}>
                            <table>
                                <tbody>
                                    <InputBox onChange={this.handleChange} name={'Red'} value={this.state.currentColor.Red} />
                                    <InputBox onChange={this.handleChange} name={'Green'} value={this.state.currentColor.Green} />
                                    <InputBox onChange={this.handleChange} name={'Blue'} value={this.state.currentColor.Blue} />
                                    <InputBox name={'Red'} value={this.state.currentColor.Red} />
                                    <InputBox name={'Red'} value={this.state.currentColor.Red} />
                                    <InputBox name={'Red'} value={this.state.currentColor.Red} />
                                </tbody>
                            </table>
                        </div>
                        <div id="HexDiv">
                        <label>Hex:</label>

                        <input id="Hex" type="text" placeholder={this.state.currentColor.Hex} value={this.state.currentColor.Hex}></input>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


}
function InputBox(props: any) {
    return (
        <tr><td>
            <label>{props.name}</label>
        </td>
            <td>
                <input onChange={props.onChange} id={props.name} type="number" placeholder={props.value} value={props.value}></input>
            </td></tr>
    )
}

export default ColorBox;