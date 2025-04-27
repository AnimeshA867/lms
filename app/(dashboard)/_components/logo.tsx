import Image from "next/image";

const Logo = () => {
  return <Image src={"/logo.svg"} height={100} width={100} alt="Logo" />;
};

export default Logo;
// This component is used in the sidebar of the dashboard. It displays the logo of the application.
// The logo is an SVG image that is imported and displayed using the Image component from Next.js.
