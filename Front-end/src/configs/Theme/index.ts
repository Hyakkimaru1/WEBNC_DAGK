import { THEME } from "@/types/Theme";

export const lightTheme:THEME = {
  body: "#E2E2E2",
  text: "#363537",
  toggleBorder: "#FFF",
  backgroundColor: "#F9F9F9",
  formBackGround: '#FFF',
  color:'#222',
  gradient: "linear-gradient(#39598A, #79D7ED)",
  BackgrounImg: "linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)",
  backgroundBlendMode: ""
};

export const darkTheme:THEME = {
  body: "#363537",
  text: "#FAFAFA",
  toggleBorder: "#6B8096",
  backgroundColor: "#242526",
  formBackGround: '#181818',
  color:'#F1FFFF',
  gradient: "linear-gradient(#091236, #1E215D)",
  BackgrounImg:"linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.15) 100%), radial-gradient(at top center, rgba(255,255,255,0.40) 0%, rgba(0,0,0,0.40) 120%) #989898",
  backgroundBlendMode: "multiply,multiply"
};