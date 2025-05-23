import { type DependencyList, useState, useCallback, useRef } from "react"
import { nextTick } from "@tarojs/taro"
import { getRect } from "../utils/dom/rect"
import { useRenderedEffect, useMounted, useWindowResize } from "./index"

export default function useHeight(elementOrRef: any, deps?: DependencyList) {
  const [height, _setHeight] = useState<number>(0)
  const heightRef = useRef(0)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const setHeight = useCallback(() => {
    getRect(elementOrRef)
      .then((rect) => rect?.height)
      .then((val) => {
        if (val !== heightRef.current) {
          heightRef.current = val
          _setHeight(val)
        }
      })
  }, [])

  useRenderedEffect(() => {
    setHeight()
  }, deps)

  useMounted(() => {
    nextTick(setHeight)
  })

  useWindowResize(setHeight)

  return height
}
