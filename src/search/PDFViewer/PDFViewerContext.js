import { createContext } from "react";
const PDFViewerContext = createContext(
  {
      state: {},
      setState: () => {},
      files: [],
      currentFile: {},
      infoMessage: "",
      errorMessage: "",
      warningMessage: ""
  }
  )

export default PDFViewerContext;