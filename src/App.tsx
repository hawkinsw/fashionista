import { ChangeEvent, useEffect, useRef, useState } from 'react';
import './App.css';
import { ColorResult, SketchPicker } from 'react-color';

function App() {
  const topObj = useRef<HTMLDivElement>(null)
  const middleObj = useRef<HTMLDivElement>(null)
  const bottomObj = useRef<HTMLDivElement>(null)
  const pickerObj = useRef<HTMLDivElement>(null)
  const sketchPickerObj = useRef<SketchPicker>(null)

  const [chosenColor, setChosenColor] = useState<string>("#4A90E2")

  useEffect(() => {
    let s = sketchPickerObj!.current!.state as any
    console.log(s.hsl)
    let beginningColor: ColorResult = {
      hex: s.hex,
      hsl: s.hsl,
      rgb: s.rgb,
    }

    userChoseColor(beginningColor, Object())
  }, [])

  let calculateNewAngle = (angle: number, delta: number): number => {
    angle += delta;
    angle %= 360;
    if (angle < 0) {
      angle += 360;
    }
    return angle;
  }

  let calculateCompliment = (angle: number): number => {
    console.log(`angle: ${angle}`)
    angle = calculateNewAngle(angle, 180)
    console.log(`angle: ${angle}`)
    return angle
  }

  let calculateAnalogousUpper = (angle: number): number => {
    console.log(`angle: ${angle}`)
    angle = calculateNewAngle(angle, 30)
    console.log(`angle: ${angle}`)
    return angle
  }

  let calculateAnalogousLower = (angle: number): number => {
    console.log(`angle: ${angle}`)
    angle = calculateNewAngle(angle, -30)
    console.log(`angle: ${angle}`)
    return angle
  }

  let userChoseColor = (color: ColorResult, event: ChangeEvent) => {
    // Good debugging tool: https://www.sessions.edu/color-calculator/

    /*
    console.log("hsl: " + color.hsl.h)
    console.log("hsl: " + color.hsl.s)
    console.log("hsl: " + color.hsl.l)
    */

    let complimentaryColor = structuredClone(color.hsl)
    complimentaryColor.h = calculateCompliment(complimentaryColor.h)
    let complimentaryColorS = `hsl(${complimentaryColor.h} ${complimentaryColor.s * 100}% ${complimentaryColor.l * 100}%)`
    /*
    console.log(complimentaryColorS)
    */

    let analogousColorUpper = structuredClone(color.hsl)
    analogousColorUpper.h = calculateAnalogousUpper(analogousColorUpper.h)
    let analogousColorUpperS = `hsl(${analogousColorUpper.h} ${analogousColorUpper.s * 100}% ${analogousColorUpper.l * 100}%)`
    /*
    console.log(analogousColorUpperS)
    */

    let analogousColorLower = structuredClone(color.hsl)
    analogousColorLower.h = calculateAnalogousLower(analogousColorLower.h)
    let analogousColorLowerS = `hsl(${analogousColorLower.h} ${analogousColorLower.s * 100}% ${analogousColorLower.l * 100}%)`
    /*
    console.log(analogousColorLowerS)
    */

    topObj!.current!.style.background = complimentaryColorS
    middleObj!.current!.style.background = analogousColorUpperS
    bottomObj!.current!.style.background = analogousColorLowerS
    pickerObj!.current!.style.background = color.hex

    setChosenColor(color.hex)
  }

  return (
    <div className="App">
      <div className="Horizontal">
        <div ref={pickerObj} className="ColorPicker">
          <SketchPicker ref={sketchPickerObj} color={chosenColor} onChangeComplete={userChoseColor}/>
        </div>
        <section className="ColorDisplayer">
          <div ref={topObj} className='Top'>
            Top
          </div>
          <div ref={middleObj} className='Middle'>
            Middle
          </div>
          <div ref={bottomObj} className='Bottom'>
            Bottom
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
