import React from 'react';
//import PopupColorBox from './PopupColorBox'

interface MyState {
    currentColor: ColorData,
    toggle: boolean
}

interface MyProps {

}

interface ColorData {
    Red: number;
    Green: number;
    Blue: number;
    Sat: number;
    Hue: number;
    Alpha: number;
    Hex: string;
    [key: string]: string|any;
}

class ColorBox extends React.Component<MyProps, MyState>{
    constructor(props: MyProps) {
        super(props);
        this.state = {
            toggle: false,
            currentColor: {
                Red: 255,
                Green: 0,
                Blue: 0,
                Alpha: 1,
                Sat: 0,
                Hue: 0,
                Hex: '#000'
            }
        }
    }
    handleClick = (event: any) => {
        console.log("Clicked")
        this.setState(prev => {
            return {
                toggle: !prev.toggle
            }
        })
    }
    handleChange = (event:any) => {
        const {id, value} = event.currentTarget;
        const key: string = id;
        let temp: any= this.state.currentColor;      
        temp[key] = value;
        console.log(temp)
        this.setState({
            currentColor: temp
        })

    }

    render = () => {
        const display = (this.state.toggle) ? 'block' : 'none';
        return (
            <div className='wrap'>
                <div>

                    <button className={'colorButton'} onClick={this.handleClick}>Click!</button>
                    <div id='box' className='popup' style={{ display: display }}>
                        <div className='colorPickerBox'></div>
                        <div className='colorLabel' style={{
                            backgroundColor: 'rgb('+this.state.currentColor.Red+','+this.state.currentColor.Green+','+this.state.currentColor.Blue+')'
                        }}>
                            <label className='colorLabel' style={{
                            backgroundColor: 'rgb('+this.state.currentColor.Red+','+this.state.currentColor.Green+','+this.state.currentColor.Blue+')'
                        }}>{this.state.currentColor.Red}</label>
                        </div>
                        <div className='colorLabel'>
                            <label className='colorLabel'>Second</label>
                        </div>
                        <input name="Color Picker" type="color"/>
                        <div style={{ float: "right" }}>
                            <table>
                                <tbody>
                                <InputBox onChange={this.handleChange} name={'Red'} value={this.state.currentColor.Red}/>
                                <InputBox onChange={this.handleChange} name={'Green'} value={this.state.currentColor.Green}/>
                                <InputBox onChange={this.handleChange} name={'Blue'} value={this.state.currentColor.Blue}/>
                                <InputBox name={'Red'} value={this.state.currentColor.Red}/>
                                <InputBox name={'Red'} value={this.state.currentColor.Red}/>
                               <InputBox name={'Red'} value={this.state.currentColor.Red}/>
                               </tbody>
                            </table>
                        </div>
                        <label>Hex:</label>

                        <input id="Hex" type="text" placeholder={this.state.currentColor.Hex}></input>
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
                <input onChange={props.onChange} id={props.name} type="number" placeholder={props.value}></input>
            </td></tr>
    )
}

export default ColorBox;