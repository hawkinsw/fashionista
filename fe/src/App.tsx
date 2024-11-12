import { ChangeEvent, useEffect, useRef, useState } from 'react';
import './App.css';
import { ColorResult, SketchPicker } from 'react-color';

function App() {

  const topObj = useRef<HTMLDivElement>(null)
  const middleObj = useRef<HTMLDivElement>(null)
  const bottomObj = useRef<HTMLDivElement>(null)
  const pickerObj = useRef<HTMLDivElement>(null)
  const sketchPickerObj = useRef<SketchPicker>(null)
  const apiConfig = useRef<HTMLInputElement>(null)

  const fashionistaDefaultApiUrl = "https://be-autumn-fire-7404.fly.dev/"

  const [chosenColor, setChosenColor] = useState<string>("#4A90E2")
  const [editableChosenApi, setEditableChosenApi] = useState<string>(fashionistaDefaultApiUrl)
  const [chosenApi, setChosenApi] = useState<string>(fashionistaDefaultApiUrl)
  const [settleTimer, setSettleTimer] = useState<number>(-1)

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

  useEffect(() => {
    console.log("The API was actually updated!")
    setSettleTimer(-1)
  }, [chosenApi])

  useEffect(() => {
    if (settleTimer != -1) {
      console.log("Clearing existing settle timer.")
      window.clearTimeout(settleTimer)
      setSettleTimer(-1)
    }
    setSettleTimer(window.setTimeout((maybeGoodApiUrl: string) => {
      try {
        const url = new URL(maybeGoodApiUrl)
        setChosenApi(maybeGoodApiUrl)
      } catch (error) {
        alert(`Could not update the Fashionista URL: ${error}`)
      }
    }, 5000, editableChosenApi))

    console.log(`Setting the settle timer: ${settleTimer}`)
  }, [editableChosenApi])

  let userChoseColor = async (color: ColorResult, event: ChangeEvent) => {
    let body = JSON.stringify(color.hsl)
    let url = new URL(chosenApi)
    console.log(`body: ${body}`)

    await fetch(url, {
      method: "POST", headers: {
        "Content-Type": "application/json",
      }, body: `${body}`
    }).then((response: Response) => {

      let body = response.json().then((response: any) => {
        topObj!.current!.style.background = response.complimentary
        middleObj!.current!.style.background = response.analogousUpper
        bottomObj!.current!.style.background = response.analogousLower
        pickerObj!.current!.style.background = color.hex
      }, (failure: any) => {
        console.log(`failure: ${failure}`)
        topObj!.current!.style.background = 'red'
        middleObj!.current!.style.background = 'green'
        bottomObj!.current!.style.background = 'blue'
        pickerObj!.current!.style.background = color.hex
      })
    }, (failure: any) => {
      console.log(`failure: ${failure}`)
      topObj!.current!.style.background = 'red'
      middleObj!.current!.style.background = 'green'
      bottomObj!.current!.style.background = 'blue'
      pickerObj!.current!.style.background = color.hex
    })
  }

  return (
    <div className="App">
      <div className="Horizontal">
        <div className='FashionistaConfig'>
          <div ref={apiConfig} className="APIConfig">
            API Url: <input value={editableChosenApi} onChange={e => setEditableChosenApi(e.target.value)}></input>
          </div>
          <div ref={pickerObj} className="ColorPicker">
            <SketchPicker ref={sketchPickerObj} color={chosenColor} onChangeComplete={userChoseColor} />
          </div>
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
