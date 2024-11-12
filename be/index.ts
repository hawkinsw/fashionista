// src/index.ts
import express, { Express, Request, Response } from "express";

import cors from "cors"

const app: Express = express();
const port = process.env.PORT || 5000;

let calculateNewAngle = (angle: number, delta: number): number => {
  angle += delta;
  angle %= 360;
  if (angle < 0) {
    angle += 360;
  }
  return angle;
}


let calculateCompliment = (angle: number): number => {
  angle = calculateNewAngle(angle, 180)
  return angle
}

let calculateAnalogousUpper = (angle: number): number => {
  angle = calculateNewAngle(angle, 30)
  return angle
}

let calculateAnalogousLower = (angle: number): number => {
  angle = calculateNewAngle(angle, -30)
  return angle
}

class Color {
  h: number
  s: number
  l: number
  constructor() {
    this.h = 0
    this.s = 0
    this.l = 0
  }
  public static Factory(json: any) : Color | null {
    let color = new Color()
    try {
      color.h = json.h
      color.s = json.s
      color.l = json.l
    } catch (error) {
      /* Don't do anything */
      console.log(`${error}`)
      return null
    }
    return color
  }
}

class Fashionista {
  complimentary: string = ""
  analogousLower: string = ""
  analogousUpper: string = ""
}

let handle = (rawColor: any): string | null => {

  // Good debugging tool: https://www.sessions.edu/color-calculator/

  const color = Color.Factory(rawColor)
  if (color == null) {
    console.log("Error deserializing color provided by the API invoker.")
    return null 
  }

  let complimentaryColor = new Color()
  complimentaryColor.h = calculateCompliment(color.h)
  let complimentaryColorS = `hsl(${complimentaryColor.h} ${color.s * 100}% ${color.l * 100}%)`

  let analogousColorUpper = new Color()
  analogousColorUpper.h = calculateAnalogousUpper(color.h)
  let analogousColorUpperS = `hsl(${analogousColorUpper.h} ${color.s * 100}% ${color.l * 100}%)`

  let analogousColorLower = new Color()
  analogousColorLower.h = calculateAnalogousLower(color.h)
  let analogousColorLowerS = `hsl(${analogousColorLower.h} ${color.s * 100}% ${color.l * 100}%)`

  let result = new Fashionista()

  result.analogousLower = analogousColorLowerS;
  result.analogousUpper = analogousColorUpperS;
  result.complimentary = complimentaryColorS;

  return JSON.stringify(result)
}

app.use(cors())
app.options('*', cors())
app.use(express.json())

app.post("/", (req: Request, res: Response) => {
  const response = handle(req.body)
  if (response == null) {
    res.sendStatus(500)
  }
  res.send(response)
});

app.listen({ port: port, host: '0.0.0.0' }, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
