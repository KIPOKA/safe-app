import {create } from "twrnc"
import resolveConfig from "tailwindcss/resolveConfig"
import tailwindConfig from "./tailwind.config.js"
const tw = create(resolveConfig(tailwindConfig))
export default tw;